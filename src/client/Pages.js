import LoginPage from './login_screen/login'
import RegistrationPage from './registration_screen/registration'
import PlacePage from './place_screen/place'
import MoviePage from './movie_screen/movie'
import UserPage from './user_screen/user'
import SearchPage from './search_screen/search'
import PageNotFound from './pageNotFound/pageNotFound'
import { useEffect } from 'react'

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'


const Pages = () => {

    let log = JSON.parse(window.localStorage.getItem('logged'))
    useEffect(()=>{
        log = JSON.parse(window.localStorage.getItem('logged'))
    })
    
    return <Router>
        {log ?
            (
                <Switch>
                    <Route exact path="/" component={SearchPage} />
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/404" component={PageNotFound} />
                    <Route exact path="/signUp" component={RegistrationPage} />
                    <Route exact path="/place" component={PlacePage} />
                    <Route exact path="/movie" component={MoviePage} />
                    <Route exact path="/profile" component={UserPage} />
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