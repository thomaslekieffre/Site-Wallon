import { jsPDF } from "jspdf";
import "jspdf-autotable";

document.addEventListener("DOMContentLoaded", () => {
  const quantityInputs = document.querySelectorAll(".quantity-input");
  const minusButtons = document.querySelectorAll(".minus");
  const plusButtons = document.querySelectorAll(".plus");
  const removeButtons = document.querySelectorAll(".remove-item");
  const cartItems = document.querySelector('.cart-items');
  const total = document.querySelector('.total');

  minusButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const input = quantityInputs[index];
      const currentValue = parseInt(input.value);
      if (currentValue > 1) {
        input.value = currentValue - 1;
        updateTotal();
      }
    });
  });

  plusButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const input = quantityInputs[index];
      input.value = parseInt(input.value) + 1;
      updateTotal();
    });
  });

  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".cart-item").remove();
      updateTotal();
    });
  });

  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  function updateTotal() {
    let totalAmount = 0;
    cart.forEach(product => {
      totalAmount += (product.price * product.quantity);
    });
    total.textContent = totalAmount;
  }


  
  cart.forEach(product => {
    cartItems.innerHTML += 
    `<div class="cart-item" data-id=${product.id}>
      <img src="https://www.celio.com/dw/image/v2/BGBR_PRD/on/demandware.static/-/Sites-celio-master/default/dw8ae06a48/hi-res/171490-700-GEHEM2_OPTICALWHITE-WEB3-1.jpg" />
      <div class="item-details">
          <div class="item-header">
              <h3>${product.name}</h3>
              <button class="delete-btn">
                  <ion-icon name="trash-outline"></ion-icon>
              </button>
          </div>
          <p>Couleur : blanc</p>
          <p>Taille : S</p>
          <p>Quantité : ${product.quantity}</p>
      </div>
  </div>`
  });

const deleteButtons = document.querySelectorAll(".delete-btn");
deleteButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      if (confirm("Voulez-vous vraiment supprimer cet article ?")) {
        // Remove the product from the cart array
        cart.splice(index, 1);

        // Update the localStorage with the modified cart
        localStorage.setItem('cart', JSON.stringify(cart));

        // Remove the item from the DOM
        button.closest(".cart-item").remove();

        // Update the total (if applicable)
        updateTotal();
      }
    });
  });
  updateTotal();
});

function generateOrderPDF(orderData) {
  

  const doc = new jsPDF();

  // Extract data
  const { userId, products } = orderData.order;
  const title = "Bon de commande";
  let totalAmount = 0;

  // Add title
  doc.setFontSize(20);
  doc.text(title, 10, 10);

  // Add User ID
  doc.setFontSize(12);
  doc.text(`ID d'utilisateur: ${userId}`, 10, 20);

  // Add product table headers
  const headers = ["ID", "Nom", "Description", "Prix", "Quantité", "Total"];
  let yPosition = 30;

  doc.setFontSize(10);

  const rows = []

  // Add product rows
  products.forEach((product) => {
    const { id, name, description, price, quantity } = product;

    let totalPrice = price * quantity

    totalAmount += totalPrice;

    rows.push(
      [id, name, description, price, quantity, totalPrice]
    );
  });

  doc.autoTable({
    startY: 30,
    head: [headers],
    body: rows,
  });

  // Add total amount
  yPosition = rows.length * 50 + 30;
  doc.setFontSize(12);
  doc.text(`Prix Total: $${totalAmount}`, 10, yPosition);

  // Save the PDF
  doc.save("order.pdf");
  console.log(doc);
  
}

window.validateCommand = async function () {
  const cart = JSON.parse(localStorage.getItem('cart'));
  const productIds = [];
  const quantities = [];

  cart.forEach(product => {
    productIds.push(product.id);
    quantities.push(product.quantity);
  });

  try {
    const response = await fetch('http://localhost:3000/api/v1/orders/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // Specify JSON format,
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          productIds: productIds,
          quantities: quantities
        }),  // Send data as JSON
    });
    
    if (!response.ok) {
      alert('Failled to create an order !');
    } else {
      const data = await response.json();
      generateOrderPDF(data);
    }

    
  } catch (error) {
      return { status: 'error', content: error.message };  // Return error message if request fails
  }
}
