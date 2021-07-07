import '../../utils/style.css'
import { useEffect, useState } from "react"
import axios from 'axios';
import { Alert } from '../../alertComponent/alert'

export function UserManageButton(props) {
    const user = window.localStorage.getItem('userName')
    const friend = props.friend;
    const [label, setLabel] = useState('');
    const [isAFriend, setIsAFriend] = useState(false);
    const headers = {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
        }
    }


    useEffect(() => {
        if (user === friend)
            return;

        axios.post("https://rbfserver.herokuapp.com/users", {
            userName: user,
            self: false
        }, headers)
            .then(res => checkUserStatus(res.data.data.friends))
            .catch(() => { })
    }, []);


    const checkUserStatus = (friendsList) => {
        for (let i = 0; i < friendsList.length; i++)
            if (friendsList[i].userName === friend) {
                setIsAFriend(true);
                setLabel("הסר");
                return;
            }
        setLabel("הוסף");
        setIsAFriend(false);
    }


    const clickHandler = () => {
        if (user === friend)
            return;
        if (isAFriend)
            Alert("", `האם את/ה בטוח/ה שברצונך להסיר את ${friend} מרשימת החברים? `, "danger", 0, () => removeFriendConfirmed());
        else
            addFriend();
    }


    const addFriend = () =>
        axios.post(`https://rbfserver.herokuapp.com/users/friends/`, {
            userName: user,
            friend,
            reliability: "בינוני"
        }, headers)
            .then(res => Alert(`${friend} נוסף לרשימת החברים שלך`, `ניתן לשנות את רמת האמינות מדף הפרופיל`, "success", 5000))
            .catch(err => Alert("שגיאה", `קרתה תקלה, אנא נסה שנית בעוד מספר דקות`, "danger", 5000))


    const removeFriendConfirmed = () => {
        axios.delete("https://rbfserver.herokuapp.com/users/friends",
            {
                headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` },
                data: { userName: user, friend }
            })
            .then(res => {
                setIsAFriend(false);
                setLabel("הוסף");
                Alert("", "חבר הוסר מרשימת החברים", "success", 5000);
            })
            .catch(err => { })
    }


    return (
        <div>
            <button className="w-1/2 text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none"
                onClick={clickHandler}
            >
                {label}
            </button>
        </div>
    )
}

