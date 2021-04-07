const catchAsync = require('../utils/catchAsync'),
    config = require('config'),
    https = require('https');


const googleResponse = (res, resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => data += chunk);

    // The whole response has been received.
    resp.on('end', () => res.status(200).json(JSON.parse(data)));
}

const googleError = (res, err) => res.status(500).json({ err })


module.exports = {

    search_places: catchAsync(async (req, res, next) => {
        https.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?key=${config.PLACE_API_KEY}&input=${req.params.toSearch}&language=iw`,
        (resp) => googleResponse(res, resp))
        .on("error", (err) => googleError(res, err))

    }),

    
    get_place: catchAsync(async (req, res, next) => {
        https.get(`https://maps.googleapis.com/maps/api/place/details/json?key=${config.PLACE_API_KEY}&place_id=${req.params.placeId}&language=he`,
            (resp) => googleResponse(res, resp))
            .on("error", (err) => googleError(res, err))
    }),

}