const toggleClassActive=(className)=>{
    document.querySelectorAll('.active').forEach(el=>{
        el.classList.remove("active")
    })
    document.querySelectorAll('.'+className).forEach(el=>{
        el.classList.add("active")
    })
}
const btnSubmit =document.querySelector('.submit-btn')
const amount =document.querySelector('.sum')
const amount_rbtn =document.querySelectorAll('.amount-radio')
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
[...amount.children].forEach(li=>{
    li.addEventListener('click',()=>{
        document.querySelector('.active-amount').classList.remove('active-amount')
        li.classList.add('active-amount')
        document.querySelector(`.s${li.dataset.amount}`).children.item(0).checked=true
    })
})
amount_rbtn.forEach(el=>{
    el.addEventListener('click',()=>{
        document.querySelector('.active-amount').classList.remove('active-amount')
        document.querySelector(`#l-${el.value}`).classList.add('active-amount')
    })
})

console.log('Hello reviewer, if you have any questions or I have some mistakes, please let me know. WhatsApp,Viber,telegram - +375296533196, Discord - IharVypau(@IharVypau)')