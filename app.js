let express = require("express");
const session = require("express-session");
const path=require('path');
const nocache = require("nocache")
const env = require("dotenv");
const mongoose = require("mongoose");
const userRouter = require("./router/userRouter");
const adminRouter = require("./router/adminRouter");
const app = express();
env.config();  
 
const port = process.env.PORT;
const Mongo_Uri = process.env.MONGO_URI;
mongoose.connect(Mongo_Uri);

     
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB Atlas");    
});
  
  
mongoose.connection.on("error", (err) => {      
    console.log("Error connecting to MongoDB");
  })
  
mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
  })
  
app.use(express.json());   
app.use(express.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.use("/assets",express.static(path.join(__dirname,"/assets")))
app.use(express.static(path.join(__dirname,"views")))

app.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized : false,
        cookie:{
            maxAge:72 * 60 * 60* 1000,
            httpOnly: true
        }
    })
);  

app.use("/", nocache());


app.use("/",userRouter);
app.use("/admin", adminRouter);


app.use("/pageNotFound", function (req, res) {
  res.redirect("/pageNotFound");
});



app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}  .....if you are an admin click here http://localhost:${port}/admin/adminlogin`);
})       