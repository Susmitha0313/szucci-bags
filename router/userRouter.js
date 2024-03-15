const express = require("express");
const router = express()
const userController = require("../controller/userController.js");
const cartController = require("../controller/cartController.js");
const productController = require("../controller/productController.js");
const {isLogged} = require("../Authentication/auth") ;


router.get("/", userController.getHomePage);

router.get("/pageNotFound", userController.pageNotFound);

router.get("/login", userController.getLoginPage);
router.post("/login", userController.userLogin);

router.get("/signup", userController.getSignupPage);
router.post("/signup", userController.signupUser);

router.get("/accountinfo",isLogged, userController.getAccountInfo);

router.get("/verify-otp",isLogged, userController.getVerifyOtpPage);
router.post("/verify-otp",isLogged, userController.verifyOtp);
router.post("/resend-otp",isLogged, userController.resendOtp);

router.get("/product-details",isLogged, productController.getProductDetailPage);

   
//cart
router.get("/productCart",isLogged, cartController.getCartPage);

router.post("/addToCart",isLogged,cartController.addToCart)

router.get("/checkout",isLogged, cartController.getCheckoutPage);


router.get("/logout",isLogged,userController.logout)



// router.get("/wishlist", userController.getWishlist);



module.exports = router;