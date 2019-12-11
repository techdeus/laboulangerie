import React, { useState, useEffect } from 'react';
import '../stylesheets/components/product.scss';
import { IconButton } from '@material-ui/core';
import AddIcon  from '@material-ui/icons/add';
import DeleteIcon  from '@material-ui/icons/Delete';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

import { TextField, Fab } from '@material-ui/core';

function Product({ product, cart, setCart }) {
    const [ quantity, setQuantity ] = useState('');
    const [ showDetails, setShowDetails ] = useState(false);
    const [ inCart, addInCart] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        cart.forEach((item) => {
            if (item.product.id === product.id) {
                setQuantity(item.quantity);
                addInCart(true);
                setShowDetails(true);
            }
        });
    }, [cart]);

    const handleShow = () => {
        setShowDetails(true);
    };

    const addQuantity = (e) => {
        const value = e.target.value;
        if (inCart) {
            addInCart(false);
            removeFromCart();
            setShowDetails(true);
        }
        setQuantity(parseInt(value));
    }

    const addToCart = () => {
        if (quantity <= 0 || quantity === '') {
            setError('Add Quantity');
            return;
        } else {
            addInCart(true);
            setError('');
            setCart([...cart, {product, quantity: quantity}]);
            window.localStorage.setItem('cart', JSON.stringify([...cart, {product, quantity: quantity}]));
        }
    };

    const removeFromCart = () => {
        addInCart(false);
        setShowDetails(false);
        setQuantity('');
        const newCart = cart.filter((item) => {
            return item.product.id !== product.id;
        });
        setCart(newCart);
        window.localStorage.setItem('cart', JSON.stringify(newCart));
    };

    if (!showDetails) {
        return (
            <div className={inCart ? `productWrapper inCart` : `productWrapper`}>
                <div className="topHalf">
                    <div className="productName">{product.name}</div>
                    <div className="productPrice">${product.price}</div>
                    <div className="productCategory">({product.category})</div>
                </div>
                <div className="bottomHalf">
                    <span>Add To Cart</span>
                    <Fab size="small" color="primary" aria-label="add" onClick={handleShow} className="addIcon">
                        <AddIcon />
                    </Fab>
                </div>
            </div>
        );
    }

    return (
        <div className={inCart ? `productWrapper inCart` : `productWrapper`}>
            <div className="topHalf">
                <div className="productName">{product.name}</div>
                <div className="productPrice">${product.price}</div>
                <div className="productCategory">({product.category})</div>
            </div>
            <div className="bottomHalf">
                <TextField 
                    id="standard-number"
                    label={inCart ? `Added` : `Add Quantity`}
                    type="number"
                    onChange={addQuantity}
                    value={quantity || ''}
                    inputProps={{ min: 0 }}
                    className="quantityIcon"
                    size="small"
                    placeholder="0"
                />
                {
                    inCart ? <IconButton aria-label="delete" onClick={removeFromCart}><DeleteIcon  className="deleteIcon" /></IconButton> : <IconButton onClick={addToCart}><AddShoppingCartIcon className="cartIcon" /></IconButton>
                }
                {
                    error ? <span className="error">{error}</span> : null
                }
            </div> 
            
        </div>
    )
}

export default Product;