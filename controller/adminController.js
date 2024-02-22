const express =require("express");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");


//load adminLoginPage
const getAdminHome = async(req,res)=>{
    try{
         res.render("adminHome");
       
    }catch(error){
        console.log(error.message);
    }
};



const getProducts = async(req,res)=>{
    try{
         res.render("products");
       
    }catch(error){
        console.log(error.message);
    }
};


const getUserList = async(req,res)=>{
    try{
         res.render("userList");
       
    }catch(error){
        console.log(error.message);
    }
};



const getAddProduct = async(req,res)=>{
    try{
         res.render("addProduct");
       
    }catch(error){
        console.log(error.message);
    }
};



const getALoginpage = async(req,res)=>{
    try{
         res.render("adminLogin");
       
    }catch(error){
        console.log(error.message);
    }
};


const getLogout =async(req,res)=>{
    try{
        res.render("adminLogin");
    }catch(error){
        console.log(error.message);
    }
}



const getCategory = async(req,res)=>{
    try{
         res.render("productCategory");
       
    }catch(error){
        console.log(error.message);
    }
};


  

const adminLogin = async (req, res) => {
    console.log("admin logging in");
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
        // req.session.user = user;
        res.redirect("/admin"); // Redirect to the desired page after successful login
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};



module.exports = {
    getAdminHome,
    getProducts,
    getUserList,
    getAddProduct,
    getALoginpage,
    getLogout,
    getCategory,
    adminLogin
    
}