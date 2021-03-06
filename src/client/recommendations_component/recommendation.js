import '../utils/style.css'
import React, { useEffect, useState } from "react";
import { makeRecommendationsInfo } from '../utils/recommendationMethods'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'


export function Recommendations(props) {
    const [recommendations, setRecommendations] = useState('');
    const dispatch = useDispatch();
    const history = useHistory();


    useEffect(async () => {
        setRecommendations("")
        let closeness = props.closeness;
        if (!closeness)
            closeness = 1;

        await makeRecommendationsInfo(props.rId, closeness)
            .then(res => {
                dispatch({ type: "SETRATING", payload: res.rate });
                dispatch({ type: "SETRATERS", payload: res.raters });

                if (res.myRecommendation)
                    createRecommendation(res.myRecommendation, true);

                let friendsRecommendations = res.friendsRecommendations;
                for (let i = 0; i < friendsRecommendations.length; i++)
                    createRecommendation(friendsRecommendations[i], true);

                let strangersRecommendations = res.strangersRecommendations;
                for (let j = 0; j < strangersRecommendations.length; j++)
                    createRecommendation(strangersRecommendations[j], false);
            })
    }, [])


    const createRecommendation = (rec, isFriend) => {
        let newRec =
            <div class="flex flex-col mb-5 box-border border-2 bg-green-300 rounded-xl text-xs sm:text-sm ms:text-base cursor-pointer p-2"
                onClick={() => history.push(`/user/${rec.userName}`)}
            >
                <div class="flex flex-col-reverse">
                    <div className="text-base font-bold mb-2"> {isFriend ? '😎' : null} {rec.userName} </div>
                </div>
                <div class="flex flex-row-reverse">
                    <div class="w-1/12">דירוג</div>
                    <div class="w-11/12">{rec.rate}</div>
                </div>
                <div class="flex flex-row-reverse">
                    <div class="w-1/12">תאריך</div>
                    <div class="w-11/12">{rec.date.substring(0, 10)}</div>
                </div>
                <div class="flex flex-col">
                    <div class="">תגובה</div>
                    <div class="h-12 overflow-y-auto">{rec.comment}</div>
                </div>
            </div>

        setRecommendations(old => [...old, newRec])
    }


    return (
        <div class="grid flex">
            {recommendations}
        </div>
    )


}