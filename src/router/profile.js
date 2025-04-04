const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const profileRouter = express.Router();// jo bhi profile related routes hai unko manage kar rha hai //server pe jab bhi profile related request aayegi to usse profileRouter manage karega
const User = require("../models/user");
const userAuth = require("../middleware/auth")
const validateProfileEdit = require("../utils/validateProfileEdit")
const bcrypt = require('bcrypt');


profileRouter.get("/profile",userAuth,async(req,res)=>{
    try{
        res.send(req.user);
    }catch(err){
        res.send("Unable to get profile"+ err.message);
    }
})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
     try{
        if (!validateProfileEdit(req)) {
            throw new Error("Invalid Edit Request");
          }
      

        const loggedInuser = req.user;

       Object.keys(req.body).forEach((key)=>(loggedInuser[key] = req.body[key]));

       await loggedInuser.save();
       res.json({
        message: `${loggedInuser.name}, your profile updated successfuly`,
        data: loggedInuser,
      });
     }catch(err){
        res.status(400).send("ERROR : " + err.message);
     }
})

profileRouter.patch("/profile/password",userAuth,async(req,res) =>{
    const loggedInUser = req.user
    const itsPassword = await bcrypt.compare(password,req.user.password);
    if(itsPassword){
        throw new Error("this is password already exist")
    }else{
        const passwordHash = await bcrypt.hash(password,10);
        loggedInUser.password(passwordHash)
        await loggedInUser.save();
    }


})
module.exports={
    profileRouter
}