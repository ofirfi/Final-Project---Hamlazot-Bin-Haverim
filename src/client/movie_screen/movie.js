import '../utils/style.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { useHistory } from 'react-router-dom'
import Header from '../images/logo.jpg'
import BackGround from '../images/background.jpg'
import { FcSettings } from 'react-icons/fc'
import { GiExitDoor } from 'react-icons/gi'
import { Recommendations } from './movieRecommendation'

import { Navbar } from '../navbar/navbar'


const MoviePage = () => {
    const userName = window.localStorage.getItem('userName')
    const token = window.localStorage.getItem('token')

    const history = useHistory();


    const [movie,setMovie] = useState('')
    const [genres,setGenres] = useState('')


    useEffect(()=>{
        axios.get("https://api.themoviedb.org/3/movie/414771?api_key=a69ec695d12d89a6b5e1178a4640d2ef&language=he")
        .then((res)=>{
            setMovie(res.data)
            getGeneres(res.data)
        }).catch(err => console.log(err))
    },[])


    const getGeneres = (movie) =>{
        let gens = ""
        movie.genres.map(genre =>{
            return gens+=genre.name+" "
        })
        setGenres(gens)
    }

    const go_profile = () => {
        history.push('/profile')
    }

    const log_out = ( )=> {
        alert('להתראות '+userName+' מקווים לראותך שוב!')
        window.localStorage.setItem('logged', false)
        history.push('/login');
    }

    return (
        <div className="flex flex-col bg-fixed items-center"
            style={{ backgroundImage: `url(${BackGround})`, backgroundSize: '100% 100%' }}
        >
            <Navbar/>

            <div className = "flex flex-col my-24 bg-white box-border w-3/4 sm:h-5/6 sm:w-2/4 border-4 rounded-lg">

                        {/*title + genres + release*/}
                <div className = "flex flex-col w-full sm:h-2/6 grid divide-y-2  divide-black divide-opacity-25 bg-white ">
                    <div className = "flex items-center h-3/4 text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-black underline justify-self-center text-center">
                        {movie.title}   
                    </div>

                    <div className = "h-1/4 grid grid-cols-2 divide-x divide-green-500 text-xs sm:text-sm text-center">
                        <div className = "">
                            תאריך יציאה: {movie.release_date}
                        </div>
                        <div className = "">
                            ג'נאר: {genres}
                        </div>
                    </div>
                </div>

                        {/*Photo*/}
                <div className="flex flex-row w-full h-2/6  grid justify-items-center bg-gray-300"> 
                    <div className = "flex flex-row w-1/2">
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}/>
                    </div>
                </div>
                
                
                <div className = "flex flex-col h-16 sm:h-1/6 text-xs sm:text-sm mt-5"> {/*overview*/}
                    <div className = "flex justify-end underline">
                        תקציר
                    </div>
                    <div className = "flex justify-start text-right  overflow-y-auto">
                        {movie.overview}
                    </div>
                </div>


                <div className = "flex flex-col h-40 sm:h-1/6 text-right mt-5 "> {/* Recommendations */}
                    <div className = "underline mb-2">
                        המצלות
                    </div>
                    <div className = "max-h-52 overflow-y-auto">
                    <Recommendations/>
                    </div>
                </div>
            </div>



        </div>
    )

}

export default MoviePage