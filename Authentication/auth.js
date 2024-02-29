const { log } = require("console");
const User = require("../models/userSchema");

const isLogged = (req,res,next)=>{
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
    isAdmin
}