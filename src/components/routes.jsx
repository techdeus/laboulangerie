import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Home from './home';
import Login from './login';
import Error from './error';

function Routes() {
    return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/home" component={Home}/>
                    <Route component={Error} />
                </Switch>
            </BrowserRouter>
    );
}

export default Routes;