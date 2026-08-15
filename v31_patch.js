// Boxing Trainer Pro v31_patch.js - Competitive Gap Closure Module
// 1. Punch Volume Density Analyzer Canvas 620x400 - 12R punch volume stacked bar (jab/cross/hook/uppercut), density heatmap, volume vs accuracy scatter, S~D grade
// 2. Footwork Pattern Mapper Canvas 640x400 - 8 footwork patterns, frequency bar chart, transition flow, agility score, diversity index, S~D grade
// 3. Defense Reaction Matrix Canvas 620x400 - 8 defense x 6 attack heatmap, success rate%, reaction time ms, S~D grade
// 4. Training Intensity Zone Analyzer Canvas 620x400 - 5 zones area chart, distribution donut, weekly trend, overtraining risk
// 5. Punch Sequence Builder Canvas 640x400 - 10 preset combos, execution time bar, success rate%, difficulty rating
// 6. Round Energy Distribution Optimizer Canvas 620x400 - 12R energy allocation stacked bar, optimal overlay, efficiency gap, S~D grade
// 7. Boxing Stance Corrector Canvas 620x400 - 8 stance elements radar, current vs ideal, correction priority, stance score, S~D grade
// 8. Comprehensive Fighter Combat Power Dashboard Canvas 620x400 - 8 KPI half-circle gauges 4x2, weighted S~D, 20-session history
// Quiz +15, +12 Achievements, SFX 16, Keyboard Shift+Q/W/E/R/T/Y/U/I/0
(function(){
'use strict';

var V31KEY = 'boxingV31Patch';

function loadV31(){
  try {
    var r = localStorage.getItem(V31KEY);
    if(!r) return defV31();
    var p = JSON.parse(r), d = defV31();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV31(); }
}
function saveV31(d){ try { localStorage.setItem(V31KEY, JSON.stringify(d)); } catch(e){} }
function defV31(){
  return {
    punchVolume: {
      rounds: Array(12).fill(null).map(function(){ return {jab:0,cross:0,hook:0,uppercut:0}; }),
      accuracy: Array(12).fill(0),
      sessions: 0,
      bestGrade: 'D'
    },
    footwork: {
      patterns: {pivotL:0,pivotR:0,stepBack:0,cutAngle:0,lateralSlide:0,advance:0,retreat:0,circle:0},
      transitions: [],
      sessions: 0,
      bestGrade: 'D'
    },
    defenseMatrix: {
      matrix: {},
      reactionTimes: {},
      sessions: 0,
      bestGrade: 'D'
    },
    intensityZone: {
      timeline: [],
      zones: [0,0,0,0,0],
      weeklyTrend: [],
      sessions: 0
    },
    punchSequence: {
      combos: Array(10).fill(null).map(function(){ return {time:0,success:0,attempts:0}; }),
      selectedCombo: 0,
      sessions: 0
    },
    energyDist: {
      rounds: Array(12).fill(null).map(function(){ return {attack:0,defense:0,movement:0,rest:0}; }),
      sessions: 0,
      bestGrade: 'D'
    },
    stanceCorrector: {
      elements: {footWidth:0,weightDist:0,guardHeight:0,chinTuck:0,elbowPos:0,hipAngle:0,kneeBend:0,shoulderAlign:0},
      style: 0,
      sessions: 0,
      bestGrade: 'D'
    },
    combatDashboard: {
      kpis: {volume:0,footwork:0,defense:0,intensity:0,combos:0,energy:0,stance:0,combatIQ:0},
      history: [],
      overallGrade: 'D',
      sessions: 0
    },
    quizV31Scores: {},
    achievementsV31: {},
    featureUsage31: {}
  };
}

var v31 = loadV31();

// ===== CSS =====
var st31 = document.createElement('style');
st31.textContent = '.v31-btn{padding:8px 16px;background:linear-gradient(135deg,#FF4444,#cc2222);border:none;border-radius:10px;color:#fff;font-weight:700;font-size:12px;cursor:pointer;transition:all .2s}.v31-btn:hover{filter:brightness(1.15);transform:scale(1.03)}.v31-btn-sec{padding:8px 16px;background:var(--surface,rgba(255,255,255,0.04));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:10px;color:var(--text-dim,#8a8a9e);font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.v31-btn-sec:hover{border-color:#FF4444;color:#FF6666}.v31-card{background:var(--glass,rgba(255,255,255,0.06));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:var(--radius,16px);padding:16px;margin-bottom:12px}.v31-hdr{font-size:15px;font-weight:800;margin-bottom:10px;display:flex;align-items:center;gap:8px}.v31-sub{font-size:11px;color:var(--text-dim,#8a8a9e);margin-bottom:8px}.v31-grade{display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:800}.v31-grade-s{background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#000}.v31-grade-a{background:linear-gradient(135deg,#a78bfa,#7c3aed);color:#fff}.v31-grade-b{background:linear-gradient(135deg,#60a5fa,#3b82f6);color:#fff}.v31-grade-c{background:linear-gradient(135deg,#34d399,#10b981);color:#000}.v31-grade-d{background:rgba(255,255,255,0.1);color:var(--text-dim,#8a8a9e)}';
document.head.appendChild(st31);

// ===== SFX ENGINE (16 types) =====
var sfxCtx31;
try { sfxCtx31 = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){}
function playSFX31(type){
  if(!sfxCtx31) return;
  try {
    var osc = sfxCtx31.createOscillator();
    var gain = sfxCtx31.createGain();
    osc.connect(gain); gain.connect(sfxCtx31.destination);
    var t = sfxCtx31.currentTime;
    var map = {
      volume_add:{f:880,t:'sine',d:0.12,v:0.25},
      volume_clear:{f:220,t:'sawtooth',d:0.18,v:0.2},
      footwork_step:{f:660,t:'triangle',d:0.15,v:0.22},
      footwork_combo:{f:990,t:'sine',d:0.1,v:0.22},
      defense_block:{f:440,t:'square',d:0.12,v:0.18},
      defense_slip:{f:780,t:'triangle',d:0.1,v:0.2},
      intensity_up:{f:1100,t:'sine',d:0.1,v:0.2},
      intensity_down:{f:280,t:'sawtooth',d:0.15,v:0.18},
      combo_hit:{f:720,t:'triangle',d:0.12,v:0.22},
      combo_miss:{f:180,t:'sawtooth',d:0.2,v:0.15},
      energy_opt:{f:550,t:'sine',d:0.15,v:0.2},
      energy_waste:{f:160,t:'sawtooth',d:0.2,v:0.18},
      stance_good:{f:830,t:'sine',d:0.12,v:0.22},
      stance_fix:{f:330,t:'square',d:0.15,v:0.18},
      quiz_correct31:{f:1050,t:'sine',d:0.12,v:0.2},
      achieve31:{f:1200,t:'triangle',d:0.18,v:0.25}
    };
    var s = map[type] || map.volume_add;
    osc.type = s.t;
    osc.frequency.setValueAtTime(s.f, t);
    osc.frequency.exponentialRampToValueAtTime(s.f * 0.5, t + s.d);
    gain.gain.setValueAtTime(s.v, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + s.d);
    osc.start(t); osc.stop(t + s.d + 0.01);
  } catch(e){}
}

function gradeFor31(val){
  if(val>=90) return 'S';
  if(val>=75) return 'A';
  if(val>=60) return 'B';
  if(val>=45) return 'C';
  return 'D';
}
function gradeColor31(g){ return {S:'#fbbf24',A:'#a78bfa',B:'#60a5fa',C:'#34d399',D:'#666'}[g] || '#666'; }

function drawEmptyState(ctx, w, h){
  ctx.fillStyle = '#0f0a1e'; ctx.fillRect(0,0,w,h);
  ctx.fillStyle = '#555'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('기록을 추가하면 표시됩니다', w/2, h/2);
  ctx.textAlign = 'start';
}

function hasData31(arr){
  if(!arr || arr.length === 0) return false;
  for(var i=0;i<arr.length;i++){
    if(typeof arr[i] === 'object'){
      for(var k in arr[i]){ if(arr[i][k] > 0) return true; }
    } else if(arr[i] > 0) return true;
  }
  return false;
}

// ============================================================
// SECTION 1: PUNCH VOLUME DENSITY ANALYZER Canvas 620x400
// ============================================================
var sec1 = document.createElement('div');
sec1.id = 'v31-sec-1';
sec1.style.cssText = 'display:none;max-width:700px;margin:20px auto;padding:0 12px;';
sec1.innerHTML = '<div class="v31-card"><div class="v31-hdr">🥊 펀치 볼륨 밀도 분석기</div><div class="v31-sub">12R 펀치 볼륨 스택 바차트 (jab/cross/hook/uppercut) + 밀도 히트맵 + S~D 등급</div><canvas id="v31-c1" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#0f0a1e;display:block;margin:0 auto"></canvas><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap" id="v31-c1-controls"></div></div>';
document.body.appendChild(sec1);

var punchTypes = ['잡','크로스','훅','어퍼컷'];
var punchKeys = ['jab','cross','hook','uppercut'];
var punchColors = ['#FF4444','#f97316','#eab308','#06b6d4'];

function initVolumeControls(){
  var wrap = document.getElementById('v31-c1-controls');
  if(!wrap) return;
  wrap.innerHTML = '<span style="font-size:11px;color:#aaa;margin-right:4px">라운드:</span>';
  var sel = document.createElement('select');
  sel.id = 'v31-vol-round';
  sel.style.cssText = 'padding:4px;background:#1a1230;color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:6px;font-size:11px;margin-right:6px';
  for(var i=0;i<12;i++){
    var opt = document.createElement('option');
    opt.value = i; opt.textContent = 'R' + (i+1);
    sel.appendChild(opt);
  }
  wrap.appendChild(sel);
  for(var p=0;p<4;p++){
    var b = document.createElement('button');
    b.className = 'v31-btn';
    b.style.cssText += ';font-size:10px;padding:6px 10px;background:linear-gradient(135deg,' + punchColors[p] + ',' + punchColors[p] + '88)';
    b.textContent = '+' + punchTypes[p];
    b.setAttribute('data-punch', p);
    b.onclick = function(){ var pi = parseInt(this.getAttribute('data-punch')); window._v31AddPunch(pi); };
    wrap.appendChild(b);
  }
  var resetBtn = document.createElement('button');
  resetBtn.className = 'v31-btn-sec';
  resetBtn.textContent = '리셋';
  resetBtn.onclick = window._v31VolumeReset;
  wrap.appendChild(resetBtn);
}

function drawVolumeCanvas(){
  var c = document.getElementById('v31-c1');
  if(!c) return;
  var ctx = c.getContext('2d');
  var totalPunches = 0;
  for(var r=0;r<12;r++) for(var p=0;p<4;p++) totalPunches += v31.punchVolume.rounds[r][punchKeys[p]];
  if(totalPunches === 0){ drawEmptyState(ctx,620,400); return; }

  ctx.clearRect(0,0,620,400);
  ctx.fillStyle = '#0f0a1e'; ctx.fillRect(0,0,620,400);
  // Grid
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for(var gx=0;gx<620;gx+=30) ctx.fillRect(gx,0,1,400);
  for(var gy=0;gy<400;gy+=30) ctx.fillRect(0,gy,620,1);

  ctx.fillStyle = '#f0f0f0'; ctx.font = 'bold 13px sans-serif';
  ctx.fillText('펀치 볼륨 밀도 분석기', 20, 25);

  // Find max volume per round for scaling
  var maxVol = 1;
  for(var r=0;r<12;r++){
    var sum = 0;
    for(var p=0;p<4;p++) sum += v31.punchVolume.rounds[r][punchKeys[p]];
    if(sum > maxVol) maxVol = sum;
  }

  // Stacked bar chart
  var bx = 50, by = 50, bh = 220, bw = 36, gap = 7;
  // Y axis
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 0.5;
  for(var y=0;y<=maxVol;y+=Math.max(1,Math.ceil(maxVol/5))){
    var yy = by + bh - (y/maxVol)*bh;
    ctx.beginPath(); ctx.moveTo(bx-5,yy); ctx.lineTo(bx+12*(bw+gap),yy); ctx.stroke();
    ctx.fillStyle = '#555'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(y, 20, yy+3);
  }

  // Draw stacked bars
  for(var r=0;r<12;r++){
    var x = bx + r*(bw+gap);
    var stackY = by + bh;
    for(var p=0;p<4;p++){
      var val = v31.punchVolume.rounds[r][punchKeys[p]];
      if(val <= 0) continue;
      var h = (val/maxVol)*bh;
      stackY -= h;
      ctx.fillStyle = punchColors[p];
      ctx.fillRect(x, stackY, bw, h);
    }
    // Round label
    ctx.fillStyle = '#888'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('R'+(r+1), x+bw/2, by+bh+16);
  }

  // Volume per minute calculation (assuming 3min rounds)
  var totalMin = 0;
  for(var r=0;r<12;r++){
    var rSum = 0;
    for(var p=0;p<4;p++) rSum += v31.punchVolume.rounds[r][punchKeys[p]];
    if(rSum > 0) totalMin += 3;
  }
  var vpm = totalMin > 0 ? (totalPunches / totalMin).toFixed(1) : '0';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
  ctx.fillText('분당 펀치: ' + vpm + '회', 20, by+bh+45);
  ctx.fillText('총 펀치: ' + totalPunches, 20, by+bh+62);

  // Density heatmap (right side, small)
  ctx.fillStyle = '#aaa'; ctx.font = 'bold 10px sans-serif';
  ctx.fillText('밀도 히트맵', 460, by);
  for(var r=0;r<12;r++){
    for(var p=0;p<4;p++){
      var val = v31.punchVolume.rounds[r][punchKeys[p]];
      var intensity = Math.min(1, val / Math.max(1, maxVol * 0.5));
      var cr = parseInt(punchColors[p].slice(1,3),16);
      var cg = parseInt(punchColors[p].slice(3,5),16);
      var cb = parseInt(punchColors[p].slice(5,7),16);
      ctx.fillStyle = 'rgba('+cr+','+cg+','+cb+','+(0.1+intensity*0.8)+')';
      ctx.fillRect(460+p*30, by+8+r*18, 26, 15);
      if(val>0){ ctx.fillStyle='#fff'; ctx.font='8px sans-serif'; ctx.textAlign='center'; ctx.fillText(val, 460+p*30+13, by+8+r*18+11); ctx.textAlign='left'; }
    }
  }
  // Heatmap column labels
  ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
  for(var p=0;p<4;p++){
    ctx.fillStyle = punchColors[p];
    ctx.fillText(punchTypes[p], 460+p*30+13, by+8+12*18+12);
  }

  // Grade
  var avg = Math.min(100, Math.round(totalPunches / 3.6));
  var grade = gradeFor31(avg);
  v31.punchVolume.bestGrade = grade;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
  ctx.fillText('볼륨 등급:', 350, by+bh+45);
  ctx.fillStyle = gradeColor31(grade); ctx.font = 'bold 18px sans-serif';
  ctx.fillText(grade, 420, by+bh+48);

  // Legend
  for(var p=0;p<4;p++){
    ctx.fillStyle = punchColors[p]; ctx.fillRect(350+p*60, by+bh+60, 10, 3);
    ctx.fillStyle = '#888'; ctx.font = '9px sans-serif';
    ctx.fillText(punchTypes[p], 363+p*60, by+bh+64);
  }
  ctx.textAlign = 'start';
}

window._v31AddPunch = function(punchIdx){
  var sel = document.getElementById('v31-vol-round');
  var round = sel ? parseInt(sel.value) : 0;
  v31.punchVolume.rounds[round][punchKeys[punchIdx]] += 1;
  v31.punchVolume.sessions++;
  v31.featureUsage31.punchVolume = true;
  saveV31(v31);
  playSFX31('volume_add');
  drawVolumeCanvas();
  checkAchievementsV31();
};
window._v31VolumeReset = function(){
  v31.punchVolume = defV31().punchVolume;
  saveV31(v31); drawVolumeCanvas();
};

// ============================================================
// SECTION 2: FOOTWORK PATTERN MAPPER Canvas 640x400
// ============================================================
var sec2 = document.createElement('div');
sec2.id = 'v31-sec-2';
sec2.style.cssText = 'display:none;max-width:700px;margin:20px auto;padding:0 12px;';
sec2.innerHTML = '<div class="v31-card"><div class="v31-hdr">👣 풋워크 패턴 매퍼</div><div class="v31-sub">8가지 풋워크 패턴 빈도 + 전환 플로우 + 민첩성 점수 + 다양성 지수</div><canvas id="v31-c2" width="640" height="400" style="width:100%;max-width:640px;border-radius:12px;background:#0f0a1e;display:block;margin:0 auto"></canvas><div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap" id="v31-c2-controls"></div></div>';
document.body.appendChild(sec2);

var fwNames = ['피벗좌','피벗우','백스텝','앵글컷','레터럴','전진','후퇴','서클'];
var fwKeys = ['pivotL','pivotR','stepBack','cutAngle','lateralSlide','advance','retreat','circle'];
var fwColors = ['#FF4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899'];

function initFootworkControls(){
  var wrap = document.getElementById('v31-c2-controls');
  if(!wrap) return;
  wrap.innerHTML = '';
  for(var i=0;i<8;i++){
    var b = document.createElement('button');
    b.className = 'v31-btn';
    b.style.cssText += ';font-size:9px;padding:5px 8px;background:linear-gradient(135deg,' + fwColors[i] + ',' + fwColors[i] + '88)';
    b.textContent = '+' + fwNames[i];
    b.setAttribute('data-fw', i);
    b.onclick = function(){ window._v31AddFootwork(parseInt(this.getAttribute('data-fw'))); };
    wrap.appendChild(b);
  }
  var resetBtn = document.createElement('button');
  resetBtn.className = 'v31-btn-sec';
  resetBtn.textContent = '리셋';
  resetBtn.onclick = window._v31FootworkReset;
  wrap.appendChild(resetBtn);
}

function drawFootworkCanvas(){
  var c = document.getElementById('v31-c2');
  if(!c) return;
  var ctx = c.getContext('2d');
  var total = 0;
  for(var i=0;i<8;i++) total += v31.footwork.patterns[fwKeys[i]];
  if(total === 0){ drawEmptyState(ctx,640,400); return; }

  ctx.clearRect(0,0,640,400);
  ctx.fillStyle = '#0f0a1e'; ctx.fillRect(0,0,640,400);
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for(var gx=0;gx<640;gx+=30) ctx.fillRect(gx,0,1,400);
  for(var gy=0;gy<400;gy+=30) ctx.fillRect(0,gy,640,1);

  ctx.fillStyle = '#f0f0f0'; ctx.font = 'bold 13px sans-serif';
  ctx.fillText('풋워크 패턴 매퍼', 20, 25);

  // Frequency bar chart (horizontal)
  var bx = 100, by = 50, bw = 300, barH = 28, gap = 8;
  var maxFreq = 1;
  for(var i=0;i<8;i++) if(v31.footwork.patterns[fwKeys[i]] > maxFreq) maxFreq = v31.footwork.patterns[fwKeys[i]];

  for(var i=0;i<8;i++){
    var y = by + i*(barH+gap);
    var val = v31.footwork.patterns[fwKeys[i]];
    ctx.fillStyle = '#888'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(fwNames[i], bx-8, y+barH/2+4);
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(bx, y, bw, barH);
    var w = (val/maxFreq)*bw;
    var grd = ctx.createLinearGradient(bx,0,bx+w,0);
    grd.addColorStop(0, fwColors[i]+'88'); grd.addColorStop(1, fwColors[i]);
    ctx.fillStyle = grd;
    ctx.fillRect(bx, y, w, barH);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif';
    ctx.fillText(val, bx+w+6, y+barH/2+4);
  }

  // Diversity index (Shannon entropy normalized)
  var diversity = 0;
  var usedCount = 0;
  for(var i=0;i<8;i++){
    var p = v31.footwork.patterns[fwKeys[i]] / total;
    if(p > 0){ diversity -= p * Math.log(p); usedCount++; }
  }
  var maxEntropy = Math.log(8);
  var diversityIdx = maxEntropy > 0 ? Math.round((diversity / maxEntropy) * 100) : 0;

  // Agility score (total movements weighted by variety)
  var agility = Math.min(100, Math.round((total / 5) * (diversityIdx / 100)));

  // Right panel stats
  var sx = 440, sy = 50;
  ctx.fillStyle = '#aaa'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('통계', sx, sy);
  ctx.fillStyle = '#888'; ctx.font = '10px sans-serif';
  ctx.fillText('총 무브먼트: ' + total, sx, sy+22);
  ctx.fillText('사용 패턴: ' + usedCount + '/8', sx, sy+40);
  ctx.fillText('다양성 지수: ' + diversityIdx + '%', sx, sy+58);
  ctx.fillText('민첩성 점수: ' + agility, sx, sy+76);

  var grade = gradeFor31(agility);
  v31.footwork.bestGrade = grade;
  ctx.fillStyle = gradeColor31(grade); ctx.font = 'bold 22px sans-serif';
  ctx.fillText(grade, sx+140, sy+70);

  // Transition flow diagram (circular)
  var fcx = 520, fcy = 260, fr = 80;
  ctx.fillStyle = '#aaa'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('패턴 전환 플로우', fcx, fcy - fr - 12);
  for(var i=0;i<8;i++){
    var angle = (i/8)*Math.PI*2 - Math.PI/2;
    var nx = fcx + Math.cos(angle)*fr;
    var ny = fcy + Math.sin(angle)*fr;
    var val = v31.footwork.patterns[fwKeys[i]];
    var sz = Math.max(4, Math.min(14, 4 + val));
    ctx.beginPath(); ctx.arc(nx, ny, sz, 0, Math.PI*2);
    ctx.fillStyle = fwColors[i]; ctx.fill();
    ctx.fillStyle = '#ccc'; ctx.font = '8px sans-serif';
    var lx = fcx + Math.cos(angle)*(fr+22);
    var ly = fcy + Math.sin(angle)*(fr+22);
    ctx.fillText(fwNames[i], lx, ly+3);
  }
  // Draw transition arcs between adjacent used patterns
  if(v31.footwork.transitions.length > 0){
    for(var t=0;t<v31.footwork.transitions.length;t++){
      var tr = v31.footwork.transitions[t];
      var a1 = (tr.from/8)*Math.PI*2 - Math.PI/2;
      var a2 = (tr.to/8)*Math.PI*2 - Math.PI/2;
      ctx.strokeStyle = 'rgba(255,68,68,0.3)'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(fcx+Math.cos(a1)*fr*0.7, fcy+Math.sin(a1)*fr*0.7);
      ctx.lineTo(fcx+Math.cos(a2)*fr*0.7, fcy+Math.sin(a2)*fr*0.7);
      ctx.stroke();
    }
  }
  ctx.textAlign = 'start';
}

var lastFwIdx = -1;
window._v31AddFootwork = function(idx){
  v31.footwork.patterns[fwKeys[idx]]++;
  if(lastFwIdx >= 0 && lastFwIdx !== idx){
    v31.footwork.transitions.push({from:lastFwIdx, to:idx});
    if(v31.footwork.transitions.length > 30) v31.footwork.transitions.shift();
  }
  lastFwIdx = idx;
  v31.footwork.sessions++;
  v31.featureUsage31.footwork = true;
  saveV31(v31);
  playSFX31('footwork_step');
  drawFootworkCanvas();
  checkAchievementsV31();
};
window._v31FootworkReset = function(){
  v31.footwork = defV31().footwork; lastFwIdx = -1;
  saveV31(v31); drawFootworkCanvas();
};

// ============================================================
// SECTION 3: DEFENSE REACTION MATRIX Canvas 620x400
// ============================================================
var sec3 = document.createElement('div');
sec3.id = 'v31-sec-3';
sec3.style.cssText = 'display:none;max-width:700px;margin:20px auto;padding:0 12px;';
sec3.innerHTML = '<div class="v31-card"><div class="v31-hdr">🛡️ 디펜스 리액션 매트릭스</div><div class="v31-sub">8방어 x 6공격 히트맵 + 성공률% + 반응시간(ms)</div><canvas id="v31-c3" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#0f0a1e;display:block;margin:0 auto"></canvas><div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap" id="v31-c3-controls"></div></div>';
document.body.appendChild(sec3);

var defenseNames = ['슬립좌','슬립우','롤','패리','블록','풀백','숄더롤','덕'];
var defenseKeys = ['slipL','slipR','roll','parry','block','pullBack','shoulderRoll','duck'];
var attackNames = ['잡','크로스','좌훅','우훅','좌어퍼','우어퍼'];
var attackKeys = ['jab','cross','hookL','hookR','upperL','upperR'];

function initDefenseControls(){
  var wrap = document.getElementById('v31-c3-controls');
  if(!wrap) return;
  wrap.innerHTML = '<span style="font-size:10px;color:#aaa">방어:</span>';
  var selDef = document.createElement('select');
  selDef.id = 'v31-def-type';
  selDef.style.cssText = 'padding:3px;background:#1a1230;color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:6px;font-size:10px;margin-right:4px';
  for(var i=0;i<8;i++){
    var opt = document.createElement('option');
    opt.value = i; opt.textContent = defenseNames[i];
    selDef.appendChild(opt);
  }
  wrap.appendChild(selDef);
  wrap.innerHTML += '<span style="font-size:10px;color:#aaa;margin-left:4px">vs:</span>';
  var selAtk = document.createElement('select');
  selAtk.id = 'v31-atk-type';
  selAtk.style.cssText = 'padding:3px;background:#1a1230;color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:6px;font-size:10px;margin-right:4px';
  for(var i=0;i<6;i++){
    var opt = document.createElement('option');
    opt.value = i; opt.textContent = attackNames[i];
    selAtk.appendChild(opt);
  }
  wrap.appendChild(selAtk);
  var btnS = document.createElement('button'); btnS.className = 'v31-btn'; btnS.style.cssText += ';font-size:10px;padding:5px 10px';
  btnS.textContent = '성공'; btnS.onclick = function(){ window._v31DefenseRecord(true); };
  var btnF = document.createElement('button'); btnF.className = 'v31-btn-sec'; btnF.style.cssText += ';font-size:10px;padding:5px 10px';
  btnF.textContent = '실패'; btnF.onclick = function(){ window._v31DefenseRecord(false); };
  var btnR = document.createElement('button'); btnR.className = 'v31-btn-sec'; btnR.textContent = '리셋';
  btnR.onclick = window._v31DefenseReset;
  wrap.appendChild(btnS); wrap.appendChild(btnF); wrap.appendChild(btnR);
}

function drawDefenseCanvas(){
  var c = document.getElementById('v31-c3');
  if(!c) return;
  var ctx = c.getContext('2d');
  var hasAny = false;
  for(var dk in v31.defenseMatrix.matrix){ hasAny = true; break; }
  if(!hasAny){ drawEmptyState(ctx,620,400); return; }

  ctx.clearRect(0,0,620,400);
  ctx.fillStyle = '#0f0a1e'; ctx.fillRect(0,0,620,400);

  ctx.fillStyle = '#f0f0f0'; ctx.font = 'bold 13px sans-serif';
  ctx.fillText('디펜스 리액션 매트릭스', 20, 25);

  // Heatmap grid: 8 defense (rows) x 6 attack (cols)
  var mx = 100, my = 55, cellW = 60, cellH = 30;
  // Column headers
  ctx.textAlign = 'center';
  for(var a=0;a<6;a++){
    ctx.fillStyle = '#aaa'; ctx.font = 'bold 9px sans-serif';
    ctx.fillText(attackNames[a], mx+a*cellW+cellW/2, my-6);
  }
  // Row headers + cells
  for(var d=0;d<8;d++){
    ctx.fillStyle = '#aaa'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(defenseNames[d], mx-8, my+d*cellH+cellH/2+3);
    for(var a=0;a<6;a++){
      var key = defenseKeys[d]+'_'+attackKeys[a];
      var data = v31.defenseMatrix.matrix[key];
      var rate = 0;
      if(data && data.total > 0) rate = Math.round((data.success / data.total)*100);

      // Color by success rate
      var r,g,b;
      if(rate >= 70){ r=34; g=197; b=94; }
      else if(rate >= 40){ r=234; g=179; b=8; }
      else if(data && data.total > 0){ r=239; g=68; b=68; }
      else { r=255; g=255; b=255; }
      var alpha = data && data.total > 0 ? 0.15 + (rate/100)*0.6 : 0.03;
      ctx.fillStyle = 'rgba('+r+','+g+','+b+','+alpha+')';
      ctx.fillRect(mx+a*cellW+1, my+d*cellH+1, cellW-2, cellH-2);
      if(data && data.total > 0){
        ctx.fillStyle = '#fff'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(rate+'%', mx+a*cellW+cellW/2, my+d*cellH+cellH/2+3);
      }
    }
  }

  // Reaction times summary (right panel)
  var rx = 480, ry = 55;
  ctx.fillStyle = '#aaa'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('반응시간 (ms)', rx, ry);
  var rtIdx = 0;
  for(var d=0;d<8;d++){
    var key = defenseKeys[d];
    var rt = v31.defenseMatrix.reactionTimes[key];
    if(rt && rt > 0){
      ctx.fillStyle = '#888'; ctx.font = '9px sans-serif';
      ctx.fillText(defenseNames[d]+': '+rt+'ms', rx, ry+16+rtIdx*16);
      rtIdx++;
    }
  }

  // Overall grade
  var totalSuccess = 0, totalAttempts = 0;
  for(var k in v31.defenseMatrix.matrix){
    var d = v31.defenseMatrix.matrix[k];
    totalSuccess += d.success; totalAttempts += d.total;
  }
  var overallRate = totalAttempts > 0 ? Math.round((totalSuccess/totalAttempts)*100) : 0;
  var grade = gradeFor31(overallRate);
  v31.defenseMatrix.bestGrade = grade;

  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('종합 성공률: ' + overallRate + '%', 100, my+8*cellH+25);
  ctx.fillStyle = gradeColor31(grade); ctx.font = 'bold 18px sans-serif';
  ctx.fillText(grade, 280, my+8*cellH+28);
  ctx.textAlign = 'start';
}

window._v31DefenseRecord = function(success){
  var selD = document.getElementById('v31-def-type');
  var selA = document.getElementById('v31-atk-type');
  if(!selD || !selA) return;
  var di = parseInt(selD.value), ai = parseInt(selA.value);
  var key = defenseKeys[di]+'_'+attackKeys[ai];
  if(!v31.defenseMatrix.matrix[key]) v31.defenseMatrix.matrix[key] = {success:0,total:0};
  v31.defenseMatrix.matrix[key].total++;
  if(success) v31.defenseMatrix.matrix[key].success++;
  // Simulated reaction time
  var rt = v31.defenseMatrix.reactionTimes[defenseKeys[di]] || 0;
  var newRt = 150 + Math.floor(Math.abs(di*30 + ai*20) % 200);
  v31.defenseMatrix.reactionTimes[defenseKeys[di]] = rt > 0 ? Math.round((rt + newRt)/2) : newRt;
  v31.defenseMatrix.sessions++;
  v31.featureUsage31.defenseMatrix = true;
  saveV31(v31);
  playSFX31(success ? 'defense_block' : 'defense_slip');
  drawDefenseCanvas();
  checkAchievementsV31();
};
window._v31DefenseReset = function(){
  v31.defenseMatrix = defV31().defenseMatrix;
  saveV31(v31); drawDefenseCanvas();
};

// ============================================================
// SECTION 4: TRAINING INTENSITY ZONE ANALYZER Canvas 620x400
// ============================================================
var sec4 = document.createElement('div');
sec4.id = 'v31-sec-4';
sec4.style.cssText = 'display:none;max-width:700px;margin:20px auto;padding:0 12px;';
sec4.innerHTML = '<div class="v31-card"><div class="v31-hdr">🔥 트레이닝 인텐시티 존 분석기</div><div class="v31-sub">5존(recovery/endurance/tempo/threshold/max-effort) 영역 차트 + 존 분포 도넛 + 주간 트렌드 + 과훈련 위험도</div><canvas id="v31-c4" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#0f0a1e;display:block;margin:0 auto"></canvas><div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap" id="v31-c4-controls"></div></div>';
document.body.appendChild(sec4);

var zoneNames31 = ['회복','지구력','템포','역치','최대노력'];
var zoneColors31 = ['#22c55e','#3b82f6','#eab308','#f97316','#FF4444'];

function initIntensityControls(){
  var wrap = document.getElementById('v31-c4-controls');
  if(!wrap) return;
  wrap.innerHTML = '';
  for(var z=0;z<5;z++){
    var b = document.createElement('button');
    b.className = 'v31-btn';
    b.style.cssText += ';font-size:10px;padding:5px 10px;background:linear-gradient(135deg,' + zoneColors31[z] + ',' + zoneColors31[z] + '88)';
    b.textContent = '+' + zoneNames31[z];
    b.setAttribute('data-zone', z);
    b.onclick = function(){ window._v31AddIntensity(parseInt(this.getAttribute('data-zone'))); };
    wrap.appendChild(b);
  }
  var btnW = document.createElement('button'); btnW.className = 'v31-btn-sec'; btnW.textContent = '주간 저장';
  btnW.onclick = window._v31SaveWeek;
  wrap.appendChild(btnW);
  var btnR = document.createElement('button'); btnR.className = 'v31-btn-sec'; btnR.textContent = '리셋';
  btnR.onclick = window._v31IntensityReset;
  wrap.appendChild(btnR);
}

function drawIntensityCanvas(){
  var c = document.getElementById('v31-c4');
  if(!c) return;
  var ctx = c.getContext('2d');
  var total = 0;
  for(var z=0;z<5;z++) total += v31.intensityZone.zones[z];
  if(total === 0){ drawEmptyState(ctx,620,400); return; }

  ctx.clearRect(0,0,620,400);
  ctx.fillStyle = '#0f0a1e'; ctx.fillRect(0,0,620,400);

  ctx.fillStyle = '#f0f0f0'; ctx.font = 'bold 13px sans-serif';
  ctx.fillText('트레이닝 인텐시티 존 분석기', 20, 25);

  // Timeline stacked area (using stored timeline points)
  var tx = 50, ty = 50, tw = 380, th = 200;
  var tl = v31.intensityZone.timeline;
  if(tl.length > 1){
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.5;
    for(var p=0;p<=100;p+=25){
      var yy = ty+th-(p/100)*th;
      ctx.beginPath(); ctx.moveTo(tx,yy); ctx.lineTo(tx+tw,yy); ctx.stroke();
      ctx.fillStyle = '#555'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(p+'%', 20, yy+3);
    }
    // Stacked area
    for(var z=4;z>=0;z--){
      ctx.beginPath();
      ctx.moveTo(tx, ty+th);
      for(var i=0;i<tl.length;i++){
        var x = tx + (i/(tl.length-1))*tw;
        var cumPct = 0;
        for(var zz=0;zz<=z;zz++) cumPct += (tl[i][zz] || 0);
        var y = ty+th-(cumPct/Math.max(1,total))*th*5;
        y = Math.max(ty, Math.min(ty+th, y));
        ctx.lineTo(x, y);
      }
      ctx.lineTo(tx+tw, ty+th);
      ctx.closePath();
      var cr = parseInt(zoneColors31[z].slice(1,3),16), cg = parseInt(zoneColors31[z].slice(3,5),16), cb = parseInt(zoneColors31[z].slice(5,7),16);
      ctx.fillStyle = 'rgba('+cr+','+cg+','+cb+',0.45)';
      ctx.fill();
    }
  } else {
    // Just show zone bars
    var barW = tw / 5;
    for(var z=0;z<5;z++){
      var h = (v31.intensityZone.zones[z]/total)*th;
      var cr = parseInt(zoneColors31[z].slice(1,3),16), cg = parseInt(zoneColors31[z].slice(3,5),16), cb = parseInt(zoneColors31[z].slice(5,7),16);
      ctx.fillStyle = 'rgba('+cr+','+cg+','+cb+',0.6)';
      ctx.fillRect(tx+z*barW+4, ty+th-h, barW-8, h);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(v31.intensityZone.zones[z], tx+z*barW+barW/2, ty+th-h-6);
      ctx.fillStyle = '#aaa'; ctx.font = '9px sans-serif';
      ctx.fillText(zoneNames31[z], tx+z*barW+barW/2, ty+th+14);
    }
  }

  // Donut chart (right)
  var dx = 510, dy = 150, dr = 55;
  var startAngle = -Math.PI/2;
  for(var z=0;z<5;z++){
    var sweep = (v31.intensityZone.zones[z]/total)*Math.PI*2;
    ctx.beginPath();
    ctx.arc(dx, dy, dr, startAngle, startAngle+sweep);
    ctx.arc(dx, dy, dr*0.55, startAngle+sweep, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = zoneColors31[z]; ctx.fill();
    startAngle += sweep;
  }
  ctx.fillStyle = '#0f0a1e'; ctx.beginPath(); ctx.arc(dx, dy, dr*0.5, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#aaa'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('존 분포', dx, dy+4);

  // Legend
  ctx.textAlign = 'left';
  for(var z=0;z<5;z++){
    var ly = 220 + z*18;
    ctx.fillStyle = zoneColors31[z]; ctx.fillRect(455, ly, 10, 10);
    ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
    var pct = Math.round((v31.intensityZone.zones[z]/total)*100);
    ctx.fillText(zoneNames31[z] + ' ' + pct + '%', 469, ly+9);
  }

  // Overtraining risk
  var highIntensity = v31.intensityZone.zones[3] + v31.intensityZone.zones[4];
  var risk = Math.round((highIntensity / total) * 100);
  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
  ctx.fillText('과훈련 위험도:', 50, ty+th+50);
  ctx.fillStyle = risk > 60 ? '#FF4444' : risk > 40 ? '#eab308' : '#22c55e';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(risk + '%', 150, ty+th+52);
  if(risk > 60) ctx.fillText('⚠ 주의 필요', 190, ty+th+52);

  // Weekly trend
  if(v31.intensityZone.weeklyTrend.length > 1){
    ctx.fillStyle = '#aaa'; ctx.font = 'bold 10px sans-serif';
    ctx.fillText('주간 트렌드', 300, ty+th+42);
    var wt = v31.intensityZone.weeklyTrend;
    var wtMax = 1;
    for(var i=0;i<wt.length;i++) if(wt[i]>wtMax) wtMax=wt[i];
    ctx.strokeStyle = '#FF4444'; ctx.lineWidth = 2;
    ctx.beginPath();
    for(var i=0;i<wt.length;i++){
      var x = 300 + (i/(Math.max(1,wt.length-1)))*200;
      var y = ty+th+55 + 30 - (wt[i]/wtMax)*30;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  ctx.textAlign = 'start';
}

window._v31AddIntensity = function(zone){
  v31.intensityZone.zones[zone]++;
  var snapshot = v31.intensityZone.zones.slice();
  v31.intensityZone.timeline.push(snapshot);
  if(v31.intensityZone.timeline.length > 50) v31.intensityZone.timeline.shift();
  v31.intensityZone.sessions++;
  v31.featureUsage31.intensityZone = true;
  saveV31(v31);
  playSFX31('intensity_up');
  drawIntensityCanvas();
  checkAchievementsV31();
};
window._v31SaveWeek = function(){
  var total = 0;
  for(var z=0;z<5;z++) total += v31.intensityZone.zones[z];
  v31.intensityZone.weeklyTrend.push(total);
  if(v31.intensityZone.weeklyTrend.length > 12) v31.intensityZone.weeklyTrend.shift();
  saveV31(v31);
  playSFX31('intensity_down');
  drawIntensityCanvas();
};
window._v31IntensityReset = function(){
  v31.intensityZone = defV31().intensityZone;
  saveV31(v31); drawIntensityCanvas();
};

// ============================================================
// SECTION 5: PUNCH SEQUENCE BUILDER Canvas 640x400
// ============================================================
var sec5 = document.createElement('div');
sec5.id = 'v31-sec-5';
sec5.style.cssText = 'display:none;max-width:700px;margin:20px auto;padding:0 12px;';
sec5.innerHTML = '<div class="v31-card"><div class="v31-hdr">🎯 펀치 시퀀스 빌더</div><div class="v31-sub">10개 프리셋 콤보 + 실행 시간 + 성공률% + 난이도</div><canvas id="v31-c5" width="640" height="400" style="width:100%;max-width:640px;border-radius:12px;background:#0f0a1e;display:block;margin:0 auto"></canvas><div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap" id="v31-c5-controls"></div></div>';
document.body.appendChild(sec5);

var comboNames = ['1-2 잡-크로스','1-1-2 더블잡-크로스','1-2-3 잡-크로스-훅','1-2-1-2 피스톤','1-2-3-2 클래식','1-6-3-2 바디어퍼-훅-크로스','3-3-2 더블훅-크로스','2-3-6-3-2 파이브펀치','1-2-5-2-3 콤비네이션','6-3-2-1-2-3 식스펀치'];
var comboDifficulty = [1,2,2,3,3,4,3,5,5,6];
var comboColors = ['#22c55e','#34d399','#3b82f6','#60a5fa','#8b5cf6','#a78bfa','#eab308','#f97316','#FF4444','#ec4899'];

function initComboControls(){
  var wrap = document.getElementById('v31-c5-controls');
  if(!wrap) return;
  wrap.innerHTML = '<span style="font-size:10px;color:#aaa">콤보:</span>';
  var sel = document.createElement('select');
  sel.id = 'v31-combo-sel';
  sel.style.cssText = 'padding:3px;background:#1a1230;color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:6px;font-size:10px;max-width:180px';
  for(var i=0;i<10;i++){
    var opt = document.createElement('option');
    opt.value = i; opt.textContent = (i+1)+'. '+comboNames[i].substring(0,20);
    sel.appendChild(opt);
  }
  wrap.appendChild(sel);
  var btnS = document.createElement('button'); btnS.className = 'v31-btn'; btnS.style.cssText += ';font-size:10px;padding:5px 10px';
  btnS.textContent = '성공 기록'; btnS.onclick = function(){ window._v31ComboRecord(true); };
  var btnF = document.createElement('button'); btnF.className = 'v31-btn-sec'; btnF.style.cssText += ';font-size:10px;padding:5px 10px';
  btnF.textContent = '실패 기록'; btnF.onclick = function(){ window._v31ComboRecord(false); };
  var btnR = document.createElement('button'); btnR.className = 'v31-btn-sec'; btnR.textContent = '리셋';
  btnR.onclick = window._v31ComboReset;
  wrap.appendChild(btnS); wrap.appendChild(btnF); wrap.appendChild(btnR);
}

function drawComboCanvas(){
  var c = document.getElementById('v31-c5');
  if(!c) return;
  var ctx = c.getContext('2d');
  var hasAny = false;
  for(var i=0;i<10;i++) if(v31.punchSequence.combos[i].attempts > 0){ hasAny = true; break; }
  if(!hasAny){ drawEmptyState(ctx,640,400); return; }

  ctx.clearRect(0,0,640,400);
  ctx.fillStyle = '#0f0a1e'; ctx.fillRect(0,0,640,400);

  ctx.fillStyle = '#f0f0f0'; ctx.font = 'bold 13px sans-serif';
  ctx.fillText('펀치 시퀀스 빌더', 20, 25);

  // Success rate bar chart
  var bx = 30, by = 50, barH = 24, gap = 6, bw = 350;
  ctx.fillStyle = '#aaa'; ctx.font = 'bold 10px sans-serif';
  ctx.fillText('콤보 성공률 (%)', bx, by-6);

  for(var i=0;i<10;i++){
    var y = by + i*(barH+gap);
    var combo = v31.punchSequence.combos[i];
    var rate = combo.attempts > 0 ? Math.round((combo.success/combo.attempts)*100) : 0;

    // Combo number
    ctx.fillStyle = comboColors[i]; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText((i+1)+'', bx, y+barH/2+3);

    // Background bar
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(bx+16, y, bw, barH);

    if(combo.attempts > 0){
      var w = (rate/100)*bw;
      var grd = ctx.createLinearGradient(bx+16,0,bx+16+w,0);
      grd.addColorStop(0, comboColors[i]+'66'); grd.addColorStop(1, comboColors[i]);
      ctx.fillStyle = grd;
      ctx.fillRect(bx+16, y, w, barH);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 9px sans-serif';
      ctx.fillText(rate+'% ('+combo.success+'/'+combo.attempts+')', bx+20+w, y+barH/2+3);
    }

    // Difficulty stars
    ctx.fillStyle = '#eab308'; ctx.font = '8px sans-serif';
    var stars = '';
    for(var s=0;s<comboDifficulty[i];s++) stars += '★';
    ctx.fillText(stars, bx+bw+30, y+barH/2+3);
  }

  // Right panel: selected combo detail
  var sel = v31.punchSequence.selectedCombo;
  var sc = v31.punchSequence.combos[sel];
  var sx = 430, sy = 50;
  ctx.fillStyle = comboColors[sel]; ctx.font = 'bold 11px sans-serif';
  ctx.fillText('▶ ' + comboNames[sel].substring(0,18), sx, sy);
  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
  ctx.fillText('시도: ' + sc.attempts, sx, sy+22);
  ctx.fillText('성공: ' + sc.success, sx, sy+38);
  var sRate = sc.attempts > 0 ? Math.round((sc.success/sc.attempts)*100) : 0;
  ctx.fillText('성공률: ' + sRate + '%', sx, sy+54);
  ctx.fillText('난이도: ' + comboDifficulty[sel] + '/6', sx, sy+70);

  // Combo flow visualization
  ctx.fillStyle = '#aaa'; ctx.font = 'bold 10px sans-serif';
  ctx.fillText('콤보 플로우', sx, sy+100);
  var parts = comboNames[sel].split(' ')[0].split('-');
  var punchLabels = {1:'잡',2:'크로스',3:'좌훅',4:'우훅',5:'좌어퍼',6:'우어퍼'};
  for(var p=0;p<parts.length;p++){
    var px = sx + p*28;
    var py = sy + 118;
    ctx.beginPath(); ctx.arc(px+10, py+10, 12, 0, Math.PI*2);
    ctx.fillStyle = comboColors[sel]+'66'; ctx.fill();
    ctx.strokeStyle = comboColors[sel]; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(parts[p], px+10, py+13);
    if(p < parts.length-1){
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px+22, py+10); ctx.lineTo(px+28, py+10); ctx.stroke();
    }
  }

  // Recommended drill
  ctx.textAlign = 'left';
  ctx.fillStyle = '#666'; ctx.font = '9px sans-serif';
  ctx.fillText('추천: 느린 속도로 시작 → 점진적 가속', sx, sy+170);
  ctx.textAlign = 'start';
}

window._v31ComboRecord = function(success){
  var sel = document.getElementById('v31-combo-sel');
  var idx = sel ? parseInt(sel.value) : 0;
  v31.punchSequence.selectedCombo = idx;
  v31.punchSequence.combos[idx].attempts++;
  if(success) v31.punchSequence.combos[idx].success++;
  v31.punchSequence.sessions++;
  v31.featureUsage31.punchSequence = true;
  saveV31(v31);
  playSFX31(success ? 'combo_hit' : 'combo_miss');
  drawComboCanvas();
  checkAchievementsV31();
};
window._v31ComboReset = function(){
  v31.punchSequence = defV31().punchSequence;
  saveV31(v31); drawComboCanvas();
};

// ============================================================
// SECTION 6: ROUND ENERGY DISTRIBUTION OPTIMIZER Canvas 620x400
// ============================================================
var sec6 = document.createElement('div');
sec6.id = 'v31-sec-6';
sec6.style.cssText = 'display:none;max-width:700px;margin:20px auto;padding:0 12px;';
sec6.innerHTML = '<div class="v31-card"><div class="v31-hdr">⚡ 라운드별 체력 분배 최적화기</div><div class="v31-sub">12R 체력 배분 (공격/방어/이동/휴식) + 최적 분배 비교 + 효율 갭 분석 + S~D 등급</div><canvas id="v31-c6" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#0f0a1e;display:block;margin:0 auto"></canvas><div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap" id="v31-c6-controls"></div></div>';
document.body.appendChild(sec6);

var energyTypes = ['공격','방어','이동','휴식'];
var energyKeys = ['attack','defense','movement','rest'];
var energyColors = ['#FF4444','#3b82f6','#eab308','#22c55e'];
var optimalDist = [{attack:40,defense:25,movement:25,rest:10},{attack:35,defense:30,movement:25,rest:10},{attack:40,defense:20,movement:30,rest:10},{attack:45,defense:20,movement:25,rest:10},{attack:35,defense:25,movement:25,rest:15},{attack:40,defense:25,movement:20,rest:15},{attack:35,defense:30,movement:20,rest:15},{attack:30,defense:30,movement:20,rest:20},{attack:35,defense:25,movement:25,rest:15},{attack:40,defense:20,movement:25,rest:15},{attack:30,defense:25,movement:20,rest:25},{attack:25,defense:20,movement:15,rest:40}];

function initEnergyControls(){
  var wrap = document.getElementById('v31-c6-controls');
  if(!wrap) return;
  wrap.innerHTML = '<span style="font-size:10px;color:#aaa">R:</span>';
  var selR = document.createElement('select');
  selR.id = 'v31-energy-round';
  selR.style.cssText = 'padding:3px;background:#1a1230;color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:6px;font-size:10px;margin-right:4px';
  for(var i=0;i<12;i++){
    var opt = document.createElement('option');
    opt.value = i; opt.textContent = 'R'+(i+1);
    selR.appendChild(opt);
  }
  wrap.appendChild(selR);
  for(var e=0;e<4;e++){
    var b = document.createElement('button');
    b.className = 'v31-btn';
    b.style.cssText += ';font-size:9px;padding:5px 8px;background:linear-gradient(135deg,' + energyColors[e] + ',' + energyColors[e] + '88)';
    b.textContent = '+' + energyTypes[e];
    b.setAttribute('data-energy', e);
    b.onclick = function(){ window._v31AddEnergy(parseInt(this.getAttribute('data-energy'))); };
    wrap.appendChild(b);
  }
  var btnR = document.createElement('button'); btnR.className = 'v31-btn-sec'; btnR.textContent = '리셋';
  btnR.onclick = window._v31EnergyReset;
  wrap.appendChild(btnR);
}

function drawEnergyCanvas(){
  var c = document.getElementById('v31-c6');
  if(!c) return;
  var ctx = c.getContext('2d');
  var hasAny = false;
  for(var r=0;r<12;r++) for(var e=0;e<4;e++) if(v31.energyDist.rounds[r][energyKeys[e]] > 0){ hasAny = true; break; }
  if(!hasAny){ drawEmptyState(ctx,620,400); return; }

  ctx.clearRect(0,0,620,400);
  ctx.fillStyle = '#0f0a1e'; ctx.fillRect(0,0,620,400);

  ctx.fillStyle = '#f0f0f0'; ctx.font = 'bold 13px sans-serif';
  ctx.fillText('라운드별 체력 분배 최적화기', 20, 25);

  // Stacked bar chart
  var bx = 50, by = 50, bh = 220, bw = 36, gap = 7;
  for(var r=0;r<12;r++){
    var total = 0;
    for(var e=0;e<4;e++) total += v31.energyDist.rounds[r][energyKeys[e]];
    if(total === 0) continue;

    var x = bx + r*(bw+gap);
    var stackY = by + bh;
    for(var e=0;e<4;e++){
      var val = v31.energyDist.rounds[r][energyKeys[e]];
      var pct = val/total;
      var h = pct * bh;
      stackY -= h;
      ctx.fillStyle = energyColors[e];
      ctx.fillRect(x, stackY, bw, h);
    }

    // Optimal distribution overlay (dashed lines)
    var optStackY = by + bh;
    var opt = optimalDist[r];
    ctx.setLineDash([3,3]);
    for(var e=0;e<4;e++){
      var oh = (opt[energyKeys[e]]/100)*bh;
      optStackY -= oh;
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x-2, optStackY); ctx.lineTo(x+bw+2, optStackY); ctx.stroke();
    }
    ctx.setLineDash([]);

    // Round label
    ctx.fillStyle = '#888'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('R'+(r+1), x+bw/2, by+bh+16);
  }

  // Efficiency gap analysis
  var totalGap = 0, roundsUsed = 0;
  for(var r=0;r<12;r++){
    var total = 0;
    for(var e=0;e<4;e++) total += v31.energyDist.rounds[r][energyKeys[e]];
    if(total === 0) continue;
    roundsUsed++;
    var opt = optimalDist[r];
    for(var e=0;e<4;e++){
      var actual = (v31.energyDist.rounds[r][energyKeys[e]]/total)*100;
      totalGap += Math.abs(actual - opt[energyKeys[e]]);
    }
  }
  var avgGap = roundsUsed > 0 ? Math.round(totalGap / roundsUsed) : 0;
  var efficiency = Math.max(0, 100 - avgGap);
  var grade = gradeFor31(efficiency);
  v31.energyDist.bestGrade = grade;

  ctx.textAlign = 'left';
  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
  ctx.fillText('효율 갭: ' + avgGap.toFixed(1) + '%', 50, by+bh+45);
  ctx.fillText('최적화 점수: ' + efficiency, 50, by+bh+62);
  ctx.fillStyle = gradeColor31(grade); ctx.font = 'bold 18px sans-serif';
  ctx.fillText(grade, 200, by+bh+58);

  // Legend
  for(var e=0;e<4;e++){
    ctx.fillStyle = energyColors[e]; ctx.fillRect(300+e*70, by+bh+45, 10, 3);
    ctx.fillStyle = '#888'; ctx.font = '9px sans-serif';
    ctx.fillText(energyTypes[e], 313+e*70, by+bh+49);
  }
  ctx.fillStyle = '#666'; ctx.font = '9px sans-serif';
  ctx.fillText('--- 최적 분배 기준선', 300, by+bh+65);

  // Pacing recommendation
  ctx.fillStyle = '#888'; ctx.font = '10px sans-serif';
  var advice = efficiency >= 75 ? '페이싱 우수! 현재 전략 유지' : efficiency >= 50 ? '방어와 휴식 배분 조정 필요' : '체력 분배 재설계 필요';
  ctx.fillText('전략: ' + advice, 50, by+bh+80);
  ctx.textAlign = 'start';
}

window._v31AddEnergy = function(energyIdx){
  var sel = document.getElementById('v31-energy-round');
  var round = sel ? parseInt(sel.value) : 0;
  v31.energyDist.rounds[round][energyKeys[energyIdx]] += 5;
  v31.energyDist.sessions++;
  v31.featureUsage31.energyDist = true;
  saveV31(v31);
  playSFX31('energy_opt');
  drawEnergyCanvas();
  checkAchievementsV31();
};
window._v31EnergyReset = function(){
  v31.energyDist = defV31().energyDist;
  saveV31(v31); drawEnergyCanvas();
};

// ============================================================
// SECTION 7: BOXING STANCE CORRECTOR Canvas 620x400
// ============================================================
var sec7 = document.createElement('div');
sec7.id = 'v31-sec-7';
sec7.style.cssText = 'display:none;max-width:700px;margin:20px auto;padding:0 12px;';
sec7.innerHTML = '<div class="v31-card"><div class="v31-hdr">🤼 복싱 스탠스 교정기</div><div class="v31-sub">8요소 레이더 (foot-width/weight-dist/guard-height/chin-tuck/elbow/hip/knee/shoulder) + 현재 vs 이상 + S~D</div><canvas id="v31-c7" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#0f0a1e;display:block;margin:0 auto"></canvas><div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap" id="v31-c7-controls"></div></div>';
document.body.appendChild(sec7);

var stanceNames = ['발 너비','체중 분배','가드 높이','턴 당김','팔꿈치 위치','힝 각도','무릎 굽힘','어깨 정렬'];
var stanceKeys = ['footWidth','weightDist','guardHeight','chinTuck','elbowPos','hipAngle','kneeBend','shoulderAlign'];
var stanceColors = ['#FF4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899'];
var idealStance = {orthodox:{footWidth:80,weightDist:55,guardHeight:85,chinTuck:90,elbowPos:75,hipAngle:70,kneeBend:65,shoulderAlign:80}, southpaw:{footWidth:80,weightDist:45,guardHeight:85,chinTuck:90,elbowPos:75,hipAngle:70,kneeBend:65,shoulderAlign:80}};

function initStanceControls(){
  var wrap = document.getElementById('v31-c7-controls');
  if(!wrap) return;
  wrap.innerHTML = '<span style="font-size:10px;color:#aaa">요소:</span>';
  var selE = document.createElement('select');
  selE.id = 'v31-stance-elem';
  selE.style.cssText = 'padding:3px;background:#1a1230;color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:6px;font-size:10px;margin-right:4px';
  for(var i=0;i<8;i++){
    var opt = document.createElement('option');
    opt.value = i; opt.textContent = stanceNames[i];
    selE.appendChild(opt);
  }
  wrap.appendChild(selE);
  var btnUp = document.createElement('button'); btnUp.className = 'v31-btn'; btnUp.style.cssText += ';font-size:10px;padding:5px 10px';
  btnUp.textContent = '+10'; btnUp.onclick = function(){ window._v31StanceAdjust(10); };
  var btnDn = document.createElement('button'); btnDn.className = 'v31-btn-sec'; btnDn.style.cssText += ';font-size:10px;padding:5px 10px';
  btnDn.textContent = '-10'; btnDn.onclick = function(){ window._v31StanceAdjust(-10); };
  wrap.appendChild(btnUp); wrap.appendChild(btnDn);

  var selStyle = document.createElement('select');
  selStyle.id = 'v31-stance-style';
  selStyle.style.cssText = 'padding:3px;background:#1a1230;color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:6px;font-size:10px;margin-left:6px';
  var opt1 = document.createElement('option'); opt1.value = 0; opt1.textContent = '오소독스';
  var opt2 = document.createElement('option'); opt2.value = 1; opt2.textContent = '사우스파';
  selStyle.appendChild(opt1); selStyle.appendChild(opt2);
  selStyle.onchange = function(){ v31.stanceCorrector.style = parseInt(this.value); saveV31(v31); drawStanceCanvas(); };
  wrap.appendChild(selStyle);

  var btnR = document.createElement('button'); btnR.className = 'v31-btn-sec'; btnR.textContent = '리셋';
  btnR.onclick = window._v31StanceReset;
  wrap.appendChild(btnR);
}

function drawStanceCanvas(){
  var c = document.getElementById('v31-c7');
  if(!c) return;
  var ctx = c.getContext('2d');
  var hasAny = false;
  for(var i=0;i<8;i++) if(v31.stanceCorrector.elements[stanceKeys[i]] > 0){ hasAny = true; break; }
  if(!hasAny){ drawEmptyState(ctx,620,400); return; }

  ctx.clearRect(0,0,620,400);
  ctx.fillStyle = '#0f0a1e'; ctx.fillRect(0,0,620,400);

  ctx.fillStyle = '#f0f0f0'; ctx.font = 'bold 13px sans-serif';
  ctx.fillText('복싱 스탠스 교정기', 20, 25);

  var styleName = v31.stanceCorrector.style === 0 ? '오소독스' : '사우스파';
  ctx.fillStyle = '#aaa'; ctx.font = '11px sans-serif';
  ctx.fillText('스타일: ' + styleName, 20, 45);

  // Radar chart: current vs ideal
  var rcx = 200, rcy = 230, rr = 120;
  var n = 8;
  var ideal = v31.stanceCorrector.style === 0 ? idealStance.orthodox : idealStance.southpaw;

  // Grid
  for(var lvl=1;lvl<=4;lvl++){
    var lr = rr*(lvl/4);
    ctx.beginPath();
    for(var i=0;i<=n;i++){
      var angle = (i/n)*Math.PI*2 - Math.PI/2;
      ctx.lineTo(rcx+Math.cos(angle)*lr, rcy+Math.sin(angle)*lr);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 0.5; ctx.stroke();
  }
  // Axes + labels
  for(var i=0;i<n;i++){
    var angle = (i/n)*Math.PI*2 - Math.PI/2;
    ctx.beginPath(); ctx.moveTo(rcx,rcy);
    ctx.lineTo(rcx+Math.cos(angle)*rr, rcy+Math.sin(angle)*rr);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.stroke();
    var lx = rcx+Math.cos(angle)*(rr+20);
    var ly = rcy+Math.sin(angle)*(rr+20);
    ctx.fillStyle = '#aaa'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(stanceNames[i], lx, ly+4);
  }

  // Ideal polygon
  ctx.beginPath();
  for(var i=0;i<n;i++){
    var angle = (i/n)*Math.PI*2 - Math.PI/2;
    var val = ideal[stanceKeys[i]] / 100;
    ctx.lineTo(rcx+Math.cos(angle)*rr*val, rcy+Math.sin(angle)*rr*val);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(34,197,94,0.12)'; ctx.fill();
  ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 1.5; ctx.setLineDash([4,4]); ctx.stroke();
  ctx.setLineDash([]);

  // Current polygon
  ctx.beginPath();
  for(var i=0;i<n;i++){
    var angle = (i/n)*Math.PI*2 - Math.PI/2;
    var val = v31.stanceCorrector.elements[stanceKeys[i]] / 100;
    ctx.lineTo(rcx+Math.cos(angle)*rr*val, rcy+Math.sin(angle)*rr*val);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,68,68,0.2)'; ctx.fill();
  ctx.strokeStyle = '#FF4444'; ctx.lineWidth = 2; ctx.stroke();

  // Right panel: correction priority
  var px = 380, py = 60;
  ctx.fillStyle = '#aaa'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('교정 우선순위', px, py);

  // Sort by gap
  var gaps = [];
  for(var i=0;i<8;i++){
    var gap2 = ideal[stanceKeys[i]] - v31.stanceCorrector.elements[stanceKeys[i]];
    gaps.push({idx:i, gap:gap2, absGap:Math.abs(gap2)});
  }
  gaps.sort(function(a,b){ return b.absGap - a.absGap; });

  for(var i=0;i<8;i++){
    var g = gaps[i];
    var y = py + 18 + i*32;
    ctx.fillStyle = g.absGap > 30 ? '#FF4444' : g.absGap > 15 ? '#eab308' : '#22c55e';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText((i+1)+'. '+stanceNames[g.idx], px, y);
    ctx.fillStyle = '#888'; ctx.font = '9px sans-serif';
    var direction = g.gap > 0 ? '+'+g.gap+' 필요' : g.gap < 0 ? g.gap+' 필요' : '완벽';
    ctx.fillText('현재:'+v31.stanceCorrector.elements[stanceKeys[g.idx]]+' 이상:'+ideal[stanceKeys[g.idx]]+' ('+direction+')', px, y+14);
  }

  // Overall stance score + grade
  var totalDiff = 0;
  for(var i=0;i<8;i++){
    totalDiff += Math.abs(ideal[stanceKeys[i]] - v31.stanceCorrector.elements[stanceKeys[i]]);
  }
  var stanceScore = Math.max(0, 100 - Math.round(totalDiff / 4));
  var grade = gradeFor31(stanceScore);
  v31.stanceCorrector.bestGrade = grade;

  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
  ctx.fillText('스탠스 점수: ' + stanceScore, px, py+280);
  ctx.fillStyle = gradeColor31(grade); ctx.font = 'bold 20px sans-serif';
  ctx.fillText(grade, px+130, py+282);

  // Legend
  ctx.fillStyle = '#22c55e'; ctx.fillRect(px, py+300, 10, 3);
  ctx.fillStyle = '#888'; ctx.font = '9px sans-serif';
  ctx.fillText('이상', px+14, py+304);
  ctx.fillStyle = '#FF4444'; ctx.fillRect(px+60, py+300, 10, 3);
  ctx.fillText('현재', px+74, py+304);
  ctx.textAlign = 'start';
}

window._v31StanceAdjust = function(delta){
  var sel = document.getElementById('v31-stance-elem');
  var idx = sel ? parseInt(sel.value) : 0;
  var key = stanceKeys[idx];
  v31.stanceCorrector.elements[key] = Math.max(0, Math.min(100, v31.stanceCorrector.elements[key] + delta));
  v31.stanceCorrector.sessions++;
  v31.featureUsage31.stanceCorrector = true;
  saveV31(v31);
  playSFX31(delta > 0 ? 'stance_good' : 'stance_fix');
  drawStanceCanvas();
  checkAchievementsV31();
};
window._v31StanceReset = function(){
  v31.stanceCorrector = defV31().stanceCorrector;
  saveV31(v31); drawStanceCanvas();
};

// ============================================================
// SECTION 8: COMPREHENSIVE FIGHTER COMBAT POWER DASHBOARD Canvas 620x400
// ============================================================
var sec8 = document.createElement('div');
sec8.id = 'v31-sec-8';
sec8.style.cssText = 'display:none;max-width:700px;margin:20px auto;padding:0 12px;';
sec8.innerHTML = '<div class="v31-card"><div class="v31-hdr">🏆 종합 파이터 전투력 대시보드</div><div class="v31-sub">8 KPI 반원 게이지 (volume/footwork/defense/intensity/combos/energy/stance/combat-IQ) + 가중 S~D + 20세션 히스토리</div><canvas id="v31-c8" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#0f0a1e;display:block;margin:0 auto"></canvas><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><button class="v31-btn" onclick="window._v31DashboardEval()">종합 평가</button><button class="v31-btn-sec" onclick="window._v31DashboardReset()">리셋</button></div></div>';
document.body.appendChild(sec8);

var dashKPINames = ['볼륨','풋워크','방어','인텐시티','콤보','체력분배','스탠스','전투 IQ'];
var dashKPIKeys = ['volume','footwork','defense','intensity','combos','energy','stance','combatIQ'];
var dashColors = ['#FF4444','#f97316','#eab308','#22c55e','#3b82f6','#06b6d4','#8b5cf6','#ec4899'];
var dashWeights = [0.15,0.1,0.15,0.1,0.1,0.1,0.15,0.15];

function drawDashboardCanvas(){
  var c = document.getElementById('v31-c8');
  if(!c) return;
  var ctx = c.getContext('2d');
  var hasAny = false;
  for(var i=0;i<8;i++) if(v31.combatDashboard.kpis[dashKPIKeys[i]] > 0){ hasAny = true; break; }
  if(!hasAny){ drawEmptyState(ctx,620,400); return; }

  ctx.clearRect(0,0,620,400);
  ctx.fillStyle = '#0f0a1e'; ctx.fillRect(0,0,620,400);

  ctx.fillStyle = '#f0f0f0'; ctx.font = 'bold 13px sans-serif';
  ctx.fillText('종합 파이터 전투력 대시보드', 20, 25);

  // 8 half-circle gauges in 4x2 grid
  var gw = 130, gh = 80, gx0 = 35, gy0 = 50;
  var weightedSum = 0;

  for(var i=0;i<8;i++){
    var col = i%4, row = Math.floor(i/4);
    var cx = gx0 + col*(gw+12) + gw/2;
    var cy = gy0 + row*(gh+55) + gh;
    var r = 40;
    var val = v31.combatDashboard.kpis[dashKPIKeys[i]];
    weightedSum += val * dashWeights[i];

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 0);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 7; ctx.stroke();

    // Value arc
    var sweepAngle = (val/100)*Math.PI;
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, Math.PI + sweepAngle);
    ctx.strokeStyle = dashColors[i]; ctx.lineWidth = 7; ctx.stroke();

    // Value text
    ctx.fillStyle = '#fff'; ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(val, cx, cy-6);

    // Grade
    var g = gradeFor31(val);
    ctx.fillStyle = gradeColor31(g); ctx.font = 'bold 10px sans-serif';
    ctx.fillText(g, cx, cy+8);

    // Label
    ctx.fillStyle = '#aaa'; ctx.font = '9px sans-serif';
    ctx.fillText(dashKPINames[i], cx, cy+24);
  }

  // Overall grade
  var overall = Math.round(weightedSum);
  var overallGrade = gradeFor31(overall);
  v31.combatDashboard.overallGrade = overallGrade;

  // 20-session history line chart (bottom area)
  var hx = 50, hy = 310, hw = 350, hh = 60;
  ctx.fillStyle = '#aaa'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('세션 히스토리', hx, hy-5);

  if(v31.combatDashboard.history.length > 1){
    var hist = v31.combatDashboard.history;
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(hx, hy+hh); ctx.lineTo(hx+hw, hy+hh); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx+hw, hy); ctx.stroke();

    ctx.strokeStyle = '#FF4444'; ctx.lineWidth = 2;
    ctx.beginPath();
    for(var i=0;i<hist.length;i++){
      var x = hx + (i/(Math.max(1,hist.length-1)))*hw;
      var y = hy + hh - (hist[i]/100)*hh;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
    for(var i=0;i<hist.length;i++){
      var x = hx + (i/(Math.max(1,hist.length-1)))*hw;
      var y = hy + hh - (hist[i]/100)*hh;
      ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2);
      ctx.fillStyle = '#FF4444'; ctx.fill();
    }
  } else {
    ctx.fillStyle = '#555'; ctx.font = '10px sans-serif';
    ctx.fillText('평가 2회 이상 시 트렌드 표시', hx, hy+30);
  }

  // Overall grade display
  ctx.fillStyle = '#aaa'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('종합 전투력', 520, 320);
  ctx.fillStyle = gradeColor31(overallGrade); ctx.font = 'bold 32px sans-serif';
  ctx.fillText(overallGrade, 520, 358);
  ctx.fillStyle = '#888'; ctx.font = '11px sans-serif';
  ctx.fillText(overall + '/100', 520, 378);
  ctx.textAlign = 'start';
}

window._v31DashboardEval = function(){
  // Pull KPI data from other features
  var totalPunches = 0;
  for(var r=0;r<12;r++) for(var p=0;p<4;p++) totalPunches += v31.punchVolume.rounds[r][punchKeys[p]];
  v31.combatDashboard.kpis.volume = Math.min(100, Math.round(totalPunches / 3.6));

  var fwTotal = 0, fwUsed = 0;
  for(var i=0;i<8;i++){
    fwTotal += v31.footwork.patterns[fwKeys[i]];
    if(v31.footwork.patterns[fwKeys[i]] > 0) fwUsed++;
  }
  v31.combatDashboard.kpis.footwork = Math.min(100, Math.round((fwTotal/5)*(fwUsed/8)*100/100));

  var defSuccess=0,defTotal=0;
  for(var k in v31.defenseMatrix.matrix){
    defSuccess += v31.defenseMatrix.matrix[k].success;
    defTotal += v31.defenseMatrix.matrix[k].total;
  }
  v31.combatDashboard.kpis.defense = defTotal > 0 ? Math.round((defSuccess/defTotal)*100) : 0;

  var intTotal=0;
  for(var z=0;z<5;z++) intTotal += v31.intensityZone.zones[z];
  v31.combatDashboard.kpis.intensity = intTotal > 0 ? Math.min(100, Math.round(intTotal*5)) : 0;

  var comboSuccess=0, comboAttempts=0;
  for(var i=0;i<10;i++){
    comboSuccess += v31.punchSequence.combos[i].success;
    comboAttempts += v31.punchSequence.combos[i].attempts;
  }
  v31.combatDashboard.kpis.combos = comboAttempts > 0 ? Math.round((comboSuccess/comboAttempts)*100) : 0;

  // Energy efficiency
  var eRounds=0, eTotalGap=0;
  for(var r=0;r<12;r++){
    var et=0;
    for(var e=0;e<4;e++) et += v31.energyDist.rounds[r][energyKeys[e]];
    if(et>0){
      eRounds++;
      for(var e=0;e<4;e++){
        var actual=(v31.energyDist.rounds[r][energyKeys[e]]/et)*100;
        eTotalGap += Math.abs(actual - optimalDist[r][energyKeys[e]]);
      }
    }
  }
  v31.combatDashboard.kpis.energy = eRounds > 0 ? Math.max(0, 100 - Math.round(eTotalGap/eRounds)) : 0;

  // Stance
  var ideal2 = v31.stanceCorrector.style === 0 ? idealStance.orthodox : idealStance.southpaw;
  var sDiff = 0, sHas = false;
  for(var i=0;i<8;i++){
    if(v31.stanceCorrector.elements[stanceKeys[i]] > 0) sHas = true;
    sDiff += Math.abs(ideal2[stanceKeys[i]] - v31.stanceCorrector.elements[stanceKeys[i]]);
  }
  v31.combatDashboard.kpis.stance = sHas ? Math.max(0, 100 - Math.round(sDiff/4)) : 0;

  // Combat IQ: average of other KPIs
  var iqSum = 0, iqCount = 0;
  for(var i=0;i<7;i++){
    if(v31.combatDashboard.kpis[dashKPIKeys[i]] > 0){ iqSum += v31.combatDashboard.kpis[dashKPIKeys[i]]; iqCount++; }
  }
  v31.combatDashboard.kpis.combatIQ = iqCount > 0 ? Math.round(iqSum / iqCount) : 0;

  // History
  var ws = 0;
  for(var i=0;i<8;i++) ws += v31.combatDashboard.kpis[dashKPIKeys[i]] * dashWeights[i];
  v31.combatDashboard.history.push(Math.round(ws));
  if(v31.combatDashboard.history.length > 20) v31.combatDashboard.history.shift();

  v31.combatDashboard.sessions++;
  v31.featureUsage31.combatDashboard = true;
  saveV31(v31);
  playSFX31('achieve31');
  drawDashboardCanvas();
  checkAchievementsV31();
};
window._v31DashboardReset = function(){
  v31.combatDashboard = defV31().combatDashboard;
  saveV31(v31); drawDashboardCanvas();
};

// ============================================================
// SECTION 9: QUIZ V31: 15 Questions
// ============================================================
var quizV31Data = [
  {q:'펀치 볼륨 밀도 분석에서 &quot;분당 펀치&quot;가 높을수록 의미하는 것은?',a:['방어력 증가','공격 훈련 밀도 증가','체력 저하','반칙 위험'],c:1},
  {q:'풋워크 패턴 다양성 지수가 높을수록 좋은 이유는?',a:['상대가 예측하기 어려워진다','체력 소모가 줄어든다','펀치 파워가 증가한다','심판이 점수를 더 준다'],c:0},
  {q:'디펜스 리액션 매트릭스에서 &quot;슬립&quot;이 가장 효과적인 공격 유형은?',a:['어퍼컷','잡/크로스 직선 펀치','훅','바디 샷'],c:1},
  {q:'트레이닝 인텐시티 5존 중 &quot;역치 존&quot;의 주된 목적은?',a:['회복과 휴식','지방 연소','무산소 능력 근처 강도 훈련','기술 다양화'],c:2},
  {q:'펀치 시퀀스 빌더에서 1-2-3-2 콤보의 구성은?',a:['잡-크로스-좌훅-크로스','잡-잡-크로스-훅','크로스-훅-어퍼컷-잡','훅-크로스-잡-어퍼컷'],c:0},
  {q:'라운드 체력 분배에서 후반 라운드에 휴식 비중을 높이는 이유는?',a:['경기 포기','체력 보존과 마무리 폭발 준비','반칙 회피','심판 인상 관리'],c:1},
  {q:'복싱 스탠스 8요소 중 &quot;턴 당김&quot;이 중요한 이유는?',a:['공격력 증가','턴 보호로 KO 예방','발 속도 향상','펌싱 도움'],c:1},
  {q:'종합 전투력 대시보드에서 가장 높은 가중치(15%)를 가진 KPI는?',a:['인텐시티와 콤보','볼륨만 해당','볼륨/방어/스탠스/전투IQ (4개 각 15%)','풋워크와 체력분배'],c:2},
  {q:'과훈련 위험도를 낮추려면 어떤 존을 늘려야 하는가?',a:['최대노력 존','역치 존','회복 존','템포 존'],c:2},
  {q:'방어 반응 매트릭스에서 &quot;숄더 롤&quot;은 어떤 공격에 특화된 방어법인가?',a:['잡','크로스/오버핸드 펀치','어퍼컷','바디 샷'],c:1},
  {q:'콤보 난이도가 높아지는 주된 요인은?',a:['펀치 파워 증가','펀치 수 증가와 조합 복잡성','발 속도','방어력'],c:1},
  {q:'오소독스 스탠스에서 체중 분배의 이상적인 비율은?',a:['앞발 50% : 뒷발 50%','앞발 55% : 뒷발 45%','앞발 70% : 뒷발 30%','앞발 30% : 뒷발 70%'],c:1},
  {q:'FightCamp 스타일의 라운드별 분석에서 가장 중요한 지표는?',a:['친구 수','펀치 볼륨과 정확도','휠식 시간','발 위치'],c:1},
  {q:'BOXX의 핵심 경쟁 요소인 &quot;고급 풋워크 드릴&quot;에 해당하는 본 시스템 기능은?',a:['체력 분배','풋워크 패턴 매퍼','스탠스 교정기','펀치 볼륨'],c:1},
  {q:'전투 IQ 점수가 다른 KPI의 평균으로 계산되는 이유는?',a:['계산 편의','종합적 실력 반영','랜덤 요소 배제','시스템 제한'],c:1}
];

var secQuiz31 = document.createElement('div');
secQuiz31.id = 'v31-sec-9';
secQuiz31.style.cssText = 'display:none;max-width:680px;margin:20px auto;padding:0 12px;';
var quizHtml31 = '<div class="v31-card"><div class="v31-hdr">🎯 복싱 퀀즈 v31 (15문)</div>';
for(var qi=0;qi<quizV31Data.length;qi++){
  var qq = quizV31Data[qi];
  quizHtml31 += '<div style="margin:10px 0;padding:10px;background:var(--surface,rgba(255,255,255,0.03));border-radius:10px"><div style="font-size:12px;font-weight:700;margin-bottom:6px">Q'+(qi+1)+'. '+qq.q+'</div>';
  for(var ai=0;ai<qq.a.length;ai++){
    quizHtml31 += '<button onclick="window._v31QuizAnswer('+qi+','+ai+')" style="display:block;width:100%;text-align:left;padding:6px 10px;margin:3px 0;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;color:var(--text,#f0f0f0);font-size:11px;cursor:pointer" id="v31-q'+qi+'-a'+ai+'">'+qq.a[ai]+'</button>';
  }
  quizHtml31 += '<div id="v31-q'+qi+'-result" style="font-size:11px;margin-top:4px;min-height:16px"></div></div>';
}
quizHtml31 += '</div>';
secQuiz31.innerHTML = quizHtml31;
document.body.appendChild(secQuiz31);

window._v31QuizAnswer = function(qi, ai){
  var qq = quizV31Data[qi];
  var resEl = document.getElementById('v31-q'+qi+'-result');
  if(v31.quizV31Scores[qi] !== undefined) return;
  var correct = ai === qq.c;
  v31.quizV31Scores[qi] = correct ? 1 : 0;
  for(var j=0;j<qq.a.length;j++){
    var btn = document.getElementById('v31-q'+qi+'-a'+j);
    if(j===qq.c) btn.style.border = '2px solid #22c55e';
    else if(j===ai && !correct) btn.style.border = '2px solid #FF4444';
    btn.style.pointerEvents = 'none';
  }
  resEl.innerHTML = correct ? '<span style="color:#22c55e">✅ 정답!</span>' : '<span style="color:#FF4444">❌ 오답. 정답: '+qq.a[qq.c]+'</span>';
  saveV31(v31);
  if(correct) playSFX31('quiz_correct31');
  checkAchievementsV31();
};

// ============================================================
// ACHIEVEMENTS V31 (+12)
// ============================================================
var achieveV31Defs = [
  {id:'a31_volume_1',name:'첫 펀치',desc:'펀치 볼륨 분석에 처음 기록',check:function(){return v31.punchVolume.sessions>=1}},
  {id:'a31_volume_100',name:'백 펀치',desc:'총 펀치 100회 이상 기록',check:function(){var t=0;for(var r=0;r<12;r++)for(var p=0;p<4;p++)t+=v31.punchVolume.rounds[r][punchKeys[p]];return t>=100}},
  {id:'a31_fw_diverse',name:'풋워크 다양성',desc:'모든 8가지 풋워크 패턴 사용',check:function(){for(var i=0;i<8;i++)if(v31.footwork.patterns[fwKeys[i]]<=0)return false;return true}},
  {id:'a31_def_matrix',name:'방어 분석가',desc:'방어 기록 10회 이상',check:function(){return v31.defenseMatrix.sessions>=10}},
  {id:'a31_def_grade_a',name:'방어 마스터',desc:'방어 성공률 A등급 이상',check:function(){return v31.defenseMatrix.bestGrade==='A'||v31.defenseMatrix.bestGrade==='S'}},
  {id:'a31_intensity_all',name:'존 탐험가',desc:'모든 5개 인텐시티 존 기록',check:function(){for(var z=0;z<5;z++)if(v31.intensityZone.zones[z]<=0)return false;return true}},
  {id:'a31_combo_5',name:'콤보 수집가',desc:'5개 이상 콤보 시도',check:function(){var c=0;for(var i=0;i<10;i++)if(v31.punchSequence.combos[i].attempts>0)c++;return c>=5}},
  {id:'a31_energy_12r',name:'풀 라운드',desc:'12라운드 모두 체력 분배 기록',check:function(){for(var r=0;r<12;r++){var t=0;for(var e=0;e<4;e++)t+=v31.energyDist.rounds[r][energyKeys[e]];if(t<=0)return false;}return true}},
  {id:'a31_stance_good',name:'폼 완성',desc:'스탠스 점수 B등급 이상',check:function(){return v31.stanceCorrector.bestGrade==='S'||v31.stanceCorrector.bestGrade==='A'||v31.stanceCorrector.bestGrade==='B'}},
  {id:'a31_dashboard_eval',name:'전투력 평가',desc:'종합 대시보드 1회 평가',check:function(){return v31.combatDashboard.sessions>=1}},
  {id:'a31_quiz_10',name:'퀀즈 도전자 v31',desc:'v31 퀀즈 10문 정답',check:function(){var cnt=0;for(var k in v31.quizV31Scores)if(v31.quizV31Scores[k]===1)cnt++;return cnt>=10}},
  {id:'a31_all_features',name:'v31 마스터',desc:'v31 모든 기능 사용',check:function(){var keys=['punchVolume','footwork','defenseMatrix','intensityZone','punchSequence','energyDist','stanceCorrector','combatDashboard'];for(var i=0;i<keys.length;i++)if(!v31.featureUsage31[keys[i]])return false;return true}}
];

function checkAchievementsV31(){
  var newUnlock = false;
  achieveV31Defs.forEach(function(ad){
    if(!v31.achievementsV31[ad.id] && ad.check()){
      v31.achievementsV31[ad.id] = true;
      newUnlock = true;
    }
  });
  if(newUnlock){
    saveV31(v31);
    playSFX31('achieve31');
  }
}

// ============================================================
// NAVIGATION: append buttons to existing bar (NO new bottom bar)
// ============================================================
function addV31Nav(){
  var features = [
    {id:'punchVolume',label:'펀치볼륨',sec:sec1},
    {id:'footwork',label:'풋워크',sec:sec2},
    {id:'defenseMatrix',label:'방어매트릭스',sec:sec3},
    {id:'intensityZone',label:'인텐시티',sec:sec4},
    {id:'punchSequence',label:'콤보빌더',sec:sec5},
    {id:'energyDist',label:'체력분배',sec:sec6},
    {id:'stanceCorrector',label:'스탠스',sec:sec7},
    {id:'combatDashboard',label:'전투력',sec:sec8},
    {id:'quizV31',label:'퀀즈v31',sec:secQuiz31}
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
    btn.style.cssText = 'padding:6px 10px;background:linear-gradient(135deg,rgba(255,68,68,0.15),rgba(204,34,34,0.15));border:1px solid rgba(255,68,68,0.3);border-radius:8px;color:#FF6666;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .2s;flex-shrink:0;';
    btn.textContent = f.label;
    btn.onclick = function(fRef){
      return function(){
        document.querySelectorAll('[id^="v31-sec-"]').forEach(function(s){ s.style.display = 'none'; });
        fRef.sec.style.display = 'block';
        v31.featureUsage31[fRef.id] = true;
        saveV31(v31);
        checkAchievementsV31();
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
  var sections = [sec1, sec2, sec3, sec4, sec5, sec6, sec7, sec8, secQuiz31];
  var keys = ['Q','W','E','R','T','Y','U','I','0'];
  var featureIds = ['punchVolume','footwork','defenseMatrix','intensityZone','punchSequence','energyDist','stanceCorrector','combatDashboard','quizV31'];
  var idx = keys.indexOf(e.key.toUpperCase());
  if(idx === -1 && e.key === ')') idx = 8;
  if(idx >= 0 && idx < sections.length){
    e.preventDefault();
    document.querySelectorAll('[id^="v31-sec-"]').forEach(function(s){ s.style.display = 'none'; });
    sections[idx].style.display = 'block';
    v31.featureUsage31[featureIds[idx]] = true;
    saveV31(v31);
    checkAchievementsV31();
  }
});

// ============================================================
// INIT
// ============================================================
setTimeout(function(){
  addV31Nav();
  initVolumeControls();
  initFootworkControls();
  initDefenseControls();
  initIntensityControls();
  initComboControls();
  initEnergyControls();
  initStanceControls();
  drawVolumeCanvas();
  drawFootworkCanvas();
  drawDefenseCanvas();
  drawIntensityCanvas();
  drawComboCanvas();
  drawEnergyCanvas();
  drawStanceCanvas();
  drawDashboardCanvas();
  checkAchievementsV31();
}, 900);

})();
