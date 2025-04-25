let products = [];
let cart = [];
let currentSection = 'products';
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;


const productsGrid = document.getElementById('productsGrid');
const searchInput = document.querySelector('.search-input');
const checkoutButton = document.getElementById('checkoutButton');
const checkoutContainer = document.getElementById('checkoutContainer');
const cartItems = document.getElementById('cartItems');
const totalPrice = document.getElementById('totalPrice');
const proceedToPayment = document.getElementById('proceedToPayment');
const purchaseForm = document.getElementById('purchaseForm');
const orderForm = document.getElementById('orderForm');
const confirmationContainer = document.getElementById('confirmationContainer');
const orderSummary = document.getElementById('orderSummary');
const backToShop = document.getElementById('backToShop');


const searchContainer = document.getElementById('search-container');


document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  setupEventListeners();
});


showSlide(currentSlide);

function showSlide(index) {
  slides.forEach((slide) => {
    slide.classList.remove("active");
  });
  slides[index].classList.add("active");
  currentSlide = index;
}

function prevSlide() {
  const newIndex = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(newIndex);
}

function nextSlide() {
  const newIndex = (currentSlide + 1) % totalSlides;
  showSlide(newIndex);
}

let autoPlayInterval;

function autoPlay() {
  autoPlayInterval = setInterval(() => {
    const newIndex = (currentSlide + 1) % totalSlides;
    showSlide(newIndex);
  }, 3000);
}

function stopAutoPlay() {
  clearInterval(autoPlayInterval);
}

document.getElementById("prev").addEventListener("click", prevSlide);
document.getElementById("next").addEventListener("click", nextSlide);

// 新增鼠标悬停和移出的事件监听
const carousel = document.querySelector(".carousel");
carousel.addEventListener("mouseover", stopAutoPlay);
carousel.addEventListener("mouseout", autoPlay);

autoPlay(); // 页面加载时自动开始自动播放

showSlide(0);

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

const form = document.getElementById("registrationform");

form.addEventListener("submit", (event) => {
  let isValid = true;

  if (document.getElementById("date-of-visit").value === "") {
    document.getElementById("visitDateError").textContent = "Select your visit date.";
    isValid = false;
  } else {
    document.getElementById("visitDateError").textContent = "";
  }

  if (document.getElementById("no-of-visitors").value === "") {
    document.getElementById("visitorsError").textContent = "Select the number of visitors.";
    isValid = false;
  } else {
    document.getElementById("visitorsError").textContent = "";
  }

  if (document.getElementById("name").value.trim() === "") {
    document.getElementById("nameError").textContent = "Name is required.";
    isValid = false;
  } else {
    document.getElementById("nameError").textContent = "";
  }

  const email = document.getElementById("email").value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    document.getElementById("emailError").textContent = "Enter a valid email.";
    isValid = false;
  } else {
    document.getElementById("emailError").textContent = "";
  }

  if (document.getElementById("dob").value === "") {
    document.getElementById("dobError").textContent = "Select your birth date.";
    isValid = false;
  } else {
    document.getElementById("dobError").textContent = "";
  }

  const gender = document.querySelector('input[name="gender"]:checked');
  if (!gender) {
    document.getElementById("genderError").textContent = "Please select your gender.";
    isValid = false;
  } else {
    document.getElementById("genderError").textContent = "";
  }

  if (document.getElementById("ticket").value === "") {
    document.getElementById("ticketError").textContent = "Choose a ticket type.";
    isValid = false;
  } else {
    document.getElementById("ticketError").textContent = "";
  }

  if (!isValid) {
    event.preventDefault();
  }
});

window.showSlide = showSlide;
window.prevSlide = prevSlide;
window.nextSlide = nextSlide;
window.startAutoSlide = autoPlay;
window.stopAutoSlide = stopAutoPlay;


function loadProducts() {
  fetch('ghibli_merchandise.json')
    .then(response => response.json())
    .then(productsObjects => {
      products = productsObjects;
      displayProducts(products);
    })
    .catch(error => {
      console.error('Error loading products:', error);
    });
}

function displayProducts(productsToShow) {
  productsGrid.innerHTML = '';
  productsToShow.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price}</p>
                <button class="add-to-cart" onclick="addToCart('${product.id}')">Add to Cart</button>
            </div>
        `;
    productsGrid.appendChild(card);
  });
}

searchInput.addEventListener('input', (e) => {
  const searchTerm = document.getElementById("input").value.trim();
  const filteredProducts = products.filter(product =>
    product.name.includes(searchTerm) ||
    product.description.includes(searchTerm)
  );
  displayProducts(filteredProducts);
});

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    cart.push(product);
    updateCart();
    checkoutButton.style.display = 'block';
  }
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span class="item-name">${item.name}</span>
            <span class="item-price">$${item.price}</span>
        </div>
    `).join("");

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
  totalPrice.textContent = `Total: $${total.toFixed(2)}`;

  const totalnum = cart.reduce((sum, item) => sum + 1, 0);
  itemCount.textContent = totalnum;
  allprice.textContent = `$${total.toFixed(2)}`;
}

function setupEventListeners() {
  checkoutButton.addEventListener('click', () => {
    if (searchContainer) {
      searchContainer.style.display = 'none';
    }
    showSection('checkout');
    if (checkoutButton) {
      checkoutButton.style.display = 'none';
    }
  });

  proceedToPayment.addEventListener('click', () => {
    showSection('payment');
  });

  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
      showSection('confirmation');
      displayOrderSummary();
      const totalnum = cart.reduce((sum, item) => sum + 1, 0);
      itemCount.textContent = totalnum;
    }
  });

  backToShop.addEventListener('click', () => {
    showSection('products');
    cart = [];
    updateCart();
    checkoutButton.style.display = 'none';
    searchContainer.style.display = 'block';
  });
}

function showSection(section) {
  const sections = {
    products: () => {
      productsGrid.style.display = 'grid';
      checkoutContainer.style.display = 'none';
      purchaseForm.style.display = 'none';
      confirmationContainer.style.display = 'none';
    },
    checkout: () => {
      productsGrid.style.display = 'none';
      checkoutContainer.style.display = 'block';
      purchaseForm.style.display = 'none';
      confirmationContainer.style.display = 'none';
    },
    payment: () => {
      productsGrid.style.display = 'none';
      checkoutContainer.style.display = 'none';
      purchaseForm.style.display = 'block';
      confirmationContainer.style.display = 'none';
    },
    confirmation: () => {
      productsGrid.style.display = 'none';
      checkoutContainer.style.display = 'none';
      purchaseForm.style.display = 'none';
      confirmationContainer.style.display = 'block';
    }
  };

  sections[section]();
  currentSection = section;
}

function validateForm() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;
  const cardNumber = document.getElementById('cardNumber').value;
  const expiryDate = document.getElementById('expiryDate').value;
  const cvv = document.getElementById('cvv').value;

  if (!name || !email || !address || !cardNumber || !expiryDate || !cvv) {
    alert('Please fill in all required fields');
    return false;
  }
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    alert('Please enter a valid email address');
    return false;
  }

  if (!/^\d{16}$/.test(cardNumber)) {
    alert('Please enter a valid credit card number');
    return false;
  }

  if (!/^\d{3}$/.test(cvv)) {
    alert('Please enter a valid CVV code');
    return false;
  }

  customerName.textContent = name + " !";
  deliveryAddress.textContent = address;

  return true;
}

function displayOrderSummary() {
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const itemsList = cart.map(item => `${item.name} - $${item.price}`).join('<br>');

  orderSummary.innerHTML = `
        <h3>Order Details</h3>
        <p>${itemsList}</p>
        <p>Total: $${total.toFixed(2)}</p>
    `;
}

