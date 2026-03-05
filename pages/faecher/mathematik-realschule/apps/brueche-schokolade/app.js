(function(){
  const $ = (id)=>document.getElementById(id);
  const aNum = $("aNum"), aDen = $("aDen"), bNum = $("bNum"), bDen = $("bDen");
  const grid = $("grid"), steps = $("steps"), btn = $("btn");

  const gcd = (x,y)=>{ x=Math.abs(x); y=Math.abs(y); while(y){ [x,y]=[y,x%y]; } return x||1; };
  const lcm = (x,y)=> Math.abs(x*y)/gcd(x,y);

  function clampFrac(n,d){
    n = Math.max(0, Math.floor(n||0));
    d = Math.max(1, Math.floor(d||1));
    if (n>d) n=d;
    return [n,d];
  }

  function renderGrid(den, aCount, bCount){
    const cols = Math.min(den, 12);
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.innerHTML = "";

    // Simple visual: first A pieces, then B pieces (so sum is visible as total count).
    for(let i=0;i<den;i++){
      const cell = document.createElement("div");
      cell.className = "cell";
      if(i < aCount) cell.classList.add("a");
      else if(i < aCount + bCount) cell.classList.add("b");
      cell.textContent = `${i+1}`;
      grid.appendChild(cell);
    }
  }

  function solve(){
    let [an, ad] = clampFrac(+aNum.value, +aDen.value);
    let [bn, bd] = clampFrac(+bNum.value, +bDen.value);

    aNum.value = an; aDen.value = ad;
    bNum.value = bn; bDen.value = bd;

    const D = lcm(ad, bd);
    const ea = D/ad;
    const eb = D/bd;

    const An = an*ea;
    const Bn = bn*eb;
    const Sn = An + Bn;

    renderGrid(D, An, Bn);

    const g = gcd(Sn, D);
    const rn = Sn/g, rd = D/g;

    steps.textContent =
`Geometrisch (Schokolade):
  kgV( ${ad} , ${bd} ) = ${D}  ⇒  ${D} gleich große Stücke

Rechnerisch:
  ${an}/${ad} · ${ea}/${ea} = ${An}/${D}
  ${bn}/${bd} · ${eb}/${eb} = ${Bn}/${D}

  Summe: ${An}/${D} + ${Bn}/${D} = ${Sn}/${D}
  Kürzen: gcd(${Sn}, ${D}) = ${g}  ⇒  ${rn}/${rd}
`;
  }

  btn.addEventListener("click", solve);
  solve();
})();
