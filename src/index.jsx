import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './components/routes';
import { InfoProvider } from './components/store';

const App = () => (
    <Routes />
);

const domContainer = document.querySelector('#root');
ReactDOM.render(
<InfoProvider>
    <App />
</InfoProvider>
, domContainer);