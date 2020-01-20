import React, { useContext, useEffect, useState } from 'react';
import '../stylesheets/components/orders.scss';
import Order from './order';
import { InfoContext } from './store';
import Loader from './loader';
import Axios from 'axios';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { appInfo } = useContext(InfoContext);
    const currOrder = appInfo[0].order;
    const store = appInfo[0].store;
    const user = appInfo[0].user;

    useEffect(() => {
        setLoading(true);
        const token = appInfo[0].accessToken;
        const data = {
            store_id: store.id,
            super_user: user.superuser
        };
        Axios.post('/allOrders',
            data,
            { headers: { 'Authorization': "bearer " + token } }
        ) 
            .then((res) => {
                setOrders(res.data.orders);
                setLoading(false);
            })
                
                .catch(err => {
                    setLoading(false);
                    setError(err.response.data.message)
                });
    }, []);
    
    return (
        <div className="orderWrapper">
            <h1 className="orderTitle">Upcoming Order</h1>
                {
                    user.superuser ? currOrder.map((storeOrder) => (
                        <Order order={storeOrder} defaultShowOrder={false} canEditOrder={true} />
                        )) : <Order order={currOrder} defaultShowOrder={false} canEditOrder={true} />
                }
            <h1 className="orderTitle">Previous Orders</h1>
                {
                    orders ? 
                        <div className="subTitle">you have no previous orders</div> 
                    : 
                        orders.map((order, index) => {
                            if (index === 0) {
                                null;
                            } else {
                                <Order order={order} defaultShowOrder={false} canEditOrder={false} />
                            }
                    })
                }
            <div className="orderDynamicOptions">
                {
                    loading ? <Loader isLoading={loading} size="4rem" thickness={2} /> : null
                }
                {
                    error ? <div className="error">{error}</div> : null
                }
            </div>
        </div>
    );
}

export default Orders;