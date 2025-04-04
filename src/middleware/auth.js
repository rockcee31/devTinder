// const { request } = require('express');
const jwt = require('jsonwebtoken')
const User =  require('../models/user');




const userAuth = async(req,res,next)=>{
   try{
   const cookie = req.cookies;
   const {token} = cookie;
   if(!token){
    return res.status(401).send("Please Login")
   }
  const decodedMessage =  jwt.verify(token,"DEV@Tinder");
//   console.log(decodedMessage)
  const {_id} = decodedMessage;
  const user = await User.findOne({_id});
   req.user = user;
   next()
   }catch(err){
       res.status(401).send("you are not loggedIn")
   }
}

module.exports= userAuth;
