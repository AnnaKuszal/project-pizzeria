import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';


const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    thisApp.titleLinks = document.querySelectorAll(select.title.links);
    thisApp.logoLink = document.querySelector(select.logo.link);
    thisApp.cart = document.querySelector(select.containerOf.cart);
    
    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }
    
    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* run thisApp.activatePage with this id */
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = `#/${id}`;
        
      });
    }

    for(let titleLink of thisApp.titleLinks){
      titleLink.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* run thisApp.activatePage with this id */
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = `#/${id}`;

        thisApp.cart = document.querySelector(select.containerOf.cart);
        thisApp.cart.style.display = 'block';

        thisApp.navLinks = document.querySelectorAll(select.nav.links);
        for(let link of thisApp.navLinks){
          link.style.display = 'block';
        }
      
      });
    }

    thisApp.logoLink.addEventListener('click', function(event){
      const clickedElement = this;
      event.preventDefault();

      /* get page id from href attribute */
      const id = clickedElement.getAttribute('href').replace('#', '');

      /* run thisApp.activatePage with this id */
      thisApp.activatePage(id);

      /* change URL hash */
      window.location.hash = `#/${id}`;

      thisApp.cart = document.querySelector(select.containerOf.cart);
      thisApp.cart.style.display = 'none';

      thisApp.navLinks = document.querySelectorAll(select.nav.links);
      for(let link of thisApp.navLinks){
        link.style.display = 'none';
      }
      
    });

  },

  activatePage: function(pageId){
    const thisApp = this;

    /* add class 'active' to matching pages, remove from non-matching */
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
 
      if(pageId == 'order' || pageId == 'booking'){
        thisApp.cart = document.querySelector(select.containerOf.cart);
        thisApp.cart.style.display = 'block';

        thisApp.navLinks = document.querySelectorAll(select.nav.links);
        for(let link of thisApp.navLinks){
          link.style.display = 'block';
        }
        
      }
      
    }

    /* add class 'active' to matching links, remove from non-matching */
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == `#${pageId}`
      );
    }

  },

  initBooking: function(){
    const thisApp = this;
    
    const bookingWidgetWrapper = document.querySelector(select.containerOf.booking);
    
    thisApp.booking = new Booking(bookingWidgetWrapper);
  },
    
  initMenu: function(){
    const thisApp = this;

    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function(){
    const thisApp = this;
  
    thisApp.data = {};
    const url = `${settings.db.url}/${settings.db.product}`;

      
    function handleErrors(rawResponse) {
      if (!rawResponse.ok) {
        throw Error(rawResponse.statusText);
      }
      return rawResponse;
    }
      
    fetch(url)
      .then(handleErrors)
      .then(function(rawResponse){
        console.log('ok');
        return rawResponse.json();  
      })
      .catch(function(error) {
        console.log(error);
      })
  
      .then(function(parsedResponse){

        /* save parsedResponse at thisApp.data.products */
        thisApp.data.products = parsedResponse;

        /* execute initMenu method */
        thisApp.initMenu();
      });

  },

  init: function(){
    const thisApp = this;

    thisApp.initPages();
    thisApp.initSlider();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();

  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },

  initSlider(){
    let slideIndex = 0;
    
    const showSlides = function(){
        
      const slides = document.querySelectorAll('.slides');
      const dots = document.querySelectorAll('.dot');
          
      for(let i=0; i<slides.length; i++){
        slides[i].style.display = 'none';
      }
    
      for(let i=0; i<dots.length; i++){
        dots[i].className = dots[i].className.replace('active', '');
      } 
    
      slideIndex++; 
      // eslint-disable-next-line
      if (slideIndex > slides.length) {slideIndex = 1};
      slides[slideIndex-1].style.display = 'block';
      dots[slideIndex-1].className += ' active';
      setTimeout(showSlides, 3000);
    
    };

    showSlides();
  },

};

app.init();
