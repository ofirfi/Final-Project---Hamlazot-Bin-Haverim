const { resolveSoa } = require('dns');
const fs = require('fs');
const dataPath = '../Database/users.json';

// helper methods
const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
            console.log(err);
        }
        callback(returnJson ? JSON.parse(data) : data);
    });
};

const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
        if (err) {
            console.log(err);
        }
        callback();
    });
};


module.exports = {
    //READ
    read_users: function (req, res) {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
            else
                res.send(JSON.parse(data));
        });
    },

    // CREATE
    create_user: function (req, res) {
        readFile(data => {
            // add the new user
            if (!req.body.id) return res.sendStatus(500);

            //check if user already exists -> error

            //if any info is missing -> error

            data[req.body.id] = {
                "Email": req.body["Email"],
                "Password": req.body["Password"],
                "Friends": [],
                "Recommendations": []
            }
     
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('new user added');
            });
        },true);
    },


    // UPDATE
    update_user: function (req, res) {
        readFile(data => {
            const userId = req.params["id"];
            if(!usedId) return res.status(400).send('Missing user id');
            if (!data[userId]) return res.status(400).send("User id does not exists");   

            //if(req.body[info])
            //check about password 

            //change data[userId] = 
            data[userId] = req.body;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${userId} updated`);
            });
        },true);
    },

    // DELETE
    delete_user: function (req, res) {
        readFile(data => {
            const userId = req.params["id"];
            if(!userID) return res.status(400).send('No user id');
            if(!data[userId]) return res.status(400).send('This Uid does not exists');

            delete data[userId];
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`user id:${userId} was deleted`);
            });
        },true);
    }
};