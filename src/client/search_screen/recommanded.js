import React, { useEffect, useState } from "react";
import '../utils/style.css'
import { GiPopcorn, GiWhiteBook } from 'react-icons/gi'
import { IoRestaurant } from 'react-icons/io5'
import { RecommendedList } from './recommended/recommendedList'
import { MakeFriendsRecommendationList } from './makeFriendsRecommendationList'
import { useHistory } from 'react-router-dom'


export function Recommended() {
    const [recommendedMovies, setRecommendedMovies] = useState('');
    const [recommendedBooks, setRecommendedBooks] = useState('');
    const [recommendedPlaces, setRecommendedPlaces] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const history = useHistory();

    useEffect(async () => {
        let { movies, books, places } = await MakeFriendsRecommendationList();
        setRecommendedMovies(movies);
        setRecommendedBooks(books);
        setRecommendedPlaces(places);
        setIsLoaded(true);

    }, [])


    const isValid = (itemToSearch) => {
        if (!isLoaded) {
            alert('not loaded');
            return false;
        }
        if (!itemToSearch || itemToSearch.length === 0) {
            alert('no recs');
            return false;
        }
        return true;
    }


    const getRandomInt = max => {
        return Math.floor(Math.random() * max);
    }


    const foodSearch = () => {
        if (!isValid(recommendedPlaces))
            return;
        let random = getRandomInt(recommendedPlaces.length);
        history.push(`/place/${recommendedPlaces[random].rId}`)

    }


    const moviesSearch = () => {
        if (!isValid(recommendedMovies))
            return;
        let random = getRandomInt(recommendedMovies.length);
        history.push(`/movie/${recommendedMovies[random].rId}`)
    }


    const booksSearch = () => {
        if (!isValid(recommendedBooks))
            return;
        let random = getRandomInt(recommendedBooks.length);
        history.push(`/book/${recommendedBooks[random].rId}`)
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

                <div className="flex flex-row-reverse text-center">
                    {isLoaded ? <RecommendedList title="movie" items={recommendedMovies} /> : null}
                    {isLoaded ? <RecommendedList title="book" items={recommendedBooks} /> : null}
                    {isLoaded ? <RecommendedList title="place" items={recommendedPlaces} /> : null}
                    <div />
                </div>

            </div>

        </div >
    )
}
