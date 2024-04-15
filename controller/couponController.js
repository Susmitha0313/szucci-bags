const Coupon = require("../models/couponSchema");
const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");

  
       
const getCouponPage = async(req,res)=>{
  try{
    const couponData = await Coupon.find({});
    console.log(couponData);
    res.render("couponPage",{couponData});
  }catch(error){
      console.log(error.message);
  }
};



const addNewCoupon = async(req,res)=>{
    try{
        const couponData = await Coupon.find({});
        console.log(couponData);
        res.render("couponAdd",{couponData});
    }catch(error){
        console.log(error.message);
    }
};



const createCoupon = async (req, res) => {
    try {
        const { couponName, startDate, endDate, minBuyRate, maxBuyRate, discountPercent } = req.body;
        console.log(couponName, startDate, endDate, minBuyRate, maxBuyRate, discountPercent)
        let couponCode = generateCouponCode(15);
        console.log("Generated Coupon Code:", couponCode);

        const existCoupon = await Coupon.findOne({ couponName: couponName });
        if (!existCoupon) {
            const newCoupon = new Coupon({
                couponName,
                coupencode : couponCode, // Assign unique coupon code to couponCode field
                startDate,
                endDate,
                minBuyRate,
                maxBuyRate,
                discountPercentage : discountPercent,
            });
            const savedCoupon = await newCoupon.save();
            console.log("Saved Coupon:", savedCoupon);
            res.redirect("/admin/couponPage");
        } else {
            res.status(200).json({ status: false, message: "Coupon with this name already exists" });
        }
    } catch (error) {
        console.error("Error creating coupon:", error);
        res.status(500).json({ status: false, error: "Failed to create coupon" });
    }
}



function generateCouponCode(length) {
    const prefix = "szucci";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let couponCode = prefix;
    for (let i = 0; i < length - prefix.length; i++) {
        couponCode += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return couponCode;
}

// const getCatEdit = async(req,res)=>{
//   try{
//     console.log("getCatEdit page");
//     const catId = req.params.Id;
//     const category =await Category.findById(catId);
//     console.log(category);
//     if(!category){
//       return res.status(404).send("Category not found");
//     }
//       res.render("productCategEdit",{category});
//   }catch(error){
//       console.log("/pageerror");
//       res.status(500).send('Category Edit Internal Server Error');
//   }
// }
                                                                       
// const categoryEdit = async (req, res) => {
//   console.log("update Cat post working ")
//   try { 
//     const { categName, description, categoryId } = req.body;
//     const category = await Category.findById(categoryId);
//     if (!category) {
//       return res.status(404).send("Category not found");
//     }

//     const existingCategory = await Category.findOne({ name: categName.toLowerCase(), _id: { $ne: categoryId } });
//     console.log(categName, description, categoryId, existingCategory);
//     const allCategories = await Category.find({});
//     console.log("Exist cat......", existingCategory);

//     if (existingCategory) {
//       return res.render("productCategEdit", { errMessage: "Category Already exists", category });
//     } else {
//       category.name = categName;
//       category.description = description;
//       await category.save();
//       res.redirect("/admin/category");
//     }
//   } catch (error) {
//     console.error(`Error in updateCategory: ${error.message}`);
//     return res.status(500).json({ status: 'error', message: 'Internal server error' });
//   }
// };







// const categoryBlock = async (req, res) => {
//   try {
//       console.log("CatBlock");
//       const nameCat = req.query.categoryName; // Corrected query parameter name
//       const categ = await Category.findOne({ name: nameCat });

//       if (categ.isBlocked === true) {
//           const blocked = await Category.findOneAndUpdate({ name: nameCat }, { $set: { isBlocked: false } });
//       } else {
//           const unblocked = await Category.findOneAndUpdate({ name: nameCat }, { $set: { isBlocked: true } });
//       }

//       const category = await Category.find({});
//       res.render("productCategory", {category});
//   } catch (error) {
//       console.error("/pageerror", error); // Log the actual error
//   }
// }



// const deleteCategory = async (req, res) => {
//   try {
//     const categoryName = req.query.categoryName;
//     const deletedCategory = await Category.findOneAndDelete({ name: categoryName });

//     if (!deletedCategory) {
//       console.log(`Category "${categoryName}" not found.`);
//       return;
//     }
//     const categoryList = await Category.find({});
//     res.render("productCategory", { category: categoryList });
//   } catch (error) {
//     console.error("Error deleting category:", error);
//   }
// };





module.exports = {
    getCouponPage,
    addNewCoupon,
    createCoupon,

    // getCatEdit,
    // categoryEdit,
    // createCategory,
    // categoryBlock,
    // deleteCategory,
    
}