const toggleClassActive=(className)=>{
    document.querySelectorAll('.active').forEach(el=>{
        el.classList.remove("active")
    })
    document.querySelectorAll('.'+className).forEach(el=>{
        el.classList.add("active")
    })
}
const btnSubmit =document.querySelector('.submit-btn')
const email=document.getElementById('email');
email.addEventListener('keyup',()=>{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)){
      btnSubmit.classList.remove('mistake')
      btnSubmit.classList.add('active')
    }else{
        btnSubmit.classList.remove('active')
        btnSubmit.classList.add('mistake')
    }
      
})
const checkEmail=()=>{
    if(btnSubmit.classList.contains('active')){
        btnSubmit.classList.remove('active')
        email.value=""
    }
}