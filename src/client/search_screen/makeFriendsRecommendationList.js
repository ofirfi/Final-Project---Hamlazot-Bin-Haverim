import axios from 'axios'


//The score and precent of "High" of friend's reliability
const HIGH_WEIGHT = 3;
//The score and precent of "Medium" of friend's reliability
const MID_WEIGHT = 2;
//The score and precent of "Low" of friend's reliability
const LOW_WEIGHT = 1;

let headers,
    userRecommendations,
    movies = {},
    books = {},
    places = {};



export async function MakeFriendsRecommendationList() {
    if (window.localStorage.getItem("hasFriendsRecommendations")) {
        return {
            movies: JSON.parse(window.localStorage.getItem("movies")),
            books: JSON.parse(window.localStorage.getItem("books")),
            places: JSON.parse(window.localStorage.getItem("places"))
        }
    }

    headers = {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
        }
    }

    await axios.post('https://rbfserver.herokuapp.com/users', {
        userName: window.localStorage.getItem('userName'),
        self: true,
    }, headers)
        .then(async res => await getFriendsRecommendations(res.data.data))
        .catch(err => console.log(err))

    save();
    return { movies, books, places };
}


const save = () => {
    window.localStorage.setItem("hasFriendsRecommendations", true);
    window.localStorage.setItem("movies", JSON.stringify(movies));
    window.localStorage.setItem("books", JSON.stringify(books));
    window.localStorage.setItem("places", JSON.stringify(places));
}


const getFriendsRecommendations = async (user) => {
    userRecommendations = user.recommendations;

    for (let i = 0; i < user.friends.length; i++) {
        await axios.post('https://rbfserver.herokuapp.com/users', {
            userName: user.friends[i].userName,
            self: true,
        }, headers)
            .then(async res => await getOneFriendRecommendations(res.data.data, user.friends[i].reliability))
            .catch(err => console.log(err))
    }
    makeRating();
}


const getOneFriendRecommendations = (friend, reliability) => {
    let weight = getWeight(reliability);

    for (let i = 0; i < friend.recommendations_length; i++) {
        if (userRated(friend.recommendations[i].rId))
            continue;

        if (friend.recommendations[i].type === "סרט")
            movieRecommendationHandle(friend.recommendations[i], weight);
        else if (friend.recommendations[i].type === "ספר")
            bookRecommendationHandle(friend.recommendations[i], weight);
        else
            placeRecommendationHandle(friend.recommendations[i], weight);

    }
}


const getWeight = (reliability) => {
    if (reliability === "הרבה")
        return HIGH_WEIGHT;
    if (reliability === "בינוני")
        return MID_WEIGHT;
    return LOW_WEIGHT;
}


const userRated = (rId) => {
    for (let i = 0; i < userRecommendations.length; i++)
        if (userRecommendations[i].rId === rId)
            return true;
    return false;
}


const movieRecommendationHandle = (recommendation, weight) => {
    if (!movies[recommendation.rId]) {
        movies[recommendation.rId] = {
            "rId": recommendation.rId,
            "name": recommendation.name,
            "top": 0,
            "bot": 0,
            "raters": 0
        }
    }

    movies[recommendation.rId]["top"] += recommendation.rate * weight;
    movies[recommendation.rId]["bot"] += weight;
    movies[recommendation.rId]["raters"]++;
}


const bookRecommendationHandle = (recommendation, weight) => {
    if (!books[recommendation.rId]) {
        books[recommendation.rId] = {
            "rId": recommendation.rId,
            "name": recommendation.name,
            "top": 0,
            "bot": 0,
            "raters": 0
        }
    }

    books[recommendation.rId]["top"] += recommendation.rate * weight;
    books[recommendation.rId]["bot"] += weight;
    books[recommendation.rId]["raters"]++;
}


const placeRecommendationHandle = (recommendation, weight) => {
    if (!places[recommendation.rId]) {
        places[recommendation.rId] = {
            "rId": recommendation.rId,
            "name": recommendation.name,
            "top": 0,
            "bot": 0,
            "raters": 0
        }
    }

    places[recommendation.rId]["top"] += recommendation.rate * weight;
    places[recommendation.rId]["bot"] += weight;
    places[recommendation.rId]["raters"]++;
}


const makeRating = () => {
    movies = makeFinalRecommendations(movies);
    books = makeFinalRecommendations(books);
    places = makeFinalRecommendations(places);
}


const makeFinalRecommendations = (items) => {
    let finalItems = [],
        index = 0;

    for (let item in items)
        finalItems[index++] = {
            rId: item,
            name: items[item].name,
            rating: (items[item].top / items[item].bot).toFixed(1),
            raters: items[item].raters
        }
    finalItems.sort((item1, item2) => sortByRating(item1, item2))

    return finalItems;
}


const sortByRating = (item1, item2) => {
    if (item1.rating > item2.rating) return -1;
    if (item1.rating < item2.rating) return 1;
    if (item1.raters > item2.raters) return -1;
    if (item1.raters > item2.raters) return 1;
    return 0;
}








