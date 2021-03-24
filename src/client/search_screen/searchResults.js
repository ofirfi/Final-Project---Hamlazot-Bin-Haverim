import React, { useEffect, useState } from "react";
import '../utils/style.css'
import axios from 'axios'
import Gallery from 'react-grid-gallery';
import { GiPopcorn, GiWhiteBook, GiExitDoor } from 'react-icons/gi'
import { SiCoffeescript } from 'react-icons/si'
import { IoRestaurant } from 'react-icons/io5'
import { useHistory } from 'react-router-dom'


const IMAGES =
    [{
        src: "https://media-cdn.tripadvisor.com/media/photo-s/11/51/dd/e3/large-delicious-dishes.jpg",
        thumbnail: "https://media-cdn.tripadvisor.com/media/photo-s/11/51/dd/e3/large-delicious-dishes.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 212,
        tags: [{ value: "לנדוור", title: "לנדוור" }],
        caption: "לנדוור סינמה סיטי, ירושלים",
    },
    {
        src: "https://www.gansipur.co.il/warehouse/dynamic/64199.jpg",
        thumbnail: "https://www.gansipur.co.il/warehouse/dynamic/64199.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 212,
        tags: [{ value: "קפה גן סיפור", title: "קפה גן סיפור" }],
        caption: "קפה גן סיפור, ירושלים"
    },
    {
        src: "https://www.my-events.co.il/wp-content/uploads/2017/07/rimonbistro-halavi-a2.jpg",
        thumbnail: "https://www.my-events.co.il/wp-content/uploads/2017/07/rimonbistro-halavi-a2.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 212,
        tags: [{ value: "קפה רימון", title: "קפה רימון" }],
        caption: "קפה רימון, ירושלים"
    }]


export function Recommended(props) {
    // const token = props.token
    const history = useHistory();
    // const userName = props.userName
    // const [recForMe, setRecForMe] = useState('')
    // const headers = { headers:{
    //     Authorization: "Bearer "+ token
    // }}

    useEffect(() => {

    }, [])


    // const fillRec = recList => {
    //     setRecForMe('')
    //     let toInsert = recList.map(rec => {
    //         return(
    //             <div></div>
    //         )
    //     })
    //     setRecForMe(toInsert)
    // }

    const resturantsSearch = () => {
        history.push('/place');
    }

    const coffeSearch = () => {

    }

    const moviesSearch = () => {
        history.push('/movie/414771');
    }

    const booksSearch = () => {
        
    }

    return (
        <div>
            <div className="flex flex-row space-x-10 justify-center">
                <button className="btn"
                    onClick={resturantsSearch}
                >
                    <IoRestaurant style={{ fontSize: 36 }} />
                    <p />מסעדה
                </button>

                <button className="btn"
                    onClick={ coffeSearch }
                >
                    <SiCoffeescript style={{ fontSize: 36 }} />
                    <p />בית קפה
                </button>

                <button className="btn"
                    onClick = { moviesSearch }
                >
                    <GiPopcorn style={{ fontSize: 36 }} />
                    <p />סרט
                </button>

                <button className="btn"
                    onClick = { booksSearch }
                >
                    <GiWhiteBook style={{ fontSize: 36 }} />
                    <p />ספר
                </button>

            </div>

            <div className="flex flex-col bg-fixed items-center">
                <h1 style={{ color: "rgb(53, 111, 123)" }}>מומלצים</h1>
                {/* <Gallery images={fillRec} /> */}
            </div>
        </div>
    )
}


export function SearchResults(props) {
    const userName = window.localStorage.getItem('userName')
    const recommendations = JSON.parse(window.localStorage.getItem('recommendations'))
    const [myRecommandations, setMyRecommandations] = useState('')
    const tempResults = [
        { name: "קפה רימון", rate: "5", isOpen: "פתוח" },
        { name: "קפה רימון", rate: "4", isOpen: "פתוח" },
        { name: "קפה רימון", rate: "5", isOpen: "פתוח" },
        { name: "קפה רימון", rate: "4", isOpen: "פתוח" },
        { name: "קפה רימון", rate: "5", isOpen: "פתוח" },
        { name: "קפה רימון", rate: "4", isOpen: "פתוח" },
        { name: "קפה רימון", rate: "5", isOpen: "פתוח" },
        { name: "קפה רימון", rate: "4", isOpen: "פתוח" }
    ]


    const createResult = (res) => {
        const newRes = (
            <div className="flex flex-col bg-green-400 m-4 p-2">
                <div className="text-lg font-bold">
                    {res.name}
                </div>
                <div className="text-base">
                    דירוג: {res.rate}
                </div>
                <div className="text-base">
                    {res.isOpen}
                </div>
            </div>
        )
        setMyRecommandations(oldResults => [...oldResults, newRes])
    }






    useEffect(() => {
        setMyRecommandations("")
        for (let i = 0; i < tempResults.length; i++) {
            createResult(tempResults[i]);
        }
    }, [])

    return (
        <div className="flex flex-col text-right mt-5 mx-2">
            <div className="flex flex-row-reverse self-center text-lg">
                תוצאות החיפוש שלך:
                    </div>
            <div className="flex flex-col w-96 bg-white">
                {myRecommandations}
            </div>
        </div>
    )
}