import React, { useContext } from 'react';
import { InfoContext } from './store';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Home from './home';
import Login from './login';
import Error from './error';
import NavBar from './navbar';

function Routes() {
    const { appInfo } = useContext(InfoContext);
    
    return (
            <BrowserRouter>
                {
                    appInfo[0]['message'] === "Logged In" ? <NavBar /> : null
                }
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/home" component={Home}/>
                    <Route component={Error} />
                </Switch>
            </BrowserRouter>
    );
}

export default Routes;