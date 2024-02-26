const emailid = document.getElementById('typeEmailX')
const nameid = document.getElementById('typeNameX')
const mobileid = document.getElementById('typeMobileX')
const passid = document.getElementById('typePasswordX')
const passid2 = document.getElementsById('typeRepasswordX')
const error1 = document.getElementById('error1')
const error2 = document.getElementById('error2')
const error3 = document.getElementById('error3')
const error4 = document.getElementById('error4')
const error5 = document.getElementById('error5')
const signform = document.getElementById('signform')
const timerElement = document.getElementById("timer")


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


function nameValidateCheck(){
    const nameval = nameid.value
    if(nameval.trim()===""){
        error1.style.display = "block"
        error1.innerHTML="Please enter the name"
    }else{
        error1.style.display = "none"
        error1.innerHTML = ""
    }
}


function passwordConfirmSame(){
    const pw1 = passid.value
    const pw2 = passid2.value
    if(pw1 != pw2){
        error5.style.display = "block"
        error5.innerHTML= "Passwords did not match"
    }else{
        error5.style.display = "none"
        error5.innerHTML= "";
    }
}


function phonenumValCheck(){
    const mobileval = mobileid.value
    const regex = /^\d{10}$/;
    if(mobileval.trim()===""){
        error3.style.display = "block"
        error3.innerHTML = "Please enter the mobile number"
    }else if(mobileval.length < 10 || mobileval.length > 10){
        error3.style.display = "block"
        error3.innerHTML = "Number must be between 10 digits"
    }else if(!regex.test(mobileval) || mobileval === "0000000000"){
        error3.style.display = "block"
        error3.innerHTML = "invalid format"
    }else{
        error3.style.display="none"
        error3.innerHTML=""
    }
}



emailid.addEventListener("blur",emailvalidateCheck)
nameid.addEventListener("blur",nameValidateCheck)
mobileid.addEventListener("blur",phonenumValCheck)
passid.addEventListener("blur",passValidateCheck)

document.addEventListener("DOMContentLoaded", function(){
    signform.addEventListener("submit", function(e){
        emailvalidateCheck();
        nameValidateCheck();
        phonenumValCheck();
        passValidateCheck();    
        passwordConfirmSame();

      
        console.log(emailid, nameid, mobileid, passid, error1,error2,error3,error4,signform);
        if(!emailid || !nameid || !mobileid || !passid || !error1 || !error2 || !error3 || !error4 || !signform){
            console.log("fill all boxes in there");
            alert("if in prevent")
        }
        if (error1.innerHTML || error2.innerHTML || error3.innerHTML || error4.innerHTML || error5.innerHTML) {
            e.preventDefault();
          }
    
    });
});





