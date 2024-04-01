const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const Cart = require("../models/cartSchema");
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




const getProductDetailPage = async(req,res)=>{
    try{
        const userId = req.session.userId;
        const proId = req.query.id;
        const proDetails = await Product.findById({_id:proId});
        const catDetails = await Category.findOne({_id:proDetails.category});
        const brandDetails = await Brand.findOne({_id:proDetails.brand});
        res.render("user/product-details",{proDetails, catDetails,brandDetails,userId});
    }catch(error){
        console.log(error.message);
    }
}





const geteditProduct = async (req, res) => {
    try {
        const userId = req.session.userId;
        const productId = req.params.productId;
        const catData = await Category.find({});
        const brandData = await Brand.find({});
        const product = await Product.findById(productId);
        console.log(product)
        if (!product) {
            return res.status(404).send("Product not found");
        }
        res.render("productEdit", {product,catData,brandData,userId});
    } catch (error) {
        console.error('Error retrieving product:', error);
        res.status(500).send('Internal Server Error');
    }
};



const editProduct = async(req,res)=>{
    try {
        const productId = req.params.productId;
        const existingProduct =await Product.findById(productId)
        console.log( "existingProduct"+ existingProduct);
        const { productTitle, description, regPrice, OfferPrice , stock, category, brand } = req.body;
        const images = req.files;
        console.log("imagesname ..." + images);
        const imagesofArray = images.map((x)=> x.originalname);
        const description1 = "" + description;
      
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
    const imagesofArray = req.files.map((x)=> x.originalname)
    const description1 = ""+description;
    const cat = await Category.findById({_id: category});
    const brandd = await Brand.findById({_id: brand});
    // Create a new product instance
    const newProduct = new Product({
        productName: productTitle,
        description: description1,
        regularPrice: regPrice,
        salePrice: OfferPrice,
        isBlocked: false,
        quantity: stock,
        category: cat._id,
        brand: brandd._id,
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


const productDelete = async(req,res)=>{
    const productId = req.query.productId;
    console.log("product ID "+productId);
    const deletePro = await Product.findOneAndDelete({_id : productId});
    const catData = await Category.find({});
    console.log( "delete Pro" + deletePro);
    if (!deletePro) {
        console.log(`Product "${productName}" not found.`);
        return;
      }
      const productList = await Product.find({});
      res.render("products", { product: productList, catData });
}


module.exports = {
    getAddProduct,
    addProduct,
    getProducts,
    productBlock,
    geteditProduct,
    editProduct,
    getProductDetailPage,
    productDelete,

      

    // upload,
    // addUser,


}
