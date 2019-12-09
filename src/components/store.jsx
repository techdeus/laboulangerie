import React, { useState, useEffect, createContext } from 'react';

export const InfoContext = createContext(null);

export const InfoProvider = (props) => {
    const [appInfo, setAppInfo] = useState({});
    const [ cart, setCart ] = useState([]);
    const store = {
        appInfo: [appInfo, setAppInfo],
        cart: [cart, setCart],
    }
    useEffect(() => {
        if (window.localStorage.getItem('data')) {
            const data = JSON.parse(window.localStorage.getItem('data'));
            setAppInfo(data);
        }
        if (window.localStorage.getItem('cart')) {
            const cartData = JSON.parse(window.localStorage.getItem('cart'));
            setCart(cartData);
        }
    }, []);
    
    return (
        <InfoContext.Provider value={store}>
            { props.children }
        </InfoContext.Provider>
    )
};
