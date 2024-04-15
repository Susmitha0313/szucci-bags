const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const Product = require("../models/productSchema");

  
       
const getCategory = async(req,res)=>{
  try{
    const catData = await Category.find({});
    res.render("productCategory", {category : catData});
  }catch(error){
      console.log(error.message);
  }
};


  

// const createCategory = async(req,res)=>{
//   try{
//       const catName = req.body.name;
//       const catDes = req.body.description;
//       const category = await Category.find({})
//       const catData = await Category.find({name: catName});
//       console.log(catName);
//       if(!catData){
//         const newCat = new Category({
//           name: catName,
//           description : catDes,
//         });
//         const savedCat = await newCat.save();
//         return res.render("productCategory",{catAdded: "Category added successfully", category:[savedCat, category]})
//       }else{
//         const catExists = "Category already exists";
//         return res.render("productCategory",{errMsg: catExists});
//       }
//       }catch(error){
//     console.log(error.message);
//     return res.status(500).send("Server Error");
//   }
// }
  

const createCategory = async(req,res)=>{
  try{
    const catName = req.body.name.toLowerCase();
    const catDesc = req.body.description;
    const catdupe = await Category.findOne({name : catName});
    const catData = await Category.find({});
    console.log(catdupe + "dupe dupe");
    console.log(catName,catDesc);
    if(!catdupe){
      const newCat = new Category({
        name: catName,
        description: catDesc,
      });
      const savedCat = await newCat.save();
      console.log(savedCat);
      res.redirect("/admin/category")
    }else{
      console.log("Categort exists")
      return res.render("productCategory",{errMsg:  "Category already exists", category: catData});
    }
  }catch(error){
    return res.status(500).send("Category eists");
  }
}


const getCatEdit = async(req,res)=>{
  try{
    console.log("getCatEdit page");
    const catId = req.params.Id;
    const category =await Category.findById(catId);
    console.log(category);
    if(!category){
      return res.status(404).send("Category not found");
    }
      res.render("productCategEdit",{category});
  }catch(error){
      console.log("/pageerror");
      res.status(500).send('Category Edit Internal Server Error');
  }
}
                                                                       
const categoryEdit = async (req, res) => {
  console.log("update Cat post working ")
  try { 
    const { categName, description, categoryId } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).send("Category not found");
    }

    const existingCategory = await Category.findOne({ name: categName.toLowerCase(), _id: { $ne: categoryId } });
    console.log(categName, description, categoryId, existingCategory);
    const allCategories = await Category.find({});
    console.log("Exist cat......", existingCategory);

    if (existingCategory) {
      return res.render("productCategEdit", { errMessage: "Category Already exists", category });
    } else {
      category.name = categName;
      category.description = description;
      await category.save();
      res.redirect("/admin/category");
    }
  } catch (error) {
    console.error(`Error in updateCategory: ${error.message}`);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};







const categoryBlock = async (req, res) => {
  try {
      console.log("CatBlock");
      const nameCat = req.query.categoryName; // Corrected query parameter name
      const categ = await Category.findOne({ name: nameCat });

      if (categ.isBlocked === true) {
          const blocked = await Category.findOneAndUpdate({ name: nameCat }, { $set: { isBlocked: false } });
      } else {
          const unblocked = await Category.findOneAndUpdate({ name: nameCat }, { $set: { isBlocked: true } });
      }

      const category = await Category.find({});
      res.render("productCategory", {category});
  } catch (error) {
      console.error("/pageerror", error); // Log the actual error
  }
}



const deleteCategory = async (req, res) => {
  try {
    const categoryName = req.query.categoryName;
    const deletedCategory = await Category.findOneAndDelete({ name: categoryName });

    if (!deletedCategory) {
      console.log(`Category "${categoryName}" not found.`);
      return;
    }
    const categoryList = await Category.find({});
    res.render("productCategory", { category: categoryList });
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};





module.exports = {
    getCategory,
    getCatEdit,
    categoryEdit,
    createCategory,
    categoryBlock,
    deleteCategory,
    
}