import '../utils/style.css'
import BackGround from '../images/background.jpg'
import { Navbar } from '../navbar/navbar'
import { Recommended } from './recommanded'
import React, { useEffect, useState } from 'react'
import axios from "axios";
// import { MOVIE_API_KEY, BOOKS_API_KEY, PLACE_API_KEY } from '../utils/config.json'
// import { useDispatch, useSelector } from 'react-redux'
import {searchRes} from './searchResults'



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


    const search = async () =>{
        if(!input){
            alert('שדה החיפוש ריק');
            return;
        }
        const res =  await searchRes(input,searchType,page);
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
                            <option value="place">אוכל</option>
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
