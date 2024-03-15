const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const User = require("../models/userSchema");
const Cart = require("../models/cartSchema");


const getCartPage = async (req, res) => {
    try {
        const userId = req.session.userId;
        console.log(req.session.userId);

        const cartData = await Cart.findOne({ userId: userId});
console.log("1  "+cartData)
        const prodData = [];

        if (cartData) {
            console.log("2")
            const arr = cartData.items.map(item => item.productId.toString());
            for (const productId of arr) {
                prodData.push(await Product.findById(productId));
            }
        }
        console.log(prodData)
        console.log("3  "+cartData)

        res.render("user/cart", { prodData, cartData }); // Pass itemId to the template
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};

  
const getCheckoutPage = async(req,res)=>{
    try{
        res.render("user/checkoutCart");
    }catch(error){
        console.error("/pageerror", error); 
    }
}

const addToCart = async (req, res) => {
    try {
        console.log("Add to cart running");
        const { prodQuantity, productId } = req.body;
        console.log(prodQuantity, productId);

        // Find the product
        const proData = await Product.findById(productId);
        console.log("1" + "prodata = " + proData);

        // Check if product exists
        if (!proData) {
            console.log("2")
            return res.json({ status: "error", message: "Product not found" });
        }

        // Check if product quantity is sufficient
        if (proData.quantity < prodQuantity) {
            console.log("3")
            return res.json({ status: "error", message: "Quantity exceeds stock" });
        }
        console.log("4")
        // Find the user's cart
        let cart = await Cart.findOne({ userId: req.session.userId });
        console.log("5"+cart)

        // If cart doesn't exist, create a new one
        if (!cart) {
            console.log("6")
            cart = new Cart({
                userId: req.session.userId,
                items: [],
                totalPrice: 0
            });
        }
        console.log("7")
        // Check if the product is already in the cart
        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        console.log(proData.salePrice)
        if (existingItemIndex !== -1) {
            console.log("8")
            // Update quantity and subTotal of existing item
            cart.items[existingItemIndex].quantity += prodQuantity;
            cart.items[existingItemIndex].subTotal += prodQuantity * proData.salePrice;
        } else {
            console.log("9")
            // Add new item to cart
            cart.items.push({
                productId: productId,
                quantity: prodQuantity,
                subTotal: prodQuantity * proData.salePrice,
                image: proData.productImage // Assuming productImage is an array of image URLs
            });
        }

        // Calculate total price of the cart
        cart.salePrice = cart.items.reduce((total, item) => total + item.subTotal, 0);
        console.log("10")
        // Save the updated cart
        await cart.save();
console.log("cart is "+cart)
        res.json({ status: "success", total: cart.totalPrice });
    } catch (error) {
        console.log(`error in add cart real ${error}`);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};


module.exports = {
    getCartPage,
    getCheckoutPage,
    addToCart,

}