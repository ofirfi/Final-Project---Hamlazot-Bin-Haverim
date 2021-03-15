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

    return -1
}

export function makeRating(recommendations, closeness) {
    if (recommendations.length === 0)
        return { rate: 0, raters: 0 };
    let rate = 0;
    let count = 0;
    console.log(recommendations);
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



