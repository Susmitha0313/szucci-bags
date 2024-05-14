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


const createCategory = async (req, res) => {
  try {
      const catName = req.body.name;
      const catDes = req.body.description;

      // Check if the category name already exists
      const existingCategory = await Category.findOne({ name: catName });
      if (existingCategory) {
          const catExists = "Category already exists";
          const categories = await Category.find({});
          return res.render("productCategory", { errMsg: catExists, category: categories });
      }

      // Generate a unique serial number
      const lastCategory = await Category.findOne({}, {}, { sort: { 'serialNum': -1 } });
      let newSerialNum = 1; // Default serial number if no categories exist yet
      if (lastCategory) {
          newSerialNum = lastCategory.serialNum + 1;
      }

      // Create and save the new category
      const newCategory = new Category({
          name: catName,
          description: catDes,
          serialNum: newSerialNum
      });
      const savedCategory = await newCategory.save();

      const categories = await Category.find({}); // Get all categories again after adding the new one

      return res.render("productCategory", { catAdded: "Category added successfully", category: categories });
  } catch (error) {
      console.log(error.message);
      return res.status(500).send("Server Error");
  }
}


// const createCategory = async(req,res)=>{
//   try{
//     const catName = req.body.name
//     const catDesc = req.body.description;
//     const catdupe = await Category.findOne({name:catName});
//     const catData = await Category.find({});
//     console.log(catdupe + "dupe dupe");
//     if(catdupe){
//       console.log("Categort exists")
//       return res.render("productCategory",{errMsg:  "Category already exists", category: catData});
//     }else{
//       const newCat = new Category({
//         name: catName,  
//         description: catDesc,      
//       });
//       const savedCat = await newCat.save();
//       console.log(savedCat);   
//       res.redirect("/admin/category")
      
//     }
//   }catch(error){
//     return res.status(500).send("Category eists");
//   }
// }

   
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
      console.log("/admin/page-404");
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
      console.error("/admin/page-404", error); // Log the actual error
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