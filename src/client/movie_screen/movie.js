import '../utils/style.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BackGround from '../images/background.jpg'
import { Recommendations } from '../recommendations_component/recommendation'
import { Navbar } from '../navbar/navbar'
import { Form } from '../utils/form'
import { useSelector, useDispatch } from 'react-redux'
import { MOVIE_API_KEY } from '../utils/config.json'
import { useHistory } from 'react-router-dom'


const MoviePage = (props) => {
    const movieId = props.match.params.id;
    const [movie, setMovie] = useState('');
    const [genres, setGenres] = useState('');
    const [poster, setPoster] = useState('');
    const closeness = (props.location && props.location.state)?props.location && props.location.state.closeness : 1;
    const isForm = useSelector(state => state.isForm);
    const dispatch = useDispatch();
    const history = useHistory();
    const rating = useSelector(state => state.rating);
    const raters = useSelector(state => state.raters);
    const [voteAverage,setvoteAverage] = useState('');

    useEffect(() => {
        if (movieId > 60 && movieId < 806126) 
            axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${MOVIE_API_KEY}&language=he`)
                .then((res) => {
                    setMovie(res.data);
                    getGeneres(res.data);
                    setPoster(`https://image.tmdb.org/t/p/w500${res.data.poster_path}`);
                    setvoteAverage((res.data.vote_average /2).toFixed(1));
                })
                .catch(() => {
                    history.push('/404');
                })
        else
            history.push('/404');
    }, [])


    const getGeneres = (movie) => {
        let gens = ""
        movie.genres.map(genre => {
            return gens += genre.name + " "
        })
        setGenres(gens)
    }


    const createRecommendation = () =>{
        dispatch({
            type: "SETFORMINFO",
            payload: {
                rId: movieId,
                name: movie.title,
                rate: 1,
                comment: "",
                type: "סרט",
            }
        })
        dispatch({ type: "TOGGLEFORM" })
    }

    
    return (
        <div className="flex flex-col bg-fixed items-center"
            style={{ backgroundImage: `url(${BackGround})`, backgroundSize: '100% 100%' }}
        >
            <Navbar />

            <div className="flex flex-col my-24 bg-white box-border w-3/4 sm:h-5/6 sm:w-2/4 border-4 rounded-lg">

                {/*title + genres + release*/}
                <div className="flex flex-col w-full sm:h-2/6 grid divide-y-2  divide-black divide-opacity-25 bg-white mt-4">
                    <div className="flex items-center h-3/4 text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-black  justify-self-center text-center">
                        {movie.title}
                    </div>

                    <div className="h-1/4 grid grid-cols-2 divide-x divide-green-500 text-xs sm:text-sm text-center">
                        <div className="">
                            תאריך יציאה: {movie.release_date}
                        </div>
                        <div className="">
                            ג'נאר: {genres}
                        </div>
                    </div>
                    <div className="h-1/4 grid grid-cols-2 divide-x divide-green-500 text-xs sm:text-sm text-center">
                        <div className="">
                            חברים שדרגו: {raters}
                        </div>
                        <div className="text-red-700 font-black">
                            דירוג: 5 / {rating!==0? rating : voteAverage}
                        </div>
                    </div>
                </div>

                {/*Photo*/}
                <div className="flex flex-row w-full h-2/6  grid justify-items-center bg-gray-300">
                    <div className="flex flex-row w-1/2">
                        <img src={poster} alt="" />
                    </div>
                </div>


                <div className="flex flex-col h-16 sm:h-1/6 text-xs sm:text-sm mt-5 mx-2"> {/*overview*/}
                    <div className="flex justify-end underline">
                        תקציר
                    </div>
                    <div className="flex justify-start text-right  overflow-y-auto">
                        {movie.overview}
                    </div>
                </div>


                <div className="flex flex-col h-40 sm:h-1/6 text-right mt-5 mx-2"> {/* Recommendations */}
                    <div className="underline mb-2">
                        המלצות
                    </div>
                    <div className="max-h-52 overflow-y-auto">
                        <Recommendations rId={movieId} closeness = {closeness} />
                    </div>

                    <button className="self-center border-4 border-transparent text-sm sm:text-base rounded-full p-1 bg-blue-300 text-white my-2 focus:outline-none"
                        onClick={() => createRecommendation()}
                    >
                        הוסף המלצה
                        </button>


                </div>

            </div>
            {isForm ? <Form btnLabel = "הוסף"/> : null}
        </div>
    )

}

export default MoviePage