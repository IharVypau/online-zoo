

  class CardsServise{
    constructor(cardComponent){
      this.cards = []
      this.fragment= document.createDocumentFragment();
      this.cardComponent=cardComponent
    }

    loadItems(){
      fetch('./assets/books.json')
      .then(response => response.json())
      .then(booksJSON => {
        this.renderBooks(booksJSON);
        this.cards=booksJSON;
      })
    }

    renderBooks(books){
      books.forEach((book,index) => {
        this.fragment.appendChild(this.cardComponent.generateCard(book,index))
      })
      const cont =document.getElementById("container")
      cont.appendChild(this.fragment);
      cont.addEventListener('click',(event)=>{
        const el = event.target.parentNode
        if(el.dataset.cartIndex){
          userServise.orderLIst.add(el.dataset.cartIndex)
          this.updateData();
        }
      },false);
    }
    updateData(){
      document.querySelector('.cart_items').innerText=userServise.orderLIst.size
    }
  }

  class UserServise{
    constructor(){
      this.orderLIst=new Set()
      this.favouritsList=[]
    }
  }

  class CardComponent{
    
    generateCard(book,index){
      const card = this.createElement('article','card')
      const card_img = this.createElement('div','card__img');
      const card_info = this.createElement('div','card__precis card__preci--now');
      const card_name = this.createElement('div','card__name');
      const img = this.createElement('img','','',{src:book.thumbnailUrl})
      const more_btn = this.createElement('p','show_more',"SHOW MORE");
      const link_1 = this.createElement('a','card__icon','',{'data-cart-index':index});
      const icon_like= this.createElement('ion-icon','','',{name:'cart-outline'})
      const link_2 = this.createElement('a','card__icon','',{'data-cart-index':index});
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

    addToFavourites(){ }
    addToCart(){}

  }
  const service = new CardsServise(new CardComponent())
  const userServise = new UserServise()
  service.loadItems();

  