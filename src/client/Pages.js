import react, { Component } from 'react';

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
    Redirect
} from 'react-router-dom'

import LoginPage from './login_screen/login'
import RegistrationPage from './registration_screen/registration'
import PlacePage from './place_screen/place'
import UserPage from './user_screen/user'
import SearchPage from './search_screen/search'
import PageNotFound from './pageNotFound/pageNotFound'



class Pages extends Component{
    render(){
        return <Router>
            <Switch>
            <Route exact path = "/" component = {LoginPage} />
            <Route exact path = "/404" component = {PageNotFound} />
            <Route exact path = "/signUp" component = {RegistrationPage} />
            <Route exact path = "/place" component = {PlacePage} />
            <Route exact path = "/profile" component = {UserPage} />
            <Route exact path = "/main" component = {SearchPage} />
            <Redirect to="/404"/>
            </Switch>
        </Router>
    }
}

export default Pages;