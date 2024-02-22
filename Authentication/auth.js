const { log } = require("console");
const User = require("../models/userSchema");

const isLogged = (req,res,next)=>{
    console.log("isLogged middleware calling");
    log
    if(req.session.user){
        User.findOne({_id: req.session.user})
        .then((data)=>{
            if(data.isBlocked == false){
                next()
            }else{
                res.redirect("/adminlogin")
            }
        })
    }else{
        console.log("else case");
        res.redirect("/login");
    }
}

const isAdmin = (req,res,next)=>{
    User.findOne({ isAdmin:"1"})
    .then((data)=>{
        if(data){
            next();
        }else{
            res.redirect("/adminlogin");
        }
    })
    .catch((error)=>{
        console.log("Error in isAdmin middleWare");
        res.status(500).send("Internal server errorrrr");
    })
}


module.exports = {
    isLogged,
    isAdmin
}