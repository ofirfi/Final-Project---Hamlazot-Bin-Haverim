const User = require('../models/User_model');

//const usersData = read ?


module.exports = {
        //In progress
    read_user: (req, res) => {
        res.status(500).json({status:"fail",message:"route in progess"});
    },
        //In progress
    update_user: (req, res) => {
        res.status(500).json({status:"fail",message:"route in progess"});
    },

        //In progress - also delete all of this user's recommendations?
    delete_user: (req, res) => {
        res.status(500).json({status:"fail",message:"route in progess"});
    }
};