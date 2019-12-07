const fs = require('fs');
const { DB, storeModel, userModel, productModel } = require('./models');
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


readData(path.join(__dirname, 'products.csv'))
.then((data) => {
    const lines = data.split('\n');
    const seed = async () => {
        try {
            await DB.sync({force: false});
            lines.forEach(async (product, i) => {
                const splitProduct = product.split(',');
                if (splitProduct.length === 4) {
                    const newUser = await productModel.create({
                        name: splitProduct[0],
                        price: parseFloat(splitProduct[1]),
                        category: splitProduct[2],
                        isactive: false,
                    })
                    .catch(err => console.log(err));    
                } else {
                    const newUser = await productModel.create({
                        name: splitProduct[0],
                        price: parseFloat(splitProduct[1]),
                        category: splitProduct[2].trim(),
                    })
                    .catch(err => console.log(err));
                }
                console.log('Product Added');
            });
        } catch (err) {
            console.error(err);
        }
    };
    seed();
})
    .catch(err => console.log(err));