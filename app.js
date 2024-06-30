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
};

var addedItemsInCart = [];

if (localStorage.getItem('CartItems'))
  addedItemsInCart = JSON.parse(localStorage.getItem('CartItems'));


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
        (products[index].images[1]) ? products[index].images[1] : products[index].images[0],
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


//sign-up form------------------------------------------------------------------------------

var user = document.getElementById('user');
user.addEventListener('click', () => {
  if (!loggedIn) {
    openRegistration();
  }
  else {
    var profile = document.getElementById('profile');
    profile.classList.add('open');
    var backIcon = document.getElementById('back');
    backIcon.addEventListener('click', () => {
      profile.classList.remove('open');
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

//show password ----------------------------------------------------

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


// register a user----------------------------------------------------

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


// opening search bar ----------------------------------------------------

var searchBar = document.getElementById('search-bar');
var searchIcon = document.getElementById('search-icon');
searchIcon.addEventListener('click', () => {
  searchBar.focus();
})



// getting input from search bar----------------------------------------------------

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

// checking if user have registered or not----------------------------------------------------

let loggedIn = false;

function login() {
  if (localStorage.getItem('userName')) {
    loggedIn = true;
    user.classList.remove('fa-user');
    user.classList.add('fa-gear');
  }
}

login();


// loader ----------------------------------------------------

function showLoader() {
  document.getElementById('wrap-loader').style.display = 'flex';
}

function hidLoader() {
  document.getElementById('wrap-loader').style.display = 'none';
}


// when user click on a product----------------------------------------------------

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
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" fill="rgb(17, 17, 17)" class="cart"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path></svg></span><p class="text" id ="addCart-msg">Add to Cart</p></button><p>${productTitles[count].description}</p> </div> </div>`;

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

// close product view ----------------------------------------------------

function closeProductView() {
  var productContainer = document.getElementById('viewProduct');

  productContainer.addEventListener('click', (e) => {
    if (e.target == productContainer)
      productContainer.style.display = 'none';
  })
}


// notification function----------------------------------------------------

var notifyArea = document.getElementById('notification-area');
var notifyMsg = document.getElementById('notify-msg');
var isnotified = false;

function notify(msg) {
  if (isnotified == false) {
    isnotified = true;
    notifyMsg.textContent = msg;
    notifyArea.classList.add('open');
    setTimeout(() => {
      notifyArea.classList.remove('open');
      isnotified = false;
    }, 3000);
  }
}


// check if item is added in cart----------------------------------------------------

function isItemAdded(item) {
  if (addedItemsInCart) {
    for (let i = 0; i < addedItemsInCart.length; i++) {
      if (addedItemsInCart[i].title == item.title) {
        return true;
      }
    }
  }
  else {
    return false;
  }
}


/* on click of add to cart btn  ----------------------------------------------------*/

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
    localStorage.setItem('CartItems', JSON.stringify(addedItemsInCart));
  })
}


// cart button event----------------------------------------------------

var totalAmount = 0;
var cart = document.getElementById('cart');
var cartItems = document.getElementById('cartItems');
var j = 0;
var viewCart = document.getElementById('ViewCart');
cart.addEventListener('click', () => {
  if (loggedIn) {
    if (addedItemsInCart.length > 0) {
      viewCart.style.display = 'flex';
      cartItems.innerHTML = '';
      addedItemsInCart.forEach(() => {
        var cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = ` <div class="item-image"><img src="${addedItemsInCart[j].image}" width="100%" loading="lazy" height="100%"/></div><div class="item-info"><div class="item-title"><h4>${addedItemsInCart[j].title}</h4><button id="removeItem" class="fa fa-times removeItem"></button></div><p>${addedItemsInCart[j].brand}</p><div class="item-price"><h4>₹${(addedItemsInCart[j].price * 85).toFixed(0)}</h4></div></div></div>`;
        cartItems.appendChild(cartItem);
        j++;
        updateAmount();
      });
      removeItemCart();
    }
    else {
      notify('Cart Empty');
    }
  }
  else {
    notify('Register Yourself')
  }
});


// update total amount in cart----------------------------------------------------

var checkoutBtn = document.getElementById('checkout');

function updateAmount() {
  if (addedItemsInCart.length > 0) {
    let k = 0;
    totalAmount = 0;
    addedItemsInCart.forEach(() => {
      totalAmount += (addedItemsInCart[k].price) * 85;
      k++;
    });
    document.getElementById('total-amount').textContent = `₹${totalAmount.toFixed(0)}`;
    checkoutBtn.disabled = false;
    checkoutBtn.style.backgroundColor = 'rgba(233, 185, 0, 1)';
  }
  else {
    totalAmount = 0;
    document.getElementById('total-amount').textContent = `₹${totalAmount.toFixed(0)}`;
    checkoutBtn.disabled = true;
    checkoutBtn.style.backgroundColor = 'white';
  }
}

// remove item event cart----------------------------------------------------

function removeItemCart() {
  var cartProducts = document.querySelectorAll('.cart-item');
  var remItem = document.querySelectorAll('.removeItem');
  for (let i = 0; i < cartProducts.length; i++) {
    remItem[i].addEventListener('click', () => {
      const index = addedItemsInCart.findIndex(item => item.title == remItem[i].parentElement.textContent);
      addedItemsInCart.splice(index, 1);
      cartItems.removeChild(cartProducts[i]);
      console.log('remove')
      updateAmount();
      localStorage.setItem('CartItems', JSON.stringify(addedItemsInCart));
    })
  }
}

// settings view --------------------------------------------------------------

// personal info btn
var personalBtn = document.getElementById('personal');
var personalInfoModal = document.getElementById('personalInfoTrigger');
var backPersonalModal = document.getElementById('personal-back');
var profileUserName = document.getElementById('user-name');
var profileUserMail = document.getElementById('user-mail');
var saveBtn = document.getElementById('personalInfoSave');

personalBtn.addEventListener('click', () => {

  personalInfoModal.classList.add('scale');

  profileUserName.value = localStorage.getItem('userName');
  profileUserMail.value = localStorage.getItem('userEmail');
  saveBtn.disabled = true;

})
backPersonalModal.addEventListener('click', () => {
  if (profileUserName.value == localStorage.getItem('userName') && profileUserMail.value == localStorage.getItem('userEmail'))
  {
    personalInfoModal.classList.remove('scale');
  }
  else {
    if (confirm('Are you sure to Discard changes')) {
      personalInfoModal.classList.remove('scale');
    }
  }
})

profileUserName.addEventListener('keydown', saveUserDetails);
profileUserMail.addEventListener('keydown', saveUserDetails);

function saveUserDetails() {
  if (profileUserName.value != localStorage.getItem('userName') || profileUserMail.value != localStorage.getItem('UserEmail')) {
    saveBtn.disabled = false;
    saveBtn.addEventListener('click', () => {
      localStorage.setItem('userName', profileUserName.value);
      localStorage.setItem('userEmail', profileUserMail.value);
      notify('Saved Details');
    })
  }
}

// address btn-------------------

var addressBtn = document.getElementById('address');
var addressView = document.getElementById('address-view');
var closeAddress = document.getElementById('close-address');
var newaddressBtn = document.querySelector('#new-address');
let a = 0;
let addressForm = document.getElementById('newAddress');
let closeAddressForm = document.getElementById('closeForm');
var saveAddressBtn = document.getElementById('saveAddress');

addressBtn.addEventListener('click', () => {
  showallAddress();
  addressView.classList.add('scale');
  removeAddress();
  closeAddress.addEventListener('click', () => {
    addressView.classList.remove('scale');
  })
});

newaddressBtn.addEventListener('click', () => {
  addressForm.classList.add('slideDown');
});

class Address {
  constructor(name, mobile, pincode, state, city, type, lineOne, lineTwo) {
    this.name = name;
    this.mobile = mobile;
    this.pincode = pincode;
    this.state = state;
    this.city = city;
    this.type = type;
    this.lineOne = lineOne;
    this.lineTwo = lineTwo;
  }
};
let addresses = [];

function saveAdress() {
  var AddressName = document.getElementById('addressName');
  var AddressMobile = document.getElementById('addressMobile');
  var AddressPincode = document.getElementById('addressPincode');
  var AddressState = document.getElementById('addressState');
  var AddressCity = document.getElementById('addressCity');
  var AddressType = document.getElementById('addressType');
  var AddressLineOne = document.getElementById('addressLine1');
  var AddressLineTwo = document.getElementById('addressLine2');

  if (AddressName.value && AddressMobile.value && AddressPincode.value && AddressState.value && AddressCity.value && AddressType.value && AddressLineOne.value && AddressLineTwo.value) {
    if (AddressMobile.value.length == 10) {
      addresses.push(new Address(AddressName.value, AddressMobile.value, AddressPincode.value, AddressState.value, AddressCity.value, AddressType.value, AddressLineOne.value, AddressLineTwo.value));

      var a = document.createElement('div');
      a.className = 'address';
      a.innerHTML = `<div class="address-info"><h4>${AddressType.value}</h4><p>${AddressName.value}, ${AddressLineOne.value},<br>${AddressCity.value},${AddressPincode.value}</p></div><div class="delete-address"><button class="fa fa-trash"></button></div></div>`;

      document.getElementById('allAddress').appendChild(a);
      storeAddress();
      addressForm.classList.remove('slideDown');
      removeAddress();
    }
    else {
      notify('Enter a Valid Number')
    }
  }
  else {
    notify('All Fields Are Required');
  }
}

function removeAddress() {
  var deleteAddressBtn = document.querySelectorAll('.delete-address');
  var tmpallAddress = document.querySelectorAll('.address');
  for (let y = 0; y < deleteAddressBtn.length; y++) {
    deleteAddressBtn[y].addEventListener('click', () => {
      document.getElementById('allAddress').removeChild(tmpallAddress[y]);
      addresses.splice(y, 1);
      storeAddress();
    })
  }
}

function storeAddress() {
  localStorage.setItem('addresses', JSON.stringify(addresses));
}


function showallAddress() {
  if (localStorage.getItem('addresses')) {
    if (addresses.length == 0){
      notify('Click on New For a New Address');
    }
    else {
      console.log('in if condition ')
      addresses = JSON.parse(localStorage.getItem('addresses'));
      document.getElementById('allAddress').innerHTML = '';
      for (let z = 0; z < addresses.length; z++) {
        var a = document.createElement('div');
        a.className = 'address';
        a.innerHTML = `<div class="address-info"><h4>${addresses[z].type}</h4><p>${addresses[z].name}, ${addresses[z].lineOne},<br>${addresses[z].city},${addresses[z].pincode}</p></div><div class="delete-address"><button class="fa fa-trash"></button></div></div>`;
        document.getElementById('allAddress').appendChild(a);
        storeAddress();
      }
    }
  }
}

// orders btn

var ordersBtn = document.getElementById('orders');



// contact us btn
var contactBtn = document.getElementById('contact');