const express = require('express'),
    routers = require('./routes/index'),
    connector = require('./config/database'),
    cors = require('cors'),
    errorsHandler = require('./Controllers/errorController');

const app = express();

const port = process.env.PORT || 8001;

//connect to DB
connector();

//Initializing MiddleWare
app.use(express.json());
app.use(cors());

//Defining routes
app.use('/', routers);

//Error handeling middle-ware
app.use(errorsHandler);


//Server listening
const server = app.listen(port, () => {
    console.log(`listening on port ${port}`);
});


