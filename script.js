// --- CHARGEMENT DES DONNÉES ---
const load = (k) => JSON.parse(localStorage.getItem(k)) || [];
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

let foyers = load('s4_foyers');
let residences = load('s4_residences');
let vacances = load('s4_vacances');
let loisirs = load('s4_loisirs');

const worldNames = neighborhoods.map(n => n.name);

// --- NAVIGATION ---
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + id);
    if(target) target.classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    // Sélectionne le bouton par son texte ou ordre si nécessaire
    
    window.scrollTo(0, 0);
    if(id === 'home') renderHome();
    if(id === 'worlds') renderWorlds();
}

// --- CALCULS ---
function worldScore(n) {
    const totalActifs = n.terrains - n.terrainsVacances;
    const t1 = totalActifs > 0 ? (1 - n.terrainsVides / totalActifs) : 1;
    const t2 = n.residentialTotal > 0 ? (1 - n.residentialVides / n.residentialTotal) : 1;
    const occ = n.mesSims + n.simsRandom;
    const t3 = occ > 0 ? (n.mesSims / occ) : 1;
    return Math.round((t1 * 0.35 + t2 * 0.45 + t3 * 0.20) * 100);
}

// --- RENDU ACCUEIL ---
function renderHome() {
    // Rendu de la grille des mondes en bas de l'accueil
    const grid = document.getElementById('worldsHomeGrid'); // Vérifie que cet ID existe dans ton HTML
    if(!grid) return;

    grid.innerHTML = '';
    neighborhoods.forEach(n => {
        const score = worldScore(n);
        const card = document.createElement('div');
        card.className = 'world-home-card'; // Le nom de classe de ton CSS original
        card.innerHTML = `
            <div class="wh-name">${n.name}</div>
            <div class="wh-bar"><div style="width:${score}%"></div></div>
            <div class="wh-pct">${score}%</div>
        `;
        card.onclick = () => showPage('worlds');
        grid.appendChild(card);
    });
}

// --- INITIALISATION ---
window.onload = () => {
    // Remplit les menus déroulants des formulaires
    const selects = ['f-monde', 'r-monde', 'v-monde', 'l-monde'];
    selects.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            worldNames.forEach(w => {
                const opt = document.createElement('option');
                opt.value = w; opt.textContent = w;
                el.appendChild(opt);
            });
        }
    });
    renderHome();
};