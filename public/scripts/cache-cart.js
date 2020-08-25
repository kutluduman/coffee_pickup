const item = {
  item_name: "Lighthouse Americano",
  qty: 2,
  price: 3.00,
  options: {
    size: "medium",
  },
};

const addToCart = (item) => {
  const cartString = localStorage.getItem("cart");
  const cart = JSON.parse(cartString);
  console.log(cart);
  if (cart) {
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
  } else {
    localStorage.setItem("cart", JSON.stringify([item]));
  }
};

const getCart = () => {
  const cart = localStorage.getItem("cart");
  return JSON.parse(cart);
};


