
const Mongoose = require("mongoose");


const categorySchema = new Mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique:true
    },
    description:{
        type: String,
        required: true,
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

const Category = Mongoose.model("Category", categorySchema);
module.exports = Category;

