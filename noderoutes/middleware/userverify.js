const jwt = require('jsonwebtoken');
const User = require('../db/userSchema');


// .././../db/userSchema'
const verifyUser = async function(req,res,next){
    try {

        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.SECERT_KEY)//verifying the token with the secrete key
        // console.log(verifyUser)
        const user = await User.findOne({_id:verifyUser._id})//fetching the user details through this
        // console.log(user)

        req.token = token;
        req.user = user;

        next();
    } catch (err) {
        res.send('error occured from cookie side')
    }
}

module.exports = verifyUser;