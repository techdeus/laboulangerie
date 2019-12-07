import React, { useState } from 'react';
import '../stylesheets/components/product.scss';
import { Add, ShoppingCart } from '@material-ui/icons';
import { TextField } from '@material-ui/core';

function Product({ product, cart, setCart }) {
    const [ quantity, setQuantity ] = useState(0);
    const [ showDetails, setShowDetails ] = useState(false);
    const [ inCart, addInCart] = useState(false);

    const handleShow = () => {
        setShowDetails(true);
    };

    const addQuantity = (e) => {
        const value = e.target.value;
        setQuantity(value);
    }

    const addToCart = () => {
        addInCart(true)
        setCart([...cart, {product, quantity: quantity}]) 
    };

    return (
        <div className="productWrapper">
            <div className="productName">{product.name}</div>
            <div className="productPrice">${product.price}</div>
            {
                showDetails ? 
                <div>
                    <TextField 
                        id="standard-number"
                        label="Add Quantity"
                        type="number"
                        onChange={addQuantity}
                        value={quantity}
                        className="quantityIcon"
                    />
                    <ShoppingCart onClick={addToCart} fontSize="large" className="cartIcon" />
                </div> 
                : 
                <Add fontSize="large" onClick={handleShow} className="addIcon" />
            }
        </div>
    )
}

export default Product;