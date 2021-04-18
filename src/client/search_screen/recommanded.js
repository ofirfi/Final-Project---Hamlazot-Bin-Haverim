import React, { useEffect, useState } from "react";
import '../utils/style.css'
import axios from 'axios'
import Gallery from 'react-grid-gallery';
import { GiPopcorn, GiWhiteBook, GiExitDoor } from 'react-icons/gi'
import { SiCoffeescript } from 'react-icons/si'
import { IoRestaurant } from 'react-icons/io5'
import { useHistory } from 'react-router-dom'
import { MOVIE_API_KEY, BOOKS_API_KEY, PLACE_API_KEY } from '../utils/config.json'


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
    const token = props.token
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

    const headers = {
        headers: {
            Authorization: "Bearer " +token
    }}

    const resturantsSearch = () => {
        history.push('/place');
    }

    const coffeSearch = () => {
        const toSearch = 'צדקיהו'
        axios.get(`http://localhost:8001/place/search/${toSearch}`,headers)
        .then(res=>{
            console.log(res)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const moviesSearch = () => {
        history.push('/movie/414771');
    }

    const booksSearch = () => {
        axios({
            method : 'get',
            url : `https://www.googleapis.com/books/v1/volumes?q=מקום+טוב&key=AIzaSyCxqgytYz4Y_bRBMlJ1vms2aA5fU1Lm074`
        })
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <div>
            <div className="flex flex-row space-x-10 my-5 justify-center">
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
    const [SearchResults,setSearchResults] = useState('');


    useEffect(() => {
        setMyRecommandations("")
        console.log(props.userInput);
        if(props.type === "1")
            placeSearch(props.userInput);
        else if(props.type === "2")
            movieSearch(props.userInput);
        else
            bookSearch(props.userInput);
    },[] )



    const placeSearch = (input) =>{
        console.log('places');
    }
    const movieSearch = (input) =>{
        console.log('movies');
    }
    const bookSearch = (input) =>{
        console.log('books');
    }



    const createPlaceResult = (res) => {
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



    const search = () => {
        console.log("hi")
        if(props.type === "2")
            searchMovie()
        else if(props.type === "3")
            searchBook()
    }

    const searchMovie = () => {    // CHECK IF INPUT IS RIGHT/MISSING
        setSearchResults('')
        console.log(props.userInput);
        axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&language=he&query=${props.userInput}&page=${props.page}&include_adult=false`)
            .then(res=> {
                let movies = res.data.results
                for(let i = 0; i<movies.length; i++) 
                    filler(movies[i],"2");
            })
            .catch(err=> err)        
    }

    const searchBook = () => {    // CHECK IF INPUT IS RIGHT/MISSING
        setSearchResults('')
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${props.input}&key=${BOOKS_API_KEY}`)
            .then(res=> {
                let books = res.data.items
                for(let i = 0; i<books.length; i++) 
                    filler(books[i],"book");
            })
            .catch(err=> err)        
    }

    const filler = (item,type) =>{
        console.log("hi2")
        let res;
        search();
        if (props.type === "2") {
            res = <div className="flex flex-col border-2 my-2 bg-blue-200">
                <div>{item.title}</div>
                <div>{item.release_date}</div>
                <div>{item.vote_average}</div>
            </div>
        }
        else if(type === "3"){
            res = <div className="flex flex-col border-2 my-2 bg-blue-200">
                <div>{item.volumeInfo.title}</div>
                <div>{item.volumeInfo.categories[0]}</div>
            </div>
        }
        else if(type === "1"){
            res = <div className="flex flex-col border-2 my-2 bg-blue-200">
                <div>{item.title}</div>
                <div>{item.release_date}</div>
            </div>
        }
        setSearchResults(old => [...old,res]);  
        console.log(SearchResults) 
    }





    return (
        <div className="flex flex-col text-right mt-5 mx-2">
            <div className="flex flex-row-reverse self-center text-lg">
                תוצאות החיפוש שלך:
                    </div>
            <div className="flex flex-col w-96 bg-white">
                {SearchResults}
            </div>
        </div>
    )
}