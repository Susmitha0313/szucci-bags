
const Mongoose = require("mongoose");


const userSchema = new Mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true 
    },
    phone:{
        type:String,
        required:true,
        unique:true,
    },
    password: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now

    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: String,
        default: "0"
    },
    cart:{
        type: Array
    },
    wishlist:{
        type: Array
    }

});

const User = Mongoose.model("User", userSchema);
module.exports = User;

