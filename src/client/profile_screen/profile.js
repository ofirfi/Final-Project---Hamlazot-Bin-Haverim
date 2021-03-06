import '../utils/style.css'
import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { Form } from '../utils/form'
import BackGround from '../images/background.jpg'
import default_user from '../images/default_user.png'
import { Navbar } from '../navbar/navbar'
import { FaUserFriends, FaPenFancy, FaLock } from 'react-icons/fa'
import { RiDeleteBinLine } from 'react-icons/ri'
import { Friends } from './components/friends'
import { ChangePassword } from './components/changePassword'
import { Recommendations } from './components/recommendations'
import { Searcher } from '../searchFriends/searchFriends'
import { useHistory } from 'react-router-dom'
import { Alert } from '../alertComponent/alert'
import axios from 'axios'


const ProfilePage = () => {
    const userName = window.localStorage.getItem('userName')
    const token = window.localStorage.getItem('token')
    const history = useHistory();
    const dispatch = useDispatch();
    const isForm = useSelector(state => state.isForm);
    const isFriendSearch = useSelector(state => state.isFriendSearch);
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [display, setDisplay] = useState(<Friends />)
    const [myRecommendations, setMyRecommendations] = useState('')
    const [myFriends, setMyFriends] = useState('')
    const headers = {
        headers: {
            Authorization: "Bearer " + token
        }
    }


    useEffect(() => {
        axios.post("https://rbfserver.herokuapp.com/users", {
            userName,
            self: true
        }, headers
        ).then(res => {
            setMyRecommendations(res.data.data.recommendations);
            setMyFriends(res.data.data.friends)
            setFullName(res.data.data.firstName + " " + res.data.data.lastName)
            setEmail(res.data.data.email)
        }).catch(err => {
            console.log(err)
        })
    }, [])


    const deleteButtonHandler = () =>
        Alert("", `האם את/ה בטוח/ה שברצונך למחוק חשבון זה?${'\n'}לאחר פעולה זו לא יהיה ניתן לשחזר את החשבון!`, "danger", 0, () => deleteConfirmed())


    const deleteConfirmed = () => {
        axios.delete(`https://rbfserver.herokuapp.com/users`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { userName }
        })
            .then(res => {
                Alert("", "ברוך שפטרנו", "success", 5000);
                window.localStorage.removeItem('userName');
                window.localStorage.removeItem('recommendations');
                window.localStorage.removeItem('token');
                dispatch({ type: "SETLOGGED", payload: false });
                history.push('/login');
            })
            .catch(err => { console.log(err) })
    }


    return (
        <div className="flex flex-col bg-fixed items-center min-h-full"
            style={{ backgroundImage: `url(${BackGround})`, backgroundSize: '100% 100%' }}
        >

            <Navbar />

            <div className="w-full my-5 md:my-16 flex flex-col md:flex-row-reverse">

                <div className="w-full md:w-1/4 flex flex-row-reverse md:flex-col justify-self-start md:justify-self-end items-center bg-green-800 md:mr-16">

                    <img className="h-0 w-0 sm:h-28 sm:w-28 rounded-full  md:mt-8 invisible sm:visible"
                        src={default_user}
                    />

                    <div className="w-full text-center">
                        <div className="mt-5 h-7 text-white text-xl md:text-2xl">
                            {userName}
                        </div>

                        <div className="mt-2 h-7 text-white text-md md:text-lg">
                            {fullName}
                        </div>

                        <div className="my-2 h-7 text-white text-md md:text-lg">
                            {email}
                        </div>
                    </div>

                    <button className="w-2/3 h-10 flex flex-row-reverse items-center mx-2 md:mx-0 my-2 rounded-full text-xs md:text-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none"
                        onClick={() => setDisplay(<Friends myFriends={myFriends} />)}
                    >
                        <div className="w-5/6">
                            רשימת חברים
                        </div>
                        <FaUserFriends className="w-1/6 ml-2" />
                    </button>

                    <button className="w-2/3 h-10 flex flex-row-reverse items-center mx-2 md:mx-0 my-2 rounded-full text-xs md:text-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none"
                        onClick={() => setDisplay(<Recommendations myRecommendations={myRecommendations} />)}
                    >
                        <div className="w-5/6">
                            ההמלצות שלי
                        </div>
                        <FaPenFancy className="w-1/6 ml-2" />
                    </button>

                    <button className="w-2/3 h-10 flex flex-row-reverse items-center mx-2 md:mx-0 my-2 md:mt-2 md:mb-8 rounded-full text-xs md:text-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none"
                        onClick={() => setDisplay(<ChangePassword />)}
                    >
                        <div className="w-5/6">
                            החלף סיסמא
                        </div>
                        <FaLock className="w-1/6 ml-2" />
                    </button>

                    <button className="w-1/4 h-10 flex flex-row-reverse items-center mx-2 md:mx-0 my-2 md:mt-2 md:mb-8 rounded-full text-xs md:text-md text-white bg-red-700 hover:bg-red-900 focus:outline-none"
                        onClick={deleteButtonHandler}
                    >
                        <div className="w-full sm:w-5/6">
                            מחק
                        </div>
                        <RiDeleteBinLine className="w-0 sm:w-1/5 sm:ml-2" />
                    </button>

                </div>

                <div className="my-5 md:my-0 w-full sm:w-3/4 self-center md:w-3/5 lg:w-3/5 xl:w-1/2 flex bg-green-800 mr-0 md:mr-8">
                    {display}
                </div>

            </div>

            {isForm ? <Form openBtnLabel="ערוך את ההמלצה שלי" closeBtnLabel="אולי בפעם אחרת" /> : null}
            {isFriendSearch ? <Searcher /> : null}
        </div>
    );
}

export default ProfilePage;