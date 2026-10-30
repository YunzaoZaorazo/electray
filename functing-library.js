const root = document.getElementById("library");
const opened = new Set([0]);
let selCat = 0;
let selSub = 0;

function render() {
  let nav = `<nav class="lib-nav">`;
  CATALOG.forEach((c, ci) => {
    nav += `<details data-ci="${ci}" ${opened.has(ci) ? "open" : ""}><summary>${c.name}</summary>`;
    c.subs.forEach((s, si) => {
      nav += `<button data-c="${ci}" data-s="${si}" class="${ci === selCat && si === selSub ? "on" : ""}">${s.name}</button>`;
    });
    nav += `</details>`;
  });
  nav += `</nav>`;

  const cat = CATALOG[selCat];
  const sub = cat.subs[selSub];
  let chips = "";
  sub.items.slice(0, 12).forEach(i => { chips += `<span>${i[0]}</span>`; });
  if (sub.items.length > 12) chips += `<span>+ ${sub.items.length - 12} more</span>`;

  const article = `<article class="lib-article">
    <div class="lib-path">Library / ${cat.name} / ${sub.name}</div>
    <h2>${sub.name}</h2>
    <p class="lead">${sub.fn}</p>
    <h3>Where it is used</h3>
    <p>${sub.usage}</p>
    <h3>Examples in the market</h3>
    <div class="chips">${chips}</div>
    <a class="btn" href="market.html">Shop ${cat.name} in the market</a>
  </article>`;
  root.innerHTML = nav + article;
}

root.addEventListener("click", e => {
  const b = e.target.closest("button[data-c]");
  if (!b) return;
  selCat = +b.dataset.c;
  selSub = +b.dataset.s;
  opened.add(selCat);
  render();
});

root.addEventListener("toggle", e => {
  const ci = +e.target.dataset.ci;
  if (e.target.open) opened.add(ci); else opened.delete(ci);
}, true);

render();
