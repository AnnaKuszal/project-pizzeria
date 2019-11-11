
  const app = {
    
    initMenu: function(){
      const thisApp = this;

      for(let productData in thisApp.data.products){
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;
  
      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.product;

      
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

      thisApp.initData();
      
      thisApp.initCart();

    },

    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    }
  };

  app.init();
