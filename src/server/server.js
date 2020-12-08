const express = require('express'),
    routers = require('./routes/routes.js');

const app = express();
const port = 8000;


const server = app.listen(port, () => {
    console.log(`listening on port ${port}`);
});


  

app.use('/', routers);