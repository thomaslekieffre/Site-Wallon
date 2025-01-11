document.addEventListener("DOMContentLoaded", async () => {
  // Select elements
  const categoryButtons = document.querySelectorAll(".category-link");
  const productsGrid = document.querySelector(".products-grid");

  // Fetch products from the API
  const products = await fetchProducts();

  // Render products
  renderProducts(products);

  // Handle category filtering
  setupCategoryFilters(categoryButtons, products);

  // Set up "Add to Cart" buttons
  setupAddToCartButtons();

  // Load and display the cart from localStorage
  loadCart();
});

// Fetch products from the API
async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3000/api/v1/products", {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Render products on the page
function renderProducts(products) {
  const productsGrid = document.querySelector(".products-grid");

  if (products.length > 0) {
    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card", "visible");
      productCard.setAttribute("data-category", product.type);

      productCard.innerHTML = `
        <img src="https://www.celio.com/dw/image/v2/BGBR_PRD/on/demandware.static/-/Sites-celio-master/default/dw8ae06a48/hi-res/171490-700-GEHEM2_OPTICALWHITE-WEB3-1.jpg" />
        <h3>${product.name}</h3>
        <p class="price">${product.price.toFixed(2)}€</p>
        <div class="product-details">
          <p class="description">${product.description}</p>
          <button class="add-to-cart" data-product-id="${product.id}">
            <ion-icon name="cart-outline"></ion-icon>
            Ajouter au panier
          </button>
        </div>
      `;
      productsGrid.appendChild(productCard);
    });
  } else {
    productsGrid.innerHTML = `<p>Aucun produit disponible pour le moment.</p>`;
  }
}

// Set up category filtering
function setupCategoryFilters(categoryButtons, products) {
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active class
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const selectedCategory = button.dataset.category;

      // Filter products
      const productCards = document.querySelectorAll(".product-card");
      productCards.forEach((productCard) => {
        const productCategory = productCard.getAttribute("data-category");
        if (
          selectedCategory === "all" ||
          productCategory === selectedCategory
        ) {
          productCard.classList.add("visible");
        } else {
          productCard.classList.remove("visible");
        }
      });
    });
  });
}

// Set up "Add to Cart" buttons
function setupAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-product-id");
      addToCart(productId);
    });
  });
}

// Add product to cart
function addToCart(productId) {
  const productCard = document.querySelector(
    `.product-card .add-to-cart[data-product-id="${productId}"]`
  ).closest(".product-card");

  const product = {
    id: productId,
    name: productCard.querySelector("h3").textContent,
    price: parseFloat(productCard.querySelector(".price").textContent),
    description: productCard.querySelector(".description").textContent,
    image: productCard.querySelector("img").src,
    quantity: 1,
  };

  let cart = getCart();

  // Check if product is already in the cart
  const existingProduct = cart.find((item) => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1; // Increment quantity
  } else {
    cart.push(product); // Add new product
  }

  saveCart(cart);
  displayCartNotification();
}

// Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Load and display the cart (optional)
function loadCart() {
  const cart = getCart();
  console.log("Loaded cart:", cart); // You can use this to display the cart
}

// Display a notification when a product is added to the cart
function displayCartNotification() {
  alert("Produit ajouté au panier !");
}
