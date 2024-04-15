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
            ref : 'Product',
            require : true,
        },
        quantity : {
            type : Number,
            require:true,
        },
        subTotal: {
            type: Number,
            require: true,
          }
    }], 

    totalPrice : {
        type : Number,
        require: true
    }
},{ timestamps: true, versionKey: false })

module.exports = Mongoose.model("Cart", cartSchema)