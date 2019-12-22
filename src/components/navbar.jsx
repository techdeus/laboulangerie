import React, { Fragment, useState, useContext } from 'react';
import { InfoContext } from './store';
import Cart from './cart';
import { useHistory } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Switch, FormControlLabel, FormControl, Typography, Drawer, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import '../stylesheets/components/navbar.scss';

const useStyles = makeStyles(theme => ({
    appBar: {
        top: 0,
        bottom: 'auto',
        background: '#1E56EB',
        position: 'relative',
    }
}));

function NavBar() {
    const [ isLoggedIn, setLoggedIn ] = useState(true);
    const [ open, setOpen ] = useState(false);
    const { appInfo } = useContext(InfoContext);
    const { cart } = useContext(InfoContext);
    const [ showCart, setShowCart ] = useState(false);
    const classes = useStyles();
    const history = useHistory();
    const store = JSON.parse(window.localStorage.getItem('data')).store.name;
    const user = JSON.parse(window.localStorage.getItem('data')).user.username;

    const logout = () => {
        window.localStorage.clear();
        appInfo[1]({});
        cart[1]([]);
        setLoggedIn(false);
        history.push('/');
    };

    const viewCart = () => {
        setShowCart(prevState => !prevState);
        return;
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <AppBar className={classes.appBar}>
                <Cart showCart={showCart} setShowCart={setShowCart} />
                <Toolbar className="navtoolbar">
                    <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={handleDrawerOpen}>
                        <MenuIcon />
                    </IconButton>
                    <Typography noWrap variant="h6" className="navContent navStore">Store: {store} </Typography>
                    <Typography noWrap variant="h6" className="navUser">User: {user} </Typography>
                    <Typography noWrap variant="h6" className="navContent navOpenCart" onClick={viewCart}>Items in Cart: {cart[0].length}</Typography>
                    <IconButton edge="end">
                        <FormControlLabel
                            control={<Switch color="secondary" checked={isLoggedIn} aria-label="login switch" onChange={logout} />}
                            label={true ? 'Logout': null}
                        />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                className="drawer"
                variant="persistent"
                anchor="left"
                open={open}
            > 
                <div className="drawerHeader">
                    <IconButton onClick={handleDrawerClose}>
                        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
            </Drawer>
        </Fragment>
    );
}

export default NavBar;