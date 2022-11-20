
class Book{
  constructor(id,title, description,authors, imgUrl,price){
    this.id=id
    this.title=title
    this.description=description
    this.authors=authors
    this.imgUrl=imgUrl
    this.price=price
    this._amount=1
    this.isLiked=false
  }
  set like(like=false){
    this.isLiked = like;
  }
  get like(){
    return this.isLiked
  }

  set amount(amount){
    this._amount = amount;
  }
  get amount(){
    return this._amount
  }
}
class User{
  construct(){
    this.name='';
    this.surname='';
    this.order={};
    this.deliveryAdress;
  }
  set name(name){
    this.name = name
  }
  get name(){
    return this.name
  }
  set surname(surname){
    this.surname = surname
  }
  get surname(){
    return this.surname
  }
 
  set deliveryAdress(adress){
    this.deliveryAdress = adress
  }
  get deliveryAdress(){
    return this.deliveryAdress
  }
}

  class CardsServise{
    constructor(userService,cardComponent=null){
      this.cardsHTML = []
      this.cards =new Map()
      this.fragment= document.createDocumentFragment();
      this.cardComponent=cardComponent;
      this.userService=userService;
    }

    async loadItems(){
      await fetch('./assets/books.json')
      .then(response => response.json())
      .then(booksJSON => {
        this.renderBooks(booksJSON);
      })
    }

    renderBooks(books){
      this.content = document.getElementById("container")
      const wrapper = this.cardComponent.createElement('div',' bd-grid cards_wrapper split left')
      books.forEach((book,index) => {
        const bookObj= new Book(book.isbn,book.title,book.shortDescription,book.authors,book.thumbnailUrl,'90')
        const card = this.cardComponent.generateCard(book,book.isbn)
        this.cardsHTML.push(card)
        this.fragment.appendChild(card)
        this.cards.set(book.isbn,bookObj)
      })
      wrapper.appendChild(this.fragment)
      this.content.append(wrapper);   
      
      this.content.addEventListener('click',(event)=>{
        this.updateData()
      },false);
    }

    updateData(id){
      document.querySelector('.cart_items').innerText=this.userService.orderList.size
      //document.querySelector('.like_items').innerText=this.userService.favouritsList.size
    }
    
    showBookLists(el){
      const cart = document.querySelector('.cart')
      if(![...el.classList].includes('active')){
          el.classList.add('active')
          this.cardComponent.buildUserCart()
          cart.classList.add('active')
          const closeCart = document.querySelector('#cart-close')
          closeCart.addEventListener('click',()=>{
          cart.classList.remove('active')
          el.classList.remove('active')
        },false)
      }else{
        cart.classList.remove('active')
        el.classList.remove('active')
      }
    }

    // backToCatalog(){
    //   document.querySelector('.cart').classList.remove('active')
    //   document.getElementById('book-list').classList.remove('showLists');
    //   [...document.querySelectorAll('.book-list')].forEach(el=>el.innerHTML='');
    //   this.cardsHTML.forEach((card)=>{ this.content.appendChild(card) })
    // }
    // setHandler(el,event_type,fn,args){
    //   el.addEventListener(event_type,fn.bind(null,el,args,this,this.userService))
    // }
  }
  
  class UserServise{
    constructor(){
      this.orderList = new Map();
      this.favouritsList=new Map();
      this.catalog=null;
    }
    // handleOrder(el,id,cardService,userServise){
    //   userServise.orderList.has(id) ?  userServise.removeBookfromOrder(id) :  userServise.addBookToOrder(id);
    //   el.classList.add('selected');
    // }

    // handleLike(el,id,cardService,userServise){
    //   let book = cardService.cards.get(id)
    //   userServise.favouritsList.has(id) ?  userServise.removeLike(book, id) :  userServise.addLike(book, id);
    //   el.classList.toggle('selected');
    // }

    addBookToOrder(id){
      const book = this.catalog.cards.get(id)
      this.orderList.set(id,book)
    }
    removeBookfromOrder(id){
      this.orderList.delete(id)
    }
    
    // addLike(book,id){
    //   book.like=true;
    //   this.favouritsList.set(id,book)
    // }
    // removeLike(book,id){
    //   book.like=false;
    //   this.favouritsList.delete(id)
    // }
    
    setAmount(amount,id){
      const book = this.orderList.get(id)
      book.amount=amount;
    }
    getTotalSum(){
      return  [...this.orderList.values()].reduce((sum,book)=>sum+(Number(book.price)*book.amount),0)
    }
    getBookFromOrder(id){
      return this.orderList.get(id)
    }
  }

  class CardComponent{
    constructor(cardsService,userServise){
      this.cardsService=cardsService
      this.userServise=userServise
    }
    generateCard(book,id){
      const card = this.createElement('article','card','',{'id':book.isbn})
      const card_container = this.createElement('div','card_container')
      const card_img = this.createElement('div','card__img','',{ 'draggable':'true',"ondragstart":`cardComponent.drag(event,'${book.isbn}')`});
      const card_info = this.createElement('div','card__precis card__preci--now');
      const img = this.createElement('img','','',{src:book.thumbnailUrl})
      // const more_btn = this.createElement('p','show_more',"SHOW MORE");
      const link_1 = this.createElement('a','card__icon','',{'data-index':id,'data-icon':'cart'});
      const icon_cart= this.createElement('i','bx bx-cart-alt')
      //const link_2 = this.createElement('a','card__icon','',{'data-index':index,'data-icon':'heart'});
      //const icon_heart= this.createElement('i','','',{name:'heart-outline'})
      const card_price= this.createElement('div','card_price')
      const card_title=this.createElement('p','card_title',book.title,{ 'onclick':`openPopup("${id}");`});
      const card_authors=this.createElement('p','card_authors',book.authors.join(', '));
      const card_price_span= this.createElement('span','','$990.00')
    
      card_img.appendChild(img)
      // card_name.appendChild(more_btn);
      link_1.appendChild(icon_cart);
      //link_2.appendChild(icon_heart);
      card_info.appendChild(link_1)
      card_info.appendChild(card_price)
      //card_info.appendChild(link_2)
      card_price.appendChild(card_price_span)
      card.append(card_container)
      card_container.appendChild(card_img)
      card_container.appendChild(card_authors)
      card_container.appendChild(card_title)
      card_container.appendChild(card_info)
      link_1.onclick=(el)=>{
        this.userServise.addBookToOrder(el.currentTarget.dataset.index);
        this.buildUserCart()
        this.updateTotal()
        el.currentTarget.classList.add('active');
      }
     return card;
    }
    
    createElement(el,class_name="",text="",atrrs={}){
      const element= document.createElement(el)
      element.className=class_name;
      element.innerHTML=text
      for(let attr in atrrs){
        element.setAttribute(attr,atrrs[attr])
      }
      return element;
    }

  buildUserCart(){
    const cart_content = document.querySelector('.cart-content')
    cart_content.innerHTML = ""
    if([...this.userServise.orderList.values()].length){
      [...this.userServise.orderList.values()].forEach((book,i)=>{
        const box=this.createElement('div','cart-box');
        const detail_box=this.createElement('div','detail-box');
        const img=this.createElement('img','cart-img','',{src:book.imgUrl});
        const title=this.createElement('div','cart-product-title',book.title);
        const price=this.createElement('div','cart-price',`Price: $ ${book.price}`);
        const qty=this.createElement('div','cart-quantity');
        const plus = this.createElement('span','','&plus;');
        const minus = this.createElement('span','','&minus;');
        const input = this.createElement('input','','',{type:"number",min:"1",value:book.amount})
        const remBtn = this.createElement('i','bx bx-trash cart-remove')
        const total = this.createElement('div','total-title','Your Total: ')
        const totalValue = this.createElement('b');
        const confirmDiv = this.createElement('div','btn-wrapper')
        const btnBuy = this.createElement('button','btn-buy','CONFIRM ORDER')

        box.appendChild(img);
        box.appendChild(detail_box)
        detail_box.appendChild(title)
        detail_box.appendChild(price)
        detail_box.appendChild(qty)
        qty.appendChild(plus)
        qty.appendChild(input)
        qty.appendChild(minus)
        box.appendChild(remBtn)
        cart_content.appendChild(box);
        if(i==this.userServise.orderList.size-1){
          cart_content.appendChild(total);
          cart_content.appendChild(confirmDiv)
          total.appendChild(totalValue)
          confirmDiv.appendChild(btnBuy)
          this.updateTotal()
        }
        this.bindListeners({remBtn,plus,minus,input,detail_box,btnBuy},book.id)
      })
    }else{
        const empty_cart=this.createElement('div','empty-cart');
        const img=this.createElement('img','','',{src:"https://m.media-amazon.com/images/G/01/nav2/images/jetset/EmptyState_Space_IdeaLists._CB1533074461_.png", "height":"315"});
        const h2 = this.createElement('h2','empty-title',"There's so much space in here!")
        empty_cart.append(img);
        empty_cart.appendChild(h2)
        cart_content.append(empty_cart);
    }
   
  }

  bindListeners(elements,id){
    const book = this.userServise.getBookFromOrder(id)
    elements.remBtn.addEventListener('click',(e)=> {
      this.userServise.removeBookfromOrder(id); 
      this.buildUserCart()
      const card = document.getElementById(id);
      card.querySelector('.card__icon').classList.remove('active')
      this.cardsService.updateData();
      this.updateTotal()
    },false)
    elements.plus.onclick=(e)=>{
      book.amount+=1; elements.input.value=(+elements.input.value)+1;
      this.updateTotal()
    }
    elements.minus.onclick=()=>{
      if(book.amount<=1) return false;
      book.amount-=1; elements.input.value=(+elements.input.value)-1;
      this.updateTotal()
    }
    elements.input.onchange=()=>{
      if((+elements.input.value)<1){elements.input.value = book.amount; return false;}
      book.amount=(+elements.input.value);
      this.updateTotal()
    }
    elements.btnBuy.onclick=()=>{
      this.createOrder()
      window.location.assign("/delivery-form.html");
    }
  }
  allowDrop(ev) {
    ev.preventDefault();
  }
  drag(ev,id) {
    ev.dataTransfer.setData("id", id);
  }
  drop(ev) {
    ev.preventDefault();
    var id = ev.dataTransfer.getData("id");
    this.userServise.addBookToOrder(id)
    this.buildUserCart();
    this.cardsService.updateData();
    const card = document.getElementById(id);
    card.querySelector('.card__icon').classList.add('active')
  }
                        
    updateTotal(){
      const cart_total_sum =document.querySelector('.total-title').children[0]
      cart_total_sum.innerText=' $'+this.userServise.getTotalSum();
      //document.querySelector(`.total_for_${book.id}`).innerHTML= +book.price*book.amount+' $';
    }
    removeBookfromOrder(id){
      this.userServise.removeBookfromOrder(id)
      this.updateTotal()
    }
    createOrder(){
      const order = { orderList:Object.fromEntries(this.userServise.orderList),totalSum:this.userServise.getTotalSum() }
      localStorage.setItem('order',JSON.stringify(order))
    }
  }
  
  const userServise = new UserServise()
  const cardsService = new CardsServise(userServise)
  userServise.catalog= cardsService
  const cardComponent=new CardComponent(cardsService,userServise);
  cardsService.cardComponent=cardComponent;
  cardsService.loadItems();
 
  function openPopup(index){
    let popup=document.getElementById('popup');
    popup.classList.add('popup_open')
    popup.children[0].classList.add('popup_open')
    document.querySelector('.popup_title').innerText=cardsService.cards.get(index).title;
    document.querySelector('.popup_authors').innerText=cardsService.cards.get(index).authors;
    document.querySelector('.popup_description').innerText=cardsService.cards.get(index).description;
    document.querySelector('img.popup_img').src=cardsService.cards.get(index).imgUrl;
  }
 function closePopup(){
   let popup=document.getElementById('popup');
    popup.classList.remove('popup_open')
    popup.children[0].classList.remove('popup_open')
  }
