import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { Alert } from '../../alertComponent/alert'


export function Friends() {
    const dispatch = useDispatch();
    const userName = window.localStorage.getItem('userName');
    const token = window.localStorage.getItem('token');
    const [myFriends, setmyFriends] = useState('');
    const history = useHistory();
    const headers = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };


    useEffect(() => {
        axios.post("https://rbfserver.herokuapp.com/users", {
            userName,
            self: true
        }, headers)
            .then(res => fillFriendsList(res.data.data.friends))
            .catch(err => console.log(err))
    }, [])


    const fillFriendsList = friendsList => {
        setmyFriends('')
        let toInsert = friendsList.map((friend, index) => makeFriendsRow(friend, index))
        setmyFriends(toInsert)
    }


    const makeFriendsRow = (friend, index) => (
        <tr id={`a${index}`} className="text-xs md:text-sm lg:text-base">
            <td className="w-1/6 border">
                <button className="w-full h-full bg-red-700 hover:bg-red-900 focus:outline-none"
                    onClick={() => deleteFriend(friend.userName, index)}
                >
                    מחק
                </button>
            </td>
            <td className="w-1/6 border">
                <button className="w-full h-full bg-blue-500 hover:bg-blue-700 focus:outline-none"
                    onClick={() => setFriendsReliability(friend.userName, 'מעט', index)}
                >
                    מעט
                </button>
            </td>
            <td className="w-1/6 border">
                <button className="w-full h-full bg-blue-500 hover:bg-blue-700 focus:outline-none"
                    onClick={() => setFriendsReliability(friend.userName, 'בינוני', index)}
                >
                    בינוני
                </button>
            </td>
            <td className="w-1/6 border">
                <button className="w-full h-full bg-blue-500 hover:bg-blue-700 focus:outline-none"
                    onClick={() => setFriendsReliability(friend.userName, 'הרבה', index)}
                >
                    הרבה
                </button>
            </td>
            <td id={index} className="w-1/6 border">
                {friend.reliability}
            </td>
            <td className="w-1/6 border">
                {friend.fullName}
            </td>
            <td className="w-1/6 border">
                <button className="underline hover:text-gray-400 focus:outline-none"
                    onClick={() => goFriendsProfile(friend.userName)}
                >
                    {friend.userName}
                </button>
            </td>
        </tr>
    )


    const setFriendsReliability = (friend, reliability, i) => {
        axios.put("https://rbfserver.herokuapp.com/users/friends", {
            userName,
            friend,
            reliability
        }, headers)
            .then(res => document.getElementById(i).innerHTML = reliability)
            .catch(err => console.log(err))
    }


    const deleteFriend = (friend, index) =>
        Alert("", `האם את/ה בטוח/ה שברצונך להסיר את ${friend} מרשימת החברים? `, "danger", 0, () => deletedConfirmed(friend, index));


    const deletedConfirmed = (friend, index) => {
        axios.delete("https://rbfserver.herokuapp.com/users/friends",
            {
                headers: { Authorization: `Bearer ${token}` },
                data: { userName, friend }
            })
            .then(res => {
                document.getElementById(`a${index}`).remove();
                Alert("", "חבר הוסר מרשימת החברים", "success", 5000);
            })
            .catch(err => { })
    }


    const goFriendsProfile = friend => history.push(`/user/${friend}`)

    return (
        <div className="flex flex-col w-full text-white">
            <div className="self-center text-center text-2xl underline font-bold my-5">
                החברים שלי
            </div>
            <div className="h-56 md:h-96 overflow-y-auto">
                <table className="w-full table-fixed self-end text-center border-separate border-2">
                    <thead>
                        <tr className="text-xs md:text-sm lg:text-base">
                            <th className="w-1/12 border-r">מחיקה</th>
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
            <div className="flex flex-col self-center w-24 h-10">
                <button className="w-full h-full self-center rounded-xl bg-blue-500 hover:bg-blue-700 focus:outline-none"
                    onClick={() => dispatch({ type: "TOGGLEFRIENDSEARCH" })}
                >
                    חפש חבר
                </button>
            </div>
            <div className="text-xs md:text-sm font-bold text-center py-2">
                תוכל לדרג את הרמה שבה אתה סומך על ההמלצות של החברים שלך בלחיצה על הכפתור הנכון
            </div>

        </div>
    )
}