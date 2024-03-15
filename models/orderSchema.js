const Mongoose = require('mongoose');


const orderSchema = new Mongoose.Schema({
    userId : {
        type :  Mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
        },
    userEmail : {
        type: String,
        require: true
        },
    orderNumber : {
        type : Number
        },
    subTotal: {
        type: String,
        require: true,
        unique: true,
          },
    items : [{
        productId: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: "Products",
            require: true,
        },
        quantity:{
            type: Number,
        },
        subTotal:{
            type: Number,
            require: true,
        },
        size: {
            type: String,
            required: true
        }
    }],

    totalAmount: {
        type : Number,
        requre : true,
    },
    orderType: {
        type: String,
        require: true
    },
    orderDate: {
        type: String,
        require: true

    },
    status: {
        type: String,
        require: true
    },
    shippingAddress: {
        name: {
            type: String,
            require: true
        },
        mobile: {
            type: Number,
            require: true
        },
        pinCode: {
            type: String,
            require: true
        },
        city: {
            type: String,
            require: true
        },
        address: {
            type: String,
            require: true
        },
        district: {
            type: String,
            require: true
        },
        state: {
            type: String,
            require: true
        },
        addressType: {
            type: String,
            require: true
        },
        altrenateMobile: {
            type: Number,

        },

    },

}, { versionKey: false });

module.exports = Mongoose.model("order", orderSchema)