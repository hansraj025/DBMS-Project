const express = require('express');
const router = express.Router();
const { Books, Authors, Publishers } = require('../models');
const { Op } = require('sequelize');

// GET request for 'localhost:3001/'
router.get('/', async (req, res) => {
    try {
        const listOfAllBooks = await Books.findAll({
            include: [
                {
                    model: Authors,
                    attributes: ['authorName'] // Only fetch the author's name
                },
                {
                    model: Publishers,
                    attributes: ['publisherName'] // Only fetch the publisher's name
                }
            ]
        });

        // Transform the results to create a clean, readable response
        const transformedBooks = listOfAllBooks.map(book => ({
            bookID: book.bookID,
            bookTitle: book.bookTitle,
            authorName: book.Author ? book.Author.authorName : null, // Safely access author name
            bookGenre: book.bookGenre,
            bookPrice: book.bookPrice,
            stock: book.stock,
            publisherName: book.Publisher ? book.Publisher.publisherName : null, // Safely access publisher name
            rating: book.rating,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt
        }));

        // Send the transformed data as JSON response
        res.json(transformedBooks);
    } catch (error) {
        // Error handling
        console.error('Error fetching paginated books:', error);
        res.status(500).json({ 
            error: "An error occurred while retrieving books", 
            details: error.message 
        });
    }
});



// GET Request for upto 60 most popular books
router.get('/popular', async (req, res) => {
    try {
        const popularBooks = await Books.findAll({
            attributes: ['bookID', 'bookTitle', 'rating'],
            where: {
                rating: {
                    [Op.gte]: 4
                }
            },
            include: [ {model: Authors, attributes: ['authorName']}],
            order: [['rating', 'DESC']],
            limit: 60
        });

        // Formatting Data
        res.json(popularBooks.map(book => ({
            bookID: book.bookID,
            bookTitle: book.bookTitle,
            authorName: book.Author.authorName,
            rating: book.rating
        })));

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Failed to fetch popular books.'})
    }
})

module.exports = router;