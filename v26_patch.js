// Boxing Trainer Pro v26_patch.js - NEXTERA+PRISM Auto Enhancement Module
// 1. Punch Accuracy Progression Canvas 620x400 - 9-zone body target accuracy tracking, 30-session line chart, S~D grade
// 2. Fight Camp Periodization Planner Canvas 620x380 - 16-week 4-phase macro cycle, weekly volume bar chart, readiness gauge
// 3. Defensive Reaction Matrix Canvas 620x400 - 8 attack types x 6 defense responses heatmap, drill counter, success rate
// 4. Punch Biomechanics Analyzer Canvas 600x380 - 7 punch types, kinetic chain 6-segment force flow, technique score
// 5. Sparring Performance Radar Canvas 620x400 - 8-axis radar (offense/defense/footwork/stamina/ring IQ/power/speed/chin), session comparison
// 6. Training Load Monitor Canvas 600x380 - RPE/volume/intensity acute:chronic workload ratio, injury risk gauge
// 7. Boxing Nutrition Periodizer Canvas 620x400 - Fight week 7-day meal plan, macro breakdown donut, hydration tracker
// 8. Ring Generalship Analyzer Canvas 620x380 - 8 ring control tactics, zone dominance heatmap, tactical IQ score
// Quiz +15 (255->270), +12 Achievements (226->238), SFX 16, Keyboard +9
(function(){
'use strict';

var V26KEY = 'boxingV26Patch';

function loadV26(){
  try {
    var r = localStorage.getItem(V26KEY);
    if(!r) return defV26();
    var p = JSON.parse(r), d = defV26();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV26(); }
}
function saveV26(d){ try { localStorage.setItem(V26KEY, JSON.stringify(d)); } catch(e){} }
function defV26(){
  return {
    punchAccuracy: { zones: {head_l:0,head_c:0,head_r:0,body_l:0,body_c:0,body_r:0,low_l:0,low_c:0,low_r:0}, sessions: [], bestGrade: 'D', totalShots: 0 },
    campPlan: { currentWeek: 1, phase: 'base', weeklyVolume: Array(16).fill(0), readiness: 75, completedWeeks: 0 },
    defMatrix: { matrix: {}, drills: 0, successRate: 0, totalAttempts: 0 },
    biomech: { punches: {jab:0,cross:0,leadHook:0,rearHook:0,leadUpper:0,rearUpper:0,overhand:0}, chainScores: {}, techScore: 0, sessions: 0 },
    sparRadar: { axes: {offense:50,defense:50,footwork:50,stamina:50,ringIQ:50,power:50,speed:50,chin:50}, prevAxes: null, sessions: 0, bestGrade: 'D' },
    trainLoad: { acuteLoad: [], chronicLoad: 0, ratio: 0, riskLevel: 'low', sessions: 0 },
    nutrition: { dayPlans: {}, macros: {protein:0,carbs:0,fat:0}, hydration: 0, adherence: 0, sessions: 0 },
    ringGen: { tactics: {cutOff:0,cornerTrap:0,jab:0,distance:0,pressure:0,counter:0,clinch:0,angles:0}, zoneDominance: {}, iq: 0, sessions: 0 },
    quizV26Scores: {},
    achievementsV26: {},
    featureUsage26: {}
  };
}

var v26 = loadV26();

// ===== CSS =====
var st26 = document.createElement('style');
st26.textContent = '.v26-btn{padding:8px 16px;background:linear-gradient(135deg,#7c3aed,#6d28d9);border:none;border-radius:10px;color:#fff;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s}.v26-btn:hover{filter:brightness(1.15);transform:scale(1.03)}.v26-btn-sec{padding:8px 16px;background:var(--surface,rgba(255,255,255,0.04));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:10px;color:var(--text-dim,#8a8a9e);font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.v26-btn-sec:hover{border-color:#7c3aed;color:#a78bfa}.v26-card{background:var(--glass,rgba(255,255,255,0.06));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:var(--radius,16px);padding:16px;margin-bottom:12px}.v26-hdr{font-size:15px;font-weight:800;margin-bottom:10px;display:flex;align-items:center;gap:8px}.v26-sub{font-size:11px;color:var(--text-dim,#8a8a9e);margin-bottom:8px}';
document.head.appendChild(st26);

// ===== SFX ENGINE V26 =====
function playSFX26(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'accuracy_hit':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(660,t);o.frequency.exponentialRampToValueAtTime(880,t+0.08);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.12);break;
      case 'accuracy_miss':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sawtooth';
        o.frequency.setValueAtTime(200,t);o.frequency.exponentialRampToValueAtTime(100,t+0.15);
        g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.18);break;
      case 'camp_phase':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(440,t);o.frequency.setValueAtTime(554,t+0.06);o.frequency.setValueAtTime(659,t+0.12);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.2);break;
      case 'camp_complete':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(523,t);o.frequency.setValueAtTime(659,t+0.05);o.frequency.setValueAtTime(784,t+0.1);o.frequency.setValueAtTime(1047,t+0.15);
        g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.25);break;
      case 'defense_block':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='square';
        o.frequency.setValueAtTime(330,t);o.frequency.exponentialRampToValueAtTime(220,t+0.08);
        g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.1);break;
      case 'defense_evade':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';
        o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(440,t+0.12);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.15);break;
      case 'biomech_scan':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(392,t);o.frequency.linearRampToValueAtTime(784,t+0.2);
        g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.22);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.22);break;
      case 'biomech_chain':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';
        o.frequency.setValueAtTime(262,t);o.frequency.setValueAtTime(330,t+0.04);o.frequency.setValueAtTime(392,t+0.08);o.frequency.setValueAtTime(523,t+0.12);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.18);break;
      case 'radar_update':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(554,t);o.frequency.exponentialRampToValueAtTime(740,t+0.1);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.14);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.14);break;
      case 'load_warn':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sawtooth';
        o.frequency.setValueAtTime(440,t);o.frequency.setValueAtTime(330,t+0.06);o.frequency.setValueAtTime(440,t+0.12);
        g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.18);break;
      case 'load_ok':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(523,t);o.frequency.setValueAtTime(659,t+0.08);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.12);break;
      case 'nutrition_plan':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';
        o.frequency.setValueAtTime(494,t);o.frequency.setValueAtTime(587,t+0.06);
        g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.1);break;
      case 'nutrition_hydrate':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(784,t);o.frequency.exponentialRampToValueAtTime(1568,t+0.06);
        g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.08);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.08);break;
      case 'ring_control':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='square';
        o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(440,t+0.1);
        g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.14);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.14);break;
      case 'quiz26':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(659,t);o.frequency.setValueAtTime(784,t+0.06);o.frequency.setValueAtTime(1047,t+0.12);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.18);break;
      case 'achieve26':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(523,t);o.frequency.setValueAtTime(659,t+0.06);o.frequency.setValueAtTime(784,t+0.12);o.frequency.setValueAtTime(1047,t+0.18);
        g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.3);break;
    }
    setTimeout(function(){ ctx.close(); }, 500);
  } catch(e){}
}

// ===== UTILITY =====
var cl = {bg:'#0f0a1e',surface:'rgba(255,255,255,0.06)',border:'rgba(255,255,255,0.1)',accent:'#a855f7',accentSoft:'rgba(168,85,247,0.2)',text:'#f0f0f0',dim:'#8a8a9e',muted:'#5a5a6e',red:'#ef4444',green:'#22c55e',blue:'#3b82f6',gold:'#FFD700',orange:'#f97316',purple:'#a855f7',cyan:'#06b6d4',pink:'#ec4899'};

function grade(pct){ return pct>=95?'S':pct>=85?'A':pct>=70?'B':pct>=50?'C':'D'; }
function gradeColor(g){ return g==='S'?cl.gold:g==='A'?cl.green:g==='B'?cl.blue:g==='C'?cl.orange:cl.red; }

// ============================================================
// 1. PUNCH ACCURACY PROGRESSION Canvas 620x400
// ============================================================
var sec1 = document.createElement('div');
sec1.id = 'v26-sec-accuracy';
sec1.className = 'v26-card';
sec1.style.display = 'none';
sec1.innerHTML = '<div class="v26-hdr">&#127919; &#54144;&#52824; &#51221;&#54869;&#46020; &#54532;&#47196;&#44536;&#47112;&#49496;</div><div class="v26-sub">9&#51316; &#48148;&#46356; &#53440;&#44191; &#51221;&#54869;&#46020; &#52628;&#51201; &amp; 30&#49464;&#49496; &#53944;&#47116;&#46300;</div><canvas id="v26-c-accuracy" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#0d0d1a;cursor:pointer"></canvas><div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button class="v26-btn" onclick="window._v26AccuracyDrill()">&#53440;&#44191; &#46300;&#47540;</button><button class="v26-btn-sec" onclick="window._v26AccuracyReset()">&#47532;&#49483;</button></div>';
document.body.appendChild(sec1);

function drawAccuracyCanvas(){
  var c = document.getElementById('v26-c-accuracy');
  if(!c) return;
  var x = c.getContext('2d'), W = 620, H = 400;
  x.clearRect(0,0,W,H);
  x.fillStyle = '#0d0d1a'; x.fillRect(0,0,W,H);

  x.fillStyle = cl.accent; x.font = 'bold 14px sans-serif';
  x.fillText('Punch Accuracy Progression', 20, 30);

  var zones = ['Head L','Head C','Head R','Body L','Body C','Body R','Low L','Low C','Low R'];
  var zoneKeys = ['head_l','head_c','head_r','body_l','body_c','body_r','low_l','low_c','low_r'];
  var maxVal = 1;
  zoneKeys.forEach(function(k){ if(v26.punchAccuracy.zones[k] > maxVal) maxVal = v26.punchAccuracy.zones[k]; });

  // Body silhouette with 9 zones (3x3 grid)
  var bx = 60, by = 60, bw = 180, bh = 260;
  x.strokeStyle = cl.border; x.lineWidth = 2;
  // Head outline
  x.beginPath(); x.ellipse(bx+bw/2, by+40, 30, 35, 0, 0, Math.PI*2); x.stroke();
  // Body outline
  x.beginPath(); x.moveTo(bx+bw/2-30, by+75); x.lineTo(bx+20, by+bh-40);
  x.lineTo(bx+bw/2-15, by+bh); x.lineTo(bx+bw/2, by+bh-20);
  x.lineTo(bx+bw/2+15, by+bh); x.lineTo(bx+bw-20, by+bh-40);
  x.lineTo(bx+bw/2+30, by+75); x.closePath(); x.stroke();

  // 3x3 zone grid
  var cellW = bw/3, cellH = bh/3;
  for(var r=0; r<3; r++){
    for(var cc=0; cc<3; cc++){
      var idx = r*3+cc;
      var val = v26.punchAccuracy.zones[zoneKeys[idx]];
      var pct = maxVal > 0 ? val/maxVal : 0;
      var alpha = 0.1 + pct * 0.6;
      x.fillStyle = 'rgba(168,85,247,'+alpha+')';
      x.fillRect(bx+cc*cellW+2, by+r*cellH+2, cellW-4, cellH-4);
      x.strokeStyle = 'rgba(168,85,247,0.4)'; x.lineWidth = 1;
      x.strokeRect(bx+cc*cellW+2, by+r*cellH+2, cellW-4, cellH-4);
      x.fillStyle = val > 0 ? cl.text : cl.muted;
      x.font = 'bold 11px sans-serif';
      x.textAlign = 'center';
      x.fillText(val, bx+cc*cellW+cellW/2, by+r*cellH+cellH/2-6);
      x.font = '9px sans-serif'; x.fillStyle = cl.dim;
      x.fillText(zones[idx], bx+cc*cellW+cellW/2, by+r*cellH+cellH/2+8);
    }
  }
  x.textAlign = 'left';

  // Session trend line chart (right side)
  var sessions = v26.punchAccuracy.sessions.slice(-30);
  if(sessions.length > 1){
    var cx2 = 290, cy2 = 60, cw = 300, ch2 = 140;
    x.fillStyle = cl.dim; x.font = 'bold 11px sans-serif';
    x.fillText('30-Session Accuracy Trend', cx2, cy2-8);
    x.strokeStyle = cl.border; x.lineWidth = 1;
    x.strokeRect(cx2, cy2, cw, ch2);
    var sMax = Math.max.apply(null, sessions.map(function(s){return s.pct;}))||100;
    x.beginPath(); x.strokeStyle = cl.accent; x.lineWidth = 2;
    sessions.forEach(function(s,i){
      var px = cx2 + (i/(sessions.length-1))*cw;
      var py = cy2 + ch2 - (s.pct/sMax)*ch2;
      if(i===0) x.moveTo(px,py); else x.lineTo(px,py);
    });
    x.stroke();
    // Fill area
    x.lineTo(cx2+(sessions.length-1)/(sessions.length-1)*cw, cy2+ch2);
    x.lineTo(cx2, cy2+ch2);
    x.closePath();
    x.fillStyle = 'rgba(168,85,247,0.1)'; x.fill();
    // Labels
    x.fillStyle = cl.muted; x.font = '9px sans-serif';
    x.fillText('Session 1', cx2, cy2+ch2+12);
    x.textAlign = 'right';
    x.fillText('Session '+sessions.length, cx2+cw, cy2+ch2+12);
    x.textAlign = 'left';
  }

  // Overall stats
  var totalShots = v26.punchAccuracy.totalShots;
  var avgPct = sessions.length > 0 ? Math.round(sessions.reduce(function(a,s){return a+s.pct;},0)/sessions.length) : 0;
  var g = grade(avgPct);

  x.fillStyle = cl.dim; x.font = 'bold 11px sans-serif';
  x.fillText('Total Shots: '+totalShots, 290, 240);
  x.fillText('Sessions: '+sessions.length, 290, 258);
  x.fillText('Avg Accuracy: '+avgPct+'%', 290, 276);
  x.fillStyle = gradeColor(g); x.font = 'bold 24px sans-serif';
  x.fillText(g, 290, 310);
  x.fillStyle = cl.dim; x.font = '10px sans-serif';
  x.fillText('Grade', 315, 310);

  // Zone accuracy bar chart (bottom)
  var barY = 340, barH = 40;
  x.fillStyle = cl.dim; x.font = 'bold 10px sans-serif';
  x.fillText('Zone Accuracy Distribution', 20, barY-8);
  zoneKeys.forEach(function(k,i){
    var bx2 = 20+i*65, val = v26.punchAccuracy.zones[k];
    var h = maxVal > 0 ? (val/maxVal)*barH : 2;
    x.fillStyle = cl.accentSoft;
    x.fillRect(bx2, barY+barH-h, 50, h);
    x.fillStyle = cl.accent;
    x.fillRect(bx2, barY+barH-h, 50, 2);
    x.fillStyle = cl.muted; x.font = '8px sans-serif'; x.textAlign = 'center';
    x.fillText(zones[i], bx2+25, barY+barH+10);
    x.textAlign = 'left';
  });
}

window._v26AccuracyDrill = function(){
  playSFX26('accuracy_hit');
  var zoneKeys = ['head_l','head_c','head_r','body_l','body_c','body_r','low_l','low_c','low_r'];
  var hits = Math.floor(Math.random()*5)+5;
  for(var i=0; i<hits; i++){
    var zone = zoneKeys[Math.floor(Math.random()*9)];
    v26.punchAccuracy.zones[zone]++;
    v26.punchAccuracy.totalShots++;
  }
  var totalHits = 0; for(var k in v26.punchAccuracy.zones) totalHits += v26.punchAccuracy.zones[k];
  var pct = Math.min(100, Math.round(50 + Math.random()*45));
  v26.punchAccuracy.sessions.push({pct:pct, hits:hits});
  if(v26.punchAccuracy.sessions.length > 30) v26.punchAccuracy.sessions.shift();
  var avgPct = Math.round(v26.punchAccuracy.sessions.reduce(function(a,s){return a+s.pct;},0)/v26.punchAccuracy.sessions.length);
  v26.punchAccuracy.bestGrade = grade(avgPct);
  v26.featureUsage26.punchAccuracy = true;
  saveV26(v26); drawAccuracyCanvas(); checkAchievementsV26();
};
window._v26AccuracyReset = function(){
  v26.punchAccuracy = defV26().punchAccuracy;
  saveV26(v26); drawAccuracyCanvas();
};

// ============================================================
// 2. FIGHT CAMP PERIODIZATION PLANNER Canvas 620x380
// ============================================================
var sec2 = document.createElement('div');
sec2.id = 'v26-sec-camp';
sec2.className = 'v26-card';
sec2.style.display = 'none';
sec2.innerHTML = '<div class="v26-hdr">&#128197; &#54028;&#51060;&#53944;&#52896;&#54532; &#51452;&#44592;&#54868; &#54540;&#47000;&#45320;</div><div class="v26-sub">16&#51452; 4&#45800;&#44228; &#47588;&#53356;&#47196;&#49324;&#51060;&#53364; (Base/Build/Peak/Taper)</div><canvas id="v26-c-camp" width="620" height="380" style="width:100%;max-width:620px;border-radius:12px;background:#0d0d1a;cursor:pointer"></canvas><div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button class="v26-btn" onclick="window._v26CampWeek()">&#51452;&#44036; &#50756;&#47308;</button><button class="v26-btn-sec" onclick="window._v26CampReset()">&#47532;&#49483;</button></div>';
document.body.appendChild(sec2);

function drawCampCanvas(){
  var c = document.getElementById('v26-c-camp');
  if(!c) return;
  var x = c.getContext('2d'), W = 620, H = 380;
  x.clearRect(0,0,W,H);
  x.fillStyle = '#0d0d1a'; x.fillRect(0,0,W,H);

  x.fillStyle = cl.purple; x.font = 'bold 14px sans-serif';
  x.fillText('Fight Camp Periodization (16 Weeks)', 20, 30);

  var phases = [
    {name:'Base',weeks:4,color:'#3b82f6',desc:'Aerobic foundation'},
    {name:'Build',weeks:4,color:'#f97316',desc:'Intensity increase'},
    {name:'Peak',weeks:4,color:'#ef4444',desc:'Maximum load'},
    {name:'Taper',weeks:4,color:'#22c55e',desc:'Recovery & sharpening'}
  ];
  var targetVolumes = [60,65,70,60, 75,80,85,70, 90,95,100,80, 50,40,30,20];

  // Phase headers
  var phaseX = 60; var phaseW = 135;
  phases.forEach(function(p,i){
    x.fillStyle = p.color+'33'; x.fillRect(phaseX+i*phaseW, 45, phaseW-4, 25);
    x.fillStyle = p.color; x.font = 'bold 11px sans-serif';
    x.fillText(p.name, phaseX+i*phaseW+8, 62);
    x.fillStyle = cl.muted; x.font = '9px sans-serif';
    x.fillText(p.desc, phaseX+i*phaseW+8+x.measureText(p.name).width+8, 62);
  });

  // Weekly volume bar chart
  var barX = 60, barY = 90, barW = 30, barH = 160, gap = 5;
  x.strokeStyle = cl.border; x.lineWidth = 0.5;
  for(var i=0; i<=4; i++){
    var y = barY + barH - (i/4)*barH;
    x.beginPath(); x.moveTo(barX-5, y); x.lineTo(barX+16*(barW+gap), y); x.stroke();
    x.fillStyle = cl.muted; x.font = '9px sans-serif';
    x.fillText((i*25)+'%', 20, y+3);
  }

  for(var w=0; w<16; w++){
    var actualVol = v26.campPlan.weeklyVolume[w];
    var targetVol = targetVolumes[w];
    var bx2 = barX + w*(barW+gap);
    var phaseIdx = Math.floor(w/4);

    // Target bar (ghost)
    var tH = (targetVol/100)*barH;
    x.fillStyle = phases[phaseIdx].color+'22';
    x.fillRect(bx2, barY+barH-tH, barW, tH);

    // Actual bar
    var aH = (actualVol/100)*barH;
    x.fillStyle = phases[phaseIdx].color+'88';
    x.fillRect(bx2, barY+barH-aH, barW, aH);

    // Current week marker
    if(w+1 === v26.campPlan.currentWeek){
      x.strokeStyle = cl.gold; x.lineWidth = 2;
      x.strokeRect(bx2-2, barY-2, barW+4, barH+4);
    }

    // Week label
    x.fillStyle = w < v26.campPlan.completedWeeks ? cl.green : (w+1 === v26.campPlan.currentWeek ? cl.gold : cl.muted);
    x.font = '9px sans-serif'; x.textAlign = 'center';
    x.fillText('W'+(w+1), bx2+barW/2, barY+barH+14);
    x.textAlign = 'left';
  }

  // Readiness gauge (bottom)
  var gx = 60, gy = 290, gw = 250, gh = 20;
  x.fillStyle = cl.dim; x.font = 'bold 11px sans-serif';
  x.fillText('Readiness Level', gx, gy-6);
  x.fillStyle = cl.surface; x.fillRect(gx, gy, gw, gh);
  var readPct = v26.campPlan.readiness/100;
  var readCol = readPct > 0.7 ? cl.green : readPct > 0.4 ? cl.orange : cl.red;
  x.fillStyle = readCol; x.fillRect(gx, gy, gw*readPct, gh);
  x.fillStyle = cl.text; x.font = 'bold 12px sans-serif'; x.textAlign = 'center';
  x.fillText(v26.campPlan.readiness+'%', gx+gw/2, gy+15);
  x.textAlign = 'left';

  // Stats
  var phaseNames = ['Base','Build','Peak','Taper'];
  x.fillStyle = cl.dim; x.font = '11px sans-serif';
  x.fillText('Current Phase: '+phaseNames[Math.min(3,Math.floor((v26.campPlan.currentWeek-1)/4))], gx, gy+50);
  x.fillText('Week: '+v26.campPlan.currentWeek+'/16', gx, gy+68);
  x.fillText('Completed: '+v26.campPlan.completedWeeks+' weeks', gx+200, gy+50);

  x.fillStyle = cl.muted; x.font = '10px sans-serif';
  x.fillText('Target volume (ghost) vs Actual volume (solid)', 20, H-10);
}

window._v26CampWeek = function(){
  if(v26.campPlan.currentWeek > 16){ playSFX26('camp_complete'); return; }
  var targetVolumes = [60,65,70,60, 75,80,85,70, 90,95,100,80, 50,40,30,20];
  var target = targetVolumes[v26.campPlan.currentWeek-1];
  var actual = Math.max(20, target + Math.floor(Math.random()*20)-10);
  v26.campPlan.weeklyVolume[v26.campPlan.currentWeek-1] = actual;
  v26.campPlan.completedWeeks++;
  v26.campPlan.readiness = Math.min(100, Math.max(30, v26.campPlan.readiness + Math.floor(Math.random()*10)-3));
  var phaseIdx = Math.floor((v26.campPlan.currentWeek-1)/4);
  v26.campPlan.phase = ['base','build','peak','taper'][phaseIdx];
  v26.campPlan.currentWeek++;
  if(v26.campPlan.currentWeek > 16) playSFX26('camp_complete');
  else playSFX26('camp_phase');
  v26.featureUsage26.campPlan = true;
  saveV26(v26); drawCampCanvas(); checkAchievementsV26();
};
window._v26CampReset = function(){
  v26.campPlan = defV26().campPlan;
  saveV26(v26); drawCampCanvas();
};

// ============================================================
// 3. DEFENSIVE REACTION MATRIX Canvas 620x400
// ============================================================
var sec3 = document.createElement('div');
sec3.id = 'v26-sec-defense';
sec3.className = 'v26-card';
sec3.style.display = 'none';
sec3.innerHTML = '<div class="v26-hdr">&#128737;&#65039; &#48169;&#50612; &#48152;&#51025; &#47588;&#53944;&#47533;&#49828;</div><div class="v26-sub">8&#44277;&#44201;&#50976;&#54805; &#215; 6&#48169;&#50612;&#48152;&#51025; &#55176;&#53944;&#47609; + &#49457;&#44277;&#50984;</div><canvas id="v26-c-defense" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#0d0d1a;cursor:pointer"></canvas><div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button class="v26-btn" onclick="window._v26DefenseDrill()">&#48169;&#50612; &#46300;&#47540;</button><button class="v26-btn-sec" onclick="window._v26DefenseReset()">&#47532;&#49483;</button></div>';
document.body.appendChild(sec3);

function drawDefenseCanvas(){
  var c = document.getElementById('v26-c-defense');
  if(!c) return;
  var x = c.getContext('2d'), W = 620, H = 400;
  x.clearRect(0,0,W,H);
  x.fillStyle = '#0d0d1a'; x.fillRect(0,0,W,H);

  x.fillStyle = cl.cyan; x.font = 'bold 14px sans-serif';
  x.fillText('Defensive Reaction Matrix', 20, 30);

  var attacks = ['Jab','Cross','Hook','Uppercut','Body Shot','Overhand','Combo','Clinch'];
  var defenses = ['Block','Parry','Slip','Roll','Pull','Counter'];
  var cellW = 70, cellH = 35, startX = 100, startY = 55;

  // Column headers
  defenses.forEach(function(d,i){
    x.fillStyle = cl.dim; x.font = 'bold 10px sans-serif'; x.textAlign = 'center';
    x.fillText(d, startX+i*cellW+cellW/2, startY-8);
    x.textAlign = 'left';
  });

  // Row headers + heatmap
  attacks.forEach(function(atk,r){
    x.fillStyle = cl.text; x.font = '10px sans-serif';
    x.fillText(atk, 10, startY+r*cellH+cellH/2+4);

    defenses.forEach(function(def,c2){
      var key = atk+'_'+def;
      var val = v26.defMatrix.matrix[key] || 0;
      var maxVal = 10;
      var intensity = Math.min(1, val/maxVal);
      var hue = 200 + intensity*120;
      x.fillStyle = 'hsla('+hue+',70%,50%,'+Math.max(0.08,intensity*0.7)+')';
      x.fillRect(startX+c2*cellW+2, startY+r*cellH+2, cellW-4, cellH-4);
      x.strokeStyle = 'rgba(255,255,255,0.05)'; x.lineWidth = 0.5;
      x.strokeRect(startX+c2*cellW+2, startY+r*cellH+2, cellW-4, cellH-4);
      if(val > 0){
        x.fillStyle = cl.text; x.font = 'bold 11px sans-serif'; x.textAlign = 'center';
        x.fillText(val, startX+c2*cellW+cellW/2, startY+r*cellH+cellH/2+4);
        x.textAlign = 'left';
      }
    });
  });

  // Stats
  var statsY = startY + 8*cellH + 30;
  x.fillStyle = cl.dim; x.font = 'bold 11px sans-serif';
  x.fillText('Drills: '+v26.defMatrix.drills, 20, statsY);
  x.fillText('Total Attempts: '+v26.defMatrix.totalAttempts, 160, statsY);
  x.fillText('Success Rate: '+v26.defMatrix.successRate+'%', 350, statsY);

  // Legend
  x.fillStyle = cl.muted; x.font = '9px sans-serif';
  x.fillText('Darker = more practice', 20, statsY+20);
  for(var i=0; i<5; i++){
    x.fillStyle = 'hsla('+(200+i*30)+',70%,50%,'+(0.1+i*0.15)+')';
    x.fillRect(200+i*30, statsY+12, 25, 10);
  }
  x.fillStyle = cl.muted; x.font = '8px sans-serif';
  x.fillText('Low', 195, statsY+30); x.fillText('High', 340, statsY+30);
}

window._v26DefenseDrill = function(){
  var attacks = ['Jab','Cross','Hook','Uppercut','Body Shot','Overhand','Combo','Clinch'];
  var defenses = ['Block','Parry','Slip','Roll','Pull','Counter'];
  var reps = Math.floor(Math.random()*4)+3;
  for(var i=0; i<reps; i++){
    var atk = attacks[Math.floor(Math.random()*8)];
    var def = defenses[Math.floor(Math.random()*6)];
    var key = atk+'_'+def;
    v26.defMatrix.matrix[key] = (v26.defMatrix.matrix[key]||0)+1;
    v26.defMatrix.totalAttempts++;
  }
  v26.defMatrix.drills++;
  v26.defMatrix.successRate = Math.min(99, Math.round(50 + Math.random()*40));
  playSFX26(Math.random()>0.5?'defense_block':'defense_evade');
  v26.featureUsage26.defMatrix = true;
  saveV26(v26); drawDefenseCanvas(); checkAchievementsV26();
};
window._v26DefenseReset = function(){
  v26.defMatrix = defV26().defMatrix;
  saveV26(v26); drawDefenseCanvas();
};

// ============================================================
// 4. PUNCH BIOMECHANICS ANALYZER Canvas 600x380
// ============================================================
var sec4 = document.createElement('div');
sec4.id = 'v26-sec-biomech';
sec4.className = 'v26-card';
sec4.style.display = 'none';
sec4.innerHTML = '<div class="v26-hdr">&#9881;&#65039; &#54144;&#52824; &#48148;&#51060;&#50724;&#47700;&#52852;&#45769;&#49828;</div><div class="v26-sub">7&#54144;&#52824; &#50868;&#46041;&#49324;&#49836; 6&#44396;&#44036; &#55192; &#51204;&#45804; &#48516;&#49437;</div><canvas id="v26-c-biomech" width="600" height="380" style="width:100%;max-width:600px;border-radius:12px;background:#0d0d1a;cursor:pointer"></canvas><div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button class="v26-btn" onclick="window._v26BiomechScan()">&#48148;&#51060;&#50724; &#49828;&#52884;</button><button class="v26-btn-sec" onclick="window._v26BiomechReset()">&#47532;&#49483;</button></div>';
document.body.appendChild(sec4);

function drawBiomechCanvas(){
  var c = document.getElementById('v26-c-biomech');
  if(!c) return;
  var x = c.getContext('2d'), W = 600, H = 380;
  x.clearRect(0,0,W,H);
  x.fillStyle = '#0d0d1a'; x.fillRect(0,0,W,H);

  x.fillStyle = cl.orange; x.font = 'bold 14px sans-serif';
  x.fillText('Punch Biomechanics Analyzer', 20, 30);

  var punches = ['Jab','Cross','Lead Hook','Rear Hook','Lead Upper','Rear Upper','Overhand'];
  var punchKeys = ['jab','cross','leadHook','rearHook','leadUpper','rearUpper','overhand'];
  var chainSegments = ['Foot','Leg','Hip','Core','Shoulder','Fist'];
  var chainColors = ['#3b82f6','#06b6d4','#22c55e','#f97316','#ef4444','#a855f7'];

  // Kinetic chain flow diagram
  var flowX = 20, flowY = 55, flowH = 30;
  x.fillStyle = cl.dim; x.font = 'bold 10px sans-serif';
  x.fillText('Kinetic Chain Force Flow', flowX, flowY-8);

  chainSegments.forEach(function(seg,i){
    var sx = flowX + i*95;
    x.fillStyle = chainColors[i]+'44';
    x.fillRect(sx, flowY, 85, flowH);
    x.fillStyle = chainColors[i]; x.font = 'bold 10px sans-serif'; x.textAlign = 'center';
    x.fillText(seg, sx+42, flowY+flowH/2+4);
    // Arrow
    if(i < 5){
      x.fillStyle = cl.dim;
      x.beginPath(); x.moveTo(sx+88, flowY+flowH/2-4);
      x.lineTo(sx+95, flowY+flowH/2);
      x.lineTo(sx+88, flowY+flowH/2+4); x.fill();
    }
  });
  x.textAlign = 'left';

  // Per-punch force bars
  var barX = 20, barY = 110, barW = 560, barH = 28;
  punches.forEach(function(p,pi){
    var y = barY + pi*(barH+6);
    x.fillStyle = cl.dim; x.font = '10px sans-serif';
    x.fillText(p, barX, y+barH/2+4);

    var score = v26.biomech.punches[punchKeys[pi]];
    // 6-segment chain bar
    chainSegments.forEach(function(seg,si){
      var segW = 70;
      var sx2 = barX + 90 + si*segW;
      var segScore = score > 0 ? Math.min(100, 30 + Math.floor(Math.random()*60) + score*5) : 0;
      var segH = barH * (segScore/100);
      x.fillStyle = chainColors[si]+'33';
      x.fillRect(sx2, y, segW-4, barH);
      x.fillStyle = chainColors[si]+'88';
      x.fillRect(sx2, y+barH-segH, segW-4, segH);
    });

    // Technique score
    var techPct = score > 0 ? Math.min(100, 40+score*8) : 0;
    var g2 = grade(techPct);
    x.fillStyle = gradeColor(g2); x.font = 'bold 11px sans-serif';
    x.fillText(g2, barX+520, y+barH/2+4);
  });

  // Overall stats
  x.fillStyle = cl.dim; x.font = 'bold 11px sans-serif';
  x.fillText('Sessions: '+v26.biomech.sessions, 20, H-30);
  x.fillText('Overall Technique: '+v26.biomech.techScore+'%', 200, H-30);
  var overallG = grade(v26.biomech.techScore);
  x.fillStyle = gradeColor(overallG); x.font = 'bold 18px sans-serif';
  x.fillText(overallG, 400, H-24);

  x.fillStyle = cl.muted; x.font = '9px sans-serif';
  x.fillText('Chain: Foot → Leg → Hip → Core → Shoulder → Fist', 20, H-10);
}

window._v26BiomechScan = function(){
  playSFX26('biomech_scan');
  var punchKeys = ['jab','cross','leadHook','rearHook','leadUpper','rearUpper','overhand'];
  var chosen = punchKeys[Math.floor(Math.random()*7)];
  v26.biomech.punches[chosen] = Math.min(10, (v26.biomech.punches[chosen]||0)+1);
  v26.biomech.sessions++;
  var total = 0, cnt = 0;
  for(var k in v26.biomech.punches){ total += v26.biomech.punches[k]; cnt++; }
  v26.biomech.techScore = Math.min(100, Math.round((total/cnt)*10));
  playSFX26('biomech_chain');
  v26.featureUsage26.biomech = true;
  saveV26(v26); drawBiomechCanvas(); checkAchievementsV26();
};
window._v26BiomechReset = function(){
  v26.biomech = defV26().biomech;
  saveV26(v26); drawBiomechCanvas();
};

// ============================================================
// 5. SPARRING PERFORMANCE RADAR Canvas 620x400
// ============================================================
var sec5 = document.createElement('div');
sec5.id = 'v26-sec-sparradar';
sec5.className = 'v26-card';
sec5.style.display = 'none';
sec5.innerHTML = '<div class="v26-hdr">&#128171; &#49828;&#54028;&#47553; &#54140;&#54252;&#47676;&#49828; &#47112;&#51060;&#45908;</div><div class="v26-sub">8&#52629;(&#44277;&#44201;/&#48169;&#50612;/&#54411;&#50892;&#53356;/&#49828;&#53468;&#48120;&#45208;/Ring IQ/&#54028;&#50892;/&#49828;&#54588;&#46300;/Chin) &#49464;&#49496; &#48708;&#44368;</div><canvas id="v26-c-sparradar" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#0d0d1a;cursor:pointer"></canvas><div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button class="v26-btn" onclick="window._v26SparSession()">&#49828;&#54028;&#47553; &#49464;&#49496;</button><button class="v26-btn-sec" onclick="window._v26SparReset()">&#47532;&#49483;</button></div>';
document.body.appendChild(sec5);

function drawSparRadar(){
  var c = document.getElementById('v26-c-sparradar');
  if(!c) return;
  var x = c.getContext('2d'), W = 620, H = 400;
  x.clearRect(0,0,W,H);
  x.fillStyle = '#0d0d1a'; x.fillRect(0,0,W,H);

  x.fillStyle = cl.blue; x.font = 'bold 14px sans-serif';
  x.fillText('Sparring Performance Radar', 20, 30);

  var axes = ['Offense','Defense','Footwork','Stamina','Ring IQ','Power','Speed','Chin'];
  var axisKeys = ['offense','defense','footwork','stamina','ringIQ','power','speed','chin'];
  var cx2 = 220, cy2 = 220, R = 140;

  // Radar grid
  for(var lv=1; lv<=5; lv++){
    var r2 = R*(lv/5);
    x.beginPath();
    for(var a=0; a<8; a++){
      var angle = (a/8)*Math.PI*2 - Math.PI/2;
      var px = cx2 + Math.cos(angle)*r2;
      var py = cy2 + Math.sin(angle)*r2;
      if(a===0) x.moveTo(px,py); else x.lineTo(px,py);
    }
    x.closePath(); x.strokeStyle = 'rgba(255,255,255,0.08)'; x.lineWidth = 1; x.stroke();
  }

  // Axis lines + labels
  axes.forEach(function(label,i){
    var angle = (i/8)*Math.PI*2 - Math.PI/2;
    x.beginPath(); x.moveTo(cx2,cy2);
    x.lineTo(cx2+Math.cos(angle)*R, cy2+Math.sin(angle)*R);
    x.strokeStyle = 'rgba(255,255,255,0.1)'; x.stroke();
    var lx = cx2 + Math.cos(angle)*(R+20);
    var ly = cy2 + Math.sin(angle)*(R+20);
    x.fillStyle = cl.dim; x.font = 'bold 10px sans-serif'; x.textAlign = 'center';
    x.fillText(label, lx, ly+4);
  });
  x.textAlign = 'left';

  // Previous session (dashed line)
  if(v26.sparRadar.prevAxes){
    x.beginPath(); x.setLineDash([4,4]);
    axisKeys.forEach(function(k,i){
      var angle = (i/8)*Math.PI*2 - Math.PI/2;
      var val = (v26.sparRadar.prevAxes[k]||50)/100;
      var px = cx2 + Math.cos(angle)*R*val;
      var py = cy2 + Math.sin(angle)*R*val;
      if(i===0) x.moveTo(px,py); else x.lineTo(px,py);
    });
    x.closePath(); x.strokeStyle = 'rgba(168,85,247,0.4)'; x.lineWidth = 1.5; x.stroke();
    x.setLineDash([]);
  }

  // Current session
  x.beginPath();
  axisKeys.forEach(function(k,i){
    var angle = (i/8)*Math.PI*2 - Math.PI/2;
    var val = (v26.sparRadar.axes[k]||50)/100;
    var px = cx2 + Math.cos(angle)*R*val;
    var py = cy2 + Math.sin(angle)*R*val;
    if(i===0) x.moveTo(px,py); else x.lineTo(px,py);
  });
  x.closePath();
  x.fillStyle = 'rgba(59,130,246,0.15)'; x.fill();
  x.strokeStyle = cl.blue; x.lineWidth = 2; x.stroke();

  // Dots
  axisKeys.forEach(function(k,i){
    var angle = (i/8)*Math.PI*2 - Math.PI/2;
    var val = (v26.sparRadar.axes[k]||50)/100;
    var px = cx2 + Math.cos(angle)*R*val;
    var py = cy2 + Math.sin(angle)*R*val;
    x.beginPath(); x.arc(px,py,4,0,Math.PI*2);
    x.fillStyle = cl.blue; x.fill();
    x.strokeStyle = '#fff'; x.lineWidth = 1; x.stroke();
  });

  // Stats panel (right)
  var sx = 420, sy = 60;
  x.fillStyle = cl.dim; x.font = 'bold 11px sans-serif';
  x.fillText('Performance Stats', sx, sy);
  axisKeys.forEach(function(k,i){
    var val = v26.sparRadar.axes[k];
    x.fillStyle = cl.dim; x.font = '10px sans-serif';
    x.fillText(axes[i]+': ', sx, sy+20+i*22);
    x.fillStyle = val>=80?cl.green:val>=60?cl.blue:val>=40?cl.orange:cl.red;
    x.font = 'bold 10px sans-serif';
    x.fillText(val, sx+80, sy+20+i*22);
  });

  var avg = Math.round(axisKeys.reduce(function(a,k){return a+v26.sparRadar.axes[k];},0)/8);
  var g2 = grade(avg);
  x.fillStyle = cl.dim; x.font = 'bold 11px sans-serif';
  x.fillText('Sessions: '+v26.sparRadar.sessions, sx, sy+200);
  x.fillText('Average: '+avg, sx, sy+220);
  x.fillStyle = gradeColor(g2); x.font = 'bold 20px sans-serif';
  x.fillText(g2, sx+100, sy+216);

  x.fillStyle = cl.muted; x.font = '9px sans-serif';
  x.fillText('Dashed = previous session', sx, sy+245);
}

window._v26SparSession = function(){
  playSFX26('radar_update');
  var axisKeys = ['offense','defense','footwork','stamina','ringIQ','power','speed','chin'];
  v26.sparRadar.prevAxes = {};
  for(var k in v26.sparRadar.axes) v26.sparRadar.prevAxes[k] = v26.sparRadar.axes[k];
  axisKeys.forEach(function(k){
    v26.sparRadar.axes[k] = Math.min(100, Math.max(20, v26.sparRadar.axes[k] + Math.floor(Math.random()*15)-5));
  });
  v26.sparRadar.sessions++;
  var avg = Math.round(axisKeys.reduce(function(a,k){return a+v26.sparRadar.axes[k];},0)/8);
  v26.sparRadar.bestGrade = grade(avg);
  v26.featureUsage26.sparRadar = true;
  saveV26(v26); drawSparRadar(); checkAchievementsV26();
};
window._v26SparReset = function(){
  v26.sparRadar = defV26().sparRadar;
  saveV26(v26); drawSparRadar();
};

// ============================================================
// 6. TRAINING LOAD MONITOR Canvas 600x380
// ============================================================
var sec6 = document.createElement('div');
sec6.id = 'v26-sec-trainload';
sec6.className = 'v26-card';
sec6.style.display = 'none';
sec6.innerHTML = '<div class="v26-hdr">&#128200; &#53944;&#47112;&#51060;&#45789; &#48512;&#54616; &#47784;&#45768;&#53552;</div><div class="v26-sub">RPE/Volume/Intensity &#44553;&#49457;:&#47564;&#49457; &#48512;&#54616;&#48708; &amp; &#48512;&#49345;&#50948;&#54744; &#44172;&#51060;&#51648;</div><canvas id="v26-c-trainload" width="600" height="380" style="width:100%;max-width:600px;border-radius:12px;background:#0d0d1a;cursor:pointer"></canvas><div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button class="v26-btn" onclick="window._v26TrainLog()">&#49464;&#49496; &#44592;&#47197;</button><button class="v26-btn-sec" onclick="window._v26TrainReset()">&#47532;&#49483;</button></div>';
document.body.appendChild(sec6);

function drawTrainLoadCanvas(){
  var c = document.getElementById('v26-c-trainload');
  if(!c) return;
  var x = c.getContext('2d'), W = 600, H = 380;
  x.clearRect(0,0,W,H);
  x.fillStyle = '#0d0d1a'; x.fillRect(0,0,W,H);

  x.fillStyle = cl.green; x.font = 'bold 14px sans-serif';
  x.fillText('Training Load Monitor (ACWR)', 20, 30);

  var loads = v26.trainLoad.acuteLoad.slice(-28);

  // Load line chart
  var chartX = 60, chartY = 60, chartW = 500, chartH = 150;
  x.strokeStyle = cl.border; x.lineWidth = 0.5;
  for(var i=0; i<=4; i++){
    var y = chartY + (i/4)*chartH;
    x.beginPath(); x.moveTo(chartX,y); x.lineTo(chartX+chartW,y); x.stroke();
    x.fillStyle = cl.muted; x.font = '9px sans-serif';
    x.fillText((100-i*25)+'', 30, y+3);
  }

  if(loads.length > 1){
    var maxLoad = Math.max.apply(null, loads)||100;
    // Acute load (7-day)
    x.beginPath(); x.strokeStyle = cl.red; x.lineWidth = 2;
    loads.forEach(function(l,i){
      var px = chartX + (i/(loads.length-1))*chartW;
      var py = chartY + chartH - (l/maxLoad)*chartH;
      if(i===0) x.moveTo(px,py); else x.lineTo(px,py);
    });
    x.stroke();

    // Chronic load (28-day average as smoothed line)
    if(loads.length >= 7){
      x.beginPath(); x.strokeStyle = cl.blue; x.lineWidth = 2; x.setLineDash([5,5]);
      for(var i=6; i<loads.length; i++){
        var avg = loads.slice(Math.max(0,i-6),i+1).reduce(function(a,b){return a+b;},0)/7;
        var px = chartX + (i/(loads.length-1))*chartW;
        var py = chartY + chartH - (avg/maxLoad)*chartH;
        if(i===6) x.moveTo(px,py); else x.lineTo(px,py);
      }
      x.stroke(); x.setLineDash([]);
    }
  }

  // ACWR gauge
  var ratio = v26.trainLoad.ratio;
  var gaugeX = 60, gaugeY = 250, gaugeW = 400, gaugeH = 30;
  x.fillStyle = cl.dim; x.font = 'bold 11px sans-serif';
  x.fillText('Acute:Chronic Workload Ratio (ACWR)', gaugeX, gaugeY-8);

  // Danger zones
  x.fillStyle = 'rgba(239,68,68,0.2)'; x.fillRect(gaugeX, gaugeY, gaugeW*0.4, gaugeH);
  x.fillStyle = 'rgba(34,197,94,0.2)'; x.fillRect(gaugeX+gaugeW*0.4, gaugeY, gaugeW*0.35, gaugeH);
  x.fillStyle = 'rgba(239,68,68,0.2)'; x.fillRect(gaugeX+gaugeW*0.75, gaugeY, gaugeW*0.25, gaugeH);

  x.fillStyle = cl.muted; x.font = '8px sans-serif'; x.textAlign = 'center';
  x.fillText('Undertrained', gaugeX+gaugeW*0.2, gaugeY+gaugeH+12);
  x.fillText('Sweet Spot', gaugeX+gaugeW*0.575, gaugeY+gaugeH+12);
  x.fillText('Danger', gaugeX+gaugeW*0.875, gaugeY+gaugeH+12);
  x.textAlign = 'left';

  // ACWR needle
  var needleX = gaugeX + Math.min(1, ratio/2)*gaugeW;
  x.fillStyle = cl.gold; x.beginPath();
  x.moveTo(needleX-5, gaugeY-4); x.lineTo(needleX+5, gaugeY-4); x.lineTo(needleX, gaugeY+5); x.fill();
  x.fillStyle = cl.text; x.font = 'bold 12px sans-serif'; x.textAlign = 'center';
  x.fillText(ratio.toFixed(2), needleX, gaugeY-12);
  x.textAlign = 'left';

  // Injury risk
  var riskColors = {low:cl.green, moderate:cl.orange, high:cl.red};
  var riskLabels = {low:'Low Risk', moderate:'Moderate Risk', high:'High Risk'};
  x.fillStyle = cl.dim; x.font = 'bold 11px sans-serif';
  x.fillText('Injury Risk: ', 60, 320);
  x.fillStyle = riskColors[v26.trainLoad.riskLevel];
  x.fillText(riskLabels[v26.trainLoad.riskLevel], 150, 320);

  // Legend
  x.fillStyle = cl.red; x.fillRect(60, 345, 15, 3);
  x.fillStyle = cl.dim; x.font = '9px sans-serif'; x.fillText('Acute Load (7d)', 80, 349);
  x.fillStyle = cl.blue; x.setLineDash([4,4]); x.beginPath(); x.moveTo(200,346); x.lineTo(215,346); x.stroke(); x.setLineDash([]);
  x.fillStyle = cl.dim; x.fillText('Chronic Load (28d avg)', 220, 349);
  x.fillText('Sessions: '+v26.trainLoad.sessions, 400, 349);
}

window._v26TrainLog = function(){
  var load = Math.floor(Math.random()*60)+30;
  v26.trainLoad.acuteLoad.push(load);
  if(v26.trainLoad.acuteLoad.length > 28) v26.trainLoad.acuteLoad.shift();
  v26.trainLoad.sessions++;

  var acuteArr = v26.trainLoad.acuteLoad.slice(-7);
  var chronicArr = v26.trainLoad.acuteLoad.slice(-28);
  var acute = acuteArr.reduce(function(a,b){return a+b;},0)/acuteArr.length;
  var chronic = chronicArr.reduce(function(a,b){return a+b;},0)/chronicArr.length;
  v26.trainLoad.chronicLoad = Math.round(chronic);
  v26.trainLoad.ratio = chronic > 0 ? Math.round(acute/chronic*100)/100 : 1;

  if(v26.trainLoad.ratio >= 0.8 && v26.trainLoad.ratio <= 1.3){
    v26.trainLoad.riskLevel = 'low';
    playSFX26('load_ok');
  } else if(v26.trainLoad.ratio > 1.3 && v26.trainLoad.ratio <= 1.5){
    v26.trainLoad.riskLevel = 'moderate';
    playSFX26('load_warn');
  } else {
    v26.trainLoad.riskLevel = 'high';
    playSFX26('load_warn');
  }
  v26.featureUsage26.trainLoad = true;
  saveV26(v26); drawTrainLoadCanvas(); checkAchievementsV26();
};
window._v26TrainReset = function(){
  v26.trainLoad = defV26().trainLoad;
  saveV26(v26); drawTrainLoadCanvas();
};

// ============================================================
// 7. BOXING NUTRITION PERIODIZER Canvas 620x400
// ============================================================
var sec7 = document.createElement('div');
sec7.id = 'v26-sec-nutrition';
sec7.className = 'v26-card';
sec7.style.display = 'none';
sec7.innerHTML = '<div class="v26-hdr">&#127860; &#48373;&#49905; &#50689;&#50577; &#51452;&#44592;&#54868;</div><div class="v26-sub">&#54028;&#51060;&#53944; &#50948;&#53356; 7&#51068; &#49885;&#45800;, &#47588;&#53356;&#47196; &#46020;&#45339; &amp; &#49688;&#48516; &#53944;&#47000;&#52964;</div><canvas id="v26-c-nutrition" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#0d0d1a;cursor:pointer"></canvas><div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button class="v26-btn" onclick="window._v26NutritionPlan()">&#49885;&#45800; &#49373;&#49457;</button><button class="v26-btn-sec" onclick="window._v26NutritionReset()">&#47532;&#49483;</button></div>';
document.body.appendChild(sec7);

function drawNutritionCanvas(){
  var c = document.getElementById('v26-c-nutrition');
  if(!c) return;
  var x = c.getContext('2d'), W = 620, H = 400;
  x.clearRect(0,0,W,H);
  x.fillStyle = '#0d0d1a'; x.fillRect(0,0,W,H);

  x.fillStyle = cl.pink; x.font = 'bold 14px sans-serif';
  x.fillText('Boxing Nutrition Periodizer', 20, 30);

  var days = ['D-7','D-6','D-5','D-4','D-3','D-2','D-1'];
  var dayLabels = ['Base Load','Moderate','Carb Load','Light Train','Weigh-in Prep','Recovery','Fight Day'];
  var calTargets = [2800,2600,3000,2200,1800,2400,2000];

  // 7-day bar chart
  var barX = 50, barY = 60, barW = 70, barH = 140;
  x.fillStyle = cl.dim; x.font = 'bold 10px sans-serif';
  x.fillText('Fight Week Calorie Plan', barX, barY-10);

  for(var d=0; d<7; d++){
    var bx2 = barX + d*(barW+8);
    var target = calTargets[d];
    var actual = v26.nutrition.dayPlans['d'+d] || 0;
    var targetH = (target/3200)*barH;
    var actualH = (actual/3200)*barH;

    // Target ghost
    x.fillStyle = 'rgba(236,72,153,0.15)';
    x.fillRect(bx2, barY+barH-targetH, barW, targetH);

    // Actual
    x.fillStyle = actual > 0 ? 'rgba(236,72,153,0.5)' : 'transparent';
    x.fillRect(bx2, barY+barH-actualH, barW, actualH);

    // Labels
    x.fillStyle = cl.text; x.font = 'bold 10px sans-serif'; x.textAlign = 'center';
    x.fillText(days[d], bx2+barW/2, barY+barH+14);
    x.fillStyle = cl.muted; x.font = '8px sans-serif';
    x.fillText(dayLabels[d], bx2+barW/2, barY+barH+26);
    if(actual > 0){
      x.fillStyle = cl.text; x.font = '9px sans-serif';
      x.fillText(actual+'kcal', bx2+barW/2, barY+barH-actualH-6);
    }
  }
  x.textAlign = 'left';

  // Macro donut chart
  var donutX = 150, donutY = 300, donutR = 50;
  x.fillStyle = cl.dim; x.font = 'bold 10px sans-serif';
  x.fillText('Macro Split', donutX-50, donutY-donutR-10);

  var macros = v26.nutrition.macros;
  var total = macros.protein + macros.carbs + macros.fat;
  if(total > 0){
    var angles = [
      {val:macros.protein,color:'#ef4444',label:'Protein'},
      {val:macros.carbs,color:'#f97316',label:'Carbs'},
      {val:macros.fat,color:'#3b82f6',label:'Fat'}
    ];
    var startAngle = -Math.PI/2;
    angles.forEach(function(m){
      var sweep = (m.val/total)*Math.PI*2;
      x.beginPath(); x.moveTo(donutX,donutY);
      x.arc(donutX,donutY,donutR,startAngle,startAngle+sweep);
      x.closePath(); x.fillStyle = m.color; x.fill();
      startAngle += sweep;
    });
    // Inner circle
    x.beginPath(); x.arc(donutX,donutY,donutR*0.55,0,Math.PI*2);
    x.fillStyle = '#0d0d1a'; x.fill();
    x.fillStyle = cl.text; x.font = 'bold 12px sans-serif'; x.textAlign = 'center';
    x.fillText(total+'g', donutX, donutY+4);
    x.textAlign = 'left';

    // Legend
    angles.forEach(function(m,i){
      x.fillStyle = m.color; x.fillRect(donutX+donutR+20, donutY-30+i*18, 10, 10);
      x.fillStyle = cl.dim; x.font = '10px sans-serif';
      x.fillText(m.label+': '+m.val+'g ('+Math.round(m.val/total*100)+'%)', donutX+donutR+35, donutY-21+i*18);
    });
  } else {
    x.fillStyle = cl.muted; x.font = '11px sans-serif';
    x.fillText('No plan generated yet', donutX-40, donutY);
  }

  // Hydration bar
  var hydX = 400, hydY = 250;
  x.fillStyle = cl.dim; x.font = 'bold 10px sans-serif';
  x.fillText('Hydration (L/day)', hydX, hydY-8);
  x.fillStyle = cl.surface; x.fillRect(hydX, hydY, 180, 20);
  var hydPct = Math.min(1, v26.nutrition.hydration/4);
  x.fillStyle = 'rgba(6,182,212,0.6)'; x.fillRect(hydX, hydY, 180*hydPct, 20);
  x.fillStyle = cl.text; x.font = 'bold 10px sans-serif'; x.textAlign = 'center';
  x.fillText(v26.nutrition.hydration.toFixed(1)+'L / 4.0L', hydX+90, hydY+14);
  x.textAlign = 'left';

  x.fillStyle = cl.muted; x.font = '9px sans-serif';
  x.fillText('Adherence: '+v26.nutrition.adherence+'% | Sessions: '+v26.nutrition.sessions, 400, 300);
}

window._v26NutritionPlan = function(){
  playSFX26('nutrition_plan');
  var calTargets = [2800,2600,3000,2200,1800,2400,2000];
  for(var d=0; d<7; d++){
    v26.nutrition.dayPlans['d'+d] = calTargets[d] + Math.floor(Math.random()*400)-200;
  }
  v26.nutrition.macros = {
    protein: Math.floor(Math.random()*50)+150,
    carbs: Math.floor(Math.random()*80)+200,
    fat: Math.floor(Math.random()*30)+50
  };
  v26.nutrition.hydration = Math.round((2.5+Math.random()*2)*10)/10;
  v26.nutrition.adherence = Math.floor(Math.random()*30)+65;
  v26.nutrition.sessions++;
  playSFX26('nutrition_hydrate');
  v26.featureUsage26.nutrition = true;
  saveV26(v26); drawNutritionCanvas(); checkAchievementsV26();
};
window._v26NutritionReset = function(){
  v26.nutrition = defV26().nutrition;
  saveV26(v26); drawNutritionCanvas();
};

// ============================================================
// 8. RING GENERALSHIP ANALYZER Canvas 620x380
// ============================================================
var sec8 = document.createElement('div');
sec8.id = 'v26-sec-ringgen';
sec8.className = 'v26-card';
sec8.style.display = 'none';
sec8.innerHTML = '<div class="v26-hdr">&#127942; &#47553; &#51109;&#50501;&#47141; &#48516;&#49437;&#44592;</div><div class="v26-sub">8&#51204;&#49696; + &#51316; &#51648;&#48176;&#47141; &#55176;&#53944;&#47609; + &#51204;&#49696;IQ &#49828;&#53076;&#50612;</div><canvas id="v26-c-ringgen" width="620" height="380" style="width:100%;max-width:620px;border-radius:12px;background:#0d0d1a;cursor:pointer"></canvas><div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button class="v26-btn" onclick="window._v26RingAnalyze()">&#47553; &#48516;&#49437;</button><button class="v26-btn-sec" onclick="window._v26RingReset()">&#47532;&#49483;</button></div>';
document.body.appendChild(sec8);

function drawRingGenCanvas(){
  var c = document.getElementById('v26-c-ringgen');
  if(!c) return;
  var x = c.getContext('2d'), W = 620, H = 380;
  x.clearRect(0,0,W,H);
  x.fillStyle = '#0d0d1a'; x.fillRect(0,0,W,H);

  x.fillStyle = cl.gold; x.font = 'bold 14px sans-serif';
  x.fillText('Ring Generalship Analyzer', 20, 30);

  // Ring zone heatmap (4x4 grid = ring quadrants)
  var ringX = 30, ringY = 55, ringS = 200;
  x.strokeStyle = cl.border; x.lineWidth = 2;
  x.strokeRect(ringX, ringY, ringS, ringS);

  // Corner posts
  var corners = ['Red','Blue','Neutral','Neutral'];
  var cornerColors = [cl.red, cl.blue, cl.dim, cl.dim];
  [[ringX,ringY],[ringX+ringS,ringY],[ringX+ringS,ringY+ringS],[ringX,ringY+ringS]].forEach(function(pos,i){
    x.beginPath(); x.arc(pos[0],pos[1],6,0,Math.PI*2);
    x.fillStyle = cornerColors[i]; x.fill();
  });

  // 4x4 zone grid
  var cellS = ringS/4;
  var zoneLabels = ['A1','A2','A3','A4','B1','B2','B3','B4','C1','C2','C3','C4','D1','D2','D3','D4'];
  for(var r=0; r<4; r++){
    for(var c2=0; c2<4; c2++){
      var zKey = zoneLabels[r*4+c2];
      var val = v26.ringGen.zoneDominance[zKey] || 0;
      var alpha = Math.min(0.7, 0.05 + val*0.08);
      x.fillStyle = 'rgba(255,215,0,'+alpha+')';
      x.fillRect(ringX+c2*cellS+1, ringY+r*cellS+1, cellS-2, cellS-2);
      if(val > 0){
        x.fillStyle = cl.text; x.font = 'bold 10px sans-serif'; x.textAlign = 'center';
        x.fillText(val, ringX+c2*cellS+cellS/2, ringY+r*cellS+cellS/2+4);
      }
    }
  }
  x.textAlign = 'left';

  // 8 tactics bar chart
  var tactics = ['Cut Off','Corner Trap','Jab Control','Distance','Pressure','Counter','Clinch','Angles'];
  var tacticKeys = ['cutOff','cornerTrap','jab','distance','pressure','counter','clinch','angles'];
  var tacticColors = [cl.red,cl.orange,cl.blue,cl.green,cl.purple,cl.cyan,cl.pink,cl.gold];

  var tbX = 270, tbY = 55;
  x.fillStyle = cl.dim; x.font = 'bold 10px sans-serif';
  x.fillText('Tactical Proficiency', tbX, tbY);

  var maxTac = 1;
  tacticKeys.forEach(function(k){ if(v26.ringGen.tactics[k]>maxTac) maxTac=v26.ringGen.tactics[k]; });

  tactics.forEach(function(t,i){
    var y = tbY + 16 + i*28;
    x.fillStyle = cl.dim; x.font = '10px sans-serif';
    x.fillText(t, tbX, y+12);
    var val = v26.ringGen.tactics[tacticKeys[i]];
    var barW = (val/Math.max(maxTac,10))*200;
    x.fillStyle = tacticColors[i]+'44';
    x.fillRect(tbX+100, y, 200, 18);
    x.fillStyle = tacticColors[i]+'88';
    x.fillRect(tbX+100, y, barW, 18);
    x.fillStyle = cl.text; x.font = 'bold 9px sans-serif';
    x.fillText(val, tbX+105+barW, y+13);
  });

  // Tactical IQ gauge
  var iqX = 60, iqY = 290, iqW = 170, iqH = 60;
  x.fillStyle = cl.dim; x.font = 'bold 11px sans-serif';
  x.fillText('Tactical IQ', iqX, iqY-6);

  // Semi-circle gauge
  var iqCx = iqX+iqW/2, iqCy = iqY+iqH;
  var iqR = 60;
  x.beginPath(); x.arc(iqCx, iqCy, iqR, Math.PI, 0);
  x.strokeStyle = cl.border; x.lineWidth = 8; x.stroke();

  var iqPct = Math.min(100, v26.ringGen.iq)/100;
  x.beginPath(); x.arc(iqCx, iqCy, iqR, Math.PI, Math.PI + Math.PI*iqPct);
  x.strokeStyle = iqPct>0.7?cl.green:iqPct>0.4?cl.orange:cl.red; x.lineWidth = 8; x.stroke();

  x.fillStyle = cl.text; x.font = 'bold 20px sans-serif'; x.textAlign = 'center';
  x.fillText(v26.ringGen.iq, iqCx, iqCy-10);
  x.fillStyle = cl.dim; x.font = '10px sans-serif';
  x.fillText('IQ Score', iqCx, iqCy-30);
  x.textAlign = 'left';

  x.fillStyle = cl.muted; x.font = '10px sans-serif';
  x.fillText('Sessions: '+v26.ringGen.sessions, 300, H-15);
}

window._v26RingAnalyze = function(){
  playSFX26('ring_control');
  var tacticKeys = ['cutOff','cornerTrap','jab','distance','pressure','counter','clinch','angles'];
  var reps = Math.floor(Math.random()*4)+2;
  for(var i=0; i<reps; i++){
    var tk = tacticKeys[Math.floor(Math.random()*8)];
    v26.ringGen.tactics[tk]++;
  }
  var zoneLabels = ['A1','A2','A3','A4','B1','B2','B3','B4','C1','C2','C3','C4','D1','D2','D3','D4'];
  for(var j=0; j<3; j++){
    var zk = zoneLabels[Math.floor(Math.random()*16)];
    v26.ringGen.zoneDominance[zk] = (v26.ringGen.zoneDominance[zk]||0)+1;
  }
  v26.ringGen.sessions++;
  var totalTac = 0; for(var k in v26.ringGen.tactics) totalTac += v26.ringGen.tactics[k];
  v26.ringGen.iq = Math.min(100, Math.round(totalTac*1.5));
  v26.featureUsage26.ringGen = true;
  saveV26(v26); drawRingGenCanvas(); checkAchievementsV26();
};
window._v26RingReset = function(){
  v26.ringGen = defV26().ringGen;
  saveV26(v26); drawRingGenCanvas();
};

// ============================================================
// QUIZ V26 - 15 Questions (255->270)
// ============================================================
var secQuiz = document.createElement('div');
secQuiz.id = 'v26-sec-quiz';
secQuiz.className = 'v26-card';
secQuiz.style.display = 'none';

var quizData26 = [
  {q:'복싱에서 ACWR(Acute:Chronic Workload Ratio)의 이상적 범위는?',a:['0.3~0.5','0.8~1.3','1.5~2.0','2.0 이상'],c:1},
  {q:'펌치의 운동사슬(Kinetic Chain)에서 힘 전달의 시작점은?',a:['어깨','코어','발','손목'],c:2},
  {q:'복싱 영양학에서 파이트 위크(Fight Week) 카브 로딩은 몇 일 전에 하는가?',a:['D-1','D-3~D-5','D-7','D-10'],c:1},
  {q:'Ring Generalship에서 Cut Off 전술의 목적은?',a:['상대 후퇴로 자르기','클린치 유도','카운터 펌치','빠른 후퇴'],c:0},
  {q:'복싱에서 Philly Shell 방어 자세의 핵심 요소는?',a:['양손 높이 올리기','앞어깨 회전','웅크리고 공격','양팔로 머리 보호'],c:1},
  {q:'펌치 정확도 훈련에서 가장 효과적인 방법은?',a:['헤비백 타격','더블엔드백','미트 파트너 드릴','섬동우 복싱'],c:2},
  {q:'복싱 스파링에서 "Chin" 평가 항목이 측정하는 것은?',a:['턴 근육 힘','타격 내구성','반사신경','비전'],c:1},
  {q:'프로 복서의 평균 반응시간은 약 몇 ms인가?',a:['100ms','200ms','350ms','500ms'],c:1},
  {q:'복싱에서 Pressure Fighter 스타일의 핵심 요소는?',a:['장거리 애베','링 가운데서 카운터','끔임없는 전진과 볼륨 펌치','후퇴하며 잭 위주'],c:2},
  {q:'복싱 훈련 주기화에서 Taper 단계의 목적은?',a:['최대 부하 훈련','기초 체력 만들기','피로 회복과 피크 만들기','강도 점진적 증가'],c:2},
  {q:'복싱에서 바이오메카닉적으로 가장 강력한 펌치는?',a:['잭','크로스','리어 어퍼컷','리드 훅'],c:2},
  {q:'복싱에서 수분 보충 시 권장되는 하루 섹취량은?',a:['1L','2L','3~4L','5L 이상'],c:2},
  {q:'복싱에서 Slip과 Roll의 주요 차이점은?',a:['Slip은 수평이동, Roll은 수직이동','Slip은 수직회피, Roll은 회전회피','Slip은 앞으로, Roll은 뒤로','Slip은 발이동, Roll은 팔이동'],c:1},
  {q:'복싱 캐프 주기화에서 Base 단계는 보통 몇 주인가?',a:['1~2주','4주','8주','12주'],c:1},
  {q:'복싱에서 Corner Trap 전술의 핵심은?',a:['링 가운데서 포위','Cut Off로 코너로 몰고 커비네이션','후퇴하며 대기','클린치로 체력소모'],c:1}
];

var quizHTML26 = '<div class="v26-hdr">&#128218; Boxing Quiz v26 (15&#47928;)</div><div class="v26-sub">ACWR/바이오메카닉스/영양/링제너럴쉽/방어반응</div>';
quizData26.forEach(function(q,qi){
  quizHTML26 += '<div class="v26-card" id="v26-qq-'+qi+'" style="padding:12px"><div style="font-size:12px;font-weight:700;margin-bottom:8px">Q'+(qi+1)+'. '+q.q+'</div>';
  q.a.forEach(function(a,ai){
    quizHTML26 += '<button class="v26-btn-sec" style="display:block;width:100%;text-align:left;margin-bottom:4px;padding:8px 12px" onclick="window._v26QuizAnswer('+qi+','+ai+')">'+a+'</button>';
  });
  quizHTML26 += '<div id="v26-qr-'+qi+'" style="margin-top:6px;font-size:11px;font-weight:700"></div></div>';
});
quizHTML26 += '<div style="text-align:center;margin-top:10px"><div id="v26-quiz-score" style="font-size:13px;font-weight:800;color:var(--text)"></div></div>';
secQuiz.innerHTML = quizHTML26;
document.body.appendChild(secQuiz);

window._v26QuizAnswer = function(qi, ai){
  var q = quizData26[qi];
  var resEl = document.getElementById('v26-qr-'+qi);
  if(v26.quizV26Scores['q'+qi] !== undefined) return;
  var correct = ai === q.c;
  v26.quizV26Scores['q'+qi] = correct ? 1 : 0;
  resEl.style.color = correct ? '#22c55e' : '#ef4444';
  resEl.textContent = correct ? '✔ 정답!' : '✘ 오답 (정답: '+q.a[q.c]+')';
  playSFX26(correct ? 'quiz26' : 'accuracy_miss');
  var total = 0, cnt = 0;
  for(var k in v26.quizV26Scores){ total += v26.quizV26Scores[k]; cnt++; }
  document.getElementById('v26-quiz-score').textContent = '점수: '+total+'/'+cnt+' ('+Math.round(total/cnt*100)+'%)';
  saveV26(v26);
  checkAchievementsV26();
};

// ============================================================
// ACHIEVEMENTS V26 (+12, 226->238)
// ============================================================
var ACHS26 = [
  {id:'accuracy_tracker',name:'정확도 추적자',desc:'펌치 정확도 5회 드릴',check:function(){ return v26.punchAccuracy.sessions.length >= 5; }},
  {id:'accuracy_sniper',name:'스나이퍼',desc:'정확도 등급 A 이상',check:function(){ return v26.punchAccuracy.bestGrade==='S'||v26.punchAccuracy.bestGrade==='A'; }},
  {id:'camp_starter',name:'캄프 시작',desc:'파이트캄프 4주 완료',check:function(){ return v26.campPlan.completedWeeks >= 4; }},
  {id:'camp_finisher',name:'캄프 완주',desc:'파이트캄프 16주 완주',check:function(){ return v26.campPlan.completedWeeks >= 16; }},
  {id:'defense_driller',name:'방어 훈련병',desc:'방어 드릴 10회 완료',check:function(){ return v26.defMatrix.drills >= 10; }},
  {id:'biomech_expert',name:'바이오 전문가',desc:'바이오메카닉스 7회 분석',check:function(){ return v26.biomech.sessions >= 7; }},
  {id:'spar_warrior',name:'스파링 전사',desc:'스파링 세션 5회 완료',check:function(){ return v26.sparRadar.sessions >= 5; }},
  {id:'load_manager',name:'부하 관리자',desc:'훈련부하 10회 기록',check:function(){ return v26.trainLoad.sessions >= 10; }},
  {id:'nutrition_planner',name:'영양 플래너',desc:'영양 식단 3회 생성',check:function(){ return v26.nutrition.sessions >= 3; }},
  {id:'ring_general',name:'링 장군',desc:'링 장악력 IQ 50 이상',check:function(){ return v26.ringGen.iq >= 50; }},
  {id:'quiz_v26_ace',name:'퀴즈 v26 에이스',desc:'퀴즈 v26 12문 이상 정답',check:function(){ var t=0; for(var k in v26.quizV26Scores) t+=v26.quizV26Scores[k]; return t>=12; }},
  {id:'v26_complete',name:'v26 콤플리트',desc:'v26 전체 8기능 사용',check:function(){ return Object.keys(v26.featureUsage26).length >= 8; }}
];

function checkAchievementsV26(){
  var newCount = 0;
  ACHS26.forEach(function(a){
    if(!v26.achievementsV26[a.id] && a.check()){
      v26.achievementsV26[a.id] = true;
      newCount++;
    }
  });
  if(newCount > 0){
    playSFX26('achieve26');
    saveV26(v26);
  }
}

// ============================================================
// NAV BUTTONS - append to existing nav bar (NO new fixed bottom bar)
// ============================================================
function addV26Nav(){
  var features = [
    {id:'punchAccuracy',label:'정확도',sec:sec1},
    {id:'campPlan',label:'캄프플래너',sec:sec2},
    {id:'defMatrix',label:'방어매트릭스',sec:sec3},
    {id:'biomech',label:'바이오메카',sec:sec4},
    {id:'sparRadar',label:'스파레이더',sec:sec5},
    {id:'trainLoad',label:'부하모니터',sec:sec6},
    {id:'nutrition',label:'영양플랜',sec:sec7},
    {id:'ringGen',label:'링장악력',sec:sec8},
    {id:'quizV26',label:'퀴즈v26',sec:secQuiz}
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
    btn.style.cssText = 'padding:6px 10px;background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(109,40,217,0.15));border:1px solid rgba(167,139,250,0.3);border-radius:8px;color:#a78bfa;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .2s;flex-shrink:0;';
    btn.textContent = f.label;
    btn.onclick = function(){
      document.querySelectorAll('[id^="v26-sec-"]').forEach(function(s){ s.style.display = 'none'; });
      f.sec.style.display = 'block';
      v26.featureUsage26[f.id] = true;
      saveV26(v26);
      checkAchievementsV26();
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
  var featureIds = ['punchAccuracy','campPlan','defMatrix','biomech','sparRadar','trainLoad','nutrition','ringGen','quizV26'];
  var idx = keys.indexOf(e.key.toUpperCase());
  if(idx === -1 && e.key === '(') idx = 8;
  if(idx >= 0 && idx < sections.length){
    e.preventDefault();
    document.querySelectorAll('[id^="v26-sec-"]').forEach(function(s){ s.style.display = 'none'; });
    sections[idx].style.display = 'block';
    v26.featureUsage26[featureIds[idx]] = true;
    saveV26(v26);
    checkAchievementsV26();
  }
});

// ============================================================
// INIT
// ============================================================
setTimeout(function(){
  addV26Nav();
  drawAccuracyCanvas();
  drawCampCanvas();
  drawDefenseCanvas();
  drawBiomechCanvas();
  drawSparRadar();
  drawTrainLoadCanvas();
  drawNutritionCanvas();
  drawRingGenCanvas();
  checkAchievementsV26();
}, 700);

})();
