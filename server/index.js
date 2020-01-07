require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 8282;
const { userModel, storeModel, productModel, orderModel } = require('./database/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ngrok = require('ngrok');
const { getWeekDates, addDays, year } = require('./util/date');
const { passwordLog } = require('./util/logs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, '../public')));

app.post('/login/user', async (req, res) => {
    // Authenticate User
    try {
        const { username, password, loginForever } = req.body;
        // get current Date
        const now = Date.now();
        // get week based on current date
        const currWeek = getWeekDates(addDays(now, 7));
        
        // if any of the passed information is empty return a status 400 with message
        if (username === '' || password === '') {
            return res.status(400).send({ message: 'Please Enter User Credentials' });
        }
        
        const user = await userModel.findOne({ where: { username }});
        
        if (user == null) {
            return res.status(400).json({ message: 'Login Failed' });
        }
        
        if (await bcrypt.compare(password, user.password)) {
            // user is authenticated
            const { username, password, superuser } = user;
            let store;
            let currOrder;
            if (superuser) {
                store = await storeModel.findAll();
                currOrder = await orderModel.findAll({ where: {weekOfYear: currWeek.weekNum, currYear: currWeek.year }});
            } else {
                store = await storeModel.findByPk(user.store_id);
                currOrder = await orderModel.findOne({ where: { weekOfYear: currWeek.weekNum, store_id: user.store_id }});
            }
            const tokenUser = { username: username, password: password };
            const accessToken = generateAccessToken(tokenUser, loginForever);
            return res.status(200).json({ message: 'Logged In', user: user, store: store, order: currOrder, accessToken: accessToken });;
        } else {
            return res.status(400).send({ message: 'Login Failed' });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/allproducts', authenticateToken, async (req, res) => {
    try {
        const products = await productModel.findAll({ where: { isactive: true }});
        res.status(200).send(products);
    } catch (err) {
        res.status(500).send({message: 'Something went wrong'});
    }
});

app.put('/updateOrder', authenticateToken, async (req, res) => {
    try {
        const { products, date, order } = req.body;
        const jsonProd = JSON.stringify(products);
        const updateOrder = await orderModel.update(
            { date: date, products: jsonProd, isOrdered: true },
            { where: { id: order.id }}
        );
        res.status(200).send({updateOrder, msg: 'Order Complete'});
    } catch (err) {
        res.status(500).send({message: 'Something went wrong'});
    }
});

app.put('/changePassword', authenticateToken, async (req, res) => {
    try {
        const { newPassword, user } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatePassword = await userModel.update(
            { password: hashedPassword },
            { where: {id: user.id } }
        );
        const updateUser = await userModel.findOne( { where: { id: user.id }});
        const sendLog = await passwordLog({ user: updateUser.username, password: newPassword });
        res.status(201).send({ user: updateUser, message: 'Password Changed'});
    } catch (err) {
        res.status(500).send({message: 'Something went wrong'});
    }
});

app.put('/forgotPassword', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        const user = await userModel.findOne({ where: { username: email }});
        
        const updatePassword = await userModel.update(
            { password: hashedPassword },
            { where: {id: user.id } }
        );
        
        const sendLog = await passwordLog({ user: email, password: newPassword });
        
        res.status(201).send({ message: 'Success'});
    } catch (err) {
        res.status(500).send({message: 'Something went wrong'});
    }
})
app.delete('/logout', (req, res) => {
    const { token } = req.body;
    // remove the token from the database
    res.sendStatus(204);
});

function generateAccessToken(user, loginForever) {
    let expiration = loginForever ? '1y' : '12h';

    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expiration });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    
    const token = authHeader && authHeader.split(' ')[1];
    // 401 - no token sent: token is undefined or actual token 
    
    if (token == null) return res.sendStatus(401);
    // 403 - No longer valid
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.userInfo = user;
        next();
    });
}

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'), (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
});


app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

// (async function() {
//     const url = await ngrok.connect(8282).catch(err => console.log(err));
//     console.log('URL: ', url);
// })();