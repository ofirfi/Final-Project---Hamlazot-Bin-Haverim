import LoginPage from './login_screen/login'
import RegistrationPage from './registration_screen/registration'
import PlacePage from './place_screen/place'
import MoviePage from './movie_screen/movie'
import UserPage from './user_screen/user'
import SearchPage from './search_screen/search'
import PageNotFound from './pageNotFound/pageNotFound'
import { useEffect } from 'react'
import axios from 'axios'


import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'



const Pages = () => {

    let logged = window.localStorage.getItem('logged')    

    useEffect(()=>{
       checkAuth()
       logged = window.localStorage.getItem('logged')
    })
    
    const checkAuth = () => {
        const token = window.localStorage.getItem('token')
        axios.get('http://localhost:8001/auth/checkAuth',{
            headers:{
                Authorization: "Bearer "+ token
            }})
        .then(res=>{
            window.localStorage.setItem('logged',true)
            console.log(logged)
        })
        .catch(err=>{
            window.localStorage.setItem('logged',false)      
            console.log(logged)
        })
    }


    return <Router>
        {logged ?
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