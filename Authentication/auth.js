const { log } = require("console");
const User = require("../models/userSchema");

const isLogged = (req,res,next)=>{
    if(req.session && req.session.email){
      next();
    }else{
        console.log("else case");
        req.session.redirectTo = req.originalUrl;
        res.redirect("/login");
    }
}


const notLog = (req,res,next)=>{
    if(req.session.email){
        res.redirect("/");
    }else{
        next();
    }
}

const isAdmin = (req,res,next)=>{
  try{
    admin = req.session.admin;
    if(admin){
        next();
    }else{
        res.redirect("/admin/adminLogin");
    }
}catch(error){
    console.error("Error in isAdmin middleware:", error);
    res.status(500).send("Internal server error");
}
}





module.exports = {
    isLogged,
    isAdmin,
    notLog
}