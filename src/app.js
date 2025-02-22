const express = require('express');
const {adminAuth,userAuth,accountAuth} = require('./middleware/auth')
const app= express();
const User = require("./models/user");
const connectDb = require("./config/database")

app.use(express.json())
app.post("/signup",async (req,res)=>{
    const newUser = new User(req.body);
    try{
        await newUser.save()
        res.send("user saved sucessfully")
        
    }catch(err){
         res.status(400).send("something went wrong")
    }
})

//get single user from db
app.get("/user",async (req,res)=>{
    const emailId = req.body
    try{
         const user = await User.findOne(emailId);
        if(user.length == 0){
            res.status(404).send("user not found ")
        }else{
            res.send(user)
        }
    }catch(err){
        res.send("something went  wrong");
    }
})

//api to delete user
app.delete("/user",async(req,res)=>{
    const userId= req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("delted sucessfully")
    }catch(err){
        res.status(400).send("something went wrong")
    }
})

//api to update user
app.patch("/user",async (req,res)=>{
    const userId = req.body.userId;
    const data = req.body
    try{
        const user = await User.findByIdAndUpdate(userId,data);
        console.log(user)
        res.send("user updated sucesfully")
    }catch(err){
        res.status(400).send("something went wrong")
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






