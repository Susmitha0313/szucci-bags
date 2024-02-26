const Category = require("../models/categorySchema");
const Product = require("../models/productSchema");

const addCategory = async(req,res)=>{
  try{
    const {name,description } = req.body
    console.log(description);
  }catch(error){
    console.log(error.message);
    res.status(500).json({ error: error.message });
}
}




module.exports = {
    addCategory,
    

}