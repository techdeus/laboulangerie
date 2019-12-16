import React, { useState, createContext } from 'react';

const CART = window.localStorage.getItem('cart') === null ? [] : JSON.parse(window.localStorage.getItem('cart'));
const USER_STORE = window.localStorage.getItem('data') === null ? {} : JSON.parse(window.localStorage.getItem('data'));

export const InfoContext = createContext(null);

export const InfoProvider = (props) => {
    const [ appInfo, setAppInfo ] = useState(USER_STORE);
    const [ cart, setCart ] = useState(CART);
    
    const store = {
        appInfo: [appInfo, setAppInfo],
        cart: [cart, setCart],
    };
    
    return (
        <InfoContext.Provider value={store}>
            { props.children }
        </InfoContext.Provider>
    );
};
