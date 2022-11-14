class DeliveryForm{
    constructor(validator){
        const name  =document.querySelector('.user_details:nth-child(1) .input-box:nth-child(1) input')
        const surname = document.querySelector('.user_details:nth-child(1) .input-box:nth-child(2) input')
        const deliveryDate =  document.querySelector('input.datepicker-input')
        const dateTextInput =  document.querySelector('form .date-input-text')
        const street = document.querySelector('.user_details:nth-child(3) .input-box:nth-child(1) input')
        const house = document.querySelector('.user_details:nth-child(3) .input-box:nth-child(2) input')
        const flat = document.querySelector('.user_details:nth-child(3) .input-box:nth-child(3) input')
        const payment = document.querySelectorAll('.choose-box input[type=radio]')
        const gifts =  document.querySelectorAll('.options input[type=checkbox]')
        this.validator = validator;
        this.buildListeners({name, surname,deliveryDate,dateTextInput, street, house, flat, payment, gifts})
        this. setAttributes(deliveryDate);
    }
    buildListeners(formElements){
        formElements.name.addEventListener('change',(e)=>{ this.validator.checkName(e)},false)
        formElements.surname.addEventListener('change',(e)=>{ this.validator.checkSurname(e)},false)
        formElements.deliveryDate.addEventListener('change',(e)=>{ this.validator.checkDeliveryDate(e)},false)
        formElements.dateTextInput.addEventListener('change',(e)=>{ this.validator.checkDeliveryDateText(e)},false)
        formElements.street.addEventListener('change',(e)=>{ this.validator.checkStreet(e)},false)
        formElements.house.addEventListener('change',(e)=>{ this.validator.checkHouse(e)},false)
        formElements.flat.addEventListener('change',(e)=>{ this.validator.checkFlat(e)},false)
        formElements.gifts.forEach(box=>box.addEventListener('change',(e)=>{this.validator.checkGiftsAmount(e,formElements.gifts)},false))
    }
    setAttributes(deliveryDate){
        const minDeliveryDate = new Date()
        minDeliveryDate.setDate(minDeliveryDate.getDate() + 1)
        deliveryDate.setAttribute("min",`${minDeliveryDate.getFullYear()}-${minDeliveryDate.getMonth()+1}-${minDeliveryDate.getDate()}`)
    }
    onSubmit(){
        return this.validator.isValid()
    }
    
 }
 class Validator {
   constructor() {}
   isValid() {
     try {
       return this.checkName()
         .checkSurname()
         .checkDeliveryDate()
         .checkStreet()
         .checkHouse()
         .checkFlat()
         .checkPayment()
         .checkGiftsAmount();
     } catch (error) {
       console.log(error);
       return false;
     }
   }
   //    Name (mandatory, the length not less than 4 symbols, strings only, without spaces)
   //    Surname (mandatory, the length not less than 5 symbols, strings only, without spaces)
   //    Delivery date(mandatory, not earlier than next day)
   //    Street (mandatory, the length not less than 5 symbols, the numbers are allowed)
   //    House number(mandatory, numbers only, positive numbers only)
   //    Flat number(mandatory, numbers only, positive numbers only, the dash symbol is allowed. Means, the flat number shouldn't start with minus/dash symbol. For example: -37 is invalid, but 1-37 is valid)

   checkName = (e) => {
      return /^[a-zA-Z]{4,100}$/.test(e.currentTarget.value) ? this : false;
   };
   checkSurname = (e) => {
      return /^[a-zA-Z]{5,100}$/.test(e.currentTarget.value) ? this : false;
   };
   
   checkDeliveryDate = (e) => {
        const value = e.currentTarget.value;
        const regex = new RegExp("(0[1-9]|(1[0-9])|2[0-9]|3[0,1])-(0[1-9]|1[0-2])-([0-9]{4})");
        const dateStr= value.replace(/(\d{4})-(\d{1,2})-(\d{1,2})/,"$3-$2-$1")
        const deliveryDate = new Date(value);
        const result =( regex.test(dateStr) && deliveryDate.getTime() > new Date().getTime() )
        const inputDateStr=e.target.parentElement.parentElement.children[1]
        result? inputDateStr.value=dateStr : inputDateStr.value='';
        return result;
   };

   checkDeliveryDateText=(e)=>{
        const value = e.currentTarget.value;
        const regex = new RegExp("(0[1-9]|(1[0-9])|2[0-9]|3[0,1])-(0[1-9]|1[0-2])-([0-9]{4})");
        const dateStr= value.replace(/(\d{1,2})\W(\d{1,2})\W(\d{4})/,"$3-$2-$1")
        const deliveryDate = new Date(dateStr);
        const result =( regex.test(value) && deliveryDate.getTime() > new Date().getTime() )
        const datePicker=document.querySelector('input.datepicker-input')
        result? datePicker.value=dateStr : e.currentTarget.value='';
        return result;
   }

   checkStreet = (e) => {
    return /^[a-zA-Z]||[0-9]{5,100}$/.test(e.currentTarget.value) ? this : false;
   };
   checkHouse = (e) => {
     console.log(e.currentTarget.value);
   };
   checkFlat = (e) => {
     console.log(e.currentTarget.value);
   };
   checkPayment = (e) => {
     console.log(e.currentTarget.value);
   };

   checkGiftsAmount = (e, checkboxes) => {
     const el = e.currentTarget;
     let quantityChecked = 0;
     checkboxes.forEach((element) => {
       element.checked && quantityChecked++;
     });
     if (el.checked) {
       quantityChecked > 2 ? (el.checked = false) : (el.checked = true);
     }
   };
 }
 new DeliveryForm(new Validator());