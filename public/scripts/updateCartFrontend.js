const createCartItem = (cartItem) => {

  //escap inputs to prevent sql injection
  const cartTemplate = `
	<article class="cart-item flex flex-wrap justify-between px-4 py-4 border-b border-t">
		<div class="flex items-center flex-wrap">
			<p class="item-qty font-body text-coffee-brown mr-2 inline-block">${
  cartItem.qty
}</p>
			<p class="font-body text-ash text-xl inline-block">${cartItem.item_name}</p>
		</div>
		<div class="flex items-center">
		<p class="text-gray-700 mr-2">${
  cartItem.price * cartItem.qty
}</p><img class="" src="/images/icons/close-circle.svg"></div>

    ${
  cartItem.options.size
    ? `	<ul class="selected-options block list-disc w-48 ml-10">
    <li class="text-light-grey text-sm">${cartItem.options.size}</li>
  </ul>`
    : ``
}
	
  </article>
  `;

  return cartTemplate;
};

const updateCartView = () => {
  const cart = getCart();

  const htmlCart = cart.map((cartItem) => {
    return createCartItem(cartItem);
  });

  const checkoutUI = document.getElementById("cart-items-container");
  checkoutUI.innerHTML = "";
  htmlCart.forEach((element) => {
    checkoutUI.insertAdjacentHTML("beforeend", element);
  });

};

const addToCardUI = () => {
  const cartItemOptions = document.getElementById("menu-item-customizer");
  let rawCart = new FormData(cartItemOptions); // vanilla js version of getting form data

  if (rawCart.get("item-qty") < 1) {
    return false;
    //show error message
  } else if (
    cartItemOptions.getAttribute("category") === "Coffee" &&
    !rawCart.get("size")
  ) {
    //show error message
    return false;
  } else {
    //creates the order item for local storage
    const item = {
      item_name: cartItemOptions.getAttribute("item_name"),
      qty: rawCart.get("item-qty"),
      price: parseFloat(
        (cartItemOptions.getAttribute("price") * rawCart.get("item-qty")) / 100
      ).toFixed(2),
      category: cartItemOptions.getAttribute("category"),
      options: {
        size: rawCart.get("size"),
      },
    };

    addToCartBackend(item);
    updateCartView();
    clearForm();
    closeModal();
  }
};
