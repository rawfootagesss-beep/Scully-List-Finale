// SCRIPT MAESTRO GENERADO POR ADMIN
const NIVELES_GLOBALES = [{"name":"Renevant","id":"lb2f1NkSJrU","first":"BillowV","victors":["score"]}];
const RANKING_GLOBAL = [{"name":"BillowV","levelList":"Renevant","country":"mx"},{"name":"score","levelList":"Renevant","country":"cl"}];

// INYECCIÓN FORZADA: Sobrescribe LocalStorage con datos globales
if (NIVELES_GLOBALES.length > 0) localStorage.setItem('scully_db_levels', JSON.stringify(NIVELES_GLOBALES));
if (RANKING_GLOBAL.length > 0) localStorage.setItem('scully_ranks', JSON.stringify(RANKING_GLOBAL));

function getDBLevels() { return JSON.parse(localStorage.getItem('scully_db_levels')) || []; }
function calculatePoints(index) { return Math.max(100 - (index * 0.6), 5).toFixed(1); }

function renderLevels(filter = "") {
    const container = document.getElementById('list-container');
    if (!container) return;
    const db = getDBLevels();
    container.innerHTML = "";
    db.forEach((lvl, i) => {
        if (lvl.name.toLowerCase().includes(filter.toLowerCase())) {
            container.innerHTML += '<div class="level-card" onclick="openDetails(' + i + ')"><div class="level-thumb"><img src="https://img.youtube.com/vi/' + lvl.id + '/mqdefault.jpg"></div><div class="level-info"><h2>' + lvl.name + '</h2><p style="color:#ff6600; font-weight:bold; font-size:0.7rem;">+' + calculatePoints(i) + ' PTS</p></div><div class="rank-number">#' + (i + 1) + '</div></div>';
        }
    });
}

function openDetails(index) {
    const db = getDBLevels();
    const lvl = db[index];
    const body = document.getElementById('modal-body');
    const victors = lvl.victors && lvl.victors.length > 0 ? lvl.victors.join(', ') : 'Sin victors.';
    body.innerHTML = '<h1 style="color:#ff6600; margin-bottom:0;">' + lvl.name + '</h1><p style="font-size:0.7rem; color:#444; margin-bottom:15px;">TOP #' + (index + 1) + ' • ' + calculatePoints(index) + ' PTS</p><iframe width="100%" height="250" src="https://www.youtube.com/embed/' + lvl.id + '" frameborder="0" allowfullscreen></iframe><div style="text-align:left; margin-top:15px;"><p style="margin:0;"><b style="color:#ff6600">FIRST VICTOR:</b> ' + (lvl.first || 'Nadie') + '</p><p style="font-size:0.8rem; color:#888; margin-top:5px;"><b>OTROS:</b> ' + victors + '</p></div>';
    document.getElementById('levelModal').style.display = "block";
}

function renderLeaderboard() {
    const body = document.getElementById('leaderboardBody');
    if (!body) return;
    const dbLevels = getDBLevels();
    let users = JSON.parse(localStorage.getItem('scully_ranks')) || [];
    users.forEach(u => {
        let total = 0;
        let comp = u.levelList ? u.levelList.split(",") : [];
        comp.forEach(c => {
            const idx = dbLevels.findIndex(l => l.name.trim().toLowerCase() === c.trim().toLowerCase());
            if (idx > -1) total += parseFloat(calculatePoints(idx));
        });
        u.points = total.toFixed(1); u.count = comp.length;
    });
    users.sort((a, b) => b.points - a.points);
    body.innerHTML = users.map((u, i) => '<tr class="rank-row" onclick="openUserProfile(\'' + u.name + '\')"><td>#' + (i + 1) + '</td><td style="text-align:left;"><img src="https://flagcdn.com/w20/' + u.country + '.png" style="margin-right:10px;">' + u.name + '</td><td style="color:#ff6600; font-weight:bold;">' + u.points + '</td><td style="color:#444;">' + u.count + '</td></tr>').join('');
}

function openUserProfile(name) {
    const users = JSON.parse(localStorage.getItem('scully_ranks')) || [];
    const db = getDBLevels();
    const u = users.find(x => x.name === name);
    if (!u) return;
    document.getElementById('uName').innerText = u.name;
    document.getElementById('uFlag').src = 'https://flagcdn.com/w80/' + u.country + '.png';
    document.getElementById('uPoints').innerText = u.points;
    document.getElementById('uCount').innerText = u.count;
    const list = u.levelList.split(',').map(lvl => {
        const idx = db.findIndex(l => l.name.toLowerCase() === lvl.trim().toLowerCase());
        return '<div style="display:flex; justify-content:space-between; padding:5px; border-bottom:1px solid #111;"><span>' + lvl.trim() + '</span><b style="color:#ff6600">+' + (idx > -1 ? calculatePoints(idx) : '0.0') + '</b></div>';
    }).join('');
    document.getElementById('uList').innerHTML = list || 'Vacío.';
    document.getElementById('uModal').style.display = "block";
}

function closeModal() { document.querySelectorAll('.modal').forEach(m => m.style.display = "none"); }
function closeM() { closeModal(); }
document.addEventListener("DOMContentLoaded", () => { renderLevels(); renderLeaderboard(); });
