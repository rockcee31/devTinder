const mongoose = require("mongoose");
const validator = require("validator");

//Define schema (DOCUMENT STRUCTURE)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("add correct order of email" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      // validate(value){
      //     if(!validator.isStrongPassword("please add strong password and order"+value));
      // }
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      required: true,
      validate: {
        validator: (value) => {
          return ["Male", "Female", "Others"].includes(value);
        },
        message: "gender data is not right",
      },
    },
    skills: {
      type: [String],
    },

    photoUrl: {
      type: String,
      validate: {
        validator: (value) => validator.isURL(value),
        message: "Invalid URL format.",
      },
      default:"https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg?semt=ais_hybrid",
    },
    about: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//2 create model from schema (interface for the collection)
const User = mongoose.model("User", userSchema);

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

module.exports = mongoose.model("User", userSchema);
