import '../utils/style.css'
import React, { useEffect, useState } from "react";
import axios from 'axios'
import searchRecommendations from '../utils/recommendationSearch'

export function Recommendations(props){
    const recommendations = JSON.parse(window.localStorage.getItem('recommendations'));
    const [movieRecommendations, setMovieRecommendations] = useState('')


    useEffect(()=>{
        const userName = window.localStorage.getItem('userName')
        const token = window.localStorage.getItem('token')
        const headers = { headers:{
            Authorization: `Bearer ${token}`
        }}

        axios.post('http://localhost:8001/users',{
            userName,
            self:true
        },headers)
        .then(res=> getRecommendations(res.data.data.friends))
        .catch(err=>{

        })

    },[])


    const getRecommendations = (friendsList)=>{
        setMovieRecommendations("")
        for(let i = 0;i<friendsList.length;i++){
            let index = searchRecommendations(props.movieId,friendsList[i])
            if (index !== -1)
                createRecommendation(recommendations[index]);
        }
    }



    const createRecommendation = (rec) =>{
        let newRec = 
            <div class = "flex flex-col mb-5 box-border border-2 bg-red-400 rounded-xl text-xs sm:text-sm ms:text-base">
                <div class = "flex flex-row-reverse">
                    <div class = "w-1/6">ממליץ</div>
                    <div class = "w-5/6">{rec.userName}</div>
                </div>
                <div class = "flex flex-row-reverse">
                    <div class = "w-1/6">דירוג</div>
                    <div class = "w-5/6">{rec.rate}</div>
                </div>
                <div class = "flex flex-row-reverse">
                    <div class = "w-1/6">תאריך</div>
                    <div class = "w-5/6">{rec.date.substring(0,10)}</div>
                </div>
                <div class = "flex flex-col">
                    <div class = "">:תגובה</div>
                    <div class = "h-12 overflow-y-auto">{rec.comment}</div>
                </div>
            </div>

        setMovieRecommendations(old => [...old, newRec])
    }


    return(
        <div class = "grid flex">
            {movieRecommendations}
        </div>
    )










}