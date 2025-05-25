console.log('width ' + window.innerWidth);

let productTitles = [];
let addedItemsInCart = [];
let loggedIn = false;
let isnotified = false;
let totalAmount = 0;
let addresses = [];

// Product class
class aProduct {
  constructor(title, brand, price, description, image) {
    this.title = title;
    this.brand = brand;
    this.price = price;
    this.description = description;
    this.image = image;
  }
}

// Address class
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
}

// Initialize app
function init() {
  loadCartFromStorage();
  login();
  showLoader();
  getHomeProducts();
  setupEventListeners();
}

// Load cart from localStorage
function loadCartFromStorage() {
  try {
    if (localStorage.getItem('CartItems')) {
      addedItemsInCart = JSON.parse(localStorage.getItem('CartItems'));
    }
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    addedItemsInCart = [];
  }
}

// Getting products for home page
async function getHomeProducts() {
  try {
    const response = await fetch('https://dummyjson.com/products?sortBy=brand&order=asc');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    showonUi(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    hideLoader();
    notify('Failed to load products. Please try again.');
  }
}

// Show products on home screen
function showonUi(data) {
  const products = data.products;
  const itemList = document.getElementById('item-list');
  const noResultDiv = document.getElementById('no-result');
  
  if (!itemList) {
    console.error('item-list element not found');
    return;
  }

  productTitles = [];
  itemList.innerHTML = '';

  if (products && products.length > 0) {
    products.forEach((product, index) => {
      const item = document.createElement('div');
      item.className = 'item';
      item.setAttribute('data-index', index);
      
      // Ensure image exists
      const imageUrl = product.images && product.images[0] ? product.images[0] : 'placeholder-image.jpg';
      
      item.innerHTML = `
        <div class="image">
          <img src="${imageUrl}" alt="${product.title}" width="100%" loading="lazy" onerror="this.src='placeholder-image.jpg'">
        </div>
        <div class="item-details">
          <p title="${product.title}">${product.title.slice(0, 20)}...</p>
          <p style="color:grey;">${product.brand || 'Unknown Brand'}</p>
          <p class="price">₹${(product.price * 85).toFixed(0)}</p>
        </div>
      `;
      
      itemList.appendChild(item);

      // Store product data
      productTitles.push(new aProduct(
        product.title,
        product.brand || 'Unknown Brand',
        product.price,
        product.description || 'No description available',
        product.images && product.images[1] ? product.images[1] : imageUrl
      ));
    });

    setupProductClickEvents();
    noResultDiv.innerHTML = '';
  } else {
    itemList.innerHTML = '';
    noResultDiv.innerHTML = '<h2>0 Results Found</h2>';
    const shopItems = document.getElementById('shop-items');
    if (shopItems) {
      shopItems.style.paddingTop = '30px';
    }
  }

  hideLoader();
}

// Setup product click events
function setupProductClickEvents() {
  const allProducts = document.querySelectorAll('.item');
  allProducts.forEach((product, index) => {
    // Remove existing listeners by cloning
    const newProduct = product.cloneNode(true);
    product.parentNode.replaceChild(newProduct, product);
    
    newProduct.addEventListener('click', () => openProductModal(index));
  });
}

// Open product modal
function openProductModal(index) {
  if (!productTitles[index]) return;
  
  const product = productTitles[index];
  const productView = document.getElementById('viewProduct');
  
  if (!productView) return;

  const showProduct = document.createElement('div');
  showProduct.className = 'product-showcase';
  showProduct.innerHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.title}" width="100%" height="100%" loading="lazy" onerror="this.src='placeholder-image.jpg'">
    </div>
    <div class="product-info">
      <h3>${product.title}</h3>
      <p>${product.brand}</p>
      <h3 class="price">₹${(product.price * 85).toFixed(0)}</h3>
      <button class="CartBtn" id="addCart-${index}">
        <span class="IconContainer"> 
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" fill="rgb(17, 17, 17)" class="cart">
            <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
          </svg>
        </span>
        <p class="text" id="addCart-msg-${index}">Add to Cart</p>
      </button>
      <p>${product.description}</p>
    </div>
  `;

  productView.innerHTML = '';
  productView.appendChild(showProduct);
  productView.style.display = 'flex';

  // Setup add to cart button
  setupAddToCartButton(index, product);
}

// Setup add to cart button
function setupAddToCartButton(index, product) {
  const addCartBtn = document.getElementById(`addCart-${index}`);
  const addBtnMsg = document.getElementById(`addCart-msg-${index}`);
  
  if (!addCartBtn || !addBtnMsg) return;

  // Update button state
  updateCartButtonState(addCartBtn, addBtnMsg, product);
  
  // Add click event
  addCartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleCartItem(product, addCartBtn, addBtnMsg);
  });
}

// Update cart button state
function updateCartButtonState(button, message, product) {
  if (isItemAdded(product)) {
    button.style.backgroundColor = 'rgba(0, 218, 118, 1)';
    message.textContent = 'Added To Cart';
  } else {
    button.style.backgroundColor = 'rgba(255, 203, 4, 1)';
    message.textContent = 'Add To Cart';
  }
}

// Toggle cart item
function toggleCartItem(product, button, message) {
  if (isItemAdded(product)) {
    removeFromCart(product);
    button.style.backgroundColor = 'rgba(255, 203, 4, 1)';
    message.textContent = 'Add To Cart';
  } else {
    addToCart(product);
    button.style.backgroundColor = 'rgba(0, 218, 118, 1)';
    message.textContent = 'Added To Cart';
  }
  saveCartToStorage();
}

// Add to cart
function addToCart(product) {
  if (!isItemAdded(product)) {
    addedItemsInCart.push(product);
  }
}

// Remove from cart
function removeFromCart(product) {
  const index = addedItemsInCart.findIndex(item => item.title === product.title);
  if (index > -1) {
    addedItemsInCart.splice(index, 1);
  }
}

// Check if item is in cart
function isItemAdded(item) {
  return addedItemsInCart.some(cartItem => cartItem.title === item.title);
}

// Save cart to localStorage
function saveCartToStorage() {
  try {
    localStorage.setItem('CartItems', JSON.stringify(addedItemsInCart));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
    notify('Failed to save cart data');
  }
}

// Setup all event listeners
function setupEventListeners() {
  // User button
  const userBtn = document.getElementById('user');
  if (userBtn) {
    userBtn.addEventListener('click', handleUserClick);
  }

  // Search functionality
  const searchIcon = document.getElementById('search-icon');
  const searchBar = document.getElementById('search-bar');
  
  if (searchIcon && searchBar) {
    searchIcon.addEventListener('click', () => searchBar.focus());
    searchBar.addEventListener('keyup', handleSearch);
  }

  // Registration form
  setupRegistrationForm();
  
  // Cart functionality
  const cartBtn = document.getElementById('cart');
  if (cartBtn) {
    cartBtn.addEventListener('click', handleCartClick);
  }

  // Profile functionality
  setupProfileEvents();
  
  // Modal close events
  setupModalCloseEvents();
}

// Handle user button click
function handleUserClick() {
  if (!loggedIn) {
    openRegistration();
  } else {
    const profile = document.getElementById('profile');
    if (profile) {
      profile.classList.add('open');
    }
  }
}

// Handle search
function handleSearch(e) {
  if (e.key === "Enter") {
    const searchValue = e.target.value.trim();
    if (searchValue) {
      hideHomeSections();
      showLoader();
      getSearchedProducts(searchValue);
    }
  }
}

// Hide home sections during search
function hideHomeSections() {
  const sectionOne = document.getElementById('section-1');
  const sectionTwo = document.getElementById('section-2');
  
  if (sectionOne) sectionOne.style.display = 'none';
  if (sectionTwo) sectionTwo.style.display = 'none';
}

// Get searched products
async function getSearchedProducts(searchValue) {
  try {
    const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(searchValue)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    showonUi(data);
  } catch (error) {
    console.error('Error searching products:', error);
    hideLoader();
    notify('Search failed. Please try again.');
  }
}

// Setup registration form
function setupRegistrationForm() {
  const registerButton = document.getElementById('register');
  const showPassCheckbox = document.getElementById('show-pass');
  const closeModalBtn = document.getElementById('close-modal');
  
  if (registerButton) {
    registerButton.addEventListener('click', (e) => {
      e.preventDefault();
      registerUser();
    });
  }
  
  if (showPassCheckbox) {
    showPassCheckbox.addEventListener('change', togglePasswordVisibility);
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeRegistration);
  }
}

// Toggle password visibility
function togglePasswordVisibility() {
  const password = document.getElementById('reg-password');
  const confirmPassword = document.getElementById('confirm-password');
  const showPass = document.getElementById('show-pass');
  
  if (password && confirmPassword && showPass) {
    const type = showPass.checked ? 'text' : 'password';
    password.type = type;
    confirmPassword.type = type;
  }
}

// Register user
function registerUser() {
  const userName = document.getElementById('reg-name')?.value?.trim();
  const userMail = document.getElementById('reg-email')?.value?.trim();
  const userPass = document.getElementById('reg-password')?.value;
  const confirmPass = document.getElementById('confirm-password')?.value;

  // Validation
  if (!userName || !userMail || !userPass || !confirmPass) {
    notify('All fields must be filled.');
    return;
  }

  if (userName.length < 5 || userName.length > 16) {
    notify(userName.length < 5 ? 'Username is too short' : 'Username is too long');
    return;
  }

  if (userPass.length < 8) {
    notify('Password is too short');
    return;
  }

  if (userPass !== confirmPass) {
    notify('Password is not same as confirm password');
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userMail)) {
    notify('Please enter a valid email address');
    return;
  }

  // Save user data
  try {
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', userMail);
    localStorage.setItem('userPassword', userPass);
    notify('Registration successful!');
    closeRegistration();
    setTimeout(() => location.reload(), 1000);
  } catch (error) {
    console.error('Error saving user data:', error);
    notify('Registration failed. Please try again.');
  }
}

// Open registration modal
function openRegistration() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

// Close registration modal
function closeRegistration() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Check login status
function login() {
  if (localStorage.getItem('userName')) {
    loggedIn = true;
    const userBtn = document.getElementById('user');
    if (userBtn) {
      userBtn.classList.remove('fa-user');
      userBtn.classList.add('fa-gear');
    }
  }
}

// Handle cart click
function handleCartClick() {
  if (!loggedIn) {
    notify('Please register yourself');
    return;
  }

  if (addedItemsInCart.length === 0) {
    notify('Cart is empty');
    return;
  }

  displayCart();
}

// Display cart
function displayCart() {
  const viewCart = document.getElementById('ViewCart');
  const cartItems = document.getElementById('cartItems');
  
  if (!viewCart || !cartItems) return;

  viewCart.style.display = 'flex';
  cartItems.innerHTML = '';

  addedItemsInCart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="item-image">
        <img src="${item.image}" alt="${item.title}" width="100%" height="100%" loading="lazy" onerror="this.src='placeholder-image.jpg'">
      </div>
      <div class="item-info">
        <div class="item-title">
          <h4>${item.title}</h4>
          <button class="fa fa-times removeItem" data-index="${index}" aria-label="Remove item"></button>
        </div>
        <p>${item.brand}</p>
        <div class="item-price">
          <h4>₹${(item.price * 85).toFixed(0)}</h4>
        </div>
      </div>
    `;
    cartItems.appendChild(cartItem);
  });

  updateAmount();
  setupRemoveItemEvents();
}

// Setup remove item events
function setupRemoveItemEvents() {
  const removeButtons = document.querySelectorAll('.removeItem');
  removeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      if (index >= 0 && index < addedItemsInCart.length) {
        addedItemsInCart.splice(index, 1);
        saveCartToStorage();
        displayCart(); // Refresh cart display
      }
    });
  });
}

// Update total amount
function updateAmount() {
  totalAmount = addedItemsInCart.reduce((sum, item) => sum + (item.price * 85), 0);
  
  const totalAmountElement = document.getElementById('total-amount');
  const checkoutBtn = document.getElementById('checkout');
  
  if (totalAmountElement) {
    totalAmountElement.textContent = `₹${totalAmount.toFixed(0)}`;
  }
  
  if (checkoutBtn) {
    if (addedItemsInCart.length > 0) {
      checkoutBtn.disabled = false;
      checkoutBtn.style.backgroundColor = 'rgba(233, 185, 0, 1)';
    } else {
      checkoutBtn.disabled = true;
      checkoutBtn.style.backgroundColor = '#ccc';
    }
  }
}

// Setup profile events
function setupProfileEvents() {
  const backIcon = document.getElementById('back');
  if (backIcon) {
    backIcon.addEventListener('click', () => {
      const profile = document.getElementById('profile');
      if (profile) {
        profile.classList.remove('open');
      }
    });
  }

  // Personal info button
  const personalBtn = document.getElementById('personal');
  if (personalBtn) {
    personalBtn.addEventListener('click', openPersonalInfo);
  }

  // Address button
  const addressBtn = document.getElementById('address');
  if (addressBtn) {
    addressBtn.addEventListener('click', openAddressView);
  }
}

// Open personal info
function openPersonalInfo() {
  const personalInfoModal = document.getElementById('personalInfoTrigger');
  const profileUserName = document.getElementById('user-name');
  const profileUserMail = document.getElementById('user-mail');
  
  if (personalInfoModal && profileUserName && profileUserMail) {
    personalInfoModal.classList.add('scale');
    profileUserName.value = localStorage.getItem('userName') || '';
    profileUserMail.value = localStorage.getItem('userEmail') || '';
  }
}

// Open address view
function openAddressView() {
  showAllAddresses();
  const addressView = document.getElementById('address-view');
  if (addressView) {
    addressView.classList.add('scale');
  }
}

// Show all addresses
function showAllAddresses() {
  try {
    if (localStorage.getItem('addresses')) {
      addresses = JSON.parse(localStorage.getItem('addresses'));
    }
  } catch (error) {
    console.error('Error loading addresses:', error);
    addresses = [];
  }

  const allAddressContainer = document.getElementById('allAddress');
  if (!allAddressContainer) return;

  allAddressContainer.innerHTML = '';
  
  addresses.forEach((address, index) => {
    const addressElement = document.createElement('div');
    addressElement.className = 'address';
    addressElement.innerHTML = `
      <div class="address-info">
        <h4>${address.type}</h4>
        <p>${address.name}, ${address.lineOne},<br>${address.city}, ${address.pincode}</p>
      </div>
      <div class="delete-address">
        <button class="fa fa-trash" data-index="${index}" aria-label="Delete address"></button>
      </div>
    `;
    allAddressContainer.appendChild(addressElement);
  });

  setupAddressDeleteEvents();
}

// Setup address delete events
function setupAddressDeleteEvents() {
  const deleteButtons = document.querySelectorAll('.delete-address button');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      if (index >= 0 && index < addresses.length) {
        addresses.splice(index, 1);
        saveAddresses();
        showAllAddresses(); // Refresh address list
      }
    });
  });
}

// Save addresses to localStorage
function saveAddresses() {
  try {
    localStorage.setItem('addresses', JSON.stringify(addresses));
  } catch (error) {
    console.error('Error saving addresses:', error);
    notify('Failed to save address');
  }
}

// Setup modal close events
function setupModalCloseEvents() {
  // Close product view when clicking outside
  const productView = document.getElementById('viewProduct');
  if (productView) {
    productView.addEventListener('click', (e) => {
      if (e.target === productView) {
        productView.style.display = 'none';
      }
    });
  }

  // Close cart
  const closeCartBtn = document.getElementById('closeCart');
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
      const viewCart = document.getElementById('ViewCart');
      if (viewCart) {
        viewCart.style.display = 'none';
      }
    });
  }

  // Close address view
  const closeAddressBtn = document.getElementById('close-address');
  if (closeAddressBtn) {
    closeAddressBtn.addEventListener('click', () => {
      const addressView = document.getElementById('address-view');
      if (addressView) {
        addressView.classList.remove('scale');
      }
    });
  }
}

// Loader functions
function showLoader() {
  const loader = document.getElementById('wrap-loader');
  if (loader) {
    loader.style.display = 'flex';
  }
}

function hideLoader() {
  const loader = document.getElementById('wrap-loader');
  if (loader) {
    loader.style.display = 'none';
  }
}

// Notification function
function notify(message) {
  if (isnotified) return;
  
  const notifyArea = document.getElementById('notification-area');
  const notifyMsg = document.getElementById('notify-msg');
  
  if (notifyArea && notifyMsg) {
    isnotified = true;
    notifyMsg.textContent = message;
    notifyArea.classList.add('open');
    
    setTimeout(() => {
      notifyArea.classList.remove('open');
      isnotified = false;
    }, 3000);
  }
}

// Global save address function (called from HTML)
function saveAdress() {
  const addressName = document.getElementById('addressName')?.value?.trim();
  const addressMobile = document.getElementById('addressMobile')?.value?.trim();
  const addressPincode = document.getElementById('addressPincode')?.value?.trim();
  const addressState = document.getElementById('addressState')?.value?.trim();
  const addressCity = document.getElementById('addressCity')?.value?.trim();
  const addressType = document.getElementById('addressType')?.value;
  const addressLineOne = document.getElementById('addressLine1')?.value?.trim();
  const addressLineTwo = document.getElementById('addressLine2')?.value?.trim();

  // Validation
  if (!addressName || !addressMobile || !addressPincode || !addressState || 
      !addressCity || !addressType || !addressLineOne || !addressLineTwo) {
    notify('All fields are required');
    return;
  }

  if (addressMobile.length !== 10 || !/^\d+$/.test(addressMobile)) {
    notify('Enter a valid 10-digit mobile number');
    return;
  }

  if (addressPincode.length !== 6 || !/^\d+$/.test(addressPincode)) {
    notify('Enter a valid 6-digit pincode');
    return;
  }

  // Create and save address
  const newAddress = new Address(
    addressName, addressMobile, addressPincode, addressState,
    addressCity, addressType, addressLineOne, addressLineTwo
  );

  addresses.push(newAddress);
  saveAddresses();
  
  // Clear form
  document.getElementById('addressName').value = '';
  document.getElementById('addressMobile').value = '';
  document.getElementById('addressPincode').value = '';
  document.getElementById('addressState').value = '';
  document.getElementById('addressCity').value = '';
  document.getElementById('addressLine1').value = '';
  document.getElementById('addressLine2').value = '';
  
  // Close form and refresh address list
  const addressForm = document.getElementById('newAddress');
  if (addressForm) {
    addressForm.classList.remove('slideDown');
  }
  
  showAllAddresses();
  notify('Address saved successfully!');
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  notify('An error occurred. Please try again.');
});