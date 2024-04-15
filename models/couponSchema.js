
const Mongoose = require("mongoose");


const couponSchema = new Mongoose.Schema({
    couponName : {
        type : String,
        required : true
    },
    coupencode : {
        type : String,
    },
    startDate : {
        type : String,
    },
    endDate : {
        type : String,
    },
    minBuyRate : {
        type : Number
    },
    maxBuyRate : {
        type : Number
    },
    availableUsers : {
        type : Array
    },
    redeemedUsers : {
        type : Array
    },
    discountPercentage : {
        type : Number
    },
    isBlocked : {
        type : Boolean,
        default : false
    },
    couponStatus : {
        type : String,
        default: "active",
    },
})
const Coupon = Mongoose.model("Coupon", couponSchema);
module.exports = Coupon;

