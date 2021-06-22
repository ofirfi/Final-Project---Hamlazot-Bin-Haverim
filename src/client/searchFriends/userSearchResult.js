import { useState } from 'react'
import axios from 'axios'
import { Alert } from '../alertComponent/alert'


export function FriendResult(props) {
    const [reliability, setReliability] = useState('מעט');
    const user = props.user;
    const index = props.index;
    const headers = {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
        }
    }


    const addFriend = () => {
        axios.post(`https://rbfserver.herokuapp.com/users/friends/`, {
            userName: window.localStorage.getItem('userName'),
            friend: user.userName,
            reliability: reliability
        }, headers)
            .then(res => {
                Alert("", `${user.userName} התווסף לרשימת החברים שלך`, "success", 3000);
                document.getElementById(user.userName).remove();
            })
            .catch(err => Alert("שגיאה", `לא ניתן להוסיף את ${user.userName}, ייתכן שנמצא כבר ברשימת החברים שלך`, "danger", 5000))
    }


    return (
        <div className="flex flex-row-reverse h-10 py-2 text-xs sm:text-sm text-center hover:bg-green-700">
            <div className="w-1/6 grid items-center">{index}</div>
            <div className="w-1/6 grid items-center">{user.userName}</div>
            <div className="w-1/6 grid items-center">{user.first_name}</div>
            <div className="w-1/6 grid items-center">{user.last_name}</div>

            <div className="w-1/6 grid items-center">

                <lab className="self-right justify-end">
                    <select className=" w-18 text-black text-center"
                        value={reliability}
                        onChange={event => setReliability(event.target.value)}
                    >
                        <option value="מעט"> מעט </option>
                        <option value="בינוני">בינוני</option>
                        <option value="הרבה">הרבה</option>
                    </select>
                </lab>


            </div>
            <div className="w-1/6 flex flex-col items-center grid justify-items-center">
                <button id={user.userName} className="w-3/4 md:w-1/2 rounded-lg bg-blue-500 hover:bg-blue-700 focus:outline-none"
                    onClick={() => addFriend()}
                >
                    הוסף
                </button>
            </div>


        </div>
    )
}