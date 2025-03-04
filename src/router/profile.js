const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const profileRouter = express.Router();// jo bhi profile related routes hai unko manage kar rha hai //server pe jab bhi profile related request aayegi to usse profileRouter manage karega
const User = require("../models/user");
const userAuth = require("../middleware/auth")


profileRouter.get("/profile",userAuth,async(req,res)=>{
    try{
        res.send(req.user);
    }catch(err){
        res.send("Unable to get profile"+ err.message);
    }
})

profileRouter.post("/profile/edit",userAuth,async(req,res)=>{
     try{
        validateProfileEdit(req);
        const loggedInuser = req.user;

       Object.keys(req.body).forEach((key)=>(loggedInuser[key] = req.body[key]));

       loggedInuser.save();
     }catch(err){
         res.status(400).send("unable to edit ")
     }
})
module.exports={
    profileRouter
}