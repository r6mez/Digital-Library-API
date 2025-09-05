const Category = require('../models/categoryModel');
const asyncHandler = require('../utils/asyncHandler');
const {
  CREATED,
  BAD_REQUEST,
  NOT_FOUND
} = require('../constants/httpStatusCodes');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort('name');
  res.json(categories);
});

const getCategoryById = asyncHandler(async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(NOT_FOUND).json({ message: 'Category not found' });
  res.json(cat);
});

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const exists = await Category.findOne({ name });
  if (exists) return res.status(BAD_REQUEST).json({ message: 'Category already exists' });
  const category = await Category.create({ name });
  res.status(CREATED).json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(NOT_FOUND).json({ message: 'Category not found' });
  cat.name = name || cat.name;
  await cat.save();
  res.json(cat);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(NOT_FOUND).json({ message: 'Category not found' });
  await cat.deleteOne();
  res.json({ message: 'Category removed' });
});

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
