function init() {
    fetch('https://rolling-scopes-school.github.io/iharvypau-JSFEEN2022Q3/books-shop/books.json')
      .then(response => response.json())
      .then(booksJSON => {
          booksJSON.forEach(book => {
            const container = document.getElementById('container');
       
          const card = document.createElement('article')
          card.classList.add('card');
          const card_img= document.createElement('div')
          card_img.classList.add('card__img');
          const card_info= document.createElement('div')
          card_info.classList.add('card__precis','card__preci--now');
          const card_name= document.createElement('div')
          card_name.classList.add('card__name');
          const img=document.createElement('img')
          img.setAttribute('src',book.thumbnailUrl)
          card_img.appendChild(img)
          const more=document.createElement('p');
          more.innerText="SHOW MORE";
          more.classList.add('show_more')
          card_name.appendChild(more);
          const link_1 = document.createElement('a');
          link_1.className = 'card__icon';
          const icon_like= document.createElement('ion-icon')
          icon_like.setAttribute( 'name',"cart-outline");
          
          const link_2 = document.createElement('a');
          link_2.className = 'card__icon';
          const icon_heart= document.createElement('ion-icon')
          icon_heart.setAttribute( 'name',"heart-outline");

          link_1.appendChild(icon_like);
          link_2.appendChild(icon_heart);
          
          

          const card_price= document.createElement('div')
          card_price.classList.add('card_price');
          const card_title=document.createElement('p');
          const card_authors=document.createElement('p');
          card_title.classList.add('card_title')
          card_authors.classList.add('card_authors')
          card_title.innerText=book.title;
          card_authors.innerHTML=book.authors.join(', ')

          const card_price_span= document.createElement('span')
          card_price_span.innerText='$990.00';
          card_info.appendChild(link_1)
          card_info.appendChild(card_price)
          card_info.appendChild(link_2)
          card_price.appendChild(card_price_span)
          card.appendChild(card_img)
          card.appendChild(card_name)
          card.appendChild(card_authors)
          card.appendChild(card_title)
          card.appendChild(card_info)
          container.appendChild(card)
        });
        
  
      });
  }
  init();