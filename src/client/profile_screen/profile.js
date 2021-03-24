import '../utils/style.css'
import React, { useEffect, useState } from "react";
import { Navbar } from '../navbar/navbar'
import BackGround from '../images/background.jpg'
import default_user from '../images/default_user.png'
import { FaUserFriends, FaPenFancy, FaLock } from 'react-icons/fa'
import { Friends, Recommendations, ChangePassword} from './userInfo'
import axios from 'axios'

const ProfilePage = () => {
    const userName = window.localStorage.getItem('userName')
    const token = window.localStorage.getItem('token')

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [display, setDisplay] = useState(<ChangePassword/>)
    const headers = {
        headers: {
            Authorization: "Bearer " + token
        }
    }



    useEffect(() => {
        axios.post("http://localhost:8001/users", {
            userName,
            self: true
        }, headers
        ).then(res => {
            setFullName(res.data.data.firstName + " " + res.data.data.lastName)
            setEmail(res.data.data.email)
        }).catch(err => {
            console.log(err)
        })
    }, [])


    return (
        <div className="flex flex-col bg-fixed items-center"
            style={{ backgroundImage: `url(${BackGround})`, backgroundSize: '100% 100%' }}
        >

            <Navbar />

            <div className="w-full my-16 flex flex-row-reverse">

                <div className="w-1/4 flex flex-col justify-self-end items-center bg-green-800 mr-16">

                    <img className="h-1 w-1 sm:h-28 sm:w-28 rounded-full mt-2 sm:mt-8 invisible sm:visible"
                        src={default_user}
                    />

                    <div className="mt-5 h-7 text-white text-2xl">
                        {userName}
                    </div>

                    <div className="mt-2 h-7 text-white text-lg">
                        {fullName}
                    </div>

                    <div className="my-2 h-7 text-white text-lg">
                        {email}
                    </div>

                    <button className="w-2/3 h-10 flex flex-row-reverse items-center my-2 rounded-full text-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none"
                        onClick={() => setDisplay(<Friends userName={userName} token={token} />)}
                    >
                        <div className="w-5/6">
                            רשימת חברים
                        </div>
                        <FaUserFriends className="w-1/6 ml-2" />
                    </button>

                    <button className="w-2/3 h-10 flex flex-row-reverse items-center my-2 rounded-full text-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none"
                        onClick={() => setDisplay(<Recommendations/>)}
                    >
                        <div className="w-5/6">
                            ההמלצות שלי
                        </div>
                        <FaPenFancy className="w-1/6 ml-2" />
                    </button>

                    <button className="w-2/3 h-10 flex flex-row-reverse items-center mt-2 mb-8 rounded-full text-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none"
                        onClick={() => setDisplay(<ChangePassword/>)}
                    >
                        <div className="w-5/6">
                            החלף סיסמא
                        </div>
                        <FaLock className="w-1/6 ml-2" />
                    </button>
                </div>

                <div className = "w-3/5 flex bg-green-800 mr-8">
                    {display}
                </div>
                
            </div>

        </div>
    );
}

export default ProfilePage;