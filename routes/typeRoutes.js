const express = require('express');
const router = express.Router();

const validate = require('../validators/validate');
const { nameSchema } = require('../validators/typeCategoryValidator');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { getTypes, getTypeById, createType, updateType, deleteType } = require('../controllers/typeController');

router.get('/', getTypes);

router.get('/:id', getTypeById);

router.post('/', protect, admin, validate(nameSchema), createType);

router.put('/:id', protect, admin, validate(nameSchema), updateType);

router.delete('/:id', protect, admin, deleteType);

module.exports = router;
