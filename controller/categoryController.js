const Category = require("../models/categorySchema");
const Product = require("../models/productSchema");


       
const getCategory = async(req,res)=>{
  try{
    const category = await Category.find({})

       res.render("productCategory",{category});
     
  }catch(error){
      console.log("/pageerror");
  }
};



const getCategoryEdit = async(req,res)=>{
  try{
      res.render("productCategEdit");
  }catch(error){
      console.log("/pageerror");
  }
}

  



const createCategory = async(req,res)=>{
  try{
    console.log("dfgdgfdg")
    const catname = req.body.name;
    const description = req.body.description;
    const catData = await Category.findOne({name:catname});

    if(catData){
      console.log("Category already exists");
      return res.status(400).json({ status: "error", message: "Category already exists" });
    }
    else{
      const newCat = new Category({
        name:catname,
        description: description
      });
      await newCat.save();  
      console.log(newCat);
      return res.render("productCategory",{ creationError:"New Category Added"});
      // showSuccessMessage();
    }
  }catch(error){
    console.error(`Error in createCategory: ${error.message}`);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
}


const categoryBlock = async (req, res) => {
  try {
      console.log("CatBlock");
      const nameCat = req.query.categoryName; // Corrected query parameter name
      const categoryName = await Category.findOne({ name: nameCat });

      if (categoryName.isBlocked === true) {
          const blocked = await Category.findOneAndUpdate({ name: nameCat }, { $set: { isBlocked: false } });
      } else {
          const unblocked = await Category.findOneAndUpdate({ name: nameCat }, { $set: { isBlocked: true } });
      }

      const category = await Category.find({});
      res.render("productCategory", { category });
  } catch (error) {
      console.error("/pageerror", error); // Log the actual error
  }
}


module.exports = {
    getCategory,
    getCategoryEdit,
    createCategory,
    categoryBlock,
    
}