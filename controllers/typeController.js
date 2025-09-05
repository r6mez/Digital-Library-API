const Type = require('../models/type');
const asyncHandler = require('../utils/asyncHandler');
const {
  CREATED,
  BAD_REQUEST,
  NOT_FOUND
} = require('../constants/httpStatusCodes');

// Get all types
const getTypes = asyncHandler(async (req, res) => {
  const types = await Type.find().sort('name');
  res.json(types);
});

// Get single type
const getTypeById = asyncHandler(async (req, res) => {
  const type = await Type.findById(req.params.id);
  if (!type) return res.status(NOT_FOUND).json({ message: 'Type not found' });
  res.json(type);
});

// Create type
const createType = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const exists = await Type.findOne({ name });
  if (exists) return res.status(BAD_REQUEST).json({ message: 'Type already exists' });
  const type = await Type.create({ name });
  res.status(CREATED).json(type);
});

// Update type
const updateType = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const type = await Type.findById(req.params.id);
  if (!type) return res.status(NOT_FOUND).json({ message: 'Type not found' });
  type.name = name || type.name;
  await type.save();
  res.json(type);
});

// Delete type
const deleteType = asyncHandler(async (req, res) => {
  const type = await Type.findById(req.params.id);
  if (!type) return res.status(NOT_FOUND).json({ message: 'Type not found' });
  await type.deleteOne();
  res.json({ message: 'Type removed' });
});

module.exports = { getTypes, getTypeById, createType, updateType, deleteType };
