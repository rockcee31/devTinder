const express = require('express');
const authRouter = express.Router();
const validation = require("../utils/validation");
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

authRouter.post("/signup",async(req,res)=>{
    try{
        const{name,password,emailId,age,skills,gender}  = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            throw new Error("Email is already registered");
        } 

       validation(req);

       
       const passwordHash = await bcrypt.hash(password,10);
       console.log(passwordHash);
        console.log(emailId)
       //put it into data base
        const user = new User({
        name,
        emailId,
        password:passwordHash,
        age,
        gender,
        skills
        })
        console.log("🟢 Saving User to DB:", user); // Log before saving
        await user.save();
        res.send("sign up sucessfull");
    }catch(err){
        res.send("Error in signUp"+err.message);
    }
})

authRouter.post("/login",async(req,res)=>{
    try{
       const {emailId,password} = req.body;
       const isUser = await User.findOne({emailId:emailId});
       if(!isUser){
         throw new Error("Invalid credential");
       }

       const itsPassword = await bcrypt.compare(password,isUser.password)
       if(itsPassword){
          //CREATE JWT TOKEN 
          const token =  jwt.sign({_id:isUser._id},"DEV@Tinder");
          
          //create a cookie and send this token in it .
          res.cookie("token",token);
          res.send("login successfull");
       }
    }catch(err){
           throw new Error("invalid credential"+err.message)
    }
})

module.exports ={
    authRouter
}