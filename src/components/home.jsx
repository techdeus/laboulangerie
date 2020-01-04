import React, { useState, useEffect, useContext } from 'react';
import { InfoContext } from './store';
import { Redirect } from 'react-router-dom';
import Product from './product';
import Loader from './loader';
import Axios from 'axios';
import '../stylesheets/base/home.scss';
import Radio from '@material-ui/core/Radio';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import Divider from '@material-ui/core/Divider';

function Home() {
    const [ products, setProducts ] = useState([]);
    const [ masterProducts, setMasterProducts ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState('');
    const [selectedValue, setSelectedValue] = useState('asc');
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const { appInfo, cart } = useContext(InfoContext);

    if (appInfo[0]['message'] !== "Logged In") {
        return <Redirect to='/' />;
    }

    useEffect(() => {
        const token = appInfo[0].accessToken;
        setLoading(true);
        Axios.get('/allproducts', {
            headers: { 'Authorization': "bearer " + token }
        })
            .then((res) => {
                const data = res.data;
                
                const categories = data.map((product) => {
                    return product.category;
                });
                
                const uniqueCategories = [...new Set(categories)].sort((a, b) => a > b ? 1 : -1);
                
                const sortedData = selectedValue === 'asc' ? data.sort((a, b) => a.name > b.name ? 1 : -1) : data.sort((a, b) => a.name < b.name ? 1 : -1) ;
                setCategories(uniqueCategories);
                setProducts(sortedData);
                setMasterProducts(data);
                setLoading(false);
            })
                .catch(err => setError(err.response.data.message));
    }, [selectedValue]);
    
    const handleChange = event => {
        setSelectedValue(event.target.value);
    }

    const selectCategory = event => {
        event.preventDefault();
        const currCategory = event.target.value;
        const filterProducts = masterProducts.filter((product) => {
            return product.category === currCategory;
        });
        setCategory(currCategory);
        setProducts(filterProducts);
        return;
    }

    const reset = () => {
        window.location.reload(true);
    };

    return (
        <div className="homeWrapper">
            {
                loading ? <div className="loaderWrapper"><Loader isLoading={loading} size="3rem" thickness={2} /> </div> : null
            }
            {
                error ? <div>{error} </div> : null
            }
            <div className="displayWrapper">
                <div className="sortWrapper">
                    <InputLabel htmlFor="radio-button">A-Z</InputLabel>
                    <Radio 
                        checked={selectedValue === 'asc'}
                        onChange={handleChange}
                        value="asc"
                        name="radio-button"
                        inputProps={{ 'aria-label': 'Ascending'}}
                    />
                    <InputLabel htmlFor="radio-button">Z-A</InputLabel>
                    <Radio 
                        checked={selectedValue === 'desc'}
                        onChange={handleChange}
                        value="desc"
                        name="radio-button"
                        inputProps={{ 'aria-label': 'Descending'}}
                    />
                </div>
                <Divider className="dividerIcon" orientation="vertical" />
                <div className="selectWrapper">
                    <InputLabel htmlFor="category-native-helper">Category</InputLabel>
                        <NativeSelect
                            className="nativeSelect"
                            value={category}
                            onChange={selectCategory}
                            inputProps={{
                                name: 'category',
                                id: 'category-native-helper',
                                className: 'nativeSelect',
                            }}
                        >
                            <option value="" />
                            {
                                categories.map((category, index) => (
                                    <option className="nativeSelect" key={index} value={category}>{category}</option>
                                ))
                            }
                        </NativeSelect>
                    </div>
                <Divider className="dividerIcon" orientation="vertical" />
                <div className="resetIcon">
                    <span className="resetText" onClick={() => reset()}>reset</span>
                </div>
            </div>
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