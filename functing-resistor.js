const DIGITS = [["Black","#111111",0],["Brown","#7a4a21",1],["Red","#d62828",2],["Orange","#f77f00",3],["Yellow","#f2c230",4],["Green","#2a9d4a",5],["Blue","#2b59c3",6],["Violet","#7b3fa0",7],["Grey","#8a8f94",8],["White","#f5f5f5",9]];
const MULTS = DIGITS.map(([n, c, v]) => [n, c, Math.pow(10, v)]).concat([["Gold","#c9a227",0.1],["Silver","#b8bcc2",0.01]]);
const TOLS = [["Brown","#7a4a21",1],["Red","#d62828",2],["Green","#2a9d4a",0.5],["Blue","#2b59c3",0.25],["Violet","#7b3fa0",0.1],["Grey","#8a8f94",0.05],["Gold","#c9a227",5],["Silver","#b8bcc2",10]];
const TEMPCOS = [["Brown","#7a4a21",100],["Red","#d62828",50],["Orange","#f77f00",15],["Yellow","#f2c230",25],["Blue","#2b59c3",10],["Violet","#7b3fa0",5]];
const LAYOUTS = {
  3: [["1st band", DIGITS], ["2nd band", DIGITS], ["Multiplier", MULTS]],
  4: [["1st band", DIGITS], ["2nd band", DIGITS], ["Multiplier", MULTS], ["Tolerance", TOLS]],
  5: [["1st band", DIGITS], ["2nd band", DIGITS], ["3rd band", DIGITS], ["Multiplier", MULTS], ["Tolerance", TOLS]],
  6: [["1st band", DIGITS], ["2nd band", DIGITS], ["3rd band", DIGITS], ["Multiplier", MULTS], ["Tolerance", TOLS], ["Temp. coefficient", TEMPCOS]]
};

function formatOhms(v) {
  if (v >= 1e6) return +(v / 1e6).toPrecision(4) + " MΩ";
  if (v >= 1e3) return +(v / 1e3).toPrecision(4) + " kΩ";
  return +v.toPrecision(4) + " Ω";
}

/* band picker section */
function createBandPicker(root, onChange) {
  root.innerHTML = `<div class="controls"><label>Number of bands<select class="band-count"><option value="3">3 band</option><option value="4" selected>4 band</option><option value="5">5 band</option><option value="6">6 band</option></select></label><span class="band-fields"></span></div>`;
  const countSel = root.querySelector(".band-count");
  const fields = root.querySelector(".band-fields");

  function calc() {
    const layout = LAYOUTS[countSel.value];
    const picks = [...fields.querySelectorAll("select")].map((s, i) => layout[i][1][s.value]);
    const digitCount = layout.filter(l => l[0].endsWith("band") && l[0] !== "Multiplier").length;
    const ohms = Math.round(parseInt(picks.slice(0, digitCount).map(p => p[2]).join(""), 10) * picks[digitCount][2] * 1000) / 1000;
    const tol = layout.length > digitCount + 1 ? picks[digitCount + 1][2] : 20;
    const tc = layout.length === 6 ? picks[5][2] : null;
    onChange({ layout, picks, ohms, tol, tc });
  }

  function build() {
    const layout = LAYOUTS[countSel.value];
    const digitCount = layout.filter(l => l[0].endsWith("band") && l[0] !== "Multiplier").length;
    const defaults = [4, 7, 0];
    fields.innerHTML = "";
    layout.forEach(([label, list], idx) => {
      const wrap = document.createElement("label");
      wrap.textContent = label;
      const sel = document.createElement("select");
      list.forEach(([name], i) => {
        const o = document.createElement("option");
        o.value = i;
        o.textContent = name;
        sel.appendChild(o);
      });
      if (label.endsWith("band") && label !== "Multiplier") sel.value = defaults[idx];
      else if (label === "Multiplier") sel.value = digitCount === 2 ? 2 : 1;
      else if (label === "Tolerance") sel.value = 6;
      else sel.value = 0;
      sel.addEventListener("change", calc);
      wrap.appendChild(sel);
      fields.appendChild(wrap);
    });
    calc();
  }

  countSel.addEventListener("change", build);
  build();
}

/* swatch section */
function renderSwatch(el, r) {
  el.innerHTML = "";
  r.layout.forEach(([label], i) => {
    const cell = document.createElement("div");
    cell.className = "sw-cell";
    cell.innerHTML = `<span class="sw-color" style="background:${r.picks[i][1]}"></span><small>${label}</small>`;
    el.appendChild(cell);
  });
}
