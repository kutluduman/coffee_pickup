const triggerMenu = () => {
  document.getElementById("mobile-menu").classList.toggle("w-full");

  const menuItems = Array.from(
    document.getElementsByClassName("mobile-menu-item")
  );
  menuItems.forEach((element) => {
    element.classList.toggle("hidden");
  });
};

const modalBackground = document.getElementById("modal-background");
const modal = document.getElementById("modal");
const body = document.getElementsByTagName("body")[0];

const openModal = () => {
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
    }, 1050);
    body.classList.toggle("overflow-y-hidden");
  }
};
