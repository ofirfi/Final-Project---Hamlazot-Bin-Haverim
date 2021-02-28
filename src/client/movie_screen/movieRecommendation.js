import '../utils/style.css'
import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useSelector } from 'react-redux'



export function Recommendations(props){
    const userName = props.userName
    const token = props.token
    const recommandations = useSelector(state=>state.recommendations)
    const [friends,setFriends] = useState('')

    const [movieRecommendations, setMovieRecommendations] = useState('')

    const recs =[
        {userName:"עידן",rate:1,comment:"הערה 1",date:"1-10-2020"},
        {userName:"דנכו",rate:2,comment:"הערה 2",date:"2-10-2020"},
        {userName:"דנכהן",rate:3,comment:"הערה 3",date:"3-10-2020"},
        {userName:"עידן המלך",rate:4,comment:"הערה 4",date:"8-10-2020"},
        {userName:"עידן הנסיך",rate:5,comment:"הערה 5",date:"9-10-2020"},
        {userName:"עידנכוכוס",rate:6,comment:"הערה 6",date:"25-10-2020"},
        {userName:"test",rate:6,comment:"something",date:"25-10-2020"},

    ]

    useEffect(()=>{
        //1. Get friends recommendation + rating
        //2. Creat a container for each reccomendation and
        setMovieRecommendations("")
        recs.map(rec=> createRecommendation(rec))
    },[])

    

    const createRecommendation = (rec) =>{
        
        let newRec = <div class = "flex flex-col mb-5 box-border border-2 bg-red-400 rounded-xl text-xs sm:text-sm ms:text-base">
                <div>ממליץ:{'\t'+rec.userName}</div>
                <div>דירוג: {'\t'+rec.rate}</div>
                <div>הערה: {'\t'+rec.comment}</div>
                <div>תאריך:{'\t'+rec.date}</div>
            </div>

        setMovieRecommendations(old => [...old, newRec])
    }


    return(
        <div class = "">
            {movieRecommendations}
        </div>
    )










}