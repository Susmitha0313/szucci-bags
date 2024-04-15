const express = require("express");
const router = express()
const userController = require("../controller/userController.js");
const cartController = require("../controller/cartController.js");
const productController = require("../controller/productController.js");
const orderController = require("../controller/orderController.js");
const {isLogged} = require("../Authentication/auth") ;
const {notLog} = require("../Authentication/auth");


router.get("/", userController.getHomePage);
router.get("/allProducts",isLogged, userController.getAllProductsPage);

router.get("/pageNotFound", userController.pageNotFound);

router.get("/login", userController.getLoginPage);  
router.post("/login",notLog , userController.userLogin);
    
router.get("/signup", userController.getSignupPage);
router.post("/signup", userController.signupUser);

router.get("/accountDetails",isLogged, userController.getuserAccountDetails);
router.get("/orders",isLogged, userController.getuserOrderDetails);
router.get("/address",isLogged, userController.getuserAddAddress);    
router.get("/wallet",isLogged, userController.getuserWallet);    
router.get("/editadrs", isLogged, userController.getusereditAddress);
router.get("/deleteAdrs", isLogged, userController.deleteAddress);
router.post("/saveAccDetails", isLogged, userController.saveAccDetails);
router.post("/editAddress", isLogged, userController.editAddress);

router.post("/savePswd", isLogged, userController.savepswdChange);

router.get("/verify-otp", userController.getVerifyOtpPage);
router.post("/verify-otp", userController.verifyOtp);
router.post("/resend-otp", userController.resendOtp);
router.get("/product-details",isLogged, productController.getProductDetailPage); 
router.get("/allProductSort",isLogged ,userController.allProductSort);
      
//cart
router.get("/productCart",isLogged, cartController.getCartPage);   
router.post("/addToCart",isLogged, cartController.addToCart);
router.post("/deleteCartItem",isLogged, cartController.deleteCartItem);
router.post("/cartadd",isLogged,cartController.increment);
router.post("/cartsubtract",isLogged,cartController.decrement);
router.post("/clearCartItems",isLogged,cartController.clearCart);


router.get("/checkout",isLogged, orderController.getCheckoutPage);
router.get("/orderSful",isLogged,orderController.getSfulPage);
router.post("/placeorder",isLogged,orderController.placeOrder);
router.get("/viewOrder",isLogged,orderController.viewOrder);
router.post("/cancelorder",isLogged,orderController.cancelOrder);
router.post("/returnorder",isLogged,orderController.returnOrder);
router.post("/applyCoupon",isLogged,orderController.applyCoupon);


router.get("/logout",isLogged,  userController.logout);
router.post("/addAddress",isLogged,userController.addNewAddress);

router.get("/forgetPswd", userController.forgetPswdPage);
router.post("/sendOtp",userController.sentOtp);
router.get("/verify-otp-pswd",userController.getverifypage);
router.post("/verify-otp-pswd",userController.verifyForgPswdOtp);
router.post("/resend-otp-pswd", userController.resendOtpPswd);

router.get("/wishlist",isLogged, userController.getWishlist);
router.post("/wishlist",isLogged, userController.addToWishlist);
module.exports = router;   