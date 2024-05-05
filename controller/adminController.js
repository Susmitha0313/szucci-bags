const express =require("express");
const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const bcrypt = require("bcrypt");
const Order = require("../models/orderSchema");
const Category = require("../models/categorySchema");
const ProductOffer = require("../models/offerSchemaProd");
const CategoryOffer = require("../models/offerSchemaCateg");
const Brand = require("../models/brandSchema");
const { session } = require("passport");


const pageNotFound = async (req, res) => {
    res.render("page-404")
 };


 
 const getAdminHome = async(req,res)=>{
    try{
    console.log("its loagningdg");
    const orderData = await Order.find({status :"Delivered" });
    const proData = await Product.find({});
    const userData = await User.find({});
    let overallAmount = 0;
    let overallDiscount = 0;

    orderData.forEach((elem) => {
        overallAmount += elem.totalAmount;
        if (typeof elem.discount !== 'undefined') {
            overallDiscount += elem.discount;
        }
    });

      // line chart user line
      const UserdayArray = [0,0,0,0,0,0,0];
      for (let i = 0; i < userData.length; i++) {
          let createddate = new Date(userData[i].createdOn);
          createddate = createddate.getDay(); // [sun monday , tue]
          UserdayArray[createddate] += 1;
      };
      // line chart order counting each day
      const orderdayArray = [0,0,0,0,0,0,0];
      for (let i = 0; i < orderData.length; i++) {
          let dateOfOrder = new Date(orderData[i].createdAt);
          dateOfOrder = dateOfOrder.getDay();
          orderdayArray[dateOfOrder] += 1
      };
      // Bar chart weekly revenew
      const revenewDayaArray = [0,0,0,0,0,0,0,0,0,0,0,0];  
      for (let i = 0; i < orderData.length; i++) {
          if(orderData[i].orderType === "COD"){
              if(orderData[i].status === "Delivered"){
                  let monthOfOrder = new Date(orderData[i].createdAt);
                  monthOfOrder = monthOfOrder.getMonth();
                  revenewDayaArray[monthOfOrder] += orderData[i].totalAmount;
              }
          }
          if(orderData[i].orderType === "RazorPay"){
              if(orderData[i].status === "Delivered" || orderData[i].status === "Shipped" || orderData[i].status === "Processing" || orderData[i].status === "Confirmed" || orderData[i].status === "Delivered"){
                  let monthOfOrder = new Date(orderData[i].createdAt);
                  monthOfOrder = monthOfOrder.getMonth();
                  revenewDayaArray[monthOfOrder] += orderData[i].totalAmount;
              }
          }
      }

    res.render("adminHome",{orderData,proData,userData,overallDiscount,overallAmount,UserdayArray,revenewDayaArray,orderdayArray});
    }catch(error){
        res.redirect("/pageerror");
    }  
    }

  
    
    const catChart = async (req, res) => {
        try {
            const category = await Category.find({});
            const catNames = category.map(cat => cat.name);
            const allOrders = await Order.aggregate([
                { $unwind: "$product" },
                { $group: { _id: "$product.category", cartQty: { $sum: { $toInt: "$product.cartQty" } } } }
            ]);
            const cartQtyArray = catNames.map(catName => {
                const order = allOrders.find(order => order._id === catName);
                return order ? order.cartQty : 0;
            });
            chartColores = color(category.length);
            res.json({status : "true" , catNames : catNames , chartColores: chartColores , cartQtyArray : cartQtyArray})
        } catch (error) {
            console.log(error);
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


const getSalesPage = async (req, res) => {
    try {
        console.log("Loading data for admin home...");
        const search = req.query.searchOrder || ""; 
        const page = parseInt(req.query.page) || 1; // Parse page to integer
        const limit = 8;
        const queryCondition = {
            status: "Delivered",
            "shippingAddress.name": { $regex: new RegExp(".*" + search + ".*", "i") }
        };

        const orderData = await Order.find(queryCondition)
            .sort({ orderDate: -1 })
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
            totalPages: Math.ceil(count / limit),
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.redirect("/pageerror");
    }
};

       

const getProdOfferPage = async(req,res)=>{
    try{
        console.log("prod offer page");
        const proData = await Product.find({isBlocked : false});
        const offerData = await ProductOffer.find({isBlocked : false});
        res.render("offerProduct",{proData,offerData});
    }catch(error){
        console.log(error)
    }
}
    
const getCategOfferPage = async(req,res)=>{
    try{
        console.log("cat offer apge")
        const catData = await Category.find({isBlocked : false});
        const offerData = await CategoryOffer.find({isBlocked : false});
        res.render("offerCategory",{catData,offerData});
    }catch(error){
        console.log(error)
    }
}
    


const prodOfferSave = async(req,res)=>{
    try{
        const {offerName,discountPercent,endDate,product} = req.body
        const productsArr = Array.isArray(product) ? product : [product];
        const proData = await Product.find({isBlocked : false});
        const offerData = await ProductOffer.find({isBlocked : false});
        console.log(offerName,productsArr);
        const nameExists = await ProductOffer.findOne({offerName : offerName});
        if(!nameExists){
            const newOffer = new ProductOffer({
                offerName : offerName,
                discountPercentage : discountPercent,
                endDate : endDate,
                products : productsArr,
            });
            await newOffer.save();
            res.redirect("prodOfferPage");
        }else {
            return res.render("offerProduct",{errMsg: "Offer with this name already exists", proData, offerData});
        }
    }catch(error){
        console.log(error);
        res.status(500).send("Error saving offer.");
    }   
}


const categOfferSave = async(req,res)=>{
    try{
        const {offerName,discountPercent,endDate,category} = req.body
        const categoriesArr = Array.isArray(category) ? category : [category];
        const catData = await Category.find({isBlocked : false});
        const offerData = await CategoryOffer.find({isBlocked : false});
        const nameExists = await CategoryOffer.findOne({offerName : offerName});
        if(!nameExists){
            console.log("yes you can save this one ")
            const newOffer = new CategoryOffer({
                offerName : offerName,
                discountPercentage : discountPercent,
                endDate : endDate,
                categories : categoriesArr,
            });
            await newOffer.save();
            res.redirect("catOfferPage");
        }else {
            return res.render("offerCategory",{errMsg:  "Offer with this name already exists", catData,offerData}); 
        }
    }catch(error){
        console.log(error);
        res.status(500).send("Error saving offer.");
    }   
}



// const getOfferEdit = async (req, res) => {
//     try {
//         const offerId = req.params.id;
//         const offerData = await Offer.findById(offerId).populate('products').populate('categories');
//         const allCategories = await Category.find({isBlocked : false});
//         const allProducts = await Product.find({isBlocked : false});
        
//         if (!offerData) {
//             return res.status(404).send("Offer not found");
//         }
//         res.render("offerEdit", { offerData ,allProducts,allCategories, proData: offerData.products, catData: offerData.categories}); // Pass offerData to the template
//     } catch (error) {
//         console.log(error);
//     }
// }


// const saveEditOffer = async(req,res)=>{
//     try{
//         console.log("offer edit save pge");
//         const offerId = req.params.id;
//         const offerData =await Offer.findById(offerId);
//         console.log(offerData);
//         if(!offerData){
//         return res.status(404).send("Offer not found");
//         }
//         res.render("offerEdit",{offerData});
//     }catch(error){
//         console.log(error);
//     }
// }


// const applyOffer = async(req,res)=>{
//     try{   
//         const { offerId } = req.params;

//         // Find the offer in the database
//         const offer = await Offer.findById(offerId);
//         if (!offer) {
//             return res.status(404).json({ error: 'Offer not found' });
//         }

//         // Apply offer to products
//         if (offer.products && offer.products.length > 0) {
//             await Promise.all(offer.products.map(async (productId) => {
//                 const product = await Product.findById(productId);
//                 if (product) {
//                     // Update product sale price based on offer discount
//                     product.salePrice -= (product.salePrice * (offer.discountPercentage / 100));
//                     await product.save();
//                 }
//             }));
//         }

//         // Apply offer to categories
//         if (offer.categories && offer.categories.length > 0) {
//             await Promise.all(offer.categories.map(async (categoryId) => {
//                 const category = await Category.findById(categoryId);
//                 if (category) {
//                     // Update products in this category sale price based on offer discount
//                     await Product.updateMany({ category: categoryId }, { $mul: { salePrice: (1 - (offer.discountPercentage / 100)) } });
//                 }
//             }));
//         }

//         res.status(200).json({ message: 'Offer applied successfully' });
//     }catch(error){
//         console.log(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }



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
    getProdOfferPage,
    getCategOfferPage,
    categOfferSave,
    prodOfferSave,
    // getOfferEdit,
    // saveEditOffer,

    catChart,
    getUserList,
    getALoginpage,
    getLogout,
    getSalesPage,
    filterOrders,    
   
    userBlock,

    adminLogin
    
}