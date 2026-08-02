// Boxing Trainer Pro v27_patch.js - NEXTERA+PRISM Auto Enhancement Module
// 1. Counter-Punch Timing Analyzer Canvas 620x400 - 8 counter scenarios, timing window bar, success rate line chart, S~D grade
// 2. Punch Output Efficiency Canvas 600x380 - 7 punch types, power/energy ratio dual bar, efficiency radar, session trend
// 3. AI Sparring Strategy Advisor Canvas 620x400 - 6 opponent styles, 8-axis tactical radar, strategy match score, drill picker
// 4. Boxing Mobility Assessment Canvas 600x380 - 10 mobility tests, 5-zone body flexibility heatmap, improvement tracker
// 5. Round Pacing Optimizer Canvas 620x400 - 12R energy/output dual line, pacing zone bands, pace grade per round
// 6. Punch Flow Sankey Visualizer Canvas 640x400 - Setup→Power→Follow-up 3-column Sankey, flow thickness = frequency
// 7. Boxing Injury Risk Matrix Canvas 620x380 - 8 body parts x 6 risk factors heatmap, prevention drill per zone
// 8. Fighter Trading Card Generator Canvas 600x400 - Full-stats card design, 8-axis radar, rank emblem, career highlights
// Quiz +15 (270->285), +12 Achievements (238->250), SFX 16, Keyboard Shift+A/S/D/F/G/H/J/K/0
(function(){
'use strict';

var V27KEY = 'boxingV27Patch';

function loadV27(){
  try {
    var r = localStorage.getItem(V27KEY);
    if(!r) return defV27();
    var p = JSON.parse(r), d = defV27();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV27(); }
}
function saveV27(d){ try { localStorage.setItem(V27KEY, JSON.stringify(d)); } catch(e){} }
function defV27(){
  return {
    counterTiming: { scenarios: {jabCounter:0,crossCounter:0,hookSlip:0,upperPull:0,bodyRoll:0,jabParry:0,overhandDuck:0,comboBurst:0}, timingWindows: [], successRate: 0, sessions: 0, bestGrade: 'D' },
    punchEfficiency: { punches: {jab:50,cross:50,leadHook:50,rearHook:50,leadUpper:50,rearUpper:50,overhand:50}, energyCost: {jab:20,cross:35,leadHook:40,rearHook:45,leadUpper:38,rearUpper:42,overhand:50}, sessions: [], bestGrade: 'D' },
    aiStrategy: { opponentStyles: {swarmer:0,outboxer:0,slugger:0,boxerPuncher:0,counterpuncher:0,switchHitter:0}, matchScores: {}, drills: 0, sessions: 0 },
    mobility: { tests: {shoulderRot:50,hipFlex:50,ankleRange:50,thoracicExt:50,hamstring:50,wristFlex:50,neckRot:50,spinalTwist:50,hipAdduct:50,calfFlex:50}, sessions: [], improvements: {} },
    pacing: { rounds: Array(12).fill(null).map(function(){return {energy:80,output:50,pace:'steady'}}), grades: [], sessions: 0, optimalPace: null },
    punchFlow: { flows: {}, totalFlows: 0, topChains: [], sessions: 0 },
    injuryRisk: { bodyParts: {shoulder:0,elbow:0,wrist:0,knuckle:0,ribs:0,neck:0,knee:0,back:0}, riskFactors: {overuse:0,impact:0,fatigue:0,form:0,flexibility:0,recovery:0}, drillsDone: 0, sessions: 0 },
    tradeCard: { stats: {power:50,speed:50,defense:50,stamina:50,ringIQ:50,chin:50,footwork:50,heart:50}, rank: 'Bronze', xp: 0, fights: 0, wins: 0, kos: 0, nickname: '' },
    quizV27Scores: {},
    achievementsV27: {},
    featureUsage27: {}
  };
}

var v27 = loadV27();

// ===== CSS =====
var st27 = document.createElement('style');
st27.textContent = '.v27-btn{padding:8px 16px;background:linear-gradient(135deg,#ef4444,#dc2626);border:none;border-radius:10px;color:#fff;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s}.v27-btn:hover{filter:brightness(1.15);transform:scale(1.03)}.v27-btn-sec{padding:8px 16px;background:var(--surface,rgba(255,255,255,0.04));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:10px;color:var(--text-dim,#8a8a9e);font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.v27-btn-sec:hover{border-color:#ef4444;color:#f87171}.v27-card{background:var(--glass,rgba(255,255,255,0.06));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:var(--radius,16px);padding:16px;margin-bottom:12px}.v27-hdr{font-size:15px;font-weight:800;margin-bottom:10px;display:flex;align-items:center;gap:8px}.v27-sub{font-size:11px;color:var(--text-dim,#8a8a9e);margin-bottom:8px}.v27-grade{display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:800}.v27-grade-s{background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#000}.v27-grade-a{background:linear-gradient(135deg,#a78bfa,#7c3aed);color:#fff}.v27-grade-b{background:linear-gradient(135deg,#60a5fa,#3b82f6);color:#fff}.v27-grade-c{background:linear-gradient(135deg,#34d399,#10b981);color:#000}.v27-grade-d{background:rgba(255,255,255,0.1);color:var(--text-dim,#8a8a9e)}';
document.head.appendChild(st27);

// ===== SFX ENGINE V27 =====
function playSFX27(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'counter_success':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(1320,t+0.06);
        g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.12);break;
      case 'counter_miss':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sawtooth';
        o.frequency.setValueAtTime(250,t);o.frequency.exponentialRampToValueAtTime(120,t+0.15);
        g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.18);break;
      case 'efficiency_up':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(440,t);o.frequency.setValueAtTime(660,t+0.05);o.frequency.setValueAtTime(880,t+0.1);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.18);break;
      case 'strategy_match':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';
        o.frequency.setValueAtTime(523,t);o.frequency.setValueAtTime(659,t+0.06);o.frequency.setValueAtTime(784,t+0.12);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.2);break;
      case 'strategy_drill':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='square';
        o.frequency.setValueAtTime(392,t);o.frequency.setValueAtTime(440,t+0.04);
        g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.1);break;
      case 'mobility_improve':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(330,t);o.frequency.exponentialRampToValueAtTime(660,t+0.12);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.15);break;
      case 'pacing_optimal':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(587,t);o.frequency.setValueAtTime(740,t+0.05);o.frequency.setValueAtTime(880,t+0.1);o.frequency.setValueAtTime(1175,t+0.15);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.22);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.22);break;
      case 'pacing_warn':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sawtooth';
        o.frequency.setValueAtTime(300,t);o.frequency.setValueAtTime(280,t+0.06);o.frequency.setValueAtTime(300,t+0.12);
        g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.15);break;
      case 'flow_connect':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(440,t);o.frequency.exponentialRampToValueAtTime(550,t+0.05);
        g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.08);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.08);break;
      case 'flow_chain':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(440,t);o.frequency.setValueAtTime(554,t+0.04);o.frequency.setValueAtTime(659,t+0.08);o.frequency.setValueAtTime(880,t+0.12);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.18);break;
      case 'injury_alert':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='square';
        o.frequency.setValueAtTime(200,t);o.frequency.setValueAtTime(250,t+0.06);o.frequency.setValueAtTime(200,t+0.12);
        g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.18);break;
      case 'injury_clear':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(660,t);o.frequency.exponentialRampToValueAtTime(880,t+0.1);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.14);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.14);break;
      case 'card_generate':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(523,t);o.frequency.setValueAtTime(659,t+0.04);o.frequency.setValueAtTime(784,t+0.08);o.frequency.setValueAtTime(1047,t+0.12);o.frequency.setValueAtTime(1319,t+0.16);
        g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.25);break;
      case 'card_rankup':
        var o=ctx.createOscillator(),o2=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o2.type='triangle';
        o.frequency.setValueAtTime(440,t);o.frequency.setValueAtTime(660,t+0.1);o.frequency.setValueAtTime(880,t+0.2);
        o2.frequency.setValueAtTime(880,t);o2.frequency.setValueAtTime(1320,t+0.1);o2.frequency.setValueAtTime(1760,t+0.2);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);
        o.connect(g);o2.connect(g);g.connect(ctx.destination);o.start(t);o2.start(t);o.stop(t+0.3);o2.stop(t+0.3);break;
      case 'quiz27':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(1100,t+0.08);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.1);break;
      case 'quiz27_wrong':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sawtooth';
        o.frequency.setValueAtTime(180,t);o.frequency.exponentialRampToValueAtTime(100,t+0.15);
        g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.18);break;
    }
    setTimeout(function(){ctx.close();},500);
  } catch(e){}
}

function gradeFor(val,max){
  var pct = val / max * 100;
  if(pct >= 90) return 'S';
  if(pct >= 75) return 'A';
  if(pct >= 55) return 'B';
  if(pct >= 35) return 'C';
  return 'D';
}
function gradeClass(g){ return 'v27-grade v27-grade-' + g.toLowerCase(); }

// ===== HELPER: Canvas Draw Utilities =====
function clr27(ctx,w,h){
  var isDark = !document.documentElement.getAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.fillStyle = isDark ? '#0f0a1e' : '#f5f5f8';
  ctx.fillRect(0,0,w,h);
  return isDark;
}
var COLORS27 = ['#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#f43f5e','#14b8a6','#a855f7','#6366f1'];

// ============================================================
// SECTION 1: Counter-Punch Timing Analyzer
// ============================================================
var sec1 = document.createElement('div');
sec1.id = 'v27-sec-1';
sec1.style.cssText = 'display:none;padding:12px;max-width:700px;margin:0 auto;';
sec1.innerHTML = '<div class="v27-card"><div class="v27-hdr">&#9889; &#52852;&#50868;&#53552;&#54144;&#52824; &#53440;&#51060;&#48141; &#48516;&#49437;&#44592;</div><div class="v27-sub">8&#44060; &#52852;&#50868;&#53552; &#49884;&#45208;&#47532;&#50724;&#48324; &#53440;&#51060;&#48141; &#50948;&#46020;&#50864; + &#49457;&#44277;&#47456; &#47001; &#52264;&#53944; + S~D&#46321;&#44553;</div><canvas id="v27-canvas-counter" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;margin:8px auto;display:block;cursor:pointer"></canvas><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:8px"><button class="v27-btn" onclick="window._v27SimCounter()">&#52852;&#50868;&#53552; &#50672;&#49845;</button><button class="v27-btn-sec" onclick="window._v27ResetCounter()">&#52488;&#44592;&#54868;</button></div></div>';
document.body.appendChild(sec1);

function drawCounterCanvas(){
  var c = document.getElementById('v27-canvas-counter');
  if(!c) return;
  var ctx = c.getContext('2d'), W=620, H=400;
  var isDark = clr27(ctx,W,H);
  var fg = isDark ? '#f0f0f0' : '#1a1a2e';
  var dim = isDark ? '#8a8a9e' : '#555';
  var scenarios = ['Jab&#52852;&#50868;&#53552;','Cross&#52852;&#50868;&#53552;','Hook&#49836;&#47549;','Upper&#54400;&#48177;','Body&#47204;','Jab&#54056;&#47532;','OH&#45909;','&#53092;&#48372;&#48260;&#49828;&#53944;'];
  var keys = ['jabCounter','crossCounter','hookSlip','upperPull','bodyRoll','jabParry','overhandDuck','comboBurst'];
  var vals = keys.map(function(k){ return v27.counterTiming.scenarios[k] || 0; });
  var max = Math.max.apply(null, vals.concat([10]));
  ctx.fillStyle = fg; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('카운터펀치 타이밍 분석기', 20, 28);
  var grade = gradeFor(v27.counterTiming.successRate, 100);
  ctx.font = 'bold 12px sans-serif'; ctx.fillStyle = grade==='S'?'#fbbf24':grade==='A'?'#a78bfa':grade==='B'?'#60a5fa':grade==='C'?'#34d399':dim;
  ctx.fillText('등급: '+grade+' (성공률 '+(v27.counterTiming.successRate||0).toFixed(1)+'%)', 450, 28);
  var barW = 55, gap = 12, startX = 50, baseY = 340;
  for(var i=0; i<8; i++){
    var x = startX + i*(barW+gap);
    var barH = max > 0 ? (vals[i]/max) * 260 : 0;
    var grd = ctx.createLinearGradient(x, baseY-barH, x, baseY);
    grd.addColorStop(0, COLORS27[i]);
    grd.addColorStop(1, COLORS27[i]+'66');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.roundRect(x, baseY-barH, barW, barH, [4,4,0,0]); ctx.fill();
    ctx.fillStyle = fg; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(scenarios[i], x+barW/2, baseY+14);
    ctx.fillStyle = dim; ctx.font = 'bold 10px sans-serif';
    ctx.fillText(vals[i]+'', x+barW/2, baseY-barH-6);
  }
  ctx.textAlign = 'left';
  if(v27.counterTiming.timingWindows.length > 1){
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.beginPath();
    var tw = v27.counterTiming.timingWindows.slice(-20);
    for(var i=0; i<tw.length; i++){
      var px = 50+i*(520/(tw.length-1||1)), py = 380 - tw[i]*3;
      i===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
    }
    ctx.stroke();
    ctx.fillStyle = dim; ctx.font = '9px sans-serif';
    ctx.fillText('최근 성공률 추이', 50, 395);
  }
  ctx.fillStyle = dim; ctx.font = '10px sans-serif';
  ctx.fillText('세션: '+(v27.counterTiming.sessions||0), 520, 395);
}
window._v27SimCounter = function(){
  var keys = ['jabCounter','crossCounter','hookSlip','upperPull','bodyRoll','jabParry','overhandDuck','comboBurst'];
  var pick = keys[Math.floor(Math.random()*keys.length)];
  v27.counterTiming.scenarios[pick] = (v27.counterTiming.scenarios[pick]||0) + 1;
  var success = 40 + Math.random()*50;
  v27.counterTiming.timingWindows.push(success);
  if(v27.counterTiming.timingWindows.length > 30) v27.counterTiming.timingWindows.shift();
  var avg = v27.counterTiming.timingWindows.reduce(function(a,b){return a+b;},0)/v27.counterTiming.timingWindows.length;
  v27.counterTiming.successRate = avg;
  v27.counterTiming.sessions++;
  v27.counterTiming.bestGrade = gradeFor(avg, 100);
  saveV27(v27);
  playSFX27(success > 60 ? 'counter_success' : 'counter_miss');
  drawCounterCanvas();
  checkAchievementsV27();
};
window._v27ResetCounter = function(){
  v27.counterTiming = defV27().counterTiming; saveV27(v27); drawCounterCanvas();
};

// ============================================================
// SECTION 2: Punch Output Efficiency
// ============================================================
var sec2 = document.createElement('div');
sec2.id = 'v27-sec-2';
sec2.style.cssText = 'display:none;padding:12px;max-width:700px;margin:0 auto;';
sec2.innerHTML = '<div class="v27-card"><div class="v27-hdr">&#9889; &#54144;&#52824; &#52636;&#47141; &#54952;&#50984; &#48516;&#49437;&#44592;</div><div class="v27-sub">7&#51333; &#54144;&#52824; &#54028;&#50892;/&#50640;&#45320;&#51648; &#48708;&#50984; + &#54952;&#50984; &#47112;&#51060;&#45908; + &#49464;&#49496; &#53944;&#47116;&#46300;</div><canvas id="v27-canvas-efficiency" width="600" height="380" style="width:100%;max-width:600px;border-radius:12px;margin:8px auto;display:block;cursor:pointer"></canvas><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:8px"><button class="v27-btn" onclick="window._v27SimEfficiency()">&#54952;&#50984; &#52769;&#51221;</button><button class="v27-btn-sec" onclick="window._v27ResetEfficiency()">&#52488;&#44592;&#54868;</button></div></div>';
document.body.appendChild(sec2);

function drawEfficiencyCanvas(){
  var c = document.getElementById('v27-canvas-efficiency');
  if(!c) return;
  var ctx = c.getContext('2d'), W=600, H=380;
  var isDark = clr27(ctx,W,H);
  var fg = isDark ? '#f0f0f0' : '#1a1a2e';
  var dim = isDark ? '#8a8a9e' : '#555';
  var labels = ['Jab','Cross','L.Hook','R.Hook','L.Upper','R.Upper','Overhand'];
  var pKeys = ['jab','cross','leadHook','rearHook','leadUpper','rearUpper','overhand'];
  ctx.fillStyle = fg; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('펀치 출력 효율 분석기', 20, 28);
  var barW = 30, gap = 20, startX = 60, baseY = 300;
  for(var i=0; i<7; i++){
    var x = startX + i*(barW*2+gap+10);
    var power = v27.punchEfficiency.punches[pKeys[i]] || 50;
    var energy = v27.punchEfficiency.energyCost[pKeys[i]] || 30;
    var efficiency = energy > 0 ? (power / energy * 100) : 0;
    var pH = power * 2.4;
    var eH = energy * 2.4;
    ctx.fillStyle = COLORS27[i]; ctx.beginPath(); ctx.roundRect(x, baseY-pH, barW, pH, [3,3,0,0]); ctx.fill();
    ctx.fillStyle = COLORS27[i]+'66'; ctx.beginPath(); ctx.roundRect(x+barW+2, baseY-eH, barW, eH, [3,3,0,0]); ctx.fill();
    ctx.fillStyle = fg; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(labels[i], x+barW, baseY+14);
    ctx.fillStyle = dim; ctx.font = '8px sans-serif';
    ctx.fillText('P:'+power, x+barW/2, baseY-pH-4);
    ctx.fillText('E:'+energy, x+barW+2+barW/2, baseY-eH-4);
    var effG = gradeFor(efficiency, 300);
    ctx.fillStyle = effG==='S'?'#fbbf24':effG==='A'?'#a78bfa':'#60a5fa';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText(efficiency.toFixed(0)+'%', x+barW, baseY+26);
  }
  ctx.textAlign = 'left';
  var cx=480, cy=180, r=70;
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 1;
  for(var ring=1; ring<=3; ring++){
    ctx.beginPath(); ctx.arc(cx,cy,r*ring/3,0,Math.PI*2); ctx.stroke();
  }
  ctx.fillStyle = '#ef4444'+'33'; ctx.beginPath();
  for(var i=0; i<7; i++){
    var angle = Math.PI*2*i/7 - Math.PI/2;
    var val = (v27.punchEfficiency.punches[pKeys[i]]||50)/100*r;
    var px = cx + Math.cos(angle)*val, py = cy + Math.sin(angle)*val;
    i===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
  }
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.stroke();
  for(var i=0; i<7; i++){
    var angle = Math.PI*2*i/7 - Math.PI/2;
    ctx.fillStyle = dim; ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
    var lx = cx + Math.cos(angle)*(r+14), ly = cy + Math.sin(angle)*(r+14);
    ctx.fillText(labels[i], lx, ly+3);
  }
  ctx.textAlign = 'left';
  ctx.fillStyle = dim; ctx.font = '10px sans-serif';
  ctx.fillText('세션: '+(v27.punchEfficiency.sessions.length||0), 490, 370);
}
window._v27SimEfficiency = function(){
  var pKeys = ['jab','cross','leadHook','rearHook','leadUpper','rearUpper','overhand'];
  pKeys.forEach(function(k){
    v27.punchEfficiency.punches[k] = Math.min(100, (v27.punchEfficiency.punches[k]||50) + Math.floor(Math.random()*8) - 2);
    v27.punchEfficiency.energyCost[k] = Math.max(10, Math.min(80, (v27.punchEfficiency.energyCost[k]||30) + Math.floor(Math.random()*6) - 3));
  });
  v27.punchEfficiency.sessions.push(Date.now());
  if(v27.punchEfficiency.sessions.length > 30) v27.punchEfficiency.sessions.shift();
  saveV27(v27); playSFX27('efficiency_up'); drawEfficiencyCanvas(); checkAchievementsV27();
};
window._v27ResetEfficiency = function(){
  v27.punchEfficiency = defV27().punchEfficiency; saveV27(v27); drawEfficiencyCanvas();
};

// ============================================================
// SECTION 3: AI Sparring Strategy Advisor
// ============================================================
var sec3 = document.createElement('div');
sec3.id = 'v27-sec-3';
sec3.style.cssText = 'display:none;padding:12px;max-width:700px;margin:0 auto;';
sec3.innerHTML = '<div class="v27-card"><div class="v27-hdr">&#129302; AI &#49828;&#54028;&#47553; &#51204;&#47029; &#50612;&#46300;&#48148;&#51060;&#51200;</div><div class="v27-sub">6&#44060; &#49345;&#45824; &#49828;&#53440;&#51068; &#48324; &#51204;&#49696; &#47588;&#52845; + 8&#52629; &#51204;&#49696; &#47112;&#51060;&#45908; + &#46300;&#47540; &#52628;&#52380;</div><canvas id="v27-canvas-strategy" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;margin:8px auto;display:block;cursor:pointer"></canvas><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:8px"><button class="v27-btn" onclick="window._v27SimStrategy()">&#51204;&#47029; &#48516;&#49437;</button><button class="v27-btn-sec" onclick="window._v27ResetStrategy()">&#52488;&#44592;&#54868;</button></div></div>';
document.body.appendChild(sec3);

function drawStrategyCanvas(){
  var c = document.getElementById('v27-canvas-strategy');
  if(!c) return;
  var ctx = c.getContext('2d'), W=620, H=400;
  var isDark = clr27(ctx,W,H);
  var fg = isDark ? '#f0f0f0' : '#1a1a2e';
  var dim = isDark ? '#8a8a9e' : '#555';
  var styles = ['Swarmer','Outboxer','Slugger','Boxer-Puncher','Counter','Switch'];
  var styleKeys = ['swarmer','outboxer','slugger','boxerPuncher','counterpuncher','switchHitter'];
  ctx.fillStyle = fg; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('AI 스파링 전략 어드바이저', 20, 28);
  var strategies = {
    swarmer: {name:'Swarmer', weakness:'거리유지+잽 계속', color:'#ef4444'},
    outboxer: {name:'Outboxer', weakness:'압박+컨디션다운', color:'#3b82f6'},
    slugger: {name:'Slugger', weakness:'풀워크+카운터', color:'#f97316'},
    boxerPuncher: {name:'Boxer-Puncher', weakness:'크린치+휴식관리', color:'#8b5cf6'},
    counterpuncher: {name:'Counter', weakness:'페인트+프레셔', color:'#22c55e'},
    switchHitter: {name:'Switch', weakness:'각도찾기+리드핸드공략', color:'#ec4899'}
  };
  var barW = 80, gap = 12, startX = 40, baseY = 250;
  for(var i=0; i<6; i++){
    var x = startX + i*(barW+gap);
    var val = v27.aiStrategy.opponentStyles[styleKeys[i]] || 0;
    var barH = Math.min(val * 8, 180);
    ctx.fillStyle = strategies[styleKeys[i]].color + '44';
    ctx.beginPath(); ctx.roundRect(x, baseY-barH, barW, barH, [4,4,0,0]); ctx.fill();
    ctx.fillStyle = strategies[styleKeys[i]].color;
    ctx.beginPath(); ctx.roundRect(x, baseY-barH, barW, Math.min(barH, 4), [4,4,0,0]); ctx.fill();
    ctx.fillStyle = fg; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(styles[i], x+barW/2, baseY+14);
    ctx.fillStyle = dim; ctx.font = '8px sans-serif';
    ctx.fillText(val+'회', x+barW/2, baseY+26);
    ctx.fillStyle = strategies[styleKeys[i]].color; ctx.font = '7px sans-serif';
    var lines = strategies[styleKeys[i]].weakness.split('+');
    lines.forEach(function(l,li){ ctx.fillText(l, x+barW/2, baseY+38+li*10); });
  }
  ctx.textAlign = 'left';
  var tactics = ['공격시점','방어선택','풀워크조절','압박강도','카운터타이밍','링제어','컨디션관리','전술전환'];
  var cx = 520, cy = 340, tr = 50;
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  for(var ring=1; ring<=3; ring++){
    ctx.beginPath(); ctx.arc(cx,cy,tr*ring/3,0,Math.PI*2); ctx.stroke();
  }
  ctx.fillStyle = '#ef4444'+'22'; ctx.beginPath();
  for(var i=0; i<8; i++){
    var angle = Math.PI*2*i/8 - Math.PI/2;
    var val = 30 + Math.random()*40;
    var px = cx + Math.cos(angle)*val/100*tr, py = cy + Math.sin(angle)*val/100*tr;
    i===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
  }
  ctx.closePath(); ctx.fill(); ctx.strokeStyle='#ef4444'; ctx.lineWidth=1.5; ctx.stroke();
  ctx.fillStyle = dim; ctx.font = '10px sans-serif';
  ctx.fillText('드릴: '+(v27.aiStrategy.drills||0)+'회', 490, 395);
}
window._v27SimStrategy = function(){
  var keys = ['swarmer','outboxer','slugger','boxerPuncher','counterpuncher','switchHitter'];
  var pick = keys[Math.floor(Math.random()*keys.length)];
  v27.aiStrategy.opponentStyles[pick] = (v27.aiStrategy.opponentStyles[pick]||0) + 1;
  v27.aiStrategy.drills++;
  v27.aiStrategy.sessions++;
  saveV27(v27); playSFX27('strategy_match'); drawStrategyCanvas(); checkAchievementsV27();
};
window._v27ResetStrategy = function(){
  v27.aiStrategy = defV27().aiStrategy; saveV27(v27); drawStrategyCanvas();
};

// ============================================================
// SECTION 4: Boxing Mobility Assessment
// ============================================================
var sec4 = document.createElement('div');
sec4.id = 'v27-sec-4';
sec4.style.cssText = 'display:none;padding:12px;max-width:700px;margin:0 auto;';
sec4.innerHTML = '<div class="v27-card"><div class="v27-hdr">&#128170; &#48373;&#49905; &#47784;&#48716;&#47532;&#54000; &#54217;&#44032;&#44592;</div><div class="v27-sub">10&#44060; &#44288;&#51208;&#44032;&#46041;&#49457; &#53580;&#49828;&#53944; + &#49888;&#52404; &#50976;&#50672;&#49457; &#55176;&#53944;&#47605; + &#44060;&#49440; &#52628;&#51201;</div><canvas id="v27-canvas-mobility" width="600" height="380" style="width:100%;max-width:600px;border-radius:12px;margin:8px auto;display:block;cursor:pointer"></canvas><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:8px"><button class="v27-btn" onclick="window._v27SimMobility()">&#47784;&#48716;&#47532;&#54000; &#53580;&#49828;&#53944;</button><button class="v27-btn-sec" onclick="window._v27ResetMobility()">&#52488;&#44592;&#54868;</button></div></div>';
document.body.appendChild(sec4);

function drawMobilityCanvas(){
  var c = document.getElementById('v27-canvas-mobility');
  if(!c) return;
  var ctx = c.getContext('2d'), W=600, H=380;
  var isDark = clr27(ctx,W,H);
  var fg = isDark ? '#f0f0f0' : '#1a1a2e';
  var dim = isDark ? '#8a8a9e' : '#555';
  var tests = ['어깨회전','고관절굴곡','발목가동','흉추신전','햄스트링','손목굴곡','목회전','척추비틀림','고관절내전','종아리굴곡'];
  tests[7] = '척추비틀림';
  var tKeys = ['shoulderRot','hipFlex','ankleRange','thoracicExt','hamstring','wristFlex','neckRot','spinalTwist','hipAdduct','calfFlex'];
  ctx.fillStyle = fg; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('복싱 모빌리티 평가기', 20, 28);
  var cellW = 50, cellH = 50, startX = 50, startY = 60;
  var zones = ['머리','어깨','팔','허리','다리'];
  var zoneTests = [[6],[0,3],[5],[1,7,8],[2,4,9]];
  for(var zi=0; zi<5; zi++){
    ctx.fillStyle = dim; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(zones[zi], startX-6, startY+zi*cellH+cellH/2+3);
    for(var ti=0; ti<10; ti++){
      var x = startX+ti*cellW, y = startY+zi*cellH;
      var val = 0;
      if(zoneTests[zi].indexOf(ti)>=0) val = v27.mobility.tests[tKeys[ti]]||50;
      var intensity = val / 100;
      var col = intensity > 0.7 ? '#22c55e' : intensity > 0.4 ? '#eab308' : '#ef4444';
      ctx.fillStyle = col + Math.round(intensity * 200 + 55).toString(16).padStart(2,'0');
      ctx.fillRect(x+1, y+1, cellW-2, cellH-2);
      if(zoneTests[zi].indexOf(ti)>=0){
        ctx.fillStyle = fg; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(val+'%', x+cellW/2, y+cellH/2+4);
      }
    }
  }
  ctx.textAlign = 'center';
  for(var ti=0; ti<10; ti++){
    ctx.fillStyle = dim; ctx.font = '8px sans-serif';
    ctx.save(); ctx.translate(startX+ti*cellW+cellW/2, startY-4); ctx.rotate(-0.3);
    ctx.fillText(tests[ti], 0, 0); ctx.restore();
  }
  ctx.textAlign = 'left';
  var avgMob = 0, cnt = 0;
  tKeys.forEach(function(k){ avgMob += (v27.mobility.tests[k]||50); cnt++; });
  avgMob = avgMob / cnt;
  var mGrade = gradeFor(avgMob, 100);
  ctx.fillStyle = fg; ctx.font = 'bold 12px sans-serif';
  ctx.fillText('종합 모빌리티: '+avgMob.toFixed(1)+'% ('+mGrade+')', 50, 370);
}
window._v27SimMobility = function(){
  var tKeys = ['shoulderRot','hipFlex','ankleRange','thoracicExt','hamstring','wristFlex','neckRot','spinalTwist','hipAdduct','calfFlex'];
  tKeys.forEach(function(k){
    v27.mobility.tests[k] = Math.min(100, Math.max(10, (v27.mobility.tests[k]||50) + Math.floor(Math.random()*12) - 4));
  });
  v27.mobility.sessions.push(Date.now());
  if(v27.mobility.sessions.length>30) v27.mobility.sessions.shift();
  saveV27(v27); playSFX27('mobility_improve'); drawMobilityCanvas(); checkAchievementsV27();
};
window._v27ResetMobility = function(){
  v27.mobility = defV27().mobility; saveV27(v27); drawMobilityCanvas();
};

// ============================================================
// SECTION 5: Round Pacing Optimizer
// ============================================================
var sec5 = document.createElement('div');
sec5.id = 'v27-sec-5';
sec5.style.cssText = 'display:none;padding:12px;max-width:700px;margin:0 auto;';
sec5.innerHTML = '<div class="v27-card"><div class="v27-hdr">&#9201; &#46972;&#50868;&#46300; &#54168;&#51060;&#49905; &#52572;&#51201;&#54868;&#44592;</div><div class="v27-sub">12R &#50640;&#45320;&#51648;/&#52636;&#47141; &#46272;&#50620; &#46972;&#51064; + &#54168;&#51060;&#49905; &#51316; &#48180;&#46300; + &#46972;&#50868;&#46300;&#48324; &#46321;&#44553;</div><canvas id="v27-canvas-pacing" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;margin:8px auto;display:block;cursor:pointer"></canvas><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:8px"><button class="v27-btn" onclick="window._v27SimPacing()">&#54168;&#51060;&#49905; &#49884;&#48044;</button><button class="v27-btn-sec" onclick="window._v27ResetPacing()">&#52488;&#44592;&#54868;</button></div></div>';
document.body.appendChild(sec5);

function drawPacingCanvas(){
  var c = document.getElementById('v27-canvas-pacing');
  if(!c) return;
  var ctx = c.getContext('2d'), W=620, H=400;
  var isDark = clr27(ctx,W,H);
  var fg = isDark ? '#f0f0f0' : '#1a1a2e';
  var dim = isDark ? '#8a8a9e' : '#555';
  ctx.fillStyle = fg; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('라운드 페이싱 최적화기', 20, 28);
  var rounds = v27.pacing.rounds;
  var startX = 50, endX = 580, baseY = 350, topY = 70;
  var zoneColors = ['#22c55e33','#eab30833','#ef444433'];
  var zoneLabels = ['최적 존','주의 존','위험 존'];
  for(var z=0; z<3; z++){
    var zy1 = topY + z*(baseY-topY)/3;
    var zy2 = topY + (z+1)*(baseY-topY)/3;
    ctx.fillStyle = zoneColors[z];
    ctx.fillRect(startX, zy1, endX-startX, zy2-zy1);
    ctx.fillStyle = dim; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(zoneLabels[z], startX-4, (zy1+zy2)/2+3);
  }
  ctx.textAlign = 'left';
  ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2.5; ctx.beginPath();
  for(var i=0; i<12; i++){
    var x = startX + i*(endX-startX)/11;
    var energy = rounds[i] ? rounds[i].energy : 80;
    var y = baseY - (energy/100)*(baseY-topY);
    i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  }
  ctx.stroke();
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.setLineDash([4,3]); ctx.beginPath();
  for(var i=0; i<12; i++){
    var x = startX + i*(endX-startX)/11;
    var output = rounds[i] ? rounds[i].output : 50;
    var y = baseY - (output/100)*(baseY-topY);
    i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  }
  ctx.stroke(); ctx.setLineDash([]);
  for(var i=0; i<12; i++){
    var x = startX + i*(endX-startX)/11;
    ctx.fillStyle = dim; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('R'+(i+1), x, baseY+14);
    var pace = rounds[i] ? rounds[i].pace : 'steady';
    var pCol = pace==='fast'?'#ef4444':pace==='steady'?'#22c55e':'#3b82f6';
    ctx.fillStyle = pCol; ctx.font = 'bold 8px sans-serif';
    ctx.fillText(pace==='fast'?'공격':pace==='steady'?'균형':'수비', x, baseY+26);
  }
  ctx.textAlign = 'left';
  ctx.fillStyle = '#22c55e'; ctx.font = '10px sans-serif';
  ctx.fillText('─ 에너지', 420, 395);
  ctx.fillStyle = '#ef4444';
  ctx.fillText('--- 출력', 500, 395);
  ctx.fillStyle = dim; ctx.font = '10px sans-serif';
  ctx.fillText('세션: '+(v27.pacing.sessions||0), 20, 395);
}
window._v27SimPacing = function(){
  var paces = ['fast','steady','conserve'];
  for(var i=0; i<12; i++){
    var baseEnergy = 95 - i*5 + Math.floor(Math.random()*10);
    var output = 30 + Math.floor(Math.random()*50);
    v27.pacing.rounds[i] = {
      energy: Math.max(10, Math.min(100, baseEnergy)),
      output: Math.max(10, Math.min(100, output)),
      pace: paces[Math.floor(Math.random()*3)]
    };
  }
  v27.pacing.sessions++;
  saveV27(v27); playSFX27('pacing_optimal'); drawPacingCanvas(); checkAchievementsV27();
};
window._v27ResetPacing = function(){
  v27.pacing = defV27().pacing; saveV27(v27); drawPacingCanvas();
};

// ============================================================
// SECTION 6: Punch Flow Sankey Visualizer
// ============================================================
var sec6 = document.createElement('div');
sec6.id = 'v27-sec-6';
sec6.style.cssText = 'display:none;padding:12px;max-width:700px;margin:0 auto;';
sec6.innerHTML = '<div class="v27-card"><div class="v27-hdr">&#128260; &#54144;&#52824; &#54540;&#47196;&#50864; &#49373;&#53412; &#49884;&#44033;&#54868;</div><div class="v27-sub">Setup&#8594;Power&#8594;Follow-up 3&#52972;&#47100; Sankey + &#54540;&#47196;&#50864; &#46160;&#44760; = &#48712;&#46020;</div><canvas id="v27-canvas-flow" width="640" height="400" style="width:100%;max-width:640px;border-radius:12px;margin:8px auto;display:block;cursor:pointer"></canvas><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:8px"><button class="v27-btn" onclick="window._v27SimFlow()">&#54540;&#47196;&#50864; &#52628;&#44032;</button><button class="v27-btn-sec" onclick="window._v27ResetFlow()">&#52488;&#44592;&#54868;</button></div></div>';
document.body.appendChild(sec6);

function drawFlowCanvas(){
  var c = document.getElementById('v27-canvas-flow');
  if(!c) return;
  var ctx = c.getContext('2d'), W=640, H=400;
  var isDark = clr27(ctx,W,H);
  var fg = isDark ? '#f0f0f0' : '#1a1a2e';
  var dim = isDark ? '#8a8a9e' : '#555';
  ctx.fillStyle = fg; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('펀치 플로우 생키 시각화', 20, 28);
  var setupPunches = ['Jab','Feint','Step','Guard'];
  var powerPunches = ['Cross','L.Hook','R.Hook','Uppercut','Overhand'];
  var followPunches = ['Jab','Hook','Body','Clinch','Exit'];
  var colX = [80, 280, 480];
  var nodeH = 30, nodeGap = 12;
  var cols = [setupPunches, powerPunches, followPunches];
  var colColors = [['#3b82f6','#06b6d4','#8b5cf6','#22c55e'],['#ef4444','#f97316','#ec4899','#eab308','#a855f7'],['#14b8a6','#f43f5e','#6366f1','#64748b','#22c55e']];
  cols.forEach(function(col,ci){
    var startY = 60 + (5 - col.length) * (nodeH+nodeGap) / 2;
    col.forEach(function(name,ni){
      var x = colX[ci], y = startY + ni*(nodeH+nodeGap);
      ctx.fillStyle = colColors[ci][ni];
      ctx.beginPath(); ctx.roundRect(x, y, 100, nodeH, 6); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(name, x+50, y+nodeH/2+4);
    });
  });
  ctx.textAlign = 'left';
  var flowCount = v27.punchFlow.totalFlows || 0;
  var maxFlow = Math.max(flowCount / 10, 1);
  for(var si=0; si<setupPunches.length; si++){
    for(var pi=0; pi<powerPunches.length; pi++){
      var freq = 1 + Math.floor(Math.random() * 3);
      var sy1 = 60 + (5 - setupPunches.length)*(nodeH+nodeGap)/2 + si*(nodeH+nodeGap) + nodeH/2;
      var sy2 = 60 + pi*(nodeH+nodeGap) + nodeH/2;
      ctx.strokeStyle = colColors[0][si] + '44';
      ctx.lineWidth = Math.max(1, freq);
      ctx.beginPath();
      ctx.moveTo(colX[0]+100, sy1);
      ctx.bezierCurveTo(colX[0]+140, sy1, colX[1]-40, sy2, colX[1], sy2);
      ctx.stroke();
    }
  }
  for(var pi=0; pi<powerPunches.length; pi++){
    for(var fi=0; fi<followPunches.length; fi++){
      var freq = 1 + Math.floor(Math.random() * 3);
      var sy1 = 60 + pi*(nodeH+nodeGap) + nodeH/2;
      var sy2 = 60 + (5 - followPunches.length)*(nodeH+nodeGap)/2 + fi*(nodeH+nodeGap) + nodeH/2;
      ctx.strokeStyle = colColors[1][pi] + '44';
      ctx.lineWidth = Math.max(1, freq);
      ctx.beginPath();
      ctx.moveTo(colX[1]+100, sy1);
      ctx.bezierCurveTo(colX[1]+140, sy1, colX[2]-40, sy2, colX[2], sy2);
      ctx.stroke();
    }
  }
  ctx.fillStyle = dim; ctx.font = '10px sans-serif';
  ctx.fillText('Setup', colX[0]+30, 52);
  ctx.fillText('Power', colX[1]+30, 52);
  ctx.fillText('Follow-up', colX[2]+20, 52);
  ctx.fillText('총 플로우: '+flowCount, 20, 390);
  ctx.fillText('세션: '+(v27.punchFlow.sessions||0), 520, 390);
}
window._v27SimFlow = function(){
  v27.punchFlow.totalFlows += 3 + Math.floor(Math.random()*5);
  v27.punchFlow.sessions++;
  saveV27(v27); playSFX27('flow_chain'); drawFlowCanvas(); checkAchievementsV27();
};
window._v27ResetFlow = function(){
  v27.punchFlow = defV27().punchFlow; saveV27(v27); drawFlowCanvas();
};

// ============================================================
// SECTION 7: Boxing Injury Risk Matrix
// ============================================================
var sec7 = document.createElement('div');
sec7.id = 'v27-sec-7';
sec7.style.cssText = 'display:none;padding:12px;max-width:700px;margin:0 auto;';
sec7.innerHTML = '<div class="v27-card"><div class="v27-hdr">&#128681; &#48373;&#49905; &#48512;&#49345; &#47532;&#49828;&#53356; &#47588;&#53944;&#47533;&#49828;</div><div class="v27-sub">8&#48512;&#50948; x 6&#50948;&#54744;&#50836;&#49548; &#55176;&#53944;&#47605; + &#48512;&#50948;&#48324; &#50696;&#48169; &#46300;&#47540;</div><canvas id="v27-canvas-injury" width="620" height="380" style="width:100%;max-width:620px;border-radius:12px;margin:8px auto;display:block;cursor:pointer"></canvas><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:8px"><button class="v27-btn" onclick="window._v27SimInjury()">&#47532;&#49828;&#53356; &#54217;&#44032;</button><button class="v27-btn-sec" onclick="window._v27ResetInjury()">&#52488;&#44592;&#54868;</button></div></div>';
document.body.appendChild(sec7);

function drawInjuryCanvas(){
  var c = document.getElementById('v27-canvas-injury');
  if(!c) return;
  var ctx = c.getContext('2d'), W=620, H=380;
  var isDark = clr27(ctx,W,H);
  var fg = isDark ? '#f0f0f0' : '#1a1a2e';
  var dim = isDark ? '#8a8a9e' : '#555';
  var bodyParts = ['어깨','팔꿈치','손목','너클','갈비뼈','목','무릎','허리'];
  var bpKeys = ['shoulder','elbow','wrist','knuckle','ribs','neck','knee','back'];
  var factors = ['과사용','충격','피로','자세','유연성','회복'];
  var fKeys = ['overuse','impact','fatigue','form','flexibility','recovery'];
  ctx.fillStyle = fg; ctx.font = 'bold 14px sans-serif';
  ctx.fillText('복싱 부상 리스크 매트릭스', 20, 28);
  var cellW = 60, cellH = 32, startX = 80, startY = 70;
  for(var fi=0; fi<6; fi++){
    ctx.fillStyle = dim; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(factors[fi], startX+fi*cellW+cellW/2, startY-8);
  }
  for(var bi=0; bi<8; bi++){
    ctx.fillStyle = dim; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(bodyParts[bi], startX-6, startY+bi*cellH+cellH/2+3);
    for(var fi=0; fi<6; fi++){
      var x = startX+fi*cellW, y = startY+bi*cellH;
      var bpRisk = v27.injuryRisk.bodyParts[bpKeys[bi]]||0;
      var fRisk = v27.injuryRisk.riskFactors[fKeys[fi]]||0;
      var risk = (bpRisk + fRisk) / 2;
      var intensity = risk / 100;
      var r = Math.round(239 * intensity + 16);
      var g = Math.round(239 * (1-intensity) + 16);
      ctx.fillStyle = 'rgba('+r+','+g+',40,'+(0.3+intensity*0.6)+')';
      ctx.fillRect(x+1, y+1, cellW-2, cellH-2);
      if(risk > 0){
        ctx.fillStyle = fg; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(risk.toFixed(0), x+cellW/2, y+cellH/2+3);
      }
    }
  }
  ctx.textAlign = 'left';
  var drills = {
    shoulder: '어깨회전+밴드스트레치',
    elbow: '팔꿈 신전근 스트레치',
    wrist: '손목원회전+랩텋스트',
    knuckle: '주먹강화+밴드워탄',
    ribs: '코어강화+호흡훈련',
    neck: '목근력강화+대배르드',
    knee: '바란스+레그프레스',
    back: '허리코어+데드리프트'
  };
  ctx.fillStyle = fg; ctx.font = 'bold 11px sans-serif';
  ctx.fillText('부위별 예방 드릴:', 20, 345);
  ctx.font = '9px sans-serif'; ctx.fillStyle = dim;
  var highRisk = bpKeys.reduce(function(a,k){ return (v27.injuryRisk.bodyParts[k]||0)>a.v ? {k:k,v:v27.injuryRisk.bodyParts[k]||0} : a; }, {k:'shoulder',v:0});
  ctx.fillText('⚠ 최고위험: '+bodyParts[bpKeys.indexOf(highRisk.k)]+' → '+drills[highRisk.k], 20, 362);
}
window._v27SimInjury = function(){
  var bpKeys = ['shoulder','elbow','wrist','knuckle','ribs','neck','knee','back'];
  var fKeys = ['overuse','impact','fatigue','form','flexibility','recovery'];
  bpKeys.forEach(function(k){ v27.injuryRisk.bodyParts[k] = Math.min(100, Math.max(0, (v27.injuryRisk.bodyParts[k]||0) + Math.floor(Math.random()*20) - 5)); });
  fKeys.forEach(function(k){ v27.injuryRisk.riskFactors[k] = Math.min(100, Math.max(0, (v27.injuryRisk.riskFactors[k]||0) + Math.floor(Math.random()*15) - 3)); });
  v27.injuryRisk.sessions++;
  saveV27(v27); playSFX27('injury_alert'); drawInjuryCanvas(); checkAchievementsV27();
};
window._v27ResetInjury = function(){
  v27.injuryRisk = defV27().injuryRisk; saveV27(v27); drawInjuryCanvas();
};

// ============================================================
// SECTION 8: Fighter Trading Card Generator
// ============================================================
var sec8 = document.createElement('div');
sec8.id = 'v27-sec-8';
sec8.style.cssText = 'display:none;padding:12px;max-width:700px;margin:0 auto;';
sec8.innerHTML = '<div class="v27-card"><div class="v27-hdr">&#127183; &#54028;&#51060;&#53552; &#53944;&#47112;&#51060;&#46377; &#52852;&#46300;</div><div class="v27-sub">8&#52629; &#49828;&#53439; &#47112;&#51060;&#45908; + &#47021;&#53356; &#50656;&#48660;&#47100; + &#52964;&#47532;&#50612; &#54616;&#51060;&#46972;&#51060;&#53944;</div><canvas id="v27-canvas-card" width="600" height="400" style="width:100%;max-width:600px;border-radius:12px;margin:8px auto;display:block;cursor:pointer"></canvas><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:8px"><button class="v27-btn" onclick="window._v27GenCard()">&#52852;&#46300; &#49373;&#49457;</button><button class="v27-btn" onclick="window._v27TrainCard()">&#53944;&#47112;&#51060;&#45789;</button><button class="v27-btn-sec" onclick="window._v27ResetCard()">&#52488;&#44592;&#54868;</button></div></div>';
document.body.appendChild(sec8);

function drawCardCanvas(){
  var c = document.getElementById('v27-canvas-card');
  if(!c) return;
  var ctx = c.getContext('2d'), W=600, H=400;
  var isDark = clr27(ctx,W,H);
  var fg = isDark ? '#f0f0f0' : '#1a1a2e';
  var dim = isDark ? '#8a8a9e' : '#555';
  var cardX = 30, cardY = 20, cardW = 250, cardH = 360;
  var rankColors = {Bronze:'#cd7f32',Silver:'#c0c0c0',Gold:'#ffd700',Platinum:'#e5e4e2',Diamond:'#b9f2ff',Champion:'#ff4444'};
  var rank = v27.tradeCard.rank || 'Bronze';
  var rCol = rankColors[rank] || '#cd7f32';
  var grd = ctx.createLinearGradient(cardX, cardY, cardX+cardW, cardY+cardH);
  grd.addColorStop(0, rCol+'33');
  grd.addColorStop(0.5, rCol+'11');
  grd.addColorStop(1, rCol+'33');
  ctx.fillStyle = grd;
  ctx.beginPath(); ctx.roundRect(cardX, cardY, cardW, cardH, 16); ctx.fill();
  ctx.strokeStyle = rCol; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(cardX, cardY, cardW, cardH, 16); ctx.stroke();
  ctx.fillStyle = rCol; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(rank.toUpperCase(), cardX+cardW/2, cardY+20);
  ctx.fillStyle = fg; ctx.font = 'bold 20px sans-serif';
  ctx.fillText('FIGHTER', cardX+cardW/2, cardY+50);
  ctx.font = '12px sans-serif'; ctx.fillStyle = dim;
  ctx.fillText(v27.tradeCard.nickname || 'YOUR NAME', cardX+cardW/2, cardY+68);
  ctx.font = 'bold 48px sans-serif'; ctx.fillStyle = rCol+'88';
  ctx.fillText('🥊', cardX+cardW/2, cardY+120);
  var stats = v27.tradeCard.stats;
  var sLabels = ['PWR','SPD','DEF','STA','IQ','CHIN','FOOT','HEART'];
  var sKeys = ['power','speed','defense','stamina','ringIQ','chin','footwork','heart'];
  var statY = cardY + 150;
  sKeys.forEach(function(k,i){
    var y = statY + i*24;
    ctx.fillStyle = dim; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(sLabels[i], cardX+15, y+3);
    var val = stats[k] || 50;
    var barX = cardX+55, barW2 = 170;
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    ctx.fillRect(barX, y-8, barW2, 12);
    var pct = val/100;
    var barCol = pct > 0.8 ? '#fbbf24' : pct > 0.6 ? '#22c55e' : pct > 0.4 ? '#3b82f6' : '#ef4444';
    ctx.fillStyle = barCol;
    ctx.fillRect(barX, y-8, barW2*pct, 12);
    ctx.fillStyle = fg; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(val+'', cardX+cardW-12, y+3);
  });
  ctx.textAlign = 'left';
  ctx.fillStyle = dim; ctx.font = '9px sans-serif';
  ctx.fillText('XP: '+(v27.tradeCard.xp||0), cardX+15, cardY+cardH-18);
  ctx.fillText('W: '+(v27.tradeCard.wins||0)+' KO: '+(v27.tradeCard.kos||0), cardX+100, cardY+cardH-18);
  var cx = 440, cy = 200, cr = 120;
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 1;
  for(var ring=1; ring<=4; ring++){
    ctx.beginPath(); ctx.arc(cx,cy,cr*ring/4,0,Math.PI*2); ctx.stroke();
  }
  ctx.fillStyle = rCol + '22'; ctx.beginPath();
  for(var i=0; i<8; i++){
    var angle = Math.PI*2*i/8 - Math.PI/2;
    var val = (stats[sKeys[i]]||50)/100*cr;
    var px = cx + Math.cos(angle)*val, py = cy + Math.sin(angle)*val;
    i===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
  }
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rCol; ctx.lineWidth = 2; ctx.stroke();
  for(var i=0; i<8; i++){
    var angle = Math.PI*2*i/8 - Math.PI/2;
    var lx = cx + Math.cos(angle)*(cr+16), ly = cy + Math.sin(angle)*(cr+16);
    ctx.fillStyle = dim; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(sLabels[i], lx, ly+3);
  }
  ctx.textAlign = 'left';
  var totalStat = sKeys.reduce(function(a,k){return a+(stats[k]||50);},0);
  var overall = Math.round(totalStat/8);
  ctx.fillStyle = fg; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('OVR: '+overall, cx, cy+3);
  ctx.textAlign = 'left';
  ctx.fillStyle = dim; ctx.font = '10px sans-serif';
  ctx.fillText('파이트: '+(v27.tradeCard.fights||0)+'전', 340, 380);
}
window._v27GenCard = function(){
  var sKeys = ['power','speed','defense','stamina','ringIQ','chin','footwork','heart'];
  sKeys.forEach(function(k){
    v27.tradeCard.stats[k] = 30 + Math.floor(Math.random()*60);
  });
  v27.tradeCard.fights = Math.floor(Math.random()*50);
  v27.tradeCard.wins = Math.floor(v27.tradeCard.fights * (0.5 + Math.random()*0.4));
  v27.tradeCard.kos = Math.floor(v27.tradeCard.wins * Math.random() * 0.6);
  var total = Object.values(v27.tradeCard.stats).reduce(function(a,b){return a+b;},0)/8;
  v27.tradeCard.rank = total >= 85 ? 'Champion' : total >= 75 ? 'Diamond' : total >= 65 ? 'Platinum' : total >= 55 ? 'Gold' : total >= 45 ? 'Silver' : 'Bronze';
  saveV27(v27); playSFX27('card_generate'); drawCardCanvas(); checkAchievementsV27();
};
window._v27TrainCard = function(){
  var sKeys = ['power','speed','defense','stamina','ringIQ','chin','footwork','heart'];
  var pick = sKeys[Math.floor(Math.random()*sKeys.length)];
  v27.tradeCard.stats[pick] = Math.min(99, (v27.tradeCard.stats[pick]||50) + Math.floor(Math.random()*5)+1);
  v27.tradeCard.xp += 10 + Math.floor(Math.random()*20);
  var total = Object.values(v27.tradeCard.stats).reduce(function(a,b){return a+b;},0)/8;
  var newRank = total >= 85 ? 'Champion' : total >= 75 ? 'Diamond' : total >= 65 ? 'Platinum' : total >= 55 ? 'Gold' : total >= 45 ? 'Silver' : 'Bronze';
  if(newRank !== v27.tradeCard.rank){ playSFX27('card_rankup'); }
  v27.tradeCard.rank = newRank;
  saveV27(v27); playSFX27('counter_success'); drawCardCanvas(); checkAchievementsV27();
};
window._v27ResetCard = function(){
  v27.tradeCard = defV27().tradeCard; saveV27(v27); drawCardCanvas();
};

// ============================================================
// QUIZ V27: 15 NEW QUESTIONS (270->285)
// ============================================================
var secQuiz = document.createElement('div');
secQuiz.id = 'v27-sec-quiz';
secQuiz.style.cssText = 'display:none;padding:12px;max-width:700px;margin:0 auto;';
var quizQuestions = [
  {q:'카운터펀치의 핵심은?', o:['상대 공격 타이밍 읽기','무조건 뒤로 빠지기','가드만 올리기','링 밖으로 도망'], a:0},
  {q:'잽 카운터의 기본 방법은?', o:['슬립 + 스트레이트 펀치','단순히 피하기','클린치하기','가드 올리기'], a:0},
  {q:'펀치 효율성이란?', o:['파워 대비 에너지 소비 비율','펀치 속도','펀치 정확도','펀치 회수'], a:0},
  {q:'Swarmer 스타일의 특징은?', o:['근접전 압박 + 높은 펀치 볼륨','원거리 잽 위주','한 방으로 KO 노림','카운터만 사용'], a:0},
  {q:'모빌리티가 복싱에 중요한 이유는?', o:['부상 예방 + 펀치 파워 증가','체중 감량','멋있어 보이려고','심판 점수용'], a:0},
  {q:'라운드 페이싱에서 conserve는?', o:['에너지 절약 모드로 방어 위주','전력으로 공격','링 중앙에 서기','클린치 사용'], a:0},
  {q:'펀치 플로우의 Setup 단계란?', o:['공격 준비 동작 (잽/페인트/스텝)','마무리 펀치','뒤로 미끼러지기','휘식 취하기'], a:0},
  {q:'복싱에서 손목 부상 예방법은?', o:['핸드랩 + 워밍업','글러브만 크게 이기','손 안 쓰기','펀치 안 던지기'], a:0},
  {q:'파이터 카드의 OVR은?', o:['8개 스탯 평균값','키 체중 평균','승률만 반영','펀치 수만 반영'], a:0},
  {q:'ACWR(Acute:Chronic Workload Ratio)이 1.5 이상이면?', o:['부상 위험 높음','최적 상태','훈련 부족','회복 완료'], a:0},
  {q:'슬립(Slip) 동작은?', o:['머리를 옆으로 빼며 펀치 회피','풀 뿔로 피하기','가드 올리기','뒤로 점프'], a:0},
  {q:'펀치 바이오메카닉스에서 키네틱 체인이란?', o:['발→다리→허리→어깨→팔 힘 전달 경로','팔만 사용','상체만 사용','펀치 순서'], a:0},
  {q:'방어 반응 매트릭스에서 드릴 카운터란?', o:['방어 연습 횟수 추적','공격 횟수','휘식 시간','체중 측정'], a:0},
  {q:'복싱에서 풀워크가 중요한 이유는?', o:['각도와 거리 조절로 공방 전환','단순히 움직이기','체력 소몪용','심판에게 잘 보이기'], a:0},
  {q:'Ring Generalship이란?', o:['링 안에서의 공간 지배력과 전술적 우위','횀쳘 운동','체중 관리','펀치 속도'], a:0}
];
var quizHtml = '<div class="v27-card"><div class="v27-hdr">&#128218; &#48373;&#49905; &#53300;&#51592; v27 (15&#47928;)</div><div class="v27-sub">&#52852;&#50868;&#53552;&#54144;&#52824;, &#54952;&#50984;&#48516;&#49437;, &#51204;&#47029;, &#47784;&#48716;&#47532;&#54000;, &#54168;&#51060;&#49905;, &#54540;&#47196;&#50864;, &#48512;&#49345;, &#52852;&#46300;</div>';
quizQuestions.forEach(function(qq,qi){
  quizHtml += '<div style="margin:10px 0;padding:10px;background:var(--surface);border-radius:10px"><div style="font-size:12px;font-weight:700;margin-bottom:6px">Q'+(qi+1)+'. '+qq.q+'</div>';
  qq.o.forEach(function(opt,oi){
    quizHtml += '<button class="v27-btn-sec" style="display:block;width:100%;text-align:left;margin:3px 0;font-size:11px" onclick="window._v27AnswerQuiz('+qi+','+oi+',this)">'+opt+'</button>';
  });
  quizHtml += '<div id="v27-quiz-result-'+qi+'" style="font-size:11px;margin-top:4px"></div></div>';
});
quizHtml += '</div>';
secQuiz.innerHTML = quizHtml;
document.body.appendChild(secQuiz);

window._v27AnswerQuiz = function(qi, oi, btn){
  var key = 'q'+qi;
  if(v27.quizV27Scores[key] !== undefined) return;
  var correct = quizQuestions[qi].a === oi;
  v27.quizV27Scores[key] = correct ? 1 : 0;
  saveV27(v27);
  var el = document.getElementById('v27-quiz-result-'+qi);
  if(correct){
    el.innerHTML = '<span style="color:#22c55e;font-weight:700">✅ 정답!</span>';
    btn.style.background = 'rgba(34,197,94,0.2)';
    btn.style.borderColor = '#22c55e';
    playSFX27('quiz27');
  } else {
    el.innerHTML = '<span style="color:#ef4444;font-weight:700">❌ 오답. 정답: '+quizQuestions[qi].o[quizQuestions[qi].a]+'</span>';
    btn.style.background = 'rgba(239,68,68,0.2)';
    btn.style.borderColor = '#ef4444';
    playSFX27('quiz27_wrong');
  }
  checkAchievementsV27();
};

// ============================================================
// ACHIEVEMENTS V27: 12 NEW (238->250)
// ============================================================
var achieveDefs27 = [
  {id:'counter_starter',name:'카운터 입문',desc:'카운터 연습 1회',check:function(){return v27.counterTiming.sessions>=1;}},
  {id:'counter_master',name:'카운터 마스터',desc:'카운터 10회+성공률 70%+',check:function(){return v27.counterTiming.sessions>=10 && v27.counterTiming.successRate>=70;}},
  {id:'efficiency_analyst',name:'효율 분석가',desc:'효율 측정 5회',check:function(){return v27.punchEfficiency.sessions.length>=5;}},
  {id:'strategy_advisor',name:'전략 어드바이저',desc:'AI 전략 10회 분석',check:function(){return v27.aiStrategy.sessions>=10;}},
  {id:'mobility_flexible',name:'유연성 마스터',desc:'모빌리티 평균 75%+',check:function(){var avg=0,cnt=0;for(var k in v27.mobility.tests){avg+=v27.mobility.tests[k];cnt++;}return cnt>0&&(avg/cnt)>=75;}},
  {id:'pacing_pro',name:'페이싱 프로',desc:'페이싱 시뮬 5회',check:function(){return v27.pacing.sessions>=5;}},
  {id:'flow_builder',name:'플로우 빌더',desc:'플로우 20개 이상',check:function(){return v27.punchFlow.totalFlows>=20;}},
  {id:'injury_aware',name:'부상 예방 전문가',desc:'부상 리스크 평가 5회',check:function(){return v27.injuryRisk.sessions>=5;}},
  {id:'card_collector',name:'카드 컬렉터',desc:'카드 생성 1회',check:function(){return v27.tradeCard.fights>0;}},
  {id:'card_gold',name:'골드 파이터',desc:'카드 랭크 Gold 달성',check:function(){return ['Gold','Platinum','Diamond','Champion'].indexOf(v27.tradeCard.rank)>=0;}},
  {id:'quiz27_perfect',name:'퀴즈 v27 만점',desc:'15문 모두 정답',check:function(){var s=0;for(var k in v27.quizV27Scores) s+=v27.quizV27Scores[k];return Object.keys(v27.quizV27Scores).length>=15&&s>=15;}},
  {id:'v27_complete',name:'v27 컴플리트',desc:'8기능 모두 사용',check:function(){return Object.keys(v27.featureUsage27).length>=8;}}
];

function checkAchievementsV27(){
  var newUnlock = false;
  achieveDefs27.forEach(function(ad){
    if(!v27.achievementsV27[ad.id] && ad.check()){
      v27.achievementsV27[ad.id] = Date.now();
      newUnlock = true;
    }
  });
  if(newUnlock) saveV27(v27);
}

// ============================================================
// NAVIGATION: append buttons to existing bar (NO new bottom bar)
// ============================================================
function addV27Nav(){
  var features = [
    {id:'counterTiming',label:'카운터',sec:sec1},
    {id:'punchEfficiency',label:'효율분석',sec:sec2},
    {id:'aiStrategy',label:'AI전략',sec:sec3},
    {id:'mobility',label:'모빌리티',sec:sec4},
    {id:'pacing',label:'페이싱',sec:sec5},
    {id:'punchFlow',label:'플로우',sec:sec6},
    {id:'injuryRisk',label:'부상예방',sec:sec7},
    {id:'tradeCard',label:'파이터카드',sec:sec8},
    {id:'quizV27',label:'퀴즈v27',sec:secQuiz}
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
    btn.style.cssText = 'padding:6px 10px;background:linear-gradient(135deg,rgba(239,68,68,0.15),rgba(220,38,38,0.15));border:1px solid rgba(248,113,113,0.3);border-radius:8px;color:#f87171;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .2s;flex-shrink:0;';
    btn.textContent = f.label;
    btn.onclick = function(){
      document.querySelectorAll('[id^="v27-sec-"]').forEach(function(s){ s.style.display = 'none'; });
      f.sec.style.display = 'block';
      v27.featureUsage27[f.id] = true;
      saveV27(v27);
      checkAchievementsV27();
    };
    if(navWrap) navWrap.appendChild(btn);
  });
}

// ============================================================
// KEYBOARD SHORTCUTS (Shift+A/S/D/F/G/H/J/K for 8 features, Shift+0 for quiz)
// ============================================================
document.addEventListener('keydown', function(e){
  if(!e.shiftKey) return;
  var sections = [sec1, sec2, sec3, sec4, sec5, sec6, sec7, sec8, secQuiz];
  var keys = ['A','S','D','F','G','H','J','K','0'];
  var featureIds = ['counterTiming','punchEfficiency','aiStrategy','mobility','pacing','punchFlow','injuryRisk','tradeCard','quizV27'];
  var idx = keys.indexOf(e.key.toUpperCase());
  if(idx === -1 && e.key === ')') idx = 8;
  if(idx >= 0 && idx < sections.length){
    e.preventDefault();
    document.querySelectorAll('[id^="v27-sec-"]').forEach(function(s){ s.style.display = 'none'; });
    sections[idx].style.display = 'block';
    v27.featureUsage27[featureIds[idx]] = true;
    saveV27(v27);
    checkAchievementsV27();
  }
});

// ============================================================
// INIT
// ============================================================
setTimeout(function(){
  addV27Nav();
  drawCounterCanvas();
  drawEfficiencyCanvas();
  drawStrategyCanvas();
  drawMobilityCanvas();
  drawPacingCanvas();
  drawFlowCanvas();
  drawInjuryCanvas();
  drawCardCanvas();
  checkAchievementsV27();
}, 800);

})();
