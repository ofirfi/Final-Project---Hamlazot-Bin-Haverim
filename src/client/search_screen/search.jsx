import '../utils/style.css'
import BackGround from '../images/background.jpg'
import { Navbar } from '../navbar/navbar'
import { Recommended, SearchResults } from './searchResults'
import React, { useEffect, useState } from 'react'
import './search.scss';
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux'




const SearchPage = (props)=>{
    const token = window.localStorage.getItem('token')
    const dispatch = useDispatch();
    const [isSearch,setIsSearch] = useState(false);
    const [input,setInput] = useState('');
    const [searchType,setSearchType] = useState('all')

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
            dispatch({type:"SETRECOMMENDATIONS",payload:res.data.data})
            window.localStorage.setItem('recommendations',JSON.stringify(res.data.data))
            
        }).catch(err => {
            window.localStorage.setItem('logged',false)
        })
    },[])


    const searcher = () => {
        const toSearch = 'צדקיהו'
        axios.get(`http://localhost:8001/place/search/${toSearch}`,headers)
        .then(res=>{
            console.log(res)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const test = () => {    // CHECK IF INPUT IS RIGHT/MISSING
        setIsSearch(true);
    }

    const searchBooks = () => {
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

    return(

        <div className="flex flex-col bg-fixed items-center"
            style={{ backgroundImage: `url(${BackGround})`, backgroundSize: '100% 100%'}}
        >
            <Navbar/>

            <div className="flex flex-col bg-fixed items-center">
                <div className="flex flex-row-reverse bg-fixed items-center mt-6">
                    <input className="flex justify-self text-right w-96 h-12 rounded-full pr-2" 
                        type="text"
                        placeholder="חפש המלצות על מסעדות, הצגות, סרטים וספרים"
                        value = {input}
                        onChange = {event => setInput(event.target.value)}
                    />
                    <button className="flex flex-row-reverse text-lg mx-4 bg-green-600 w-16 h-12 rounded-full hover:bg-green-700" 
                        onClick={test}
                        >
                        חפש
                    </button>
                </div>

                {isSearch?
                    <SearchResults searchRes = {input} type={searchType}/>:
                    <Recommended/>
                }

            </div>
        </div>
    );
}


export default SearchPage;
