const express = require('express');
const router = express.Router();
const { createTransaction, getTransactionById, updateTransaction, deleteTransaction } = require('../controllers/transactionController');

const { protect } = require('../middleware/authMiddleware');
const {transactionSchema} = require('../validators/transactionValidator');
const validate = require('../validators/validate');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', protect, getTransactionById);
router.post('/', protect, validate(transactionSchema), createTransaction);
router.put('/:id', protect, validate(transactionSchema), updateTransaction);
router.delete('/:id', protect, validate(transactionSchema), deleteTransaction);

module.exports = router;
