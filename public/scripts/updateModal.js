const optionsContainer = document.getElementById("options-container");
const menuItems = document.getElementsByClassName("menu-item-card");
const itemCustomizer = document.getElementById("menu-item-customizer");

Array.from(menuItems).forEach((menuItem) => {
  menuItem.addEventListener("click", function() {
    const category = this.getAttribute("category");
    itemCustomizer.setAttribute("category", category);
    itemCustomizer.setAttribute("price", this.getAttribute("price"));
    itemCustomizer.setAttribute("item_name", this.getAttribute("name"));
    itemCustomizer.setAttribute("prep_time", this.getAttribute("prep_time"));

    if (category === "Coffee") {
      optionsContainer.classList.remove("hidden");
      optionsContainer.classList.add("block");
    } else if (category === "Bakery") {
      optionsContainer.classList.remove("block");
      optionsContainer.classList.add("hidden");
    }
  });
});
