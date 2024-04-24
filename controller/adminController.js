const express =require("express");
const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const bcrypt = require("bcrypt");
const Order = require("../models/orderSchema");
const { session } = require("passport");


const pageNotFound = async (req, res) => {
    res.render("user/page-404")
 };


 
 const getAdminHome = async(req,res)=>{
    try{
    console.log("its loagningdg");
    const orderData = await Order.find({});
    const proData = await Product.find({});
    let overallAmount = 0;
    let overallDiscount = 0;

    orderData.forEach((elem) => {
        overallAmount += elem.totalAmount;
        if (typeof elem.discount !== 'undefined') {
            overallDiscount += elem.discount;
        }
    });
    res.render("adminHome",{orderData,proData,overallDiscount,overallAmount});
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




const adminLogin = async(req,res)=>{
    try{
        const email = req.body.emailA;
        const password = req.body.passwordA;

        const admin = await User.findOne({email , isAdmin:"1"});
        if (!admin) {
            return res.render("adminLogin",{ errmessage: "Admin not found" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.render("adminLogin",{ errmessage: 'Invalid password' });
        }
        req.session.admin = admin;
        req.session.save();
        if(req.session.redirectTo){
            res.redirect(req.session.redirectTo);
            delete req.session.redirectTo;
        } else {
             res.redirect("/admin/adminHome");
        }
    }catch(error){
        console.log(error);
        res.status(500).json({error: "Server error"});
    }
}



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



//load adminLoginPage
const getSalesPage = async (req, res) => {
    try {
        console.log("Loading data for admin home...");
        let orderData;
        const search = req.query.searchOrder || ""; 
        const page = parseInt(req.query.page) || 1; // Parse page to integer
        const limit = 5;
        const queryCondition = search.trim() !== ""? 
        { "shippingAddress.name": 
        { $regex: new RegExp(".*" + search + ".*", "i") } 
        }: {};

        orderData = await Order.find(queryCondition)
        .sort({orderDate : -1})
        .limit(limit)
        .skip((page - 1) * limit);
        const count = await Order.countDocuments(queryCondition);

        let overallAmount = 0;
        let overallDiscount = 0;

        orderData.forEach((elem) => {
            overallAmount += elem.totalAmount;
            if (typeof elem.discount !== 'undefined') {
                overallDiscount += elem.discount;
            }
        });
        res.render("salesReport", {
             overallAmount, 
             overallDiscount,
            orderData: orderData,
            currentPage: page,
            totalPages: Math.ceil(count / limit), });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.redirect("/pageerror");
    }
};





const filterOrders = async (req, res) => {
    const selectedOption = req.query.value;
    console.log("Selected Option:", selectedOption);

    try {
        let filterData;
        const orderData = await Order.find({});

        switch (selectedOption) {
            case 'All':
                filterData = orderData;
                break;
            case 'Year':
                const thisYear = new Date().getFullYear();
                console.log(thisYear);
                filterData = orderData.filter(order => {
                    const orderYear = new Date(order.createdAt).getFullYear();
                    return orderYear === thisYear;
                });
                console.log(filterData);
                break;
            case 'Month':
                const thisMonth = new Date().getMonth() + 1;
                const thisYearMonth = new Date().toISOString().slice(0, 7);
                filterData = orderData.filter(order => {
                    const orderYearMonth = new Date(order.createdAt).toISOString().slice(0, 7);
                    return orderYearMonth === thisYearMonth;
                });
                break;
            case 'Day':
                const today = new Date().toISOString().slice(0, 10);
                filterData = orderData.filter(order => {
                    const orderDate = new Date(order.createdAt).toISOString().slice(0, 10);
                    return orderDate === today;
                });
                break;
            default:
                filterData = orderData;
                break;
        }


        let overallAmount = 0;
        let overallDiscount = 0;

        filterData.forEach((elem) => {
            overallAmount += elem.totalAmount;
            if (typeof elem.discount !== 'undefined') {
                overallDiscount += elem.discount;
            }
        });
       
        res.json({ filterData, overallAmount, overallDiscount });

    } catch (error) {
        console.error("Error filtering orders:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    pageNotFound,
    getAdminHome,
    getUserList,
    getALoginpage,
    getLogout,
    getSalesPage,
    filterOrders,
   
    userBlock,

    adminLogin
    
}