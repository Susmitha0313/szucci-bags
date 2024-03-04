const { log } = require("console");
const User = require("../models/userSchema");

const isLogged = (req,res,next)=>{
    console.log("logged? middleware")
    if(req.session.email){
      next()
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