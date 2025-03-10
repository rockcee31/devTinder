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
        toUserId : loggedInUser._id,//touser should be the login user that guy only can accept req came to him  mai loggedin user hun means data mai jha to user mai hun wo saari req mai dekh sakta hun yha mai un req ka jawab dera hun  // basically yha yeh check hora hai ki iso ko aarakhi hai na  ye request jo login ho rakha hai pta chale koi hor aake accept kar rha ho apne aap
        status:"interested", //jinhone mujhpe interest dikhaya hai
    })
    if(!connectedReq){
        res.status(400).status("there no coonnection req")
    }
     
    connectedReq.status = status;
    
    const data = await connectedReq.save();
    res
    .status(400)
    .json({message:"connection req " + status})
}catch(err){
        res.status(400).send("ERROR:"+ err.message); //jaise he user ese connection req bhejta hai is ki request tab mai wo saari request aajayegi reqid ke saath bss uska status update kar rha hai loggedIN user

}
})
module.exports = requestRouter;

//writing logic some time you have to learn


//part 2 notes

/*thought process of writing post api is different than thought process of writing get api 
developers are the  gaurd of database 
what  happens in post api(api which handle post call) user are are trying to enter some data into the database 
ans get api(api that  handle get call) means user are trying to fetch some data from the database
now how attackers can attack your post so they can attack your post api by sending some malicious data into your api and you mistakenly put that data into your database
and in get api your getting some information from the database now database should be very safe now in get api we have to make sure we are sending only allowed data what ever data im sending to user i have to make sure that the user is authorised and suppose im rohit and im trying to acess the connection req  elon has that should not be allowed so we have  to make sure that loggedin user is verified user and whatever he is requesting is requesting the correct information which is allowed in his scope
now to handle user data thing we will create user router in router file and inside it le t us first found connect request of loggedin user all the  connection req user have received

"user/requests"
in code always  find return you array and findone return you object 
if you only do get all the req where touser id is equal to loggedin user id it  doesn't make sene you have to pass also where the status is interested cause you don't want to see request where you are ignored like this api can give request which i have accepted if i don't pass the status
now there is one more issue we are send id's of  the user but in  the real world scenario you would need information about those people also  
how will i get that information
1st way i can map to each obj anf using from userid of each i can write query to find name of each user all the time but i dont think it is good instead of it
i can build relationship between to table or collectio HOW?
using ref you can pass ref inside schema
i give fromuserId field in schema ref as user means fromUserID id is the is the id from the user collection ye id or kha mojud hai user collection to uska reference lera hun mai yha it will make link between fromuser and user in user scema  //reference of user collection  (to get access of user collection ) 
now whenever i making call to connection request i will just  populate my reference now How do you populate the reffernce?
so when im doing connectionReq.find({toUserId :fromUserId,status:"interested"}) it is givingme the data inside that data object ihave created referenc of this fromUserId to my user collection now i wil; populate my fromuserID
connectionReq.find({toUserId :fromUserId,status:"interested"}).populate("fromUserId",["firstName":"lastName"]) now if i make api call fromuserid will become object and inside it i will get these two field with id if i pass empty 2nd parameter it will populate with everything 
there are two ways to what to populate first array of string[String] 2nd write it as string "firstName lastName"


GET "/user/connection" //here i will to fetch who is basically my connection who has accepted my request 
// here i have to query in data base where status is accepted or either fromuser is loggedin user or touser is loggedinuser*/