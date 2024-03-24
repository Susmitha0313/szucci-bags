const Mongoose = require('mongoose');


const addressSchema = new Mongoose.Schema({
    //a reference to the user who owns the address
        userId : {
            type: Mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name:{
            type: String,
            requried: true
        },
        address: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        locality: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true,
        },
        landmark:{
            type: String,
            required: true
        },
        phone2:{
            type: String
        },
        country: {
            type: String,
            default: 'India' // Assuming the default country is India
        }
})
module.exports = Mongoose.model("Address", addressSchema)