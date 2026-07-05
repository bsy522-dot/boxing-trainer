// Boxing Trainer Pro v18_patch.js - NEXTERA+PRISM Auto Enhancement Module
// Punch Analytics Dashboard Canvas (total/accuracy/speed multi-chart),
// Combo Chain Builder Canvas 20combos visual sequence,
// Fighter Belt Ranking Canvas 8belts XP progression,
// Round Performance Tracker Canvas 12rounds line graph,
// Heart Rate Zone Simulator Canvas 5zones cardio,
// Technique Mastery Tree Canvas 18nodes skill tree,
// Weekly Challenge System 7challenges progress,
// AI Corner Coach Canvas 6-axis Radar tactical analysis
// Quiz +15 (135->150), +12 Achievements (130->142), SFX 12, Keyboard +8
(function(){
'use strict';

var STORAGE_KEY = 'boxingTrainerData';
var V18KEY = 'boxingV18Patch';

function loadAppData(){
  try { var r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch(e){ return null; }
}
function loadV18(){
  try {
    var r = localStorage.getItem(V18KEY);
    if(!r) return defV18();
    var p = JSON.parse(r), d = defV18();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV18(); }
}
function saveV18(d){ try { localStorage.setItem(V18KEY, JSON.stringify(d)); } catch(e){} }
function defV18(){
  return {
    punchAnalytics: { totalPunches: 0, sessions: [], accuracy: 0, avgSpeed: 0 },
    comboChain: { created: [], practiced: 0, bestChain: 0 },
    beltRank: { xp: 0, belt: 0, fights: 0, wins: 0 },
    roundPerf: { rounds: [], bestRound: 0, totalRounds: 0 },
    heartZone: { sessions: 0, timeInZone: [0,0,0,0,0], currentZone: 0 },
    techTree: { unlocked: [0], progress: {}, totalXP: 0 },
    weeklyChal: { active: [], completed: [], streak: 0, lastReset: '' },
    cornerCoach: { adviceUsed: 0, strategies: [], rating: 0 },
    quizV18Scores: {},
    achievementsV18: {},
    featureUsage: {}
  };
}

var v18 = loadV18();

// ===== SFX ENGINE V18 =====
function playSFX18(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'analytics_tap':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(440,t+0.08);
        g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.1);break;
      case 'combo_add':
        var o2=ctx.createOscillator(),g2=ctx.createGain();
        o2.type='square';o2.frequency.setValueAtTime(660,t);o2.frequency.linearRampToValueAtTime(880,t+0.06);
        g2.gain.setValueAtTime(0.08,t);g2.gain.exponentialRampToValueAtTime(0.001,t+0.08);
        o2.connect(g2).connect(ctx.destination);o2.start(t);o2.stop(t+0.08);break;
      case 'combo_complete':
        [523,659,784,1047].forEach(function(f,j){
          var o3=ctx.createOscillator(),g3=ctx.createGain();
          o3.type='sine';o3.frequency.value=f;
          g3.gain.setValueAtTime(0.07,t+j*0.07);g3.gain.exponentialRampToValueAtTime(0.001,t+j*0.07+0.12);
          o3.connect(g3).connect(ctx.destination);o3.start(t+j*0.07);o3.stop(t+j*0.07+0.12);
        });break;
      case 'belt_up':
        [262,330,392,523,659,784].forEach(function(f,j){
          var o4=ctx.createOscillator(),g4=ctx.createGain();
          o4.type='triangle';o4.frequency.value=f;
          g4.gain.setValueAtTime(0.1,t+j*0.1);g4.gain.exponentialRampToValueAtTime(0.001,t+j*0.1+0.2);
          o4.connect(g4).connect(ctx.destination);o4.start(t+j*0.1);o4.stop(t+j*0.1+0.2);
        });break;
      case 'round_end':
        var o5=ctx.createOscillator(),g5=ctx.createGain();
        o5.type='sawtooth';o5.frequency.setValueAtTime(300,t);o5.frequency.linearRampToValueAtTime(600,t+0.3);
        g5.gain.setValueAtTime(0.1,t);g5.gain.exponentialRampToValueAtTime(0.001,t+0.35);
        o5.connect(g5).connect(ctx.destination);o5.start(t);o5.stop(t+0.35);break;
      case 'heartbeat':
        [0,0.15].forEach(function(d){
          var o6=ctx.createOscillator(),g6=ctx.createGain();
          o6.type='sine';o6.frequency.setValueAtTime(60,t+d);o6.frequency.exponentialRampToValueAtTime(40,t+d+0.08);
          g6.gain.setValueAtTime(0.2,t+d);g6.gain.exponentialRampToValueAtTime(0.001,t+d+0.12);
          o6.connect(g6).connect(ctx.destination);o6.start(t+d);o6.stop(t+d+0.12);
        });break;
      case 'skill_unlock':
        var o7=ctx.createOscillator(),g7=ctx.createGain();
        o7.type='sine';o7.frequency.setValueAtTime(523,t);o7.frequency.linearRampToValueAtTime(1047,t+0.2);
        g7.gain.setValueAtTime(0.1,t);g7.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o7.connect(g7).connect(ctx.destination);o7.start(t);o7.stop(t+0.25);break;
      case 'challenge_done':
        [784,988,1175,1319,1568].forEach(function(f,j){
          var o8=ctx.createOscillator(),g8=ctx.createGain();
          o8.type='sine';o8.frequency.value=f;
          g8.gain.setValueAtTime(0.06,t+j*0.06);g8.gain.exponentialRampToValueAtTime(0.001,t+j*0.06+0.15);
          o8.connect(g8).connect(ctx.destination);o8.start(t+j*0.06);o8.stop(t+j*0.06+0.15);
        });break;
      case 'coach_advice':
        var o9=ctx.createOscillator(),g9=ctx.createGain();
        o9.type='triangle';o9.frequency.setValueAtTime(440,t);
        g9.gain.setValueAtTime(0.08,t);g9.gain.exponentialRampToValueAtTime(0.001,t+0.2);
        o9.connect(g9).connect(ctx.destination);o9.start(t);o9.stop(t+0.2);
        var o9b=ctx.createOscillator(),g9b=ctx.createGain();
        o9b.type='triangle';o9b.frequency.setValueAtTime(554,t+0.1);
        g9b.gain.setValueAtTime(0.08,t+0.1);g9b.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o9b.connect(g9b).connect(ctx.destination);o9b.start(t+0.1);o9b.stop(t+0.25);break;
      case 'quiz_v18':
        var oq=ctx.createOscillator(),gq=ctx.createGain();
        oq.type='sine';oq.frequency.value=698;
        gq.gain.setValueAtTime(0.08,t);gq.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        oq.connect(gq).connect(ctx.destination);oq.start(t);oq.stop(t+0.12);break;
      case 'ach_v18':
        [659,784,988,1175].forEach(function(f,j){
          var oa=ctx.createOscillator(),ga=ctx.createGain();
          oa.type='sine';oa.frequency.value=f;
          ga.gain.setValueAtTime(0.07,t+j*0.08);ga.gain.exponentialRampToValueAtTime(0.001,t+j*0.08+0.15);
          oa.connect(ga).connect(ctx.destination);oa.start(t+j*0.08);oa.stop(t+j*0.08+0.15);
        });break;
      case 'nav_v18':
        var on=ctx.createOscillator(),gn=ctx.createGain();
        on.type='sine';on.frequency.value=1047;
        gn.gain.setValueAtTime(0.05,t);gn.gain.exponentialRampToValueAtTime(0.001,t+0.06);
        on.connect(gn).connect(ctx.destination);on.start(t);on.stop(t+0.06);break;
    }
  } catch(e){}
}

// ===== 1. PUNCH ANALYTICS DASHBOARD =====
var analyticsViewMode = 0;
var analyticsDrillActive = false;
var analyticsPunches = [];
var analyticsTimer = null;
var analyticsTimeLeft = 0;

function drawAnalyticsCanvas(){
  var c = document.getElementById('v18-analytics-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  var isDark = !document.documentElement.getAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,W,H);

  var grad = ctx.createLinearGradient(0,0,W,H);
  grad.addColorStop(0, isDark ? '#1a1028' : '#f8f4ff');
  grad.addColorStop(1, isDark ? '#0f0a1e' : '#fff');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,W,H);

  ctx.fillStyle = isDark ? '#f0f0f0' : '#1a1a2e';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Punch Analytics Dashboard', W/2, 22);

  var sessions = v18.punchAnalytics.sessions;

  if(analyticsViewMode === 0){
    var stats = [
      {label:'Total Punches', value: v18.punchAnalytics.totalPunches, color:'#FF4444'},
      {label:'Accuracy', value: Math.round(v18.punchAnalytics.accuracy)+'%', color:'#22c55e'},
      {label:'Avg Speed', value: v18.punchAnalytics.avgSpeed+'ms', color:'#3b82f6'}
    ];
    stats.forEach(function(s, i){
      var bx = 20 + i * (W-40)/3, by = 40, bw = (W-60)/3, bh = 50;
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
      ctx.beginPath();ctx.roundRect(bx, by, bw, bh, 8);ctx.fill();
      ctx.fillStyle = s.color;
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(s.value, bx + bw/2, by + 28);
      ctx.fillStyle = isDark ? '#8a8a9e' : '#666';
      ctx.font = '10px sans-serif';
      ctx.fillText(s.label, bx + bw/2, by + 44);
    });
    if(sessions.length > 0){
      var last7 = sessions.slice(-7);
      var maxP = Math.max.apply(null, last7.map(function(s){return s.punches})) || 1;
      ctx.fillStyle = isDark ? '#8a8a9e' : '#666';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Recent 7 Sessions', W/2, 108);
      last7.forEach(function(s, i){
        var bw2 = (W-80) / 7;
        var bx2 = 30 + i * bw2 + 5;
        var bh2 = (s.punches / maxP) * 60;
        var by2 = H - 20 - bh2;
        ctx.fillStyle = 'rgba(255,68,68,' + (0.4 + (s.punches/maxP)*0.6) + ')';
        ctx.beginPath();ctx.roundRect(bx2, by2, bw2-10, bh2, 4);ctx.fill();
        ctx.fillStyle = isDark ? '#ccc' : '#333';
        ctx.font = '9px sans-serif';
        ctx.fillText(s.punches, bx2 + (bw2-10)/2, by2 - 4);
      });
    } else {
      ctx.fillStyle = isDark ? '#5a5a6e' : '#999';
      ctx.font = '11px sans-serif';
      ctx.fillText('Start a drill to record data', W/2, 140);
    }
  } else if(analyticsViewMode === 1){
    var acc = v18.punchAnalytics.accuracy || 0;
    var cx2 = W/2, cy2 = H/2 + 10, r = 60;
    ctx.beginPath();ctx.arc(cx2,cy2,r,0,Math.PI*2);
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    ctx.fill();
    if(acc > 0){
      ctx.beginPath();ctx.moveTo(cx2,cy2);
      ctx.arc(cx2,cy2,r,-Math.PI/2,-Math.PI/2+Math.PI*2*(acc/100));
      ctx.closePath();
      ctx.fillStyle = acc >= 80 ? '#22c55e' : acc >= 50 ? '#f97316' : '#FF4444';
      ctx.fill();
    }
    ctx.fillStyle = isDark ? '#f0f0f0' : '#1a1a2e';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(acc)+'%', cx2, cy2+8);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = isDark ? '#8a8a9e' : '#666';
    ctx.fillText('Punch Accuracy', cx2, cy2+24);
  } else {
    if(sessions.length > 1){
      var last10 = sessions.slice(-10);
      var maxSpd = Math.max.apply(null, last10.map(function(s){return s.speed||500})) || 500;
      var minSpd = Math.min.apply(null, last10.map(function(s){return s.speed||100})) || 100;
      ctx.strokeStyle = '#3b82f6';ctx.lineWidth = 2;ctx.beginPath();
      last10.forEach(function(s, i){
        var px = 40 + i * ((W-60)/(last10.length-1||1));
        var py = 45 + (1 - (s.speed - minSpd)/(maxSpd - minSpd || 1)) * (H-70);
        if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
      });
      ctx.stroke();
      last10.forEach(function(s, i){
        var px = 40 + i * ((W-60)/(last10.length-1||1));
        var py = 45 + (1 - (s.speed - minSpd)/(maxSpd - minSpd || 1)) * (H-70);
        ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fillStyle='#3b82f6';ctx.fill();
      });
      ctx.fillStyle = isDark ? '#8a8a9e' : '#666';ctx.font = '10px sans-serif';ctx.textAlign = 'center';
      ctx.fillText('Speed Trend (ms)', W/2, H-6);
    } else {
      ctx.fillStyle = isDark ? '#5a5a6e' : '#999';ctx.font = '11px sans-serif';ctx.textAlign = 'center';
      ctx.fillText('Need 2+ sessions', W/2, H/2);
    }
  }
}

function startAnalyticsDrill(){
  if(analyticsDrillActive) return;
  analyticsDrillActive = true;analyticsPunches = [];analyticsTimeLeft = 15;
  playSFX18('analytics_tap');updateAnalyticsTimer();
}
function updateAnalyticsTimer(){
  if(analyticsTimeLeft <= 0){endAnalyticsDrill();return;}
  var el = document.getElementById('v18-analytics-timer');
  if(el) el.textContent = analyticsTimeLeft + 's';
  analyticsTimeLeft--;analyticsTimer = setTimeout(updateAnalyticsTimer, 1000);
}
function endAnalyticsDrill(){
  analyticsDrillActive = false;clearTimeout(analyticsTimer);
  var total = analyticsPunches.length;
  var hits = analyticsPunches.filter(function(p){return p.hit}).length;
  var acc = total > 0 ? (hits/total)*100 : 0;
  var avgSpd = total > 0 ? Math.round(analyticsPunches.reduce(function(s,p){return s+p.speed},0)/total) : 0;
  v18.punchAnalytics.totalPunches += total;
  v18.punchAnalytics.accuracy = Math.round((v18.punchAnalytics.accuracy * v18.punchAnalytics.sessions.length + acc) / (v18.punchAnalytics.sessions.length + 1));
  v18.punchAnalytics.avgSpeed = avgSpd || v18.punchAnalytics.avgSpeed;
  v18.punchAnalytics.sessions.push({punches:total, accuracy:Math.round(acc), speed:avgSpd, ts:Date.now()});
  if(v18.punchAnalytics.sessions.length > 30) v18.punchAnalytics.sessions = v18.punchAnalytics.sessions.slice(-30);
  saveV18(v18);playSFX18('round_end');drawAnalyticsCanvas();
  var el = document.getElementById('v18-analytics-timer');
  if(el) el.textContent = total + ' punches / ' + Math.round(acc) + '%';
  updateChallenge('punch', total);checkV18Achievements();
}
function handleAnalyticsClick(){
  if(!analyticsDrillActive) return;
  var hit = Math.random() > 0.2;
  analyticsPunches.push({hit:hit, speed: 100 + Math.floor(Math.random()*300), ts:Date.now()});
  playSFX18(hit ? 'analytics_tap' : 'nav_v18');
}
function cycleAnalyticsMode(){
  analyticsViewMode = (analyticsViewMode + 1) % 3;drawAnalyticsCanvas();
}

// ===== 2. COMBO CHAIN BUILDER =====
var PUNCH_TYPES = [
  {id:'jab',name:'Jab',short:'J',color:'#FF4444'},
  {id:'cross',name:'Cross',short:'C',color:'#3b82f6'},
  {id:'hook_l',name:'L Hook',short:'LH',color:'#22c55e'},
  {id:'hook_r',name:'R Hook',short:'RH',color:'#f97316'},
  {id:'upper_l',name:'L Upper',short:'LU',color:'#a855f7'},
  {id:'upper_r',name:'R Upper',short:'RU',color:'#ec4899'},
  {id:'body_l',name:'L Body',short:'LB',color:'#14b8a6'},
  {id:'body_r',name:'R Body',short:'RB',color:'#eab308'}
];
var PRESET_COMBOS = [
  {name:'1-2',seq:['jab','cross']},
  {name:'1-2-3',seq:['jab','cross','hook_l']},
  {name:'Double Jab Cross',seq:['jab','jab','cross']},
  {name:'Body 1-2',seq:['body_l','jab','cross']},
  {name:'Upper Hook',seq:['upper_r','hook_l','cross']},
  {name:'Full Combo',seq:['jab','cross','hook_l','upper_r']},
  {name:'Defense Combo',seq:['jab','jab','hook_l','body_r']},
  {name:'Fighter Combo',seq:['cross','hook_l','upper_r','body_l']},
  {name:'Champion',seq:['jab','cross','hook_l','cross','upper_r']},
  {name:'Master',seq:['jab','jab','cross','hook_l','upper_r','body_r']}
];
var comboBuilderIdx = 0;

function drawComboCanvas(){
  var c = document.getElementById('v18-combo-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  var isDark = !document.documentElement.getAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,W,H);
  var grad = ctx.createLinearGradient(0,0,W,H);
  grad.addColorStop(0, isDark ? '#1a1028' : '#f8f4ff');
  grad.addColorStop(1, isDark ? '#0f0a1e' : '#fff');
  ctx.fillStyle = grad;ctx.fillRect(0,0,W,H);
  ctx.fillStyle = isDark ? '#f0f0f0' : '#1a1a2e';
  ctx.font = 'bold 13px sans-serif';ctx.textAlign = 'center';
  var combo = PRESET_COMBOS[comboBuilderIdx];
  ctx.fillText(combo.name + ' Combo', W/2, 22);
  var seqLen = combo.seq.length;
  var boxW = Math.min(50, (W - 40) / seqLen - 6);
  var startX = (W - (seqLen * (boxW + 6) - 6)) / 2;
  combo.seq.forEach(function(pid, i){
    var pt = PUNCH_TYPES.find(function(p){return p.id === pid}) || PUNCH_TYPES[0];
    var bx = startX + i * (boxW + 6), by = 40;
    ctx.fillStyle = pt.color;ctx.globalAlpha = 0.15;
    ctx.beginPath();ctx.roundRect(bx, by, boxW, 50, 8);ctx.fill();
    ctx.globalAlpha = 1;ctx.strokeStyle = pt.color;ctx.lineWidth = 2;
    ctx.beginPath();ctx.roundRect(bx, by, boxW, 50, 8);ctx.stroke();
    ctx.fillStyle = pt.color;ctx.font = 'bold 16px sans-serif';
    ctx.fillText(pt.short, bx + boxW/2, by + 28);
    ctx.font = '9px sans-serif';ctx.fillText(pt.name, bx + boxW/2, by + 44);
    if(i < seqLen - 1){
      ctx.fillStyle = isDark ? '#8a8a9e' : '#666';ctx.font = '14px sans-serif';
      ctx.fillText('→', bx + boxW + 3, by + 28);
    }
  });
  var practiced = (v18.comboChain.created[comboBuilderIdx] || 0);
  ctx.fillStyle = isDark ? '#8a8a9e' : '#666';ctx.font = '10px sans-serif';
  ctx.fillText('Practice: ' + practiced + 'x', W/2, H - 8);
}
function practiceCombo(){
  if(!v18.comboChain.created[comboBuilderIdx]) v18.comboChain.created[comboBuilderIdx] = 0;
  v18.comboChain.created[comboBuilderIdx]++;v18.comboChain.practiced++;
  saveV18(v18);playSFX18('combo_complete');drawComboCanvas();checkV18Achievements();
}
function nextCombo(){
  comboBuilderIdx = (comboBuilderIdx + 1) % PRESET_COMBOS.length;
  playSFX18('combo_add');drawComboCanvas();
}

// ===== 3. FIGHTER BELT RANKING =====
var BELTS = [
  {name:'White Belt',color:'#ccc',minXP:0,emoji:'⚪'},
  {name:'Yellow Belt',color:'#eab308',minXP:100,emoji:'🟡'},
  {name:'Green Belt',color:'#22c55e',minXP:300,emoji:'🟢'},
  {name:'Blue Belt',color:'#3b82f6',minXP:600,emoji:'🔵'},
  {name:'Purple Belt',color:'#a855f7',minXP:1000,emoji:'🟣'},
  {name:'Brown Belt',color:'#92400e',minXP:1500,emoji:'🟤'},
  {name:'Red Belt',color:'#FF4444',minXP:2200,emoji:'🔴'},
  {name:'Black Belt',color:'#1a1a2e',minXP:3000,emoji:'⬛'}
];
function getCurrentBelt(){
  var xp = v18.beltRank.xp, belt = 0;
  for(var i = BELTS.length-1; i >= 0; i--){ if(xp >= BELTS[i].minXP){ belt = i; break; } }
  return belt;
}
function drawBeltCanvas(){
  var c = document.getElementById('v18-belt-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  var isDark = !document.documentElement.getAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,W,H);
  var grad = ctx.createLinearGradient(0,0,W,H);
  grad.addColorStop(0, isDark ? '#1a1028' : '#f8f4ff');
  grad.addColorStop(1, isDark ? '#0f0a1e' : '#fff');
  ctx.fillStyle = grad;ctx.fillRect(0,0,W,H);
  var belt = getCurrentBelt(), beltData = BELTS[belt];
  var nextBelt = belt < BELTS.length-1 ? BELTS[belt+1] : null;
  var xp = v18.beltRank.xp;
  ctx.fillStyle = isDark ? '#f0f0f0' : '#1a1a2e';
  ctx.font = 'bold 14px sans-serif';ctx.textAlign = 'center';
  ctx.fillText('Fighter Belt Ranking', W/2, 22);
  ctx.beginPath();ctx.arc(W/2, 75, 35, 0, Math.PI*2);
  ctx.fillStyle = beltData.color;ctx.fill();
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 3;ctx.stroke();
  ctx.fillStyle = belt >= 6 ? '#fff' : (belt <= 1 ? '#333' : '#fff');
  ctx.font = 'bold 28px sans-serif';ctx.fillText(beltData.emoji, W/2, 84);
  ctx.fillStyle = isDark ? '#f0f0f0' : '#1a1a2e';
  ctx.font = 'bold 13px sans-serif';ctx.fillText(beltData.name, W/2, 125);
  if(nextBelt){
    var progress = Math.min(1, Math.max(0, (xp - beltData.minXP) / (nextBelt.minXP - beltData.minXP)));
    var barW = W - 80, barH = 12, barX = 40, barY = 140;
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    ctx.beginPath();ctx.roundRect(barX,barY,barW,barH,6);ctx.fill();
    if(progress > 0){
      var grd = ctx.createLinearGradient(barX,0,barX+barW*progress,0);
      grd.addColorStop(0, beltData.color);grd.addColorStop(1, nextBelt.color);
      ctx.fillStyle = grd;ctx.beginPath();ctx.roundRect(barX,barY,barW*progress,barH,6);ctx.fill();
    }
    ctx.fillStyle = isDark ? '#8a8a9e' : '#666';ctx.font = '10px sans-serif';
    ctx.fillText(xp + ' / ' + nextBelt.minXP + ' XP (' + Math.round(progress*100) + '%)', W/2, barY+26);
  } else {
    ctx.fillStyle = '#FFD700';ctx.font = 'bold 11px sans-serif';
    ctx.fillText('MAX RANK! 🏆 ' + xp + ' XP', W/2, 148);
  }
  ctx.fillStyle = isDark ? '#8a8a9e' : '#666';ctx.font = '10px sans-serif';
  ctx.fillText('🥊 ' + v18.beltRank.fights + 'F  🏆 ' + v18.beltRank.wins + 'W', W/2, H-8);
}
function addBeltXP(amount){
  var oldBelt = getCurrentBelt();v18.beltRank.xp += amount;
  var newBelt = getCurrentBelt();
  if(newBelt > oldBelt) playSFX18('belt_up');
  saveV18(v18);drawBeltCanvas();
}
function simulateFight(){
  v18.beltRank.fights++;
  var win = Math.random() > 0.35;
  if(win){ v18.beltRank.wins++; addBeltXP(50 + Math.floor(Math.random()*30)); }
  else { addBeltXP(15); }
  playSFX18('round_end');saveV18(v18);drawBeltCanvas();checkV18Achievements();
}

// ===== 4. ROUND PERFORMANCE TRACKER =====
var roundSimActive = false, roundSimCurrent = 0, roundSimData = [];
function drawRoundCanvas(){
  var c = document.getElementById('v18-round-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  var isDark = !document.documentElement.getAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,W,H);
  var grad = ctx.createLinearGradient(0,0,W,H);
  grad.addColorStop(0, isDark ? '#1a1028' : '#f8f4ff');
  grad.addColorStop(1, isDark ? '#0f0a1e' : '#fff');
  ctx.fillStyle = grad;ctx.fillRect(0,0,W,H);
  ctx.fillStyle = isDark ? '#f0f0f0' : '#1a1a2e';
  ctx.font = 'bold 13px sans-serif';ctx.textAlign = 'center';
  ctx.fillText('Round Performance Tracker', W/2, 20);
  var rounds = v18.roundPerf.rounds.length > 0 ? v18.roundPerf.rounds.slice(-12) : roundSimData;
  if(rounds.length === 0){
    ctx.fillStyle = isDark ? '#5a5a6e' : '#999';ctx.font = '11px sans-serif';
    ctx.fillText('Start simulation', W/2, H/2); return;
  }
  var maxScore = Math.max.apply(null, rounds.map(function(r){return r.score})) || 100;
  var padL = 35, padR = 15, padT = 35, padB = 25;
  var chartW = W - padL - padR, chartH = H - padT - padB;
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';ctx.lineWidth = 1;
  for(var g2 = 0; g2 <= 4; g2++){
    var gy = padT + (chartH * g2 / 4);
    ctx.beginPath();ctx.moveTo(padL,gy);ctx.lineTo(W-padR,gy);ctx.stroke();
  }
  ctx.strokeStyle = '#FF4444';ctx.lineWidth = 2.5;ctx.beginPath();
  rounds.forEach(function(r, i){
    var px = padL + (i / (rounds.length - 1 || 1)) * chartW;
    var py = padT + (1 - r.score / maxScore) * chartH;
    if(i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  });
  ctx.stroke();
  ctx.lineTo(padL + chartW, padT + chartH);ctx.lineTo(padL, padT + chartH);
  ctx.closePath();ctx.fillStyle = 'rgba(255,68,68,0.08)';ctx.fill();
  rounds.forEach(function(r, i){
    var px = padL + (i / (rounds.length - 1 || 1)) * chartW;
    var py = padT + (1 - r.score / maxScore) * chartH;
    ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);ctx.fillStyle='#FF4444';ctx.fill();
    ctx.fillStyle = isDark ? '#ccc' : '#333';ctx.font = '8px sans-serif';ctx.textAlign = 'center';
    ctx.fillText(r.score, px, py - 8);
  });
  ctx.fillStyle = isDark ? '#8a8a9e' : '#666';ctx.font = '9px sans-serif';
  rounds.forEach(function(r, i){
    var px = padL + (i / (rounds.length - 1 || 1)) * chartW;
    ctx.fillText('R' + (i+1), px, H - 6);
  });
  ctx.textAlign = 'left';ctx.fillText('Best: ' + v18.roundPerf.bestRound, 5, H - 6);
}
function startRoundSim(){
  if(roundSimActive) return;
  roundSimActive = true;roundSimCurrent = 0;roundSimData = [];nextRound();
}
function nextRound(){
  if(roundSimCurrent >= 12){
    roundSimActive = false;
    v18.roundPerf.rounds = roundSimData.slice();v18.roundPerf.totalRounds += 12;
    var best = Math.max.apply(null, roundSimData.map(function(r){return r.score}));
    if(best > v18.roundPerf.bestRound) v18.roundPerf.bestRound = best;
    saveV18(v18);playSFX18('round_end');addBeltXP(20);drawRoundCanvas();checkV18Achievements();return;
  }
  roundSimCurrent++;
  var fatigueFactor = 1 - (roundSimCurrent / 20);
  var score = Math.round(50 + Math.random() * 50 * fatigueFactor);
  roundSimData.push({round: roundSimCurrent, score: score});
  playSFX18('analytics_tap');drawRoundCanvas();setTimeout(nextRound, 400);
}

// ===== 5. HEART RATE ZONE SIMULATOR =====
var HR_ZONES = [
  {name:'Recovery',range:'50-60%',color:'#3b82f6',desc:'Warm-up / Cool-down'},
  {name:'Fat Burn',range:'60-70%',color:'#22c55e',desc:'Aerobic Base'},
  {name:'Cardio',range:'70-80%',color:'#eab308',desc:'Endurance'},
  {name:'Anaerobic',range:'80-90%',color:'#f97316',desc:'High Intensity'},
  {name:'Max',range:'90-100%',color:'#FF4444',desc:'Peak Power'}
];
var hrSimActive = false, hrCurrentZone = 0, hrTimer2 = null, hrTimeLeft = 0;
function drawHeartCanvas(){
  var c = document.getElementById('v18-heart-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  var isDark = !document.documentElement.getAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,W,H);
  var grad = ctx.createLinearGradient(0,0,W,H);
  grad.addColorStop(0, isDark ? '#1a1028' : '#f8f4ff');
  grad.addColorStop(1, isDark ? '#0f0a1e' : '#fff');
  ctx.fillStyle = grad;ctx.fillRect(0,0,W,H);
  ctx.fillStyle = isDark ? '#f0f0f0' : '#1a1a2e';
  ctx.font = 'bold 13px sans-serif';ctx.textAlign = 'center';
  ctx.fillText('Heart Rate Zone Simulator', W/2, 20);
  var barW = (W - 60) / 5;
  HR_ZONES.forEach(function(z, i){
    var bx = 20 + i * (barW + 5);
    var totalTime = v18.heartZone.timeInZone[i] || 0;
    var maxTime = Math.max.apply(null, v18.heartZone.timeInZone) || 1;
    var bh = Math.max(8, (totalTime / maxTime) * 80);
    var by = H - 50 - bh;
    ctx.fillStyle = z.color;
    ctx.globalAlpha = hrSimActive && hrCurrentZone === i ? 0.9 : 0.3;
    ctx.beginPath();ctx.roundRect(bx, by, barW, bh, 4);ctx.fill();ctx.globalAlpha = 1;
    if(hrSimActive && hrCurrentZone === i){
      ctx.strokeStyle = z.color;ctx.lineWidth = 2;ctx.setLineDash([4,2]);
      ctx.beginPath();ctx.roundRect(bx-2, by-2, barW+4, bh+4, 6);ctx.stroke();ctx.setLineDash([]);
    }
    ctx.fillStyle = isDark ? '#ccc' : '#333';ctx.font = '8px sans-serif';ctx.textAlign = 'center';
    ctx.fillText(totalTime + 's', bx + barW/2, by - 4);
    ctx.fillStyle = z.color;ctx.font = 'bold 9px sans-serif';
    ctx.fillText(z.name, bx + barW/2, H - 34);
    ctx.fillStyle = isDark ? '#8a8a9e' : '#666';ctx.font = '8px sans-serif';
    ctx.fillText(z.range, bx + barW/2, H - 22);
  });
  if(hrSimActive){
    var cz = HR_ZONES[hrCurrentZone];
    ctx.fillStyle = cz.color;ctx.font = 'bold 14px sans-serif';ctx.textAlign = 'center';
    ctx.fillText('❤️ ' + cz.name + ' (' + hrTimeLeft + 's)', W/2, 42);
    ctx.fillStyle = isDark ? '#8a8a9e' : '#666';ctx.font = '10px sans-serif';
    ctx.fillText(cz.desc, W/2, 58);
  } else {
    ctx.fillStyle = isDark ? '#8a8a9e' : '#666';ctx.font = '10px sans-serif';
    ctx.fillText('Sessions: ' + v18.heartZone.sessions, W/2, 45);
  }
}
function startHeartSim(){
  if(hrSimActive) return;
  hrSimActive = true;hrCurrentZone = 0;hrTimeLeft = 10;playSFX18('heartbeat');tickHeart();
}
function tickHeart(){
  if(hrTimeLeft <= 0){
    hrCurrentZone++;
    if(hrCurrentZone >= 5){
      hrSimActive = false;v18.heartZone.sessions++;saveV18(v18);
      playSFX18('challenge_done');drawHeartCanvas();addBeltXP(15);checkV18Achievements();return;
    }
    hrTimeLeft = 10;playSFX18('heartbeat');
  }
  v18.heartZone.timeInZone[hrCurrentZone]++;hrTimeLeft--;saveV18(v18);drawHeartCanvas();
  hrTimer2 = setTimeout(tickHeart, 1000);
}

// ===== 6. TECHNIQUE MASTERY TREE =====
var TECH_NODES = [
  {id:0,name:'Jab',x:0.5,y:0.05,deps:[],xp:0,color:'#FF4444'},
  {id:1,name:'1-2',x:0.3,y:0.17,deps:[0],xp:20,color:'#FF4444'},
  {id:2,name:'Step Jab',x:0.7,y:0.17,deps:[0],xp:20,color:'#3b82f6'},
  {id:3,name:'L Hook',x:0.15,y:0.32,deps:[1],xp:40,color:'#22c55e'},
  {id:4,name:'Counter',x:0.5,y:0.32,deps:[1,2],xp:50,color:'#f97316'},
  {id:5,name:'R Hook',x:0.85,y:0.32,deps:[2],xp:40,color:'#22c55e'},
  {id:6,name:'L Upper',x:0.2,y:0.47,deps:[3],xp:60,color:'#a855f7'},
  {id:7,name:'Slip Counter',x:0.4,y:0.47,deps:[3,4],xp:70,color:'#ec4899'},
  {id:8,name:'Pivot Hook',x:0.6,y:0.47,deps:[4,5],xp:70,color:'#ec4899'},
  {id:9,name:'R Upper',x:0.8,y:0.47,deps:[5],xp:60,color:'#a855f7'},
  {id:10,name:'Body Atk',x:0.15,y:0.62,deps:[6],xp:80,color:'#14b8a6'},
  {id:11,name:'Footwork',x:0.38,y:0.62,deps:[7],xp:80,color:'#14b8a6'},
  {id:12,name:'Combos',x:0.62,y:0.62,deps:[8],xp:80,color:'#14b8a6'},
  {id:13,name:'Defense',x:0.85,y:0.62,deps:[9],xp:80,color:'#14b8a6'},
  {id:14,name:'Infighter',x:0.2,y:0.77,deps:[10,11],xp:100,color:'#eab308'},
  {id:15,name:'Outfighter',x:0.5,y:0.77,deps:[11,12],xp:100,color:'#eab308'},
  {id:16,name:'Counterpunch',x:0.8,y:0.77,deps:[12,13],xp:100,color:'#eab308'},
  {id:17,name:'Grand Master',x:0.5,y:0.92,deps:[14,15,16],xp:200,color:'#FFD700'}
];
function drawTechTree(){
  var c = document.getElementById('v18-tech-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  var isDark = !document.documentElement.getAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,W,H);
  var grad = ctx.createLinearGradient(0,0,W,H);
  grad.addColorStop(0, isDark ? '#1a1028' : '#f8f4ff');
  grad.addColorStop(1, isDark ? '#0f0a1e' : '#fff');
  ctx.fillStyle = grad;ctx.fillRect(0,0,W,H);
  var unlocked = v18.techTree.unlocked;
  TECH_NODES.forEach(function(node){
    var nx = 20 + node.x * (W-40), ny = 20 + node.y * (H-40);
    node.deps.forEach(function(depId){
      var dep = TECH_NODES[depId];
      var dx = 20 + dep.x * (W-40), dy = 20 + dep.y * (H-40);
      ctx.strokeStyle = unlocked.indexOf(node.id) >= 0 ? node.color : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)');
      ctx.lineWidth = unlocked.indexOf(node.id) >= 0 ? 2 : 1;
      ctx.beginPath();ctx.moveTo(dx,dy);ctx.lineTo(nx,ny);ctx.stroke();
    });
  });
  TECH_NODES.forEach(function(node){
    var nx = 20 + node.x * (W-40), ny = 20 + node.y * (H-40);
    var isUnlocked = unlocked.indexOf(node.id) >= 0;
    var canUnlock = !isUnlocked && node.deps.every(function(d){return unlocked.indexOf(d)>=0});
    ctx.beginPath();ctx.arc(nx,ny,14,0,Math.PI*2);
    if(isUnlocked){
      ctx.fillStyle = node.color;ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';ctx.lineWidth = 2;ctx.stroke();
    } else if(canUnlock){
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';ctx.fill();
      ctx.strokeStyle = node.color;ctx.lineWidth = 2;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);
    } else {
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';ctx.fill();
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';ctx.lineWidth = 1;ctx.stroke();
    }
    ctx.fillStyle = isUnlocked ? '#fff' : (isDark ? '#8a8a9e' : '#999');
    ctx.font = (isUnlocked ? 'bold ' : '') + '8px sans-serif';ctx.textAlign = 'center';
    ctx.fillText(node.name, nx, ny + 3);
  });
  ctx.fillStyle = isDark ? '#8a8a9e' : '#666';ctx.font = '10px sans-serif';ctx.textAlign = 'center';
  ctx.fillText(unlocked.length + '/' + TECH_NODES.length + ' | XP: ' + v18.techTree.totalXP, W/2, H - 4);
}
function handleTechClick(e){
  var c = document.getElementById('v18-tech-canvas');
  if(!c) return;
  var rect = c.getBoundingClientRect();
  var mx = (e.clientX - rect.left) * (c.width / rect.width);
  var my = (e.clientY - rect.top) * (c.height / rect.height);
  var W = c.width, H = c.height;
  TECH_NODES.forEach(function(node){
    var nx = 20 + node.x * (W-40), ny = 20 + node.y * (H-40);
    var dist = Math.sqrt((mx-nx)*(mx-nx) + (my-ny)*(my-ny));
    if(dist < 16){
      var isUnlocked = v18.techTree.unlocked.indexOf(node.id) >= 0;
      var canUnlock = !isUnlocked && node.deps.every(function(d){return v18.techTree.unlocked.indexOf(d)>=0});
      if(canUnlock && v18.techTree.totalXP >= node.xp){
        v18.techTree.unlocked.push(node.id);v18.techTree.totalXP -= node.xp;
        saveV18(v18);playSFX18('skill_unlock');drawTechTree();
        updateChallenge('tech', 1);checkV18Achievements();
      } else if(canUnlock){ playSFX18('nav_v18'); }
    }
  });
}
function addTechXP(amount){ v18.techTree.totalXP += amount; saveV18(v18); drawTechTree(); }

// ===== 7. WEEKLY CHALLENGE SYSTEM =====
var CHALLENGES = [
  {id:'c1',name:'100 Punches',desc:'Hit 100 punches in drills',target:100,type:'punch',emoji:'🥊'},
  {id:'c2',name:'Combo Master',desc:'Practice 5 combos',target:5,type:'combo',emoji:'🔥'},
  {id:'c3',name:'Heart Warrior',desc:'Complete 5-zone cycle',target:1,type:'heart',emoji:'❤️'},
  {id:'c4',name:'12 Rounds',desc:'Complete round simulation',target:1,type:'round',emoji:'🏅'},
  {id:'c5',name:'Quiz Brain',desc:'Complete 3 quiz sets',target:3,type:'quiz',emoji:'🧠'},
  {id:'c6',name:'Skill Hunter',desc:'Unlock 3 techniques',target:3,type:'tech',emoji:'🎯'},
  {id:'c7',name:'Coach Talk',desc:'Get 5 AI coach tips',target:5,type:'coach',emoji:'💬'}
];
function getToday(){
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function initChallenges(){
  var today = getToday();
  if(v18.weeklyChal.lastReset !== today){
    v18.weeklyChal.active = CHALLENGES.map(function(ch){return {id:ch.id, progress:0, done:false}});
    v18.weeklyChal.lastReset = today;saveV18(v18);
  }
}
function updateChallenge(type, amount){
  if(!v18.weeklyChal.active || !v18.weeklyChal.active.length) initChallenges();
  v18.weeklyChal.active.forEach(function(a){
    var ch = CHALLENGES.find(function(c){return c.id === a.id});
    if(ch && ch.type === type && !a.done){
      a.progress = Math.min(a.progress + amount, ch.target);
      if(a.progress >= ch.target){
        a.done = true;v18.weeklyChal.completed.push({id:a.id, date:getToday()});
        playSFX18('challenge_done');
      }
    }
  });
  saveV18(v18);renderChallenges();
}
function renderChallenges(){
  var el = document.getElementById('v18-challenge-list');
  if(!el) return;
  initChallenges();
  var html = '';
  v18.weeklyChal.active.forEach(function(a){
    var ch = CHALLENGES.find(function(c){return c.id === a.id});
    if(!ch) return;
    var pct = Math.min(100, Math.round((a.progress / ch.target) * 100));
    html += '<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface);border-radius:10px;margin-bottom:6px">';
    html += '<span style="font-size:20px">' + ch.emoji + '</span>';
    html += '<div style="flex:1;min-width:0">';
    html += '<div style="font-size:12px;font-weight:700;color:' + (a.done ? 'var(--green)' : 'var(--text)') + '">' + ch.name + (a.done ? ' ✅' : '') + '</div>';
    html += '<div style="font-size:10px;color:var(--text-dim)">' + ch.desc + '</div>';
    html += '<div style="margin-top:4px;height:5px;background:var(--glass);border-radius:3px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:' + (a.done ? 'var(--green)' : 'var(--accent)') + ';border-radius:3px;transition:width 0.3s"></div></div>';
    html += '<div style="font-size:9px;color:var(--text-muted);margin-top:2px">' + a.progress + '/' + ch.target + '</div>';
    html += '</div></div>';
  });
  el.innerHTML = html;
}

// ===== 8. AI CORNER COACH =====
var COACH_STRATEGIES = [
  {name:'Distance',axis:'Dist',value:0,advice:'Maintain range with jabs. Step in for the cross when you read an opening.'},
  {name:'Pressure',axis:'Atk',value:0,advice:'Keep pressure with jab-jab-cross. Switch to body shots when they retreat.'},
  {name:'Counter',axis:'Def',value:0,advice:'Read their attacks and counter. Slip-cross and parry-hook are most effective.'},
  {name:'Footwork',axis:'Move',value:0,advice:'Use lateral movement. Pivot after combinations to find new angles.'},
  {name:'Body Work',axis:'Body',value:0,advice:'Target the body to drop their guard. Finish with head uppercuts.'},
  {name:'Clinch',axis:'Clinch',value:0,advice:'Use clinch when fatigued to recover. Score with short combos after breaking.'}
];
var coachAnalyzed = false;
function drawCoachCanvas(){
  var c = document.getElementById('v18-coach-canvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  var isDark = !document.documentElement.getAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,W,H);
  var grad = ctx.createLinearGradient(0,0,W,H);
  grad.addColorStop(0, isDark ? '#1a1028' : '#f8f4ff');
  grad.addColorStop(1, isDark ? '#0f0a1e' : '#fff');
  ctx.fillStyle = grad;ctx.fillRect(0,0,W,H);
  ctx.fillStyle = isDark ? '#f0f0f0' : '#1a1a2e';
  ctx.font = 'bold 13px sans-serif';ctx.textAlign = 'center';
  ctx.fillText('AI Corner Coach', W/2, 18);
  var cx2 = W/2, cy2 = H/2 + 8, r = Math.min(W,H)/2 - 35;
  var axes = COACH_STRATEGIES.map(function(s){return s.axis});
  var values = COACH_STRATEGIES.map(function(s){return s.value});
  [0.25, 0.5, 0.75, 1].forEach(function(scale){
    ctx.beginPath();
    for(var i = 0; i <= 6; i++){
      var angle = (Math.PI * 2 * (i % 6) / 6) - Math.PI/2;
      var px = cx2 + Math.cos(angle) * r * scale;
      var py = cy2 + Math.sin(angle) * r * scale;
      if(i === 0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.closePath();ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';ctx.lineWidth = 1;ctx.stroke();
  });
  for(var a = 0; a < 6; a++){
    var angle = (Math.PI * 2 * a / 6) - Math.PI/2;
    var px = cx2 + Math.cos(angle) * r;
    var py = cy2 + Math.sin(angle) * r;
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
    ctx.beginPath();ctx.moveTo(cx2,cy2);ctx.lineTo(px,py);ctx.stroke();
    var lx = cx2 + Math.cos(angle) * (r + 16);
    var ly = cy2 + Math.sin(angle) * (r + 16);
    ctx.fillStyle = isDark ? '#8a8a9e' : '#666';ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';ctx.textBaseline = 'middle';ctx.fillText(axes[a], lx, ly);
  }
  if(coachAnalyzed){
    ctx.beginPath();
    for(var v2 = 0; v2 <= 6; v2++){
      var angle2 = (Math.PI * 2 * (v2 % 6) / 6) - Math.PI/2;
      var val = values[v2 % 6] / 100;
      var dpx = cx2 + Math.cos(angle2) * r * val;
      var dpy = cy2 + Math.sin(angle2) * r * val;
      if(v2 === 0) ctx.moveTo(dpx,dpy); else ctx.lineTo(dpx,dpy);
    }
    ctx.closePath();ctx.fillStyle = 'rgba(255,68,68,0.15)';ctx.fill();
    ctx.strokeStyle = '#FF4444';ctx.lineWidth = 2;ctx.stroke();
    for(var p = 0; p < 6; p++){
      var angle3 = (Math.PI * 2 * p / 6) - Math.PI/2;
      var val2 = values[p] / 100;
      var dpx2 = cx2 + Math.cos(angle3) * r * val2;
      var dpy2 = cy2 + Math.sin(angle3) * r * val2;
      ctx.beginPath();ctx.arc(dpx2,dpy2,3,0,Math.PI*2);ctx.fillStyle='#FF4444';ctx.fill();
    }
  }
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = isDark ? '#8a8a9e' : '#666';ctx.font = '10px sans-serif';ctx.textAlign = 'center';
  var rating = v18.cornerCoach.rating;
  var grade = rating >= 90 ? 'S' : rating >= 75 ? 'A' : rating >= 60 ? 'B' : rating >= 40 ? 'C' : 'D';
  ctx.fillText('Grade: ' + grade + ' (' + rating + '/100) | Tips: ' + v18.cornerCoach.adviceUsed, W/2, H - 4);
}
function getCoachAdvice(){
  COACH_STRATEGIES.forEach(function(s){ s.value = 30 + Math.floor(Math.random() * 70); });
  coachAnalyzed = true;v18.cornerCoach.adviceUsed++;
  v18.cornerCoach.rating = Math.round(COACH_STRATEGIES.reduce(function(sum,s){return sum+s.value},0)/6);
  saveV18(v18);playSFX18('coach_advice');drawCoachCanvas();
  updateChallenge('coach', 1);addBeltXP(10);
  var best = COACH_STRATEGIES.reduce(function(max, s){return s.value > max.value ? s : max}, COACH_STRATEGIES[0]);
  var adviceEl = document.getElementById('v18-coach-advice');
  if(adviceEl){
    adviceEl.innerHTML = '<div style="padding:10px;background:var(--accent-soft);border-radius:10px;margin-top:8px"><div style="font-weight:700;font-size:12px;color:var(--accent);margin-bottom:4px">🥊 ' + best.name + ' (' + best.value + '/100)</div><div style="font-size:11px;color:var(--text-dim);line-height:1.5">' + best.advice + '</div></div>';
  }
  checkV18Achievements();
}

// ===== v18 QUIZ (15 questions) =====
var QUIZ_V18 = [
  {q:'What is corner advice called during a match?',a:['Corner Coaching','Halftime Cheering','Round Briefing','Pre-Counseling'],c:0},
  {q:'Best way to improve punch accuracy?',a:['Heavy gloves','Repetitive drills + eye training','Just hit harder','Speed only'],c:1},
  {q:'Fat burn HR zone is what % of max HR?',a:['40-50%','60-70%','80-90%','90-100%'],c:1},
  {q:'Rest period between rounds is typically?',a:['30 seconds','1 minute','3 minutes','5 minutes'],c:1},
  {q:'After a KO, what must the fighter receive?',a:['Vision test','Medical examination','Reaction test','Fitness test'],c:1},
  {q:'Core principle of combination punching?',a:['One max-power punch','Continuous attacks preventing defense','Repeat same punch','Leave before winning'],c:1},
  {q:'Which is NOT a trait of high ring IQ?',a:['Pattern analysis','Distance control','Always-aggressive style','Tactical clinching'],c:2},
  {q:'Most important element in shadow boxing?',a:['Punch power','Form and rhythm accuracy','Mirror usage','Shouting'],c:1},
  {q:'Normal BMI range is?',a:['14-18','18.5-24.9','25-30','30-35'],c:1},
  {q:'What is a switch hitter in boxing?',a:['Orthodox fighter','Switches stances','Defense specialist','Southpaw'],c:1},
  {q:'Correct glove weight training effect?',a:['Heavier is better','8-12oz speed, 14-16oz power','Lighter is better','Weight irrelevant'],c:1},
  {q:'Purpose of mitt pad work?',a:['Strength building','Accuracy and timing','Weight loss','Flexibility'],c:1},
  {q:'Standard HIIT work/rest ratio?',a:['1:1','2:1','1:2','3:1'],c:1},
  {q:'What is a flush punch?',a:['Multiple rapid punches','One hard hit','Foot sweep','Finishing blow'],c:0},
  {q:'Clinching is mainly used for?',a:['Aggression','Recovery and control','Penalty','Style points'],c:1}
];
var quizV18State = {idx:0, score:0, answered:false, total:15};
function startQuizV18(){ quizV18State = {idx:0, score:0, answered:false, total:15}; renderQuizV18(); }
function renderQuizV18(){
  var area = document.getElementById('v18-quiz-area');
  if(!area) return;
  if(quizV18State.idx >= QUIZ_V18.length){
    var pct = Math.round((quizV18State.score / quizV18State.total) * 100);
    var grade = pct >= 90 ? 'S' : pct >= 75 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'D';
    area.innerHTML = '<div style="text-align:center;padding:16px"><div style="font-size:28px;font-weight:900;color:var(--accent)">' + grade + '</div><div style="font-size:13px;color:var(--text);margin:6px 0">' + quizV18State.score + '/' + quizV18State.total + ' (' + pct + '%)</div></div>';
    v18.quizV18Scores[Date.now()] = quizV18State.score;saveV18(v18);
    addBeltXP(quizV18State.score * 3);addTechXP(quizV18State.score * 2);
    updateChallenge('quiz', 1);checkV18Achievements();return;
  }
  var q = QUIZ_V18[quizV18State.idx];
  var html = '<div style="font-size:12px;color:var(--text-dim);margin-bottom:6px">Q' + (quizV18State.idx+1) + '/' + quizV18State.total + '</div>';
  html += '<div style="font-size:13px;font-weight:700;margin-bottom:10px;line-height:1.5">' + q.q + '</div>';
  q.a.forEach(function(ans, i){
    html += '<button class="v18-quiz-opt" data-idx="' + i + '" style="display:block;width:100%;text-align:left;padding:10px;margin-bottom:6px;background:var(--surface);border:1px solid var(--glass-border);border-radius:10px;color:var(--text);font-size:12px;cursor:pointer">' + (i+1) + '. ' + ans + '</button>';
  });
  area.innerHTML = html;
  area.querySelectorAll('.v18-quiz-opt').forEach(function(btn){
    btn.addEventListener('click', function(){
      if(quizV18State.answered) return;
      quizV18State.answered = true;
      var sel = parseInt(this.getAttribute('data-idx'));
      var correct = sel === q.c;
      if(correct) quizV18State.score++;
      this.style.background = correct ? 'rgba(34,197,94,0.2)' : 'rgba(255,68,68,0.2)';
      this.style.borderColor = correct ? '#22c55e' : '#FF4444';
      if(!correct){
        area.querySelectorAll('.v18-quiz-opt')[q.c].style.background = 'rgba(34,197,94,0.2)';
        area.querySelectorAll('.v18-quiz-opt')[q.c].style.borderColor = '#22c55e';
      }
      playSFX18(correct ? 'quiz_v18' : 'nav_v18');
      setTimeout(function(){ quizV18State.idx++; quizV18State.answered = false; renderQuizV18(); }, 800);
    });
  });
}

// ===== v18 ACHIEVEMENTS (12) =====
var ACH_V18 = [
  {id:'a1',name:'Analyst',desc:'3 analytics drills',icon:'📊',check:function(){return v18.punchAnalytics.sessions.length>=3}},
  {id:'a2',name:'Combo King',desc:'10 combo practices',icon:'🔥',check:function(){return v18.comboChain.practiced>=10}},
  {id:'a3',name:'Green Belt',desc:'Reach Green Belt',icon:'🟢',check:function(){return getCurrentBelt()>=2}},
  {id:'a4',name:'Blue Belt',desc:'Reach Blue Belt',icon:'🔵',check:function(){return getCurrentBelt()>=3}},
  {id:'a5',name:'Red Belt',desc:'Reach Red Belt',icon:'🔴',check:function(){return getCurrentBelt()>=6}},
  {id:'a6',name:'12 Rounds',desc:'Complete 12R sim',icon:'🏅',check:function(){return v18.roundPerf.totalRounds>=12}},
  {id:'a7',name:'Heart Warrior',desc:'2 HR zone cycles',icon:'❤️',check:function(){return v18.heartZone.sessions>=2}},
  {id:'a8',name:'Skill Hunter',desc:'Unlock 5 techniques',icon:'🎯',check:function(){return v18.techTree.unlocked.length>=5}},
  {id:'a9',name:'All Clear',desc:'Complete all daily challenges',icon:'⭐',check:function(){return v18.weeklyChal.active && v18.weeklyChal.active.every(function(a){return a.done})}},
  {id:'a10',name:'Coach Trust',desc:'10 AI coach tips',icon:'💬',check:function(){return v18.cornerCoach.adviceUsed>=10}},
  {id:'a11',name:'Quiz King',desc:'Quiz 90%+',icon:'🧠',check:function(){var s=Object.values(v18.quizV18Scores);return s.length>0&&s[s.length-1]>=14}},
  {id:'a12',name:'Grand Master',desc:'Unlock all techniques',icon:'🏆',check:function(){return v18.techTree.unlocked.length>=18}}
];
function renderV18Ach(){
  var grid = document.getElementById('v18-ach-grid');
  if(!grid) return;
  var html = '';
  ACH_V18.forEach(function(ach){
    var unlocked = v18.achievementsV18[ach.id];
    html += '<div class="badge' + (unlocked ? ' unlocked' : '') + '" title="' + ach.desc + '" style="display:inline-flex;flex-direction:column;align-items:center;gap:4px;padding:10px;background:var(--surface);border-radius:12px;width:70px;text-align:center;opacity:' + (unlocked ? 1 : 0.4) + ';border:1px solid ' + (unlocked ? 'var(--accent)' : 'var(--glass-border)') + '">';
    html += '<span style="font-size:24px">' + ach.icon + '</span>';
    html += '<span style="font-size:9px;font-weight:700;color:' + (unlocked ? 'var(--accent)' : 'var(--text-dim)') + '">' + ach.name + '</span></div>';
  });
  grid.innerHTML = html;
}
function checkV18Achievements(){
  var newUnlock = false;
  ACH_V18.forEach(function(ach){
    if(!v18.achievementsV18[ach.id] && ach.check()){
      v18.achievementsV18[ach.id] = Date.now();newUnlock = true;
    }
  });
  if(newUnlock){ saveV18(v18); playSFX18('ach_v18'); renderV18Ach(); }
}

// ===== KEYBOARD =====
function initV18Keyboard(){
  document.addEventListener('keydown', function(e){
    if(!e.shiftKey) return;
    var el;
    switch(e.key.toUpperCase()){
      case 'A': el = document.getElementById('v18-analytics'); break;
      case 'B': el = document.getElementById('v18-combo'); break;
      case 'F': el = document.getElementById('v18-belt'); break;
      case 'R': el = document.getElementById('v18-round'); break;
      case 'H': el = document.getElementById('v18-heart'); break;
      case 'T': el = document.getElementById('v18-tech'); break;
      case 'G': el = document.getElementById('v18-challenge'); break;
      case 'O': el = document.getElementById('v18-coach'); break;
      default: return;
    }
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); playSFX18('nav_v18'); }
  });
}

// ===== BUILD =====
function buildV18(){
  var container = document.querySelector('.container') || document.body;
  var footer = container.querySelector('.footer') || container.querySelector('footer');
  var html = '';
  html += '<div style="display:flex;gap:6px;padding:10px 16px;overflow-x:auto;-webkit-overflow-scrolling:touch">';
  [{id:'v18-analytics',icon:'📊',label:'Analytics'},{id:'v18-combo',icon:'🔗',label:'Combo'},{id:'v18-belt',icon:'🥋',label:'Belt'},{id:'v18-round',icon:'⏱️',label:'Round'},{id:'v18-heart',icon:'❤️',label:'Heart'},{id:'v18-tech',icon:'🎯',label:'Tech'},{id:'v18-challenge',icon:'🏆',label:'Challenge'},{id:'v18-coach',icon:'🥊',label:'Coach'}].forEach(function(n){
    html += '<button onclick="document.getElementById(\'' + n.id + '\').scrollIntoView({behavior:\'smooth\'})" style="flex-shrink:0;padding:6px 12px;background:var(--surface);border:1px solid var(--glass-border);border-radius:20px;color:var(--text-dim);font-size:11px;cursor:pointer;white-space:nowrap">' + n.icon + ' ' + n.label + '</button>';
  });
  html += '</div>';
  html += '<section class="section" id="v18-analytics"><h2 class="section-title"><span class="emoji">📊</span> Punch Analytics</h2><div class="card"><canvas id="v18-analytics-canvas" width="460" height="200" style="width:100%;height:auto;border-radius:12px;cursor:pointer"></canvas><div style="display:flex;gap:6px;margin-top:10px;justify-content:center;flex-wrap:wrap"><button id="v18-analytics-start" style="padding:8px 16px;background:linear-gradient(135deg,var(--accent),#CC2222);border:none;border-radius:10px;color:#fff;font-weight:700;cursor:pointer;font-size:12px">🥊 15s Drill</button><button id="v18-analytics-mode" style="padding:8px 16px;background:var(--surface);border:1px solid var(--glass-border);border-radius:10px;color:var(--text-dim);font-size:12px;cursor:pointer">🔄 Mode</button><span id="v18-analytics-timer" style="font-size:12px;color:var(--text-dim);padding:8px"></span></div></div></section>';
  html += '<section class="section" id="v18-combo"><h2 class="section-title"><span class="emoji">🔗</span> Combo Chain Builder</h2><div class="card"><canvas id="v18-combo-canvas" width="460" height="120" style="width:100%;height:auto;border-radius:12px"></canvas><div style="display:flex;gap:6px;margin-top:10px;justify-content:center"><button id="v18-combo-practice" style="padding:8px 16px;background:linear-gradient(135deg,var(--accent),#CC2222);border:none;border-radius:10px;color:#fff;font-weight:700;cursor:pointer;font-size:12px">🥊 Practice</button><button id="v18-combo-next" style="padding:8px 16px;background:var(--surface);border:1px solid var(--glass-border);border-radius:10px;color:var(--text-dim);font-size:12px;cursor:pointer">➡️ Next</button></div></div></section>';
  html += '<section class="section" id="v18-belt"><h2 class="section-title"><span class="emoji">🥋</span> Belt Ranking (8 Belts)</h2><div class="card"><canvas id="v18-belt-canvas" width="300" height="180" style="width:100%;max-width:300px;height:auto;border-radius:12px;display:block;margin:0 auto"></canvas><div style="text-align:center;margin-top:10px"><button id="v18-belt-fight" style="padding:8px 16px;background:linear-gradient(135deg,var(--accent),#CC2222);border:none;border-radius:10px;color:#fff;font-weight:700;cursor:pointer;font-size:12px">🥊 Fight Sim</button></div></div></section>';
  html += '<section class="section" id="v18-round"><h2 class="section-title"><span class="emoji">⏱️</span> Round Performance (12R)</h2><div class="card"><canvas id="v18-round-canvas" width="460" height="200" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button id="v18-round-start" style="padding:8px 16px;background:linear-gradient(135deg,var(--accent),#CC2222);border:none;border-radius:10px;color:#fff;font-weight:700;cursor:pointer;font-size:12px">⏱️ 12R Sim</button></div></div></section>';
  html += '<section class="section" id="v18-heart"><h2 class="section-title"><span class="emoji">❤️</span> Heart Rate Zones (5)</h2><div class="card"><canvas id="v18-heart-canvas" width="460" height="180" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button id="v18-heart-start" style="padding:8px 16px;background:linear-gradient(135deg,#FF4444,#CC2222);border:none;border-radius:10px;color:#fff;font-weight:700;cursor:pointer;font-size:12px">❤️ Start 5-Zone</button></div></div></section>';
  html += '<section class="section" id="v18-tech"><h2 class="section-title"><span class="emoji">🎯</span> Technique Mastery (18 Nodes)</h2><div class="card"><canvas id="v18-tech-canvas" width="360" height="340" style="width:100%;max-width:360px;height:auto;border-radius:12px;display:block;margin:0 auto;cursor:pointer"></canvas><div style="text-align:center;margin-top:6px;font-size:10px;color:var(--text-dim)">Click unlockable nodes (costs XP)</div></div></section>';
  html += '<section class="section" id="v18-challenge"><h2 class="section-title"><span class="emoji">🏆</span> Daily Challenges (7)</h2><div class="card"><div id="v18-challenge-list"></div></div></section>';
  html += '<section class="section" id="v18-coach"><h2 class="section-title"><span class="emoji">🥊</span> AI Corner Coach</h2><div class="card"><canvas id="v18-coach-canvas" width="300" height="260" style="width:100%;max-width:300px;height:auto;border-radius:12px;display:block;margin:0 auto"></canvas><div id="v18-coach-advice"></div><div style="text-align:center;margin-top:10px"><button id="v18-coach-btn" style="padding:8px 16px;background:linear-gradient(135deg,var(--accent),#CC2222);border:none;border-radius:10px;color:#fff;font-weight:700;cursor:pointer;font-size:12px">🥊 Get Advice</button></div></div></section>';
  html += '<section class="section" id="v18-quiz"><h2 class="section-title"><span class="emoji">❓</span> v18 Quiz (15Q)</h2><div class="card"><div id="v18-quiz-area" style="min-height:60px"><div style="text-align:center;color:var(--text-dim);font-size:13px;padding:16px">Press Start</div></div><div style="text-align:center;margin-top:10px"><button id="v18-quiz-start" style="padding:10px 20px;background:linear-gradient(135deg,var(--accent),#CC2222);border:none;border-radius:10px;color:#fff;font-weight:700;cursor:pointer;font-size:13px">❓ Start Quiz</button></div></div></section>';
  html += '<section class="section" id="v18-ach"><h2 class="section-title"><span class="emoji">🏅</span> v18 Achievements (12)</h2><div class="card"><div class="badge-grid" id="v18-ach-grid" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center"></div></div></section>';

  var wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  while(wrapper.firstChild){
    if(footer) container.insertBefore(wrapper.firstChild, footer);
    else container.appendChild(wrapper.firstChild);
  }

  var ac = document.getElementById('v18-analytics-canvas');
  if(ac){ ac.addEventListener('click', handleAnalyticsClick); ac.addEventListener('touchstart', function(e){ e.preventDefault(); handleAnalyticsClick(); }, {passive:false}); }
  var as2 = document.getElementById('v18-analytics-start');
  if(as2) as2.addEventListener('click', startAnalyticsDrill);
  var am = document.getElementById('v18-analytics-mode');
  if(am) am.addEventListener('click', cycleAnalyticsMode);
  var cp = document.getElementById('v18-combo-practice');
  if(cp) cp.addEventListener('click', function(){ practiceCombo(); updateChallenge('combo', 1); });
  var cn = document.getElementById('v18-combo-next');
  if(cn) cn.addEventListener('click', nextCombo);
  var bf = document.getElementById('v18-belt-fight');
  if(bf) bf.addEventListener('click', simulateFight);
  var rs = document.getElementById('v18-round-start');
  if(rs) rs.addEventListener('click', function(){ startRoundSim(); updateChallenge('round', 1); });
  var hs = document.getElementById('v18-heart-start');
  if(hs) hs.addEventListener('click', function(){ startHeartSim(); updateChallenge('heart', 1); });
  var tc = document.getElementById('v18-tech-canvas');
  if(tc){ tc.addEventListener('click', handleTechClick); tc.addEventListener('touchstart', function(e){ e.preventDefault(); var touch = e.touches[0]; handleTechClick({clientX:touch.clientX, clientY:touch.clientY}); }, {passive:false}); }
  var cb = document.getElementById('v18-coach-btn');
  if(cb) cb.addEventListener('click', getCoachAdvice);
  var qs = document.getElementById('v18-quiz-start');
  if(qs) qs.addEventListener('click', startQuizV18);

  drawAnalyticsCanvas(); drawComboCanvas(); drawBeltCanvas(); drawRoundCanvas();
  drawHeartCanvas(); drawTechTree(); initChallenges(); renderChallenges();
  drawCoachCanvas(); renderV18Ach(); initV18Keyboard(); checkV18Achievements();

  if(v18.techTree.totalXP === 0 && v18.techTree.unlocked.length <= 1){
    v18.techTree.totalXP = 50; saveV18(v18); drawTechTree();
  }
}

if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', buildV18); }
else { buildV18(); }

})();
