document.addEventListener("DOMContentLoaded", () => {
  const categoryButtons = document.querySelectorAll(".category-link");
  const products = document.querySelectorAll(".product-card");

  products.forEach((product) => product.classList.add("visible"));

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const selectedCategory = button.dataset.category;

      products.forEach((product) => {
        if (
          selectedCategory === "all" ||
          product.dataset.category === selectedCategory
        ) {
          product.classList.add("visible");
        } else {
          product.classList.remove("visible");
        }
      });
    });
  });
});

async function getProducts_request() {
  const response = await fetch('http://localhost:3000/api/v1/products', {
    method: 'GET',
  });
  const data = await response.json();
  return data;
}


document.addEventListener("DOMContentLoaded", async () => {
  const productsGrid = document.querySelector(".products-grid");
  const products = await getProducts_request();

  console.log(products);


  if (products.status === 200 && products.content.length > 0) {
    products.content.forEach(product => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.classList.add("visible");
      productCard.setAttribute("data-category", product.type); // On utilise le champ "type" pour la catégorie

      // Structure HTML de chaque produit      
      productCard.innerHTML = `
        <img src="${product.url[0] || `http://localhost:3000/api/v1/images?product_id=${product.id}&image_id=${product.url[0]}`}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p class="price">${product.price.toFixed(2)}€</p>
        <div class="product-details">
          <p class="description">${product.description}</p>
          <button class="add-to-cart">
            <ion-icon name="cart-outline"></ion-icon>
            Ajouter au panier
          </button>
        </div>
      `;
      productsGrid.appendChild(productCard);
    });
  } else {
    // Gestion des cas où aucun produit n'est trouvé
    productsGrid.innerHTML = `<p>Aucun produit disponible pour le moment.</p>`;
  }
});