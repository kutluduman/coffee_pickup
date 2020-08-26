const checkoutBackground = document.getElementById(
  "checkout-mobile-background"
);
const checkoutCart = document.getElementById("checkout-cart");

const btnLabel = document.getElementById("mobile-menu-label");

const showMobileCart = () => {
  checkoutBackground.classList.toggle("h-screen");
  checkoutBackground.classList.toggle("hidden");
  checkoutBackground.classList.toggle("opacity-100");

  checkoutCart.classList.remove("hidden");
  checkoutCart.classList.add("opacity-100");

  document.getElementById("menu-items-container").classList.toggle("hidden");
  document.getElementById("menu").classList.toggle("fixed");
  document.getElementById("menu").classList.toggle("top-0");
  document.getElementById("menu").classList.toggle("z-30");
  document.getElementById("menu").classList.toggle("w-full");

  if (btnLabel.innerText === "Hide Current Order") {
    btnLabel.innerText = "View Current Order";
  } else {
    btnLabel.innerText = "Hide Current Order";
  }
};

const hideMobileCart = () => {
  checkoutBackground.classList.remove("h-screen");
  checkoutBackground.classList.add("hidden");
  body.classList.remove("overflow-y-hidden");

  document.getElementById("menu").classList.remove("fixed");
  document.getElementById("menu").classList.remove("top-0");
  document.getElementById("menu").classList.remove("z-30");
  document.getElementById("menu").classList.remove("w-full");

  document.getElementById("menu-items-container").classList.remove("hidden");

  checkoutBackground.classList.remove("opacity-100");
  btnLabel.innerText = "View Current Order";
};

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) {
    hideMobileCart();
  }
});
