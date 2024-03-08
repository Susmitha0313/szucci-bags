const express = require("express");
const User = require("../models/userSchema");
const Product = require("../models/productSchema");
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



const getVerifyOtpPage = async(req,res)=>{
    try{
            res.render("user/verify-otp");
    }catch(error){
        res.redirect("/pageNotFound");
    }
};



//load signUppage
const getSignupPage = async(req,res)=>{
    console.log("is signup calling");
    try{
        res.render("user/signup")
    }catch(error){
        res.redirect("user/pageNotFound");
    }
};




const getHomePage= async(req,res)=>{
    try{
        const proData = await Product.find({isBlocked : false})
        const isAuthenticated = req.session.email;
        console.log("auth? :",isAuthenticated);
        console.log("home page loading");
        res.render("user/home",{proData,})
    }catch(error){
        console.log(error.message);
    }
};



const getAccountInfo = async(req,res)=>{
    try{
        res.render("user/userProfile");
    }catch(error){
        console.log(error.message);
    }
}    



const getOtpPage = async(req,res)=>{
    try{
        res.render("verify-otp");
    }catch(error){
        console.log(error.message);
    }
};




const getProductDetailPage = async(req,res)=>{
    try{
        const proId = req.query.id;
        console.log(proId)
        const proDetails = await Product.findById({_id:proId})
        console.log(proDetails)
        res.render("user/product-details",{proDetails});
    }catch(error){
        console.log(error.message);
    }
}



const signupUser = async(req,res)=>{
    try{
        const email = req.body.email;
        console.log(email);
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
        const email= req.body.email;
        const password = req.body.password;
        // Find user by email
        const user = await User.findOne({email});
        console.log(user);
        // Check if user exists
        if (!user) {
            return res.render("user/login",{ message: "User not found" });
        }
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.render({ message: 'Invalid password' });
        }     

        
        req.session.email = email;
        res.redirect("/"); // Redirect to the desired page after successful login
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};



module.exports = {
    pageNotFound,
    getLoginPage,
    getProductDetailPage,
    getSignupPage,
    getHomePage,
    getAccountInfo,
    getOtpPage,
    getVerifyOtpPage,
    signupUser,
    pageNotFound,
    verifyOtp,
    resendOtp,
    securePassword,
    userLogin,

};

