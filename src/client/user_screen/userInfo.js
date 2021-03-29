import '../utils/style.css'
import React, { useEffect, useState } from "react"




export function Recommendations(props) {
    const [myRecommandations, setMyRecommandations] = useState('');

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


    return (
        <div className="flex flex-col w-full text-white mt-8">

            <div className="h-96 overflow-y-auto">
                <table className="table-fixed self-end text-center border-separate">
                    <thead>
                        <tr>
                            <td className="w-4/12 border">הערה</td>
                            <td className="w-1/12 border">תאריך</td>
                            <td className="w-1/12 border">דירוג</td>
                            <td className="w-4/12 border">שם</td>
                        </tr>
                    </thead>
                    <tbody className="h-24 overflow-y-auto">
                        {myRecommandations}
                    </tbody>
                </table>
            </div>
        </div>
    )
}



export function Friends(props) {
    const [myFriends, setmyFriends] = useState('')

    useEffect(() => {
        fillFriendsList(props.myFriends);
    }, [])


    const fillFriendsList = friendsList => {
        setmyFriends('')
        let toInsert = friendsList.map(friend => (
            <tr>
                <td className="w-1/3 border">
                    {friend.fullName.split(' ')[0]}
                </td>
                <td className="w-1/3 border">
                    {friend.fullName.split(' ')[1]}
                </td>
                <td className="w-1/3 border">
                    {friend.userName}
                </td>
            </tr>
        )
        )
        setmyFriends(toInsert)
    }



    return (
        <div className="flex flex-col w-full text-white mt-8">

            <div className="h-96 overflow-y-auto">
                <table className="w-full table-fixed self-end text-center border-separate ">
                    <thead>
                        <tr>
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