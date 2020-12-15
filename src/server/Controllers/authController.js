const bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    User = require('../models/User_model');


module.exports = {
        //In progress
    logIn : async (req,res) => {
        if(!req.body) return res.status(400).json({status:"fail",error:"Bad request"});
        const {email,password} = req.body;
        if(!email || !password) return res.status(400).json({status:"fail",error:"נתונים חסרים"});
        
        const user = await User.find({ email });
        if(!user) return res.status(404).json({status:"fail",error:"שם משתמש/סיסמא אינם נכונים"});

        console.log(user);
        res.send('ok');
        //compare passwords
    //    res.status(201).json({
    //        user
    //    })
        //if(!password) return res.status(404).json({status:"fail",error:"שם משתמש/סיסמא אינם נכונים"});

        //sign in + get token?

    },

        //In progress - work on errors
    register: async (req,res) => {
        
        try{
        // if(!req.body) return res.status(400).json({error:"missing arguments"});
            let {userName,email,password} = req.body;
        // if(!userName) return res.status(400).json({error:"Bad request, Missing userName"});
        // if(!email) return res.status(400).json({error:"Bad request, Missing email"});
        // if(!password) return res.status(400).json({error:"Bad request, Missing password"});   
        // let user = await User.findOne({ userName });
        // if(user) return res.status(400).json({ status:"failure",error:  `משתמש כבר קיים במערכת` });
        
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
 
            const user = await User.create({
                userName,
                email,
                password,
                friendsList:[],
                recommendationsList:[]
            })
            res.status(201).json({status:"success",data:user})
        }catch(err){
            res.status(400).json({status:"fail",message:"Invalid data sent"});
        }
    }
}
    