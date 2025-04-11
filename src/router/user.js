const express = require('express');
const userAuth = require("../middleware/auth");
const connectionReq = require("../models/connectionreq");
const User = require("../models/user");
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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;  // Default to page 1
    let limit = parseInt(req.query.limit) || 10;  // Default to limit of 10 items

    // Ensure limit doesn't exceed 50
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    // Find connection requests where the logged-in user has either sent or received a request
    const connectionRequest = await connectionReq.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }
      ]
    }).select("fromUserId  toUserId");
  //  console.log(connectionRequest)
    // Use a Set to track users who have sent/received requests to/from the logged-in user
    const hideUsersFromFeed = new Set();

    // Add users who have interacted with the logged-in user (either sent or received a request)
    connectionRequest.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId.toString());
      hideUsersFromFeed.add(request.toUserId.toString());
    });

    // console.log("Users to hide from feed:", hideUsersFromFeed);

    // Fetch users who have not interacted with the logged-in user
    const users = await User.find({
      $and:[
      {_id: { $nin: Array.from(hideUsersFromFeed) }  },// Exclude users who have interacted
      {_id: { $ne: loggedInUser._id } } // Exclude the logged-in user themselves
      ]
    }, "name age gender")
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
})
module.exports = userRouter;