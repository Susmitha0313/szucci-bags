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
  try{
    console.log("middleware calling");
    
    admin = req.session.admin;
    console.log("middleware"+ admin);
  
    if(admin){
        next();
    }else{
        console.log("else condition");
        res.redirect("/admin/adminLogin");
    }
}catch(error){
    console.error("Error in isAdmin middleware:", error);
    res.status(500).send("Internal server error");
}
}





module.exports = {
    isLogged,
    isAdmin
}