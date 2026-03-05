#!/usr/bin/env bash
set -euo pipefail

cmd="${1:-}"
shift || true

die(){ echo "ERROR: $*" >&2; exit 1; }

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

REG="assets/data/portal_registry.json"

ensure_registry() {
  [[ -f "$REG" ]] || die "Registry not found: $REG"
}

group() {
  ensure_registry
  python3 - <<'PY'
import json
from pathlib import Path

p = Path("assets/data/portal_registry.json")
data = json.loads(p.read_text(encoding="utf-8"))

lst = data.get("topics") or data.get("items") or []
for it in lst:
  url = (it.get("url") or "").strip()
  if not url: 
    continue
  if url.startswith("pages/faecher/"):
    it["group"] = "Fächer"
  elif "/tools/" in url:
    it["group"] = "Tools"
  elif url.startswith("pages/language_lab/apps/"):
    it["group"] = "Apps"
  elif url.startswith("pages/bibliothek/"):
    it["group"] = "Bibliothek"
  else:
    it["group"] = it.get("group") or "Sonstiges"

data["topics"] = lst
p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("OK: group() updated", len(lst), "topics")
PY
}

add_topic() {
  ensure_registry
  local title="${1:-}"; local url="${2:-}"; local grp="${3:-Sonstiges}"
  [[ -n "$title" && -n "$url" ]] || die 'Usage: ./codex.sh add-topic "Title" "url" "Group"'
  python3 - <<PY
import json
from pathlib import Path
p = Path("$REG")
data = json.loads(p.read_text(encoding="utf-8"))
lst = data.get("topics") or data.get("items") or []
lst.append({"title": "$title", "url": "$url", "group": "$grp"})
data["topics"] = lst
p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\\n", encoding="utf-8")
print("OK: added topic:", "$title")
PY
}

fix_links() {
  ensure_registry
  python3 - <<'PY'
import json
from pathlib import Path

p = Path("assets/data/portal_registry.json")
data = json.loads(p.read_text(encoding="utf-8"))
lst = data.get("topics") or []

for it in lst:
  if (it.get("title","").strip() == "Bibliothek & Ressourcen"):
    it["url"] = "pages/bibliothek/index.html"
    it["group"] = "Bibliothek"

data["topics"] = lst
p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("OK: fix-links() done")
PY
}


typefix() {
  ensure_registry
  python3 - <<'PY2'
import json
from pathlib import Path

p = Path("assets/data/portal_registry.json")
data = json.loads(p.read_text(encoding="utf-8"))
lst = data.get("topics") or data.get("items") or []

def guess_type(url: str, group: str):
    u = (url or "").lower()
    g = (group or "").lower()
    if "/tools/" in u or g == "tools":
        return "tool"
    if "/apps/" in u or u.startswith("apps/") or g == "apps":
        return "app"
    return "page"

for it in lst:
    url = (it.get("url") or "").strip()
    if not url:
        continue
    it["type"] = it.get("type") or guess_type(url, it.get("group",""))

data["topics"] = lst
p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("OK: typefix() updated", len(lst), "topics")
PY2
}



new_app() {
  slug="${1:-}"
  if [ -z "$slug" ]; then
    echo "Usage: ./codex.sh new-app <slug>"
    exit 2
  fi

  # for now: only one template
  if [ "$slug" != "brueche-schokolade" ]; then
    echo "ERROR: only supported template right now: brueche-schokolade"
    exit 2
  fi

  dir="pages/faecher/mathematik-realschule/apps/$slug"
  mkdir -p "$dir"

  cat > "$dir/index.html" <<'HTML'
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Brüche · Schokolade</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main class="wrap">
    <header>
      <h1>Brüche · Schokolade</h1>
      <p class="sub">
        Geometrisch → rechnerisch. Beispiel: <strong>1/2 + 1/3</strong> (weiter unten auch frei wählbar)
      </p>
    </header>

    <section class="card">
      <div class="row">
        <div class="ctrl">
          <label>Bruch A</label>
          <div class="frac">
            <input id="aNum" type="number" min="1" value="1" />
            <span>/</span>
            <input id="aDen" type="number" min="2" value="2" />
          </div>
        </div>

        <div class="ctrl plus">+</div>

        <div class="ctrl">
          <label>Bruch B</label>
          <div class="frac">
            <input id="bNum" type="number" min="1" value="1" />
            <span>/</span>
            <input id="bDen" type="number" min="2" value="3" />
          </div>
        </div>

        <button id="btn" class="btn" type="button">Berechnen</button>
      </div>

      <div class="hint">
        Begriffe: <strong>kgV</strong> · <strong>Erweitern</strong> · <strong>gemeinsamer Nenner</strong><br/>
        RU: <strong>НОК</strong> · <strong>общий знаменатель</strong>
      </div>
    </section>

    <section class="gridWrap">
      <div class="card">
        <h2>Schokoladentafel (gemeinsamer Nenner)</h2>
        <div id="grid" class="grid" aria-label="Schokoladentafel"></div>
        <div class="legend">
          <span class="leg a">A</span> Bruch A
          <span class="leg b">B</span> Bruch B
          <span class="leg ab">A∪B</span> Summe (vereinigt)
        </div>
      </div>

      <div class="card">
        <h2>Rechnung</h2>
        <pre id="steps" class="steps"></pre>
      </div>
    </section>

    <footer class="foot">
      Tipp: Als Nächstes können wir Primfaktoren (2·2·3 …) für kgV / НОК anzeigen.
    </footer>
  </main>

  <script src="app.js"></script>
</body>
</html>
HTML

  cat > "$dir/style.css" <<'CSS'
:root { --r: 14px; }
*{ box-sizing:border-box; }
body{ margin:0; font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif; background:#f6f6f7; color:#111; }
.wrap{ max-width:1100px; margin:0 auto; padding:18px; }
h1{ margin:0 0 6px; font-size:28px; }
.sub{ margin:0 0 14px; opacity:.8; }
.card{ background:#fff; border-radius:var(--r); padding:14px; box-shadow:0 6px 20px rgba(0,0,0,.06); }
.row{ display:flex; gap:12px; flex-wrap:wrap; align-items:end; }
.ctrl label{ display:block; font-size:12px; opacity:.7; margin-bottom:6px; }
.frac{ display:flex; align-items:center; gap:6px; }
.frac input{ width:70px; padding:10px 10px; border:1px solid rgba(0,0,0,.18); border-radius:10px; font-size:16px; }
.plus{ font-size:22px; padding:0 4px; opacity:.6; }
.btn{ padding:10px 14px; border:0; border-radius:12px; cursor:pointer; background:#111; color:#fff; }
.hint{ margin-top:10px; font-size:12.5px; opacity:.85; line-height:1.35; }

.gridWrap{ display:grid; grid-template-columns: 1.2fr .8fr; gap:14px; margin-top:14px; }
@media (max-width: 900px){ .gridWrap{ grid-template-columns:1fr; } }

.grid{ display:grid; gap:6px; margin-top:10px; }
.cell{
  height:44px;
  border-radius:10px;
  border:1px solid rgba(0,0,0,.14);
  background:linear-gradient(180deg, rgba(0,0,0,.03), rgba(0,0,0,.01));
  display:flex; align-items:center; justify-content:center;
  font-size:12px; opacity:.75;
}
.cell.a{ outline:3px solid rgba(0,0,0,.10); background:rgba(0,0,0,.08); }
.cell.b{ outline:3px solid rgba(0,0,0,.10); background:rgba(0,0,0,.14); }
.cell.ab{ background:rgba(0,0,0,.20); opacity:.9; }

.legend{ display:flex; gap:10px; align-items:center; margin-top:10px; font-size:12px; opacity:.85; flex-wrap:wrap; }
.leg{ display:inline-flex; align-items:center; justify-content:center; width:22px; height:18px; border-radius:6px; color:#fff; font-weight:700; font-size:11px; }
.leg.a{ background:rgba(0,0,0,.55); }
.leg.b{ background:rgba(0,0,0,.70); }
.leg.ab{ background:rgba(0,0,0,.85); }

.steps{ margin:0; padding:10px; background:rgba(0,0,0,.04); border-radius:12px; overflow:auto; }
.foot{ margin-top:14px; font-size:12px; opacity:.7; }
CSS

  cat > "$dir/app.js" <<'JS'
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
JS

  # add to registry (title/url/group)
  ./codex.sh add-topic "Brüche · Schokolade (Visuell)" "pages/faecher/mathematik-realschule/apps/brueche-schokolade/index.html" "Fächer" >/dev/null

  # ensure type/group recalculated
  ./codex.sh type >/dev/null
  ./codex.sh group >/dev/null

  echo "OK: new-app created: $dir"
}



deploy() {
  # commits all current changes and pushes
  git add -A
  if git diff --cached --quiet; then
    echo "OK: nothing to commit"
    exit 0
  fi
  git commit -m "codex: update"
  git push
  echo "OK: deploy done"
}

case "$cmd" in
  group) group ;;
  type) typefix ;;
  new-app) new_app "$@" ;;
  add-topic) add_topic "$@" ;;
  fix-links) fix_links ;;
  deploy) deploy ;;
  ""|help|-h|--help)
    cat <<'HELP'
Usage:
  ./codex.sh group
  ./codex.sh add-topic "Title" "url" "Group"
  ./codex.sh fix-links
  ./codex.sh deploy
HELP
    ;;
  *) die "Unknown command: $cmd" ;;
esac
