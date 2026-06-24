const ruletka = document.querySelector(".ruletka");

const items = Array.from(ruletka.querySelectorAll(".buy"));

const firstGroup = document.createElement("div");
firstGroup.classList.add("ruletkaGroup");

items.forEach((item) => {
  firstGroup.appendChild(item);
});

ruletka.innerHTML = "";
ruletka.appendChild(firstGroup);

const secondGroup = firstGroup.cloneNode(true);
secondGroup.classList.add("ruletkaGroupClone");
secondGroup.setAttribute("aria-hidden", "true");

secondGroup.style.marginLeft = "-3.2vw";

ruletka.appendChild(secondGroup);

const orderOverlay = document.querySelector("#orderOverlay");
const orderClose = document.querySelector("#orderClose");
const orderForm = document.querySelector("#orderForm");
const orderProduct = document.querySelector("#orderProduct");
const cardNumberInput = document.querySelector("#cardNumber");

function openOrderModal(productName) {
  orderProduct.textContent = productName;
  orderOverlay.classList.add("active");
  document.body.classList.add("modalOpen");
}

function closeOrderModal() {
  orderOverlay.classList.remove("active");
  document.body.classList.remove("modalOpen");
}

document.addEventListener("click", (event) => {
  const buyButton = event.target.closest(".buyButton");

  if (!buyButton) return;

  const buyCard = buyButton.closest(".buy");
  const title = buyCard.querySelector(".buyTitle").textContent;
  const price = buyCard.querySelector(".buyPrice").textContent;

  openOrderModal(`${title} — ${price}`);
});

orderClose.addEventListener("click", closeOrderModal);

orderOverlay.addEventListener("click", (event) => {
  if (event.target === orderOverlay) {
    closeOrderModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeOrderModal();
  }
});

cardNumberInput.addEventListener("input", () => {
  let value = cardNumberInput.value.replace(/\D/g, "");

  value = value.slice(0, 16);

  cardNumberInput.value = value.replace(/(.{4})/g, "$1 ").trim();
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  alert("Заявка отправлена!");

  orderForm.reset();
  closeOrderModal();
});
