// Boxing Trainer Pro v19_patch.js - NEXTERA+PRISM Auto Enhancement Module
// Training Camp Planner Canvas 8-week progressive phases,
// Footwork Drill Matrix Canvas 12 drills directional arrows,
// Punch Force Estimator Canvas physics-based gauge meter,
// Boxing Film Study Canvas 10 famous fights radar analysis,
// Conditioning Circuit Builder Canvas 16 exercises circular timer,
// Weight Management Tracker Canvas line trend + target zone,
// Boxing IQ Assessment Canvas 20 scenarios fight IQ radar,
// Fight Record Book Canvas win/loss donut + career stats
// Quiz +15 (150->165), +12 Achievements (142->154), SFX 12, Keyboard +8
(function(){
'use strict';

var V19KEY = 'boxingV19Patch';

function loadV19(){
  try {
    var r = localStorage.getItem(V19KEY);
    if(!r) return defV19();
    var p = JSON.parse(r), d = defV19();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV19(); }
}
function saveV19(d){ try { localStorage.setItem(V19KEY, JSON.stringify(d)); } catch(e){} }
function defV19(){
  return {
    campPlanner: { week: 1, phase: 'base', sessions: [], totalDays: 0 },
    footwork: { drills: {}, bestTime: 0, totalDrills: 0 },
    punchForce: { records: [], maxForce: 0, avgForce: 0, sessions: 0 },
    filmStudy: { watched: [], notes: {}, totalStudied: 0 },
    circuit: { custom: [], completed: 0, totalTime: 0 },
    weightMgmt: { entries: [], target: 70, current: 75, unit: 'kg' },
    boxingIQ: { scores: [], avgIQ: 0, bestIQ: 0, attempts: 0 },
    fightRecord: { fights: [], wins: 0, losses: 0, draws: 0, kos: 0 },
    quizV19Scores: {},
    achievementsV19: {},
    featureUsage: {}
  };
}

var v19 = loadV19();

// ===== SFX ENGINE V19 =====
function playSFX19(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'camp_start':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='triangle';o.frequency.setValueAtTime(440,t);o.frequency.linearRampToValueAtTime(880,t+0.15);
        g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.2);break;
      case 'footwork_step':
        var o2=ctx.createOscillator(),g2=ctx.createGain();
        o2.type='sine';o2.frequency.setValueAtTime(220,t);o2.frequency.exponentialRampToValueAtTime(330,t+0.05);
        g2.gain.setValueAtTime(0.08,t);g2.gain.exponentialRampToValueAtTime(0.001,t+0.06);
        o2.connect(g2).connect(ctx.destination);o2.start(t);o2.stop(t+0.06);break;
      case 'force_hit':
        var bf=ctx.createBufferSource(),len=ctx.sampleRate*0.15,buf=ctx.createBuffer(1,len,ctx.sampleRate);
        var d=buf.getChannelData(0);for(var i=0;i<len;i++){d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2);}
        bf.buffer=buf;var gf=ctx.createGain();gf.gain.setValueAtTime(0.15,t);gf.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        bf.connect(gf).connect(ctx.destination);bf.start(t);break;
      case 'film_play':
        [523,659,784].forEach(function(f,j){
          var o3=ctx.createOscillator(),g3=ctx.createGain();
          o3.type='sine';o3.frequency.value=f;
          g3.gain.setValueAtTime(0.06,t+j*0.08);g3.gain.exponentialRampToValueAtTime(0.001,t+j*0.08+0.12);
          o3.connect(g3).connect(ctx.destination);o3.start(t+j*0.08);o3.stop(t+j*0.08+0.12);
        });break;
      case 'circuit_beep':
        var o4=ctx.createOscillator(),g4=ctx.createGain();
        o4.type='square';o4.frequency.setValueAtTime(1000,t);
        g4.gain.setValueAtTime(0.06,t);g4.gain.exponentialRampToValueAtTime(0.001,t+0.08);
        o4.connect(g4).connect(ctx.destination);o4.start(t);o4.stop(t+0.08);break;
      case 'weight_log':
        var o5=ctx.createOscillator(),g5=ctx.createGain();
        o5.type='sine';o5.frequency.setValueAtTime(660,t);o5.frequency.linearRampToValueAtTime(440,t+0.1);
        g5.gain.setValueAtTime(0.07,t);g5.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o5.connect(g5).connect(ctx.destination);o5.start(t);o5.stop(t+0.12);break;
      case 'iq_correct':
        [523,784,1047].forEach(function(f,j){
          var o6=ctx.createOscillator(),g6=ctx.createGain();
          o6.type='triangle';o6.frequency.value=f;
          g6.gain.setValueAtTime(0.08,t+j*0.06);g6.gain.exponentialRampToValueAtTime(0.001,t+j*0.06+0.1);
          o6.connect(g6).connect(ctx.destination);o6.start(t+j*0.06);o6.stop(t+j*0.06+0.1);
        });break;
      case 'iq_wrong':
        var o7=ctx.createOscillator(),g7=ctx.createGain();
        o7.type='sawtooth';o7.frequency.setValueAtTime(300,t);o7.frequency.linearRampToValueAtTime(100,t+0.2);
        g7.gain.setValueAtTime(0.06,t);g7.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o7.connect(g7).connect(ctx.destination);o7.start(t);o7.stop(t+0.25);break;
      case 'fight_win':
        [262,330,392,523,659,784,1047].forEach(function(f,j){
          var o8=ctx.createOscillator(),g8=ctx.createGain();
          o8.type='triangle';o8.frequency.value=f;
          g8.gain.setValueAtTime(0.08,t+j*0.08);g8.gain.exponentialRampToValueAtTime(0.001,t+j*0.08+0.15);
          o8.connect(g8).connect(ctx.destination);o8.start(t+j*0.08);o8.stop(t+j*0.08+0.15);
        });break;
      case 'fight_loss':
        var o9=ctx.createOscillator(),g9=ctx.createGain();
        o9.type='sine';o9.frequency.setValueAtTime(440,t);o9.frequency.linearRampToValueAtTime(220,t+0.4);
        g9.gain.setValueAtTime(0.07,t);g9.gain.exponentialRampToValueAtTime(0.001,t+0.5);
        o9.connect(g9).connect(ctx.destination);o9.start(t);o9.stop(t+0.5);break;
      case 'achievement_v19':
        [523,659,784,1047,1319].forEach(function(f,j){
          var oa=ctx.createOscillator(),ga=ctx.createGain();
          oa.type='sine';oa.frequency.value=f;
          ga.gain.setValueAtTime(0.07,t+j*0.09);ga.gain.exponentialRampToValueAtTime(0.001,t+j*0.09+0.18);
          oa.connect(ga).connect(ctx.destination);oa.start(t+j*0.09);oa.stop(t+j*0.09+0.18);
        });break;
      case 'nav_v19':
        var ob=ctx.createOscillator(),gb=ctx.createGain();
        ob.type='sine';ob.frequency.setValueAtTime(600,t);ob.frequency.exponentialRampToValueAtTime(900,t+0.05);
        gb.gain.setValueAtTime(0.05,t);gb.gain.exponentialRampToValueAtTime(0.001,t+0.06);
        ob.connect(gb).connect(ctx.destination);ob.start(t);ob.stop(t+0.06);break;
    }
    setTimeout(function(){ ctx.close(); }, 2000);
  } catch(e){}
}

// ===== STYLES =====
var styleV19 = document.createElement('style');
styleV19.textContent = [
  '#v19-camp-canvas,#v19-footwork-canvas,#v19-force-canvas,#v19-film-canvas,',
  '#v19-circuit-canvas,#v19-weight-canvas,#v19-iq-canvas,#v19-record-canvas{',
  'background:rgba(0,0,0,0.2);image-rendering:auto}',
  '.v19-btn{padding:8px 16px;background:linear-gradient(135deg,#FF4444,#CC2222);',
  'border:none;border-radius:10px;color:#fff;font-weight:700;cursor:pointer;font-size:12px;',
  'transition:transform 0.15s,box-shadow 0.15s}',
  '.v19-btn:active{transform:scale(0.95)}',
  '.v19-btn-sec{padding:8px 16px;background:var(--surface);border:1px solid var(--glass-border);',
  'border-radius:10px;color:var(--text-dim);font-size:12px;cursor:pointer}',
  '.v19-badge{display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;',
  'border-radius:12px;font-size:22px;background:var(--surface);border:1px solid var(--glass-border);',
  'transition:all 0.3s;position:relative}',
  '.v19-badge.unlocked{background:linear-gradient(135deg,rgba(255,215,0,0.15),rgba(255,68,68,0.1));',
  'border-color:var(--gold);box-shadow:0 0 12px rgba(255,215,0,0.2);animation:badge-unlock 0.5s ease}'
].join('');
document.head.appendChild(styleV19);

// ===== 1. TRAINING CAMP PLANNER =====
var CAMP_PHASES = [
  {name:'Base',weeks:2,color:'#3b82f6',focus:'Endurance + technique foundation'},
  {name:'Build',weeks:2,color:'#22c55e',focus:'Power + speed development'},
  {name:'Peak',weeks:3,color:'#f97316',focus:'Sparring + fight simulation'},
  {name:'Taper',weeks:1,color:'#a855f7',focus:'Recovery + mental preparation'}
];
var CAMP_ACTIVITIES = [
  'Morning Run 5km','Shadow Boxing 5R','Heavy Bag 6R','Mitt Work 4R',
  'Sparring 3R','Core Workout','Footwork Drills','Speed Bag 3R',
  'Jump Rope 15min','Stretching 20min','Film Study 1hr','Rest Day'
];

function drawCampCanvas(){
  var c = document.getElementById('v19-camp-canvas'); if(!c) return;
  var ctx = c.getContext('2d'), w = c.width, h = c.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = 'rgba(15,10,30,0.9)'; ctx.fillRect(0,0,w,h);
  ctx.font = 'bold 14px sans-serif'; ctx.fillStyle = '#FF4444';
  ctx.fillText('8-Week Fight Camp', 15, 25);
  var bw = (w-60)/8, bh = h - 70;
  CAMP_PHASES.forEach(function(phase, pi){
    var startWeek = 0;
    for(var pp=0; pp<pi; pp++) startWeek += CAMP_PHASES[pp].weeks;
    for(var wi=0; wi<phase.weeks; wi++){
      var weekIdx = startWeek + wi;
      var x = 20 + weekIdx * bw, y = 40;
      var intensity = phase.name === 'Taper' ? 0.5 : (weekIdx + 1) / 8;
      var barH = bh * intensity;
      ctx.fillStyle = phase.color + '33';
      ctx.fillRect(x+2, y + bh - barH, bw-4, barH);
      ctx.fillStyle = phase.color;
      ctx.fillRect(x+2, y + bh - barH, bw-4, 4);
      var isCurrentWeek = (weekIdx + 1) === v19.campPlanner.week;
      if(isCurrentWeek){
        ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2;
        ctx.strokeRect(x+1, y-2, bw-2, bh+8);
        ctx.lineWidth = 1;
      }
      ctx.font = '10px sans-serif'; ctx.fillStyle = '#ccc'; ctx.textAlign = 'center';
      ctx.fillText('W' + (weekIdx+1), x + bw/2, y + bh + 14);
    }
  });
  var legendY = h - 15;
  var lx = 15;
  CAMP_PHASES.forEach(function(p){
    ctx.fillStyle = p.color;
    ctx.fillRect(lx, legendY-6, 8, 8);
    ctx.font = '9px sans-serif'; ctx.fillStyle = '#aaa'; ctx.textAlign = 'left';
    ctx.fillText(p.name, lx+11, legendY+2);
    lx += ctx.measureText(p.name).width + 22;
  });
  ctx.textAlign = 'left';
  var currentPhase = getCampPhase(v19.campPlanner.week);
  ctx.font = '11px sans-serif'; ctx.fillStyle = '#FFD700';
  ctx.fillText('Week ' + v19.campPlanner.week + ' / ' + currentPhase.name + ' Phase', w-200, 25);
}

function getCampPhase(week){
  var w = 0;
  for(var i=0; i<CAMP_PHASES.length; i++){
    w += CAMP_PHASES[i].weeks;
    if(week <= w) return CAMP_PHASES[i];
  }
  return CAMP_PHASES[3];
}

function advanceCampWeek(){
  v19.campPlanner.week = v19.campPlanner.week >= 8 ? 1 : v19.campPlanner.week + 1;
  v19.campPlanner.totalDays += 7;
  var activity = CAMP_ACTIVITIES[Math.floor(Math.random()*CAMP_ACTIVITIES.length)];
  v19.campPlanner.sessions.push({week:v19.campPlanner.week, activity:activity});
  if(v19.campPlanner.sessions.length > 30) v19.campPlanner.sessions = v19.campPlanner.sessions.slice(-30);
  saveV19(v19); drawCampCanvas(); playSFX19('camp_start');
  checkV19Achievements();
}

// ===== 2. FOOTWORK DRILL MATRIX =====
var FOOTWORK_DRILLS = [
  {name:'Shuffle Step',dir:'LR',desc:'Side-to-side lateral movement',icon:'↔️'},
  {name:'Pivot Left',dir:'CCW',desc:'Counter-clockwise pivot on lead foot',icon:'↩️'},
  {name:'Pivot Right',dir:'CW',desc:'Clockwise pivot on rear foot',icon:'↪️'},
  {name:'Step & Slide',dir:'F',desc:'Forward advance with slide',icon:'⬆️'},
  {name:'Retreat Slide',dir:'B',desc:'Backward retreat maintaining stance',icon:'⬇️'},
  {name:'L-Step',dir:'L',desc:'Angle off to the left',icon:'↙️'},
  {name:'V-Step',dir:'V',desc:'V-pattern forward angles',icon:'🔻'},
  {name:'Circle Left',dir:'CCW',desc:'Full circle movement left',icon:'🔄'},
  {name:'Circle Right',dir:'CW',desc:'Full circle movement right',icon:'🔃'},
  {name:'In-Out Bounce',dir:'FB',desc:'Forward-backward bounce rhythm',icon:'↕️'},
  {name:'Cut-Off Angle',dir:'D',desc:'Diagonal cut to corner',icon:'↗️'},
  {name:'Ali Shuffle',dir:'S',desc:'Quick feet switch stance shuffle',icon:'👟'}
];

function drawFootworkCanvas(){
  var c = document.getElementById('v19-footwork-canvas'); if(!c) return;
  var ctx = c.getContext('2d'), w = c.width, h = c.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = 'rgba(15,10,30,0.9)'; ctx.fillRect(0,0,w,h);
  ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = '#3b82f6';
  ctx.fillText('Footwork Drill Matrix (12)', 15, 22);
  var cols = 4, rows = 3;
  var cellW = (w-40)/cols, cellH = (h-50)/rows;
  FOOTWORK_DRILLS.forEach(function(drill, i){
    var col = i % cols, row = Math.floor(i/cols);
    var x = 15 + col*cellW, y = 35 + row*cellH;
    var done = v19.footwork.drills[drill.name] || 0;
    ctx.fillStyle = done > 0 ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.03)';
    ctx.fillRect(x+2, y+2, cellW-4, cellH-4);
    ctx.strokeStyle = done > 0 ? '#22c55e44' : 'rgba(255,255,255,0.06)';
    ctx.strokeRect(x+2, y+2, cellW-4, cellH-4);
    ctx.font = '10px sans-serif'; ctx.fillStyle = done > 0 ? '#22c55e' : '#aaa';
    ctx.textAlign = 'center';
    ctx.fillText(drill.name, x+cellW/2, y+cellH/2-6);
    ctx.font = '9px sans-serif'; ctx.fillStyle = '#888';
    ctx.fillText(drill.dir + (done > 0 ? ' x'+done : ''), x+cellW/2, y+cellH/2+8);
  });
  ctx.textAlign = 'left';
  ctx.font = '10px sans-serif'; ctx.fillStyle = '#FFD700';
  ctx.fillText('Total: ' + v19.footwork.totalDrills + ' drills completed', 15, h-8);
}

function doFootworkDrill(){
  var drill = FOOTWORK_DRILLS[Math.floor(Math.random()*FOOTWORK_DRILLS.length)];
  if(!v19.footwork.drills[drill.name]) v19.footwork.drills[drill.name] = 0;
  v19.footwork.drills[drill.name]++;
  v19.footwork.totalDrills++;
  saveV19(v19); drawFootworkCanvas(); playSFX19('footwork_step');
  checkV19Achievements();
}

// ===== 3. PUNCH FORCE ESTIMATOR =====
function drawForceCanvas(){
  var c = document.getElementById('v19-force-canvas'); if(!c) return;
  var ctx = c.getContext('2d'), w = c.width, h = c.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = 'rgba(15,10,30,0.9)'; ctx.fillRect(0,0,w,h);
  ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = '#f97316';
  ctx.fillText('Punch Force Estimator', 15, 22);
  var cx = w/2, cy = h/2 + 15, radius = Math.min(w,h)/2 - 35;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, Math.PI, 0, false);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 18;
  ctx.stroke();
  var maxN = 1200;
  var force = v19.punchForce.maxForce || 0;
  var pct = Math.min(force / maxN, 1);
  var endAngle = Math.PI + pct * Math.PI;
  var grad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
  grad.addColorStop(0, '#22c55e'); grad.addColorStop(0.5, '#f97316'); grad.addColorStop(1, '#FF4444');
  ctx.beginPath();
  ctx.arc(cx, cy, radius, Math.PI, endAngle, false);
  ctx.strokeStyle = grad; ctx.lineWidth = 18;
  ctx.stroke();
  ctx.lineWidth = 1;
  for(var n=0; n<=maxN; n+=200){
    var angle = Math.PI + (n/maxN)*Math.PI;
    var tx = cx + (radius+14)*Math.cos(angle);
    var ty = cy + (radius+14)*Math.sin(angle);
    ctx.font = '8px sans-serif'; ctx.fillStyle = '#666'; ctx.textAlign = 'center';
    ctx.fillText(n+'N', tx, ty+3);
  }
  ctx.font = 'bold 24px sans-serif'; ctx.fillStyle = '#FFD700'; ctx.textAlign = 'center';
  ctx.fillText(force + ' N', cx, cy - 5);
  ctx.font = '10px sans-serif'; ctx.fillStyle = '#aaa';
  ctx.fillText('Max Force', cx, cy + 10);
  ctx.font = '9px sans-serif'; ctx.fillStyle = '#888';
  ctx.fillText('Avg: ' + (v19.punchForce.avgForce||0) + 'N | Sessions: ' + (v19.punchForce.sessions||0), cx, h-8);
  ctx.textAlign = 'left';
}

function measureForce(){
  var bodyWeight = 70 + Math.random()*20;
  var handSpeed = 8 + Math.random()*7;
  var handMass = bodyWeight * (0.006 + Math.random()*0.004);
  var impactTime = 0.02 + Math.random()*0.03;
  var force = Math.round(handMass * handSpeed / impactTime);
  force = Math.max(200, Math.min(1200, force));
  v19.punchForce.records.push(force);
  if(v19.punchForce.records.length > 50) v19.punchForce.records = v19.punchForce.records.slice(-50);
  v19.punchForce.maxForce = Math.max(v19.punchForce.maxForce, force);
  var sum = 0; v19.punchForce.records.forEach(function(f){ sum += f; });
  v19.punchForce.avgForce = Math.round(sum / v19.punchForce.records.length);
  v19.punchForce.sessions++;
  saveV19(v19); drawForceCanvas(); playSFX19('force_hit');
  checkV19Achievements();
}

// ===== 4. BOXING FILM STUDY =====
var FAMOUS_FIGHTS = [
  {name:'Ali vs Foreman',year:1974,desc:'Rumble in the Jungle',style:{speed:7,power:6,defense:10,footwork:9,iq:10,stamina:8}},
  {name:'Leonard vs Hearns',year:1981,desc:'The Showdown',style:{speed:9,power:8,defense:7,footwork:9,iq:8,stamina:7}},
  {name:'Hagler vs Hearns',year:1985,desc:'The War',style:{speed:8,power:10,defense:5,footwork:6,iq:7,stamina:6}},
  {name:'Tyson vs Douglas',year:1990,desc:'Miracle on Ice',style:{speed:9,power:10,defense:4,footwork:7,iq:5,stamina:6}},
  {name:'Lewis vs Tyson',year:2002,desc:'Finally',style:{speed:6,power:9,defense:8,footwork:6,iq:8,stamina:7}},
  {name:'Pacquiao vs Marquez IV',year:2012,desc:'Juan More Time',style:{speed:10,power:7,defense:6,footwork:9,iq:7,stamina:9}},
  {name:'Ward vs Gatti I',year:2002,desc:'Round of the Century',style:{speed:7,power:7,defense:5,footwork:6,iq:8,stamina:10}},
  {name:'Mayweather vs Pacquiao',year:2015,desc:'Fight of the Century',style:{speed:8,power:5,defense:10,footwork:9,iq:10,stamina:8}},
  {name:'Canelo vs GGG I',year:2017,desc:'Supremacy',style:{speed:8,power:9,defense:8,footwork:7,iq:8,stamina:8}},
  {name:'Fury vs Wilder III',year:2021,desc:'Trilogy',style:{speed:7,power:10,defense:7,footwork:8,iq:9,stamina:9}}
];
var filmIdx = 0;

function drawFilmCanvas(){
  var c = document.getElementById('v19-film-canvas'); if(!c) return;
  var ctx = c.getContext('2d'), w = c.width, h = c.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = 'rgba(15,10,30,0.9)'; ctx.fillRect(0,0,w,h);
  var fight = FAMOUS_FIGHTS[filmIdx];
  ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = '#a855f7';
  ctx.fillText('Film Study: ' + fight.name + ' (' + fight.year + ')', 15, 22);
  ctx.font = '10px sans-serif'; ctx.fillStyle = '#888';
  ctx.fillText(fight.desc, 15, 36);
  var cx = w/2, cy = h/2+15, r = Math.min(w,h)/2 - 50;
  var axes = ['Speed','Power','Defense','Footwork','IQ','Stamina'];
  var vals = [fight.style.speed, fight.style.power, fight.style.defense, fight.style.footwork, fight.style.iq, fight.style.stamina];
  for(var ring=2; ring<=10; ring+=2){
    ctx.beginPath();
    for(var j=0; j<6; j++){
      var angle = -Math.PI/2 + j*Math.PI/3;
      var px = cx + r*(ring/10)*Math.cos(angle);
      var py = cy + r*(ring/10)*Math.sin(angle);
      if(j===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.closePath(); ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.stroke();
  }
  for(var a=0; a<6; a++){
    var angle2 = -Math.PI/2 + a*Math.PI/3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r*Math.cos(angle2), cy + r*Math.sin(angle2));
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.stroke();
    var lx = cx + (r+16)*Math.cos(angle2);
    var ly = cy + (r+16)*Math.sin(angle2);
    ctx.font = '9px sans-serif'; ctx.fillStyle = '#aaa'; ctx.textAlign = 'center';
    ctx.fillText(axes[a], lx, ly+3);
  }
  ctx.beginPath();
  for(var v=0; v<6; v++){
    var angle3 = -Math.PI/2 + v*Math.PI/3;
    var vx = cx + r*(vals[v]/10)*Math.cos(angle3);
    var vy = cy + r*(vals[v]/10)*Math.sin(angle3);
    if(v===0) ctx.moveTo(vx,vy); else ctx.lineTo(vx,vy);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(168,85,247,0.2)'; ctx.fill();
  ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 2; ctx.stroke();
  ctx.lineWidth = 1;
  for(var d=0; d<6; d++){
    var angle4 = -Math.PI/2 + d*Math.PI/3;
    var dx = cx + r*(vals[d]/10)*Math.cos(angle4);
    var dy = cy + r*(vals[d]/10)*Math.sin(angle4);
    ctx.beginPath(); ctx.arc(dx,dy,3,0,Math.PI*2);
    ctx.fillStyle = '#a855f7'; ctx.fill();
  }
  ctx.textAlign = 'left';
  var watched = v19.filmStudy.watched.indexOf(fight.name) >= 0;
  ctx.font = '10px sans-serif'; ctx.fillStyle = watched ? '#22c55e' : '#666';
  ctx.fillText(watched ? '✓ Studied' : '○ Not studied', 15, h-8);
  ctx.fillStyle = '#666';
  ctx.fillText((filmIdx+1)+'/'+FAMOUS_FIGHTS.length, w-50, h-8);
}

function nextFilm(){
  filmIdx = (filmIdx + 1) % FAMOUS_FIGHTS.length;
  drawFilmCanvas(); playSFX19('film_play');
}

function studyFilm(){
  var fight = FAMOUS_FIGHTS[filmIdx];
  if(v19.filmStudy.watched.indexOf(fight.name) < 0){
    v19.filmStudy.watched.push(fight.name);
    v19.filmStudy.totalStudied++;
  }
  saveV19(v19); drawFilmCanvas(); playSFX19('film_play');
  checkV19Achievements();
}

// ===== 5. CONDITIONING CIRCUIT BUILDER =====
var CIRCUIT_EXERCISES = [
  {name:'Burpees',dur:30,icon:'🏋️'},{name:'Mountain Climbers',dur:30,icon:'⛰️'},
  {name:'Jump Squats',dur:30,icon:'🦵'},{name:'Push-ups',dur:30,icon:'💪'},
  {name:'Plank Hold',dur:45,icon:'🧘'},{name:'High Knees',dur:30,icon:'🦶'},
  {name:'Box Jumps',dur:20,icon:'📦'},{name:'Medicine Ball Slams',dur:30,icon:'🏐'},
  {name:'Battle Ropes',dur:30,icon:'🪢'},{name:'Kettlebell Swings',dur:30,icon:'🔔'},
  {name:'Sprawls',dur:30,icon:'🤸'},{name:'TRX Rows',dur:30,icon:'🏗️'},
  {name:'Sled Push',dur:20,icon:'🛷'},{name:'Bear Crawl',dur:30,icon:'🐻'},
  {name:'Wall Balls',dur:30,icon:'🧱'},{name:'Farmer Walk',dur:30,icon:'🚶'}
];

function drawCircuitCanvas(){
  var c = document.getElementById('v19-circuit-canvas'); if(!c) return;
  var ctx = c.getContext('2d'), w = c.width, h = c.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = 'rgba(15,10,30,0.9)'; ctx.fillRect(0,0,w,h);
  ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = '#22c55e';
  ctx.fillText('Conditioning Circuit (16 Exercises)', 15, 22);
  var cx = w/2, cy = h/2+8, r = Math.min(w,h)/2 - 40;
  var count = CIRCUIT_EXERCISES.length;
  CIRCUIT_EXERCISES.forEach(function(ex, i){
    var angle = -Math.PI/2 + (i/count)*Math.PI*2;
    var px = cx + r*Math.cos(angle);
    var py = cy + r*Math.sin(angle);
    var done = (v19.circuit.custom.indexOf(ex.name) >= 0);
    ctx.beginPath(); ctx.arc(px,py,14,0,Math.PI*2);
    ctx.fillStyle = done ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.04)';
    ctx.fill();
    ctx.strokeStyle = done ? '#22c55e' : 'rgba(255,255,255,0.1)';
    ctx.stroke();
    ctx.font = '8px sans-serif'; ctx.fillStyle = done ? '#22c55e' : '#888';
    ctx.textAlign = 'center';
    var shortName = ex.name.length > 8 ? ex.name.substring(0,8) : ex.name;
    ctx.fillText(shortName, px, py+3);
  });
  ctx.beginPath(); ctx.arc(cx,cy,r-22,0,Math.PI*2);
  ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.stroke();
  ctx.font = 'bold 16px sans-serif'; ctx.fillStyle = '#FFD700'; ctx.textAlign = 'center';
  ctx.fillText(v19.circuit.completed + ' circuits', cx, cy-4);
  ctx.font = '10px sans-serif'; ctx.fillStyle = '#888';
  ctx.fillText('Total: ' + Math.round(v19.circuit.totalTime/60) + ' min', cx, cy+12);
  ctx.textAlign = 'left';
}

function runCircuit(){
  var shuffled = CIRCUIT_EXERCISES.slice().sort(function(){return Math.random()-0.5;});
  var selected = shuffled.slice(0,6);
  v19.circuit.custom = selected.map(function(e){return e.name;});
  var totalSec = 0; selected.forEach(function(e){ totalSec += e.dur; });
  v19.circuit.totalTime += totalSec;
  v19.circuit.completed++;
  saveV19(v19); drawCircuitCanvas(); playSFX19('circuit_beep');
  checkV19Achievements();
}

// ===== 6. WEIGHT MANAGEMENT TRACKER =====
function drawWeightCanvas(){
  var c = document.getElementById('v19-weight-canvas'); if(!c) return;
  var ctx = c.getContext('2d'), w = c.width, h = c.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = 'rgba(15,10,30,0.9)'; ctx.fillRect(0,0,w,h);
  ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = '#3b82f6';
  ctx.fillText('Weight Management Tracker', 15, 22);
  var entries = v19.weightMgmt.entries;
  var target = v19.weightMgmt.target;
  var pad = {l:40, r:20, t:45, b:30};
  var gw = w - pad.l - pad.r, gh = h - pad.t - pad.b;
  if(entries.length < 2){
    ctx.font = '11px sans-serif'; ctx.fillStyle = '#888'; ctx.textAlign = 'center';
    ctx.fillText('Log weight to start tracking', w/2, h/2);
    ctx.textAlign = 'left';
    return;
  }
  var minW = 999, maxW = 0;
  entries.forEach(function(e){ if(e.w < minW) minW = e.w; if(e.w > maxW) maxW = e.w; });
  minW = Math.min(minW, target) - 2; maxW = Math.max(maxW, target) + 2;
  var range = maxW - minW || 1;
  ctx.strokeStyle = '#FF444444'; ctx.setLineDash([4,4]);
  var ty = pad.t + gh * (1-(target-minW)/range);
  ctx.beginPath(); ctx.moveTo(pad.l, ty); ctx.lineTo(w-pad.r, ty); ctx.stroke();
  ctx.setLineDash([]);
  ctx.font = '9px sans-serif'; ctx.fillStyle = '#FF4444'; ctx.textAlign = 'right';
  ctx.fillText('Target: '+target+'kg', w-pad.r, ty-4);
  ctx.fillStyle = 'rgba(59,130,246,0.15)';
  ctx.beginPath();
  ctx.moveTo(pad.l, pad.t+gh);
  entries.forEach(function(e, i){
    var x = pad.l + (i/(entries.length-1))*gw;
    var y = pad.t + gh*(1-(e.w-minW)/range);
    ctx.lineTo(x, y);
  });
  ctx.lineTo(pad.l + gw, pad.t+gh);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
  entries.forEach(function(e, i){
    var x = pad.l + (i/(entries.length-1))*gw;
    var y = pad.t + gh*(1-(e.w-minW)/range);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke(); ctx.lineWidth = 1;
  var last = entries[entries.length-1];
  var lx = pad.l + gw;
  var ly = pad.t + gh*(1-(last.w-minW)/range);
  ctx.beginPath(); ctx.arc(lx,ly,4,0,Math.PI*2);
  ctx.fillStyle = '#3b82f6'; ctx.fill();
  ctx.font = 'bold 11px sans-serif'; ctx.fillStyle = '#FFD700'; ctx.textAlign = 'left';
  ctx.fillText(last.w + 'kg', lx-30, ly-8);
  for(var tick=Math.ceil(minW); tick<=maxW; tick+=2){
    var yy = pad.t + gh*(1-(tick-minW)/range);
    ctx.font = '8px sans-serif'; ctx.fillStyle = '#555'; ctx.textAlign = 'right';
    ctx.fillText(tick+'', pad.l-4, yy+3);
  }
  ctx.textAlign = 'left';
  ctx.font = '10px sans-serif'; ctx.fillStyle = '#888';
  var diff = last.w - target;
  ctx.fillText((diff > 0 ? '+' : '') + diff.toFixed(1) + 'kg from target | ' + entries.length + ' logs', 15, h-8);
}

function logWeight(){
  var current = v19.weightMgmt.current;
  var change = (Math.random()-0.5)*1.2;
  current = Math.round((current + change)*10)/10;
  current = Math.max(45, Math.min(130, current));
  v19.weightMgmt.current = current;
  v19.weightMgmt.entries.push({w:current, d:new Date().toISOString().slice(0,10)});
  if(v19.weightMgmt.entries.length > 60) v19.weightMgmt.entries = v19.weightMgmt.entries.slice(-60);
  saveV19(v19); drawWeightCanvas(); playSFX19('weight_log');
  checkV19Achievements();
}

// ===== 7. BOXING IQ ASSESSMENT =====
var BOXING_IQ_QUESTIONS = [
  {q:'Opponent keeps dropping lead hand. Best counter?',a:['Overhand right','Jab to body','Right cross over the top','Wait and see'],c:2},
  {q:'You are cut above the eye in round 8. Strategy?',a:['Fight aggressively','Protect the cut, use jab','Clinch every exchange','Switch to southpaw'],c:1},
  {q:'Taller opponent with long reach. Best approach?',a:['Stay outside and jab','Close distance, fight inside','Circle and counter','Match reach jab for jab'],c:1},
  {q:'Down on scorecards entering round 12. What to do?',a:['Go for the knockout','Outbox and hope for the best','Same strategy, trust judges','Clinch to preserve energy'],c:0},
  {q:'Opponent is a pressure fighter. Best game plan?',a:['Match pressure with pressure','Use lateral movement, counter','Stand and trade','Run and clinch'],c:1},
  {q:'Your corner says opponent hurt his right hand. Exploit how?',a:['Attack his right side body','Force him to throw right','Circle to his right','Ignore, stick to plan'],c:1},
  {q:'Opponent loading up on power shots. Best response?',a:['Load up on yours too','Stay compact, counter short','Move straight back','Drop hands to bait'],c:1},
  {q:'You rocked opponent but he is on the ropes. Do what?',a:['Throw everything wildly','Controlled combinations, cut ring','Step back and rest','Clinch to burn time'],c:1},
  {q:'Southpaw opponent. Where should your lead foot be?',a:['Inside his lead foot','Outside his lead foot','Behind his lead foot','Beside his rear foot'],c:1},
  {q:'Body shot ratio is low after 6 rounds. Adjustment?',a:['Double up jabs to body','Alternate head-body combos','Ignore body, go head only','Throw only body shots'],c:1},
  {q:'What is the purpose of a feint?',a:['To look cool','Create openings by drawing reactions','Rest between punches','To annoy the opponent'],c:1},
  {q:'You are gassed in round 10. How to survive?',a:['Clinch intelligently, reset','Keep throwing to stay busy','Sprint around the ring','Quit and save energy'],c:0},
  {q:'Opponent has great chin. Best approach?',a:['Try harder headshots','Accumulate body work','Only throw hooks','Wrestle and clinch'],c:1},
  {q:'Your jab is landing. What to add?',a:['Double/triple jab','Jab-cross combo','Jab to body','All of the above'],c:3},
  {q:'Best punch to throw when stepping back?',a:['Lead hook','Cross','Jab','Uppercut'],c:2},
  {q:'When should you use the clinch?',a:['When you are hurt','To disrupt rhythm','To rest briefly','All of the above'],c:3},
  {q:'Opponent switches stances frequently. Counter?',a:['Mirror their stance switches','Attack during the switch','Ignore and keep boxing','Switch stances too'],c:1},
  {q:'Ideal punch to follow a jab to the body?',a:['Lead uppercut','Cross to head','Lead hook','Jab again'],c:0},
  {q:'Distance management when opponent rushes in?',a:['Step straight back','Pivot and angle off','Stand ground, throw','All valid depending on context'],c:3},
  {q:'You won rounds 1-6 clearly. Strategy for 7-12?',a:['Coast and avoid risk','Maintain pressure','Go for stoppage','Clinch every round'],c:1}
];
var iqQuestionIdx = 0, iqScore = 0, iqActive = false;

function drawIQCanvas(){
  var c = document.getElementById('v19-iq-canvas'); if(!c) return;
  var ctx = c.getContext('2d'), w = c.width, h = c.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = 'rgba(15,10,30,0.9)'; ctx.fillRect(0,0,w,h);
  ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = '#FFD700';
  ctx.fillText('Boxing IQ Assessment', 15, 22);
  if(!iqActive){
    var cx = w/2, cy = h/2+5;
    var axes = ['Offense','Defense','Ring IQ','Stamina','Countering','Adaptability'];
    var r = Math.min(w,h)/2 - 50;
    for(var ring=2; ring<=10; ring+=2){
      ctx.beginPath();
      for(var j=0; j<6; j++){
        var angle = -Math.PI/2 + j*Math.PI/3;
        var px = cx + r*(ring/10)*Math.cos(angle);
        var py = cy + r*(ring/10)*Math.sin(angle);
        if(j===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
      }
      ctx.closePath(); ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.stroke();
    }
    var bestIQ = v19.boxingIQ.bestIQ || 0;
    var iqVals = [
      Math.min(10, bestIQ/10*1.2),
      Math.min(10, bestIQ/10*0.9),
      Math.min(10, bestIQ/10),
      Math.min(10, bestIQ/10*0.8),
      Math.min(10, bestIQ/10*1.1),
      Math.min(10, bestIQ/10*0.95)
    ];
    ctx.beginPath();
    for(var v=0; v<6; v++){
      var angle2 = -Math.PI/2 + v*Math.PI/3;
      var vx = cx + r*(iqVals[v]/10)*Math.cos(angle2);
      var vy = cy + r*(iqVals[v]/10)*Math.sin(angle2);
      if(v===0) ctx.moveTo(vx,vy); else ctx.lineTo(vx,vy);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,215,0,0.15)'; ctx.fill();
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2; ctx.stroke();
    ctx.lineWidth = 1;
    for(var a=0; a<6; a++){
      var angle3 = -Math.PI/2 + a*Math.PI/3;
      ctx.beginPath(); ctx.moveTo(cx,cy);
      ctx.lineTo(cx + r*Math.cos(angle3), cy + r*Math.sin(angle3));
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.stroke();
      var lx = cx + (r+16)*Math.cos(angle3);
      var ly = cy + (r+16)*Math.sin(angle3);
      ctx.font = '9px sans-serif'; ctx.fillStyle = '#aaa'; ctx.textAlign = 'center';
      ctx.fillText(axes[a], lx, ly+3);
    }
    ctx.font = 'bold 20px sans-serif'; ctx.fillStyle = '#FFD700';
    ctx.fillText('IQ: ' + bestIQ, cx, cy+3);
    ctx.textAlign = 'left';
    ctx.font = '10px sans-serif'; ctx.fillStyle = '#888';
    ctx.fillText('Attempts: ' + v19.boxingIQ.attempts + ' | Best: ' + bestIQ + '/100', 15, h-8);
  } else {
    if(iqQuestionIdx < BOXING_IQ_QUESTIONS.length){
      ctx.font = '10px sans-serif'; ctx.fillStyle = '#888';
      ctx.fillText('Q' + (iqQuestionIdx+1) + '/' + BOXING_IQ_QUESTIONS.length + ' | Score: ' + iqScore, 15, 40);
    }
  }
}

function startIQTest(){
  iqQuestionIdx = 0; iqScore = 0; iqActive = true;
  showIQQuestion();
}

function showIQQuestion(){
  var area = document.getElementById('v19-iq-area'); if(!area) return;
  if(iqQuestionIdx >= BOXING_IQ_QUESTIONS.length){
    var finalScore = Math.round(iqScore / BOXING_IQ_QUESTIONS.length * 100);
    v19.boxingIQ.attempts++;
    v19.boxingIQ.scores.push(finalScore);
    if(v19.boxingIQ.scores.length > 20) v19.boxingIQ.scores = v19.boxingIQ.scores.slice(-20);
    v19.boxingIQ.bestIQ = Math.max(v19.boxingIQ.bestIQ, finalScore);
    var sum = 0; v19.boxingIQ.scores.forEach(function(s){ sum += s; });
    v19.boxingIQ.avgIQ = Math.round(sum / v19.boxingIQ.scores.length);
    iqActive = false;
    saveV19(v19); drawIQCanvas();
    var grade = finalScore >= 90 ? 'S' : finalScore >= 75 ? 'A' : finalScore >= 60 ? 'B' : finalScore >= 40 ? 'C' : 'D';
    area.innerHTML = '<div style="text-align:center;padding:16px"><div style="font-size:24px;font-weight:bold;color:#FFD700">' + finalScore + '/100</div><div style="font-size:14px;color:var(--text-dim);margin-top:6px">Grade: ' + grade + '</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px">' + iqScore + '/' + BOXING_IQ_QUESTIONS.length + ' correct</div></div>';
    playSFX19(finalScore >= 60 ? 'iq_correct' : 'iq_wrong');
    checkV19Achievements();
    return;
  }
  var q = BOXING_IQ_QUESTIONS[iqQuestionIdx];
  var html = '<div style="padding:10px"><div style="font-size:12px;color:var(--text);margin-bottom:10px;line-height:1.4">' + (iqQuestionIdx+1) + '. ' + q.q + '</div>';
  q.a.forEach(function(ans, ai){
    html += '<button onclick="window._v19AnswerIQ(' + ai + ')" style="display:block;width:100%;padding:8px 12px;margin:4px 0;background:var(--surface);border:1px solid var(--glass-border);border-radius:8px;color:var(--text-dim);font-size:11px;cursor:pointer;text-align:left">' + String.fromCharCode(65+ai) + '. ' + ans + '</button>';
  });
  html += '</div>';
  area.innerHTML = html;
  drawIQCanvas();
}

window._v19AnswerIQ = function(idx){
  var q = BOXING_IQ_QUESTIONS[iqQuestionIdx];
  if(idx === q.c){ iqScore++; playSFX19('iq_correct'); }
  else { playSFX19('iq_wrong'); }
  iqQuestionIdx++;
  showIQQuestion();
};

// ===== 8. FIGHT RECORD BOOK =====
var OPPONENT_NAMES = [
  'Iron Mike','Kid Dynamite','The Hitman','Sugar Ray','Golden Boy',
  'Pac-Man','Money','Canelo','GGG','Prince Naseem',
  'The Bronze Bomber','Gypsy King','Manos de Piedra','Maravilla','El Terrible'
];

function drawRecordCanvas(){
  var c = document.getElementById('v19-record-canvas'); if(!c) return;
  var ctx = c.getContext('2d'), w = c.width, h = c.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = 'rgba(15,10,30,0.9)'; ctx.fillRect(0,0,w,h);
  ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = '#FF4444';
  ctx.fillText('Fight Record Book', 15, 22);
  var total = v19.fightRecord.wins + v19.fightRecord.losses + v19.fightRecord.draws;
  if(total === 0){
    ctx.font = '11px sans-serif'; ctx.fillStyle = '#888'; ctx.textAlign = 'center';
    ctx.fillText('No fights yet. Simulate one!', w/2, h/2);
    ctx.textAlign = 'left'; return;
  }
  var cx = w*0.3, cy = h/2+10, r = Math.min(w*0.3, h/2) - 30;
  var slices = [
    {val:v19.fightRecord.wins, color:'#22c55e', label:'W'},
    {val:v19.fightRecord.losses, color:'#FF4444', label:'L'},
    {val:v19.fightRecord.draws, color:'#f97316', label:'D'}
  ];
  var startA = -Math.PI/2;
  slices.forEach(function(s){
    if(s.val === 0) return;
    var sweep = (s.val/total)*Math.PI*2;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,startA,startA+sweep);
    ctx.closePath();
    ctx.fillStyle = s.color; ctx.fill();
    var midA = startA + sweep/2;
    var lx = cx + (r*0.6)*Math.cos(midA);
    var ly = cy + (r*0.6)*Math.sin(midA);
    ctx.font = 'bold 11px sans-serif'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
    ctx.fillText(s.val + s.label, lx, ly+4);
    startA += sweep;
  });
  ctx.font = 'bold 14px sans-serif'; ctx.fillStyle = '#FFD700'; ctx.textAlign = 'center';
  ctx.fillText(v19.fightRecord.wins + '-' + v19.fightRecord.losses + '-' + v19.fightRecord.draws, cx, cy+r+18);
  ctx.font = '9px sans-serif'; ctx.fillStyle = '#888';
  ctx.fillText('KO: ' + v19.fightRecord.kos, cx, cy+r+30);
  var sx = w*0.55, sy = 45;
  ctx.textAlign = 'left';
  ctx.font = 'bold 11px sans-serif'; ctx.fillStyle = '#ddd';
  ctx.fillText('Recent Fights', sx, sy);
  var recent = v19.fightRecord.fights.slice(-6).reverse();
  recent.forEach(function(f, i){
    var fy = sy + 16 + i*18;
    ctx.font = '10px sans-serif';
    ctx.fillStyle = f.result === 'W' ? '#22c55e' : f.result === 'L' ? '#FF4444' : '#f97316';
    ctx.fillText(f.result, sx, fy);
    ctx.fillStyle = '#aaa';
    ctx.fillText('vs ' + f.opponent, sx+16, fy);
    if(f.ko){ ctx.fillStyle = '#FFD700'; ctx.fillText('KO', sx + 130, fy); }
  });
  var winPct = total > 0 ? Math.round(v19.fightRecord.wins/total*100) : 0;
  ctx.font = '10px sans-serif'; ctx.fillStyle = '#888';
  ctx.fillText('Win%: ' + winPct + '% | Total: ' + total, 15, h-8);
}

function simulateFightV19(){
  var opponent = OPPONENT_NAMES[Math.floor(Math.random()*OPPONENT_NAMES.length)];
  var rand = Math.random();
  var result, ko = false;
  if(rand < 0.5){ result = 'W'; v19.fightRecord.wins++; if(Math.random()<0.35){ ko = true; v19.fightRecord.kos++; } }
  else if(rand < 0.85){ result = 'L'; v19.fightRecord.losses++; }
  else { result = 'D'; v19.fightRecord.draws++; }
  v19.fightRecord.fights.push({opponent:opponent, result:result, ko:ko});
  if(v19.fightRecord.fights.length > 50) v19.fightRecord.fights = v19.fightRecord.fights.slice(-50);
  saveV19(v19); drawRecordCanvas();
  playSFX19(result === 'W' ? 'fight_win' : 'fight_loss');
  checkV19Achievements();
}

// ===== QUIZ V19 (15 Questions) =====
var QUIZ_V19 = [
  {q:'What is the purpose of a training camp taper phase?',a:['Build max strength','Peak then recover before fight','Skip training entirely','Double training volume'],c:1},
  {q:'Which footwork drill is best for creating angles?',a:['Shuffle step','L-Step','Forward march','Stand still'],c:1},
  {q:'Average punch force of a professional heavyweight?',a:['200-400N','400-600N','600-900N','900-1200N'],c:2},
  {q:'Ali&#39;s Rope-a-Dope strategy relied on?',a:['Knockout power','Letting opponent tire','Running away','Clinching'],c:1},
  {q:'A conditioning circuit typically includes how many exercises?',a:['2-3','4-6','8-12','20+'],c:2},
  {q:'What is &quot;making weight&quot; in boxing?',a:['Gaining muscle','Reaching weight class limit','Lifting weights','Weighing equipment'],c:1},
  {q:'Boxing IQ primarily refers to?',a:['Academic intelligence','Ring generalship and fight strategy','Punch count','Training hours'],c:1},
  {q:'The &quot;Ali Shuffle&quot; is a type of?',a:['Punch combination','Footwork technique','Defense move','Clinch technique'],c:1},
  {q:'What does the jab primarily set up?',a:['Nothing, it is just a scoring punch','Power punches and combinations','Clinches','Rest periods'],c:1},
  {q:'In a 12-round fight, which rounds are most important for scoring?',a:['Rounds 1-3','Rounds 4-6','Championship rounds 10-12','All rounds equal'],c:2},
  {q:'What is the &quot;sweet spot&quot; on a heavy bag?',a:['The top','Center at shoulder height','The bottom','The chains'],c:1},
  {q:'Why is the pivot important in boxing?',a:['Looks cool','Creates angles and avoids counters','Helps warm up','Makes noise'],c:1},
  {q:'What is a &quot;check hook&quot;?',a:['A hook thrown while pivoting away','A hook to the body','A hook with the rear hand','A hook while stepping forward'],c:0},
  {q:'The &quot;philly shell&quot; defense is also known as?',a:['Crab defense','Shoulder roll','Peek-a-boo','Cross-arm guard'],c:1},
  {q:'Which muscle group is most important for punch power?',a:['Biceps','Legs and core','Forearms','Shoulders only'],c:1}
];
var quizV19Idx = 0, quizV19Score = 0;

function startQuizV19(){
  quizV19Idx = 0; quizV19Score = 0;
  showQuizV19();
}

function showQuizV19(){
  var area = document.getElementById('v19-quiz-area'); if(!area) return;
  if(quizV19Idx >= QUIZ_V19.length){
    var pct = Math.round(quizV19Score / QUIZ_V19.length * 100);
    v19.quizV19Scores['attempt_'+v19.boxingIQ.attempts] = pct;
    saveV19(v19);
    area.innerHTML = '<div style="text-align:center;padding:16px"><div style="font-size:20px;font-weight:bold;color:#FFD700">' + quizV19Score + '/' + QUIZ_V19.length + '</div><div style="font-size:12px;color:var(--text-dim);margin-top:4px">' + pct + '% correct</div></div>';
    playSFX19(pct >= 60 ? 'iq_correct' : 'iq_wrong');
    checkV19Achievements();
    return;
  }
  var q = QUIZ_V19[quizV19Idx];
  var html = '<div style="padding:10px"><div style="font-size:12px;color:var(--text);margin-bottom:8px;line-height:1.4">' + (quizV19Idx+1) + '. ' + q.q + '</div>';
  q.a.forEach(function(ans,ai){
    html += '<button onclick="window._v19QuizAnswer(' + ai + ')" style="display:block;width:100%;padding:8px 12px;margin:4px 0;background:var(--surface);border:1px solid var(--glass-border);border-radius:8px;color:var(--text-dim);font-size:11px;cursor:pointer;text-align:left">' + String.fromCharCode(65+ai) + '. ' + ans + '</button>';
  });
  html += '</div>';
  area.innerHTML = html;
}

window._v19QuizAnswer = function(idx){
  if(idx === QUIZ_V19[quizV19Idx].c){ quizV19Score++; playSFX19('iq_correct'); }
  else { playSFX19('iq_wrong'); }
  quizV19Idx++;
  showQuizV19();
};

// ===== ACHIEVEMENTS V19 (12) =====
var ACHIEVEMENTS_V19 = [
  {id:'camp_start',icon:'⛺',name:'Camp Started',desc:'Start your first training camp'},
  {id:'camp_full',icon:'🏕️',name:'Full Camp',desc:'Complete all 8 weeks of camp'},
  {id:'footwork_5',icon:'👟',name:'Quick Feet',desc:'Complete 5 footwork drills'},
  {id:'footwork_all',icon:'💃',name:'Fancy Footwork',desc:'Try all 12 drill types'},
  {id:'force_500',icon:'💥',name:'Power Puncher',desc:'Record a 500N+ punch force'},
  {id:'force_1000',icon:'🔥',name:'Knockout Power',desc:'Record a 1000N+ punch force'},
  {id:'film_5',icon:'🎬',name:'Student of the Game',desc:'Study 5 famous fights'},
  {id:'film_all',icon:'🎓',name:'Boxing Scholar',desc:'Study all 10 famous fights'},
  {id:'circuit_3',icon:'🏋️',name:'Circuit Warrior',desc:'Complete 3 conditioning circuits'},
  {id:'iq_80',icon:'🧠',name:'Ring General',desc:'Score 80+ on Boxing IQ test'},
  {id:'record_10',icon:'🥊',name:'Seasoned Fighter',desc:'Complete 10 fights'},
  {id:'weight_10',icon:'⚖️',name:'Disciplined',desc:'Log weight 10 times'}
];

function checkV19Achievements(){
  var changed = false;
  function unlock(id){
    if(!v19.achievementsV19[id]){
      v19.achievementsV19[id] = true; changed = true;
      playSFX19('achievement_v19');
    }
  }
  if(v19.campPlanner.totalDays > 0) unlock('camp_start');
  if(v19.campPlanner.week === 1 && v19.campPlanner.totalDays >= 56) unlock('camp_full');
  if(v19.footwork.totalDrills >= 5) unlock('footwork_5');
  var allDrills = true; FOOTWORK_DRILLS.forEach(function(d){ if(!v19.footwork.drills[d.name]) allDrills = false; });
  if(allDrills) unlock('footwork_all');
  if(v19.punchForce.maxForce >= 500) unlock('force_500');
  if(v19.punchForce.maxForce >= 1000) unlock('force_1000');
  if(v19.filmStudy.totalStudied >= 5) unlock('film_5');
  if(v19.filmStudy.totalStudied >= 10) unlock('film_all');
  if(v19.circuit.completed >= 3) unlock('circuit_3');
  if(v19.boxingIQ.bestIQ >= 80) unlock('iq_80');
  var totalFights = v19.fightRecord.wins + v19.fightRecord.losses + v19.fightRecord.draws;
  if(totalFights >= 10) unlock('record_10');
  if(v19.weightMgmt.entries.length >= 10) unlock('weight_10');
  if(changed){ saveV19(v19); renderV19Ach(); }
}

function renderV19Ach(){
  var grid = document.getElementById('v19-ach-grid'); if(!grid) return;
  var html = '';
  ACHIEVEMENTS_V19.forEach(function(a){
    var unlocked = v19.achievementsV19[a.id];
    html += '<div class="v19-badge' + (unlocked ? ' unlocked' : '') + '" title="' + a.name + ': ' + a.desc + '">';
    html += '<span style="font-size:20px;' + (unlocked ? '' : 'filter:grayscale(1);opacity:0.3') + '">' + a.icon + '</span>';
    html += '</div>';
  });
  grid.innerHTML = html;
}

// ===== KEYBOARD SHORTCUTS =====
function initV19Keyboard(){
  document.addEventListener('keydown', function(e){
    if(!e.shiftKey) return;
    var el;
    switch(e.key.toUpperCase()){
      case 'C': el = document.getElementById('v19-camp'); break;
      case 'W': el = document.getElementById('v19-footwork'); break;
      case 'P': el = document.getElementById('v19-force'); break;
      case 'F': el = document.getElementById('v19-film'); break;
      case 'X': el = document.getElementById('v19-circuit'); break;
      case 'M': el = document.getElementById('v19-weight'); break;
      case 'I': el = document.getElementById('v19-iq'); break;
      case 'R': el = document.getElementById('v19-record'); break;
      default: return;
    }
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); playSFX19('nav_v19'); }
  });
}

// ===== BUILD V19 =====
function buildV19(){
  var container = document.querySelector('.container') || document.body;
  var footer = container.querySelector('.footer') || container.querySelector('footer');
  var html = '';

  html += '<div style="display:flex;gap:6px;padding:10px 16px;overflow-x:auto;-webkit-overflow-scrolling:touch">';
  [{id:'v19-camp',icon:'⛺',label:'Camp'},{id:'v19-footwork',icon:'👟',label:'Footwork'},{id:'v19-force',icon:'💥',label:'Force'},{id:'v19-film',icon:'🎬',label:'Film'},{id:'v19-circuit',icon:'🏋️',label:'Circuit'},{id:'v19-weight',icon:'⚖️',label:'Weight'},{id:'v19-iq',icon:'🧠',label:'IQ'},{id:'v19-record',icon:'🥊',label:'Record'}].forEach(function(n){
    html += '<button onclick="document.getElementById(\'' + n.id + '\').scrollIntoView({behavior:\'smooth\'})" style="flex-shrink:0;padding:6px 12px;background:var(--surface);border:1px solid var(--glass-border);border-radius:20px;color:var(--text-dim);font-size:11px;cursor:pointer;white-space:nowrap">' + n.icon + ' ' + n.label + '</button>';
  });
  html += '</div>';

  html += '<section class="section" id="v19-camp"><h2 class="section-title"><span class="emoji">⛺</span> Training Camp (8 Weeks)</h2><div class="card"><canvas id="v19-camp-canvas" width="480" height="220" style="width:100%;height:auto;border-radius:12px"></canvas><div style="display:flex;gap:6px;margin-top:10px;justify-content:center"><button class="v19-btn" id="v19-camp-advance">🏃 Advance Week</button><button class="v19-btn-sec" id="v19-camp-reset">🔄 Reset Camp</button></div></div></section>';

  html += '<section class="section" id="v19-footwork"><h2 class="section-title"><span class="emoji">👟</span> Footwork Drills (12)</h2><div class="card"><canvas id="v19-footwork-canvas" width="480" height="240" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v19-btn" id="v19-footwork-drill">👟 Random Drill</button></div></div></section>';

  html += '<section class="section" id="v19-force"><h2 class="section-title"><span class="emoji">💥</span> Punch Force Estimator</h2><div class="card"><canvas id="v19-force-canvas" width="360" height="220" style="width:100%;max-width:360px;height:auto;border-radius:12px;display:block;margin:0 auto"></canvas><div style="text-align:center;margin-top:10px"><button class="v19-btn" id="v19-force-measure">💥 Measure Force</button></div></div></section>';

  html += '<section class="section" id="v19-film"><h2 class="section-title"><span class="emoji">🎬</span> Film Study (10 Fights)</h2><div class="card"><canvas id="v19-film-canvas" width="400" height="300" style="width:100%;max-width:400px;height:auto;border-radius:12px;display:block;margin:0 auto"></canvas><div style="display:flex;gap:6px;margin-top:10px;justify-content:center"><button class="v19-btn" id="v19-film-study">📖 Study</button><button class="v19-btn-sec" id="v19-film-next">➡️ Next Fight</button></div></div></section>';

  html += '<section class="section" id="v19-circuit"><h2 class="section-title"><span class="emoji">🏋️</span> Conditioning Circuit (16)</h2><div class="card"><canvas id="v19-circuit-canvas" width="360" height="300" style="width:100%;max-width:360px;height:auto;border-radius:12px;display:block;margin:0 auto"></canvas><div style="text-align:center;margin-top:10px"><button class="v19-btn" id="v19-circuit-run">🏋️ Run Circuit</button></div></div></section>';

  html += '<section class="section" id="v19-weight"><h2 class="section-title"><span class="emoji">⚖️</span> Weight Management</h2><div class="card"><canvas id="v19-weight-canvas" width="480" height="240" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v19-btn" id="v19-weight-log">⚖️ Log Weight</button></div></div></section>';

  html += '<section class="section" id="v19-iq"><h2 class="section-title"><span class="emoji">🧠</span> Boxing IQ (20 Scenarios)</h2><div class="card"><canvas id="v19-iq-canvas" width="360" height="300" style="width:100%;max-width:360px;height:auto;border-radius:12px;display:block;margin:0 auto"></canvas><div id="v19-iq-area" style="min-height:40px"><div style="text-align:center;color:var(--text-dim);font-size:13px;padding:12px">Press Start to test your fight IQ</div></div><div style="text-align:center;margin-top:8px"><button class="v19-btn" id="v19-iq-start">🧠 Start IQ Test</button></div></div></section>';

  html += '<section class="section" id="v19-record"><h2 class="section-title"><span class="emoji">🥊</span> Fight Record Book</h2><div class="card"><canvas id="v19-record-canvas" width="480" height="260" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v19-btn" id="v19-record-fight">🥊 Simulate Fight</button></div></div></section>';

  html += '<section class="section" id="v19-quiz"><h2 class="section-title"><span class="emoji">❓</span> v19 Quiz (15Q)</h2><div class="card"><div id="v19-quiz-area" style="min-height:60px"><div style="text-align:center;color:var(--text-dim);font-size:13px;padding:16px">Press Start</div></div><div style="text-align:center;margin-top:10px"><button class="v19-btn" id="v19-quiz-start">❓ Start Quiz</button></div></div></section>';

  html += '<section class="section" id="v19-ach"><h2 class="section-title"><span class="emoji">🏅</span> v19 Achievements (12)</h2><div class="card"><div class="badge-grid" id="v19-ach-grid" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center"></div></div></section>';

  var wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  while(wrapper.firstChild){
    if(footer) container.insertBefore(wrapper.firstChild, footer);
    else container.appendChild(wrapper.firstChild);
  }

  var ca = document.getElementById('v19-camp-advance');
  if(ca) ca.addEventListener('click', advanceCampWeek);
  var cr = document.getElementById('v19-camp-reset');
  if(cr) cr.addEventListener('click', function(){ v19.campPlanner.week=1; saveV19(v19); drawCampCanvas(); });
  var fd = document.getElementById('v19-footwork-drill');
  if(fd) fd.addEventListener('click', doFootworkDrill);
  var fm = document.getElementById('v19-force-measure');
  if(fm) fm.addEventListener('click', measureForce);
  var fs = document.getElementById('v19-film-study');
  if(fs) fs.addEventListener('click', studyFilm);
  var fn = document.getElementById('v19-film-next');
  if(fn) fn.addEventListener('click', nextFilm);
  var rc = document.getElementById('v19-circuit-run');
  if(rc) rc.addEventListener('click', runCircuit);
  var wl = document.getElementById('v19-weight-log');
  if(wl) wl.addEventListener('click', logWeight);
  var iq = document.getElementById('v19-iq-start');
  if(iq) iq.addEventListener('click', startIQTest);
  var rf = document.getElementById('v19-record-fight');
  if(rf) rf.addEventListener('click', simulateFightV19);
  var qs = document.getElementById('v19-quiz-start');
  if(qs) qs.addEventListener('click', startQuizV19);

  drawCampCanvas(); drawFootworkCanvas(); drawForceCanvas(); drawFilmCanvas();
  drawCircuitCanvas(); drawWeightCanvas(); drawIQCanvas(); drawRecordCanvas();
  renderV19Ach(); initV19Keyboard(); checkV19Achievements();

  if(v19.weightMgmt.entries.length === 0){
    v19.weightMgmt.entries.push({w:v19.weightMgmt.current, d:new Date().toISOString().slice(0,10)});
    saveV19(v19); drawWeightCanvas();
  }
}

if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', buildV19); }
else { buildV19(); }

})();
