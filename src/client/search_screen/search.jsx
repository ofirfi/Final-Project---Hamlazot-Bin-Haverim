import '../utils/style.css'
import BackGround from '../images/background.jpg'
import { Navbar } from '../navbar/navbar'
import { Recommended, SearchResults } from './searchResults'
import React, { useEffect, useState } from 'react'
import axios from "axios";
// import { MOVIE_API_KEY, BOOKS_API_KEY, PLACE_API_KEY } from '../utils/config.json'
// import { useDispatch, useSelector } from 'react-redux'
import {Test} from './test'



const SearchPage = (props)=>{
    const token = window.localStorage.getItem('token')
    const [isSearch,setIsSearch] = useState(false);
    const [input,setInput] = useState('');
    const [searchType,setSearchType] = useState("place");
    const [page,setPage] = useState(1);
    
    const [searchResults,setSearchResults] = useState(null);


    const headers = {
        headers: {
            Authorization: "Bearer " +token
    }}

    useEffect(()=>{
        axios.get("http://localhost:8001/recommendations",{
            headers: {
                Authorization: "Bearer " +token
            }
        }).then((res)=>{
            // dispatch({type:"SETRECOMMENDATIONS",payload:res.data.data})
            window.localStorage.setItem('recommendations',JSON.stringify(res.data.data))
            
        }).catch(err => {
            window.localStorage.setItem('logged',false)
        })
    },[])





    // const searchMovie = () => {    // CHECK IF INPUT IS RIGHT/MISSING
    //     setSearchResults2('')
    //     axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&language=he&query=${input}&page=${page}&include_adult=false`)
    //         .then(res=> {
    //             let movies = res.data.results
    //             for(let i = 0; i<movies.length; i++) 
    //                 filler(movies[i],"movie");
    //         })
    //         .catch(err=> err)        
    // }

    // const searchBook = () => {    // CHECK IF INPUT IS RIGHT/MISSING
    //     setSearchResults2('')
    //     axios.get(`https://www.googleapis.com/books/v1/volumes?q=${input}&key=${BOOKS_API_KEY}`)
    //         .then(res=> {
    //             let books = res.data.items
    //             for(let i = 0; i<books.length; i++) 
    //                 filler(books[i],"book");
    //         })
    //         .catch(err=> err)        
    // }

    // const filler = (item,type) =>{
    //     let res;
    //     if (type === "movie") {
    //         res = <div className="flex flex-col border-2 my-2 bg-blue-200">
    //             <div>{item.title}</div>
    //             <div>{item.release_date}</div>
    //             <div>{item.vote_average}</div>
    //         </div>
    //     }
    //     else if(type === "book"){
    //         res = <div className="flex flex-col border-2 my-2 bg-blue-200">
    //             <div>{item.volumeInfo.title}</div>
    //             <div>{item.volumeInfo.categories[0]}</div>
    //         </div>
    //     }
    //     else if(type === "place"){
    //         res = <div className="flex flex-col border-2 my-2 bg-blue-200">
    //             <div>{item.title}</div>
    //             <div>{item.release_date}</div>
    //         </div>
    //     }
    //     setSearchResults2(old => [...old,res]);  
    // }



    // const test = () => {    // CHECK IF INPUT IS RIGHT/MISSING
    //     setIsSearch(true);
    // }

    // function searchBooks(){
    //     axios({
    //         method : 'get',
    //         url : `https://www.googleapis.com/books/v1/volumes?q=${input}&key=${BOOKS_API_KEY}`
    //     })
    //     .then(res => {
    //         //console.log(res)
    //         return res.data
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })
    // }

    // function searchMovie() {
    //     axios.get(`https://api.themoviedb.org/3/movie/${input}?api_key=${MOVIE_API_KEY}&language=he`)
    //         .then((res) => {
    //             console.log(res)
    //         })
    //         .catch((err) => {
    //             console.log(err)
    //         })
    // }




    // const inputParser = () => {
    //     if(input === "")
    //         return
    //     else{
    //         console.log("hi")
    //         searchMovie();
    //     }
    //     console.log(SearchResults2); 
    //     setIsSearch(true);
        
    // }



    const search = async () =>{
        if(!input){
            alert('שדה החיפוש ריק');
            return;
        }
        const res =  await Test(input,searchType,page);
        setSearchResults(res);
        setIsSearch(true);
    }


    return(

        <div className="flex flex-col bg-fixed items-center min-h-full"
            style={{ backgroundImage: `url(${BackGround})`, backgroundSize: '100% 100%'}}
        >
            <Navbar/>

            <div className="flex flex-col bg-fixed items-center margin-3">
                <div className="flex flex-row-reverse bg-fixed items-center mt-6">
                    <input className="flex justify-self text-right w-96 h-12 rounded-full pr-2" 
                        type="text"
                        placeholder="חפש המלצות על מסעדות, הצגות, סרטים וספרים"
                        value = {input}
                        onChange = {event => setInput(event.target.value)}
                    />

                    <lab className="self-right justify-end mx-3">
                        <select className=" w-18 text-black text-center h-10 w-24"
                            value={searchType}
                            onChange={event => setSearchType(event.target.value)}
                        >
                            <option value="place">מסעדה</option>
                            <option value="movie">סרט</option>
                            <option value="book">ספר</option>
                        </select>       
                    </lab>

                    <button className="flex flex-row-reverse items-center grid text-lg bg-green-600 w-16 h-12 rounded-full hover:bg-green-700" 
                        onClick={search}
                        >
                        חפש
                    </button>
                </div>

                {isSearch?
                    // <SearchResults userInput = {input} type={searchType} page={page}/>:
                    <div>{searchResults}</div>:
                    <Recommended/>
                }

            </div>
        </div>
    );
}


export default SearchPage;
