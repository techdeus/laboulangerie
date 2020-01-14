import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import Loader from './loader';
import '../stylesheets/base/dashboard.scss';
import ViewListIcon from '@material-ui/icons/ViewList';
import ListAltIcon from '@material-ui/icons/ListAlt';

function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState(['products', 'orders']);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        Axios.get('/dashboard')
            .then((res) => {
                setOrders(res.data.orders);
                setProducts(res.data.products);
                setLoading(false);
            })
                .catch(err => setError(err.data.response.message));

    }, []);

    const goLink = (url) => {
        return history.push(`/${url}`);
    };

    return (
        <div className="dashboardWrapper">
            {
                items.map((item, index) => (
                    <div key={index} className="dashitemWrapper" role="button" onClick={() => goLink(`${item}`)}>
                        <div className="dash-name">{item}</div>
                        <div className="dash-metric">{item.length}</div>
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