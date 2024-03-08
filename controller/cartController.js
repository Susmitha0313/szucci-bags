const Category = require("../models/categorySchema");
const Product = require("../models/productSchema");

const getCartPage = async(req,res)=>{
    try{
        res.render("user/cart");
    }catch(error){
        console.error("/pageerror", error); 
    }
}

  
const getCheckoutPage = async(req,res)=>{
    try{
        res.render("user/checkoutCart");
    }catch(error){
        console.error("/pageerror", error); 
    }
}




module.exports = {
    getCartPage,
    getCheckoutPage

}