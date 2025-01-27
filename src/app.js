const express = require('express');

const app= express();

app.use("/hello",(req,res)=>{
    res.send("hello hello hello`")
});

app.use("/",(req,res)=>{
    res.send("Namaste from the server")
})

app.use("/test",(req,res)=>{
    res.send("hello from server")
});

app.listen(3000,()=>{
    console.log("server is listening on port 3000")
});




