const express = require('express');
const {adminAuth,userAuth,accountAuth} = require('./middleware/auth')
const app= express();
const User = require("./models/user");
const connectDb = require("./config/database")
const bcrypt = require('bcrypt');
const {validation} = require("./utils/validation")
const {authRouter} = require("./router/auth")
const {profileRouter} = require("./router/profile")
const cookieParser = require('cookie-parser');

app.use(express.json())
app.use(cookieParser())


app.use("/",authRouter);//THIS IS MIDDLE  WARE BUT ITS NOT HANDLING ROUTE it is not modifying requests like normal middleware (e.g., authentication or logging middleware).

app.use("/",profileRouter)

// app.get("/profile",async (req,res)=>{
//     try{
//     const cookie = req.cookies;  //it will give all the cookie  but to read the cookie we need another library basically that library provides a middleware whicvh known as cookie parsser we need to parse that cookie to read it remember using exprees json to convert req to js json im using cookie parser aboved
//     const {token} = cookie;
    
//     const decodedMessage = await jwt.verify(token,"DEV@Tinder$23")
//     const {_id} = decodedMessage;                                                            

//          const user = await User.findOne({_id});
//         if(!user){
//             throw new Error("user does not exist")
//         }else{
//             res.send(user)
//         }
//     }catch(err){

//         res.send("something went  wrong" + err.message);
//     }
// })


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
        const user = await User.findByIdAndUpdate(userId,data,{ runValidators: true });
       
        console.log(user)
        res.send("user updated sucesfully")
    }catch(err){
        res.status(400).send("something went wrong")
    }
}
)



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

