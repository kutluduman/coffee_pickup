const optionsContainer = document.getElementById('options-container');
const menuItems = document.getElementsByClassName("menu-item-card");
Array.from(menuItems).forEach((menuItem) => {
  menuItem.addEventListener("click", function () {
    const category = this.getAttribute("category");
    if (category === "Coffee") {
      optionsContainer.classList.remove('hidden')
      optionsContainer.classList.add('block')
    } else if (category === "Bakery") {
      optionsContainer.classList.remove('block')
      optionsContainer.classList.add('hidden')
    }
  });
});
