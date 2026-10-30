const STORE_NAME = "ElecTray";
const PAGES = [
  ["Home", "index.html"],
  ["Market", "market.html"],
  ["Simulator", "simulator.html"],
  ["Library", "library.html"],
  ["Contact", "contact.html"]
];
const FOOTER_BUTTONS = [
  ["Shop the market", "market.html"],
  ["Try the simulator", "simulator.html"],
  ["Read the library", "library.html"],
  ["Contact us", "contact.html"]
];
const current = location.pathname.split("/").pop() || "index.html";

/* navbar section */
let navLinks = "";
PAGES.forEach(([label, href]) => {
  navLinks += `<a href="${href}" class="${href === current ? "active" : ""}">${label}</a>`;
});
document.getElementById("navbar").innerHTML =
  `<div class="wrap"><a class="brand" href="index.html">${STORE_NAME}</a><div class="links">${navLinks}</div></div>`;

/* footer section */
let footLinks = "";
FOOTER_BUTTONS.forEach(([label, href]) => {
  footLinks += `<a href="${href}">${label}</a>`;
});
document.getElementById("footer").innerHTML =
  `<div class="wrap"><strong>${STORE_NAME} &copy; ${new Date().getFullYear()}</strong><div class="foot-btns">${footLinks}</div></div>`;
