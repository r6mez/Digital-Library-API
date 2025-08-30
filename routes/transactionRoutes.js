const express = require('express');
const router = express.Router();
const { getAllTransactions, createTransaction, getTransactionById, updateTransaction, deleteTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { transactionSchema } = require('../validators/transactionValidator');
const validate = require('../validators/validate');

router.get('/', protect, admin, getAllTransactions);
router.get('/:id', protect, admin, getTransactionById);
router.post('/', protect, admin, validate(transactionSchema), createTransaction);
router.put('/:id', protect, admin, validate(transactionSchema), updateTransaction);
router.delete('/:id', protect, admin, validate(transactionSchema), deleteTransaction);

module.exports = router;

