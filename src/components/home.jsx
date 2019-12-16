import React, { useState, useEffect, useContext } from 'react';
import { InfoContext } from './store';
import { Redirect } from 'react-router-dom';
import NavBar from './navbar';
import Product from './product';
import Loader from './loader';
import Axios from 'axios';
import '../stylesheets/base/home.scss';

function Home() {
    const [ products, setProducts ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState('');
    const { appInfo } = useContext(InfoContext);
    const { cart } = useContext(InfoContext);
    
    if (appInfo[0]['message'] !== "Logged In") {
        return <Redirect to='/' />;
    }
    // if (window.localStorage.getItem('data') == null) {
    //     return <Redirect to='/' />;
    // }

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
                setLoading(false);
            })
                .catch(err => setError(err.response.data.message));
    }, []);
    

    return (
        <div className="homeWrapper">
            <NavBar />
            {
                loading ? <div className="loaderWrapper"><Loader isLoading={loading} size="3rem" thickness={2} /> </div> : null
            }
            {
                error ? <div>{error} </div> : null
            }
            <div className="productsWrapper">
                {
                    products.length > 0 ? 
                            products.map((product) => (
                                <Product key={product.id} product={product} cart={cart[0]} setCart={cart[1]} />
                            ))
                    : null
                }
            </div>
        </div>
    );
}

export default Home;