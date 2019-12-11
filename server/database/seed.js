const fs = require('fs');
const { DB, storeModel, userModel, productModel , orderModel} = require('./models');
const path = require('path');
const bcrypt = require('bcrypt');

function readData(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
};

// readData(path.join(__dirname, 'stores.csv'))
// .then((data) => {
//     const lines = data.split('\n')
//     const seed = async () => {
//         try {
//             await DB.sync({force: false});
//             let i = 0;
//             lines.forEach(async (store, i) => {
//                 if (i === 0) return;
//                 const splitStore = store.split(',');
//                 const newStore = await storeModel.create({
//                     name: splitStore[0],
//                     address: splitStore[1],
//                     city: splitStore[2],
//                     state: splitStore[3],
//                     zipcode: parseInt(splitStore[4]),
//                     phonenumber: splitStore[5],
//                     email: splitStore[6],
//                     manager: splitStore[7],
//                 }).catch(err => console.log(err));
//                 console.log('Store Added');
//             });
//         } catch (err) {
//             console.error(err);
//         }
//     };
//     seed();
// })
//     .catch(err => console.log(err));


// readData(path.join(__dirname, 'users.csv'))
// .then((data) => {
//     const lines = data.split('\n');
//     const seed = async () => {
//         try {
//             await DB.sync({force: false});
//             let i = 0;
//             lines.forEach(async (user, i) => {
//                 const splitUser = user.split(',');
//                 const newUser = await userModel.create({
//                     username: splitUser[0],
//                     password: await bcrypt.hash(splitUser[1], 10),
//                     store_id: parseInt(splitUser[2]),
//                 }).catch(err => console.log(err));
//                 console.log('User Added');
//             });
//         } catch (err) {
//             console.error(err);
//         }
//     };
//     seed();
// })
//     .catch(err => console.log(err));


// readData(path.join(__dirname, 'products.csv'))
// .then((data) => {
//     const lines = data.split('\n');
//     const seed = async () => {
//         try {
//             await DB.sync({force: false});
//             lines.forEach(async (product, i) => {
//                 const splitProduct = product.split(',');
//                 if (splitProduct.length === 4) {
//                     const newUser = await productModel.create({
//                         name: splitProduct[0],
//                         price: parseFloat(splitProduct[1]),
//                         category: splitProduct[2],
//                         isactive: false,
//                     })
//                     .catch(err => console.log(err));    
//                 } else {
//                     const newUser = await productModel.create({
//                         name: splitProduct[0],
//                         price: parseFloat(splitProduct[1]),
//                         category: splitProduct[2].trim(),
//                     })
//                     .catch(err => console.log(err));
//                 }
//                 console.log('Product Added');
//             });
//         } catch (err) {
//             console.error(err);
//         }
//     };
//     seed();
// })
//     .catch(err => console.log(err));


// readData(path.join(__dirname, 'products.csv'))
// .then((data) => {
//     const lines = data.split('\n');
//     const seed = async () => {
//         try {
//             await DB.sync({force: false});
//             lines.forEach(async (product, i) => {
//                 const splitProduct = product.split(',');
//                 if (splitProduct.length === 4) {
//                     const newUser = await productModel.create({
//                         name: splitProduct[0],
//                         price: parseFloat(splitProduct[1]),
//                         category: splitProduct[2],
//                         isactive: false,
//                     })
//                     .catch(err => console.log(err));    
//                 } else {
//                     const newUser = await productModel.create({
//                         name: splitProduct[0],
//                         price: parseFloat(splitProduct[1]),
//                         category: splitProduct[2].trim(),
//                     })
//                     .catch(err => console.log(err));
//                 }
//                 console.log('Product Added');
//             });
//         } catch (err) {
//             console.error(err);
//         }
//     };
//     seed();
// })
//     .catch(err => console.log(err));
const products = [{"product":{"id":25,"name":"Apple Chausson","price":"1.66","category":"viennosserie","isactive":true,"createdAt":"2019-12-06T17:20:34.757Z","updatedAt":"2019-12-06T17:20:34.757Z"},"quantity":3},{"product":{"id":6,"name":"Corn Jalapeno Ciabatte","price":"2.55","category":"bread","isactive":true,"createdAt":"2019-12-06T17:20:34.754Z","updatedAt":"2019-12-06T17:20:34.754Z"},"quantity":10}];


DB.sync({force: false});
const newOrder = orderModel.create({
    date: '2019-12-10T09:33:45.010Z',
    products: products,
    user_id: 4,
    store_id: 1,
}).then((order) => console.log(order)).catch(err => console.log(err));