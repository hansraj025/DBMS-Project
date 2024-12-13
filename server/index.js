const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});
const app = express();

app.use(cors());
app.use(express.json());


const db = require('./models');



// Routers ( Middle Wares? )

// All requests are written in file './routes/Users'
// all requests originating from 'localhost:3001/sign up' are automatically routed to /server/routes/Users.js 
const authenticationToken = require('./middlewares/auth');

const userRouter = require('./routes/Users');
app.use('/users', userRouter);

const adminRouter = require('./routes/Admin');
app.use('/admin', adminRouter);

const bookRouter = require('./routes/Books');
app.use('/books', bookRouter);

const searchRouter = require('./routes/Search');
app.use('/search', searchRouter);

const cartRouter = require('./routes/Carts');
app.use('/carts',authenticationToken, cartRouter);

const orderRouter = require('./routes/Orders');
app.use('/orders', authenticationToken, orderRouter);


db.sequelize.sync(/*{alter: true}*/).then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001.");
    })
})