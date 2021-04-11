import '../utils/style.css'
import { MOVIE_API_KEY, BOOKS_API_KEY, PLACE_API_KEY } from '../utils/config.json'
import axios from 'axios'
import { makeRecommendationsInfo } from '../utils/recommendationMethods'
import { BsPersonCheckFill } from 'react-icons/bs'
const placeApiKey = require("../utils/config.json").PLACE_API_KEY;

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


const placeSearch = async (input, page = 1, closeness) => {
    let res = axios.get(`http://localhost:8001/place/search/${input}`,headers)
        .then(res => {
            console.log(res);
            if (res.data.results.length === 0)
                return noResults();
            return getPlaceRates(res.data.results, closeness);
        })
        .catch(err => console.log(err))
    return res;
}

const getPlaceRates = async (places, closeness) => {
    let ratedPlaces = [];//console.log(places);
    for (let i = 0; i < places.length; i++) {
        let res = await makeRecommendationsInfo((places[i].place_id).toString(), closeness);
        let importance = getImportance(res.rate, res.raters);
        let rate = res.rate;
        let isOurRate = true;
        if (importance === 3)
            isOurRate = false;
        if (rate === 0)
            rate = (places[i].rating).toFixed(1);
        let isOpenNow = `פתוח עכשיו`;
        if (!places[i].opening_hours)
            isOpenNow = ``;
        else if (!places[i].opening_hours.open_now)
            isOpenNow = `סגור כעת`;

        let image = `אין תמונה זמינה`
        if (places[i].photos)
            image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${places[i].photos[0].photo_reference}&key=${PLACE_API_KEY}`;

        ratedPlaces[i] = {
            rId: places[i].place_id,
            name: places[i].name,
            address: places[i].formatted_address,
            isOpenNow,
            rate,
            raters: res.raters,
            isOurRate,
            importance,
            image
        }
    }
    ratedPlaces.sort(recommendationsSort)
    return makePlacesDiv(ratedPlaces);
}

const makePlacesDiv = (places) => places.map(place => MakePlaceDiv(place))

const MakePlaceDiv = (place) => {
    let friendIcon;
    if(place.isOurRate == true)
        friendIcon = <BsPersonCheckFill/>;
    return <div className="flex flex-col items-center border-2 my-5 bg-green-200">
        <div>
            <img src={place.image}
                style={{ height: 100, weight: 100 }}
            />
        </div>
        <div>{friendIcon}</div>
        <div>{place.name}</div>
        <div>{place.address}</div>
        <div>{place.isOpenNow}</div>
        <div>דירוג: {place.rate}</div>
        <div>חברים שדירגו: {place.raters}</div>
        <div >
            <button onClick={() => { }}>
                מעבר לדף
            </button>
        </div>
    </div>
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
        let isOurRate = true;
        if (importance === 3)
            isOurRate = false;
        if (rate === 0)
            rate = (movies[i].vote_average / 2).toFixed(1);

        ratedMovies[i] = {
            rId: movies[i].id,
            name: movies[i].title,
            genres,
            rate,
            raters: res.raters,
            isOurRate,
            importance,
            image: movies[i].poster_path
        }
    }
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
    let friendIcon;
    if(movie.isOurRate == true)
        friendIcon = <BsPersonCheckFill/>;
    return <div className="flex flex-col items-center border-2 my-5 bg-green-200">
        <div>
            <img src={`https://image.tmdb.org/t/p/w500${movie.image}`}
                style={{ height: 100, weight: 100 }}
            />
        </div>
        <div>{friendIcon}</div>
        <div>{movie.name}</div>
        <div>{movie.genres}</div>
        <div>דירוג: {movie.rate}</div>
        <div>חברים שדירגו: {movie.raters}</div>
        <div >
            <button onClick={() => { }}>
                מעבר לדף
            </button>
        </div>
    </div>
}




const bookSearch = (input, page, closeness) => {
    let res = axios.get(`https://www.googleapis.com/books/v1/volumes?q=${input}&key=${BOOKS_API_KEY}&language=iw`)
        .then(res => {
            console.log(res)
            if (res.data.items.length === 0)
                return noResults();
            return getBooksRates(res.data.items, closeness);
        })
        .catch(err => console.log(err))
    return res;
}

const getBooksRates = async (books, closeness) => {
    let ratedBooks = [];
    for (let i = 0; i < books.length; i++) {
        let res = await makeRecommendationsInfo((books[i].id).toString(), closeness);
        // let genres = await getMovieGeneres(movies[i].id);
        
        let importance = getImportance(res.rate, res.raters);
        let rate = res.rate;
        let isOurRate = true;
        if (importance === 3)
            isOurRate = false;
        if (rate === 0)
            rate = `אין דירוג זמין`;

        let author = ``;
        if (books[i].volumeInfo.authors)
            author = books[i].volumeInfo.authors[0];
        
        let image = `אין תמונה זמינה`;
        if (books[i].volumeInfo.imageLinks)
            image = books[i].volumeInfo.imageLinks.thumbnail;

        ratedBooks[i] = {
            rId: books[i].id,
            name: books[i].volumeInfo.title,
            author,
            // genres: books[i].volumeInfo.categories,
            rate,
            raters: res.raters,
            isOurRate,
            importance,
            image
        }
    }
    ratedBooks.sort(recommendationsSort)
    return makeBooksDiv(ratedBooks);
}

const makeBooksDiv = (books) => books.map(book => MakeBookDiv(book))

const MakeBookDiv = (book) => {
    let friendIcon;
    if(book.isOurRate == true)
        friendIcon = <BsPersonCheckFill/>;
    return <div className="flex flex-col items-center border-2 my-5 bg-green-200">
        <div>
            <img src={`${book.image}`}
                style={{ height: 100, weight: 100 }}
            />
        </div>
        <div>{friendIcon}</div>
        <div>{book.name}</div>
        <div>{book.author}</div>
        {/* <div>{book.genres}</div> */}
        <div>דירוג: {book.rate}</div>
        <div>חברים שדירגו: {book.raters}</div>
        <div >
            <button onClick={() => { }}>
                מעבר לדף
            </button>
        </div>
    </div>
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
    if (rec1.importance > rec2.importance) return 1;
    if (rec2.importance < rec2.importance) return -1;
    if (rec1.rate < rec2.rate) return 1;
    if (rec1.rate > rec2.rate) return -1;
    return 0;
}
