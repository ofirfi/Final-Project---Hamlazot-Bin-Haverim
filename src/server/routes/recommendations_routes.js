const fs = require('fs');
const dataPath = '../Database/recommendations.json';

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
    // READ
    read_recommendations: function (req, res) {
        readFile((err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
            else
                res.send(JSON.parse(data));
        });
    },

    // CREATE
    create_recommendation: function (req, res) {
        readFile(data => {

            if (!req.body) return res.status(400);

            if (!req.body["Pid"]) {
                res.statusMessage = "missing 'Pid' attribute";
                return res.sendStatus(400);
            }
            if (!req.body["Uid"]) {
                res.statusMessage = "missing 'Uid' attribute";
                return res.sendStatus(400);
            }
            if (!req.body["Comment"]) {
                res.statusMessage = "missing 'Comment' attribute";
                return res.sendStatus(400);
            }
            if (!req.body["Rate"]) {
                res.statusMessage = "missing 'Rate' attribute";
                return res.sendStatus(400);
            }
            if (!req.body["Date"]) {
                res.statusMessage = "missing 'Date' attribute";
                return res.sendStatus(400);
            }

            

            data[req.body["Pid"]].req.body["Uid"] = {
                "Comment": req.body["Comment"],
                "Rate": req.body["Rate"],
                "Date": req.body["Date"]
            }


            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('The new comment was added');
            });
        },true);
    },


    // UPDATE
    update_recommendation: function (req, res) {
        readFile(data => {
            var cid = req.params["id"];
            if (!cid || !req.body) {
                res.statusMessage = "Bad request";
                return res.sendStatus(400);
            }
            if (!data[cid]) {
                res.statusMessage = "Comment was not found";
                return res.sendStatus(404);
            }
            if (!req.body["Uid"]) {
                res.statusMessage = "missing 'Uid' attribute";
                return res.sendStatus(400);
            }
            if (!req.body["Comment"]) {
                res.statusMessage = "missing 'Comment' attribute";
                return res.sendStatus(400);
            }
            if (!req.body["Rate"]) {
                res.statusMessage = "missing 'Rate' attribute";
                return res.sendStatus(400);
            }
            if (!req.body["Date"]) {
                res.statusMessage = "missing 'Date' attribute";
                return res.sendStatus(400);
            }

            data[i].req.body["Uid"] = {
                "Comment": req.body["Comment"],
                "Rate": req.body["Rate"],
                "Date": req.body["Date"]
            }



            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('the commend was added');
            });
        },true);
    },


    // DELETE
    delete_recommendation: function (req, res) {
        readFile(data => {
            var cid = req.params["id"];
            if (!cid) {
                res.statusMessage = "Bad request";
                return res.sendStatus(400);
            }
            // delete an comment
            if (!data[cid]) {
                res.statusMessage = "the comment was not found";
                return res.sendStatus(400);
            }

            delete data[cid];

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`comment id:${cid} was removed`);
            });
        },true);
    }
};