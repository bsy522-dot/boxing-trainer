// Boxing Trainer Pro v17_patch.js - NEXTERA+PRISM Auto Enhancement Module
// Punch Speed Radar Canvas, Shadow Boxing Choreographer Canvas 8routines,
// Body Composition Tracker Canvas BMI/BMR/BFP Line, Weight Class Encyclopedia 17types,
// Recovery Zone Timer Canvas 4phases, Ring IQ Strategy Quiz Canvas 12scenarios,
// Sparring Partner AI Profiles Canvas 8fighters 6-axis Radar, Fight Camp Journal Canvas 30days heatmap
// Quiz +15 (120->135), +12 Achievements (118->130), SFX 12, Keyboard +8
(function(){
'use strict';

var STORAGE_KEY = 'boxingTrainerData';
var V17KEY = 'boxingV17Patch';

function loadAppData(){
  try { var r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch(e){ return null; }
}
function loadV17(){
  try {
    var r = localStorage.getItem(V17KEY);
    if(!r) return defV17();
    var p = JSON.parse(r), d = defV17();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV17(); }
}
function saveV17(d){ try { localStorage.setItem(V17KEY, JSON.stringify(d)); } catch(e){} }
function defV17(){
  return {
    speedRadar: { bestSpeed: 0, sessions: [], avgSpeed: 0 },
    shadowChoreographer: { routinesDone: [], bestScore: 0, totalMoves: 0 },
    bodyComp: { entries: [], lastEntry: null },
    weightClass: { viewed: [], favorite: '' },
    recovery: { sessions: 0, totalTime: 0, lastPhase: '' },
    ringIQ: { score: 0, scenarios: [], bestStreak: 0 },
    sparringAI: { fought: [], wins: 0, losses: 0, draws: 0 },
    fightJournal: { entries: [], currentStreak: 0 },
    quizV17Scores: {},
    achievementsV17: {},
    featureUsage: {}
  };
}

var v17 = loadV17();

// ===== SFX ENGINE V17 =====
function playSFX17(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'speed_hit':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(1200,t);o.frequency.exponentialRampToValueAtTime(600,t+0.06);
        g.gain.setValueAtTime(0.15,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.08);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.08);break;
      case 'speed_miss':
        var buf=ctx.createBuffer(1,ctx.sampleRate*0.04,ctx.sampleRate);
        var d=buf.getChannelData(0);
        for(var i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.exp(-i/(d.length*0.15));
        var src=ctx.createBufferSource(),gn=ctx.createGain();
        src.buffer=buf;gn.gain.setValueAtTime(0.06,t);gn.gain.exponentialRampToValueAtTime(0.001,t+0.04);
        src.connect(gn).connect(ctx.destination);src.start(t);break;
      case 'shadow_move':
        var o2=ctx.createOscillator(),g2=ctx.createGain();
        o2.type='triangle';o2.frequency.setValueAtTime(440,t);o2.frequency.linearRampToValueAtTime(660,t+0.08);
        g2.gain.setValueAtTime(0.08,t);g2.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        o2.connect(g2).connect(ctx.destination);o2.start(t);o2.stop(t+0.1);break;
      case 'shadow_complete':
        [523,659,784,1047,1319].forEach(function(f,j){
          var o3=ctx.createOscillator(),g3=ctx.createGain();
          o3.type='sine';o3.frequency.value=f;
          g3.gain.setValueAtTime(0.06,t+j*0.08);g3.gain.exponentialRampToValueAtTime(0.001,t+j*0.08+0.15);
          o3.connect(g3).connect(ctx.destination);o3.start(t+j*0.08);o3.stop(t+j*0.08+0.15);
        });break;
      case 'body_log':
        var o4=ctx.createOscillator(),g4=ctx.createGain();
        o4.type='sine';o4.frequency.value=523;
        g4.gain.setValueAtTime(0.08,t);g4.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o4.connect(g4).connect(ctx.destination);o4.start(t);o4.stop(t+0.15);
        var o4b=ctx.createOscillator(),g4b=ctx.createGain();
        o4b.type='sine';o4b.frequency.value=659;
        g4b.gain.setValueAtTime(0.08,t+0.1);g4b.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o4b.connect(g4b).connect(ctx.destination);o4b.start(t+0.1);o4b.stop(t+0.25);break;
      case 'weight_view':
        var o5=ctx.createOscillator(),g5=ctx.createGain();
        o5.type='sawtooth';o5.frequency.setValueAtTime(220,t);o5.frequency.linearRampToValueAtTime(330,t+0.1);
        g5.gain.setValueAtTime(0.05,t);g5.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o5.connect(g5).connect(ctx.destination);o5.start(t);o5.stop(t+0.12);break;
      case 'recovery_phase':
        var o6=ctx.createOscillator(),g6=ctx.createGain();
        o6.type='sine';o6.frequency.value=396;
        g6.gain.setValueAtTime(0.1,t);g6.gain.linearRampToValueAtTime(0.001,t+0.8);
        o6.connect(g6).connect(ctx.destination);o6.start(t);o6.stop(t+0.8);break;
      case 'recovery_done':
        [396,528,660].forEach(function(f,j){
          var o7=ctx.createOscillator(),g7=ctx.createGain();
          o7.type='sine';o7.frequency.value=f;
          g7.gain.setValueAtTime(0.08,t+j*0.15);g7.gain.exponentialRampToValueAtTime(0.001,t+j*0.15+0.3);
          o7.connect(g7).connect(ctx.destination);o7.start(t+j*0.15);o7.stop(t+j*0.15+0.3);
        });break;
      case 'ringiq_correct':
        var o8=ctx.createOscillator(),g8=ctx.createGain();
        o8.type='triangle';o8.frequency.setValueAtTime(523,t);o8.frequency.linearRampToValueAtTime(784,t+0.1);
        g8.gain.setValueAtTime(0.1,t);g8.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o8.connect(g8).connect(ctx.destination);o8.start(t);o8.stop(t+0.15);break;
      case 'ringiq_wrong':
        var o9=ctx.createOscillator(),g9=ctx.createGain();
        o9.type='square';o9.frequency.setValueAtTime(200,t);o9.frequency.linearRampToValueAtTime(100,t+0.12);
        g9.gain.setValueAtTime(0.06,t);g9.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o9.connect(g9).connect(ctx.destination);o9.start(t);o9.stop(t+0.12);break;
      case 'spar_start':
        var buf2=ctx.createBuffer(1,ctx.sampleRate*0.1,ctx.sampleRate);
        var d2=buf2.getChannelData(0);
        for(var i2=0;i2<d2.length;i2++) d2[i2]=(Math.random()*2-1)*Math.exp(-i2/(d2.length*0.15));
        var src2=ctx.createBufferSource(),gn2=ctx.createGain();
        src2.buffer=buf2;gn2.gain.setValueAtTime(0.2,t);gn2.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        src2.connect(gn2).connect(ctx.destination);src2.start(t);
        var ob=ctx.createOscillator(),gb=ctx.createGain();
        ob.type='sine';ob.frequency.setValueAtTime(200,t);ob.frequency.exponentialRampToValueAtTime(80,t+0.15);
        gb.gain.setValueAtTime(0.12,t);gb.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        ob.connect(gb).connect(ctx.destination);ob.start(t);ob.stop(t+0.15);break;
      case 'journal_write':
        var oj=ctx.createOscillator(),gj=ctx.createGain();
        oj.type='sine';oj.frequency.value=880;
        gj.gain.setValueAtTime(0.06,t);gj.gain.exponentialRampToValueAtTime(0.001,t+0.08);
        oj.connect(gj).connect(ctx.destination);oj.start(t);oj.stop(t+0.08);break;
      case 'achieve_v17':
        [523,659,784,1047].forEach(function(f,j){
          var oa=ctx.createOscillator(),ga=ctx.createGain();
          oa.type='sine';oa.frequency.value=f;
          ga.gain.setValueAtTime(0.1,t+j*0.12);ga.gain.exponentialRampToValueAtTime(0.001,t+j*0.12+0.25);
          oa.connect(ga).connect(ctx.destination);oa.start(t+j*0.12);oa.stop(t+j*0.12+0.25);
        });break;
    }
  } catch(e){}
}

// ===== 1. PUNCH SPEED RADAR Canvas =====
var speedActive = false, speedTargets = [], speedScore = 0, speedTotal = 0, speedHits = 0;
var speedTimer = null, speedTimeLeft = 30;

function drawSpeedCanvas(){
  var c = document.getElementById('v17-speed-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var w = c.width, h = c.height;
  var dark = !document.body.hasAttribute('data-theme') || document.body.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = dark ? '#1a1a2e' : '#f0f0f3';
  ctx.fillRect(0,0,w,h);

  // Radar circles
  for(var r = 1; r <= 4; r++){
    ctx.beginPath();
    ctx.arc(w/2, h/2, r * 35, 0, Math.PI*2);
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  // Crosshair
  ctx.beginPath();
  ctx.moveTo(w/2, 20); ctx.lineTo(w/2, h-20);
  ctx.moveTo(20, h/2); ctx.lineTo(w-20, h/2);
  ctx.strokeStyle = dark ? 'rgba(255,68,68,0.15)' : 'rgba(255,68,68,0.1)';
  ctx.lineWidth = 1; ctx.stroke();

  if(!speedActive){
    ctx.fillStyle = dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
    ctx.font = '14px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('시작을 눌러 펀치 스피드를 측정하세요', w/2, h/2);
    return;
  }

  // Draw targets
  speedTargets.forEach(function(tgt){
    ctx.beginPath();
    ctx.arc(tgt.x, tgt.y, tgt.r, 0, Math.PI*2);
    var alpha = Math.max(0.2, 1 - (Date.now() - tgt.born) / 1500);
    ctx.fillStyle = tgt.hit ? 'rgba(34,197,94,0.6)' : 'rgba(255,68,68,' + alpha + ')';
    ctx.fill();
    ctx.strokeStyle = tgt.hit ? '#22c55e' : '#FF4444';
    ctx.lineWidth = 2; ctx.stroke();
    if(!tgt.hit){
      ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(tgt.type, tgt.x, tgt.y + 4);
    }
  });

  // HUD
  ctx.fillStyle = dark ? '#f0f0f0' : '#1a1a2e';
  ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('⚓ ' + speedHits + '/' + speedTotal, 12, 24);
  ctx.textAlign = 'right';
  ctx.fillText('⏱ ' + speedTimeLeft + 's', w - 12, 24);

  var pps = speedTotal > 0 ? (speedHits / Math.max(1, (30 - speedTimeLeft))).toFixed(1) : '0.0';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FF4444'; ctx.font = 'bold 20px sans-serif';
  ctx.fillText(pps + ' 펀치/초', w/2, h - 12);
}

function startSpeedDrill(){
  speedActive = true; speedTargets = []; speedScore = 0; speedTotal = 0; speedHits = 0; speedTimeLeft = 30;
  playSFX17('spar_start');
  spawnSpeedTarget();
  speedTimer = setInterval(function(){
    speedTimeLeft--;
    // Spawn new target every 0.8s
    if(speedTimeLeft > 0 && speedTimeLeft % 1 === 0) spawnSpeedTarget();
    // Remove expired targets
    speedTargets = speedTargets.filter(function(t){ return Date.now() - t.born < 1500 || t.hit; });
    drawSpeedCanvas();
    if(speedTimeLeft <= 0){
      clearInterval(speedTimer); speedActive = false;
      var pps = (speedHits / 30).toFixed(2);
      v17.speedRadar.sessions.push({date: new Date().toISOString(), hits: speedHits, total: speedTotal, pps: parseFloat(pps)});
      if(v17.speedRadar.sessions.length > 50) v17.speedRadar.sessions = v17.speedRadar.sessions.slice(-50);
      if(parseFloat(pps) > v17.speedRadar.bestSpeed) v17.speedRadar.bestSpeed = parseFloat(pps);
      v17.speedRadar.avgSpeed = v17.speedRadar.sessions.reduce(function(s,e){return s+e.pps;},0) / v17.speedRadar.sessions.length;
      saveV17(v17); checkV17Achievements(); drawSpeedCanvas();
      showV17Toast('펀치 스피드: ' + pps + ' 펀치/초 (' + speedHits + '/' + speedTotal + ')');
    }
  }, 1000);
}

var PUNCH_TYPES = ['JAB','CROSS','HOOK','UPPER'];
function spawnSpeedTarget(){
  var c = document.getElementById('v17-speed-canvas');
  if(!c) return;
  var margin = 40;
  var t = {
    x: margin + Math.random() * (c.width - margin*2),
    y: margin + Math.random() * (c.height - margin*2),
    r: 22 + Math.random() * 8,
    type: PUNCH_TYPES[Math.floor(Math.random()*4)],
    born: Date.now(),
    hit: false
  };
  speedTargets.push(t); speedTotal++;
}

function handleSpeedClick(e){
  if(!speedActive) return;
  var c = document.getElementById('v17-speed-canvas');
  if(!c) return;
  var rect = c.getBoundingClientRect();
  var mx = (e.clientX - rect.left) * (c.width / rect.width);
  var my = (e.clientY - rect.top) * (c.height / rect.height);
  for(var i = speedTargets.length - 1; i >= 0; i--){
    var t = speedTargets[i];
    if(!t.hit){
      var dx = mx - t.x, dy = my - t.y;
      if(dx*dx + dy*dy < t.r*t.r){
        t.hit = true; speedHits++; playSFX17('speed_hit');
        drawSpeedCanvas(); return;
      }
    }
  }
  playSFX17('speed_miss');
}

// ===== 2. SHADOW BOXING CHOREOGRAPHER Canvas =====
var SHADOW_ROUTINES = [
  {name:'기본 워밍업', level:'초급', moves:['JAB','JAB','CROSS','SLIP L','JAB','CROSS','HOOK','GUARD'], bpm:80, desc:'워밍업 기본동작. 천천히 정확하게.'},
  {name:'스피드 드릴', level:'초급', moves:['JAB','JAB','JAB','CROSS','JAB','JAB','CROSS','CROSS'], bpm:120, desc:'빠른 연타 드릴. 속도를 높이세요.'},
  {name:'콤보 파이터', level:'중급', moves:['JAB','CROSS','HOOK','UPPER','SLIP R','CROSS','HOOK','JAB'], bpm:100, desc:'다양한 콤비네이션 훈련.'},
  {name:'방어 마스터', level:'중급', moves:['GUARD','SLIP L','COUNTER JAB','GUARD','SLIP R','COUNTER CROSS','BOB','UPPER'], bpm:90, desc:'방어 + 카운터 훈련.'},
  {name:'파워 러쉬', level:'고급', moves:['CROSS','HOOK','UPPER','CROSS','HOOK','UPPER','JAB','CROSS'], bpm:130, desc:'가장 파워풀한 콤보 체인.'},
  {name:'필리쉘 시퀀스', level:'고급', moves:['SHOULDER ROLL','COUNTER CROSS','PULL BACK','JAB','HOOK','UPPER','BOB','CROSS'], bpm:100, desc:'필리 쉘 방어술.'},
  {name:'프레셔 파이터', level:'고급', moves:['JAB','JAB','CROSS','STEP IN','HOOK','UPPER','BODY HOOK','STEP OUT'], bpm:110, desc:'거리 조절 + 압박 콤보.'},
  {name:'챔피언 콤보', level:'마스터', moves:['JAB','CROSS','SLIP L','COUNTER HOOK','UPPER','STEP OUT','JAB','CROSS'], bpm:140, desc:'최고난이도 종합 훈련.'}
];

var shadowActive = false, shadowRoutineIdx = 0, shadowMoveIdx = 0, shadowScore = 0;
var shadowTimer = null;

function drawShadowCanvas(){
  var c = document.getElementById('v17-shadow-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var w = c.width, h = c.height;
  var dark = !document.body.hasAttribute('data-theme') || document.body.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = dark ? '#1a1a2e' : '#f0f0f3'; ctx.fillRect(0,0,w,h);

  var routine = SHADOW_ROUTINES[shadowRoutineIdx];
  if(!shadowActive){
    ctx.fillStyle = dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
    ctx.font = '14px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('루틴을 선택하고 시작을 누르세요', w/2, h/2);
    return;
  }

  // Progress bar
  var pct = shadowMoveIdx / routine.moves.length;
  ctx.fillStyle = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  ctx.fillRect(20, 16, w-40, 10);
  ctx.fillStyle = '#FF4444';
  ctx.fillRect(20, 16, (w-40)*pct, 10);

  // Current move display
  if(shadowMoveIdx < routine.moves.length){
    var move = routine.moves[shadowMoveIdx];
    ctx.fillStyle = '#FF4444'; ctx.font = 'bold 28px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(move, w/2, h/2 - 10);
    ctx.fillStyle = dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
    ctx.font = '13px sans-serif';
    ctx.fillText((shadowMoveIdx+1) + ' / ' + routine.moves.length, w/2, h/2 + 20);
    // Next move preview
    if(shadowMoveIdx + 1 < routine.moves.length){
      ctx.fillStyle = dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
      ctx.font = '12px sans-serif';
      ctx.fillText('다음: ' + routine.moves[shadowMoveIdx+1], w/2, h/2 + 42);
    }
  }

  // BPM indicator
  ctx.fillStyle = dark ? '#8a8a9e' : '#666'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText(routine.bpm + ' BPM', 12, h - 10);
  ctx.textAlign = 'right';
  ctx.fillText(routine.name, w - 12, h - 10);
}

function startShadowRoutine(){
  shadowActive = true; shadowMoveIdx = 0; shadowScore = 0;
  playSFX17('shadow_move');
  var routine = SHADOW_ROUTINES[shadowRoutineIdx];
  var interval = 60000 / routine.bpm;
  drawShadowCanvas();
  shadowTimer = setInterval(function(){
    shadowMoveIdx++;
    playSFX17('shadow_move');
    drawShadowCanvas();
    if(shadowMoveIdx >= routine.moves.length){
      clearInterval(shadowTimer); shadowActive = false;
      playSFX17('shadow_complete');
      v17.shadowChoreographer.totalMoves += routine.moves.length;
      if(!v17.shadowChoreographer.routinesDone.includes(routine.name)){
        v17.shadowChoreographer.routinesDone.push(routine.name);
      }
      saveV17(v17); checkV17Achievements(); drawShadowCanvas();
      showV17Toast('루틴 완료: ' + routine.name + ' (' + routine.moves.length + '동작)');
    }
  }, interval);
}

// ===== 3. BODY COMPOSITION TRACKER Canvas =====
function drawBodyCompCanvas(){
  var c = document.getElementById('v17-body-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var w = c.width, h = c.height;
  var dark = !document.body.hasAttribute('data-theme') || document.body.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = dark ? '#1a1a2e' : '#f0f0f3'; ctx.fillRect(0,0,w,h);

  var entries = v17.bodyComp.entries.slice(-14);
  if(entries.length < 2){
    ctx.fillStyle = dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
    ctx.font = '13px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('측정값을 2회 이상 기록하면 추이 그래프가 표시됩니다', w/2, h/2);
    return;
  }

  var pad = {top:30, right:20, bottom:30, left:45};
  var cw = w - pad.left - pad.right, ch = h - pad.top - pad.bottom;

  // Extract data
  var weights = entries.map(function(e){return e.weight;});
  var bmis = entries.map(function(e){return e.bmi;});
  var minW = Math.min.apply(null, weights) - 2, maxW = Math.max.apply(null, weights) + 2;
  var minB = Math.min.apply(null, bmis) - 1, maxB = Math.max.apply(null, bmis) + 1;

  // Grid
  ctx.strokeStyle = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 1;
  for(var i = 0; i <= 4; i++){
    var y = pad.top + (ch / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
  }

  // Weight line (red)
  ctx.beginPath();
  ctx.strokeStyle = '#FF4444'; ctx.lineWidth = 2.5;
  entries.forEach(function(e, idx){
    var x = pad.left + (idx / (entries.length-1)) * cw;
    var y = pad.top + (1 - (e.weight - minW) / (maxW - minW)) * ch;
    if(idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }); ctx.stroke();

  // BMI line (blue)
  ctx.beginPath();
  ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
  entries.forEach(function(e, idx){
    var x = pad.left + (idx / (entries.length-1)) * cw;
    var y = pad.top + (1 - (e.bmi - minB) / (maxB - minB)) * ch;
    if(idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }); ctx.stroke();

  // Dots
  entries.forEach(function(e, idx){
    var x = pad.left + (idx / (entries.length-1)) * cw;
    var yw = pad.top + (1 - (e.weight - minW) / (maxW - minW)) * ch;
    ctx.beginPath(); ctx.arc(x, yw, 3, 0, Math.PI*2);
    ctx.fillStyle = '#FF4444'; ctx.fill();
  });

  // Labels
  ctx.fillStyle = dark ? '#8a8a9e' : '#666'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText(maxW.toFixed(0) + 'kg', pad.left - 4, pad.top + 4);
  ctx.fillText(minW.toFixed(0) + 'kg', pad.left - 4, h - pad.bottom + 4);

  // Legend
  ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
  ctx.fillStyle = '#FF4444'; ctx.fillText('● 체중', 12, 16);
  ctx.fillStyle = '#3b82f6'; ctx.fillText('● BMI', 70, 16);
}

function saveBodyEntry(){
  var wt = parseFloat((document.getElementById('v17-body-weight') || {}).value);
  var ht = parseFloat((document.getElementById('v17-body-height') || {}).value);
  if(!wt || !ht || wt < 30 || wt > 200 || ht < 100 || ht > 230) return;
  var bmi = wt / ((ht/100) * (ht/100));
  var bmr = 88.362 + 13.397*wt + 4.799*ht - 5.677*25;
  var entry = {date: new Date().toISOString(), weight: wt, height: ht, bmi: parseFloat(bmi.toFixed(1)), bmr: Math.round(bmr)};
  v17.bodyComp.entries.push(entry);
  if(v17.bodyComp.entries.length > 100) v17.bodyComp.entries = v17.bodyComp.entries.slice(-100);
  v17.bodyComp.lastEntry = entry;
  saveV17(v17); playSFX17('body_log');
  drawBodyCompCanvas(); checkV17Achievements();
  showV17Toast('BMI: ' + bmi.toFixed(1) + ' | BMR: ' + Math.round(bmr) + 'kcal');
}

// ===== 4. WEIGHT CLASS ENCYCLOPEDIA =====
var WEIGHT_CLASSES = [
  {name:'미니플라이', nameEn:'Minimumweight', max:47.627, belt:'플라이급', desc:'47.6kg 이하. 가장 가벼운 체급.'},
  {name:'라이트플라이', nameEn:'Light Flyweight', max:48.988, belt:'플라이급', desc:'49kg 이하. 스피드와 민첩성이 강점.'},
  {name:'플라이', nameEn:'Flyweight', max:50.802, belt:'플라이급', desc:'50.8kg. 마니 파키아오, 니카라굴 로마감찰레스 등.'},
  {name:'슈퍼플라이', nameEn:'Super Flyweight', max:52.163, belt:'플라이급', desc:'52.2kg. 한국 복서들이 강세한 체급.'},
  {name:'밴탐', nameEn:'Bantamweight', max:53.525, belt:'밴탐급', desc:'53.5kg. 테크니컬하고 빠른 펀치.'},
  {name:'슈퍼밴탐', nameEn:'Super Bantamweight', max:55.338, belt:'밴탐급', desc:'55.3kg. 파워와 스피드의 균형.'},
  {name:'페더', nameEn:'Featherweight', max:57.153, belt:'페더급', desc:'57.2kg. 마니 파키아오 전성기.'},
  {name:'슈퍼페더', nameEn:'Super Featherweight', max:58.967, belt:'페더급', desc:'59kg. 바실 로메로 체급.'},
  {name:'라이트', nameEn:'Lightweight', max:61.235, belt:'라이트급', desc:'61.2kg. 역대 최고의 기술전.'},
  {name:'슈퍼라이트', nameEn:'Super Lightweight', max:63.503, belt:'라이트급', desc:'63.5kg. 매우 경쟁 치열한 체급.'},
  {name:'웰터', nameEn:'Welterweight', max:66.678, belt:'웰터급', desc:'66.7kg. 메이웨더/파키아오 전설의 체급.'},
  {name:'슈퍼웰터', nameEn:'Super Welterweight', max:69.853, belt:'웰터급', desc:'69.9kg. 카네로 알바레즈 체급.'},
  {name:'미들', nameEn:'Middleweight', max:72.574, belt:'미들급', desc:'72.6kg. 미들급은 복싱의 꽃.'},
  {name:'슈퍼미들', nameEn:'Super Middleweight', max:76.204, belt:'미들급', desc:'76.2kg. 파워와 기술의 조화.'},
  {name:'라이트헤비', nameEn:'Light Heavyweight', max:79.378, belt:'헤비급', desc:'79.4kg. 스피드와 파워를 모두 갖춤.'},
  {name:'크루저', nameEn:'Cruiserweight', max:90.719, belt:'헤비급', desc:'90.7kg. 에마누엘 스티워드 체급.'},
  {name:'헤비웨이트', nameEn:'Heavyweight', max:999, belt:'헤비급', desc:'무제한. 타이슨, 알리, 레너스 루이스 등 전설의 체급.'}
];

function renderWeightClasses(){
  var wrap = document.getElementById('v17-weight-list');
  if(!wrap) return;
  wrap.innerHTML = '';
  WEIGHT_CLASSES.forEach(function(wc, idx){
    var card = document.createElement('div');
    card.style.cssText = 'padding:12px;background:var(--surface);border:1px solid var(--glass-border);border-radius:10px;cursor:pointer;transition:all 0.2s;';
    card.innerHTML = '<div style="font-weight:700;font-size:13px;color:var(--accent)">' + wc.name + '</div>' +
      '<div style="font-size:10px;color:var(--text-dim)">' + wc.nameEn + ' | ' + (wc.max < 999 ? wc.max + 'kg' : '무제한') + '</div>' +
      '<div style="font-size:10px;color:var(--text-muted);margin-top:3px">' + wc.desc + '</div>';
    card.addEventListener('click', function(){
      if(!v17.weightClass.viewed.includes(wc.name)) v17.weightClass.viewed.push(wc.name);
      saveV17(v17); playSFX17('weight_view'); checkV17Achievements();
    });
    wrap.appendChild(card);
  });
}

// ===== 5. RECOVERY ZONE TIMER Canvas =====
var RECOVERY_PHASES = [
  {name:'액티브 리커버리', duration:120, desc:'가벼운 스트레칭과 웄직임', color:'#22c55e'},
  {name:'수분 보충', duration:60, desc:'물을 천천히 마시며 호흡', color:'#3b82f6'},
  {name:'딥 스트레칭', duration:180, desc:'근육 이완을 위한 심취 스트레칭', color:'#a855f7'},
  {name:'호흡 명상', duration:120, desc:'눈을 감고 깊은 호흡을 반복', color:'#f97316'}
];
var recoveryActive = false, recoveryPhaseIdx = 0, recoveryTimeLeft = 0, recoveryTimer = null;

function drawRecoveryCanvas(){
  var c = document.getElementById('v17-recovery-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var w = c.width, h = c.height;
  var dark = !document.body.hasAttribute('data-theme') || document.body.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = dark ? '#1a1a2e' : '#f0f0f3'; ctx.fillRect(0,0,w,h);

  if(!recoveryActive){
    // Show 4 phases preview
    ctx.fillStyle = dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
    ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('회복 4단계 타이머', w/2, 24);
    RECOVERY_PHASES.forEach(function(p, i){
      var y = 44 + i * 36;
      ctx.fillStyle = p.color; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText((i+1) + '. ' + p.name, 20, y);
      ctx.fillStyle = dark ? '#8a8a9e' : '#666'; ctx.font = '10px sans-serif';
      ctx.fillText(p.duration + '초 - ' + p.desc, 20, y + 14);
    });
    return;
  }

  var phase = RECOVERY_PHASES[recoveryPhaseIdx];
  var pct = recoveryTimeLeft / phase.duration;

  // Circle progress
  var cx = w/2, cy = h/2 - 10, radius = 55;
  ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI*2);
  ctx.strokeStyle = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 10; ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI/2, -Math.PI/2 + Math.PI*2*pct);
  ctx.strokeStyle = phase.color; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.stroke();
  ctx.lineCap = 'butt';

  // Time text
  var min = Math.floor(recoveryTimeLeft / 60), sec = recoveryTimeLeft % 60;
  ctx.fillStyle = phase.color; ctx.font = 'bold 28px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText((min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec, cx, cy + 8);

  // Phase name
  ctx.fillStyle = dark ? '#f0f0f0' : '#1a1a2e'; ctx.font = 'bold 13px sans-serif';
  ctx.fillText(phase.name, cx, cy + radius + 28);

  // Phase indicators
  ctx.font = '10px sans-serif';
  RECOVERY_PHASES.forEach(function(p, i){
    var x = w/2 - 60 + i * 40;
    ctx.fillStyle = i === recoveryPhaseIdx ? p.color : (dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)');
    ctx.beginPath(); ctx.arc(x, h - 16, 5, 0, Math.PI*2); ctx.fill();
  });
}

function startRecovery(){
  recoveryActive = true; recoveryPhaseIdx = 0;
  recoveryTimeLeft = RECOVERY_PHASES[0].duration;
  playSFX17('recovery_phase');
  drawRecoveryCanvas();
  recoveryTimer = setInterval(function(){
    recoveryTimeLeft--;
    if(recoveryTimeLeft <= 0){
      recoveryPhaseIdx++;
      if(recoveryPhaseIdx >= RECOVERY_PHASES.length){
        clearInterval(recoveryTimer); recoveryActive = false;
        playSFX17('recovery_done');
        v17.recovery.sessions++;
        var total = RECOVERY_PHASES.reduce(function(s,p){return s+p.duration;},0);
        v17.recovery.totalTime += total;
        saveV17(v17); checkV17Achievements(); drawRecoveryCanvas();
        showV17Toast('회복 완료! 총 ' + Math.round(total/60) + '분');
        return;
      }
      recoveryTimeLeft = RECOVERY_PHASES[recoveryPhaseIdx].duration;
      playSFX17('recovery_phase');
    }
    drawRecoveryCanvas();
  }, 1000);
}

// ===== 6. RING IQ STRATEGY QUIZ Canvas =====
var RING_SCENARIOS = [
  {q:'상대가 전진하며 압박할 때 가장 효과적인 방법은?', opts:['사이드 스텝으로 앵글 잡기','뒤로 나가며 방어','클린치로 붙잡기','헤드무브로 피하기'], ans:0},
  {q:'상대가 있으며 가드가 낮아졌을 때 최선의 공격은?', opts:['오른손 스트레이트','더블 잡','바디 솔 형','레프트 훅'], ans:2},
  {q:'파이트 중반 상대의 체력을 까는 전략은?', opts:['계속 헤드 헌팅','클린치와 바디샷 반복','거리 유지하며 잡만 던지기','무작정 러쉬'], ans:1},
  {q:'라운드 후반 판정에서 뒤지고 있을 때는?', opts:['보수적으로 버티기','공격적으로 포인트 쌓기','클린치로 시간 끌기','펌치가 잘 보이도록 신나게 던지기'], ans:1},
  {q:'카운터 펀치의 핵심 원칙은?', opts:['가능한 세게 때리기','상대 펀치를 피한 직후 즉시 반격','항상 훅으로 반격','방어 후 기다리기'], ans:1},
  {q:'사우스포(왼손잡이) 상대에게 효과적인 전략은?', opts:['반시계방향 무브먼트','오른손 잡 위주','왼손으로 리드','오른발을 상대 바깥으로 배치'], ans:3},
  {q:'테마 업 파이터 상대의 빈틈을 찾는 방법은?', opts:['머리를 낮춰 들어가기','잡을 던져 반응 정찰','엉청난 파워 펀치로 도박','바로 클린치하기'], ans:1},
  {q:'로프 위에서 빠져나오는 가장 좋은 방법은?', opts:['무작정 펀치 난사','했웅/어퍼캿으로 공간 만들기','함부로 버티기','뒤로 한발 물러나기'], ans:1},
  {q:'체력이 부족한 상황에서 판정승을 위한 전략은?', opts:['클린치 반복','잡 위주로 안전하게 포인트 쌓기','풀 파워로 KO 시도','상대 도발'], ans:1},
  {q:'컨디션이 좋을 때 조기 KO를 노리는 방법은?', opts:['무작정 오버핸드','보디샷으로 가드 낮춘 후 헤드 어퍼캿','거리 유지하며 기다리기','단발 펀치만 던지기'], ans:1},
  {q:'방어적 상대를 공략하는 핸심 전술은?', opts:['펀치 반복으로 지치게 하기','페인트와 앵글 체인지로 공간 창출','클린치로 붙잡기','뒤로 민 후 도발'], ans:1},
  {q:'포커스패드 훈련에서 가장 중요한 것은?', opts:['최대한 세게 때리기','정확한 폼 + 처음으로 돌아오는 습관','최대한 빨리 때리기','한 손으로만 훈련'], ans:1}
];

var ringIQIdx = 0, ringIQScore = 0, ringIQStreak = 0, ringIQActive = false;

function drawRingIQCanvas(){
  var c = document.getElementById('v17-ringiq-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var w = c.width, h = c.height;
  var dark = !document.body.hasAttribute('data-theme') || document.body.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = dark ? '#1a1a2e' : '#f0f0f3'; ctx.fillRect(0,0,w,h);

  if(!ringIQActive){
    ctx.fillStyle = dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
    ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Ring IQ: ' + v17.ringIQ.score + '점', w/2, h/2 - 10);
    ctx.font = '12px sans-serif'; ctx.fillStyle = dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)';
    ctx.fillText('시작을 눌러 전략 퀴즈를 풀어보세요', w/2, h/2 + 14);
    return;
  }

  var sc = RING_SCENARIOS[ringIQIdx];
  ctx.fillStyle = dark ? '#f0f0f0' : '#1a1a2e'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  var lines = wrapText(ctx, sc.q, w - 40);
  lines.forEach(function(line, i){ ctx.fillText(line, w/2, 28 + i*18); });

  // Progress
  ctx.fillStyle = dark ? '#8a8a9e' : '#666'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText((ringIQIdx+1) + '/' + RING_SCENARIOS.length, w-12, h-8);
  ctx.textAlign = 'left';
  ctx.fillText('점수: ' + ringIQScore, 12, h-8);
}

function wrapText(ctx, text, maxWidth){
  var words = text.split(''); var lines = []; var currentLine = '';
  for(var i = 0; i < words.length; i++){
    var testLine = currentLine + words[i];
    if(ctx.measureText(testLine).width > maxWidth && currentLine.length > 0){
      lines.push(currentLine); currentLine = words[i];
    } else { currentLine = testLine; }
  }
  if(currentLine) lines.push(currentLine);
  return lines;
}

function renderRingIQOptions(){
  var wrap = document.getElementById('v17-ringiq-opts');
  if(!wrap || !ringIQActive) { if(wrap) wrap.innerHTML = ''; return; }
  wrap.innerHTML = '';
  var sc = RING_SCENARIOS[ringIQIdx];
  sc.opts.forEach(function(opt, idx){
    var btn = document.createElement('button');
    btn.style.cssText = 'display:block;width:100%;padding:10px 12px;margin-bottom:6px;background:var(--surface);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);font-size:12px;cursor:pointer;text-align:left;transition:all 0.2s;';
    btn.textContent = (idx+1) + '. ' + opt;
    btn.addEventListener('click', function(){
      if(idx === sc.ans){
        ringIQScore += 10; ringIQStreak++;
        playSFX17('ringiq_correct');
        btn.style.borderColor = '#22c55e'; btn.style.background = 'rgba(34,197,94,0.1)';
      } else {
        ringIQStreak = 0;
        playSFX17('ringiq_wrong');
        btn.style.borderColor = '#FF4444'; btn.style.background = 'rgba(255,68,68,0.1)';
        // Highlight correct
        var btns = wrap.querySelectorAll('button');
        if(btns[sc.ans]) { btns[sc.ans].style.borderColor = '#22c55e'; btns[sc.ans].style.background = 'rgba(34,197,94,0.1)'; }
      }
      // Disable all buttons
      var allBtns = wrap.querySelectorAll('button');
      allBtns.forEach(function(b){ b.disabled = true; b.style.cursor = 'default'; });

      setTimeout(function(){
        ringIQIdx++;
        if(ringIQIdx >= RING_SCENARIOS.length){
          ringIQActive = false;
          v17.ringIQ.score = Math.max(v17.ringIQ.score, ringIQScore);
          if(ringIQStreak > v17.ringIQ.bestStreak) v17.ringIQ.bestStreak = ringIQStreak;
          saveV17(v17); checkV17Achievements();
          drawRingIQCanvas(); renderRingIQOptions();
          showV17Toast('Ring IQ 점수: ' + ringIQScore + '/' + (RING_SCENARIOS.length*10));
        } else {
          drawRingIQCanvas(); renderRingIQOptions();
        }
      }, 1200);
    });
    wrap.appendChild(btn);
  });
}

function startRingIQ(){
  ringIQActive = true; ringIQIdx = 0; ringIQScore = 0; ringIQStreak = 0;
  playSFX17('spar_start');
  drawRingIQCanvas(); renderRingIQOptions();
}

// ===== 7. SPARRING PARTNER AI Canvas 6-axis Radar =====
var AI_FIGHTERS = [
  {name:'비니 방어형', style:'방어형', stats:{speed:5,power:3,defense:9,stamina:7,technique:6,iq:7}, desc:'방어 위주의 안전한 파이터'},
  {name:'막스 파워형', style:'파워형', stats:{speed:4,power:9,defense:4,stamina:6,technique:5,iq:4}, desc:'한방으로 승부를 갈라니다'},
  {name:'레아 스피드형', style:'스피드형', stats:{speed:9,power:4,defense:5,stamina:8,technique:7,iq:6}, desc:'빠른 펀치와 발놓림'},
  {name:'키드 밸런스형', style:'밸런스형', stats:{speed:7,power:6,defense:7,stamina:7,technique:8,iq:8}, desc:'모든 면에서 균형 잡힌'},
  {name:'록키 체력형', style:'체력형', stats:{speed:5,power:7,defense:6,stamina:9,technique:5,iq:5}, desc:'탕크처럼 지치지 않는다'},
  {name:'닥터 테크니선', style:'기술형', stats:{speed:7,power:5,defense:6,stamina:6,technique:9,iq:8}, desc:'정확한 테크닉과 전술'},
  {name:'고스트 카운터확', style:'카운터형', stats:{speed:6,power:8,defense:8,stamina:5,technique:7,iq:9}, desc:'카운터 펀처의 달인'},
  {name:'타이튼 앞박형', style:'압박형', stats:{speed:8,power:8,defense:3,stamina:7,technique:6,iq:5}, desc:'공격적인 압박으로 몰아붙인다'}
];

var selectedFighter = 0;

function drawSparRadar(){
  var c = document.getElementById('v17-spar-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var w = c.width, h = c.height;
  var dark = !document.body.hasAttribute('data-theme') || document.body.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = dark ? '#1a1a2e' : '#f0f0f3'; ctx.fillRect(0,0,w,h);

  var fighter = AI_FIGHTERS[selectedFighter];
  var cx = w/2, cy = h/2, maxR = 65;
  var labels = ['스피드','파워','방어','체력','기술','IQ'];
  var vals = [fighter.stats.speed, fighter.stats.power, fighter.stats.defense, fighter.stats.stamina, fighter.stats.technique, fighter.stats.iq];
  var angles = labels.map(function(_,i){ return (Math.PI*2*i/6) - Math.PI/2; });

  // Grid
  for(var r = 2; r <= 10; r += 2){
    ctx.beginPath();
    angles.forEach(function(a, i){
      var x = cx + Math.cos(a) * (maxR * r / 10);
      var y = cy + Math.sin(a) * (maxR * r / 10);
      if(i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1; ctx.stroke();
  }

  // Axes
  angles.forEach(function(a){
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a)*maxR, cy + Math.sin(a)*maxR);
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    ctx.stroke();
  });

  // Data polygon
  ctx.beginPath();
  vals.forEach(function(v, i){
    var x = cx + Math.cos(angles[i]) * (maxR * v / 10);
    var y = cy + Math.sin(angles[i]) * (maxR * v / 10);
    if(i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,68,68,0.2)'; ctx.fill();
  ctx.strokeStyle = '#FF4444'; ctx.lineWidth = 2; ctx.stroke();

  // Dots + Labels
  vals.forEach(function(v, i){
    var x = cx + Math.cos(angles[i]) * (maxR * v / 10);
    var y = cy + Math.sin(angles[i]) * (maxR * v / 10);
    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2);
    ctx.fillStyle = '#FF4444'; ctx.fill();

    var lx = cx + Math.cos(angles[i]) * (maxR + 16);
    var ly = cy + Math.sin(angles[i]) * (maxR + 16);
    ctx.fillStyle = dark ? '#8a8a9e' : '#666'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(labels[i], lx, ly);
  });

  // Name
  ctx.fillStyle = '#FF4444'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(fighter.name + ' (' + fighter.style + ')', w/2, 6);
}

function renderFighterTabs(){
  var wrap = document.getElementById('v17-fighter-tabs');
  if(!wrap) return;
  wrap.innerHTML = '';
  AI_FIGHTERS.forEach(function(f, idx){
    var btn = document.createElement('button');
    btn.style.cssText = 'padding:6px 10px;border-radius:8px;border:1px solid var(--glass-border);background:' + (idx === selectedFighter ? 'var(--accent-soft)' : 'var(--surface)') + ';color:' + (idx === selectedFighter ? 'var(--accent)' : 'var(--text-dim)') + ';font-size:10px;cursor:pointer;white-space:nowrap;';
    btn.textContent = f.name;
    btn.addEventListener('click', function(){
      selectedFighter = idx;
      if(!v17.sparringAI.fought.includes(f.name)) v17.sparringAI.fought.push(f.name);
      saveV17(v17); playSFX17('spar_start');
      renderFighterTabs(); drawSparRadar(); checkV17Achievements();
    });
    wrap.appendChild(btn);
  });
}

// ===== 8. FIGHT CAMP JOURNAL Canvas 30-day heatmap =====
function drawJournalCanvas(){
  var c = document.getElementById('v17-journal-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var w = c.width, h = c.height;
  var dark = !document.body.hasAttribute('data-theme') || document.body.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = dark ? '#1a1a2e' : '#f0f0f3'; ctx.fillRect(0,0,w,h);

  var entries = v17.fightJournal.entries;
  var today = new Date();
  var cellSize = 16, gap = 3, cols = 7, rows = 5;
  var startX = (w - (cellSize+gap)*cols) / 2;
  var startY = 30;

  // Title
  ctx.fillStyle = dark ? '#f0f0f0' : '#1a1a2e'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('최근 30일 훈련 일지', w/2, 16);

  // Day labels
  var dayLabels = ['일','월','화','수','목','금','토'];
  dayLabels.forEach(function(d, i){
    ctx.fillStyle = dark ? '#5a5a6e' : '#999'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(d, startX + i*(cellSize+gap) + cellSize/2, startY - 4);
  });

  // 30 days grid
  for(var day = 29; day >= 0; day--){
    var d = new Date(today);
    d.setDate(d.getDate() - day);
    var dateStr = d.toISOString().slice(0,10);
    var entry = entries.find(function(e){ return e.date === dateStr; });
    var idx = 29 - day;
    var col = idx % cols, row = Math.floor(idx / cols);
    var x = startX + col * (cellSize+gap), y = startY + row * (cellSize+gap);

    var intensity = 0;
    if(entry){
      if(entry.intensity <= 3) intensity = 1;
      else if(entry.intensity <= 6) intensity = 2;
      else if(entry.intensity <= 8) intensity = 3;
      else intensity = 4;
    }
    var colors = ['rgba(255,68,68,0.05)','rgba(255,68,68,0.2)','rgba(255,68,68,0.4)','rgba(255,68,68,0.6)','rgba(255,68,68,0.85)'];
    ctx.fillStyle = colors[intensity];
    ctx.fillRect(x, y, cellSize, cellSize);
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
    ctx.strokeRect(x, y, cellSize, cellSize);
  }

  // Stats
  var totalEntries = entries.length;
  var streak = v17.fightJournal.currentStreak;
  ctx.fillStyle = dark ? '#8a8a9e' : '#666'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('총 ' + totalEntries + '일 기록', 12, h - 8);
  ctx.textAlign = 'right';
  ctx.fillText('연속 ' + streak + '일', w - 12, h - 8);
}

function saveJournalEntry(){
  var mood = (document.getElementById('v17-journal-mood') || {}).value || '보통';
  var intensity = parseInt((document.getElementById('v17-journal-intensity') || {}).value) || 5;
  var note = (document.getElementById('v17-journal-note') || {}).value || '';
  var dateStr = new Date().toISOString().slice(0,10);

  var existing = v17.fightJournal.entries.findIndex(function(e){ return e.date === dateStr; });
  var entry = {date: dateStr, mood: mood, intensity: intensity, note: note.slice(0,100)};
  if(existing >= 0) v17.fightJournal.entries[existing] = entry;
  else v17.fightJournal.entries.push(entry);

  if(v17.fightJournal.entries.length > 365) v17.fightJournal.entries = v17.fightJournal.entries.slice(-365);

  // Calculate streak
  var streak = 0;
  var d = new Date();
  while(true){
    var ds = d.toISOString().slice(0,10);
    if(v17.fightJournal.entries.some(function(e){ return e.date === ds; })){ streak++; d.setDate(d.getDate()-1); }
    else break;
  }
  v17.fightJournal.currentStreak = streak;

  saveV17(v17); playSFX17('journal_write');
  drawJournalCanvas(); checkV17Achievements();
  showV17Toast('훈련 일지 저장 완료 (' + mood + ', 강도 ' + intensity + ')');
}

// ===== QUIZ V17 (+15 questions) =====
var QUIZ_V17 = [
  {q:'복싱에서 펀치 스피드는 주로 어떻게 측정하나요?', opts:['초당 펀치 수','무게','바람 속도','눈 깜빡임'], ans:0},
  {q:'섀도 복싱의 주요 목적은?', opts:['체력 훈련','폼 연습과 전략 연마','근력 강화','슠판 채점 연습'], ans:1},
  {q:'BMI가 25 이상이면 어떤 범주인가요?', opts:['저체중','정상','과체중','비만'], ans:2},
  {q:'WBC, WBA, IBF, WBO는 무엇인가요?', opts:['복싱 체급 이름','복싱 패더레이션(협회)','복싱 대회 이름','복싱 기술 분류'], ans:1},
  {q:'헤비웨이트 체급의 체중 제한은?', opts:['90kg','무제한','80kg','100kg'], ans:1},
  {q:'카운터 펀치에서 가장 중요한 요소는?', opts:['펀치 파워','타이밍','거리','기합'], ans:1},
  {q:'회복 훈련에서 액티브 리커버리란?', opts:['완전한 휴식','가벼운 움직임으로 회복','수면','사우나'], ans:1},
  {q:'Ring IQ가 높은 파이터의 특징은?', opts:['무조건 공격','상황 판단과 전략 수립 능력','최대 파워','빠른 발'], ans:1},
  {q:'필리 쉘 방어술을 사용한 대표적인 복서는?', opts:['마이크 타이슨','플로이드 메이웨더','매니 파키아오','무하마드 알리'], ans:1},
  {q:'미들급의 체중 제한은 약 몇 kg인가요?', opts:['60kg','72.6kg','80kg','85kg'], ans:1},
  {q:'바디샷의 주요 목적은?', opts:['머리를 맞추기','상대의 체력을 븼고 가드를 낮추기','점수 따기','기삵 공격'], ans:1},
  {q:'스파링 파트너 AI에서 6축 레이더의 축이 아닌 것은?', opts:['스피드','방어','키','기술'], ans:2},
  {q:'엉청난 펀치를 맞았을 때 처음으로 해야 할 것은?', opts:['바로 반격','클린치','균형 회복 후 가드를 올리기','뒤로 도망'], ans:2},
  {q:'훈련 일지 작성의 주요 이점은?', opts:['법적 의무','훈련 패턴 분석과 발전 추적','사진 저장','없음'], ans:1},
  {q:'복싱에서 포커스패드 훈련 시 가장 중요한 것은?', opts:['최대 파워','폼과 처음으로 돌아오는 습관','속도','많이 때리기'], ans:1}
];

var quizV17Active = false, quizV17Idx = 0, quizV17Score = 0;

function startQuizV17(){
  quizV17Active = true; quizV17Idx = 0; quizV17Score = 0;
  playSFX17('spar_start');
  renderQuizV17();
}

function renderQuizV17(){
  var wrap = document.getElementById('v17-quiz-area');
  if(!wrap) return;
  if(!quizV17Active || quizV17Idx >= QUIZ_V17.length){
    if(quizV17Active){
      quizV17Active = false;
      var grade = quizV17Score >= 140 ? 'S' : quizV17Score >= 120 ? 'A' : quizV17Score >= 90 ? 'B' : quizV17Score >= 60 ? 'C' : 'D';
      v17.quizV17Scores[new Date().toISOString()] = quizV17Score;
      saveV17(v17); checkV17Achievements();
      wrap.innerHTML = '<div style="text-align:center;padding:20px"><div style="font-size:28px;font-weight:900;color:var(--accent)">' + grade + '</div><div style="font-size:14px;margin-top:6px">' + quizV17Score + ' / ' + (QUIZ_V17.length*10) + '점</div></div>';
      return;
    }
    wrap.innerHTML = '<div style="text-align:center;color:var(--text-dim);font-size:13px;padding:16px">시작 버튼을 눌러주세요</div>';
    return;
  }
  var q = QUIZ_V17[quizV17Idx];
  var html = '<div style="font-size:13px;font-weight:700;margin-bottom:10px">' + (quizV17Idx+1) + '. ' + q.q + '</div>';
  q.opts.forEach(function(opt, oi){
    html += '<button class="v17-quiz-opt" data-idx="' + oi + '" style="display:block;width:100%;padding:8px 12px;margin-bottom:5px;background:var(--surface);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);font-size:12px;cursor:pointer;text-align:left">' + opt + '</button>';
  });
  html += '<div style="font-size:10px;color:var(--text-muted);margin-top:6px">' + (quizV17Idx+1) + '/' + QUIZ_V17.length + ' | 점수: ' + quizV17Score + '</div>';
  wrap.innerHTML = html;
  wrap.querySelectorAll('.v17-quiz-opt').forEach(function(btn){
    btn.addEventListener('click', function(){
      var oi = parseInt(this.getAttribute('data-idx'));
      if(oi === q.ans){ quizV17Score += 10; playSFX17('ringiq_correct'); this.style.borderColor = '#22c55e'; }
      else { playSFX17('ringiq_wrong'); this.style.borderColor = '#FF4444'; }
      wrap.querySelectorAll('.v17-quiz-opt').forEach(function(b){ b.disabled = true; });
      if(q.ans !== oi){
        var correct = wrap.querySelectorAll('.v17-quiz-opt')[q.ans];
        if(correct) correct.style.borderColor = '#22c55e';
      }
      setTimeout(function(){ quizV17Idx++; renderQuizV17(); }, 1000);
    });
  });
}

// ===== ACHIEVEMENTS V17 (+12) =====
var ACHV17 = [
  {id:'speed_first', name:'스피드 측정', icon:'⚡', desc:'펀치 스피드 첫 측정', check:function(){ return v17.speedRadar.sessions.length >= 1; }},
  {id:'speed_fast', name:'비뉴스선수', icon:'🚀', desc:'초당 2펀치 이상 달성', check:function(){ return v17.speedRadar.bestSpeed >= 2; }},
  {id:'shadow_3', name:'섀도 3종', icon:'👥', desc:'섀도복싱 3가지 루틴 완료', check:function(){ return v17.shadowChoreographer.routinesDone.length >= 3; }},
  {id:'shadow_all', name:'섀도 마스터', icon:'🌟', desc:'모든 섀도 루틴 완료', check:function(){ return v17.shadowChoreographer.routinesDone.length >= 8; }},
  {id:'body_5', name:'체성분 5회', icon:'📊', desc:'체성분 5회 기록', check:function(){ return v17.bodyComp.entries.length >= 5; }},
  {id:'weight_10', name:'체급 박사', icon:'🏅', desc:'체급 10개 이상 열람', check:function(){ return v17.weightClass.viewed.length >= 10; }},
  {id:'recovery_3', name:'회복 3회', icon:'🙏', desc:'회복 타이머 3회 완료', check:function(){ return v17.recovery.sessions >= 3; }},
  {id:'ringiq_80', name:'Ring IQ 80+', icon:'🧠', desc:'Ring IQ 퀴즈 80점 이상', check:function(){ return v17.ringIQ.score >= 80; }},
  {id:'ringiq_perfect', name:'Ring IQ 만점', icon:'💡', desc:'Ring IQ 만점 달성', check:function(){ return v17.ringIQ.score >= RING_SCENARIOS.length * 10; }},
  {id:'spar_5', name:'스파링 5인', icon:'🥊', desc:'AI 파이터 5명 분석', check:function(){ return v17.sparringAI.fought.length >= 5; }},
  {id:'journal_7', name:'일지 7일', icon:'📓', desc:'훈련 일지 7일 기록', check:function(){ return v17.fightJournal.entries.length >= 7; }},
  {id:'quiz_v17_perfect', name:'v17 퀴즈 만점', icon:'🏆', desc:'v17 퀴즈 만점 달성', check:function(){ return Object.values(v17.quizV17Scores).some(function(s){ return s >= QUIZ_V17.length*10; }); }}
];

function checkV17Achievements(){
  var changed = false;
  ACHV17.forEach(function(a){
    if(!v17.achievementsV17[a.id] && a.check()){
      v17.achievementsV17[a.id] = new Date().toISOString();
      changed = true;
      playSFX17('achieve_v17');
      showV17Toast('🏅 업적 해금: ' + a.name);
    }
  });
  if(changed){ saveV17(v17); renderV17Ach(); }
}

function renderV17Ach(){
  var grid = document.getElementById('v17-ach-grid');
  if(!grid) return;
  grid.innerHTML = '';
  ACHV17.forEach(function(a){
    var unlocked = !!v17.achievementsV17[a.id];
    var el = document.createElement('div');
    el.className = 'badge ' + (unlocked ? 'unlocked' : 'locked');
    el.title = a.desc;
    el.innerHTML = '<span class="badge-icon">' + a.icon + '</span><span class="badge-name">' + a.name + '</span>';
    grid.appendChild(el);
  });
}

// ===== TOAST =====
function showV17Toast(msg){
  var container = document.getElementById('toastContainer');
  if(!container) return;
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = msg;
  container.appendChild(toast);
  setTimeout(function(){ toast.remove(); }, 3000);
}

// ===== KEYBOARD SHORTCUTS =====
function initV17Keyboard(){
  document.addEventListener('keydown', function(e){
    if(!e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
    var tag = (e.target.tagName || '').toLowerCase();
    if(tag === 'input' || tag === 'textarea' || tag === 'select') return;
    var handlers = {
      'KeyR': function(){ var el = document.getElementById('v17-speed'); if(el) el.scrollIntoView({behavior:'smooth'}); },
      'KeyH': function(){ var el = document.getElementById('v17-shadow'); if(el) el.scrollIntoView({behavior:'smooth'}); },
      'KeyB': function(){ var el = document.getElementById('v17-body'); if(el) el.scrollIntoView({behavior:'smooth'}); },
      'KeyW': function(){ var el = document.getElementById('v17-weight'); if(el) el.scrollIntoView({behavior:'smooth'}); },
      'KeyV': function(){ var el = document.getElementById('v17-recovery'); if(el) el.scrollIntoView({behavior:'smooth'}); },
      'KeyI': function(){ var el = document.getElementById('v17-ringiq'); if(el) el.scrollIntoView({behavior:'smooth'}); },
      'KeyP': function(){ var el = document.getElementById('v17-spar'); if(el) el.scrollIntoView({behavior:'smooth'}); },
      'KeyL': function(){ var el = document.getElementById('v17-journal'); if(el) el.scrollIntoView({behavior:'smooth'}); }
    };
    if(handlers[e.code]){ e.preventDefault(); handlers[e.code](); }
  });
}

// ===== BUILD UI =====
function buildV17(){
  var container = document.querySelector('.container');
  if(!container) return;
  var footer = document.querySelector('.footer');

  var html = '';

  // -- Bottom nav bar (8 features)
  html += '<div id="v17-nav" style="position:fixed;bottom:0;left:0;right:0;z-index:99;background:rgba(15,10,30,0.95);backdrop-filter:blur(20px);border-top:1px solid var(--glass-border);display:flex;overflow-x:auto;padding:6px 4px;gap:2px">';
  var navItems = [
    {id:'v17-speed',icon:'⚡',label:'스피드'},
    {id:'v17-shadow',icon:'👥',label:'섀도'},
    {id:'v17-body',icon:'📊',label:'체성분'},
    {id:'v17-weight',icon:'🏅',label:'체급'},
    {id:'v17-recovery',icon:'🙏',label:'회복'},
    {id:'v17-ringiq',icon:'🧠',label:'RingIQ'},
    {id:'v17-spar',icon:'🥊',label:'스파링'},
    {id:'v17-journal',icon:'📓',label:'일지'}
  ];
  navItems.forEach(function(item){
    html += '<div style="flex:0 0 auto;text-align:center;padding:4px 8px;cursor:pointer;border-radius:8px;transition:all 0.2s;min-width:48px" onclick="document.getElementById(\'' + item.id + '\').scrollIntoView({behavior:\'smooth\'})"><div style="font-size:16px">' + item.icon + '</div><div style="font-size:8px;color:var(--text-dim);white-space:nowrap">' + item.label + '</div></div>';
  });
  html += '</div>';

  // -- 1. Punch Speed Radar
  html += '<section class="section" id="v17-speed"><h2 class="section-title"><span class="emoji">⚡</span> 펀치 스피드 레이더</h2>';
  html += '<div class="card"><canvas id="v17-speed-canvas" width="460" height="300" style="width:100%;height:auto;border-radius:12px;cursor:crosshair"></canvas>';
  html += '<div style="display:flex;gap:8px;margin-top:10px;justify-content:center"><button id="v17-speed-start" style="padding:10px 20px;background:linear-gradient(135deg,var(--accent),#CC2222);border:none;border-radius:10px;color:#fff;font-weight:700;cursor:pointer;font-size:13px">⚡ 30초 측정 시작</button></div>';
  html += '<div style="display:flex;gap:16px;justify-content:center;margin-top:8px;font-size:11px;color:var(--text-dim)"><span>최고: ' + v17.speedRadar.bestSpeed.toFixed(1) + '펀치/초</span><span>평균: ' + v17.speedRadar.avgSpeed.toFixed(1) + '펀치/초</span></div></div></section>';

  // -- 2. Shadow Boxing Choreographer
  html += '<section class="section" id="v17-shadow"><h2 class="section-title"><span class="emoji">👥</span> 섀도복싱 코리오그래퍼</h2>';
  html += '<div class="card"><div id="v17-shadow-tabs" style="display:flex;gap:6px;overflow-x:auto;margin-bottom:10px;padding-bottom:4px"></div>';
  html += '<canvas id="v17-shadow-canvas" width="460" height="200" style="width:100%;height:auto;border-radius:12px"></canvas>';
  html += '<div style="text-align:center;margin-top:10px"><button id="v17-shadow-start" style="padding:10px 20px;background:linear-gradient(135deg,var(--accent),#CC2222);border:none;border-radius:10px;color:#fff;font-weight:700;cursor:pointer;font-size:13px">👥 루틴 시작</button></div></div></section>';

  // -- 3. Body Composition Tracker
  html += '<section class="section" id="v17-body"><h2 class="section-title"><span class="emoji">📊</span> 체성분 트래커</h2>';
  html += '<div class="card"><canvas id="v17-body-canvas" width="460" height="220" style="width:100%;height:auto;border-radius:12px"></canvas>';
  html += '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;align-items:center;justify-content:center">';
  html += '<input id="v17-body-weight" type="number" placeholder="체중(kg)" min="30" max="200" step="0.1" style="width:90px;padding:8px;background:var(--surface);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);font-size:13px;text-align:center">';
  html += '<input id="v17-body-height" type="number" placeholder="키(cm)" min="100" max="230" step="0.1" style="width:90px;padding:8px;background:var(--surface);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);font-size:13px;text-align:center">';
  html += '<button id="v17-body-save" style="padding:8px 16px;background:var(--accent);border:none;border-radius:8px;color:#fff;font-weight:700;cursor:pointer;font-size:12px">기록</button></div></div></section>';

  // -- 4. Weight Class Encyclopedia
  html += '<section class="section" id="v17-weight"><h2 class="section-title"><span class="emoji">🏅</span> 체급 백과사전 (17종)</h2>';
  html += '<div class="card"><div id="v17-weight-list" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;max-height:400px;overflow-y:auto"></div></div></section>';

  // -- 5. Recovery Zone Timer
  html += '<section class="section" id="v17-recovery"><h2 class="section-title"><span class="emoji">🙏</span> 회복 존 타이머</h2>';
  html += '<div class="card"><canvas id="v17-recovery-canvas" width="300" height="220" style="width:100%;max-width:300px;height:auto;border-radius:12px;display:block;margin:0 auto"></canvas>';
  html += '<div style="text-align:center;margin-top:10px"><button id="v17-recovery-start" style="padding:10px 20px;background:linear-gradient(135deg,#22c55e,#16a34a);border:none;border-radius:10px;color:#fff;font-weight:700;cursor:pointer;font-size:13px">🙏 회복 시작 (8분)</button></div></div></section>';

  // -- 6. Ring IQ Strategy Quiz
  html += '<section class="section" id="v17-ringiq"><h2 class="section-title"><span class="emoji">🧠</span> Ring IQ 전략 퀴즈</h2>';
  html += '<div class="card"><canvas id="v17-ringiq-canvas" width="460" height="120" style="width:100%;height:auto;border-radius:12px"></canvas>';
  html += '<div id="v17-ringiq-opts" style="margin-top:10px"></div>';
  html += '<div style="text-align:center;margin-top:10px"><button id="v17-ringiq-start" style="padding:10px 20px;background:linear-gradient(135deg,var(--accent),#CC2222);border:none;border-radius:10px;color:#fff;font-weight:700;cursor:pointer;font-size:13px">🧠 12시나리오 시작</button></div></div></section>';

  // -- 7. Sparring Partner AI
  html += '<section class="section" id="v17-spar"><h2 class="section-title"><span class="emoji">🥊</span> 스파링 파트너 AI (8인)</h2>';
  html += '<div class="card"><div id="v17-fighter-tabs" style="display:flex;gap:6px;overflow-x:auto;margin-bottom:10px;padding-bottom:4px"></div>';
  html += '<canvas id="v17-spar-canvas" width="300" height="220" style="width:100%;max-width:300px;height:auto;border-radius:12px;display:block;margin:0 auto"></canvas>';
  html += '<div id="v17-fighter-desc" style="text-align:center;margin-top:8px;font-size:11px;color:var(--text-dim)"></div></div></section>';

  // -- 8. Fight Camp Journal
  html += '<section class="section" id="v17-journal"><h2 class="section-title"><span class="emoji">📓</span> 훈련 캠프 일지</h2>';
  html += '<div class="card"><canvas id="v17-journal-canvas" width="300" height="160" style="width:100%;max-width:300px;height:auto;border-radius:12px;display:block;margin:0 auto"></canvas>';
  html += '<div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap;align-items:center;justify-content:center">';
  html += '<select id="v17-journal-mood" style="padding:6px 8px;background:var(--surface);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);font-size:12px"><option value="최고">😄 최고</option><option value="좋아">😊 좋아</option><option value="보통" selected>😐 보통</option><option value="피곤">😩 피곤</option><option value="힘들어">😭 힘들어</option></select>';
  html += '<input id="v17-journal-intensity" type="range" min="1" max="10" value="5" style="width:80px">';
  html += '<input id="v17-journal-note" type="text" placeholder="메모" maxlength="100" style="flex:1;min-width:100px;padding:6px 8px;background:var(--surface);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);font-size:12px">';
  html += '<button id="v17-journal-save" style="padding:6px 14px;background:var(--accent);border:none;border-radius:8px;color:#fff;font-weight:700;cursor:pointer;font-size:12px">저장</button></div></div></section>';

  // -- v17 Quiz
  html += '<section class="section" id="v17-quiz"><h2 class="section-title"><span class="emoji">❓</span> v17 퀴즈 (15문)</h2>';
  html += '<div class="card"><div id="v17-quiz-area" style="min-height:60px"><div style="text-align:center;color:var(--text-dim);font-size:13px;padding:16px">시작 버튼을 눌러주세요</div></div>';
  html += '<div style="text-align:center;margin-top:10px"><button id="v17-quiz-start" style="padding:10px 20px;background:linear-gradient(135deg,var(--accent),#CC2222);border:none;border-radius:10px;color:#fff;font-weight:700;cursor:pointer;font-size:13px">❓ 퀴즈 시작</button></div></div></section>';

  // -- v17 Achievements
  html += '<section class="section" id="v17-ach"><h2 class="section-title"><span class="emoji">🏅</span> v17 업적 (12개)</h2>';
  html += '<div class="card"><div class="badge-grid" id="v17-ach-grid"></div></div></section>';

  var wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  while(wrapper.firstChild){
    if(footer) container.insertBefore(wrapper.firstChild, footer);
    else container.appendChild(wrapper.firstChild);
  }

  // Event listeners
  var speedCanvas = document.getElementById('v17-speed-canvas');
  if(speedCanvas){
    speedCanvas.addEventListener('click', handleSpeedClick);
    speedCanvas.addEventListener('touchstart', function(e){
      e.preventDefault();
      var touch = e.touches[0];
      handleSpeedClick({clientX:touch.clientX, clientY:touch.clientY});
    }, {passive:false});
  }
  var speedStart = document.getElementById('v17-speed-start');
  if(speedStart) speedStart.addEventListener('click', startSpeedDrill);

  // Shadow tabs
  var shadowTabs = document.getElementById('v17-shadow-tabs');
  if(shadowTabs){
    SHADOW_ROUTINES.forEach(function(r, idx){
      var btn = document.createElement('button');
      btn.style.cssText = 'padding:6px 10px;border-radius:8px;border:1px solid var(--glass-border);background:' + (idx === shadowRoutineIdx ? 'var(--accent-soft)' : 'var(--surface)') + ';color:' + (idx === shadowRoutineIdx ? 'var(--accent)' : 'var(--text-dim)') + ';font-size:10px;cursor:pointer;white-space:nowrap;';
      btn.textContent = r.name;
      btn.addEventListener('click', function(){
        shadowRoutineIdx = idx;
        shadowTabs.querySelectorAll('button').forEach(function(b, bi){
          b.style.background = bi === idx ? 'var(--accent-soft)' : 'var(--surface)';
          b.style.color = bi === idx ? 'var(--accent)' : 'var(--text-dim)';
        });
        drawShadowCanvas();
      });
      shadowTabs.appendChild(btn);
    });
  }
  var shadowStart = document.getElementById('v17-shadow-start');
  if(shadowStart) shadowStart.addEventListener('click', startShadowRoutine);

  var bodySave = document.getElementById('v17-body-save');
  if(bodySave) bodySave.addEventListener('click', saveBodyEntry);

  var recoveryStart = document.getElementById('v17-recovery-start');
  if(recoveryStart) recoveryStart.addEventListener('click', startRecovery);

  var ringIQStart = document.getElementById('v17-ringiq-start');
  if(ringIQStart) ringIQStart.addEventListener('click', startRingIQ);

  var journalSave = document.getElementById('v17-journal-save');
  if(journalSave) journalSave.addEventListener('click', saveJournalEntry);

  var quizStart = document.getElementById('v17-quiz-start');
  if(quizStart) quizStart.addEventListener('click', startQuizV17);

  // Initial render
  drawSpeedCanvas();
  drawShadowCanvas();
  drawBodyCompCanvas();
  renderWeightClasses();
  drawRecoveryCanvas();
  drawRingIQCanvas();
  renderFighterTabs();
  drawSparRadar();
  drawJournalCanvas();
  renderV17Ach();
  initV17Keyboard();
  checkV17Achievements();
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', buildV17);
} else {
  buildV17();
}

})();
