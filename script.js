const DF = { E: "Easy", M: "Medium", H: "Hard" },
  PR = { M: "Must", S: "Should", X: "Stretch" },
  ST = ["Not Started", "In Progress", "Solved", "Revisit"];
const slug = (t) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9 \-]/g, "")
    .replace(/ /g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
let S = {};
try {
  S = JSON.parse(localStorage.getItem("dsa_tracker_v1") || "{}");
} catch (e) {
  S = {};
}
const save = () => {
  try {
    localStorage.setItem("dsa_tracker_v1", JSON.stringify(S));
  } catch (e) {}
};
const $ = (id) => document.getElementById(id),
  st = (n) => S[n] || "Not Started",
  open_ = {};
function stats() {
  let tot = 0,
    sol = 0,
    must = 0,
    ms = 0,
    ip = 0,
    rv = 0;
  T.forEach((t) =>
    t.q.forEach(([n, , , p]) => {
      tot++;
      const s = st(n);
      if (s == "Solved") sol++;
      if (s == "In Progress") ip++;
      if (s == "Revisit") rv++;
      if (p == "M") {
        must++;
        if (s == "Solved") ms++;
      }
    }),
  );
  $("pb").style.width = (tot ? (sol / tot) * 100 : 0) + "%";
  $("st").innerHTML =
    `<span><b>${sol}</b> / ${tot} solved (${Math.round((sol / tot) * 100)}%)</span><span>Must-do: <b>${ms}</b> / ${must}</span><span>In progress: <b>${ip}</b></span><span>Revisit: <b>${rv}</b></span>`;
}
function renderT() {
  const q = $("q").value.trim().toLowerCase(),
    fd = $("fd").value,
    fp = $("fp").value,
    fs = $("fs").value,
    filt = !!(q || fd || fp || fs);
  let h = "";
  T.forEach((t, ti) => {
    const all = t.q,
      sol = all.filter((x) => st(x[0]) == "Solved").length;
    const rows = all.filter(
      ([n, ti2, d, p, i]) =>
        (!q || (n + " " + ti2 + " " + i).toLowerCase().includes(q)) &&
        (!fd || DF[d] == fd) &&
        (!fp || PR[p] == fp) &&
        (!fs || st(n) == fs),
    );
    if (!rows.length) return;
    const op = filt || open_[ti] ? " open" : "";
    h +=
      `<details class="card" data-i="${ti}"${op}><summary><span class="tn">${t.t}<small>${t.w}</small></span><span class="cnt">${sol}/${all.length}</span><div class="bar"><i style="width:${(sol / all.length) * 100}%"></i></div></summary><div class="tc">${t.c}</div><div class="sc">` +
      rows
        .map(([n, ti2, d, p, i]) => {
          const s = st(n);
          return `<div class="r s-${s}"><select data-n="${n}">${ST.map((o) => `<option${o == s ? " selected" : ""}>${o}</option>`).join("")}</select><span class="n">#${n}</span><a href="https://leetcode.com/problems/${slug(ti2)}/" target="_blank" rel="noopener noreferrer">${ti2}</a><span class="d-${DF[d]}">${DF[d]}</span><span class="p-${PR[p]}">${PR[p]}</span><span class="id">${i}</span></div>`;
        })
        .join("") +
      `</div></details>`;
  });
  $("app").innerHTML =
    h || '<div class="card empty">No problems match these filters.</div>';
  stats();
}
$("app").addEventListener("change", (e) => {
  const n = e.target.dataset.n;
  if (!n) return;
  S[n] = e.target.value;
  save();
  const sc = document.scrollingElement.scrollTop;
  render();
  document.scrollingElement.scrollTop = sc;
});
$("app").addEventListener(
  "toggle",
  (e) => {
    const d = e.target;
    if (d.dataset && d.dataset.i !== undefined) open_[d.dataset.i] = d.open;
  },
  true,
);
["q", "fd", "fp", "fs"].forEach((i) => $(i).addEventListener("input", render));
$("rs").onclick = () => {
  if (confirm("Clear all saved progress?")) {
    S = {};
    save();
    render();
  }
};

let V = "t";
const esc = (x) =>
  x.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const CN = Object.keys(C).sort((a, b) => C[b].length - C[a].length);
$("co").innerHTML = CN.map(
  (n) => `<option value="${esc(n)}">${esc(n)} (${C[n].length})</option>`,
).join("");
function renderC() {
  const c = $("co").value,
    tw = +$("tw").value,
    q = $("q").value.trim().toLowerCase(),
    fd = $("fd").value,
    fs = $("fs").value,
    filt = !!(q || fd || fs);
  const all = (C[c] || []).filter((x) => x[2] <= tw),
    g = {};
  let sol = 0;
  all.forEach(([i, f, t]) => {
    const p = P[i],
      k = p[4] || "s:" + p[0],
      s = st(k);
    if (s == "Solved") sol++;
    if (
      (q && !(p[1] + " " + p[3]).toLowerCase().includes(q)) ||
      (fd && DF[p[2]] != fd) ||
      (fs && s != fs)
    )
      return;
    (g[p[5]] = g[p[5]] || []).push([p, k, s, f]);
  });
  let h = `<div class="cs"><b>${esc(c)}</b>: ${all.length} problems, <b>${sol}</b> solved. Grouped by topic, most frequently asked first.</div><div style="height:10px"></div>`;
  GN.forEach((n, gi) => {
    const r = g[n];
    if (!r) return;
    const sv = r.filter((x) => x[2] == "Solved").length;
    h +=
      `<details class="card" data-i="c${gi}"${filt || open_["c" + gi] ? " open" : ""}><summary><span class="tn">${n}</span><span class="cnt">${sv}/${r.length}</span><div class="bar"><i style="width:${(sv / r.length) * 100}%"></i></div></summary><div class="sc">` +
      r
        .map(
          ([p, k, s, f]) =>
            `<div class="r s-${s}"><select data-n="${k}">${ST.map((o) => `<option${o == s ? " selected" : ""}>${o}</option>`).join("")}</select><span class="n">${p[4] ? "#" + p[4] : "-"}</span><a href="${esc(p[6])}" target="_blank" rel="noopener noreferrer">${esc(p[1])}</a><span class="d-${DF[p[2]]}">${DF[p[2]]}</span><span class="n">${f}%</span><span class="id">${esc(p[3])}</span></div>`,
        )
        .join("") +
      `</div></details>`;
  });
  $("app").innerHTML = h.includes("<details")
    ? h
    : h + '<div class="card empty">No problems match these filters.</div>';
  stats();
}
function render() {
  V == "c" ? renderC() : V == "p" ? renderP() : renderT();
}
function setV(v) {
  V = v;
  ["t", "c", "p"].forEach((k) => $("t" + k).classList.toggle("on", v == k));
  ["co", "tw"].forEach((i) => ($(i).hidden = v != "c"));
  $("fp").hidden = v != "t";
  document.querySelector(".f").style.display = v == "p" ? "none" : "";
  saveUI();
  render();
}
$("tp").onclick = () => setV("p");
$("tt").onclick = () => setV("t");
$("tc").onclick = () => setV("c");
["co", "tw"].forEach((i) => $(i).addEventListener("input", render));

const eff = () =>
  document.documentElement.dataset.theme ||
  (window.matchMedia && matchMedia("(prefers-color-scheme:dark)").matches
    ? "dark"
    : "light");
const paintTh = () =>
  ($("th").textContent = eff() == "dark" ? "☀️ Light" : "🌙 Dark");
$("th").onclick = () => {
  const n = eff() == "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = n;
  try {
    localStorage.setItem("dsa_theme", n);
  } catch (e) {}
  paintTh();
};
paintTh();
function saveUI() {
  try {
    localStorage.setItem(
      "dsa_ui_v1",
      JSON.stringify({ v: V, co: $("co").value, tw: $("tw").value }),
    );
  } catch (e) {}
}
["co", "tw"].forEach((i) => $(i).addEventListener("input", saveUI));
function renderP() {
  const ix = { E: 0, M: 1, H: 2 },
    R = T.map((t) => {
      const r = {
        n: t.t,
        w: t.w,
        tot: t.q.length,
        sol: 0,
        ip: 0,
        rv: 0,
        m: 0,
        ms: 0,
        d: [
          [0, 0],
          [0, 0],
          [0, 0],
        ],
      };
      t.q.forEach(([n, , d, p]) => {
        const s = st(n),
          i = ix[d];
        r.d[i][1]++;
        if (s == "Solved") {
          r.sol++;
          r.d[i][0]++;
        }
        if (s == "In Progress") r.ip++;
        if (s == "Revisit") r.rv++;
        if (p == "M") {
          r.m++;
          if (s == "Solved") r.ms++;
        }
      });
      return r;
    });
  const sum = (k) => R.reduce((a, r) => a + r[k], 0),
    dsum = (i, j) => R.reduce((a, r) => a + r.d[i][j], 0),
    pc = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const row = (r) =>
    `<td>${r.n}${r.w ? `<small style="color:var(--mu)"> ${r.w}</small>` : ""}</td><td><div class="bar pb"><i class="${cl(pc(r.sol, r.tot))}" style="width:${pc(r.sol, r.tot)}%"></i></div><b class="${cl(pc(r.sol, r.tot))}">${r.sol}/${r.tot}</b> (${pc(r.sol, r.tot)}%)</td><td class="d-Easy">${r.d[0][0]}/${r.d[0][1]}</td><td class="d-Medium">${r.d[1][0]}/${r.d[1][1]}</td><td class="d-Hard">${r.d[2][0]}/${r.d[2][1]}</td><td>${r.ms}/${r.m}</td><td>${r.ip}</td><td>${r.rv}</td>`;
  const tot = {
    n: "Total",
    tot: sum("tot"),
    sol: sum("sol"),
    ip: sum("ip"),
    rv: sum("rv"),
    m: sum("m"),
    ms: sum("ms"),
    d: [0, 1, 2].map((i) => [dsum(i, 0), dsum(i, 1)]),
  };
  const nx = R.filter((r) => r.ms < r.m).sort(
    (a, b) => pc(a.ms, a.m) - pc(b.ms, b.m),
  )[0];
  const op = pc(tot.sol, tot.tot),
    cl = (p) => (p >= 70 ? "ok" : p >= 30 ? "mid" : "low");
  const hdr = `<div class="sm"><div class="big"><b>${op}%</b><span>overall progress (${tot.sol}/${tot.tot} solved)</span><div class="bar"><i style="width:${op}%"></i></div></div><div><b>${tot.ms}/${tot.m}</b><span>must-do solved</span></div><div><b>${tot.ip}</b><span>in progress</span></div><div><b>${tot.rv}</b><span>to revisit</span></div></div><div class="nf">${nx ? `Next focus: <b>${nx.n}</b> (${nx.ms}/${nx.m} must-do solved)` : "All must-do problems solved!"}</div>`;
  $("app").innerHTML =
    `<div class="card">${hdr}<div class="act"><b style="color:var(--tx)">Backup &amp; export</b><span style="flex:1"></span><button id="ex">Export progress</button><button id="im">Import progress</button><button id="rc">Download report (CSV)</button><input type="file" id="fi" accept=".json" hidden></div><div class="sc"><table class="rp"><thead><tr><th>Topic</th><th>Solved</th><th>Easy</th><th>Medium</th><th>Hard</th><th>Must-do</th><th>In progress</th><th>Revisit</th></tr></thead><tbody>${R.map((r) => `<tr class="${r.sol ? "t-" + cl(pc(r.sol, r.tot)) : ""}">${row(r)}</tr>`).join("")}</tbody><tfoot><tr>${row(tot)}</tr></tfoot></table></div>
</div>`;
  const dl = (name, txt, type) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], { type }));
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
  };
  $("ex").onclick = () =>
    dl("dsa_progress.json", JSON.stringify(S, null, 1), "application/json");
  $("rc").onclick = () =>
    dl(
      "dsa_report.csv",
      [
        "Topic,Solved,Total,Easy solved,Easy total,Medium solved,Medium total,Hard solved,Hard total,Must solved,Must total,In progress,Revisit",
      ]
        .concat(
          R.concat([tot]).map((r) =>
            [
              `"${r.n}"`,
              r.sol,
              r.tot,
              r.d[0][0],
              r.d[0][1],
              r.d[1][0],
              r.d[1][1],
              r.d[2][0],
              r.d[2][1],
              r.ms,
              r.m,
              r.ip,
              r.rv,
            ].join(","),
          ),
        )
        .join("\n"),
      "text/csv",
    );
  $("im").onclick = () => $("fi").click();
  $("fi").onchange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const o = JSON.parse(rd.result);
        if (!o || typeof o != "object" || Array.isArray(o)) throw 0;
        Object.assign(S, o);
        save();
        renderP();
      } catch (x) {
        alert("Invalid progress file");
      }
    };
    rd.readAsText(f);
  };
  stats();
}
try {
  const u = JSON.parse(localStorage.getItem("dsa_ui_v1") || "{}");
  if (u.co && C[u.co]) $("co").value = u.co;
  if (u.tw) $("tw").value = u.tw;
  if (u.v && u.v != "t") setV(u.v);
} catch (e) {}
render();
