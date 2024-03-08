const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const User = require("../models/userSchema");
const fs = require("fs");
const path = require("path");
const multer  = require("multer");

const getAddProduct = async(req,res)=>{
    try{
        const catData = await Category.find({});
        const brandData = await Brand.find({});
         res.render("productAdd",{catData,brandData}); 
    }catch(error){
        res.redirect("/pageerror");
    }
};




const geteditProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const catData = await Category.find({});
        const brandData = await Brand.find({});
        const product = await Product.findById(productId);
        console.log(product)
        if (!product) {
            return res.status(404).send("Product not found");
        }
        res.render("productEdit", {product,catData, brandData});
    } catch (error) {
        console.error('Error retrieving product:', error);
        res.status(500).send('Internal Server Error');
    }
};



const editProduct = async(req,res)=>{
    try {
        const productId = req.params.productId;
        // Extract data from the request body
        const { productTitle, description, regPrice, OfferPrice , stock, category, brand } = req.body;
        const images = req.files;   //  Assuming you're using multer or similar middleware for file uploads
        const imagesofArray = images.map((x)=> x.originalname);
        const description1 = "" + description;
        
       const existingProduct = await Product.findById(productId);
       if(!existingProduct){
        return res.status(404).json({ status: 'error', message: 'Product not found' });
       }
       existingProduct.productName = productTitle;
       existingProduct.description = description1;
       existingProduct.regularPrice = regPrice;
       existingProduct.salePrice = OfferPrice;
       existingProduct.quantity = stock;
       existingProduct.category = category;
       existingProduct.brand = brand;
       existingProduct.productImage = imagesofArray;
   
       // Save the updated product to the database
       await existingProduct.save();
        res.redirect("/admin/products");
    } catch (error) {
        // Handle any errors that occur during product creation or saving
        console.error(`Error in addProduct: ${error.message}`);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
};


const getProducts = async(req,res)=>{
    try{
        const product = await Product.find({});
        const catData = await Category.find({});
        const brandData = await Brand.find({});
        res.render("products",{product , catData, brandData});
    }catch(error){
        res.redirect("/pageerror");
    }
};




const addProduct = async (req, res) => {
    console.log("add product working");
  try {
    // Extract data from the request body
    const { productTitle, description, regPrice, OfferPrice , stock, category, brand } = req.body;
    const images = req.files; // Assuming you're using multer or similar middleware for file uploads
    // const imagesofArray = images.map(image => ({ url: image.path }))
    const imagesofArray = req.files.map((x)=> x.originalname)
    const description1 = ""+description;
    // Create a new product instance
    const newProduct = new Product({
        productName: productTitle,
        description: description1,
        regularPrice: regPrice,
        salePrice: OfferPrice,
        quantity: stock,
        category: category,
        brand: brand,
        productImage: imagesofArray // Assuming images are stored as URLs in the database
    });
    // Save the new product to the database
    await newProduct.save();
    console.log(newProduct)
    res.redirect("/admin/products");
} catch (error) {
    // Handle any errors that occur during product creation or saving
    console.error(`Error in addProduct: ${error.message}`);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};




const productBlock = async(req, res) => {
    try {
        const prodName = req.query.productName;
        const product = await Product.findOne({ productName: prodName });

        if (product.isBlocked === true) {
            await Product.findOneAndUpdate({ productName: prodName }, { $set: { isBlocked: false } });
        } else {
            await Product.findOneAndUpdate({ productName: prodName }, { $set: { isBlocked: true } });
        }

        const products = await Product.find({});
        res.render("products", { product: products });
    } catch (error) {
        console.error("/pageerror", error);
    }
}




module.exports = {
    getAddProduct,
    addProduct,
    getProducts,
    productBlock,
    geteditProduct,
    editProduct,
      

    // upload,
    // addUser,


}
