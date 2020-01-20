import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../stylesheets/components/orders.scss';
import { InfoContext } from './store';
import Loader from './loader';
import format from 'date-fns/format';
import { TextField, Fab, Divider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import UpdateIcon from '@material-ui/icons/Update';
import Axios from 'axios';

function Order({ order, defaultShowOrder, canEditOrder }) {
    const [products, setProducts] = useState(JSON.parse(order.products) || []);
    const [editOrder, setEditOrder] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showOrder, setShowOrder] = useState(defaultShowOrder);
    const [storeInfo, setStoreInfo] = useState(null);
    const [total, setTotal] = useState(0.00);
    const { appInfo } = useContext(InfoContext);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [madeChanges, setMadeChanges] = useState(false);
    const history = useHistory();
    const user = appInfo[0].user;
    const store = appInfo[0].store;
    
    useEffect(() => {
        let subTotal = parseFloat(0.00);
        products.forEach(({ product, totalQuantity }) => {
            let currTotal = parseFloat((product.price * totalQuantity));
            subTotal += currTotal;
        });
        setTotal(subTotal.toFixed(2));
    }, [products]);

    useEffect(() => {
        if (user.superuser) {
            const findStore = store.find((eachStore) => {
                return eachStore.id === order.store_id;
            });
            setStoreInfo(findStore);
        }
    }, []);
    const toggleEditOrder = () => {
        if (!canEditOrder) return;
        setEditOrder(prevState => !prevState);
    };

    const postUpdateOrder = () => {
        const redirect = setTimeout(() => {
            setEditOrder(false);
            setMessage('');
            setShowOrder(false);
            history.push('/');
        }, 5000);
        return () => {
            clearTimeout(redirect);
        }
    }

    const updateOrder = (e) => {
        const productId = parseInt(e.target.name.split('-')[0]);
        
        const day = e.target.name.split('-')[1];
        
        const value = e.target.value || 0;
        const product = products.find(({product}, index) => {
            return product.id === productId;
        });
        
        const updateProductQuantity = {...product.quantity, [day]: parseInt(value) || '' };
        
        const updateTotalQuantity = Object.values(updateProductQuantity).reduce((acc, curr) => {
            if (curr === '') {
                return acc + 0;
            } else {
                return acc + curr;
            }
        }, 0);
        
        const updateProduct = {...product, totalQuantity: updateTotalQuantity, quantity: updateProductQuantity};
        
        const findProductIndex = products.findIndex((product) => product.product.id === productId);
        
        const updatedProducts = [...products];
        updatedProducts[findProductIndex] = updateProduct;
        if (!madeChanges) {
            setMadeChanges(true);
        }
        setProducts([...updatedProducts]);
    };

    const processOrder = async (e) => {
        if (!madeChanges) {
            setMessage('You have not updated the Order');
            return;
        }
        e.preventDefault();
        if (message) setMessage('');
        const token = appInfo[0].accessToken;
        setLoading(true);
        const totalOrder = {
            products: products,
            order: order,
            date: new Date(Date.now()),
        };

        try {
            const results = await Axios.put('/updateOrder', totalOrder, 
                {
                    headers: { 'Authorization': "bearer " + token }
                });
            
            if (results.data.msg) {
                const currStorage = JSON.parse(window.localStorage.getItem('data'));
                const updateStorage = {...currStorage, order: results.data.updatedOrder };
                window.localStorage.setItem('data', JSON.stringify(updateStorage));
                setLoading(false);
                // set the message from server
                setMessage(results.data.msg);
                postUpdateOrder();
            }
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    if (!order.isOrdered) {
        return (
            <div className="orderContainer">
                <div className="showOrderContainer">
                    {user.superuser && storeInfo 
                        ? 
                            <div className="showOrderStoreName">{storeInfo.name}: no order placed this week!</div> 
                        : 
                            <div>You have not placed a order for this week!</div>
                    }
                    
                </div>
            </div>
        )
    }

    return (
        <div className="orderContainer">    
            <div className="showOrderContainer" role="button" onClick={() => setShowOrder(prevState => !prevState)}>
                {user.superuser && storeInfo ? <div className="showOrderStoreName">Store: {storeInfo.name}</div> : null}
                <div className="showOrderWeek">Week: {order.weekOfYear}</div>
                <div className="showOrderDate">{format(Date.parse(order.begDayOfWeek), 'MM/dd/yyyy')}</div>
                <span className="showOrderDash">-</span>
                <div className="showOrderDate">{format(Date.parse(order.lastDayOfWeek), 'MM/dd/yyyy')}</div>
                <i className={(showOrder) ? `arrowDown` : `arrowUp`}></i>
            </div>
            {
                showOrder && (
                    <>
                    <div className="showOrderOptions">
                        <div className="dateOrdered"><span>Date Ordered:</span>{format(Date.parse(order.date), 'MM/dd/yyyy')}</div>
                        <div className="totalPriceOrdered"><span>Total Order Cost:</span>${total}</div>
                        <Fab className={(editOrder) ? `orderEditIcon highlightEdit` :`orderEditIcon`} onClick={toggleEditOrder}><EditIcon /></Fab>
                        <Fab className={(editOrder) ? `orderUpdateIcon highlightFab` :`orderUpdateIcon`} onClick={processOrder}><UpdateIcon /></Fab>
                    </div>
                    <div className="orderDynamicOptions">
                    {
                        loading ? <Loader isLoading={loading} size="2rem" thickness={2} /> : null
                    }
                    {
                        error ? <div className="error">{error}</div> : null
                    }
                    {
                        message ? <div className="updateOrderSuccessMessage">updated</div> : null
                    }
                    </div>
                    <>
                        {
                            products.map(({product, quantity, totalQuantity }) => (
                                <div className="showOrderProductsContainer" key={product.id}>
                                    <div className="showOrderProductsHeader">
                                        <div className="productName">{product.name}</div>
                                        <div className="productCategory">{product.category}</div>
                                        <div className="orderTotalQuantity">{totalQuantity}</div>
                                        
                                        <div className="orderTotalPrice">${(totalQuantity * product.price).toFixed(2)}</div>
                                        </div>
                                    <Divider className="divider" />
                                    <div className="showOrderProductsFooter">
                                        <TextField 
                                            id="standard-number"
                                            label="Mon"
                                            type="number"
                                            onChange={updateOrder}
                                            value={quantity.monday}
                                            inputProps={{ min: 0, readOnly: !editOrder }}
                                            size="small"
                                            placeholder="0"
                                            name={`${product.id}-monday`}
                                        />
                                        <TextField 
                                            id="standard-number"
                                            label="Tue"
                                            type="number"
                                            onChange={updateOrder}
                                            value={quantity.tuesday}
                                            inputProps={{ min: 0, readOnly: !editOrder }}
                                            size="small"
                                            placeholder="0"
                                            name={`${product.id}-tuesday`}
                                        /> 
                                        <TextField 
                                            id="standard-number"
                                            label="Wed"
                                            type="number"
                                            onChange={updateOrder}
                                            value={quantity.wednesday}
                                            inputProps={{ min: 0, readOnly: !editOrder }}
                                            size="small"
                                            placeholder="0"
                                            name={`${product.id}-wednesday`}
                                        />
                                        <TextField 
                                            id="standard-number"
                                            label="Thur"
                                            type="number"
                                            onChange={updateOrder}
                                            value={quantity.thursday}
                                            inputProps={{ min: 0, readOnly: !editOrder }}
                                            size="small"
                                            placeholder="0"
                                            name={`${product.id}-thursday`}
                                        /> 
                                        <TextField 
                                            id="standard-number"
                                            label="Fri"
                                            type="number"
                                            onChange={updateOrder}
                                            value={quantity.friday}
                                            inputProps={{ min: 0, readOnly: !editOrder }}
                                            size="small"
                                            placeholder="0"
                                            name={`${product.id}-friday`}
                                        />
                                        <TextField 
                                            id="standard-number"
                                            label="Sat"
                                            type="number"
                                            onChange={updateOrder}
                                            value={quantity.saturday}
                                            inputProps={{ min: 0, readOnly: !editOrder }}
                                            size="small"
                                            placeholder="0"
                                            name={`${product.id}-saturday`}
                                        />
                                        <TextField 
                                            id="standard-number"
                                            label="Sun"
                                            type="number"
                                            onChange={updateOrder}
                                            value={quantity.sunday}
                                            inputProps={{ min: 0, readOnly: !editOrder }}
                                            size="small"
                                            placeholder="0"
                                            name={`${product.id}-sunday`}
                                        />
                                    </div>
                                </div>
                            ))
                        }
                    </>
                </>
                )
            }
        </div>
    )
}

export default Order;