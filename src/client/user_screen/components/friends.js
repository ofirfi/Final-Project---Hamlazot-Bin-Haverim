import '../../utils/style.css'
import { useEffect, useState } from "react"
import { useHistory } from 'react-router-dom'

export function Friends(props) {
    const [myFriends, setmyFriends] = useState('')
    const history = useHistory()

    useEffect(() => {
        fillFriendsList(props.myFriends);
    }, [])


    const fillFriendsList = friendsList => {
        setmyFriends('')
        let toInsert = friendsList.map(friend => fillFriendsRow(friend))
        setmyFriends(toInsert)
    }


    const fillFriendsRow = friend => (
        <tr className="text-xs sm:text-sm md:text-base">
            <td className="w-1/3 border">
                {friend.fullName.split(' ')[0]}
            </td>
            <td className="w-1/3 border">
                {friend.fullName.split(' ')[1]}
            </td>
            <td className="w-1/3 border">
                <button className="underline hover:text-gray-400 focus:outline-none"
                    onClick={() => goUserProfile(friend)}
                >
                    {friend.userName}
                </button>
            </td>
        </tr>
    )


    const goUserProfile = friend => {
        history.push(`/user/${friend.userName}`);
        window.location.reload();
    }


    return (
        <div className="flex flex-col w-full text-white mt-8">

            <div className="h-96 overflow-y-auto">

                <table className="w-full table-fixed self-end text-center border-separate ">

                    <thead>
                        <tr className="text-xs sm:text-sm md:text-base">
                            <th className="w-1/3 border">שם משפחה</th>
                            <th className="w-1/3 border">שם פרטי</th>
                            <th className="w-1/3 border">שם משתמש</th>
                        </tr>
                    </thead>

                    <tbody>
                        {myFriends}
                    </tbody>

                </table>

            </div>

        </div>
    )
}