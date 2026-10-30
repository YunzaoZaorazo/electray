const CAP_TOL = { B: "±0.1pF", C: "±0.25pF", D: "±0.5pF", F: "±1%", G: "±2%", J: "±5%", K: "±10%", M: "±20%", Z: "+80% / -20%" };
const CAP_MANTISSA = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82];
const CAP_VALUES = [];
CAP_MANTISSA.forEach(m => {
  for (let e = 0; e <= 6; e++) {
    const pf = m * Math.pow(10, e);
    if (pf <= 47e6) CAP_VALUES.push({ code: "" + m + e, pf });
  }
});
CAP_VALUES.sort((a, b) => a.pf - b.pf);

function formatCap(pf) {
  if (pf >= 1e6) return +(pf / 1e6).toPrecision(4) + " µF";
  if (pf >= 1e3) return +(pf / 1e3).toPrecision(4) + " nF";
  return pf + " pF";
}

/* resistor section */
function initResistor() {
  const body = document.getElementById("res-body");
  const out = document.getElementById("res-result");
  const sub = document.getElementById("res-sub");
  createBandPicker(document.getElementById("res-picker"), r => {
    body.innerHTML = "";
    r.picks.forEach(p => {
      const b = document.createElement("i");
      b.style.background = p[1];
      body.appendChild(b);
    });
    out.textContent = formatOhms(r.ohms) + " ±" + r.tol + "%";
    sub.textContent = `Range: ${formatOhms(r.ohms * (1 - r.tol / 100))} to ${formatOhms(r.ohms * (1 + r.tol / 100))}` + (r.tc ? `, ${r.tc} ppm/K` : "");
  });
}

/* capacitor section */
function initCapacitor() {
  ["cap-tol", "pick-tol"].forEach(id => {
    const sel = document.getElementById(id);
    Object.entries(CAP_TOL).forEach(([k, v]) => {
      const o = document.createElement("option");
      o.value = k;
      o.textContent = `${k} (${v})`;
      sel.appendChild(o);
    });
    sel.value = "J";
  });

  const code = document.getElementById("cap-code");
  const searchTol = document.getElementById("cap-tol");
  const searchOut = document.getElementById("cap-result");
  const searchSub = document.getElementById("cap-sub");

  function search() {
    const c = code.value.trim();
    searchSub.textContent = "";
    if (!c) { searchOut.textContent = "Type a code to search"; return; }
    let found = CAP_VALUES.find(v => v.code === c);
    if (!found && /^\d{2}$/.test(c) && CAP_MANTISSA.includes(parseInt(c, 10))) {
      found = { code: c, pf: parseInt(c, 10) };
    }
    if (!found) {
      searchOut.textContent = "Capacity model does not exist";
      searchSub.textContent = `No standard capacitor is marked "${c}".`;
      return;
    }
    searchOut.textContent = formatCap(found.pf);
    searchSub.textContent = `${found.pf} pF, tolerance ${CAP_TOL[searchTol.value]}`;
  }
  code.addEventListener("input", search);
  searchTol.addEventListener("change", search);
  search();

  const valueSel = document.getElementById("pick-value");
  const pickTol = document.getElementById("pick-tol");
  const pickOut = document.getElementById("pick-result");
  const pickSub = document.getElementById("pick-sub");
  CAP_VALUES.forEach((v, i) => {
    const o = document.createElement("option");
    o.value = i;
    o.textContent = formatCap(v.pf);
    valueSel.appendChild(o);
  });
  valueSel.value = CAP_VALUES.findIndex(v => v.code === "104");

  function pick() {
    const v = CAP_VALUES[valueSel.value];
    pickOut.textContent = `Code ${v.code}${pickTol.value}`;
    pickSub.textContent = `${formatCap(v.pf)}, tolerance ${CAP_TOL[pickTol.value]}`;
  }
  valueSel.addEventListener("change", pick);
  pickTol.addEventListener("change", pick);
  pick();
}

/* tabs section */
document.querySelectorAll(".tabs").forEach(tabs => {
  const btns = tabs.querySelectorAll("button");
  btns.forEach(btn => btn.addEventListener("click", () => {
    btns.forEach(b => {
      b.classList.toggle("on", b === btn);
      document.getElementById(b.dataset.panel).hidden = b !== btn;
    });
  }));
});

initResistor();
initCapacitor();
