const express = require("express");
const router = express();
const adminController = require("../controller/adminController.js");
const categoryController = require("../controller/categoryController.js");
const productController = require("../controller/productController.js");
const { isAdmin } = require("../Authentication/auth")  

router.set("view engine" , "ejs")
router.set("views" , "./views/admin")


router.get("/pageerror", adminController.pageNotFound);

router.post("/logout",isAdmin, adminController.getALoginpage);
// router.get("/",isAdmin, adminController.getAdminHome);
router.get("/products",isAdmin, adminController.getProducts);
router.get("/userList",isAdmin, adminController.getUserList);
router.get("/addProducts",isAdmin, adminController.getAddProduct);
router.get("/logout",isAdmin, adminController.getLogout);

router.get("/adminlogin", adminController.getALoginpage);
router.post("/adminlogin",adminController.adminLogin);

router.get("/adminhome", adminController.getAdminHome)


//category routerss
router.get("/category",isAdmin, adminController.getCategory);
router.get("/categoryEdit",isAdmin, adminController.getCategoryEdit);
router.post("/productCategory", categoryController.addCategory);

//AdminUserManagment router
router.put("/user/block/:userId",isAdmin, adminController.blockUser);
router.put("/user/unblock/:userId",isAdmin, adminController.unblockUser);



module.exports = router;


