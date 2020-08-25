const updateModal = (data) => {
  const cat = data;
  console.log(cat);
};

const menuItems = document.getElementsByClassName("menu-item-card");
Array.from(menuItems).forEach((menuItem) => {
  menuItem.addEventListener("click", function () {
    console.log(this.getAttribute('category'));
  });
});
