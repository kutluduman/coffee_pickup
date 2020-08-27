const createCartItem = (cartItem) => {
  //escap inputs to prevent sql injection
  const cartTemplate = `
	<article class="cart-item flex flex-wrap justify-between px-4 py-4 border-b border-t ">
		<div class="flex items-center flex-wrap">
			<p class="item-qty font-body text-coffee-brown mr-2 inline-block">${
        cartItem.qty
      }</p>
			<p class="font-body text-ash text-xl inline-block">${cartItem.item_name}</p>
		</div>
		<div class="flex items-center">
		<p class="text-gray-700 mr-2">${
     (cartItem.price * cartItem.qty / 100).toLocaleString("en-US", {style:"currency", currency:"USD"})
    }</p><img cartItemId="${
    cartItem.id
  }" onclick="deleteItem(this)" id="remove-item" src="/images/icons/close-circle.svg"></div>

    ${
      cartItem.options.size
        ? `	<ul class="selected-options block list-disc w-48 ml-10 w-full">
    <li class="text-light-grey text-sm">${cartItem.options.size}</li>
  </ul>`
        : ``
    }
	
  </article>
  `;

  return cartTemplate;
};

const getCartQty = () => {
  document.getElementById("cartQty").innerText = getCart().length;
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

  getCartQty();
  calculateTotal();
};

const calculateTotal = () => {
  let total = 0;
  const cart = getCart();
  cart.forEach((elem) =>{
    total += elem.price * elem.qty;
  });
  document.getElementById('bill-total').innerText =  (total / 100).toLocaleString("en-US", {style:"currency", currency:"USD"});
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

    //Sets item id to cart array index
    let cartItemId = JSON.parse(sessionStorage.getItem("cart"))
      ? JSON.parse(sessionStorage.getItem("cart")).length
      : 0;

    const item = {
      id: cartItemId,
      item_name: cartItemOptions.getAttribute("item_name"),
      qty: rawCart.get("item-qty"),
      price: 
        cartItemOptions.getAttribute("price") ,
   
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
