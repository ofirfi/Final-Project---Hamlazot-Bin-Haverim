import '../utils/style.css'
import Header from '../images/logo.jpg'
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
            alert('פג תוקף ההתחברות, אנא התחבר שוב');
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


    return (
        <div className="flex h-28 sm:h-28 lg:h-52 w-full grid"
            style={{ backgroundImage: `url(${Header})`, backgroundSize: '100% 100%' }}
        >

            {isOpened ?
                <div className="flex flex-col w-36 h-full lg:pt-5 self-start text-white text-sm md:text-md lg:text-lg justify-self-end items-center bg-gray-400">
                    <Hamburger className="hover:text-red-400"
                        easing="ease-in"
                        toggled={isOpened}
                        onToggle={() => setIsOpened(!isOpened)}
                    />

                    <button className="hover:text-gray-500 focus:outline-none"
                        onClick={() => homePage()}
                    >
                        דף הבית
                    </button>
                    <button className="hover:text-gray-500 focus:outline-none"
                        onClick={() => profilePage()}
                    >
                        פרופיל
                    </button>
                    <button className="hover:text-gray-500 focus:outline-none"
                        onClick={() => log_out()}
                    >
                        יציאה
                    </button>
                </div>

                :

                <div className="flex flex-col w-36 h-full lg:pt-5 self-start text-white text-sm md:text-md lg:text-lg justify-self-end items-center">
                    <Hamburger
                        easing="ease-in"
                        toggled={isOpened}
                        onToggle={() => setIsOpened(!isOpened)}
                    >
                    </Hamburger>
                </div>

            }
        </div >
    )

}

