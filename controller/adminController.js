const express =require("express");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const { session } = require("passport");


const pageNotFound = async (req, res) => {
    res.render("user/page-404")
 };


//load adminLoginPage
const getAdminHome = async(req,res)=>{
    console.log("its loagningdg");
       try{
         res.render("adminHome");
       
    }catch(error){
        res.redirect("/pageerror");
    }  
    }
   





const getUserList = async(req,res)=>{
    try{
        const user = await User.find({})
         res.render("userList",{user});
       
    }catch(error){
        res.redirect("/pageerror");
    }
};



const getALoginpage = async(req,res)=>{
    try{
         res.render("adminLogin");
       
    }catch(error){
        res.redirect("/pageerror");
    }
};


const getLogout =async(req,res)=>{
    try{
        req.session.admin = null;
        res.redirect("/admin/adminLogin");
    }catch(error){
        res.redirect("/pageerror");
    }
}







const adminLogin = async (req, res) => {
    
    try {
        const email= req.body.emailA;
        const password = req.body.passwordA;

        // Find user by email
        const admin = await User.findOne({email , isAdmin:"1"});
        // Check if user exists
        if (!admin) {
            return res.render("adminLogin",{ errmessage: "Admin not found" });
        }
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.render("adminLogin",{ errmessage: 'Invalid password' });
        }
  
        // Password is correct, set up user session or generate JWT token
        req.session.admin = admin;
        req.session.save();
        console.log(req.session.admin);
        console.log("admin logging in");
        if(req.session.redirectTo){
            res.redirect(req.session.redirectTo);
            delete req.session.redirectTo;
        } else {
             res.redirect("/admin/adminHome"); // Redirect to the desired page after successful login
        
        }
    } catch (error) {
        console.error("/pageerror");
        res.status(500).json({ error: 'Server error' });
    }
};




const userBlock = async(req,res)=>{
    try{
        const id = req.query.id;
        const userData = await User.findOne({_id:id});

        if(userData.isBlocked == true){
            const blocked = await User.findByIdAndUpdate({_id:id},{$set:{isBlocked:false}});
          }else{
           const unblocked = await User.findByIdAndUpdate({_id:id},{$set:{isBlocked:true}});
          }
          const user = await User.find({})
          res.render("userList",{user});
    }catch(error){
        console.error("/pageerror");
    }
}




module.exports = {
    pageNotFound,
    getAdminHome,
    // getProducts,
    getUserList,
    getALoginpage,
    getLogout,
   
    userBlock,

    adminLogin
    
}