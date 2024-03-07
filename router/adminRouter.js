const express = require("express");
const router = express();
const adminController = require("../controller/adminController.js");
const categoryController = require("../controller/categoryController.js");
const productController = require("../controller/productController.js");
const brandController = require("../controller/brandController.js");
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


//product routerss
router.get("/products",isAdmin, productController.getProducts);
router.get("/productAdd",isAdmin, productController.getAddProduct);
router.get("/editProduct/:productId", isAdmin, productController.geteditProduct);
router.get("/productBlock", isAdmin,productController.productBlock);
router.post("/productAdd",isAdmin,upload.array("images", 5), productController.addProduct);
router.post("/productEdit",isAdmin,upload.array("images", 5), productController.editProduct);






//category routerss
router.get("/category",isAdmin, categoryController.getCategory);
router.get("/categoryEdit/:Id",isAdmin,categoryController.getCatEdit)
router.get("/categoryBlock",isAdmin, categoryController.categoryBlock);
router.post("/categoryEdit", isAdmin, categoryController.categoryEdit);
router.post("/category",isAdmin ,categoryController.createCategory);



//brands routers
router.get("/brand",isAdmin, brandController.getBrandPage);
router.get("/brandEdit",isAdmin, brandController.getBrandEdit);
router.post("/brand",isAdmin, brandController.createBrand);
router.get("/brandBlock",isAdmin, brandController.brandBlock);



module.exports = router;


