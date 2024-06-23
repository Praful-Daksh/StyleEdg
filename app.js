console.log('width ' + window.innerWidth)
showLoader();
// getting products for home page

async function getHomeProducts() {
  var result = await fetch('https://dummyjson.com/products?sortBy=brand&order=asc').then(result => result.json()).then(data => showonUi(data));

}
getHomeProducts();

function showonUi(data) {
  console.log(data)
  itemList = document.getElementById('item-list');

  var products = data.products;
  let index = 0;
  itemList.innerHTML = '';

  if (products.length > 0) {
    products.forEach(() => {
      var item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = ` <div class="image">
                    <img src="${cleanImageUrl(products[index].images[0])}" width="100%">
          </div>
          <div class="item-details">
            <p>${products[index].title.slice(0,20)+'...'}</p>
            <p style="color:grey;">${products[index].brand}</p>
            <p>₹${(products[index].price * 85).toFixed(0)}</p>
          </div>`;
      itemList.appendChild(item);
      index++;
    });
    document.getElementById('no-result').innerHTML = '';
  }
  else {
    itemList.innerHTML = '';
    document.getElementById('no-result').innerHTML = '<h2>0 Results Found </h2>';
    document.getElementById('shop-items').style.paddingTop = '30px';
  }
  hidLoader();
}

function cleanImageUrl(imageUrl) {
  if (imageUrl.startsWith('["') && imageUrl.endsWith('"]')) {
    return imageUrl.slice(2, -2);
  }
  return imageUrl;
}


//sign-up form

var user = document.getElementById('user');
user.addEventListener('click', () => {
  if (!loggedIn)
    openRegistration();
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
          user.classList.remove('fa-user');
          user.classList.add('fa-gear');
          window.reload();
        }
        else {
          console.log('password is not same as confirm password ');
        }
      }
      else {
        console.log('password is too short');
      }
    }
    else {
      console.log('username is too short or too long')
    }
  }
  else {
    console.log('All fields are required ');
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


