const adminAuth = (req,res,next) =>{
    console.log("authenticating starts");

     const token = "xyz";
     const isAuthenticated = token == "xyz";
     if(!isAuthenticated){
        res.status().send("unauthorized")
     }
     else{
        next();
     }
}
const accountAuth = (req,res,next) =>{
   console.log("accoount authentication started");
   const token = "xyz";
   const isAuthenticated = token == "xyz";
   if(!isAuthenticated){
      res.status().send("unauthorized")
   }
   else{
      next();
   }
}

const userAuth = (req,res,next)=>{
    const token = "xyz";
    const isAuthenticated = token == "xyz";
    if(!isAuthenticated){
       res.status().send("unauthorized")
    }
    else{
       res.send("user authorized");
    }
}

module.exports={
    adminAuth,
    userAuth,
    accountAuth
}