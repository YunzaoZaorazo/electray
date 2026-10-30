function initMarketPicker(slot) {
  slot.innerHTML = `<section class="picker"><h3>Find a resistor by color code</h3><p>Choose the bands from left to right. The 1st band is the one closest to the end of the resistor.</p><div class="pk-controls"></div><div class="swatch"></div><div class="pk-result"></div></section>`;
  const swatch = slot.querySelector(".swatch");
  const result = slot.querySelector(".pk-result");
  const resCat = CATALOG.find(c => c.name === "Resistors");

  createBandPicker(slot.querySelector(".pk-controls"), r => {
    renderSwatch(swatch, r);
    const head = `<div class="result">${formatOhms(r.ohms)} ±${r.tol}%</div>`;
    const sub = resCat.subs.find(s => s.tol === r.tol);
    if (!sub) {
      result.innerHTML = head + `<p class="sub-result">We only carry 5% and 1% resistors in the standard range. Try the Gold (5%) or Brown (1%) tolerance band.</p>`;
      return;
    }
    const same = (a, b) => Math.abs(a - b) / b < 1e-6;
    const item = sub.items.find(i => same(i[3], r.ohms));
    if (item) {
      result.innerHTML = head + `<p><b>${item[0]}</b> &middot; ${formatRp(item[1])} each &middot; <span class="stock ${item[2] > 0 ? "in" : "out"}">${item[2] > 0 ? item[2] + " in stock" : "Out of stock"}</span></p>`;
      return;
    }
    let near = sub.items[0];
    sub.items.forEach(i => {
      if (Math.abs(Math.log(i[3] / r.ohms)) < Math.abs(Math.log(near[3] / r.ohms))) near = i;
    });
    result.innerHTML = head + `<p class="sub-result">We do not carry this exact value. Nearest available: <b>${near[0]}</b> (${near[2] > 0 ? near[2] + " in stock" : "out of stock"}).</p>`;
  });
}
