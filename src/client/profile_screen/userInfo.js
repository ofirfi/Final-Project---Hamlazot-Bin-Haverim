import React, { useEffect, useState } from "react";
import axios from 'axios'

const userName = window.localStorage.getItem('userName');
const token = window.localStorage.getItem('token');
const headers = {
    headers: {
        Authorization: `Bearer ${token}`
    }
}


function OldFriends() {
    const [myFriends, setmyFriends] = useState('')

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
            return (
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


    return (
        <div className="box">
            <div style={{ position: "relative", top: "2%", fontSize: "20px", fontWeight: "bold", color: "whitesmoke", height: "0%" }}> החברים שלי </div>
            <div className="list">
                <table>
                    <thead>
                        <tr>
                            <th className="w-1/6">שם משתמש</th>
                            <th className="w-1/6">דירוג נוכחי</th>
                            <th className="w-1/6"></th>
                            <th className="w-1/6">דירוג</th>
                            <th className="w-1/6"></th>
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





export function Friends() {
    const [myFriends, setmyFriends] = useState('')
 

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
            return (
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


    return (
        <div className="box">
            <div style={{ position: "relative", top: "2%", fontSize: "20px", fontWeight: "bold", color: "whitesmoke", height: "0%" }}> החברים שלי </div>
            <div className="list">
                <table>
                    <thead>
                        <tr>
                            <th className="w-1/6">שם משתמש</th>
                            <th className="w-1/6">דירוג נוכחי</th>
                            <th className="w-1/6"></th>
                            <th className="w-1/6">דירוג</th>
                            <th className="w-1/6"></th>
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










export function Recommendations() {
    const [myRecommandations, setMyRecommandations] = useState('');

    useEffect(() => {
        getRecommendations();
    }, [])


    const createRecommendation = (recommend) => {
        return (
            <tr className="overflow-y-auto">
                <td className="w-1/12 h-24 ">
                    <button className="w-full h-1/2 rounded-full bg-blue-500 hover:bg-blue-700 focus:outline-none"
                        onClick={() => deleteRecommendation(recommend.rId)}
                    >
                        מחק
                    </button>
                </td>
                <td className="w-1/12 h-24">
                    <button className="w-full h-1/2 rounded-full bg-blue-500 hover:bg-blue-700 focus:outline-none"
                        onClick={() => editRecommendation(recommend.rId)}
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

    const getRecommendations = () => {
        const recommendations = JSON.parse(window.localStorage.getItem('recommendations'));
        if (!recommendations)
            return;
        setMyRecommandations('');
        const myRecs = recommendations.map(recommend => {
            if (recommend.userName === userName)
                return createRecommendation(recommend);
            else
                return "";
        })
        setMyRecommandations(myRecs)
    }

    const editRecommendation = () => {
        alert('edit was clicked');
        console.log('צריך לראות איך לממש עדכון בשרת + עדכון מקומי');
    }

    const deleteRecommendation = (rId) => {
        alert('delete was clicked');
        console.log('צריך לראות איך לממש מחיקה בשרת + עדכון מקומי');

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
                <table className="table-fixed self-end bg-red-600 text-center border-separate border">
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