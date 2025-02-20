const express = require('express');
const {adminAuth,userAuth,accountAuth} = require('./middleware/auth')
const app= express();
const User = require("./models/user");
const connectDb = require("./config/database")

app.post("/signup",async(req,res)=>{
    //creating new iinstance of User model
    const newUser = new User({
        name:'hdfierfl',
        email: 'hgiehrgk@example.com',
        age:43
    })
    try{
    await newUser.save();
    res.send("here we are")
    }catch(err){
      res.status(400).send("Error in saving the user " + err.message)
    }
})

app.use("/",(req,res)=>{
    res.send("you are in /route")
})

connectDb().then(()=>{
    console.log("database connection made sucessfully");
    app.listen(3000,()=>{
        console.log("server is listening on port 3000")
    });
}).catch((err)=>{
    console.error(505);
})






