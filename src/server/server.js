const express = require('express'),
    routers = require('./routes/index.js'),
    connector = require('./config/database');

const app = express();

const port = process.env.PORT || 8001;

//connect to DB
connector();

//Initializing MiddleWare
app.use(express.json());

//Defining routes
app.use('/', routers);

//Server listening
const server = app.listen(port, () => {
    console.log(`listening on port ${port}`);
});


