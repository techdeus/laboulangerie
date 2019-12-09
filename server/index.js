require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 8282;
const { userModel, storeModel, productModel } = require('./database/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ngrok = require('ngrok');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, '../public')));

app.post('/login/user', async (req, res) => {
    // Authenticate User
    try {
        const { username, password } = req.body;
        //
        if (username === '' || password === '') {
            return res.status(400).send({ message: 'Please Enter Credentials' });
        }
        
        const user = await userModel.findOne({ where: { username }});
        
        if (user == null) {
            return res.status(400).json({message: 'User Not Found'});
        }
        
        if (await bcrypt.compare(password, user.password)) {
            const store = await storeModel.findByPk(user.store_id);
            // user is authenticated
            const { username, store_id } = user;
            const tokenUser = { username: username, store: store_id };
            const accessToken = generateAccessToken(tokenUser);
            return res.status(200).json({ message: 'Logged In', user: user, store: store, accessToken: accessToken });;
        } else {
            return res.status(400).send({ message: 'Not Authorized'});
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/posts', authenticateToken, (req, res) => {
    const posts = [{id: 1, post: 'I love it'},{id: 2, post: 'I love it 2'}, {id: 1, post: 'I love it 3'}];
    res.json(posts.filter(post => post.id === req.user.store));
});

app.get('/allproducts', authenticateToken, async (req, res) => {
    try {
        const products = await productModel.findAll({ where: { isactive: true }});
        res.status(200).send(products);
    } catch (err) {
        res.status(500).send({message: 'Something went wrong'});
    }
});

app.delete('/logout', (req, res) => {
    const { token } = req.body;
    // remove the token from the database
    res.sendStatus(204);
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h'});
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // 401 - no token sent: token is undefined or actual token 
    if (token == null) return res.sendStatus(401);
    // 403 - No longer valid
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
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

(async function() {
    const url = await ngrok.connect(8282);
    console.log('URL: ', url);
})();