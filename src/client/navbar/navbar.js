import '../utils/style.css'
import Header from '../images/logo.jpg'
import { GiExitDoor, GiMagnifyingGlass } from 'react-icons/gi'
import { FcSettings, FcHome } from 'react-icons/fc'
import { CgMenuBoxed } from 'react-icons/cg'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

export function Navbar(props) {
    const userName = window.localStorage.getItem('userName')
    const history = useHistory();
    const dispatch = useDispatch();

    const log_out = ()=> {
        alert('להתראות '+userName+' מקווים לראותך שוב!');
        window.localStorage.removeItem('userName');
        window.localStorage.removeItem('recommendations');
        window.localStorage.removeItem('token');
        dispatch({ type: "SETLOGGED", payload: false });
        history.push('/login');
    }

    const profilePage = () => history.push('/profile');
    const homePage = () => history.push('');
    const search = () => alert('search is not ready yet');



    return (
        <div class="flex items-start h-36 sm:h-56 w-full"
            style={{ backgroundImage: `url(${Header})`, backgroundSize: '100% 100%' }}
        >
            <div class="invisible sm:visible w-full flex justify-end self-center space-x-2 mr-3 ">
                
                <button class = "text-blue-900"
                    onClick={search}
                    >
                    <GiMagnifyingGlass class="sm:text-2xl md:text-3xl lg:text-4xl" />
                </button>

                <input class="flex w-1/5 rounded-xl text-xs text-center self-center"
                    type="text"
                    placeholder="חפש המלצות על מסעדות, הצגות, סרטים וספרים"
                    />

                <button 
                    onClick={homePage}
                    >
                    <FcHome class="sm:text-2xl md:text-3xl lg:text-5xl"/>
                </button>

                <button 
                    onClick={profilePage} 
                    >
                    <FcSettings class="sm:text-2xl md:text-3xl lg:text-5xl" />
                </button>

                <button class = "text-white"
                    onClick={log_out}
                    >
                    <GiExitDoor class="sm:text-2xl md:text-3xl lg:text-5xl" />
                </button>

                

            </div>
        
            <div class = "visible sm:invisible flex justify-end self-center mr-5">
                <button class = "text-5xl text-gray-100"
                    onClick={()=>alert('not working')}
                >
                    <CgMenuBoxed/>
                </button>
            </div>


        </div>
    )

}