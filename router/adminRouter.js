const express = require("express");
const router = express()
const adminController = require("../controller/adminController.js");


const { isAdmin } = require("../Authentication/auth")  

router.set("view engine" , "ejs")
router.set("views" , "./views/admin")

router.get("/", adminController.getAdminHome);
router.get("/products",isAdmin, adminController.getProducts);
router.get("/userList",isAdmin, adminController.getUserList);
router.get("/addProducts",isAdmin, adminController.getAddProduct);
router.get("/category",isAdmin, adminController.getCategory);
router.get("/logout",isAdmin, adminController.getLogout)

router.get("/adminlogin", adminController.getALoginpage);
router.post("/adminlogin",adminController.adminLogin);

// router.get("/login", adminController.getLoginPage);
// router.post("/login", adminController.adminLogin);

// router.get("/signup", adminController.getSignupPage);
// router.post("/signup", adminController.signupUser);

// router.post("/verify-otp", adminController.verifyOtp);
// router.post("/resend-otp", adminController.resendOtp);

// router.get("/product-details", adminController.getProductDetailPage);





// router.get("/wishlist", adminController.getWishlist);



module.exports = router;


