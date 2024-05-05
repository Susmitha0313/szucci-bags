
const Mongoose = require("mongoose");


const offerSchemaProd = new Mongoose.Schema({
    offerName : {
        type : String,
        required : true
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
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Product' }], 
})
const ProductOffer = Mongoose.model("productOffer", offerSchemaProd);
module.exports = ProductOffer;

