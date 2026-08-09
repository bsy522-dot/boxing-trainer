// Boxing Trainer Pro v29_patch.js - NEXTERA+PRISM Auto Enhancement Module
// 1. Punch Combination Chain Analyzer Canvas 620x400 - 12 combos node-link network, edge=transition freq, node size=usage, click-to-highlight, S~D efficiency grade
// 2. Fatigue Curve Modeling Simulator Canvas 620x400 - 12R power/speed/accuracy 3-axis line chart, recovery windows, second wind marker, optimal pacing overlay, session compare
// 3. Opponent Pattern Scouting System Canvas 640x400 - 8 opponent styles, 6-axis radar, weakness heatmap, optimal strategy recommendation
// 4. Combo Transition Smoothness Tracker Canvas 620x400 - 8 transitions horizontal bars, timing precision scatter, 30-session trend, bottleneck + drill recs
// 5. Round-by-Round Momentum Tracker Canvas 640x400 - 12R offense/defense/control area chart, shift markers, critical round highlight, win probability stacked bars
// 6. Defensive Reaction Speed Analyzer Canvas 620x400 - 8 defense types reaction bar chart, success rate donut, pro comparison overlay, improvement trend
// 7. Body Composition Impact Analyzer Canvas 620x400 - 8 body metrics, correlation heatmap vs performance, optimal range indicators, fighter class comparison
// 8. Fighter Legacy Comparison Dashboard Canvas 620x400 - 8 KPI half-circle gauges 4x2, compare vs 10 legends, weighted overall S~D grade
// Quiz +15 (300->315), +12 Achievements (262->274), SFX 16, Keyboard Shift+A/S/D/F/G/H/J/K/0
(function(){
'use strict';

var V29KEY = 'boxingV29Patch';

function loadV29(){
  try {
    var r = localStorage.getItem(V29KEY);
    if(!r) return defV29();
    var p = JSON.parse(r), d = defV29();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV29(); }
}
function saveV29(d){ try { localStorage.setItem(V29KEY, JSON.stringify(d)); } catch(e){} }
function defV29(){
  return {
    comboChain: { usage: [0,0,0,0,0,0,0,0,0,0,0,0], transitions: {}, sessions: 0, bestGrade: 'D', selectedNode: null },
    fatigueCurve: { rounds: Array(12).fill(null).map(function(){return {power:100,speed:100,accuracy:100}}), recoveryWindows: [], secondWind: null, sessions: [], bestGrade: 'D' },
    scouting: {
      styles: {
        slugger:  {attack:70,defense:40,speed:50,power:90,endurance:60,ringIQ:40},
        counter:  {attack:55,defense:75,speed:65,power:60,endurance:65,ringIQ:80},
        outboxer: {attack:50,defense:70,speed:80,power:45,endurance:70,ringIQ:75},
        brawler:  {attack:80,defense:35,speed:45,power:85,endurance:75,ringIQ:35},
        pressure: {attack:75,defense:45,speed:60,power:70,endurance:85,ringIQ:55},
        switchS:  {attack:60,defense:60,speed:70,power:55,endurance:65,ringIQ:70},
        slick:    {attack:55,defense:85,speed:75,power:40,endurance:60,ringIQ:85},
        volume:   {attack:70,defense:50,speed:75,power:50,endurance:90,ringIQ:60}
      },
      selectedStyle: 0, sessions: 0, analyzed: {}
    },
    transitionSmooth: { scores: [50,50,50,50,50,50,50,50], scatter: [], trend: [], sessions: 0 },
    momentum: { rounds: Array(12).fill(null).map(function(){return {offense:50,defense:50,control:50}}), shifts: [], sessions: 0 },
    reactionSpeed: { defenses: {slip:0,roll:0,block:0,parry:0,pull:0,leanBack:0,shoulderRoll:0,clinch:0}, successRate: {slip:0,roll:0,block:0,parry:0,pull:0,leanBack:0,shoulderRoll:0,clinch:0}, trend: [], sessions: 0 },
    bodyComp: { metrics: {weight:75,muscle:40,fat:15,bmi:23,reach:180,height:175,handSpeed:20,powerRatio:50}, correlations: {}, sessions: 0 },
    legacy: { kpis: {record:50,koRatio:50,titleDefenses:50,longevity:50,peakRating:50,versatility:50,chin:50,heart:50}, compareFighter: 0, overallGrade: 'D', sessions: 0 },
    quizV29Scores: {},
    achievementsV29: {},
    featureUsage29: {}
  };
}

var v29 = loadV29();

// ===== CSS =====
var st29 = document.createElement('style');
st29.textContent = '.v29-btn{padding:8px 16px;background:linear-gradient(135deg,#06b6d4,#0891b2);border:none;border-radius:10px;color:#001;font-weight:700;font-size:12px;cursor:pointer;transition:all .2s}.v29-btn:hover{filter:brightness(1.15);transform:scale(1.03)}.v29-btn-sec{padding:8px 16px;background:var(--surface,rgba(255,255,255,0.04));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:10px;color:var(--text-dim,#8a8a9e);font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.v29-btn-sec:hover{border-color:#06b6d4;color:#22d3ee}.v29-card{background:var(--glass,rgba(255,255,255,0.06));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:var(--radius,16px);padding:16px;margin-bottom:12px}.v29-hdr{font-size:15px;font-weight:800;margin-bottom:10px;display:flex;align-items:center;gap:8px}.v29-sub{font-size:11px;color:var(--text-dim,#8a8a9e);margin-bottom:8px}.v29-grade{display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:800}.v29-grade-s{background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#000}.v29-grade-a{background:linear-gradient(135deg,#a78bfa,#7c3aed);color:#fff}.v29-grade-b{background:linear-gradient(135deg,#60a5fa,#3b82f6);color:#fff}.v29-grade-c{background:linear-gradient(135deg,#34d399,#10b981);color:#000}.v29-grade-d{background:rgba(255,255,255,0.1);color:var(--text-dim,#8a8a9e)}';
document.head.appendChild(st29);

// ===== SFX ENGINE V29 =====
function playSFX29(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'chain_build':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(392,t);o.frequency.setValueAtTime(523,t+0.05);o.frequency.setValueAtTime(659,t+0.1);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.18);break;
      case 'chain_grade':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';
        o.frequency.setValueAtTime(523,t);o.frequency.setValueAtTime(784,t+0.08);o.frequency.setValueAtTime(1047,t+0.16);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.28);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.28);break;
      case 'fatigue_sim':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sawtooth';
        o.frequency.setValueAtTime(300,t);o.frequency.exponentialRampToValueAtTime(150,t+0.2);
        g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.22);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.22);break;
      case 'second_wind':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(440,t);o.frequency.setValueAtTime(660,t+0.06);o.frequency.setValueAtTime(880,t+0.12);o.frequency.setValueAtTime(1100,t+0.18);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.3);break;
      case 'scout_analyze':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='square';
        o.frequency.setValueAtTime(220,t);o.frequency.setValueAtTime(330,t+0.05);
        g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.1);break;
      case 'scout_weakness':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sawtooth';
        o.frequency.setValueAtTime(700,t);o.frequency.exponentialRampToValueAtTime(200,t+0.15);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.18);break;
      case 'smooth_measure':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(600,t);o.frequency.setValueAtTime(700,t+0.04);
        g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.09);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.09);break;
      case 'smooth_bottleneck':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='square';
        o.frequency.setValueAtTime(180,t);o.frequency.setValueAtTime(120,t+0.08);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.14);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.14);break;
      case 'momentum_shift':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';
        o.frequency.setValueAtTime(500,t);o.frequency.setValueAtTime(350,t+0.05);o.frequency.setValueAtTime(500,t+0.1);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.15);break;
      case 'momentum_win':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(659,t);o.frequency.setValueAtTime(880,t+0.06);o.frequency.setValueAtTime(1174,t+0.12);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.22);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.22);break;
      case 'reaction_test':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(1000,t);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.06);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.06);break;
      case 'reaction_record':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(880,t);o.frequency.setValueAtTime(1108,t+0.05);o.frequency.setValueAtTime(1318,t+0.1);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.2);break;
      case 'body_scan':
        var b=ctx.createBufferSource(),buf=ctx.createBuffer(1,ctx.sampleRate*0.1,ctx.sampleRate),d=buf.getChannelData(0);
        for(var i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*0.3*Math.exp(-i/(ctx.sampleRate*0.03));
        b.buffer=buf;var g=ctx.createGain();g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        b.connect(g).connect(ctx.destination);b.start(t);break;
      case 'body_optimal':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(523,t);o.frequency.setValueAtTime(659,t+0.05);
        g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.12);break;
      case 'legacy_compare':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';
        o.frequency.setValueAtTime(330,t);o.frequency.exponentialRampToValueAtTime(880,t+0.2);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.25);break;
      case 'quiz_correct29':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(880,t);o.frequency.setValueAtTime(1100,t+0.06);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.12);break;
    }
    setTimeout(function(){ctx.close()},500);
  } catch(e){}
}

function gradeOf29(pct){return pct>=90?'S':pct>=75?'A':pct>=60?'B':pct>=40?'C':'D'}
function gradeClass29(g){return 'v29-grade v29-grade-'+g.toLowerCase()}

// ============================================================
// SECTION 1: Punch Combination Chain Analyzer (Canvas 620x400)
// ============================================================
var comboNames = ['Jab-Cross','더블잽-크로스','크로스-훅-훅','훅-어퍼-크로스','잽-바디-훅','슬립-크로스-훅','트리플잽-크로스','훅-크로스-훅','어퍼-훅-크로스','잽-크로스-훅-어퍼','바디-헤드-바디','5펀치 플러리'];

var sec1 = document.createElement('div');
sec1.id = 'v29-sec-1';
sec1.style.cssText = 'display:none;max-width:680px;margin:20px auto;padding:0 12px;';
sec1.innerHTML = '<div class="v29-card"><div class="v29-hdr">🔗 펀치조합체인분석기</div><div class="v29-sub">12콤보 노드-링크 네트워크 (연결강도=전환빈도, 노드크기=사용빈도) · 클릭으로 체인경로 하이라이트 · 효율 S~D 등급</div><canvas id="v29-cv-1" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#111;display:block;margin:0 auto;cursor:pointer"></canvas><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center"><button class="v29-btn" onclick="window._v29SimChain()">체인 시뮬레이션</button><button class="v29-btn-sec" onclick="window._v29ResetChain()">체인 리셋</button></div></div>';
document.body.appendChild(sec1);

function chainNodePos(i){
  var cx=280,cy=195,r=145;
  var a=-Math.PI/2+i*(2*Math.PI/12);
  return {x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r,a:a};
}
function drawChainCanvas(){
  var cv = document.getElementById('v29-cv-1'); if(!cv) return;
  var c = cv.getContext('2d');
  c.clearRect(0,0,620,400);c.fillStyle='#0a0a1a';c.fillRect(0,0,620,400);
  c.fillStyle='#22d3ee';c.font='bold 14px sans-serif';c.fillText('🔗 펀치조합 체인 분석',10,22);
  var maxUsage=Math.max.apply(null,v29.comboChain.usage)||1;
  var maxTrans=0; for(var k in v29.comboChain.transitions){ if(v29.comboChain.transitions[k]>maxTrans) maxTrans=v29.comboChain.transitions[k]; }
  if(maxTrans===0) maxTrans=1;
  var sel = v29.comboChain.selectedNode;
  // edges
  for(var i=0;i<12;i++){
    for(var j=0;j<12;j++){
      if(i===j) continue;
      var key=i+'-'+j;
      var w = v29.comboChain.transitions[key]||0;
      if(w<=0) continue;
      var p1=chainNodePos(i),p2=chainNodePos(j);
      var highlight = (sel!==null && (sel===i||sel===j));
      c.strokeStyle = highlight? 'rgba(251,191,36,0.85)' : 'rgba(6,182,212,'+Math.min(0.6,0.15+w/maxTrans*0.5)+')';
      c.lineWidth = highlight? Math.max(1.5,(w/maxTrans)*5) : Math.max(0.5,(w/maxTrans)*3.5);
      c.beginPath();c.moveTo(p1.x,p1.y);c.lineTo(p2.x,p2.y);c.stroke();
      c.lineWidth=1;
    }
  }
  // nodes
  for(var i=0;i<12;i++){
    var p=chainNodePos(i);
    var usage=v29.comboChain.usage[i]||0;
    var rad = 6+(usage/maxUsage)*13;
    var isSel = sel===i;
    c.beginPath();c.arc(p.x,p.y,rad,0,Math.PI*2);
    c.fillStyle = isSel? '#fbbf24' : 'rgba(6,182,212,0.75)';
    c.fill();
    c.strokeStyle = isSel? '#fff' : 'rgba(255,255,255,0.3)';c.lineWidth=isSel?2:1;c.stroke();c.lineWidth=1;
    c.fillStyle='#e5e7eb';c.font='8px sans-serif';c.textAlign='center';
    var lx = p.x + Math.cos(p.a)*(rad+18);
    var ly = p.y + Math.sin(p.a)*(rad+18);
    c.fillText((i+1)+'.'+comboNames[i].substr(0,8),lx,ly);
    c.textAlign='left';
  }
  // info panel bottom
  var totalTrans=0; for(var k in v29.comboChain.transitions) totalTrans+=v29.comboChain.transitions[k];
  var pct = Math.min(100, totalTrans*3.2);
  var gg = gradeOf29(pct);
  v29.comboChain.bestGrade = gg;
  c.fillStyle='#0f172a';c.fillRect(0,358,620,42);
  c.fillStyle='#fff';c.font='bold 12px sans-serif';
  c.fillText('총 전환 '+totalTrans+'회  ·  사용 콤보 '+v29.comboChain.usage.filter(function(u){return u>0}).length+'/12', 10, 376);
  c.fillStyle='#22d3ee';c.font='bold 13px sans-serif';
  c.fillText('콤보 효율 등급: '+gg+' ('+Math.round(pct)+'%)', 10, 393);
  if(sel!==null){
    c.fillStyle='#fbbf24';c.font='bold 11px sans-serif';c.textAlign='right';
    c.fillText('선택: '+comboNames[sel], 610, 385);c.textAlign='left';
  }
}
window._v29SimChain = function(){
  var cur = Math.floor(Math.random()*12);
  v29.comboChain.usage[cur] = (v29.comboChain.usage[cur]||0)+1;
  var steps = 14 + Math.floor(Math.random()*10);
  for(var s=0;s<steps;s++){
    var next = Math.floor(Math.random()*12);
    if(next===cur){ next=(next+1)%12; }
    var key = cur+'-'+next;
    v29.comboChain.transitions[key] = (v29.comboChain.transitions[key]||0)+1;
    v29.comboChain.usage[next] = (v29.comboChain.usage[next]||0)+1;
    cur = next;
  }
  v29.comboChain.sessions++;
  saveV29(v29);drawChainCanvas();playSFX29('chain_build');checkAchievementsV29();
};
window._v29ResetChain = function(){
  v29.comboChain = defV29().comboChain;
  saveV29(v29);drawChainCanvas();playSFX29('chain_grade');
};
(function(){
  var cv = document.getElementById('v29-cv-1');
  if(cv){
    cv.addEventListener('click', function(ev){
      var rect = cv.getBoundingClientRect();
      var scaleX = cv.width/rect.width, scaleY = cv.height/rect.height;
      var mx = (ev.clientX-rect.left)*scaleX, my = (ev.clientY-rect.top)*scaleY;
      var found = null;
      for(var i=0;i<12;i++){
        var p = chainNodePos(i);
        var d = Math.sqrt((mx-p.x)*(mx-p.x)+(my-p.y)*(my-p.y));
        if(d<20){ found=i; break; }
      }
      v29.comboChain.selectedNode = (found!==null && v29.comboChain.selectedNode===found) ? null : found;
      saveV29(v29);drawChainCanvas();playSFX29('chain_build');
    });
  }
})();

// ============================================================
// SECTION 2: Fatigue Curve Modeling Simulator (Canvas 620x400)
// ============================================================
var sec2 = document.createElement('div');
sec2.id = 'v29-sec-2';
sec2.style.cssText = 'display:none;max-width:680px;margin:20px auto;padding:0 12px;';
sec2.innerHTML = '<div class="v29-card"><div class="v29-hdr">📉 피로곡선모델링 시뮬레이터</div><div class="v29-sub">12R 파워/스피드/정확도 3축 라인차트 · 회복구간 · 세컨드윈드 포인트 · 최적페이싱 오버레이 · 세션비교</div><canvas id="v29-cv-2" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#111;display:block;margin:0 auto"></canvas><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center"><button class="v29-btn" onclick="window._v29SimFatigue()">라운드 시뮬레이션</button><button class="v29-btn-sec" onclick="window._v29ResetFatigue()">곡선 리셋</button></div></div>';
document.body.appendChild(sec2);

function drawFatigueCanvas(){
  var cv = document.getElementById('v29-cv-2'); if(!cv) return;
  var c = cv.getContext('2d');
  c.clearRect(0,0,620,400);c.fillStyle='#0a0a1a';c.fillRect(0,0,620,400);
  c.fillStyle='#22d3ee';c.font='bold 14px sans-serif';c.fillText('📉 피로곡선 모델링',10,22);
  var gx=55,gy=40,gw=545,gh=200;
  c.strokeStyle='rgba(255,255,255,0.1)';c.strokeRect(gx,gy,gw,gh);
  for(var gl=0;gl<=4;gl++){
    var yy=gy+gh-gl*(gh/4);
    c.strokeStyle='rgba(255,255,255,0.05)';c.beginPath();c.moveTo(gx,yy);c.lineTo(gx+gw,yy);c.stroke();
    c.fillStyle='#666';c.font='8px sans-serif';c.fillText((gl*25)+'%',gx-28,yy+3);
  }
  var rounds = v29.fatigueCurve.rounds;
  var keys=['power','speed','accuracy'];
  var colors=['#ef4444','#22d3ee','#22c55e'];
  keys.forEach(function(k,ki){
    c.strokeStyle=colors[ki];c.lineWidth=2;c.beginPath();
    for(var i=0;i<12;i++){
      var val=rounds[i][k];
      var x=gx+10+i*((gw-20)/11);
      var y=gy+gh-(val/100)*gh;
      if(i===0)c.moveTo(x,y);else c.lineTo(x,y);
    }
    c.stroke();c.lineWidth=1;
    for(var i=0;i<12;i++){
      var val=rounds[i][k];
      var x=gx+10+i*((gw-20)/11);
      var y=gy+gh-(val/100)*gh;
      c.fillStyle=colors[ki];c.beginPath();c.arc(x,y,2.5,0,Math.PI*2);c.fill();
    }
  });
  // optimal pacing overlay (linear 100->55)
  c.strokeStyle='rgba(255,255,255,0.5)';c.setLineDash([4,3]);c.lineWidth=1.5;c.beginPath();
  for(var i=0;i<12;i++){
    var val = 100 - i*(45/11);
    var x=gx+10+i*((gw-20)/11);
    var y=gy+gh-(val/100)*gh;
    if(i===0)c.moveTo(x,y);else c.lineTo(x,y);
  }
  c.stroke();c.setLineDash([]);c.lineWidth=1;
  // recovery windows
  (v29.fatigueCurve.recoveryWindows||[]).forEach(function(ri){
    var x=gx+10+ri*((gw-20)/11);
    c.strokeStyle='rgba(34,197,94,0.5)';c.setLineDash([2,2]);c.beginPath();c.moveTo(x,gy);c.lineTo(x,gy+gh);c.stroke();c.setLineDash([]);
    c.fillStyle='#22c55e';c.font='8px sans-serif';c.textAlign='center';c.fillText('회복',x,gy-4);c.textAlign='left';
  });
  // second wind marker
  if(v29.fatigueCurve.secondWind!==null){
    var swi = v29.fatigueCurve.secondWind;
    var x=gx+10+swi*((gw-20)/11);
    var y=gy+gh-(rounds[swi].power/100)*gh;
    c.fillStyle='#fbbf24';c.font='bold 13px sans-serif';c.textAlign='center';c.fillText('★',x,y-10);
    c.font='8px sans-serif';c.fillText('세컨드윈드',x,y-20);c.textAlign='left';
  }
  for(var i=0;i<12;i++){
    var x=gx+10+i*((gw-20)/11);
    c.fillStyle='#888';c.font='9px sans-serif';c.textAlign='center';c.fillText('R'+(i+1),x,gy+gh+14);c.textAlign='left';
  }
  // legend
  var legendY=270;
  var labels=['파워','스피드','정확도','최적페이싱'];
  var lcolors=colors.concat(['rgba(255,255,255,0.6)']);
  for(var i=0;i<4;i++){
    c.fillStyle=lcolors[i];c.fillRect(55+i*135,legendY,10,10);
    c.fillStyle='#ccc';c.font='10px sans-serif';c.fillText(labels[i],69+i*135,legendY+9);
  }
  // session comparison bars
  c.fillStyle='#22d3ee';c.font='bold 12px sans-serif';c.fillText('세션 비교 (최근 10회 평균 유지율)',55,300);
  var sessions=v29.fatigueCurve.sessions||[];
  var sx=55,sy=310,sw=545,sh=55;
  c.strokeStyle='rgba(255,255,255,0.1)';c.strokeRect(sx,sy,sw,sh);
  var recent=sessions.slice(-10);
  for(var i=0;i<recent.length;i++){
    var bw=sw/10-4;
    var bx=sx+4+i*(sw/10);
    var bh=(recent[i]/100)*sh;
    c.fillStyle='#06b6d4';c.fillRect(bx,sy+sh-bh,bw,bh);
  }
  var avgSess = recent.length? Math.round(recent.reduce(function(a,b){return a+b},0)/recent.length) : 0;
  var gg = gradeOf29(avgSess);
  v29.fatigueCurve.bestGrade = gg;
  c.fillStyle='#fff';c.font='bold 12px sans-serif';c.fillText('평균유지율 '+avgSess+'%  등급: '+gg, sx, sy+sh+18);
}
window._v29SimFatigue = function(){
  var rounds=[];
  var recoveryWindows=[];
  var power=100,speed=100,acc=100;
  var secondWind=null;
  for(var i=0;i<12;i++){
    var decay = 4+Math.random()*4;
    power=Math.max(20,power-decay+(Math.random()*3));
    speed=Math.max(20,speed-decay*0.9+(Math.random()*3));
    acc=Math.max(20,acc-decay*0.7+(Math.random()*3));
    if(Math.random()<0.25 && i>1 && i<10){
      power=Math.min(100,power+8+Math.random()*6);
      speed=Math.min(100,speed+6+Math.random()*5);
      recoveryWindows.push(i);
    }
    if(secondWind===null && i>5 && i<10 && Math.random()<0.3){
      power=Math.min(100,power+15);
      speed=Math.min(100,speed+10);
      secondWind=i;
    }
    rounds.push({power:Math.round(power),speed:Math.round(speed),accuracy:Math.round(acc)});
  }
  v29.fatigueCurve.rounds=rounds;
  v29.fatigueCurve.recoveryWindows=recoveryWindows;
  v29.fatigueCurve.secondWind=secondWind;
  var avgRetention = Math.round(rounds.reduce(function(a,r){return a+(r.power+r.speed+r.accuracy)/3},0)/12);
  v29.fatigueCurve.sessions=v29.fatigueCurve.sessions||[];
  v29.fatigueCurve.sessions.push(avgRetention);
  if(v29.fatigueCurve.sessions.length>30) v29.fatigueCurve.sessions.shift();
  saveV29(v29);drawFatigueCanvas();
  playSFX29(secondWind!==null?'second_wind':'fatigue_sim');
  checkAchievementsV29();
};
window._v29ResetFatigue = function(){
  v29.fatigueCurve=defV29().fatigueCurve;saveV29(v29);drawFatigueCanvas();playSFX29('fatigue_sim');
};

// ============================================================
// SECTION 3: Opponent Pattern Scouting System (Canvas 640x400)
// ============================================================
var styleKeys=['slugger','counter','outboxer','brawler','pressure','switchS','slick','volume'];
var styleNames=['슬러거','카운터','아웃복서','브롤러','프레셔','스위치','슬릭','볼륨'];
var strategyMap={
  slugger:'거리를 유지하고 아웃복싱으로 카운터를 노려라',
  counter:'선제 압박으로 리듬을 깨고 페인트를 활용하라',
  outboxer:'전방위 압박과 컷오프로 거리를 좁혀라',
  brawler:'풋워크로 각도를 만들고 원거리에서 잽으로 포인트를 쌓아라',
  pressure:'클린치와 사이드스텝으로 리듬을 끊어라',
  switchS:'스탠스 전환을 미리 읽고 예측 타격을 준비하라',
  slick:'바디워크로 체력을 소모시켜 방어를 무너뜨려라',
  volume:'카운터 타이밍을 노리고 이동하며 편치수를 줄여라'
};
var axisKeys=['attack','defense','speed','power','endurance','ringIQ'];
var axisNames=['공격','수비','스피드','파워','지구력','링IQ'];

var sec3 = document.createElement('div');
sec3.id = 'v29-sec-3';
sec3.style.cssText = 'display:none;max-width:700px;margin:20px auto;padding:0 12px;';
sec3.innerHTML = '<div class="v29-card"><div class="v29-hdr">🎯 상대패턴 스카우팅 시스템</div><div class="v29-sub">8스타일 6축 Radar · 약점 히트맵 · 최적 전략 추천 (스타일명 클릭으로 선택)</div><canvas id="v29-cv-3" width="640" height="400" style="width:100%;max-width:640px;border-radius:12px;background:#111;display:block;margin:0 auto;cursor:pointer"></canvas><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center"><button class="v29-btn" onclick="window._v29ScoutStyle()">스타일 분석</button><button class="v29-btn-sec" onclick="window._v29NextStyle()">다음 상대</button></div></div>';
document.body.appendChild(sec3);

function drawScoutCanvas(){
  var cv = document.getElementById('v29-cv-3'); if(!cv) return;
  var c = cv.getContext('2d');
  c.clearRect(0,0,640,400);c.fillStyle='#0a0a1a';c.fillRect(0,0,640,400);
  c.fillStyle='#22d3ee';c.font='bold 14px sans-serif';c.fillText('🎯 상대패턴 스카우팅',10,22);
  var sel = v29.scouting.selectedStyle;
  // style list
  for(var i=0;i<8;i++){
    var y=45+i*20;
    var isSel = i===sel;
    c.fillStyle = isSel? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.03)';
    c.fillRect(8,y,110,17);
    var analyzed = v29.scouting.analyzed[styleKeys[i]];
    c.fillStyle = analyzed? '#22c55e' : '#666';
    c.beginPath();c.arc(16,y+8,3,0,Math.PI*2);c.fill();
    c.fillStyle= isSel? '#22d3ee' : '#ccc';c.font=(isSel?'bold ':'')+'10px sans-serif';
    c.fillText(styleNames[i],26,y+12);
  }
  // radar for selected
  var rcx=250,rcy=200,rr=110;
  for(var ring=1;ring<=5;ring++){
    c.strokeStyle='rgba(255,255,255,0.06)';c.beginPath();
    for(var i=0;i<=6;i++){
      var a=-Math.PI/2+i*(2*Math.PI/6);
      var px=rcx+Math.cos(a)*rr*(ring/5),py=rcy+Math.sin(a)*rr*(ring/5);
      if(i===0)c.moveTo(px,py);else c.lineTo(px,py);
    }c.stroke();
  }
  var stats = v29.scouting.styles[styleKeys[sel]];
  c.fillStyle='rgba(6,182,212,0.18)';c.strokeStyle='#22d3ee';c.lineWidth=2;c.beginPath();
  for(var i=0;i<6;i++){
    var a=-Math.PI/2+i*(2*Math.PI/6);
    var val=(stats[axisKeys[i]]||50)/100;
    var px=rcx+Math.cos(a)*rr*val,py=rcy+Math.sin(a)*rr*val;
    if(i===0)c.moveTo(px,py);else c.lineTo(px,py);
  }c.closePath();c.fill();c.stroke();c.lineWidth=1;
  for(var i=0;i<6;i++){
    var a=-Math.PI/2+i*(2*Math.PI/6);
    c.fillStyle='#ccc';c.font='bold 9px sans-serif';c.textAlign='center';
    c.fillText(axisNames[i],rcx+Math.cos(a)*(rr+16),rcy+Math.sin(a)*(rr+16)+3);c.textAlign='left';
  }
  c.fillStyle='#fbbf24';c.font='bold 13px sans-serif';c.fillText(styleNames[sel]+' 프로필',rcx-40,60);
  // weakness heatmap (8 styles x 6 axis)
  c.fillStyle='#22d3ee';c.font='bold 11px sans-serif';c.fillText('약점 히트맵 (전스타일)',420,45);
  var hx=420,hy=55,cw=27,chh=17;
  for(var j=0;j<6;j++){
    c.fillStyle='#888';c.font='7px sans-serif';c.textAlign='center';
    c.fillText(axisNames[j].substr(0,2),hx+j*cw+cw/2,hy-4);c.textAlign='left';
  }
  for(var i=0;i<8;i++){
    c.fillStyle='#888';c.font='7px sans-serif';c.fillText(styleNames[i].substr(0,3),hx-24,hy+i*chh+12);
    var st=v29.scouting.styles[styleKeys[i]];
    for(var j=0;j<6;j++){
      var weak = 100-(st[axisKeys[j]]||50);
      var r=Math.round(255*(weak/100)), g2=Math.round(180*(1-weak/100));
      c.fillStyle='rgba('+r+','+g2+',60,0.85)';
      c.fillRect(hx+j*cw,hy+i*chh,cw-2,chh-2);
    }
  }
  // strategy recommendation
  c.fillStyle='#0f172a';c.fillRect(0,360,640,40);
  c.fillStyle='#22c55e';c.font='bold 10px sans-serif';
  c.fillText('💡 전략: '+strategyMap[styleKeys[sel]], 10, 380);
  var avgStat = Math.round((stats.attack+stats.defense+stats.speed+stats.power+stats.endurance+stats.ringIQ)/6);
  c.fillStyle='#aaa';c.font='9px sans-serif';c.textAlign='right';
  c.fillText('분석완료 '+Object.keys(v29.scouting.analyzed).length+'/8  종합 '+avgStat, 630, 393);c.textAlign='left';
}
window._v29ScoutStyle = function(){
  var k = styleKeys[v29.scouting.selectedStyle];
  var st = v29.scouting.styles[k];
  axisKeys.forEach(function(ax){
    st[ax] = Math.min(100,Math.max(10, st[ax]+Math.round((Math.random()-0.4)*14)));
  });
  v29.scouting.analyzed[k]=true;
  v29.scouting.sessions++;
  saveV29(v29);drawScoutCanvas();playSFX29('scout_analyze');checkAchievementsV29();
};
window._v29NextStyle = function(){
  v29.scouting.selectedStyle = (v29.scouting.selectedStyle+1)%8;
  saveV29(v29);drawScoutCanvas();playSFX29('scout_weakness');
};
(function(){
  var cv = document.getElementById('v29-cv-3');
  if(cv){
    cv.addEventListener('click', function(ev){
      var rect = cv.getBoundingClientRect();
      var scaleX = cv.width/rect.width, scaleY = cv.height/rect.height;
      var mx = (ev.clientX-rect.left)*scaleX, my = (ev.clientY-rect.top)*scaleY;
      if(mx>=8 && mx<=118){
        var idx = Math.floor((my-45)/20);
        if(idx>=0 && idx<8){
          v29.scouting.selectedStyle=idx;
          saveV29(v29);drawScoutCanvas();playSFX29('scout_weakness');
        }
      }
    });
  }
})();

// ============================================================
// SECTION 4: Combo Transition Smoothness Tracker (Canvas 620x400)
// ============================================================
var transNames = ['잽→크로스','크로스→훅','훅→어퍼','어퍼→훅','슬립→크로스','더킹→훅','풋워크→잽','가드→카운터'];
var drillMap = ['짧은 잽-크로스 리듬드릴','피벗 훅 커넥션 드릴','어퍼컷 체인 콤보 드릴','바디-헤드 전환 드릴','슬립 후 즉시 반격 드릴','더킹 리커버리 드릴','풋워크 인-아웃 드릴','가드업 카운터 타이밍 드릴'];

var sec4 = document.createElement('div');
sec4.id = 'v29-sec-4';
sec4.style.cssText = 'display:none;max-width:680px;margin:20px auto;padding:0 12px;';
sec4.innerHTML = '<div class="v29-card"><div class="v29-hdr">🌊 콤보전환 스무스니스 트래커</div><div class="v29-sub">8전환 스무스니스 수평바 · 타이밍 정밀도 스캐터 · 30세션 트렌드 · 병목구간 + 드릴추천</div><canvas id="v29-cv-4" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#111;display:block;margin:0 auto"></canvas><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center"><button class="v29-btn" onclick="window._v29MeasureSmooth()">전환 측정</button><button class="v29-btn-sec" onclick="window._v29ResetSmooth()">측정 리셋</button></div></div>';
document.body.appendChild(sec4);

function drawSmoothCanvas(){
  var cv = document.getElementById('v29-cv-4'); if(!cv) return;
  var c = cv.getContext('2d');
  c.clearRect(0,0,620,400);c.fillStyle='#0a0a1a';c.fillRect(0,0,620,400);
  c.fillStyle='#22d3ee';c.font='bold 14px sans-serif';c.fillText('🌊 콤보전환 스무스니스',10,22);
  var scores = v29.transitionSmooth.scores;
  var minScore=100,minIdx=0;
  for(var i=0;i<8;i++){
    var y=40+i*20;
    var sc=scores[i]||0;
    if(sc<minScore){minScore=sc;minIdx=i;}
    var bw=(sc/100)*300;
    c.fillStyle='#222';c.fillRect(110,y,300,15);
    c.fillStyle= sc<40? '#ef4444' : sc<70? '#f59e0b' : '#22c55e';
    c.fillRect(110,y,bw,15);
    c.fillStyle='#ccc';c.font='9px sans-serif';c.textAlign='right';c.fillText(transNames[i],105,y+11);c.textAlign='left';
    c.fillStyle='#fff';c.font='bold 9px sans-serif';c.fillText(Math.round(sc),415,y+11);
  }
  c.fillStyle='#ef4444';c.font='bold 10px sans-serif';
  c.fillText('⚠ 병목: '+transNames[minIdx]+' ('+Math.round(minScore)+')',440,50);
  c.fillStyle='#aaa';c.font='9px sans-serif';
  wrapText(c,'추천 드릴: '+drillMap[minIdx],440,66,170,10);
  // timing precision scatter
  c.fillStyle='#22d3ee';c.font='bold 12px sans-serif';c.fillText('타이밍 정밀도 스캐터 (ms 편차)',10,215);
  var sx=30,sy=225,sw=560,sh=70;
  c.strokeStyle='rgba(255,255,255,0.1)';c.strokeRect(sx,sy,sw,sh);
  c.strokeStyle='rgba(255,255,255,0.2)';c.beginPath();c.moveTo(sx,sy+sh/2);c.lineTo(sx+sw,sy+sh/2);c.stroke();
  var scatter = v29.transitionSmooth.scatter||[];
  for(var i=0;i<scatter.length;i++){
    var x=sx+10+i*((sw-20)/Math.max(scatter.length-1,1));
    var dev=scatter[i];
    var y=sy+sh/2-(dev/50)*(sh/2);
    c.fillStyle= Math.abs(dev)<15? '#22c55e' : Math.abs(dev)<30? '#f59e0b' : '#ef4444';
    c.beginPath();c.arc(x,y,3,0,Math.PI*2);c.fill();
  }
  c.fillStyle='#888';c.font='8px sans-serif';c.fillText('+50ms',sx-30,sy+8);c.fillText('0',sx-15,sy+sh/2+3);c.fillText('-50ms',sx-30,sy+sh-2);
  // 30-session trend
  c.fillStyle='#22d3ee';c.font='bold 12px sans-serif';c.fillText('30세션 평균 스무스니스 트렌드',10,320);
  var tx=30,ty=330,tw=560,th=55;
  c.strokeStyle='rgba(255,255,255,0.1)';c.strokeRect(tx,ty,tw,th);
  var trend=v29.transitionSmooth.trend||[];
  for(var i=0;i<trend.length;i++){
    var x=tx+i*(tw/Math.max(trend.length-1,1));
    var y=ty+th-(trend[i]/100)*th;
    if(i>0){
      var px=tx+(i-1)*(tw/Math.max(trend.length-1,1));
      var py=ty+th-(trend[i-1]/100)*th;
      c.strokeStyle='#06b6d4';c.lineWidth=1.5;c.beginPath();c.moveTo(px,py);c.lineTo(x,y);c.stroke();c.lineWidth=1;
    }
    c.fillStyle='#06b6d4';c.beginPath();c.arc(x,y,2,0,Math.PI*2);c.fill();
  }
  var avgScore = Math.round(scores.reduce(function(a,b){return a+b},0)/8);
  var gg=gradeOf29(avgScore);
  c.fillStyle='#fff';c.font='bold 11px sans-serif';c.textAlign='right';c.fillText('평균 '+avgScore+'  등급 '+gg,590,ty+th+15);c.textAlign='left';
}
function wrapText(c,text,x,y,maxWidth,lineHeight){
  var words=text.split(' ');var line='';
  for(var n=0;n<words.length;n++){
    var testLine=line+words[n]+' ';
    if(c.measureText(testLine).width>maxWidth && n>0){
      c.fillText(line,x,y);line=words[n]+' ';y+=lineHeight;
    } else { line=testLine; }
  }
  c.fillText(line,x,y);
}
window._v29MeasureSmooth = function(){
  for(var i=0;i<8;i++){
    v29.transitionSmooth.scores[i] = Math.min(100,Math.max(5, v29.transitionSmooth.scores[i]+Math.round((Math.random()-0.35)*20)));
  }
  v29.transitionSmooth.scatter = v29.transitionSmooth.scatter||[];
  v29.transitionSmooth.scatter.push(Math.round((Math.random()-0.5)*80));
  if(v29.transitionSmooth.scatter.length>20) v29.transitionSmooth.scatter.shift();
  var avg = Math.round(v29.transitionSmooth.scores.reduce(function(a,b){return a+b},0)/8);
  v29.transitionSmooth.trend = v29.transitionSmooth.trend||[];
  v29.transitionSmooth.trend.push(avg);
  if(v29.transitionSmooth.trend.length>30) v29.transitionSmooth.trend.shift();
  v29.transitionSmooth.sessions++;
  saveV29(v29);drawSmoothCanvas();
  var minS=Math.min.apply(null,v29.transitionSmooth.scores);
  playSFX29(minS<30?'smooth_bottleneck':'smooth_measure');
  checkAchievementsV29();
};
window._v29ResetSmooth = function(){
  v29.transitionSmooth=defV29().transitionSmooth;saveV29(v29);drawSmoothCanvas();playSFX29('smooth_measure');
};

// ============================================================
// SECTION 5: Round-by-Round Momentum Tracker (Canvas 640x400)
// ============================================================
var sec5 = document.createElement('div');
sec5.id = 'v29-sec-5';
sec5.style.cssText = 'display:none;max-width:700px;margin:20px auto;padding:0 12px;';
sec5.innerHTML = '<div class="v29-card"><div class="v29-hdr">📈 라운드모멘텀 트래커</div><div class="v29-sub">12R 공격/수비/컨트롤 3라인 에어리어차트 · 모멘텀 전환 마커 · 결정적 라운드 하이라이트 · 라운드 승률 스택바</div><canvas id="v29-cv-5" width="640" height="400" style="width:100%;max-width:640px;border-radius:12px;background:#111;display:block;margin:0 auto"></canvas><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center"><button class="v29-btn" onclick="window._v29SimMomentum()">모멘텀 시뮬레이션</button><button class="v29-btn-sec" onclick="window._v29ResetMomentum()">모멘텀 리셋</button></div></div>';
document.body.appendChild(sec5);

function drawMomentumCanvas(){
  var cv = document.getElementById('v29-cv-5'); if(!cv) return;
  var c = cv.getContext('2d');
  c.clearRect(0,0,640,400);c.fillStyle='#0a0a1a';c.fillRect(0,0,640,400);
  c.fillStyle='#22d3ee';c.font='bold 14px sans-serif';c.fillText('📈 라운드 모멘텀',10,22);
  var rounds = v29.momentum.rounds;
  var gx=45,gy=40,gw=560,gh=170;
  c.strokeStyle='rgba(255,255,255,0.1)';c.strokeRect(gx,gy,gw,gh);
  // critical round shading
  for(var i=0;i<12;i++){
    var net = rounds[i].offense - rounds[i].defense;
    if(Math.abs(net)>30){
      var x=gx+i*(gw/12);
      c.fillStyle = net>0? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)';
      c.fillRect(x,gy,gw/12,gh);
    }
  }
  var keys=['offense','defense','control'];
  var colors=['rgba(239,68,68,0.35)','rgba(59,130,246,0.35)','rgba(34,197,94,0.35)'];
  var lineColors=['#ef4444','#3b82f6','#22c55e'];
  keys.forEach(function(k,ki){
    c.beginPath();
    for(var i=0;i<12;i++){
      var x=gx+10+i*((gw-20)/11);
      var y=gy+gh-(rounds[i][k]/100)*gh;
      if(i===0)c.moveTo(x,y);else c.lineTo(x,y);
    }
    c.lineTo(gx+10+11*((gw-20)/11),gy+gh);c.lineTo(gx+10,gy+gh);c.closePath();
    c.fillStyle=colors[ki];c.fill();
    c.beginPath();
    for(var i=0;i<12;i++){
      var x=gx+10+i*((gw-20)/11);
      var y=gy+gh-(rounds[i][k]/100)*gh;
      if(i===0)c.moveTo(x,y);else c.lineTo(x,y);
    }
    c.strokeStyle=lineColors[ki];c.lineWidth=1.5;c.stroke();c.lineWidth=1;
  });
  // shift markers
  (v29.momentum.shifts||[]).forEach(function(si){
    var x=gx+10+si*((gw-20)/11);
    c.fillStyle='#fbbf24';c.beginPath();c.moveTo(x,gy-6);c.lineTo(x-5,gy+2);c.lineTo(x+5,gy+2);c.closePath();c.fill();
  });
  for(var i=0;i<12;i++){
    var x=gx+10+i*((gw-20)/11);
    c.fillStyle='#888';c.font='9px sans-serif';c.textAlign='center';c.fillText('R'+(i+1),x,gy+gh+14);c.textAlign='left';
  }
  var labels=['공격','수비','컨트롤'];
  for(var i=0;i<3;i++){
    c.fillStyle=lineColors[i];c.fillRect(45+i*90,232,10,10);
    c.fillStyle='#ccc';c.font='10px sans-serif';c.fillText(labels[i],59+i*90,241);
  }
  // win probability stacked bars
  c.fillStyle='#22d3ee';c.font='bold 12px sans-serif';c.fillText('라운드 승률 스택바',45,262);
  var bx=45,by=272,bw=560/12,bh=100;
  c.strokeStyle='rgba(255,255,255,0.1)';c.strokeRect(bx,by,560,bh);
  for(var i=0;i<12;i++){
    var net = rounds[i].offense - rounds[i].defense + (rounds[i].control-50)*0.5;
    var winP = Math.min(90,Math.max(10, 50+net*0.6));
    var lossP = Math.min(90-0, Math.max(5,(100-winP)*0.7));
    var drawP = 100-winP-lossP;
    var x=bx+i*bw+2;
    var wH=(winP/100)*bh, dH=(drawP/100)*bh, lH=(lossP/100)*bh;
    c.fillStyle='#22c55e';c.fillRect(x,by+bh-wH,bw-4,wH);
    c.fillStyle='#6b7280';c.fillRect(x,by+bh-wH-dH,bw-4,dH);
    c.fillStyle='#ef4444';c.fillRect(x,by+bh-wH-dH-lH,bw-4,lH);
  }
  c.fillStyle='#888';c.font='9px sans-serif';
  c.fillText('초록=승리확률 회색=무승부 빨강=패배확률',45,by+bh+16);
  c.fillStyle='#fff';c.font='bold 10px sans-serif';c.textAlign='right';
  c.fillText('전환마커 '+(v29.momentum.shifts||[]).length+'회', 605, 262);c.textAlign='left';
}
window._v29SimMomentum = function(){
  var rounds=[];var shifts=[];
  var prevNet=0;
  for(var i=0;i<12;i++){
    var offense=20+Math.round(Math.random()*70);
    var defense=20+Math.round(Math.random()*70);
    var control=20+Math.round(Math.random()*70);
    var net=offense-defense;
    if(i>0 && ((prevNet>10 && net<-10)||(prevNet<-10 && net>10))) shifts.push(i);
    prevNet=net;
    rounds.push({offense:offense,defense:defense,control:control});
  }
  v29.momentum.rounds=rounds;
  v29.momentum.shifts=shifts;
  v29.momentum.sessions++;
  saveV29(v29);drawMomentumCanvas();
  playSFX29(shifts.length>=3?'momentum_shift':'momentum_win');
  checkAchievementsV29();
};
window._v29ResetMomentum = function(){
  v29.momentum=defV29().momentum;saveV29(v29);drawMomentumCanvas();playSFX29('momentum_win');
};

// ============================================================
// SECTION 6: Defensive Reaction Speed Analyzer (Canvas 620x400)
// ============================================================
var defKeys=['slip','roll','block','parry','pull','leanBack','shoulderRoll','clinch'];
var defNames=['슬립','롤링','블록','패리','풀백','린백','숄더롤','클린치'];
var defProMs=[180,190,160,170,200,210,175,230];

var sec6 = document.createElement('div');
sec6.id = 'v29-sec-6';
sec6.style.cssText = 'display:none;max-width:680px;margin:20px auto;padding:0 12px;';
sec6.innerHTML = '<div class="v29-card"><div class="v29-hdr">🛡️ 방어반응속도 분석기</div><div class="v29-sub">8방어유형 반응시간 바차트 · 성공률 도넛 · 프로 대비 오버레이 · 개선 트렌드</div><canvas id="v29-cv-6" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#111;display:block;margin:0 auto"></canvas><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center"><button class="v29-btn" onclick="window._v29TestReaction()">반응속도 테스트</button><button class="v29-btn-sec" onclick="window._v29ResetReaction()">반응속도 리셋</button></div></div>';
document.body.appendChild(sec6);

function drawReactionCanvas(){
  var cv = document.getElementById('v29-cv-6'); if(!cv) return;
  var c = cv.getContext('2d');
  c.clearRect(0,0,620,400);c.fillStyle='#0a0a1a';c.fillRect(0,0,620,400);
  c.fillStyle='#22d3ee';c.font='bold 14px sans-serif';c.fillText('🛡️ 방어반응속도 분석',10,22);
  var maxMs=300;
  for(var i=0;i<8;i++){
    var y=42+i*22;
    var ms=v29.reactionSpeed.defenses[defKeys[i]]||0;
    var bw=(Math.min(ms,maxMs)/maxMs)*200;
    c.fillStyle='#222';c.fillRect(90,y,200,16);
    c.fillStyle= ms>0 && ms<=defProMs[i]? '#22c55e' : '#06b6d4';
    c.fillRect(90,y,bw,16);
    var proW=(defProMs[i]/maxMs)*200;
    c.strokeStyle='rgba(255,255,255,0.5)';c.setLineDash([2,2]);c.beginPath();c.moveTo(90+proW,y-2);c.lineTo(90+proW,y+18);c.stroke();c.setLineDash([]);
    c.fillStyle='#ccc';c.font='9px sans-serif';c.textAlign='right';c.fillText(defNames[i],85,y+12);c.textAlign='left';
    c.fillStyle='#fff';c.font='bold 9px sans-serif';c.fillText(ms+'ms',298,y+12);
  }
  // success rate donut (aggregate)
  c.fillStyle='#22d3ee';c.font='bold 11px sans-serif';c.fillText('성공률 도넛',420,45);
  var cx=490,cy=140,r=60;
  var total=0;for(var i=0;i<8;i++) total+=v29.reactionSpeed.successRate[defKeys[i]]||0;
  if(total===0) total=1;
  var start=-Math.PI/2;
  var dcolors=['#ef4444','#f59e0b','#22c55e','#3b82f6','#a855f7','#ec4899','#14b8a6','#6b7280'];
  for(var i=0;i<8;i++){
    var val=v29.reactionSpeed.successRate[defKeys[i]]||0;
    var pct=val/total;
    var end=start+pct*2*Math.PI;
    c.beginPath();c.moveTo(cx,cy);c.arc(cx,cy,r,start,end);c.closePath();
    c.fillStyle=dcolors[i];c.fill();
    start=end;
  }
  c.beginPath();c.arc(cx,cy,28,0,Math.PI*2);c.fillStyle='#0a0a1a';c.fill();
  var avgSucc=Math.round(total/8);
  c.fillStyle='#fff';c.font='bold 12px sans-serif';c.textAlign='center';c.fillText(avgSucc+'%',cx,cy+4);c.textAlign='left';
  // pro comparison legend
  c.fillStyle='#aaa';c.font='9px sans-serif';c.fillText('점선 = 프로 평균 반응속도',420,220);
  // improvement trend
  c.fillStyle='#22d3ee';c.font='bold 12px sans-serif';c.fillText('개선 트렌드 (평균 ms)',10,255);
  var tx=10,ty=265,tw=600,th=60;
  c.strokeStyle='rgba(255,255,255,0.1)';c.strokeRect(tx,ty,tw,th);
  var trend=v29.reactionSpeed.trend||[];
  var maxT=Math.max.apply(null,trend.concat([1]));
  for(var i=0;i<trend.length;i++){
    var x=tx+i*(tw/Math.max(trend.length-1,1));
    var y=ty+th-(trend[i]/maxT)*th;
    if(i>0){
      var px=tx+(i-1)*(tw/Math.max(trend.length-1,1));
      var py=ty+th-(trend[i-1]/maxT)*th;
      c.strokeStyle='#06b6d4';c.lineWidth=1.5;c.beginPath();c.moveTo(px,py);c.lineTo(x,y);c.stroke();c.lineWidth=1;
    }
    c.fillStyle='#06b6d4';c.beginPath();c.arc(x,y,2,0,Math.PI*2);c.fill();
  }
  var avgMs=0,cnt=0;for(var i=0;i<8;i++){if(v29.reactionSpeed.defenses[defKeys[i]]>0){avgMs+=v29.reactionSpeed.defenses[defKeys[i]];cnt++;}}
  avgMs = cnt? Math.round(avgMs/cnt) : 0;
  var pct = Math.max(0,Math.min(100, 100-(avgMs-120)/1.5));
  var gg=gradeOf29(pct);
  c.fillStyle='#fff';c.font='bold 12px sans-serif';c.fillText('평균 '+avgMs+'ms  등급 '+gg,10,345);
}
window._v29TestReaction = function(){
  for(var i=0;i<8;i++){
    v29.reactionSpeed.defenses[defKeys[i]] = Math.round(140+Math.random()*140);
    v29.reactionSpeed.successRate[defKeys[i]] = Math.round(50+Math.random()*45);
  }
  var avgMs=0;for(var i=0;i<8;i++) avgMs+=v29.reactionSpeed.defenses[defKeys[i]];avgMs=Math.round(avgMs/8);
  v29.reactionSpeed.trend=v29.reactionSpeed.trend||[];
  v29.reactionSpeed.trend.push(avgMs);
  if(v29.reactionSpeed.trend.length>30) v29.reactionSpeed.trend.shift();
  v29.reactionSpeed.sessions++;
  saveV29(v29);drawReactionCanvas();
  var beatsPro = defKeys.filter(function(k,i){return v29.reactionSpeed.defenses[k]<=defProMs[i]}).length;
  playSFX29(beatsPro>=4?'reaction_record':'reaction_test');
  checkAchievementsV29();
};
window._v29ResetReaction = function(){
  v29.reactionSpeed=defV29().reactionSpeed;saveV29(v29);drawReactionCanvas();playSFX29('reaction_test');
};

// ============================================================
// SECTION 7: Body Composition Impact Analyzer (Canvas 620x400)
// ============================================================
var bodyKeys=['weight','muscle','fat','bmi','reach','height','handSpeed','powerRatio'];
var bodyNames=['체중','근육량','체지방','BMI','리치','신장','핸드스피드','파워비율'];
var bodyOptimal={weight:[65,90],muscle:[35,50],fat:[8,15],bmi:[20,26],reach:[170,195],height:[165,195],handSpeed:[15,30],powerRatio:[40,70]};
var perfKeys=['power','speed','defense','stamina'];
var perfNames=['파워','스피드','수비','스태미나'];

var sec7 = document.createElement('div');
sec7.id = 'v29-sec-7';
sec7.style.cssText = 'display:none;max-width:680px;margin:20px auto;padding:0 12px;';
sec7.innerHTML = '<div class="v29-card"><div class="v29-hdr">⚖️ 체성분임팩트 분석기</div><div class="v29-sub">8체성분 지표 × 4퍼포먼스 상관관계 히트맵 · 최적범위 인디케이터 · 체급 비교</div><canvas id="v29-cv-7" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#111;display:block;margin:0 auto"></canvas><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center"><button class="v29-btn" onclick="window._v29ScanBody()">체성분 스캔</button><button class="v29-btn-sec" onclick="window._v29ResetBody()">체성분 리셋</button></div></div>';
document.body.appendChild(sec7);

function drawBodyCanvas(){
  var cv = document.getElementById('v29-cv-7'); if(!cv) return;
  var c = cv.getContext('2d');
  c.clearRect(0,0,620,400);c.fillStyle='#0a0a1a';c.fillRect(0,0,620,400);
  c.fillStyle='#22d3ee';c.font='bold 14px sans-serif';c.fillText('⚖️ 체성분 임팩트 분석',10,22);
  // correlation heatmap: 8 metrics x 4 perf
  var hx=140,hy=40,cw=45,chh=20;
  for(var j=0;j<4;j++){
    c.fillStyle='#888';c.font='9px sans-serif';c.textAlign='center';c.fillText(perfNames[j],hx+j*cw+cw/2,hy-6);c.textAlign='left';
  }
  for(var i=0;i<8;i++){
    c.fillStyle='#ccc';c.font='9px sans-serif';c.fillText(bodyNames[i],10,hy+i*chh+14);
    for(var j=0;j<4;j++){
      var key=bodyKeys[i]+'_'+perfKeys[j];
      var corr=v29.bodyComp.correlations[key];
      if(corr===undefined) corr=0;
      var intensity=Math.abs(corr);
      var color = corr>=0? 'rgba(34,197,94,'+(0.15+intensity*0.7)+')' : 'rgba(239,68,68,'+(0.15+intensity*0.7)+')';
      c.fillStyle=color;
      c.fillRect(hx+j*cw,hy+i*chh,cw-2,chh-2);
      c.fillStyle='#fff';c.font='8px sans-serif';c.textAlign='center';
      c.fillText(corr.toFixed(2),hx+j*cw+(cw-2)/2,hy+i*chh+(chh-2)/2+3);c.textAlign='left';
    }
  }
  // optimal range bars
  c.fillStyle='#22d3ee';c.font='bold 11px sans-serif';c.fillText('현재값 vs 최적범위',380,45);
  var ox=380,oy=55,ow=220;
  for(var i=0;i<8;i++){
    var y=oy+i*26;
    var val=v29.bodyComp.metrics[bodyKeys[i]]||0;
    var rng=bodyOptimal[bodyKeys[i]];
    var maxScale = rng[1]*1.6;
    var lowX = (rng[0]/maxScale)*ow, highX=(rng[1]/maxScale)*ow;
    c.fillStyle='#222';c.fillRect(ox,y,ow,14);
    c.fillStyle='rgba(34,197,94,0.35)';c.fillRect(ox+lowX,y,highX-lowX,14);
    var valX=Math.min(ow,(val/maxScale)*ow);
    var inRange = val>=rng[0] && val<=rng[1];
    c.fillStyle = inRange? '#22c55e' : '#ef4444';
    c.fillRect(ox+valX-1.5,y-2,3,18);
    c.fillStyle='#ccc';c.font='9px sans-serif';c.fillText(bodyNames[i]+' '+val,ox,y-4);
  }
  // fighter class comparison
  var wcClass = classify(v29.bodyComp.metrics.weight);
  c.fillStyle='#0f172a';c.fillRect(0,358,620,42);
  c.fillStyle='#fbbf24';c.font='bold 11px sans-serif';
  c.fillText('체급 매칭: '+wcClass+'  (체중 '+v29.bodyComp.metrics.weight+'kg)', 10, 376);
  var inRangeCount=0;
  for(var i=0;i<8;i++){var v=v29.bodyComp.metrics[bodyKeys[i]];var r=bodyOptimal[bodyKeys[i]];if(v>=r[0]&&v<=r[1])inRangeCount++;}
  c.fillStyle='#22d3ee';c.font='bold 11px sans-serif';
  c.fillText('최적범위 '+inRangeCount+'/8 지표 충족', 10, 393);
}
function classify(w){
  if(w<57) return '페더급 이하';
  if(w<61) return '페더급';
  if(w<66.7) return '라이트급';
  if(w<69.9) return '웰터급';
  if(w<75) return '미들급';
  if(w<91) return '라이트헤비급';
  return '헤비급';
}
window._v29ScanBody = function(){
  bodyKeys.forEach(function(k){
    var base = defV29().bodyComp.metrics[k];
    v29.bodyComp.metrics[k] = Math.round((base + (Math.random()-0.5)*base*0.3)*10)/10;
  });
  perfKeys.forEach(function(pk){
    bodyKeys.forEach(function(bk){
      v29.bodyComp.correlations[bk+'_'+pk] = Math.round((Math.random()*2-1)*100)/100;
    });
  });
  v29.bodyComp.sessions++;
  saveV29(v29);drawBodyCanvas();
  var inRangeCount=0;
  for(var i=0;i<8;i++){var v=v29.bodyComp.metrics[bodyKeys[i]];var r=bodyOptimal[bodyKeys[i]];if(v>=r[0]&&v<=r[1])inRangeCount++;}
  playSFX29(inRangeCount>=5?'body_optimal':'body_scan');
  checkAchievementsV29();
};
window._v29ResetBody = function(){
  v29.bodyComp=defV29().bodyComp;saveV29(v29);drawBodyCanvas();playSFX29('body_scan');
};

// ============================================================
// SECTION 8: Fighter Legacy Comparison Dashboard (Canvas 620x400)
// ============================================================
var legends = ['알리','타이슨','메이웨더','파퀴아오','레너드','로빈슨','루이스','마르시아노','프레이저','포먼'];
var legendStats = [
  {record:98,koRatio:60,titleDefenses:75,longevity:90,peakRating:98,versatility:95,chin:85,heart:95},
  {record:80,koRatio:98,titleDefenses:60,longevity:50,peakRating:92,versatility:60,chin:70,heart:80},
  {record:100,koRatio:45,titleDefenses:80,longevity:95,peakRating:96,versatility:90,chin:95,heart:75},
  {record:90,koRatio:65,titleDefenses:70,longevity:88,peakRating:94,versatility:98,chin:75,heart:96},
  {record:88,koRatio:55,titleDefenses:72,longevity:80,peakRating:93,versatility:92,chin:80,heart:90},
  {record:92,koRatio:68,titleDefenses:74,longevity:78,peakRating:97,versatility:96,chin:82,heart:88},
  {record:85,koRatio:88,titleDefenses:70,longevity:70,peakRating:90,versatility:70,chin:90,heart:85},
  {record:95,koRatio:94,titleDefenses:65,longevity:60,peakRating:89,versatility:55,chin:99,heart:92},
  {record:87,koRatio:70,titleDefenses:55,longevity:65,peakRating:91,versatility:75,chin:88,heart:99},
  {record:76,koRatio:85,titleDefenses:50,longevity:72,peakRating:90,versatility:65,chin:96,heart:87}
];
var kpiKeys29 = ['record','koRatio','titleDefenses','longevity','peakRating','versatility','chin','heart'];
var kpiNames29 = ['전적','KO비율','타이틀방어','전성기지속','피크레이팅','다재다능','내구력','파이팅하트'];
var kpiColors29 = ['#ef4444','#f59e0b','#3b82f6','#22c55e','#a855f7','#ec4899','#14b8a6','#06b6d4'];

var sec8 = document.createElement('div');
sec8.id = 'v29-sec-8';
sec8.style.cssText = 'display:none;max-width:680px;margin:20px auto;padding:0 12px;';
sec8.innerHTML = '<div class="v29-card"><div class="v29-hdr">🏆 파이터레거시 비교기</div><div class="v29-sub">8 KPI 반원게이지 4x2 · 10대 레전드 비교 · 가중 종합등급 S~D</div><canvas id="v29-cv-8" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#111;display:block;margin:0 auto"></canvas><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center"><button class="v29-btn" onclick="window._v29CompareLegacy()">레거시 비교</button><button class="v29-btn-sec" onclick="window._v29UpdateLegacyKPI()">KPI 갱신</button></div></div>';
document.body.appendChild(sec8);

function drawLegacyCanvas(){
  var cv = document.getElementById('v29-cv-8'); if(!cv) return;
  var c = cv.getContext('2d');
  c.clearRect(0,0,620,400);c.fillStyle='#0a0a1a';c.fillRect(0,0,620,400);
  c.fillStyle='#22d3ee';c.font='bold 14px sans-serif';c.fillText('🏆 파이터 레거시 비교',10,20);
  var cols=4,rows=2,gw=130,gh=68,gap=15;
  var startX=30,startY=42;
  var totalScore=0;
  var fIdx = v29.legacy.compareFighter;
  var fStats = legendStats[fIdx];
  for(var idx=0;idx<8;idx++){
    var row=Math.floor(idx/cols),col=idx%cols;
    var x=startX+col*(gw+gap),y=startY+row*(gh+gap+12);
    var val=v29.legacy.kpis[kpiKeys29[idx]]||50;
    totalScore+=val;
    var pct=val/100;
    c.strokeStyle='rgba(255,255,255,0.1)';c.lineWidth=4;
    c.beginPath();c.arc(x+gw/2,y+gh,30,-Math.PI,0);c.stroke();
    c.strokeStyle=kpiColors29[idx];c.lineWidth=4;
    c.beginPath();c.arc(x+gw/2,y+gh,30,-Math.PI,-Math.PI+Math.PI*pct);c.stroke();c.lineWidth=1;
    // legend marker
    var legVal=fStats[kpiKeys29[idx]];
    var legA=-Math.PI+Math.PI*(legVal/100);
    var lx=x+gw/2+Math.cos(legA)*30, ly=y+gh+Math.sin(legA)*30;
    c.fillStyle='#fbbf24';c.beginPath();c.arc(lx,ly,3,0,Math.PI*2);c.fill();
    c.fillStyle='#fff';c.font='bold 12px sans-serif';c.textAlign='center';c.fillText(val+'',x+gw/2,y+gh-6);
    c.fillStyle=kpiColors29[idx];c.font='bold 9px sans-serif';c.fillText(kpiNames29[idx],x+gw/2,y+gh+12);
    c.textAlign='left';
  }
  var avgScore=Math.round(totalScore/8);
  var overallGrade=gradeOf29(avgScore);
  v29.legacy.overallGrade=overallGrade;
  c.fillStyle='#0f172a';c.fillRect(0,232,620,60);
  c.fillStyle='#22d3ee';c.font='bold 14px sans-serif';
  c.fillText('종합 등급: '+overallGrade+' ('+avgScore+'%)', 20, 255);
  c.fillStyle='#fbbf24';c.font='bold 11px sans-serif';
  c.fillText('● = '+legends[fIdx]+' 전성기 스탯', 20, 275);
  // legend list
  c.fillStyle='#22d3ee';c.font='bold 11px sans-serif';c.fillText('레전드 10인 (비교대상 순환)',20,308);
  for(var i=0;i<10;i++){
    var col=i%5, row=Math.floor(i/5);
    var lx=20+col*115, ly=318+row*22;
    var isSel = i===fIdx;
    c.fillStyle=isSel? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.03)';
    c.fillRect(lx,ly,105,18);
    c.fillStyle=isSel? '#fbbf24' : '#ccc';c.font=(isSel?'bold ':'')+'10px sans-serif';
    c.fillText(legends[i],lx+6,ly+13);
  }
}
window._v29CompareLegacy = function(){
  v29.legacy.compareFighter = (v29.legacy.compareFighter+1)%10;
  v29.legacy.sessions++;
  saveV29(v29);drawLegacyCanvas();playSFX29('legacy_compare');checkAchievementsV29();
};
window._v29UpdateLegacyKPI = function(){
  kpiKeys29.forEach(function(k){
    v29.legacy.kpis[k]=Math.min(100,Math.max(5,v29.legacy.kpis[k]+Math.round((Math.random()-0.3)*15)));
  });
  saveV29(v29);drawLegacyCanvas();playSFX29('legacy_compare');checkAchievementsV29();
};

// ============================================================
// SECTION 9: QUIZ V29: 15 Questions (300->315)
// ============================================================
var quizV29Data = [
  {q:'펀치조합체인분석기에서 노드 크기는 무엇을 의미하는가?',a:['전환 빈도','콤보 사용 빈도','펀치 파워','타이밍 정밀도'],c:1},
  {q:'피로곡선 시뮬레이터에서 ‘세컨드 윈드’란?',a:['첫 라운드 피로','중반 이후 회복성 파워 급상승','경기 종료 신호','부상 위험 신호'],c:1},
  {q:'‘Rope-a-Dope’처럼 체력을 소모시키는 전략이 가장 효과적인 상대 유형은?',a:['슬러거','슬릭','아웃복서','볼륨 펀처'],c:1},
  {q:'상대패턴 스카우팅에서 ‘슬러거’를 상대할 최적 전략은?',a:['근접전으로 압박','거리 유지 후 아웃복싱 카운터','클린치로 시간끌기','무조건 맞대응'],c:1},
  {q:'콤보전환 스무스니스 트래커의 ‘병목구간’은 무엇을 나타내는가?',a:['가장 빠른 전환','가장 낮은 전환 점수','가장 많이 쓰인 콤보','가장 높은 파워'],c:1},
  {q:'라운드모멘텀 트래커에서 ‘모멘텀 전환 마커’가 표시되는 조건은?',a:['라운드 종료 시','공격-수비 우위가 급격히 뒤바뀔 때','펀치 수가 감소할 때','체력이 100%일 때'],c:1},
  {q:'방어반응속도 분석기에서 측정하는 반응시간 단위는?',a:['초(s)','밀리초(ms)','분(min)','프레임'],c:1},
  {q:'8가지 방어 기술 중 ‘숄더롤’ 스타일로 유명한 복서 유형은?',a:['프레셔 파이터','필리 숄더롤 기법 구사자','아마추어 초보자','헤비급 슬러거'],c:1},
  {q:'체성분임팩트분석기의 BMI 최적범위는 대략 어느 구간인가?',a:['15-18','20-26','30-35','40 이상'],c:1},
  {q:'체성분과 퍼포먼스의 상관관계 히트맵에서 양의 상관관계는 어떤 색으로 표시되는가?',a:['빨강','초록','파랑','회색'],c:1},
  {q:'파이터레거시 비교기의 8가지 KPI에 포함되지 않는 것은?',a:['타이틀방어','KO비율','SNS팔로워','파이팅하트'],c:2},
  {q:'무하마드 알리가 조지 포먼을 상대로 사용한 유명한 체력소모 전략의 이름은?',a:['Rope-a-Dope','Philly Shell','Peek-a-Boo','Cross-Arm Guard'],c:0},
  {q:'FightCamp류 트레이너 대비 본 시스템이 강화한 분석 영역은?',a:['실시간 센서 하드웨어','펀치 콤보 체인/피로곡선/상대패턴 분석','GPS 위치추적','음악 스트리밍'],c:1},
  {q:'라운드 승률 스택바에서 초록색이 의미하는 것은?',a:['패배 확률','무승부 확률','승리 확률','부상 위험'],c:2},
  {q:'경기 전체 페이스를 최적화하려면 어떤 곡선을 참고해야 하는가?',a:['임팩트 파워맵','최적 페이싱 오버레이','체급 분류표','SFX 볼륨'],c:1}
];
quizV29Data = quizV29Data.slice(0,15);

var secQuiz29 = document.createElement('div');
secQuiz29.id = 'v29-sec-9';
secQuiz29.style.cssText = 'display:none;max-width:680px;margin:20px auto;padding:0 12px;';
var quizHtml29 = '<div class="v29-card"><div class="v29-hdr">🎯 복싱 퀴즈 v29 (15문)</div>';
for(var qi=0;qi<quizV29Data.length;qi++){
  var qq=quizV29Data[qi];
  quizHtml29 += '<div style="margin:10px 0;padding:10px;background:var(--surface);border-radius:10px"><div style="font-size:12px;font-weight:700;margin-bottom:6px">Q'+(qi+1)+'. '+qq.q+'</div>';
  for(var ai=0;ai<qq.a.length;ai++){
    quizHtml29 += '<button onclick="window._v29QuizAnswer('+qi+','+ai+')" style="display:block;width:100%;text-align:left;padding:6px 10px;margin:3px 0;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;color:var(--text,#f0f0f0);font-size:11px;cursor:pointer" id="v29-q'+qi+'-a'+ai+'">'+qq.a[ai]+'</button>';
  }
  quizHtml29 += '<div id="v29-q'+qi+'-result" style="font-size:11px;margin-top:4px;min-height:16px"></div></div>';
}
quizHtml29 += '</div>';
secQuiz29.innerHTML = quizHtml29;
document.body.appendChild(secQuiz29);

window._v29QuizAnswer = function(qi, ai){
  var qq=quizV29Data[qi];
  var resEl=document.getElementById('v29-q'+qi+'-result');
  if(v29.quizV29Scores[qi] !== undefined) return;
  var correct = ai === qq.c;
  v29.quizV29Scores[qi] = correct ? 1 : 0;
  for(var j=0;j<qq.a.length;j++){
    var btn=document.getElementById('v29-q'+qi+'-a'+j);
    if(j===qq.c) btn.style.border='2px solid #22c55e';
    else if(j===ai && !correct) btn.style.border='2px solid #ef4444';
    btn.style.pointerEvents='none';
  }
  resEl.innerHTML=correct?'<span style="color:#22c55e">✅ 정답!</span>':'<span style="color:#ef4444">❌ 오답. 정답: '+qq.a[qq.c]+'</span>';
  saveV29(v29);
  if(correct) playSFX29('quiz_correct29');
  checkAchievementsV29();
};

// ============================================================
// ACHIEVEMENTS V29 (+12, 262->274)
// ============================================================
var achieveV29Defs = [
  {id:'a29_chain_1',name:'체인 빌더',desc:'펀치조합체인 시뮬레이션 1회 완료',check:function(){return v29.comboChain.sessions>=1}},
  {id:'a29_chain_s',name:'체인 마스터',desc:'콤보 효율 등급 S 달성',check:function(){return v29.comboChain.bestGrade==='S'}},
  {id:'a29_fatigue_1',name:'피로 분석가',desc:'피로곡선 시뮬레이션 1회 완료',check:function(){return (v29.fatigueCurve.sessions||[]).length>=1}},
  {id:'a29_second_wind',name:'세컨드 윈드',desc:'세컨드윈드 포인트 발견',check:function(){return v29.fatigueCurve.secondWind!==null}},
  {id:'a29_scout_all',name:'전술 정찰병',desc:'8개 상대스타일 모두 분석',check:function(){return Object.keys(v29.scouting.analyzed).length>=8}},
  {id:'a29_smooth_5',name:'스무스니스 트레이너',desc:'전환 측정 5회 완료',check:function(){return v29.transitionSmooth.sessions>=5}},
  {id:'a29_momentum_shift3',name:'모멘텀 헌터',desc:'모멘텀 전환 3회 감지',check:function(){return (v29.momentum.shifts||[]).length>=3}},
  {id:'a29_reaction_pro',name:'리액션 프로',desc:'4개 이상 방어유형 프로기록 경신',check:function(){var c=0;for(var i=0;i<8;i++){if(v29.reactionSpeed.defenses[defKeys[i]]>0 && v29.reactionSpeed.defenses[defKeys[i]]<=defProMs[i])c++;}return c>=4}},
  {id:'a29_body_optimal',name:'체성분 최적화',desc:'3개 이상 지표 최적범위 충족',check:function(){var c=0;for(var i=0;i<8;i++){var v=v29.bodyComp.metrics[bodyKeys[i]];var r=bodyOptimal[bodyKeys[i]];if(v>=r[0]&&v<=r[1])c++;}return c>=3}},
  {id:'a29_legacy_compare',name:'레전드 헌터',desc:'레거시 비교 1회 실행',check:function(){return v29.legacy.sessions>=1}},
  {id:'a29_quiz_10',name:'퀴즈 도전자 v29',desc:'v29 퀴즈 10문 정답',check:function(){var cnt=0;for(var k in v29.quizV29Scores)if(v29.quizV29Scores[k]===1)cnt++;return cnt>=10}},
  {id:'a29_all_features',name:'v29 마스터',desc:'v29 모든 기능 사용',check:function(){var keys=['comboChain','fatigueCurve','scouting','transitionSmooth','momentum','reactionSpeed','bodyComp','legacy'];for(var i=0;i<keys.length;i++)if(!v29.featureUsage29[keys[i]])return false;return true}}
];

function checkAchievementsV29(){
  var newUnlock = false;
  achieveV29Defs.forEach(function(ad){
    if(!v29.achievementsV29[ad.id] && ad.check()){
      v29.achievementsV29[ad.id] = true;
      newUnlock = true;
    }
  });
  if(newUnlock) saveV29(v29);
}

// ============================================================
// NAVIGATION: append buttons to existing bar (NO new bottom bar)
// ============================================================
function addV29Nav(){
  var features = [
    {id:'comboChain',label:'콤보체인',sec:sec1},
    {id:'fatigueCurve',label:'피로곡선',sec:sec2},
    {id:'scouting',label:'상대스카우팅',sec:sec3},
    {id:'transitionSmooth',label:'전환스무스',sec:sec4},
    {id:'momentum',label:'라운드모멘텀',sec:sec5},
    {id:'reactionSpeed',label:'방어반응',sec:sec6},
    {id:'bodyComp',label:'체성분임팩트',sec:sec7},
    {id:'legacy',label:'레거시비교',sec:sec8},
    {id:'quizV29',label:'퀴즈v29',sec:secQuiz29}
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

  var allSecIds = features.map(function(f){return f.sec.id});
  features.forEach(function(f){
    var btn = document.createElement('button');
    btn.style.cssText = 'padding:6px 10px;background:linear-gradient(135deg,rgba(6,182,212,0.15),rgba(8,145,178,0.15));border:1px solid rgba(34,211,238,0.3);border-radius:8px;color:#22d3ee;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .2s;flex-shrink:0;';
    btn.textContent = f.label;
    btn.onclick = function(fRef){
      return function(){
        document.querySelectorAll('[id^="v29-sec-"]').forEach(function(s){ s.style.display = 'none'; });
        fRef.sec.style.display = 'block';
        v29.featureUsage29[fRef.id] = true;
        saveV29(v29);
        checkAchievementsV29();
      };
    }(f);
    if(navWrap) navWrap.appendChild(btn);
  });
}

// ============================================================
// KEYBOARD SHORTCUTS (Shift+A/S/D/F/G/H/J/K for 8 features, Shift+0 for quiz)
// ============================================================
document.addEventListener('keydown', function(e){
  if(!e.shiftKey) return;
  var sections = [sec1, sec2, sec3, sec4, sec5, sec6, sec7, sec8, secQuiz29];
  var keys = ['A','S','D','F','G','H','J','K','0'];
  var featureIds = ['comboChain','fatigueCurve','scouting','transitionSmooth','momentum','reactionSpeed','bodyComp','legacy','quizV29'];
  var idx = keys.indexOf(e.key.toUpperCase());
  if(idx === -1 && e.key === ')') idx = 8;
  if(idx >= 0 && idx < sections.length){
    e.preventDefault();
    document.querySelectorAll('[id^="v29-sec-"]').forEach(function(s){ s.style.display = 'none'; });
    sections[idx].style.display = 'block';
    v29.featureUsage29[featureIds[idx]] = true;
    saveV29(v29);
    checkAchievementsV29();
  }
});

// ============================================================
// INIT
// ============================================================
setTimeout(function(){
  addV29Nav();
  drawChainCanvas();
  drawFatigueCanvas();
  drawScoutCanvas();
  drawSmoothCanvas();
  drawMomentumCanvas();
  drawReactionCanvas();
  drawBodyCanvas();
  drawLegacyCanvas();
  checkAchievementsV29();
}, 850);

})();
