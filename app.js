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
          </div>`;''
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