const triggerMenu = () => {
  document.getElementById("mobile-menu").classList.toggle("w-full");

  const menuItems = Array.from(
    document.getElementsByClassName("mobile-menu-item")
  );
  menuItems.forEach((element) => {
    element.classList.toggle("hidden");
  });
};



const clearForm = () => {
  const sizes = document.getElementsByName("size");
  Array.from(sizes).forEach((btn) => {
    btn.checked = false;
  });

  document.getElementById("item-qty").value = 0;
};



const triggerCart = () => {
  cart.classList.toggle("opacity-100");
  setTimeout(() => {
    cart.classList.toggle("hidden");
  }, 150);
};
