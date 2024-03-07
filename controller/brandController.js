const Category = require("../models/categorySchema");
const Product = require("../models/productSchema");
const Brand = require("../models/brandSchema");


             
const getBrandPage = async(req,res)=>{
  try{
    const brandData = await Brand.find({});
      res.render("productBrand", {brand : brandData});
  }catch(error){
      console.log(error.message);
  }
};



const getBrandEdit = async(req,res)=>{
  try{
      res.render("productBrandEdit");
  }catch(error){
      console.log("/pageerror");
  }
}

  

const createBrand = async(req,res)=>{
  try{
      const braName = req.body.brandName;
      const brand = await Brand.find({});
      const brandData = await Brand.find({brandName: braName});
      
    if(typeof brandData != undefined){
       const newBrand = new Brand({
        brandName: braName
      });
      const savedBrand = await newBrand.save();
      return res.render("productBrand",{brandAdded: "Brand added successfully", brand:[savedBrand, ...brand]})
    }else{
      const brandExists = "Brand already exists";
      return res.render("productBrand",{errMsg: brandExists});
    }
  }catch(error){
    console.log(error.message);
    return res.status(500).send("Server fgjgdjgj Error");
  }
}
  



const brandBlock = async (req, res) => {
  try {
      const nameBrand = req.query.braName; // Corrected query parameter brand
      const braName = await Brand.findOne({ brand: nameBrand });

      if (braName.isBlocked === true) {
          const blocked = await Brand.findOneAndUpdate({ brand: nameBrand }, { $set: { isBlocked: false } });
      } else {
          const unblocked = await Brand.findOneAndUpdate({ brand: nameBrand }, { $set: { isBlocked: true } });
      }

      const brandData = await Brand.find({});
      res.render("productBrand", {brandData});
  } catch (error) {
      console.error("/pageerror", error); // Log the actual error
  }
}


module.exports = {
    getBrandPage,
    getBrandEdit,
    createBrand,
    brandBlock,
    
}  