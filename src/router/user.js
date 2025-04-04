const express = require('express');
const userAuth = require("../middleware/auth");
const connectionReq = require("../models/connectionreq");
const Users = require("../models/user");
const userRouter = express.Router();
const USER_SAFE_DATA = "name photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
      const loggedInUser = req.user;
  
      const connectionRequests = await connectionReq.find({
        toUserId: loggedInUser._id,
        status: "interested",
      }).populate("fromUserId", USER_SAFE_DATA);
      // }).populate("fromUserId", ["firstName", "lastName"]);
  
      res.json({
        message: "Data fetched successfully",
        data: connectionRequests,
      });
    } catch (err) {
      req.statusCode(400).send("ERROR: " + err.message);
    }
  });


userRouter.get("/user/connection",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connections = await connectionReq.find({
            $or:[
                {fromUserId:loggedInUser._id,status:"accepted"},
                {toUserId:loggedInUser._id,status:"accepted"}
            ]
        }).populate("fromUserId","name age")
          .populate("toUserId","name age gender skills")

        const data = connections.map((ele)=>{
            if(ele.fromUserId._id.toString() == loggedInUser._id.toString()){ //we converted it to toString cause  before it id was mongodb objectIdType
                return ele.toUserId
            }
             return ele.fromUserId;
        })

        res.json(data);
    }catch(err){
        res.status(400).send(err.message)
    }
})

userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
       const loggedInUser = req.user;
       const page = parseInt(req.query.page)||1;//if you dont get page from query than assume page no as 1
       //req.params will not work here i have to do req.query cause params means when req comes like this /feed/:params but in this req we are passing the value in query "/feed/?query"
       let limit = parseInt(req.query.limit)||10;
       // suppose you have large db and user is at page 1 and and he set its  limit to get all the data that query will take forever time and it will be very tough for database it can hang our database server
       limit= limit>50?50:limit; //validating do if user trry to get all the data db will not hang

       const forget = (page-1) * limit;
       const connectionRequest = await connectionReq.find({
        $or:[
            {fromUserId:loggedInUser._id},
            {toUserId:loggedInUser._id}
        ]
       },"fromUserId toUserId")
     
       const hideUsersFromFeed = new Set; //set is an array which takes takes only unique value ni duplicate allowed
       connectionRequest.forEach(element => {
        hideUsersFromFeed.add(element.fromUserId.toString());
        hideUsersFromFeed.add(element.toUserId.toString());
       });
       console.log(hideUsersFromFeed)

       const user = await Users.find({
        $and:[
            {_id:{$nin: Array.from(hideUsersFromFeed)}},
            {_id:{$ne: loggedInUser._id}}
        ] 
       },"name age gender").skip(forget).limit(limit);
       //find all the user with id and id shouldnot be present in array  finding all the people whose id is not present in hideuser array
       res.send(user)
    }catch(err){
        res.status(400).send(err.message)
    }
})

module.exports = userRouter;