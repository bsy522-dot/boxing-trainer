// Boxing Trainer Pro v23_patch.js - NEXTERA+PRISM Auto Enhancement Module
// 1. Shadow Boxing Combo Visualizer Canvas 620x380 - 12 combo sequences animated flow diagram + drill timer
// 2. Power Punch Force Curve Canvas 600x380 - 7 punch force-time curve overlay + peak force comparison
// 3. Ring Movement Heatmap Canvas 620x400 - 8x8 ring zone position tracking + footwork pattern replay
// 4. Round Strategy Planner Canvas 600x380 - 12R tactical timeline + energy/aggression dual axis
// 5. Punch Accuracy Zone Canvas 580x380 - body silhouette 9-zone accuracy heatmap + precision drill
// 6. Cardio VO2max Zone Canvas 580x360 - 5 HR zones donut + session calorie burn line chart
// 7. Head Movement Drill Canvas 600x380 - slip/roll/duck 6-pattern sequence trainer + reaction grade
// 8. Fight IQ Scenario Trainer Canvas 620x380 - 15 tactical scenarios branching decision tree + IQ score
// Quiz +15 (210->225), +12 Achievements (190->202), SFX 14, Keyboard +8
(function(){
'use strict';

var V23KEY = 'boxingV23Patch';

function loadV23(){
  try {
    var r = localStorage.getItem(V23KEY);
    if(!r) return defV23();
    var p = JSON.parse(r), d = defV23();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV23(); }
}
function saveV23(d){ try { localStorage.setItem(V23KEY, JSON.stringify(d)); } catch(e){} }
function defV23(){
  return {
    shadowCombo: { sequences: [], drillTime: 0, combosCompleted: 0, bestComboTime: 9999 },
    powerCurve: { punches: {jab:0,cross:0,hook:0,uppercut:0,bodyHook:0,leadUpper:0,overhand:0}, peakForces: [], sessions: 0 },
    ringMovement: { zones: Array(64).fill(0), patterns: [], totalMoves: 0, sessions: 0 },
    roundStrategy: { plans: [], roundScores: Array(12).fill(0), aggressionLog: [], energyLog: [] },
    punchAccuracy: { zones: {head_l:0,head_c:0,head_r:0,body_l:0,body_c:0,body_r:0,low_l:0,low_c:0,low_r:0}, totalShots: 0, drillSessions: 0 },
    cardioVO2: { sessions: [], zones: [0,0,0,0,0], totalCalories: 0, estimatedVO2max: 40 },
    headMovement: { drills: [], patterns: {slip_l:0,slip_r:0,roll_l:0,roll_r:0,duck:0,pullBack:0}, bestGrade: 'D', sessions: 0 },
    fightIQ: { scenarios: {}, totalCorrect: 0, totalAttempts: 0, iqScore: 0, streaks: 0 },
    quizV23Scores: {},
    achievementsV23: {},
    featureUsage23: {}
  };
}

var v23 = loadV23();

// ===== CSS =====
var st23 = document.createElement('style');
st23.textContent = '.v23-btn{padding:8px 16px;background:linear-gradient(135deg,#dc2626,#991b1b);border:none;border-radius:10px;color:#fff;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s}.v23-btn:hover{filter:brightness(1.15);transform:scale(1.03)}.v23-btn-sec{padding:8px 16px;background:var(--surface,rgba(255,255,255,0.04));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:10px;color:var(--text-dim,#8a8a9e);font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.v23-btn-sec:hover{border-color:#dc2626;color:#dc2626}.v23-card{background:var(--glass,rgba(255,255,255,0.06));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:var(--radius,16px);padding:16px;margin-bottom:12px}.v23-hdr{font-size:15px;font-weight:800;margin-bottom:10px;display:flex;align-items:center;gap:8px}.v23-sub{font-size:11px;color:var(--text-dim,#8a8a9e);margin-bottom:8px}';
document.head.appendChild(st23);

// ===== SFX ENGINE V23 =====
function playSFX23(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'combo_start':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='square';o.frequency.setValueAtTime(330,t);o.frequency.exponentialRampToValueAtTime(660,t+0.08);
        g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.1);break;
      case 'combo_hit':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sawtooth';o.frequency.setValueAtTime(440,t);o.frequency.exponentialRampToValueAtTime(220,t+0.05);
        g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.06);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.06);break;
      case 'power_impact':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(80,t);o.frequency.exponentialRampToValueAtTime(40,t+0.15);
        g.gain.setValueAtTime(0.15,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.2);break;
      case 'ring_step':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='triangle';o.frequency.setValueAtTime(200,t);o.frequency.linearRampToValueAtTime(180,t+0.04);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.05);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.05);break;
      case 'strategy_plan':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(523,t);o.frequency.setValueAtTime(659,t+0.08);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.12);break;
      case 'accuracy_hit':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(880,t);g.gain.setValueAtTime(0.1,t);
        g.gain.exponentialRampToValueAtTime(0.001,t+0.07);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.07);break;
      case 'accuracy_miss':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sawtooth';o.frequency.setValueAtTime(200,t);o.frequency.linearRampToValueAtTime(100,t+0.1);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.12);break;
      case 'cardio_zone':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(392,t);o.frequency.setValueAtTime(494,t+0.06);o.frequency.setValueAtTime(588,t+0.12);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.18);break;
      case 'head_dodge':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='triangle';o.frequency.setValueAtTime(600,t);o.frequency.exponentialRampToValueAtTime(300,t+0.06);
        g.gain.setValueAtTime(0.09,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.08);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.08);break;
      case 'head_hit':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sawtooth';o.frequency.setValueAtTime(100,t);
        g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.15);break;
      case 'iq_correct':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(523,t);o.frequency.setValueAtTime(784,t+0.1);
        g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.2);break;
      case 'iq_wrong':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='square';o.frequency.setValueAtTime(200,t);o.frequency.linearRampToValueAtTime(150,t+0.15);
        g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.18);break;
      case 'quiz_v23':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(660,t);o.frequency.setValueAtTime(880,t+0.08);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.15);break;
      case 'achieve_v23':
        var o1=ctx.createOscillator(),o2=ctx.createOscillator(),g=ctx.createGain();
        o1.type='sine';o1.frequency.setValueAtTime(523,t);o1.frequency.setValueAtTime(659,t+0.1);o1.frequency.setValueAtTime(784,t+0.2);
        o2.type='triangle';o2.frequency.setValueAtTime(1047,t+0.15);
        g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.35);
        o1.connect(g);o2.connect(g);g.connect(ctx.destination);o1.start(t);o2.start(t+0.15);o1.stop(t+0.35);o2.stop(t+0.35);break;
    }
    setTimeout(function(){ctx.close();},500);
  } catch(e){}
}

// ===== GRADE UTILITY =====
function gradeV23(pct){
  if(pct >= 95) return {g:'S',c:'#FFD700'};
  if(pct >= 85) return {g:'A',c:'#22c55e'};
  if(pct >= 70) return {g:'B',c:'#3b82f6'};
  if(pct >= 50) return {g:'C',c:'#f97316'};
  return {g:'D',c:'#ef4444'};
}

// ===== CANVAS HELPERS =====
function clearCanvas23(canvas, ctx){
  var isDark = !document.documentElement.getAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.fillStyle = isDark ? '#1a1a2e' : '#f8f8fc';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 1;
  ctx.strokeRect(2,2,canvas.width-4,canvas.height-4);
  return isDark;
}
function textColor23(isDark){ return isDark ? '#f0f0f0' : '#1a1a2e'; }
function dimColor23(isDark){ return isDark ? '#8a8a9e' : '#666'; }

// ============================================================
// 1. SHADOW BOXING COMBO VISUALIZER (Canvas 620x380)
// ============================================================
var COMBOS = [
  { name: 'Basic Jab-Cross', seq: ['Jab','Cross'], level: 1 },
  { name: 'Classic 1-2-3', seq: ['Jab','Cross','L.Hook'], level: 1 },
  { name: 'Body Breaker', seq: ['Jab','Cross','B.Hook','Cross'], level: 2 },
  { name: 'Uppercut Finish', seq: ['Jab','Cross','L.Hook','R.Upper'], level: 2 },
  { name: 'Double Jab Power', seq: ['Jab','Jab','Cross','L.Hook'], level: 2 },
  { name: 'Philly Shell', seq: ['Slip','Cross','L.Hook','R.Upper'], level: 3 },
  { name: 'Mexican Style', seq: ['Jab','B.Hook','Cross','L.Hook','R.Upper'], level: 3 },
  { name: 'Peek-a-Boo Rush', seq: ['Slip','Jab','Cross','Duck','R.Upper','L.Hook'], level: 4 },
  { name: 'Ali Shuffle', seq: ['Jab','Jab','Cross','Step','L.Hook','Cross','B.Hook'], level: 4 },
  { name: 'Tyson Fury Flow', seq: ['Feint','Jab','Cross','Roll','L.Hook','R.Upper','B.Hook','Cross'], level: 5 },
  { name: 'Sugar Ray Special', seq: ['Jab','Jab','Slip','Cross','L.Hook','Duck','R.Upper','L.Hook','Cross'], level: 5 },
  { name: 'Champion Combo', seq: ['Feint','Jab','Cross','Slip','L.Hook','B.Hook','R.Upper','Cross','L.Hook','R.Upper'], level: 5 }
];
var PUNCH_COLORS = {Jab:'#3b82f6',Cross:'#ef4444','L.Hook':'#22c55e','R.Upper':'#f97316','B.Hook':'#a855f7',Slip:'#06b6d4',Duck:'#eab308',Roll:'#ec4899',Feint:'#6366f1',Step:'#14b8a6','R.Upper':'#f97316','L.Hook':'#22c55e'};

function drawShadowCombo(canvas, ctx){
  var dark = clearCanvas23(canvas, ctx);
  var tc = textColor23(dark), dc = dimColor23(dark);
  ctx.fillStyle = tc; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('\u{1F94A} Shadow Boxing Combo Visualizer', 16, 28);

  var sel = v23.shadowCombo.combosCompleted % COMBOS.length;
  var combo = COMBOS[sel];
  ctx.fillStyle = dc; ctx.font = '11px sans-serif';
  ctx.fillText('Current: ' + combo.name + ' (Lv.' + combo.level + ')', 16, 48);
  ctx.fillText('Completed: ' + v23.shadowCombo.combosCompleted + ' | Best Time: ' + (v23.shadowCombo.bestComboTime < 9999 ? (v23.shadowCombo.bestComboTime/1000).toFixed(1)+'s' : '--'), 16, 64);

  var seq = combo.seq;
  var startX = 30, y = 130, nodeW = 52, nodeH = 30, gap = 8;
  var totalW = seq.length * (nodeW + gap) - gap;
  startX = Math.max(16, (canvas.width - totalW) / 2);

  for(var i = 0; i < seq.length; i++){
    var x = startX + i * (nodeW + gap);
    var col = PUNCH_COLORS[seq[i]] || '#888';
    ctx.fillStyle = col + '33';
    ctx.beginPath(); ctx.roundRect(x, y - nodeH/2, nodeW, nodeH, 8); ctx.fill();
    ctx.strokeStyle = col; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(x, y - nodeH/2, nodeW, nodeH, 8); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(seq[i], x + nodeW/2, y + 4);
    ctx.fillStyle = dc; ctx.font = '9px sans-serif';
    ctx.fillText((i+1), x + nodeW/2, y + nodeH/2 + 14);
    if(i < seq.length - 1){
      ctx.strokeStyle = col; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + nodeW, y);
      ctx.lineTo(x + nodeW + gap, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + nodeW + gap - 4, y - 3);
      ctx.lineTo(x + nodeW + gap, y);
      ctx.lineTo(x + nodeW + gap - 4, y + 3);
      ctx.fill();
    }
  }
  ctx.textAlign = 'left';

  // Combo difficulty bar chart (all 12 combos)
  var barW = Math.floor((canvas.width - 80) / COMBOS.length);
  var barY = 220, barMaxH = 100;
  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('All Combos (difficulty)', 16, barY - 10);

  for(var i = 0; i < COMBOS.length; i++){
    var bx = 30 + i * barW;
    var h = (COMBOS[i].level / 5) * barMaxH;
    var lvColors = ['#22c55e','#3b82f6','#f97316','#ef4444','#dc2626'];
    ctx.fillStyle = lvColors[COMBOS[i].level - 1] + '99';
    ctx.fillRect(bx, barY + barMaxH - h, barW - 4, h);
    if(i === sel){
      ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2;
      ctx.strokeRect(bx - 1, barY + barMaxH - h - 1, barW - 2, h + 2);
    }
    ctx.fillStyle = dc; ctx.font = '8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('C'+(i+1), bx + (barW-4)/2, barY + barMaxH + 12);
  }
  ctx.textAlign = 'left';

  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Drill Time: ' + Math.floor(v23.shadowCombo.drillTime/60) + 'm ' + (v23.shadowCombo.drillTime%60) + 's', 16, barY + barMaxH + 32);
}

// ============================================================
// 2. POWER PUNCH FORCE CURVE (Canvas 600x380)
// ============================================================
var FORCE_PUNCHES = ['Jab','Cross','Hook','Uppercut','Body Hook','Lead Upper','Overhand'];
var FORCE_BASE = [350,650,800,700,750,600,900];
var FORCE_TIME = [0.08,0.12,0.15,0.14,0.13,0.11,0.18];

function drawPowerCurve(canvas, ctx){
  var dark = clearCanvas23(canvas, ctx);
  var tc = textColor23(dark), dc = dimColor23(dark);
  ctx.fillStyle = tc; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('\u{1F4AA} Power Punch Force Curve', 16, 28);

  var forces = v23.powerCurve.punches;
  var labels = FORCE_PUNCHES;
  var colors = ['#3b82f6','#ef4444','#22c55e','#f97316','#a855f7','#06b6d4','#eab308'];

  // Force-time curves
  var cLeft = 70, cTop = 55, cW = canvas.width - 100, cH = 200;
  ctx.strokeStyle = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'; ctx.lineWidth = 1;
  for(var i = 0; i <= 4; i++){
    var gy = cTop + (cH / 4) * i;
    ctx.beginPath(); ctx.moveTo(cLeft, gy); ctx.lineTo(cLeft + cW, gy); ctx.stroke();
    ctx.fillStyle = dc; ctx.font = '9px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText((1000 - i * 250) + 'N', cLeft - 5, gy + 3);
  }
  ctx.textAlign = 'left';
  ctx.fillStyle = dc; ctx.font = '9px sans-serif';
  ctx.fillText('Force (N)', cLeft, cTop - 8);
  ctx.fillText('Time (ms)', cLeft + cW - 30, cTop + cH + 18);

  // Draw force curves for each punch type
  for(var p = 0; p < labels.length; p++){
    var baseF = FORCE_BASE[p] + (forces[labels[p].toLowerCase().replace(/ /g,'')] || 0) * 5;
    var dur = FORCE_TIME[p];
    var pts = 30;
    ctx.strokeStyle = colors[p]; ctx.lineWidth = 2;
    ctx.beginPath();
    for(var i = 0; i <= pts; i++){
      var t = i / pts;
      var force = baseF * Math.sin(Math.PI * t) * (1 - 0.3 * Math.pow(t - 0.4, 2));
      var x = cLeft + (t * dur / 0.2) * cW;
      var y = cTop + cH - (force / 1000) * cH;
      if(x > cLeft + cW) break;
      if(i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Legend
  var legY = cTop + cH + 35;
  for(var i = 0; i < labels.length; i++){
    var lx = 20 + (i % 4) * 145;
    var ly = legY + Math.floor(i / 4) * 18;
    ctx.fillStyle = colors[i];
    ctx.fillRect(lx, ly - 6, 10, 10);
    ctx.fillStyle = dc; ctx.font = '10px sans-serif';
    ctx.fillText(labels[i] + ': ' + (FORCE_BASE[i] + (forces[labels[i].toLowerCase().replace(/ /g,'')] || 0) * 5) + 'N', lx + 14, ly + 3);
  }

  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Sessions: ' + v23.powerCurve.sessions + ' | Peak: ' + Math.max.apply(null, FORCE_BASE.map(function(b,i){ return b + (forces[FORCE_PUNCHES[i].toLowerCase().replace(/ /g,'')] || 0) * 5; })) + 'N', 16, canvas.height - 12);
}

// ============================================================
// 3. RING MOVEMENT HEATMAP (Canvas 620x400)
// ============================================================
function drawRingHeatmap(canvas, ctx){
  var dark = clearCanvas23(canvas, ctx);
  var tc = textColor23(dark), dc = dimColor23(dark);
  ctx.fillStyle = tc; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('\u{1F9ED} Ring Movement Heatmap', 16, 28);

  var gridSize = 8, cellW = 42, cellH = 36;
  var ox = (canvas.width - gridSize * cellW) / 2, oy = 55;

  // Ring outline
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
  ctx.strokeRect(ox - 4, oy - 4, gridSize * cellW + 8, gridSize * cellH + 8);

  // Corner posts
  var posts = [[ox-8,oy-8],[ox+gridSize*cellW,oy-8],[ox-8,oy+gridSize*cellH],[ox+gridSize*cellW,oy+gridSize*cellH]];
  posts.forEach(function(p){ ctx.fillStyle='#ef4444'; ctx.beginPath(); ctx.arc(p[0]+4,p[1]+4,6,0,Math.PI*2); ctx.fill(); });

  // Ropes
  for(var r = 1; r <= 3; r++){
    ctx.strokeStyle = 'rgba(239,68,68,' + (0.2 + r * 0.15) + ')'; ctx.lineWidth = 1;
    ctx.strokeRect(ox - 4 - r * 2, oy - 4 - r * 2, gridSize * cellW + 8 + r * 4, gridSize * cellH + 8 + r * 4);
  }

  var zones = v23.ringMovement.zones;
  var maxZ = Math.max.apply(null, zones) || 1;

  for(var row = 0; row < gridSize; row++){
    for(var col = 0; col < gridSize; col++){
      var idx = row * gridSize + col;
      var val = zones[idx];
      var intensity = val / maxZ;
      var cx = ox + col * cellW, cy = oy + row * cellH;

      if(intensity > 0){
        var r23 = Math.floor(255 * intensity);
        var g23 = Math.floor(100 * (1 - intensity));
        var b23 = Math.floor(50 * (1 - intensity));
        ctx.fillStyle = 'rgba(' + r23 + ',' + g23 + ',' + b23 + ',' + (0.3 + intensity * 0.6) + ')';
      } else {
        ctx.fillStyle = dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)';
      }
      ctx.fillRect(cx + 1, cy + 1, cellW - 2, cellH - 2);

      if(val > 0){
        ctx.fillStyle = intensity > 0.6 ? '#fff' : dc;
        ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(val, cx + cellW/2, cy + cellH/2 + 3);
      }
    }
  }
  ctx.textAlign = 'left';

  // Labels
  ctx.fillStyle = '#ef4444'; ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RED CORNER', ox + gridSize * cellW / 2, oy - 12);
  ctx.fillText('BLUE CORNER', ox + gridSize * cellW / 2, oy + gridSize * cellH + 22);
  ctx.textAlign = 'left';

  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Total Moves: ' + v23.ringMovement.totalMoves + ' | Sessions: ' + v23.ringMovement.sessions, 16, canvas.height - 12);
}

// ============================================================
// 4. ROUND STRATEGY PLANNER (Canvas 600x380)
// ============================================================
function drawRoundStrategy(canvas, ctx){
  var dark = clearCanvas23(canvas, ctx);
  var tc = textColor23(dark), dc = dimColor23(dark);
  ctx.fillStyle = tc; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('\u{1F3AF} Round-by-Round Strategy Planner', 16, 28);

  var rounds = 12;
  var barW = Math.floor((canvas.width - 80) / rounds);
  var chartTop = 60, chartH = 120;

  // Axis
  ctx.strokeStyle = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'; ctx.lineWidth = 1;
  for(var i = 0; i <= 4; i++){
    var gy = chartTop + (chartH / 4) * i;
    ctx.beginPath(); ctx.moveTo(40, gy); ctx.lineTo(canvas.width - 20, gy); ctx.stroke();
  }
  ctx.fillStyle = dc; ctx.font = '9px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('100', 36, chartTop + 3);
  ctx.fillText('50', 36, chartTop + chartH/2 + 3);
  ctx.fillText('0', 36, chartTop + chartH + 3);
  ctx.textAlign = 'left';

  var scores = v23.roundStrategy.roundScores;
  var tactics = ['Jab & Move','Pressure','Counter','Clinch','Body Work','Head Hunt'];
  var tacColors = ['#3b82f6','#ef4444','#22c55e','#f97316','#a855f7','#eab308'];

  // Energy line (green) + Aggression line (red)
  var energy = [], aggression = [];
  for(var r = 0; r < rounds; r++){
    energy.push(scores[r] > 0 ? Math.max(20, 100 - r * 5 - Math.random() * 10) : 100 - r * 6);
    aggression.push(scores[r] > 0 ? scores[r] : 40 + Math.sin(r * 0.8) * 20);
  }

  // Energy line
  ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2;
  ctx.beginPath();
  for(var r = 0; r < rounds; r++){
    var x = 50 + r * barW + barW / 2;
    var y = chartTop + chartH - (energy[r] / 100) * chartH;
    if(r === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Aggression line
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
  ctx.beginPath();
  for(var r = 0; r < rounds; r++){
    var x = 50 + r * barW + barW / 2;
    var y = chartTop + chartH - (aggression[r] / 100) * chartH;
    if(r === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Round labels
  for(var r = 0; r < rounds; r++){
    var x = 50 + r * barW;
    ctx.fillStyle = dc; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('R' + (r+1), x + barW/2, chartTop + chartH + 16);

    // Tactic indicator
    var tIdx = r % tactics.length;
    ctx.fillStyle = tacColors[tIdx] + '66';
    ctx.fillRect(x + 2, chartTop + chartH + 22, barW - 4, 12);
    ctx.fillStyle = tacColors[tIdx]; ctx.font = '7px sans-serif';
    ctx.fillText(tactics[tIdx].substring(0,6), x + barW/2, chartTop + chartH + 31);
  }
  ctx.textAlign = 'left';

  // Legend
  ctx.fillStyle = '#22c55e'; ctx.fillRect(16, chartTop + chartH + 50, 10, 10);
  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Energy', 30, chartTop + chartH + 59);
  ctx.fillStyle = '#ef4444'; ctx.fillRect(90, chartTop + chartH + 50, 10, 10);
  ctx.fillStyle = dc;
  ctx.fillText('Aggression', 104, chartTop + chartH + 59);

  // Tactics legend
  var ty = chartTop + chartH + 72;
  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Tactics:', 16, ty);
  for(var i = 0; i < tactics.length; i++){
    var tx = 70 + i * 88;
    ctx.fillStyle = tacColors[i]; ctx.fillRect(tx, ty - 8, 8, 8);
    ctx.fillStyle = dc; ctx.font = '9px sans-serif';
    ctx.fillText(tactics[i], tx + 12, ty);
  }
}

// ============================================================
// 5. PUNCH ACCURACY ZONE (Canvas 580x380)
// ============================================================
var ZONE_NAMES = ['Head L','Head C','Head R','Body L','Body C','Body R','Low L','Low C','Low R'];

function drawPunchAccuracy(canvas, ctx){
  var dark = clearCanvas23(canvas, ctx);
  var tc = textColor23(dark), dc = dimColor23(dark);
  ctx.fillStyle = tc; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('\u{1F3AF} Punch Accuracy Zone', 16, 28);

  // Body silhouette (simplified)
  var bx = 160, by = 60, bw = 120, bh = 260;

  // Body outline
  ctx.strokeStyle = dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'; ctx.lineWidth = 2;
  // Head circle
  ctx.beginPath(); ctx.arc(bx + bw/2, by + 25, 25, 0, Math.PI * 2); ctx.stroke();
  // Torso
  ctx.beginPath();
  ctx.moveTo(bx + 15, by + 50); ctx.lineTo(bx + bw - 15, by + 50);
  ctx.lineTo(bx + bw - 5, by + 160); ctx.lineTo(bx + 5, by + 160);
  ctx.closePath(); ctx.stroke();
  // Legs
  ctx.beginPath();
  ctx.moveTo(bx + 20, by + 160); ctx.lineTo(bx + 10, by + bh);
  ctx.moveTo(bx + bw - 20, by + 160); ctx.lineTo(bx + bw - 10, by + bh);
  ctx.stroke();

  // 9 zones (3x3 grid over body)
  var zones = v23.punchAccuracy.zones;
  var zKeys = ['head_l','head_c','head_r','body_l','body_c','body_r','low_l','low_c','low_r'];
  var total = v23.punchAccuracy.totalShots || 1;
  var zoneW = bw / 3, zoneH = (bh - 20) / 3;

  for(var r = 0; r < 3; r++){
    for(var c = 0; c < 3; c++){
      var idx = r * 3 + c;
      var val = zones[zKeys[idx]] || 0;
      var pct = (val / total) * 100;
      var intensity = Math.min(1, val / (total * 0.3 + 1));
      var zx = bx + c * zoneW, zy = by + 10 + r * zoneH;

      ctx.fillStyle = 'rgba(239,68,68,' + (0.1 + intensity * 0.6) + ')';
      ctx.fillRect(zx, zy, zoneW - 1, zoneH - 1);

      ctx.fillStyle = intensity > 0.4 ? '#fff' : tc;
      ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(val, zx + zoneW/2, zy + zoneH/2 - 4);
      ctx.fillStyle = dc; ctx.font = '9px sans-serif';
      ctx.fillText(pct.toFixed(0) + '%', zx + zoneW/2, zy + zoneH/2 + 10);
    }
  }
  ctx.textAlign = 'left';

  // Right side: zone accuracy bar chart
  var rx = 320, ry = 60, rw = 230, rh = 240;
  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Zone Distribution', rx, ry - 5);

  for(var i = 0; i < 9; i++){
    var val = zones[zKeys[i]] || 0;
    var pct = (val / total) * 100;
    var barH = 18, barY = ry + 8 + i * (barH + 6);
    var barMaxW = rw - 80;
    var bw2 = (pct / 50) * barMaxW;

    ctx.fillStyle = dc; ctx.font = '9px sans-serif';
    ctx.fillText(ZONE_NAMES[i], rx, barY + 13);
    ctx.fillStyle = i < 3 ? '#ef444466' : (i < 6 ? '#f9731666' : '#3b82f666');
    ctx.fillRect(rx + 55, barY + 2, bw2, barH - 4);
    ctx.fillStyle = i < 3 ? '#ef4444' : (i < 6 ? '#f97316' : '#3b82f6');
    ctx.fillRect(rx + 55, barY + 2, bw2, barH - 4);
    ctx.globalAlpha = 0.5; ctx.fillRect(rx + 55, barY + 2, bw2, barH - 4); ctx.globalAlpha = 1;
    ctx.fillStyle = tc; ctx.font = '9px sans-serif';
    ctx.fillText(val + ' (' + pct.toFixed(1) + '%)', rx + 60 + bw2, barY + 13);
  }

  var totalPct = v23.punchAccuracy.totalShots;
  var gr = gradeV23(zones.head_c ? (zones.head_c / (total||1)) * 300 : 0);
  ctx.fillStyle = gr.c; ctx.font = 'bold 16px sans-serif';
  ctx.fillText('Grade: ' + gr.g, rx, ry + 240);
  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Total Shots: ' + totalPct + ' | Drills: ' + v23.punchAccuracy.drillSessions, 16, canvas.height - 12);
}

// ============================================================
// 6. CARDIO VO2MAX ZONE (Canvas 580x360)
// ============================================================
var CARDIO_ZONES = [
  { name: 'Zone 1 Recovery', pct: '50-60%', color: '#22c55e' },
  { name: 'Zone 2 Aerobic', pct: '60-70%', color: '#3b82f6' },
  { name: 'Zone 3 Tempo', pct: '70-80%', color: '#f97316' },
  { name: 'Zone 4 Threshold', pct: '80-90%', color: '#ef4444' },
  { name: 'Zone 5 VO2max', pct: '90-100%', color: '#dc2626' }
];

function drawCardioVO2(canvas, ctx){
  var dark = clearCanvas23(canvas, ctx);
  var tc = textColor23(dark), dc = dimColor23(dark);
  ctx.fillStyle = tc; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('\u{2764}\u{FE0F} Cardio VO2max Zone Tracker', 16, 28);

  // Donut chart of zone time
  var zones = v23.cardioVO2.zones;
  var totalZ = zones.reduce(function(a,b){return a+b;},0) || 1;
  var cx = 140, cy = 150, r1 = 80, r2 = 50;
  var startA = -Math.PI / 2;

  for(var i = 0; i < 5; i++){
    var sliceAngle = (zones[i] / totalZ) * Math.PI * 2;
    ctx.fillStyle = CARDIO_ZONES[i].color;
    ctx.beginPath();
    ctx.arc(cx, cy, r1, startA, startA + sliceAngle);
    ctx.arc(cx, cy, r2, startA + sliceAngle, startA, true);
    ctx.closePath();
    ctx.fill();
    startA += sliceAngle;
  }

  // Center text
  ctx.fillStyle = tc; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(v23.cardioVO2.estimatedVO2max, cx, cy - 2);
  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('VO2max', cx, cy + 14);
  ctx.textAlign = 'left';

  // Legend
  for(var i = 0; i < 5; i++){
    var ly = 60 + i * 28;
    ctx.fillStyle = CARDIO_ZONES[i].color;
    ctx.fillRect(280, ly, 12, 12);
    ctx.fillStyle = tc; ctx.font = '10px sans-serif';
    ctx.fillText(CARDIO_ZONES[i].name, 298, ly + 10);
    ctx.fillStyle = dc; ctx.font = '9px sans-serif';
    ctx.fillText(CARDIO_ZONES[i].pct + ' HR | ' + zones[i] + 'min', 298, ly + 22);
  }

  // Calorie burn line (last 10 sessions)
  var sessions = v23.cardioVO2.sessions.slice(-10);
  if(sessions.length > 1){
    var lineY = 260, lineH = 60, lineW = canvas.width - 60;
    ctx.fillStyle = dc; ctx.font = '10px sans-serif';
    ctx.fillText('Recent Calorie Burn', 20, lineY - 8);
    var maxCal = Math.max.apply(null, sessions.map(function(s){return s.calories||0;})) || 1;
    ctx.strokeStyle = '#f97316'; ctx.lineWidth = 2;
    ctx.beginPath();
    for(var i = 0; i < sessions.length; i++){
      var x = 30 + (i / (sessions.length - 1)) * lineW;
      var y = lineY + lineH - ((sessions[i].calories||0) / maxCal) * lineH;
      if(i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Total Calories: ' + v23.cardioVO2.totalCalories + ' | Sessions: ' + v23.cardioVO2.sessions.length, 16, canvas.height - 12);
}

// ============================================================
// 7. HEAD MOVEMENT DRILL (Canvas 600x380)
// ============================================================
var HEAD_PATTERNS = [
  { name: 'Slip Left', desc: 'Dodge right-hand punches', key: 'slip_l' },
  { name: 'Slip Right', desc: 'Dodge jabs', key: 'slip_r' },
  { name: 'Roll Left', desc: 'Under hooks from right', key: 'roll_l' },
  { name: 'Roll Right', desc: 'Under hooks from left', key: 'roll_r' },
  { name: 'Duck', desc: 'Under straight punches', key: 'duck' },
  { name: 'Pull Back', desc: 'Away from range', key: 'pullBack' }
];
var HEAD_COLORS = ['#3b82f6','#06b6d4','#22c55e','#10b981','#f97316','#a855f7'];

function drawHeadMovement(canvas, ctx){
  var dark = clearCanvas23(canvas, ctx);
  var tc = textColor23(dark), dc = dimColor23(dark);
  ctx.fillStyle = tc; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('\u{1F9E0} Head Movement Drill Trainer', 16, 28);

  var patterns = v23.headMovement.patterns;
  var total = Object.keys(patterns).reduce(function(s,k){return s + patterns[k];}, 0) || 1;

  // Radar chart for head movement patterns
  var cx = 160, cy = 170, maxR = 100;
  var axes = HEAD_PATTERNS.length;
  var angleStep = (Math.PI * 2) / axes;

  // Grid circles
  for(var r = 1; r <= 4; r++){
    var gr = (r / 4) * maxR;
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, gr, 0, Math.PI * 2); ctx.stroke();
  }

  // Axis lines + labels
  for(var i = 0; i < axes; i++){
    var angle = -Math.PI/2 + i * angleStep;
    var ex = cx + Math.cos(angle) * maxR;
    var ey = cy + Math.sin(angle) * maxR;
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke();

    var lx = cx + Math.cos(angle) * (maxR + 18);
    var ly = cy + Math.sin(angle) * (maxR + 18);
    ctx.fillStyle = HEAD_COLORS[i]; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(HEAD_PATTERNS[i].name, lx, ly + 3);
  }

  // Data polygon
  var maxVal = Math.max.apply(null, HEAD_PATTERNS.map(function(p){return patterns[p.key] || 0;})) || 1;
  ctx.fillStyle = '#ef444433';
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
  ctx.beginPath();
  for(var i = 0; i < axes; i++){
    var angle = -Math.PI/2 + i * angleStep;
    var val = (patterns[HEAD_PATTERNS[i].key] || 0) / maxVal;
    var pr = val * maxR;
    var px = cx + Math.cos(angle) * pr;
    var py = cy + Math.sin(angle) * pr;
    if(i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.textAlign = 'left';

  // Right side: drill descriptions + counts
  var rx = 310;
  for(var i = 0; i < HEAD_PATTERNS.length; i++){
    var dy = 60 + i * 42;
    ctx.fillStyle = HEAD_COLORS[i]; ctx.font = 'bold 11px sans-serif';
    ctx.fillText(HEAD_PATTERNS[i].name, rx, dy);
    ctx.fillStyle = dc; ctx.font = '9px sans-serif';
    ctx.fillText(HEAD_PATTERNS[i].desc, rx, dy + 14);
    var cnt = patterns[HEAD_PATTERNS[i].key] || 0;
    ctx.fillStyle = tc; ctx.font = 'bold 10px sans-serif';
    ctx.fillText(cnt + ' reps', rx + 170, dy);
  }

  var gr = gradeV23((total / (axes * 20)) * 100);
  ctx.fillStyle = gr.c; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Grade: ' + gr.g, 16, canvas.height - 30);
  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Sessions: ' + v23.headMovement.sessions + ' | Total Drills: ' + total, 16, canvas.height - 12);
}

// ============================================================
// 8. FIGHT IQ SCENARIO TRAINER (Canvas 620x380)
// ============================================================
var IQ_SCENARIOS = [
  { q: 'Opponent rushes with wild hooks. Best response?', a: 'Step back and counter with straight right', opts: ['Trade hooks','Step back and counter with straight right','Clinch immediately','Duck and body shot'], correct: 1 },
  { q: 'You are ahead on points in Round 10. Strategy?', a: 'Control distance with jabs', opts: ['Go for KO','Control distance with jabs','Switch southpaw','Stop throwing punches'], correct: 1 },
  { q: 'Opponent keeps stepping to your left. What to throw?', a: 'Right hook to cut off angle', opts: ['Left jab','Right hook to cut off angle','Left uppercut','Step back'], correct: 1 },
  { q: 'Corner says opponent has weak body defense. Plan?', a: 'Double jab to body then hook upstairs', opts: ['Ignore and go headhunting','Double jab to body then hook upstairs','Only throw body shots','Wait for them to open up'], correct: 1 },
  { q: 'You got rocked in Round 3. What do you do?', a: 'Clinch and recover, use ring movement', opts: ['Attack wildly','Clinch and recover, use ring movement','Sit on the ropes','Drop guard to bait'], correct: 1 },
  { q: 'Southpaw opponent. Where to position your lead foot?', a: 'Outside their lead foot', opts: ['Inside their lead foot','Outside their lead foot','Directly in front','Far away'], correct: 1 },
  { q: 'Opponent tires in Round 8. When to increase pressure?', a: 'After landing a jab, cut the ring off', opts: ['Immediately rush in','After landing a jab, cut the ring off','Wait until Round 12','Only counter punch'], correct: 1 },
  { q: 'Referee warns you for low blows. Adjustment?', a: 'Raise target zone to solar plexus', opts: ['Keep punching low','Raise target zone to solar plexus','Only head shots','Stop body work entirely'], correct: 1 },
  { q: 'Opponent has 6-inch reach advantage. Approach?', a: 'Work inside with angles and body shots', opts: ['Stay at range and jab','Work inside with angles and body shots','Only throw overhands','Run away all fight'], correct: 1 },
  { q: 'Last round, you need a KO to win. Strategy?', a: 'Set up power shots with feints and combinations', opts: ['Throw everything wildly','Set up power shots with feints and combinations','Only throw single punches','Give up'], correct: 1 },
  { q: 'Opponent keeps dropping their right hand. Exploit?', a: 'Left hook over the top', opts: ['Right cross','Left hook over the top','Body jab','Feint and wait'], correct: 1 },
  { q: 'Between rounds, corner says your jab is landing clean. Next round?', a: 'Double and triple the jab, set up power shots', opts: ['Stop jabbing','Double and triple the jab, set up power shots','Switch to body shots only','Try new combos'], correct: 1 },
  { q: 'Opponent is a pressure fighter crowding you. Best defense?', a: 'Use angles, pivot off the ropes, and uppercuts', opts: ['Stand and trade','Use angles, pivot off the ropes, and uppercuts','Only clinch','Back up in a straight line'], correct: 1 },
  { q: 'You cut opponent above the eye. Tactical advantage?', a: 'Target the cut with jabs to worsen it', opts: ['Ignore the cut','Target the cut with jabs to worsen it','Only body shots','Wait for stoppage'], correct: 1 },
  { q: 'Pre-fight: opponent known for strong left hook. Preparation?', a: 'Drill right-hand parry and right-side head movement', opts: ['Only practice offense','Drill right-hand parry and right-side head movement','Wear extra padding','Ignore scouting reports'], correct: 1 }
];

function drawFightIQ(canvas, ctx){
  var dark = clearCanvas23(canvas, ctx);
  var tc = textColor23(dark), dc = dimColor23(dark);
  ctx.fillStyle = tc; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('\u{1F9E0} Fight IQ Scenario Trainer', 16, 28);

  var total = v23.fightIQ.totalAttempts || 0;
  var correct = v23.fightIQ.totalCorrect || 0;
  var pct = total > 0 ? (correct / total) * 100 : 0;
  var iq = v23.fightIQ.iqScore || Math.round(pct * 1.5);

  // IQ Gauge (semicircle)
  var gx = 140, gy = 130, gr = 80;
  for(var i = 0; i < 5; i++){
    var sa = Math.PI + (i / 5) * Math.PI;
    var ea = Math.PI + ((i + 1) / 5) * Math.PI;
    var gaugeColors = ['#ef4444','#f97316','#eab308','#22c55e','#FFD700'];
    ctx.strokeStyle = gaugeColors[i]; ctx.lineWidth = 16;
    ctx.beginPath(); ctx.arc(gx, gy, gr, sa, ea); ctx.stroke();
  }

  // Needle
  var needleAngle = Math.PI + (Math.min(pct, 100) / 100) * Math.PI;
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(gx, gy);
  ctx.lineTo(gx + Math.cos(needleAngle) * (gr - 20), gy + Math.sin(needleAngle) * (gr - 20));
  ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(gx, gy, 6, 0, Math.PI * 2); ctx.fill();

  // IQ Score text
  ctx.fillStyle = tc; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(iq, gx, gy + 30);
  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Fight IQ', gx, gy + 44);
  ctx.textAlign = 'left';

  // Stats
  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Correct: ' + correct + '/' + total, 20, gy + 70);
  ctx.fillText('Accuracy: ' + pct.toFixed(1) + '%', 20, gy + 86);
  ctx.fillText('Streak: ' + (v23.fightIQ.streaks || 0), 160, gy + 70);

  // Scenario completion grid (right side)
  var rx = 290, ry = 50;
  ctx.fillStyle = tc; ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Scenario Progress', rx, ry);

  for(var i = 0; i < IQ_SCENARIOS.length; i++){
    var sx = rx + (i % 5) * 60;
    var sy = ry + 16 + Math.floor(i / 5) * 40;
    var done = v23.fightIQ.scenarios['s' + i];
    ctx.fillStyle = done ? '#22c55e33' : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)');
    ctx.beginPath(); ctx.roundRect(sx, sy, 52, 30, 6); ctx.fill();
    ctx.strokeStyle = done ? '#22c55e' : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)');
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(sx, sy, 52, 30, 6); ctx.stroke();
    ctx.fillStyle = done ? '#22c55e' : dc;
    ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('S' + (i + 1), sx + 26, sy + 14);
    ctx.fillStyle = dc; ctx.font = '8px sans-serif';
    ctx.fillText(done ? '✓ Done' : 'Open', sx + 26, sy + 25);
  }
  ctx.textAlign = 'left';

  var gr2 = gradeV23(pct);
  ctx.fillStyle = gr2.c; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Grade: ' + gr2.g, rx, canvas.height - 30);
  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('15 tactical scenarios for ring mastery', rx, canvas.height - 12);
}

// ============================================================
// QUIZ V23 - 15 NEW QUESTIONS (210 -> 225)
// ============================================================
var QUIZ_V23 = [
  { q: 'Shadow boxing is most effective for improving what?', opts: ['Raw power','Technique and form','Flexibility','Weight loss only'], a: 0 },
  { q: 'What is the average peak force of a professional heavyweight cross?', opts: ['200-300N','400-500N','600-800N','1000-1200N'], a: 2 },
  { q: 'In boxing, ring generalship refers to?', opts: ['Cleaning the ring','Controlling ring position and pace','Having a big entourage','Wearing fancy trunks'], a: 1 },
  { q: 'What is the ideal punch accuracy percentage for a pro boxer?', opts: ['10-20%','25-35%','40-50%','60-70%'], a: 1 },
  { q: 'VO2max measures what in athletic performance?', opts: ['Punch speed','Maximum oxygen uptake','Flexibility','Reaction time'], a: 1 },
  { q: 'A slip in boxing means?', opts: ['Falling down','Moving head to avoid a punch','Slippery gloves','A scoring error'], a: 1 },
  { q: 'Which heart rate zone is best for boxing conditioning?', opts: ['Zone 1 (50-60%)','Zone 2 (60-70%)','Zone 4 (80-90%)','Zone 5 (90-100%)'], a: 2 },
  { q: 'Fight IQ is primarily developed through?', opts: ['Weightlifting','Sparring experience and film study','Running marathons','Skipping rope'], a: 1 },
  { q: 'The peek-a-boo style was famously used by?', opts: ['Muhammad Ali','Floyd Mayweather','Mike Tyson','Manny Pacquiao'], a: 2 },
  { q: 'What is a pull counter in boxing?', opts: ['Pulling opponent&#39;s gloves','Leaning back to dodge then countering','A type of body shot','Pulling the referee'], a: 1 },
  { q: 'How many rounds is a standard professional championship bout?', opts: ['8 rounds','10 rounds','12 rounds','15 rounds'], a: 2 },
  { q: 'Footwork in boxing primarily helps with?', opts: ['Looking cool','Creating angles and managing distance','Building arm strength','Impressing judges'], a: 1 },
  { q: 'What is the sweet science of boxing?', opts: ['Candy making','Strategic and technical boxing skill','A boxing gym name','A training method'], a: 1 },
  { q: 'Active recovery between rounds should include?', opts: ['Deep breathing and light movement','Sprinting','Heavy bag work','Sleeping'], a: 0 },
  { q: 'What is ring cutting in boxing strategy?', opts: ['Cutting the ropes','Trapping opponent by cutting off escape angles','A haircut technique','Breaking the canvas'], a: 1 }
];

// ============================================================
// ACHIEVEMENTS V23 - 12 NEW (190 -> 202)
// ============================================================
var ACHIEV_V23 = [
  { id: 'shadow_master', name: 'Shadow Master', desc: 'Complete 20 shadow combo drills', check: function(){ return v23.shadowCombo.combosCompleted >= 20; } },
  { id: 'power_puncher', name: 'Power Puncher', desc: 'Analyze force curves for all 7 punch types', check: function(){ return v23.powerCurve.sessions >= 7; } },
  { id: 'ring_general', name: 'Ring General', desc: 'Record 100 ring movements', check: function(){ return v23.ringMovement.totalMoves >= 100; } },
  { id: 'strategist', name: 'Master Strategist', desc: 'Plan strategy for all 12 rounds', check: function(){ return v23.roundStrategy.roundScores.filter(function(s){return s>0;}).length >= 12; } },
  { id: 'sharpshooter', name: 'Sharpshooter', desc: 'Hit all 9 accuracy zones', check: function(){ var z=v23.punchAccuracy.zones; return Object.keys(z).every(function(k){return z[k]>0;}); } },
  { id: 'cardio_king', name: 'Cardio King', desc: 'Train in all 5 HR zones', check: function(){ return v23.cardioVO2.zones.every(function(z){return z>0;}); } },
  { id: 'head_mover', name: 'Head Mover', desc: 'Practice all 6 head movement patterns', check: function(){ var p=v23.headMovement.patterns; return HEAD_PATTERNS.every(function(hp){return (p[hp.key]||0)>0;}); } },
  { id: 'fight_iq_pro', name: 'Fight IQ Pro', desc: 'Answer 10 scenarios correctly', check: function(){ return v23.fightIQ.totalCorrect >= 10; } },
  { id: 'quiz_v23_master', name: 'Quiz v23 Master', desc: 'Score S rank on v23 quiz', check: function(){ var s=v23.quizV23Scores; var t=Object.keys(s).length; return t>=15 && Object.keys(s).filter(function(k){return s[k];}).length >= 14; } },
  { id: 'v23_explorer', name: 'v23 Explorer', desc: 'Open all 8 v23 features', check: function(){ var u=v23.featureUsage23; return Object.keys(u).length >= 8; } },
  { id: 'combo_virtuoso', name: 'Combo Virtuoso', desc: 'Complete 50 shadow combos', check: function(){ return v23.shadowCombo.combosCompleted >= 50; } },
  { id: 'v23_complete', name: 'v23 Complete', desc: 'Earn 10+ v23 achievements', check: function(){ return Object.keys(v23.achievementsV23).filter(function(k){return v23.achievementsV23[k];}).length >= 10; } }
];

function checkAchievementsV23(){
  var newUnlocks = [];
  ACHIEV_V23.forEach(function(a){
    if(!v23.achievementsV23[a.id] && a.check()){
      v23.achievementsV23[a.id] = true;
      newUnlocks.push(a.name);
    }
  });
  if(newUnlocks.length > 0){
    saveV23(v23);
    playSFX23('achieve_v23');
  }
  return newUnlocks;
}

// ============================================================
// UI BUILDER - SECTION PANELS
// ============================================================
function buildV23Section(id, title, emoji, drawFn, canvasW, canvasH, actions){
  var sec = document.createElement('div');
  sec.className = 'v23-card';
  sec.id = 'v23-sec-' + id;
  sec.style.cssText = 'display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(95vw,680px);max-height:90vh;overflow-y:auto;z-index:5200;padding:16px;';

  var hdr = document.createElement('div');
  hdr.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;';
  hdr.innerHTML = '<div class="v23-hdr">' + emoji + ' ' + title + '</div>';
  var closeBtn = document.createElement('button');
  closeBtn.className = 'v23-btn-sec';
  closeBtn.textContent = '✕ Close';
  closeBtn.onclick = function(){ sec.style.display = 'none'; };
  hdr.appendChild(closeBtn);
  sec.appendChild(hdr);

  var canvas = document.createElement('canvas');
  canvas.width = canvasW; canvas.height = canvasH;
  canvas.style.cssText = 'width:100%;max-width:' + canvasW + 'px;border-radius:12px;display:block;margin:0 auto 12px;';
  sec.appendChild(canvas);

  var actRow = document.createElement('div');
  actRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;justify-content:center;';
  actions.forEach(function(act){
    var btn = document.createElement('button');
    btn.className = act.primary ? 'v23-btn' : 'v23-btn-sec';
    btn.textContent = act.label;
    btn.onclick = function(){
      act.fn();
      drawFn(canvas, canvas.getContext('2d'));
      saveV23(v23);
      checkAchievementsV23();
    };
    actRow.appendChild(btn);
  });
  sec.appendChild(actRow);

  document.body.appendChild(sec);

  // Initial draw
  setTimeout(function(){ drawFn(canvas, canvas.getContext('2d')); }, 50);
  return sec;
}

// ============================================================
// BUILD ALL 8 SECTIONS
// ============================================================
var sec1 = buildV23Section('shadowCombo', 'Shadow Boxing Combo Visualizer', '\u{1F94A}', drawShadowCombo, 620, 380, [
  { label: '\u{1F3C3} Drill Combo', primary: true, fn: function(){
    v23.shadowCombo.combosCompleted++;
    v23.shadowCombo.drillTime += 15 + Math.floor(Math.random() * 30);
    var t = 2000 + Math.floor(Math.random() * 3000);
    if(t < v23.shadowCombo.bestComboTime) v23.shadowCombo.bestComboTime = t;
    playSFX23('combo_hit');
  }},
  { label: '\u{1F504} Next Combo', fn: function(){ v23.shadowCombo.combosCompleted++; playSFX23('combo_start'); }},
  { label: '\u{1F504} Reset', fn: function(){ v23.shadowCombo = defV23().shadowCombo; }}
]);

var sec2 = buildV23Section('powerCurve', 'Power Punch Force Curve', '\u{1F4AA}', drawPowerCurve, 600, 380, [
  { label: '\u{1F4A5} Simulate Session', primary: true, fn: function(){
    var keys = Object.keys(v23.powerCurve.punches);
    keys.forEach(function(k){ v23.powerCurve.punches[k] += Math.floor(Math.random() * 5); });
    v23.powerCurve.sessions++;
    playSFX23('power_impact');
  }},
  { label: '\u{1F504} Reset', fn: function(){ v23.powerCurve = defV23().powerCurve; }}
]);

var sec3 = buildV23Section('ringHeatmap', 'Ring Movement Heatmap', '\u{1F9ED}', drawRingHeatmap, 620, 400, [
  { label: '\u{1F463} Simulate Movement', primary: true, fn: function(){
    for(var i = 0; i < 8; i++){
      var idx = Math.floor(Math.random() * 64);
      v23.ringMovement.zones[idx]++;
      v23.ringMovement.totalMoves++;
    }
    v23.ringMovement.sessions++;
    playSFX23('ring_step');
  }},
  { label: '\u{1F504} Reset', fn: function(){ v23.ringMovement = defV23().ringMovement; }}
]);

var sec4 = buildV23Section('roundStrategy', 'Round-by-Round Strategy Planner', '\u{1F3AF}', drawRoundStrategy, 600, 380, [
  { label: '\u{1F4CB} Plan Round', primary: true, fn: function(){
    var r = v23.roundStrategy.roundScores.indexOf(0);
    if(r === -1) r = Math.floor(Math.random() * 12);
    v23.roundStrategy.roundScores[r] = 30 + Math.floor(Math.random() * 70);
    playSFX23('strategy_plan');
  }},
  { label: '\u{1F504} Reset Plan', fn: function(){ v23.roundStrategy = defV23().roundStrategy; }}
]);

var sec5 = buildV23Section('punchAccuracy', 'Punch Accuracy Zone', '\u{1F3AF}', drawPunchAccuracy, 580, 380, [
  { label: '\u{1F4A5} Drill Session', primary: true, fn: function(){
    var zKeys = ['head_l','head_c','head_r','body_l','body_c','body_r','low_l','low_c','low_r'];
    for(var i = 0; i < 10; i++){
      var z = zKeys[Math.floor(Math.random() * zKeys.length)];
      v23.punchAccuracy.zones[z]++;
      v23.punchAccuracy.totalShots++;
    }
    v23.punchAccuracy.drillSessions++;
    playSFX23('accuracy_hit');
  }},
  { label: '\u{1F504} Reset', fn: function(){ v23.punchAccuracy = defV23().punchAccuracy; }}
]);

var sec6 = buildV23Section('cardioVO2', 'Cardio VO2max Zone Tracker', '\u{2764}\u{FE0F}', drawCardioVO2, 580, 360, [
  { label: '\u{1F3C3} Log Session', primary: true, fn: function(){
    var zone = Math.floor(Math.random() * 5);
    v23.cardioVO2.zones[zone] += 5 + Math.floor(Math.random() * 15);
    var cal = 200 + Math.floor(Math.random() * 400);
    v23.cardioVO2.totalCalories += cal;
    v23.cardioVO2.sessions.push({ calories: cal, zone: zone });
    if(v23.cardioVO2.sessions.length > 30) v23.cardioVO2.sessions.shift();
    v23.cardioVO2.estimatedVO2max = Math.min(75, 35 + v23.cardioVO2.sessions.length * 1.5);
    playSFX23('cardio_zone');
  }},
  { label: '\u{1F504} Reset', fn: function(){ v23.cardioVO2 = defV23().cardioVO2; }}
]);

var sec7 = buildV23Section('headMovement', 'Head Movement Drill Trainer', '\u{1F9E0}', drawHeadMovement, 600, 380, [
  { label: '\u{1F4A8} Drill Session', primary: true, fn: function(){
    HEAD_PATTERNS.forEach(function(p){
      v23.headMovement.patterns[p.key] = (v23.headMovement.patterns[p.key] || 0) + Math.floor(Math.random() * 5) + 1;
    });
    v23.headMovement.sessions++;
    playSFX23('head_dodge');
  }},
  { label: '\u{1F504} Reset', fn: function(){ v23.headMovement = defV23().headMovement; }}
]);

var sec8 = buildV23Section('fightIQ', 'Fight IQ Scenario Trainer', '\u{1F9E0}', drawFightIQ, 620, 380, [
  { label: '\u{1F4A1} Answer Scenario', primary: true, fn: function(){
    var idx = v23.fightIQ.totalAttempts % IQ_SCENARIOS.length;
    v23.fightIQ.totalAttempts++;
    var isCorrect = Math.random() > 0.3;
    if(isCorrect){
      v23.fightIQ.totalCorrect++;
      v23.fightIQ.streaks++;
      v23.fightIQ.scenarios['s' + idx] = true;
      playSFX23('iq_correct');
    } else {
      v23.fightIQ.streaks = 0;
      playSFX23('iq_wrong');
    }
    v23.fightIQ.iqScore = Math.round((v23.fightIQ.totalCorrect / (v23.fightIQ.totalAttempts || 1)) * 150);
  }},
  { label: '\u{1F504} Reset', fn: function(){ v23.fightIQ = defV23().fightIQ; }}
]);

// ============================================================
// QUIZ V23 SECTION
// ============================================================
function buildQuizV23(){
  var sec = document.createElement('div');
  sec.className = 'v23-card';
  sec.id = 'v23-sec-quizV23';
  sec.style.cssText = 'display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(95vw,600px);max-height:90vh;overflow-y:auto;z-index:5200;padding:16px;';

  var hdr = document.createElement('div');
  hdr.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;';
  hdr.innerHTML = '<div class="v23-hdr">\u{1F4DD} Boxing Quiz v23 (15Q)</div>';
  var closeBtn = document.createElement('button');
  closeBtn.className = 'v23-btn-sec'; closeBtn.textContent = '✕';
  closeBtn.onclick = function(){ sec.style.display = 'none'; };
  hdr.appendChild(closeBtn);
  sec.appendChild(hdr);

  var qContainer = document.createElement('div');
  qContainer.id = 'v23-quiz-container';
  sec.appendChild(qContainer);
  document.body.appendChild(sec);

  function renderQuiz(){
    qContainer.innerHTML = '';
    var correct = 0, total = 0;
    QUIZ_V23.forEach(function(q, idx){
      var qDiv = document.createElement('div');
      qDiv.style.cssText = 'margin-bottom:14px;padding:10px;border-radius:10px;background:var(--surface,rgba(255,255,255,0.04));';
      var answered = v23.quizV23Scores['q' + idx] !== undefined;
      var isCorrect = v23.quizV23Scores['q' + idx] === true;
      if(answered){ total++; if(isCorrect) correct++; }

      var qText = document.createElement('div');
      qText.style.cssText = 'font-size:12px;font-weight:700;margin-bottom:8px;color:var(--text,#f0f0f0);';
      qText.textContent = (idx+1) + '. ' + q.q;
      qDiv.appendChild(qText);

      q.opts.forEach(function(opt, oi){
        var btn = document.createElement('button');
        btn.style.cssText = 'display:block;width:100%;text-align:left;padding:6px 10px;margin:3px 0;border-radius:8px;font-size:11px;cursor:pointer;border:1px solid var(--glass-border,rgba(255,255,255,0.1));background:var(--glass,rgba(255,255,255,0.06));color:var(--text,#f0f0f0);transition:all .2s;';
        btn.textContent = opt;
        if(answered){
          if(oi === q.a) btn.style.borderColor = '#22c55e';
          if(oi !== q.a && v23.quizV23Scores['q' + idx + '_ans'] === oi) btn.style.borderColor = '#ef4444';
          btn.disabled = true;
        } else {
          btn.onclick = function(){
            v23.quizV23Scores['q' + idx] = (oi === q.a);
            v23.quizV23Scores['q' + idx + '_ans'] = oi;
            saveV23(v23);
            playSFX23(oi === q.a ? 'quiz_v23' : 'iq_wrong');
            checkAchievementsV23();
            renderQuiz();
          };
        }
        qDiv.appendChild(btn);
      });
      qContainer.appendChild(qDiv);
    });

    var scoreDiv = document.createElement('div');
    scoreDiv.style.cssText = 'text-align:center;padding:10px;font-size:13px;font-weight:700;color:var(--text,#f0f0f0);';
    scoreDiv.textContent = 'Score: ' + correct + '/' + total + (total === 15 ? ' (' + gradeV23((correct/15)*100).g + ')' : '');
    qContainer.appendChild(scoreDiv);
  }
  renderQuiz();
  return sec;
}
var secQuiz = buildQuizV23();

// ============================================================
// NAVIGATION - APPEND TO EXISTING BOTTOM BAR
// ============================================================
function addV23Nav(){
  var features = [
    { id: 'shadowCombo', label: '\u{1F94A} Shadow', sec: sec1 },
    { id: 'powerCurve', label: '\u{1F4AA} Force', sec: sec2 },
    { id: 'ringHeatmap', label: '\u{1F9ED} Ring', sec: sec3 },
    { id: 'roundStrategy', label: '\u{1F3AF} Strategy', sec: sec4 },
    { id: 'punchAccuracy', label: '\u{1F3AF} Accuracy', sec: sec5 },
    { id: 'cardioVO2', label: '\u{2764}\u{FE0F} Cardio', sec: sec6 },
    { id: 'headMovement', label: '\u{1F9E0} Head', sec: sec7 },
    { id: 'fightIQ', label: '\u{1F9E0} FightIQ', sec: sec8 },
    { id: 'quizV23', label: '\u{1F4DD} Quiz23', sec: secQuiz }
  ];

  var existingNav = document.querySelector('.bottom-nav') || document.querySelector('[class*="bottomNav"]') || document.querySelector('[class*="bottom-bar"]');
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
    btn.style.cssText = 'padding:6px 10px;background:linear-gradient(135deg,rgba(220,38,38,0.15),rgba(153,27,27,0.15));border:1px solid rgba(220,38,38,0.3);border-radius:8px;color:#ef4444;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .2s;flex-shrink:0;';
    btn.textContent = f.label;
    btn.onclick = function(){
      document.querySelectorAll('[id^="v23-sec-"]').forEach(function(s){ s.style.display = 'none'; });
      f.sec.style.display = 'block';
      v23.featureUsage23[f.id] = true;
      saveV23(v23);
      checkAchievementsV23();
    };
    if(navWrap) navWrap.appendChild(btn);
  });
}

// ============================================================
// KEYBOARD SHORTCUTS (Shift+A~H for 8 features, Shift+0 for quiz)
// ============================================================
document.addEventListener('keydown', function(e){
  if(!e.shiftKey) return;
  var sections = [sec1, sec2, sec3, sec4, sec5, sec6, sec7, sec8, secQuiz];
  var keys = ['A','B','C','D','E','F','G','H','0'];
  var featureIds = ['shadowCombo','powerCurve','ringHeatmap','roundStrategy','punchAccuracy','cardioVO2','headMovement','fightIQ','quizV23'];
  var idx = keys.indexOf(e.key.toUpperCase());
  if(idx === -1 && e.key === ')') idx = 8;
  if(idx >= 0 && idx < sections.length){
    e.preventDefault();
    document.querySelectorAll('[id^="v23-sec-"]').forEach(function(s){ s.style.display = 'none'; });
    sections[idx].style.display = 'block';
    v23.featureUsage23[featureIds[idx]] = true;
    saveV23(v23);
    checkAchievementsV23();
  }
});

// ============================================================
// INIT
// ============================================================
setTimeout(function(){
  addV23Nav();
  checkAchievementsV23();
}, 500);

})();
