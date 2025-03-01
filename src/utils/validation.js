const validator = require('validator')
const validation = (req) =>{

    const {name,emailId,password} = req.body;
    if(!name){
        throw new Error("provide name");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("add valid emailId");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("add strong password")
    }
}


module.exports = {
    validation
}