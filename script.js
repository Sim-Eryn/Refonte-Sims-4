/* ══════════════════════════════════════
   STORAGE
══════════════════════════════════════ */
function load(key){try{return JSON.parse(localStorage.getItem(key))||[];}catch{return[];}}
function save(key,val){localStorage.setItem(key,JSON.stringify(val));}

let foyers = load('s4_foyers');
let residences = load('s4_residences');
let vacances = load('s4_vacances');
let loisirs = load('s4_loisirs');

/* ══════════════════════════════════════
   NAVIGATION
══════════════════════════════════════ */
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  const btns = document.querySelectorAll('.nav-btn');
  const map = {home:0,worlds:1,foyers:2,residences:3,vacances:4,loisirs:5};
  if(map[id]!==undefined) btns[map[id]].classList.add('active');
  window.scrollTo(0,0);
  if(id==='worlds'){ setTimeout(animateBars, 100); }
  if(id==='home'){ renderWorldsHome(); }
}

/* ══════════════════════════════════════
   LOGIQUE DE SCORE
══════════════════════════════════════ */
function worldScore(n){
  const totalActifs = n.terrains - n.terrainsVacances;
  const t1 = totalActifs > 0 ? (1 - n.terrainsVides/totalActifs) : 1;
  const t2 = n.residentialTotal > 0 ? (1 - n.residentialVides/n.residentialTotal) : 1;
  const occ = n.mesSims + n.simsRandom;
  const t3 = occ > 0 ? (n.mesSims/occ) : 1;
  if(n.residentialTotal===0 && n.terrainsVides>0) return Math.round(t1*35);
  return Math.round((t1*.35 + t2*.45 + t3*.20)*100);
}

function getTier(s){return s===0?0:s<30?1:s<60?2:s<85?3:4;}
const tierLabels=['Vide','Début','En cours','Avancé','✓ Terminé'];
const pct = (v,t) => t ? Math.round(v/t*100) : 0;

/* ══════════════════════════════════════
   RENDU
══════════════════════════════════════ */
function renderWorldsHome(){
  const g = document.getElementById('worldsHomeGrid');
  if(!g) return;
  g.innerHTML='';
  neighborhoods.forEach(n=>{
    const s = worldScore(n);
    const btn = document.createElement('div');
    btn.className='world-home-btn';
    btn.onclick=()=>showPage('worlds');
    btn.innerHTML=`<div class="world-home-name">${n.name}</div><div class="world-home-prog"><div class="world-home-prog-fill" style="width:${s}%"></div></div><div class="world-home-pct">${s}%</div>`;
    g.appendChild(btn);
  });
}

function renderGlobalStats(){
  const tT = neighborhoods.reduce((s,n)=>s+n.terrains,0);
  const tV = neighborhoods.reduce((s,n)=>s+n.terrainsVacances,0);
  const tTV = neighborhoods.reduce((s,n)=>s+n.terrainsVides,0);
  const tR = neighborhoods.reduce((s,n)=>s+n.residentialTotal,0);
  const tRV = neighborhoods.reduce((s,n)=>s+n.residentialVides,0);
  const tMs = neighborhoods.reduce((s,n)=>s+n.mesSims,0);
  const tRand = neighborhoods.reduce((s,n)=>s+n.simsRandom,0);

  document.getElementById('globalStats').innerHTML=`
    <div class="gs"><span class="gs-val">${tT}</span><span class="gs-lbl">Terrains</span></div>
    <div class="gs"><span class="gs-val" style="color:var(--rose)">${tTV}</span><span class="gs-lbl">À construire</span></div>
    <div class="gs"><span class="gs-val" style="color:var(--teal)">${tRV}</span><span class="gs-lbl">Logts vides</span></div>
    <div class="gs"><span class="gs-val" style="color:var(--accent3)">${tMs}</span><span class="gs-lbl">Mes Sims</span></div>
  `;
}

// ... Les autres fonctions de sauvegarde (Foyers, Résidences, etc.)
// ... que tu as fournies précédemment s'insèrent ici.

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
function init(){
  renderGlobalStats();
  renderWorldsHome();
  // etc.
}

window.onload = init;