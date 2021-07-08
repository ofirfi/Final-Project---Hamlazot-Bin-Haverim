import '../../utils/style.css'
import { useEffect, useState } from "react"
import { useHistory } from 'react-router-dom'


export function Recommendations(props) {
    const [myRecommandations, setMyRecommandations] = useState('');
    const history = useHistory();


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


    const createRecommendation = recommend => (
        <tr className="text-xs sm:text-sm md:text-base overflow-y-auto">
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
                <button className="underline hover:text-gray-400 focus:outline-none"
                    onClick={() => goToRecommendationPage(recommend)}
                >
                    {recommend.name}
                </button>
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


    return (
        <div className="flex flex-col w-full text-white">

            <div className="overflow-y-auto">

                <table className="table-fixed self-end text-center border-separate">

                    <thead>
                        <tr className="text-xs sm:text-sm md:text-base">
                            <th className="w-4/12 border">הערה</th>
                            <th className="w-1/12 border">תאריך</th>
                            <th className="w-1/12 border">דירוג</th>
                            <th className="w-4/12 border">שם</th>
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