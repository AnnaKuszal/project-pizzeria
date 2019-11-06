/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };
  /*  
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  }; */

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product{
    constructor(id, data){
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();

      console.log('newProduct:', thisProduct);
    }

    renderInMenu(){
      const thisProduct = this;

      /* generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);
      
      /* create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);

      /* add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }

    getElements(){
      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion() {
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */
      const accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);

      /* START: click event listener to trigger */
      accordionTrigger.addEventListener('click', function(event){

        /* prevent default action for event */
        event.preventDefault();

        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);

        /* find all active products */
        const activeProducts = document.querySelectorAll(select.all.menuProductsActive);

        /* START LOOP: for each active product */
        for(let activeProduct of activeProducts){

          /* START: if the active product isn't the element of thisProduct */
          if (activeProduct!=thisProduct.element){
            /* remove class active for the active product */
            activeProduct.classList.remove(classNames.menuProduct.wrapperActive);

          /* END: if the active product isn't the element of thisProduct */
          }
        /* END LOOP: for each active product */
        }

      /* END: click event listener to trigger */
      });
   
    }

    initOrderForm(){
      const thisProduct = this;

      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });

    }
    
    processOrder(){
      const thisProduct = this;

      /* get data from the form */
      const formData = utils.serializeFormToObject(thisProduct.form);

      /* set variable 'price' for default product price (thisProduct.data.price) */
      let price = thisProduct.data.price;
      
      /* START LOOP: for each paramId in thisProduct.data.params */
      for (let paramId in thisProduct.data.params){

        /* save the element in thisProduct.data.params with key paramId as const param */
        const param = paramId;

        /* START LOOP: for each optionId in param.options */
        const paramProperties = thisProduct.data.params[param];
        const paramOptions = paramProperties['options'];

        for (let optionId in paramOptions){    
          /* save the element in param.options with key optionId as const option */
          const option = optionId;     
      
          /* FIND if formData contains property key equal to parametr key
          AND: if array with this property key contains option key */
          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;    
      
          /* START IF: if option is selected and option is not default */
          if(optionSelected && !option.default){ 
      
            /* add price of option to variable price */
            const optionProperties = paramOptions[option];
            const optionPrice = optionProperties['price'];

            price = price + optionPrice;
      
          /* END IF: if option is selected and option is not default */
          }    
      
          /* START ELSE IF: if option is not selected and IS default*/
          else if(!optionSelected && option.default){
            const optionProperties = paramOptions[option];
            const optionPrice = optionProperties['price'];
      
            /* deduct option's price from variable 'price' */
            price = price - optionPrice;  
                  
          /* END: if option is not selected and IS default */
          }
          

          /* in thisProduct.imageWrapper find all images for this option - 
          search for elements equal to selector of type: '.paramId-optionId' */
          /* add all found elements to constant 'optionImages'*/
          const optionImages = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);
          
          /* START IF: if option is selected */
          if(optionSelected){

            /* START LOOP: for each found image */
            for(let optionImage of optionImages){

              /* add class active to ALL images referring to the selected option */
              optionImage.classList.add(classNames.menuProduct.imageVisible);

            /* END LOOP: for each found image */
            }
          /* END IF: if option is selected */
          }


          /* START ELSE: (option is not selected) */
          else{

            /* START LOOP: for each found image */
            for(let optionImage of optionImages){

              /* remove class active from ALL images referring to the selected option */
              optionImage.classList.remove(classNames.menuProduct.imageVisible);

            /* END LOOP: for each found image */
            }

          /* END ELSE: (option is not selected) */
          }

        /* END LOOP: for each optionId in param.options */
        }      
      
      /* END LOOP: for each paramId in thisProduct.data.params */
      }    
      
      /* Insert value of variable 'price' into price element*/
      thisProduct.priceElem.innerHTML = price; 

    }

    initAmountWidget(){
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    }

  }

  class AmountWidget{
    constructor(element){
      const thisWidget = this;

      thisWidget.getElements(element);

      console.log('AmountWidget:', thisWidget);
      console.log('constructor arguments:', element);
    }

    getElements(element){
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }
  }

  const app = {
    
    initMenu: function(){
      const thisApp = this;

      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;
  
      thisApp.data = dataSource;
    },

    init: function(){
      const thisApp = this;

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}