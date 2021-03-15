import '../utils/style.css'
import React, { useEffect, useState } from "react";
import axios from 'axios'
import { searchRecommendation, makeRating } from '../utils/recommendationMethods'
import { useDispatch } from 'react-redux'

export function Recommendations(props) {
    const recommendations = JSON.parse(window.localStorage.getItem('recommendations'));
    const [movieRecommendations, setMovieRecommendations] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        const userName = window.localStorage.getItem('userName')
        const token = window.localStorage.getItem('token')
        const headers = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        axios.post('http://localhost:8001/users', {
            userName,
            self: true
        }, headers)
            .then(res => getRecommendations(res.data.data.friends))
            .catch(err => {

            })

    }, [])


    const getRecommendations = (friendsList) => {
        setMovieRecommendations("")
        let recs = []
        let pos = 0
        for (let i = 0; i < friendsList.length; i++) {
            let index = searchRecommendation(props.movieId, friendsList[i])
            if (index !== -1) {
                recs[pos++] = { rate: recommendations[index].rate, reliability: friendsList[i].reliability }
                createRecommendation(recommendations[index]);
            }
        }
        let results = makeRating(recs, 1);
        dispatch({ type: "SETRATING", payload: results.rate })
        dispatch({ type: "SETRATERS", payload: results.raters })
    }



    const createRecommendation = (rec) => {
        let newRec =
            <div class="flex flex-col mb-5 box-border border-2 bg-red-400 rounded-xl text-xs sm:text-sm ms:text-base">
                <div class="flex flex-row-reverse">
                    <div class="w-1/6">ממליץ</div>
                    <div class="w-5/6">{rec.userName}</div>
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