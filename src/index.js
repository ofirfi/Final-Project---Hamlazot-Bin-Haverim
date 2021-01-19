import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './client/new_login_screen/login'
import Registration from './client/new_registration_screen/registration'
import Search from './client/search_screen/search'
//import App from './client/login-registration_switch/App'
import User from './client/user_screen/user'
import Place from './client/place_screen/place';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Login />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();