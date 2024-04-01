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
        const cartInfo = await Cart.findOne({userId : userId});
        if(!cartInfo){
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
        res.render("user/checkoutCart", {addressInfo, cartDetails, cartInfo,userId});
    }catch(error){
        console.error("/pageerror", error);    
    }
}





const getSfulPage = async(req,res)=>{
    try{
        const userId = req.session.userId;
        const orderData = await Order.find({});
        res.render("user/orderPlaced",{orderData,userId});
    }catch(error){
        console.error("/pageerror", error);    
    }
}

const placeOrder = async(req, res) => {
    try {
        console.log("yeah place order is working");
        const {selectedAddress, selectPayment, cartId, total} = req.body;
        console.log(selectedAddress, selectPayment, cartId, total);
        const userId = req.session.userId;
        const addressInfo = await Address.findOne({_id: selectedAddress});
        let cartInfo = await Cart.findOne({userId: userId});
        const findUser = await User.findById({_id: userId});
        let uniqueId;
        do {
            uniqueId = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
        } while (await Order.findOne({uniqueId: uniqueId})); // Check if the generated ID already exists in the database
        console.log(uniqueId);
        if(!selectedAddress){
            res.json({status: "selectTheAddress", message: "Please select the delivery Address"});
        }else if(!selectPayment){
            res.json({status: "selectPayment", message: "Plese select the payment method"});
        }else{
            const createOrder = new Order({
            userId: findUser._id,
            orderNumber: uniqueId,
            userEmail: findUser.email,
            items: cartInfo.items.map(item =>({
                productId: item.productId,
                quantity: item.quantity,
                subTotal: item.subTotal,
            })),
            totalAmount: cartInfo.totalPrice,
            orderType: selectPayment,
            shippingAddress: addressInfo,
        });

        await createOrder.save();
        await Cart.deleteOne({userId: userId});
        console.log(createOrder);
        res.json({status: true, message:"Order Placed Successfully"});
        }
        
    } catch (error) {
        console.error("/pageerror", error);
        res.json({status: false, message: "An error occurred while placing the order."});
    }
}





// ADMINNNNNNNNNNNNNNNNNNNNNN

const getAdminOrderPage = async(req,res)=>{
    try{
        console.log('gkgahsdgk')
        const orderData = await Order.find({});
        res.render("orderDetail", {orderData : orderData});
      }catch(error){
          console.log(error.message);
      }
}




const getOrdereditPage = async(req,res)=>{
    try{
        const orderId = req.query.id;
        console.log( "dfghdfgbdfg  " +orderId)
        const orderData = await Order.find({_id:orderId}).populate("items.productId")
        console.log('the dta is',orderData)
        res.render('orderDetailEdit',{orderData})

    }catch(error){
        console.log(error.message);
    }
}


const statusChange = async(req,res)=>{
    try{
        const id = req.query.id;
        const statChange = req.body.statusname
        console.log(statChange)
        await Order.findOneAndUpdate({_id:id},{$set:{status:statChange}});
        const orderData = Order.findOne({_id:id});

        res.redirect("/admin/ordersList")
    }catch(error){
        console.log(error.message);
    }
}



const deleteOrder = async(req,res)=>{
    const orderId = req.query.id;
    console.log("Order ID "+orderId);
    const delOrd = await Order.findOneAndDelete({_id : orderId});
    console.log( "delete Ord" + delOrd);
    if (!delOrd) {
        console.log(`Order "${orderId}" not found.`);
        return;
      }
      const orderData = await Order.find({});
      res.render("orderDetail", { orderData: orderData });
}



const viewOrder = async (req, res) => {
    try {
        const userId = req.session.userId;
        const orderId = req.query.id;
        console.log("order Id "+orderId);
        const orderData = await Order.find({_id:orderId}).populate("items.productId");
        // const cartData = await Cart.find({_id: userId});
        console.log("1 orderData "+orderData)
        // console.log("2 "+cartData)
        res.render("user/orderDetailPage", {  userId,orderData}); // Pass itemId to the template
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};




const cancelOrder = async (req, res) => {
    try {
        console.log("cancel order controller")
        res.redirect("/viewOrder"); // Pass itemId to the template
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};



module.exports = {
    getCheckoutPage,
    getSfulPage,
    placeOrder,
    statusChange,
    deleteOrder,   
    viewOrder,
    cancelOrder,

    getAdminOrderPage,
    getOrdereditPage,


}