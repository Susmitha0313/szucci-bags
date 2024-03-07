
const Mongoose = require("mongoose");


const brandSchema = new Mongoose.Schema({
    brandName:{
        type: String,
        required: true,
        unique:true
    },
    isBlocked:{
        type: Boolean,
        default : false    
    },
    serialNum:{
        type: Number,
        unique:true
    }
});

const Brand = Mongoose.model("Brand", brandSchema);
module.exports = Brand;

