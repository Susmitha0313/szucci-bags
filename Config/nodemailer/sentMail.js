const nodemailer = require("nodemailer");
const env = require("dotenv");
const Mail = require("nodemailer/lib/mailer");
env.config();
const emailenv = process.env.NODEMAILER_EMAIL
const passwordenv = process.env.NODEMAILER_PASSWORD

const sentOtp = (email, otp)=>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: emailenv,
            pass: passwordenv
        },
    });

    const mailOption = {
        from: emailenv,
        to: email,
        subject: "Your OTP Verification ",
        text: `Your OTP is ${otp}`
    }
    
    transporter.sendMail(mailOption,(error)=>{
        if(error){
            console.log(error);
        }else{
            console.log(`Otp is sent to `, email);

        }
    })
    console.log("Otp is " + otp);
    
}




module.exports = sentOtp;
