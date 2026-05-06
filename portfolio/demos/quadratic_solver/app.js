const aInput = document.getElementById('a');
const bInput = document.getElementById('b');
const cInput = document.getElementById('c');
const btnSolve = document.getElementById('btnSolve');
const btnReset = document.getElementById('btnReset');
const solverMsg = document.getElementById('solverMsg');
const resultCalc = document.getElementById('resultCalc');
const resultSolution = document.getElementById('resultSolution');
const calcOut = document.getElementById('calcOut');
const solOut = document.getElementById('solOut');

const didA = document.getElementById('didA');
const didB = document.getElementById('didB');
const didC = document.getElementById('didC');
const didD = document.getElementById('didD');
const didNature = document.getElementById('didNature');
const didOpen = document.getElementById('didOpen');
const didStretch = document.getElementById('didStretch');
const didVertex = document.getElementById('didVertex');
const didNote = document.getElementById('didNote');
const didaktikPanel = document.getElementById('didaktikPanel');
const didaktikHint = document.getElementById('didaktikHint');

const v0Input = document.getElementById('v0');
const h0Input = document.getElementById('h0');
const praxisBtn = document.getElementById('praxis-btn');
const praxisResult = document.getElementById('praxis-result');
const praxisSteps = document.getElementById('praxis-steps');

btnSolve?.addEventListener('click', handleSolveClick);
btnReset?.addEventListener('click', handleResetClick);
praxisBtn?.addEventListener('click', handlePraxis);
const btnPracticeSolution = document.getElementById('btnPracticeSolution');
const practiceSolution = document.getElementById('practiceSolution');

btnPracticeSolution?.addEventListener('click', () => {
  if (!practiceSolution) return;
  const show = practiceSolution.hidden;
  practiceSolution.hidden = !show;
  btnPracticeSolution.innerHTML = show
    ? 'Lösung verbergen <span class="hint-ru">/ verbergen</span>'
    : 'Lösung anzeigen <span class="hint-ru">/ anzeigen</span>';
  if (show) practiceSolution.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function handleSolveClick() {
  const a = parseNumberDE(aInput?.value);
  const b = parseNumberDE(bInput?.value);
  const c = parseNumberDE(cInput?.value);

  if (!isFinite(a) || !isFinite(b) || !isFinite(c)) {
    showMsg('Bitte a, b, c als Zahlen eingeben (Komma erlaubt).', true);
    hideResults();
    resetDidaktik();
    if (didaktikPanel) didaktikPanel.hidden = true;
    if (didaktikHint) didaktikHint.style.display = '';
    return;
  }

  showMsg('');
  const result = solveEquation(a, b, c);
  renderCalc(a, b, c, result);
  renderSolution(result);
  resultCalc.hidden = false;
  resultSolution.hidden = false;

  if (result.type === 'linear' || result.type === 'none' || result.type === 'infinite') {
    renderDidaktikLinear(a, b, c);
  } else {
    renderDidaktikQuadratic(a, b, c, result.D);
  }

  if (didaktikPanel) didaktikPanel.hidden = false;
  if (didaktikHint) didaktikHint.style.display = 'none';
}

function handleResetClick() {
  if (aInput) aInput.value = '';
  if (bInput) bInput.value = '';
  if (cInput) cInput.value = '';
  showMsg('');
  hideResults();
  resetDidaktik();
  if (didaktikPanel) didaktikPanel.hidden = true;
  if (didaktikHint) didaktikHint.style.display = '';
}

function hideResults() {
  if (resultCalc) resultCalc.hidden = true;
  if (resultSolution) resultSolution.hidden = true;
  if (calcOut) calcOut.innerHTML = '';
  if (solOut) solOut.innerHTML = '';
}

function showMsg(text, isError = false) {
  if (!solverMsg) return;
  solverMsg.textContent = text;
  solverMsg.className = isError ? 'msg error' : 'msg';
}

function parseNumberDE(str) {
  if (str === undefined || str === null) return NaN;
  const cleaned = String(str).trim().replace(/\s+/g, '').replace(',', '.');
  return cleaned === '' ? NaN : parseFloat(cleaned);
}

function solveEquation(a, b, c) {
  const eps = 1e-12;
  if (Math.abs(a) < eps) {
    if (Math.abs(b) < eps) {
      if (Math.abs(c) < eps) return { type: 'infinite' };
      return { type: 'none' };
    }
    const x = -c / b;
    return { type: 'linear', x };
  }

  const D = b * b - 4 * a * c;
  if (D < -eps) return { type: 'complex', D };
  if (Math.abs(D) <= eps) {
    const x = -b / (2 * a);
    return { type: 'double', D: 0, x };
  }
  const sqrtD = Math.sqrt(D);
  const x1 = (-b - sqrtD) / (2 * a);
  const x2 = (-b + sqrtD) / (2 * a);
  return { type: 'two', D, sqrtD, x1, x2 };
}

function renderCalc(a, b, c, result) {
  if (!calcOut) return;
  const lines = [];
  lines.push(`<div>Gegeben: <code>a=${fmtNum(a)}</code>, <code>b=${fmtNum(b)}</code>, <code>c=${fmtNum(c)}</code></div>`);

  if (result.type === 'linear' || result.type === 'none' || result.type === 'infinite') {
    lines.push(`<div>Keine Parabel: lineare Gleichung <code>${fmtNum(b)}x + ${fmtNum(c)} = 0</code></div>`);
    calcOut.innerHTML = lines.join('');
    return;
  }

  const D = result.D;
  lines.push(`<div><code>D = b² − 4ac = ${fmtNum(D)}</code></div>`);
  if (D >= 0) {
    lines.push(`<div><code>√D = ${fmtNum(Math.sqrt(D))}</code></div>`);
    lines.push(`<div><code>x = (-b ± √D) / (2a)</code></div>`);
    if (result.type === 'double') {
      lines.push(`<div><code>x = ${fmtNum(result.x)}</code></div>`);
    } else if (result.type === 'two') {
      lines.push(`<div><code>x₁ = ${fmtNum(result.x1)}</code>, <code>x₂ = ${fmtNum(result.x2)}</code></div>`);
    }
  } else {
    lines.push(`<div><code>x = (-b ± √D) / (2a)</code> (keine reellen)</div>`);
  }
  calcOut.innerHTML = lines.join('');
}

function renderSolution(result) {
  if (!solOut) return;
  let html = '';
  if (result.type === 'two') {
    html = `Zwei reelle Lösungen: x₁ = ${fmtNum(result.x1)}, x₂ = ${fmtNum(result.x2)}.`;
  } else if (result.type === 'double') {
    html = `Eine reelle Lösung (Doppelnullstelle): x = ${fmtNum(result.x)}.`;
  } else if (result.type === 'complex') {
    html = 'Keine reellen Lösungen.';
  } else if (result.type === 'linear') {
    html = `Lineare Lösung: x = ${fmtNum(result.x)}.`;
  } else if (result.type === 'none') {
    html = 'Keine Lösung.';
  } else if (result.type === 'infinite') {
    html = 'Unendlich viele Lösungen.';
  }
  solOut.textContent = html;
}

function renderDidaktikLinear(a, b, c) {
  if (didA) didA.textContent = fmtNum(a);
  if (didB) didB.textContent = fmtNum(b);
  if (didC) didC.textContent = fmtNum(c);
  if (didD) didD.textContent = '—';
  if (didNature) {
    didNature.textContent = '';
    didNature.className = 'pill';
  }
  if (didOpen) didOpen.textContent = '—';
  if (didStretch) didStretch.textContent = '—';
  if (didVertex) didVertex.textContent = '—';
  if (didNote) {
    didNote.style.display = 'block';
    didNote.textContent = 'Keine Parabel (linear).';
  }
}

function renderDidaktikQuadratic(a, b, c, D) {
  if (didA) didA.textContent = `${fmtNum(a)} – quadratisch`;
  if (didB) didB.textContent = `${fmtNum(b)} – linear`;
  if (didC) didC.textContent = `${fmtNum(c)} – konstant`;
  if (didD) didD.textContent = fmtNum(D);

  if (didNature) {
    didNature.className = 'pill';
    if (D > 0) {
      didNature.textContent = 'D > 0 → zwei Nullstellen';
      didNature.classList.add('status-ok');
    } else if (D === 0) {
      didNature.textContent = 'D = 0 → eine Doppelnullstelle';
      didNature.classList.add('status-warn');
    } else {
      didNature.textContent = 'D < 0 → keine reellen';
      didNature.classList.add('status-danger');
    }
  }

  if (didOpen) didOpen.textContent = a > 0 ? 'nach oben (a > 0)' : 'nach unten (a < 0)';

  if (didStretch) {
    const absA = Math.abs(a);
    if (absA > 1) didStretch.textContent = '|a| > 1 → gestreckt (schmaler/steiler)';
    else if (absA > 0 && absA < 1) didStretch.textContent = '0 < |a| < 1 → gestaucht (breiter/flacher)';
    else didStretch.textContent = '|a| = 1 → normale Breite';
  }

  const d = -b / (2 * a);
  const e = a * d * d + b * d + c;
  if (didVertex) didVertex.textContent = `S(${fmtNum(d)}|${fmtNum(e)})`;
  if (didNote) {
    didNote.style.display = 'none';
    didNote.textContent = '';
  }
}

function resetDidaktik() {
  if (didA) didA.textContent = '—';
  if (didB) didB.textContent = '—';
  if (didC) didC.textContent = '—';
  if (didD) didD.textContent = '—';
  if (didNature) {
    didNature.textContent = '';
    didNature.className = 'pill';
  }
  if (didOpen) didOpen.textContent = '—';
  if (didStretch) didStretch.textContent = '—';
  if (didVertex) didVertex.textContent = '—';
  if (didNote) {
    didNote.style.display = 'none';
    didNote.textContent = '';
  }
}

function fmtNum(value) {
  if (!isFinite(value)) return '—';
  const rounded = Math.round(value * 10000) / 10000;
  const str = rounded.toString();
  return str.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}

function handlePraxis() {
  const v0 = parseNumberDE(v0Input?.value || '0');
  const h0 = parseNumberDE(h0Input?.value || '0');
  const a = -4.9;
  const b = v0;
  const c = h0;
  const res = solveEquation(a, b, c);
  renderPraxis(res, a, b, c);
}

function renderPraxis(res, a, b, c) {
  if (!praxisResult || !praxisSteps) return;
  const D = res.D ?? (b * b - 4 * a * c);
  let html = `<div><strong>Diskriminante:</strong> Δ = b² − 4ac = ${fmtNum(D)}</div>`;
  if (res.type === 'complex') {
    html += `<div class="status-danger">Keine reellen Lösungen.</div>`;
  } else if (res.type === 'double') {
    html += `<div class="status-warn">Doppelte Lösung: t = ${fmtNum(res.x)}</div>`;
  } else if (res.type === 'two') {
    html += `<div class="status-ok">Reelle Lösungen: t₁ = ${fmtNum(res.x1)}, t₂ = ${fmtNum(res.x2)}</div>`;
  }
  praxisResult.innerHTML = html;

  const steps = [];
  steps.push(`Δ = b² − 4ac = (${fmtNum(b)})² − 4 · ${fmtNum(a)} · ${fmtNum(c)} = ${fmtNum(D)}`);
  if (D >= 0) {
    const sqrtD = Math.sqrt(D);
    steps.push(`√Δ = ${fmtNum(sqrtD)}`);
    steps.push(`t = (−b ± √Δ) / (2a)`);
    if (res.type === 'two') {
      steps.push(`t₁ = (${fmtNum(-b)} − ${fmtNum(sqrtD)}) / ${fmtNum(2 * a)} = ${fmtNum(res.x1)}`);
      steps.push(`t₂ = (${fmtNum(-b)} + ${fmtNum(sqrtD)}) / ${fmtNum(2 * a)} = ${fmtNum(res.x2)}`);
    } else if (res.type === 'double') {
      steps.push(`t = ${fmtNum(res.x)}`);
    }
  }
  praxisSteps.innerHTML = steps.map(s => `<div>• ${s}</div>`).join('');

  if (res.type === 'complex') {
    praxisResult.innerHTML += '<div class="note-box">Die Höhe fällt nicht auf den Boden (keine reellen Schnittpunkte).</div>';
    return;
  }
  const roots = res.type === 'two' ? [res.x1, res.x2] : res.type === 'double' ? [res.x] : [];
  const positive = roots.filter(x => typeof x === 'number' && x >= -1e-6).map(x => Math.max(0, x));
  if (!positive.length) {
    praxisResult.innerHTML += '<div class="note-box">Keine positive Flugzeit gefunden (Objekt startet bereits unter Boden oder Parameter unplausibel).</div>';
  } else {
    praxisResult.innerHTML += `<div class="note-box">Sinnvolle Zeiten (t ≥ 0): ${positive.map(fmtNum).join(' s, ')} s</div>`;
  }
}

console.assert(solveEquation(1, -3, 2).type === 'two', 'Test 1 type');
console.assert(
  Math.abs(solveEquation(1, -3, 2).x1 - 1) < 1e-9 ||
    Math.abs(solveEquation(1, -3, 2).x2 - 1) < 1e-9,
  'Test 1 roots'
);
console.assert(solveEquation(2, -170, 1500).D === 16900, 'Test 2 D');
console.assert(solveEquation(1, 2, 1).type === 'double', 'Test 3 type');
console.assert(Math.abs(solveEquation(1, 2, 1).x + 1) < 1e-9, 'Test 3 root');
console.assert(solveEquation(0, 5, 10).type === 'linear', 'Test 4 linear');
console.assert(Math.abs(solveEquation(0, 5, 10).x + 2) < 1e-9, 'Test 4 root');
