const express = require("express");
const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const Address = require("../models/addressSchema.js");
const Order = require("../models/orderSchema.js");
const Cart = require("../models/cartSchema.js");
const Coupon = require("../models/couponSchema.js");
const Wishlist = require("../models/wishlistSchema.js");
const {Wallet , Transaction} = require("../models/walletSchema.js")
const otpController = require("../Config/Otp/otpController.js");
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
        const userId = req.session.userId;
        res.render("user/login",{userId});
    }catch(error){
        res.redirect("/pageNotFound");
    }
};




const getAllProductsPage= async(req,res)=>{
    try{
        const proData = await Product.find({isBlocked : false});
        const userId = req.session.userId;
        res.render("user/allProducts",{proData, userId})
    }catch(error){
        console.log(error.message);
    }
};



const getVerifyOtpPage = async(req,res)=>{
    try{
        const userId = req.session.userId;
            res.render("user/verify-otp",{userId});
    }catch(error){
        res.redirect("/pageNotFound");
    }
};



//load signUppage
const getSignupPage = async(req,res)=>{
    try{
        const userId = req.session.userId;
        res.render("user/signup",{userId})
    }catch(error){
        res.redirect("user/pageNotFound");
    }
};




const getHomePage= async(req,res)=>{
    try{
        const userId = req.session.userId;
        const proData = await Product.find({isBlocked : false});
        const couponData = await Coupon.find({isBlocked : false});
        res.render("user/home",{proData, couponData, userId})
    }catch(error){
        console.log(error.message);
    }
};



const getOtpPage = async(req,res)=>{
    try{
        const userId = req.session.userId;
        res.render("verify-otp",{userId});
    }catch(error){
        console.log(error.message);
    }
};
   





const signupUser = async(req,res)=>{
    try{
        const {name , email, phone, password} = req.body;
        const findUser = await User.findOne({email});
        const userId = req.session.userId;

            if(!findUser){
                const otp = otpController.generateOtp();
                sentMail(email, otp);
                otpController.otpExpiryTimer(req , otp);
                
                req.session.data={name,email,phone,password,otp};
                req.session.save();
                return res.render("user/verify-otp",{userId});
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
  
const resendOtp = async(req,res)=>{
    try{
        const {email, otp} = req.session.data;
        console.log("1  "+ otp);
        const newOtp = otpController.generateOtp();
        console.log("newOtp" + newOtp);
        req.session.data.otp = newOtp;
        req.session.save();
        otpController.otpExpiryTimer(req , newOtp);
        sentMail(email, newOtp);
        console.log("2  "+newOtp);
    }catch(error){
        console.error("Error in resending OTP:", error);
        return res.status(500).json({ error: error.message });// this too
    }
}




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


const saveAccDetails = async(req,res)=>{
    try{
        const {name , phone, email} = req.body;
        console.log(name, phone, email);
        const userId = req.session.userId;
        const userData = await User.findById(userId);
        console.log(userData);
        if(!userData){
            return res.status(404).json({ status: "error", message: "User not found" });
        }else {
            userData.name = name;
            userData.email = email;
            userData.phone = phone;
            await userData.save();
            res.redirect("/accountDetails");
            res.json({ status: "success", message: "data updated successfully" });
        }
    }catch(error){
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const savepswdChange = async (req, res) => {
    try {
        console.log("asdffgwerpqSAddddddddd");
        const { currentPassword, newPassword, confirmNewPassword } = req.body;
        const userId = req.session.userId;
        const userData = await User.findById(userId);
        console.log(userData);
        const passHashed = await securePassword(newPassword);
        console.log(" " + userData.password, "  " + currentPassword);
        const isPasswordValid = await bcrypt.compare(currentPassword, userData.password);
        if (!userData) {
            return res.status(404).json({ status: "error", message: "User not found" });
        } else if (!isPasswordValid) {
            return res.status(404).json({ status: "error", message: "password not matched not found" });
        } else {
            console.log("pswd match an")
            userData.password = passHashed;
            // await userData.save();
            return res.status(200).json({ status: "success", message: "Password updated successfully" });
        }
    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ error: "Internal server error" });
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




//   const resendOtp = async(req,res)=>{
//     try{
//        const email = req.session.data.email;
//        console.log(email);
//         const newOtp = otpController.generateOtp();

//         const otpData = {newOtp, expiryTime:Date.now() };
//         otpController.otpExpiryTimer(otpData);
//         console.log(newOtp);
//         await sentMail(email, newOtp);
//         req.session.data.otp = newOtp;
//         res.render("user/verify-otp")
//     }catch(error){
//         console.error("Error in resending OTP:", error);

//     }
//   }
  




const userLogin = async (req, res) => {   
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userId = req.session.userId;
        const user = await User.findOne({email});

        if (!user) {
            return res.render("user/login",{ errmessage: "User not found",userId });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.render("user/login", { errmessage: 'Invalid password' ,userId});
        }
        if(user.isBlocked == true){
            return res.render("user/login", { errmessage: 'Sorry, this user is blocked' ,userId});
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
        const userId = req.session.userId
        if(sort == "Lowtohigh"){
            const proData = await Product.find({isBlocked : false}).sort({salePrice: 1}); 
            res.render("user/allProducts",{proData , userId});
        }
        else if(sort == "Hightolow"){
            const proData = await Product.find({isBlocked : false}).sort({salePrice: -1}); 
            res.render("user/allProducts",{proData , userId});
        }
        else if(sort == "AtoZ"){
            const proData = await Product.find({isBlocked : false}).sort({productName: -1}); 
            res.render("user/allProducts",{proData , userId});
        }
        else if(sort == "ZtoA"){
            const proData = await Product.find({isBlocked : false}).sort({productName: 1}); 
            res.render("user/allProducts",{proData , userId});
        }
        else if(sort == "ZtoA"){
            const proData = await Product.find({isBlocked : false}).sort({salePrice: 1}); 
            res.render("user/allProducts",{proData , userId});
        }
        else if(sort == "Default"){
            const proData = await Product.find({isBlocked : false})
            res.render("user/allProducts",{proData , userId});
        }
       
    }catch(error){
        console.log(`error in logging all products page : ${error}`);
    }
}
  



const getuserAccountDetails = async(req, res) => {
    try {
        const userId = req.session.userId;
        const userInfo = await User.findById(userId);
        const orderInfo = await Order.findById(userId);
        // const addressInfo = await User.findById(userId);
        res.render("user/userAccountDetails", { userInfo,userId });
    } catch(error) {
        console.log(error.message);
    }
}

   
const getuserOrderDetails = async(req, res) => {
    try {
        console.log("order loading")
        const userId = req.session.userId;
        const orderInfo = await Order.find({userId : userId});
        const cartData = await Cart.findOne({userId : userId});
        res.render("user/userOrders", {orderInfo , cartData,  userId});
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
        res.render("user/userAddAddress", {addressInfo,userId});
    } catch(error) {
        console.log(error.message);
    }  
}
   


const getuserWallet = async(req, res) => {
    try {
        const userId = req.session.userId;
        console.log(userId);
        // const userInfo = await User.findById(userId);
        const orderInfo = await Order.find({userId : userId});
        console.log(orderInfo)
        const walletInfo = await Wallet.findOne({userId: userId});
        const walletId = walletInfo._id;
        console.log(walletId);
        const transInfo = await Transaction.find({walletId: walletId});
        console.log(walletInfo, transInfo);
        res.render("user/userWallet", {orderInfo,transInfo,walletInfo,userId});
    } catch(error) {
        console.log(error.message);
    }  
}



const getusereditAddress = async(req,res)=>{
    try{
        const userId = req.session.userId;
        const adressId = req.query.id;
        const address = await Address.findById({_id : adressId});
        res.render("user/usereditAddress",{address , userId})
    }catch(error){
        console.log(error.message);
    }
}


const deleteAddress = async (req, res) => {
    try {
        console.log("inside del function");
        const adrsId = req.query.id;
        console.log("Address ID:", adrsId);
        
        // Delete the address
        const adrsData = await Address.findByIdAndDelete(adrsId);
        console.log("Deleted Address:", adrsData);

        // Redirect the user to the address management page
        res.redirect("/address");
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).send("Internal server error");
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
        const adrsId = req.query.id;
        console.log(adrsId);
        const { name, phone, pincode, locality, city, address, state, landmark, phone2 } = req.body;
        const existingAddress = await Address.findById({_id:adrsId});
        console.log("jhsgvdfjhdgsf"+existingAddress)
        if(!existingAddress){
            return res.status(404).send("Address not found");
        }else{
             existingAddress.name = name;
            existingAddress.phone = phone;
            existingAddress.pincode = pincode;
            existingAddress.locality = locality;
            existingAddress.city = city;
            existingAddress.address = address;
            existingAddress.state = state;
            existingAddress.landmark = landmark;
            existingAddress.phone2 = phone2;
            await existingAddress.save();
            res.redirect("/address");
        }
        
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



const forgetPswdPage = async (req, res)=>{
    try{  
        res.render("user/forgetPassword")
    }catch(error){
        console.log(error.message)
    }
}



const getverifypage = async(req,res)=>{
    try{
        const userId = req.session.userId;
        res.render("verify-otp-pswd",{userId});
    }catch(error){
        console.log(error.message);
    }
};




const sentOtp = async (req, res)=>{
    try{  
        const userId = req.session.userId;
        const {email,password} = req.body;
        console.log(email, password);
        const findUser = await User.findOne({email : email});
        if(findUser){
            let otp = otpController.generateOtp();
            sentMail(email, otp);
            const otpData = {otp, expiryTime:Date.now()};
            otpController.otpExpiryTimer(otpData);
            const data ={
                email,
                password,
                otp
            };
            req.session.forgotData = data;
            await req.session.save();
        }else {
            return res.status(404).json({ error: "User not found" });
        }
        res.render("user/verify-otp-pswd",{email, userId});
    }catch(error){
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}






const resendOtpPswd = async(req,res)=>{
    try{
       const email = req.session.email;
       console.log(email);
        const newOtp = otpController.generateOtp();
        await sentMail(email, newOtp);
        req.session.data.otp = newOtp;
        res.render("user/verify-otp")
    }catch(error){
        console.log("Error in resending OTP ");
    }
  }
  



const verifyForgPswdOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const { forgotData } = req.session;
        console.log(otp , forgotData.otp)
        if (otp ===  forgotData.otp) {
            const {email, password} = forgotData;
            const passHashed = await securePassword(password);
            const user = await User.findOneAndUpdate({ email }, { password: passHashed }, { new: true });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            req.session.user = user._id;
            console.log("Password changed successfully");
            res.json({status:"success"});
        } else {
            return res.status(400).json({ error: "OTP verification failed" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};


const getWishlist = async(req,res)=>{
    try{
        const userId = req.session.userId;
        const wishData = await Wishlist.find({userId : userId}).populate("products.productId");
        console.log(wishData);
        res.render("user/wishlist",{userId, wishData});
    }catch(error){
        console.log(error.message);  
    }
}


    
const addToWishlist = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { productId } = req.body;

        const proData = await Product.findById(productId);
        if (!proData) {
            return res.json({ status: "error", message: "Product not found" });
        }

        let wishData = await Wishlist.findOne({ userId: userId });
        if (!wishData) {
            const newWish = new Wishlist({
                userId: userId,
                products: [{ productId: productId }],
            });
            wishData = await newWish.save();
            return res.json({ status: "success", message: "Product added to wishlist successfully", wishData });
        }

        const proInWish = wishData.products.find(item => item.productId.toString() === productId);
        if (proInWish) {
            return res.json({ status: "alreadyAdded", message: "Product is already in the wishlist" });
        }

        wishData.products.push({ productId: productId });
        await wishData.save();
        res.json({ status: "success", message: "Product added to wishlist successfully", wishData });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
};


module.exports = {
    pageNotFound,
    getLoginPage,
    getSignupPage,
    getHomePage,

    getAllProductsPage,
    getuserAccountDetails,
    saveAccDetails,
    savepswdChange,

   
    getuserAddAddress,
    getuserOrderDetails,
    getuserWallet,
    getusereditAddress,
    editAddress,
    deleteAddress,


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
    forgetPswdPage,
    getverifypage,
    sentOtp,
    resendOtpPswd,
    verifyForgPswdOtp,
    
    getWishlist,
    addToWishlist,



};

