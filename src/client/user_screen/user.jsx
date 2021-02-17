import React, { useEffect, useState } from "react";
import './user.scss';
import vr46 from './vr46.jpg'
import { GiExitDoor } from 'react-icons/gi'
import { FcSettings } from 'react-icons/fc'
import { FaUserFriends, FaPenFancy, FaLock } from 'react-icons/fa'
import {useHistory} from 'react-router-dom'

import axios from 'axios'
import { useSelector } from 'react-redux'


const ProfilePage = ()=>{

    const history = useHistory();

    const token = useSelector(state=>state.token)
    const recommandations = useSelector(state=>state.recommendations)
    
    const userName = useSelector(state=>state.userName)
    const [fullName,setFullName] = useState('')
    const [email,setEmail] = useState('')


    const [currentPassword,setCurrentPassword] = useState('')
    const [newPassword,setNewPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')

    const [display,setDisplay] = useState('')
    const [myRecommandations,setMyRecommandations] = useState('')
    const [myFriends,setmyFriends] = useState('')


    const headers = { headers:{
        Authorization: "Bearer "+ token
    }}



    useEffect(()=>{
        getInfo()
        getRecommendations()
    },[])


    const getRecommendations = () => {
        setMyRecommandations('')
        recommandations.map(recommend => {
            if (recommend.userName == userName) {
                let toInsert = <div>
                    <ul className="li" key={recommend.key}>
                        <text style={{ position: "relative", left: '0%' }}>{recommend.placeId}</text>
                        <text style={{ position: "relative", left: '5%' }}>{recommend.rate}</text>
                        <text style={{ position: "relative", left: '10%' }}>{recommend.comment}</text>
                        <text style={{ position: "relative", left: '20%' }}>{recommend.date.substring(0, 10)}</text>
                    </ul>
                </div>
                setMyRecommandations(old => [...old, toInsert])
            }
        })
    }


    const getInfo = () => {
        axios.post("http://localhost:8001/users", {
            userName,
            self: true
        }, headers
        ).then(res => {
            const friendsList = res.data.data.friends
            setFullName(res.data.data.firstName + " " + res.data.data.lastName)
            setEmail(res.data.data.email)
            fillFriendsList(friendsList)
        }).catch(err => {
            console.log(err)
        })
    }

    const fillFriendsList = friendsList => {
        setmyFriends('')
        friendsList.map(friend => {
            let i = 1;
            let toInsert =
                <div>
                    <li className="li" key={i} >
                        <text style={{ position: "relative", float: "right" }}>{friend.userName}</text>
                        <text style={{ position: "relative", float: "right", right: "10%" }}>{friend.reliability}</text>
                        <button className="listButton">מעט</button>
                        <button className="listButton">בינוני</button>
                        <button className="listButton">הרבה</button>
                    </li>
                </div>
            setmyFriends(old => [...old, toInsert])
            i++;
        })
    }


    
    const log_out = () => {
        history.push('/');
    }

    const go_profile = () => {
        // history.push('/profile')
    }




    const displayFriends = () => {
        let toDisplay = 
            <div className="box">
                <text style={{ position: "relative", top: "2%", fontSize: "20px", fontWeight: "bold", color: "whitesmoke", height: "0%" }}> החברים שלי </text>
                <div className="list">
                    {myFriends}
                </div>
                <text style={{ position: "relative", fontSize: "10px", fontWeight: "bold", color: "whitesmoke", height: "0%" }}> תוכל לדרג את הרמה שבה אתה סומך על ההמלצות של החברים שלך בלחיצה על הכפתור הנכון - 1 סומך מעט, 5- סומך מאוד </text>
            </div>
        setDisplay(toDisplay)
    }


    const displayRecommendations = () => {
        let toDisplay = 
            <div className="box">
                <text style={{ position: "relative", top: "2%", fontSize: "20px", fontWeight: "bold", color: "whitesmoke", height: "0%" }}> ההמלצות שלי </text>
                <div className="list">
                    {myRecommandations}   
                </div>
                <text style={{ position: "relative", fontSize: "10px", fontWeight: "bold", color: "whitesmoke", height: "0%" }}> תוכל לערוך ולדרג מחדש את ההמלצות שלך </text>
            </div>
        setDisplay(toDisplay)
    }
    
    const displayChangePassword = () =>{
        let toDisplay =
            <div className="box">
                <text style={{ position: "relative", top: "2%", fontSize: "20px", fontWeight: "bold", color: "whitesmoke", height: "0%" }}> החלף סיסמא </text>
                <div className="list" style={{ top: "15%", width: "85%" }}>
                    <input className="pwInput"
                        placeholder="סיסמא נוכחית"
                        type="password"
                        onChange={event => setCurrentPassword(event.target.value)}
                        value={currentPassword}
                        required
                    />
                    <p />
                    <input className="pwInput"
                        placeholder="סיסמא חדשה"
                        type="password"
                        onChange={event => setNewPassword(event.target.value)}
                        value={newPassword}
                        required
                    />
                    <p />
                    <input className="pwInput"
                        placeholder="אימות סיסמא חדשה"
                        type="password"
                        onChange={event => setConfirmPassword(event.target.value)}
                        value={confirmPassword}
                        required
                    />
                    <p />
                    <button className="button"
                        style={{ width: "80px" }}
                        onClick={changePassword}
                    >
                        אישור
                    </button>
                </div>
            </div>
        setDisplay(toDisplay)
    }





    const changePassword = () => {
        console.log(userName)
        axios.put("http://localhost:8001/auth/changePassword", {
            userName,
            current_password: currentPassword,
            password: newPassword,
            confirm_password: confirmPassword,
        }, headers
        ).then(res => {
            console.log(res)
        }).catch(err => console.log(err))
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
                        onClick={displayFriends}
                    >
                        רשימת חברים
                        <FaUserFriends style={{ float: "left" }} />
                    </button>

                    <button className="button"
                        onClick={displayRecommendations}
                    >
                        ההמלצות שלי
                            <FaPenFancy style={{ float: "left" }} />
                    </button>

                    <button className="button"
                        onClick={displayChangePassword}
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