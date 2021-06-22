import axios from 'axios';

//The score and precent of "High" of friend's reliability
const HIGH_C = 3;
const HIGH_M = 0.75;
//The score and precent of "Medium" of friend's reliability
const MID_C = 2;
const MID_M = 0.5;
//The score and precent of "Low" of friend's reliability
const LOW_C = 1;
const LOW_M = 0.25;

let recommendations;
let userName;
let token ;
let headers;


/**
 * @description The function makes a request to the server to get the user's information to get
 * the recommendations and the ratings according to the user's friends and the number of friends that rated.
 * @param {String} rId      The id of a recommendation to look for. 
 * @param {int} closeness   The rank level of friends to search for. 
 * @returns an object containing the user's recommendation, friends recommendations in an array, 
 *          every other recommendation in an array, the calculated rating and the number of raters
 */
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
        self: true,
        sort : "reliability"
    }, headers)
        .then(async res => getInfo(res.data.data, rId, closeness))
        .catch(err => console.log(err))
    return results;
}


/**
 * @description The function gets the user's recommendation for the specific rId, the friends recommendations
 * and every other recommendations. If no friends recommendations, the rate will be valued by a normal average
 * of every recommendation in the server thats given by strangers (normal average).
 * @param {Object} user     The user's information (userName,friendsList,recommendationsList) 
 * @param {String} rId      The id of a recommendation to look for.
 * @param {int} closeness   The rank level of friends to search for.
 * @returns An object containing user's recommendation, an array of friends recommendations and an array of every
 * other users recommendations, the rating by friends / "strangers" and the number of friends that rated.
 */
const getInfo =  async (user, rId, closeness) =>{

    let myRec = await getMyRecommendation(rId, user);

    let friendsResults = await getFriendsRecommendations(user,rId,closeness);
    
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
    if (!isRated && strangersRecommendion.raters > 0)
        rate = strangersRecommendion.rate;

    return ({
        myRecommendation: myRec,
        friendsRecommendations: friendsResults.friendsRecommendations,
        strangersRecommendations: strangersRecommendion.recommendations,
        rate ,
        raters
    });
}


/**
 * @description The function searchs for the the user's recommendation for the specific recommendation id.
 * @param {String} rId          The id of a recommendation to look for.
 * @param {Object} userInfo     The user's information (userName,friendsList,recommendationsList).
 * @returns an object of the recommendation's info or undefined if the user does not have a recommendation.
 */
const getMyRecommendation = (rId, userInfo) => {
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
 * @description The function creates an array filled with the user's friends recommendations, their weighted average
 * and the number of friends that rated.
 * The function searchs for friends by BFS up to distance of "closeness" from the user.
 * @param {Object} user         The user's information (userName,friendsList,recommendationsList).
 * @param {String} rId          The id of a recommendation to look for.
 * @param {int} closeness       The rank level of friends to search for.
 * @returns an object containing an array filled with  friends recommendations, the calculated rating and the number of raters.
 */
const getFriendsRecommendations = async (user, rId, closeness) => {
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
        if (!isNotUsed(user.userName,used))
            continue;
        

        let recommendationIndex = getRecommendationIndex(rId,user);

        if(recommendationIndex !== -1){
            randomIndex = recommendationIndex;
            friendsRecommendations.push(recommendations[recommendationIndex]);
            top += (user.w * user.c * recommendations[recommendationIndex].rate);
            bot += (user.w * user.c);
            raters++;
        }
        used.push(user.userName);
        if (user.rank === closeness)
            continue;

        let userInfo = await axios.post('https://rbfserver.herokuapp.com/users', {
                userName : user.userName,
                self: true,
                sort : "reliability"
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
 * @description The function determines the Ci and Mi of a friend for the weighted calculation.
 * @param {String} userName     The friend's userName
 * @param {double} w            The weight of the friend's rating.
 * @param {String} reliability  The friend's reliability that was determined by the previous friend.
 * @param {int} rank            The friend's distance from the user searching for the recommendations.
 * @returns an object containing the friend's Ci, Mi, Wi, userName, and rank (distance).
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
 * @description The function checks if the userName was checked before. 
 * @param {String} userName     The userName of a friend.
 * @param {Array} used          The array of the userName that were checked.
 * @returns True if the Username hasn't been used yet,
 * else if the userName was used or checked returns false. 
 */
const isNotUsed = (userName,used) => {
    for (let i = 0; i < used.length; i++)
        if (userName === used[i])
            return false;
    return true;
}


/**
 * @description The function finds the user's recommendation index in the recommendations array.
 * @param {String} rId          The id of a recommendation to look for.
 * @param {Object} friend       The friend (user) that's needed to find the recommendation for.
 * @returns the index of the recommendation. Returns -1 if there's no recommendation for the friend.
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
 * @description
 * @param {String} rId          The id of a recommendation to look for.
 * @param {Array} used          The array of the userName that were checked.
 * @param {Boolean} isRated     A boolean variable that indicates if there's a rating from friends or not.
 * @param {int} randomIndex     A random index of a recommendation for the specific rId or -1 if there are no friends recommendations (for faster search).
 * @returns an object containing an array of rest of the recommendations by users, thier rating in case isRated is false.
 */
const getStrangersRecommendion = (rId,used,isRated,randomIndex) => {
    let index = getStartingPosition(rId, randomIndex, isRated);
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
 * @description The function gets the starting index of the recommandtions in the recommendations array.
 * @param {String} rId          The id of a recommendation to look for.
 * @param {int} index           A random index of a recommendation for the specific rId or -1 if there are no friends recommendations.
 * @param {Boolean} isRated     A boolean variable indicating whether there's rating for the specified rId.
 * @returns The starting index of the recommendations in the array or -1 if there are no recommendations.
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