// Boxing Trainer Pro v24_patch.js - NEXTERA+PRISM Auto Enhancement Module
// 1. Punch Combination DNA Analyzer Canvas 620x400 - 12 DNA-style combo patterns, double helix, pattern frequency, S~D grading
// 2. Fighter Stance Comparison Tool Canvas 600x380 - 8 stances, 6-axis Radar, dual comparison overlay
// 3. Boxing Round Timer Pro Canvas 580x360 - Configurable 1-12 rounds, 2-3min, 30-60s rest, circular ring, bell SFX
// 4. Muscle Fatigue Recovery Map Canvas 620x380 - 10 muscle groups horizontal bar, recovery estimation, S~D grade
// 5. Clinch Technique Library Canvas 600x380 - 8 clinch techniques, effectiveness Radar, scenario drill
// 6. Punch Volume Tracker Canvas 620x380 - 12-round line chart, output/min, cumulative total, pro avg comparison
// 7. Corner Advice Simulator Canvas 600x380 - AI corner man tactical advice, 8 strategy cards, situation assessment
// 8. Boxing Conditioning Circuit Canvas 620x400 - 12-station circuit, animated timer, exercises, completion tracking
// Quiz +15 (225->240), +12 Achievements (202->214), SFX 16, Keyboard +8
(function(){
'use strict';

var V24KEY = 'boxingV24Patch';

function loadV24(){
  try {
    var r = localStorage.getItem(V24KEY);
    if(!r) return defV24();
    var p = JSON.parse(r), d = defV24();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV24(); }
}
function saveV24(d){ try { localStorage.setItem(V24KEY, JSON.stringify(d)); } catch(e){} }
function defV24(){
  return {
    comboDNA: { patterns: Array(12).fill(0), totalScans: 0, signatureCombo: '', bestGrade: 'D', sessions: 0 },
    stanceComp: { stances: {orthodox:0,southpaw:0,switchStance:0,peekaboo:0,phillyShell:0,crossArm:0,crouching:0,square:0}, comparisons: 0, sessions: 0 },
    roundTimer: { roundsCompleted: 0, totalTime: 0, roundConfig: {rounds:3,roundMin:3,restSec:60}, intensityLog: [] },
    muscleFatigue: { muscles: {deltoids:0,biceps:0,triceps:0,core:0,quads:0,calves:0,lats:0,glutes:0,forearms:0,trapezius:0}, recoveryEstimates: {}, sessions: 0 },
    clinchLib: { techniques: {insideTie:0,outsideTie:0,underhook:0,overhook:0,collarTie:0,bearHug:0,doubleUnder:0,dirtyBoxing:0}, drillsDone: 0, sessions: 0 },
    punchVolume: { rounds: Array(12).fill(0), totalPunches: 0, sessions: 0, perMinRate: 0 },
    cornerAdvice: { adviceGiven: 0, strategiesUsed: {}, roundsScouted: 0, sessions: 0 },
    condCircuit: { stations: Array(12).fill(0), completedCircuits: 0, totalTime: 0, sessions: 0 },
    quizV24Scores: {},
    achievementsV24: {},
    featureUsage24: {}
  };
}

var v24 = loadV24();

// ===== CSS =====
var st24 = document.createElement('style');
st24.textContent = '.v24-btn{padding:8px 16px;background:linear-gradient(135deg,#9333ea,#6b21a8);border:none;border-radius:10px;color:#fff;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s}.v24-btn:hover{filter:brightness(1.15);transform:scale(1.03)}.v24-btn-sec{padding:8px 16px;background:var(--surface,rgba(255,255,255,0.04));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:10px;color:var(--text-dim,#8a8a9e);font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.v24-btn-sec:hover{border-color:#9333ea;color:#9333ea}.v24-card{background:var(--glass,rgba(255,255,255,0.06));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:var(--radius,16px);padding:16px;margin-bottom:12px}.v24-hdr{font-size:15px;font-weight:800;margin-bottom:10px;display:flex;align-items:center;gap:8px}.v24-sub{font-size:11px;color:var(--text-dim,#8a8a9e);margin-bottom:8px}';
document.head.appendChild(st24);

// ===== SFX ENGINE V24 =====
function playSFX24(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'dna_scan':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(440,t);o.frequency.exponentialRampToValueAtTime(880,t+0.12);
        g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.15);break;
      case 'dna_match':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='triangle';o.frequency.setValueAtTime(660,t);o.frequency.setValueAtTime(880,t+0.06);o.frequency.setValueAtTime(1100,t+0.12);
        g.gain.setValueAtTime(0.09,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.18);break;
      case 'stance_switch':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='square';o.frequency.setValueAtTime(300,t);o.frequency.exponentialRampToValueAtTime(500,t+0.06);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.08);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.08);break;
      case 'timer_bell':
        var o1=ctx.createOscillator(),o2=ctx.createOscillator(),g=ctx.createGain();
        o1.type='sine';o1.frequency.setValueAtTime(1200,t);
        o2.type='sine';o2.frequency.setValueAtTime(2400,t);
        g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.4);
        o1.connect(g);o2.connect(g);g.connect(ctx.destination);o1.start(t);o2.start(t);o1.stop(t+0.4);o2.stop(t+0.4);break;
      case 'timer_tick':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(1000,t);
        g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.03);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.03);break;
      case 'fatigue_warn':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sawtooth';o.frequency.setValueAtTime(220,t);o.frequency.linearRampToValueAtTime(110,t+0.15);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.18);break;
      case 'fatigue_recover':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(392,t);o.frequency.setValueAtTime(523,t+0.08);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.14);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.14);break;
      case 'clinch_grab':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sawtooth';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(80,t+0.1);
        g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.12);break;
      case 'clinch_break':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='triangle';o.frequency.setValueAtTime(400,t);o.frequency.exponentialRampToValueAtTime(800,t+0.06);
        g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.08);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.08);break;
      case 'volume_punch':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='square';o.frequency.setValueAtTime(500,t);o.frequency.exponentialRampToValueAtTime(250,t+0.04);
        g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.05);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.05);break;
      case 'corner_advice':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(523,t);o.frequency.setValueAtTime(659,t+0.1);o.frequency.setValueAtTime(784,t+0.2);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.25);break;
      case 'circuit_start':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='square';o.frequency.setValueAtTime(440,t);o.frequency.setValueAtTime(660,t+0.05);o.frequency.setValueAtTime(880,t+0.1);
        g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.15);break;
      case 'circuit_done':
        var o1=ctx.createOscillator(),o2=ctx.createOscillator(),g=ctx.createGain();
        o1.type='sine';o1.frequency.setValueAtTime(523,t);o1.frequency.setValueAtTime(784,t+0.1);
        o2.type='triangle';o2.frequency.setValueAtTime(1047,t+0.15);
        g.gain.setValueAtTime(0.09,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);
        o1.connect(g);o2.connect(g);g.connect(ctx.destination);o1.start(t);o2.start(t+0.15);o1.stop(t+0.3);o2.stop(t+0.3);break;
      case 'quiz_v24':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(698,t);o.frequency.setValueAtTime(932,t+0.08);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.15);break;
      case 'achieve_v24':
        var o1=ctx.createOscillator(),o2=ctx.createOscillator(),g=ctx.createGain();
        o1.type='sine';o1.frequency.setValueAtTime(587,t);o1.frequency.setValueAtTime(740,t+0.1);o1.frequency.setValueAtTime(880,t+0.2);
        o2.type='triangle';o2.frequency.setValueAtTime(1175,t+0.15);
        g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.35);
        o1.connect(g);o2.connect(g);g.connect(ctx.destination);o1.start(t);o2.start(t+0.15);o1.stop(t+0.35);o2.stop(t+0.35);break;
      case 'quiz_wrong_v24':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='square';o.frequency.setValueAtTime(200,t);o.frequency.linearRampToValueAtTime(140,t+0.12);
        g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.15);break;
    }
    setTimeout(function(){ctx.close();},600);
  } catch(e){}
}

// ===== GRADE UTILITY =====
function gradeV24(pct){
  if(pct >= 95) return {g:'S',c:'#FFD700'};
  if(pct >= 85) return {g:'A',c:'#22c55e'};
  if(pct >= 70) return {g:'B',c:'#3b82f6'};
  if(pct >= 50) return {g:'C',c:'#f97316'};
  return {g:'D',c:'#ef4444'};
}

// ===== CANVAS HELPERS =====
function clearCanvas24(canvas, ctx){
  var isDark = !document.documentElement.getAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.fillStyle = isDark ? '#1a1a2e' : '#f8f8fc';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 1;
  ctx.strokeRect(2,2,canvas.width-4,canvas.height-4);
  return isDark;
}
function textColor24(isDark){ return isDark ? '#f0f0f0' : '#1a1a2e'; }
function dimColor24(isDark){ return isDark ? '#8a8a9e' : '#666'; }

// ============================================================
// 1. PUNCH COMBINATION DNA ANALYZER (Canvas 620x400)
// ============================================================
var DNA_COMBOS = [
  { name: 'Jab-Cross Basic', seq: [1,2], freq: 0, sig: false },
  { name: 'Triple Jab', seq: [1,1,1], freq: 0, sig: false },
  { name: '1-2-3 Classic', seq: [1,2,3], freq: 0, sig: false },
  { name: 'Body Ripper', seq: [1,2,5,2], freq: 0, sig: false },
  { name: 'Uppercut Finish', seq: [1,2,3,6], freq: 0, sig: false },
  { name: 'Speed Rush', seq: [1,1,2,3,2], freq: 0, sig: false },
  { name: 'Counter Flow', seq: [3,2,5,6], freq: 0, sig: false },
  { name: 'Power Chain', seq: [1,2,3,2,5,6], freq: 0, sig: false },
  { name: 'Mexican Wave', seq: [1,2,5,3,6,2], freq: 0, sig: false },
  { name: 'Philly Special', seq: [3,2,1,2,6,5,3], freq: 0, sig: false },
  { name: 'Champion DNA', seq: [1,1,2,3,5,6,2,3], freq: 0, sig: false },
  { name: 'Legend Sequence', seq: [1,2,1,2,3,5,6,3,2,6], freq: 0, sig: false }
];
var PUNCH_LABELS = {1:'Jab',2:'Cross',3:'L.Hook',4:'R.Hook',5:'B.Hook',6:'Upper'};
var DNA_COLORS = ['#3b82f6','#ef4444','#22c55e','#f97316','#a855f7','#06b6d4'];

function drawComboDNA(canvas, ctx){
  var dark = clearCanvas24(canvas, ctx);
  var tc = textColor24(dark), dc = dimColor24(dark);
  ctx.fillStyle = tc; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('\u{1F9EC} Punch Combination DNA Analyzer', 16, 28);

  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Scans: ' + v24.comboDNA.totalScans + ' | Signature: ' + (v24.comboDNA.signatureCombo || 'None'), 16, 46);

  // Double Helix visualization
  var helixY = 100, helixH = 80, helixW = canvas.width - 60;
  for(var i = 0; i < 60; i++){
    var x = 30 + (i / 60) * helixW;
    var y1 = helixY + Math.sin(i * 0.3 + v24.comboDNA.totalScans * 0.1) * 30;
    var y2 = helixY + Math.sin(i * 0.3 + Math.PI + v24.comboDNA.totalScans * 0.1) * 30;
    var ci = i % 6;
    ctx.strokeStyle = DNA_COLORS[ci] + '80'; ctx.lineWidth = 2;
    if(i > 0){
      var px = 30 + ((i-1) / 60) * helixW;
      var py1 = helixY + Math.sin((i-1) * 0.3 + v24.comboDNA.totalScans * 0.1) * 30;
      var py2 = helixY + Math.sin((i-1) * 0.3 + Math.PI + v24.comboDNA.totalScans * 0.1) * 30;
      ctx.beginPath(); ctx.moveTo(px, py1); ctx.lineTo(x, y1); ctx.stroke();
      ctx.strokeStyle = DNA_COLORS[(ci+3)%6] + '80';
      ctx.beginPath(); ctx.moveTo(px, py2); ctx.lineTo(x, y2); ctx.stroke();
    }
    if(i % 5 === 0){
      ctx.strokeStyle = dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y2); ctx.stroke();
      ctx.fillStyle = DNA_COLORS[ci]; ctx.beginPath(); ctx.arc(x, y1, 3, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = DNA_COLORS[(ci+3)%6]; ctx.beginPath(); ctx.arc(x, y2, 3, 0, Math.PI*2); ctx.fill();
    }
  }

  // Pattern frequency bars
  var barY = 170, barH = 14, barMaxW = 200;
  ctx.fillStyle = tc; ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Pattern Frequency', 16, barY);
  var maxFreq = Math.max.apply(null, v24.comboDNA.patterns.map(function(p){return p||1;}));
  for(var i = 0; i < 12; i++){
    var by = barY + 16 + i * (barH + 4);
    var bw = Math.max(4, (v24.comboDNA.patterns[i] / maxFreq) * barMaxW);
    var col = DNA_COLORS[i % 6];
    ctx.fillStyle = col + '33';
    ctx.fillRect(120, by, barMaxW, barH);
    ctx.fillStyle = col;
    ctx.fillRect(120, by, bw, barH);
    ctx.fillStyle = dc; ctx.font = '9px sans-serif';
    ctx.fillText(DNA_COMBOS[i].name, 16, by + 11);
    ctx.fillStyle = tc; ctx.font = '9px sans-serif';
    ctx.fillText(v24.comboDNA.patterns[i] + '', 125 + bw + 4, by + 11);
  }

  // Signature combo detection
  var sigIdx = 0, sigMax = 0;
  v24.comboDNA.patterns.forEach(function(p, idx){ if(p > sigMax){ sigMax = p; sigIdx = idx; } });
  if(sigMax > 0) v24.comboDNA.signatureCombo = DNA_COMBOS[sigIdx].name;

  // Grade
  var totalFreq = v24.comboDNA.patterns.reduce(function(a,b){return a+b;},0);
  var usedPatterns = v24.comboDNA.patterns.filter(function(p){return p>0;}).length;
  var gr = gradeV24((usedPatterns / 12) * 100);
  ctx.fillStyle = gr.c; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Grade: ' + gr.g, 380, canvas.height - 30);
  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Variety: ' + usedPatterns + '/12 patterns | Total: ' + totalFreq, 380, canvas.height - 12);

  // Right side: DNA sequence display
  ctx.fillStyle = tc; ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Combo DNA Sequence', 380, barY);
  var seqY = barY + 16;
  for(var i = 0; i < Math.min(6, DNA_COMBOS.length); i++){
    var combo = DNA_COMBOS[i];
    ctx.fillStyle = dc; ctx.font = '9px sans-serif';
    ctx.fillText(combo.name + ':', 380, seqY + i * 28);
    for(var j = 0; j < combo.seq.length; j++){
      var px = 380 + j * 22;
      var py = seqY + i * 28 + 6;
      ctx.fillStyle = DNA_COLORS[(combo.seq[j]-1) % 6];
      ctx.beginPath(); ctx.arc(px + 8, py + 4, 7, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(combo.seq[j]+'', px + 8, py + 7);
      ctx.textAlign = 'left';
    }
  }
}

// ============================================================
// 2. FIGHTER STANCE COMPARISON TOOL (Canvas 600x380)
// ============================================================
var STANCES = [
  { name: 'Orthodox', key: 'orthodox', stats: [7,7,7,6,5,7] },
  { name: 'Southpaw', key: 'southpaw', stats: [7,8,7,7,5,6] },
  { name: 'Switch', key: 'switchStance', stats: [6,8,8,8,5,6] },
  { name: 'Peek-a-boo', key: 'peekaboo', stats: [9,6,6,8,7,6] },
  { name: 'Philly Shell', key: 'phillyShell', stats: [9,7,7,9,4,5] },
  { name: 'Cross-arm', key: 'crossArm', stats: [8,5,5,7,6,6] },
  { name: 'Crouching', key: 'crouching', stats: [7,7,6,8,7,7] },
  { name: 'Square', key: 'square', stats: [6,8,5,5,6,8] }
];
var STANCE_AXES = ['Defense','Offense','Mobility','Counter','Clinch','Endurance'];
var stanceSelA = 0, stanceSelB = 1;

function drawStanceComparison(canvas, ctx){
  var dark = clearCanvas24(canvas, ctx);
  var tc = textColor24(dark), dc = dimColor24(dark);
  ctx.fillStyle = tc; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('\u{1F94B} Fighter Stance Comparison', 16, 28);

  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Comparing: ' + STANCES[stanceSelA].name + ' vs ' + STANCES[stanceSelB].name, 16, 46);
  ctx.fillText('Sessions: ' + v24.stanceComp.sessions + ' | Comparisons: ' + v24.stanceComp.comparisons, 16, 60);

  // 6-axis Radar chart
  var cx = 200, cy = 210, rr = 100;
  var axes = STANCE_AXES;

  // Draw radar grid (3 levels)
  for(var lv = 1; lv <= 3; lv++){
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(var a = 0; a <= axes.length; a++){
      var angle = -Math.PI/2 + (a % axes.length) * (Math.PI*2/axes.length);
      var r = rr * (lv / 3);
      var px = cx + Math.cos(angle) * r;
      var py = cy + Math.sin(angle) * r;
      if(a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // Draw axis lines + labels
  for(var a = 0; a < axes.length; a++){
    var angle = -Math.PI/2 + a * (Math.PI*2/axes.length);
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle)*rr, cy + Math.sin(angle)*rr);
    ctx.stroke();
    ctx.fillStyle = dc; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(axes[a], cx + Math.cos(angle)*(rr+18), cy + Math.sin(angle)*(rr+18));
  }
  ctx.textAlign = 'left';

  // Draw stance A (blue fill)
  var sA = STANCES[stanceSelA].stats;
  ctx.fillStyle = '#3b82f640'; ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
  ctx.beginPath();
  for(var a = 0; a <= axes.length; a++){
    var angle = -Math.PI/2 + (a % axes.length) * (Math.PI*2/axes.length);
    var val = sA[a % axes.length] / 10;
    var px = cx + Math.cos(angle) * rr * val;
    var py = cy + Math.sin(angle) * rr * val;
    if(a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.fill(); ctx.stroke();

  // Draw stance B (red fill)
  var sB = STANCES[stanceSelB].stats;
  ctx.fillStyle = '#ef444440'; ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
  ctx.beginPath();
  for(var a = 0; a <= axes.length; a++){
    var angle = -Math.PI/2 + (a % axes.length) * (Math.PI*2/axes.length);
    var val = sB[a % axes.length] / 10;
    var px = cx + Math.cos(angle) * rr * val;
    var py = cy + Math.sin(angle) * rr * val;
    if(a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.fill(); ctx.stroke();

  // Legend
  ctx.fillStyle = '#3b82f6'; ctx.fillRect(340, 60, 12, 12);
  ctx.fillStyle = tc; ctx.font = '11px sans-serif'; ctx.fillText(STANCES[stanceSelA].name, 358, 71);
  ctx.fillStyle = '#ef4444'; ctx.fillRect(340, 80, 12, 12);
  ctx.fillStyle = tc; ctx.fillText(STANCES[stanceSelB].name, 358, 91);

  // Stat comparison table (right side)
  ctx.fillStyle = tc; ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Stat Breakdown', 340, 120);
  for(var i = 0; i < axes.length; i++){
    var ty = 136 + i * 22;
    ctx.fillStyle = dc; ctx.font = '10px sans-serif';
    ctx.fillText(axes[i], 340, ty);
    ctx.fillStyle = sA[i] >= sB[i] ? '#3b82f6' : dc;
    ctx.fillText(sA[i] + '/10', 430, ty);
    ctx.fillStyle = tc; ctx.fillText('vs', 468, ty);
    ctx.fillStyle = sB[i] >= sA[i] ? '#ef4444' : dc;
    ctx.fillText(sB[i] + '/10', 490, ty);
  }

  // All stances list
  ctx.fillStyle = tc; ctx.font = 'bold 11px sans-serif';
  ctx.fillText('All 8 Stances:', 340, 280);
  for(var i = 0; i < STANCES.length; i++){
    ctx.fillStyle = i === stanceSelA ? '#3b82f6' : (i === stanceSelB ? '#ef4444' : dc);
    ctx.font = '9px sans-serif';
    ctx.fillText((i+1)+'. '+STANCES[i].name + ' (Trained: ' + (v24.stanceComp.stances[STANCES[i].key]||0) + ')', 340, 296 + i * 13);
  }
}

// ============================================================
// 3. BOXING ROUND TIMER PRO (Canvas 580x360)
// ============================================================
function drawRoundTimer(canvas, ctx){
  var dark = clearCanvas24(canvas, ctx);
  var tc = textColor24(dark), dc = dimColor24(dark);
  ctx.fillStyle = tc; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('\u{23F1}\u{FE0F} Boxing Round Timer Pro', 16, 28);

  var cfg = v24.roundTimer.roundConfig;
  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Config: ' + cfg.rounds + ' rounds x ' + cfg.roundMin + ' min | Rest: ' + cfg.restSec + 's', 16, 46);
  ctx.fillText('Completed: ' + v24.roundTimer.roundsCompleted + ' rounds | Total: ' + Math.floor(v24.roundTimer.totalTime/60) + ' min', 16, 60);

  // Circular progress ring
  var cx = 160, cy = 200, outerR = 100, innerR = 75;
  var completedPct = Math.min(1, v24.roundTimer.roundsCompleted / (cfg.rounds || 1));

  // Outer ring background
  ctx.strokeStyle = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  ctx.lineWidth = outerR - innerR;
  ctx.beginPath();
  ctx.arc(cx, cy, (outerR + innerR) / 2, 0, Math.PI * 2);
  ctx.stroke();

  // Progress arc
  var gradient = ctx.createLinearGradient(cx - outerR, cy, cx + outerR, cy);
  gradient.addColorStop(0, '#9333ea');
  gradient.addColorStop(1, '#ec4899');
  ctx.strokeStyle = gradient;
  ctx.lineWidth = outerR - innerR;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy, (outerR + innerR) / 2, -Math.PI/2, -Math.PI/2 + completedPct * Math.PI * 2);
  ctx.stroke();
  ctx.lineCap = 'butt';

  // Center text
  ctx.fillStyle = tc; ctx.font = 'bold 24px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('R' + Math.min(v24.roundTimer.roundsCompleted + 1, cfg.rounds), cx, cy - 8);
  ctx.fillStyle = dc; ctx.font = '12px sans-serif';
  ctx.fillText(cfg.roundMin + ':00', cx, cy + 14);
  ctx.font = '10px sans-serif';
  ctx.fillText(Math.round(completedPct * 100) + '% Complete', cx, cy + 32);
  ctx.textAlign = 'left';

  // Round indicators (right side)
  ctx.fillStyle = tc; ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Round Progress', 310, 80);

  for(var r = 0; r < cfg.rounds; r++){
    var rx = 310 + (r % 4) * 60;
    var ry = 96 + Math.floor(r / 4) * 36;
    var done = r < v24.roundTimer.roundsCompleted;
    ctx.fillStyle = done ? '#9333ea33' : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)');
    ctx.beginPath(); ctx.roundRect(rx, ry, 52, 28, 6); ctx.fill();
    ctx.strokeStyle = done ? '#9333ea' : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)');
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(rx, ry, 52, 28, 6); ctx.stroke();
    ctx.fillStyle = done ? '#9333ea' : dc;
    ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('R' + (r+1), rx + 26, ry + 12);
    ctx.fillStyle = dc; ctx.font = '8px sans-serif';
    ctx.fillText(done ? 'Done' : 'Pending', rx + 26, ry + 23);
  }
  ctx.textAlign = 'left';

  // Intensity tracking (bottom)
  var intLog = v24.roundTimer.intensityLog;
  if(intLog.length > 0){
    ctx.fillStyle = tc; ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Intensity by Round', 310, 230);
    var bw = Math.floor(240 / Math.max(intLog.length, 1));
    for(var i = 0; i < intLog.length; i++){
      var bh = (intLog[i] / 100) * 80;
      var intCol = intLog[i] >= 80 ? '#ef4444' : (intLog[i] >= 50 ? '#f97316' : '#22c55e');
      ctx.fillStyle = intCol + '60';
      ctx.fillRect(310 + i * bw, 320 - bh, bw - 2, bh);
      ctx.fillStyle = intCol;
      ctx.fillRect(310 + i * bw, 320 - bh, bw - 2, 3);
      ctx.fillStyle = dc; ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(intLog[i] + '%', 310 + i * bw + (bw-2)/2, 334);
    }
    ctx.textAlign = 'left';
  }

  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Configurable: 1-12 rounds, 2-3 min, 30-60s rest', 16, canvas.height - 12);
}

// ============================================================
// 4. MUSCLE FATIGUE RECOVERY MAP (Canvas 620x380)
// ============================================================
var MUSCLES = [
  { name: 'Deltoids', key: 'deltoids', recoveryHrs: 24 },
  { name: 'Biceps', key: 'biceps', recoveryHrs: 36 },
  { name: 'Triceps', key: 'triceps', recoveryHrs: 36 },
  { name: 'Core', key: 'core', recoveryHrs: 24 },
  { name: 'Quads', key: 'quads', recoveryHrs: 48 },
  { name: 'Calves', key: 'calves', recoveryHrs: 24 },
  { name: 'Lats', key: 'lats', recoveryHrs: 48 },
  { name: 'Glutes', key: 'glutes', recoveryHrs: 48 },
  { name: 'Forearms', key: 'forearms', recoveryHrs: 24 },
  { name: 'Trapezius', key: 'trapezius', recoveryHrs: 36 }
];

function drawMuscleFatigue(canvas, ctx){
  var dark = clearCanvas24(canvas, ctx);
  var tc = textColor24(dark), dc = dimColor24(dark);
  ctx.fillStyle = tc; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('\u{1F4AA} Muscle Fatigue Recovery Map', 16, 28);

  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Sessions: ' + v24.muscleFatigue.sessions + ' | Track 10 muscle groups', 16, 46);

  // Horizontal bar chart for fatigue levels
  var barY = 65, barH = 22, barMaxW = 280, labelW = 80;
  var maxFatigue = 100;

  for(var i = 0; i < MUSCLES.length; i++){
    var m = MUSCLES[i];
    var fatigue = Math.min(100, v24.muscleFatigue.muscles[m.key] || 0);
    var by = barY + i * (barH + 8);
    var bw = Math.max(2, (fatigue / maxFatigue) * barMaxW);

    // Label
    ctx.fillStyle = tc; ctx.font = '10px sans-serif';
    ctx.fillText(m.name, 16, by + 15);

    // Background bar
    ctx.fillStyle = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
    ctx.fillRect(labelW + 16, by, barMaxW, barH);

    // Fatigue bar (color based on level)
    var fCol = fatigue >= 80 ? '#ef4444' : (fatigue >= 50 ? '#f97316' : (fatigue >= 25 ? '#eab308' : '#22c55e'));
    ctx.fillStyle = fCol + '80';
    ctx.fillRect(labelW + 16, by, bw, barH);
    ctx.fillStyle = fCol;
    ctx.fillRect(labelW + 16, by, bw, 3);

    // Value text
    ctx.fillStyle = tc; ctx.font = 'bold 10px sans-serif';
    ctx.fillText(fatigue + '%', labelW + 20 + bw + 4, by + 15);

    // Recovery estimate
    var recHrs = Math.round(m.recoveryHrs * (fatigue / 100));
    ctx.fillStyle = dc; ctx.font = '9px sans-serif';
    ctx.fillText(recHrs + 'h rec', labelW + barMaxW + 30, by + 15);
  }

  // Training load grade (right side)
  var totalFatigue = 0;
  MUSCLES.forEach(function(m){ totalFatigue += (v24.muscleFatigue.muscles[m.key] || 0); });
  var avgFatigue = totalFatigue / MUSCLES.length;
  var engaged = MUSCLES.filter(function(m){ return (v24.muscleFatigue.muscles[m.key] || 0) > 0; }).length;

  var gr = gradeV24((engaged / 10) * 100);
  ctx.fillStyle = tc; ctx.font = 'bold 12px sans-serif';
  ctx.fillText('Training Load', 470, 70);
  ctx.fillStyle = gr.c; ctx.font = 'bold 28px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(gr.g, 520, 110);
  ctx.textAlign = 'left';
  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Avg Fatigue: ' + avgFatigue.toFixed(0) + '%', 470, 130);
  ctx.fillText('Groups Hit: ' + engaged + '/10', 470, 146);
  ctx.fillText('Total Load: ' + totalFatigue.toFixed(0), 470, 162);

  // Recovery color legend
  ctx.fillStyle = tc; ctx.font = 'bold 10px sans-serif';
  ctx.fillText('Fatigue Levels:', 470, 200);
  var legColors = [['Fresh','#22c55e'],['Mild','#eab308'],['Moderate','#f97316'],['High','#ef4444']];
  for(var i = 0; i < legColors.length; i++){
    ctx.fillStyle = legColors[i][1];
    ctx.fillRect(470, 210 + i * 18, 10, 10);
    ctx.fillStyle = dc; ctx.font = '9px sans-serif';
    ctx.fillText(legColors[i][0], 485, 219 + i * 18);
  }

  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Recovery estimates based on training intensity', 16, canvas.height - 12);
}

// ============================================================
// 5. CLINCH TECHNIQUE LIBRARY (Canvas 600x380)
// ============================================================
var CLINCH_TECHNIQUES = [
  { name: 'Inside Tie', key: 'insideTie', desc: 'Control inside biceps for positioning', stats: [8,6,7,8,9,6] },
  { name: 'Outside Tie', key: 'outsideTie', desc: 'Wrap outside of opponent arms', stats: [7,5,6,7,8,7] },
  { name: 'Underhook', key: 'underhook', desc: 'Arm under opponent armpit control', stats: [8,7,6,7,9,7] },
  { name: 'Overhook', key: 'overhook', desc: 'Arm over opponent arm to restrict', stats: [7,5,5,8,8,6] },
  { name: 'Collar Tie', key: 'collarTie', desc: 'Grab behind neck for head control', stats: [6,7,5,6,7,5] },
  { name: 'Bear Hug', key: 'bearHug', desc: 'Full wrap around opponent torso', stats: [9,4,3,5,10,8] },
  { name: 'Double Underhook', key: 'doubleUnder', desc: 'Both arms under for maximum control', stats: [9,6,4,6,10,7] },
  { name: 'Dirty Boxing', key: 'dirtyBoxing', desc: 'Short punches in close quarters', stats: [5,9,5,7,7,5] }
];
var CLINCH_AXES = ['Defense','Offense','Mobility','Counter','Control','Stamina'];
var clinchSel = 0;

function drawClinchLibrary(canvas, ctx){
  var dark = clearCanvas24(canvas, ctx);
  var tc = textColor24(dark), dc = dimColor24(dark);
  ctx.fillStyle = tc; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('\u{1F91C} Clinch Technique Library', 16, 28);

  var tech = CLINCH_TECHNIQUES[clinchSel];
  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Selected: ' + tech.name + ' - ' + tech.desc, 16, 46);
  ctx.fillText('Drills Done: ' + v24.clinchLib.drillsDone + ' | Sessions: ' + v24.clinchLib.sessions, 16, 60);

  // Radar chart for selected technique (left)
  var cx = 150, cy = 200, rr = 80;
  for(var lv = 1; lv <= 3; lv++){
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(var a = 0; a <= CLINCH_AXES.length; a++){
      var angle = -Math.PI/2 + (a % CLINCH_AXES.length) * (Math.PI*2/CLINCH_AXES.length);
      var r = rr * (lv / 3);
      ctx.lineTo(cx + Math.cos(angle)*r, cy + Math.sin(angle)*r);
    }
    ctx.stroke();
  }
  for(var a = 0; a < CLINCH_AXES.length; a++){
    var angle = -Math.PI/2 + a * (Math.PI*2/CLINCH_AXES.length);
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle)*rr, cy + Math.sin(angle)*rr);
    ctx.stroke();
    ctx.fillStyle = dc; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(CLINCH_AXES[a], cx + Math.cos(angle)*(rr+16), cy + Math.sin(angle)*(rr+16));
  }
  ctx.textAlign = 'left';

  // Filled radar
  ctx.fillStyle = '#a855f740'; ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 2;
  ctx.beginPath();
  for(var a = 0; a <= CLINCH_AXES.length; a++){
    var angle = -Math.PI/2 + (a % CLINCH_AXES.length) * (Math.PI*2/CLINCH_AXES.length);
    var val = tech.stats[a % CLINCH_AXES.length] / 10;
    ctx.lineTo(cx + Math.cos(angle)*rr*val, cy + Math.sin(angle)*rr*val);
  }
  ctx.fill(); ctx.stroke();

  // Technique list (right)
  ctx.fillStyle = tc; ctx.font = 'bold 11px sans-serif';
  ctx.fillText('All 8 Techniques', 310, 80);
  for(var i = 0; i < CLINCH_TECHNIQUES.length; i++){
    var ct = CLINCH_TECHNIQUES[i];
    var trained = v24.clinchLib.techniques[ct.key] || 0;
    ctx.fillStyle = i === clinchSel ? '#a855f7' : dc;
    ctx.font = '10px sans-serif';
    ctx.fillText((i+1) + '. ' + ct.name, 310, 100 + i * 24);
    ctx.fillStyle = dc; ctx.font = '9px sans-serif';
    ctx.fillText('Trained: ' + trained + 'x', 460, 100 + i * 24);
  }

  // Scenario drill info
  ctx.fillStyle = tc; ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Drill Scenario', 310, 310);
  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Opponent rushes in close. Use ' + tech.name, 310, 328);
  ctx.fillText('to gain control and create separation.', 310, 344);

  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('8 techniques for close-range boxing mastery', 16, canvas.height - 12);
}

// ============================================================
// 6. PUNCH VOLUME TRACKER (Canvas 620x380)
// ============================================================
function drawPunchVolume(canvas, ctx){
  var dark = clearCanvas24(canvas, ctx);
  var tc = textColor24(dark), dc = dimColor24(dark);
  ctx.fillStyle = tc; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('\u{1F4CA} Punch Volume Tracker', 16, 28);

  var rounds = v24.punchVolume.rounds;
  var total = v24.punchVolume.totalPunches;
  var sessions = v24.punchVolume.sessions;
  var perMin = sessions > 0 ? (total / (sessions * 36)).toFixed(1) : '0.0';

  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Total Punches: ' + total + ' | Per Minute: ' + perMin + ' | Sessions: ' + sessions, 16, 46);
  ctx.fillText('Pro Average: 800-1000 per fight (12 rounds)', 16, 60);

  // 12-round line chart
  var chartX = 60, chartY = 80, chartW = 500, chartH = 200;
  var maxVal = Math.max.apply(null, rounds.map(function(r){return r||1;}));
  maxVal = Math.max(maxVal, 80);

  // Grid
  ctx.strokeStyle = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  ctx.lineWidth = 1;
  for(var i = 0; i <= 4; i++){
    var gy = chartY + (i / 4) * chartH;
    ctx.beginPath(); ctx.moveTo(chartX, gy); ctx.lineTo(chartX + chartW, gy); ctx.stroke();
    ctx.fillStyle = dc; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxVal * (1 - i / 4)), chartX - 6, gy + 4);
  }
  ctx.textAlign = 'left';

  // Round labels
  for(var i = 0; i < 12; i++){
    var lx = chartX + (i / 11) * chartW;
    ctx.fillStyle = dc; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('R' + (i+1), lx, chartY + chartH + 16);
  }
  ctx.textAlign = 'left';

  // Line chart
  ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 2.5;
  ctx.beginPath();
  for(var i = 0; i < 12; i++){
    var px = chartX + (i / 11) * chartW;
    var py = chartY + chartH - (rounds[i] / maxVal) * chartH;
    if(i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Data points
  for(var i = 0; i < 12; i++){
    var px = chartX + (i / 11) * chartW;
    var py = chartY + chartH - (rounds[i] / maxVal) * chartH;
    ctx.fillStyle = '#a855f7';
    ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI*2); ctx.fill();
    if(rounds[i] > 0){
      ctx.fillStyle = tc; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(rounds[i] + '', px, py - 10);
    }
  }
  ctx.textAlign = 'left';

  // Pro average line
  var proAvg = 75; // per round avg (900 / 12)
  var proY = chartY + chartH - (proAvg / maxVal) * chartH;
  ctx.strokeStyle = '#22c55e60'; ctx.lineWidth = 1.5;
  ctx.setLineDash([4,4]);
  ctx.beginPath(); ctx.moveTo(chartX, proY); ctx.lineTo(chartX + chartW, proY); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#22c55e'; ctx.font = '9px sans-serif';
  ctx.fillText('Pro Avg (' + proAvg + '/rd)', chartX + chartW - 80, proY - 6);

  // Cumulative total
  var cumulative = 0;
  ctx.fillStyle = tc; ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Cumulative: ' + total, 16, chartY + chartH + 36);
  var pace = total > 0 ? (total >= 800 ? 'Championship' : (total >= 500 ? 'Contender' : 'Amateur')) : 'Start Training';
  ctx.fillStyle = total >= 800 ? '#FFD700' : (total >= 500 ? '#22c55e' : dc);
  ctx.fillText('Pace: ' + pace, 200, chartY + chartH + 36);
}

// ============================================================
// 7. CORNER ADVICE SIMULATOR (Canvas 600x380)
// ============================================================
var CORNER_STRATEGIES = [
  { name: 'Body Attack', icon: '\u{1F4A5}', advice: 'Go downstairs! Work the body and slow them down. Jab to the body, hook to the liver.', situation: 'Opponent keeping high guard' },
  { name: 'Stick and Move', icon: '\u{1F3C3}', advice: 'Use your jab! Stay on the outside, don&#39;t let them get close. Circle and pot shot.', situation: 'Opponent is a pressure fighter' },
  { name: 'Clinch and Rest', icon: '\u{1F91D}', advice: 'Tie them up when they get close. You need to recover. Clinch and reset.', situation: 'Hurt or fatigued' },
  { name: 'Cut the Ring', icon: '\u{1F9ED}', advice: 'Stop chasing! Cut the ring off. Step to the side, not forward. Trap them on ropes.', situation: 'Opponent running away' },
  { name: 'Counter Punch', icon: '\u{1F3AF}', advice: 'Let them come to you. Time the right hand counter. Slip and fire back.', situation: 'Opponent overcommitting on punches' },
  { name: 'Double Jab Power', icon: '\u{1F94A}', advice: 'Double up that jab! Set up the right hand. Jab-jab-cross, keep it simple.', situation: 'Need to establish range' },
  { name: 'Head Movement', icon: '\u{1F9E0}', advice: 'Move your head! You&#39;re getting hit too clean. Slip, roll, make them miss.', situation: 'Taking too many clean shots' },
  { name: 'Finish Strong', icon: '\u{1F525}', advice: 'This is YOUR round! Empty the tank. Throw everything, leave it all in the ring!', situation: 'Championship rounds, close fight' }
];

function drawCornerAdvice(canvas, ctx){
  var dark = clearCanvas24(canvas, ctx);
  var tc = textColor24(dark), dc = dimColor24(dark);
  ctx.fillStyle = tc; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('\u{1F4E2} Corner Advice Simulator', 16, 28);

  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Advice Given: ' + v24.cornerAdvice.adviceGiven + ' | Rounds Scouted: ' + v24.cornerAdvice.roundsScouted, 16, 46);

  // Strategy cards (4x2 grid)
  var cardW = 130, cardH = 65, startX = 16, startY = 65, gap = 10;
  for(var i = 0; i < CORNER_STRATEGIES.length; i++){
    var cs = CORNER_STRATEGIES[i];
    var cx = startX + (i % 4) * (cardW + gap);
    var cy = startY + Math.floor(i / 4) * (cardH + gap);
    var used = v24.cornerAdvice.strategiesUsed['s' + i];

    ctx.fillStyle = used ? '#9333ea20' : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)');
    ctx.beginPath(); ctx.roundRect(cx, cy, cardW, cardH, 8); ctx.fill();
    ctx.strokeStyle = used ? '#9333ea' : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)');
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(cx, cy, cardW, cardH, 8); ctx.stroke();

    ctx.fillStyle = tc; ctx.font = 'bold 10px sans-serif';
    ctx.fillText(cs.name, cx + 8, cy + 16);
    ctx.fillStyle = dc; ctx.font = '8px sans-serif';
    var words = cs.situation.split(' ');
    var line1 = words.slice(0, Math.ceil(words.length/2)).join(' ');
    var line2 = words.slice(Math.ceil(words.length/2)).join(' ');
    ctx.fillText(line1, cx + 8, cy + 34);
    if(line2) ctx.fillText(line2, cx + 8, cy + 46);
    ctx.fillStyle = used ? '#9333ea' : dc; ctx.font = '8px sans-serif';
    ctx.fillText(used ? 'Used' : 'Ready', cx + 8, cy + 58);
  }

  // Current advice display (bottom)
  var adviceIdx = v24.cornerAdvice.adviceGiven % CORNER_STRATEGIES.length;
  var currentAdvice = CORNER_STRATEGIES[adviceIdx];

  ctx.fillStyle = dark ? 'rgba(147,51,234,0.1)' : 'rgba(147,51,234,0.08)';
  ctx.beginPath(); ctx.roundRect(16, 220, canvas.width - 32, 100, 10); ctx.fill();
  ctx.strokeStyle = '#9333ea50'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(16, 220, canvas.width - 32, 100, 10); ctx.stroke();

  ctx.fillStyle = tc; ctx.font = 'bold 12px sans-serif';
  ctx.fillText('Corner Says: ' + currentAdvice.name, 28, 244);
  ctx.fillStyle = dc; ctx.font = '11px sans-serif';
  var adviceWords = currentAdvice.advice.split(' ');
  var advLine = '';
  var advY = 264;
  for(var w = 0; w < adviceWords.length; w++){
    var test = advLine + adviceWords[w] + ' ';
    if(ctx.measureText(test).width > canvas.width - 72){
      ctx.fillText(advLine, 28, advY);
      advLine = adviceWords[w] + ' ';
      advY += 16;
    } else {
      advLine = test;
    }
  }
  if(advLine) ctx.fillText(advLine, 28, advY);

  ctx.fillStyle = '#9333ea'; ctx.font = '9px sans-serif';
  ctx.fillText('Situation: ' + currentAdvice.situation, 28, 308);

  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('AI corner man giving tactical advice between rounds', 16, canvas.height - 12);
}

// ============================================================
// 8. BOXING CONDITIONING CIRCUIT (Canvas 620x400)
// ============================================================
var CIRCUIT_EXERCISES = [
  { name: 'Burpees', duration: 45 },
  { name: 'Mountain Climbers', duration: 45 },
  { name: 'Jump Rope', duration: 60 },
  { name: 'Shadow Boxing', duration: 60 },
  { name: 'Speed Bag', duration: 45 },
  { name: 'Heavy Bag', duration: 60 },
  { name: 'Push-ups', duration: 30 },
  { name: 'Sit-ups', duration: 30 },
  { name: 'Plank', duration: 45 },
  { name: 'High Knees', duration: 30 },
  { name: 'Box Jumps', duration: 30 },
  { name: 'Lateral Shuffles', duration: 45 }
];

function drawCondCircuit(canvas, ctx){
  var dark = clearCanvas24(canvas, ctx);
  var tc = textColor24(dark), dc = dimColor24(dark);
  ctx.fillStyle = tc; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('\u{1F3CB}\u{FE0F} Boxing Conditioning Circuit', 16, 28);

  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Completed Circuits: ' + v24.condCircuit.completedCircuits + ' | Total Time: ' + Math.floor(v24.condCircuit.totalTime/60) + ' min', 16, 46);

  // 12-station circular layout
  var ccx = 200, ccy = 230, cr = 130;
  for(var i = 0; i < 12; i++){
    var angle = -Math.PI/2 + (i / 12) * Math.PI * 2;
    var sx = ccx + Math.cos(angle) * cr;
    var sy = ccy + Math.sin(angle) * cr;
    var done = v24.condCircuit.stations[i] > 0;
    var nodeR = 26;

    // Station circle
    ctx.fillStyle = done ? '#22c55e20' : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)');
    ctx.beginPath(); ctx.arc(sx, sy, nodeR, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = done ? '#22c55e' : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)');
    ctx.lineWidth = done ? 2 : 1;
    ctx.beginPath(); ctx.arc(sx, sy, nodeR, 0, Math.PI*2); ctx.stroke();

    // Station number
    ctx.fillStyle = done ? '#22c55e' : tc;
    ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText((i+1) + '', sx, sy - 2);

    // Exercise name (abbreviated)
    ctx.fillStyle = dc; ctx.font = '7px sans-serif';
    var shortName = CIRCUIT_EXERCISES[i].name.split(' ')[0];
    ctx.fillText(shortName, sx, sy + 10);

    // Connector line to next
    if(i < 11){
      var nextAngle = -Math.PI/2 + ((i+1) / 12) * Math.PI * 2;
      var nx = ccx + Math.cos(nextAngle) * cr;
      var ny = ccy + Math.sin(nextAngle) * cr;
      ctx.strokeStyle = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx + Math.cos(nextAngle - Math.PI) * (-nodeR + 2), sy + Math.sin(nextAngle - Math.PI) * (-nodeR + 2));
      ctx.lineTo(nx + Math.cos(angle + Math.PI) * (-nodeR + 2), ny + Math.sin(angle + Math.PI) * (-nodeR + 2));
      ctx.stroke();
    }
  }
  ctx.textAlign = 'left';

  // Center info
  var stationsDone = v24.condCircuit.stations.filter(function(s){return s>0;}).length;
  ctx.fillStyle = tc; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(stationsDone + '/12', ccx, ccy - 8);
  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Stations', ccx, ccy + 10);
  ctx.textAlign = 'left';

  // Exercise detail list (right side)
  ctx.fillStyle = tc; ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Circuit Stations', 380, 70);
  for(var i = 0; i < CIRCUIT_EXERCISES.length; i++){
    var ex = CIRCUIT_EXERCISES[i];
    var done = v24.condCircuit.stations[i] > 0;
    ctx.fillStyle = done ? '#22c55e' : dc;
    ctx.font = '9px sans-serif';
    ctx.fillText((done ? '✓ ' : '  ') + (i+1) + '. ' + ex.name, 380, 88 + i * 18);
    ctx.fillStyle = dc;
    ctx.fillText(ex.duration + 's', 540, 88 + i * 18);
  }

  // Completion stats
  var totalDuration = CIRCUIT_EXERCISES.reduce(function(a,e){return a+e.duration;},0);
  ctx.fillStyle = tc; ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Circuit Time: ' + Math.floor(totalDuration/60) + ':' + (totalDuration%60<10?'0':'') + totalDuration%60, 380, 320);
  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('Sessions: ' + v24.condCircuit.sessions, 380, 338);

  var gr = gradeV24((stationsDone / 12) * 100);
  ctx.fillStyle = gr.c; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Grade: ' + gr.g, 380, 365);

  ctx.fillStyle = dc; ctx.font = '10px sans-serif';
  ctx.fillText('12-station boxing conditioning circuit', 16, canvas.height - 12);
}

// ============================================================
// QUIZ V24 - 15 NEW QUESTIONS (225 -> 240)
// ============================================================
var QUIZ_V24 = [
  { q: 'A punch combination DNA refers to what concept?', opts: ['Genetic testing','A fighter&#39;s unique combo pattern signature','Blood type analysis','A training machine'], a: 1 },
  { q: 'Which stance is known for its high guard with hands beside cheeks?', opts: ['Orthodox','Philly Shell','Peek-a-boo','Square'], a: 2 },
  { q: 'In a standard professional bout, how long is each round?', opts: ['2 minutes','3 minutes','4 minutes','5 minutes'], a: 1 },
  { q: 'Which muscle group recovers fastest after boxing training?', opts: ['Quads (48h)','Lats (48h)','Deltoids (24h)','Glutes (48h)'], a: 2 },
  { q: 'What is an inside tie in clinch fighting?', opts: ['Tying your shoes inside','Controlling opponent inside biceps','A belt technique','A type of punch'], a: 1 },
  { q: 'Pro boxers typically throw how many punches in a 12-round fight?', opts: ['200-400','500-600','800-1000','1500-2000'], a: 2 },
  { q: 'What should a corner man advise when a fighter is hurt?', opts: ['Keep attacking','Clinch and recover','Drop your guard','Give up'], a: 1 },
  { q: 'Which exercise is a staple of boxing conditioning?', opts: ['Yoga only','Jump rope','Chess','Bowling'], a: 1 },
  { q: 'The Philly Shell defense was popularized by which fighter?', opts: ['Mike Tyson','Manny Pacquiao','Floyd Mayweather Jr.','Rocky Balboa'], a: 2 },
  { q: 'What does punch volume mean in boxing analytics?', opts: ['How loud punches are','Total number of punches thrown','Weight of gloves','Ring size'], a: 1 },
  { q: 'A southpaw fighter leads with which hand?', opts: ['Left hand','Right hand','Both hands','Neither'], a: 1 },
  { q: 'What is dirty boxing?', opts: ['Not washing gloves','Fighting with illegal moves only','Close-range punches in the clinch','Boxing in mud'], a: 2 },
  { q: 'The rest period between rounds in professional boxing is?', opts: ['30 seconds','1 minute','2 minutes','3 minutes'], a: 1 },
  { q: 'Mountain climbers in boxing conditioning primarily work which area?', opts: ['Biceps only','Core and cardio','Neck muscles','Fingers'], a: 1 },
  { q: 'What is ring cutting in boxing strategy?', opts: ['Cutting the canvas','Trapping opponent by cutting off angles','A razor technique','Circular footwork only'], a: 1 }
];

// ============================================================
// ACHIEVEMENTS V24 - 12 NEW (202 -> 214)
// ============================================================
var ACHIEV_V24 = [
  { id: 'dna_analyst', name: 'DNA Analyst', desc: 'Scan 15 combo DNA patterns', check: function(){ return v24.comboDNA.totalScans >= 15; } },
  { id: 'stance_scholar', name: 'Stance Scholar', desc: 'Compare all 8 fighter stances', check: function(){ return v24.stanceComp.comparisons >= 8; } },
  { id: 'timer_warrior', name: 'Timer Warrior', desc: 'Complete 12 timed rounds', check: function(){ return v24.roundTimer.roundsCompleted >= 12; } },
  { id: 'muscle_mapper', name: 'Muscle Mapper', desc: 'Track fatigue for all 10 muscle groups', check: function(){ var m=v24.muscleFatigue.muscles; return MUSCLES.every(function(mu){return (m[mu.key]||0)>0;}); } },
  { id: 'clinch_master', name: 'Clinch Master', desc: 'Train all 8 clinch techniques', check: function(){ var t=v24.clinchLib.techniques; return CLINCH_TECHNIQUES.every(function(ct){return (t[ct.key]||0)>0;}); } },
  { id: 'volume_king', name: 'Volume King', desc: 'Throw 500 total punches', check: function(){ return v24.punchVolume.totalPunches >= 500; } },
  { id: 'corner_listener', name: 'Corner Listener', desc: 'Receive 20 corner advice sessions', check: function(){ return v24.cornerAdvice.adviceGiven >= 20; } },
  { id: 'circuit_complete', name: 'Circuit Complete', desc: 'Complete all 12 circuit stations', check: function(){ return v24.condCircuit.stations.every(function(s){return s>0;}); } },
  { id: 'quiz_v24_ace', name: 'Quiz v24 Ace', desc: 'Score S rank on v24 quiz', check: function(){ var s=v24.quizV24Scores; var c=0; for(var k in s){ if(s[k]===true) c++; } return c >= 14; } },
  { id: 'v24_explorer', name: 'v24 Explorer', desc: 'Open all 8 v24 features', check: function(){ return Object.keys(v24.featureUsage24).length >= 8; } },
  { id: 'endurance_beast', name: 'Endurance Beast', desc: 'Complete 5 full conditioning circuits', check: function(){ return v24.condCircuit.completedCircuits >= 5; } },
  { id: 'v24_legend', name: 'v24 Legend', desc: 'Earn 10+ v24 achievements', check: function(){ return Object.keys(v24.achievementsV24).filter(function(k){return v24.achievementsV24[k];}).length >= 10; } }
];

function checkAchievementsV24(){
  var newUnlocks = [];
  ACHIEV_V24.forEach(function(a){
    if(!v24.achievementsV24[a.id] && a.check()){
      v24.achievementsV24[a.id] = true;
      newUnlocks.push(a.name);
    }
  });
  if(newUnlocks.length > 0){
    saveV24(v24);
    playSFX24('achieve_v24');
  }
  return newUnlocks;
}

// ============================================================
// UI BUILDER - SECTION PANELS
// ============================================================
function buildV24Section(id, title, emoji, drawFn, canvasW, canvasH, actions){
  var sec = document.createElement('div');
  sec.className = 'v24-card';
  sec.id = 'v24-sec-' + id;
  sec.style.cssText = 'display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(95vw,680px);max-height:90vh;overflow-y:auto;z-index:5300;padding:16px;';

  var hdr = document.createElement('div');
  hdr.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;';
  hdr.innerHTML = '<div class="v24-hdr">' + emoji + ' ' + title + '</div>';
  var closeBtn = document.createElement('button');
  closeBtn.className = 'v24-btn-sec';
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
    btn.className = act.primary ? 'v24-btn' : 'v24-btn-sec';
    btn.textContent = act.label;
    btn.onclick = function(){
      act.fn();
      drawFn(canvas, canvas.getContext('2d'));
      saveV24(v24);
      checkAchievementsV24();
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
var sec1 = buildV24Section('comboDNA', 'Punch Combination DNA Analyzer', '\u{1F9EC}', drawComboDNA, 620, 400, [
  { label: '\u{1F9EC} Scan Pattern', primary: true, fn: function(){
    var idx = Math.floor(Math.random() * 12);
    v24.comboDNA.patterns[idx]++;
    v24.comboDNA.totalScans++;
    v24.comboDNA.sessions++;
    playSFX24('dna_scan');
  }},
  { label: '\u{1F50D} Detect Signature', fn: function(){
    var maxIdx = 0, maxVal = 0;
    v24.comboDNA.patterns.forEach(function(p,i){ if(p > maxVal){ maxVal = p; maxIdx = i; } });
    v24.comboDNA.signatureCombo = DNA_COMBOS[maxIdx].name;
    playSFX24('dna_match');
  }},
  { label: '\u{1F504} Reset', fn: function(){ v24.comboDNA = defV24().comboDNA; }}
]);

var sec2 = buildV24Section('stanceComp', 'Fighter Stance Comparison', '\u{1F94B}', drawStanceComparison, 600, 380, [
  { label: '\u{1F504} Next Stance A', primary: true, fn: function(){
    stanceSelA = (stanceSelA + 1) % STANCES.length;
    v24.stanceComp.stances[STANCES[stanceSelA].key]++;
    v24.stanceComp.comparisons++;
    playSFX24('stance_switch');
  }},
  { label: '\u{1F504} Next Stance B', fn: function(){
    stanceSelB = (stanceSelB + 1) % STANCES.length;
    v24.stanceComp.stances[STANCES[stanceSelB].key]++;
    v24.stanceComp.sessions++;
    playSFX24('stance_switch');
  }},
  { label: '\u{1F504} Reset', fn: function(){ v24.stanceComp = defV24().stanceComp; stanceSelA=0; stanceSelB=1; }}
]);

var sec3 = buildV24Section('roundTimer', 'Boxing Round Timer Pro', '\u{23F1}\u{FE0F}', drawRoundTimer, 580, 360, [
  { label: '\u{1F514} Complete Round', primary: true, fn: function(){
    var cfg = v24.roundTimer.roundConfig;
    if(v24.roundTimer.roundsCompleted < cfg.rounds){
      v24.roundTimer.roundsCompleted++;
      v24.roundTimer.totalTime += cfg.roundMin * 60 + cfg.restSec;
      var intensity = 40 + Math.floor(Math.random() * 55);
      v24.roundTimer.intensityLog.push(intensity);
      if(v24.roundTimer.intensityLog.length > 12) v24.roundTimer.intensityLog.shift();
    }
    playSFX24('timer_bell');
  }},
  { label: '\u{2795} Config 12R', fn: function(){ v24.roundTimer.roundConfig = {rounds:12,roundMin:3,restSec:60}; v24.roundTimer.roundsCompleted=0; v24.roundTimer.intensityLog=[]; playSFX24('timer_tick'); }},
  { label: '\u{1F504} Reset', fn: function(){ v24.roundTimer = defV24().roundTimer; }}
]);

var sec4 = buildV24Section('muscleFatigue', 'Muscle Fatigue Recovery Map', '\u{1F4AA}', drawMuscleFatigue, 620, 380, [
  { label: '\u{1F3CB}\u{FE0F} Train Session', primary: true, fn: function(){
    MUSCLES.forEach(function(m){
      v24.muscleFatigue.muscles[m.key] = Math.min(100, (v24.muscleFatigue.muscles[m.key]||0) + Math.floor(Math.random()*25) + 5);
    });
    v24.muscleFatigue.sessions++;
    playSFX24('fatigue_warn');
  }},
  { label: '\u{1F49A} Recovery', fn: function(){
    MUSCLES.forEach(function(m){
      v24.muscleFatigue.muscles[m.key] = Math.max(0, (v24.muscleFatigue.muscles[m.key]||0) - Math.floor(Math.random()*20) - 10);
    });
    playSFX24('fatigue_recover');
  }},
  { label: '\u{1F504} Reset', fn: function(){ v24.muscleFatigue = defV24().muscleFatigue; }}
]);

var sec5 = buildV24Section('clinchLib', 'Clinch Technique Library', '\u{1F91C}', drawClinchLibrary, 600, 380, [
  { label: '\u{1F94A} Drill Technique', primary: true, fn: function(){
    var tech = CLINCH_TECHNIQUES[clinchSel];
    v24.clinchLib.techniques[tech.key] = (v24.clinchLib.techniques[tech.key]||0) + 1;
    v24.clinchLib.drillsDone++;
    v24.clinchLib.sessions++;
    playSFX24('clinch_grab');
  }},
  { label: '\u{1F504} Next Technique', fn: function(){
    clinchSel = (clinchSel + 1) % CLINCH_TECHNIQUES.length;
    playSFX24('clinch_break');
  }},
  { label: '\u{1F504} Reset', fn: function(){ v24.clinchLib = defV24().clinchLib; clinchSel=0; }}
]);

var sec6 = buildV24Section('punchVolume', 'Punch Volume Tracker', '\u{1F4CA}', drawPunchVolume, 620, 380, [
  { label: '\u{1F94A} Simulate Fight', primary: true, fn: function(){
    for(var i = 0; i < 12; i++){
      var punches = 40 + Math.floor(Math.random() * 50);
      v24.punchVolume.rounds[i] += punches;
      v24.punchVolume.totalPunches += punches;
    }
    v24.punchVolume.sessions++;
    v24.punchVolume.perMinRate = (v24.punchVolume.totalPunches / (v24.punchVolume.sessions * 36)).toFixed(1);
    playSFX24('volume_punch');
  }},
  { label: '\u{1F504} Reset', fn: function(){ v24.punchVolume = defV24().punchVolume; }}
]);

var sec7 = buildV24Section('cornerAdvice', 'Corner Advice Simulator', '\u{1F4E2}', drawCornerAdvice, 600, 380, [
  { label: '\u{1F4E2} Get Advice', primary: true, fn: function(){
    v24.cornerAdvice.adviceGiven++;
    var idx = v24.cornerAdvice.adviceGiven % CORNER_STRATEGIES.length;
    v24.cornerAdvice.strategiesUsed['s' + idx] = true;
    v24.cornerAdvice.roundsScouted++;
    playSFX24('corner_advice');
  }},
  { label: '\u{1F504} Reset', fn: function(){ v24.cornerAdvice = defV24().cornerAdvice; }}
]);

var sec8 = buildV24Section('condCircuit', 'Boxing Conditioning Circuit', '\u{1F3CB}\u{FE0F}', drawCondCircuit, 620, 400, [
  { label: '\u{1F3CB}\u{FE0F} Do Station', primary: true, fn: function(){
    var next = v24.condCircuit.stations.indexOf(0);
    if(next === -1){
      v24.condCircuit.completedCircuits++;
      v24.condCircuit.stations = Array(12).fill(0);
      next = 0;
      playSFX24('circuit_done');
    }
    v24.condCircuit.stations[next]++;
    v24.condCircuit.totalTime += CIRCUIT_EXERCISES[next].duration;
    v24.condCircuit.sessions++;
    playSFX24('circuit_start');
  }},
  { label: '\u{1F504} Reset', fn: function(){ v24.condCircuit = defV24().condCircuit; }}
]);

// ============================================================
// QUIZ V24 SECTION
// ============================================================
function buildQuizV24(){
  var sec = document.createElement('div');
  sec.className = 'v24-card';
  sec.id = 'v24-sec-quizV24';
  sec.style.cssText = 'display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(95vw,600px);max-height:90vh;overflow-y:auto;z-index:5300;padding:16px;';

  var hdr = document.createElement('div');
  hdr.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;';
  hdr.innerHTML = '<div class="v24-hdr">\u{1F4DD} Boxing Quiz v24 (15Q)</div>';
  var closeBtn = document.createElement('button');
  closeBtn.className = 'v24-btn-sec'; closeBtn.textContent = '✕';
  closeBtn.onclick = function(){ sec.style.display = 'none'; };
  hdr.appendChild(closeBtn);
  sec.appendChild(hdr);

  var qContainer = document.createElement('div');
  qContainer.id = 'v24-quiz-container';
  sec.appendChild(qContainer);
  document.body.appendChild(sec);

  function renderQuiz(){
    qContainer.innerHTML = '';
    var correct = 0, total = 0;
    QUIZ_V24.forEach(function(q, idx){
      var qDiv = document.createElement('div');
      qDiv.style.cssText = 'margin-bottom:14px;padding:10px;border-radius:10px;background:var(--surface,rgba(255,255,255,0.04));';
      var answered = v24.quizV24Scores['q' + idx] !== undefined;
      var isCorrect = v24.quizV24Scores['q' + idx] === true;
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
          if(oi !== q.a && v24.quizV24Scores['q' + idx + '_ans'] === oi) btn.style.borderColor = '#ef4444';
          btn.disabled = true;
        } else {
          btn.onclick = function(){
            v24.quizV24Scores['q' + idx] = (oi === q.a);
            v24.quizV24Scores['q' + idx + '_ans'] = oi;
            saveV24(v24);
            playSFX24(oi === q.a ? 'quiz_v24' : 'quiz_wrong_v24');
            checkAchievementsV24();
            renderQuiz();
          };
        }
        qDiv.appendChild(btn);
      });
      qContainer.appendChild(qDiv);
    });

    var scoreDiv = document.createElement('div');
    scoreDiv.style.cssText = 'text-align:center;padding:10px;font-size:13px;font-weight:700;color:var(--text,#f0f0f0);';
    scoreDiv.textContent = 'Score: ' + correct + '/' + total + (total === 15 ? ' (' + gradeV24((correct/15)*100).g + ')' : '');
    qContainer.appendChild(scoreDiv);
  }
  renderQuiz();
  return sec;
}
var secQuiz = buildQuizV24();

// ============================================================
// NAVIGATION - APPEND TO EXISTING BOTTOM BAR
// ============================================================
function addV24Nav(){
  var features = [
    { id: 'comboDNA', label: '\u{1F9EC} DNA', sec: sec1 },
    { id: 'stanceComp', label: '\u{1F94B} Stance', sec: sec2 },
    { id: 'roundTimer', label: '\u{23F1}\u{FE0F} Timer', sec: sec3 },
    { id: 'muscleFatigue', label: '\u{1F4AA} Muscle', sec: sec4 },
    { id: 'clinchLib', label: '\u{1F91C} Clinch', sec: sec5 },
    { id: 'punchVolume', label: '\u{1F4CA} Volume', sec: sec6 },
    { id: 'cornerAdvice', label: '\u{1F4E2} Corner', sec: sec7 },
    { id: 'condCircuit', label: '\u{1F3CB}\u{FE0F} Circuit', sec: sec8 },
    { id: 'quizV24', label: '\u{1F4DD} Quiz24', sec: secQuiz }
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
    btn.style.cssText = 'padding:6px 10px;background:linear-gradient(135deg,rgba(147,51,234,0.15),rgba(107,33,168,0.15));border:1px solid rgba(147,51,234,0.3);border-radius:8px;color:#a855f7;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .2s;flex-shrink:0;';
    btn.textContent = f.label;
    btn.onclick = function(){
      document.querySelectorAll('[id^="v24-sec-"]').forEach(function(s){ s.style.display = 'none'; });
      f.sec.style.display = 'block';
      v24.featureUsage24[f.id] = true;
      saveV24(v24);
      checkAchievementsV24();
    };
    if(navWrap) navWrap.appendChild(btn);
  });
}

// ============================================================
// KEYBOARD SHORTCUTS (Shift+Q/W/E/R/T/Y/U/I for 8 features, Shift+9 for quiz)
// ============================================================
document.addEventListener('keydown', function(e){
  if(!e.shiftKey) return;
  var sections = [sec1, sec2, sec3, sec4, sec5, sec6, sec7, sec8, secQuiz];
  var keys = ['Q','W','E','R','T','Y','U','I','9'];
  var featureIds = ['comboDNA','stanceComp','roundTimer','muscleFatigue','clinchLib','punchVolume','cornerAdvice','condCircuit','quizV24'];
  var idx = keys.indexOf(e.key.toUpperCase());
  if(idx === -1 && e.key === '(') idx = 8;
  if(idx >= 0 && idx < sections.length){
    e.preventDefault();
    document.querySelectorAll('[id^="v24-sec-"]').forEach(function(s){ s.style.display = 'none'; });
    sections[idx].style.display = 'block';
    v24.featureUsage24[featureIds[idx]] = true;
    saveV24(v24);
    checkAchievementsV24();
  }
});

// ============================================================
// INIT
// ============================================================
setTimeout(function(){
  addV24Nav();
  checkAchievementsV24();
}, 500);

})();
