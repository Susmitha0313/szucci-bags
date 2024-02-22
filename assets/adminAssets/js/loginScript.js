const emailid = document.getElementById('emailAdmin')
const passid = document.getElementById('passAdmin')
const loginAdminid = document.getElementById('loginAdmin')
const error2 = document.getElementById('error2')
const error4 = document.getElementById('error4')


function emailvalidateCheck(){
    const emailval = emailid.value 
    const emailpattern = /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
    if(!emailpattern.test(emailval)){
        error2.style.display = "block"
        error2.innerHTML = "Invalid Format"
    }else{
        error2.style.display = "none"
        error2.innerHTML=""
    }
}

function passValidateCheck(){
    const passval = passid.value
    const alpha = /[a-zA-Z]/
    const digit = /\d/
    if(passval.length < 6){
        error4.style.display = "block"
        error4.innerHTML = "Should contain atleast 6 characters"
    }else if(!alpha.test(passval) || !digit.test(passval)){
        error4.style.display = "block"
        error4.innerHTML = "Should contain numbers an alphabets"
    }else if(passval.trim()===""){
        error4.style.display = "block"
        error4.innerHTML = "Please enter the password"
    }else{
        error4.style.display = "none"
        error4.innerHTML = ""
    }
}


emailid.addEventListener("blur",emailvalidateCheck)
passid.addEventListener("blur",passValidateCheck)

document.addEventListener("DOMContentLoaded", function(){



    loginAdminid.addEventListener("submit", function(e){
        emailvalidateCheck();
        passValidateCheck();
        if (error2.innerHTML || error4.innerHTML ) {
            e.preventDefault();
          }
    
    });
});