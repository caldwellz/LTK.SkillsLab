const {
  DynamoDBClient,
  DescribeTableCommand,
  CreateTableCommand,
  PutItemCommand,
  ScanCommand,
  QueryCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const isLocal = true;
const localDynamoPort = 6001;
const TableName = 'LoanBorrowers';
const db = new DynamoDBClient({
  endpoint: isLocal ? `http://localhost:${localDynamoPort}` : '...',
  region: isLocal ? 'local-env' : '...',
  maxAttempts: isLocal ? 1 : 3,
});

async function checkDb() {
  try {
    // Attempt to describe the table to see if it exists
    await db.send(
      new DescribeTableCommand({
        TableName,
      })
    );
    console.log('Describe succeeded; table exists');
  } catch (err) {
    // An error means it probably doesn't exist; try creating it
    console.log('Describe failed; creating table');
    await db.send(
      new CreateTableCommand({
        AttributeDefinitions: [
          {
            AttributeName: 'loanId',
            AttributeType: 'N',
          },
          {
            AttributeName: 'pairId',
            AttributeType: 'N',
          },
        ],
        KeySchema: [
          {
            AttributeName: 'loanId',
            KeyType: 'HASH',
          },
          {
            AttributeName: 'pairId',
            KeyType: 'RANGE',
          },
        ],
        BillingMode: 'PAY_PER_REQUEST',
        TableName,
      })
    );
  }
}
checkDb();

function convertLoanToItems(loan) {
  const items = [];
  const { loanId, borrowers = [] } = loan || {};
  for (const borrower of borrowers) {
    items.push({
      Item: marshall({
        loanId,
        ...borrower,
      }),
      TableName,
    });
  }
  return items;
}

function convertItemsToLoans(items) {
  const loans = {};
  for (const item of items) {
    const { loanId, pairId, firstName, lastName, phone } = unmarshall(item);
    loans[loanId] = loans[loanId] || [];
    loans[loanId].push({ pairId, firstName, lastName, phone });
  }
  return Object.keys(loans).map((loanId) => ({
    loanId,
    borrowers: loans[loanId],
  }));
}

async function getAllLoans() {
  const res = await db.send(new ScanCommand({ TableName }));
  return convertItemsToLoans(res.Items);
}

async function getLoan(loanId) {
  const res = await db.send(
    new QueryCommand({
      ExpressionAttributeValues: marshall({ ':loanId': loanId }),
      KeyConditionExpression: 'loanId = :loanId',
      TableName,
    })
  );
  const [loan] = convertItemsToLoans(res.Items);
  return loan;
}

async function putLoan(loan) {
  const items = convertLoanToItems(loan);
  await Promise.all(items.map((item) => db.send(new PutItemCommand(item))));
}

async function updateLoanBorrower(loanId, pairId, updates) {
  const attributeValues = {};
  const attributeNames = {};
  const updateExpressions = [];
  for (const field of Object.keys(updates)) {
    attributeValues[':' + field] = updates[field];
    attributeNames['#' + field] = field;
    updateExpressions.push(`#${field} = :${field}`);
  }
  const UpdateExpression = 'SET ' + updateExpressions.join(', ');
  await db.send(
    new UpdateItemCommand({
      Key: marshall({ loanId, pairId }),
      ExpressionAttributeNames: attributeNames,
      ExpressionAttributeValues: marshall(attributeValues),
      UpdateExpression,
      TableName,
    })
  );
  return await getLoan(loanId);
}

async function removeLoanBorrower(loanId, pairId) {
  await db.send(
    new DeleteItemCommand({
      Key: marshall({ loanId, pairId }),
      TableName,
    })
  );
  return await getLoan(loanId);
}

async function removeLoan(loanId) {
  const loan = await getLoan(loanId);
  if (!loan) return false;

  const pairs = [];
  for (const borrower of loan.borrowers) {
    pairs.push([loanId, borrower.pairId]);
  }

  const successes = await Promise.allSettled(pairs.map((pair) => removeLoanBorrower(...pair)));
  if (successes.find((result) => result.status === 'rejected')) {
    return false;
  }
  return true;
}

module.exports = {
  getAllLoans,
  getLoan,
  putLoan,
  updateLoanBorrower,
  removeLoanBorrower,
  removeLoan,
};
