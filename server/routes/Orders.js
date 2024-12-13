const express = require('express');
const router = express.Router();
const {Orders, OrderDetails, Carts, CartItems, Books} = require('../models');
const { Op } = require('sequelize');




router.get('/showOrders', async (req, res) => {
    userID = req.user.userID;

    try {
        // Fetch all Orders for the user
        const orders = await Orders.findAll({
            where: { userID },
            include: [{
                model: OrderDetails,
                include: [{
                    model:Books,
                    attributes: ['bookID', 'bookTitle', 'bookPrice']
                }]
            }]
        })

        // Tranform the data to match the desired output format
        const transformedOrders = orders.map(order => ({
            orderID: order.orderID,
            userID: order.userID,
            totalAmount: order.totalAmount,
            orderStatus: order.orderStatus,
            orderDetails: order.OrderDetails.map(detail => ({
                orderDetailID: detail.orderDetailID,
                quantity: detail.quantity,
                amount: detail.amount,
                Book: detail.Book
            }))
        }));

        res.json({
            transformedOrders
        });
    } catch (error) {
        console.error('Error fetching orders.', error)
        res.status(500).json({
            message: 'Error fetching orders.',
            error: error.message
        })
    }
})

// TODO - Order Cart i.e. cartItems under cart -> orderDetails under order
router.post('/ordercart', async (req, res) => {
    const userID = req.user.userID;

    try {
        // 1. Get users cartID
        const cart = await Carts.findOne({
            where: {
                userID: userID
            }
        })
        usersCartID = cart.cartID;

        // 2. Get All the cartItems in users cart
        const cartItems = await CartItems.findAll({
            where: {
                cartID: usersCartID
            }
        })

        // 3. Create A Order
        newOrder = await Orders.create({
            userID: userID,
            orderStatus: 'INCOMPLETE'            
        })

        // 4. Add order details to the order
        const orderDetails = await Promise.all(cartItems.map(async (cartItem) => {            
            await Books.decrement('stock', {
                by: cartItem.quantity,
                where: {
                    bookID: cartItem.bookID
                }
            })

            await Orders.increment('totalAmount', {
                by: cartItem.price,
                where: {
                    orderID: newOrder.orderID
                }
            })

            return await OrderDetails.create({
                orderID: newOrder.orderID,
                bookID: cartItem.bookID,
                quantity: cartItem.quantity,
                amount: cartItem.price,

            });
        }));

        await CartItems.destroy({
          where: {
                cartID: usersCartID
            }
        })
        res.json({
            message: "Order Created.",
            newOrder,
            orderDetails
        })
    } catch(error) {
        console.error('Error creating order:', error)
        res.status(201).json({
            message: "Error creating order.",
            error: error.message
        })
    }
})


// TODO - Cancel order if ('INCOMPLETE')



// TODO - Delete orderDetails(items) i.e. quantity 0



// TODO - Modify orderDetails i.e. quantity change kro















module.exports = router;