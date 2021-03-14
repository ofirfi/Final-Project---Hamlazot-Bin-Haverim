const catchAsync = require('../utils/catchAsync'),
    config = require('config'),
    https = require('https');
    

module.exports = {

    search_places: catchAsync(async (req, res, next) => {
        https.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?key=${config.PLACE_API_KEY}&input=${req.params.toSearch}`,
            (resp) => {
                let data = '';
                // A chunk of data has been received.
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received.
                resp.on('end', () => {
                    res.status(200).json(JSON.parse(data));
                });

            })
            .on("error", (err) => {
                console.error(err);
                res.status(500).json({ err })
            });

    }),

    get_place: catchAsync(async (req, res, next) => {
        console.log('not ready yet');
        res.status(501).send("not ready yet");
    })
}