const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const Product = require("../models/productSchema");
const Address = require("../models/addressSchema");
const User = require("../models/userSchema");
const Cart = require("../models/cartSchema");
const Order = require("../models/orderSchema");
const mongoose = require('mongoose');

  

// const { price, proId, index, subtotal, qty } = req.body;
// const quantity = parseInt(qty);
// const prodId = proId.toString();   
// const proData = await Product.findById({_id:prodId });


const getCheckoutPage = async(req,res)=>{
    try{
        const userId = req.session.userId;
        const addressInfo = await Address.find({userId : userId});
        const cartInfo = await Cart.find({userId : userId});
        console.log("dhdfh "+cartInfo);
        if(!cartInfo){
            console.log("cart not found for the user");
            res.status(404).send("Cart not founded for the user")
        }
         const cartDetails = await Cart.aggregate([
                {$match : {userId : new mongoose.Types.ObjectId(userId)}},
                {$unwind : "$items"},
                {
                    $lookup : {
                        from : "products",
                        localField : "items.productId",
                        foreignField : "_id",
                        as : "product"
                    }
                },
                {$unwind : "$product"},
                {
                    $group : {
                        _id : "$_id",
                        items : {
                            $push : {
                                productName : "$product.productName",
                                quantity : "$items.quantity",
                                totalPrice : "$items.subTotal",
                            }
                        },
                        totalCost : {$sum : "$items.totalPrice"}
                    }
                }
               
            ])
        res.render("user/checkoutCart", {addressInfo, cartDetails, cartInfo});
    }catch(error){
        console.error("/pageerror", error);    
    }
}





const getSfulPage = async(req,res)=>{
    try{
        res.render("user/orderPlaced");
    }catch(error){
        console.error("/pageerror", error);    
    }
}



const placeOrder = async(req,res)=>{
    try{
        console.log("yeah place order is working");
       const {selectedAddress,paymentMethod,cartId,total} =req.body;
       console.log(selectedAddress, paymentMethod, cartid);

      if (!selectedAddress || !paymentMethod) {
          res.json({ status: "fill" });
          return;
      }
      const userId = req.session.userId;
      const addressInfo = await Address.find({userId : userId});
      const cartInfo = await Cart.find({userId : userId});
      const proInfo = cartInfo.items;
      console.log("pro info anee.." + proInfo);
    }catch(error){
        console.error("/pageerror", error);    
    }
}




module.exports = {
    getCheckoutPage,
    getSfulPage,
    placeOrder,

}