const itemQty = document.getElementById("item-qty");
const addBtn = document.getElementById("add-qty");
const removeBtn = document.getElementById("remove-qty");



addBtn.addEventListener("click", () => {
  let newValue = parseInt(itemQty.value, 10);
  itemQty.value = newValue += 1;
});

removeBtn.addEventListener("click", () => {
  let newValue = parseInt(itemQty.value, 10);
  if (itemQty.value <= 0) {
    itemQty.value = 0;
  } else {
    itemQty.value = newValue -= 1;
  }
});
