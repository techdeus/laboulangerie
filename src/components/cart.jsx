import React, { useState, useEffect, useContext } from 'react';
import Confirmation from './confirmation';
import { InfoContext } from './store';
import '../stylesheets/components/cart.scss';
import Axios from 'axios';
import { IconButton } from '@material-ui/core';
import DeleteIcon  from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import ViewListIcon from '@material-ui/icons/ViewList';

function Cart({ showCart, setShowCart }) {
    const [ total, setTotal ] = useState(0.00);
    const [ error, setError ] = useState(false);
    const [ order, setOrder ] = useState(false);
    const [ msg, setMsg ] = useState('');
    const { appInfo, cart } = useContext(InfoContext);
    const store = appInfo[0].store;
    const user = appInfo[0].user;
    const token = appInfo[0].accessToken;
    const currOrder = appInfo[0].order;

    useEffect(() => {
        let currTotal = 0.00;
        cart[0].map((item) => {
            return currTotal += parseFloat(item.product.price) * item.totalQuantity;
        });
        setTotal(currTotal);
    }, [cart]);
    
    const removeFromCart = (id) => {
        const newCart = cart[0].filter((item) => {
            return item.product.id !== id;
        });
        cart[1](newCart);
        window.localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const completeOrder = async () => {
        const totalOrder = {
            products: cart[0],
            store: appInfo[0].store,
            user: appInfo[0].user,
            order: appInfo[0].order,
            date: new Date(Date.now()),
        };

        try {
            const results = await Axios.put('/updateOrder', totalOrder, 
                {
                    headers: { 'Authorization': "bearer " + token }
                });
            // clear the shopping cart
            cart[1]([]);
            // clear the local cache
            window.localStorage.removeItem('cart');
            // set the message from server
            setMsg(results.data.msg);
            // order is complete - will render confirmation page
            setOrder(true);
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    if (showCart && order) {
        return (
            <div className="cartWrapper">
                <div className="cartHeaderWrapper flexEnd">
                    <IconButton edge="end" className="cartClose" onClick={() => setShowCart(false)}> <CloseIcon /> </IconButton>
                </div>
                <Confirmation setOrder={setOrder} setShowCart={setShowCart} msg={msg} />
            </div>
        )
    }
    if (showCart && cart[0].length === 0) {
        return (
            <div className="cartWrapper">
                <div className="cartHeaderWrapper">
                    <img className="cartLogo" src="/img/assets/cafe_logo.png" alt="Laboulangerie SF logo" />
                    <div className="cartTitle">{user.superuser ? 'Super User' : store.name}<span>'s Shopping Cart</span></div>
                    <IconButton edge="end" className="cartClose" onClick={() => setShowCart(false)}> <CloseIcon /> </IconButton>
                </div>
                <div className="emptyCart">Empty Cart</div>
                <img className="emptyCartPic" src="/img/assets/empty_cart.png" alt="Empty Shopping Cart" />
            </div>
        )
    }
    if (showCart) {
        return (
            <div className="cartWrapper">
                <div className="cartHeaderWrapper">
                    <img className="cartLogo" src="/img/assets/cafe_logo.png" alt="Laboulangerie SF logo" />
                    <div className="cartTitle">{user.superuser ? 'Super User' : store.name}<span>'s Shopping Cart</span></div>
                    <IconButton edge="end" className="cartClose" onClick={() => setShowCart(false)}> <CloseIcon className="cartClose" /> </IconButton>
                </div>
                
                <div className="headerInnerWrapper"> 
                    <div className="cartItemNameHeader">Name</div>
                    <div className="cartItemPriceHeader">Per Item</div>
                    <div className="cartItemQuantityHeader">Mon</div>
                    <div className="cartItemQuantityHeader">Tue</div>
                    <div className="cartItemQuantityHeader">Wed</div>
                    <div className="cartItemQuantityHeader">Thur</div>
                    <div className="cartItemQuantityHeader">Fri</div>
                    <div className="cartItemQuantityHeader">Sat</div>
                    <div className="cartItemQuantityHeader">Sun</div>
                    <div className="cartItemTotalQuantityHeader">Tot</div>
                    <div className="cartItemPriceHeader">Sub</div>
                </div>
                
                {
                    cart[0].map((item) => (
                        <CartItem key={item.product.id} product={item} removeFromCart={removeFromCart} />
                    ))
                }
                <div className="cartFooterWrapper">
                    <div className="innerFooterWrapper">
                        <MonetizationOnIcon fontSize="large" /><span className="footerSpecial">${total.toFixed(2)}</span>
                    </div>
                    <div className="innerFooterWrapper">
                        <ViewListIcon fontSize="large" /><span className="footerSpecial">{cart[0].length}</span>
                    </div>
                    <button className="completeButton" onClick={completeOrder}>Complete Order</button>
                </div>
            </div>
        )
    }
    return <></>
}

function CartItem({ product, removeFromCart }) {
    return (
        <div className="cartItemWrapper">
            <div className="cartInnerWrapper">
                <div className="cartItemName">{product.product.name}</div>
                <div className="cartItemPrice">${product.product.price}</div>
                <div className="cartItemQuantity">{product.quantity.monday}</div>
                <div className="cartItemQuantity">{product.quantity.tuesday}</div>
                <div className="cartItemQuantity">{product.quantity.wednesday}</div>
                <div className="cartItemQuantity">{product.quantity.thursday}</div>
                <div className="cartItemQuantity">{product.quantity.friday}</div>
                <div className="cartItemQuantity">{product.quantity.saturday}</div>
                <div className="cartItemQuantity">{product.quantity.sunday}</div>
                <div className="cartItemTotalQuantity">{product.totalQuantity}</div>
                
                <div className="cartItemPrice priceTotal">${(product.product.price * product.totalQuantity).toFixed(2)}</div>
                <IconButton aria-label="delete" onClick={() => removeFromCart(product.product.id)}><DeleteIcon  className="deleteIcon" /></IconButton>
            </div>
            <div className="cartItemCategory">({product.product.category})</div>
        </div>
    )
};

export default Cart;