const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const User = require("../models/userSchema");
const fs = require("fs");
const path = require("path");


const addProduct = async(req,res)=>{
    try{
        const products = req.body;
        console.log(products);
        const productExists = await Product.findOne({
            productName: products.productTitle
        });
        console.log(productExists,"product");
        res.render("products")
    }catch(error){
        console.log(error.message);
    }
}





module.exports = {
    addProduct,
    // addUser,


}

// productTitle
// description
// price