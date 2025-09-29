const buttonToAdminPage = document.getElementById("admin-button");

const buttonToCashierPage = document.getElementById("cashier-button");

const buttonToDisplayPage = document.getElementById("display-button");

buttonToAdminPage?.addEventListener("click", () => {
  window.location.href = "/admin";
})

buttonToCashierPage?.addEventListener("click", () => {
  window.location.href = "/cashier";
})

buttonToDisplayPage?.addEventListener("click", () => {
  window.location.href = "/display";
})
