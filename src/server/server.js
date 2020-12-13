const express = require('express'),
    routers = require('./routes/routes.js');
    // connectDB = require('./Config/database.js');

const app = express();

const port = 8001;

//Connect to database

//Initializing MiddleWare
app.use(express.json());

//Defining routes
app.use('/', routers);


const server = app.listen(port, () => {
    console.log(`listening on port ${port}`);
});