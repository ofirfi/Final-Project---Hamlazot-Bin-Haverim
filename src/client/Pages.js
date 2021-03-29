import React from 'react';
import LoginPage from './login_screen/login'
import RegistrationPage from './registration_screen/registration'
import PlacePage from './place_screen/place'
import MoviePage from './movie_screen/movie'
import ProfilePage from './profile_screen/profile'
import UserPage from './user_screen/user'
import SearchPage from './search_screen/search'
import PageNotFound from './pageNotFound/pageNotFound'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import checkAuth from './utils/auth'

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'




const Pages = () => {
    let log = useSelector(state => state.logged)
    let logged = checkAuth()
    useEffect(()=>{ 
        logged = checkAuth()
    })
    


    return <Router>
        {(logged||log) ?
            (
                <Switch>
                    <Route exact path="/" component={SearchPage} />
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/404" component={PageNotFound} />
                    <Route exact path="/signUp" component={RegistrationPage} />
                    <Route exact path="/place" component={PlacePage} />
                    <Route exact path="/movie/:id" component={MoviePage} />
                    <Route exact path="/profile" component={ProfilePage} />
                    <Route exact path="/user/:userName" component={UserPage} />
                    <Redirect to="/404" />
                </Switch>
            ) : (
                <Switch>
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/signUp" component={RegistrationPage} />
                    <Redirect to="/login" />
                </Switch>
            )}
    </Router>
}

export default Pages;