const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const Product = require("../models/productSchema");
const Address = require("../models/addressSchema");
const User = require("../models/userSchema");
const Cart = require("../models/cartSchema");
const Order = require("../models/orderSchema");
const Coupon = require("../models/couponSchema");
const crypto = require('crypto');
const { Wallet, Transaction } = require("../models/walletSchema");
const mongoose = require("mongoose");

const Razorpay = require('razorpay')
const { RazorPay_SECRET, RazorPay_KEY_ID } = process.env;
console.log("raaaazzoorr pay dtaiilssss", RazorPay_SECRET, RazorPay_KEY_ID)
const razorpayInstance = new Razorpay({
  key_id: RazorPay_KEY_ID,
  key_secret: RazorPay_SECRET,
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
    const couponData = await Coupon.find({});
    const walletInfo = await Wallet.findOne({ userId: userId });
    console.log(walletInfo);
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
      walletInfo,
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
    res.render("user/orderPlaced", { orderData, userId });
  } catch (error) {
    console.error("/pageerror", error);
  }
};




const placeOrder = async (req, res) => {
  try {
    const { selectedAddress, selectPayment, cartId, total, code } = req.body;
    const amtTotal = parseInt(total, 10); 
    let createOrder;
    const userId = req.session.userId;
    const couponData = await Coupon.findOne({ coupencode: code });
    const addressInfo = await Address.findOne({ _id: selectedAddress });
    let cartInfo = await Cart.findOne({ userId: userId });
    const userData = await User.findById({ _id: userId });
    const productId = cartInfo.items.map((item) => item.productId);

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
    if (!selectedAddress || !selectPayment) {
      res.json({ status: "fill" });
      return;
    }


    else if (selectPayment === "COD") {
      console.log("COD aan");
      if (couponData) {
        console.log("COupon is used here");
        createOrder = new Order({
          userId: userData._id,
          orderNumber: uniqueId,
          userEmail: userData.email,
          items: cartInfo.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            subTotal: item.subTotal,
          })),
          totalAmount: cartInfo.totalPrice,
          paymentStatus: "Success",
          orderType: selectPayment,
          shippingAddress: addressInfo,
          coupon: couponData.coupencode,
          discount: couponData.discountPercentage,

        });
        createOrder.save();
        const updateCouponData = await Coupon.findByIdAndUpdate(
          couponData._id,
          {
            $push: {
              redeemedUsers: userData._id,
            },
          },
        );
        console.log("updateCouponData " + updateCouponData);
      } else {
        console.log("normal cod without coupon");
        createOrder = new Order({
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
          paymentStatus: "Success",
        });
        createOrder.save();
        console.log(createOrder);
      }
      await Cart.deleteOne({ userId: userId });
      console.log("Cart clear aaki");
      res.json({ status: true });     
    }


    else if (selectPayment === "RazorPay") {
      
      if (cartInfo.totalPrice <= 15000) {
        console.log("ahh 15000 nde ullil anne price");
        if (couponData) {
          console.log("COupon is used here");
          createOrder = new Order({
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
            coupon: couponData.coupencode,
            discount: couponData.discountPercentage,
          });
        } else {
          console.log("coupon illaaaaa");
          createOrder = new Order({
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
        }
        const options = {
          amount: amtTotal * 100,
          currency: "INR",
          receipt: "any unique id for every order",
          payment_capture: 1 //ivde receipt lot pass cheyenda values maati ezthaam
        };

        console.log(options);
        razorpayInstance.orders.create(options, async (error, order) => {
          if (error) {
            console.log("raz failed");
            console.log(error);
            res.json({ status: "razorpayFailed" });
          } else {
            console.log("Razorpay order created successfully");
            res.json({ status: "razorpayTrue",razorpayOrder: order, orderDetails: createOrder })
          }
        });

      } else {
        res.json({ status: "15000Limit" });
      }
      
    }


    else if (selectPayment === "Wallet") {
      console.log(" 1...selected wallet value");
      if (couponData) {
        createOrder = new Order({
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
          coupon: couponData.coupencode,
          discount: couponData.discountPercentage,
     
        });        
        console.log(userData._id);   
        const userWallet = await Wallet.findOne({ userId: userData._id });
        console.log(userWallet);
        if (userWallet) {
          if (cartInfo.totalPrice <= userWallet.balance) {
            console.log("wallet amount use cheyyammm");
          }
          //total amnt nde katilum greater aan waller amount nn indenguilee payment patulluu..
          //user illel nnit new transaction ayi dsave cheyenam....
          //else ulla transactions ilot push cheyenam..
        }
      } else {      
        createOrder = new Order({
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
          // coupon: couponData.coupencode,
          // discount: couponData.discountPercentage,

        });
      }
    }
  } catch (error) {
    console.error("Error placing order:", error);
    res.json({
      status: false,
      message: "An error occurred while placing the order.",
    });
  }
};


const razorpaysuccess = async(req,res)=>{
  try{
    const {response, orderDetails} = req.body;
    const userId = req.session.userId;
    const userData = await User.findById({ _id: userId });
    if(userData){
      // hmac checking
      let hmac=crypto.createHmac('sha256',RazorPay_SECRET);
      console.log(RazorPay_SECRET);
      hmac.update(response.razorpay_order_id+"|"+response.razorpay_payment_id)
      hmac=hmac.digest("hex")
      if(hmac == response.razorpay_signature){
          // creating order
          console.log(orderDetails.paymentStatus);
          orderDetails.paymentStatus = "Success";
          const orderProcess = await Order.create(orderDetails);
          console.log(orderDetails.paymentStatus);


              if (orderProcess) {
                  await Cart.deleteOne({ userId: userId });
                  console.log("Cart clear aaki");
                  if(orderDetails.coupon != "false"){
                      console.log("coupon used");
                      // pull that userID from coupons available users and push that userID into redeemed user list into coupon
                      const removeID = userData._id.toString();
                      await Coupon.updateOne({ coupencode: orderDetails.coupon },{$pull: { availableUsers: removeID }, $push: { redeemedUsers: removeID }});
                    }
                  res.json({ status: "true"  })
              } else {
                  res.json({ status: "network" })
              }
      }else{
          console.log("falied");
          res.json({status : "somthingwrong"})
      }
    }
  }catch(error){
    console.log(error);
  }
}





const razorpayfailed = async(req,res)=>{
  try{
    const {orderDetails} = req.body;
    console.log(orderDetails);
    const userId = req.session.userId;
    const userData = await User.findById({ _id: userId });
    console.log(userData);
    if(userData){
      const orderProcess = await Order.create(orderDetails); 
      if(orderProcess){
        if(orderDetails.coupon){

        }
      }
    }
  }catch(error){
    console.log(error);
  }
}








// ADMINNNNNNNNNNNNNNNNNNNNNN
const getAdminOrderPage = async (req, res) => {
  try {
    const search = req.query.searchOrder || "";
    const page = parseInt(req.query.page) || 1; // Parse page to integer
    const limit = 8;
    let orderData;

    const queryCondition = search.trim() !== ""
      ? { "shippingAddress.name": { $regex: new RegExp(".*" + search + ".*", "i") } }
      : {};

    orderData = await Order.find(queryCondition)
      .sort({ orderDate: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(queryCondition);

    res.render("orderDetail", {
      orderData: orderData,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
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
    if(statChange == "Delivered"){
      await Order.findOneAndUpdate({_id: id},{$set: { paymentStatus : "Success"}});
    }
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
  res.redirect("/admin/ordersList");
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



const returnOrder = async (req, res) => {
  try {
    const { orderId, reason } = req.query;
    const reqReturn = await Order.findOneAndUpdate({ _id: orderId }, { $set: { status: "RequestProcessing", returningReason: reason } });
    console.log(orderId, reason)
    if (!reqReturn) {
      return res.json({ status: false, errMessage: "Order not found" })
    }
    res.json({ status: true, message: "request processing" });
  } catch (error) {
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






const searchOrder = async (req, res) => {
  try {
    console.log("searching order");
    const searchOrder = req.body.searchOrder;
    const orderData = await Order.find({
      'shippingAddress.name': { $regex: searchOrder, $options: 'i' }
    });
    res.json(orderData);
  } catch (error) {
    console.error('Error searching orders:', error);
  }
};

module.exports = {
  getCheckoutPage,
  getSfulPage,
  placeOrder,
  razorpaysuccess,
  razorpayfailed,

  statusChange,
  deleteOrder,
  viewOrder,
  cancelOrder,
  returnOrder,
  acceptorReject,
  getAdminOrderPage,
  getOrdereditPage,
  searchOrder,

};
