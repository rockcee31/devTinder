const mongoose = require('mongoose');



//Define schema (DOCUMENT STRUCTURE)
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required: true
    }
})




//2 create model from schema (interface for the collection)
const User = mongoose.model('User',userSchema);

/* 
//3 create new document using the model
const  newUser = new User({
    name:'Rohit Thapliyal',
    email: 'rohit@example.com',
    age:25
});


// 4. Save the document to the 'users' collection
newUser.save()
    .then(() => console.log('User saved!'))
    .catch(err => console.error(err));

*/


module.exports = mongoose.model('User',userSchema)