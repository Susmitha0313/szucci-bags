const express = require("express");
const router = express()
const userController = require("../controller/userController.js");
// const passport = require("passport");

router.set("views", "views/user");


router.get("/login", userController.getLoginPage);
router.post("/login", userController.userLogin);

router.get("/signup", userController.getSignupPage);
router.post("/signup", userController.getSignupPage);

router.get("/", userController.getHomePage);
router.get("/wishlist", userController.getWishlist);



// router.get("/login/success",(req,res)=>{
//     if(req.user){
//         req.status(300).json({
//             error:false,
//             message:"Successfully loged in",
//             user:req.user,
//         });
//     }else{
//         req.status(403).json({error:true, 
//             message:"Not Authorized"});
//     }
// });



// router.get("/login/failed",(req,res)=>{
//     res.status(401).json({
//         error:true,
//         message:"Log in failure",
//     })
// })


// router.get(
//     "/google/callback",
//     passport.authenticate("google",{
//         successRedirect:process.env.CLIENT_URL,
//         failureRedirect:"/login/failed",
//     })
//  )



//  router.get("/google",passport.authenticate("google",["profile","email"]));

//  router.get("/logout",(req,res)=>{
//     req.logout();
//     req.redirect(process.env.CLIENT_URL);
//  });

 
module.exports = router;