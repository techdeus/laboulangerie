const Sequelize = require('sequelize');
const DB = require('./index');
const Op = Sequelize.Op;
const storeModel = DB.define('stores', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    city: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    state: {
        type: Sequelize.STRING(2),
        allowNull: false,
    },
    zipcode: {
        type: Sequelize.REAL,
        allowNull: false,
    },
    phonenumber: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    manager: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    manageremail: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

const userModel = DB.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    superuser: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    store_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'stores',
            key: 'id',
        },
    },
});

const productModel = DB.define('products', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    price: {
        type: Sequelize.DECIMAL(13, 2),
        allowNull: false,
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isactive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
});

const orderModel = DB.define('orders', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
    },
    products: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null,
    },
    weekOfYear: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    currYear: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    begDayOfWeek: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    lastDayOfWeek: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    isOrdered: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    store_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'stores',
            key: 'id',
        },
    },
});

module.exports = {
    DB,
    storeModel,
    userModel,
    productModel,
    orderModel,
    Op,
};
