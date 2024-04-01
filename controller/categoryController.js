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
    const catName = req.body.name;
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
    const catName = req.body.categName;
    const catDesc = req.body.description;
    const catId = req.body.categoryId;
    const existingCategory = await Category.findById(catId); 
    console.log(catName, catDesc, catId, existingCategory)
    const allCategories = await Category.find({});
    console.log("Exist cat......" + existingCategory);

    if (!existingCategory) {
      return res.status(404).send("Category not found");
    }
    if (catName !== existingCategory.name) {
      const categoryWithName = await Category.findOne({ name: catName });
      if (categoryWithName) {
        return res.render("productCategEdit", { errMsg: "Category name already exists", category: allCategories });
      }
    }
    existingCategory.name = catName;
    existingCategory.description = catDesc;
    await existingCategory.save();
    res.redirect("/admin/category");
  } catch (error) {
    console.error(`Error in updateCategory: ${error.message}`);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};






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
      res.render("productCategory", {category});
  } catch (error) {
      console.error("/pageerror", error); // Log the actual error
  }
}



const deleteCategory = async (req, res) => {
  try {
    const categoryName = req.query.categoryName;
    
    // Assuming Category is the Mongoose model for categories
    const deletedCategory = await Category.findOneAndDelete({ name: categoryName });

    if (!deletedCategory) {
      // Handle case where the category does not exist
      console.log(`Category "${categoryName}" not found.`);
      // Redirect or render an error page
      // Example: res.redirect("/error");
      return;
    }

    // After deletion, you may want to update related data or perform other actions.

    // Fetch the updated category list after deletion
    const categoryList = await Category.find({});

    // Render the page with the updated category list
    res.render("productCategory", { category: categoryList });
  } catch (error) {
    console.error("Error deleting category:", error);
    // Render an error page or redirect to an error page
    // Example: res.redirect("/error");
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