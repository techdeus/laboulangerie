const fs = require('fs');
const { DB, storeModel, userModel, productModel , orderModel } = require('./models');
const path = require('path');
const bcrypt = require('bcryptjs');
const { getWeekdates } = require('../util/date');
const getWeek = require('date-fns/getWeek');
const getYear = require('date-fns/getYear');
const getStart = require('date-fns/startOfWeek');
const getEnd = require('date-fns/lastDayOfWeek');
const addDays = require('date-fns/addDays')
const format = require('date-fns/format');

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
//                     manageremail: splitStore[8],
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
//                     superuser: splitUser[2],
//                     store_id: parseInt(splitUser[3]) || null,
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

// readData(path.join(__dirname, 'orders.csv'))
// .then((data) => {
//     const lines = data.split('\n');
//     const seed = async () => {
//         try {
//             await DB.sync({ force: false });
//             lines.forEach((order) => {
//                 const splitOrder = order.split(',');
//                 const newOrder = orderModel.create({
//                     weekOfYear: parseInt(splitOrder[0]),
//                     begDayOfWeek: splitOrder[1],
//                     lastDayOfWeek: splitOrder[2],
//                     user_id: parseInt(splitOrder[3]),
//                     store_id: parseInt(splitOrder[4]),
//                 })
//                     .then((order) => console.log('Order Created'))
//                         .catch(err => console.log(err));
//             })
//         } catch (err) {
//             console.error(err);
//         }
//     }
//     seed();
// })
// .catch(err => console.error(err));

// user[store]
const mapStoreUser = {
    1: 2,
    2: 3,
    3: 4,
    4: 5,
    5: 6,
    6: 7,
    8: 1,
    7: 8
};

const seedOrders = async () => {
    try {
        await DB.sync({ force: false });
        let date = Date.parse('2019-12-30T08:00:00.000Z');
        for (let i = 1; i <= 52; ++i) {
            let startDay = getStart(date, {weekStartsOn: 1});
            let endDay = getEnd(date, { weekStartsOn: 1});
            let weekNum = getWeek(date, {weekStartsOn: 1});
            let year = getYear(date);
            for (let j = 1; j <= 9; ++j) {
                if (j === 9) continue;
                const newOrder = orderModel.create({
                    weekOfYear: weekNum,
                    currYear: year,
                    begDayOfWeek: startDay,
                    lastDayOfWeek: endDay,
                    user_id: j,
                    store_id: mapStoreUser[j],
                })
                .then((order) => console.log('Order Created'))
                    .catch(err => console.log(err));
            }
            date = addDays(date, 7);
        }        
    } catch (err) {
        console.log(err);
    }   
}

seedOrders();