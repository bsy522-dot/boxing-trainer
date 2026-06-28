// Boxing Trainer Pro v16_patch.js - NEXTERA+PRISM Auto Enhancement Module
// Timing Master Trainer Canvas falling-targets, Fitness Assessment Canvas 6-axis Radar,
// Pro Fight Analysis Guide 12types, Power Ladder Challenge Canvas 10levels,
// Music Punch Sync Canvas 8songs, Defense IQ Test Canvas 10R,
// Custom Round Planner builder, Form Correction Clinic 12types,
// Quiz +15 (105->120), +12 Achievements (106->118), SFX 12, Keyboard +8
(function(){
'use strict';

var STORAGE_KEY = 'boxingTrainerData';
var V16KEY = 'boxingV16Patch';

function loadAppData(){
  try { var r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch(e){ return null; }
}
function loadV16(){
  try {
    var r = localStorage.getItem(V16KEY);
    if(!r) return defV16();
    var p = JSON.parse(r), d = defV16();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV16(); }
}
function saveV16(d){ try { localStorage.setItem(V16KEY, JSON.stringify(d)); } catch(e){} }
function defV16(){
  return {
    timing: { bestScore: 0, totalHits: 0, sessions: 0, avgAccuracy: 0 },
    fitness: { history: [], lastTest: null },
    fightAnalysis: { viewed: [], favorite: '' },
    powerLadder: { bestLevel: 0, totalPunches: 0, sessions: 0 },
    musicPunch: { songsPlayed: [], totalBeats: 0, bestScore: 0 },
    defenseIQ: { score: 0, sessions: [], bestRound: 0 },
    roundPlanner: { plans: [], activePlan: null },
    formClinic: { viewed: [], quizDone: false },
    quizV16Scores: {},
    achievementsV16: {},
    featureUsage: {}
  };
}

var v16 = loadV16();

// ===== SFX ENGINE V16 =====
function playSFX16(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'timing_hit':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(1760,t+0.08);
        g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.1);break;
      case 'timing_miss':
        var buf=ctx.createBuffer(1,ctx.sampleRate*0.06,ctx.sampleRate);
        var d=buf.getChannelData(0);
        for(var i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.exp(-i/(d.length*0.2));
        var src=ctx.createBufferSource(),gn=ctx.createGain();
        src.buffer=buf;gn.gain.setValueAtTime(0.08,t);gn.gain.exponentialRampToValueAtTime(0.001,t+0.06);
        src.connect(gn).connect(ctx.destination);src.start(t);break;
      case 'fitness_test':
        [523,659,784,1047].forEach(function(f,j){
          var o2=ctx.createOscillator(),g2=ctx.createGain();
          o2.type='triangle';o2.frequency.value=f;
          g2.gain.setValueAtTime(0.08,t+j*0.1);g2.gain.exponentialRampToValueAtTime(0.001,t+j*0.1+0.2);
          o2.connect(g2).connect(ctx.destination);o2.start(t+j*0.1);o2.stop(t+j*0.1+0.2);
        });break;
      case 'fight_view':
        var o3=ctx.createOscillator(),g3=ctx.createGain();
        o3.type='sawtooth';o3.frequency.setValueAtTime(330,t);o3.frequency.linearRampToValueAtTime(440,t+0.12);
        g3.gain.setValueAtTime(0.06,t);g3.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o3.connect(g3).connect(ctx.destination);o3.start(t);o3.stop(t+0.15);break;
      case 'power_punch':
        var buf2=ctx.createBuffer(1,ctx.sampleRate*0.08,ctx.sampleRate);
        var d2=buf2.getChannelData(0);
        for(var i2=0;i2<d2.length;i2++) d2[i2]=(Math.random()*2-1)*Math.exp(-i2/(d2.length*0.12))*1.5;
        var src2=ctx.createBufferSource(),gn2=ctx.createGain();
        src2.buffer=buf2;gn2.gain.setValueAtTime(0.18,t);gn2.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        src2.connect(gn2).connect(ctx.destination);src2.start(t);
        var o4=ctx.createOscillator(),g4=ctx.createGain();
        o4.type='sine';o4.frequency.setValueAtTime(120,t);o4.frequency.exponentialRampToValueAtTime(60,t+0.1);
        g4.gain.setValueAtTime(0.1,t);g4.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o4.connect(g4).connect(ctx.destination);o4.start(t);o4.stop(t+0.12);break;
      case 'power_level':
        [392,494,587,698,784].forEach(function(f,j){
          var o5=ctx.createOscillator(),g5=ctx.createGain();
          o5.type='square';o5.frequency.value=f;
          g5.gain.setValueAtTime(0.06,t+j*0.06);g5.gain.exponentialRampToValueAtTime(0.001,t+j*0.06+0.1);
          o5.connect(g5).connect(ctx.destination);o5.start(t+j*0.06);o5.stop(t+j*0.06+0.1);
        });break;
      case 'music_beat':
        var o6=ctx.createOscillator(),g6=ctx.createGain();
        o6.type='sine';o6.frequency.value=660;
        g6.gain.setValueAtTime(0.1,t);g6.gain.exponentialRampToValueAtTime(0.001,t+0.05);
        o6.connect(g6).connect(ctx.destination);o6.start(t);o6.stop(t+0.05);break;
      case 'defense_block':
        var o7=ctx.createOscillator(),g7=ctx.createGain();
        o7.type='triangle';o7.frequency.setValueAtTime(440,t);o7.frequency.linearRampToValueAtTime(220,t+0.1);
        g7.gain.setValueAtTime(0.1,t);g7.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o7.connect(g7).connect(ctx.destination);o7.start(t);o7.stop(t+0.12);break;
      case 'defense_correct':
        [523,784].forEach(function(f,j){
          var o8=ctx.createOscillator(),g8=ctx.createGain();
          o8.type='sine';o8.frequency.value=f;
          g8.gain.setValueAtTime(0.09,t+j*0.1);g8.gain.exponentialRampToValueAtTime(0.001,t+j*0.1+0.15);
          o8.connect(g8).connect(ctx.destination);o8.start(t+j*0.1);o8.stop(t+j*0.1+0.15);
        });break;
      case 'plan_save':
        var o9=ctx.createOscillator(),g9=ctx.createGain();
        o9.type='sine';o9.frequency.setValueAtTime(523,t);o9.frequency.linearRampToValueAtTime(784,t+0.15);
        g9.gain.setValueAtTime(0.08,t);g9.gain.exponentialRampToValueAtTime(0.001,t+0.2);
        o9.connect(g9).connect(ctx.destination);o9.start(t);o9.stop(t+0.2);break;
      case 'form_view':
        var oA=ctx.createOscillator(),gA=ctx.createGain();
        oA.type='sine';oA.frequency.value=587;
        gA.gain.setValueAtTime(0.07,t);gA.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        oA.connect(gA).connect(ctx.destination);oA.start(t);oA.stop(t+0.12);break;
      case 'quiz_v16':
        [440,554,659].forEach(function(f,j){
          var oB=ctx.createOscillator(),gB=ctx.createGain();
          oB.type='triangle';oB.frequency.value=f;
          gB.gain.setValueAtTime(0.07,t+j*0.08);gB.gain.exponentialRampToValueAtTime(0.001,t+j*0.08+0.12);
          oB.connect(gB).connect(ctx.destination);oB.start(t+j*0.08);oB.stop(t+j*0.08+0.12);
        });break;
      case 'achieve_v16':
        [523,659,784,1047].forEach(function(f,j){
          var oC=ctx.createOscillator(),gC=ctx.createGain();
          oC.type='sine';oC.frequency.value=f;
          gC.gain.setValueAtTime(0.1,t+j*0.12);gC.gain.exponentialRampToValueAtTime(0.001,t+j*0.12+0.25);
          oC.connect(gC).connect(ctx.destination);oC.start(t+j*0.12);oC.stop(t+j*0.12+0.25);
        });break;
    }
  } catch(e){}
}

// ===== INJECT V16 STYLES =====
function injectV16Styles(){
  if(document.getElementById('v16-styles')) return;
  var s = document.createElement('style');
  s.id = 'v16-styles';
  s.textContent = [
    '.v16-section{padding:24px 16px;max-width:1100px;margin:0 auto 20px;animation:slideUp 0.5s ease-out both}',
    '.v16-card{background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius);padding:20px;backdrop-filter:blur(10px)}',
    '.v16-title{font-size:20px;font-weight:800;margin-bottom:16px;display:flex;align-items:center;gap:10px;color:var(--text)}',
    '.v16-subtitle{font-size:14px;color:var(--text-dim);margin-bottom:12px}',
    '.v16-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:var(--accent-soft);color:var(--accent)}',
    '.v16-btn{padding:10px 20px;border:none;border-radius:12px;font-weight:700;cursor:pointer;transition:all 0.2s;font-size:14px}',
    '.v16-btn-primary{background:linear-gradient(135deg,var(--accent),#CC2222);color:#fff}',
    '.v16-btn-primary:hover{transform:scale(1.03);filter:brightness(1.1)}',
    '.v16-btn-secondary{background:var(--glass);border:1px solid var(--glass-border);color:var(--text)}',
    '.v16-btn-secondary:hover{border-color:var(--accent);color:var(--accent)}',
    '.v16-btn-sm{padding:6px 14px;font-size:12px;border-radius:8px}',
    '.v16-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}',
    '.v16-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}',
    '.v16-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}',
    '@media(max-width:600px){.v16-grid-2,.v16-grid-3{grid-template-columns:1fr}}',
    '.v16-canvas-wrap{position:relative;width:100%;max-width:560px;margin:0 auto}',
    '.v16-canvas{width:100%;border-radius:12px;background:rgba(0,0,0,0.3)}',
    '.v16-stat{text-align:center;padding:12px}',
    '.v16-stat-num{font-size:28px;font-weight:900;color:var(--accent)}',
    '.v16-stat-label{font-size:11px;color:var(--text-dim);margin-top:2px}',
    '.v16-progress{height:6px;background:var(--surface);border-radius:3px;overflow:hidden}',
    '.v16-progress-fill{height:100%;border-radius:3px;transition:width 0.5s ease}',
    '.v16-chip{display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border-radius:20px;font-size:12px;cursor:pointer;transition:all 0.2s;border:1px solid var(--glass-border);background:var(--glass)}',
    '.v16-chip.active{background:var(--accent-soft);border-color:var(--accent);color:var(--accent)}',
    '.v16-chip:hover{border-color:var(--accent)}',
    '.v16-expand{max-height:0;overflow:hidden;transition:max-height 0.3s ease}',
    '.v16-expand.open{max-height:2000px}',
    '.v16-tab-row{display:flex;gap:8px;overflow-x:auto;padding-bottom:8px;scrollbar-width:none}',
    '.v16-tab-row::-webkit-scrollbar{display:none}',
    '.v16-toast{position:fixed;bottom:100px;left:50%;transform:translateX(-50%);padding:12px 24px;background:var(--accent);color:#fff;border-radius:30px;font-size:13px;font-weight:700;z-index:9999;animation:slideUp 0.3s ease-out;pointer-events:none}',
    '.v16-scrollnav{position:fixed;bottom:0;left:0;right:0;z-index:90;background:rgba(15,10,30,0.95);backdrop-filter:blur(15px);border-top:1px solid var(--glass-border);display:flex;overflow-x:auto;scrollbar-width:none;padding:8px 8px}',
    '.v16-scrollnav::-webkit-scrollbar{display:none}',
    '[data-theme="light"] .v16-scrollnav{background:rgba(245,245,248,0.95)}',
    '.v16-scrollnav-item{flex-shrink:0;padding:8px 14px;border-radius:20px;font-size:12px;font-weight:600;color:var(--text-dim);cursor:pointer;transition:all 0.2s;white-space:nowrap}',
    '.v16-scrollnav-item:hover,.v16-scrollnav-item:active{background:var(--accent-soft);color:var(--accent)}',
    '.v16-target{position:absolute;width:50px;height:50px;border-radius:50%;cursor:pointer;transition:transform 0.1s}',
    '.v16-target:active{transform:scale(0.8)}',
    '.v16-ladder-step{padding:12px;border-radius:10px;border:1px solid var(--glass-border);display:flex;align-items:center;gap:12px;transition:all 0.3s}',
    '.v16-ladder-step.active{border-color:var(--accent);background:var(--accent-soft)}',
    '.v16-ladder-step.done{border-color:var(--green);background:rgba(34,197,94,0.1)}',
    '.v16-form-card{padding:16px;border-radius:12px;border:1px solid var(--glass-border);background:var(--glass);cursor:pointer;transition:all 0.2s}',
    '.v16-form-card:hover{border-color:var(--accent);transform:translateY(-2px)}',
    '.v16-form-card.viewed{border-left:3px solid var(--green)}',
    '.v16-ach-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}',
    '.v16-ach-item{text-align:center;padding:14px 8px;border-radius:12px;border:1px solid var(--glass-border);background:var(--glass)}',
    '.v16-ach-item.unlocked{border-color:var(--gold);background:rgba(255,215,0,0.08)}',
    '.v16-ach-icon{font-size:28px;margin-bottom:6px}',
    '.v16-ach-name{font-size:11px;font-weight:700}',
    '.v16-quiz-opt{padding:12px 16px;border:1px solid var(--glass-border);border-radius:10px;cursor:pointer;transition:all 0.2s;font-size:13px}',
    '.v16-quiz-opt:hover{border-color:var(--accent);background:var(--accent-soft)}',
    '.v16-quiz-opt.correct{border-color:var(--green);background:rgba(34,197,94,0.15)}',
    '.v16-quiz-opt.wrong{border-color:#ef4444;background:rgba(239,68,68,0.15)}'
  ].join('\n');
  document.head.appendChild(s);
}

function showToast16(msg){
  var t = document.createElement('div');
  t.className = 'v16-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 2000);
}

// ===== 1. TIMING MASTER TRAINER =====
var timingState = { running: false, score: 0, hits: 0, misses: 0, targets: [], animId: null, startTime: 0, duration: 30 };

function buildTimingMaster(){
  var sec = document.createElement('div');
  sec.className = 'v16-section';
  sec.id = 'v16-timing';
  sec.innerHTML = '<div class="v16-card">' +
    '<div class="v16-title">⏱️ 타이밍 마스터 트레이너 <span class="v16-badge">NEW v16</span></div>' +
    '<div class="v16-subtitle">FightCamp 스타일 타이밍 드릴 - 30초 내 정확한 타이밍으로 타겟을 한치세요</div>' +
    '<div class="v16-grid-3" style="margin-bottom:16px">' +
      '<div class="v16-stat"><div class="v16-stat-num" id="v16-timing-score">0</div><div class="v16-stat-label">점수</div></div>' +
      '<div class="v16-stat"><div class="v16-stat-num" id="v16-timing-hits">0</div><div class="v16-stat-label">명중</div></div>' +
      '<div class="v16-stat"><div class="v16-stat-num" id="v16-timing-best">' + v16.timing.bestScore + '</div><div class="v16-stat-label">최고</div></div>' +
    '</div>' +
    '<div class="v16-canvas-wrap"><canvas id="v16-timing-canvas" class="v16-canvas" width="560" height="360"></canvas></div>' +
    '<div style="text-align:center;margin-top:14px">' +
      '<button class="v16-btn v16-btn-primary" id="v16-timing-start">🥊 타이밍 드릴 시작</button>' +
    '</div>' +
  '</div>';
  return sec;
}

function drawTimingCanvas(){
  var c = document.getElementById('v16-timing-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var w = c.width, h = c.height;
  ctx.clearRect(0,0,w,h);
  var isDark = !document.documentElement.hasAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.fillStyle = isDark ? '#0d0820' : '#f0f0f4';
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = isDark ? 'rgba(255,68,68,0.15)' : 'rgba(255,68,68,0.1)';
  ctx.lineWidth = 1;
  for(var i=0;i<12;i++){
    ctx.beginPath();ctx.moveTo(0,i*30);ctx.lineTo(w,i*30);ctx.stroke();
    ctx.beginPath();ctx.moveTo(i*(w/12),0);ctx.lineTo(i*(w/12),h);ctx.stroke();
  }
  if(timingState.running){
    var elapsed = (Date.now()-timingState.startTime)/1000;
    var remain = Math.max(0, timingState.duration - elapsed);
    ctx.fillStyle = var_accent();
    ctx.fillRect(0,h-8,(remain/timingState.duration)*w,8);
    ctx.fillStyle = isDark ? '#fff' : '#222';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(remain.toFixed(1)+'s',w-10,h-16);
    timingState.targets.forEach(function(tg){
      var grad = ctx.createRadialGradient(tg.x,tg.y,5,tg.x,tg.y,tg.r);
      var colors = ['#FF4444','#FF6644','#FF8844','#FFAA44','#22c55e'];
      grad.addColorStop(0, colors[tg.type % colors.length]);
      grad.addColorStop(1, 'rgba(255,68,68,0.1)');
      ctx.beginPath();
      ctx.arc(tg.x,tg.y,tg.r,0,Math.PI*2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      var innerR = tg.r * (tg.life / tg.maxLife);
      ctx.beginPath();
      ctx.arc(tg.x,tg.y,Math.max(3,innerR),0,Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fill();
    });
    if(remain <= 0) endTimingDrill();
  } else {
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🥊 시작 버튼을 누르세요',w/2,h/2);
  }
}
function var_accent(){ return '#FF4444'; }

function startTimingDrill(){
  timingState = { running:true, score:0, hits:0, misses:0, targets:[], animId:null, startTime:Date.now(), duration:30 };
  updateTimingStats();
  spawnTarget();
  runTimingLoop();
  playSFX16('timing_hit');
}
function spawnTarget(){
  if(!timingState.running) return;
  var c = document.getElementById('v16-timing-canvas');
  if(!c) return;
  var r = 20 + Math.floor(Math.random()*15);
  var tg = {
    x: r + Math.floor(Math.random()*(c.width-r*2)),
    y: r + Math.floor(Math.random()*(c.height-60-r*2)),
    r: r,
    life: 60,
    maxLife: 60,
    type: Math.floor(Math.random()*5),
    id: Date.now()
  };
  timingState.targets.push(tg);
  if(timingState.targets.length < 4){
    setTimeout(spawnTarget, 500 + Math.random()*800);
  }
}
function runTimingLoop(){
  if(!timingState.running) return;
  timingState.targets.forEach(function(tg){ tg.life--; });
  var expired = timingState.targets.filter(function(tg){ return tg.life <= 0; });
  expired.forEach(function(){ timingState.misses++; });
  timingState.targets = timingState.targets.filter(function(tg){ return tg.life > 0; });
  if(expired.length > 0) playSFX16('timing_miss');
  if(timingState.targets.length < 3 && Math.random() > 0.6) spawnTarget();
  drawTimingCanvas();
  updateTimingStats();
  timingState.animId = requestAnimationFrame(runTimingLoop);
}
function endTimingDrill(){
  timingState.running = false;
  if(timingState.animId) cancelAnimationFrame(timingState.animId);
  if(timingState.score > v16.timing.bestScore) v16.timing.bestScore = timingState.score;
  v16.timing.totalHits += timingState.hits;
  v16.timing.sessions++;
  var total = timingState.hits + timingState.misses;
  v16.timing.avgAccuracy = total > 0 ? Math.round((timingState.hits/total)*100) : 0;
  saveV16(v16);
  drawTimingCanvas();
  updateTimingStats();
  showToast16('타이밍 드릴 완료! 점수: ' + timingState.score);
  checkV16Achievements();
}
function updateTimingStats(){
  var el1 = document.getElementById('v16-timing-score');
  var el2 = document.getElementById('v16-timing-hits');
  var el3 = document.getElementById('v16-timing-best');
  if(el1) el1.textContent = timingState.score;
  if(el2) el2.textContent = timingState.hits;
  if(el3) el3.textContent = v16.timing.bestScore;
}
function handleTimingClick(e){
  if(!timingState.running) return;
  var c = document.getElementById('v16-timing-canvas');
  if(!c) return;
  var rect = c.getBoundingClientRect();
  var scaleX = c.width / rect.width;
  var scaleY = c.height / rect.height;
  var mx = (e.clientX - rect.left) * scaleX;
  var my = (e.clientY - rect.top) * scaleY;
  for(var i = timingState.targets.length - 1; i >= 0; i--){
    var tg = timingState.targets[i];
    var dx = mx - tg.x, dy = my - tg.y;
    if(dx*dx + dy*dy <= tg.r*tg.r){
      var bonus = Math.ceil((tg.life / tg.maxLife) * 100);
      timingState.score += bonus;
      timingState.hits++;
      timingState.targets.splice(i, 1);
      playSFX16('timing_hit');
      spawnTarget();
      updateTimingStats();
      return;
    }
  }
}

// ===== 2. FITNESS ASSESSMENT RADAR =====
var FITNESS_METRICS = [
  {key:'cardio', label:'심폐지구력', icon:'❤️', unit:'VO2', max:60},
  {key:'strength', label:'근력', icon:'💪', unit:'kg', max:100},
  {key:'flexibility', label:'유연성', icon:'🤸', unit:'cm', max:50},
  {key:'endurance', label:'지구력', icon:'⚡', unit:'min', max:60},
  {key:'agility', label:'민첩성', icon:'🏃', unit:'s', max:10},
  {key:'power', label:'폭발력', icon:'🔥', unit:'W', max:1000}
];

function buildFitnessAssess(){
  var sec = document.createElement('div');
  sec.className = 'v16-section';
  sec.id = 'v16-fitness';
  var metricsHTML = FITNESS_METRICS.map(function(m){
    return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">' +
      '<span style="font-size:18px;width:28px;text-align:center">' + m.icon + '</span>' +
      '<span style="font-size:13px;width:80px;color:var(--text-dim)">' + m.label + '</span>' +
      '<input type="range" id="v16-fit-'+m.key+'" min="0" max="'+m.max+'" value="'+Math.round(m.max*0.5)+'" style="flex:1;accent-color:var(--accent)">' +
      '<span id="v16-fit-val-'+m.key+'" style="font-size:13px;font-weight:700;width:40px;text-align:right">'+Math.round(m.max*0.5)+'</span>' +
    '</div>';
  }).join('');
  sec.innerHTML = '<div class="v16-card">' +
    '<div class="v16-title">📊 체력 종합 측정기 <span class="v16-badge">6축 Radar</span></div>' +
    '<div class="v16-subtitle">심폐지구력/근력/유연성/지구력/민첩성/폭발력 6항목 측정 + 레이더 Canvas</div>' +
    '<div class="v16-canvas-wrap"><canvas id="v16-fitness-canvas" class="v16-canvas" width="400" height="400"></canvas></div>' +
    '<div style="margin-top:16px">' + metricsHTML + '</div>' +
    '<div style="text-align:center;margin-top:14px;display:flex;gap:10px;justify-content:center">' +
      '<button class="v16-btn v16-btn-primary" id="v16-fit-test">📋 측정 저장</button>' +
      '<button class="v16-btn v16-btn-secondary" id="v16-fit-clear">초기화</button>' +
    '</div>' +
    '<div id="v16-fit-grade" style="text-align:center;margin-top:12px;font-size:16px;font-weight:800"></div>' +
  '</div>';
  return sec;
}
function drawFitnessRadar(){
  var c = document.getElementById('v16-fitness-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var w = c.width, h = c.height;
  var cx = w/2, cy = h/2, maxR = Math.min(cx,cy) - 50;
  ctx.clearRect(0,0,w,h);
  var isDark = !document.documentElement.hasAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.fillStyle = isDark ? '#0d0820' : '#f0f0f4';
  ctx.fillRect(0,0,w,h);
  var n = FITNESS_METRICS.length;
  var angleStep = (Math.PI*2)/n;
  [0.2,0.4,0.6,0.8,1.0].forEach(function(frac){
    ctx.beginPath();
    for(var i=0;i<=n;i++){
      var a = -Math.PI/2 + i*angleStep;
      var px = cx + Math.cos(a)*maxR*frac;
      var py = cy + Math.sin(a)*maxR*frac;
      if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.closePath();
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
  for(var i=0;i<n;i++){
    var a = -Math.PI/2 + i*angleStep;
    ctx.beginPath();ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(a)*maxR, cy+Math.sin(a)*maxR);
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    ctx.stroke();
  }
  var values = FITNESS_METRICS.map(function(m){
    var el = document.getElementById('v16-fit-'+m.key);
    return el ? parseInt(el.value)/m.max : 0.5;
  });
  ctx.beginPath();
  values.forEach(function(v,i){
    var a = -Math.PI/2 + i*angleStep;
    var px = cx + Math.cos(a)*maxR*v;
    var py = cy + Math.sin(a)*maxR*v;
    if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,68,68,0.2)';
  ctx.fill();
  ctx.strokeStyle = '#FF4444';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  values.forEach(function(v,i){
    var a = -Math.PI/2 + i*angleStep;
    var px = cx + Math.cos(a)*maxR*v;
    var py = cy + Math.sin(a)*maxR*v;
    ctx.beginPath();ctx.arc(px,py,5,0,Math.PI*2);
    ctx.fillStyle = '#FF4444';ctx.fill();
    ctx.strokeStyle = '#fff';ctx.lineWidth = 2;ctx.stroke();
  });
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = isDark ? '#ddd' : '#333';
  FITNESS_METRICS.forEach(function(m,i){
    var a = -Math.PI/2 + i*angleStep;
    var lx = cx + Math.cos(a)*(maxR+30);
    var ly = cy + Math.sin(a)*(maxR+30);
    ctx.fillText(m.icon+' '+m.label, lx, ly+4);
  });
  var avg = values.reduce(function(s,v){return s+v;},0)/values.length;
  var grade = avg >= 0.9 ? 'S' : avg >= 0.75 ? 'A' : avg >= 0.6 ? 'B' : avg >= 0.4 ? 'C' : 'D';
  var colors = {S:'#FFD700',A:'#22c55e',B:'#3b82f6',C:'#f97316',D:'#ef4444'};
  ctx.font = 'bold 36px sans-serif';
  ctx.fillStyle = colors[grade];
  ctx.fillText(grade+' 등급', cx, cy+10);
  ctx.font = '14px sans-serif';
  ctx.fillStyle = isDark ? '#aaa' : '#666';
  ctx.fillText('종합 '+ Math.round(avg*100) + '%', cx, cy+30);
  var gradeEl = document.getElementById('v16-fit-grade');
  if(gradeEl) gradeEl.innerHTML = '<span style="color:'+colors[grade]+'">종합 체력 등급: '+grade+' ('+Math.round(avg*100)+'%)</span>';
}
function saveFitnessTest(){
  var result = {};
  FITNESS_METRICS.forEach(function(m){
    var el = document.getElementById('v16-fit-'+m.key);
    result[m.key] = el ? parseInt(el.value) : 0;
  });
  v16.fitness.history.push(result);
  if(v16.fitness.history.length > 30) v16.fitness.history = v16.fitness.history.slice(-30);
  v16.fitness.lastTest = new Date().toISOString().slice(0,10);
  saveV16(v16);
  playSFX16('fitness_test');
  showToast16('체력 측정 저장 완료!');
  checkV16Achievements();
}

// ===== 3. PRO FIGHT ANALYSIS GUIDE =====
var FIGHT_ANALYSES = [
  {id:'ali_frazier',title:'알리 vs 프레이저',era:'1971',key:'푹워크 및 속도 차이 분석',icon:'🥇',detail:'알리의 잡/무브 vs 프레이저의 압박 전술. 외곽전투 vs 인파이팅의 전형적 대결.'},
  {id:'tyson_holyfield',title:'타이슨 vs 홈리필드',era:'1996',key:'피카부 스타일 공략',icon:'🥊',detail:'타이슨의 피카부 방어+인사이드 전투. 홈리필드의 클린치+헤드무브먼트 분석.'},
  {id:'mayweather_pacquiao',title:'메이웨더 vs 파키아오',era:'2015',key:'방어 마스터클래스',icon:'🛡️',detail:'메이웨더의 숙더롤/풀백 방어 버베 분석. 파키아오의 스피드 전환 전투.'},
  {id:'leonard_hearns',title:'레너드 vs 허르즈',era:'1981',key:'라운드별 전투 변화',icon:'⭐',detail:'전반 아웃복싱 vs 후반 인파이팅 전환. 전술적 유연성의 교과서.'},
  {id:'canelo_ggg',title:'카네로 vs GGG',era:'2017',key:'외곽 vs 압박 스타일',icon:'🎯',detail:'카네로의 카운터펀치 전략. GGG의 압박+바디샷 공략 분석.'},
  {id:'hagler_hearns',title:'해글러 vs 허르즈',era:'1985',key:'3분 폭풍전투 분석',icon:'🔥',detail:'역사상 가장 겕렬한 3R. 상호 공격적 페이스의 교훈.'},
  {id:'usyk_fury',title:'우시크 vs 퓨리',era:'2024',key:'기술 vs 파워 대결',icon:'🏆',detail:'우시크의 푹워크+앤글 체인지. 퓨리의 사이즈+잡 전투 분석.'},
  {id:'pac_marquez',title:'파키아오 vs 마르케스',era:'2012',key:'카운터펀치 전략',icon:'💥',detail:'마르케스의 타이밍 카운터. 파키아오의 스피드 러시 및 취약점.'},
  {id:'rjj_toney',title:'로이 존스 Jr vs 토니',era:'1994',key:'스피드+반사신경 승리',icon:'⚡',detail:'로이 존스의 초인적 반사신경. 토니의 방어적 전투 분석.'},
  {id:'hong_fight',title:'홍수환 vs 오즐',era:'1977',key:'한국 복싱 전설',icon:'🇰🇷',detail:'홍수환의 의지와 체력. 한국 복싱 역사의 분기점.'},
  {id:'ward_kovalev',title:'워드 vs 코발레프',era:'2016',key:'전술 조정 승리',icon:'🧠',detail:'워드의 라운드별 전술 조정. 보디워크 및 클린치 활용.'},
  {id:'loma_lopez',title:'로마첸코 vs 로페즈',era:'2020',key:'하이가드 복싱',icon:'🎭',detail:'로마첸코의 앤글/푹워크. 로페즈의 사이즈+파워 전투.'}
];

function buildFightAnalysis(){
  var sec = document.createElement('div');
  sec.className = 'v16-section';
  sec.id = 'v16-fights';
  sec.innerHTML = '<div class="v16-card">' +
    '<div class="v16-title">🎬 프로 파이트 분석 가이드 <span class="v16-badge">12종</span></div>' +
    '<div class="v16-subtitle">역대 명승부의 전술적 핵심을 분석합니다</div>' +
    '<div id="v16-fight-list"></div>' +
  '</div>';
  return sec;
}
function renderFightAnalyses(){
  var el = document.getElementById('v16-fight-list');
  if(!el) return;
  el.innerHTML = FIGHT_ANALYSES.map(function(f){
    var viewed = v16.fightAnalysis.viewed.indexOf(f.id) >= 0;
    return '<div class="v16-form-card'+(viewed?' viewed':'')+'" style="margin-bottom:10px" onclick="toggleFightDetail(\''+f.id+'\')">' +
      '<div style="display:flex;align-items:center;gap:10px">' +
        '<span style="font-size:24px">'+f.icon+'</span>' +
        '<div style="flex:1">' +
          '<div style="font-weight:700;font-size:14px">'+f.title+'</div>' +
          '<div style="font-size:11px;color:var(--text-dim)">'+f.era+' \xB7 '+f.key+'</div>' +
        '</div>' +
        '<span style="font-size:12px;color:var(--text-muted)">'+(viewed?'✅':'▶️')+'</span>' +
      '</div>' +
      '<div class="v16-expand" id="v16-fight-'+f.id+'">' +
        '<div style="padding:12px 0 0;font-size:13px;color:var(--text-dim);line-height:1.6">'+f.detail+'</div>' +
      '</div>' +
    '</div>';
  }).join('');
}
window.toggleFightDetail = function(id){
  var el = document.getElementById('v16-fight-'+id);
  if(!el) return;
  el.classList.toggle('open');
  if(el.classList.contains('open')){
    if(v16.fightAnalysis.viewed.indexOf(id) < 0){
      v16.fightAnalysis.viewed.push(id);
      saveV16(v16);
      renderFightAnalyses();
      checkV16Achievements();
    }
    playSFX16('fight_view');
  }
};

// ===== 4. POWER LADDER CHALLENGE =====
var POWER_LEVELS = [
  {level:1,name:'워밍업',punches:10,speed:2000,icon:'🌱'},
  {level:2,name:'신입',punches:15,speed:1800,icon:'🌿'},
  {level:3,name:'도전자',punches:20,speed:1500,icon:'🌾'},
  {level:4,name:'파이터',punches:25,speed:1300,icon:'⭐'},
  {level:5,name:'치러',punches:30,speed:1100,icon:'🔥'},
  {level:6,name:'밴텀급',punches:35,speed:1000,icon:'🥊'},
  {level:7,name:'헤비히터',punches:40,speed:900,icon:'💥'},
  {level:8,name:'쳄피언',punches:45,speed:800,icon:'🏆'},
  {level:9,name:'레전드',punches:50,speed:700,icon:'👑'},
  {level:10,name:'복싱의 신',punches:60,speed:600,icon:'🌟'}
];
var ladderState = { running: false, level: 0, currentPunches: 0, targetPunches: 0, timerId: null, startTime: 0 };

function buildPowerLadder(){
  var sec = document.createElement('div');
  sec.className = 'v16-section';
  sec.id = 'v16-ladder';
  sec.innerHTML = '<div class="v16-card">' +
    '<div class="v16-title">💪 파워 래더 챌린지 <span class="v16-badge">10단계</span></div>' +
    '<div class="v16-subtitle">단계별 파워 챌린지 - 제한시간 안에 펀치를 완성하세요</div>' +
    '<div class="v16-grid-3" style="margin-bottom:16px">' +
      '<div class="v16-stat"><div class="v16-stat-num" id="v16-ladder-level">0</div><div class="v16-stat-label">현재 레벨</div></div>' +
      '<div class="v16-stat"><div class="v16-stat-num" id="v16-ladder-punches">0</div><div class="v16-stat-label">펀치 수</div></div>' +
      '<div class="v16-stat"><div class="v16-stat-num" id="v16-ladder-best">' + v16.powerLadder.bestLevel + '</div><div class="v16-stat-label">최고 레벨</div></div>' +
    '</div>' +
    '<div id="v16-ladder-steps"></div>' +
    '<div class="v16-canvas-wrap" style="margin-top:14px"><canvas id="v16-ladder-canvas" class="v16-canvas" width="560" height="200"></canvas></div>' +
    '<div style="text-align:center;margin-top:14px">' +
      '<button class="v16-btn v16-btn-primary" id="v16-ladder-start">🏁 챌린지 시작</button>' +
      '<button class="v16-btn v16-btn-secondary" id="v16-ladder-punch" style="display:none;margin-left:10px">🥊 펀치!</button>' +
    '</div>' +
  '</div>';
  return sec;
}
function renderLadderSteps(){
  var el = document.getElementById('v16-ladder-steps');
  if(!el) return;
  el.innerHTML = POWER_LEVELS.map(function(lv){
    var done = v16.powerLadder.bestLevel >= lv.level;
    var active = ladderState.running && ladderState.level === lv.level - 1;
    return '<div class="v16-ladder-step'+(done?' done':'')+(active?' active':'')+'" style="margin-bottom:6px">' +
      '<span style="font-size:20px">'+(done?'✅':lv.icon)+'</span>' +
      '<div style="flex:1"><div style="font-weight:700;font-size:13px">Lv.'+lv.level+' '+lv.name+'</div>' +
      '<div style="font-size:11px;color:var(--text-dim)">'+lv.punches+'펀치 / '+((lv.punches*lv.speed)/1000).toFixed(0)+'초</div></div>' +
    '</div>';
  }).join('');
}
function drawLadderCanvas(){
  var c = document.getElementById('v16-ladder-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var w = c.width, h = c.height;
  ctx.clearRect(0,0,w,h);
  var isDark = !document.documentElement.hasAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.fillStyle = isDark ? '#0d0820' : '#f0f0f4';
  ctx.fillRect(0,0,w,h);
  var barW = (w - 40) / 10;
  POWER_LEVELS.forEach(function(lv,i){
    var barH = ((i+1)/10) * (h-40);
    var x = 20 + i * barW;
    var y = h - 20 - barH;
    var done = v16.powerLadder.bestLevel >= lv.level;
    ctx.fillStyle = done ? '#22c55e' : (isDark ? 'rgba(255,68,68,0.3)' : 'rgba(255,68,68,0.2)');
    ctx.fillRect(x+2, y, barW-4, barH);
    if(ladderState.running && ladderState.level === i){
      ctx.fillStyle = '#FF4444';
      var prog = ladderState.currentPunches / ladderState.targetPunches;
      ctx.fillRect(x+2, y + barH*(1-prog), barW-4, barH*prog);
    }
    ctx.fillStyle = isDark ? '#ddd' : '#333';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('L'+lv.level, x+barW/2, h-6);
  });
}
function startLadder(){
  ladderState = { running:true, level:0, currentPunches:0, targetPunches:POWER_LEVELS[0].punches, timerId:null, startTime:Date.now() };
  var punchBtn = document.getElementById('v16-ladder-punch');
  var startBtn = document.getElementById('v16-ladder-start');
  if(punchBtn) punchBtn.style.display = 'inline-block';
  if(startBtn) startBtn.style.display = 'none';
  renderLadderSteps();
  drawLadderCanvas();
  updateLadderStats();
}
function punchLadder(){
  if(!ladderState.running) return;
  ladderState.currentPunches++;
  v16.powerLadder.totalPunches++;
  playSFX16('power_punch');
  if(ladderState.currentPunches >= ladderState.targetPunches){
    ladderState.level++;
    if(ladderState.level >= POWER_LEVELS.length){
      endLadder(true);
      return;
    }
    ladderState.currentPunches = 0;
    ladderState.targetPunches = POWER_LEVELS[ladderState.level].punches;
    playSFX16('power_level');
    showToast16('🎉 Lv.' + (ladderState.level) + ' 클리어!');
  }
  updateLadderStats();
  renderLadderSteps();
  drawLadderCanvas();
}
function endLadder(success){
  ladderState.running = false;
  var lvReached = ladderState.level;
  if(lvReached > v16.powerLadder.bestLevel) v16.powerLadder.bestLevel = lvReached;
  v16.powerLadder.sessions++;
  saveV16(v16);
  var punchBtn = document.getElementById('v16-ladder-punch');
  var startBtn = document.getElementById('v16-ladder-start');
  if(punchBtn) punchBtn.style.display = 'none';
  if(startBtn) startBtn.style.display = 'inline-block';
  showToast16(success ? '🏆 전체 클리어!' : '레벨 ' + lvReached + ' 도달!');
  renderLadderSteps();
  drawLadderCanvas();
  updateLadderStats();
  checkV16Achievements();
}
function updateLadderStats(){
  var el1 = document.getElementById('v16-ladder-level');
  var el2 = document.getElementById('v16-ladder-punches');
  var el3 = document.getElementById('v16-ladder-best');
  if(el1) el1.textContent = ladderState.level;
  if(el2) el2.textContent = ladderState.currentPunches;
  if(el3) el3.textContent = v16.powerLadder.bestLevel;
}

// ===== 5. MUSIC PUNCH SYNC =====
var MUSIC_SONGS = [
  {id:'eye_tiger',title:'Eye of the Tiger',bpm:109,genre:'Rock',icon:'🐅'},
  {id:'stronger',title:'Stronger',bpm:116,genre:'Pop',icon:'💪'},
  {id:'lose_yourself',title:'Lose Yourself',bpm:171,genre:'HipHop',icon:'🎤'},
  {id:'thunderstruck',title:'Thunderstruck',bpm:134,genre:'Rock',icon:'⚡'},
  {id:'till_i_collapse',title:'Till I Collapse',bpm:171,genre:'HipHop',icon:'🔥'},
  {id:'can_stop',title:'Can\'t Hold Us',bpm:146,genre:'Pop',icon:'🎉'},
  {id:'warrior',title:'Warrior',bpm:128,genre:'EDM',icon:'⚔️'},
  {id:'champion',title:'Champion',bpm:140,genre:'HipHop',icon:'🏆'}
];
var musicState = { playing: false, songIdx: 0, beats: 0, score: 0, timerId: null, beatActive: false };

function buildMusicPunch(){
  var sec = document.createElement('div');
  sec.className = 'v16-section';
  sec.id = 'v16-music';
  sec.innerHTML = '<div class="v16-card">' +
    '<div class="v16-title">🎵 뮤직 펀치 싱크 <span class="v16-badge">8곡 BPM</span></div>' +
    '<div class="v16-subtitle">비트에 맞춰 펀치! BPM 싱크 워크아웃</div>' +
    '<div class="v16-tab-row" id="v16-music-tabs"></div>' +
    '<div class="v16-canvas-wrap" style="margin-top:12px"><canvas id="v16-music-canvas" class="v16-canvas" width="560" height="280"></canvas></div>' +
    '<div class="v16-grid-3" style="margin-top:12px">' +
      '<div class="v16-stat"><div class="v16-stat-num" id="v16-music-beats">0</div><div class="v16-stat-label">비트</div></div>' +
      '<div class="v16-stat"><div class="v16-stat-num" id="v16-music-score">0</div><div class="v16-stat-label">점수</div></div>' +
      '<div class="v16-stat"><div class="v16-stat-num" id="v16-music-best">' + v16.musicPunch.bestScore + '</div><div class="v16-stat-label">최고</div></div>' +
    '</div>' +
    '<div style="text-align:center;margin-top:14px">' +
      '<button class="v16-btn v16-btn-primary" id="v16-music-start">🎶 비트 시작</button>' +
      '<button class="v16-btn v16-btn-secondary" id="v16-music-punch" style="display:none;margin-left:10px">🥊 펀치!</button>' +
    '</div>' +
  '</div>';
  return sec;
}
function renderMusicTabs(){
  var el = document.getElementById('v16-music-tabs');
  if(!el) return;
  el.innerHTML = MUSIC_SONGS.map(function(s,i){
    var played = v16.musicPunch.songsPlayed.indexOf(s.id) >= 0;
    return '<div class="v16-chip'+(musicState.songIdx===i?' active':'')+'" onclick="selectMusicSong('+i+')">' +
      s.icon+' '+s.title+' ('+s.bpm+'BPM)'+(played?' ✅':'') +
    '</div>';
  }).join('');
}
window.selectMusicSong = function(idx){
  musicState.songIdx = idx;
  renderMusicTabs();
  drawMusicCanvas();
};
function drawMusicCanvas(){
  var c = document.getElementById('v16-music-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var w = c.width, h = c.height;
  ctx.clearRect(0,0,w,h);
  var isDark = !document.documentElement.hasAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.fillStyle = isDark ? '#0d0820' : '#f0f0f4';
  ctx.fillRect(0,0,w,h);
  var song = MUSIC_SONGS[musicState.songIdx];
  ctx.fillStyle = isDark ? '#fff' : '#222';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(song.icon + ' ' + song.title, w/2, 30);
  ctx.font = '14px sans-serif';
  ctx.fillStyle = isDark ? '#aaa' : '#666';
  ctx.fillText(song.bpm + ' BPM \xB7 ' + song.genre, w/2, 50);
  var barCount = 16;
  var barW = (w-80)/barCount;
  for(var i=0;i<barCount;i++){
    var barH = 20 + Math.sin(i*0.8 + (musicState.playing ? Date.now()*0.003 : 0)) * 40 + 40;
    var x = 40 + i*barW;
    var y = h/2 + 20 - barH/2;
    var hue = (i/barCount)*60;
    ctx.fillStyle = musicState.beatActive && i === musicState.beats % barCount ?
      '#FFD700' : 'hsl('+(0+hue)+',80%,'+(isDark?'50%':'40%')+')';
    ctx.fillRect(x+2, y, barW-4, barH);
  }
  if(musicState.playing){
    var pulseR = 30 + Math.sin(Date.now()*0.01)*10;
    ctx.beginPath();
    ctx.arc(w/2, h-40, pulseR, 0, Math.PI*2);
    ctx.fillStyle = musicState.beatActive ? 'rgba(255,215,0,0.4)' : 'rgba(255,68,68,0.2)';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('🥊', w/2, h-35);
  }
}
function startMusicWorkout(){
  var song = MUSIC_SONGS[musicState.songIdx];
  musicState = { playing:true, songIdx:musicState.songIdx, beats:0, score:0, timerId:null, beatActive:false };
  var beatInterval = 60000 / song.bpm;
  var totalBeats = 32;
  var beatCount = 0;
  var punchBtn = document.getElementById('v16-music-punch');
  var startBtn = document.getElementById('v16-music-start');
  if(punchBtn) punchBtn.style.display = 'inline-block';
  if(startBtn) startBtn.style.display = 'none';
  musicState.timerId = setInterval(function(){
    beatCount++;
    musicState.beats = beatCount;
    musicState.beatActive = true;
    playSFX16('music_beat');
    drawMusicCanvas();
    updateMusicStats();
    setTimeout(function(){ musicState.beatActive = false; drawMusicCanvas(); }, beatInterval * 0.3);
    if(beatCount >= totalBeats) endMusicWorkout();
  }, beatInterval);
  drawMusicCanvas();
}
function punchOnBeat(){
  if(!musicState.playing) return;
  if(musicState.beatActive){
    musicState.score += 10;
    playSFX16('timing_hit');
  } else {
    musicState.score = Math.max(0, musicState.score - 3);
    playSFX16('timing_miss');
  }
  updateMusicStats();
}
function endMusicWorkout(){
  if(musicState.timerId) clearInterval(musicState.timerId);
  musicState.playing = false;
  var song = MUSIC_SONGS[musicState.songIdx];
  if(v16.musicPunch.songsPlayed.indexOf(song.id) < 0) v16.musicPunch.songsPlayed.push(song.id);
  v16.musicPunch.totalBeats += musicState.beats;
  if(musicState.score > v16.musicPunch.bestScore) v16.musicPunch.bestScore = musicState.score;
  saveV16(v16);
  var punchBtn = document.getElementById('v16-music-punch');
  var startBtn = document.getElementById('v16-music-start');
  if(punchBtn) punchBtn.style.display = 'none';
  if(startBtn) startBtn.style.display = 'inline-block';
  showToast16('🎵 뮤직 워크아웃 완료! 점수: ' + musicState.score);
  renderMusicTabs();
  drawMusicCanvas();
  updateMusicStats();
  checkV16Achievements();
}
function updateMusicStats(){
  var el1 = document.getElementById('v16-music-beats');
  var el2 = document.getElementById('v16-music-score');
  var el3 = document.getElementById('v16-music-best');
  if(el1) el1.textContent = musicState.beats;
  if(el2) el2.textContent = musicState.score;
  if(el3) el3.textContent = v16.musicPunch.bestScore;
}

// ===== 6. DEFENSE IQ TEST =====
var DEFENSE_QUESTIONS = [
  {q:'잡 공격이 들어올 때 가장 적절한 방어는?',opts:['슬립','파리','풀백','롤'],ans:1},
  {q:'훅 공격 시 방어 동작으로 적절한 것은?',opts:['밥앤위브','파리','솔더롤','하이가드'],ans:0},
  {q:'어퍼캿 방어에 가장 적합한 기술은?',opts:['슬립','함꺼 사용','풀백','클린치'],ans:2},
  {q:'바디샷 방어 시 팔꼉치 위치는?',opts:['턱 앞','복부','옆구리','엉덩이'],ans:1},
  {q:'카운터펀치의 핵심 원리는?',opts:['회피+반격','방어+후퇴','공격+전진','클린치+홀드'],ans:0},
  {q:'슬립과 롤의 주요 차이점은?',opts:['방향','상체 이동 방향','발 위치','시선 방향'],ans:1},
  {q:'필리 쉘 방어의 핵심 요소는?',opts:['어깨 활용','팔꼉치 각도','허리 회전','발 배치'],ans:0},
  {q:'밥앤위브 시 무릎의 적절한 굴곡 각도는?',opts:['30도','45도','60도','90도'],ans:1},
  {q:'대각선 스텝 백의 주요 목적은?',opts:['공격 각도 생성','방어 자세 유지','거리 확보','체력 절약'],ans:0},
  {q:'클린치 상황에서 벗어나는 적절한 방법은?',opts:['밀치기','어퍼캿','피벻트리','바디샷'],ans:2}
];
var defIQState = { round: 0, score: 0, answered: false, results: [] };

function buildDefenseIQ(){
  var sec = document.createElement('div');
  sec.className = 'v16-section';
  sec.id = 'v16-defense';
  sec.innerHTML = '<div class="v16-card">' +
    '<div class="v16-title">🧠 디펜스 IQ 테스트 <span class="v16-badge">10R</span></div>' +
    '<div class="v16-subtitle">방어 지능 테스트 - 상황별 최적 방어 기술 선택</div>' +
    '<div class="v16-grid-3" style="margin-bottom:16px">' +
      '<div class="v16-stat"><div class="v16-stat-num" id="v16-def-round">0</div><div class="v16-stat-label">라운드</div></div>' +
      '<div class="v16-stat"><div class="v16-stat-num" id="v16-def-score">0</div><div class="v16-stat-label">점수</div></div>' +
      '<div class="v16-stat"><div class="v16-stat-num" id="v16-def-best">' + v16.defenseIQ.bestRound + '</div><div class="v16-stat-label">최고</div></div>' +
    '</div>' +
    '<div id="v16-def-content"></div>' +
    '<div style="text-align:center;margin-top:14px">' +
      '<button class="v16-btn v16-btn-primary" id="v16-def-start">🛡️ 테스트 시작</button>' +
    '</div>' +
  '</div>';
  return sec;
}
function startDefenseIQ(){
  defIQState = { round: 0, score: 0, answered: false, results: [] };
  renderDefQuestion();
}
function renderDefQuestion(){
  var el = document.getElementById('v16-def-content');
  if(!el) return;
  if(defIQState.round >= DEFENSE_QUESTIONS.length){
    endDefenseIQ();
    return;
  }
  var q = DEFENSE_QUESTIONS[defIQState.round];
  defIQState.answered = false;
  el.innerHTML = '<div style="margin-bottom:12px;font-weight:700;font-size:15px">Q' + (defIQState.round+1) + '. ' + q.q + '</div>' +
    '<div style="display:flex;flex-direction:column;gap:8px">' +
    q.opts.map(function(opt, i){
      return '<div class="v16-quiz-opt" id="v16-def-opt-'+i+'" onclick="answerDefenseIQ('+i+')">' + (i+1) + '. ' + opt + '</div>';
    }).join('') + '</div>';
  updateDefStats();
}
window.answerDefenseIQ = function(idx){
  if(defIQState.answered) return;
  defIQState.answered = true;
  var q = DEFENSE_QUESTIONS[defIQState.round];
  var correct = idx === q.ans;
  if(correct){
    defIQState.score += 10;
    playSFX16('defense_correct');
  } else {
    playSFX16('defense_block');
  }
  defIQState.results.push(correct);
  var optEl = document.getElementById('v16-def-opt-'+idx);
  if(optEl) optEl.className = 'v16-quiz-opt ' + (correct ? 'correct' : 'wrong');
  if(!correct){
    var correctEl = document.getElementById('v16-def-opt-'+q.ans);
    if(correctEl) correctEl.className = 'v16-quiz-opt correct';
  }
  updateDefStats();
  setTimeout(function(){
    defIQState.round++;
    renderDefQuestion();
  }, 1200);
};
function endDefenseIQ(){
  var el = document.getElementById('v16-def-content');
  var correctCount = defIQState.results.filter(function(r){return r;}).length;
  var grade = correctCount >= 9 ? 'S' : correctCount >= 7 ? 'A' : correctCount >= 5 ? 'B' : correctCount >= 3 ? 'C' : 'D';
  var colors = {S:'#FFD700',A:'#22c55e',B:'#3b82f6',C:'#f97316',D:'#ef4444'};
  if(el){
    el.innerHTML = '<div style="text-align:center;padding:20px">' +
      '<div style="font-size:48px;font-weight:900;color:'+colors[grade]+'">'+grade+' 등급</div>' +
      '<div style="font-size:16px;margin-top:8px">'+correctCount+'/'+DEFENSE_QUESTIONS.length+' 정답 (점수: '+defIQState.score+')</div>' +
    '</div>';
  }
  if(defIQState.score > v16.defenseIQ.score) v16.defenseIQ.score = defIQState.score;
  if(correctCount > v16.defenseIQ.bestRound) v16.defenseIQ.bestRound = correctCount;
  v16.defenseIQ.sessions.push({score:defIQState.score, correct:correctCount, date:new Date().toISOString().slice(0,10)});
  if(v16.defenseIQ.sessions.length > 20) v16.defenseIQ.sessions = v16.defenseIQ.sessions.slice(-20);
  saveV16(v16);
  updateDefStats();
  checkV16Achievements();
}
function updateDefStats(){
  var el1 = document.getElementById('v16-def-round');
  var el2 = document.getElementById('v16-def-score');
  var el3 = document.getElementById('v16-def-best');
  if(el1) el1.textContent = defIQState.round;
  if(el2) el2.textContent = defIQState.score;
  if(el3) el3.textContent = v16.defenseIQ.bestRound;
}

// ===== 7. CUSTOM ROUND PLANNER =====
var ROUND_ACTIVITIES = [
  {id:'jab',label:'잡',icon:'🥊',cal:8},
  {id:'cross',label:'크로스',icon:'💥',cal:10},
  {id:'hook',label:'훅',icon:'🎯',cal:12},
  {id:'upper',label:'어퍼캿',icon:'⚡',cal:12},
  {id:'combo',label:'콤보',icon:'🔥',cal:15},
  {id:'defense',label:'방어드릴',icon:'🛡️',cal:8},
  {id:'footwork',label:'푹워크',icon:'👣',cal:10},
  {id:'shadow',label:'섀도복싱',icon:'🤺',cal:14},
  {id:'bag',label:'샌드백',icon:'🎬',cal:16},
  {id:'rest',label:'휴식',icon:'💤',cal:0}
];

function buildRoundPlanner(){
  var sec = document.createElement('div');
  sec.className = 'v16-section';
  sec.id = 'v16-planner';
  sec.innerHTML = '<div class="v16-card">' +
    '<div class="v16-title">🗓️ 커스텀 라운드 플래너 <span class="v16-badge">빌더</span></div>' +
    '<div class="v16-subtitle">나만의 라운드 워크아웃을 설계하세요</div>' +
    '<div id="v16-planner-rounds" style="margin-bottom:12px"></div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
      ROUND_ACTIVITIES.map(function(a){
        return '<div class="v16-chip" onclick="addRoundActivity(\''+a.id+'\')" title="'+a.label+' (+'+a.cal+'kcal)">'+a.icon+' '+a.label+'</div>';
      }).join('') +
    '</div>' +
    '<div class="v16-grid-3" style="margin-bottom:12px">' +
      '<div class="v16-stat"><div class="v16-stat-num" id="v16-plan-rounds">0</div><div class="v16-stat-label">라운드</div></div>' +
      '<div class="v16-stat"><div class="v16-stat-num" id="v16-plan-cal">0</div><div class="v16-stat-label">총 칼로리</div></div>' +
      '<div class="v16-stat"><div class="v16-stat-num" id="v16-plan-saved">' + v16.roundPlanner.plans.length + '</div><div class="v16-stat-label">저장된 플랜</div></div>' +
    '</div>' +
    '<div style="display:flex;gap:10px;justify-content:center">' +
      '<button class="v16-btn v16-btn-primary v16-btn-sm" onclick="savePlan()">💾 플랜 저장</button>' +
      '<button class="v16-btn v16-btn-secondary v16-btn-sm" onclick="clearPlan()">🗑️ 초기화</button>' +
    '</div>' +
    '<div id="v16-saved-plans" style="margin-top:16px"></div>' +
  '</div>';
  return sec;
}
var currentPlan = [];
window.addRoundActivity = function(actId){
  if(currentPlan.length >= 12) { showToast16('최대 12라운드!'); return; }
  currentPlan.push(actId);
  renderPlanRounds();
  playSFX16('plan_save');
};
window.removeRoundActivity = function(idx){
  currentPlan.splice(idx, 1);
  renderPlanRounds();
};
function renderPlanRounds(){
  var el = document.getElementById('v16-planner-rounds');
  if(!el) return;
  if(currentPlan.length === 0){
    el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px">위 버튼을 눌러 라운드를 추가하세요</div>';
  } else {
    el.innerHTML = currentPlan.map(function(actId, idx){
      var act = ROUND_ACTIVITIES.find(function(a){return a.id===actId;});
      return '<div style="display:inline-flex;align-items:center;gap:4px;padding:6px 12px;margin:3px;border-radius:8px;background:var(--glass);border:1px solid var(--glass-border);font-size:12px;cursor:pointer" onclick="removeRoundActivity('+idx+')">' +
        '<span style="font-weight:700">R'+(idx+1)+'</span> '+act.icon+' '+act.label+' <span style="color:var(--text-muted)">✕</span></div>';
    }).join('');
  }
  var totalCal = currentPlan.reduce(function(sum, actId){
    var act = ROUND_ACTIVITIES.find(function(a){return a.id===actId;});
    return sum + (act ? act.cal : 0);
  }, 0);
  var el1 = document.getElementById('v16-plan-rounds');
  var el2 = document.getElementById('v16-plan-cal');
  if(el1) el1.textContent = currentPlan.length;
  if(el2) el2.textContent = totalCal;
}
window.savePlan = function(){
  if(currentPlan.length === 0) { showToast16('플랜이 비어있습니다'); return; }
  v16.roundPlanner.plans.push({ rounds: currentPlan.slice(), date: new Date().toISOString().slice(0,10) });
  if(v16.roundPlanner.plans.length > 10) v16.roundPlanner.plans = v16.roundPlanner.plans.slice(-10);
  saveV16(v16);
  playSFX16('plan_save');
  showToast16('플랜 저장 완료!');
  renderSavedPlans();
  var el3 = document.getElementById('v16-plan-saved');
  if(el3) el3.textContent = v16.roundPlanner.plans.length;
  checkV16Achievements();
};
window.clearPlan = function(){
  currentPlan = [];
  renderPlanRounds();
};
function renderSavedPlans(){
  var el = document.getElementById('v16-saved-plans');
  if(!el) return;
  if(v16.roundPlanner.plans.length === 0){
    el.innerHTML = '';
    return;
  }
  el.innerHTML = '<div style="font-size:13px;font-weight:700;margin-bottom:8px">📋 저장된 플랜</div>' +
    v16.roundPlanner.plans.slice().reverse().slice(0,5).map(function(plan,i){
      var totalCal = plan.rounds.reduce(function(s,actId){
        var a = ROUND_ACTIVITIES.find(function(x){return x.id===actId;});
        return s + (a?a.cal:0);
      },0);
      return '<div style="padding:8px;border-radius:8px;border:1px solid var(--glass-border);margin-bottom:6px;font-size:12px">' +
        '<span style="color:var(--text-dim)">'+plan.date+'</span> \xB7 '+plan.rounds.length+'R \xB7 '+totalCal+'kcal \xB7 ' +
        plan.rounds.map(function(actId){ var a = ROUND_ACTIVITIES.find(function(x){return x.id===actId;}); return a?a.icon:''; }).join('') +
      '</div>';
    }).join('');
}

// ===== 8. FORM CORRECTION CLINIC =====
var FORM_CORRECTIONS = [
  {id:'jab_form',title:'잡 자세 교정',cat:'기본',icon:'🥊',points:['어깨 높이에서 일직선 펀치','손목 각도 유지','반대손 가드 유지','팀치 회수 신속하게']},
  {id:'cross_form',title:'크로스 자세 교정',cat:'기본',icon:'💥',points:['허리 회전으로 파워 생성','발끼움치 들어올리기','어깨선 넣기','턴 업']},
  {id:'hook_form',title:'훅 자세 교정',cat:'기본',icon:'🎯',points:['팔꼉치 90도 각도 유지','몸통 회전으로 파워','손목 고정 유지','수평 펀치 궤적']},
  {id:'guard_form',title:'가드 자세 교정',cat:'방어',icon:'🛡️',points:['양손 턱 높이 유지','팔꼉치 붙이기','턱 내리기','시선 상대 상체에 고정']},
  {id:'stance_form',title:'스탠스 교정',cat:'기본',icon:'👣',points:['어깨 너비 발 벌리기','무름 살짝 굽히기','체중 50:50 분배','발뒤꺼치 들어올리기']},
  {id:'footwork_form',title:'푹워크 교정',cat:'이동',icon:'🏃',points:['슬라이드 스텝으로 이동','발 꼴찌 안 벗기기','무게중심 낮게 유지','발다집으로 이동']},
  {id:'upper_form',title:'어퍼캿 교정',cat:'기본',icon:'⚡',points:['무릎 구부림으로 파워','수직 상승 궤적','턴 존거리 유지','반대손 가드 유지']},
  {id:'body_form',title:'바디샷 교정',cat:'공격',icon:'🎯',points:['목표: 간장/빌장/늘골','레벨 변화로 접근','수비 청결','팔꼉치 각도 조절']},
  {id:'slip_form',title:'슬립 동작 교정',cat:'방어',icon:'🎭',points:['무릎로 숨기','머리가 아닌 몸통 사용','바로 복귀','카운터 준비']},
  {id:'pivot_form',title:'피벻 동작 교정',cat:'이동',icon:'🔄',points:['앞발을 축으로 회전','뷸은 각도로 회전','가드 유지하며 회전','앙카른 포지션 확보']},
  {id:'clinch_form',title:'클린치 교정',cat:'방어',icon:'🤝',points:['양손을 목 뒤로','미리를 상대 어깨에','체중 싣기','심판 분리 시 바로 백스텝']},
  {id:'breath_form',title:'호흡 패턴 교정',cat:'기초',icon:'💨',points:['펀치 시 내쉬기','방어 시 숨 참지 않기','코로 들이마시기','리듬고 일정하게']}
];

function buildFormClinic(){
  var sec = document.createElement('div');
  sec.className = 'v16-section';
  sec.id = 'v16-form';
  sec.innerHTML = '<div class="v16-card">' +
    '<div class="v16-title">🎯 자세 교정 클리닉 <span class="v16-badge">12종</span></div>' +
    '<div class="v16-subtitle">BOXX 스타일 자세 교정 가이드 - 각 항목 클릭으로 상세 보기</div>' +
    '<div class="v16-tab-row" id="v16-form-tabs"></div>' +
    '<div id="v16-form-list"></div>' +
    '<div id="v16-form-progress" style="margin-top:12px"></div>' +
  '</div>';
  return sec;
}
function renderFormTabs(){
  var cats = ['all','기본','방어','이동','공격','기초'];
  var el = document.getElementById('v16-form-tabs');
  if(!el) return;
  el.innerHTML = cats.map(function(cat){
    return '<div class="v16-chip" onclick="filterFormCards(\''+cat+'\')">'+
      (cat==='all'?'전체':cat)+'</div>';
  }).join('');
}
var formFilter = 'all';
window.filterFormCards = function(cat){
  formFilter = cat;
  renderFormCards();
};
function renderFormCards(){
  var el = document.getElementById('v16-form-list');
  if(!el) return;
  var filtered = formFilter === 'all' ? FORM_CORRECTIONS : FORM_CORRECTIONS.filter(function(f){return f.cat===formFilter;});
  el.innerHTML = filtered.map(function(f){
    var viewed = v16.formClinic.viewed.indexOf(f.id) >= 0;
    return '<div class="v16-form-card'+(viewed?' viewed':'')+'" style="margin-bottom:10px" onclick="toggleFormDetail(\''+f.id+'\')">' +
      '<div style="display:flex;align-items:center;gap:10px">' +
        '<span style="font-size:22px">'+f.icon+'</span>' +
        '<div style="flex:1">' +
          '<div style="font-weight:700;font-size:14px">'+f.title+'</div>' +
          '<div style="font-size:11px;color:var(--text-dim)">'+f.cat+'</div>' +
        '</div>' +
        '<span style="font-size:12px;color:var(--text-muted)">'+(viewed?'✅':'▶️')+'</span>' +
      '</div>' +
      '<div class="v16-expand" id="v16-form-'+f.id+'">' +
        '<ul style="padding:12px 0 0 20px;font-size:13px;color:var(--text-dim);line-height:1.8">' +
          f.points.map(function(p){return '<li>'+p+'</li>';}).join('') +
        '</ul>' +
      '</div>' +
    '</div>';
  }).join('');
  renderFormProgress();
}
window.toggleFormDetail = function(id){
  var el = document.getElementById('v16-form-'+id);
  if(!el) return;
  el.classList.toggle('open');
  if(el.classList.contains('open')){
    if(v16.formClinic.viewed.indexOf(id) < 0){
      v16.formClinic.viewed.push(id);
      saveV16(v16);
      renderFormCards();
      checkV16Achievements();
    }
    playSFX16('form_view');
  }
};
function renderFormProgress(){
  var el = document.getElementById('v16-form-progress');
  if(!el) return;
  var prog = (v16.formClinic.viewed.length / FORM_CORRECTIONS.length * 100).toFixed(0);
  el.innerHTML = '<div style="font-size:12px;color:var(--text-dim);margin-bottom:4px">완료율: ' + v16.formClinic.viewed.length + '/' + FORM_CORRECTIONS.length + ' ('+prog+'%)</div>' +
    '<div class="v16-progress"><div class="v16-progress-fill" style="width:'+prog+'%;background:linear-gradient(90deg,var(--accent),var(--green))"></div></div>';
}

// ===== 9. QUIZ V16 (+15 questions) =====
var QUIZ_V16 = [
  {q:'복싱에서 타이밍이 가장 중요한 펀치는?',opts:['잡','크로스','카운터펀치','훅'],ans:2},
  {q:'VO2max는 무엇을 측정하는 지표인가?',opts:['근력','심폐지구력','유연성','반사신경'],ans:1},
  {q:'메이웨더의 대표적 방어 기술은?',opts:['피카부','풀백','솔더롤','클린치'],ans:2},
  {q:'파워 펀치의 핵심 원동력은?',opts:['팔 근력','허리 회전','손목 스냅','어깨 회전'],ans:1},
  {q:'BPM 120의 곡에 맞춰 펀치하면 1분에 몇 번?',opts:['60','90','120','180'],ans:2},
  {q:'슬립 동작 시 주로 사용하는 신체 부위는?',opts:['머리','무릎','허리','발'],ans:1},
  {q:'복싱 라운드의 표준 시간은?',opts:['2분','3분','5분','10분'],ans:1},
  {q:'푹워크에서 가장 중요한 원칙은?',opts:['스텝 후 발 모으기','달리기','점프하기','발 꼴찌 안 벗기기'],ans:0},
  {q:'바디샷 방어 시 팔꼉치 위치는?',opts:['턱 앞','복부','옆구리','허리'],ans:1},
  {q:'복싱에서 콤보의 정의는?',opts:['연속 펀치 조합','방어 기술','발 이동','휴식 자세'],ans:0},
  {q:'홍수환 선수의 체급은?',opts:['플라이급','밴텀급','헤비급','주니어미들급'],ans:3},
  {q:'복싱 글러브의 표준 무게는?',opts:['6oz','8oz','10oz','16oz'],ans:2},
  {q:'표준 복싱 링의 크기는?',opts:['3m x 3m','4.8m x 4.8m','6.1m x 6.1m','8m x 8m'],ans:2},
  {q:'호흡 패턴에서 펀치 시 올바른 호흡은?',opts:['들이마시기','내쉬기','참기','상관없음'],ans:1},
  {q:'복싱에서 애티틜드(심리전)의 역할은?',opts:['10%','30%','50%','80%'],ans:3}
];
var quizV16State = { current: 0, score: 0, answered: false };

function buildQuizV16(){
  var sec = document.createElement('div');
  sec.className = 'v16-section';
  sec.id = 'v16-quiz';
  sec.innerHTML = '<div class="v16-card">' +
    '<div class="v16-title">❓ 퀄즈 v16 <span class="v16-badge">+15문 (120)</span></div>' +
    '<div class="v16-subtitle">복싱 지식 테스트 v16 - 타이밍/체력/방어/파워/뮤직</div>' +
    '<div class="v16-grid-2" style="margin-bottom:12px">' +
      '<div class="v16-stat"><div class="v16-stat-num" id="v16-quiz-q">0</div><div class="v16-stat-label">문항</div></div>' +
      '<div class="v16-stat"><div class="v16-stat-num" id="v16-quiz-s">0</div><div class="v16-stat-label">점수</div></div>' +
    '</div>' +
    '<div id="v16-quiz-content"></div>' +
    '<div style="text-align:center;margin-top:14px">' +
      '<button class="v16-btn v16-btn-primary" id="v16-quiz-start">📝 퀄즈 시작</button>' +
    '</div>' +
  '</div>';
  return sec;
}
function startQuizV16(){
  quizV16State = { current: 0, score: 0, answered: false };
  renderQuizV16Question();
}
function renderQuizV16Question(){
  var el = document.getElementById('v16-quiz-content');
  if(!el) return;
  if(quizV16State.current >= QUIZ_V16.length){
    var grade = quizV16State.score >= 140 ? 'S' : quizV16State.score >= 100 ? 'A' : quizV16State.score >= 70 ? 'B' : quizV16State.score >= 40 ? 'C' : 'D';
    var colors = {S:'#FFD700',A:'#22c55e',B:'#3b82f6',C:'#f97316',D:'#ef4444'};
    el.innerHTML = '<div style="text-align:center;padding:20px"><div style="font-size:48px;font-weight:900;color:'+colors[grade]+'">'+grade+'</div>' +
      '<div style="font-size:16px;margin-top:8px">총점: '+quizV16State.score+' / '+(QUIZ_V16.length*10)+'</div></div>';
    v16.quizV16Scores[new Date().toISOString().slice(0,10)] = quizV16State.score;
    saveV16(v16);
    checkV16Achievements();
    return;
  }
  var q = QUIZ_V16[quizV16State.current];
  quizV16State.answered = false;
  el.innerHTML = '<div style="margin-bottom:12px;font-weight:700;font-size:15px">Q'+(quizV16State.current+1)+'. '+q.q+'</div>' +
    '<div style="display:flex;flex-direction:column;gap:8px">'+
    q.opts.map(function(opt,i){
      return '<div class="v16-quiz-opt" id="v16-qopt-'+i+'" onclick="answerQuizV16('+i+')">'+(i+1)+'. '+opt+'</div>';
    }).join('')+'</div>';
  updateQuizV16Stats();
}
window.answerQuizV16 = function(idx){
  if(quizV16State.answered) return;
  quizV16State.answered = true;
  var q = QUIZ_V16[quizV16State.current];
  var correct = idx === q.ans;
  if(correct){ quizV16State.score += 10; playSFX16('quiz_v16'); }
  else playSFX16('timing_miss');
  var optEl = document.getElementById('v16-qopt-'+idx);
  if(optEl) optEl.className = 'v16-quiz-opt '+(correct?'correct':'wrong');
  if(!correct){
    var cEl = document.getElementById('v16-qopt-'+q.ans);
    if(cEl) cEl.className = 'v16-quiz-opt correct';
  }
  updateQuizV16Stats();
  setTimeout(function(){ quizV16State.current++; renderQuizV16Question(); }, 1000);
};
function updateQuizV16Stats(){
  var el1 = document.getElementById('v16-quiz-q');
  var el2 = document.getElementById('v16-quiz-s');
  if(el1) el1.textContent = (quizV16State.current+1)+'/'+QUIZ_V16.length;
  if(el2) el2.textContent = quizV16State.score;
}

// ===== 10. ACHIEVEMENTS V16 =====
var ACH_V16 = [
  {id:'timing_first',name:'첫 타이밍',icon:'⏱️',desc:'타이밍 드릴 첫 완료',check:function(){return v16.timing.sessions >= 1;}},
  {id:'timing_master',name:'타이밍 마스터',icon:'🎯',desc:'타이밍 500점 돌파',check:function(){return v16.timing.bestScore >= 500;}},
  {id:'fitness_first',name:'체력 측정사',icon:'📊',desc:'체력 측정 첫 저장',check:function(){return v16.fitness.history.length >= 1;}},
  {id:'fight_fan',name:'복싱 팜',icon:'🎬',desc:'명승부 6개 시청',check:function(){return v16.fightAnalysis.viewed.length >= 6;}},
  {id:'fight_scholar',name:'분석 학자',icon:'🎓',desc:'명승부 전체 시청',check:function(){return v16.fightAnalysis.viewed.length >= FIGHT_ANALYSES.length;}},
  {id:'ladder_5',name:'밴텀급 도달',icon:'🥊',desc:'파워 래더 Lv.5 도달',check:function(){return v16.powerLadder.bestLevel >= 5;}},
  {id:'ladder_10',name:'복싱의 신',icon:'🌟',desc:'파워 래더 Lv.10 클리어',check:function(){return v16.powerLadder.bestLevel >= 10;}},
  {id:'music_3',name:'비트 메이커',icon:'🎵',desc:'뮤직 펀치 3곡 완료',check:function(){return v16.musicPunch.songsPlayed.length >= 3;}},
  {id:'music_all',name:'DJ 복서',icon:'🎧',desc:'뮤직 펀치 전곡 완료',check:function(){return v16.musicPunch.songsPlayed.length >= MUSIC_SONGS.length;}},
  {id:'defense_ace',name:'방어의 달인',icon:'🛡️',desc:'디펜스 IQ 8점+',check:function(){return v16.defenseIQ.bestRound >= 8;}},
  {id:'planner_3',name:'플래너 애용가',icon:'🗓️',desc:'플랜 3개 저장',check:function(){return v16.roundPlanner.plans.length >= 3;}},
  {id:'form_all',name:'자세 달인',icon:'🥇',desc:'교정 가이드 전체 완료',check:function(){return v16.formClinic.viewed.length >= FORM_CORRECTIONS.length;}}
];

function buildAchievementsV16(){
  var sec = document.createElement('div');
  sec.className = 'v16-section';
  sec.id = 'v16-achievements';
  sec.innerHTML = '<div class="v16-card">' +
    '<div class="v16-title">🏅 업적 v16 <span class="v16-badge">+12개 (118)</span></div>' +
    '<div id="v16-ach-grid" class="v16-ach-grid"></div>' +
  '</div>';
  return sec;
}
function renderV16Ach(){
  var el = document.getElementById('v16-ach-grid');
  if(!el) return;
  el.innerHTML = ACH_V16.map(function(a){
    var unlocked = v16.achievementsV16[a.id];
    return '<div class="v16-ach-item'+(unlocked?' unlocked':'')+'">' +
      '<div class="v16-ach-icon">'+(unlocked?a.icon:'🔒')+'</div>' +
      '<div class="v16-ach-name">'+(unlocked?a.name:'미해금')+'</div>' +
    '</div>';
  }).join('');
}
function checkV16Achievements(){
  var newUnlock = false;
  ACH_V16.forEach(function(a){
    if(!v16.achievementsV16[a.id] && a.check()){
      v16.achievementsV16[a.id] = true;
      newUnlock = true;
      showToast16('🏅 업적 해금: ' + a.name);
      playSFX16('achieve_v16');
    }
  });
  if(newUnlock){
    saveV16(v16);
    renderV16Ach();
  }
}

// ===== FEATURE TRACKING =====
function trackFeature(name){
  if(!v16.featureUsage) v16.featureUsage = {};
  v16.featureUsage[name] = true;
  saveV16(v16);
}

// ===== SCROLL NAV BAR =====
function buildScrollNav16(){
  var nav = document.createElement('div');
  nav.className = 'v16-scrollnav';
  nav.id = 'v16-scrollnav';
  var items = [
    {label:'타이밍',target:'v16-timing'},
    {label:'체력측정',target:'v16-fitness'},
    {label:'분석가이드',target:'v16-fights'},
    {label:'파워래더',target:'v16-ladder'},
    {label:'뮤직펀치',target:'v16-music'},
    {label:'디펜스IQ',target:'v16-defense'},
    {label:'플래너',target:'v16-planner'},
    {label:'자세교정',target:'v16-form'}
  ];
  nav.innerHTML = items.map(function(it){
    return '<div class="v16-scrollnav-item" onclick="document.getElementById(\''+it.target+'\').scrollIntoView({behavior:\'smooth\',block:\'start\'})">'+it.label+'</div>';
  }).join('');
  return nav;
}

// ===== KEYBOARD SHORTCUTS =====
function initV16Keyboard(){
  document.addEventListener('keydown', function(e){
    if(!e.shiftKey) return;
    var targets = {
      'A':'v16-timing',
      'B':'v16-fitness',
      'C':'v16-fights',
      'D':'v16-ladder',
      'E':'v16-music',
      'F':'v16-defense',
      'G':'v16-planner',
      'H':'v16-form'
    };
    var key = e.key.toUpperCase();
    if(key in targets){
      e.preventDefault();
      var el = document.getElementById(targets[key]);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
}

// ===== MAIN BUILD =====
function buildV16(){
  injectV16Styles();
  var container = document.querySelector('.hero');
  if(!container) container = document.body;
  var insertPoint = null;
  var existingV15Ach = document.getElementById('v15-achievements');
  if(existingV15Ach && existingV15Ach.nextElementSibling){
    insertPoint = existingV15Ach.nextElementSibling;
  }
  var parent = insertPoint ? insertPoint.parentNode : container.parentNode || document.body;
  var sections = [
    buildTimingMaster(),
    buildFitnessAssess(),
    buildFightAnalysis(),
    buildPowerLadder(),
    buildMusicPunch(),
    buildDefenseIQ(),
    buildRoundPlanner(),
    buildFormClinic(),
    buildQuizV16(),
    buildAchievementsV16()
  ];
  sections.forEach(function(sec){
    if(insertPoint){
      parent.insertBefore(sec, insertPoint);
    } else {
      var scriptTags = document.querySelectorAll('script[src*="v15_patch"]');
      if(scriptTags.length > 0){
        scriptTags[0].parentNode.insertBefore(sec, scriptTags[0]);
      } else {
        document.body.appendChild(sec);
      }
    }
  });

  // Remove old v15 scrollnav if exists
  var oldNav = document.getElementById('v15-scrollnav');
  if(oldNav) oldNav.style.display = 'none';

  var scrollNav = buildScrollNav16();
  document.body.appendChild(scrollNav);

  // Event listeners
  var timingCanvas = document.getElementById('v16-timing-canvas');
  if(timingCanvas){
    timingCanvas.addEventListener('click', handleTimingClick);
    timingCanvas.addEventListener('touchstart', function(e){
      e.preventDefault();
      var touch = e.touches[0];
      handleTimingClick({clientX:touch.clientX, clientY:touch.clientY});
    }, {passive:false});
  }
  var timingStart = document.getElementById('v16-timing-start');
  if(timingStart) timingStart.addEventListener('click', startTimingDrill);

  FITNESS_METRICS.forEach(function(m){
    var slider = document.getElementById('v16-fit-'+m.key);
    if(slider){
      slider.addEventListener('input', function(){
        var valEl = document.getElementById('v16-fit-val-'+m.key);
        if(valEl) valEl.textContent = this.value;
        drawFitnessRadar();
      });
    }
  });
  var fitTest = document.getElementById('v16-fit-test');
  if(fitTest) fitTest.addEventListener('click', saveFitnessTest);
  var fitClear = document.getElementById('v16-fit-clear');
  if(fitClear) fitClear.addEventListener('click', function(){
    FITNESS_METRICS.forEach(function(m){
      var sl = document.getElementById('v16-fit-'+m.key);
      if(sl){ sl.value = Math.round(m.max*0.5); }
      var vl = document.getElementById('v16-fit-val-'+m.key);
      if(vl) vl.textContent = Math.round(m.max*0.5);
    });
    drawFitnessRadar();
  });

  var ladderStart = document.getElementById('v16-ladder-start');
  if(ladderStart) ladderStart.addEventListener('click', startLadder);
  var ladderPunch = document.getElementById('v16-ladder-punch');
  if(ladderPunch) ladderPunch.addEventListener('click', punchLadder);

  var musicStart = document.getElementById('v16-music-start');
  if(musicStart) musicStart.addEventListener('click', startMusicWorkout);
  var musicPunch = document.getElementById('v16-music-punch');
  if(musicPunch) musicPunch.addEventListener('click', punchOnBeat);

  var defStart = document.getElementById('v16-def-start');
  if(defStart) defStart.addEventListener('click', startDefenseIQ);

  var quizStart = document.getElementById('v16-quiz-start');
  if(quizStart) quizStart.addEventListener('click', startQuizV16);

  // Render initial state
  drawTimingCanvas();
  drawFitnessRadar();
  renderFightAnalyses();
  renderLadderSteps();
  drawLadderCanvas();
  renderMusicTabs();
  drawMusicCanvas();
  renderPlanRounds();
  renderSavedPlans();
  renderFormTabs();
  renderFormCards();
  renderV16Ach();
  initV16Keyboard();
  checkV16Achievements();
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', buildV16);
} else {
  buildV16();
}

})();
