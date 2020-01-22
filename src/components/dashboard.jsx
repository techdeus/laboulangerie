import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useHistory, Redirect } from 'react-router-dom';
import Loader from './loader';
import { InfoContext } from './store';
import '../stylesheets/base/dashboard.scss';
import { Modal } from '@material-ui/core';
import ViewListIcon from '@material-ui/icons/ViewList';
import ListAltIcon from '@material-ui/icons/ListAlt';

function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState(['products', 'orders']);
    const [orders, setOrders] = useState('');
    const [products, setProducts] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const history = useHistory();
    const { appInfo } = useContext(InfoContext);
    const { cart } = useContext(InfoContext);
    const currOrder = appInfo[0].order;
    
    if (appInfo[0]['message'] !== "Logged In") {
        return <Redirect to='/' />;
    }

    useEffect(() => {
        const token = appInfo[0].accessToken;
        const storeID = appInfo[0].store.id;

        Axios.post('/dashboard',  
            {store_id: storeID},
            {headers: { 'Authorization': "bearer " + token }}
        )
            .then((res) => {
                setOrders(res.data.ordersLength);
                setProducts(res.data.productsLength);
                
                if (!appInfo[0].user.superuser && currOrder.isOrdered === false) {
                    checkOrder();
                } else if (!appInfo[0].user.superuser) {
                    updateCart();
                }

                setLoading(false);
            })
                .catch(err => setError(err.data.response.message));

    }, []);

    const goLink = (url) => {
        return history.push(`/${url}`);
    };

    const updateCart = () => {
        let orderProducts;
        if (currOrder.isOrdered && cart[0].length === 0) {
            orderProducts = JSON.parse(currOrder.products);
            cart[1](orderProducts);
            window.localStorage.setItem('cart', JSON.stringify(orderProducts));
        }
    };

    const checkOrder = () => {
        if (!currOrder.isOrdered) {
            setShowModal(true);
        }
    };

    const repeatOrder = () => {
        const token = appInfo[0].accessToken;
        const storeID = appInfo[0].store.id;

        Axios.post('/allOrders',  
            {store_id: storeID},
            {headers: { 'Authorization': "bearer " + token }}
        )
            .then((res) => {
                setLoading(true);
                let orders = res.data.orders;
                let lastWeekOrder = orders.filter((order) => order.weekOfYear === currOrder.weekOfYear - 1);
                
                cart[1](lastWeekOrder.products);
                window.localStorage.setItem('cart', JSON.stringify(lastWeekOrder.products));
                setLoading(false);
            })
                .catch(err => setError(err.data.response.message));
    };

    return (
        <div className="dashboardWrapper">
            {
                items.map((item, index) => (
                    <div key={index} className="dashitemWrapper" role="button" onClick={() => goLink(`${item}`)}>
                        <div className="dash-name">{item}</div>
                        <div className="dash-metric">{item === 'orders' ? orders : products}</div>
                        <div className="dash-circle">
                            {
                                item === 'products' ? <ViewListIcon className="dash-image" /> : <ListAltIcon className="dash-image" />
                            }
                        </div>
                        <div className="dash-view">view</div>
                    </div>
                ))
            }
            {
                loading ? <Loader isLoading={loading} size="4rem" thickness={2} /> : null
            }
            {
                error ? <div className="error">{error}</div> : null
            }
            {
                showModal 
                ? 
                    <Modal open className="repeatOrderModal"> 
                        <div className="modalContainer">
                            <h2 className="modalTitle">would you like to add products from last week's order?</h2>
                            <div className="modalBottomContainer">
                                <button className="modalButton primary" onClick={repeatOrder}>add products</button>
                                <button className="modalButton" onClick={() => setShowModal(false)}>no</button>
                            </div>
                        </div>
                    </Modal> 
                : null
            }
        </div>
    );
}

export default Dashboard;