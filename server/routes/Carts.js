const express = require('express');
const router = express.Router();
const {Carts, CartItems, Books} = require('../models');
const { Op } = require('sequelize');

// 1. Add Book to Cart
router.post('/additem', async (req, res) => {
    const { bookID, quantity } = req.body;

    try {
        // Validate input
        if (!bookID || !quantity || quantity <= 0) {
            return res.status(400).json({
                message: 'Invalid book ID or quantity.'
            });
        }

        const book = await Books.findOne({
            where: { bookID: bookID }
        });

        if (!book) {
            return res.status(404).json({
                message: 'Book not found.'
            });
        }

        const userID = req.user ? req.user.userID : null;

        if (!userID) {
            return res.status(401).json({
                message: 'User not authenticated.'
            });
        }

        const cart = await Carts.findOne({
            where: { userID: userID }
        });

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found for this user.'
            });
        }

        const existingCartItem = await CartItems.findOne({
            where: {
                cartID: cart.cartID,
                bookID: bookID
            }
        });

        if (existingCartItem) {
            // If the item already exists in the cart, increase its quantity
            existingCartItem.quantity += quantity;
            existingCartItem.price += quantity * book.price;
            await existingCartItem.save();

            return res.status(200).json({
                message: "Cart item quantity updated successfully.",
                cartItem: existingCartItem
            });
        }

        // If the item does not exist, create a new cart item
        const price = quantity * book.price;
        const cartItem = await CartItems.create({
            cartID: cart.cartID,
            bookID,
            quantity,
            price: price
        });

        res.status(201).json({
            message: "Item added to cart successfully.",
            cartItem
        });

    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({
            message: 'Error whilst adding item.',
            error: error.message
        });
    }
});

// 2. Remove book from cart
router.post('/removeitem', async (req, res) => {
    const { cartItemID } = req.body;
    const userID = req.user.userID;

    try {
        // Validate input
        if (!cartItemID) {
            return res.status(400).json({
                message: 'Cart Item ID is required.'
            });
        }

        // Find the cart item first to ensure it belongs to the user
        const cartItem = await CartItems.findOne({
            where: { cartItemID: cartItemID }
        });

        // If cart item not found or doesn't belong to user
        if (!cartItem) {
            return res.status(404).json({
                message: 'Cart item not found or you do not have permission to remove it.',
                cartItem
            });
        }

        // Remove the cart item
        await cartItem.destroy();

        res.status(200).json({
            message: 'Cart item removed successfully.',
            removedCartItemID: cartItemID
        });

    } catch (error) {
        console.error('Error removing cart item:', error);
        res.status(500).json({
            message: 'Error removing cart item.',
            error: error.message
        });
    }
});

// TODO: Format the output of get request
// Fetches all the cartItems for the user
router.get('/getitems', async (req, res) => {
    const userID = req.user.userID;

    const cart = await Carts.findOne({
        where: {
            userID: userID
        }
    })

    const cartID = cart.cartID;

    const usersCartItems = await CartItems.findAll({
        where: {
            cartID: cartID
        }
    })

    res.json({
        message: 'Fetched cart Items for user',
        usersCartItems
    })
});

module.exports = router;