
const Mongoose = require("mongoose");


const offerSchema = new Mongoose.Schema({
    offerName : {
        type : String,
        required : true
    },
    startDate : {
        type : String,
    },
    endDate : {
        type : String,
    },
    discountPercentage : {
        type : Number
    },
    isBlocked : {
        type : Boolean,
        default : false
    },
    offerStatus : {
        type : String,
        default: "active",
    },
    products: [{ 
        type: Schema.Types.ObjectId,
        ref: 'Product' }], 
    categories: [{
        type: Schema.Types.ObjectId, 
        ref: 'Category' }], 
})
const Offer = Mongoose.model("offer", offerSchema);
module.exports = Offer;

