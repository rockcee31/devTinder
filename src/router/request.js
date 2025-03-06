const express = require('express');
const userAuth = require("../middleware/auth");
const connectionReq = require("../models/connectionreq");
const Users = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res) =>{
    try{
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
   
    const isallowedUpdates = ["ignored","accepted"];
        if(!isallowedUpdates.includes(status)){
            return res.status(400).json({error: "Status is not valid" });
        }
    
    const existingConnection = await User.findOne({
        $or:[//If either condition is true, MongoDB returns a result.
            {
                fromUserId,
                toUserId
            },
            {
                fromUserId:toUserId,
                toUserId:fromUserId
            }
        ]
    })

    if(existingConnection){
         res.json({
            message: "Connection already exists"
         })
    }
    
    const toUserExist = await User.findById({_id});
    if(!toUserExist){
        res.send("User already exist")
    }
 
}catch(err){
    res.status(400).send("can not send connection send request",err.message)
}


})