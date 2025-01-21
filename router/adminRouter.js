const express = require("express");
const router = express();
const adminController = require("../controller/adminController.js");
const categoryController = require("../controller/categoryController.js");
const productController = require("../controller/productController.js");
const brandController = require("../controller/brandController.js");
const orderController = require("../controller/orderController.js");
const couponController = require("../controller/couponController.js");
const { isAdmin } = require("../Authentication/auth")  
const upload = require("../Config/multer folder/multer.js")
const {adminNotLog} = require("../Authentication/auth");

router.set("view engine" , "ejs")
router.set("views" , "./views/admin")

   
router.get("/pageerror", adminController.pageNotFound);

   
   
router.get("/userList",isAdmin, adminController.getUserList);
router.get("/logout",isAdmin, adminController.getLogout);    
router.post("/logout",isAdmin, adminController.getALoginpage);
router.get("/adminlogin", adminController.getALoginpage);
router.post("/adminlogin",adminNotLog,adminController.adminLogin);
router.get("/adminhome", adminController.getAdminHome)
router.get("/userBlock", adminController.userBlock);
router.get("/catChart", isAdmin, adminController.catChart);
router.get("/prodOfferPage",isAdmin,adminController.getProdOfferPage);
router.get("/catOfferPage",isAdmin,adminController.getCategOfferPage);



// router.get("/editOffer/:id",isAdmin,adminController.getOfferEdit);
// router.post("/editOffer",isAdmin,adminController.saveEditOffer);
router.post("/prodofferadd",isAdmin,adminController.prodOfferSave);
router.post("/catofferadd",isAdmin,adminController.categOfferSave);
router.get('/offerSet',isAdmin, adminController.applyOrRemoveOffer);
router.get('/catOfferSet',isAdmin, adminController.applyOrRemoveOfferCat);

//product routerss   
router.get("/products",isAdmin, productController.getProducts);
router.get("/productInfo/:productId",isAdmin, productController.getProInfoPage);
router.get("/productAdd",isAdmin, productController.getAddProduct);
router.get("/editProduct/:productId", isAdmin, productController.geteditProduct);
router.get("/productBlock", isAdmin,productController.productBlock);
router.post("/productAdd",isAdmin,upload.array("images", 5), productController.addProduct);
router.post("/productEdit/:productId", isAdmin, upload.array("images", 5), productController.editProduct);
router.get("/deleteProduct",isAdmin, productController.productDelete);
router.post("/deleteImage",isAdmin, productController.deleteOne);



//category routerss
router.get("/category",isAdmin, categoryController.getCategory);
router.get("/categoryEdit/:Id",isAdmin,categoryController.getCatEdit)
router.get("/categoryBlock",isAdmin, categoryController.categoryBlock);
router.post("/categoryEdit", isAdmin, categoryController.categoryEdit);
router.post("/category",isAdmin ,categoryController.createCategory);
router.get("/deleteCategory",isAdmin ,categoryController.deleteCategory);

//orders routerss
router.get("/ordersList",isAdmin,orderController.getAdminOrderPage)
router.get("/orderEdit",isAdmin,orderController.getOrdereditPage);
router.post("/changeOrderStatus",isAdmin,orderController.statusChange);
router.get("/deleteOrder",isAdmin,orderController.deleteOrder);
router.post("/acceptorReject",isAdmin,orderController.acceptorReject);
router.get("/searchOrders",isAdmin,orderController.searchOrder);

//coupon routers
router.get("/couponPage",isAdmin,couponController.getCouponPage);
router.get("/couponAdd",isAdmin,couponController.addNewCoupon);
router.post("/couponAdd",isAdmin,couponController.createCoupon);


//brands routers
router.get("/brand",isAdmin, brandController.getBrandPage);
// router.get("/brandEdit",isAdmin, brandController.getBrandEdit);
router.post("/brand",isAdmin, brandController.createBrand);
router.get("/brandBlock",isAdmin, brandController.brandBlock);
router.get("/deleteBrand",isAdmin, brandController.deleteBrand);

//sales
router.get("/salesreport", isAdmin,adminController.getSalesPage);
router.get("/filterSelect",isAdmin, adminController.filterOrders);

module.exports = router;


