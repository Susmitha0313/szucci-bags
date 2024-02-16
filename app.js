let express = require("express");
const session = require("express-session");
const path=require('path');
const env = require("dotenv");
// const passport = require("passport");
// const cors = require("cors");
// const cookieSession = require("cookie-session");
// const passportSetup = require("./controller/passport");
const router = require("./router/userRouter");


env.config();

const fs = require("fs");

const port = 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.use("/assets",express.static(path.join(__dirname,"/assets")))
app.use(express.static(path.join(__dirname,"views")))

app.use(
    session({
        secret:process.env.SESSION_KEY,
        resave: false,
        saveUninitialized : false,
        cookie:{
            maxAge:72 * 60 * 60* 1000,
            httpOnly: true
        },
    })
);

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(
//     cors({
//         origin:"http://localhost:3000",
//         methods:"GET,POST,PUT,DELETE",
//         credentials:true
//     })
// );

app.use("/userRouter",router);


// const port2 = process.env.PORT || 8080;
// app.listen(port, ()=>console.log(`Listening on port ${port2}`));

const userRoute =require("./router/userRouter");
app.use("/",userRoute);



app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
})