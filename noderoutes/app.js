const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const app = express();

//DATABASE Connection
dotenv.config({path:'./config.env'});
require('./db/connection')
// const User = require('./db/userSchema');
const paritalsPath = path.join(__dirname,'./views/partials');

//setting uop view engine
app.set('view engine','hbs')
app.set('views',path.join(__dirname,'views'))
hbs.registerPartials(paritalsPath);

//Middle ware
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(require('./router/auth'));



const port = process.env.PORT;


//APIS

// app.get('/',(req,res)=>{
//     res.json({ message:"hi im home page"})
// })

app.listen(port,()=>{
    console.log("port is running");
});