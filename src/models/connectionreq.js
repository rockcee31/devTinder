const mongoose = require('mongoose');
const User = require("./user")
const connectionReqSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.ObjectId,
        ref:User
    },
    toUserId:{
        type:mongoose.Schema.ObjectId,
        ref:User
    },
    status:{
        type:String,
        enum:{
            values:["ignored","interested","accepted","rejected"], //yha pe ek cheez not karna ki maine values ko value likh diya tha to ye error aaya ki expecting error to values karna hai
            message:`{VALUE} is of incorrect status type`
        }
    }
},{
    timestamps : true
})


  
   

connectionReqSchema.pre("save",function(next){
    const connectionReq = this //here this refers to element which is going to save it works like that inside pre save hook 
    if(connectionReq.fromUserId.equals(connectionReq.toUserId)){
        throw new Error("can't send request to yourself")
    }
    next();
})

// connectionReqSchema.index({firstName:1,lastName:1})

const  connectionReq = new mongoose.model("connectionReq",connectionReqSchema)  //model helps provide interface to interact ith db and uses schema to add thing in database to tell what fields be document you consider it as collection
module.exports= connectionReq;

