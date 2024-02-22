const express = require("express");
const router = express()
const adminController = require("../controller/adminController.js");

router.set("view engine" , "ejs")
router.set("views" , "./views/admin")

router.get("/", adminController.getAdminHome);
router.get("/products", adminController.getProducts);
router.get("/userList", adminController.getUserList);
router.get("/addProducts", adminController.getAddProduct);
router.get("/account", adminController.getALoginpage);
router.get("/category", adminController.getCategory);

router.post("/login",adminController.adminLogin);

// router.get("/login", adminController.getLoginPage);
// router.post("/login", adminController.adminLogin);

// router.get("/signup", adminController.getSignupPage);
// router.post("/signup", adminController.signupUser);

// router.post("/verify-otp", adminController.verifyOtp);
// router.post("/resend-otp", adminController.resendOtp);

// router.get("/product-details", adminController.getProductDetailPage);





// router.get("/wishlist", adminController.getWishlist);



module.exports = router;


