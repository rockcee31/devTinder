const validate = require('validator')

const validateProfileEdit = (req) =>{

   // Check if req.body is empty
   if (Object.keys(req.body).length === 0) {
      throw new Error("No fields provided for update");
  }
    const allowedUpdates = ["name","age","skills","gender","photoUrl"];
    const allowed = Object.keys(req.body).every((key)=> allowedUpdates.includes(key))
     
    return allowed;
}

const validateProfilePassword = (req)=>{
    // Check if req.body is empty
    if (Object.keys(req.body).length === 0) {
      throw new Error("No fields provided for update");
  }

  const allowedUpdates = ["password"]
  const allowed = Object.keys(req.body).every((key)=> allowedUpdates.includes(key));
  if(!allowed){
   throw new Error("cannot edit somee fields")
}
  const {password} = req.body
  if(!validate.isStrongPassword(password)){
   throw new Error("please add strong password");
   
  }
}

module.exports = validateProfileEdit;