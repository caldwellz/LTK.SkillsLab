const express = require('express');
const { useAsyncHandler, sendStatus } = require('../../lib');
const { getAllLoans, putLoan, getLoan } = require('../../models/loan-borrowers');
const router = express.Router();

const borrowerStringProps = ['firstName', 'lastName', 'phone'];
function sanitizeLoan(rawInput) {
  const loan = { loanId: Number(rawInput?.loanId), borrowers: [] };
  if (isNaN(loan.loanId) || !Array.isArray(rawInput?.borrowers)) return null;
  for (const rawBorrower of rawInput.borrowers) {
    const borrower = { pairId: Number(rawBorrower?.id) };
    if (typeof rawBorrower !== 'object' || isNaN(borrower.pairId)) return null;
    for (const prop of borrowerStringProps) {
      if (typeof rawBorrower[prop] !== 'string') return null;
      borrower[prop] = rawBorrower[prop];
    }
    loan.borrowers.push(borrower);
  }
  return loan;
}

router.get(
  '/',
  useAsyncHandler(async (req, res) => {
    return await getAllLoans();
  })
);

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

module.exports = router;
