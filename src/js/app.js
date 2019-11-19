import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

const app = {
  initPages: function() {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages) {
      if(page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks) {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        const clickedElement = this;

        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* run thisApp.activatePage with that id */
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = '#/' + id;

      });
    }
  },
  activatePage: function(pageId) {
    const thisApp = this;

    /* add class "active" to matching pages, remove from non-mathing*/
    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId );
    }
    /* add class "active" to matching links, remove from non-mathing*/
    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }


  },
  initMenu: function () {

    const thisApp = this;

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },
  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },

  initData: function() {
    const thisApp = this;

    thisApp.data = {};

    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        thisApp.data.products = parsedResponse;
        thisApp.initMenu();
      });
  },
  initBooking(){
    const thisApp = this;

    const bookingReservation = document.querySelector(select.containerOf.booking);

    thisApp.booking = new Booking(bookingReservation);

  },
  initCarousel(){

    const review = [];
    review[0] = {
      title: 'title 1',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      author: '-superman'
    };
    review[1] ={
      title: 'title 2',
      text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      author: '-batman'
    };
    review[2] ={
      title: 'title 3',
      text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ',
      author: '-joker'
    };
    const carouselImages = [];

    carouselImages[0] = '../../images/main_page/pizza-3.jpg';
    carouselImages[1] = '../../images/main_page/pizza-4.jpg';
    carouselImages[2] = '../../images/main_page/pizza-5.jpg';

    let i = 0;
    const indicators = document.querySelectorAll('.carousel-indicators i');

    function slider() {
      const title = document.querySelector('.review-title');
      const text = document.querySelector('.review-text');
      const author = document.querySelector('.review-author');
      title.innerHTML = review[i].title;
      text.innerHTML = review[i].text;
      author.innerHTML = review[i].author;

      const img = document.querySelector('.carousel-img img');
      img.src = carouselImages[i];

      for (let indicator of indicators) {
        if (indicator.id == i + 1 ) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      }

      if(i < review.length - 1 && i < carouselImages.length) {
        i++;
      } else {
        i=0;
      }
    }
    slider();

    setInterval(() => {
      slider();
    }, 3000);

  },



  init: function(){

    const thisApp = this;

    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
    thisApp.initCarousel();
  },
};

app.init();

