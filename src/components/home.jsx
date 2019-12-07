import React, { useState, useEffect, useContext } from 'react';
import { InfoContext } from './store';
import { Redirect } from 'react-router-dom';
import NavBar from './navbar';
import Product from './product';
import Axios from 'axios';
import '../stylesheets/base/home.scss';

function Home() {
    const [ products, setProducts ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState('');
    const [ appInfo, setAppInfo ] = useContext(InfoContext);
    const [ cart, setCart ] = useContext(InfoContext);

    
    if (window.localStorage.getItem('data') == null) {
        return <Redirect to='/' />;
    }

    useEffect(() => {
        const data = JSON.parse(window.localStorage.getItem('data'));
        const token = data.accessToken;
        setLoading(true);
        Axios.get('/allproducts', {
            headers: { 'Authorization': "bearer " + token }
        })
        .then((res) => {
            const data = res.data;
            const sortedData = data.sort((a, b) => a.name > b.name ? 1 : -1);
            setProducts(sortedData);
        })
        .catch(err => setError(err.response.data.message));
        setLoading(false);
    }, []);
    

    return (
        <div className="homeWrapper">
            <NavBar />
            {
                loading ? <div>Loading... </div> : null
            }
            {
                error ? <div>{error} </div> : null
            }
            <div className="productsWrapper">
                {
                    products.length > 0 ? 
                            products.map((product) => (
                                <Product key={product.id} product={product} cart={cart} setCart={setCart} />
                            ))
                    : null
                }
            </div>
        </div>
    );
}

export default Home;