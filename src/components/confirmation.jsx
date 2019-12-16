import React, { Fragment, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../stylesheets/components/cart.scss';

function Confirmation({ msg, setShowCart, setOrder }) {
    const history = useHistory();

    useEffect(() => {
        const redirect = setTimeout(() => {
            setShowCart(false);
            setOrder(false);
            window.location.reload(true);
        }, 5000);
        return () => {
            clearTimeout(redirect);
        }
    }, [])
    return (
        <Fragment>
            <div className="confirmationMsg">{msg}</div>
            <div className="confSuccessPicture" />
        </Fragment>
    );
}

export default Confirmation;