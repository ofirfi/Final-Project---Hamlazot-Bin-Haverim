import '../utils/style.css'
import Header from '../images/logo.jpg'
import { GiExitDoor, GiMagnifyingGlass } from 'react-icons/gi'
import { FcSettings, FcHome } from 'react-icons/fc'
import { CgMenuBoxed } from 'react-icons/cg'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import checkAuth from '../utils/auth'

export function Navbar(props) {
    const userName = window.localStorage.getItem('userName')
    const history = useHistory();
    const dispatch = useDispatch();


    const clear = () => {
        window.localStorage.removeItem('userName');
        window.localStorage.removeItem('recommendations');
        window.localStorage.removeItem('token');
        dispatch({ type: "SETLOGGED", payload: false });
    }

    const log_out = () => {
        alert('להתראות ' + userName + ' מקווים לראותך שוב!');
        clear();
        history.push('/login');
    }

    const tokenIsValid = () => {
        if (!checkAuth()) {
            clear();
            alert('פג תוקף ההתחברות, אנא התחבר שוב');
            return false
        }
        return true
    }

    const profilePage = () => !tokenIsValid() ? history.push('/login') : history.push('/profile')

    const homePage = () => !tokenIsValid() ? history.push('/login') : history.push('')

    const search = () => !tokenIsValid() ? history.push('/login') : alert('search is not ready yet')




return (
    <div className="flex items-start h-28 sm:h-28 lg:h-52 w-full"
        style={{ backgroundImage: `url(${Header})`, backgroundSize: '100% 100%' }}
    >
        <div className="invisible sm:visible w-full flex justify-end self-start space-x-2 mt-8 mr-5 ">
            <button className="text-blue-900"
                onClick={search}
            >
                <GiMagnifyingGlass className="sm:text-2xl md:text-3xl lg:text-4xl" />
            </button>

            <input className="flex w-1/5 rounded-xl text-xs text-center self-center"
                type="text"
                placeholder="חפש המלצות על מסעדות, הצגות, סרטים וספרים"
            />

            <button
                onClick={homePage}
            >
                <FcHome className="sm:text-2xl md:text-3xl lg:text-5xl" />
            </button>

            <button
                onClick={profilePage}
            >
                <FcSettings className="sm:text-2xl md:text-3xl lg:text-5xl" />
            </button>

            <button className="text-white"
                onClick={log_out}
            >
                <GiExitDoor className="sm:text-2xl md:text-3xl lg:text-5xl" />
            </button>
        </div>

        <div className="visible sm:hidden flex justify-end self-start mt-8 mr-5">
            <button className="text-3xl text-gray-100"
                onClick={() => alert('not working')}
            >
                <CgMenuBoxed />
            </button>
        </div>


    </div>
)

}