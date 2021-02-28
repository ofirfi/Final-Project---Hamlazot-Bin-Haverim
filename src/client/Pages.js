import LoginPage from './login_screen/login'
import RegistrationPage from './registration_screen/registration'
import PlacePage from './place_screen/place'
import MoviePage from './movie_screen/movie'
import UserPage from './user_screen/user'
import SearchPage from './search_screen/search'
import PageNotFound from './pageNotFound/pageNotFound'
import { useSelector } from 'react-redux'

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'


const Pages = () => {
    const logged = useSelector(state => state.logged)

    return <Router>
        {logged ?
            (
                <Switch>
                    <Route exact path="/" component={LoginPage} />
                    <Route exact path="/404" component={PageNotFound} />
                    <Route exact path="/signUp" component={RegistrationPage} />
                    <Route exact path="/place" component={PlacePage} />
                    <Route exact path="/movie" component={MoviePage} />
                    <Route exact path="/profile" component={UserPage} />
                    <Route exact path="/main" component={SearchPage} />
                    <Redirect to="/404" />
                </Switch>
            ) : (
                <Switch>
                    <Route exact path="/" component={LoginPage} />
                    <Route exact path="/signUp" component={RegistrationPage} />
                    <Redirect to="/" />
                </Switch>
            )}
    </Router>
}

export default Pages;