const express = require("express");
const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const Address = require("../models/addressSchema.js");
const Order = require("../models/orderSchema.js");
const otpController = require("../Config/Otp/otpController");
const sentMail = require("../Config/nodemailer/sentMail.js");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const env = require("dotenv");
const { v4: uuidv4 } = require("uuid");
env.config();


const pageNotFound = async (req, res) => {
   res.render("user/page-404")
};



//load loginPage
const getLoginPage = async(req,res)=>{
    try{
        res.render("user/login");
    }catch(error){
        res.redirect("/pageNotFound");
    }
};




const getAllProductsPage= async(req,res)=>{
    try{
        const proData = await Product.find({isBlocked : false});
        res.render("user/allProducts",{proData})
    }catch(error){
        console.log(error.message);
    }
};



const getVerifyOtpPage = async(req,res)=>{
    try{
            res.render("user/verify-otp");
    }catch(error){
        res.redirect("/pageNotFound");
    }
};



//load signUppage
const getSignupPage = async(req,res)=>{
    try{
        res.render("user/signup")
    }catch(error){
        res.redirect("user/pageNotFound");
    }
};




const getHomePage= async(req,res)=>{
    try{
        const proData = await Product.find({isBlocked : false});
        res.render("user/home",{proData})
    }catch(error){
        console.log(error.message);
    }
};



const getOtpPage = async(req,res)=>{
    try{
        res.render("verify-otp");
    }catch(error){
        console.log(error.message);
    }
};






const signupUser = async(req,res)=>{
    try{
        const email = req.body.email;
        const findUser = await User.findOne({email});

            if(!findUser){
                let otp = otpController.generateOtp();
                const otpDuration = 5 * 60 * 1000;
                sentMail(email, otp);
                const otpData = {otp, expiryTime:Date.now() + otpDuration};
                otpController.otpExpiryTimer(otpData, otpDuration);
                const newUser={
                    name:req.body.name,
                    email:req.body.email,
                    phone:req.body.phone,
                    password:req.body.password,
                    otp
                }
                console.log(newUser);
                req.session.data = req.session.data || {};
                Object.assign(req.session.data, newUser);
                req.session.save();

                res.render("user/verify-otp");
                
            }else{
                console.log("User already Exists");
                return res.render("user/signup",{
                    message:"User with this email already exists",
                });
            }
    }catch(error){
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
};





//verify otp from email with generated otp and save the user data to DB
const verifyOtp = async(req,res)=>{
    try{
         //get otp from body
         const bodyOtp = req.body.otp;
         const sessionOtp = req.session.data.otp;
        if(bodyOtp === sessionOtp){
            const user = req.session.data;
            const passHashed = await securePassword(user.password);
            const newUser =  new User({
                name:user.name,
                email:user.email,
                phone: user.phone,
                password:passHashed
            });
            await newUser.save();
            req.session.user = newUser._id;
            res.locals.message = "OTP verified successfully";
            console.log("verifying OTP")
            res.json({status:"success"});
            // res.redirect("/login");
           
        }else{
         res.json({status:"failed"});

            //  console.log("OTP does not match");
            //  res.render("user/verify-otp")
        }
        }catch(error){
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};



const saveUpdatedPassword = async(req,res)=>{
    console.log("sdfgsdgsdf")
    try{
        const {currentPassword, newPassword , confirmNewPassword } = req.body;
        const userId = req.session.user;
        const userData = await User.findById(userId);
        console.log(userData);
        if(!userData){
            return res.status(404).json({ status: "error", message: "User not found" });
        }


        res.json({ status: "success", message: "Password updated successfully" });
    }catch(error){
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}



//Generate Hashed Password
const securePassword = async (password) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      return passwordHash;
    } catch (error) {
      console.log(error.message);
    }
  };



  const resendOtp = async(req,res)=>{
    try{
       const email = req.session.data.email;
       console.log(email);
        const newOtp = otpController.generateOtp();
        await sentMail(email, otp);
        req.session.data.otp = newOtp;
        res.render("user/verify-otp")
    }catch(error){
        console.log("Error in resending OTP ");
    }
  }
  



const userLogin = async (req, res) => {   
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({email});

        if (!user) {
            return res.render("user/login",{ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.render("user/login", { message: 'Invalid password' });
        }     
        req.session.email = email;
        req.session.userId = user._id;

        // Redirect logic
        if (req.session.redirectTo) {
            res.redirect(req.session.redirectTo);
            delete req.session.redirectTo; // Clear the stored URL
        } else {
            res.redirect("/"); // Redirect to home page if no stored URL
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};





const allProductSort= async(req ,res)=>{
    try{
        const sort = req.query.sort;
        if(sort == "Lowtohigh"){
            const proData = await Product.find({isBlocked : false}).sort({salePrice: 1}); 
            res.render("user/allProducts",{proData});
        }
        else if(sort == "Hightolow"){
            const proData = await Product.find({isBlocked : false}).sort({salePrice: -1}); 
            res.render("user/allProducts",{proData});
        }
        else if(sort == "AtoZ"){
            const proData = await Product.find({isBlocked : false}).sort({productName: -1}); 
            res.render("user/allProducts",{proData});
        }
        else if(sort == "ZtoA"){
            const proData = await Product.find({isBlocked : false}).sort({productName: 1}); 
            res.render("user/allProducts",{proData});
        }
        else if(sort == "ZtoA"){
            const proData = await Product.find({isBlocked : false}).sort({salePrice: 1}); 
            res.render("user/allProducts",{proData});
        }
        else if(sort == "Default"){
            const proData = await Product.find({isBlocked : false})
            res.render("user/allProducts",{proData});
        }
       
    }catch(error){
        console.log(`error in logging all products page : ${error}`);
    }
}
  






const getuserAccountDetails = async(req, res) => {
    try {
        const userId = req.session.userId;
        const userInfo = await User.findById(userId);
        const orderInfo = await User.findById(userId);
        // const addressInfo = await User.findById(userId);
        res.render("user/userAccountDetails", { userInfo });
    } catch(error) {
        console.log(error.message);
    }
}

   
const getuserOrderDetails = async(req, res) => {
    try {
        const userId = req.session.userId;
        const userData = await User.findOne({userId : userId});
        const cartData = await Cart.findOne({userId : userId});
        console.log("userId and cart"+userId, cartData);
        res.render("user/userOrders", { orderInfo , cartData});
    } catch(error) {
        console.log(error.message);
    }
}
  


const getuserAddAddress = async(req, res) => {
    try {
        const userId = req.session.userId;
        console.log(userId);
        // const userInfo = await User.findById(userId);
        // const orderInfo = await User.findById(userId);
        const addressInfo = await Address.find({userId: userId});
        res.render("user/userAddAddress", {addressInfo});
    } catch(error) {
        console.log(error.message);
    }
}


const getusereditAddress = async(req,res)=>{
    try{
        const adressId = req.query.id;
        const address = await Address.findById({_id : adressId});
        console.log("adress id "+ adressId , address);
        res.render("user/usereditAddress",{address})
    }catch(error){
        console.log(error.message);
    }
}



//edit cheythit ullapost function 

const addNewAddress = async(req,res)=>{
    console.log("Adding address");
    try{
        const userId = req.session.userId;
        const { name, phone, pincode, locality, city, address, state, landmark, phone2 } = req.body;
        const newAddress = new Address({
            userId, name, phone, pincode, locality, city, address, state, landmark, phone2
        });
        console.log(userId, name, phone, pincode, locality, city, address, state, landmark, phone2  )
        await newAddress.save();
        console.log("this is the new saved address "+newAddress)
        res.redirect("/address");
    }catch(error){
        console.log(error.message)
    }
}
  


const editAddress = async(req,res)=>{
    console.log("edit address is working");
    try{
        const userId = req.session.userId;
        const adrsId = req.query.Id;
        console.log(adrsId);
        const { name, phone, pincode, locality, city, address, state, landmark, phone2 } = req.body;
        const existingAddress = await Address.findById({_id:adrsId});
        console.log("jhsgvdfjhdgsf"+existingAddress)
    }catch(error){
        console.log(error.message)
    }
}

const logout = async (req, res)=>{
    try{   
        await req.session.destroy()
        res.redirect("/")
    }catch(error){
        console.log(error.message)
    }
}

module.exports = {
    pageNotFound,
    getLoginPage,
    getSignupPage,
    getHomePage,

    getAllProductsPage,
    getuserAccountDetails,
    saveUpdatedPassword,
   
    getuserAddAddress,
    getuserOrderDetails,
    getusereditAddress,
    editAddress,

    getOtpPage,
    getVerifyOtpPage,
    signupUser,
    pageNotFound,
    verifyOtp,
    resendOtp,
    securePassword,
    userLogin,
    allProductSort,
    addNewAddress,
    logout,


};

