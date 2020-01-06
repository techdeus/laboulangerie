import React, { useContext, useEffect } from 'react';
import { InfoContext } from './store';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Home from './home';
import Login from './login';
import Error from './error';
import ChangePassword from './changepassword';
import NavBar from './navbar';
import Footer from './footer';

function Routes() {
    const { appInfo } = useContext(InfoContext);

    useEffect(() => {

    }, [appInfo[0]]);

    return (
            <BrowserRouter>
                {
                    appInfo[0]['message'] === "Logged In" ? <NavBar /> : null
                }
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/home" component={Home} />
                    <Route exact path="/passwordchange" component={ChangePassword} />
                    <Route component={Error} />
                </Switch>
                <Footer />
            </BrowserRouter>
    );
}

export default Routes;