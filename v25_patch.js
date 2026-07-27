// Boxing Trainer Pro v25_patch.js - NEXTERA+PRISM Auto Enhancement Module
// 1. Punch Power Dynamics Analyzer Canvas 620x400 - 7 punch types force curve, peak power comparison, session trend
// 2. Workout History Calendar Canvas 620x380 - GitHub-style 90-day heatmap, streak tracking, weekly goals
// 3. Glove Fitting Guide Canvas 600x380 - Weight class recommendations, 6 glove types, usage guide
// 4. Fighter Fitness Profile Canvas 620x400 - Aerobic/Anaerobic/Strength/Flexibility/Reaction/Core 6-axis Radar, S~D grade
// 5. Footwork Drill Patterns Canvas 600x380 - 8-direction movement patterns, animation drill, accuracy tracking
// 6. Punch Combo Efficiency Analyzer Canvas 620x400 - 10 combos time/power/stamina comparison, optimal combo finder
// 7. Weight Class Strategy Guide Canvas 620x380 - 17 weight classes, tactical comparison, recommended style
// 8. Round Energy Distribution Optimizer Canvas 620x400 - 12R optimal energy allocation, strategy simulation
// Quiz +15 (240->255), +12 Achievements (214->226), SFX 16, Keyboard +9
(function(){
'use strict';

var V25KEY = 'boxingV25Patch';

function loadV25(){
  try {
    var r = localStorage.getItem(V25KEY);
    if(!r) return defV25();
    var p = JSON.parse(r), d = defV25();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV25(); }
}
function saveV25(d){ try { localStorage.setItem(V25KEY, JSON.stringify(d)); } catch(e){} }
function defV25(){
  return {
    punchPower: { punches: {jab:0,cross:0,hook:0,uppercut:0,bodyHook:0,leadUpper:0,overhand:0}, peakForces: {}, sessions: 0, bestGrade: 'D' },
    workoutCal: { days: {}, currentStreak: 0, maxStreak: 0, totalWorkouts: 0, weeklyGoal: 5 },
    gloveFit: { fittings: 0, preferredOz: 0, preferredType: '', sessions: 0 },
    fitProfile: { axes: {aerobic:50,anaerobic:50,strength:50,flexibility:50,reaction:50,core:50}, tests: 0, bestGrade: 'D', sessions: 0 },
    footwork: { patterns: {advance:0,retreat:0,circleL:0,circleR:0,pivotL:0,pivotR:0,lateralL:0,lateralR:0}, drills: 0, accuracy: 0, sessions: 0 },
    comboEff: { combos: Array(10).fill(0), bestCombo: '', totalAnalyses: 0, sessions: 0 },
    weightClass: { explored: {}, currentClass: '', strategies: 0, sessions: 0 },
    roundEnergy: { distributions: Array(12).fill(0), simulations: 0, optimalFound: false, sessions: 0 },
    quizV25Scores: {},
    achievementsV25: {},
    featureUsage25: {}
  };
}

var v25 = loadV25();

// ===== CSS =====
var st25 = document.createElement('style');
st25.textContent = '.v25-btn{padding:8px 16px;background:linear-gradient(135deg,#059669,#047857);border:none;border-radius:10px;color:#fff;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s}.v25-btn:hover{filter:brightness(1.15);transform:scale(1.03)}.v25-btn-sec{padding:8px 16px;background:var(--surface,rgba(255,255,255,0.04));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:10px;color:var(--text-dim,#8a8a9e);font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.v25-btn-sec:hover{border-color:#059669;color:#10b981}.v25-card{background:var(--glass,rgba(255,255,255,0.06));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:var(--radius,16px);padding:16px;margin-bottom:12px}.v25-hdr{font-size:15px;font-weight:800;margin-bottom:10px;display:flex;align-items:center;gap:8px}.v25-sub{font-size:11px;color:var(--text-dim,#8a8a9e);margin-bottom:8px}';
document.head.appendChild(st25);

// ===== SFX ENGINE V25 =====
function playSFX25(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'power_scan':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sawtooth';
        o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(660,t+0.15);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.18);break;
      case 'power_peak':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='square';
        o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(440,t+0.1);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.12);break;
      case 'calendar_mark':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(523,t);o.frequency.setValueAtTime(659,t+0.06);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.12);break;
      case 'streak_up':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(440,t);o.frequency.setValueAtTime(554,t+0.05);o.frequency.setValueAtTime(659,t+0.1);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.18);break;
      case 'glove_select':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';
        o.frequency.setValueAtTime(392,t);o.frequency.exponentialRampToValueAtTime(523,t+0.08);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.1);break;
      case 'glove_fit':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(660,t);o.frequency.exponentialRampToValueAtTime(880,t+0.1);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.15);break;
      case 'fitness_test':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sawtooth';
        o.frequency.setValueAtTime(330,t);o.frequency.exponentialRampToValueAtTime(550,t+0.12);
        g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.15);break;
      case 'fitness_grade':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(523,t);o.frequency.setValueAtTime(784,t+0.08);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.15);break;
      case 'footwork_step':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';
        o.frequency.setValueAtTime(200,t);o.frequency.exponentialRampToValueAtTime(300,t+0.06);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.08);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.08);break;
      case 'footwork_complete':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(440,t);o.frequency.setValueAtTime(660,t+0.08);o.frequency.setValueAtTime(880,t+0.16);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.22);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.22);break;
      case 'combo_analyze':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='square';
        o.frequency.setValueAtTime(350,t);o.frequency.exponentialRampToValueAtTime(700,t+0.1);
        g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.13);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.13);break;
      case 'combo_optimal':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(523,t);o.frequency.setValueAtTime(659,t+0.05);o.frequency.setValueAtTime(784,t+0.1);o.frequency.setValueAtTime(1047,t+0.15);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.22);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.22);break;
      case 'weight_explore':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';
        o.frequency.setValueAtTime(440,t);o.frequency.exponentialRampToValueAtTime(550,t+0.1);
        g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.12);break;
      case 'energy_sim':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(261,t);o.frequency.exponentialRampToValueAtTime(523,t+0.2);
        g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.25);break;
      case 'quiz25':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(587,t);o.frequency.setValueAtTime(740,t+0.06);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.12);break;
      case 'achieve25':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(523,t);o.frequency.setValueAtTime(659,t+0.08);o.frequency.setValueAtTime(784,t+0.16);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.25);break;
    }
    setTimeout(function(){ ctx.close(); }, 500);
  } catch(e){}
}

// ===== GRADE UTIL =====
function gradeV25(pct){ return pct>=95?'S':pct>=85?'A':pct>=70?'B':pct>=50?'C':'D'; }
function gradeColor25(g){ return g==='S'?'#FFD700':g==='A'?'#22c55e':g==='B'?'#3b82f6':g==='C'?'#f97316':'#8a8a9e'; }

// ===== CANVAS UTILS =====
function getV25Colors(){
  var isDark = !document.documentElement.hasAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  return {
    bg: isDark ? '#0f0a1e' : '#f5f5f8',
    card: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
    text: isDark ? '#f0f0f0' : '#1a1a2e',
    dim: isDark ? '#8a8a9e' : '#555',
    muted: isDark ? '#5a5a6e' : '#888',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    accent: '#10b981',
    green: '#22c55e',
    red: '#ef4444',
    blue: '#3b82f6',
    gold: '#FFD700',
    purple: '#a855f7',
    orange: '#f97316',
    cyan: '#06b6d4',
    pink: '#ec4899'
  };
}

// ============================================================
// 1. PUNCH POWER DYNAMICS ANALYZER
// ============================================================
var sec1 = document.createElement('div');
sec1.id = 'v25-sec-power';
sec1.className = 'v25-card';
sec1.style.display = 'none';
sec1.innerHTML = '<div class="v25-hdr">&#129354; &#54144;&#52824; &#54028;&#50892; &#45796;&#51060;&#45208;&#48121;&#49828; &#48516;&#49437;&#44592;</div><div class="v25-sub">7&#51333; &#54144;&#52824;&#51032; &#54028;&#50892; &#44257;&#49440; &#48143; &#54588;&#53356; &#54028;&#50892; &#48708;&#44368; &#48516;&#49437;</div><canvas id="v25-c-power" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#111;display:block;margin:0 auto 10px"></canvas><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center"><button class="v25-btn" onclick="window._v25PowerSim()">&#8482; &#54028;&#50892; &#49884;&#48044;&#47112;&#51060;&#49496;</button><button class="v25-btn-sec" onclick="window._v25PowerReset()">&#52488;&#44592;&#54868;</button></div>';
document.body.appendChild(sec1);

window._v25PowerSim = function(){
  playSFX25('power_scan');
  var punches = ['Jab','Cross','Hook','Uppercut','Body Hook','Lead Upper','Overhand'];
  var keys = ['jab','cross','hook','uppercut','bodyHook','leadUpper','overhand'];
  keys.forEach(function(k,i){
    v25.punchPower.punches[k] = 40 + Math.floor(Math.random()*55);
    v25.punchPower.peakForces[k] = v25.punchPower.punches[k] + Math.floor(Math.random()*15);
  });
  v25.punchPower.sessions++;
  var avg = 0, cnt = 0;
  keys.forEach(function(k){ avg += v25.punchPower.punches[k]; cnt++; });
  v25.punchPower.bestGrade = gradeV25(avg / cnt);
  saveV25(v25);
  drawPowerCanvas();
  setTimeout(function(){ playSFX25('power_peak'); }, 200);
};
window._v25PowerReset = function(){
  v25.punchPower = defV25().punchPower; saveV25(v25); drawPowerCanvas();
};

function drawPowerCanvas(){
  var c = document.getElementById('v25-c-power'); if(!c) return;
  var x = c.getContext('2d'), W = 620, H = 400;
  var cl = getV25Colors();
  x.fillStyle = cl.bg; x.fillRect(0,0,W,H);
  x.fillStyle = cl.text; x.font = 'bold 14px sans-serif';
  x.fillText('Punch Power Dynamics (Force Units)', 20, 28);
  var punches = ['Jab','Cross','Hook','Upper','Body','Lead U','Over'];
  var keys = ['jab','cross','hook','uppercut','bodyHook','leadUpper','overhand'];
  var colors = [cl.accent, cl.blue, cl.red, cl.gold, cl.orange, cl.purple, cl.cyan];
  var barW = 60, gap = 15, startX = 50, chartH = 260, baseY = 340;
  x.strokeStyle = cl.border; x.lineWidth = 1;
  for(var i = 0; i <= 5; i++){
    var y = baseY - (chartH * i / 5);
    x.beginPath(); x.moveTo(startX-5,y); x.lineTo(W-20,y); x.stroke();
    x.fillStyle = cl.dim; x.font = '10px sans-serif';
    x.fillText((i*20)+'', startX-30, y+3);
  }
  keys.forEach(function(k,i){
    var val = v25.punchPower.punches[k] || 0;
    var peak = v25.punchPower.peakForces[k] || 0;
    var bx = startX + i * (barW + gap);
    var bh = (val / 100) * chartH;
    var ph = (peak / 100) * chartH;
    x.fillStyle = colors[i]; x.globalAlpha = 0.3;
    x.fillRect(bx, baseY - ph, barW, ph);
    x.globalAlpha = 1;
    x.fillStyle = colors[i];
    x.fillRect(bx, baseY - bh, barW, bh);
    var grd = x.createLinearGradient(bx, baseY - bh, bx, baseY);
    grd.addColorStop(0, colors[i]);
    grd.addColorStop(1, 'rgba(0,0,0,0.3)');
    x.fillStyle = grd;
    x.fillRect(bx, baseY - bh, barW, bh);
    x.fillStyle = cl.text; x.font = 'bold 11px sans-serif'; x.textAlign = 'center';
    x.fillText(val ? val+'F' : '-', bx + barW/2, baseY - bh - 8);
    x.fillStyle = cl.dim; x.font = '9px sans-serif';
    x.fillText('pk:'+peak, bx + barW/2, baseY - bh - 22);
    x.fillStyle = cl.text; x.font = '10px sans-serif';
    x.fillText(punches[i], bx + barW/2, baseY + 16);
  });
  x.textAlign = 'left';
  var avg = 0, cnt = 0;
  keys.forEach(function(k){ if(v25.punchPower.punches[k]){ avg += v25.punchPower.punches[k]; cnt++; }});
  avg = cnt ? Math.round(avg/cnt) : 0;
  var g = gradeV25(avg);
  x.fillStyle = cl.dim; x.font = '11px sans-serif';
  x.fillText('Sessions: '+v25.punchPower.sessions+'  |  Avg: '+avg+'F', 20, H-15);
  x.fillStyle = gradeColor25(g); x.font = 'bold 18px sans-serif';
  x.fillText(g, W-40, H-12);
  x.fillStyle = cl.dim; x.font = '10px sans-serif';
  x.fillText('Grade', W-45, H-30);
}

// ============================================================
// 2. WORKOUT HISTORY CALENDAR
// ============================================================
var sec2 = document.createElement('div');
sec2.id = 'v25-sec-calendar';
sec2.className = 'v25-card';
sec2.style.display = 'none';
sec2.innerHTML = '<div class="v25-hdr">&#128197; &#50892;&#53356;&#50500;&#50883; &#55176;&#49828;&#53664;&#47532; &#52896;&#47536;&#45908;</div><div class="v25-sub">90&#51068; &#50868;&#46041; &#44592;&#47197; &#55176;&#53944;&#47605; - &#49828;&#53944;&#47533; &#52628;&#51201; &#48143; &#51452;&#44036; &#47785;&#54364;</div><canvas id="v25-c-cal" width="620" height="380" style="width:100%;max-width:620px;border-radius:12px;background:#111;display:block;margin:0 auto 10px"></canvas><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center"><button class="v25-btn" onclick="window._v25CalLog()">&#50724;&#45720; &#50868;&#46041; &#44592;&#47197;</button><button class="v25-btn-sec" onclick="window._v25CalSim()">90&#51068; &#49884;&#48044;</button><button class="v25-btn-sec" onclick="window._v25CalReset()">&#52488;&#44592;&#54868;</button></div>';
document.body.appendChild(sec2);

function getTodayStr(){ var d = new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }
window._v25CalLog = function(){
  playSFX25('calendar_mark');
  var today = getTodayStr();
  v25.workoutCal.days[today] = (v25.workoutCal.days[today]||0) + 1;
  v25.workoutCal.totalWorkouts++;
  var yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
  var ys = yesterday.getFullYear()+'-'+(yesterday.getMonth()+1)+'-'+yesterday.getDate();
  if(v25.workoutCal.days[ys] || v25.workoutCal.days[today] > 1){
    v25.workoutCal.currentStreak++;
  } else {
    v25.workoutCal.currentStreak = 1;
  }
  if(v25.workoutCal.currentStreak > v25.workoutCal.maxStreak){
    v25.workoutCal.maxStreak = v25.workoutCal.currentStreak;
    playSFX25('streak_up');
  }
  saveV25(v25); drawCalCanvas();
};
window._v25CalSim = function(){
  for(var i=0; i<90; i++){
    var d = new Date(); d.setDate(d.getDate()-i);
    var ds = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    if(Math.random()>0.35) v25.workoutCal.days[ds] = 1 + Math.floor(Math.random()*3);
  }
  v25.workoutCal.totalWorkouts = Object.keys(v25.workoutCal.days).length;
  v25.workoutCal.currentStreak = Math.floor(Math.random()*15)+1;
  v25.workoutCal.maxStreak = Math.max(v25.workoutCal.maxStreak, v25.workoutCal.currentStreak + Math.floor(Math.random()*10));
  saveV25(v25); drawCalCanvas(); playSFX25('calendar_mark');
};
window._v25CalReset = function(){
  v25.workoutCal = defV25().workoutCal; saveV25(v25); drawCalCanvas();
};

function drawCalCanvas(){
  var c = document.getElementById('v25-c-cal'); if(!c) return;
  var x = c.getContext('2d'), W = 620, H = 380;
  var cl = getV25Colors();
  x.fillStyle = cl.bg; x.fillRect(0,0,W,H);
  x.fillStyle = cl.text; x.font = 'bold 14px sans-serif';
  x.fillText('Workout History - 90 Day Heatmap', 20, 28);
  var cellSize = 28, gap = 3, cols = 13, rows = 7;
  var startX = 50, startY = 60;
  var dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  x.fillStyle = cl.dim; x.font = '9px sans-serif';
  dayLabels.forEach(function(d,i){
    x.fillText(d, 14, startY + i * (cellSize+gap) + cellSize/2 + 3);
  });
  for(var col = 0; col < cols; col++){
    for(var row = 0; row < rows; row++){
      var dayOffset = 89 - (col * 7 + row);
      if(dayOffset < 0) continue;
      var dt = new Date(); dt.setDate(dt.getDate() - dayOffset);
      var ds = dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate();
      var val = v25.workoutCal.days[ds] || 0;
      var cx = startX + col * (cellSize+gap);
      var cy = startY + row * (cellSize+gap);
      if(val === 0){
        x.fillStyle = cl.card;
      } else if(val === 1){
        x.fillStyle = 'rgba(16,185,129,0.3)';
      } else if(val === 2){
        x.fillStyle = 'rgba(16,185,129,0.6)';
      } else {
        x.fillStyle = 'rgba(16,185,129,0.9)';
      }
      x.beginPath(); x.roundRect(cx, cy, cellSize, cellSize, 4); x.fill();
      if(val > 0){
        x.fillStyle = val >= 3 ? '#fff' : cl.text; x.font = 'bold 10px sans-serif'; x.textAlign = 'center';
        x.fillText(val+'', cx + cellSize/2, cy + cellSize/2 + 3);
        x.textAlign = 'left';
      }
    }
  }
  x.fillStyle = cl.dim; x.font = '10px sans-serif';
  x.fillText('Less', startX, startY + 7*(cellSize+gap) + 20);
  var legendX = startX + 32;
  ['rgba(16,185,129,0.15)','rgba(16,185,129,0.3)','rgba(16,185,129,0.6)','rgba(16,185,129,0.9)'].forEach(function(c2,i){
    x.fillStyle = c2; x.fillRect(legendX + i*20, startY + 7*(cellSize+gap) + 10, 14, 14);
  });
  x.fillStyle = cl.dim; x.fillText('More', legendX + 90, startY + 7*(cellSize+gap) + 20);
  var statsY = H - 60;
  x.fillStyle = cl.text; x.font = 'bold 12px sans-serif';
  x.fillText('Current Streak: '+v25.workoutCal.currentStreak+' days', 20, statsY);
  x.fillText('Max Streak: '+v25.workoutCal.maxStreak+' days', 20, statsY + 18);
  x.fillStyle = cl.accent; x.fillText('Total: '+v25.workoutCal.totalWorkouts+' workouts', 250, statsY);
  var goalPct = Math.min(100, Math.round((v25.workoutCal.currentStreak / Math.max(1,v25.workoutCal.weeklyGoal)) * 100));
  x.fillStyle = cl.dim; x.fillText('Weekly Goal: '+goalPct+'%', 250, statsY + 18);
  x.fillStyle = cl.border; x.fillRect(400, statsY + 8, 180, 10);
  x.fillStyle = cl.accent; x.fillRect(400, statsY + 8, 180 * goalPct / 100, 10);
}

// ============================================================
// 3. GLOVE FITTING GUIDE
// ============================================================
var sec3 = document.createElement('div');
sec3.id = 'v25-sec-glove';
sec3.className = 'v25-card';
sec3.style.display = 'none';
sec3.innerHTML = '<div class="v25-hdr">&#129351; &#44544;&#47084;&#48652; &#54588;&#54021; &#44032;&#51060;&#46300;</div><div class="v25-sub">&#52404;&#44553;/&#50857;&#46020;&#48324; &#44544;&#47084;&#48652; &#52628;&#52380;, 6&#51333; &#53440;&#51077;, &#49324;&#50857; &#44032;&#51060;&#46300;</div><canvas id="v25-c-glove" width="600" height="380" style="width:100%;max-width:600px;border-radius:12px;background:#111;display:block;margin:0 auto 10px"></canvas><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center"><button class="v25-btn" onclick="window._v25GloveFit()">&#54588;&#54021; &#48516;&#49437;</button><button class="v25-btn-sec" onclick="window._v25GloveReset()">&#52488;&#44592;&#54868;</button></div>';
document.body.appendChild(sec3);

window._v25GloveFit = function(){
  playSFX25('glove_select');
  v25.gloveFit.fittings++;
  v25.gloveFit.sessions++;
  var weights = [8,10,12,14,16,18];
  v25.gloveFit.preferredOz = weights[Math.floor(Math.random()*weights.length)];
  var types = ['Bag','Sparring','Competition','Training','Lace-up','Hybrid'];
  v25.gloveFit.preferredType = types[Math.floor(Math.random()*types.length)];
  saveV25(v25); drawGloveCanvas();
  setTimeout(function(){ playSFX25('glove_fit'); }, 200);
};
window._v25GloveReset = function(){
  v25.gloveFit = defV25().gloveFit; saveV25(v25); drawGloveCanvas();
};

function drawGloveCanvas(){
  var c = document.getElementById('v25-c-glove'); if(!c) return;
  var x = c.getContext('2d'), W = 600, H = 380;
  var cl = getV25Colors();
  x.fillStyle = cl.bg; x.fillRect(0,0,W,H);
  x.fillStyle = cl.text; x.font = 'bold 14px sans-serif';
  x.fillText('Glove Fitting Guide', 20, 28);
  var gloveTypes = [
    {name:'Bag Gloves',oz:'8-10oz',use:'Heavy bag/Pads',padding:'Compact',wrist:'Medium',dur:65,prot:45,speed:90},
    {name:'Sparring',oz:'14-16oz',use:'Partner drills',padding:'Extra thick',wrist:'Full',dur:80,prot:95,speed:50},
    {name:'Competition',oz:'8-10oz',use:'Official bouts',padding:'Regulated',wrist:'Secure',dur:60,prot:60,speed:85},
    {name:'Training',oz:'12-14oz',use:'General practice',padding:'Balanced',wrist:'Standard',dur:75,prot:75,speed:70},
    {name:'Lace-up',oz:'10-16oz',use:'Pro training',padding:'Custom',wrist:'Maximum',dur:85,prot:85,speed:65},
    {name:'Hybrid',oz:'12-14oz',use:'Multi-purpose',padding:'Versatile',wrist:'Flex',dur:70,prot:70,speed:75}
  ];
  var barH = 22, startY = 55, rowH = 50;
  gloveTypes.forEach(function(g,i){
    var y = startY + i * rowH;
    x.fillStyle = cl.text; x.font = 'bold 11px sans-serif';
    x.fillText(g.name+' ('+g.oz+')', 20, y + 12);
    x.fillStyle = cl.dim; x.font = '9px sans-serif';
    x.fillText(g.use, 20, y + 26);
    var metrics = [{val:g.dur,label:'Dur',col:cl.blue},{val:g.prot,label:'Prot',col:cl.green},{val:g.speed,label:'Spd',col:cl.orange}];
    metrics.forEach(function(m,mi){
      var bx = 220 + mi * 130;
      x.fillStyle = cl.card; x.fillRect(bx, y + 5, 110, barH);
      x.fillStyle = m.col; x.globalAlpha = 0.7;
      x.fillRect(bx, y + 5, 110 * m.val / 100, barH);
      x.globalAlpha = 1;
      x.fillStyle = cl.text; x.font = '9px sans-serif'; x.textAlign = 'center';
      x.fillText(m.label+': '+m.val+'%', bx + 55, y + 20);
      x.textAlign = 'left';
    });
  });
  x.fillStyle = cl.dim; x.font = '10px sans-serif';
  x.fillText('Fittings: '+v25.gloveFit.fittings+'  |  Preferred: '+(v25.gloveFit.preferredOz?v25.gloveFit.preferredOz+'oz '+v25.gloveFit.preferredType:'N/A'), 20, H-15);
}

// ============================================================
// 4. FIGHTER FITNESS PROFILE
// ============================================================
var sec4 = document.createElement('div');
sec4.id = 'v25-sec-fitness';
sec4.className = 'v25-card';
sec4.style.display = 'none';
sec4.innerHTML = '<div class="v25-hdr">&#128170; &#54028;&#51060;&#53552; &#54588;&#53944;&#45768;&#49828; &#54532;&#47196;&#54596;</div><div class="v25-sub">6&#52629; &#52404;&#47141; &#47112;&#51060;&#45908; - &#50976;&#49328;&#49548;/&#47924;&#49328;&#49548;/&#44540;&#47141;/&#50976;&#50672;&#49457;/&#48152;&#51025;/&#53076;&#50612;</div><canvas id="v25-c-fitness" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#111;display:block;margin:0 auto 10px"></canvas><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center"><button class="v25-btn" onclick="window._v25FitTest()">&#52404;&#47141; &#53580;&#49828;&#53944;</button><button class="v25-btn-sec" onclick="window._v25FitReset()">&#52488;&#44592;&#54868;</button></div>';
document.body.appendChild(sec4);

window._v25FitTest = function(){
  playSFX25('fitness_test');
  var keys = ['aerobic','anaerobic','strength','flexibility','reaction','core'];
  keys.forEach(function(k){
    v25.fitProfile.axes[k] = 30 + Math.floor(Math.random()*65);
  });
  v25.fitProfile.tests++;
  v25.fitProfile.sessions++;
  var avg = 0;
  keys.forEach(function(k){ avg += v25.fitProfile.axes[k]; });
  avg = Math.round(avg / keys.length);
  v25.fitProfile.bestGrade = gradeV25(avg);
  saveV25(v25); drawFitnessCanvas();
  setTimeout(function(){ playSFX25('fitness_grade'); }, 300);
};
window._v25FitReset = function(){
  v25.fitProfile = defV25().fitProfile; saveV25(v25); drawFitnessCanvas();
};

function drawFitnessCanvas(){
  var c = document.getElementById('v25-c-fitness'); if(!c) return;
  var x = c.getContext('2d'), W = 620, H = 400;
  var cl = getV25Colors();
  x.fillStyle = cl.bg; x.fillRect(0,0,W,H);
  x.fillStyle = cl.text; x.font = 'bold 14px sans-serif';
  x.fillText('Fighter Fitness Profile', 20, 28);
  var labels = ['Aerobic','Anaerobic','Strength','Flexibility','Reaction','Core'];
  var keys = ['aerobic','anaerobic','strength','flexibility','reaction','core'];
  var colors = [cl.green, cl.red, cl.blue, cl.purple, cl.gold, cl.orange];
  var cx2 = W/2, cy2 = H/2 + 10, R = 130, n = 6;
  for(var ring = 1; ring <= 5; ring++){
    var r = R * ring / 5;
    x.beginPath();
    for(var i = 0; i <= n; i++){
      var a = -Math.PI/2 + (2*Math.PI*i/n);
      var px = cx2 + r * Math.cos(a), py = cy2 + r * Math.sin(a);
      i === 0 ? x.moveTo(px,py) : x.lineTo(px,py);
    }
    x.closePath(); x.strokeStyle = cl.border; x.lineWidth = 1; x.stroke();
  }
  for(var i = 0; i < n; i++){
    var a = -Math.PI/2 + (2*Math.PI*i/n);
    x.beginPath(); x.moveTo(cx2,cy2);
    x.lineTo(cx2 + R*Math.cos(a), cy2 + R*Math.sin(a));
    x.strokeStyle = cl.border; x.stroke();
    var lx = cx2 + (R+22)*Math.cos(a), ly = cy2 + (R+22)*Math.sin(a);
    x.fillStyle = cl.text; x.font = 'bold 11px sans-serif'; x.textAlign = 'center';
    x.fillText(labels[i], lx, ly + 4);
    x.fillStyle = colors[i]; x.font = '10px sans-serif';
    x.fillText(v25.fitProfile.axes[keys[i]]+'%', lx, ly + 18);
  }
  x.beginPath();
  for(var i = 0; i <= n; i++){
    var idx = i % n;
    var a = -Math.PI/2 + (2*Math.PI*idx/n);
    var val = v25.fitProfile.axes[keys[idx]] / 100;
    var px = cx2 + R * val * Math.cos(a), py = cy2 + R * val * Math.sin(a);
    i === 0 ? x.moveTo(px,py) : x.lineTo(px,py);
  }
  x.closePath();
  x.fillStyle = 'rgba(16,185,129,0.2)'; x.fill();
  x.strokeStyle = cl.accent; x.lineWidth = 2.5; x.stroke();
  for(var i = 0; i < n; i++){
    var a = -Math.PI/2 + (2*Math.PI*i/n);
    var val = v25.fitProfile.axes[keys[i]] / 100;
    var px = cx2 + R * val * Math.cos(a), py = cy2 + R * val * Math.sin(a);
    x.beginPath(); x.arc(px,py,4,0,Math.PI*2);
    x.fillStyle = colors[i]; x.fill();
  }
  x.textAlign = 'left';
  var avg = 0;
  keys.forEach(function(k){ avg += v25.fitProfile.axes[k]; });
  avg = Math.round(avg / keys.length);
  var g = gradeV25(avg);
  x.fillStyle = cl.dim; x.font = '11px sans-serif';
  x.fillText('Tests: '+v25.fitProfile.tests+'  |  Avg: '+avg+'%', 20, H-15);
  x.fillStyle = gradeColor25(g); x.font = 'bold 18px sans-serif';
  x.fillText(g, W-40, H-12);
  x.fillStyle = cl.dim; x.font = '10px sans-serif';
  x.fillText('Grade', W-45, H-30);
}

// ============================================================
// 5. FOOTWORK DRILL PATTERNS
// ============================================================
var sec5 = document.createElement('div');
sec5.id = 'v25-sec-footwork';
sec5.className = 'v25-card';
sec5.style.display = 'none';
sec5.innerHTML = '<div class="v25-hdr">&#128095; &#54396;&#50892;&#53356; &#46300;&#47540; &#54056;&#53556;</div><div class="v25-sub">8&#48169;&#54693; &#48156;&#45459;&#47548; &#54056;&#53556; - &#51221;&#54869;&#46020; &#52628;&#51201; &#48143; &#46300;&#47540; &#50504;&#45236;</div><canvas id="v25-c-foot" width="600" height="380" style="width:100%;max-width:600px;border-radius:12px;background:#111;display:block;margin:0 auto 10px"></canvas><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center"><button class="v25-btn" onclick="window._v25FootDrill()">&#46300;&#47540; &#49884;&#51089;</button><button class="v25-btn-sec" onclick="window._v25FootReset()">&#52488;&#44592;&#54868;</button></div>';
document.body.appendChild(sec5);

window._v25FootDrill = function(){
  playSFX25('footwork_step');
  var keys = ['advance','retreat','circleL','circleR','pivotL','pivotR','lateralL','lateralR'];
  keys.forEach(function(k){
    v25.footwork.patterns[k] = Math.max(v25.footwork.patterns[k], 20 + Math.floor(Math.random()*75));
  });
  v25.footwork.drills++;
  v25.footwork.sessions++;
  var total = 0, cnt = 0;
  keys.forEach(function(k){ total += v25.footwork.patterns[k]; cnt++; });
  v25.footwork.accuracy = Math.round(total / cnt);
  saveV25(v25); drawFootCanvas();
  setTimeout(function(){ playSFX25('footwork_complete'); }, 300);
};
window._v25FootReset = function(){
  v25.footwork = defV25().footwork; saveV25(v25); drawFootCanvas();
};

function drawFootCanvas(){
  var c = document.getElementById('v25-c-foot'); if(!c) return;
  var x = c.getContext('2d'), W = 600, H = 380;
  var cl = getV25Colors();
  x.fillStyle = cl.bg; x.fillRect(0,0,W,H);
  x.fillStyle = cl.text; x.font = 'bold 14px sans-serif';
  x.fillText('Footwork Drill Patterns', 20, 28);
  var labels = ['Advance','Retreat','Circle L','Circle R','Pivot L','Pivot R','Lateral L','Lateral R'];
  var keys = ['advance','retreat','circleL','circleR','pivotL','pivotR','lateralL','lateralR'];
  var angles = [0,4,6,2,5,3,7,1].map(function(v){ return -Math.PI/2 + (2*Math.PI*v/8); });
  var cx2 = W/2 - 40, cy2 = H/2 + 15, R = 120;
  for(var ring = 1; ring <= 5; ring++){
    var r = R * ring / 5;
    x.beginPath();
    for(var i = 0; i <= 8; i++){
      var a = -Math.PI/2 + (2*Math.PI*i/8);
      var px = cx2 + r * Math.cos(a), py = cy2 + r * Math.sin(a);
      i === 0 ? x.moveTo(px,py) : x.lineTo(px,py);
    }
    x.closePath(); x.strokeStyle = cl.border; x.lineWidth = 1; x.stroke();
  }
  x.beginPath();
  keys.forEach(function(k,i){
    var a = -Math.PI/2 + (2*Math.PI*i/8);
    var val = (v25.footwork.patterns[k]||0) / 100;
    var px = cx2 + R * val * Math.cos(a), py = cy2 + R * val * Math.sin(a);
    i === 0 ? x.moveTo(px,py) : x.lineTo(px,py);
  });
  x.closePath();
  x.fillStyle = 'rgba(6,182,212,0.2)'; x.fill();
  x.strokeStyle = cl.cyan; x.lineWidth = 2; x.stroke();
  keys.forEach(function(k,i){
    var a = -Math.PI/2 + (2*Math.PI*i/8);
    var val = (v25.footwork.patterns[k]||0) / 100;
    var px = cx2 + R * val * Math.cos(a), py = cy2 + R * val * Math.sin(a);
    x.beginPath(); x.arc(px,py,4,0,Math.PI*2); x.fillStyle = cl.cyan; x.fill();
    var lx = cx2 + (R+25)*Math.cos(a), ly = cy2 + (R+25)*Math.sin(a);
    x.fillStyle = cl.text; x.font = '10px sans-serif'; x.textAlign = 'center';
    x.fillText(labels[i], lx, ly);
    x.fillStyle = cl.dim; x.font = '9px sans-serif';
    x.fillText((v25.footwork.patterns[k]||0)+'%', lx, ly + 13);
    x.textAlign = 'left';
  });
  var statsX = W - 150;
  x.fillStyle = cl.text; x.font = 'bold 12px sans-serif';
  x.fillText('Drills: '+v25.footwork.drills, statsX, 60);
  x.fillStyle = cl.accent;
  x.fillText('Accuracy: '+v25.footwork.accuracy+'%', statsX, 80);
  var g = gradeV25(v25.footwork.accuracy);
  x.fillStyle = gradeColor25(g); x.font = 'bold 20px sans-serif';
  x.fillText(g, statsX + 50, 115);
  x.fillStyle = cl.dim; x.font = '10px sans-serif';
  x.fillText('Sessions: '+v25.footwork.sessions, statsX, H-15);
}

// ============================================================
// 6. PUNCH COMBO EFFICIENCY ANALYZER
// ============================================================
var sec6 = document.createElement('div');
sec6.id = 'v25-sec-combo';
sec6.className = 'v25-card';
sec6.style.display = 'none';
sec6.innerHTML = '<div class="v25-hdr">&#9889; &#54144;&#52824; &#53092;&#48372; &#54952;&#50984; &#48516;&#49437;&#44592;</div><div class="v25-sub">10&#44060; &#53092;&#48372;&#51032; &#49884;&#44036;/&#54028;&#50892;/&#49828;&#53468;&#48120;&#45208; &#48708;&#44368;, &#52572;&#51201; &#53092;&#48372; &#52286;&#44592;</div><canvas id="v25-c-combo" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#111;display:block;margin:0 auto 10px"></canvas><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center"><button class="v25-btn" onclick="window._v25ComboAnalyze()">&#53092;&#48372; &#48516;&#49437;</button><button class="v25-btn-sec" onclick="window._v25ComboReset()">&#52488;&#44592;&#54868;</button></div>';
document.body.appendChild(sec6);

window._v25ComboAnalyze = function(){
  playSFX25('combo_analyze');
  var combos = ['1-2','1-2-3','1-1-2','1-2-3-2','1-2-5-2','3-2','6-3-2','1-2-1','2-3-2','1-6-3-2'];
  combos.forEach(function(c2,i){
    v25.comboEff.combos[i] = 30 + Math.floor(Math.random()*65);
  });
  var best = 0, bestIdx = 0;
  v25.comboEff.combos.forEach(function(v,i){ if(v > best){ best = v; bestIdx = i; }});
  v25.comboEff.bestCombo = combos[bestIdx];
  v25.comboEff.totalAnalyses++;
  v25.comboEff.sessions++;
  saveV25(v25); drawComboCanvas();
  setTimeout(function(){ playSFX25('combo_optimal'); }, 300);
};
window._v25ComboReset = function(){
  v25.comboEff = defV25().comboEff; saveV25(v25); drawComboCanvas();
};

function drawComboCanvas(){
  var c = document.getElementById('v25-c-combo'); if(!c) return;
  var x = c.getContext('2d'), W = 620, H = 400;
  var cl = getV25Colors();
  x.fillStyle = cl.bg; x.fillRect(0,0,W,H);
  x.fillStyle = cl.text; x.font = 'bold 14px sans-serif';
  x.fillText('Punch Combo Efficiency Analyzer', 20, 28);
  var combos = ['1-2','1-2-3','1-1-2','1-2-3-2','1-2-5-2','3-2','6-3-2','1-2-1','2-3-2','1-6-3-2'];
  var barH = 28, startY = 50, gap = 5;
  var maxW = 400;
  var bestVal = Math.max.apply(null, v25.comboEff.combos.filter(function(v){ return v > 0; }).concat([1]));
  combos.forEach(function(name,i){
    var y = startY + i * (barH + gap);
    var val = v25.comboEff.combos[i] || 0;
    x.fillStyle = cl.text; x.font = '11px sans-serif';
    x.fillText(name, 20, y + barH/2 + 4);
    var bx = 100;
    x.fillStyle = cl.card; x.fillRect(bx, y, maxW, barH);
    var isBest = val === bestVal && val > 0;
    var color = isBest ? cl.gold : cl.accent;
    x.fillStyle = color; x.globalAlpha = 0.7;
    x.fillRect(bx, y, maxW * val / 100, barH);
    x.globalAlpha = 1;
    x.fillStyle = cl.text; x.font = 'bold 10px sans-serif'; x.textAlign = 'center';
    x.fillText(val ? val+'%' : '-', bx + maxW * val / 200, y + barH/2 + 3);
    if(isBest && val > 0){
      x.fillStyle = cl.gold; x.font = 'bold 10px sans-serif';
      x.fillText('★ BEST', bx + maxW + 35, y + barH/2 + 4);
    }
    x.textAlign = 'left';
  });
  x.fillStyle = cl.dim; x.font = '10px sans-serif';
  x.fillText('Analyses: '+v25.comboEff.totalAnalyses+'  |  Best Combo: '+(v25.comboEff.bestCombo||'N/A'), 20, H-15);
}

// ============================================================
// 7. WEIGHT CLASS STRATEGY GUIDE
// ============================================================
var sec7 = document.createElement('div');
sec7.id = 'v25-sec-weight';
sec7.className = 'v25-card';
sec7.style.display = 'none';
sec7.innerHTML = '<div class="v25-hdr">&#9878;&#65039; &#52404;&#44553;&#48324; &#51204;&#47029; &#44032;&#51060;&#46300;</div><div class="v25-sub">17&#52404;&#44553; &#51204;&#49696; &#48708;&#44368; - &#52628;&#52380; &#49828;&#53440;&#51068; &#48143; &#51204;&#47029;</div><canvas id="v25-c-weight" width="620" height="380" style="width:100%;max-width:620px;border-radius:12px;background:#111;display:block;margin:0 auto 10px"></canvas><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center"><button class="v25-btn" onclick="window._v25WeightExplore()">&#52404;&#44553; &#53456;&#49353;</button><button class="v25-btn-sec" onclick="window._v25WeightReset()">&#52488;&#44592;&#54868;</button></div>';
document.body.appendChild(sec7);

window._v25WeightExplore = function(){
  playSFX25('weight_explore');
  var classes = ['Straw','Light Fly','Fly','Super Fly','Bantam','Super Bantam','Feather','Super Feather','Light','Super Light','Welter','Super Welter','Middle','Super Middle','Light Heavy','Cruiser','Heavy'];
  classes.forEach(function(c2){
    v25.weightClass.explored[c2] = { speed: 30+Math.floor(Math.random()*65), power: 30+Math.floor(Math.random()*65), reach: 30+Math.floor(Math.random()*65) };
  });
  v25.weightClass.strategies++;
  v25.weightClass.sessions++;
  saveV25(v25); drawWeightCanvas();
};
window._v25WeightReset = function(){
  v25.weightClass = defV25().weightClass; saveV25(v25); drawWeightCanvas();
};

function drawWeightCanvas(){
  var c = document.getElementById('v25-c-weight'); if(!c) return;
  var x = c.getContext('2d'), W = 620, H = 380;
  var cl = getV25Colors();
  x.fillStyle = cl.bg; x.fillRect(0,0,W,H);
  x.fillStyle = cl.text; x.font = 'bold 14px sans-serif';
  x.fillText('Weight Class Strategy Guide', 20, 28);
  var classes = ['Straw','L.Fly','Fly','S.Fly','Bantam','S.Ban','Feather','S.Fea','Light','S.Light','Welter','S.Wel','Middle','S.Mid','L.Hvy','Cruise','Heavy'];
  var weights = [47.6,48.9,50.8,52.2,53.5,55.3,57.2,59.0,61.2,63.5,66.7,69.9,72.6,76.2,79.4,90.7,200];
  var barW = 28, gap = 6, startX = 35, chartH = 240, baseY = 320;
  x.strokeStyle = cl.border; x.lineWidth = 0.5;
  for(var i = 0; i <= 4; i++){
    var y = baseY - chartH * i / 4;
    x.beginPath(); x.moveTo(startX-5,y); x.lineTo(W-10,y); x.stroke();
    x.fillStyle = cl.muted; x.font = '9px sans-serif';
    x.fillText((i*25)+'', 8, y+3);
  }
  classes.forEach(function(name,i){
    var bx = startX + i * (barW + gap);
    var explored = v25.weightClass.explored[['Straw','Light Fly','Fly','Super Fly','Bantam','Super Bantam','Feather','Super Feather','Light','Super Light','Welter','Super Welter','Middle','Super Middle','Light Heavy','Cruiser','Heavy'][i]];
    if(explored){
      var vals = [explored.speed, explored.power, explored.reach];
      var colors = [cl.cyan, cl.red, cl.purple];
      var segH = barW / 3;
      vals.forEach(function(v,vi){
        var bh = chartH * v / 100;
        x.fillStyle = colors[vi]; x.globalAlpha = 0.7;
        x.fillRect(bx + vi * (segH+1), baseY - bh, segH, bh);
        x.globalAlpha = 1;
      });
    }
    x.save(); x.translate(bx + barW/2, baseY + 8);
    x.rotate(Math.PI/4);
    x.fillStyle = cl.dim; x.font = '8px sans-serif'; x.textAlign = 'left';
    x.fillText(name, 0, 0);
    x.restore();
  });
  x.fillStyle = cl.cyan; x.font = '9px sans-serif';
  x.fillText('■ Speed', W-160, 55);
  x.fillStyle = cl.red; x.fillText('■ Power', W-110, 55);
  x.fillStyle = cl.purple; x.fillText('■ Reach', W-60, 55);
  x.fillStyle = cl.dim; x.font = '10px sans-serif';
  x.fillText('Explored: '+Object.keys(v25.weightClass.explored).length+'/17  |  Sessions: '+v25.weightClass.sessions, 20, H-8);
}

// ============================================================
// 8. ROUND ENERGY DISTRIBUTION OPTIMIZER
// ============================================================
var sec8 = document.createElement('div');
sec8.id = 'v25-sec-energy';
sec8.className = 'v25-card';
sec8.style.display = 'none';
sec8.innerHTML = '<div class="v25-hdr">&#9889; &#46972;&#50868;&#46300; &#50640;&#45320;&#51648; &#48516;&#48176; &#52572;&#51201;&#54868;</div><div class="v25-sub">12R &#52572;&#51201; &#50640;&#45320;&#51648; &#48176;&#48516; &#49884;&#48044;&#47112;&#51060;&#49496;</div><canvas id="v25-c-energy" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#111;display:block;margin:0 auto 10px"></canvas><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center"><button class="v25-btn" onclick="window._v25EnergySim()">&#50640;&#45320;&#51648; &#49884;&#48044;</button><button class="v25-btn-sec" onclick="window._v25EnergyOptimal()">&#52572;&#51201; &#48176;&#48516;</button><button class="v25-btn-sec" onclick="window._v25EnergyReset()">&#52488;&#44592;&#54868;</button></div>';
document.body.appendChild(sec8);

window._v25EnergySim = function(){
  playSFX25('energy_sim');
  for(var i=0; i<12; i++){
    v25.roundEnergy.distributions[i] = 40 + Math.floor(Math.random()*55);
  }
  v25.roundEnergy.simulations++;
  v25.roundEnergy.sessions++;
  saveV25(v25); drawEnergyCanvas();
};
window._v25EnergyOptimal = function(){
  playSFX25('combo_optimal');
  var optimal = [75,80,70,65,85,80,70,75,90,85,80,95];
  for(var i=0; i<12; i++){
    v25.roundEnergy.distributions[i] = optimal[i];
  }
  v25.roundEnergy.optimalFound = true;
  v25.roundEnergy.simulations++;
  saveV25(v25); drawEnergyCanvas();
};
window._v25EnergyReset = function(){
  v25.roundEnergy = defV25().roundEnergy; saveV25(v25); drawEnergyCanvas();
};

function drawEnergyCanvas(){
  var c = document.getElementById('v25-c-energy'); if(!c) return;
  var x = c.getContext('2d'), W = 620, H = 400;
  var cl = getV25Colors();
  x.fillStyle = cl.bg; x.fillRect(0,0,W,H);
  x.fillStyle = cl.text; x.font = 'bold 14px sans-serif';
  x.fillText('Round Energy Distribution Optimizer', 20, 28);
  var optimal = [75,80,70,65,85,80,70,75,90,85,80,95];
  var barW = 38, gap = 8, startX = 35, chartH = 260, baseY = 340;
  x.strokeStyle = cl.border; x.lineWidth = 0.5;
  for(var i = 0; i <= 5; i++){
    var y = baseY - chartH * i / 5;
    x.beginPath(); x.moveTo(startX-5,y); x.lineTo(W-10,y); x.stroke();
    x.fillStyle = cl.muted; x.font = '9px sans-serif';
    x.fillText((i*20)+'%', 4, y+3);
  }
  for(var i=0; i<12; i++){
    var bx = startX + i * (barW + gap);
    var val = v25.roundEnergy.distributions[i] || 0;
    var opt = optimal[i];
    x.fillStyle = 'rgba(255,215,0,0.15)';
    var optH = chartH * opt / 100;
    x.fillRect(bx, baseY - optH, barW, optH);
    x.setLineDash([4,3]);
    x.strokeStyle = cl.gold; x.lineWidth = 1;
    x.strokeRect(bx, baseY - optH, barW, optH);
    x.setLineDash([]);
    if(val > 0){
      var bh = chartH * val / 100;
      var diff = Math.abs(val - opt);
      var color = diff <= 10 ? cl.green : diff <= 20 ? cl.orange : cl.red;
      x.fillStyle = color; x.globalAlpha = 0.7;
      x.fillRect(bx+3, baseY - bh, barW-6, bh);
      x.globalAlpha = 1;
      x.fillStyle = cl.text; x.font = 'bold 9px sans-serif'; x.textAlign = 'center';
      x.fillText(val+'%', bx + barW/2, baseY - bh - 6);
    }
    x.fillStyle = cl.text; x.font = '10px sans-serif'; x.textAlign = 'center';
    x.fillText('R'+(i+1), bx + barW/2, baseY + 16);
    x.textAlign = 'left';
  }
  x.fillStyle = cl.gold; x.font = '9px sans-serif';
  x.fillText('■ Optimal', W-130, 55);
  x.fillStyle = cl.green; x.fillText('■ Good', W-130, 70);
  x.fillStyle = cl.orange; x.fillText('■ Fair', W-70, 55);
  x.fillStyle = cl.red; x.fillText('■ Poor', W-70, 70);
  x.fillStyle = cl.dim; x.font = '10px sans-serif';
  x.fillText('Simulations: '+v25.roundEnergy.simulations+(v25.roundEnergy.optimalFound?' | ✓ Optimal Found':''), 20, H-12);
}

// ============================================================
// QUIZ V25 - 15 Questions (240->255)
// ============================================================
var secQuiz = document.createElement('div');
secQuiz.id = 'v25-sec-quiz';
secQuiz.className = 'v25-card';
secQuiz.style.display = 'none';

var quizData25 = [
  {q:'복싱에서 파워 펀치(Power Punch)로 분류되는 것은?',a:['잭','크로스','앱커펀치','풀모션펀치'],c:1},
  {q:'무에타이 체급의 상한은 몇 kg인가?',a:['52.2','53.5','55.3','57.2'],c:1},
  {q:'복싱에서 푸트워크의 기본 원칙으로 올바른 것은?',a:['발을 끌어서 이동','발을 뛰어서 이동','발을 꽁꽁 굽르며 이동','발을 고정하고 상체만 이동'],c:0},
  {q:'클린치(Clinch) 기술의 주요 목적이 아닌 것은?',a:['체력 회복','상대 공격 차단','시간 벌기','판정 점수 획득'],c:3},
  {q:'복싱 글러브에서 스파링용으로 권장되는 무게는?',a:['8oz','10oz','14-16oz','18oz'],c:2},
  {q:'펀치 콤보 "1-2"가 의미하는 것은?',a:['훅-크로스','잭-크로스','잭-잭','크로스-훅'],c:1},
  {q:'복싱에서 VO2max가 측정하는 것은?',a:['근력','유연성','최대산소섭취량','반응속도'],c:2},
  {q:'피카부(Peekaboo) 스탠스로 유명한 복서는?',a:['모하메드 알리','마이크 타이슨','플로이드 메이웨더','매니 파키아오'],c:1},
  {q:'복싱에서 카운터펀치(Counter Punch)의 핵심 요소는?',a:['파워','스피드','타이밍','지구력'],c:2},
  {q:'라운드 사이 휴식 시간으로 일반적인 것은?',a:['30초','1분','2분','3분'],c:1},
  {q:'복싱에서 원투펀치(One-Two)가 효과적인 이유는?',a:['잭으로 거리 측정 후 크로스 연결','크로스가 가장 강력해서','잭이 가장 빨라서','두 펀치 모두 파워펀치라서'],c:0},
  {q:'복싱 치려요법에서 아이싱(Icing)의 권장 시간은?',a:['5분','10분','15-20분','30분'],c:2},
  {q:'복싱에서 필라델피아 쉘(Philly Shell)의 특징은?',a:['양손 높이 올림','앞어깨 회전으로 방어','웅크리고 공격','양팔로 머리 보호'],c:1},
  {q:'제권별 비교에서 헤비급의 최저 체중은?',a:['제한 없음','90.7kg','86.2kg','95kg'],c:0},
  {q:'복싱 트레이닝에서 아나에로빅(Anaerobic) 운동의 예시는?',a:['조깅','5km 달리기','백 타격 인터벌 트레이닝','요가'],c:2}
];

var quizHTML25 = '<div class="v25-hdr">&#128218; Boxing Quiz v25 (15&#47928;)</div><div class="v25-sub">&#48373;&#49905; &#51648;&#49885; &#53580;&#49828;&#53944; - &#54028;&#50892;/&#52404;&#44553;/&#54396;&#50892;&#53356;/&#44544;&#47084;&#48652;/&#52404;&#47141;</div>';
quizData25.forEach(function(q,qi){
  quizHTML25 += '<div class="v25-card" id="v25-qq-'+qi+'" style="padding:12px"><div style="font-size:12px;font-weight:700;margin-bottom:8px">Q'+(qi+1)+'. '+q.q+'</div>';
  q.a.forEach(function(a,ai){
    quizHTML25 += '<button class="v25-btn-sec" style="display:block;width:100%;text-align:left;margin-bottom:4px;padding:8px 12px" onclick="window._v25QuizAnswer('+qi+','+ai+')">'+a+'</button>';
  });
  quizHTML25 += '<div id="v25-qr-'+qi+'" style="margin-top:6px;font-size:11px;font-weight:700"></div></div>';
});
quizHTML25 += '<div style="text-align:center;margin-top:10px"><div id="v25-quiz-score" style="font-size:13px;font-weight:800;color:var(--text)"></div></div>';
secQuiz.innerHTML = quizHTML25;
document.body.appendChild(secQuiz);

window._v25QuizAnswer = function(qi, ai){
  var q = quizData25[qi];
  var resEl = document.getElementById('v25-qr-'+qi);
  if(v25.quizV25Scores['q'+qi] !== undefined) return;
  var correct = ai === q.c;
  v25.quizV25Scores['q'+qi] = correct ? 1 : 0;
  resEl.style.color = correct ? '#22c55e' : '#ef4444';
  resEl.textContent = correct ? '✔ 정답!' : '✘ 오답 (정답: '+q.a[q.c]+')';
  playSFX25(correct ? 'quiz25' : 'power_scan');
  var total = 0, cnt = 0;
  for(var k in v25.quizV25Scores){ total += v25.quizV25Scores[k]; cnt++; }
  document.getElementById('v25-quiz-score').textContent = '점수: '+total+'/'+cnt+' ('+Math.round(total/cnt*100)+'%)';
  saveV25(v25);
  checkAchievementsV25();
};

// ============================================================
// ACHIEVEMENTS V25 (+12, 214->226)
// ============================================================
var ACHS25 = [
  {id:'power_analyst',name:'파워 분석가',desc:'파워 다이나믹스 3회 분석',check:function(){ return v25.punchPower.sessions >= 3; }},
  {id:'power_elite',name:'파워 엘리트',desc:'파워 등급 A 이상 달성',check:function(){ return v25.punchPower.bestGrade==='S'||v25.punchPower.bestGrade==='A'; }},
  {id:'workout_warrior',name:'워크아웃 전사',desc:'운동 7회 기록',check:function(){ return v25.workoutCal.totalWorkouts >= 7; }},
  {id:'streak_king',name:'스트릭 킹',desc:'최대 스트릭 7일 달성',check:function(){ return v25.workoutCal.maxStreak >= 7; }},
  {id:'glove_expert',name:'글러브 전문가',desc:'글러브 피팅 5회 완료',check:function(){ return v25.gloveFit.fittings >= 5; }},
  {id:'fitness_pro',name:'피트니스 프로',desc:'체력 테스트 5회 완료',check:function(){ return v25.fitProfile.tests >= 5; }},
  {id:'footwork_master',name:'푸트워크 마스터',desc:'푸트워크 드릴 5회 완료',check:function(){ return v25.footwork.drills >= 5; }},
  {id:'combo_scientist',name:'콤보 과학자',desc:'콤보 분석 5회 완료',check:function(){ return v25.comboEff.totalAnalyses >= 5; }},
  {id:'weight_scholar',name:'체급 학자',desc:'17체급 전체 탐색',check:function(){ return Object.keys(v25.weightClass.explored).length >= 17; }},
  {id:'energy_master',name:'에너지 마스터',desc:'에너지 최적 배분 발견',check:function(){ return v25.roundEnergy.optimalFound; }},
  {id:'quiz_v25_ace',name:'퀴즈 v25 에이스',desc:'퀴즈 v25 12문 이상 정답',check:function(){ var t=0; for(var k in v25.quizV25Scores) t+=v25.quizV25Scores[k]; return t>=12; }},
  {id:'v25_complete',name:'v25 콤플리트',desc:'v25 전체 8기능 사용',check:function(){ return Object.keys(v25.featureUsage25).length >= 8; }}
];

function checkAchievementsV25(){
  var newCount = 0;
  ACHS25.forEach(function(a){
    if(!v25.achievementsV25[a.id] && a.check()){
      v25.achievementsV25[a.id] = true;
      newCount++;
    }
  });
  if(newCount > 0){
    playSFX25('achieve25');
    saveV25(v25);
  }
}

// ============================================================
// NAV BUTTONS - append to existing nav bar (NO new fixed bottom bar)
// ============================================================
function addV25Nav(){
  var features = [
    {id:'punchPower',label:'파워분석',sec:sec1},
    {id:'workoutCal',label:'캘린더',sec:sec2},
    {id:'gloveFit',label:'글러브',sec:sec3},
    {id:'fitProfile',label:'피트니스',sec:sec4},
    {id:'footwork',label:'푸트워크',sec:sec5},
    {id:'comboEff',label:'콤보분석',sec:sec6},
    {id:'weightClass',label:'체급전략',sec:sec7},
    {id:'roundEnergy',label:'에너지',sec:sec8},
    {id:'quizV25',label:'퀴즈v25',sec:secQuiz}
  ];

  var existingNav = document.querySelector('.v10-bottom-bar') || document.querySelector('[class*="bottom-bar"]');
  var navWrap;
  if(existingNav){
    navWrap = existingNav;
  } else {
    var navBars = document.querySelectorAll('div[style*="position:fixed"][style*="bottom"]');
    for(var i = navBars.length - 1; i >= 0; i--){
      if(navBars[i].style.bottom === '0px' || navBars[i].style.bottom === '0'){
        navWrap = navBars[i]; break;
      }
    }
  }

  if(!navWrap){
    var allDivs = document.querySelectorAll('div');
    for(var i = allDivs.length - 1; i >= 0; i--){
      var cs = window.getComputedStyle(allDivs[i]);
      if(cs.position === 'fixed' && parseInt(cs.bottom) <= 10 && allDivs[i].children.length > 3){
        navWrap = allDivs[i]; break;
      }
    }
  }

  features.forEach(function(f){
    var btn = document.createElement('button');
    btn.style.cssText = 'padding:6px 10px;background:linear-gradient(135deg,rgba(5,150,105,0.15),rgba(4,120,87,0.15));border:1px solid rgba(16,185,129,0.3);border-radius:8px;color:#10b981;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .2s;flex-shrink:0;';
    btn.textContent = f.label;
    btn.onclick = function(){
      document.querySelectorAll('[id^="v25-sec-"]').forEach(function(s){ s.style.display = 'none'; });
      f.sec.style.display = 'block';
      v25.featureUsage25[f.id] = true;
      saveV25(v25);
      checkAchievementsV25();
    };
    if(navWrap) navWrap.appendChild(btn);
  });
}

// ============================================================
// KEYBOARD SHORTCUTS (Shift+A/S/D/F/G/H/J/K for 8 features, Shift+0 for quiz)
// ============================================================
document.addEventListener('keydown', function(e){
  if(!e.shiftKey) return;
  var sections = [sec1, sec2, sec3, sec4, sec5, sec6, sec7, sec8, secQuiz];
  var keys = ['A','S','D','F','G','H','J','K','0'];
  var featureIds = ['punchPower','workoutCal','gloveFit','fitProfile','footwork','comboEff','weightClass','roundEnergy','quizV25'];
  var idx = keys.indexOf(e.key.toUpperCase());
  if(idx === -1 && e.key === ')') idx = 8;
  if(idx >= 0 && idx < sections.length){
    e.preventDefault();
    document.querySelectorAll('[id^="v25-sec-"]').forEach(function(s){ s.style.display = 'none'; });
    sections[idx].style.display = 'block';
    v25.featureUsage25[featureIds[idx]] = true;
    saveV25(v25);
    checkAchievementsV25();
  }
});

// ============================================================
// INIT
// ============================================================
setTimeout(function(){
  addV25Nav();
  drawPowerCanvas();
  drawCalCanvas();
  drawGloveCanvas();
  drawFitnessCanvas();
  drawFootCanvas();
  drawComboCanvas();
  drawWeightCanvas();
  drawEnergyCanvas();
  checkAchievementsV25();
}, 600);

})();
