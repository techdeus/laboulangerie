import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import Loader from './loader';
import { InfoContext } from './store';
import '../stylesheets/base/dashboard.scss';
import ViewListIcon from '@material-ui/icons/ViewList';
import ListAltIcon from '@material-ui/icons/ListAlt';

function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState(['products', 'orders']);
    const [orders, setOrders] = useState('');
    const [products, setProducts] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();
    const { appInfo } = useContext(InfoContext);
    const { cart } = useContext(InfoContext);
    const currOrder = appInfo[0].order;
    
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
                updateCart();
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
        </div>
    );
}

export default Dashboard;