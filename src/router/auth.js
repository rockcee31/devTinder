const express = require('express');
const authRouter = express.Router();
const validation = require("../utils/validation");
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

//router mai hum simmilar route ki api store karate hai
authRouter.post("/signup",async(req,res)=>{
    try{
        const{name,password,emailId,age,skills,gender,photoUrl}  = req.body;
        validation(req);
        // Check if user already exists
        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            throw new Error("Email is already registered");
        } 

       

       
       const passwordHash = await bcrypt.hash(password,10);
       console.log(passwordHash);
        console.log(emailId)
       //put it into data base using model which already have document structure model pass these value according to document structure 
        const user = new User({
        name,
        emailId,
        password:passwordHash,
        age,
        gender,
        skills,
        photoUrl
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
        console.log(req.body)
       const {emailId,password} = req.body;
       const isUser = await User.findOne({emailId:emailId});
       if(!isUser){
         throw new Error("Invalid credential");
       }
      
       const itsPassword = await bcrypt.compare(password,isUser.password)
       if(itsPassword){
          //CREATE JWT TOKEN 
          const token =  jwt.sign({_id:isUser._id},"DEV@Tinder");  //token user id ka token banata hai or jab hum token verify karte hai tab humko wo id he return karta hai decoded message  mai
          
          //create a cookie and send this token in it.
          res.cookie("token",token);
          res.send(isUser);
       }
    }catch(err){
           res.send("invalid credentials")
    }
})

authRouter.post("/logout",(req,res)=>{
    res
    .cookie("token",null,{
        expires: new Date(Date.now())
    })
    .send("logout successfull");
})
module.exports ={
    authRouter
}