
class Book{
  constructor(id,title, description,authors, imgUrl,price){
    this.id=id
    this.title=title
    this.description=description
    this.authors=authors
    this.imgUrl=imgUrl
    this.price=price
    this._amount=0
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


  class CardsServise{
    constructor(userService,cardComponent=null){
      this.cardsHTML = []
      this.cards =new Map()
      this.fragment= document.createDocumentFragment();
      this.cardComponent=cardComponent;
      this.userService=userService;
    }

    loadItems(){
      fetch('./assets/books.json')
      .then(response => response.json())
      .then(booksJSON => {
        this.renderBooks(booksJSON);
        //this.cards=booksJSON;
      })
    }

    renderBooks(books){
      this.content = document.getElementById("container")
      books.forEach((book,index) => {
        const bookObj= new Book(book.isbn,book.title,book.shortDescription,book.authors,book.thumbnailUrl,'90')
        const card = this.cardComponent.generateCard(book,book.isbn)
        this.cardsHTML.push(card)
        this.fragment.appendChild(card)
        this.cards.set(book.isbn,bookObj)
      })
      this.content.appendChild(this.fragment);
      this.content.addEventListener('click',(event)=>{
        this.updateData()
      },false);
    }

    updateData(){
      document.querySelector('.cart_items').innerText=this.userService.orderList.size
      document.querySelector('.like_items').innerText=this.userService.favouritsList.size
    }
    
    showBookLists(el){
      if(![...el.classList].includes('active')){
        el.classList.add('active')
        document.querySelector('#book-list').classList.add('showLists');
        this.content.innerHTML=""
        this.cardComponent.generateUserLists()
      }
    }

    backToCatalog(){
      document.querySelector('.cart').classList.remove('active')
      document.getElementById('book-list').classList.remove('showLists');
      [...document.querySelectorAll('.book-list')].forEach(el=>el.innerHTML='');
      this.cardsHTML.forEach((card)=>{ this.content.appendChild(card) })
    }
    setHandler(el,event_type,fn,args){
      el.addEventListener(event_type,fn.bind(null,el,args,this,this.userService))
    }
  }

  class UserServise{
    constructor(){
      this.orderList = new Map();
      this.favouritsList=new Map();
    }
    handleOrder(el,id,cardService,userServise){
      const book = cardService.cards.get(id)
      userServise.orderList.has(id) ?  userServise.removeBookfromOrder(book, id) :  userServise.addBookToOrder(book, id);
      el.classList.toggle('selected');
    }

    handleLike(el,id,cardService,userServise){
      let book = cardService.cards.get(id)
      userServise.favouritsList.has(id) ?  userServise.removeLike(book, id) :  userServise.addLike(book, id);
      el.classList.toggle('selected');
    }

    addBookToOrder(book, id){
      book.amount=1
      this.orderList.set(id,book)
    }
    removeBookfromOrder(book){
      book.amount=0
      this.orderList.delete(book.id)
    }
    
    addLike(book,id){
      book.like=true;
      this.favouritsList.set(id,book)
    }
    removeLike(book,id){
      book.like=false;
      this.favouritsList.delete(id)
    }
    
    setAmount(amount,id){
      let book = this.cardService.cards.get(id)
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
    generateCard(book,index){
      const card = this.createElement('article','card')
      const card_img = this.createElement('div','card__img');
      const card_info = this.createElement('div','card__precis card__preci--now');
      const card_name = this.createElement('div','card__name','',{ 'onclick':`openPopup("${index}");`});
      const img = this.createElement('img','','',{src:book.thumbnailUrl})
      const more_btn = this.createElement('p','show_more',"SHOW MORE");
      const link_1 = this.createElement('a','card__icon','',{'data-index':index,'data-icon':'cart'});
      const icon_like= this.createElement('ion-icon','','',{name:'cart-outline'})
      const link_2 = this.createElement('a','card__icon','',{'data-index':index,'data-icon':'heart'});
      const icon_heart= this.createElement('ion-icon','','',{name:'heart-outline'})
      const card_price= this.createElement('div','card_price')
      const card_title=this.createElement('p','card_title',book.title);
      const card_authors=this.createElement('p','card_authors',book.authors.join(', '));
      const card_price_span= this.createElement('span','','$990.00')
    
      card_img.appendChild(img)
      card_name.appendChild(more_btn);
      link_1.appendChild(icon_like);
      link_2.appendChild(icon_heart);
      card_info.appendChild(link_1)
      card_info.appendChild(card_price)
      card_info.appendChild(link_2)
      card_price.appendChild(card_price_span)
      card.appendChild(card_img)
      card.appendChild(card_name)
      card.appendChild(card_authors)
      card.appendChild(card_title)
      card.appendChild(card_info)
      this.cardsService.setHandler(link_1,'click',this.userServise.handleOrder,index)
      this.cardsService.setHandler(link_2,'click',this.userServise.handleLike,index)
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

    generateUserLists(){
      const orderListDiv = document.querySelector('.order_list')
      const orderListDivWrapper =orderListDiv.parentElement;
      orderListDivWrapper.innerHTML="";
      orderListDiv.innerHTML="";
      this.createFieldsTable(orderListDiv,['#','Book Title','Amount','Total','Actions']);
      if([...this.userServise.orderList.values()].length>0){
          [...this.userServise.orderList.values()].forEach((book,i)=>{
            const book_index=this.createElement('div','item-row',++i);
            const book_title=this.createElement('div','item-row');
            book_title.appendChild(this.createElement('a','link_1 item-row',book.title))
            const book_amount=this.createElement('div','item-row amount-wrapper',book.amount);
            const total=this.createElement('div',`item-row total_for_${book.id}`,+(book.price)*(+book.amount)+' $');
            const actions=this.createElement('div','item-row')
            const removeBtn= this.createElement('button','btn','remove')
            actions.appendChild(removeBtn)
            book_amount.innerHTML=` <div class="custom-input" data-book-id=${book.id}>
                                        <span class="btn_am" data-type="decrease">-</span>
                                        <input type="number" data-type="custom_change"   step="1" min="1" value=${book.amount} id="counter" max="99">
                                        <span class="btn_am" data-type="increase">+</span>
                                    </div> `
            orderListDiv.append(book_index,book_title,book_amount,total,actions)
            removeBtn.addEventListener('click',(e)=>this.removeBookfromOrder(e,book),false)
            this.setAmountHandler(book_amount,'click',book.id)
            this.setAmountHandler(book_amount,'keyup',book.id)
          })
          
    
          
          const summary=this.createElement('div','cart_total sum',)
          const total_sum=this.createElement('h3','','Total:')
          this.confirm_btn=this.createElement('button','btn btn_confirm','confirm order')

          total_sum.appendChild(this.createElement('span','total',this.userServise.getTotalSum()+' $'))
          summary.appendChild(total_sum)
          summary.appendChild( this.confirm_btn)
          orderListDiv.insertBefore(summary, null)
          this.bindListeners();
      }else{

      }
     
      orderListDivWrapper.appendChild(orderListDiv);

    }
    createFieldsTable(orderListDiv,fields=[]){
      fields.forEach(field=>{
        orderListDiv.appendChild(this.createElement('div','',field))
      })
    }
    updateTotal(book){
      document.querySelector('.total').innerText=this.userServise.getTotalSum()+' $';
      document.querySelector(`.total_for_${book.id}`).innerHTML= +book.price*book.amount+' $';
    }

    setAmountHandler(book_amount,event_type,book_id){
      const counterInput = book_amount.querySelector('#counter')
      const book= this.userServise.getBookFromOrder(book_id)
        book_amount.addEventListener(event_type,(e)=>{
          e.preventDefault();
            switch (e.target.getAttribute('data-type') ) {
              case "increase": { if(+counterInput.value < 9999) {book.amount+=1; counterInput.value=(+counterInput.value)+1;} break;}
              case "decrease": { if(+counterInput.value > 1) {book.amount-=1;counterInput.value=(+counterInput.value)-1;} break;}
            
              default: {
                  if(+counterInput.value < 9999 && +counterInput.value>0) book.amount=Number(counterInput.value); 
                  else {book.amount=1; counterInput.value=1;}
                break;
              }
            }
          this.updateTotal(book)
        })
    }
    removeBookfromOrder(e,book){
      this.userServise.removeBookfromOrder(book)
      this.generateUserLists();
      this.cardsService.updateData()
    }
    bindListeners(){
      this.confirm_btn.addEventListener('click',()=>{
        localStorage.setItem('user',JSON.stringify(this.userServise))
        window.location.assign("/delivery-form.html");
      })
    }
  }
  
  const userServise = new UserServise()
  const cardsService = new CardsServise(userServise)
  cardsService.cardComponent=new CardComponent(cardsService,userServise);
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
