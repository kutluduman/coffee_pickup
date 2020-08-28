const menuItems = document.getElementsByTagName("tr");
const menuEditor = document.getElementById("edit-menu-form");
const menu = JSON.parse(sessionStorage.getItem("menu"));

const name = document.getElementsByName("item_name")[0];
const price = document.getElementsByName("item_price")[0];
const prepTime = document.getElementsByName("item_prep_time")[0];
const category = document.getElementsByName("item_category")[0];
const imgUrl = document.getElementsByName("item_image_url")[0];
const desc = document.getElementsByName("item_description")[0];
const inStock = document.getElementsByName("item_in_stock")[0];

const clearForm = () => {
  document.getElementById("edit-menu-form").action = "/addRoute";
  name.value = null;
  price.value = null;
  prepTime.value = null;
  category.value = null;
  imgUrl.value = null;
  desc.value = null;
  inStock.checked = false;
  document.getElementById("update-btn").innerText = "Add Item";
  document.getElementById("update-form-label").innerText = "Add Menu Item";
};

const updateItem = (selectedItem) => {
  document.getElementById("edit-menu-form").action = "/editRoute";
  document.getElementById("update-btn").innerText = "Update Item";
  document.getElementById("update-form-label").innerText = "Update Menu Item";

  console.log(menu[selectedItem]);

  name.value = menu[selectedItem].name;
  price.value = menu[selectedItem].price;
  prepTime.value = menu[selectedItem].prep_time;
  category.value = menu[selectedItem].category;
  imgUrl.value = menu[selectedItem].picture_url;
  desc.value = menu[selectedItem].description;

  if (menu[selectedItem].in_stock) {
    inStock.checked = true;
  } else {
    inStock.checked = false;
  }

  console.log(menuEditor.children);
};

Array.from(menuItems).forEach((menuItem) => {
  menuItem.addEventListener("click", function(e) {
    const itemId = this.getAttribute("item_id");

    console.log(e.target.tagName, this.getAttribute("item_id"));
    if (e.target.id === "edit") {
      updateItem(itemId);
    }
  });
});
