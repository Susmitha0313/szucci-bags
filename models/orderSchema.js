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
        type : Number,
        require:true,
        unique:true
        },
       
        items: [
            {
              productId: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Reference to your Product model if you have one
                required: true
              },
              quantity: {
                type: Number,
                required: true
              },
              subTotal: {
                type: Number,
                required: true
              },
            }
        ],
  
    totalAmount: {
        type : Number,
        requre : true,
    },
    orderType: {
        type: String,
        require: true
    },
    orderDate:{
        type: Date,
        require:true,
        default: Date.now 
    },
    
    status: {
        type: String,
        require: true,
        default: "Processing",
    },
    shippingAddress:{
        type: Object,
        require: true 
    }
   

}, { versionKey: false ,timestamps:true});

module.exports = Mongoose.model("Order", orderSchema)