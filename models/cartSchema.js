const Mongoose = require('mongoose');


const cartSchema = new Mongoose.Schema({
    userId : {
        type :  Mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
    },
    items : [{
        productId : {
            type : Mongoose.Schema.Types.ObjectId,
            ref : 'Products',
            require : true,
        },
        quantity : {
            type : Number
        },
        subTotal: {
            type: Number,
            require: true,
          },
          image:{
            type: [String],
            require: true, 
          }
    }], 

    totalPrice : {
        type : Number
    }
},{ timestamps: true, versionKey: false })

module.exports = Mongoose.model("Cart", cartSchema)