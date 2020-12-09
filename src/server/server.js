const express = require('express'),
    routers = require('./routes/routes.js');

const app = express();
const port = 8001;


const server = app.listen(port, () => {
    console.log(`listening on port ${port}`);
});


  

app.use(express.json());
app.use('/', routers);