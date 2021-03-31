import '../../utils/style.css'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'


export function Recommendations() {
    const dispatch = useDispatch();
    const userName = window.localStorage.getItem('userName');
    const [myRecommandations, setMyRecommandations] = useState('');
    const headers = {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
        }
    };


    useEffect(() => {
        axios.post("http://localhost:8001/users", {
            userName,
            self: true
        }, headers)
            .then(res => getRecommendations(res.data.data.recommendations))
            .catch(err => console.log(err))
    }, [])


    const getRecommendations = myRecommendations => {
        if (!myRecommendations)
            return;

        setMyRecommandations('');
        const myRecs = myRecommendations.map(recommend => createRecommendation(recommend))
        setMyRecommandations(myRecs)
    }


    const createRecommendation = recommend => (
        <tr id={recommend.rId} className="overflow-y-auto">
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


    const deleteRecommendation = rId =>
        axios.delete("http://localhost:8001/recommendations",
            {
                headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` },
                data: { userName, rId }
            })
            .then(res => {
                document.getElementById(rId).remove();
                alert('ההמלצה נמחקה');
            })
            .catch(err => console.log(err))



    return (
        <div className="flex flex-col w-full text-white">
            <div className="self-center text-center text-2xl underline font-bold my-5">
                ההמלצות שלי
            </div>

            <div className="h-96 overflow-y-auto">
                <table className="table-fixed w-full self-end text-center border-separate">
                    <thead>
                        <tr>
                            <td className="w-1/12"></td>
                            <td className="w-1/12"></td>
                            <td className="w-3/12 border">הערה</td>
                            <td className="w-2/12 border">תאריך</td>
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