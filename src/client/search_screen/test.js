import '../utils/style.css'
import { MOVIE_API_KEY, BOOKS_API_KEY, PLACE_API_KEY } from '../utils/config.json'
import axios from 'axios'
import { makeRecommendationsInfo } from '../utils/recommendationMethods'



const headers = {
    headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
    }
}

export function Test(input, type, page, closeness = 1) {
    if (type === "place")
        return placeSearch(input, page, closeness);
    if (type === "movie")
        return movieSearch(input, page, closeness);
    return bookSearch(input, page, closeness);

}


const placeSearch = (input) => {

}







const movieSearch = async (input, page, closeness) => {
    let res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&language=he&query=${input}&page=${page}&include_adult=false`)
        .then(res => {
            if (res.data.results.length === 0)
                return noResults();
            return getMoviesRates(res.data.results, closeness);
        })
        .catch(err => console.log(err))
    return res;
}


const getMoviesRates = async (movies, closeness) => {
    let ratedMovies = [];
    for (let i = 0; i < movies.length; i++) {
        let res = await makeRecommendationsInfo((movies[i].id).toString(), closeness);
        let genres = await getMovieGeneres(movies[i].id);

        let importance = getImportance(res.rate, res.raters);
        let rate = res.rate;
        if (rate === 0)
            rate = (movies[i].vote_average / 2).toFixed(1);

        ratedMovies[i] = {
            rId: movies[i].id,
            name: movies[i].title,
            genres,
            rate,
            raters: res.raters,
            importance,
            image: movies[i].poster_path
        }
    }
    // ratedMovies = recommendationsSort(ratedMovies);
    ratedMovies.sort(recommendationsSort)
    return makeMoviesDiv(ratedMovies);
}

const getMovieGeneres = async (movieId) => {
    let gens = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${MOVIE_API_KEY}&language=he`)
        .then(res => {
            let gens = ""
            res.data.genres.map(genre => gens += genre.name + ", ")
            return gens;
        })
    if (!gens)
        return gens;
    return gens.substring(0, gens.length - 2);
}

const makeMoviesDiv = (movies) => movies.map(movie => MakeMovieDiv(movie))


const MakeMovieDiv = (movie) => {

    return <div className="flex flex-col items-center border-2 my-5 bg-green-200">
        <div>
            <img src={`https://image.tmdb.org/t/p/w500${movie.image}`}
                style={{ height: 100, weight: 100 }}
            />
        </div>
        <div>כוכב אם יש דרוג</div>
        <div>{movie.name}</div>
        <div>{movie.genres}</div>
        <div>{movie.rate}</div>
        <div>{movie.raters}</div>
        <div >
            <button onClick={() => { }}>
                מעבר לדף
            </button>
        </div>
    </div>
}




const bookSearch = (input) => {

}











const getImportance = (rate, raters) => {
    if (raters > 0)
        return 1;
    if (rate > 0)
        return 2;
    return 3;
}

const noResults = () => {
    return <div>
        לא נמצאו תצאות
    </div>
}


const recommendationsSort = (rec1, rec2) => {
    if (rec1.importance < rec2.importance) return 1;
    if (rec2.importance > rec2.importance) return -1;
    if (rec1.rate > rec2.rate) return 1;
    if (rec2.rate < rec2.rate) return -1;
    return 0;
}
