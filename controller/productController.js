const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const Cart = require("../models/cartSchema");
const User = require("../models/userSchema");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const sharp = require('sharp');
const Cropper = require('cropper');


const getAddProduct = async (req, res) => {
    try {
        const catData = await Category.find({});
        const brandData = await Brand.find({});
        res.render("productAdd", { catData, brandData });
    } catch (error) {
        res.redirect("/admin/page-404");
    }
};




const getProductDetailPage = async (req, res) => {
    try {
        const userId = req.session.userId;
        const proId = req.query.id;
        const proDetails = await Product.findById({ _id: proId }).populate("category").populate("brand");
        const catDetails = await Category.findOne({ _id: proDetails.category });
        const brandDetails = await Brand.findOne({ _id: proDetails.brand });
        res.render("user/product-details", { proDetails, catDetails, brandDetails, userId });
    } catch (error) {
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
        if (!product) {
            return res.status(404).send("Product not found");
        }
        res.render("productEdit", { product, catData, brandData, userId });
    } catch (error) {
        console.error('Error retrieving product:', error);
        res.status(500).send('Internal Server Error');
    }
};





const editProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const existingProduct = await Product.findById(productId);
        console.log("existingProduct" + existingProduct);
        if (!existingProduct) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }
        const { productTitle, description, regPrice, OfferPrice, stock, category, brand } = req.body;
        const images = req.files;
        console.log("imagesname ..." + images);
        const description1 = "" + description;
        const cat = await Category.findById(category);
        const brandd = await Brand.findById(brand);
        existingProduct.productName = productTitle;
        existingProduct.description = description1;
        existingProduct.regularPrice = regPrice;
        existingProduct.salePrice = OfferPrice;
        existingProduct.quantity = stock;
        existingProduct.category = cat._id;
        existingProduct.brand = brandd._id;

        // Image processing
        const imagesofArray = images.map((file) => file.path);
        const cropImg = [];

        for (const imgPath of imagesofArray) {
            try {
                const outputPath = `assets/adminAssets/imgUploads/cropped_${Date.now()}.jpeg`;
                await sharp(imgPath)
                    .resize(1000, 1000)
                    .toFile(outputPath);
                const filename = path.basename(outputPath);
                cropImg.push(filename);
            } catch (error) {
                console.error(`Error processing image: ${error.message}`);
                // Handle image processing errors as needed
            }
        }
        existingProduct.productImage = cropImg;

        await existingProduct.save();
        res.redirect("/admin/products");
    } catch (error) {
        console.error(`Error in editProduct: ${error.message}`);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};



const getProducts = async (req, res) => {
    try {
        const product = await Product.find({});
        const catData = await Category.find({});
        const brandData = await Brand.find({});
        res.render("products", { product, catData, brandData });
    } catch (error) {
        res.redirect("/admin/page-404");
    }
};


const getProInfoPage = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        const catId = product.category;
        const brandId = product.brand;
        const catData = await Category.findById(catId);
        const brandData = await Brand.findById(brandId);
        console.log(catData);
        res.render("proDetail", { product, catData, brandData });
    } catch (error) {
        res.redirect("/admin/page-404");
    }
};


const addProduct = async (req, res) => {
    console.log("add product working");
    try {
        const { productTitle, description, regPrice, OfferPrice, stock, category, brand } = req.body;
        const imagesofArray = req.files.map((file) => file.path);
        console.log(imagesofArray);
        const cropImg = [];

        for (const imgPath of imagesofArray) {
            try {
                const outputPath = `assets/adminAssets/imgUploads/cropped_${Date.now()}.jpeg`;
                await sharp(imgPath)
                    .resize(1000, 1000)
                    .toFile(outputPath);
                const filename = path.basename(outputPath);
                cropImg.push(filename);
            } catch (error) {
                console.error(`Error processing image: ${error.message}`);
                // Handle image processing errors as needed
            }
        }   
        console.log(cropImg);
        const description1 = "" + description;
        const cat = await Category.findById(category);
        const brandd = await Brand.findById(brand);

        const existingProduct = await Product.findOne({ productName: productTitle });
        if (existingProduct) {
            return res.status(400).json({ status: "error", message: "Product already exists" });
        }
        const newProduct = new Product({
            productName: productTitle,
            description: description1,
            regularPrice: regPrice,
            salePrice: OfferPrice,
            isBlocked: false,
            quantity: stock,
            category: cat._id,
            brand: brandd._id,
            productImage: cropImg,
        });
        console.log(newProduct);
        await newProduct.save();
        res.redirect("/admin/products");
    } catch (error) {
        console.error(`Error in addProduct: ${error.message}`);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}; 



const productBlock = async (req, res) => {
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
        console.error("/admin/page-404", error);
    }
}


const productDelete = async (req, res) => {
    const productId = req.query.productId;
    console.log("product ID " + productId);
    const deletePro = await Product.findOneAndDelete({ _id: productId });
    const catData = await Category.find({});
    console.log("delete Pro" + deletePro);
    if (!deletePro) {
        console.log(`Product not found.`);
        return;
    }
    const productList = await Product.find({});
    res.render("products", { product: productList, catData });
}


const deleteOne = async (req, res) => {
    console.log("aaaaaaaaaaaaaa")
    try {
        console.log("ggggg")
        const { prodId, index } = req.body;
        console.log(index, prodId);
        const product = await Product.findById({ _id: prodId });
        const deleteImg = product.productImage[index];
        console.log(deleteImg)
        fs.unlink(deleteImg, (err) => {
            if (err) {
                console.log(err.messag);
            } else {
                console.log('set');
            }
        })
        product.productImage.splice(index, 1)
        await product.save();
        return res.json({ status: true, product });
    } catch (error) {
        console.error("/admin/page-404", error);
    }
}

module.exports = {
    getAddProduct,
    getProInfoPage,
    addProduct,
    getProducts,
    productBlock,
    geteditProduct,
    editProduct,
    getProductDetailPage,
    productDelete,
    deleteOne,




    // upload,
    // addUser,


}
