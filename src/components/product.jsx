import React, { useState, useEffect } from 'react';
import '../stylesheets/components/product.scss';
import { IconButton } from '@material-ui/core';
import AddIcon  from '@material-ui/icons/add';
import DeleteIcon  from '@material-ui/icons/Delete';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { TextField, Fab } from '@material-ui/core';

function Product({ product, cart, setCart }) {
    const [ quantity, setQuantity ] = useState({monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0, sunday: 0 });
    const [ totalQuantity, setTotalQuantity ] = useState(0);
    const [ showDetails, setShowDetails ] = useState(false);
    const [ inCart, addInCart] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        cart.forEach((item) => {
            if (item.product.id === product.id) {
                setQuantity(item.quantity);
                setTotalQuantity(item.totalQuantity);
                addInCart(true);
                // setShowDetails(true);
            }
        });
    }, [cart]);

    const handleShow = () => {
        setShowDetails(prevState => !prevState);
    };

    const addQuantity = (e) => {
        const value = parseInt(e.target.value) || 0;
        const day = e.target.name;
        
        if (inCart) {
            addInCart(false);
            setShowDetails(true);
        }
        
        const currQuantities = {...quantity, [day]: value};
        setQuantity(currQuantities);
        const currTotal = calculateTotal(currQuantities);
        setTotalQuantity(currTotal);
    }

    const calculateTotal = (obj) => {
        let total = 0;
        for (let day of Object.values(obj)) {
            if (day === '') {
                total += 0;    
            } else {
                total += day;
            }
        }
        return total;
    };

    const addToCart = () => {
        if (totalQuantity <= 0) {
            setError('Add Quantity');
            return;
        } else {
            const isCart = cart.find(item => (item.product.id === product.id));
            if (isCart) {
                const newCart = cart.filter((item) => {
                    return item.product.id !== product.id;
                });
                addInCart(true);
                setError('');
                setCart([...newCart, {product, quantity, totalQuantity}]);
                window.localStorage.setItem('cart', JSON.stringify([...newCart, {product, quantity, totalQuantity}]));
            } else {
                addInCart(true);
                setError('');
                setCart([...cart, {product, quantity, totalQuantity}]);
                window.localStorage.setItem('cart', JSON.stringify([...cart, {product, quantity, totalQuantity}]));
            }
            setTimeout(() => {
                setShowDetails(false);
            }, 10000);
        }
    };

    const removeFromCart = () => {
        addInCart(false);
        setShowDetails(false);
        setQuantity({monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0, sunday: 0});
        setTotalQuantity(0);

        const newCart = cart.filter((item) => {
            return item.product.id !== product.id;
        });

        setCart(newCart);
        window.localStorage.setItem('cart', JSON.stringify(newCart));
    };

    if (!showDetails) {
        return (
            <div className={inCart ? `productWrapper inCart` : `productWrapper`}>
                <div className="topHalfWrapper">
                    <div className="productName">{product.name}</div>
                    <div className="productPrice">${product.price}</div>
                    <div className="productCategory">({product.category})</div>
                </div>
                <div className="bottomHalf">
                    {
                        inCart 
                        ? 
                        <>
                            <span>Item Added</span>
                            <Fab size="small" color="secondary" aria-label="add" onClick={handleShow} className="addIcon">
                                <AddIcon />
                            </Fab>
                            </>
                        :
                        <>
                            <span>Add To Cart</span>
                            <Fab size="small" color="primary" aria-label="add" onClick={handleShow} className="addIcon">
                                <AddIcon />
                            </Fab>
                        </>
                    }
                </div>
            </div>
        );
    }

    return (
        <div className={inCart ? `productWrapper extendWrapper inCart` : `productWrapper extendWrapper`}>
            <div className="topHalfWrapper">
                <div className="productName">{product.name}</div>
                <div className="productPrice">${product.price}</div>
                <div className="productCategory">({product.category})</div>
            </div>
            <div className="bottomHalfWrapper">
                <div className="bottomHalfLeft">
                    <TextField 
                        id="standard-number"
                        label={quantity.monday !== 0 ? `Added` : `Add Mon`}
                        type="number"
                        onChange={addQuantity}
                        value={quantity.monday || ''}
                        inputProps={{ min: 0 }}
                        className="quantityIcon"
                        size="small"
                        placeholder="0"
                        name="monday"
                    />
                    <TextField 
                        id="standard-number"
                        label={quantity.tuesday !== 0 ? `Added` : `Add Tue`}
                        type="number"
                        onChange={addQuantity}
                        value={quantity.tuesday || ''}
                        inputProps={{ min: 0 }}
                        className="quantityIcon"
                        size="small"
                        placeholder="0"
                        name="tuesday"
                    />
                    <TextField 
                        id="standard-number"
                        label={quantity.wednesday !== 0 ? `Added` : `Add Wed`}
                        type="number"
                        onChange={addQuantity}
                        value={quantity.wednesday || ''}
                        inputProps={{ min: 0 }}
                        className="quantityIcon"
                        size="small"
                        placeholder="0"
                        name="wednesday"
                    />
                    <TextField 
                        id="standard-number"
                        label={quantity.thursday !== 0 ? `Added` : `Add Thur`}
                        type="number"
                        onChange={addQuantity}
                        value={quantity.thursday || ''}
                        inputProps={{ min: 0 }}
                        className="quantityIcon"
                        size="small"
                        placeholder="0"
                        name="thursday"
                    />
                    <TextField 
                        id="standard-number"
                        label={quantity.friday !== 0 ? `Added` : `Add Fri`}
                        type="number"
                        onChange={addQuantity}
                        value={quantity.friday || ''}
                        inputProps={{ min: 0 }}
                        className="quantityIcon"
                        size="small"
                        placeholder="0"
                        name="friday"
                    />
                    <TextField 
                        id="standard-number"
                        label={quantity.saturday !== 0 ? `Added` : `Add Sat`}
                        type="number"
                        onChange={addQuantity}
                        value={quantity.saturday || ''}
                        inputProps={{ min: 0 }}
                        className="quantityIcon"
                        size="small"
                        placeholder="0"
                        name="saturday"
                    />
                    <TextField 
                        id="standard-number"
                        label={quantity.sunday !== 0 ? `Added` : `Add Sun`}
                        type="number"
                        onChange={addQuantity}
                        value={quantity.sunday || ''}
                        inputProps={{ min: 0 }}
                        className="quantityIcon"
                        size="small"
                        placeholder="0"
                        name="sunday"
                    />
                </div>
                <div className="bottomHalfRight">
                    {
                        inCart ? 
                            <IconButton aria-label="delete" onClick={removeFromCart}><DeleteIcon  className="deleteIcon" /></IconButton> 
                        : 
                            <IconButton onClick={addToCart}><AddShoppingCartIcon className="cartIcon" /></IconButton>
                    }
                    <span className="totalQuantity">{totalQuantity}</span>
                </div>
                {
                    error ? <span className="error">{error}</span> : null
                }
            </div> 
        </div>
    );
}

export default Product;