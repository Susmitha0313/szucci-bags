const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const User = require("../models/userSchema");
const Cart = require("../models/cartSchema");
const objectId = require("mongoose").Types.ObjectId


const getCartPage = async (req, res) => {
    try {
        const userId = req.session.userId;
        console.log(req.session.userId);
        const cartData = await Cart.findOne({ userId: userId});
        console.log("1  "+cartData)
        const prodData = [];

        if (cartData) {
            console.log("2")
            const arr = cartData.items.map(item => item.productId);
            console.log(arr+"  Dfgsdf")
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

 
const addToCart = async (req, res) => {
    console.log("add to cart is running")
    const { prodQuantity, productId } = req.body;
    try {
        const userId = req.session.userId;
        console.log("user Id " + userId);
        const proData = await Product.findById(productId);
        console.log("proData " + proData);
        if (!proData) {
            return res.json({ status: "error", message: "Product not found" });
        } else {
            let cart = await Cart.findOne({ userId: userId });
            if (!cart) {
                console.log("cart illaa...new cart adding ");
                const cartData = new Cart({
                    userId: userId,
                    items: [{
                        productId: proData._id,
                        quantity: prodQuantity,
                        subTotal: prodQuantity * proData.salePrice
                    }],
                    totalPrice: proData.salePrice
                });
                cart = await cartData.save();
            } else {
                console.log("else condition cart indengil...")
                let proIndex = -1;
                for (let i = 0; i < cart.items.length; i++) {
                    if (proData._id.toString() == cart.items[i].productId) {
                        proIndex = i;
                        break;
                    }    
                }
                if (proIndex !== -1) {
                    console.log("Product already exists in the cart");
                    const updatedQuantity = cart.items[proIndex].quantity + prodQuantity;
                    cart.items[proIndex].quantity = updatedQuantity;
                    cart.items[proIndex].subTotal = updatedQuantity * proData.salePrice;
                   
                    cart = await Cart.findOne({ userId: userId }); 
                    await cart.save();
                    res.json({ status: "alreadyInCart", message: "Product already added to cart" });
                }else{     
                    console.log("Product not found in the cart, adding it...");
                   
                    cart.items.push({
                        productId: proData._id,
                        quantity: prodQuantity,
                        subTotal: prodQuantity * proData.salePrice
                    });
                }
                cart.totalPrice = cart.items.reduce((total, item) => total + item.subTotal, 0);
                await cart.save();
                console.log("Cart saved: ", cart);
                res.json({ status: "success", message: "Product added to cart successfully", cart });
            }
        }
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};




const addCart = async(req ,res)=>{
    try{
        const { price, proId, index, subtotal, qty } = req.body;
        const quantity = parseInt(qty);
        const prodId = proId.toString();
        const proData = await Product.findById({_id:prodId });
        const stock = proData.quantity;
        if(stock > quantity){
            if(quantity < 10){
                const addPrice = await Cart.findOneAndUpdate(
                    { userId : req.session.userId, "items.productId": prodId },
                    {$inc : {
                        "items.$.price" : price,
                        "items.$.quantity" : 1,
                        "items.$.subtotal" : price,
                        total: price,
                    }}
                );

                const findCart = await Cart.findOne({ userId: req.session.userId});
                res.json({status : true, total: findCart.total });
            }else{
                res.json({ status: "minimum"});
            }
        }else{
            console.log("out of stock......");
            res.json({status: "stock"})
        }
    }catch(error){
        console.log(error.message);
    }
}




const decrement = async(req ,res)=>{
    try{
        const { price, proId, index, subtotal, qty } = req.body;
        const quantity = parseInt(qty);
        const prodId = proId.toString();
        const proData = await Product.findById({_id:prodId });
        const stock = proData.quantity;
        if(stock > quantity){
            if(quantity < 10){
                const addPrice = await Cart.findOneAndUpdate(
                    { userId : req.session.userId, "items.productId": prodId },
                    {$inc : {
                        "items.$.price" : -price,
                        "items.$.quantity" : -1,
                        "items.$.subtotal" : -price,
                        total: -price,
                    }}
                );

                const findCart = await Cart.findOne({ userId: req.session.userId});
                res.json({status : true, total: findCart.total });
            }else{
                res.json({ status: "minimum"});
            }
        }else{
            console.log("out of stock......");
            res.json({status: "stock"})
        }
    }catch(error){
        console.log(error.message);
    }
}



const deleteCartItem = async (req, res) => {
    const userId = req.session.userId;
    const { id } = req.query;
    try {
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        const deleteOne = await Cart.findOneAndUpdate(
            { userId: userId },
            {
                $pull: {
                    items: { productId: id },
                }
            }
        );
        cart.totalPrice = cart.items.reduce((total, item) => total + item.subTotal, 0);
        await cart.save();
        if (deleteOne) {
            res.json({ status: true });
        } else {
            res.json({ status: false });
        }
    } catch (error) {
        console.error('Error deleting item from cart:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};


const CartTotalPrice = async(req,res)=>{
    const userId = req.session.userId;
    try {
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.json({ status: false });
        }
        return res.json({ status: true, totalPrice: cart.totalPrice });
    } catch (error) {
        console.error('Error fetching total price of cart:', error);
        res.json({ status: false });
    }
}



module.exports = {
    getCartPage,
    addToCart,
    addCart,
    decrement,
    deleteCartItem,
    CartTotalPrice,

    
}    