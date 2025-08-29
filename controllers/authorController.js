const Author = require('../models/authorModel');
const Book = require('../models/bookModel');
const asyncHandler = require('../utils/asyncHandler');

const getAuthors = asyncHandler(async (req, res) => {
  const authors = await Author.find().sort('name');
  res.json(authors);
});

const getAuthorById = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (!author) return res.status(404).json({ message: 'Author not found' });
  res.json(author);
});

const getBooksByAuthor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Check if author exists
  const author = await Author.findById(id);
  if (!author) return res.status(404).json({ message: 'Author not found' });
  
  // Get all books by this author with populated category and type
  const books = await Book.find({ author: id })
    .populate('category', 'name')
    .populate('type', 'name')
    .populate('author', 'name')
    .sort('name');
  
  res.json({
    author: {
      _id: author._id,
      name: author.name,
      bio: author.bio,
      image_url: author.image_url
    },
    books: books,
    totalBooks: books.length
  });
});

const createAuthor = asyncHandler(async (req, res) => {
  const { name, bio, image_url } = req.body;
  
  // Check if author already exists
  const exists = await Author.findOne({ name });
  if (exists) return res.status(400).json({ message: 'Author already exists' });
  
  const author = await Author.create({ 
    name, 
    bio, 
    image_url 
  });
  
  res.status(201).json(author);
});

const updateAuthor = asyncHandler(async (req, res) => {
  const { name, bio, image_url } = req.body;
  
  const author = await Author.findById(req.params.id);
  if (!author) return res.status(404).json({ message: 'Author not found' });
  
  // Check if name is being changed and if it already exists
  if (name && name !== author.name) {
    const exists = await Author.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Author name already exists' });
  }
  
  author.name = name || author.name;
  author.bio = bio || author.bio;
  author.image_url = image_url || author.image_url;
  
  await author.save();
  res.json(author);
});

const deleteAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (!author) return res.status(404).json({ message: 'Author not found' });
  
  await author.remove();
  res.json({ message: 'Author removed' });
});

module.exports = { 
  getAuthors, 
  getAuthorById, 
  getBooksByAuthor,
  createAuthor, 
  updateAuthor, 
  deleteAuthor 
};
