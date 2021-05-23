import '../utils/style.css'
import { MOVIE_API_KEY, BOOKS_API_KEY, PLACE_API_KEY } from '../utils/config.json'
import axios from 'axios'
import { makeRecommendationsInfo } from '../utils/recommendationMethods'
import { BsPersonCheckFill, BsArrowLeft } from 'react-icons/bs'
import { getAuthor } from '../book_screen/book'

let headers;


export function searchRes(input, type, page, history, closeness = 1) {
    headers = {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
        }
    }
    if (type === "place")
        return placeSearch(input, page, closeness, history);
    if (type === "movie")
        return movieSearch(input, page, closeness, history);
    return bookSearch(input, page, closeness, history);

}




const placeSearch = async (input, page = 1, closeness, history) => {
    let res = axios.get(`https://rbfserver.herokuapp.com/place/search/${input}`,headers)
        .then(res => { console.log(res);
            if (res.data.results.length === 0)
                return noResults();
            return getPlaceRates(res.data.results, closeness, history);
        })
        .catch(err => console.log(err))
    return res;
}

const getPlaceRates = async (places, closeness, history) => {
    let ratedPlaces = [];
    for (let i = 0; i < places.length; i++) {
        if (!isFood(places[i]))
            continue;
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
            isOpenNow = `סגור לצמיתות`;
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
            image,
            history
        }
    }
    if(ratedPlaces.length === 0)
        return noResults();
    ratedPlaces.sort(recommendationsSort)
    return makePlacesDiv(ratedPlaces,closeness);
}

const isFood = (place) => {
    for (let i=0; i<place.types.length; i++)
        if (place.types[i] === "food")
            return true;
    return false;
}

const makePlacesDiv = (places,closeness) => places.map(place => MakePlaceDiv(place,closeness))

const MakePlaceDiv = (place,closeness) => {
    let friendIcon;
    let history = place.history;
    if(place.isOurRate === true)
        friendIcon = <BsPersonCheckFill/>;
    return(
        <div className="flex flex-row items-center border-2 rounded my-5 bg-green-200">
            <div className="flex flex-col items-center m-2 w-1/3">
                <img src={place.image}
                    style={{ height: 112.5, weight: 150 }}
                    alt = ""
                />
            </div>
            <div className="flex flex-col items-center justify-self m-2 w-2/3">
                <div>{friendIcon}</div>
                <div className="font-extrabold text-lg">{place.name}</div>
                <div>{place.address}</div>
                <div>{place.isOpenNow}</div>
                <div>דירוג: {place.rate}</div>
                <div>חברים שדירגו: {place.raters}</div>
                <div className="flex flex-row items-center">
                    <BsArrowLeft/>
                    <button className="m-1" onClick={() => { history.push(`/place/${place.rId}`,{closeness}) }}>
                        מעבר לדף 
                    </button>
                </div>
            </div>
        </div>
    )
}




const movieSearch = async (input, page, closeness, history) => {
    let res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&language=he&query=${input}&page=${page}&include_adult=false`)
        .then(res => {
            if (res.data.results.length === 0)
                return noResults();
            return getMoviesRates(res.data.results, closeness, history);
        })
        .catch(err => console.log(err))
    return res;
}

const getMoviesRates = async (movies, closeness, history) => {
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
            image: movies[i].poster_path,
            history
        }
    }
    ratedMovies.sort(recommendationsSort)
    return makeMoviesDiv(ratedMovies,closeness);
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

const makeMoviesDiv = (movies,closeness) => movies.map(movie => MakeMovieDiv(movie,closeness))

const MakeMovieDiv = (movie,closeness) => {
    let friendIcon;
    let history = movie.history;
    if(movie.isOurRate === true)
        friendIcon = <BsPersonCheckFill/>;
    return (
        <div className="flex flex-row items-center border-2 rounded w-96 my-5 bg-green-200">
            <div className="flex flex-col items-center m-2 w-1/3">
                <img src={`https://image.tmdb.org/t/p/w500${movie.image}`}
                    style={{ height: 150, weight: 112.5 }}
                    alt = ""
                />
            </div>
            <div className="flex flex-col self-center items-center text-center m-2 w-2/3">
                <div>{friendIcon}</div>
                <div className="font-extrabold text-lg">{movie.name}</div>
                <div>{movie.genres}</div>
                <div>דירוג: {movie.rate}</div>
                <div>חברים שדירגו: {movie.raters}</div>
                <div className="flex flex-row items-center">
                    <BsArrowLeft />
                    <button className="m-1" onClick={() => { history.push(`/movie/${movie.rId}`,{closeness}) }}>
                        מעבר לדף
                </button>
                </div>
            </div>
        </div>
    )
}




const bookSearch = (input, page, closeness, history) => {
    let res = axios.get(`https://www.googleapis.com/books/v1/volumes?q=${input}&key=${BOOKS_API_KEY}&language=iw`)
        .then(res => {
            console.log(res)
            if (res.data.items.length === 0)
                return noResults();
            return getBooksRates(res.data.items, closeness, history);
        })
        .catch(err => console.log(err))
    return res;
}

const getBooksRates = async (books, closeness, history) => {
    let ratedBooks = [];
    for (let i = 0; i < books.length; i++) {
        let res = await makeRecommendationsInfo((books[i].id).toString(), closeness, history);
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
            author = getAuthor(books[i].volumeInfo.authors);
        
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
            image,
            history
        }
    }
    ratedBooks.sort(recommendationsSort)
    return makeBooksDiv(ratedBooks);
}

const makeBooksDiv = (books) => books.map(book => MakeBookDiv(book))

const MakeBookDiv = (book) => {
    let friendIcon;
    let history = book.history;
    if(book.isOurRate === true)
        friendIcon = <BsPersonCheckFill/>;
    return (
    <div className="flex flex-row items-center text-right border-2 rounded w-96 my-5 p-3 bg-green-200">
        <div className="flex flex-col items-center m-2 w-1/3">
            <img src={`${book.image}`}
                style={{ height: 150, weight: 112.5 }}
                alt = ""
            />
        </div>
        <div className="flex flex-col self-center items-center text-center m-3 w-2/3">
            <div>{friendIcon}</div>
            <div className="font-extrabold text-lg">{book.name}</div>
            <div>{book.author}</div>
            {/* <div>{book.genres}</div> */}
            <div>דירוג: {book.rate}</div>
            <div>חברים שדירגו: {book.raters}</div>
            <div className="flex flex-row items-center text-right">
                <BsArrowLeft/>
                <button className="m-1" onClick={() => { history.push(`/book/${book.rId}`) }}>
                    מעבר לדף 
                </button>
            </div>
        </div>
    </div>
    )
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
        לא נמצאו תוצאות
    </div>
}

const recommendationsSort = (rec1, rec2) => {
    if (rec1.importance > rec2.importance) return 1;
    if (rec1.importance < rec2.importance) return -1;
    if (rec1.rate < rec2.rate) return 1;
    if (rec1.rate > rec2.rate) return -1;
    return 0;
}
