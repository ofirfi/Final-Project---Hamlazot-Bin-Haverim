import axios from 'axios';

const recommendations = JSON.parse(window.localStorage.getItem('recommendations'));
const userName = window.localStorage.getItem('userName');
const token = window.localStorage.getItem('token');
const headers = {
    headers: {
        Authorization: `Bearer ${token}`
    }
}


export async function makeRecommendationsInfo(rId, closeness = 2) {

    let results = await axios.post('http://localhost:8001/users', {
        userName,
        self: true
    }, headers)
        .then(async res => makeInfo(res.data.data, rId, closeness))
        .catch(err => console.log(err))

    return results;
}


export function searchRecommendation(rId, friend) {
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

export function makeRating(recommendations, closeness) {
    if (recommendations.length === 0)
        return { rate: 0, raters: 0 };
    let rate = 0;
    let count = 0;
    for (let i = 0; i < recommendations.length; i++) {
        if (recommendations[i].reliability === "הרבה") {
            rate += recommendations[i].rate * 3;
            count += 3;
        }
        else if (recommendations[i].reliability === "בינוני") {
            rate += recommendations[i].rate * 2;
            count += 2
        }
        else {
            rate += recommendations[i].rate;
            count += 1;
        }
    }
    if (closeness === 1)
        return { rate: rate / count, raters: recommendations.length };
}


const makeInfo = async (userInfo, rId, closeness) => {
    const friends = userInfo.friends
    let friendsRecs = [];
    let nextPos = 0;
    let ratingList = []
    let randomRecommendIndex = 0;


    let myRec;
    for (let i = 0 ; i < userInfo.recommendations.length;i++)   //Getting user's recommendation
        if (userInfo.recommendations[i].rId === rId){
            myRec = userInfo.recommendations[i];
            myRec.userName = userName;
            break; 
        }

    for (let i = 0; i < friends.length; i++) {                  //Getting Friends recommendations     
        let index = searchRecommendation(rId, friends[i]);
        if (index !== -1) {                                     // If there is a recommendation from that user
            friendsRecs[nextPos] = recommendations[index];
            ratingList[nextPos++] = {                           //fill the array with an object for rating (for rating calculation)
                rate: recommendations[index].rate,
                reliability: friends[i].reliability,
                weight: 1
            }
            randomRecommendIndex = index;
        }
    }

    
    //closeness = 2 -> recommendations include friends of friends to the rating calculate
    if (closeness === 2) {
        for (let i = 0; i < friends.length; i++) {                  //for each friend

            let res = await axios.post('http://localhost:8001/users', {
                userName: friends[i].userName,
                self: true
            }, headers)
                .then(res => res.data.data)        //1.1 for each friend add users from their friendsList
                .catch(err => console.log(err))

            for (let j = 0; j < res.friends.length; j++) {
                if (res.friends[j].userName === userName || isUsed(res.friends[j].userName, friendsRecs,[]))         //1.2 Check if the user was not already counted or the logged-in user.
                    continue;
                let index = searchRecommendation(rId, res.friends[j]);
                if (index === -1)
                    continue;

                friendsRecs[nextPos] = recommendations[index];          //4. Add to recs for 'friends recommendations list1 [recs]
                let weight = getWeight(friends[i]);

                ratingList[nextPos++] = {                  //fill array with an object for rating
                    rate: recommendations[index].rate,
                    reliability: res.friends[j].reliability,
                    weight
                }
            }
        }
    }

    let results = calculateRating(ratingList);
    let isRated = true;
    if(results.raters === 0)
        isRated = false;


    let strangersResults = await getStangersRecommendations(rId,friendsRecs,randomRecommendIndex,isRated);
    if(!isRated){
        results.rate = strangersResults.rate;
        results.raters = strangersResults.raters;
    }
    
    let strangersRec = strangersResults.recs
    
    

    //6.1 Find starting index of the Rid (recPos)
    //6.2 Go through the recommendations untill recommendations[recPos]!==rId and < recommendations.length 
    //6.3 Add rest of the recommendations to a different recommendations list (strangers)
    //7. if 0 raters -> calculate all DB recommendations normally (average).

    //8. if no recommendations in the DB -> get rate from the API
    //9. if no rating from API -> return 0,0
    

    return { 
        myRecommendation: myRec,
        friendsRecommendations: friendsRecs,
        strangersRecommendations: strangersRec , 
        rate: results.rate,
        raters: results.raters 
    };
}


const getWeight = (friend) => {
    if (friend.reliability === "הרבה")
        return 0.75;
    if (friend.reliability === "בינוני")
        return 0.5;
    return 0.25;
}


const isUsed = (user, friendsRecs,stangersRecs) => {
    for (let i = 0; i < friendsRecs.length; i++)
        if (user === friendsRecs[i].userName)
            return true;
    for (let i =0; i< stangersRecs.length;i++)
        if(user === stangersRecs[i].userName)
            return true;
    return false;
}


const getStartingPosition = (rId,index,isRated) =>{
    if(isRated){
        while(index >= 0 && recommendations[index].rId === rId)
            index--;
        return index+1;
    }
    for(index = 0; index < recommendations.length && recommendations[index].rId !== rId ; index++);
    
    if(index === recommendations.length)
        return -1;
    return index;
}


const getStangersRecommendations = (rId,recs,startingIndex,isRated) =>{
    let index = getStartingPosition(rId,startingIndex,isRated);
    let strangers = [];
    let nextPos = 0;
    let ratingList = [];

    
    if(index<0)     //If there are no recommendations for the rId
        return {        
            rate: 0,
            raters: 0,
            recs: strangers
        };


    while(index<recommendations.length && recommendations[index].rId === rId){ 
        if(recommendations[index].userName === userName || isUsed(recommendations[index].userName,recs,strangers)){
            index++;
            continue;
        }
        strangers[nextPos] = recommendations[index];

        if(!isRated)
            ratingList[nextPos] = {                  //fill array with an object for rating
                rate: recommendations[index].rate,
                reliability: 'מעט',
                weight: 1
            }

        nextPos++;
        index++;
    }
    if(isRated)
        return {recs:strangers};
    
    let results = calculateRating(ratingList);
    
    return { 
        rate: results.rate,
        raters: results.raters,
        recs: strangers
    };
    
}


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
