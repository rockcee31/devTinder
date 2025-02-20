const mongoose = require("mongoose");

const connectdb = async()=>{
    await mongoose.connect('mongodb+srv://thapliyalrohit31:cTV6CpqrJFzkr1Y8@cluster0.tjdzl.mongodb.net/devTinder');
}

module.exports = connectdb;

