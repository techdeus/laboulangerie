import React, { Fragment } from 'react';
import '../stylesheets/components/cart.scss';

function Confirmation({ msg }) {
    return (
        <Fragment>
            <div className="confirmationMsg">{msg}</div>
            <div className="confSuccessPicture" />
        </Fragment>
    );
}

export default Confirmation;