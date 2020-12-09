const fs = require('fs');
const usersData = require("../Database/users.json");
const dataPath = "./src/server/Database/users.json";
//const usersData = read ?


module.exports = {
    //Check if nothing is missing
    read_users: function (req, res) {
        res.json(usersData);     
    },

    
    create_user: function (req, res) {

        if(!req.body) return res.status(400).send("Bad request");
        const {userName,email,password} = req.body;
        if(!userName) return res.status(400).send("Bad request, Missing userName");
        if(!email) return res.status(400).send("Bad request, Missing email");
        if(!password) return res.status(400).send("Bad request, Missing password");
        

        if(usersData[userName]) return res.status(400).send("User already exists");
        
        //encrypt + salt for password

        usersData[userName] = {
            "Email":email,
            "Password":password,
            "Friends":[],
            "Recommendations":[]
        }

        fs.writeFile(dataPath,JSON.stringify(usersData), err =>{
            if(err) return res.status(500).send("An error occured");
            res.status(201).json({status: 'success',data: usersData[userName] });
        })


    },


    update_user: function (req, res) {
        if(!req.params) return res.status(400).send("Bad request");
        if(!req.params.id)  return res.status(404).send("The user does not exists");
        
        //check changing friends,recommendations or userName
        //Also secure password (encrypt and salt)
            
        const id = req.params.id;
        let {email,password} = req.body;
        if(!email) 
            email = usersData[id].Email;
        if(!password)
            password = usersData[id].Password;
        

        usersData[id] = {
            "Email": email,
            "Password": password,
            "Friends": usersData[id].Friends,
            "Recommendations": usersData[id].Recommendations
        }

        fs.writeFile(dataPath,JSON.stringify(usersData), err =>{
            if(err) return res.status(500).send("An error occured");
            res.status(201).json({status: 'success',data: null });
        }) 

    },


    delete_user: function (req, res) {
        if(!req.params || !req.params.id) return res.status(400).send("Bad request");
        if(!usersData[req.params.id])  return res.status(404).send("The user couldn't be found");

        delete usersData[req.params.id];
        fs.writeFile(dataPath,JSON.stringify(usersData), err =>{
            if(err) return res.status(500).send("An error occured");
            res.status(201).json({status: 'success',data: null });
        }) 
    }
};