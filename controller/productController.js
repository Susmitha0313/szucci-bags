const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const User = require("../models/userSchema");
const fs = require("fs");
const path = require("path");
const multer  = require("multer");

const getAddProduct = async(req,res)=>{
    try{
         res.render("addProduct"); 
    }catch(error){
        res.redirect("/pageerror");
    }
};


const addNewProduct = async (req, res) => {
    
    try {
        // upload(req, res, async function (err) {
        //     if (err instanceof multer.MulterError) {
        //         console.log("Multer Error:", err);
        //         return res.json({ status: "failed", message: "Error uploading files." });
        //     } else if (err) {
        //         console.log("Error:", err);
        //         return res.json({ status: "failed", message: "Error uploading files." });
        //     }

        //     const { productName, description, regPrice, offerPrice } = req.body;

        //     // Check for product existence
        //     const productExists = await Product.findOne({ name: productName });
        //     if (productExists) {
        //         return res.json({ status: "failed", message: "Product already exists." });
        //     }

        //     // Check for empty fields or invalid input
        //     if (!productName || !description || isNaN(regPrice) || isNaN(offerPrice)) {
        //         return res.status(400).json({ status: "failed", message: "Invalid input." });
        //     }

        //     // Proceed with product creation
        //     const newProd = new Product({
        //         name: productName,
        //         description: description,
        //         regPrice: regPrice,
        //         offerPrice: offerPrice,
        //         images: req.files.map(file => file.path)
        //     });
        //     await newProd.save();
        //     return res.json({ status: "success", message: "New product added." });
        // });
const name = req.body.productTitle;
console.log(name);


    } catch (error) {
        console.log(error.message);
        
    }
}




module.exports = {
    getAddProduct,
    addNewProduct,
    // upload,
    // addUser,


}
