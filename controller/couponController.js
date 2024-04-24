const Coupon = require("../models/couponSchema");
const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const User = require("../models/userSchema");
const Cart = require("../models/cartSchema");

  
       
const getCouponPage = async(req,res)=>{
  try{
    const couponData = await Coupon.find({});
    console.log(couponData);
    res.render("couponPage",{couponData});
  }catch(error){
      console.log(error.message);
  }
};



const addNewCoupon = async(req,res)=>{
    try{
        const couponData = await Coupon.find({});
        console.log(couponData);
        res.render("couponAdd",{couponData});
    }catch(error){
        console.log(error.message);
    }
};



const createCoupon = async (req, res) => {
    try {
        const { couponName, startDate, endDate, minBuyRate, maxBuyRate, discountPercent } = req.body;
        console.log(couponName, startDate, endDate, minBuyRate, maxBuyRate, discountPercent)
        let couponCode = generateCouponCode(15);
        console.log("Generated Coupon Code:", couponCode);

        const existCoupon = await Coupon.findOne({ couponName: couponName });
        if (!existCoupon) {
            const newCoupon = new Coupon({
                couponName,
                coupencode : couponCode, // Assign unique coupon code to couponCode field
                startDate,
                endDate,
                minBuyRate,
                maxBuyRate,
                discountPercentage : discountPercent,
            });
            const savedCoupon = await newCoupon.save();
            console.log("Saved Coupon:", savedCoupon);
            res.redirect("/admin/couponPage");
        } else {
            res.status(200).json({ status: false, message: "Coupon with this name already exists" });
        }
    } catch (error) {
        console.error("Error creating coupon:", error);
        res.status(500).json({ status: false, error: "Failed to create coupon" });
    }
}



function generateCouponCode(length) {
    const prefix = "szucci";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let couponCode = prefix;
    for (let i = 0; i < length - prefix.length; i++) {
        couponCode += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return couponCode;
}


//user side 

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


const couponBlock = async (req, res) => {
  try {
      console.log("coupon block");
      const coupName = req.query.couponName; // Corrected query parameter name
      const coup = await Coupon.findOne({ couponName: coupName });

      if (coup.isBlocked === true) {
          const blocked = await Coupon.findOneAndUpdate({ couponName: coupName }, { $set: { isBlocked: false } });
      } else {
          const unblocked = await Coupon.findOneAndUpdate({ couponName: coupName }, { $set: { isBlocked: true } });
      }

      const couponData = await Coupon.find({});
      res.render("couponPage", {couponData});
  } catch (error) {
      console.error("/pageerror", error); // Log the actual error
  }
}







module.exports = {
    getCouponPage,
    addNewCoupon,
    createCoupon,
    couponBlock,
    applyCoupon,

    
    
}