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


  

const createCategory = async(req,res)=>{
  try{
      const catName = req.body.name;
      const catDes = req.body.description;
      const category = await Category.find({})
      console.log(category);
      const catData = await Category.find({name: catName});
      
    if(typeof catData != undefined){
       const newCat = new Category({
        name: catName,
        description : catDes
      });
      const savedCat = await newCat.save();
      return res.render("productCategory",{catAdded: "Category added successfully", category:[savedCat, ...category]})
    }else{
      const catExists = "Category already exists";
      return res.render("productCategory",{errMsg: catExists});
    }
  }catch(error){
    console.log(error.message);
    return res.status(500).send("Server Error");
  }
}
  




const getCatEdit = async(req,res)=>{
  try{
    const catId = req.params.Id;
    const category = await Category.findById({_id:catId});
    console.log("cat: "+ category);
    if(!category){
      return res.status(404).send("Category not found");
    }
      res.render("productCategEdit",{category});
  }catch(error){
      console.log("/pageerror");
      res.status(500).send('Category Edit Internal Server Error');
  }
}
                                                                       




//ivde ann error
const categoryEdit = async (req, res) => {
  try {
    const catName = req.body.name;
    const catDes = req.body.description;
    const catId = req.params.Id;
    const existingCategory = await Category.findById({_id:catId});
    console.log("cat: "+ category);
    if(!existingCategory){
      return res.status(404).send("Category not found");
    }
    // Update category properties
    existingCategory.name = catName;
    existingCategory.description = catDes;

    // Save the updated category to the database
    await existingCategory.save();

    // Redirect to the appropriate route after successful update
    res.redirect("/admin/category");
  } catch (error) {
    // Handle any errors that occur during the update process
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