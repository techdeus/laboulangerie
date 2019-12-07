import React, { useState } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Home from './home';
import Login from './login';

function Routes() {
    return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/home" component={Home}/>
                </Switch>
            </BrowserRouter>
    );
}

export default Routes;