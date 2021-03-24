import React, { useEffect, useState } from "react";
import axios from 'axios'


export function Friends (props) {
    const token = props.token
    const userName = props.userName
    const [myFriends, setmyFriends] = useState('')
    const headers = { headers:{
        Authorization: "Bearer "+ token
    }}

    useEffect(() => {
        axios.post("http://localhost:8001/users", {
            userName,
            self: true
        }, headers
        ).then(res => {
            const friendsList = res.data.data.friends
            fillFriendsList(friendsList)
        }).catch(err => {
            console.log(err)
        })
    }, [])


    const fillFriendsList = friendsList => {
        setmyFriends('')
        let toInsert = friendsList.map(friend => {
            return(
                <tr>
                    <td style={{ "borderWidth": "30px", 'borderColor': "transparent", 'borderStyle': 'solid' }}>{friend.userName}</td>
                    <td style={{ "borderWidth": "30px", 'borderColor': "transparent", 'borderStyle': 'solid' }}>{friend.reliability}</td>
                    <td style={{ "borderWidth": "30px", 'borderColor': "transparent", 'borderStyle': 'solid' }}><button className="listButton">מעט</button></td>
                    <td style={{ "borderWidth": "30px", 'borderColor': "transparent", 'borderStyle': 'solid' }}><button className="listButton">בינוני</button></td>
                    <td style={{ "borderWidth": "30px", 'borderColor': "transparent", 'borderStyle': 'solid' }}><button className="listButton">הרבה</button></td>
                </tr>
            )
        })
        setmyFriends(toInsert)
    }


    return(
        <div className="box">
            <div style={{ position: "relative", top: "2%", fontSize: "20px", fontWeight: "bold", color: "whitesmoke", height: "0%" }}> החברים שלי </div>
            <div className="list">
                <table>
                    <thead>
                        <tr>
                        <th style={{ borderWidth: "30px", 'borderColor': "transparent" }}>שם משתמש</th>
                        <th style={{ borderWidth: "30px", 'borderColor': "transparent" }}>דירוג נוכחי</th>
                        <th style={{ borderWidth: "30px", 'borderColor': "transparent" }}></th>
                        <th style={{ borderWidth: "30px", 'borderColor': "transparent" }}>דירוג</th>
                        <th style={{ borderWidth: "30px", 'borderColor': "transparent" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {myFriends}
                    </tbody>
                </table>
            </div>
            <div style={{ position: "relative", fontSize: "10px", fontWeight: "bold", color: "whitesmoke", height: "0%" }}> תוכל לדרג את הרמה שבה אתה סומך על ההמלצות של החברים שלך בלחיצה על הכפתור הנכון - 1 סומך מעט, 5- סומך מאוד </div>
        </div>
    )
}


export function Recommendations(props){
    const userName = props.userName
    const recommendations = JSON.parse(window.localStorage.getItem('recommendations'))
    const [myRecommandations,setMyRecommandations] = useState('')


    useEffect(()=>{   
        const myRecs = recommendations.map(recommend => {
            if (recommend.userName === userName) 
                return( 
                    <tr>
                        <td style ={{"borderWidth":"30px", 'borderColor':"transparent", 'borderStyle':'solid'}}>{recommend.name}</td>
                        <td style ={{"borderWidth":"30px", 'borderColor':"transparent", 'borderStyle':'solid'}}>{recommend.rate}</td>
                        <td style ={{"borderWidth":"30px", 'borderColor':"transparent", 'borderStyle':'solid'}}>{recommend.comment}</td>
                        <td style ={{"borderWidth":"30px", 'borderColor':"transparent", 'borderStyle':'solid'}}>{recommend.date.substring(0, 10)}</td>
                    </tr>
                )
            else
                return "";
            }    
        )
        setMyRecommandations(myRecs)
    },[])

    return (
        <div className="box">
                <div style={{ position: "relative", top: "2%", fontSize: "20px", fontWeight: "bold", color: "whitesmoke", height: "0%" }}> ההמלצות שלי </div>
                <div className="list">
                    <table>
                        <thead>
                            <td style = {{borderWidth:"30px", 'borderColor':"transparent"}}>שם</td>
                            <td style = {{borderWidth:"30px", 'borderColor':"transparent"}}>דירוג</td>
                            <td style = {{borderWidth:"30px", 'borderColor':"transparent"}}>הערה</td>
                            <td style = {{borderWidth:"30px", 'borderColor':"transparent"}}>תאריך</td>
                        </thead>
                        <tbody>
                            {myRecommandations}   
                        </tbody>
                    </table>
                </div>
                <div style={{ position: "relative", fontSize: "10px", fontWeight: "bold", color: "whitesmoke", height: "0%" }}> תוכל לערוך ולדרג מחדש את ההמלצות שלך </div>
            </div>
    )

}

export function ChangePassword(props){
    const userName = props.userName
    const [currentPassword,setCurrentPassword] = useState('')
    const [newPassword,setNewPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')

    const headers = { headers:{
        Authorization: "Bearer "+ props.token
    }}


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

    return(
        <div className="box">
                <div style={{ position: "relative", top: "2%", fontSize: "20px", fontWeight: "bold", color: "whitesmoke", height: "0%" }}> החלף סיסמא </div>
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
    )
}

