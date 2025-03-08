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


})//jab  bhi  connection req bhejega to uska ek alag obj banega or us obj ko ek id mil jayegi or obj user ke follow req feed mai chala jayega fir jaake hammara niche walla api cha;ega agar user accept or reject req bhejega status ko update karne ke lliye tabhi niche request  Id wo obj id hai


requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{  //this one is for receiver i am reveiwing connection request i can either reject it or accept it with api we are making  to create a api you have to first think of route and than miidleware 
    try{const loggedInUser = req.user;//logginIn user is the guy who is seing the req came to him means we have to see that connection req where to userId  is of loggedIn user
    const {status,requestId} = req.params;
    const allowedUpdates = ["accepted","rejected"]; //for user to  review there will to option either reject or request and also before reveiw the requset should be in intersted status than only user can accept or reject it and if connection req  in ignored state no body can accept or reject it
    if(!allowedUpdates.includes(status)){
        return res.status(400).json({message:"status not allowed"})
    }
    
    const connectedReq = await connectionReq.findOne({
        _id: requestId, //id of request in database that from user sent to user
        toUserId : loggedInUser._id,//touser should be the login user that guy only can accept req came to him  mai loggedin user hun means data mai jha to user mai hun wo saari req mai dekh sakta hun yha mai un req ka jawab dera hun 
        status:"interested", //jinhone mujhpe interest dikhaya hai
    })
    if(!connectedReq){
        res.status(400).status("there no coonnection req")
    }
     
    connectedReq.status = status;
    
    const data = await connectedReq.save();
    res
    .status(400)
    .json({message:"connection req" + status})
}catch(err){
        res.status(400).send("ERROR:"+ err.message); //jaise he user ese connection req bhejta hai is ki request tab mai wo saari request aajayegi reqid ke saath bss uska status update kar rha hai loggedIN user

}
})
module.exports = requestRouter;

//writing logic some time you have to learn