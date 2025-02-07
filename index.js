const express = require("express");
const path = require("path");
const userRouter = require("./routes/user.js")

const app = express();
const port = 3000;
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blog')

app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));
app.use(express.urlencoded({extended: false}));

app.get('/',(req,res)=>{
    res.render('home');
})
app.use("/user", userRouter);
app.listen(port, ()=> {
    console.log("Server started!");
})