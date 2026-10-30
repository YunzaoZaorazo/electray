function browse(rootId, mode) {
  const root = document.getElementById(rootId);
  let cat = null;
  let sub = null;

  function render() {
    let h = `<div class="crumbs"><button data-go="home">All categories</button>`;
    if (cat) h += `<span>/</span><button data-go="cat">${cat.name}</button>`;
    if (sub) h += `<span>/</span><b>${sub.name}</b>`;
    h += `</div>`;
    if (mode === "store" && cat && cat.name === "Resistors") h += `<div id="picker-slot"></div>`;

    if (!cat) {
      h += `<div class="grid cols-4">`;
      CATALOG.forEach((c, i) => {
        h += `<button class="tile" data-cat="${i}"><span class="tile-icon">${c.icon}</span><h3>${c.name}</h3><p>${c.subs.length} subcategories</p></button>`;
      });
      h += `</div>`;
    } else if (!sub) {
      h += `<div class="grid cols-4">`;
      cat.subs.forEach((s, i) => {
        h += `<button class="tile" data-sub="${i}"><span class="tile-icon">${cat.icon}</span><h3>${s.name}</h3><p>${s.items.length} products</p></button>`;
      });
      h += `</div>`;
    } else if (mode === "store") {
      h += `<div class="grid cols-3">`;
      sub.items.forEach(([name, price, stock]) => {
        h += `<article class="product"><h4>${name}</h4><p class="tag">${sub.name}</p><div class="row"><span class="price">${formatRp(price)}</span><span class="stock ${stock > 0 ? "in" : "out"}">${stock > 0 ? stock + " in stock" : "Out of stock"}</span></div></article>`;
      });
      h += `</div>`;
    }
    root.innerHTML = h;
    const slot = document.getElementById("picker-slot");
    if (slot && typeof initMarketPicker === "function") initMarketPicker(slot);
  }

  root.addEventListener("click", e => {
    const t = e.target.closest("button");
    if (!t || !t.closest(".crumbs, .tile")) return;
    if (t.dataset.cat !== undefined) { cat = CATALOG[t.dataset.cat]; sub = null; }
    else if (t.dataset.sub !== undefined) { sub = cat.subs[t.dataset.sub]; }
    else if (t.dataset.go === "home") { cat = null; sub = null; }
    else if (t.dataset.go === "cat") { sub = null; }
    render();
  });

  render();
}
