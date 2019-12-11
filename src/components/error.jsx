import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../stylesheets/components/error.scss';

function Error() {
    const history = useHistory();
    useEffect(() => {
        const timeout = setTimeout(() => {
            history.push('/');
        }, 8000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="errorWrapper">
            <div className="errorTitle">You landed in space!</div>
            <img className="errorBanner" src="/img/assets/space.jpg" alt="SpaceShip" />
        </div>
    );
};

export default Error;