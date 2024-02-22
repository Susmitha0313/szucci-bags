const { timeStamp, time } = require("console");
const Mongoose = require("mongoose");

const productSchema = Mongoose.Schema({
    id:{
        type: String,
        requires: true
    },
    productName:{
        type: String,
        requires: true
    },
    description:{
        type: String,
        requires: true
    },
    brand:{
        type: String,
        requires: true
    },
    category:{
        type: String,
        requires: true
    },
    regularPrice:{
        type: Number,
        requires: true
    },
    salePrice:{
        type: Number,
        requires: true
    },
    createdOn:{
        type: time,
        requires: true
    },
    quantity:{
        type: Number,
        requires: true
    },
    isBlocked:{
        type: Boolean,
        requires: true
    },
    productImage:{
        type: Array,
        requires: true
    },
    color:{
        type: String,
        requires: true
    },
    status:{
        type: String,
        requires: true
    },
    productOffer:{
        type: Number,
        requires: true
    }

})

const Product = Mongoose.model("Product", productSchema)
module.exports = Product