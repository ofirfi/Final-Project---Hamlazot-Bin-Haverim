import '../utils/style.css'
import React, { useEffect, useState } from "react";
import { makeRecommendationsInfo } from '../utils/recommendationMethods'
import { useDispatch } from 'react-redux'

export function Recommendations(props) {
    const [movieRecommendations, setMovieRecommendations] = useState('');
    const dispatch = useDispatch();

    useEffect(async () => {
        setMovieRecommendations("")
        let closeness = props.closeness;
        if(!closeness)
            closeness = 2;

        await makeRecommendationsInfo(props.movieId,closeness)
        .then(res =>{
            dispatch({ type: "SETRATING", payload: res.rate });
            dispatch({ type: "SETRATERS", payload: res.raters });
            
            if(res.myRecommendation)
                createRecommendation(res.myRecommendation,true);

            let friendsRecommendations = res.friendsRecommendations;
            for (let i = 0; i < friendsRecommendations.length; i++)
                createRecommendation(friendsRecommendations[i],true);

            let strangersRecommendations = res.strangersRecommendations;
            for (let j = 0; j < strangersRecommendations.length; j++)
                createRecommendation(strangersRecommendations[j],false);
            
        })
    }, [])


    const createRecommendation = (rec,isFriend) => {
        let newRec =
            <div class="flex flex-col mb-5 box-border border-2 bg-red-400 rounded-xl text-xs sm:text-sm ms:text-base">
                <div class="flex flex-row-reverse">
                    <div class="w-1/6">ממליץ</div>
                    <div class="w-3/6">{rec.userName}</div>
                    <div class="w-2/6 text-2xl">{isFriend? '😎' :null}</div>
                </div>
                <div class="flex flex-row-reverse">
                    <div class="w-1/6">דירוג</div>
                    <div class="w-5/6">{rec.rate}</div>
                </div>
                <div class="flex flex-row-reverse">
                    <div class="w-1/6">תאריך</div>
                    <div class="w-5/6">{rec.date.substring(0, 10)}</div>
                </div>
                <div class="flex flex-col">
                    <div class="">:תגובה</div>
                    <div class="h-12 overflow-y-auto">{rec.comment}</div>
                </div>
            </div>

        setMovieRecommendations(old => [...old, newRec])
    }


    return (
        <div class="grid flex">
            {movieRecommendations}
        </div>
    )


}