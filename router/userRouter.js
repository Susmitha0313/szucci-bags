const express = require("express");
const router = express()
const userController = require("../controller/userController.js");


router.get("/", userController.getHomePage);

router.get("/pageNotFound", userController.pageNotFound);

router.get("/login", userController.getLoginPage);
router.post("/login", userController.userLogin);

router.get("/signup", userController.getSignupPage);
router.post("/signup", userController.signupUser);

router.get("/verify-otp", userController.getVerifyOtpPage);
router.post("/verify-otp", userController.verifyOtp);
router.post("/resend-otp", userController.resendOtp);

router.get("/product-details", userController.getProductDetailPage);





// router.get("/wishlist", userController.getWishlist);



module.exports = router;