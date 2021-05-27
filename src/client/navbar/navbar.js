import '../utils/style.css'
import './navbar.css'
import Header from '../images/logo.jpg'
import LogoBackground from '../images/logo-background.jpg'
import LogoShield from '../images/logo-shield.png'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import checkAuth from '../utils/auth'
import Hamburger from 'hamburger-react'


export function Navbar() {
    const userName = window.localStorage.getItem('userName')
    const [isOpened, setIsOpened] = useState(false);
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
            return false
        }
        return true
    }

    const relog = () => {
        alert('אנא התחבר מחדש')
        history.push('/login')
    }

    const profilePage = () => !tokenIsValid() ? relog() : history.push('/profile')

    const homePage = () => !tokenIsValid() ? relog() : history.push('')

    const toggleNav = () => {
        if (!isOpened)
            document.getElementById("NavMenu").style.width = "100px";
        else
            document.getElementById("NavMenu").style.width = "0";
        setIsOpened(!isOpened)
    }


    return (
        <div className="flex h-28 md:h-44 lg:h-52 w-full grid grid-cols-3"
            style={{ backgroundImage: `url(${LogoBackground})`, backgroundSize: '100% 100%' }}
        >
            <div/>

            <div className = "flex self-center">
                <img className = "h-28 md:h-44 lg:h-52 w-full cursor-pointer"
                    alt = ""
                    src = {LogoShield}
                    onClick = {()=>history.push('')}
                    />
            </div>

            <div className = "flex ">
                <div className = "w-full flex flex-col items-center">
                <div className="flex flex-col w-24 self-end text-white text-sm md:text-md lg:text-lg justify-self-end items-center">
                    <Hamburger
                        easing="ease-in"
                        toggled={isOpened}
                        onToggle={toggleNav}
                    />
                </div>

                <div id="NavMenu" className="flex flex-col h-16 md:h-36 self-end items-center grid justify-self-end jusitfy-items-center text-white text-sm md:text-md lg:text-lg bg-black bg-opacity-75">

                    <button className="transition ease-in-out duration-700 hover:text-gray-500 focus:outline-none"
                        onClick={() => homePage()}
                    >
                        דף הבית
                 </button>
                    <button className="transition ease-in-out duration-700 hover:text-gray-500 focus:outline-none"
                        onClick={() => homePage()}
                    >
                        חיפוש חברים
                 </button>

                    <button className="transition ease-in-out duration-700 hover:text-gray-500 focus:outline-none"
                        onClick={() => profilePage()}
                    >
                        פרופיל
                </button>

                    <button className="transition ease-in-out duration-700 hover:text-gray-500 focus:outline-none"
                        onClick={() => log_out()}
                    >
                        יציאה
                </button>
                </div>
                </div>
            </div>
        </div >
    )

}

