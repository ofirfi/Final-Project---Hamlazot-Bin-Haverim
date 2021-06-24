import React, { useEffect, useState } from "react";
import '../utils/style.css'
import { GiPopcorn, GiWhiteBook } from 'react-icons/gi'
import { IoRestaurant } from 'react-icons/io5'
import { RecommendationList } from './recommendationList'

export function Recommended(props) {
    const userName = window.localStorage.getItem('userName');
    const [recForMe, setRecForMe] = useState('')
    const headers = {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
        }
    }

    useEffect(() => {
        RecommendationList();
    }, [])


    const foodSearch = () => {
        
    }


    const moviesSearch = () => {

    }


    const booksSearch = () => {

    }


    const recommended = () => {

    }


    return (
        <div className="">
            <div className="flex flex-row space-x-10 my-5 justify-center ">
                <button className="hover:text-gray-600 focus:outline-none"
                    onClick={foodSearch}
                >
                    <IoRestaurant style={{ fontSize: 36 }} />
                    אוכל
                </button>


                <button className="hover:text-gray-600 focus:outline-none"
                    onClick={moviesSearch}
                >
                    <GiPopcorn style={{ fontSize: 36 }} />
                    סרט
                </button>

                <button className="hover:text-gray-600 focus:outline-none"
                    onClick={booksSearch}
                >
                    <GiWhiteBook style={{ fontSize: 36 }} />
                    ספר
                </button>

            </div>

            <div className="flex flex-col bg-fixed items-center font-bold">
                <h1 style={{ color: "rgb(53, 111, 123)" }}>מומלצים</h1>
                <div>

                </div>
            </div>
        </div>
    )
}
