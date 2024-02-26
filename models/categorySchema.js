
const Mongoose = require("mongoose");


const categorySchema = new Mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
        unique:true 
    },
    isListed: {
        type: Boolean,
        default: true
    },
    categoryOffer: {
        type: Number,
        default: "0"
    }
});

const Category = Mongoose.model("Category", categorySchema);
module.exports = Category;

