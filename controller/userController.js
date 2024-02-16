const express = require("express");
const User = require("../models/userSchema");
const nodemailer = require("nodemailer");
const env = require("dotenv");
const { v4: uuidv4 } = require("uuid");
env.config();


const pageNotFound = async(req,res)=>{
    try{
        res.render("page-404");
    }catch(error){
        console.log(error.message);
    }
};



//load loginpage
const getLoginPage = async(req,res)=>{
    console.log("is login calling");
    try{
        if(!req.session.user){
            console.log("is login rendering");
            res.render("login");
        }else{
            res.redirect("/");
        }
    }catch(error){
        console.log(error.message);
    }
};



//load signUppage
const getSignupPage = async(req,res)=>{
    console.log("is signup calling");
    try{
        if(!req.session.user){
            console.log("is login rendering");
            res.render("signup");
        }else{
            res.redirect("/");
        }
    }catch(error){
        console.log(error.message);
    }
};



//
const userLogin = async(req,res)=>{
    try{
         const {email,password} = req.body;
         const findUser = await User.fineOne({ isAdmin: "0", email: email});

         console.log("working");
         
         if(findUser){
            const isUserNotBloked = findUser.isBlocked === false;
            
            if(isUserNotBloked){
                const passwordMatch = await bcrypt.compare(password, findUser.password);
                if(passwordMatch){
                    req.session.user = findUser._id;
                    console.log("Logged in");
                    res.redirect("/")
                }
                else{
                    console.log("Password is not matching");
                }
            }else{
                console.log("User is blocked by admin");
                res.render("login",{message:"User is blocked by admin"});
            }
         }else{
            console.log("User is not found");
            res.render("login", {message:"User is not found"});
         }
    }catch(error){
        console.log(error.message);
        res.render("login",{message:"Login failed"});
    }
};


const getSignupUser = async(req,res)=>{
    try{
        if(!req.session.user){
            res.render("signup");
        }else{
            res.redirect("/");
        }
    }catch(error){
        console.log(error.message);
    }
};



const signupUser = async(req,res)=>{
    try{
        console.log(req.body);
        const {email} = req.body;

        const findUser = await User.fineOne({email});
        if (req.body.password === req.body.cPassword) {
        if(!findUser){
            var otp = generateOtp();
            const transporter = nodemailer.createTransport({
                service:"gmail",
                port: 587,
                secure:false,
                requireTLS: true,
                auth: {
                    user: process.env.NODEMAILER_EMAIL,
                    pass: process.env.NODEMAILER_PASSWORD
                },
            });

            const info = await transporter.sendMail({
                from: process.env.NODEMAILER_EMAIL,
                to:email,
                subject:"Verify your account",
                text:`Your OTP(One Time Password) is ${otp}`,
                html: `<b>  <h4> Your OTP is ${otp}</h4> <br> <a href=" "> Click here</a></b>`
            });
            console.log(otp, "otp");
            if(info){
                req.session.userOtp
                req.session.userData = req.body;
                res.render("verify-otp");
                console.log("Email sent", info.messageId);
            }else{
                res.json("email-error");
            }
        } else {
            console.log("User already exist");
            res.render("signup", {
                message:"User with this mail already exists"
            });
        }
    }else{
        console.log("password is not masthing");
        res.render("signup",{message:"The password isn ot matching"});
    }
    }catch(error){
        console.log(error.message);
    }
};
function generateOtp(){
    const digits = "1234567890";
    var otp = "";
    for(let i = 0; i<4; i++){
        otp += digits[Math.floor(Math.random()* 10)];
    }
    return otp;
}


//render the OTP verification 
const getOtpPage = async(req,res)=>{
    try{
        res.render("verify-otp");
    }catch(error){
        console.log(error.message);
    }
};

//verify otp from email with generated otp and save the user data to DB
const verifyOtp = async(req,res)=>{
    try{
         //get otp from body
         const { otp } = req.body  //extracting otp using destructuring method
         if(otp === req.session.userOtp){
            const user = req.session.userData
            const passwordHash = await securePassword(user.password);
            const referalCode = uuidv4()   
            console.log("The referral code is "+ referalCode);
            
            const saveUserData = new User({
              name: user.name,
              email: user.email,
              phone: user.phone,
              password: passwordHash,
              referalCode : referalCode
            })
            await saveUserData.save()

            req.session.user = saveUserData._id
            res.redirect("/login")
        }else{
            console.log("otp is not matching");
            res.json({status: false})
        }
    }catch(error){
        console.log(error.message);
    }
}



//generate Hashed Password
const securePassword = async(password)=>{
    try{
        const passwordHash = await bcypt.hash(password, 10);
        return passwordHash;
    }catch(error){
        console.log(error.message);
    }
};



// //Loading the Home page
// const getHomePage = async (req, res) => {
//     try {
//       const user = req.session.user;
//       const userData = await User.findOne({ _id: user });
//       console.log(userData, "userdata");
//       const brandData = await Brand.find({ isBlocked: false });
//       const productData = await Product.find({ isBlocked: false })
//         .sort({ id: -1 })
//         .limit(4);
  
//       if (user) {
//         res.render("home", {
//           user: userData,
//           data: brandData,
//           products: productData,
//         });
//       } else {
//         res.render("home", { data: brandData, products: productData });
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };


const getHomePage = async(req,res)=>{
    try{
        res.render("home")
    }catch(error){
        console.log(error);
    }
}


const getWishlist = async(req,res)=>{
    try{
        res.render("wishlist")
    }catch(error){
        console.log(error);
    }
}

  


module.exports = {
    pageNotFound,
    getLoginPage,
    getSignupPage,
    userLogin,
    getSignupUser,
    signupUser,
    verifyOtp,
    getOtpPage,
    getHomePage,
    getWishlist
};


