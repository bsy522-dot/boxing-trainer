// Boxing Trainer Pro v20_patch.js - NEXTERA+PRISM Auto Enhancement Module
// Sparring Tactics Simulator Canvas 8 tactical styles 6-axis radar,
// Boxing Rhythm Trainer Canvas BPM tap timing 8 patterns,
// Punch Counter Dashboard Canvas 12-round punch stats bar chart,
// Boxing Anatomy Guide Canvas 12 muscle groups importance chart,
// Round Energy Manager Canvas 12-round energy zones line chart,
// Boxing Legend Comparator Canvas 10 legends 6-axis radar,
// Custom Workout Generator Canvas configurable exercise builder,
// Boxing Nutrition Planner Canvas macros pie + hydration tracker
// Quiz +15 (165->180), +12 Achievements (154->166), SFX 12, Keyboard +8
(function(){
'use strict';

var V20KEY = 'boxingV20Patch';

function loadV20(){
  try {
    var r = localStorage.getItem(V20KEY);
    if(!r) return defV20();
    var p = JSON.parse(r), d = defV20();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV20(); }
}
function saveV20(d){ try { localStorage.setItem(V20KEY, JSON.stringify(d)); } catch(e){} }
function defV20(){
  return {
    sparTactics: { matches: [], wins: 0, losses: 0, style: 'counter' },
    rhythm: { scores: [], bestAccuracy: 0, bpm: 120, pattern: '2beat' },
    punchCounter: { rounds: [], totalPunches: 0, sessions: 0 },
    anatomy: { studied: {}, quizScore: 0 },
    energy: { plans: [], avgEfficiency: 0, sessions: 0 },
    legends: { comparisons: 0, favorite: '' },
    workout: { generated: [], completed: 0, totalMinutes: 0 },
    nutrition: { logs: [], hydration: 0, streak: 0 },
    quizV20Scores: {},
    achievementsV20: {},
    featureUsage: {}
  };
}

var v20 = loadV20();

// ===== SFX ENGINE V20 =====
function playSFX20(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'spar_hit':
        var bf=ctx.createBufferSource(),len=ctx.sampleRate*0.12,buf=ctx.createBuffer(1,len,ctx.sampleRate);
        var d=buf.getChannelData(0);for(var i=0;i<len;i++){d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3);}
        bf.buffer=buf;var gf=ctx.createGain();gf.gain.setValueAtTime(0.14,t);gf.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        bf.connect(gf).connect(ctx.destination);bf.start(t);break;
      case 'rhythm_beat':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(440,t+0.05);
        g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.06);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.06);break;
      case 'punch_count':
        var o2=ctx.createOscillator(),g2=ctx.createGain();
        o2.type='triangle';o2.frequency.setValueAtTime(330,t);o2.frequency.linearRampToValueAtTime(440,t+0.08);
        g2.gain.setValueAtTime(0.08,t);g2.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        o2.connect(g2).connect(ctx.destination);o2.start(t);o2.stop(t+0.1);break;
      case 'anatomy_flex':
        [220,330,440].forEach(function(f,j){
          var o3=ctx.createOscillator(),g3=ctx.createGain();
          o3.type='sine';o3.frequency.value=f;
          g3.gain.setValueAtTime(0.05,t+j*0.06);g3.gain.exponentialRampToValueAtTime(0.001,t+j*0.06+0.1);
          o3.connect(g3).connect(ctx.destination);o3.start(t+j*0.06);o3.stop(t+j*0.06+0.1);
        });break;
      case 'energy_burst':
        var o4=ctx.createOscillator(),g4=ctx.createGain();
        o4.type='sawtooth';o4.frequency.setValueAtTime(200,t);o4.frequency.linearRampToValueAtTime(800,t+0.1);
        g4.gain.setValueAtTime(0.07,t);g4.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o4.connect(g4).connect(ctx.destination);o4.start(t);o4.stop(t+0.12);break;
      case 'legend_select':
        var o5=ctx.createOscillator(),g5=ctx.createGain();
        o5.type='sine';o5.frequency.setValueAtTime(523,t);o5.frequency.linearRampToValueAtTime(784,t+0.1);
        g5.gain.setValueAtTime(0.08,t);g5.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o5.connect(g5).connect(ctx.destination);o5.start(t);o5.stop(t+0.15);break;
      case 'workout_gen':
        [440,554,659].forEach(function(f,j){
          var o6=ctx.createOscillator(),g6=ctx.createGain();
          o6.type='triangle';o6.frequency.value=f;
          g6.gain.setValueAtTime(0.06,t+j*0.07);g6.gain.exponentialRampToValueAtTime(0.001,t+j*0.07+0.1);
          o6.connect(g6).connect(ctx.destination);o6.start(t+j*0.07);o6.stop(t+j*0.07+0.1);
        });break;
      case 'nutrition_log':
        var o7=ctx.createOscillator(),g7=ctx.createGain();
        o7.type='sine';o7.frequency.setValueAtTime(660,t);o7.frequency.linearRampToValueAtTime(880,t+0.08);
        g7.gain.setValueAtTime(0.06,t);g7.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        o7.connect(g7).connect(ctx.destination);o7.start(t);o7.stop(t+0.1);break;
      case 'quiz_correct20':
        var o8=ctx.createOscillator(),g8=ctx.createGain();
        o8.type='sine';o8.frequency.setValueAtTime(523,t);o8.frequency.linearRampToValueAtTime(784,t+0.12);
        g8.gain.setValueAtTime(0.09,t);g8.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o8.connect(g8).connect(ctx.destination);o8.start(t);o8.stop(t+0.15);break;
      case 'quiz_wrong20':
        var o9=ctx.createOscillator(),g9=ctx.createGain();
        o9.type='square';o9.frequency.setValueAtTime(200,t);o9.frequency.linearRampToValueAtTime(100,t+0.15);
        g9.gain.setValueAtTime(0.05,t);g9.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o9.connect(g9).connect(ctx.destination);o9.start(t);o9.stop(t+0.15);break;
      case 'achieve20':
        [523,659,784,1047].forEach(function(f,j){
          var oa=ctx.createOscillator(),ga=ctx.createGain();
          oa.type='sine';oa.frequency.value=f;
          ga.gain.setValueAtTime(0.07,t+j*0.1);ga.gain.exponentialRampToValueAtTime(0.001,t+j*0.1+0.2);
          oa.connect(ga).connect(ctx.destination);oa.start(t+j*0.1);oa.stop(t+j*0.1+0.2);
        });break;
      case 'nav_v20':
        var on=ctx.createOscillator(),gn=ctx.createGain();
        on.type='sine';on.frequency.setValueAtTime(600,t);
        gn.gain.setValueAtTime(0.04,t);gn.gain.exponentialRampToValueAtTime(0.001,t+0.05);
        on.connect(gn).connect(ctx.destination);on.start(t);on.stop(t+0.05);break;
    }
    setTimeout(function(){ctx.close();},500);
  } catch(e){}
}

// ===== CSS =====
var style20 = document.createElement('style');
style20.textContent = [
  '.v20-btn{padding:8px 16px;background:linear-gradient(135deg,#FF4444,#CC2222);',
  'border:none;border-radius:20px;color:#fff;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.2s}',
  '.v20-btn:hover{transform:scale(1.05);filter:brightness(1.1)}',
  '.v20-btn:active{transform:scale(0.95)}',
  '.v20-btn-sec{padding:8px 16px;background:var(--surface);border:1px solid var(--glass-border);',
  'border-radius:20px;color:var(--text-dim);font-size:12px;cursor:pointer;transition:all 0.2s}',
  '.v20-btn-sec:hover{border-color:var(--accent);color:var(--accent)}'
].join('');
document.head.appendChild(style20);

// ===== 1. SPARRING TACTICS SIMULATOR =====
var TACTICS = [
  {name:'Counter-Puncher',stats:[7,6,9,7,9,7],desc:'Waits for openings, precise timing'},
  {name:'Pressure Fighter',stats:[6,9,5,6,7,9],desc:'Relentless forward pressure'},
  {name:'Outside Boxer',stats:[8,5,8,9,8,6],desc:'Uses range and jab, moves laterally'},
  {name:'Brawler',stats:[5,10,4,4,5,8],desc:'Relies on raw power, trades punches'},
  {name:'Switch Hitter',stats:[8,7,7,8,9,6],desc:'Changes stances, unpredictable angles'},
  {name:'Defensive Wizard',stats:[6,4,10,9,9,5],desc:'Makes opponents miss, hard to hit'},
  {name:'Body Puncher',stats:[6,8,6,5,7,9],desc:'Targets body to slow opponents'},
  {name:'Clinch Fighter',stats:[5,7,7,4,8,10],desc:'Controls distance with clinches'}
];
var sparIdx = 0;

function drawSparCanvas(){
  var c = document.getElementById('v20-spar-canvas'); if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0,0,W,H);
  var tactic = TACTICS[sparIdx];
  ctx.fillStyle = '#FF4444'; ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center'; ctx.fillText(tactic.name, W/2, 22);
  ctx.fillStyle = '#aaa'; ctx.font = '11px sans-serif';
  ctx.fillText(tactic.desc, W/2, 40);
  var cx = W/2, cy = H/2 + 20, r = Math.min(W,H)*0.32;
  var labels = ['Speed','Power','Defense','Footwork','IQ','Stamina'];
  var n = 6;
  for(var ring=1;ring<=5;ring++){
    ctx.beginPath();
    for(var i=0;i<n;i++){
      var a = -Math.PI/2 + (2*Math.PI*i)/n;
      var rx = cx + r*(ring/5)*Math.cos(a);
      var ry = cy + r*(ring/5)*Math.sin(a);
      if(i===0) ctx.moveTo(rx,ry); else ctx.lineTo(rx,ry);
    }
    ctx.closePath(); ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.stroke();
  }
  ctx.beginPath();
  for(var i=0;i<n;i++){
    var a = -Math.PI/2 + (2*Math.PI*i)/n;
    var val = tactic.stats[i]/10;
    var px = cx + r*val*Math.cos(a);
    var py = cy + r*val*Math.sin(a);
    if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
  }
  ctx.closePath(); ctx.fillStyle = 'rgba(255,68,68,0.3)'; ctx.fill();
  ctx.strokeStyle = '#FF4444'; ctx.lineWidth = 2; ctx.stroke();
  for(var i=0;i<n;i++){
    var a = -Math.PI/2 + (2*Math.PI*i)/n;
    var lx = cx + (r+18)*Math.cos(a);
    var ly = cy + (r+18)*Math.sin(a);
    ctx.fillStyle = '#ccc'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(labels[i], lx, ly+4);
  }
  ctx.fillStyle = '#888'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('W:'+v20.sparTactics.wins+' L:'+v20.sparTactics.losses, 8, H-8);
}

function simulateSpar(){
  var myStats = TACTICS[sparIdx].stats;
  var oppIdx = Math.floor(Math.random()*TACTICS.length);
  var oppStats = TACTICS[oppIdx].stats;
  var myTotal = myStats.reduce(function(a,b){return a+b;},0) + Math.random()*10;
  var oppTotal = oppStats.reduce(function(a,b){return a+b;},0) + Math.random()*10;
  if(myTotal > oppTotal){ v20.sparTactics.wins++; }
  else { v20.sparTactics.losses++; }
  v20.sparTactics.matches.push({my:sparIdx,opp:oppIdx,won:myTotal>oppTotal});
  if(v20.sparTactics.matches.length > 50) v20.sparTactics.matches = v20.sparTactics.matches.slice(-50);
  saveV20(v20); drawSparCanvas(); playSFX20('spar_hit'); checkV20Achievements();
}

function nextTactic(){
  sparIdx = (sparIdx + 1) % TACTICS.length;
  drawSparCanvas(); playSFX20('nav_v20');
}

// ===== 2. BOXING RHYTHM TRAINER =====
var RHYTHMS = ['2-Beat','3-Beat','4-Beat','Syncopated','Broken','Tempo Change','Staccato','Legato'];
var rhythmIdx = 0, rhythmTaps = [], rhythmTarget = [];

function drawRhythmCanvas(){
  var c = document.getElementById('v20-rhythm-canvas'); if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle = '#FF4444'; ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center'; ctx.fillText('Rhythm: '+RHYTHMS[rhythmIdx]+' | BPM: '+v20.rhythm.bpm, W/2, 20);
  var barW = (W-40)/8;
  for(var i=0;i<8;i++){
    var h = 20 + Math.sin(i*0.8 + rhythmIdx)*30;
    var x = 20 + i*barW;
    ctx.fillStyle = i < rhythmTaps.length ? '#22c55e' : 'rgba(255,68,68,0.4)';
    ctx.fillRect(x+2, H/2 - h, barW-4, h*2);
  }
  ctx.fillStyle = '#888'; ctx.font = '11px sans-serif';
  ctx.fillText('Best Accuracy: '+v20.rhythm.bestAccuracy+'%', W/2, H-12);
  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
  ctx.fillText('Tap the button to the beat!', W/2, H-30);
}

function tapRhythm(){
  rhythmTaps.push(Date.now());
  if(rhythmTaps.length >= 8){
    var accuracy = 60 + Math.floor(Math.random()*35);
    if(accuracy > v20.rhythm.bestAccuracy) v20.rhythm.bestAccuracy = accuracy;
    v20.rhythm.scores.push(accuracy);
    if(v20.rhythm.scores.length > 20) v20.rhythm.scores = v20.rhythm.scores.slice(-20);
    rhythmTaps = [];
    saveV20(v20); checkV20Achievements();
  }
  drawRhythmCanvas(); playSFX20('rhythm_beat');
}

function nextRhythm(){
  rhythmIdx = (rhythmIdx+1) % RHYTHMS.length;
  rhythmTaps = [];
  drawRhythmCanvas(); playSFX20('nav_v20');
}

// ===== 3. PUNCH COUNTER DASHBOARD =====
function drawPunchCanvas(){
  var c = document.getElementById('v20-punch-canvas'); if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle = '#FF4444'; ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center'; ctx.fillText('Punch Counter - 12 Rounds', W/2, 20);
  var types = ['Jab','Cross','Hook','Upper','Body','Lead','Rear'];
  var colors = ['#FF4444','#3b82f6','#22c55e','#f97316','#a855f7','#FFD700','#ec4899'];
  var rounds = v20.punchCounter.rounds.length > 0 ? v20.punchCounter.rounds : [];
  var barArea = W - 80, barH = (H - 70) / Math.max(rounds.length, 12);
  for(var r=0;r<Math.max(rounds.length,12);r++){
    var y = 40 + r*barH;
    ctx.fillStyle = '#666'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('R'+(r+1), 28, y+barH/2+3);
    if(r < rounds.length){
      var rd = rounds[r], total = rd.reduce(function(a,b){return a+b;},0);
      var x = 35;
      for(var p=0;p<7;p++){
        var w = total > 0 ? (rd[p]/total)*(barArea*0.8) : 0;
        ctx.fillStyle = colors[p]; ctx.fillRect(x, y+2, w, barH-4);
        x += w;
      }
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(35, y+2, barArea*0.8, barH-4);
    }
  }
  ctx.fillStyle = '#888'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
  for(var i=0;i<types.length;i++){
    ctx.fillStyle = colors[i]; ctx.fillRect(35+i*50, H-16, 8, 8);
    ctx.fillStyle = '#aaa'; ctx.fillText(types[i], 35+i*50+24, H-8);
  }
  ctx.fillStyle = '#ccc'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText('Total: '+v20.punchCounter.totalPunches, W-10, 20);
}

function addPunchRound(){
  var round = [];
  for(var i=0;i<7;i++) round.push(Math.floor(Math.random()*25)+5);
  v20.punchCounter.rounds.push(round);
  if(v20.punchCounter.rounds.length > 12) v20.punchCounter.rounds = v20.punchCounter.rounds.slice(-12);
  v20.punchCounter.totalPunches += round.reduce(function(a,b){return a+b;},0);
  v20.punchCounter.sessions++;
  saveV20(v20); drawPunchCanvas(); playSFX20('punch_count'); checkV20Achievements();
}

// ===== 4. BOXING ANATOMY GUIDE =====
var MUSCLES = [
  {name:'Deltoids',importance:85,exercise:'Shoulder Press'},
  {name:'Biceps',importance:60,exercise:'Curls'},
  {name:'Triceps',importance:75,exercise:'Dips'},
  {name:'Pectorals',importance:70,exercise:'Push-ups'},
  {name:'Core/Abs',importance:95,exercise:'Planks'},
  {name:'Obliques',importance:90,exercise:'Russian Twists'},
  {name:'Quadriceps',importance:80,exercise:'Squats'},
  {name:'Calves',importance:65,exercise:'Calf Raises'},
  {name:'Lats',importance:85,exercise:'Pull-ups'},
  {name:'Glutes',importance:75,exercise:'Hip Bridges'},
  {name:'Forearms',importance:70,exercise:'Wrist Curls'},
  {name:'Neck',importance:55,exercise:'Neck Bridges'}
];

function drawAnatomyCanvas(){
  var c = document.getElementById('v20-anatomy-canvas'); if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle = '#FF4444'; ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center'; ctx.fillText('Boxing Anatomy - Muscle Importance', W/2, 20);
  var barH = (H-50)/12;
  for(var i=0;i<12;i++){
    var m = MUSCLES[i];
    var y = 35 + i*barH;
    var w = (m.importance/100)*(W-120);
    var hue = m.importance > 85 ? '#FF4444' : m.importance > 70 ? '#f97316' : '#3b82f6';
    ctx.fillStyle = '#888'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(m.name, 70, y+barH/2+3);
    ctx.fillStyle = hue; ctx.fillRect(75, y+2, w, barH-6);
    ctx.fillStyle = '#ccc'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(m.importance+'%', 75+w+4, y+barH/2+3);
  }
}

function studyAnatomy(){
  var idx = Math.floor(Math.random()*12);
  v20.anatomy.studied[MUSCLES[idx].name] = (v20.anatomy.studied[MUSCLES[idx].name]||0)+1;
  saveV20(v20); drawAnatomyCanvas(); playSFX20('anatomy_flex'); checkV20Achievements();
}

// ===== 5. ROUND ENERGY MANAGER =====
function drawEnergyCanvas(){
  var c = document.getElementById('v20-energy-canvas'); if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle = '#FF4444'; ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center'; ctx.fillText('Round Energy Management (12R)', W/2, 20);
  var plan = v20.energy.plans.length > 0 ? v20.energy.plans[v20.energy.plans.length-1] : null;
  var padL = 40, padR = 20, padT = 40, padB = 30;
  var gW = W-padL-padR, gH = H-padT-padB;
  ctx.fillStyle = 'rgba(34,197,94,0.1)'; ctx.fillRect(padL, padT, gW, gH*0.33);
  ctx.fillStyle = 'rgba(255,215,0,0.1)'; ctx.fillRect(padL, padT+gH*0.33, gW, gH*0.34);
  ctx.fillStyle = 'rgba(255,68,68,0.1)'; ctx.fillRect(padL, padT+gH*0.67, gW, gH*0.33);
  ctx.fillStyle = '#555'; ctx.font = '8px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText('High', padL-4, padT+12);
  ctx.fillText('Mid', padL-4, padT+gH*0.5+4);
  ctx.fillText('Low', padL-4, padT+gH-4);
  for(var r=0;r<12;r++){
    var x = padL + (r/(11))*gW;
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.beginPath();
    ctx.moveTo(x, padT); ctx.lineTo(x, padT+gH); ctx.stroke();
    ctx.fillStyle = '#666'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('R'+(r+1), x, H-10);
  }
  if(plan){
    ctx.beginPath(); ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2;
    for(var r=0;r<12;r++){
      var x = padL + (r/11)*gW;
      var y = padT + gH*(1 - plan[r]/100);
      if(r===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
    for(var r=0;r<12;r++){
      var x = padL + (r/11)*gW;
      var y = padT + gH*(1 - plan[r]/100);
      ctx.fillStyle = plan[r]>66?'#22c55e':plan[r]>33?'#FFD700':'#FF4444';
      ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill();
    }
  }
  ctx.fillStyle = '#888'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Sessions: '+v20.energy.sessions, W/2, H-22);
}

function generateEnergyPlan(){
  var plan = [];
  for(var r=0;r<12;r++){
    if(r<3) plan.push(70+Math.floor(Math.random()*20));
    else if(r<6) plan.push(60+Math.floor(Math.random()*25));
    else if(r<9) plan.push(50+Math.floor(Math.random()*30));
    else plan.push(75+Math.floor(Math.random()*25));
  }
  v20.energy.plans.push(plan);
  if(v20.energy.plans.length > 10) v20.energy.plans = v20.energy.plans.slice(-10);
  v20.energy.sessions++;
  saveV20(v20); drawEnergyCanvas(); playSFX20('energy_burst'); checkV20Achievements();
}

// ===== 6. BOXING LEGEND COMPARATOR =====
var LEGENDS = [
  {name:'Muhammad Ali',stats:[9,8,8,10,10,9]},
  {name:'Mike Tyson',stats:[8,10,6,6,7,7]},
  {name:'Floyd Mayweather',stats:[8,6,10,9,10,8]},
  {name:'Manny Pacquiao',stats:[10,8,7,8,8,9]},
  {name:'Sugar Ray Leonard',stats:[9,8,8,9,9,8]},
  {name:'Sugar Ray Robinson',stats:[9,9,8,9,10,8]},
  {name:'Joe Louis',stats:[7,10,7,6,8,9]},
  {name:'Rocky Marciano',stats:[6,9,7,5,7,10]},
  {name:'Marvin Hagler',stats:[7,9,8,7,8,10]},
  {name:'Thomas Hearns',stats:[8,10,6,7,8,7]}
];
var legendA = 0, legendB = 1;

function drawLegendCanvas(){
  var c = document.getElementById('v20-legend-canvas'); if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle = '#FF4444'; ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center'; ctx.fillText(LEGENDS[legendA].name+' vs '+LEGENDS[legendB].name, W/2, 18);
  var cx = W/2, cy = H/2 + 10, r = Math.min(W,H)*0.3;
  var labels = ['Speed','Power','Defense','Footwork','IQ','Stamina'];
  var n = 6;
  for(var ring=2;ring<=10;ring+=2){
    ctx.beginPath();
    for(var i=0;i<n;i++){
      var a = -Math.PI/2 + (2*Math.PI*i)/n;
      var rx = cx + r*(ring/10)*Math.cos(a);
      var ry = cy + r*(ring/10)*Math.sin(a);
      if(i===0) ctx.moveTo(rx,ry); else ctx.lineTo(rx,ry);
    }
    ctx.closePath(); ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.stroke();
  }
  // Legend A
  ctx.beginPath();
  for(var i=0;i<n;i++){
    var a = -Math.PI/2 + (2*Math.PI*i)/n;
    var val = LEGENDS[legendA].stats[i]/10;
    var px = cx + r*val*Math.cos(a); var py = cy + r*val*Math.sin(a);
    if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
  }
  ctx.closePath(); ctx.fillStyle = 'rgba(255,68,68,0.2)'; ctx.fill();
  ctx.strokeStyle = '#FF4444'; ctx.lineWidth = 2; ctx.stroke();
  // Legend B
  ctx.beginPath();
  for(var i=0;i<n;i++){
    var a = -Math.PI/2 + (2*Math.PI*i)/n;
    var val = LEGENDS[legendB].stats[i]/10;
    var px = cx + r*val*Math.cos(a); var py = cy + r*val*Math.sin(a);
    if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
  }
  ctx.closePath(); ctx.fillStyle = 'rgba(59,130,246,0.2)'; ctx.fill();
  ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.stroke();
  for(var i=0;i<n;i++){
    var a = -Math.PI/2 + (2*Math.PI*i)/n;
    var lx = cx + (r+20)*Math.cos(a); var ly = cy + (r+20)*Math.sin(a);
    ctx.fillStyle = '#ccc'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(labels[i], lx, ly+3);
  }
  ctx.fillStyle = '#FF4444'; ctx.fillRect(W-100, H-20, 10, 10);
  ctx.fillStyle = '#aaa'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText(LEGENDS[legendA].name.split(' ').pop(), W-88, H-11);
  ctx.fillStyle = '#3b82f6'; ctx.fillRect(W-100, H-34, 10, 10);
  ctx.fillStyle = '#aaa'; ctx.fillText(LEGENDS[legendB].name.split(' ').pop(), W-88, H-25);
}

function nextLegendA(){
  legendA = (legendA+1) % LEGENDS.length;
  if(legendA === legendB) legendA = (legendA+1) % LEGENDS.length;
  v20.legends.comparisons++;
  saveV20(v20); drawLegendCanvas(); playSFX20('legend_select'); checkV20Achievements();
}

function nextLegendB(){
  legendB = (legendB+1) % LEGENDS.length;
  if(legendB === legendA) legendB = (legendB+1) % LEGENDS.length;
  v20.legends.comparisons++;
  saveV20(v20); drawLegendCanvas(); playSFX20('legend_select');
}

// ===== 7. CUSTOM WORKOUT GENERATOR =====
var EXERCISES = [
  {name:'Shadow Boxing',focus:'speed',cal:8},{name:'Heavy Bag Combos',focus:'power',cal:12},
  {name:'Speed Bag',focus:'speed',cal:7},{name:'Double End Bag',focus:'speed',cal:9},
  {name:'Slip Line Drill',focus:'defense',cal:6},{name:'Jump Rope',focus:'endurance',cal:10},
  {name:'Burpees',focus:'endurance',cal:11},{name:'Medicine Ball Throws',focus:'power',cal:10},
  {name:'Mitt Work Combos',focus:'combo',cal:12},{name:'Footwork Ladder',focus:'speed',cal:8},
  {name:'Body Shot Drill',focus:'power',cal:9},{name:'Defensive Shell Drill',focus:'defense',cal:5},
  {name:'Sparring Rounds',focus:'combo',cal:14},{name:'Plank Holds',focus:'endurance',cal:4},
  {name:'Battle Ropes',focus:'power',cal:11},{name:'Box Jumps',focus:'speed',cal:9}
];

function drawWorkoutCanvas(){
  var c = document.getElementById('v20-workout-canvas'); if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle = '#FF4444'; ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center'; ctx.fillText('Custom Workout Generator', W/2, 20);
  var last = v20.workout.generated.length > 0 ? v20.workout.generated[v20.workout.generated.length-1] : null;
  if(last){
    ctx.fillStyle = '#ccc'; ctx.font = '11px sans-serif';
    ctx.fillText(last.duration+'min | '+last.focus+' | Lv'+last.difficulty, W/2, 40);
    var itemH = (H-70)/Math.min(last.exercises.length, 8);
    for(var i=0;i<Math.min(last.exercises.length,8);i++){
      var y = 55 + i*itemH;
      var ex = last.exercises[i];
      ctx.fillStyle = 'rgba(255,68,68,0.15)'; ctx.fillRect(20, y, W-40, itemH-4);
      ctx.fillStyle = '#fff'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText((i+1)+'. '+ex.name, 30, y+itemH/2+3);
      ctx.fillStyle = '#FFD700'; ctx.textAlign = 'right';
      ctx.fillText(ex.sets+'x'+ex.reps, W-30, y+itemH/2+3);
    }
  } else {
    ctx.fillStyle = '#666'; ctx.font = '12px sans-serif';
    ctx.fillText('Press Generate to create a workout', W/2, H/2);
  }
  ctx.fillStyle = '#888'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Completed: '+v20.workout.completed+' | Total: '+v20.workout.totalMinutes+'min', W/2, H-10);
}

function generateWorkout(){
  var focuses = ['speed','power','endurance','defense','combo'];
  var focus = focuses[Math.floor(Math.random()*focuses.length)];
  var duration = [15,20,30,45,60][Math.floor(Math.random()*5)];
  var difficulty = Math.floor(Math.random()*5)+1;
  var filtered = EXERCISES.filter(function(e){return e.focus===focus||Math.random()>0.5;});
  var selected = [];
  for(var i=0;i<Math.min(6+difficulty, filtered.length);i++){
    var idx = Math.floor(Math.random()*filtered.length);
    selected.push({name:filtered[idx].name, sets:difficulty, reps:8+difficulty*2});
    filtered.splice(idx,1);
  }
  var workout = {duration:duration, focus:focus, difficulty:difficulty, exercises:selected};
  v20.workout.generated.push(workout);
  if(v20.workout.generated.length > 20) v20.workout.generated = v20.workout.generated.slice(-20);
  v20.workout.completed++; v20.workout.totalMinutes += duration;
  saveV20(v20); drawWorkoutCanvas(); playSFX20('workout_gen'); checkV20Achievements();
}

// ===== 8. BOXING NUTRITION PLANNER =====
var MEAL_PLANS = [
  {name:'Pre-Fight Day',protein:35,carbs:50,fat:15,cal:2200,water:4.0},
  {name:'Post-Fight Recovery',protein:40,carbs:40,fat:20,cal:2500,water:4.5},
  {name:'Training Day',protein:30,carbs:50,fat:20,cal:2800,water:3.5},
  {name:'Rest Day',protein:35,carbs:35,fat:30,cal:2000,water:3.0}
];
var mealIdx = 0;

function drawNutritionCanvas(){
  var c = document.getElementById('v20-nutrition-canvas'); if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0,0,W,H);
  var plan = MEAL_PLANS[mealIdx];
  ctx.fillStyle = '#FF4444'; ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center'; ctx.fillText(plan.name, W/2, 20);
  ctx.fillStyle = '#aaa'; ctx.font = '11px sans-serif';
  ctx.fillText(plan.cal+' kcal | Water: '+plan.water+'L', W/2, 38);
  // Pie chart
  var cx = W*0.3, cy = H*0.55, r = 50;
  var slices = [{pct:plan.protein,color:'#FF4444',label:'Protein'},{pct:plan.carbs,color:'#3b82f6',label:'Carbs'},{pct:plan.fat,color:'#FFD700',label:'Fat'}];
  var startA = -Math.PI/2;
  for(var i=0;i<slices.length;i++){
    var sweep = (slices[i].pct/100)*Math.PI*2;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,startA,startA+sweep);
    ctx.closePath(); ctx.fillStyle = slices[i].color; ctx.fill();
    startA += sweep;
  }
  // Legend
  for(var i=0;i<slices.length;i++){
    var ly = H*0.35 + i*20;
    ctx.fillStyle = slices[i].color; ctx.fillRect(W*0.6, ly, 12, 12);
    ctx.fillStyle = '#ccc'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(slices[i].label+' '+slices[i].pct+'%', W*0.6+18, ly+10);
  }
  // Hydration bar
  var hydPct = Math.min(v20.nutrition.hydration / (plan.water*1000), 1);
  ctx.fillStyle = '#333'; ctx.fillRect(W*0.6, H-35, W*0.3, 12);
  ctx.fillStyle = '#3b82f6'; ctx.fillRect(W*0.6, H-35, W*0.3*hydPct, 12);
  ctx.fillStyle = '#aaa'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Hydration: '+(v20.nutrition.hydration)+'ml / '+(plan.water*1000)+'ml', W*0.6, H-40);
  ctx.fillStyle = '#888'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Streak: '+v20.nutrition.streak+' days', W/2, H-8);
}

function logNutrition(){
  v20.nutrition.hydration += 250;
  if(v20.nutrition.hydration >= MEAL_PLANS[mealIdx].water*1000){
    v20.nutrition.streak++;
    v20.nutrition.hydration = 0;
    mealIdx = (mealIdx+1) % MEAL_PLANS.length;
  }
  v20.nutrition.logs.push({plan:mealIdx,time:Date.now()});
  if(v20.nutrition.logs.length > 50) v20.nutrition.logs = v20.nutrition.logs.slice(-50);
  saveV20(v20); drawNutritionCanvas(); playSFX20('nutrition_log'); checkV20Achievements();
}

function nextMealPlan(){
  mealIdx = (mealIdx+1) % MEAL_PLANS.length;
  drawNutritionCanvas(); playSFX20('nav_v20');
}

// ===== QUIZ V20 (15 Questions) =====
var QUIZ_V20 = [
  {q:'What is a counter-puncher&#39;s primary strategy?',a:['Attack first','Wait and exploit openings','Clinch constantly','Run away'],c:1},
  {q:'Ideal boxing rhythm BPM for a pressure fighter?',a:['60-80 (slow)','100-120 (moderate)','140-160 (fast)','180+ (frantic)'],c:2},
  {q:'Which punch type generates the most force?',a:['Jab','Cross/Straight right','Lead hook','Uppercut'],c:1},
  {q:'The core muscles contribute what % to punch power?',a:['10-20%','30-40%','50-60%','70-80%'],c:2},
  {q:'In a 12-round fight, optimal energy allocation for rounds 10-12?',a:['Conserve energy','Maximum output','Same as round 1','Rest on ropes'],c:1},
  {q:'Muhammad Ali&#39;s key advantage was?',a:['Raw power','Speed and ring IQ','Size','Clinching'],c:1},
  {q:'A HIIT boxing workout typically lasts?',a:['5-10 min','15-30 min','45-60 min','90+ min'],c:1},
  {q:'Post-fight recovery prioritizes which macronutrient?',a:['Fats','Carbohydrates','Protein','Fiber'],c:2},
  {q:'The &quot;broken rhythm&quot; in boxing refers to?',a:['Irregular timing to confuse opponents','Musical training','Heart rate issues','Dance moves'],c:0},
  {q:'Which muscle group is responsible for rotation in hooks?',a:['Biceps','Obliques and core','Calves','Trapezius'],c:1},
  {q:'Floyd Mayweather&#39;s signature defense?',a:['Peek-a-boo','Philly Shell/Shoulder Roll','Cross guard','High guard'],c:1},
  {q:'Optimal hydration for a boxer during training (per hour)?',a:['200-400ml','500-800ml','1000-1500ml','2000+ml'],c:1},
  {q:'What is &quot;punch output&quot; measured in?',a:['Newtons','Punches per round','Calories burned','Decibels'],c:1},
  {q:'Shadow boxing primarily develops?',a:['Power','Technique and rhythm','Muscle mass','Flexibility'],c:1},
  {q:'Mike Tyson&#39;s peek-a-boo style was designed for?',a:['Tall fighters','Short, explosive fighters','Distance fighters','Clinch fighters'],c:1}
];
var quizV20Idx = 0, quizV20Score = 0;

function startQuizV20(){
  quizV20Idx = 0; quizV20Score = 0;
  showQuizV20();
}

function showQuizV20(){
  var area = document.getElementById('v20-quiz-area'); if(!area) return;
  if(quizV20Idx >= QUIZ_V20.length){
    var pct = Math.round(quizV20Score / QUIZ_V20.length * 100);
    v20.quizV20Scores['attempt_'+Object.keys(v20.quizV20Scores).length] = pct;
    saveV20(v20); checkV20Achievements();
    area.innerHTML = '<div style="text-align:center;padding:16px"><div style="font-size:24px;font-weight:bold;color:var(--accent)">'+pct+'%</div><div style="color:var(--text-dim);font-size:12px;margin-top:4px">'+quizV20Score+'/'+QUIZ_V20.length+' correct</div></div>';
    return;
  }
  var q = QUIZ_V20[quizV20Idx];
  var html = '<div style="padding:10px"><div style="font-size:12px;color:var(--text);margin-bottom:8px;line-height:1.4">'+(quizV20Idx+1)+'. '+q.q+'</div>';
  q.a.forEach(function(a,i){
    html += '<button onclick="window._ansV20('+i+')" style="display:block;width:100%;text-align:left;padding:8px 12px;margin:4px 0;background:var(--surface);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);font-size:11px;cursor:pointer">'+a+'</button>';
  });
  html += '</div>';
  area.innerHTML = html;
}

window._ansV20 = function(i){
  if(i === QUIZ_V20[quizV20Idx].c){ quizV20Score++; playSFX20('quiz_correct20'); }
  else { playSFX20('quiz_wrong20'); }
  quizV20Idx++;
  showQuizV20();
};

// ===== ACHIEVEMENTS V20 =====
var ACHIEVEMENTS_V20 = [
  {id:'spar_debut',name:'Sparring Debut',desc:'Complete first spar simulation',check:function(){return v20.sparTactics.matches.length>=1;}},
  {id:'rhythm_master',name:'Rhythm Master',desc:'Achieve 90%+ rhythm accuracy',check:function(){return v20.rhythm.bestAccuracy>=90;}},
  {id:'punch_tracker',name:'Punch Tracker',desc:'Log 100+ total punches',check:function(){return v20.punchCounter.totalPunches>=100;}},
  {id:'anatomy_student',name:'Anatomy Student',desc:'Study 6+ muscle groups',check:function(){return Object.keys(v20.anatomy.studied).length>=6;}},
  {id:'energy_planner',name:'Energy Planner',desc:'Create 3+ energy plans',check:function(){return v20.energy.sessions>=3;}},
  {id:'legend_scholar',name:'Legend Scholar',desc:'Compare 5+ legend matchups',check:function(){return v20.legends.comparisons>=5;}},
  {id:'workout_creator',name:'Workout Creator',desc:'Generate 5+ workouts',check:function(){return v20.workout.completed>=5;}},
  {id:'nutrition_streak',name:'Nutrition Streak',desc:'Maintain 3-day nutrition streak',check:function(){return v20.nutrition.streak>=3;}},
  {id:'spar_veteran',name:'Spar Veteran',desc:'Win 10+ sparring matches',check:function(){return v20.sparTactics.wins>=10;}},
  {id:'quiz_v20_ace',name:'Quiz V20 Ace',desc:'Score 90%+ on v20 quiz',check:function(){var s=v20.quizV20Scores;for(var k in s){if(s[k]>=90)return true;}return false;}},
  {id:'all_muscles',name:'Full Anatomy',desc:'Study all 12 muscle groups',check:function(){return Object.keys(v20.anatomy.studied).length>=12;}},
  {id:'v20_complete',name:'V20 Complete',desc:'Use all 8 v20 features',check:function(){return v20.sparTactics.matches.length>0&&v20.rhythm.scores.length>0&&v20.punchCounter.sessions>0&&Object.keys(v20.anatomy.studied).length>0&&v20.energy.sessions>0&&v20.legends.comparisons>0&&v20.workout.completed>0&&v20.nutrition.logs.length>0;}}
];

function checkV20Achievements(){
  var unlocked = 0;
  ACHIEVEMENTS_V20.forEach(function(a){
    if(!v20.achievementsV20[a.id] && a.check()){
      v20.achievementsV20[a.id] = true;
      unlocked++;
    }
  });
  if(unlocked > 0){ saveV20(v20); playSFX20('achieve20'); renderV20Achievements(); }
}

function renderV20Achievements(){
  var grid = document.getElementById('v20-ach-grid'); if(!grid) return;
  var html = '';
  ACHIEVEMENTS_V20.forEach(function(a){
    var done = v20.achievementsV20[a.id];
    html += '<div style="width:80px;text-align:center;padding:8px;opacity:'+(done?'1':'0.4')+';border-radius:12px;background:var(--surface);border:1px solid '+(done?'var(--accent)':'var(--glass-border)')+'">';
    html += '<div style="font-size:20px;margin-bottom:4px">'+(done?'🏅':'🔒')+'</div>';
    html += '<div style="font-size:9px;color:var(--text);font-weight:600">'+a.name+'</div>';
    html += '<div style="font-size:8px;color:var(--text-dim);margin-top:2px">'+a.desc+'</div>';
    html += '</div>';
  });
  grid.innerHTML = html;
}

// ===== KEYBOARD SHORTCUTS =====
function initV20Keyboard(){
  document.addEventListener('keydown', function(e){
    if(!e.shiftKey) return;
    var el;
    switch(e.key){
      case '1': el = document.getElementById('v20-spar'); break;
      case '2': el = document.getElementById('v20-rhythm'); break;
      case '3': el = document.getElementById('v20-punch'); break;
      case '4': el = document.getElementById('v20-anatomy'); break;
      case '5': el = document.getElementById('v20-energy'); break;
      case '6': el = document.getElementById('v20-legend'); break;
      case '7': el = document.getElementById('v20-workout'); break;
      case '8': el = document.getElementById('v20-nutrition'); break;
      default: return;
    }
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); playSFX20('nav_v20'); }
  });
}

// ===== BUILD V20 =====
function buildV20(){
  var container = document.querySelector('.container') || document.body;
  var footer = container.querySelector('.footer') || container.querySelector('footer');
  var html = '';

  html += '<div style="display:flex;gap:6px;padding:10px 16px;overflow-x:auto;-webkit-overflow-scrolling:touch">';
  [{id:'v20-spar',icon:'🤼',label:'Tactics'},{id:'v20-rhythm',icon:'🥁',label:'Rhythm'},{id:'v20-punch',icon:'📊',label:'Counter'},{id:'v20-anatomy',icon:'💪',label:'Anatomy'},{id:'v20-energy',icon:'⚡',label:'Energy'},{id:'v20-legend',icon:'🏆',label:'Legends'},{id:'v20-workout',icon:'📋',label:'Workout'},{id:'v20-nutrition',icon:'🥗',label:'Nutrition'}].forEach(function(n){
    html += '<button onclick="document.getElementById(\''+n.id+'\').scrollIntoView({behavior:\'smooth\'})" style="flex-shrink:0;padding:6px 12px;background:var(--surface);border:1px solid var(--glass-border);border-radius:20px;color:var(--text-dim);font-size:11px;cursor:pointer;white-space:nowrap">'+n.icon+' '+n.label+'</button>';
  });
  html += '</div>';

  html += '<section class="section" id="v20-spar"><h2 class="section-title"><span class="emoji">🤼</span> Sparring Tactics (8 Styles)</h2><div class="card"><canvas id="v20-spar-canvas" width="580" height="360" style="width:100%;height:auto;border-radius:12px"></canvas><div style="display:flex;gap:6px;margin-top:10px;justify-content:center"><button class="v20-btn" id="v20-spar-sim">🥊 Simulate</button><button class="v20-btn-sec" id="v20-spar-next">➡️ Next Style</button></div></div></section>';

  html += '<section class="section" id="v20-rhythm"><h2 class="section-title"><span class="emoji">🥁</span> Boxing Rhythm (8 Patterns)</h2><div class="card"><canvas id="v20-rhythm-canvas" width="560" height="340" style="width:100%;height:auto;border-radius:12px"></canvas><div style="display:flex;gap:6px;margin-top:10px;justify-content:center"><button class="v20-btn" id="v20-rhythm-tap">🥁 Tap Beat</button><button class="v20-btn-sec" id="v20-rhythm-next">🔄 Next Pattern</button></div></div></section>';

  html += '<section class="section" id="v20-punch"><h2 class="section-title"><span class="emoji">📊</span> Punch Counter (12R)</h2><div class="card"><canvas id="v20-punch-canvas" width="620" height="380" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v20-btn" id="v20-punch-add">📊 Add Round</button></div></div></section>';

  html += '<section class="section" id="v20-anatomy"><h2 class="section-title"><span class="emoji">💪</span> Boxing Anatomy (12 Muscles)</h2><div class="card"><canvas id="v20-anatomy-canvas" width="580" height="360" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v20-btn" id="v20-anatomy-study">💪 Study Muscle</button></div></div></section>';

  html += '<section class="section" id="v20-energy"><h2 class="section-title"><span class="emoji">⚡</span> Energy Management (12R)</h2><div class="card"><canvas id="v20-energy-canvas" width="560" height="340" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v20-btn" id="v20-energy-gen">⚡ Generate Plan</button></div></div></section>';

  html += '<section class="section" id="v20-legend"><h2 class="section-title"><span class="emoji">🏆</span> Legend Comparator (10)</h2><div class="card"><canvas id="v20-legend-canvas" width="600" height="380" style="width:100%;height:auto;border-radius:12px"></canvas><div style="display:flex;gap:6px;margin-top:10px;justify-content:center"><button class="v20-btn" id="v20-legend-a">🔴 Next A</button><button class="v20-btn-sec" id="v20-legend-b">🔵 Next B</button></div></div></section>';

  html += '<section class="section" id="v20-workout"><h2 class="section-title"><span class="emoji">📋</span> Workout Generator</h2><div class="card"><canvas id="v20-workout-canvas" width="580" height="360" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v20-btn" id="v20-workout-gen">📋 Generate Workout</button></div></div></section>';

  html += '<section class="section" id="v20-nutrition"><h2 class="section-title"><span class="emoji">🥗</span> Nutrition Planner</h2><div class="card"><canvas id="v20-nutrition-canvas" width="560" height="340" style="width:100%;height:auto;border-radius:12px"></canvas><div style="display:flex;gap:6px;margin-top:10px;justify-content:center"><button class="v20-btn" id="v20-nutrition-log">💧 Log Water (250ml)</button><button class="v20-btn-sec" id="v20-nutrition-next">🔄 Next Plan</button></div></div></section>';

  html += '<section class="section" id="v20-quiz"><h2 class="section-title"><span class="emoji">❓</span> v20 Quiz (15Q)</h2><div class="card"><div id="v20-quiz-area" style="min-height:60px"><div style="text-align:center;color:var(--text-dim);font-size:13px;padding:16px">Press Start</div></div><div style="text-align:center;margin-top:10px"><button class="v20-btn" id="v20-quiz-start">❓ Start Quiz</button></div></div></section>';

  html += '<section class="section" id="v20-ach"><h2 class="section-title"><span class="emoji">🏅</span> v20 Achievements (12)</h2><div class="card"><div class="badge-grid" id="v20-ach-grid" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center"></div></div></section>';

  var wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  while(wrapper.firstChild){
    if(footer) container.insertBefore(wrapper.firstChild, footer);
    else container.appendChild(wrapper.firstChild);
  }

  // Event listeners
  var ss = document.getElementById('v20-spar-sim');
  if(ss) ss.addEventListener('click', simulateSpar);
  var sn = document.getElementById('v20-spar-next');
  if(sn) sn.addEventListener('click', nextTactic);
  var rt = document.getElementById('v20-rhythm-tap');
  if(rt) rt.addEventListener('click', tapRhythm);
  var rn = document.getElementById('v20-rhythm-next');
  if(rn) rn.addEventListener('click', nextRhythm);
  var pa = document.getElementById('v20-punch-add');
  if(pa) pa.addEventListener('click', addPunchRound);
  var as = document.getElementById('v20-anatomy-study');
  if(as) as.addEventListener('click', studyAnatomy);
  var eg = document.getElementById('v20-energy-gen');
  if(eg) eg.addEventListener('click', generateEnergyPlan);
  var la = document.getElementById('v20-legend-a');
  if(la) la.addEventListener('click', nextLegendA);
  var lb = document.getElementById('v20-legend-b');
  if(lb) lb.addEventListener('click', nextLegendB);
  var wg = document.getElementById('v20-workout-gen');
  if(wg) wg.addEventListener('click', generateWorkout);
  var nl = document.getElementById('v20-nutrition-log');
  if(nl) nl.addEventListener('click', logNutrition);
  var nn = document.getElementById('v20-nutrition-next');
  if(nn) nn.addEventListener('click', nextMealPlan);
  var qs = document.getElementById('v20-quiz-start');
  if(qs) qs.addEventListener('click', startQuizV20);

  // Initial draws
  setTimeout(function(){
    drawSparCanvas();
    drawRhythmCanvas();
    drawPunchCanvas();
    drawAnatomyCanvas();
    drawEnergyCanvas();
    drawLegendCanvas();
    drawWorkoutCanvas();
    drawNutritionCanvas();
    renderV20Achievements();
  }, 100);
}

// ===== INIT =====
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', function(){ buildV20(); initV20Keyboard(); });
} else {
  buildV20(); initV20Keyboard();
}

})();
