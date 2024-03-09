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
    const brandData = await Brand.find({});
      res.render("productBrandEdit",{brandData});
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
      const brandName = req.query.brandName; // Corrected query parameter brandName
      const brand = await Brand.findOne({ brandName });

      if (brand) {
          // Toggle the isBlocked field
          brand.isBlocked = !brand.isBlocked;

          // Save the updated brand
          await brand.save();

          // Redirect to the same page after updating the brand status
          const brandData = await Brand.find({});
          res.render("productBrand", { brand: brandData });
      } else {
          console.error("Brand not found");
          res.status(404).send("Brand not found");
      }
  } catch (error) {
      console.error("/admin/brandBlock error", error);
      res.status(500).send("Internal Server Error");
  }
}

const deleteBrand = async (req, res) => {
  try {
      const brandName = req.query.brandName;
      const brandone = await Brand.findOne({ brandName });
      const brandData = await Brand.find({});

      if (!brandone) {
          return res.status(404).send("Brand not found");
      }

      await Brand.deleteOne({ brandName });

      res.render("productBrand",{brand: brandData});
  } catch (error) {
      console.error("/admin/deleteBrand error", error);
      res.status(500).send("Internal Server Error");
  }
}



module.exports = {
    getBrandPage,
    getBrandEdit,
    createBrand,
    brandBlock,
    deleteBrand,

    
}  