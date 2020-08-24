const triggerMenu = () => {
  document.getElementById("mobile-menu").classList.toggle('w-full');

  const menuItems = Array.from(
    document.getElementsByClassName("mobile-menu-item")
  );
  menuItems.forEach((element) => {
    element.classList.toggle("hidden");
  });
};
