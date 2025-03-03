const express = require('express');
const {adminAuth,userAuth,accountAuth} = require('./middleware/auth')
const app= express();
const User = require("./models/user");
const connectDb = require("./config/database")
const bcrypt = require('bcrypt');
const {validation} = require("./utils/validation")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
app.use(express.json())
app.use(cookieParser())
app.post("/signup",async (req,res)=>{
    
    try{
    //validate data 
    validation(req);
    

    //encryption of password
    const {emailId,password,name,age,gender} = req.body;
    const passwordHash = await bcrypt.hash(password,10);
    console.log(passwordHash);

    //put it into database
    const user = new User({
        name,
        emailId,
        password:passwordHash,
        age,
        gender
    })
    await user.save();
    res.send("sign up sucessfull")
    }catch(err){
        res.send("ERROR IN SIGN UP "+ err.message);
    }
})

app.post("/login",async(req,res) =>{
    try{
    const {emailId,password}= req.body;
    const isUser = await User.findOne({emailId:emailId});
    console.log(isUser);
    if(!isUser){
        throw new Error("invalid credential");
    }
    const itsPassword = await bcrypt.compare(password,isUser.password)
    
    if(itsPassword){
        //create s JWT token 
         const token = jwt.sign({_id:isUser._id},"DEV@Tinder$23")
        //Add the token to cookie and send the response to the user 
        // when you send a response back express give you easy way to send the cookie there is method res.cookie
        res.cookie("token",token);

        res.send("Login successful!!")
    }
    else{
        throw new Error("invalid credential");
    }
1
    }catch(err){
        res.status(400).send("unable to log"+ err.message)
    }
})

app.get("/profile",async (req,res)=>{
    try{
    const cookie = req.cookies;  //it will give all the cookie  but to read the cookie we need another library basically that library provides a middleware whicvh known as cookie parsser we need to parse that cookie to read it remember using exprees json to convert req to js json im using cookie parser aboved
    const {token} = cookie;
    
    const decodedMessage = await jwt.verify(token,"DEV@Tinder$23")
    const {_id} = decodedMessage;                                                            

         const user = await User.findOne({_id});
        if(!user){
            throw new Error("user does not exist")
        }else{
            res.send(user)
        }
    }catch(err){

        res.send("something went  wrong" + err.message);
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

