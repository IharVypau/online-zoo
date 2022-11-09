
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


class LayoutComponent{
  constructor(){
  }
  generateElement(el,class_name="",text="",atrrs={}){
    const element= document.createElement(el)
    element.className=class_name;
    element.innerHTML=text
    for(let attr in atrrs){
      element.setAttribute(attr,atrrs[attr])
    }
    return element;
  }
  generateList(list){
    list.forEach(item=>{
      
    })
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
    
    showBookLists(){
      
      document.querySelector('#book-list').classList.add('showLists');
      this.content.innerHTML=""
      // myBooks.classList.add('showLists');
      // this.content.appendChild(myBooks)
      this.cardComponent.generateUserLists()
    }

    backToCatalog(){
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
    removeBookfromOrder(book, id){
      book.amount=0
      this.orderList.delete(id)
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
      return  [...this.orderList.values()].reduce((sum,book)=>sum+Number(book.price),0)
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
      const parent = document.querySelector('.order_list')
      this.createFieldsTable(parent,['#','Book Title','Amount','Total','Actions']);
      [...this.userServise.orderList.values()].forEach((book,i)=>{
        const book_index=this.createElement('div','',++i);
        const book_title=this.createElement('div');
        book_title.appendChild(this.createElement('a','link_1',book.title))
        const book_amount=this.createElement('div','',book.amount);
        const total=this.createElement('div','',+(book.price)*(+book.amount));
        const actions=this.createElement('div','','X');
        parent.append(book_index,book_title,book_amount,total,actions)
      })
      const total_sum=this.createElement('h3','total_sum','Total:')
      total_sum.appendChild(this.createElement('span','',this.userServise.getTotalSum()+' $'))
      parent.insertBefore(total_sum, null)
    }
    createFieldsTable(parent,fields=[]){
      fields.forEach(field=>{
        parent.appendChild(this.createElement('div','',field))
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

 