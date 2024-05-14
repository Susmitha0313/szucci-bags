
const Mongoose = require("mongoose");


const offerSchemaCateg = new Mongoose.Schema({
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
        default: "inactive",
    },
    categories: [{
        type: Mongoose.Schema.Types.ObjectId, 
        ref: 'Category' }], 
})
const CategoryOffer = Mongoose.model("categoryOffer", offerSchemaCateg);
module.exports = CategoryOffer;

