async function getSneakers() {
  var result = await fetch('https://dummyjson.com/products').then(result => result.json()).then(data => showonUi(data));

}
getSneakers();

function showonUi(data) {

  itemList = document.getElementById('item-list');

  var products = data.products;
  let index = 0;

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
    ''
    itemList.appendChild(item);

    index++;

  });
}

function cleanImageUrl(imageUrl) {
  if (imageUrl.startsWith('["') && imageUrl.endsWith('"]')) {
    return imageUrl.slice(2, -2);
  }
  return imageUrl;
}


//sign-up form

var user = document.getElementById('user');
user.addEventListener('click', openRegistration);

function openRegistration() {
  document.getElementById('modal').style.display = 'flex';
  document.body.classList.add('active-modal');
}

function closeRegistration() {
  var modal = document.getElementById('modal');
  modal.style.display = 'none';
  document.body.classList.remove('active-modal');
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      document.body.classList.remove('active-modal');
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