console.log('width ' + window.innerWidth)
showLoader();
getHomeProducts();


// getting products for home page


async function getHomeProducts() {
  var result = await fetch('https://dummyjson.com/products?sortBy=brand&order=asc').then(result => result.json()).then(data => showonUi(data));

}

// showing products on home screen 

let productTitles = [];
class aProduct {
  constructor(title, brand, price, description, image) {
    this.title = title;
    this.brand = brand;
    this.price = price;
    this.description = description;
    this.image = image;
  }
}
var addedItemsInCart = [];


// show on home function

function showonUi(data) {

  var products = data.products;
  let index = 0;
  productTitles = [];
  itemList = document.getElementById('item-list');
  itemList.innerHTML = '';


  if (products.length > 0) {
    products.forEach(() => {
      var item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = ` <div class="image">
                    <img src="${products[index].images[0]}" width="100%">
          </div>
          <div class="item-details">
            <p>${products[index].title.slice(0,20)+'...'}</p>
            <p style="color:grey;">${products[index].brand}</p>
            <p>₹${(products[index].price * 85).toFixed(0)}</p>
          </div>`;
      itemList.appendChild(item);

      // storing every product for using it another place 


      productTitles.push(new aProduct(products[index].title, products[index].brand, products[index].price, products[index].description,
        products[index].images[0]
      ));
      index++;

    });

    openProduct();

    document.getElementById('no-result').innerHTML = '';
  }

  else {

    itemList.innerHTML = '';
    document.getElementById('no-result').innerHTML = '<h2>0 Results Found </h2>';
    document.getElementById('shop-items').style.paddingTop = '30px';
  }

  hidLoader();
}


//sign-up form

var user = document.getElementById('user');
user.addEventListener('click', () => {
  if (!loggedIn) {
    openRegistration();
  }
  else {
    var profile = document.getElementById('profile');
    profile.style.display = 'flex';
    var backIcon = document.getElementById('back');
    backIcon.addEventListener('click', () => {
      profile.style.display = 'none';
    });
  }
});

function openRegistration() {
  document.getElementById('modal').style.display = 'flex';
}

function closeRegistration() {
  var modal = document.getElementById('modal');
  modal.style.display = 'none';
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

//show password 

var password = document.getElementById('reg-password');
var confirmPassword = document.getElementById('confirm-password');
var showPas = document.getElementById('show-pass');
showPas.addEventListener('click', () => {
  if (showPas.checked) {
    password.type = 'text';
    confirmPassword.type = 'text';
  }
  else {
    password.type = 'password';
    confirmPassword.type = 'password';
  }
});


// register a user

var registerButton = document.getElementById('register');
registerButton.addEventListener('click', registerUser);

function registerUser() {
  let userName = document.getElementById('reg-name').value;
  let userMail = document.getElementById('reg-email').value;
  let userPass = document.getElementById('reg-password').value;
  let confirmPass = document.getElementById('confirm-password').value;

  if (userName && userMail && userPass && confirmPass) {
    if (userName.length >= 5 && userName.length <= 16) {
      if (userPass.length >= 8) {
        if (userPass === confirmPass) {
          console.log('registration success');
          localStorage.setItem('userName', userName);
          localStorage.setItem('userEmail', userMail);
          localStorage.setItem('userPas', userPass);
          closeRegistration();
          location.reload();
        }
        else {
          notify('Password Is not Same As confirm Password ');
        }
      }
      else {
        notify('Password Is too short');
      }
    }
    else {
      if (username.length < 5)
        notify('Username is too short');
      else
        notify('Username is Too long');
    }
  }
  else {
    notify('All fields are must be filled.')
  }
}


// opening search bar 

var searchBar = document.getElementById('search-bar');
var searchIcon = document.getElementById('search-icon');
searchIcon.addEventListener('click', () => {
  searchBar.focus();
})



// getting input from search bar
let sectionOne = document.getElementById('section-1');
let sectionTwo = document.getElementById('section-2');



searchBar.addEventListener('keyup', (e) => {
  if (e.key == "Enter")
  {
    if (searchBar.value != '') {
      sectionOne.style.display = 'none';
      sectionTwo.style.display = 'none';
      getSearchedProducts(searchBar.value);
      showLoader();
    }
  }
});


async function getSearchedProducts(searchValue) {
  var result = await fetch(`https://dummyjson.com/products/search?q=${searchValue}`).then(result => result.json()).then(data => showonUi(data));
}

// checking if user have registered or not

let loggedIn = false;

function login() {
  if (localStorage.getItem('userName')) {
    loggedIn = true;
    user.classList.remove('fa-user');
    user.classList.add('fa-gear');
  }
}

login();


// loader 

function showLoader() {
  document.getElementById('wrap-loader').style.display = 'flex';
}

function hidLoader() {
  document.getElementById('wrap-loader').style.display = 'none';
}


// when user click on a product

function openProduct() {
  var allProducts = document.querySelectorAll('.item');
  if (allProducts) {
    for (let count = 0; count < allProducts.length; count++)
    {
      allProducts[count].addEventListener('click', () => {
        var showProduct = document.createElement('div');
        showProduct.className = 'product-showcase';
        showProduct.innerHTML = ` <div class="product-image">
        <img src = "${productTitles[count].image}" width="100%" height="100%" />
      </div>
      <div class="product-info">
        <h3>${productTitles[count].title}</h3>
        <p>${productTitles[count].brand}</p>
        <h3>₹${(productTitles[count].price * 85).toFixed(0)}</h3>
        <button class="CartBtn" id="addCart">
        <span class="IconContainer"> 
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" fill="rgb(17, 17, 17)" class="cart"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path></svg>
          </span>
        <p class="text" id ="addCart-msg">Add to Cart</p>
        </button>
        <p>${productTitles[count].description}</p>
        </div>
        </div>`;

        var productShow = document.getElementById('viewProduct');
        productShow.innerHTML = '';
        productShow.appendChild(showProduct);
        productShow.style.display = 'flex';

        var addCartBtn = document.getElementById('addCart');
        var addBtnMsg = document.getElementById('addCart-msg');
        var isAdded = false;

        if (isItemAdded(productTitles[count])) {
          addCartBtn.style.backgroundColor = 'rgba(0, 218, 118, 1)';
          addBtnMsg.textContent = 'Added To Cart';
        }
        else {
          addCartBtn.style.backgroundColor = 'rgba(255, 203, 4, 1)';
          addBtnMsg.textContent = 'Add To Cart';
        }
        adBtnClick(productTitles[count]);
      });
    }
  }
  closeProductView();
}

// close product view 

function closeProductView() {
  var productContainer = document.getElementById('viewProduct');

  productContainer.addEventListener('click', (e) => {
    if (e.target == productContainer)
      productContainer.style.display = 'none';
  })
}


// notification function

var notifyArea = document.getElementById('notification-area');
var notifyMsg = document.getElementById('notify-msg');

function notify(msg) {
  notifyMsg.textContent = msg;
  notifyArea.style.display = 'flex';
  setTimeout(() => {
    notifyArea.style.display = 'none';
  }, 2000);
}


// check if item is added in cart

function isItemAdded(item) {
  if (addedItemsInCart.length > 0) {
    for (let i = 0; i < addedItemsInCart.length; i++) {
      if (addedItemsInCart[i] == item) {
        return true;
      }
    }
  }
  else {
    return false;
  }
}


/* on click of add to cart btn */

function adBtnClick(add) {
  var addBtn = document.getElementById('addCart');
  var BtnMsg = document.getElementById('addCart-msg');
  addBtn.addEventListener('click', () => {
    if (isItemAdded(add)) {
      const index = addedItemsInCart.findIndex(item => item === add);
      addedItemsInCart.splice(index, 1);
      addBtn.style.backgroundColor = 'rgba(255, 203, 4, 1)';
      BtnMsg.textContent = 'Add To Cart';
    }
    else {
      addedItemsInCart.push(add);
      addBtn.style.backgroundColor = 'rgba(0, 218, 118, 1)';
      BtnMsg.textContent = 'Added To Cart';
    }
  })

}