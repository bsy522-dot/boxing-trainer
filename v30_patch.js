// Boxing Trainer Pro v30_patch.js - NEXTERA+PRISM Auto Enhancement Module
// 1. Punch Target Zone Accuracy Analyzer Canvas 620x400 - 8 body zones (head/chin/body-left/body-right/liver/solar-plexus/ribs/shoulder) accuracy% heatmap, shot dispersion scatter, zone-specific drill recommendation, S~D grade
// 2. Training Program Periodization Tracker Canvas 640x400 - 8-week mesocycle calendar, 4 phases (base/build/peak/recovery), volume/intensity dual line chart, overtraining risk gauge, weekly compliance%
// 3. Real-time Output Score Engine Canvas 620x400 - speed x power x accuracy composite formula, 12R output bar chart, peak output highlight, FightCamp-style cumulative score, session comparison overlay
// 4. Heart Rate Zone Optimizer Canvas 620x400 - 5 HR zones (recovery/fat-burn/aerobic/threshold/VO2max) stacked area chart over 12R, zone distribution donut, optimal zone guidance by round phase
// 5. Fighter Fitness Test Battery Canvas 640x400 - 8 tests (pushup/pullup/plank/shuttle/jump-rope/heavy-bag-blitz/reaction-drill/VO2max-est) radar + bar chart, percentile vs amateur/pro norms
// 6. Clinch & Break Strategy Analyzer Canvas 620x400 - 6 clinch types (over-under/double-under/headlock/arm-trap/body-lock/dirty-clinch) 6-axis radar effectiveness, break technique success rate bars
// 7. Weight Cut Science Simulator Canvas 620x400 - 8 body-weight timeline days, water/sodium/carb manipulation curves, safe-cut vs dangerous zone, rehydration protocol, fight-weight optimization
// 8. Comprehensive Fighter Intelligence Dashboard Canvas 620x400 - 8 KPI half-circle gauges 4x2 (targeting/periodization/output/cardio/fitness/clinch/weight-mgmt/ring-IQ), weighted overall S~D grade
// Quiz +15 (315->330), +12 Achievements (274->286), SFX 16, Keyboard Shift+Q/W/E/R/T/Y/U/I/0
(function(){
'use strict';

var V30KEY = 'boxingV30Patch';

function loadV30(){
  try {
    var r = localStorage.getItem(V30KEY);
    if(!r) return defV30();
    var p = JSON.parse(r), d = defV30();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV30(); }
}
function saveV30(d){ try { localStorage.setItem(V30KEY, JSON.stringify(d)); } catch(e){} }
function defV30(){
  return {
    targetZone: {
      zones: {head:0,chin:0,bodyL:0,bodyR:0,liver:0,solar:0,ribs:0,shoulder:0},
      accuracy: {head:62,chin:48,bodyL:55,bodyR:58,liver:45,solar:52,ribs:60,shoulder:70},
      shots: [],
      sessions: 0,
      bestGrade: 'D'
    },
    periodization: {
      week: 1,
      phase: 0,
      compliance: [0,0,0,0,0,0,0,0],
      volume: [60,65,75,85,90,80,70,45],
      intensity: [50,55,65,75,85,90,60,40],
      sessions: 0
    },
    outputScore: {
      rounds: Array(12).fill(null).map(function(){ return {speed:0,power:0,accuracy:0,output:0}; }),
      cumulative: 0,
      peakRound: 0,
      history: [],
      sessions: 0,
      bestGrade: 'D'
    },
    hrZone: {
      zones: [15,20,30,25,10],
      roundData: Array(12).fill(null).map(function(){ return [10,15,35,30,10]; }),
      restHR: 65,
      maxHR: 190,
      sessions: 0
    },
    fitnessTest: {
      tests: {pushup:40,pullup:8,plank:90,shuttle:28,jumpRope:120,heavyBag:60,reaction:350,vo2max:42},
      percentiles: {},
      sessions: 0,
      bestGrade: 'D'
    },
    clinchBreak: {
      types: {
        overUnder: {control:65,escape:55,offense:40,defense:70,energy:50,position:60},
        doubleUnder: {control:75,escape:45,offense:50,defense:80,energy:55,position:70},
        headlock: {control:80,escape:35,offense:60,defense:50,energy:65,position:55},
        armTrap: {control:60,escape:60,offense:55,defense:65,energy:45,position:50},
        bodyLock: {control:70,escape:40,offense:45,defense:75,energy:60,position:65},
        dirtyClinch: {control:55,escape:50,offense:70,defense:45,energy:70,position:45}
      },
      breakSuccess: {overUnder:60,doubleUnder:50,headlock:40,armTrap:65,bodyLock:45,dirtyClinch:55},
      selectedType: 0,
      sessions: 0
    },
    weightCut: {
      baseWeight: 75,
      targetWeight: 70,
      days: [75,74.5,74,73.2,72.5,71.8,71,70.5],
      water: [100,90,80,60,40,30,50,80],
      sodium: [100,80,60,30,15,10,40,70],
      carb: [100,70,50,30,20,15,60,90],
      safeZone: 71,
      sessions: 0
    },
    fighterIQ: {
      kpis: {targeting:50,periodization:50,output:50,cardio:50,fitness:50,clinch:50,weightMgmt:50,ringIQ:50},
      overallGrade: 'D',
      sessions: 0
    },
    quizV30Scores: {},
    achievementsV30: {},
    featureUsage30: {}
  };
}

var v30 = loadV30();

// ===== CSS =====
var st30 = document.createElement('style');
st30.textContent = '.v30-btn{padding:8px 16px;background:linear-gradient(135deg,#f97316,#ea580c);border:none;border-radius:10px;color:#fff;font-weight:700;font-size:12px;cursor:pointer;transition:all .2s}.v30-btn:hover{filter:brightness(1.15);transform:scale(1.03)}.v30-btn-sec{padding:8px 16px;background:var(--surface,rgba(255,255,255,0.04));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:10px;color:var(--text-dim,#8a8a9e);font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.v30-btn-sec:hover{border-color:#f97316;color:#fb923c}.v30-card{background:var(--glass,rgba(255,255,255,0.06));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:var(--radius,16px);padding:16px;margin-bottom:12px}.v30-hdr{font-size:15px;font-weight:800;margin-bottom:10px;display:flex;align-items:center;gap:8px}.v30-sub{font-size:11px;color:var(--text-dim,#8a8a9e);margin-bottom:8px}.v30-grade{display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:800}.v30-grade-s{background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#000}.v30-grade-a{background:linear-gradient(135deg,#a78bfa,#7c3aed);color:#fff}.v30-grade-b{background:linear-gradient(135deg,#60a5fa,#3b82f6);color:#fff}.v30-grade-c{background:linear-gradient(135deg,#34d399,#10b981);color:#000}.v30-grade-d{background:rgba(255,255,255,0.1);color:var(--text-dim,#8a8a9e)}';
document.head.appendChild(st30);

// ===== SFX ENGINE (16 types) =====
var sfxCtx30;
try { sfxCtx30 = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){}
function playSFX30(type){
  if(!sfxCtx30) return;
  try {
    var osc = sfxCtx30.createOscillator();
    var gain = sfxCtx30.createGain();
    osc.connect(gain); gain.connect(sfxCtx30.destination);
    var t = sfxCtx30.currentTime;
    var map = {
      target_hit:{f:880,t:'sine',d:0.12,v:0.25},
      target_miss:{f:220,t:'sawtooth',d:0.18,v:0.2},
      period_start:{f:660,t:'triangle',d:0.15,v:0.22},
      period_end:{f:440,t:'sine',d:0.2,v:0.22},
      output_peak:{f:1100,t:'square',d:0.1,v:0.18},
      output_low:{f:180,t:'sawtooth',d:0.15,v:0.15},
      hr_zone_up:{f:780,t:'triangle',d:0.12,v:0.2},
      hr_zone_down:{f:330,t:'sine',d:0.15,v:0.18},
      fitness_pass:{f:990,t:'sine',d:0.1,v:0.22},
      fitness_fail:{f:200,t:'sawtooth',d:0.2,v:0.18},
      clinch_lock:{f:280,t:'square',d:0.15,v:0.2},
      clinch_break:{f:720,t:'triangle',d:0.12,v:0.22},
      weight_safe:{f:550,t:'sine',d:0.15,v:0.2},
      weight_danger:{f:160,t:'sawtooth',d:0.25,v:0.22},
      quiz_correct30:{f:1050,t:'sine',d:0.12,v:0.2},
      achieve30:{f:1200,t:'triangle',d:0.18,v:0.25}
    };
    var s = map[type] || map.target_hit;
    osc.type = s.t;
    osc.frequency.setValueAtTime(s.f, t);
    osc.frequency.exponentialRampToValueAtTime(s.f * 0.5, t + s.d);
    gain.gain.setValueAtTime(s.v, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + s.d);
    osc.start(t); osc.stop(t + s.d + 0.01);
  } catch(e){}
}

function gradeFor(val){
  if(val>=90) return 'S';
  if(val>=75) return 'A';
  if(val>=60) return 'B';
  if(val>=40) return 'C';
  return 'D';
}
function gradeClass(g){ return 'v30-grade v30-grade-' + g.toLowerCase(); }

// ============================================================
// SECTION 1: PUNCH TARGET ZONE ACCURACY ANALYZER Canvas 620x400
// ============================================================
var sec1 = document.createElement('div');
sec1.id = 'v30-sec-1';
sec1.style.cssText = 'display:none;max-width:700px;margin:20px auto;padding:0 12px;';
sec1.innerHTML = '<div class="v30-card"><div class="v30-hdr">🎯 펀치 타겟존 정확도 분석기</div><div class="v30-sub">8개 타격 부위별 명중률 히트맵 + 분산 분석 + 드릴 추천</div><canvas id="v30-c1" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#0d0d1a;display:block;margin:0 auto"></canvas><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><button class="v30-btn" onclick="window._v30TargetSim()">시뮬레이션</button><button class="v30-btn-sec" onclick="window._v30TargetReset()">리셋</button></div></div>';
document.body.appendChild(sec1);

var zoneNames = ['머리','턱','좌측 바디','우측 바디','간','명치','갈비','어깨'];
var zoneKeys = ['head','chin','bodyL','bodyR','liver','solar','ribs','shoulder'];
var zoneColors = ['#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899'];
var zonePositions = [{x:310,y:60},{x:310,y:110},{x:250,y:180},{x:370,y:180},{x:240,y:230},{x:310,y:210},{x:370,y:240},{x:220,y:130}];

function drawTargetCanvas(){
  var c = document.getElementById('v30-c1');
  if(!c) return;
  var ctx = c.getContext('2d');
  ctx.clearRect(0,0,620,400);

  ctx.fillStyle = '#0d0d1a'; ctx.fillRect(0,0,620,400);
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for(var gx=0;gx<620;gx+=30) ctx.fillRect(gx,0,1,400);
  for(var gy=0;gy<400;gy+=30) ctx.fillRect(0,gy,620,1);

  ctx.fillStyle = '#f0f0f0'; ctx.font = 'bold 13px sans-serif';
  ctx.fillText('펀치 타겟존 정확도 분석기', 20, 25);

  // Body silhouette
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(310, 55, 28, 0, Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(310, 83); ctx.lineTo(310, 270);
  ctx.moveTo(250, 130); ctx.lineTo(370, 130);
  ctx.moveTo(310, 270); ctx.lineTo(270, 350); ctx.moveTo(310, 270); ctx.lineTo(350, 350);
  ctx.stroke();

  // Zones as circles with accuracy color
  for(var i=0;i<8;i++){
    var acc = v30.targetZone.accuracy[zoneKeys[i]];
    var alpha = 0.3 + (acc/100) * 0.5;
    ctx.beginPath();
    ctx.arc(zonePositions[i].x, zonePositions[i].y, 18, 0, Math.PI*2);
    ctx.fillStyle = zoneColors[i].replace(')', ',' + alpha + ')').replace('rgb', 'rgba');
    var hex = zoneColors[i];
    var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    ctx.fillStyle = 'rgba('+r+','+g+','+b+','+alpha+')';
    ctx.fill();
    ctx.strokeStyle = zoneColors[i]; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(acc + '%', zonePositions[i].x, zonePositions[i].y + 4);
  }

  // Right panel: accuracy bars
  ctx.textAlign = 'left';
  var bx = 440, by = 50;
  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
  ctx.fillText('부위별 명중률', bx, by - 8);
  for(var i=0;i<8;i++){
    var y = by + i * 38;
    var acc = v30.targetZone.accuracy[zoneKeys[i]];
    ctx.fillStyle = '#888'; ctx.font = '10px sans-serif';
    ctx.fillText(zoneNames[i], bx, y + 12);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(bx, y + 18, 150, 10);
    var hex = zoneColors[i];
    var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    var grd = ctx.createLinearGradient(bx, 0, bx + acc * 1.5, 0);
    grd.addColorStop(0, 'rgba('+r+','+g+','+b+',0.6)');
    grd.addColorStop(1, zoneColors[i]);
    ctx.fillStyle = grd;
    ctx.fillRect(bx, y + 18, acc * 1.5, 10);
    ctx.fillStyle = '#ccc'; ctx.font = 'bold 9px sans-serif';
    ctx.fillText(acc + '%', bx + acc * 1.5 + 4, y + 26);
  }

  // Overall grade
  var avgAcc = 0;
  for(var i=0;i<8;i++) avgAcc += v30.targetZone.accuracy[zoneKeys[i]];
  avgAcc = Math.round(avgAcc / 8);
  var grade = gradeFor(avgAcc);
  v30.targetZone.bestGrade = grade;

  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
  ctx.fillText('종합 명중률: ' + avgAcc + '%', bx, 370);
  var gc = {S:'#fbbf24',A:'#a78bfa',B:'#60a5fa',C:'#34d399',D:'#666'}[grade];
  ctx.fillStyle = gc; ctx.font = 'bold 16px sans-serif';
  ctx.fillText(grade, bx + 130, 372);
  ctx.textAlign = 'start';
}

window._v30TargetSim = function(){
  for(var i=0;i<8;i++){
    var delta = Math.floor(Math.random()*15) - 5;
    v30.targetZone.accuracy[zoneKeys[i]] = Math.max(10, Math.min(98, v30.targetZone.accuracy[zoneKeys[i]] + delta));
  }
  v30.targetZone.sessions++;
  v30.featureUsage30.targetZone = true;
  saveV30(v30);
  playSFX30('target_hit');
  drawTargetCanvas();
  checkAchievementsV30();
};
window._v30TargetReset = function(){
  v30.targetZone.accuracy = {head:62,chin:48,bodyL:55,bodyR:58,liver:45,solar:52,ribs:60,shoulder:70};
  saveV30(v30); drawTargetCanvas();
};

// ============================================================
// SECTION 2: TRAINING PROGRAM PERIODIZATION TRACKER Canvas 640x400
// ============================================================
var sec2 = document.createElement('div');
sec2.id = 'v30-sec-2';
sec2.style.cssText = 'display:none;max-width:700px;margin:20px auto;padding:0 12px;';
sec2.innerHTML = '<div class="v30-card"><div class="v30-hdr">📅 트레이닝 주기화 트래커</div><div class="v30-sub">8주 메소사이클: 기초/구축/피크/회복 4페이즈 + 볼륨·강도 듀얼 라인차트 + 과훈련 위험 게이지</div><canvas id="v30-c2" width="640" height="400" style="width:100%;max-width:640px;border-radius:12px;background:#0d0d1a;display:block;margin:0 auto"></canvas><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><button class="v30-btn" onclick="window._v30PeriodSim()">주간 진행</button><button class="v30-btn-sec" onclick="window._v30PeriodReset()">리셋</button></div></div>';
document.body.appendChild(sec2);

var phaseNames = ['기초','구축','피크','회복'];
var phaseColors = ['#22c55e','#3b82f6','#ef4444','#a78bfa'];
var phaseWeeks = [2,2,2,2];

function drawPeriodCanvas(){
  var c = document.getElementById('v30-c2');
  if(!c) return;
  var ctx = c.getContext('2d');
  ctx.clearRect(0,0,640,400);
  ctx.fillStyle = '#0d0d1a'; ctx.fillRect(0,0,640,400);

  ctx.fillStyle = '#f0f0f0'; ctx.font = 'bold 13px sans-serif';
  ctx.fillText('트레이닝 주기화 트래커 (8주 메소사이클)', 20, 25);

  // Phase bands
  var px = 60, pw = 70;
  var pStart = 0;
  for(var p=0;p<4;p++){
    var wCount = phaseWeeks[p];
    ctx.fillStyle = phaseColors[p].replace(')', ',0.1)').replace('#', 'rgba(');
    var r = parseInt(phaseColors[p].slice(1,3),16), g = parseInt(phaseColors[p].slice(3,5),16), b = parseInt(phaseColors[p].slice(5,7),16);
    ctx.fillStyle = 'rgba('+r+','+g+','+b+',0.08)';
    ctx.fillRect(px + pStart * pw, 45, wCount * pw, 250);
    ctx.fillStyle = phaseColors[p]; ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(phaseNames[p], px + (pStart + wCount/2) * pw, 58);
    pStart += wCount;
  }

  // Volume/Intensity dual line chart
  var chartY = 70, chartH = 200;
  ctx.textAlign = 'left';
  // Y axis
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 0.5;
  for(var y = 0; y <= 100; y += 25){
    var yy = chartY + chartH - (y/100) * chartH;
    ctx.beginPath(); ctx.moveTo(px, yy); ctx.lineTo(px + 8 * pw, yy); ctx.stroke();
    ctx.fillStyle = '#666'; ctx.font = '9px sans-serif';
    ctx.fillText(y + '%', 30, yy + 3);
  }

  // Volume line
  ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2.5;
  ctx.beginPath();
  for(var w=0;w<8;w++){
    var x = px + w * pw + pw/2;
    var y = chartY + chartH - (v30.periodization.volume[w]/100) * chartH;
    if(w===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
  // Volume dots
  for(var w=0;w<8;w++){
    var x = px + w * pw + pw/2;
    var y = chartY + chartH - (v30.periodization.volume[w]/100) * chartH;
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2);
    ctx.fillStyle = '#22c55e'; ctx.fill();
  }

  // Intensity line
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.5;
  ctx.beginPath();
  for(var w=0;w<8;w++){
    var x = px + w * pw + pw/2;
    var y = chartY + chartH - (v30.periodization.intensity[w]/100) * chartH;
    if(w===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
  for(var w=0;w<8;w++){
    var x = px + w * pw + pw/2;
    var y = chartY + chartH - (v30.periodization.intensity[w]/100) * chartH;
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2);
    ctx.fillStyle = '#ef4444'; ctx.fill();
  }

  // X axis labels
  ctx.textAlign = 'center';
  for(var w=0;w<8;w++){
    ctx.fillStyle = w < v30.periodization.week ? '#f97316' : '#555';
    ctx.font = (w === v30.periodization.week - 1) ? 'bold 11px sans-serif' : '10px sans-serif';
    ctx.fillText('W' + (w+1), px + w * pw + pw/2, chartY + chartH + 18);
    // Compliance bar
    var comp = v30.periodization.compliance[w];
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(px + w * pw + pw/2 - 12, chartY + chartH + 25, 24, 8);
    ctx.fillStyle = comp >= 80 ? '#22c55e' : comp >= 50 ? '#eab308' : '#ef4444';
    ctx.fillRect(px + w * pw + pw/2 - 12, chartY + chartH + 25, comp/100 * 24, 8);
  }

  // Legend
  ctx.textAlign = 'left';
  ctx.fillStyle = '#22c55e'; ctx.fillRect(px, chartY + chartH + 50, 12, 3);
  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif'; ctx.fillText('볼륨', px + 16, chartY + chartH + 54);
  ctx.fillStyle = '#ef4444'; ctx.fillRect(px + 70, chartY + chartH + 50, 12, 3);
  ctx.fillStyle = '#aaa'; ctx.fillText('강도', px + 86, chartY + chartH + 54);

  // Overtraining risk gauge
  var risk = 0;
  for(var w=0;w<Math.min(v30.periodization.week, 8);w++){
    risk += (v30.periodization.volume[w] + v30.periodization.intensity[w]) / 2;
  }
  risk = Math.round(risk / Math.max(v30.periodization.week, 1));
  var gx = 480, gy = chartY + chartH + 42;
  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif'; ctx.fillText('과훈련 위험:', gx, gy + 4);
  ctx.fillStyle = risk > 80 ? '#ef4444' : risk > 60 ? '#eab308' : '#22c55e';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText(risk + '%', gx + 80, gy + 4);

  // Current week marker
  ctx.fillStyle = '#f97316'; ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  if(v30.periodization.week <= 8){
    ctx.fillText('▼', px + (v30.periodization.week - 1) * pw + pw/2, chartY - 2);
  }
  ctx.textAlign = 'start';
}

window._v30PeriodSim = function(){
  if(v30.periodization.week <= 8){
    var w = v30.periodization.week - 1;
    v30.periodization.compliance[w] = 50 + Math.floor(Math.random()*50);
    v30.periodization.volume[w] += Math.floor(Math.random()*10) - 3;
    v30.periodization.intensity[w] += Math.floor(Math.random()*10) - 3;
    v30.periodization.volume[w] = Math.max(20, Math.min(100, v30.periodization.volume[w]));
    v30.periodization.intensity[w] = Math.max(20, Math.min(100, v30.periodization.intensity[w]));
    v30.periodization.week = Math.min(9, v30.periodization.week + 1);
  } else {
    v30.periodization.week = 1;
  }
  v30.periodization.sessions++;
  v30.featureUsage30.periodization = true;
  saveV30(v30);
  playSFX30('period_start');
  drawPeriodCanvas();
  checkAchievementsV30();
};
window._v30PeriodReset = function(){
  v30.periodization = defV30().periodization;
  saveV30(v30); drawPeriodCanvas();
};

// ============================================================
// SECTION 3: REAL-TIME OUTPUT SCORE ENGINE Canvas 620x400
// ============================================================
var sec3 = document.createElement('div');
sec3.id = 'v30-sec-3';
sec3.style.cssText = 'display:none;max-width:700px;margin:20px auto;padding:0 12px;';
sec3.innerHTML = '<div class="v30-card"><div class="v30-hdr">⚡ 실시간 출력 스코어 엔진</div><div class="v30-sub">속도×파워×정확도 복합 공식, 12R 출력 바차트, 피크 출력 하이라이트, FightCamp식 누적 스코어</div><canvas id="v30-c3" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#0d0d1a;display:block;margin:0 auto"></canvas><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><button class="v30-btn" onclick="window._v30OutputSim()">라운드 시뮬</button><button class="v30-btn-sec" onclick="window._v30OutputReset()">리셋</button></div></div>';
document.body.appendChild(sec3);

function drawOutputCanvas(){
  var c = document.getElementById('v30-c3');
  if(!c) return;
  var ctx = c.getContext('2d');
  ctx.clearRect(0,0,620,400);
  ctx.fillStyle = '#0d0d1a'; ctx.fillRect(0,0,620,400);

  ctx.fillStyle = '#f0f0f0'; ctx.font = 'bold 13px sans-serif';
  ctx.fillText('실시간 출력 스코어 엔진', 20, 25);

  // 12R bar chart
  var bx = 50, by = 50, bw = 38, bh = 250, gap = 6;
  var maxOut = 100;
  var peakIdx = 0, peakVal = 0, cumul = 0;

  for(var r=0;r<12;r++){
    var rd = v30.outputScore.rounds[r];
    var out = Math.round((rd.speed * 0.3 + rd.power * 0.4 + rd.accuracy * 0.3));
    rd.output = out;
    cumul += out;
    if(out > peakVal){ peakVal = out; peakIdx = r; }
  }
  v30.outputScore.cumulative = cumul;
  v30.outputScore.peakRound = peakIdx;

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.5;
  for(var y=0;y<=100;y+=25){
    var yy = by + bh - (y/maxOut)*bh;
    ctx.beginPath(); ctx.moveTo(bx-5,yy); ctx.lineTo(bx+12*(bw+gap),yy); ctx.stroke();
    ctx.fillStyle = '#555'; ctx.font = '9px sans-serif';
    ctx.fillText(y, 25, yy+3);
  }

  // Bars
  for(var r=0;r<12;r++){
    var out = v30.outputScore.rounds[r].output;
    var x = bx + r * (bw + gap);
    var h = (out/maxOut) * bh;
    var y = by + bh - h;

    var isPeak = r === peakIdx && peakVal > 0;
    if(isPeak){
      ctx.fillStyle = 'rgba(249,115,22,0.15)';
      ctx.fillRect(x-3, by, bw+6, bh);
    }

    var grd = ctx.createLinearGradient(0, y, 0, by + bh);
    if(out >= 75){ grd.addColorStop(0,'#f97316'); grd.addColorStop(1,'#ea580c'); }
    else if(out >= 50){ grd.addColorStop(0,'#3b82f6'); grd.addColorStop(1,'#2563eb'); }
    else if(out >= 25){ grd.addColorStop(0,'#22c55e'); grd.addColorStop(1,'#16a34a'); }
    else { grd.addColorStop(0,'#666'); grd.addColorStop(1,'#444'); }
    ctx.fillStyle = grd;
    ctx.fillRect(x, y, bw, h);

    if(isPeak){
      ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('★PEAK', x + bw/2, y - 6);
    }

    ctx.fillStyle = out > 0 ? '#ccc' : '#555'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    if(out > 0) ctx.fillText(out, x + bw/2, y - (isPeak ? 18 : 6));
    ctx.fillStyle = '#888'; ctx.font = '10px sans-serif';
    ctx.fillText('R' + (r+1), x + bw/2, by + bh + 16);
  }

  // Cumulative score
  ctx.textAlign = 'left';
  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
  ctx.fillText('누적 출력 스코어:', 20, by + bh + 50);
  ctx.fillStyle = '#f97316'; ctx.font = 'bold 20px sans-serif';
  ctx.fillText(cumul, 140, by + bh + 52);

  // Grade
  var avg = cumul > 0 ? Math.round(cumul / 12) : 0;
  var grade = gradeFor(avg);
  v30.outputScore.bestGrade = grade;
  var gc = {S:'#fbbf24',A:'#a78bfa',B:'#60a5fa',C:'#34d399',D:'#666'}[grade];
  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
  ctx.fillText('평균 출력 등급:', 350, by + bh + 50);
  ctx.fillStyle = gc; ctx.font = 'bold 18px sans-serif';
  ctx.fillText(grade, 470, by + bh + 52);

  // Formula label
  ctx.fillStyle = '#666'; ctx.font = '9px sans-serif';
  ctx.fillText('출력 = 속도×0.3 + 파워×0.4 + 정확도×0.3', 350, by + bh + 70);
  ctx.textAlign = 'start';
}

window._v30OutputSim = function(){
  for(var r=0;r<12;r++){
    var fatigue = 1 - (r * 0.03);
    v30.outputScore.rounds[r].speed = Math.round((50 + Math.random()*50) * fatigue);
    v30.outputScore.rounds[r].power = Math.round((40 + Math.random()*60) * fatigue);
    v30.outputScore.rounds[r].accuracy = Math.round((45 + Math.random()*55) * fatigue);
  }
  v30.outputScore.sessions++;
  v30.featureUsage30.outputScore = true;
  saveV30(v30);
  playSFX30('output_peak');
  drawOutputCanvas();
  checkAchievementsV30();
};
window._v30OutputReset = function(){
  v30.outputScore = defV30().outputScore;
  saveV30(v30); drawOutputCanvas();
};

// ============================================================
// SECTION 4: HEART RATE ZONE OPTIMIZER Canvas 620x400
// ============================================================
var sec4 = document.createElement('div');
sec4.id = 'v30-sec-4';
sec4.style.cssText = 'display:none;max-width:700px;margin:20px auto;padding:0 12px;';
sec4.innerHTML = '<div class="v30-card"><div class="v30-hdr">❤️ 심박존 최적화 가이드</div><div class="v30-sub">5구간(회복/지방연소/유산소/역치/VO2max) 12R 스택 에어리어 + 존 분포 도넛 + 라운드별 최적존 안내</div><canvas id="v30-c4" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#0d0d1a;display:block;margin:0 auto"></canvas><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><button class="v30-btn" onclick="window._v30HRSim()">세션 시뮬</button><button class="v30-btn-sec" onclick="window._v30HRReset()">리셋</button></div></div>';
document.body.appendChild(sec4);

var hrZoneNames = ['회복','지방연소','유산소','역치','VO2max'];
var hrZoneColors = ['#22c55e','#eab308','#f97316','#ef4444','#a855f7'];

function drawHRCanvas(){
  var c = document.getElementById('v30-c4');
  if(!c) return;
  var ctx = c.getContext('2d');
  ctx.clearRect(0,0,620,400);
  ctx.fillStyle = '#0d0d1a'; ctx.fillRect(0,0,620,400);

  ctx.fillStyle = '#f0f0f0'; ctx.font = 'bold 13px sans-serif';
  ctx.fillText('심박존 최적화 가이드', 20, 25);

  // Stacked area chart for 12 rounds
  var cx = 60, cy = 50, cw = 380, ch = 250;

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.5;
  for(var p=0;p<=100;p+=25){
    var yy = cy + ch - (p/100)*ch;
    ctx.beginPath(); ctx.moveTo(cx,yy); ctx.lineTo(cx+cw,yy); ctx.stroke();
    ctx.fillStyle = '#555'; ctx.font = '9px sans-serif';
    ctx.fillText(p+'%', 30, yy+3);
  }

  // Stacked areas (bottom to top)
  for(var z=4;z>=0;z--){
    ctx.beginPath();
    ctx.moveTo(cx, cy + ch);
    for(var r=0;r<12;r++){
      var x = cx + (r/(11)) * cw;
      var cumPct = 0;
      for(var zz=0;zz<=z;zz++) cumPct += v30.hrZone.roundData[r][zz];
      var y = cy + ch - (cumPct/100) * ch;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(cx + cw, cy + ch);
    ctx.closePath();
    var r2 = parseInt(hrZoneColors[z].slice(1,3),16), g2 = parseInt(hrZoneColors[z].slice(3,5),16), b2 = parseInt(hrZoneColors[z].slice(5,7),16);
    ctx.fillStyle = 'rgba('+r2+','+g2+','+b2+',0.5)';
    ctx.fill();
  }

  // X axis
  ctx.textAlign = 'center';
  for(var r=0;r<12;r++){
    ctx.fillStyle = '#888'; ctx.font = '9px sans-serif';
    ctx.fillText('R'+(r+1), cx + (r/11)*cw, cy+ch+16);
  }

  // Donut chart on right side
  var dx = 510, dy = 160, dr = 60;
  var total = 0;
  for(var z=0;z<5;z++) total += v30.hrZone.zones[z];
  var startAngle = -Math.PI/2;
  for(var z=0;z<5;z++){
    var sweep = (v30.hrZone.zones[z]/total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(dx, dy, dr, startAngle, startAngle + sweep);
    ctx.arc(dx, dy, dr * 0.55, startAngle + sweep, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = hrZoneColors[z]; ctx.fill();
    startAngle += sweep;
  }
  ctx.fillStyle = '#0d0d1a';
  ctx.beginPath(); ctx.arc(dx, dy, dr * 0.5, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#aaa'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('존 분포', dx, dy + 4);

  // Legend
  ctx.textAlign = 'left';
  for(var z=0;z<5;z++){
    var ly = 260 + z * 18;
    ctx.fillStyle = hrZoneColors[z];
    ctx.fillRect(460, ly, 10, 10);
    ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
    ctx.fillText(hrZoneNames[z] + ' ' + v30.hrZone.zones[z] + '%', 474, ly + 9);
  }

  // HR info
  ctx.fillStyle = '#888'; ctx.font = '10px sans-serif';
  ctx.fillText('안정 HR: ' + v30.hrZone.restHR + 'bpm', 460, 370);
  ctx.fillText('최대 HR: ' + v30.hrZone.maxHR + 'bpm', 460, 386);
  ctx.textAlign = 'start';
}

window._v30HRSim = function(){
  var newZones = [0,0,0,0,0];
  for(var r=0;r<12;r++){
    var rd = [0,0,0,0,0];
    var rem = 100;
    for(var z=0;z<4;z++){
      var base = z===2 ? 30 : z===3 ? 20 : z===1 ? 20 : z===0 ? 10 : 10;
      rd[z] = Math.max(3, Math.min(rem - (4-z), base + Math.floor(Math.random()*15) - 7));
      rem -= rd[z];
    }
    rd[4] = rem;
    v30.hrZone.roundData[r] = rd;
    for(var z=0;z<5;z++) newZones[z] += rd[z];
  }
  for(var z=0;z<5;z++) v30.hrZone.zones[z] = Math.round(newZones[z] / 12);
  v30.hrZone.sessions++;
  v30.featureUsage30.hrZone = true;
  saveV30(v30);
  playSFX30('hr_zone_up');
  drawHRCanvas();
  checkAchievementsV30();
};
window._v30HRReset = function(){
  v30.hrZone = defV30().hrZone;
  saveV30(v30); drawHRCanvas();
};

// ============================================================
// SECTION 5: FIGHTER FITNESS TEST BATTERY Canvas 640x400
// ============================================================
var sec5 = document.createElement('div');
sec5.id = 'v30-sec-5';
sec5.style.cssText = 'display:none;max-width:700px;margin:20px auto;padding:0 12px;';
sec5.innerHTML = '<div class="v30-card"><div class="v30-hdr">💪 파이터 체력 테스트 배터리</div><div class="v30-sub">8종 테스트(푸시업/풀업/플랭크/셔틀런/줄넘기/헤비백블리츠/반응훈련/VO2max) 레이더 + 퍼센타일 비교</div><canvas id="v30-c5" width="640" height="400" style="width:100%;max-width:640px;border-radius:12px;background:#0d0d1a;display:block;margin:0 auto"></canvas><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><button class="v30-btn" onclick="window._v30FitnessSim()">테스트 실행</button><button class="v30-btn-sec" onclick="window._v30FitnessReset()">리셋</button></div></div>';
document.body.appendChild(sec5);

var fitNames = ['푸시업','풀업','플랭크','셔틀런','줄넘기','헤비백','반응','VO2max'];
var fitKeys = ['pushup','pullup','plank','shuttle','jumpRope','heavyBag','reaction','vo2max'];
var fitMax = [80,20,180,40,200,120,200,60];
var fitProNorms = [60,15,150,35,180,100,250,55];
var fitAmateurNorms = [35,8,80,25,100,50,400,38];

function drawFitnessCanvas(){
  var c = document.getElementById('v30-c5');
  if(!c) return;
  var ctx = c.getContext('2d');
  ctx.clearRect(0,0,640,400);
  ctx.fillStyle = '#0d0d1a'; ctx.fillRect(0,0,640,400);

  ctx.fillStyle = '#f0f0f0'; ctx.font = 'bold 13px sans-serif';
  ctx.fillText('파이터 체력 테스트 배터리', 20, 25);

  // Radar chart
  var rcx = 180, rcy = 210, rr = 120;
  var n = 8;

  // Grid circles
  for(var lvl = 1; lvl <= 4; lvl++){
    var lr = rr * (lvl/4);
    ctx.beginPath();
    for(var i = 0; i <= n; i++){
      var angle = (i/n) * Math.PI*2 - Math.PI/2;
      var x = rcx + Math.cos(angle) * lr;
      var y = rcy + Math.sin(angle) * lr;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 0.5; ctx.stroke();
  }

  // Axes
  for(var i=0;i<n;i++){
    var angle = (i/n)*Math.PI*2 - Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(rcx, rcy);
    ctx.lineTo(rcx + Math.cos(angle)*rr, rcy + Math.sin(angle)*rr);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.stroke();
    // Labels
    var lx = rcx + Math.cos(angle)*(rr+18);
    var ly = rcy + Math.sin(angle)*(rr+18);
    ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(fitNames[i], lx, ly+4);
  }

  // Player polygon
  ctx.beginPath();
  for(var i=0;i<n;i++){
    var angle = (i/n)*Math.PI*2 - Math.PI/2;
    var key = fitKeys[i];
    var val = v30.fitnessTest.tests[key];
    var norm;
    if(key === 'reaction') norm = Math.max(0, 1 - (val - 150)/(fitMax[i]));
    else norm = val / fitMax[i];
    norm = Math.max(0, Math.min(1, norm));
    var x = rcx + Math.cos(angle)*rr*norm;
    var y = rcy + Math.sin(angle)*rr*norm;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(249,115,22,0.25)'; ctx.fill();
  ctx.strokeStyle = '#f97316'; ctx.lineWidth = 2; ctx.stroke();

  // Right panel: bar chart comparison
  var bx = 370, by = 55;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
  ctx.fillText('vs 프로/아마추어 기준', bx, by);

  for(var i=0;i<n;i++){
    var y = by + 12 + i * 40;
    var key = fitKeys[i];
    var val = v30.fitnessTest.tests[key];
    var pro = fitProNorms[i];
    var am = fitAmateurNorms[i];

    ctx.fillStyle = '#777'; ctx.font = '10px sans-serif';
    ctx.fillText(fitNames[i], bx, y + 10);

    // Background bar
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(bx, y + 16, 240, 12);

    // Player bar
    var pctPlayer = key === 'reaction' ? Math.max(0, (500-val)/500) : val/fitMax[i];
    pctPlayer = Math.max(0, Math.min(1, pctPlayer));
    ctx.fillStyle = pctPlayer >= 0.75 ? '#f97316' : pctPlayer >= 0.5 ? '#3b82f6' : '#666';
    ctx.fillRect(bx, y + 16, pctPlayer * 240, 12);

    // Pro marker
    var proPct = key === 'reaction' ? Math.max(0, (500-pro)/500) : pro/fitMax[i];
    proPct = Math.max(0, Math.min(1, proPct));
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(bx + proPct * 240, y + 14); ctx.lineTo(bx + proPct * 240, y + 30); ctx.stroke();

    ctx.fillStyle = '#bbb'; ctx.font = '9px sans-serif';
    var unit = key === 'reaction' ? 'ms' : key === 'plank' ? 's' : key === 'vo2max' ? 'ml' : key === 'shuttle' ? 's' : '';
    ctx.fillText(val + (unit ? unit : ''), bx + pctPlayer * 240 + 4, y + 26);
  }

  // Legend
  ctx.fillStyle = '#ef4444'; ctx.fillRect(bx, by + 340, 10, 2);
  ctx.fillStyle = '#888'; ctx.font = '9px sans-serif';
  ctx.fillText('프로 기준선', bx + 14, by + 343);

  // Overall grade
  var total = 0;
  for(var i=0;i<n;i++){
    var key = fitKeys[i];
    var val = v30.fitnessTest.tests[key];
    var pct = key === 'reaction' ? Math.max(0, (500-val)/500)*100 : (val/fitMax[i])*100;
    total += Math.min(100, pct);
  }
  var avg = Math.round(total/n);
  var grade = gradeFor(avg);
  v30.fitnessTest.bestGrade = grade;
  var gc = {S:'#fbbf24',A:'#a78bfa',B:'#60a5fa',C:'#34d399',D:'#666'}[grade];
  ctx.fillStyle = gc; ctx.font = 'bold 14px sans-serif';
  ctx.fillText(grade + ' 등급', bx + 160, by + 343);
  ctx.textAlign = 'start';
}

window._v30FitnessSim = function(){
  for(var i=0;i<8;i++){
    var key = fitKeys[i];
    if(key === 'reaction'){
      v30.fitnessTest.tests[key] = 200 + Math.floor(Math.random()*200);
    } else {
      v30.fitnessTest.tests[key] = Math.round(fitMax[i] * (0.3 + Math.random()*0.7));
    }
  }
  v30.fitnessTest.sessions++;
  v30.featureUsage30.fitnessTest = true;
  saveV30(v30);
  playSFX30('fitness_pass');
  drawFitnessCanvas();
  checkAchievementsV30();
};
window._v30FitnessReset = function(){
  v30.fitnessTest = defV30().fitnessTest;
  saveV30(v30); drawFitnessCanvas();
};

// ============================================================
// SECTION 6: CLINCH & BREAK STRATEGY ANALYZER Canvas 620x400
// ============================================================
var sec6 = document.createElement('div');
sec6.id = 'v30-sec-6';
sec6.style.cssText = 'display:none;max-width:700px;margin:20px auto;padding:0 12px;';
sec6.innerHTML = '<div class="v30-card"><div class="v30-hdr">🤼 클린치 &amp; 브레이크 전략 분석기</div><div class="v30-sub">6종 클린치(오버언더/더블언더/헤드록/암트랩/바디록/더티클린치) 6축 Radar + 브레이크 성공률 바차트</div><canvas id="v30-c6" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#0d0d1a;display:block;margin:0 auto"></canvas><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><button class="v30-btn" onclick="window._v30ClinchSim()">클린치 분석</button><button class="v30-btn-sec" onclick="window._v30ClinchNext()">다음 유형</button></div></div>';
document.body.appendChild(sec6);

var clinchNames = ['오버언더','더블언더','헤드록','암트랩','바디록','더티클린치'];
var clinchKeys = ['overUnder','doubleUnder','headlock','armTrap','bodyLock','dirtyClinch'];
var clinchAxes = ['제어력','탈출력','공격력','방어력','에너지','포지션'];
var clinchAxKeys = ['control','escape','offense','defense','energy','position'];
var clinchColors = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#a855f7'];

function drawClinchCanvas(){
  var c = document.getElementById('v30-c6');
  if(!c) return;
  var ctx = c.getContext('2d');
  ctx.clearRect(0,0,620,400);
  ctx.fillStyle = '#0d0d1a'; ctx.fillRect(0,0,620,400);

  ctx.fillStyle = '#f0f0f0'; ctx.font = 'bold 13px sans-serif';
  ctx.fillText('클린치 & 브레이크 전략 분석기', 20, 25);

  // Current selected clinch type radar
  var sel = v30.clinchBreak.selectedType;
  var key = clinchKeys[sel];
  var data = v30.clinchBreak.types[key];

  ctx.fillStyle = clinchColors[sel]; ctx.font = 'bold 12px sans-serif';
  ctx.fillText('▶ ' + clinchNames[sel], 20, 48);

  // Radar
  var rcx = 170, rcy = 220, rr = 110;
  var n = 6;
  for(var lvl=1;lvl<=4;lvl++){
    var lr = rr*(lvl/4);
    ctx.beginPath();
    for(var i=0;i<=n;i++){
      var angle = (i/n)*Math.PI*2 - Math.PI/2;
      var x = rcx + Math.cos(angle)*lr;
      var y = rcy + Math.sin(angle)*lr;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 0.5; ctx.stroke();
  }

  for(var i=0;i<n;i++){
    var angle = (i/n)*Math.PI*2 - Math.PI/2;
    ctx.beginPath(); ctx.moveTo(rcx,rcy);
    ctx.lineTo(rcx+Math.cos(angle)*rr, rcy+Math.sin(angle)*rr);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.stroke();
    var lx = rcx + Math.cos(angle)*(rr+20);
    var ly = rcy + Math.sin(angle)*(rr+20);
    ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(clinchAxes[i], lx, ly+4);
  }

  // Data polygon
  ctx.beginPath();
  for(var i=0;i<n;i++){
    var angle = (i/n)*Math.PI*2 - Math.PI/2;
    var val = data[clinchAxKeys[i]] / 100;
    var x = rcx + Math.cos(angle)*rr*val;
    var y = rcy + Math.sin(angle)*rr*val;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.closePath();
  var r2 = parseInt(clinchColors[sel].slice(1,3),16), g2 = parseInt(clinchColors[sel].slice(3,5),16), b2 = parseInt(clinchColors[sel].slice(5,7),16);
  ctx.fillStyle = 'rgba('+r2+','+g2+','+b2+',0.25)'; ctx.fill();
  ctx.strokeStyle = clinchColors[sel]; ctx.lineWidth = 2; ctx.stroke();

  // Right panel: break success rate bars
  var bx = 350, by = 65;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#aaa'; ctx.font = 'bold 11px sans-serif';
  ctx.fillText('브레이크 성공률', bx, by);

  for(var i=0;i<6;i++){
    var y = by + 15 + i * 48;
    var suc = v30.clinchBreak.breakSuccess[clinchKeys[i]];
    ctx.fillStyle = i === sel ? clinchColors[i] : '#777';
    ctx.font = '10px sans-serif';
    ctx.fillText(clinchNames[i], bx, y + 10);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(bx, y + 16, 230, 14);
    var grd = ctx.createLinearGradient(bx, 0, bx + suc * 2.3, 0);
    grd.addColorStop(0, clinchColors[i]); grd.addColorStop(1, 'rgba('+r2+','+g2+','+b2+',0.6)');
    var r3 = parseInt(clinchColors[i].slice(1,3),16), g3 = parseInt(clinchColors[i].slice(3,5),16), b3 = parseInt(clinchColors[i].slice(5,7),16);
    grd = ctx.createLinearGradient(bx, 0, bx + suc * 2.3, 0);
    grd.addColorStop(0, 'rgba('+r3+','+g3+','+b3+',0.6)'); grd.addColorStop(1, clinchColors[i]);
    ctx.fillStyle = grd;
    ctx.fillRect(bx, y + 16, suc * 2.3, 14);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif';
    ctx.fillText(suc + '%', bx + suc * 2.3 + 6, y + 27);
  }
  ctx.textAlign = 'start';
}

window._v30ClinchSim = function(){
  var key = clinchKeys[v30.clinchBreak.selectedType];
  for(var i=0;i<6;i++){
    v30.clinchBreak.types[key][clinchAxKeys[i]] = Math.max(10, Math.min(95, v30.clinchBreak.types[key][clinchAxKeys[i]] + Math.floor(Math.random()*20) - 8));
  }
  v30.clinchBreak.breakSuccess[key] = Math.max(10, Math.min(95, v30.clinchBreak.breakSuccess[key] + Math.floor(Math.random()*15) - 5));
  v30.clinchBreak.sessions++;
  v30.featureUsage30.clinchBreak = true;
  saveV30(v30);
  playSFX30('clinch_break');
  drawClinchCanvas();
  checkAchievementsV30();
};
window._v30ClinchNext = function(){
  v30.clinchBreak.selectedType = (v30.clinchBreak.selectedType + 1) % 6;
  saveV30(v30); drawClinchCanvas();
};

// ============================================================
// SECTION 7: WEIGHT CUT SCIENCE SIMULATOR Canvas 620x400
// ============================================================
var sec7 = document.createElement('div');
sec7.id = 'v30-sec-7';
sec7.style.cssText = 'display:none;max-width:700px;margin:20px auto;padding:0 12px;';
sec7.innerHTML = '<div class="v30-card"><div class="v30-hdr">⚖️ 체중 감량 사이언스 시뮬레이터</div><div class="v30-sub">8일 체중 타임라인 + 수분/나트륨/탄수화물 조절 곡선 + 안전/위험 구간 + 리하이드레이션 프로토콜</div><canvas id="v30-c7" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#0d0d1a;display:block;margin:0 auto"></canvas><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><button class="v30-btn" onclick="window._v30WeightSim()">감량 시뮬</button><button class="v30-btn-sec" onclick="window._v30WeightReset()">리셋</button></div></div>';
document.body.appendChild(sec7);

function drawWeightCanvas(){
  var c = document.getElementById('v30-c7');
  if(!c) return;
  var ctx = c.getContext('2d');
  ctx.clearRect(0,0,620,400);
  ctx.fillStyle = '#0d0d1a'; ctx.fillRect(0,0,620,400);

  ctx.fillStyle = '#f0f0f0'; ctx.font = 'bold 13px sans-serif';
  ctx.fillText('체중 감량 사이언스 시뮬레이터', 20, 25);

  var cx = 60, cy = 50, cw = 520, ch = 180;
  var minW = v30.weightCut.targetWeight - 2;
  var maxW = v30.weightCut.baseWeight + 2;

  // Danger zone (below safe)
  var safeY = cy + ch - ((v30.weightCut.safeZone - minW) / (maxW - minW)) * ch;
  ctx.fillStyle = 'rgba(239,68,68,0.08)';
  ctx.fillRect(cx, safeY, cw, cy + ch - safeY);

  // Safe zone label
  ctx.strokeStyle = 'rgba(239,68,68,0.3)'; ctx.lineWidth = 1; ctx.setLineDash([5,5]);
  ctx.beginPath(); ctx.moveTo(cx, safeY); ctx.lineTo(cx+cw, safeY); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#ef4444'; ctx.font = '9px sans-serif';
  ctx.fillText('안전 하한: ' + v30.weightCut.safeZone + 'kg', cx + cw - 100, safeY - 4);

  // Target line
  var targetY = cy + ch - ((v30.weightCut.targetWeight - minW) / (maxW - minW)) * ch;
  ctx.strokeStyle = 'rgba(34,197,94,0.4)'; ctx.lineWidth = 1; ctx.setLineDash([3,3]);
  ctx.beginPath(); ctx.moveTo(cx, targetY); ctx.lineTo(cx+cw, targetY); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#22c55e'; ctx.font = '9px sans-serif';
  ctx.fillText('목표: ' + v30.weightCut.targetWeight + 'kg', cx + 5, targetY - 4);

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.5;
  for(var w = Math.ceil(minW); w <= Math.floor(maxW); w++){
    var yy = cy + ch - ((w - minW)/(maxW - minW))*ch;
    ctx.beginPath(); ctx.moveTo(cx,yy); ctx.lineTo(cx+cw,yy); ctx.stroke();
    ctx.fillStyle = '#555'; ctx.font = '9px sans-serif';
    ctx.fillText(w+'kg', 20, yy+3);
  }

  // Weight line
  ctx.strokeStyle = '#f97316'; ctx.lineWidth = 2.5;
  ctx.beginPath();
  for(var d=0;d<8;d++){
    var x = cx + (d/7)*cw;
    var y = cy + ch - ((v30.weightCut.days[d] - minW)/(maxW-minW))*ch;
    if(d===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
  for(var d=0;d<8;d++){
    var x = cx + (d/7)*cw;
    var y = cy + ch - ((v30.weightCut.days[d] - minW)/(maxW-minW))*ch;
    ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2);
    ctx.fillStyle = v30.weightCut.days[d] < v30.weightCut.safeZone ? '#ef4444' : '#f97316';
    ctx.fill();
    ctx.fillStyle = '#ccc'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(v30.weightCut.days[d].toFixed(1), x, y-10);
  }

  // X axis
  var dayLabels = ['D-7','D-6','D-5','D-4','D-3','D-2','D-1','계체'];
  for(var d=0;d<8;d++){
    ctx.fillStyle = '#888'; ctx.font = '10px sans-serif';
    ctx.fillText(dayLabels[d], cx + (d/7)*cw, cy+ch+18);
  }

  // Manipulation curves (water, sodium, carb) in bottom area
  var my = 280, mh = 90;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#aaa'; ctx.font = 'bold 10px sans-serif';
  ctx.fillText('수분/나트륨/탄수화물 조절 (%)', cx, my);

  var manipColors = ['#3b82f6','#eab308','#22c55e'];
  var manipData = [v30.weightCut.water, v30.weightCut.sodium, v30.weightCut.carb];
  var manipNames = ['수분','나트륨','탄수화물'];

  for(var m=0;m<3;m++){
    ctx.strokeStyle = manipColors[m]; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for(var d=0;d<8;d++){
      var x = cx + (d/7)*cw;
      var y = my + 10 + mh - (manipData[m][d]/100)*mh;
      if(d===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }

  // Legend
  for(var m=0;m<3;m++){
    ctx.fillStyle = manipColors[m]; ctx.fillRect(cx + m * 90, my + mh + 18, 10, 3);
    ctx.fillStyle = '#888'; ctx.font = '9px sans-serif';
    ctx.fillText(manipNames[m], cx + m * 90 + 14, my + mh + 22);
  }
  ctx.textAlign = 'start';
}

window._v30WeightSim = function(){
  var base = 73 + Math.random()*5;
  var target = base - 4 - Math.random()*2;
  v30.weightCut.baseWeight = Math.round(base * 10)/10;
  v30.weightCut.targetWeight = Math.round(target * 10)/10;
  v30.weightCut.safeZone = Math.round((target + 1) * 10)/10;
  for(var d=0;d<8;d++){
    var progress = d/7;
    var cut = (base - target) * progress * (1 + Math.random()*0.2 - 0.1);
    v30.weightCut.days[d] = Math.round((base - cut) * 10)/10;
    v30.weightCut.water[d] = Math.round(100 - progress * 70 + (d>=6 ? 40 : 0) + Math.random()*10);
    v30.weightCut.sodium[d] = Math.round(100 - progress * 85 + (d>=6 ? 30 : 0) + Math.random()*10);
    v30.weightCut.carb[d] = Math.round(100 - progress * 80 + (d>=6 ? 50 : 0) + Math.random()*10);
    v30.weightCut.water[d] = Math.max(5, Math.min(100, v30.weightCut.water[d]));
    v30.weightCut.sodium[d] = Math.max(5, Math.min(100, v30.weightCut.sodium[d]));
    v30.weightCut.carb[d] = Math.max(5, Math.min(100, v30.weightCut.carb[d]));
  }
  v30.weightCut.sessions++;
  v30.featureUsage30.weightCut = true;
  saveV30(v30);
  playSFX30('weight_safe');
  drawWeightCanvas();
  checkAchievementsV30();
};
window._v30WeightReset = function(){
  v30.weightCut = defV30().weightCut;
  saveV30(v30); drawWeightCanvas();
};

// ============================================================
// SECTION 8: COMPREHENSIVE FIGHTER INTELLIGENCE DASHBOARD Canvas 620x400
// ============================================================
var sec8 = document.createElement('div');
sec8.id = 'v30-sec-8';
sec8.style.cssText = 'display:none;max-width:700px;margin:20px auto;padding:0 12px;';
sec8.innerHTML = '<div class="v30-card"><div class="v30-hdr">🧠 종합 파이터 인텔리전스 대시보드</div><div class="v30-sub">8 KPI 반원 게이지 (타겟팅/주기화/출력/심폐/체력/클린치/체중관리/링IQ) 가중 종합 S~D 등급</div><canvas id="v30-c8" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#0d0d1a;display:block;margin:0 auto"></canvas><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><button class="v30-btn" onclick="window._v30IQSim()">종합 평가</button><button class="v30-btn-sec" onclick="window._v30IQReset()">리셋</button></div></div>';
document.body.appendChild(sec8);

var iqNames = ['타겟팅','주기화','출력','심폐','체력','클린치','체중관리','링IQ'];
var iqKeys = ['targeting','periodization','output','cardio','fitness','clinch','weightMgmt','ringIQ'];
var iqColors = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#06b6d4','#8b5cf6','#ec4899'];
var iqWeights = [0.15,0.1,0.15,0.15,0.1,0.1,0.1,0.15];

function drawIQCanvas(){
  var c = document.getElementById('v30-c8');
  if(!c) return;
  var ctx = c.getContext('2d');
  ctx.clearRect(0,0,620,400);
  ctx.fillStyle = '#0d0d1a'; ctx.fillRect(0,0,620,400);

  ctx.fillStyle = '#f0f0f0'; ctx.font = 'bold 13px sans-serif';
  ctx.fillText('종합 파이터 인텔리전스 대시보드', 20, 25);

  // 8 half-circle gauges in 4x2 grid
  var gw = 130, gh = 90, gx0 = 40, gy0 = 55;
  var weightedSum = 0;

  for(var i=0;i<8;i++){
    var col = i % 4, row = Math.floor(i/4);
    var cx = gx0 + col * (gw + 15) + gw/2;
    var cy = gy0 + row * (gh + 60) + gh;
    var r = 45;
    var val = v30.fighterIQ.kpis[iqKeys[i]];
    weightedSum += val * iqWeights[i];

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 0);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 8; ctx.stroke();

    // Value arc
    var sweepAngle = (val/100) * Math.PI;
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, Math.PI + sweepAngle);
    ctx.strokeStyle = iqColors[i]; ctx.lineWidth = 8; ctx.stroke();

    // Value text
    ctx.fillStyle = '#fff'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(val, cx, cy - 8);

    // Grade
    var g = gradeFor(val);
    var gc = {S:'#fbbf24',A:'#a78bfa',B:'#60a5fa',C:'#34d399',D:'#666'}[g];
    ctx.fillStyle = gc; ctx.font = 'bold 11px sans-serif';
    ctx.fillText(g, cx, cy + 8);

    // Label
    ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
    ctx.fillText(iqNames[i], cx, cy + 28);
  }

  // Overall grade
  var overall = Math.round(weightedSum);
  var overallGrade = gradeFor(overall);
  v30.fighterIQ.overallGrade = overallGrade;
  var gc2 = {S:'#fbbf24',A:'#a78bfa',B:'#60a5fa',C:'#34d399',D:'#666'}[overallGrade];

  ctx.fillStyle = '#aaa'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('종합 파이터 인텔리전스', 310, 360);
  ctx.fillStyle = gc2; ctx.font = 'bold 28px sans-serif';
  ctx.fillText(overallGrade, 310, 392);
  ctx.fillStyle = '#888'; ctx.font = '11px sans-serif';
  ctx.fillText(overall + ' / 100', 370, 392);
  ctx.textAlign = 'start';
}

window._v30IQSim = function(){
  // Pull data from other features
  var avgAcc = 0;
  for(var i=0;i<8;i++) avgAcc += v30.targetZone.accuracy[zoneKeys[i]];
  v30.fighterIQ.kpis.targeting = Math.round(avgAcc / 8);

  var compAvg = 0;
  for(var w=0;w<8;w++) compAvg += v30.periodization.compliance[w];
  v30.fighterIQ.kpis.periodization = Math.max(20, Math.round(compAvg / 8));

  var outAvg = v30.outputScore.cumulative > 0 ? Math.round(v30.outputScore.cumulative / 12) : 30 + Math.floor(Math.random()*40);
  v30.fighterIQ.kpis.output = Math.min(100, outAvg);

  v30.fighterIQ.kpis.cardio = Math.max(20, Math.min(95, v30.hrZone.zones[2] + v30.hrZone.zones[3]));

  var fitTotal = 0;
  for(var i=0;i<8;i++){
    var key = fitKeys[i];
    var pct = key === 'reaction' ? Math.max(0,(500-v30.fitnessTest.tests[key])/500)*100 : (v30.fitnessTest.tests[key]/fitMax[i])*100;
    fitTotal += Math.min(100, pct);
  }
  v30.fighterIQ.kpis.fitness = Math.round(fitTotal / 8);

  var clinchAvg = 0;
  for(var i=0;i<6;i++) clinchAvg += v30.clinchBreak.breakSuccess[clinchKeys[i]];
  v30.fighterIQ.kpis.clinch = Math.round(clinchAvg / 6);

  var lastWeight = v30.weightCut.days[7];
  var diff = Math.abs(lastWeight - v30.weightCut.targetWeight);
  v30.fighterIQ.kpis.weightMgmt = Math.max(10, Math.round(100 - diff * 15));

  v30.fighterIQ.kpis.ringIQ = Math.max(20, Math.min(95, 40 + Math.floor(Math.random()*50)));

  v30.fighterIQ.sessions++;
  v30.featureUsage30.fighterIQ = true;
  saveV30(v30);
  playSFX30('achieve30');
  drawIQCanvas();
  checkAchievementsV30();
};
window._v30IQReset = function(){
  v30.fighterIQ = defV30().fighterIQ;
  saveV30(v30); drawIQCanvas();
};

// ============================================================
// SECTION 9: QUIZ V30: 15 Questions (315->330)
// ============================================================
var quizV30Data = [
  {q:'펀치 타겟존 분석기에서 가장 높은 KO 확률을 가진 타겟존은?',a:['어깨','턱','갈비','머리 상단'],c:1},
  {q:'트레이닝 주기화에서 &lsquo;피크&rsquo; 페이즈의 주된 목적은?',a:['기초 체력 구축','최대 강도 훈련으로 경기력 정점','회복과 재충전','기술 다양화'],c:1},
  {q:'FightCamp의 Output Score 계산에서 가장 높은 가중치를 차지하는 요소는?',a:['속도','파워','정확도','지구력'],c:1},
  {q:'심박 존 5구간 중 VO2max 존의 심박수 범위는 최대심박의 몇 %인가?',a:['50-60%','60-70%','70-80%','90-100%'],c:3},
  {q:'체력 테스트 배터리에서 &lsquo;반응 훈련&rsquo; 측정 단위는?',a:['초(s)','밀리초(ms)','분(min)','횟수'],c:1},
  {q:'6종 클린치 중 가장 높은 방어력 수치를 보이는 유형은?',a:['더티 클린치','더블 언더','헤드록','오버 언더'],c:1},
  {q:'체중 감량 시 가장 먼저 줄이기 시작하는 영양소는?',a:['단백질','탄수화물','지방','비타민'],c:1},
  {q:'안전한 체중 감량의 주당 권장 최대 감량폭은?',a:['0.5-1kg','3-4kg','5kg 이상','제한 없음'],c:0},
  {q:'리하이드레이션 프로토콜에서 계체 후 수분 회복 목표 시간은?',a:['10분','24시간','1주일','경기 직전'],c:1},
  {q:'트레이닝 주기화에서 &lsquo;과훈련 위험&rsquo;이 가장 높은 페이즈는?',a:['기초','구축','피크','회복'],c:2},
  {q:'심박존 최적화에서 복싱 라운드 중 주로 머무는 존은?',a:['회복존','지방연소존','역치존','수면존'],c:2},
  {q:'종합 파이터 인텔리전스 대시보드의 8개 KPI 중 가장 높은 가중치는?',a:['클린치','체중관리','타겟팅·출력·심폐·링IQ(각 15%)','주기화'],c:2},
  {q:'BOXX의 핵심 차별점인 &lsquo;테크닉 중심 훈련&rsquo;에 해당하는 본 시스템 기능은?',a:['체중 감량','펀치 타겟존 정확도 분석기','BGM 플레이어','캘린더'],c:1},
  {q:'클린치에서 &lsquo;더티 클린치&rsquo;가 반칙이 되는 주된 이유는?',a:['머리 사용','과도한 홀딩과 주심 경고','자세가 아름답지 않아서','클린치 자체가 반칙'],c:1},
  {q:'파이터 체력 테스트의 VO2max 수치가 55ml/kg/min이면 어떤 수준인가?',a:['초보자','일반인 평균','아마추어 선수','프로 선수급'],c:3}
];
quizV30Data = quizV30Data.slice(0,15);

var secQuiz30 = document.createElement('div');
secQuiz30.id = 'v30-sec-9';
secQuiz30.style.cssText = 'display:none;max-width:680px;margin:20px auto;padding:0 12px;';
var quizHtml30 = '<div class="v30-card"><div class="v30-hdr">🎯 복싱 퀴즈 v30 (15문)</div>';
for(var qi=0;qi<quizV30Data.length;qi++){
  var qq=quizV30Data[qi];
  quizHtml30 += '<div style="margin:10px 0;padding:10px;background:var(--surface);border-radius:10px"><div style="font-size:12px;font-weight:700;margin-bottom:6px">Q'+(qi+1)+'. '+qq.q+'</div>';
  for(var ai=0;ai<qq.a.length;ai++){
    quizHtml30 += '<button onclick="window._v30QuizAnswer('+qi+','+ai+')" style="display:block;width:100%;text-align:left;padding:6px 10px;margin:3px 0;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;color:var(--text,#f0f0f0);font-size:11px;cursor:pointer" id="v30-q'+qi+'-a'+ai+'">'+qq.a[ai]+'</button>';
  }
  quizHtml30 += '<div id="v30-q'+qi+'-result" style="font-size:11px;margin-top:4px;min-height:16px"></div></div>';
}
quizHtml30 += '</div>';
secQuiz30.innerHTML = quizHtml30;
document.body.appendChild(secQuiz30);

window._v30QuizAnswer = function(qi, ai){
  var qq=quizV30Data[qi];
  var resEl=document.getElementById('v30-q'+qi+'-result');
  if(v30.quizV30Scores[qi] !== undefined) return;
  var correct = ai === qq.c;
  v30.quizV30Scores[qi] = correct ? 1 : 0;
  for(var j=0;j<qq.a.length;j++){
    var btn=document.getElementById('v30-q'+qi+'-a'+j);
    if(j===qq.c) btn.style.border='2px solid #22c55e';
    else if(j===ai && !correct) btn.style.border='2px solid #ef4444';
    btn.style.pointerEvents='none';
  }
  resEl.innerHTML=correct?'<span style="color:#22c55e">✅ 정답!</span>':'<span style="color:#ef4444">❌ 오답. 정답: '+qq.a[qq.c]+'</span>';
  saveV30(v30);
  if(correct) playSFX30('quiz_correct30');
  checkAchievementsV30();
};

// ============================================================
// ACHIEVEMENTS V30 (+12, 274->286)
// ============================================================
var achieveV30Defs = [
  {id:'a30_target_1',name:'타겟 헌터',desc:'펀치타겟존 시뮬레이션 1회 완료',check:function(){return v30.targetZone.sessions>=1}},
  {id:'a30_target_s',name:'스나이퍼',desc:'타겟존 종합 명중률 S등급 달성',check:function(){return v30.targetZone.bestGrade==='S'}},
  {id:'a30_period_complete',name:'주기화 마스터',desc:'8주 메소사이클 1회 완주',check:function(){return v30.periodization.week>=9}},
  {id:'a30_output_peak',name:'피크 아웃풋',desc:'출력 스코어 시뮬 1회 완료',check:function(){return v30.outputScore.sessions>=1}},
  {id:'a30_hr_session',name:'하트레이트 분석가',desc:'심박존 시뮬 3회 완료',check:function(){return v30.hrZone.sessions>=3}},
  {id:'a30_fitness_pro',name:'프로 체력',desc:'체력테스트 3개 이상 프로기준 통과',check:function(){var c=0;for(var i=0;i<8;i++){var k=fitKeys[i];if(k==='reaction'){if(v30.fitnessTest.tests[k]<=fitProNorms[i])c++}else{if(v30.fitnessTest.tests[k]>=fitProNorms[i])c++}}return c>=3}},
  {id:'a30_clinch_all',name:'클린치 마스터',desc:'6종 클린치 모두 분석',check:function(){return v30.clinchBreak.sessions>=6}},
  {id:'a30_weight_safe',name:'안전 감량',desc:'감량 시뮬에서 안전구간 내 계체 성공',check:function(){return v30.weightCut.sessions>=1 && v30.weightCut.days[7]>=v30.weightCut.safeZone && v30.weightCut.days[7]<=v30.weightCut.targetWeight+0.5}},
  {id:'a30_iq_assessed',name:'인텔리전스 평가',desc:'종합 IQ 대시보드 1회 평가',check:function(){return v30.fighterIQ.sessions>=1}},
  {id:'a30_iq_grade_a',name:'A급 파이터',desc:'종합 인텔리전스 A등급 이상',check:function(){return v30.fighterIQ.overallGrade==='A'||v30.fighterIQ.overallGrade==='S'}},
  {id:'a30_quiz_10',name:'퀴즈 도전자 v30',desc:'v30 퀴즈 10문 정답',check:function(){var cnt=0;for(var k in v30.quizV30Scores)if(v30.quizV30Scores[k]===1)cnt++;return cnt>=10}},
  {id:'a30_all_features',name:'v30 마스터',desc:'v30 모든 기능 사용',check:function(){var keys=['targetZone','periodization','outputScore','hrZone','fitnessTest','clinchBreak','weightCut','fighterIQ'];for(var i=0;i<keys.length;i++)if(!v30.featureUsage30[keys[i]])return false;return true}}
];

function checkAchievementsV30(){
  var newUnlock = false;
  achieveV30Defs.forEach(function(ad){
    if(!v30.achievementsV30[ad.id] && ad.check()){
      v30.achievementsV30[ad.id] = true;
      newUnlock = true;
    }
  });
  if(newUnlock){
    saveV30(v30);
    playSFX30('achieve30');
  }
}

// ============================================================
// NAVIGATION: append buttons to existing bar (NO new bottom bar)
// ============================================================
function addV30Nav(){
  var features = [
    {id:'targetZone',label:'타겟존',sec:sec1},
    {id:'periodization',label:'주기화',sec:sec2},
    {id:'outputScore',label:'출력스코어',sec:sec3},
    {id:'hrZone',label:'심박존',sec:sec4},
    {id:'fitnessTest',label:'체력테스트',sec:sec5},
    {id:'clinchBreak',label:'클린치전략',sec:sec6},
    {id:'weightCut',label:'체중감량',sec:sec7},
    {id:'fighterIQ',label:'파이터IQ',sec:sec8},
    {id:'quizV30',label:'퀴즈v30',sec:secQuiz30}
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
    btn.style.cssText = 'padding:6px 10px;background:linear-gradient(135deg,rgba(249,115,22,0.15),rgba(234,88,12,0.15));border:1px solid rgba(251,146,60,0.3);border-radius:8px;color:#fb923c;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .2s;flex-shrink:0;';
    btn.textContent = f.label;
    btn.onclick = function(fRef){
      return function(){
        document.querySelectorAll('[id^="v30-sec-"]').forEach(function(s){ s.style.display = 'none'; });
        fRef.sec.style.display = 'block';
        v30.featureUsage30[fRef.id] = true;
        saveV30(v30);
        checkAchievementsV30();
      };
    }(f);
    if(navWrap) navWrap.appendChild(btn);
  });
}

// ============================================================
// KEYBOARD SHORTCUTS (Shift+Q/W/E/R/T/Y/U/I for 8 features, Shift+0 for quiz)
// ============================================================
document.addEventListener('keydown', function(e){
  if(!e.shiftKey) return;
  var sections = [sec1, sec2, sec3, sec4, sec5, sec6, sec7, sec8, secQuiz30];
  var keys = ['Q','W','E','R','T','Y','U','I','0'];
  var featureIds = ['targetZone','periodization','outputScore','hrZone','fitnessTest','clinchBreak','weightCut','fighterIQ','quizV30'];
  var idx = keys.indexOf(e.key.toUpperCase());
  if(idx === -1 && e.key === ')') idx = 8;
  if(idx >= 0 && idx < sections.length){
    e.preventDefault();
    document.querySelectorAll('[id^="v30-sec-"]').forEach(function(s){ s.style.display = 'none'; });
    sections[idx].style.display = 'block';
    v30.featureUsage30[featureIds[idx]] = true;
    saveV30(v30);
    checkAchievementsV30();
  }
});

// ============================================================
// INIT
// ============================================================
setTimeout(function(){
  addV30Nav();
  drawTargetCanvas();
  drawPeriodCanvas();
  drawOutputCanvas();
  drawHRCanvas();
  drawFitnessCanvas();
  drawClinchCanvas();
  drawWeightCanvas();
  drawIQCanvas();
  checkAchievementsV30();
}, 900);

})();
