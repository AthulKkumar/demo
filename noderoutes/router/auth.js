const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('../db/connection');//requring the database connetion
const User = require('../db/userSchema');//requring the userSchema
const verify = require('../middleware/userverify');

router.get('/',(req,res)=>{
    // res.send("hi im from router")
    res.render('index')   
})
//Using promise
// router.post('/',(req,res)=>{

//     const { name,email,phone, password , cpassword} = req.body;
//     //To check if all feilds are filled or not
//     if(!name || !email || !phone || !password || !cpassword){
//         return res.json({message:"error please fill th data"});
//     }
//     //to check if the email is already exisiting
//     User.findOne({email: email})
//     .then((userExist)=>{
//         if(userExist){
//             return res.json({message :"email aready exixst"})
//         }
//         //If email is not existing the data will be add into the db
//         const user = new User({ name,email,phone, password , cpassword})

//         user.save().then(()=>{
//             res.json({message :"user created"})
//         })
//         .catch(()=>{
//             res.json({message:"didint save into db"})
//         })
//     }).catch((err)=>{
//         console.log("error");
//     })

//     // console.log(req.body);
//     // res.send('im from sign in')
//     res.json({message :req.body})
// })

//Using async await
router.get('/register',(req,res)=>{
    res.render('register');
})

router.post('/register', async(req,res)=>{
    console.log(await req.body)
    try{
    const { name,email,phone, password , cpassword} = req.body;
    //To check if all feilds are filled or not
    if(!name || !email || !phone || !password || !cpassword){
        return res.json({message:"error please fill th data"});
    }
    //Using try and catch instead of then and catch in promise
   
        //to check if the email is already exisiting
        const userExist = await User.findOne({email: email})

        if(userExist){
            return res.json({message :"email aready exixst"})
        }else if(password != cpassword){
            return res.json({message :"password is not match"})
        }

        const user = new User({ name,email,phone, password , cpassword})
        const token = await user.generateAuthToken();//gernerating the token by calling the method
        // console.log(token,"regisster side")
        res.cookie('jwt',token,{
            expires: new Date(Date.now()+1200000),
            httpOnly:true
        })

        await user.save()
        res.json({message :"user created"})
        
    }catch(err){

        res.json({message:"didint save into db"})
    }
})    

//Login section
router.get('/login',(req,res)=>{
    res.render('login')
})

router.post('/login', async (req,res)=>{
    // console.log(await req.body)
    const { email,password} = req.body;
    
    if (!email || !password){
        return res.json({message:"error please fill th data"});
    }

    try {
        //finding the user from the db 
        const userLogin = await User.findOne({email: email})

        if (userLogin){

            const isMatch = await bcrypt.compare(password,userLogin.password); //checking the password from db and entered password is correct or not
            if(!isMatch){
                res.json({error :"pls fill the data"})
            }else{
                        
                const token = await userLogin.generateAuthToken();//gernerating the token by calling the method
                console.log(token,"hi")
                //used to store token in cookie stroage
                res.cookie('jwt',token,{
                    expires: new Date(Date.now()+1200000),
                    httpOnly:true
                })
                // res.render('index')
                res.json({message:"login sucessfully"})
            }
    
        }else{
            res.json({error :"pls fill the data"})
        }

    } catch (error) {
        console.log('error')
    }
})

//personal 
 
router.get('/personal',verify,(req,res)=>{
    res.render('personal')
})

//logout

router.get('/logout',verify,async (req,res)=>{
    try {
        //logout from one device
        // req.user.tokens = req.user.tokens.filter((currentElem)=>{
        //     return currentElem.token != req.token
        // })

        //logout from all device
        req.user.tokens = [];
        res.clearCookie('jwt')
        console.log('logout sucessfully')

        await req.user.save();
        res.render('login')
    } catch (err) {
        res.send("error from login side")
    }
})
    
module.exports = router;