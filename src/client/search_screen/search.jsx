import '../utils/style.css'
import BackGround from '../images/background.jpg'
import { Navbar } from '../navbar/navbar'
import { Recommended } from './recommanded'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { searchRes } from './searchResults'
import { useHistory } from 'react-router-dom'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import Footer from '../footer/footer'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'



const SearchPage = (props) => {
    const token = window.localStorage.getItem('token')
    const [isSearch, setIsSearch] = useState(false);
    const [input, setInput] = useState('');
    const [searchType, setSearchType] = useState("place");
    const [searchCloseness, setSearchCloseness] = useState(1);
    const [page, setPage] = useState(1);
    const history = useHistory();
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const headers = {
        headers: {
            Authorization: "Bearer " + token
        }
    }

    useEffect(() => {
        axios.get("https://rbfserver.herokuapp.com/recommendations", {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then((res) => {
            window.localStorage.setItem('recommendations', JSON.stringify(res.data.data))

        }).catch(err => {
            window.localStorage.setItem('logged', false)
        })
    }, [])


    const search = async () => {
        if (!input) {
            alert('שדה החיפוש ריק');
            return;
        }
        setIsSearching(true);
        const res = await searchRes(input, searchType, page, history, parseInt(searchCloseness));
        setSearchResults(res);
        setIsSearch(true);
        setIsSearching(false);
    }


    return (

        <div className="flex flex-col bg-fixed items-center min-h-full"
            style={{ backgroundImage: `url(${BackGround})`, backgroundSize: '100% 100%' }}
        >
            <Navbar />

            <div className="flex flex-col bg-fixed items-center min-h-full">

                <div className="flex flex-col sm:flex-row-reverse bg-fixed items-center mx-2 mt-6">
                    <input className="flex justify-self text-center w-96 h-12 my-3 sm:my-0 rounded-full pr-2 focus:outline-none"
                        type="text"
                        placeholder="חפש המלצות על מסעדות, סרטים וספרים"
                        value={input}
                        onChange={event => setInput(event.target.value)}
                    />

                    <div className="flex flex-col items-center text-center mx-3">
                        <InputLabel className="" 
                            id="type">מה לחפש
                        </InputLabel>
                        <Select labelId="type"
                            value = {searchType}
                            onChange={event => setSearchType(event.target.value)}
                            >
                            <MenuItem value="place">אוכל</MenuItem>
                            <MenuItem value="movie">סרט</MenuItem>
                            <MenuItem value="book">ספר</MenuItem>
                        </Select>
                    </div>



                    <div className="flex flex-col items-center text-center mx-3">
                        <InputLabel className="" 
                            id="closeness">רמת חיפוש
                        </InputLabel>
                        <Select labelId="closeness"
                            value = {searchCloseness}
                            onChange={event => setSearchCloseness(event.target.value)}
                            >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                        </Select>
                    </div>

                    {/* <div className="flex flex-col items-center mx-3">
                    <InputLabel htmlFor="closeness">רמת חיפוש</InputLabel>
                    <NativeSelect id="closeness"
                        onChange={event => setSearchCloseness(event.target.value)}
                    >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                    </NativeSelect>
                    </div> */}


                    <button className="flex flex-row-reverse items-center grid text-lg bg-green-600 w-16 h-12 my-3 sm:my-0 rounded-full hover:bg-green-700 focus:outline-none"
                        disabled={isSearching}
                        onClick={search}
                    >

                        {isSearching ?
                            <AiOutlineLoading3Quarters className="grid justify-self-center w-1/2 h-1/2 animate-spin focus:outline-none" />
                            :
                            "חפש"
                        }
                    </button>
                </div>


                {isSearch ?
                    <div>{searchResults}</div> :
                    <div className="hidden sm:block">
                        <Recommended />
                    </div>
                }

            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
}


export default SearchPage;
