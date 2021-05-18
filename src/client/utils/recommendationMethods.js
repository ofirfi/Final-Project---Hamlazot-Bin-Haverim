import axios from 'axios';

//
const HIGH_C = 3;
const HIGH_M = 0.75;
//
const MID_C = 2;
const MID_M = 0.5;
//
const LOW_C = 1;
const LOW_M = 0.25;

let recommendations;
let userName;
let token ;
let headers;


/**
 * 
 * @param {*} rId 
 * @param {*} closeness 
 * @returns 
 */
export async function makeRecommendationsInfo2(rId, closeness = 1) {
    recommendations = JSON.parse(window.localStorage.getItem('recommendations'));
    userName = window.localStorage.getItem('userName');
    token = window.localStorage.getItem('token');
    headers = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }


    let results = await axios.post('https://rbfserver.herokuapp.com/users', {
        userName,
        self: true
    }, headers)
        .then(async res => getInfo(res.data.data, rId, closeness))
        .catch(err => console.log(err))
    return results;
}

/**
 * 
 * @param {*} user 
 * @param {*} rId 
 * @param {*} closeness 
 * @returns 
 */
const getInfo =  async (user, rId, closeness) =>{

    let myRec = await getMyRecommendation2(rId, user);

    let friendsResults = await getFriendsRecommendations2(user,rId,closeness);
    
    let rate = friendsResults.rating,
    raters = friendsResults.raters,
    isRated = true;;

    if(friendsResults.rating === 0)
        isRated = false;
    
    
    let strangersRecommendion = await getStrangersRecommendion (
        rId,
        friendsResults.used,
        isRated,
        friendsResults.randomIndex
        );
    if (!isRated && strangersRecommendion.raters > 0){
        rate = strangersRecommendion.rate;
        raters = strangersRecommendion.raters;
    }

    return ({
        myRecommendation: myRec,
        friendsRecommendations: friendsResults.friendsRecommendations,
        strangersRecommendations: strangersRecommendion.recommendations,
        rate ,
        raters
    });
}

/**
 * 
 * @param {*} rId 
 * @param {*} userInfo 
 * @returns 
 */
const getMyRecommendation2 = (rId, userInfo) => {
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
 * 
 * @param {*} user 
 * @param {*} rId 
 * @param {*} closeness 
 * @returns 
 */
const getFriendsRecommendations2 = async (user, rId, closeness) => {
    let raters = 0,
    rating = 0,
    top = 0,
    bot = 0,
    randomIndex = -1,
    que = [],
    friendsRecommendations = [];

    for (let i =0 ; i < user.friends_length; i++)
        que.push(makeFriendsInfo(user.friends[i].userName,1,user.friends[i].reliability,1))
    
    let used = [user.userName];
    
    while (que.length > 0){
        user = que.shift();
        used.push(user.userName);

        let recommendationIndex = getRecommendationIndex(rId,user);

        if(recommendationIndex !== -1){
            randomIndex = recommendationIndex;
            friendsRecommendations.push(recommendations[recommendationIndex]);
            top += (user.w * user.c * recommendations[recommendationIndex].rate);
            bot += (user.w * user.c);
            raters++;
        }
        

        if (user.rank === closeness)
            continue;


        let userInfo = await axios.post('https://rbfserver.herokuapp.com/users', {
                userName : user.userName,
                self: true
            }, headers)
            .then(async res => res.data.data)
            .catch(err => console.log(err))


        for (let i = 0 ; i < userInfo.friends_length; i++){
            if (isNotUsed(userInfo.friends[i].userName,used)) //push to the que if not used
                que.push(makeFriendsInfo(
                    userInfo.friends[i].userName,       // UserName
                    user.w*user.m,                      // w (weight)
                    userInfo.friends[i].reliability,    // reliability for c and m
                    user.rank+1                         // rank
                    )); 
        }

    }

    if (raters > 0)
        rating = (top/bot).toFixed(1);
    
    return ({
        friendsRecommendations,
        rating,
        raters,
        randomIndex,
        used
    })
}

/**
 * 
 * @param {*} userName 
 * @param {*} w 
 * @param {*} reliability 
 * @param {*} rank 
 * @returns 
 */
const makeFriendsInfo = (userName,w,reliability,rank) => {
    let c,m;
    if (reliability === "הרבה"){
        c = HIGH_C;
        m = HIGH_M;
    }
    else if(reliability === "בינוני"){
        c = MID_C;
        m = MID_M;
    }
    else{
        c = LOW_C;
        m = LOW_M;
    }
    return({
        userName,
        w,
        c,
        m,
        rank
    })
}

/**
 * 
 * @param {*} userName 
 * @param {*} used 
 * @returns 
 */
const isNotUsed = (userName,used) => {
    for (let i = 0; i < used.length; i++)
        if (userName === used[i])
            return false;
    return true;
}

/**
 * 
 * @param {*} rId 
 * @param {*} friend 
 * @returns 
 */
const getRecommendationIndex = (rId, friend) => {

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
 * 
 * @param {*} rId 
 * @param {*} used 
 * @param {*} isRated 
 * @param {*} randomIndex 
 * @returns 
 */
const getStrangersRecommendion = (rId,used,isRated,randomIndex) => {
    let index = getStartingPosition2(rId, randomIndex, isRated);
    if (index < 0)     //If there are no recommendations for the rId
        return ({
            rate: 0,
            raters: 0,
            recommendations: []
        });
    
    let recs = [],
    rating =0,
    raters = 0;

    while (index < recommendations.length && recommendations[index].rId === rId) {
        
        if (isNotUsed(recommendations[index].userName,used) === true) {
            recs.push(recommendations[index]);
    
            if (!isRated){                           //If there isn't a rating from friends' recommendations.
                rating += recommendations[index].rate;
                raters ++;  
            }     
            
        }
        index++;
    }

    if (raters > 0){
        rating = (rating/raters).toFixed(1);
    }
        

    return ({
        rate: rating,
        raters,
        recommendations: recs
    });
}

/**
 * 
 * @param {*} rId 
 * @param {*} index 
 * @param {*} isRated 
 * @returns 
 */
const getStartingPosition2 = (rId, index, isRated) => {
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

























































































export async function makeRecommendationsInfo(rId, closeness = 1) {
    recommendations = JSON.parse(window.localStorage.getItem('recommendations'));
    userName = window.localStorage.getItem('userName');
    token = window.localStorage.getItem('token');
    headers = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }


    let results = await axios.post('https://rbfserver.herokuapp.com/users', {
        userName,
        self: true
    }, headers)
        .then(async res => makeInfo(res.data.data, rId, closeness))
        .catch(err => console.log(err))
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

        let res = await axios.post('https://rbfserver.herokuapp.com/users', {
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

