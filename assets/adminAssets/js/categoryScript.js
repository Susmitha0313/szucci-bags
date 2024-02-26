const prodName = document.getElementById("product-name")
const prodDescri = document.getElementById("product_description")
const error1 = document.getElementById("error1");
const error2 = document.getElementById("error2");


function catNamevalidateCkeck(){
    const name = prodName.value
    if(name.trim()===""){
        error1.style.display = "block"
        error1.innerHTML="Please enter the name"
    }else{
        error1.style.display = "none"
        error1.innerHTML = ""
    }
}

function catDescvalCheck(){
    const name = prodName.value
    if(name.trim()===""){
        error1.style.display = "block"
        error1.innerHTML="Please enter the discription"
    }else{
        error1.style.display = "none"
        error1.innerHTML = ""
    }
}




prodName.addEventListener("blur",catNamevalidateCkeck)
prodDescri.addEventListener("blur",catDescvalCheck)



document.addEventListener("DOMContentLoaded", function(){
  
        emailvalidateCheck();
        passValidateCheck();
        if (error2.innerHTML || error4.innerHTML ) {
            e.preventDefault();
          }
        }
    );