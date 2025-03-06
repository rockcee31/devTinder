const express = require('express');
const userAuth = require("../middleware/auth");
const connectionReq = require("../models/connectionreq");
const Users = require("../models/user");
const { Connection } = require('mongoose');

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res) =>{
    try{
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
   
    const isallowedUpdates = ["interested","ignored"];
        if(!isallowedUpdates.includes(status)){
            return res.status(400).json({error: "Status is not valid" });
        }
    
    const existingConnection = await connectionReq.findOne({
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
            message: "Connection already exists",
        })
    }
   
    const toUserExist = await Users.findById(toUserId);
    if(!toUserExist){
        res.send("User already exist")
    }

    const Request = new connectionReq({
        fromUserId,
        toUserId,
        status
    })
    await Request.save();
    res.send("connection req send sucessfully")
}catch(err){
    res.status(400).send("can not send connection send request"+ err.message)
    
}


})

module.exports = requestRouter;