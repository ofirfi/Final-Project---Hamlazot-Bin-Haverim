import React, { useEffect, useState } from "react";
import './user.scss';
import vr46 from './vr46.jpg'
import { GiExitDoor } from 'react-icons/gi'
import { FcSettings } from 'react-icons/fc'
import { FaUserFriends, FaPenFancy, FaLock } from 'react-icons/fa'
import { useHistory } from 'react-router-dom'
import { Friends, Recommendations, ChangePassword } from './userInfo'
import axios from 'axios'



const ProfilePage = () => {
    const history = useHistory();
    const userName = window.localStorage.getItem('userName')
    const token = window.localStorage.getItem('token')

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [display, setDisplay] = useState('')
    const headers = {
        headers: {
            Authorization: "Bearer " + token
        }
    }



    useEffect(() => {
        getInfo()
    }, [])


    const getInfo = () => {
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
    }





    const log_out = () => {
        alert('להתראות ' + userName + ' מקווים לראותך שוב!')
        window.localStorage.setItem('logged', false)
        history.push('/login')
    }

    const go_profile = () => {
        // history.push('/profile')
    }



    return (
        <div className="page">

            <header className="nav">
                <button onClick={go_profile} style={{ position: "relative", top: "20%", left: "40%", backgroundColor: "transparent", border: "none", cursor: "pointer" }}><FcSettings style={{ fontSize: 36 }} /></button>
                <button onClick={log_out} style={{ position: "relative", top: "20%", right: "40%", backgroundColor: "transparent", border: "none", cursor: "pointer", color: "rgb(53, 111, 123)" }}><GiExitDoor style={{ fontSize: 36 }} /></button>
                <div style={{ position: "relative", top: "-30%" }}>
                    <input id="mini-search-box" type="text" placeholder="חפש המלצות על מסעדות, הצגות, סרטים וספרים" />
                </div>
            </header>

            <div className="body">

                <div className="userDetails">
                    <img className="avatar" src={vr46} ></img>
                    <h3 style={{ position: "relative", top: "3%", margin: "5%", color: "whitesmoke" }}> {fullName} </h3>
                    <h4 className="h4"> {email} </h4>
                    <h4 className="h4">  </h4>
                    <button className="button"
                        onClick={() => setDisplay(<Friends userName={userName} token={token} />)}
                    >
                        רשימת חברים
                        <FaUserFriends style={{ float: "left" }} />
                    </button>

                    <button className="button"
                        onClick={() => setDisplay(<Recommendations userName={userName} />)}
                    >
                        ההמלצות שלי
                            <FaPenFancy style={{ float: "left" }} />
                    </button>

                    <button className="button"
                        onClick={() => setDisplay(<ChangePassword userName={userName} token={token} />)}
                    >
                        החלף סיסמא
                            <FaLock style={{ float: "left" }} />
                    </button>
                </div>

                {display}
            </div>

        </div>
    );
}

export default ProfilePage;