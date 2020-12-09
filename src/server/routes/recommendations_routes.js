const fs = require('fs');
const recommendationsData = require("../Database/recommendations.json");
const dataPath = "./src/server/Database/recommendations.json";

//const recommendationsData = read...

module.exports = {
    // Check if nothing is missing
    read_recommendations: function (req, res) {
        res.json(recommendationsData);
    },


    create_recommendation: function (req, res) {
        if (!req.body) return res.status(400).send("Bad request");
        if (!req.body["pid"]) return res.status(400).send("missing 'pid' attribute");
        if (!req.body["uid"]) return res.status(400).send("missing uid' attribute");
        if (!req.body["comment"]) return res.status(400).send("missing 'comment' attribute");
        if (!req.body["rate"]) return res.status(400).send("missing 'rate' attribute");
        
          
        recommendationsData[req.body["pid"]][req.body["uid"]] = {
            "Comment": req.body["comment"],
            "Rate": req.body["rate"],
            "Date":new Date()
        }
        
        //Need to add the recommendation to the user!!!
        fs.writeFile(dataPath,JSON.stringify(recommendationsData),err =>{
            if(err) return res.status(500).send("An error occured");
            res.status(201).json({status:"sucess",data:recommendationsData[req.body["pid"]]})
        })
    },






    update_recommendation: function (req, res) {
        if(!req.params || !req.body) return res.status(400).send("Bad request");
        if(!req.body["comment"] || !req.body["rate"]) return res.status(400).send("Bad request");
        if(!req.params.pid || !recommendationsData[req.params.pid]
           || !req.body["uid"] || !recommendationsData[req.params.pid][req.body["uid"]])
                return res.status(404).send("The recommendation couldn't be found");
        
        //check parameters fits the input type!!!

        recommendationsData[req.params.pid][req.body["uid"]] = {
            "Comment": req.body["comment"],
            "Rate": req.body["rate"],
            "Date":new Date()
        }

        fs.writeFile(dataPath,JSON.stringify(recommendationsData),err =>{
            if(err) return res.status(500).send("An error occured");
            res.status(201).json({status:"sucess",data:recommendationsData[req.body["pid"]]})
        })   
    },


    delete_recommendation: function (req, res) {
        if(!req.params) return res.status(400).send("Bad request");
        if(!req.params.pid || !req.body["uid"]) return res.status(404).send("The recommendation couldn't be found");
        
        delete recommendationsData[req.params.pid][req.body["uid"]];

        if(!Object.keys(recommendationsData[req.params.pid]).length)
            delete recommendationsData[req.params.pid];
        
        //need to delete from the user as well
        
        fs.writeFile(dataPath,JSON.stringify(recommendationsData),err =>{
            if(err) return res.status(500).send("An error occured");
            res.status(201).json({status: 'success',data: null })
        })
        


    }
};