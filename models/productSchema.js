const { timeStamp, time } = require("console");
const Mongoose = require("mongoose");

const productSchema = Mongoose.Schema({
    id:{
        type: String,
        require: true
    },
    productName:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    brand:{
        type: String,
        require: true
    },
    category:{
        type: String,
        require: true
    },
    regularPrice:{
        type: Number,
        require: true
    },
    salePrice:{
        type: Number,
        require: true
    },
    
    quantity:{
        type: Number,
        require: true
    },
    isBlocked:{
        type: Boolean,
        require: true
    },
    productImage:{
        type: Array,
        require: true
    },
    color:{
        type: String,
        require: true
    },
    status:{
        type: String,
        require: true
    },
    productOffer:{
        type: Number,
        require: true
    },
    cartQuantity:{
        type: Number
    },

})

const Product = Mongoose.model("Product", productSchema)
module.exports = Product