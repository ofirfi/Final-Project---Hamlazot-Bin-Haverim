import axios from 'axios';

const recommendations = JSON.parse(window.localStorage.getItem('recommendations'));
const userName = window.localStorage.getItem('userName');
const token = window.localStorage.getItem('token');
const headers = {
    headers: {
        Authorization: `Bearer ${token}`
    }
}



export async function makeRecommendationsInfo(rId, closeness = 1) {

    let results = await axios.post('http://localhost:8001/users', {
        userName,
        self: true
    }, headers)
        .then(async res => makeInfo(res.data.data, rId, closeness))
        .catch(err => {})

    return results;
}


/**
 * A function that creates recommendations lists, the rating and the number of friends rated.
 */
const makeInfo = async (userInfo, rId, closeness = 1) => {

    let myRec = getMyRecommendation(rId, userInfo);

    let { friendsRecs, ratingList, randomRecIndex } = await getFriendsRecommendations(rId, userInfo.friends, closeness);

    let results = calculateRating(ratingList);

    let isRated = true;
    if (results.raters === 0)
        isRated = false;

    let strangersResults = await getStangersRecommendations(rId, friendsRecs, randomRecIndex, isRated);

    let strangersRec = strangersResults.recs
    if (!isRated) {
        results.rate = strangersResults.rate;
        results.raters = 0;
    }

    return {
        myRecommendation: myRec,
        friendsRecommendations: friendsRecs,
        strangersRecommendations: strangersRec,
        rate: results.rate,
        raters: results.raters
    };
}


/**
 * A function that gets the user's recommendations.
 * The function returns the recommendation if found, else undefined.
*/
function getMyRecommendation(rId, userInfo) {
    let myRec;
    for (let i = 0; i < userInfo.recommendations.length; i++)
        if (userInfo.recommendations[i].rId === rId) {
            myRec = userInfo.recommendations[i];
            myRec.userName = userName;
            break;
        }
    return myRec;
}


/**
 * A function that makes the user's friends recommendations and rating.
 * The function returns an object that contains array of friends recommendations, a rating array and a random index of a recommendation.
 */
async function getFriendsRecommendations(rId, friends, closeness) {
    let results = getRank1Friends(rId, friends);
    let friendsRecs = results.friendsRecs;
    let ratingList = results.ratingList;
    let randomRecIndex = results.randomRecIndex;
    
    if (closeness === 2) {
        let res = await getRank2Friends(rId, friends, friendsRecs, ratingList);
        friendsRecs = res.friendsRecs;
        ratingList = res.ratingList;
        if (!randomRecIndex)
            randomRecIndex = res.randomRecIndex;
    }

    return { friendsRecs, ratingList, randomRecIndex };
}


/**
 * A function that makes recommendations of the user's close friends list (Rank 1).
 * The function returns an array of Rank 1 friends' recommendations and an array of ratings.
 */
function getRank1Friends(rId, friends) {
    let friendsRecs = [];
    let ratingList = [];
    let nextPos = 0;
    let randomRecIndex;

    for (let i = 0; i < friends.length; i++) {                  //Getting Friends recommendations     
        let index = searchRecommendation(rId, friends[i]);
        if (index !== -1) {                                     // If there is a recommendation from that user
            friendsRecs[nextPos] = recommendations[index];
            ratingList[nextPos++] = {                           //fill the array with an object for rating (for rating calculation)
                rate: recommendations[index].rate,
                reliability: friends[i].reliability,
                weight: 1
            }
            randomRecIndex = index;
        }
    }
    return { friendsRecs, ratingList, randomRecIndex };
}


/**
 * A function that updates friends' recommendations and ratings by adding user's 'Rank 2' friends.
 * The function returns an array of recommendations,an array of ratings and a random index of a recommendation.
 */
async function getRank2Friends(rId, friends, friendsRecs, ratingList) {
    let nextPos = friendsRecs.length;
    let randomRecIndex;
    for (let i = 0; i < friends.length; i++) {                  //for each Rank 1 friend

        let res = await axios.post('http://localhost:8001/users', {
            userName: friends[i].userName,
            self: true
        }, headers)
            .then(res => res.data.data)
            .catch(err => {})


        for (let j = 0; j < res.friends.length; j++) {
            if (res.friends[j].userName === userName || isUsed(res.friends[j].userName, friendsRecs, []))
                continue;
            let index = searchRecommendation(rId, res.friends[j]);
            if (index === -1)
                continue;

            friendsRecs[nextPos] = recommendations[index];
            let weight = getWeight(friends[i]);

            ratingList[nextPos++] = {
                rate: recommendations[index].rate,
                reliability: res.friends[j].reliability,
                weight
            }
            randomRecIndex = index;
        }
    }
    return { friendsRecs, ratingList, randomRecIndex };
}


/**
 * A function that searchs for the rest of the recommendations.
 * If there's a rating from close friends the function returns an array of recommendations.
 * Otherwise it calculates the rating based by all of the recommendations and
 * returns an array of recommendations and the average rate of them.
 */
const getStangersRecommendations = (rId, recs, randomIndex, isRated) => {
    let index = getStartingPosition(rId, randomIndex, isRated);
    let strangers = [];
    let nextPos = 0;
    let ratingList = [];


    if (index < 0)     //If there are no recommendations for the rId
        return {
            rate: 0,
            raters: 0,
            recs: strangers
        };


    while (index < recommendations.length && recommendations[index].rId === rId) {
        if (recommendations[index].userName === userName || isUsed(recommendations[index].userName, recs, strangers)) {
            index++;
            continue;
        }

        strangers[nextPos] = recommendations[index];

        if (!isRated)                           //If there isn't a rating from friends' recommendations.
            ratingList[nextPos] = {
                rate: recommendations[index].rate,
                reliability: 'מעט',
                weight: 1
            }

        nextPos++;
        index++;
    }

    if (isRated)
        return { recs: strangers };

    let results2 = calculateRating(ratingList);

    return {
        rate: results2.rate,
        raters: results2.raters,
        recs: strangers
    };

}


/**
 * A function that Finds the first index of the recommendation.
 * If there are recommendations, the function returns the first index,
 * else returns -1.
 */
const getStartingPosition = (rId, index, isRated) => {

    if (isRated) {
        while (index >= 0 && recommendations[index].rId === rId)
            index--;
        return index + 1;
    }
    for (index = 0; index < recommendations.length && recommendations[index].rId !== rId; index++);

    if (index === recommendations.length)
        return -1;
    return index;
}


/**
 * A function that checks if the user's recommenndation was already added.
 * The function returns true if there's a recommendation, else returns false.
 */
const isUsed = (user, friendsRecs, stangersRecs) => {
    for (let i = 0; i < friendsRecs.length; i++)
        if (user === friendsRecs[i].userName)
            return true;
    for (let i = 0; i < stangersRecs.length; i++)
        if (user === stangersRecs[i].userName)
            return true;
    return false;
}


/**
 * The function returns the weight of Rank 2 friend based by Rank 1 friend for the rating calculation.
 */
const getWeight = (friend) => {
    if (friend.reliability === "הרבה")
        return 0.75;
    if (friend.reliability === "בינוני")
        return 0.5;
    return 0.25;
}

/**
 * The function searchs for a recommendation by using binary search tree.
 * The function returns its index if there's a recommendation,
 * else it returns -1.
 */
function searchRecommendation(rId, friend) {
    const recommendations = JSON.parse(window.localStorage.getItem('recommendations'));

    let bot = 0;
    let top = recommendations.length - 1;
    let mid;

    while (top > bot + 1) {
        mid = Math.floor((top + bot) / 2);

        if (recommendations[mid].rId === rId) {
            if (recommendations[mid].userName === friend.userName)
                return mid;
            else if (recommendations[mid].userName < friend.userName)
                bot = mid;
            else
                top = mid;
        }
        else if (recommendations[mid].rId < rId)
            bot = mid;
        else
            top = mid;
    }

    if (recommendations[bot].rId === rId && recommendations[bot].userName === friend.userName)
        return bot;
    if (recommendations[top].rId === rId && recommendations[top].userName === friend.userName)
        return top;

    return -1;
}


/**
 * The function calculates rating.
 * The function returns the final rating and the number of friends that rated.
 */
const calculateRating = (ratingList) => {
    if (ratingList.length === 0)
        return { rate: 0, raters: 0 };

    let ratesSum = 0;
    let total_raters_value = 0;
    for (let i = 0; i < ratingList.length; i++)
        if (ratingList[i].reliability === "הרבה") {
            ratesSum += ratingList[i].rate * 3 * ratingList[i].weight;
            total_raters_value += 3 * ratingList[i].weight;
        }
        else if (ratingList[i].reliability === "בינוני") {
            ratesSum += ratingList[i].rate * 2 * ratingList[i].weight;
            total_raters_value += 2 * ratingList[i].weight
        }
        else {
            ratesSum += ratingList[i].rate * ratingList[i].weight;
            total_raters_value += ratingList[i].weight;
        }


    return { rate: (ratesSum / total_raters_value).toFixed(1), raters: ratingList.length };
}

