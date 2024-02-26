
const generateOtp = ()=>{
    const digits = "1234567890";
    var otp = "";
    for(i=0; i<4; i++){
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}


const otpExpiryTimer = (otp, duration)=>{
    setTimeout(()=>{
        delete otp;
        console.log("OTP expired");
    },duration);
};

module.exports = {
    generateOtp,
    otpExpiryTimer};