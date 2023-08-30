const express = require('express');
const { useAsyncHandler, sendStatus } = require('../../lib');
const {
  getAllLoans,
  putLoan,
  getLoan,
  updateLoanBorrower,
  removeLoanBorrower,
  removeLoan,
} = require('../../models/loan-borrowers');
const router = express.Router();

const borrowerStringProps = ['firstName', 'lastName', 'phone'];
function sanitizeBorrower(rawBorrower) {
  const borrower = { pairId: Number(rawBorrower?.pairId) };
  if (typeof rawBorrower !== 'object' || isNaN(borrower.pairId)) {
    console.error('Borrower failed pairId or borrower object check');
    return null;
  }
  for (const prop of borrowerStringProps) {
    const rawProp = rawBorrower[prop];
    if (typeof rawProp === 'undefined') continue;
    if (typeof rawProp !== 'string') {
      console.error('Borrower failed field type check ', typeof rawProp);
      return null;
    }
    borrower[prop] = rawProp;
  }
  return borrower;
}

function sanitizeLoan(rawInput) {
  const loan = { loanId: Number(rawInput?.loanId), borrowers: [] };
  if (isNaN(loan.loanId) || !Array.isArray(rawInput?.borrowers)) {
    console.error('Loan input failed loanId or borrower array check');
    return null;
  }
  for (const rawBorrower of rawInput.borrowers) {
    loan.borrowers.push(sanitizeBorrower(rawBorrower));
  }
  return loan;
}

// Step 4 - GET method that gets all loan objects
router.get(
  '/',
  useAsyncHandler(async (req, res) => {
    return await getAllLoans();
  })
);

// Step 5 - GET method that gets one loan object based on loanId
router.get(
  '/:loanId',
  useAsyncHandler(async (req, res) => {
    const { loanId: rawLoanId } = req.params;
    const loanId = Number(rawLoanId);
    if (isNaN(loanId)) {
      sendStatus(res, 400, 'Invalid loanId');
      return;
    }
    const loan = await getLoan(loanId);
    if (!loan) {
      sendStatus(res, 404, 'loanId not found');
      return;
    }
    return loan;
  })
);

// Step 6 - POST method that adds a new loan object with an array of borrowers
router.post(
  '/',
  useAsyncHandler(async (req, res) => {
    const loan = sanitizeLoan(req.body);
    if (!loan) {
      sendStatus(res, 400, 'Invalid loan object');
      return;
    }
    await putLoan(loan);
    return loan;
  })
);

// Step 7 - PATCH method that updates borrower information based on loanId and pairId
router.patch(
  '/:loanId/pairs/:pairId',
  useAsyncHandler(async (req, res) => {
    const { loanId: rawLoanId, pairId: rawPairId } = req.params;
    const loanId = Number(rawLoanId);
    if (isNaN(loanId)) {
      sendStatus(res, 400, 'Invalid loanId');
      return;
    }
    const borrower = sanitizeBorrower({ pairId: rawPairId, ...req.body });
    if (isNaN(borrower?.pairId)) {
      sendStatus(res, 400, 'Invalid pairId');
      return;
    }
    const { pairId, ...updates } = borrower;
    return await updateLoanBorrower(loanId, pairId, updates);
  })
);

// Step 8 - DELETE method that deletes a borrower based on loanId and pairId
router.delete(
  '/:loanId/pairs/:pairId',
  useAsyncHandler(async (req, res) => {
    const { loanId: rawLoanId, pairId: rawPairId } = req.params;
    const loanId = Number(rawLoanId);
    const pairId = Number(rawPairId);
    if (isNaN(loanId)) {
      sendStatus(res, 400, 'Invalid parameter(s)');
      return;
    }
    const loan = await removeLoanBorrower(loanId, pairId);
    if (!loan) {
      sendStatus(res, 404, 'loanId or pairId not found');
      return;
    }
    return loan;
  })
);

// Step 9 - DELETE method that deletes a loan object based on loanId
router.delete(
  '/:loanId',
  useAsyncHandler(async (req, res) => {
    const { loanId: rawLoanId, pairId: rawPairId } = req.params;
    const loanId = Number(rawLoanId);
    if (isNaN(loanId)) {
      sendStatus(res, 400, 'Invalid loanId');
      return;
    }
    if (!(await removeLoan(loanId))) {
      throw new Error(`Failed to remove loanId ${loanId}`);
    }
    sendStatus(res, 200, 'Success');
  })
);

module.exports = router;
