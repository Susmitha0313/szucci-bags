
const generateOtp = ()=>{
    const digits = "1234567890";
    var otp = "";
    for(i=0; i<4; i++){
        otp += digits[Math.floor(Math.random() * 10)];
    }
    console.log("Otp is: "+ otp);
    return otp;
};


const otpExpiryTimer = (req , otp)=>{
    setTimeout(()=>{
        if(req.session.data && req.session.data.otp === otp){
            console.log(otp + " has Expired");
            delete req.session.data.otp; // Remove the expired OTP from session
            req.session.save();
        }
    },1 * 30 * 1000);
};

module.exports = {
    generateOtp,
    otpExpiryTimer};