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
        console.log("/pageerror");
    }  
    }
   



const getProducts = async(req,res)=>{
    try{
         res.render("products");
    }catch(error){
        console.log("/pageerror");
    }
};


const getUserList = async(req,res)=>{
    try{
        const user = await User.find({})
         res.render("userList",{user});
       
    }catch(error){
        console.log("/pageerror");
    }
};



const getAddProduct = async(req,res)=>{
    try{
         res.render("addProduct");
       
    }catch(error){
        console.log("/pageerror");
    }
};



const getALoginpage = async(req,res)=>{
    try{
         res.render("adminLogin");
       
    }catch(error){
        console.log("/pageerror");
    }
};


const getLogout =async(req,res)=>{
    try{
        req.session.admin = null;
        res.redirect("/admin/adminLogin");
    }catch(error){
        console.log("/pageerror");
    }
}



const getCategory = async(req,res)=>{
    try{
         res.render("productCategory");
       
    }catch(error){
        console.log("/pageerror");
    }
};

const getCategoryEdit = async(req,res)=>{
    try{
        res.render("productCategEdit");
    }catch(error){
        console.log("/pageerror");
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
            return res.status(404).json({ message: "Admin not found" });
        }
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
  
        // Password is correct, set up user session or generate JWT token
        req.session.admin = admin;
        req.session.save();
        console.log(req.session.admin);
        console.log("admin logging in");

        res.redirect("/admin/adminHome"); // Redirect to the desired page after successful login
        
       
    } catch (error) {
        console.error("/pageerror");
        res.status(500).json({ error: 'Server error' });
    }
};



const blockUser = async(req,res)=>{
    try {
        const userId = req.params.userId;
        console.log(userId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.isBlocked = true;
        await user.save();
        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const unblockUser = async(req,res)=>{
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.isBlocked = false;
        await user.save();
        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        console.error('Error unblocking user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



module.exports = {
    pageNotFound,
    getAdminHome,
    getProducts,
    getUserList,
    getAddProduct,
    getALoginpage,
    getLogout,
    getCategory,
    getCategoryEdit,
    blockUser,
    unblockUser,

    adminLogin
    
}