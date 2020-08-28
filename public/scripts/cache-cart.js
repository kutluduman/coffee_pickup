const addToCartBackend = (item) => {
  const cartString = sessionStorage.getItem("cart");
  const cart = JSON.parse(cartString);

  if (cart) {
    cart.push(item);
    sessionStorage.setItem("cart", JSON.stringify(cart));
  } else {
    sessionStorage.setItem("cart", JSON.stringify([item]));
  }
};

const getCart = () => {
  const cart = sessionStorage.getItem("cart");
  return JSON.parse(cart);
};

$(document).ready(function() {
  $("#upload_cart").submit(function(event) {
    event.preventDefault();

    ///Dummy Data

    let test = {
      1: {
        type: "coffee",
        qty: 2,
      },
      2: {
        type: "bakery",
        qty: 3,
      },
    };

    const cart = sessionStorage.getItem("cart");

    $.ajax({
      method: "POST",
      url: "/home",
      data: { cart: cart },
    })
      .then((res) => {
        window.location.href = "/success";
        sessionStorage.clear();
      })
      .catch((err) => {
        console.log("Error in ajax post /home", err);
      });
  });
});
