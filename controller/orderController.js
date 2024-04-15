const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const Product = require("../models/productSchema");
const Address = require("../models/addressSchema");
const User = require("../models/userSchema");
const Cart = require("../models/cartSchema");
const Order = require("../models/orderSchema");
const Coupon = require("../models/couponSchema");
const {Wallet , Transaction} = require("../models/walletSchema");
const mongoose = require("mongoose");

const Razorpay = require('razorpay');
const {RazorPay_SECRET, RazorPay_KEY_ID} = process.env;
const razorpayInstance = new Razorpay({
    key_id : RazorPay_KEY_ID,
    key_secret : RazorPay_SECRET,
});


// const { price, proId, index, subtotal, qty } = req.body;
// const quantity = parseInt(qty);
// const prodId = proId.toString();
// const proData = await Product.findById({_id:prodId });

const getCheckoutPage = async (req, res) => {
  try {
    const userId = req.session.userId;
    const addressInfo = await Address.find({ userId: userId });
    const cartInfo = await Cart.findOne({ userId: userId });
    const couponData  = await Coupon.find({});
    if (!cartInfo) {
      res.status(404).send("Cart not founded for the user");
    }
    const cartDetails = await Cart.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$_id",
          items: {
            $push: {
              productName: "$product.productName",
              quantity: "$items.quantity",
              totalPrice: "$items.subTotal",
            },
          },
          totalCost: { $sum: "$items.totalPrice" },
        },
      },
    ]);
    res.render("user/checkoutCart", {
      addressInfo,
      cartDetails,
      cartInfo,
      userId,
    });
  } catch (error) {
    console.error("/pageerror", error);
  }
};

const getSfulPage = async (req, res) => {
  try {
    const userId = req.session.userId;
    const orderData = await Order.find({});
    res.render("user/orderPlaced", { orderData,couponData , userId });
  } catch (error) {
    console.error("/pageerror", error);
  }
};




const placeOrder = async (req, res) => {
  try {
    const { selectedAddress, selectPayment, cartId, total, couponUsed } = req.body;

    const userId = req.session.userId;
    const couponData = await Coupon.findOne({coupencode : couponUsed});
    const addressInfo = await Address.findOne({ _id: selectedAddress });
    let cartInfo = await Cart.findOne({ userId: userId });
    const userData = await User.findById({ _id: userId });
    const productId = cartInfo.items.map((item) => item.productId);
    if(!selectedAddress || !selectPayment){
      res.json({status : "fill"});
      return;
    }else if(selectPayment === "COD"){
      if(couponUsed){
        console.log("inside coupon adding order");
        const createOrder = new Order({
          userId: userData._id,
          orderNumber: uniqueId,
          userEmail: userData.email,
          items: cartInfo.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            subTotal: item.subTotal,
          })),
          totalAmount: cartInfo.totalPrice,
          orderType: selectPayment,
          shippingAddress: addressInfo,  
          coupon:couponData.coupencode,

        });
        await createOrder.save();
        const updateCouponData = await Coupon.findByIdAndUpdate(couponData._id, {
          $push: {
            redeemedUsers : userData._id,
          },
        },
      );
      } else {
          const createOrder = new Order({
            userId: userData._id,
            orderNumber: uniqueId,
            userEmail: userData.email,
            items: cartInfo.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              subTotal: item.subTotal,
            })),
            totalAmount: cartInfo.totalPrice,
            orderType: selectPayment,
            shippingAddress: addressInfo,  
          });

          await createOrder.save();
        }
      
      await Cart.deleteOne({ userId: userId });
      console.log(createOrder);
      res.json({ status: true,method: "Cash_on_Delivery", message: "Order Placed Successfully" });
    
    }
    let uniqueId;
    do {
      uniqueId = Math.floor(1000 + Math.random() * 9000);
    } while (await Order.findOne({ uniqueId: uniqueId }));

   
      // Loop through cart items to update product stock quantity
      for (const item of cartInfo.items) {
        const proData = await Product.findOne({ _id: productId });
        if (proData) {
          proData.quantity -= item.quantity; // Reduce product stock quantity

          await proData.save();
        }
      }
      if (selectPayment === "COD") {
        const createOrder = new Order({
          userId: userData._id,
          orderNumber: uniqueId,
          userEmail: userData.email,
          items: cartInfo.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            subTotal: item.subTotal,
          })),
          totalAmount: cartInfo.totalPrice,
          orderType: selectPayment,
          shippingAddress: addressInfo,  
        });

        await createOrder.save();
        await Cart.deleteOne({ userId: userId });
        console.log(createOrder);
        res.json({ status: true,method: "Cash_on_Delivery", message: "Order Placed Successfully" });
      } 
    } catch (error) {
    console.error("Error placing order:", error);
    res.json({
      status: false,
      message: "An error occurred while placing the order.",
    });
  }
};

// ADMINNNNNNNNNNNNNNNNNNNNNN

const getAdminOrderPage = async (req, res) => {
  try {
    console.log("gkgahsdgk");
    const orderData = await Order.find({});
    res.render("orderDetail", { orderData: orderData });
  } catch (error) {
    console.log(error.message);
  }
};

const getOrdereditPage = async (req, res) => {
  try {
    const orderId = req.query.id;
    const orderData = await Order.find({ _id: orderId }).populate("items.productId");
    res.render("orderDetailEdit", { orderData });
  } catch (error) {
    console.log(error.message);
  }
};

const statusChange = async (req, res) => {
  try {
    const id = req.query.id;
    const statChange = req.body.statusname;
    console.log(statChange);
    await Order.findOneAndUpdate({ _id: id }, { $set: { status: statChange } });
    const orderData = Order.findOne({ _id: id });

    res.redirect("/admin/ordersList");
  } catch (error) {
    console.log(error.message);
  }
};

const deleteOrder = async (req, res) => {
  const orderId = req.query.id;
  console.log("Order ID " + orderId);
  const delOrd = await Order.findOneAndDelete({ _id: orderId });
  console.log("delete Ord" + delOrd);
  if (!delOrd) {
    console.log(`Order "${orderId}" not found.`);
    return;
  }
  const orderData = await Order.find({});
  res.render("orderDetail", { orderData: orderData });
};



const viewOrder = async (req, res) => {
  try {
    const userId = req.session.userId;
    const orderId = req.query.id;
    const orderData = await Order.find({ _id: orderId }).populate(
      "items.productId"
    );
    res.render("user/orderDetailPage", { userId, orderData }); // Pass itemId to the template
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};



const cancelOrder = async (req, res) => {
  try {
    console.log("inside cancel order");
    const { orderId } = req.query;

    console.log(orderId);
    const cancelOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      { $set: { status: "Cancelled" } }
    );

    if (cancelOrder) {
      const findOrder = await Order.findOne({ _id: orderId });
      console.log("order dataaaaaaaa  ", findOrder);

      for (let i = 0; i < findOrder.items.length; i++) {
        const productId = findOrder.items[i].productId;
        const quantity = findOrder.items[i].quantity;
        const proData = await Product.findById(productId);
        console.log(proData);
        proData.quantity += quantity;
        await proData.save();
      }
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.error("Error canceling order:", error);
    res.status(500).json({ success: false, message: "Failed to cancel order" });
  }
};



const returnOrder = async(req,res)=>{
  try{
    const {orderId, reason} = req.query;
    const reqReturn = await Order.findOneAndUpdate({_id: orderId},{$set:{status: "RequestProcessing", returningReason: reason }});
    console.log(orderId, reason)
    if(!reqReturn){
      return res.json({status: false, errMessage: "Order not found"})
    }
      res.json({ status: true, message: "request processing" });
  }catch(error){
    console.error("Error returning order:", error);    
    res.status(500).json({ status: false, errMessage: "Failed to return order" });
  }
}


const acceptorReject = async (req, res) => {
  console.log("Inside acceptorReject");
  try {
    const { orderId, response } = req.body; 
    console.log(orderId, response);
    if (response === "accept") {
      const returnAccept = await Order.findOneAndUpdate(
        { _id: orderId },
        { $set: { status: "Returned" } }
      );
      if (!returnAccept) {
        return res.json({ status: false, message: "Order not found" });
      }
      const userId = returnAccept.userId;
      const totalSpent = returnAccept.totalAmount;

      const walletData = await Wallet.findOne({ userId: userId });
      
      if (!walletData) {
        // Create new wallet and transaction
        const transactionWallet = new Wallet({
          userId: userId,
          balance: totalSpent
        });
        await transactionWallet.save();

        const transaction = new Transaction({
          walletId: transactionWallet._id, // Set walletId from the newly created wallet
          amount: totalSpent,
          type: "credit",
          description: "Refund for returned order"
        });
        await transaction.save();
      } else {
        // Wallet already exists, update balance and create transaction
        const crntBalance = walletData.balance;
        const newBalance = crntBalance + totalSpent;
        walletData.balance = newBalance;
        await walletData.save();

        const transaction = new Transaction({
          walletId: walletData._id, // Set walletId from existing wallet
          amount: totalSpent,
          type: "credit",
          description: "Refund for returned order"
        });
        await transaction.save();
      }
     
      res.json({ status: true, message: "Order returned successfully" });
    } else if (response === "reject") {
        const returnRejected = await Order.findOneAndUpdate(
          { _id: orderId },
          { $set: { status: "Delivered" } }
        );
        if (!returnRejected) {
          return res.json({ status: false, message: "Order not found" });
        }
        res.json({ status: true, message: "Order rejected successfully" });
      } else {
      res.status(400).json({ status: false, message: "Invalid response" });
    }
 } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: false, errMessage: "Failed to process request" });
  }  
};




const applyCoupon = async (req, res) => {
  try {
    const {code,id} = req.body;
    console.log(code , id);
    const userId = req.session.userId;

    const couponData = await Coupon.findOne({coupencode: code });
    const user = await User.findOne({ _id: userId });
    const cartData = await Cart.findOne({ userId: userId });
    console.log(couponData);
    if (!couponData) {
      res.json({status : "invalid"});
      console.log("invalid: coupon not found");
    } else {
        if (!couponData.isBlocked && couponData.couponStatus === "active") {
          if (cartData.totalPrice >= couponData.minBuyRate && cartData.totalPrice <= couponData.maxBuyRate) {
            const userInsideCoupon = await Coupon.findOne({_id : couponData._id, availableUsers:user._id});
            console.log("userInsideCoupon: "+userInsideCoupon );
            if(userInsideCoupon){
              res.json({status: "used"});
            }else{
                const totalPrice = cartData.totalPrice;
                console.log( couponData.maxBuyRate, cartData.totalPrice, couponData.minBuyRate);
                const discountPercentage = couponData.discountPercentage;
                const amount = ((cartData.totalPrice /100)* couponData.discountPercentage );
                console.log("amount "+ amount);
                const balanceAmnt = Math.round(totalPrice - (totalPrice * discountPercentage) / 100);
                console.log("balanceAmnt "+ balanceAmnt);
                res.json({ status: "true", balance: balanceAmnt , dicsAmount : amount});
            }
          } else {
            res.json({ status: "minMaxAmnt", minAmnt: couponData.minBuyRate, maxAmnt: couponData.maxBuyRate });
          }
        } else {
          res.json({ status: "notfound" });
        }
    }
  } catch (error) {
    console.error("Error applying coupon:", error);
    return res.status(500).json({ error: "Failed to apply coupon" });
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
  returnOrder,
  acceptorReject,
  getAdminOrderPage,
  getOrdereditPage,
  applyCoupon,
};
