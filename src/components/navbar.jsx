import React, { Fragment, useState, useContext } from 'react';
import { InfoContext } from './store';
import Cart from './cart';
import { useHistory } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Switch, FormControlLabel, FormControl, Typography, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import ViewListIcon from '@material-ui/icons/ViewList';
import LockIcon from '@material-ui/icons/Lock';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import '../stylesheets/components/navbar.scss';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    appBar: {
        top: 0,
        bottom: 'auto',
        background: '#1E56EB',
        position: 'relative',
    },
    drawer: {
        width: drawerWidth,
    },
    drawerPaper: {
        width: drawerWidth,
    }
}));

function NavBar() {
    const [ isLoggedIn, setLoggedIn ] = useState(true);
    const [ open, setOpen ] = useState(false);
    const { appInfo, cart } = useContext(InfoContext);
    const [ showCart, setShowCart ] = useState(false);
    const classes = useStyles();
    const history = useHistory();
    const store = appInfo[0].store;
    const user = appInfo[0].user;

    const logout = () => {
        window.localStorage.clear();
        appInfo[1]({});
        cart[1]([]);
        setLoggedIn(false);
        history.push('/');
    };

    const goLink = (url) => {
        handleDrawerClose();
        history.push(`/${url}`);
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
                    <Typography noWrap variant="h6" className="navContent navStore">Store: {store.name} </Typography>
                    <Typography noWrap variant="h6" className="navUser">User: {user.username} </Typography>
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
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            > 
                <div className="drawerHeader">
                    <div className="headerStore">Store: {store.name}</div>
                    <IconButton onClick={handleDrawerClose}>
                        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List className="list">
                    <ListItem button key="home" onClick={() => goLink("home")}>
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary="home" />
                    </ListItem>
                    <ListItem button key="orders" onClick={() => goLink("orders")}>
                        <ListItemIcon><ViewListIcon /></ListItemIcon>
                        <ListItemText primary="orders" />
                    </ListItem>
                    <Divider />
                    <ListItem button key="change password" onClick={() => goLink("changepassword")}>
                        <ListItemIcon><LockIcon /></ListItemIcon>
                        <ListItemText primary="change password" />
                    </ListItem>
                    <ListItem button key="logout" onClick={logout}>
                        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                        <ListItemText primary="logout" />
                    </ListItem>
                </List>
            </Drawer>
        </Fragment>
    );
}

export default NavBar;