import '../../utils/style.css'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { Alert } from '../../alertComponent/alert'


export function Recommendations() {
    const history = useHistory();
    const dispatch = useDispatch();
    const userName = window.localStorage.getItem('userName');
    const [myRecommandations, setMyRecommandations] = useState('');
    const headers = {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
        }
    };


    useEffect(() => {
        axios.post("https://rbfserver.herokuapp.com/users", {
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
        <tr id={recommend.rId} className="overflow-y-auto text-xs sm:text-sm md:text-base">
            <td className="w-1/12 h-16 md:h-24 border-l border">
                <button className="w-full h-full bg-red-700 hover:bg-red-900 focus:outline-none"
                    onClick={() => deleteRecommendation(recommend.rId, recommend.name)}
                >
                    מחק
                </button>
            </td>
            <td className="w-1/12 h-16 md:h-24 border-l border">
                <button className="w-full h-full bg-blue-500 hover:bg-blue-700 focus:outline-none"
                    onClick={() => editRecommendation(recommend)}
                >
                    ערוך
                </button>
            </td>
            <td className="w-4/12 h-16 md:h-24 border">
                <div className="w-full h-full overflow-y-auto overflow-x-auto flex items-center grid justify-items-center">
                    {recommend.comment}
                </div>
            </td>
            <td className="w-1/12 h-16 md:h-24 border">
                {recommend.date.substring(0, 10)}
            </td>
            <td className="w-1/12 h-16 md:h-24 border">
                {recommend.rate}
            </td>
            <td className="w-4/12 h-16 md:h-24 border">
                <div className="w-full h-full overflow-y-auto overflow-x-auto flex items-center grid justify-items-center underline cursor-pointer hover:text-gray-300"
                    onClick={() => goToRecommendationPage(recommend)}
                >
                    {recommend.name}
                </div>
            </td>
        </tr>
    )


    const goToRecommendationPage = (recommendation) => {
        if (recommendation.type === "מקום")
            history.push(`/place/${recommendation.rId}`);
        else if (recommendation.type === "סרט")
            history.push(`/movie/${recommendation.rId}`);
        else
            history.push(`/book/${recommendation.rId}`);
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


    const deleteRecommendation = (rId, name) =>
        Alert("", `האם אתה בטוח שברצונך למחוק את ההמלצה עבור ${name}?`, "danger", 0, () => deleteConfirmed(rId))


    const deleteConfirmed = rId => {
        axios.delete("https://rbfserver.herokuapp.com/recommendations",
            {
                headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` },
                data: { userName, rId }
            })
            .then(res => {
                document.getElementById(rId).remove();
                Alert("", "ההמלצה נמחקה", "success", 5000);
            })
            .catch(err => console.log(err))
    }


    return (
        <div className="flex flex-col w-full text-white">
            <div className="self-center text-center text-2xl underline font-bold my-5">
                ההמלצות שלי
            </div>

            <div className="h-72 md:h-96 overflow-y-auto">
                <table className="table-fixed w-full self-end text-center border-separate">
                    <thead>
                        <tr className="text-sm sm:text-base">
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