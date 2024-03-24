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
router.get("/editadrs", isLogged, userController.getusereditAddress);
router.post("/updatePassword", isLogged, userController.saveUpdatedPassword);
router.post("/editAddress", isLogged, userController.editAddress);

router.get("/verify-otp",isLogged,notLog, userController.getVerifyOtpPage);
router.post("/verify-otp",isLogged,notLog, userController.verifyOtp);
router.post("/resend-otp",isLogged,notLog, userController.resendOtp);
router.get("/product-details",isLogged, productController.getProductDetailPage);
  
      
//cart
router.get("/productCart",isLogged, cartController.getCartPage);   
router.post("/addToCart",isLogged, cartController.addToCart);
router.post("/deleteCartItem",isLogged, cartController.deleteCartItem);
router.post("/cartadd",isLogged,cartController.addCart)
router.post("/decrement",isLogged,cartController.decrement)

router.get("/checkout",isLogged, orderController.getCheckoutPage);
router.get("/orderSful",isLogged,orderController.getSfulPage);
router.post("/placeorder",isLogged,orderController.placeOrder);


router.get("/logout",isLogged,  userController.logout);
router.get("/allProductSort",isLogged ,userController.allProductSort)
router.post("/addAddress",isLogged,userController.addNewAddress);

        
// router.get("/wishlist", userController.getWishlist);



module.exports = router;   