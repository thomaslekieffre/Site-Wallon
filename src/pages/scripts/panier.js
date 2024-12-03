document.addEventListener("DOMContentLoaded", () => {
  const quantityInputs = document.querySelectorAll(".quantity-input");
  const minusButtons = document.querySelectorAll(".minus");
  const plusButtons = document.querySelectorAll(".plus");
  const removeButtons = document.querySelectorAll(".remove-item");

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

  function updateTotal() {
    console.log("Total updated");
  }

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (confirm("Voulez-vous vraiment supprimer cet article ?")) {
        button.closest(".cart-item").remove();
        updateTotal();
      }
    });
  });

  const addDiscountBtn = document.querySelector(".add-discount");
  const promoModal = document.getElementById("promoModal");
  const closeModalBtn = document.querySelector(".close-modal");
  const applyPromoBtn = document.querySelector(".apply-promo");

  addDiscountBtn.addEventListener("click", () => {
    promoModal.classList.add("active");
  });

  closeModalBtn.addEventListener("click", () => {
    promoModal.classList.remove("active");
  });

  applyPromoBtn.addEventListener("click", () => {
    const promoCode = document.querySelector(".promo-input").value;
    if (promoCode) {
      alert("Code promo appliqué !");
      promoModal.classList.remove("active");
      updateTotal();
    }
  });

  promoModal.addEventListener("click", (e) => {
    if (e.target === promoModal) {
      promoModal.classList.remove("active");
    }
  });
});
