const deleteItem = (item) => {
  removeFromCart(item.getAttribute("cartItemId"));
};

const removeFromCart = (itemToRemove) => {
  let newCartContent = getCart();
  newCartContent.splice(itemToRemove, 1);
  for (let i = 0; i < newCartContent.length; i++) {
    newCartContent[i].id = i;
  }
  sessionStorage.setItem("cart", JSON.stringify(newCartContent));
  updateCartView();
};
