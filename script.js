
// MOTOR CENTRAL SCULLY - V3 (Interactivo)
const NIVELES = [{"name":"The Golden","id":"hQFe_nuQMhQ","first":"score","victors":[]},{"name":"Shukketsu","id":"QOdriQ04LE0","first":"score","victors":[]},{"name":"Promethean","id":"E6dXFQLqH6s","first":"Acidiix","victors":[]},{"name":"Renevant","id":"lb2f1NkSJrU","first":"BillowV","victors":["score"]}];
const RANKING = [{"name":"BillowV","levelList":"Renevant","country":"mx"},{"name":"score","levelList":"The Golden, Renevant","country":"cl"}];

if (sessionStorage.getItem('scully_session') !== 'active') {
    localStorage.setItem('scully_db_levels', JSON.stringify(NIVELES));
    localStorage.setItem('scully_ranks', JSON.stringify(RANKING));
}

function getDBLevelsLive() { return JSON.parse(localStorage.getItem('scully_db_levels')) || NIVELES; }
function getDBRanksLive() { return JSON.parse(localStorage.getItem('scully_ranks')) || RANKING; }
function calculatePoints(i) { return Math.max(100 - (i * 0.6), 5).toFixed(1); }

function renderLevels(f = "") {
    const c = document.getElementById('list-container'); if(!c) return;
    c.innerHTML = "";
    const db = getDBLevelsLive();
    db.forEach((l, i) => { 
        if(l.name.toLowerCase().includes(f.toLowerCase())) {
            c.innerHTML += '<div class="level-card" onclick="openDetails(' + i + ')"><div class="level-thumb"><img src="https://img.youtube.com/vi/' + l.id + '/mqdefault.jpg"></div><div class="level-info"><h2>' + l.name + '</h2><p style="color:#ff6600; font-weight:bold;">+' + calculatePoints(i) + ' PTS</p></div><div class="rank-number">#' + (i + 1) + '</div></div>';
        }
    });
}

function openDetails(i) {
    const l = getDBLevelsLive()[i];
    const victors = l.victors && l.victors.length > 0 ? l.victors.join(", ") : "Sin victors registrados";
    document.getElementById('modal-body').innerHTML = '<h1 style="color:#ff6600; margin-bottom:5px;">' + l.name + '</h1><p style="font-size:0.7rem; color:#444; margin-bottom:15px;">TOP #' + (i + 1) + ' • ' + calculatePoints(i) + ' PTS</p><div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden;"><iframe style="position:absolute; top:0; left:0; width:100%; height:100%;" src="https://www.youtube.com/embed/' + l.id + '" frameborder="0" allowfullscreen></iframe></div><div style="text-align:left; margin-top:15px;"><p style="margin:0;"><b style="color:#ff6600">FIRST VICTOR:</b> ' + (l.first || 'Nadie') + '</p><p style="font-size:0.8rem; color:#888; margin-top:5px;"><b>OTROS:</b> ' + victors + '</p></div>';
    document.getElementById('levelModal').style.display = "block";
}

function renderLeaderboard() {
    const b = document.getElementById('leaderboardBody'); if(!b) return;
    const db = getDBLevelsLive();
    const ranks = getDBRanksLive();
    ranks.forEach(u => {
        let t = 0; let list = u.levelList ? u.levelList.split(",") : [];
        list.forEach(lvl => { const idx = db.findIndex(item => item.name.trim().toLowerCase() === lvl.trim().toLowerCase()); if(idx > -1) t += parseFloat(calculatePoints(idx)); });
        u.pts = t.toFixed(1); u.cnt = list.filter(x => x.trim() !== "").length;
    });
    ranks.sort((a,b) => b.pts - a.pts);
    b.innerHTML = ranks.map((u, i) => '<tr class="rank-row" onclick="openUserProfile(\'' + u.name + '\')"><td>#' + (i + 1) + '</td><td style="text-align:left;"><img src="https://flagcdn.com/w20/' + u.country + '.png" style="margin-right:10px;">' + u.name + '</td><td style="color:#ff6600; font-weight:bold;">' + u.pts + '</td><td>' + u.cnt + '</td></tr>').join("");
}

function openUserProfile(n) {
    const u = getDBRanksLive().find(x => x.name === n);
    const db = getDBLevelsLive();
    let listHTML = "";
    let list = u.levelList ? u.levelList.split(",") : [];
    list.forEach(lvl => {
        let lvlClean = lvl.trim();
        if(lvlClean) {
            const idx = db.findIndex(item => item.name.trim().toLowerCase() === lvlClean.toLowerCase());
            if(idx > -1) {
                listHTML += '<div style="display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #111; cursor:pointer;" onclick="document.getElementById(\'uModal\').style.display=\'none\'; openDetails(' + idx + ');"><span style="color:#fff; transition:0.3s;" onmouseover="this.style.color=\'#ff6600\'" onmouseout="this.style.color=\'#fff\'"><i class="fas fa-play-circle" style="color:var(--accent); margin-right:5px;"></i>' + db[idx].name + '</span><b style="color:#ff6600">+' + calculatePoints(idx) + '</b></div>';
            } else {
                listHTML += '<div style="display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #111;"><span style="color:#666;">' + lvlClean + '</span><b style="color:#666;">+0.0</b></div>';
            }
        }
    });

    document.getElementById('uModalContent').innerHTML = '<span onclick="closeModal(\'uModal\')" style="cursor:pointer; color:#ff6600; position:absolute; right:20px; top:10px; font-size:2rem;">&times;</span><img src="https://flagcdn.com/w80/' + u.country + '.png" style="width:60px;"><h2 style="color:#ff6600; margin:0; padding-top:10px;">' + u.name + '</h2><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:15px;"><div style="background:#000; padding:10px;"><b style="color:#ff6600; font-size:1.2rem;">' + u.pts + '</b><br><small>PTS</small></div><div style="background:#000; padding:10px;"><b style="font-size:1.2rem;">' + u.cnt + '</b><br><small>LVLS</small></div></div><div style="text-align:left; font-size:0.8rem; border-top:1px solid #111; padding-top:10px; margin-top:15px; max-height:200px; overflow-y:auto;">' + (listHTML || '<p style="color:#888;">Sin niveles.</p>') + '</div>';
    document.getElementById('uModal').style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => { renderLevels(); renderLeaderboard(); });
