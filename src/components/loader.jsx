import React from 'react';
import { CircularProgress } from '@material-ui/core';

function Loader({ isLoading, size, thickness }) {
    if (isLoading) {
        return (
            <div className="internalLoaderWrapper">
                <CircularProgress className="loader" variant="indeterminate" thickness={thickness} size={size} />
            </div>
        );
    }
    return <></>;
}

export default Loader;