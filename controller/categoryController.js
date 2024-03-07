const Category = require("../models/categorySchema");
const Product = require("../models/productSchema");

  
       
const getCategory = async(req,res)=>{
  try{
    const catData = await Category.find({});
      res.render("productCategory", {category : catData});
  }catch(error){
      console.log(error.message);
  }
};




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
  


//ivde ann error
const categoryEdit = async (req, res) => {
  try {
    console.log("ivde category kitunilla....")
    const catId = req.params.Id; // Assuming the parameter is 'id', not 'Id'
    const catName = req.body.name;
    const catDes = req.body.description;

    // Find the category by its ID
    const existingCategory = await Category.findById(catId);

    if (!existingCategory) {
      return res.status(404).json({ status: 'error', message: 'Category not found' });
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


module.exports = {
    getCategory,
    getCatEdit,
    categoryEdit,
    createCategory,
    categoryBlock,
    
}