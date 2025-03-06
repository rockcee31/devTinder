const mongoose = require('mongoose');

const connectionReqSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.ObjectId
    },
    toUserId:{
        type:mongoose.Schema.ObjectId
    },
    status:{
        type:String,
        enum:{
            value:["ignore","interested","accepted","rejected"],
            message:`{value} is of incorrect status type`
        }
    }
},{
    timestamps : true
})


  
   
const  connectionReq = new mongoose.model("connectionReq",connectionReqSchema)  //model helps provide interface to interact ith db and uses schema to add thing in database to tell what fields be document you consider it as collection
connectionReqSchema.pre("save",function(next){
    const connectionReq = this
    if(connectionReq.fromUserId.equals(connectionReq.toUserId)){
        throw new Error("can't send request to yourself")
    }
    next();
})

module.exports= connectionReq;

