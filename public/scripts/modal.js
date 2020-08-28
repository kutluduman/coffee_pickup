const modalBackground = document.getElementById("modal-background");
const modal = document.getElementById("modal");
const body = document.getElementsByTagName("body")[0];
const cart = document.getElementById("checkout-cart");

const openModal = () => {
  modalBackground.classList.toggle("hidden");

  modalBackground.classList.toggle("opacity-100");
  modal.classList.toggle("opacity-100");

  body.classList.toggle("overflow-y-hidden");
};

const closeModal = () => {
  modalBackground.classList.toggle("opacity-100");
  modal.classList.toggle("opacity-100");
  setTimeout(() => {
    modalBackground.classList.toggle("hidden");
  }, 150);
  body.classList.toggle("overflow-y-hidden");
};

modal.onclick = function (e) {
  if (e.target.id === "close-modal") {
    modalBackground.classList.toggle("opacity-100");
    modal.classList.toggle("opacity-100");
    setTimeout(() => {
      modalBackground.classList.toggle("hidden");
    }, 150);
    body.classList.toggle("overflow-y-hidden");
  }
};
