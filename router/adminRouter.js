const express = require("express");
const router = express();
const adminController = require("../controller/adminController.js");
const categoryController = require("../controller/categoryController.js");
const productController = require("../controller/productController.js");
const { isAdmin } = require("../Authentication/auth")  
const upload = require("../Config/multer folder/multer.js")

router.set("view engine" , "ejs")
router.set("views" , "./views/admin")


router.get("/pageerror", adminController.pageNotFound);



router.get("/userList",isAdmin, adminController.getUserList);
router.get("/logout",isAdmin, adminController.getLogout);
router.post("/logout",isAdmin, adminController.getALoginpage);
router.get("/adminlogin", adminController.getALoginpage);
router.post("/adminlogin",adminController.adminLogin);

router.get("/adminhome", adminController.getAdminHome)


router.get("/userBlock", adminController.userBlock);

//category routerss
router.get("/category",isAdmin, categoryController.getCategory);
router.get("/categoryEdit",isAdmin, categoryController.getCategoryEdit);
router.post("/category", categoryController.createCategory);
router.get("/categoryBlock",categoryController.categoryBlock);

//product routerss
router.get("/products",isAdmin, productController.getProducts);
router.get("/addProducts",isAdmin, productController.getAddProduct);
router.post("/addProduct",isAdmin,upload.array("images", 5), productController.addProduct);
router.get("/productBlock", isAdmin,productController.productBlock);
router.get("/editProduct/:productId", isAdmin, productController.geteditProduct);





//AdminUserManagment router
// router.put("/user/block/:userId",isAdmin, adminController.blockUser);
// router.put("/user/unblock/:userId",isAdmin, adminController.unblockUser);



module.exports = router;


