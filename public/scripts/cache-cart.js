// const item = {
//   item_name: "Lighthouse Americano",
//   qty: 2,
//   price: 3.00,
//   options: {
//     size: "medium",
//   },
// };

const addToCartBackend = (item) => {
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

$(document).ready(function() {

  $( "#upload_cart" ).submit(function(event) {

  //stop preventDefault at the beginning always
  event.preventDefault();


  ///Dummy Data

  let test = {
    1:{
      type:'coffee',
      qty: 2
    },
    2:{
      type:'bakery',
      qty: 3
    }
  }

  //INPUT VALIDATION
  //if all correct

  //Save data to the server
  //const cart = $( "localStorage" ).serialize();
  const cart = localStorage.getItem("cart");
  // cart = getCart
  console.log(cart)
  $.ajax({
  method: "POST",
  url: "/home",
  data: {'cart': cart}
  })

  // .done(function() {
  // //remove all tweeers by reloading the page without GET them from the server
  // location.reload(true);
  // //then reload all of them
  // loadTweets();
  // });
  })
});


