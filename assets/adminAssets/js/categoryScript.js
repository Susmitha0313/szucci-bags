const prodName = document.getElementById("productName")
const prodDescri = document.getElementById("productDescription")
const error1 = document.getElementById("error1");
const error2 = document.getElementById("error2");
const createCat = document.getElementById("createCat");


function catNamevalidateCkeck(){
    const name = prodName.value.trim();
    if(name ===""){
        error1.style.display = "block"
        error1.innerHTML="Please enter the name"
    }else{
        error1.style.display = "none"
        error1.innerHTML = ""
    }
}

function catDescvalCheck(){
    const description = prodDescri.value
    if(description.trim()===""){
        error2.style.display = "block"
        error2.innerHTML="Please enter the discription"
    }else{
        error2.style.display = "none"
        error2.innerHTML = ""
    }
}




prodName.addEventListener("blur",catNamevalidateCkeck)
prodDescri.addEventListener("blur",catDescvalCheck)



document.addEventListener("DOMContentLoaded", function(){
    createCat.addEventListener("submit",(e)=>{
        catNamevalidateCkeck();
        catDescvalCheck();
        if (error1.innerHTML || error2.innerHTML ) {
            e.preventDefault();
          }
    })
}
    );