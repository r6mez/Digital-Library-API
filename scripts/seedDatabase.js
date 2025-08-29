require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Import models
const Category = require('../models/categoryModel');
const Type = require('../models/type');
const Author = require('../models/authorModel');
const Book = require('../models/bookModel');

// Sample data
const categoriesData = [
    { name: 'Fiction' },
    { name: 'Non-Fiction' },
    { name: 'Science' },
    { name: 'Technology' },
    { name: 'History' },
    { name: 'Biography' },
    { name: 'Mystery' },
    { name: 'Romance' },
    { name: 'Fantasy' },
    { name: 'Science Fiction' },
    { name: 'Self-Help' },
    { name: 'Business' },
    { name: 'Philosophy' },
    { name: 'Psychology' },
    { name: 'Art' },
    { name: 'Health' },
    { name: 'Travel' },
    { name: 'Cooking' },
    { name: 'Sports' },
    { name: 'Education' }
];

const typesData = [
    { name: 'Novel' },
    { name: 'Textbook' },
    { name: 'Reference' },
    { name: 'Magazine' },
    { name: 'Journal' },
    { name: 'Graphic Novel' },
    { name: 'Poetry' },
    { name: 'Short Stories' },
    { name: 'Manual' },
    { name: 'Anthology' },
    { name: 'Guide' },
    { name: 'Memoir' },
    { name: 'Encyclopedia' },
    { name: 'Dictionary' },
    { name: 'Workbook' }
];

const authorsData = [
    {
        name: 'J.K. Rowling',
        bio: 'British author, philanthropist, film producer, television producer, and screenwriter. She is best known for writing the Harry Potter fantasy series.',
        image_url: 'https://example.com/authors/jk-rowling.jpg'
    },
    {
        name: 'Stephen King',
        bio: 'American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels.',
        image_url: 'https://example.com/authors/stephen-king.jpg'
    },
    {
        name: 'Jane Austen',
        bio: 'English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century.',
        image_url: 'https://example.com/authors/jane-austen.jpg'
    },
    {
        name: 'George Orwell',
        bio: 'English novelist, essayist, journalist and critic. His work is characterised by lucid prose, social criticism, opposition to totalitarianism, and support of democratic socialism.',
        image_url: 'https://example.com/authors/george-orwell.jpg'
    },
    {
        name: 'Agatha Christie',
        bio: 'English writer known for her sixty-six detective novels and fourteen short story collections, particularly those revolving around fictional detectives Hercule Poirot and Miss Marple.',
        image_url: 'https://example.com/authors/agatha-christie.jpg'
    },
    {
        name: 'Isaac Asimov',
        bio: 'American writer and professor of biochemistry at Boston University. He was known for his works of science fiction and popular science.',
        image_url: 'https://example.com/authors/isaac-asimov.jpg'
    },
    {
        name: 'Virginia Woolf',
        bio: 'English writer, considered one of the most important modernist 20th-century authors and a pioneer in the use of stream of consciousness as a narrative device.',
        image_url: 'https://example.com/authors/virginia-woolf.jpg'
    },
    {
        name: 'Mark Twain',
        bio: 'American writer, humorist, entrepreneur, publisher, and lecturer. He was lauded as the "greatest humorist this country has produced".',
        image_url: 'https://example.com/authors/mark-twain.jpg'
    },
    {
        name: 'Maya Angelou',
        bio: 'American poet, memoirist, and civil rights activist. She published seven autobiographies, three books of essays, several books of poetry, and is credited with a list of plays, movies, and television shows spanning over 50 years.',
        image_url: 'https://example.com/authors/maya-angelou.jpg'
    },
    {
        name: 'Ernest Hemingway',
        bio: 'American novelist, short-story writer, and journalist. His economical and understated style—which he termed the iceberg theory—had a strong influence on 20th-century fiction.',
        image_url: 'https://example.com/authors/ernest-hemingway.jpg'
    }
];

const getBooksData = (categories, types, authors) => {
    // Helper function to get random element from array
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    // Helper function to get random price
    const getRandomPrice = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
    
    return [
        {
            name: "Harry Potter and the Philosopher's Stone",
            author: authors.find(a => a.name === 'J.K. Rowling')._id,
            description: "A young wizard's journey begins at Hogwarts School of Witchcraft and Wizardry.",
            cover_image_url: "https://example.com/covers/harry-potter-1.jpg",
            publication_date: new Date("1997-06-26"),
            category: categories.find(c => c.name === 'Fantasy')._id,
            type: types.find(t => t.name === 'Novel')._id,
            buy_price: 15.99,
            borrow_price_per_day: 2.99,
            pdf_path: "/uploads/pdfs/harry-potter-1.pdf"
        },
        {
            name: "The Shining",
            author: authors.find(a => a.name === 'Stephen King')._id,
            description: "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence.",
            cover_image_url: "https://example.com/covers/the-shining.jpg",
            publication_date: new Date("1977-01-28"),
            category: categories.find(c => c.name === 'Fiction')._id,
            type: types.find(t => t.name === 'Novel')._id,
            buy_price: 12.99,
            borrow_price_per_day: 2.49,
        },
        {
            name: "Pride and Prejudice",
            author: authors.find(a => a.name === 'Jane Austen')._id,
            description: "A romantic novel that follows the character development of Elizabeth Bennet, the dynamic protagonist.",
            cover_image_url: "https://example.com/covers/pride-prejudice.jpg",
            publication_date: new Date("1813-01-28"),
            category: categories.find(c => c.name === 'Romance')._id,
            type: types.find(t => t.name === 'Novel')._id,
            buy_price: 10.99,
            borrow_price_per_day: 1.99,
        },
        {
            name: "1984",
            author: authors.find(a => a.name === 'George Orwell')._id,
            description: "A dystopian social science fiction novel that follows Winston Smith, a low-ranking member of 'the Party'.",
            cover_image_url: "https://example.com/covers/1984.jpg",
            publication_date: new Date("1949-06-08"),
            category: categories.find(c => c.name === 'Science Fiction')._id,
            type: types.find(t => t.name === 'Novel')._id,
            buy_price: 13.99,
            borrow_price_per_day: 2.29,
        },
        {
            name: "Murder on the Orient Express",
            author: authors.find(a => a.name === 'Agatha Christie')._id,
            description: "Hercule Poirot investigates a murder aboard the famous European train.",
            cover_image_url: "https://example.com/covers/orient-express.jpg",
            publication_date: new Date("1934-01-01"),
            category: categories.find(c => c.name === 'Mystery')._id,
            type: types.find(t => t.name === 'Novel')._id,
            buy_price: 11.99,
            borrow_price_per_day: 2.19,
        },
        {
            name: "Foundation",
            author: authors.find(a => a.name === 'Isaac Asimov')._id,
            description: "A science fiction novel about mathematician Hari Seldon who develops psychohistory to predict the future.",
            cover_image_url: "https://example.com/covers/foundation.jpg",
            publication_date: new Date("1951-05-01"),
            category: categories.find(c => c.name === 'Science Fiction')._id,
            type: types.find(t => t.name === 'Novel')._id,
            buy_price: 14.99,
            borrow_price_per_day: 2.79,
        },
        {
            name: "To the Lighthouse",
            author: authors.find(a => a.name === 'Virginia Woolf')._id,
            description: "A modernist novel that examines the thoughts and experiences of the Ramsay family.",
            cover_image_url: "https://example.com/covers/lighthouse.jpg",
            publication_date: new Date("1927-05-05"),
            category: categories.find(c => c.name === 'Fiction')._id,
            type: types.find(t => t.name === 'Novel')._id,
            buy_price: 12.49,
            borrow_price_per_day: 2.39,
        },
        {
            name: "Adventures of Huckleberry Finn",
            author: authors.find(a => a.name === 'Mark Twain')._id,
            description: "The adventures of a boy and his friend Jim, an escaped slave, as they travel down the Mississippi River.",
            cover_image_url: "https://example.com/covers/huckleberry-finn.jpg",
            publication_date: new Date("1884-12-10"),
            category: categories.find(c => c.name === 'Fiction')._id,
            type: types.find(t => t.name === 'Novel')._id,
            buy_price: 9.99,
            borrow_price_per_day: 1.89,
        },
        {
            name: "I Know Why the Caged Bird Sings",
            author: authors.find(a => a.name === 'Maya Angelou')._id,
            description: "An autobiographical account of Angelou's early years and the racism and trauma she experienced.",
            cover_image_url: "https://example.com/covers/caged-bird.jpg",
            publication_date: new Date("1969-01-01"),
            category: categories.find(c => c.name === 'Biography')._id,
            type: types.find(t => t.name === 'Memoir')._id,
            buy_price: 13.49,
            borrow_price_per_day: 2.59,
        },
        {
            name: "The Old Man and the Sea",
            author: authors.find(a => a.name === 'Ernest Hemingway')._id,
            description: "The story of an aging Cuban fisherman who struggles with a giant marlin far out in the Gulf Stream.",
            cover_image_url: "https://example.com/covers/old-man-sea.jpg",
            publication_date: new Date("1952-09-01"),
            category: categories.find(c => c.name === 'Fiction')._id,
            type: types.find(t => t.name === 'Novel')._id,
            buy_price: 11.49,
            borrow_price_per_day: 2.09,
        },
        // Additional books for more variety
        {
            name: "Introduction to Computer Science",
            author: authors.find(a => a.name === 'Isaac Asimov')._id, // Using Isaac Asimov for tech book
            description: "A comprehensive guide to computer science fundamentals and programming concepts.",
            cover_image_url: "https://example.com/covers/cs-intro.jpg",
            publication_date: new Date("2020-01-15"),
            category: categories.find(c => c.name === 'Technology')._id,
            type: types.find(t => t.name === 'Textbook')._id,
            buy_price: 89.99,
            borrow_price_per_day: 5.99,
        },
        {
            name: "World History: A Complete Guide",
            author: authors.find(a => a.name === 'George Orwell')._id, // Using George Orwell for history book
            description: "An in-depth exploration of world history from ancient civilizations to modern times.",
            cover_image_url: "https://example.com/covers/world-history.jpg",
            publication_date: new Date("2019-03-10"),
            category: categories.find(c => c.name === 'History')._id,
            type: types.find(t => t.name === 'Reference')._id,
            buy_price: 45.99,
            borrow_price_per_day: 3.99,
        },
        {
            name: "The Art of Mindfulness",
            author: authors.find(a => a.name === 'Maya Angelou')._id, // Using Maya Angelou for wellness book
            description: "Practical techniques for developing mindfulness and reducing stress in daily life.",
            cover_image_url: "https://example.com/covers/mindfulness.jpg",
            publication_date: new Date("2021-08-20"),
            category: categories.find(c => c.name === 'Self-Help')._id,
            type: types.find(t => t.name === 'Guide')._id,
            buy_price: 18.99,
            borrow_price_per_day: 2.99,
        },
        {
            name: "Business Strategy Essentials",
            author: authors.find(a => a.name === 'Ernest Hemingway')._id, // Using Ernest Hemingway for business book
            description: "Key strategies and frameworks for developing successful business plans and operations.",
            cover_image_url: "https://example.com/covers/business-strategy.jpg",
            publication_date: new Date("2022-02-05"),
            category: categories.find(c => c.name === 'Business')._id,
            type: types.find(t => t.name === 'Manual')._id,
            buy_price: 34.99,
            borrow_price_per_day: 4.29,
        },
        {
            name: "Modern Art Movements",
            author: authors.find(a => a.name === 'Virginia Woolf')._id, // Using Virginia Woolf for art book
            description: "A visual journey through the major art movements of the 20th and 21st centuries.",
            cover_image_url: "https://example.com/covers/modern-art.jpg",
            publication_date: new Date("2020-11-12"),
            category: categories.find(c => c.name === 'Art')._id,
            type: types.find(t => t.name === 'Reference')._id,
            buy_price: 42.99,
            borrow_price_per_day: 3.79,
        }
    ];
};

// Seeding functions
const seedCategories = async () => {
    try {
        await Category.deleteMany({});
        const categories = await Category.insertMany(categoriesData);
        console.log(`✅ ${categories.length} categories seeded successfully`);
        return categories;
    } catch (error) {
        console.error('❌ Error seeding categories:', error.message);
        throw error;
    }
};

const seedTypes = async () => {
    try {
        await Type.deleteMany({});
        const types = await Type.insertMany(typesData);
        console.log(`✅ ${types.length} types seeded successfully`);
        return types;
    } catch (error) {
        console.error('❌ Error seeding types:', error.message);
        throw error;
    }
};

const seedAuthors = async () => {
    try {
        await Author.deleteMany({});
        const authors = await Author.insertMany(authorsData);
        console.log(`✅ ${authors.length} authors seeded successfully`);
        return authors;
    } catch (error) {
        console.error('❌ Error seeding authors:', error.message);
        throw error;
    }
};

const seedBooks = async (categories, types, authors) => {
    try {
        await Book.deleteMany({});
        const booksData = getBooksData(categories, types, authors);
        const books = await Book.insertMany(booksData);
        console.log(`✅ ${books.length} books seeded successfully`);
        return books;
    } catch (error) {
        console.error('❌ Error seeding books:', error.message);
        throw error;
    }
};

// Main seeding function
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Connect to database
        await connectDB();
        
        console.log('📁 Seeding categories...');
        const categories = await seedCategories();
        
        console.log('📁 Seeding types...');
        const types = await seedTypes();
        
        console.log('📁 Seeding authors...');
        const authors = await seedAuthors();
        
        console.log('📁 Seeding books...');
        const books = await seedBooks(categories, types, authors);
        
        console.log('\n🎉 Database seeding completed successfully!');
        console.log(`📊 Summary:`);
        console.log(`   Categories: ${categories.length}`);
        console.log(`   Types: ${types.length}`);
        console.log(`   Authors: ${authors.length}`);
        console.log(`   Books: ${books.length}`);
        
    } catch (error) {
        console.error('💥 Database seeding failed:', error.message);
        process.exit(1);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
        process.exit(0);
    }
};

// Run seeding if this file is executed directly
if (require.main === module) {
    seedDatabase();
}

module.exports = {
    seedDatabase,
    seedCategories,
    seedTypes,
    seedAuthors,
    seedBooks
};
