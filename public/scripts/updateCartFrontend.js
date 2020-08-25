const createCartItem = (cartItem) => {
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
		<ul class="selected-options block list-disc w-48 ml-10">
			<li class="text-light-grey text-sm">${cartItem.options.size}</li>
		</ul>
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

  htmlCart.forEach((element) => {
    checkoutUI.insertAdjacentHTML("beforeend", element);
  });

  console.log(htmlCart);
};

const addToCardUI =()=>{
 let rawCart = new FormData(document.getElementById('menu-item-customizer'));
 console.log(rawCart.get('size'));
}