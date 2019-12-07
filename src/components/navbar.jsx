import React, { Fragment, useState, useContext } from 'react';
import { InfoContext } from './store';
import { Redirect, useHistory } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Switch, FormControlLabel, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import '../stylesheets/components/navbar.scss';

const useStyles = makeStyles(theme => ({
    appBar: {
        top: 0,
        bottom: 'auto',
        background: '#1E56EB',
    }
}));

function NavBar() {
    const [ isLoggedIn, setLoggedIn ] = useState(true);
    const [ appInfo, setAppInfo ] = useContext(InfoContext); 
    const [ cart, setCart ] = useContext(InfoContext); 
    const classes = useStyles();
    const history = useHistory();
    
    const logout = () => {
        window.localStorage.clear();
        setAppInfo({});
        setCart([]);
        setLoggedIn(false);
        history.push('/');
    };

    return (
        <Fragment>
            <AppBar className={classes.appBar}>
                <Toolbar className="navtoolbar">
                    <IconButton edge="start" color="inherit" aria-label="open drawer">
                        <MenuIcon />
                    </IconButton>
                    
                    <IconButton edge="end">
                        <FormControlLabel
                            control={<Switch color="secondary" checked={isLoggedIn} aria-label="login switch" onChange={logout} />}
                            label={true ? 'Logout': null}
                        />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Fragment>
    );
}

export default NavBar;