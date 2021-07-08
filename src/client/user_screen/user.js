import '../utils/style.css'
import React, { useEffect, useState } from "react"
import BackGround from '../images/background.jpg'
import { Navbar } from '../navbar/navbar'
import default_user from '../images/default_user.png'
import axios from 'axios'
import { Recommendations } from './components/recommendations'
import { Friends } from './components/friends'
import { UserManageButton } from './components/userManageButton'
import { useHistory } from 'react-router-dom'


const UserPage = (props) => {
    const user = props.match.params.userName;
    const [firstName, setFirstName] = useState('');
    const [surName, setSurName] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [myRecommendations, setMyRecommendations] = useState('');
    const [myFriends, setMyFriends] = useState('');
    const [display, setDisplay] = useState(null)
    const history = useHistory();
    const headers = {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
        }
    }


    useEffect(() => {
        axios.post("https://rbfserver.herokuapp.com/users", {
            userName: props.match.params.userName,
            self: false
        }, headers)
            .then(res => {
                setFirstName(res.data.data.firstName);
                setSurName(res.data.data.lastName);
                setMyRecommendations(res.data.data.recommendations);
                setMyFriends(res.data.data.friends)
                setIsLoaded(true);
                setDisplay(<Friends myFriends={res.data.data.friends} />);
                setDisplay(<Recommendations myRecommendations={res.data.data.recommendations} />);
            })
            .catch(() => history.push('/404'))
    }, [])


    const changeDisplay = screen => {
        setDisplay(screen)
    }

    return (
        <div className="flex flex-col bg-fixed items-center min-h-full"
            style={{ backgroundImage: `url(${BackGround})`, backgroundSize: '100% 100%' }}
        >
            <Navbar />

            <div className="hidden sm:inline-flex flex flex-row w-3/4 m-12 p-5 bg-gray-600 bg-opacity-30 rounded-xl">
                {/* user details */}
                <div className="flex flex-col self-center h-full w-1/3 mr-5 text-white items-center bg-green-800">

                    <h1 className="text-xl font-black my-3">
                        {user}
                    </h1>

                    <div className="flex flex-col">
                        <div className="flex flex-col w-full mb-5 self-center">
                            <img className="flex w-1/2 self-center rounded-full"
                                src={default_user}
                            />
                        </div>
                        <div className="flex flex-row-reverse mb-5 text-center">
                            <h2 className="w-1/2">שם פרטי</h2>
                            <h2 className="w-1/2">{firstName}</h2>
                        </div>
                        <div className="flex flex-row-reverse mb-5 text-center">
                            <h2 className="w-1/2">שם משפחה</h2>
                            <h2 className="w-1/2">{surName}</h2>
                        </div>
                        <div className="text-center my-5">
                            <UserManageButton friend={user} />
                        </div>
                    </div>

                </div>


                <div className="flex flex-col w-2/3 h-1/2">


                    <div className="flex flex-col w-full h-52 mb-3 text-white text-center bg-green-800">
                        <h1 className="font-black underline">חברים</h1>
                        <div className="overflow-y-auto mt-2">
                            {isLoaded ? <Friends myFriends={myFriends} /> : null}
                        </div>
                    </div>

                    <div className="flex flex-col w-full h-52 mb-3 text-white text-center bg-green-800">
                        <h1 className="font-black underline">המלצות</h1>
                        <div className="overflow-y-auto mt-2">
                            {isLoaded ? <Recommendations myRecommendations={myRecommendations} /> : null}
                        </div>
                    </div>

                </div>

            </div>



            <div className="sm:hidden flex flex-col w-4/5 m-12 p-5 text-sm text-white bg-gray-600 bg-opacity-30 rounded-xl">
                {/* User info + buttons */}
                <div className="flex flex-row-reverse text-center  bg-green-800">
                    {/* Info + buddy button */}
                    <div className="flex flex-col w-1/3 my-4">
                        <h1 className="font-black">{user}</h1>
                        <h3 className="my-3">{`${firstName}  ${surName}`}</h3>
                        <UserManageButton friend={user} />
                    </div>
                    <div className="flex flex-col w-1/3 self-center">
                        <button className="flex flex-col w-1/2 self-center text-white rounded-xl bg-blue-500 hover:bg-blue-700 focus:outline-none"
                            onClick={() => changeDisplay(<Friends myFriends={myFriends} />)}
                        >
                            רשימת חברים
                        </button>
                    </div>
                    <div className="flex flex-col w-1/3 self-center">
                        <button className="flex flex-col w-1/2 self-center text-white rounded-xl bg-blue-500 hover:bg-blue-700 focus:outline-none"
                            onClick={() => changeDisplay(<Recommendations myRecommendations={myRecommendations} />)}
                        >
                            רשימת המלצות
                        </button>
                    </div>
                </div>

                <div className="flex mt-5 max-h-56 bg-green-800 overflow-y-auto">
                    {isLoaded ? display : null}
                </div>

            </div>


        </div>
    )
}


export default UserPage;