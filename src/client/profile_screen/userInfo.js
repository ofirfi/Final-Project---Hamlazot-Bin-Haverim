import '../utils/style.css'
import React, { useEffect, useState } from "react"
import { useDispatch } from 'react-redux'
import axios from 'axios'


const userName = window.localStorage.getItem('userName');
const token = window.localStorage.getItem('token');


const headers = {
    headers: {
        Authorization: `Bearer ${token}`
    }
}


export function Friends(props) {
    const [myFriends, setmyFriends] = useState('')
    const dispatch = useDispatch();

    useEffect(() => {
        fillFriendsList(props.myFriends);
    }, [])


    const fillFriendsList = friendsList => {
        setmyFriends('')
        let toInsert = friendsList.map(friend => (
            <tr>
                <td className="w-1/6 border">
                    <button className="w-full h-full bg-red-700 hover:bg-red-900 focus:outline-none"
                        onClick={() => deleteFriend(friend.userName)}
                    >
                        מחק
                    </button>
                </td>
                <td className="w-1/6 border">
                    <button className="w-full h-full bg-blue-500 hover:bg-blue-700 focus:outline-none"
                        onClick={() => setFriendsReliability(friend.userName, 'מעט')}
                    >
                        מעט
                    </button>
                </td>
                <td className="w-1/6 border">
                    <button className="w-full h-full bg-blue-500 hover:bg-blue-700 focus:outline-none"
                        onClick={() => setFriendsReliability(friend.userName, 'בינוני')}
                    >
                        בינוני
                    </button>
                </td>
                <td className="w-1/6 border">
                    <button className="w-full h-full bg-blue-500 hover:bg-blue-700 focus:outline-none"
                        onClick={() => setFriendsReliability(friend.userName, 'הרבה')}
                    >
                        הרבה
                    </button>
                </td>
                <td className="w-1/6 border">
                    {friend.reliability}
                </td>
                <td className="w-1/6 border">
                    {friend.fullName}
                </td>
                <td className="w-1/6 border">
                    {friend.userName}
                </td>
            </tr>
        )
        )
        setmyFriends(toInsert)
    }


    const setFriendsReliability = (friend, reliability) => {
        axios.put("http://localhost:8001/users/friends", {
            userName,
            friend,
            reliability
        }, headers)
            .then(res => {
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            })
    }


    const deleteFriend = friend => {
        alert('delete was clicked');
        console.log('צריך לראות איך לממש עדכון מקומי');
        // axios.delete("http://localhost:8001/users/friends",
        //     { 
        //         headers: { Authorization: `Bearer ${token}` },
        //         data: { userName, friend }
        //     })
        //     .then(res => { 
        //         alert('was deleted...');
        //     })
        //     .catch(err => {})

    }


    const searchFriend = () =>{
        dispatch({type:"TOGGLEFRIENDSEARCH"})
    }

    return (
        <div className="flex flex-col w-full text-white">
            <div className="self-center text-center text-2xl underline font-bold my-5">
                החברים שלי
            </div>
            <div className="h-96 overflow-y-auto">
                <table className="w-full table-fixed self-end text-center border-separate border-2">
                    <thead>
                        <tr>
                            <th className ="w-1/12 border-r">מחיקה</th>
                            <th className="w-1/12"></th>
                            <th className="w-1/12">שינוי דירוג</th>
                            <th className="w-1/12"></th>
                            <th className="w-1/12 border-l">דירוג נוכחי</th>
                            <th className="w-3/12 border-l">שם מלא</th>
                            <th className="w-3/12 border-l">שם משתמש</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myFriends}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-col self-center w-1/6 h-10">
            <button className="w-3/4 h-full self-center bg-blue-500 rounded-full"
                onClick={()=> dispatch({type:"TOGGLEFRIENDSEARCH"})}
            >
                חפש חבר
            </button>
            </div>
            <div className="text-sm font-bold text-center py-2">
                תוכל לדרג את הרמה שבה אתה סומך על ההמלצות של החברים שלך בלחיצה על הכפתור הנכון
            </div>
            
        </div>
    )
}


export function Recommendations(props) {
    const [myRecommandations, setMyRecommandations] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        getRecommendations(props.myRecommendations);
    }, [])


    const getRecommendations = myRecommendations => {
        if (!myRecommendations)
            return;

        setMyRecommandations('');
        const myRecs = myRecommendations.map(recommend => createRecommendation(recommend))
        setMyRecommandations(myRecs)
    }


    const createRecommendation = recommend => {
        return (
            <tr className="overflow-y-auto">
                <td className="w-1/12 h-24 border-l border">
                    <button className="w-4/5 h-2/5 bg-red-700 hover:bg-red-900 focus:outline-none"
                        onClick={() => deleteRecommendation(recommend.rId)}
                    >
                        מחק
                    </button>
                </td>
                <td className="w-1/12 h-24 border-l border">
                    <button className="w-4/5 h-2/5 bg-blue-500 hover:bg-blue-700 focus:outline-none"
                        onClick={() => editRecommendation(recommend)}
                    >
                        ערוך
                    </button>
                </td>
                <td className="w-4/12 h-24 border">
                    <div className="w-full h-full overflow-y-auto overflow-x-auto flex items-center grid justify-items-center">
                        {recommend.comment}
                    </div>
                </td>
                <td className="w-1/12 h-24 border">
                    {recommend.date.substring(0, 10)}
                </td>
                <td className="w-1/12 h-24 border">
                    {recommend.rate}
                </td>
                <td className="w-4/12 h-24 border">
                    <div className="w-full h-full overflow-y-auto overflow-x-auto flex items-center grid justify-items-center">
                        {recommend.name}
                    </div>
                </td>
            </tr>
        )
    }


    const editRecommendation = recommend => {
        dispatch({
            type: "SETFORMINFO",
            payload: {
                rId: recommend.rId,
                name: recommend.name,
                rate: recommend.rate,
                comment: recommend.comment,
                type: recommend.type,
            }
        })
        dispatch({ type: "TOGGLEFORM" });
    }


    const deleteRecommendation = rId => {
        alert('delete was clicked');
        console.log('צריך לראות איך לממש עדכון מקומי');

        // axios.delete("http://localhost:8001/recommendations",
        //     {
        //         headers: { Authorization: `Bearer ${token}` },
        //         data: { userName, rId }
        //     })
        //     .then(res => { })
    }


    return (
        <div className="flex flex-col w-full text-white">
            <div className="self-center text-center text-2xl underline font-bold my-5">
                ההמלצות שלי
            </div>

            <div className="h-96 overflow-y-auto">
                <table className="table-fixed self-end text-center border-separate">
                    <thead>
                        <tr>
                            <td className="w-1/12"></td>
                            <td className="w-1/12"></td>
                            <td className="w-4/12 border">הערה</td>
                            <td className="w-1/12 border">תאריך</td>
                            <td className="w-1/12 border">דירוג</td>
                            <td className="w-4/12 border">שם</td>
                        </tr>
                    </thead>
                    <tbody className="h-26 overflow-y-auto">
                        {myRecommandations}
                    </tbody>
                </table>
            </div>

            <div className="text-sm font-bold text-center py-2">
                תוכל לערוך ולדרג מחדש את ההמלצות שלך
            </div>
        </div>
    )

}


export function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const validationCheck = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('אנא מלא את כל השדות');
            return false;
        }
        if (newPassword.length < 8) {
            alert('הסיסמא צריכה להיות בין 8 ל-16 תווים');
            return false;
        }
        if (newPassword !== confirmPassword) {
            alert('הסיסמאות אינן תואמות');
            return false;
        }
        return true;
    }

    const clearFields = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    }

    const changePassword = () => {
        if (!validationCheck())
            return;

        axios.put("http://localhost:8001/auth/changePassword", {
            userName,
            current_password: currentPassword,
            password: newPassword,
            confirm_password: confirmPassword,
        }, headers)
            .then(res => {
                alert('הסיסמא שונתה בהצלחה');
                clearFields();
            })
            .catch(err => {
                if (err.response.data.message === 'confirm password is wrong')
                    alert('הסיסמא הנוכחית שגויה');
                else
                    alert('קרתה שגיאה אנא נסה שנית');
                clearFields();
            })
    }


    return (
        <div className="flex flex-col w-full">
            <div className="self-center text-center text-white text-2xl underline font-bold my-5">
                החלף סיסמא
            </div>

            <div className="flex flex-col w-1/4 mt-10 self-center items-center text-lg">

                <input className="w-5/6 h-8 my-6 rounded-xl text-center focus:outline-none"
                    placeholder="סיסמא נוכחית"
                    type="password"
                    onChange={event => setCurrentPassword(event.target.value)}
                    value={currentPassword}
                    required
                />

                <input className="w-5/6 h-8 my-6 rounded-xl text-center focus:outline-none"
                    placeholder="סיסמא חדשה"
                    type="password"
                    onChange={event => setNewPassword(event.target.value)}
                    value={newPassword}
                    required
                />

                <input className="w-5/6 h-8 my-6 rounded-xl text-center focus:outline-none"
                    placeholder="אימות סיסמא חדשה"
                    type="password"
                    onChange={event => setConfirmPassword(event.target.value)}
                    value={confirmPassword}
                    required
                />

                <button className="w-24 h-10 my-8 bg-blue-500 rounded-full text-md text-white focus:outline-none"
                    onClick={changePassword}
                >
                    אישור
                </button>
            </div>
        </div>
    )
}