// Boxing Trainer Pro v28_patch.js - NEXTERA+PRISM Auto Enhancement Module
// 1. Heart Rate Zone Training Simulator Canvas 620x400 - 5 HR zones donut, 12R zone timeline, calorie bar, optimal zone
// 2. Punch Speed Radar Analyzer Canvas 620x400 - 7 punch speed horizontal bar, pro comparison radar, 30-session trend, S~D
// 3. Shadow Boxing Choreography Builder Canvas 640x400 - 8beat x 8round sequence grid, 3 difficulty, combo preset, timing guide
// 4. Fighter Archetype Profiler Canvas 620x400 - 6 archetypes 6-axis radar, type classification, strengths/weaknesses
// 5. Training Camp Season Planner Canvas 620x380 - 12-week 4-phase Gantt, weekly volume line, intensity heatmap
// 6. Boxing Mind Games Simulator Canvas 600x380 - 8 tactics 6-axis radar, opponent-style optimal tactics matrix
// 7. Punch Impact Power Map Canvas 620x400 - body silhouette 12-zone heatmap, zone power bar, KO zone highlight
// 8. Comprehensive Fighter Growth Report Canvas 620x400 - 8 KPI half-circle gauges 4x2, weighted overall S~D, 20-session history
// Quiz +15 (285->300), +12 Achievements (250->262), SFX 16, Keyboard Shift+Q/W/E/R/T/Y/U/I/9
(function(){
'use strict';

var V28KEY = 'boxingV28Patch';

function loadV28(){
  try {
    var r = localStorage.getItem(V28KEY);
    if(!r) return defV28();
    var p = JSON.parse(r), d = defV28();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV28(); }
}
function saveV28(d){ try { localStorage.setItem(V28KEY, JSON.stringify(d)); } catch(e){} }
function defV28(){
  return {
    hrZone: { zones: {rest:0,fatBurn:0,cardio:0,peak:0,vo2max:0}, roundZones: Array(12).fill(null).map(function(){return {zone:'cardio',bpm:145,cal:12}}), totalCal: 0, sessions: 0, bestGrade: 'D' },
    punchSpeed: { speeds: {jab:0,cross:0,leadHook:0,rearHook:0,leadUpper:0,rearUpper:0,overhand:0}, sessions: [], proComparison: {}, bestGrade: 'D' },
    choreography: { sequences: [], difficulty: 1, completedRoutines: 0, bestCombo: 0, sessions: 0 },
    archetype: { scores: {pressureFighter:50,counterPuncher:50,outBoxer:50,slugger:50,technician:50,switchHitter:50}, type: '', sessions: 0, evolution: [] },
    seasonPlan: { weeks: Array(12).fill(null).map(function(a,i){return {phase:i<3?'base':i<7?'build':i<10?'peak':'recovery',volume:60+Math.round(Math.random()*30),intensity:50+Math.round(Math.random()*40)}}), currentWeek: 1, completedPhases: 0 },
    mindGames: { tactics: {feint:50,pressure:50,ropeADope:50,clinch:50,cutOff:50,angling:50,volume:50,bodyWork:50}, matchups: {}, drillsDone: 0, sessions: 0 },
    impactMap: { zones: {head:0,jaw:0,temple:0,nose:0,solarPlexus:0,liver:0,ribs:0,stomach:0,upperArm:0,chest:0,floating:0,belt:0}, koZones: [], totalPunches: 0, sessions: 0 },
    growthReport: { kpis: {power:50,speed:50,defense:50,stamina:50,ringIQ:50,footwork:50,chin:50,heart:50}, history: [], overallGrade: 'D', sessions: 0 },
    quizV28Scores: {},
    achievementsV28: {},
    featureUsage28: {}
  };
}

var v28 = loadV28();

// ===== CSS =====
var st28 = document.createElement('style');
st28.textContent = '.v28-btn{padding:8px 16px;background:linear-gradient(135deg,#f59e0b,#d97706);border:none;border-radius:10px;color:#000;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s}.v28-btn:hover{filter:brightness(1.15);transform:scale(1.03)}.v28-btn-sec{padding:8px 16px;background:var(--surface,rgba(255,255,255,0.04));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:10px;color:var(--text-dim,#8a8a9e);font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.v28-btn-sec:hover{border-color:#f59e0b;color:#fbbf24}.v28-card{background:var(--glass,rgba(255,255,255,0.06));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:var(--radius,16px);padding:16px;margin-bottom:12px}.v28-hdr{font-size:15px;font-weight:800;margin-bottom:10px;display:flex;align-items:center;gap:8px}.v28-sub{font-size:11px;color:var(--text-dim,#8a8a9e);margin-bottom:8px}.v28-grade{display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:800}.v28-grade-s{background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#000}.v28-grade-a{background:linear-gradient(135deg,#a78bfa,#7c3aed);color:#fff}.v28-grade-b{background:linear-gradient(135deg,#60a5fa,#3b82f6);color:#fff}.v28-grade-c{background:linear-gradient(135deg,#34d399,#10b981);color:#000}.v28-grade-d{background:rgba(255,255,255,0.1);color:var(--text-dim,#8a8a9e)}';
document.head.appendChild(st28);

// ===== SFX ENGINE V28 =====
function playSFX28(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'heartbeat':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(60,t);o.frequency.setValueAtTime(80,t+0.05);o.frequency.setValueAtTime(60,t+0.1);
        g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.2);break;
      case 'zone_change':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(523,t);o.frequency.exponentialRampToValueAtTime(784,t+0.08);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.15);break;
      case 'speed_burst':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sawtooth';
        o.frequency.setValueAtTime(1200,t);o.frequency.exponentialRampToValueAtTime(600,t+0.06);
        g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.1);break;
      case 'speed_record':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(880,t);o.frequency.setValueAtTime(1100,t+0.05);o.frequency.setValueAtTime(1320,t+0.1);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.18);break;
      case 'choreo_beat':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='square';
        o.frequency.setValueAtTime(200,t);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.05);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.05);break;
      case 'choreo_complete':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(440,t);o.frequency.setValueAtTime(554,t+0.06);o.frequency.setValueAtTime(659,t+0.12);o.frequency.setValueAtTime(880,t+0.18);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.3);break;
      case 'archetype_reveal':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';
        o.frequency.setValueAtTime(330,t);o.frequency.exponentialRampToValueAtTime(660,t+0.15);
        g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.25);break;
      case 'archetype_evolve':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(440,t);o.frequency.setValueAtTime(660,t+0.08);o.frequency.setValueAtTime(880,t+0.16);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.24);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.24);break;
      case 'plan_phase':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';
        o.frequency.setValueAtTime(392,t);o.frequency.setValueAtTime(523,t+0.06);
        g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.12);break;
      case 'plan_complete':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(523,t);o.frequency.setValueAtTime(659,t+0.05);o.frequency.setValueAtTime(784,t+0.1);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.2);break;
      case 'mind_feint':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sawtooth';
        o.frequency.setValueAtTime(400,t);o.frequency.setValueAtTime(600,t+0.03);o.frequency.setValueAtTime(300,t+0.06);
        g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.1);break;
      case 'mind_win':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(659,t);o.frequency.setValueAtTime(784,t+0.06);o.frequency.setValueAtTime(1047,t+0.12);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.22);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.22);break;
      case 'impact_hit':
        var b=ctx.createBufferSource(),buf=ctx.createBuffer(1,ctx.sampleRate*0.08,ctx.sampleRate),d=buf.getChannelData(0);
        for(var i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*0.02));
        b.buffer=buf;var g=ctx.createGain();g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.08);
        b.connect(g).connect(ctx.destination);b.start(t);break;
      case 'impact_ko':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sawtooth';
        o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(50,t+0.3);
        g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.35);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.35);break;
      case 'growth_level':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(523,t);o.frequency.setValueAtTime(659,t+0.06);o.frequency.setValueAtTime(784,t+0.12);o.frequency.setValueAtTime(1047,t+0.18);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.3);break;
      case 'quiz_correct28':
        var o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
        o.frequency.setValueAtTime(880,t);o.frequency.setValueAtTime(1100,t+0.06);
        g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.12);break;
    }
    setTimeout(function(){ctx.close()},500);
  } catch(e){}
}

function gradeOf(pct){return pct>=95?'S':pct>=80?'A':pct>=60?'B':pct>=40?'C':'D'}
function gradeClass(g){return 'v28-grade v28-grade-'+g.toLowerCase()}

// ============================================================
// SECTION 1: Heart Rate Zone Training Simulator (Canvas 620x400)
// ============================================================
var sec1 = document.createElement('div');
sec1.id = 'v28-sec-hrZone';
sec1.style.cssText = 'display:none;max-width:680px;margin:20px auto;padding:0 12px;';
sec1.innerHTML = '<div class="v28-card"><div class="v28-hdr">❤️ 심박존 트레이닝 시뮬레이터</div><div class="v28-sub">5존(Rest/Fat Burn/Cardio/Peak/VO2Max) 도넛차트 + 12R 심박구간 듀얼라인차트 + 존별 소비칼로리 바차트</div><canvas id="v28-cv-hrZone" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#111;display:block;margin:0 auto"></canvas><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center"><button class="v28-btn" onclick="window._v28SimHR()">HR 시뮬레이션</button><button class="v28-btn-sec" onclick="window._v28ResetHR()">HR 리셋</button></div></div>';
document.body.appendChild(sec1);

function drawHRCanvas(){
  var cv = document.getElementById('v28-cv-hrZone'); if(!cv) return;
  var c = cv.getContext('2d');
  c.clearRect(0,0,620,400);
  c.fillStyle='#0a0a1a';c.fillRect(0,0,620,400);
  c.fillStyle='#f59e0b';c.font='bold 14px sans-serif';c.fillText('❤️ 심박존 트레이닝',10,25);
  var zones = [{name:'Rest',color:'#6b7280',min:60,max:100},{name:'Fat Burn',color:'#22c55e',min:100,max:130},{name:'Cardio',color:'#f59e0b',min:130,max:155},{name:'Peak',color:'#ef4444',min:155,max:175},{name:'VO2Max',color:'#a855f7',min:175,max:200}];
  var zd = v28.hrZone;
  var total = 0; for(var k in zd.zones) total += zd.zones[k];
  if(total===0) total=1;
  var cx=120,cy=120,r=60;
  var startA=-Math.PI/2;
  var zKeys = ['rest','fatBurn','cardio','peak','vo2max'];
  for(var i=0;i<5;i++){
    var pct = zd.zones[zKeys[i]]/total;
    var endA = startA + pct*2*Math.PI;
    c.beginPath();c.moveTo(cx,cy);c.arc(cx,cy,r,startA,endA);c.closePath();
    c.fillStyle=zones[i].color;c.fill();
    if(pct>0.05){
      var mid=(startA+endA)/2;
      c.fillStyle='#fff';c.font='bold 9px sans-serif';
      c.fillText(Math.round(pct*100)+'%',cx+Math.cos(mid)*(r*0.6)-8,cy+Math.sin(mid)*(r*0.6)+3);
    }
    startA=endA;
  }
  c.beginPath();c.arc(cx,cy,25,0,Math.PI*2);c.fillStyle='#0a0a1a';c.fill();
  c.fillStyle='#fff';c.font='bold 10px sans-serif';c.textAlign='center';
  c.fillText('HR',cx,cy-4);c.fillText('Zone',cx,cy+10);c.textAlign='left';
  for(var i=0;i<5;i++){
    var y=200+i*22;
    c.fillStyle=zones[i].color;c.fillRect(20,y,10,10);
    c.fillStyle='#ccc';c.font='11px sans-serif';
    c.fillText(zones[i].name+' ('+zones[i].min+'-'+zones[i].max+' bpm)',36,y+9);
    c.fillText(zd.zones[zKeys[i]]+'min',180,y+9);
  }
  c.fillStyle='#f59e0b';c.font='bold 12px sans-serif';c.fillText('12R 심박존 타임라인',240,45);
  var gx=260,gy=60,gw=340,gh=120;
  c.strokeStyle='rgba(255,255,255,0.1)';c.strokeRect(gx,gy,gw,gh);
  for(var i=0;i<12;i++){
    var rd=zd.roundZones[i];
    var bpm=rd.bpm||140;
    var norm=(bpm-60)/140;
    var x=gx+10+i*(gw-20)/12;
    var y2=gy+gh-norm*gh;
    if(i>0){
      var pbpm=zd.roundZones[i-1].bpm||140;
      var pnorm=(pbpm-60)/140;
      var px=gx+10+(i-1)*(gw-20)/12;
      var py=gy+gh-pnorm*gh;
      c.strokeStyle='#ef4444';c.lineWidth=2;c.beginPath();c.moveTo(px,py);c.lineTo(x,y2);c.stroke();c.lineWidth=1;
    }
    c.fillStyle='#ef4444';c.beginPath();c.arc(x,y2,3,0,Math.PI*2);c.fill();
    c.fillStyle='#888';c.font='9px sans-serif';c.fillText('R'+(i+1),x-5,gy+gh+12);
  }
  c.fillStyle='#888';c.font='9px sans-serif';
  c.fillText('200bpm',gx-35,gy+5);c.fillText('130bpm',gx-35,gy+gh/2);c.fillText('60bpm',gx-35,gy+gh+2);
  c.fillStyle='#f59e0b';c.font='bold 12px sans-serif';c.fillText('존별 칼로리 소비',240,220);
  var calData=[zd.zones.rest*3,zd.zones.fatBurn*7,zd.zones.cardio*10,zd.zones.peak*13,zd.zones.vo2max*16];
  var maxCal=Math.max.apply(null,calData)||1;
  for(var i=0;i<5;i++){
    var bw=50,bh=(calData[i]/maxCal)*120;
    var bx=260+i*65;
    c.fillStyle=zones[i].color;
    c.fillRect(bx,360-bh,bw,bh);
    c.fillStyle='#fff';c.font='bold 9px sans-serif';c.textAlign='center';
    c.fillText(calData[i]+'kcal',bx+bw/2,355-bh);
    c.fillStyle='#aaa';c.font='8px sans-serif';
    c.fillText(zones[i].name,bx+bw/2,375);
    c.textAlign='left';
  }
  var totalCal=calData.reduce(function(a,b){return a+b},0);
  c.fillStyle='#fff';c.font='bold 12px sans-serif';c.fillText('총 '+totalCal+' kcal',480,220);
  var gg=gradeOf(Math.min(100,totalCal/5));
  c.fillStyle=zones[2].color;c.font='bold 14px sans-serif';c.fillText('등급: '+gg,480,240);
}
window._v28SimHR = function(){
  var zKeys=['rest','fatBurn','cardio','peak','vo2max'];
  for(var i=0;i<5;i++) v28.hrZone.zones[zKeys[i]]=Math.round(Math.random()*15+2);
  for(var i=0;i<12;i++){
    var bpm=120+Math.round(Math.random()*60);
    v28.hrZone.roundZones[i]={zone:bpm<100?'rest':bpm<130?'fatBurn':bpm<155?'cardio':bpm<175?'peak':'vo2max',bpm:bpm,cal:Math.round(bpm*0.08)};
  }
  v28.hrZone.sessions++;saveV28(v28);drawHRCanvas();playSFX28('heartbeat');checkAchievementsV28();
};
window._v28ResetHR = function(){
  v28.hrZone=defV28().hrZone;saveV28(v28);drawHRCanvas();playSFX28('zone_change');
};

// ============================================================
// SECTION 2: Punch Speed Radar Analyzer (Canvas 620x400)
// ============================================================
var sec2 = document.createElement('div');
sec2.id = 'v28-sec-punchSpeed';
sec2.style.cssText = 'display:none;max-width:680px;margin:20px auto;padding:0 12px;';
sec2.innerHTML = '<div class="v28-card"><div class="v28-hdr">⚡ 펜치속도 레이더 분석기</div><div class="v28-sub">7종 펜치 속도(mph) 수평바 + 프로선수 대비 레이더 + 30세션 트렌드</div><canvas id="v28-cv-speed" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#111;display:block;margin:0 auto"></canvas><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center"><button class="v28-btn" onclick="window._v28MeasureSpeed()">&#49549;&#46020; &#52769;&#51221;</button><button class="v28-btn-sec" onclick="window._v28ResetSpeed()">&#49549;&#46020; &#47532;&#49483;</button></div></div>';
document.body.appendChild(sec2);

function drawSpeedCanvas(){
  var cv = document.getElementById('v28-cv-speed'); if(!cv) return;
  var c = cv.getContext('2d');
  c.clearRect(0,0,620,400);c.fillStyle='#0a0a1a';c.fillRect(0,0,620,400);
  c.fillStyle='#f59e0b';c.font='bold 14px sans-serif';c.fillText('⚡ 펜치 속도 분석',10,25);
  var punches=['Jab','Cross','Lead Hook','Rear Hook','Lead Upper','Rear Upper','Overhand'];
  var pKeys=['jab','cross','leadHook','rearHook','leadUpper','rearUpper','overhand'];
  var proSpeeds=[32,28,25,27,24,26,30];
  var colors=['#ef4444','#f59e0b','#22c55e','#3b82f6','#a855f7','#ec4899','#14b8a6'];
  var maxSpd=40;
  for(var i=0;i<7;i++){
    var y=50+i*40;
    var spd=v28.punchSpeed.speeds[pKeys[i]]||0;
    var bw=(spd/maxSpd)*220;
    c.fillStyle='#333';c.fillRect(100,y,220,20);
    c.fillStyle=colors[i];c.fillRect(100,y,bw,20);
    var proW=(proSpeeds[i]/maxSpd)*220;
    c.strokeStyle='rgba(255,255,255,0.5)';c.setLineDash([3,3]);c.beginPath();c.moveTo(100+proW,y-2);c.lineTo(100+proW,y+22);c.stroke();c.setLineDash([]);
    c.fillStyle='#ccc';c.font='11px sans-serif';c.textAlign='right';c.fillText(punches[i],95,y+14);c.textAlign='left';
    c.fillStyle='#fff';c.font='bold 10px sans-serif';c.fillText(spd+' mph',325,y+14);
    c.fillStyle='#888';c.font='9px sans-serif';c.fillText('Pro:'+proSpeeds[i],365,y+14);
  }
  c.fillStyle='#f59e0b';c.font='bold 12px sans-serif';c.fillText('프로 대비 레이더',440,45);
  var rcx=510,rcy=180,rr=80;
  var axes=7;
  for(var ring=1;ring<=4;ring++){
    c.strokeStyle='rgba(255,255,255,0.08)';c.beginPath();
    for(var i=0;i<=axes;i++){
      var a=-Math.PI/2+i*(2*Math.PI/axes);
      var px=rcx+Math.cos(a)*rr*(ring/4),py=rcy+Math.sin(a)*rr*(ring/4);
      if(i===0)c.moveTo(px,py);else c.lineTo(px,py);
    }c.stroke();
  }
  c.strokeStyle='rgba(255,255,255,0.3)';c.lineWidth=1.5;c.beginPath();
  for(var i=0;i<axes;i++){
    var a=-Math.PI/2+i*(2*Math.PI/axes);
    var val=proSpeeds[i]/maxSpd;
    var px=rcx+Math.cos(a)*rr*val,py=rcy+Math.sin(a)*rr*val;
    if(i===0)c.moveTo(px,py);else c.lineTo(px,py);
  }c.closePath();c.stroke();
  c.fillStyle='rgba(245,158,11,0.2)';c.strokeStyle='#f59e0b';c.lineWidth=2;c.beginPath();
  for(var i=0;i<axes;i++){
    var a=-Math.PI/2+i*(2*Math.PI/axes);
    var val=(v28.punchSpeed.speeds[pKeys[i]]||0)/maxSpd;
    var px=rcx+Math.cos(a)*rr*val,py=rcy+Math.sin(a)*rr*val;
    if(i===0)c.moveTo(px,py);else c.lineTo(px,py);
  }c.closePath();c.fill();c.stroke();c.lineWidth=1;
  for(var i=0;i<axes;i++){
    var a=-Math.PI/2+i*(2*Math.PI/axes);
    c.fillStyle='#aaa';c.font='8px sans-serif';c.textAlign='center';
    c.fillText(punches[i].substr(0,5),rcx+Math.cos(a)*(rr+14),rcy+Math.sin(a)*(rr+14)+3);c.textAlign='left';
  }
  c.fillStyle='#f59e0b';c.font='bold 12px sans-serif';c.fillText('30세션 트렌드',10,320);
  var sessions = v28.punchSpeed.sessions || [];
  if(sessions.length>0){
    var sx=30,sy=335,sw=560,sh=55;
    c.strokeStyle='rgba(255,255,255,0.1)';c.strokeRect(sx,sy,sw,sh);
    var maxS=Math.max.apply(null,sessions.map(function(s){return s.avg||0}))||1;
    for(var i=0;i<sessions.length;i++){
      var x=sx+i*(sw/Math.max(sessions.length-1,1));
      var y2=sy+sh-(sessions[i].avg/maxS)*sh;
      if(i>0){
        var px=sx+(i-1)*(sw/Math.max(sessions.length-1,1));
        var py=sy+sh-(sessions[i-1].avg/maxS)*sh;
        c.strokeStyle='#f59e0b';c.lineWidth=1.5;c.beginPath();c.moveTo(px,py);c.lineTo(x,y2);c.stroke();c.lineWidth=1;
      }
      c.fillStyle='#f59e0b';c.beginPath();c.arc(x,y2,2,0,Math.PI*2);c.fill();
    }
  }
  var totalSpd=0,cnt=0;for(var k in v28.punchSpeed.speeds){if(v28.punchSpeed.speeds[k]>0){totalSpd+=v28.punchSpeed.speeds[k];cnt++;}}
  var avgSpd=cnt?Math.round(totalSpd/cnt):0;
  var gg=gradeOf(Math.min(100,avgSpd*3.3));
  c.fillStyle='#fff';c.font='bold 13px sans-serif';c.fillText('평균: '+avgSpd+' mph  등급: '+gg,420,320);
}
window._v28MeasureSpeed = function(){
  var pKeys=['jab','cross','leadHook','rearHook','leadUpper','rearUpper','overhand'];
  for(var i=0;i<7;i++) v28.punchSpeed.speeds[pKeys[i]]=Math.round(15+Math.random()*20);
  var avg=0;for(var k in v28.punchSpeed.speeds) avg+=v28.punchSpeed.speeds[k];avg=Math.round(avg/7);
  if(!Array.isArray(v28.punchSpeed.sessions)) v28.punchSpeed.sessions=[];
  v28.punchSpeed.sessions.push({avg:avg});
  if(v28.punchSpeed.sessions.length>30) v28.punchSpeed.sessions.shift();
  saveV28(v28);drawSpeedCanvas();playSFX28('speed_burst');checkAchievementsV28();
};
window._v28ResetSpeed = function(){
  v28.punchSpeed=defV28().punchSpeed;saveV28(v28);drawSpeedCanvas();playSFX28('speed_record');
};

// ============================================================
// SECTION 3: Shadow Boxing Choreography Builder (Canvas 640x400)
// ============================================================
var sec3 = document.createElement('div');
sec3.id = 'v28-sec-choreo';
sec3.style.cssText = 'display:none;max-width:680px;margin:20px auto;padding:0 12px;';
sec3.innerHTML = '<div class="v28-card"><div class="v28-hdr">💃 섬도복싱 코레오그래피 빌더</div><div class="v28-sub">8비트 × 8라운드 시퀀스 그리드 + 3난이도 + 콤보 프리셋 + 타이밍 가이드</div><canvas id="v28-cv-choreo" width="640" height="400" style="width:100%;max-width:640px;border-radius:12px;background:#111;display:block;margin:0 auto"></canvas><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center"><button class="v28-btn" onclick="window._v28GenChoreo()">&#47336;&#54004; &#49373;&#49457;</button><button class="v28-btn-sec" onclick="window._v28CompleteChoreo()">&#47336;&#54004; &#50756;&#47308;</button></div></div>';
document.body.appendChild(sec3);

function drawChoreoCanvas(){
  var cv = document.getElementById('v28-cv-choreo'); if(!cv) return;
  var c = cv.getContext('2d');
  c.clearRect(0,0,640,400);c.fillStyle='#0a0a1a';c.fillRect(0,0,640,400);
  c.fillStyle='#f59e0b';c.font='bold 14px sans-serif';c.fillText('💃 코레오그래피 빌더',10,25);
  var moves=['Jab','Cross','Hook','Upper','Slip','Duck','Step','Guard'];
  var mColors=['#ef4444','#f59e0b','#22c55e','#3b82f6','#a855f7','#ec4899','#14b8a6','#6b7280'];
  var diffNames=['초급','중급','고급'];
  c.fillStyle='#aaa';c.font='11px sans-serif';c.fillText('난이도: '+diffNames[Math.min(v28.choreography.difficulty-1,2)||0],520,25);
  var gx=40,gy=50,cw=68,ch=35;
  c.fillStyle='#888';c.font='bold 10px sans-serif';
  for(var j=0;j<8;j++) c.fillText('Beat '+(j+1),gx+j*cw+10,gy-5);
  for(var i=0;i<8;i++){
    c.fillStyle='#aaa';c.font='10px sans-serif';c.fillText('R'+(i+1),gx-25,gy+i*ch+22);
    for(var j=0;j<8;j++){
      var idx=i*8+j;
      var seq = v28.choreography.sequences || [];
      var mv = seq[idx] || 0;
      c.fillStyle = mv>0 ? mColors[mv-1] : 'rgba(255,255,255,0.04)';
      c.fillRect(gx+j*cw,gy+i*ch,cw-3,ch-3);
      c.strokeStyle='rgba(255,255,255,0.08)';c.strokeRect(gx+j*cw,gy+i*ch,cw-3,ch-3);
      if(mv>0){
        c.fillStyle='#fff';c.font='bold 9px sans-serif';c.textAlign='center';
        c.fillText(moves[mv-1],gx+j*cw+(cw-3)/2,gy+i*ch+(ch-3)/2+3);c.textAlign='left';
      }
    }
  }
  c.fillStyle='#f59e0b';c.font='bold 11px sans-serif';c.fillText('무브 범례',gx,gy+8*ch+20);
  for(var i=0;i<8;i++){
    c.fillStyle=mColors[i];c.fillRect(gx+i*72,gy+8*ch+28,12,12);
    c.fillStyle='#ccc';c.font='10px sans-serif';c.fillText(moves[i],gx+i*72+16,gy+8*ch+38);
  }
  c.fillStyle='#fff';c.font='bold 12px sans-serif';
  c.fillText('완료: '+v28.choreography.completedRoutines+'회',gx,gy+8*ch+60);
  c.fillText('베스트 콤보: '+v28.choreography.bestCombo,250,gy+8*ch+60);
}
window._v28GenChoreo = function(){
  var seq=[];var diff=v28.choreography.difficulty||1;
  var maxMoves=diff===1?5:diff===2?7:8;
  for(var i=0;i<64;i++) seq.push(Math.random()<0.7?Math.floor(Math.random()*maxMoves)+1:0);
  v28.choreography.sequences=seq;v28.choreography.sessions++;
  saveV28(v28);drawChoreoCanvas();playSFX28('choreo_beat');checkAchievementsV28();
};
window._v28CompleteChoreo = function(){
  v28.choreography.completedRoutines++;
  var combo=v28.choreography.sequences?v28.choreography.sequences.filter(function(m){return m>0}).length:0;
  if(combo>v28.choreography.bestCombo) v28.choreography.bestCombo=combo;
  if(v28.choreography.difficulty<3) v28.choreography.difficulty++;
  saveV28(v28);drawChoreoCanvas();playSFX28('choreo_complete');checkAchievementsV28();
};

// ============================================================
// SECTION 4: Fighter Archetype Profiler (Canvas 620x400)
// ============================================================
var sec4 = document.createElement('div');
sec4.id = 'v28-sec-archetype';
sec4.style.cssText = 'display:none;max-width:680px;margin:20px auto;padding:0 12px;';
sec4.innerHTML = '<div class="v28-card"><div class="v28-hdr">🥊 파이터 아키타입 프로파일러</div><div class="v28-sub">6아키타입 6축 Radar + 유형 분류 + 강약점 분석</div><canvas id="v28-cv-archetype" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#111;display:block;margin:0 auto"></canvas><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center"><button class="v28-btn" onclick="window._v28AnalyzeArchetype()">&#50500;&#53412;&#53440;&#51077; &#48516;&#49437;</button><button class="v28-btn-sec" onclick="window._v28EvolveArchetype()">&#50500;&#53412;&#53440;&#51077; &#51652;&#54868;</button></div></div>';
document.body.appendChild(sec4);

function drawArchetypeCanvas(){
  var cv = document.getElementById('v28-cv-archetype'); if(!cv) return;
  var c = cv.getContext('2d');
  c.clearRect(0,0,620,400);c.fillStyle='#0a0a1a';c.fillRect(0,0,620,400);
  c.fillStyle='#f59e0b';c.font='bold 14px sans-serif';c.fillText('🥊 파이터 아키타입',10,25);
  var types=['Pressure','Counter','Out-Box','Slugger','Technician','Switch'];
  var tKeys=['pressureFighter','counterPuncher','outBoxer','slugger','technician','switchHitter'];
  var tColors=['#ef4444','#3b82f6','#22c55e','#f59e0b','#a855f7','#ec4899'];
  var rcx=180,rcy=200,rr=120;
  for(var ring=1;ring<=5;ring++){
    c.strokeStyle='rgba(255,255,255,0.06)';c.beginPath();
    for(var i=0;i<=6;i++){
      var a=-Math.PI/2+i*(2*Math.PI/6);
      var px=rcx+Math.cos(a)*rr*(ring/5),py=rcy+Math.sin(a)*rr*(ring/5);
      if(i===0)c.moveTo(px,py);else c.lineTo(px,py);
    }c.stroke();
  }
  for(var i=0;i<6;i++){
    var a=-Math.PI/2+i*(2*Math.PI/6);
    c.strokeStyle='rgba(255,255,255,0.05)';c.beginPath();c.moveTo(rcx,rcy);c.lineTo(rcx+Math.cos(a)*rr,rcy+Math.sin(a)*rr);c.stroke();
    c.fillStyle='#ccc';c.font='bold 10px sans-serif';c.textAlign='center';
    c.fillText(types[i],rcx+Math.cos(a)*(rr+18),rcy+Math.sin(a)*(rr+18)+3);c.textAlign='left';
  }
  c.fillStyle='rgba(245,158,11,0.15)';c.strokeStyle='#f59e0b';c.lineWidth=2.5;c.beginPath();
  var maxScore = 0, maxIdx = 0;
  for(var i=0;i<6;i++){
    var a=-Math.PI/2+i*(2*Math.PI/6);
    var val=(v28.archetype.scores[tKeys[i]]||50)/100;
    if(v28.archetype.scores[tKeys[i]]>maxScore){maxScore=v28.archetype.scores[tKeys[i]];maxIdx=i;}
    var px=rcx+Math.cos(a)*rr*val,py=rcy+Math.sin(a)*rr*val;
    if(i===0)c.moveTo(px,py);else c.lineTo(px,py);
  }c.closePath();c.fill();c.stroke();c.lineWidth=1;
  for(var i=0;i<6;i++){
    var a=-Math.PI/2+i*(2*Math.PI/6);
    var val=(v28.archetype.scores[tKeys[i]]||50)/100;
    c.fillStyle=tColors[i];c.beginPath();c.arc(rcx+Math.cos(a)*rr*val,rcy+Math.sin(a)*rr*val,4,0,Math.PI*2);c.fill();
  }
  var archetypeName = types[maxIdx];
  c.fillStyle='#f59e0b';c.font='bold 16px sans-serif';c.fillText('유형: '+archetypeName,380,60);
  var strengths=['압박력','카운터','거리조절','파워','기술','유연성'];
  var weaknesses=['지구력','선공','접근전','수비','파워','예측성'];
  c.fillStyle='#22c55e';c.font='bold 12px sans-serif';c.fillText('✅ 강점: '+strengths[maxIdx],380,90);
  c.fillStyle='#ef4444';c.font='bold 12px sans-serif';c.fillText('⚠️ 약점: '+weaknesses[maxIdx],380,115);
  c.fillStyle='#aaa';c.font='11px sans-serif';
  for(var i=0;i<6;i++){
    c.fillStyle=tColors[i];c.fillRect(380,145+i*28,12,12);
    c.fillStyle='#ccc';c.font='11px sans-serif';
    c.fillText(types[i]+': '+v28.archetype.scores[tKeys[i]]+'%',398,145+i*28+10);
  }
  c.fillStyle='#888';c.font='10px sans-serif';
  c.fillText('분석 횟수: '+(v28.archetype.sessions||0),380,320);
}
window._v28AnalyzeArchetype = function(){
  var tKeys=['pressureFighter','counterPuncher','outBoxer','slugger','technician','switchHitter'];
  for(var i=0;i<6;i++) v28.archetype.scores[tKeys[i]]=30+Math.round(Math.random()*65);
  var maxS=0,maxI=0;for(var i=0;i<6;i++){if(v28.archetype.scores[tKeys[i]]>maxS){maxS=v28.archetype.scores[tKeys[i]];maxI=i;}}
  v28.archetype.type=['Pressure Fighter','Counter Puncher','Out-Boxer','Slugger','Technician','Switch-Hitter'][maxI];
  v28.archetype.sessions++;saveV28(v28);drawArchetypeCanvas();playSFX28('archetype_reveal');checkAchievementsV28();
};
window._v28EvolveArchetype = function(){
  var tKeys=['pressureFighter','counterPuncher','outBoxer','slugger','technician','switchHitter'];
  for(var i=0;i<6;i++) v28.archetype.scores[tKeys[i]]=Math.min(100,v28.archetype.scores[tKeys[i]]+Math.round(Math.random()*8));
  v28.archetype.evolution=v28.archetype.evolution||[];
  v28.archetype.evolution.push({scores:Object.assign({},v28.archetype.scores)});
  saveV28(v28);drawArchetypeCanvas();playSFX28('archetype_evolve');checkAchievementsV28();
};

// ============================================================
// SECTION 5: Training Camp Season Planner (Canvas 620x380)
// ============================================================
var sec5 = document.createElement('div');
sec5.id = 'v28-sec-season';
sec5.style.cssText = 'display:none;max-width:680px;margin:20px auto;padding:0 12px;';
sec5.innerHTML = '<div class="v28-card"><div class="v28-hdr">📅 트레이닝칠프 시즌플래너</div><div class="v28-sub">12주 4단계(Base/Build/Peak/Recovery) 간트바 + 주간 볼륨 라인 + 강도 히트맵</div><canvas id="v28-cv-season" width="620" height="380" style="width:100%;max-width:620px;border-radius:12px;background:#111;display:block;margin:0 auto"></canvas><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center"><button class="v28-btn" onclick="window._v28AdvanceWeek()">&#51452;&#52264; &#51652;&#54665;</button><button class="v28-btn-sec" onclick="window._v28ResetSeason()">&#49884;&#51596; &#47532;&#49483;</button></div></div>';
document.body.appendChild(sec5);

function drawSeasonCanvas(){
  var cv = document.getElementById('v28-cv-season'); if(!cv) return;
  var c = cv.getContext('2d');
  c.clearRect(0,0,620,380);c.fillStyle='#0a0a1a';c.fillRect(0,0,620,380);
  c.fillStyle='#f59e0b';c.font='bold 14px sans-serif';c.fillText('📅 시즌 플래너',10,25);
  var phases=[{name:'Base',color:'#22c55e',weeks:3},{name:'Build',color:'#f59e0b',weeks:4},{name:'Peak',color:'#ef4444',weeks:3},{name:'Recovery',color:'#3b82f6',weeks:2}];
  var gx=50,gy=55,bw=44,bh=30;
  c.fillStyle='#888';c.font='bold 10px sans-serif';
  for(var i=0;i<12;i++) c.fillText('W'+(i+1),gx+i*bw+10,gy-5);
  var wk=0;
  for(var p=0;p<4;p++){
    for(var w=0;w<phases[p].weeks;w++){
      var x=gx+wk*bw;
      c.fillStyle=wk<v28.seasonPlan.currentWeek?phases[p].color:'rgba(255,255,255,0.04)';
      if(wk===v28.seasonPlan.currentWeek-1) c.fillStyle='#fff';
      c.fillRect(x,gy,bw-3,bh);
      c.strokeStyle='rgba(255,255,255,0.1)';c.strokeRect(x,gy,bw-3,bh);
      if(wk===v28.seasonPlan.currentWeek-1){
        c.fillStyle='#000';c.font='bold 9px sans-serif';c.textAlign='center';
        c.fillText('▶',x+(bw-3)/2,gy+bh/2+3);c.textAlign='left';
      }
      wk++;
    }
    c.fillStyle=phases[p].color;c.font='bold 10px sans-serif';
    var startX=gx;for(var pp=0;pp<p;pp++) startX+=phases[pp].weeks*bw;
    c.fillText(phases[p].name,startX+5,gy+bh+14);
  }
  c.fillStyle='#f59e0b';c.font='bold 12px sans-serif';c.fillText('주간 볼륨 & 강도',50,130);
  var vx=50,vy=145,vw=520,vh=80;
  c.strokeStyle='rgba(255,255,255,0.1)';c.strokeRect(vx,vy,vw,vh);
  var weeks=v28.seasonPlan.weeks;
  for(var i=0;i<12;i++){
    var x=vx+i*(vw/12)+5;
    var vol=weeks[i].volume||60;
    var inten=weeks[i].intensity||50;
    var volH=(vol/100)*vh;
    var intenH=(inten/100)*vh;
    c.fillStyle='rgba(34,197,94,0.4)';c.fillRect(x,vy+vh-volH,16,volH);
    c.fillStyle='rgba(239,68,68,0.4)';c.fillRect(x+18,vy+vh-intenH,16,intenH);
  }
  c.fillStyle='#22c55e';c.fillRect(vx,vy+vh+8,10,10);c.fillStyle='#ccc';c.font='10px sans-serif';c.fillText('Volume',vx+14,vy+vh+17);
  c.fillStyle='#ef4444';c.fillRect(vx+80,vy+vh+8,10,10);c.fillStyle='#ccc';c.fillText('Intensity',vx+94,vy+vh+17);
  c.fillStyle='#f59e0b';c.font='bold 12px sans-serif';c.fillText('강도 히트맵',50,270);
  var hx=50,hy=285,hcw=44,hch=18;
  var intensityLevels=['Low','Med','High','Max'];
  for(var i=0;i<12;i++){
    var inten=weeks[i].intensity||50;
    var lvl=inten<30?0:inten<55?1:inten<80?2:3;
    var colors=['#1a4731','#166534','#ca8a04','#dc2626'];
    c.fillStyle=colors[lvl];c.fillRect(hx+i*hcw,hy,hcw-3,hch);
    c.fillStyle='#fff';c.font='8px sans-serif';c.textAlign='center';
    c.fillText(intensityLevels[lvl],hx+i*hcw+(hcw-3)/2,hy+hch/2+3);c.textAlign='left';
  }
  c.fillStyle='#fff';c.font='bold 12px sans-serif';
  c.fillText('현재 주차: W'+v28.seasonPlan.currentWeek+'/12',50,340);
  c.fillText('완료 단계: '+v28.seasonPlan.completedPhases+'/4',300,340);
}
window._v28AdvanceWeek = function(){
  if(v28.seasonPlan.currentWeek<12){
    v28.seasonPlan.currentWeek++;
    var cumWeeks=[3,7,10,12];
    for(var i=0;i<4;i++){if(v28.seasonPlan.currentWeek===cumWeeks[i]) v28.seasonPlan.completedPhases=i+1;}
  } else {
    v28.seasonPlan.currentWeek=1;v28.seasonPlan.completedPhases=0;
  }
  saveV28(v28);drawSeasonCanvas();playSFX28('plan_phase');checkAchievementsV28();
};
window._v28ResetSeason = function(){
  v28.seasonPlan=defV28().seasonPlan;saveV28(v28);drawSeasonCanvas();playSFX28('plan_complete');
};

// ============================================================
// SECTION 6: Boxing Mind Games Simulator (Canvas 600x380)
// ============================================================
var sec6 = document.createElement('div');
sec6.id = 'v28-sec-mindGames';
sec6.style.cssText = 'display:none;max-width:680px;margin:20px auto;padding:0 12px;';
sec6.innerHTML = '<div class="v28-card"><div class="v28-hdr">🧠 복싱 심리전 시뮬레이터</div><div class="v28-sub">8전술 6축 Radar + 상대스타일별 최적전술 매트릭스</div><canvas id="v28-cv-mindGames" width="600" height="380" style="width:100%;max-width:600px;border-radius:12px;background:#111;display:block;margin:0 auto"></canvas><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center"><button class="v28-btn" onclick="window._v28MindDrill()">&#49900;&#47532;&#51204; &#46300;&#47540;</button><button class="v28-btn-sec" onclick="window._v28ResetMind()">&#49900;&#47532;&#51204; &#47532;&#49483;</button></div></div>';
document.body.appendChild(sec6);

function drawMindCanvas(){
  var cv = document.getElementById('v28-cv-mindGames'); if(!cv) return;
  var c = cv.getContext('2d');
  c.clearRect(0,0,600,380);c.fillStyle='#0a0a1a';c.fillRect(0,0,600,380);
  c.fillStyle='#f59e0b';c.font='bold 14px sans-serif';c.fillText('🧠 복싱 심리전',10,25);
  var tactics=['Feint','Pressure','Rope-a-Dope','Clinch','Cut Off','Angling','Volume','Body Work'];
  var tKeys=['feint','pressure','ropeADope','clinch','cutOff','angling','volume','bodyWork'];
  var tColors=['#ef4444','#f59e0b','#22c55e','#3b82f6','#a855f7','#ec4899','#14b8a6','#6b7280'];
  var rcx=160,rcy=190,rr=110;
  for(var ring=1;ring<=5;ring++){
    c.strokeStyle='rgba(255,255,255,0.06)';c.beginPath();
    for(var i=0;i<=8;i++){
      var a=-Math.PI/2+i*(2*Math.PI/8);
      var px=rcx+Math.cos(a)*rr*(ring/5),py=rcy+Math.sin(a)*rr*(ring/5);
      if(i===0)c.moveTo(px,py);else c.lineTo(px,py);
    }c.stroke();
  }
  c.fillStyle='rgba(245,158,11,0.15)';c.strokeStyle='#f59e0b';c.lineWidth=2;c.beginPath();
  for(var i=0;i<8;i++){
    var a=-Math.PI/2+i*(2*Math.PI/8);
    var val=(v28.mindGames.tactics[tKeys[i]]||50)/100;
    var px=rcx+Math.cos(a)*rr*val,py=rcy+Math.sin(a)*rr*val;
    if(i===0)c.moveTo(px,py);else c.lineTo(px,py);
  }c.closePath();c.fill();c.stroke();c.lineWidth=1;
  for(var i=0;i<8;i++){
    var a=-Math.PI/2+i*(2*Math.PI/8);
    c.fillStyle='#ccc';c.font='bold 9px sans-serif';c.textAlign='center';
    c.fillText(tactics[i],rcx+Math.cos(a)*(rr+16),rcy+Math.sin(a)*(rr+16)+3);c.textAlign='left';
    c.fillStyle=tColors[i];c.beginPath();c.arc(rcx+Math.cos(a)*rr*((v28.mindGames.tactics[tKeys[i]]||50)/100),rcy+Math.sin(a)*rr*((v28.mindGames.tactics[tKeys[i]]||50)/100),3,0,Math.PI*2);c.fill();
  }
  c.fillStyle='#f59e0b';c.font='bold 12px sans-serif';c.fillText('상대 스타일 최적 전술',340,45);
  var opponents=['Swarmer','Out-Boxer','Slugger','Counter','Brawler','Switch'];
  var optimalTactics=['Cut Off','Clinch','Angling','Feint','Body Work','Pressure'];
  for(var i=0;i<6;i++){
    var y=65+i*40;
    c.fillStyle='#333';c.fillRect(340,y,220,25);
    var eff=50+Math.round(Math.random()*40);
    c.fillStyle=tColors[i%8];c.fillRect(340,y,(eff/100)*220,25);
    c.fillStyle='#fff';c.font='bold 10px sans-serif';
    c.fillText(opponents[i]+' → '+optimalTactics[i],345,y+16);
    c.fillStyle='#ccc';c.font='9px sans-serif';c.fillText(eff+'%',540,y+16);
  }
  c.fillStyle='#aaa';c.font='11px sans-serif';
  c.fillText('드릴 완료: '+v28.mindGames.drillsDone,340,320);
  c.fillText('세션: '+v28.mindGames.sessions,480,320);
}
window._v28MindDrill = function(){
  var tKeys=['feint','pressure','ropeADope','clinch','cutOff','angling','volume','bodyWork'];
  var rk=tKeys[Math.floor(Math.random()*8)];
  v28.mindGames.tactics[rk]=Math.min(100,v28.mindGames.tactics[rk]+Math.round(Math.random()*12+3));
  v28.mindGames.drillsDone++;v28.mindGames.sessions++;
  saveV28(v28);drawMindCanvas();playSFX28('mind_feint');checkAchievementsV28();
};
window._v28ResetMind = function(){
  v28.mindGames=defV28().mindGames;saveV28(v28);drawMindCanvas();playSFX28('mind_win');
};

// ============================================================
// SECTION 7: Punch Impact Power Map (Canvas 620x400)
// ============================================================
var sec7 = document.createElement('div');
sec7.id = 'v28-sec-impactMap';
sec7.style.cssText = 'display:none;max-width:680px;margin:20px auto;padding:0 12px;';
sec7.innerHTML = '<div class="v28-card"><div class="v28-hdr">💥 펜치 임팩트 파워맵</div><div class="v28-sub">바디 실루엇 12존 히트맵 + 존별 파워 분포 바차트 + KO존 하이라이트</div><canvas id="v28-cv-impact" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#111;display:block;margin:0 auto"></canvas><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center"><button class="v28-btn" onclick="window._v28SimImpact()">&#51076;&#54057;&#53944; &#49884;&#48044;</button><button class="v28-btn-sec" onclick="window._v28ResetImpact()">&#51076;&#54057;&#53944; &#47532;&#49483;</button></div></div>';
document.body.appendChild(sec7);

function drawImpactCanvas(){
  var cv = document.getElementById('v28-cv-impact'); if(!cv) return;
  var c = cv.getContext('2d');
  c.clearRect(0,0,620,400);c.fillStyle='#0a0a1a';c.fillRect(0,0,620,400);
  c.fillStyle='#f59e0b';c.font='bold 14px sans-serif';c.fillText('💥 펜치 임팩트 파워맵',10,25);
  var zoneNames=['Head','Jaw','Temple','Nose','Solar Plexus','Liver','Ribs','Stomach','Upper Arm','Chest','Floating Rib','Belt Line'];
  var zoneKeys=['head','jaw','temple','nose','solarPlexus','liver','ribs','stomach','upperArm','chest','floating','belt'];
  var koZones=['jaw','temple','liver','solarPlexus'];
  var zonePositions=[
    {x:150,y:60,w:40,h:30},{x:130,y:95,w:30,h:20},{x:175,y:70,w:20,h:20},{x:150,y:80,w:15,h:15},
    {x:145,y:160,w:35,h:25},{x:180,y:170,w:25,h:25},{x:115,y:165,w:25,h:35},{x:145,y:195,w:35,h:25},
    {x:95,y:125,w:20,h:40},{x:140,y:130,w:45,h:30},{x:120,y:200,w:20,h:20},{x:140,y:225,w:40,h:15}
  ];
  c.strokeStyle='rgba(255,255,255,0.2)';c.lineWidth=2;
  c.beginPath();c.arc(150,65,30,0,Math.PI*2);c.stroke();
  c.beginPath();c.moveTo(150,95);c.lineTo(150,240);c.stroke();
  c.beginPath();c.moveTo(150,120);c.lineTo(95,180);c.moveTo(150,120);c.lineTo(205,180);c.stroke();
  c.beginPath();c.moveTo(150,240);c.lineTo(120,320);c.moveTo(150,240);c.lineTo(180,320);c.stroke();
  c.lineWidth=1;
  var maxPow=0;for(var k in v28.impactMap.zones) if(v28.impactMap.zones[k]>maxPow) maxPow=v28.impactMap.zones[k];
  if(maxPow===0) maxPow=1;
  for(var i=0;i<12;i++){
    var z=zonePositions[i];
    var pow=v28.impactMap.zones[zoneKeys[i]]||0;
    var intensity=pow/maxPow;
    var isKO=koZones.indexOf(zoneKeys[i])>=0;
    if(pow>0){
      var r=Math.round(255*intensity),g=Math.round(100*(1-intensity)),b=0;
      c.fillStyle='rgba('+r+','+g+','+b+','+Math.max(0.2,intensity*0.8)+')';
    } else {
      c.fillStyle='rgba(255,255,255,0.05)';
    }
    c.fillRect(z.x,z.y,z.w,z.h);
    if(isKO && pow>0){
      c.strokeStyle='#f59e0b';c.lineWidth=2;c.strokeRect(z.x-1,z.y-1,z.w+2,z.h+2);c.lineWidth=1;
    }
    c.strokeStyle='rgba(255,255,255,0.15)';c.strokeRect(z.x,z.y,z.w,z.h);
  }
  c.fillStyle='#f59e0b';c.font='bold 12px sans-serif';c.fillText('존별 파워 분포',280,45);
  for(var i=0;i<12;i++){
    var y=60+i*27;
    var pow=v28.impactMap.zones[zoneKeys[i]]||0;
    var bw=(pow/maxPow)*200;
    var isKO=koZones.indexOf(zoneKeys[i])>=0;
    c.fillStyle='#222';c.fillRect(380,y,200,18);
    c.fillStyle=isKO?'#f59e0b':'#ef4444';c.fillRect(380,y,bw,18);
    c.fillStyle='#ccc';c.font='9px sans-serif';c.textAlign='right';c.fillText(zoneNames[i],375,y+13);c.textAlign='left';
    c.fillStyle='#fff';c.font='bold 9px sans-serif';c.fillText(pow,585,y+13);
    if(isKO){c.fillStyle='#f59e0b';c.font='bold 8px sans-serif';c.fillText('KO',595,y+13);}
  }
  c.fillStyle='#aaa';c.font='11px sans-serif';
  c.fillText('총 펜치: '+v28.impactMap.totalPunches,280,395);
  c.fillText('세션: '+v28.impactMap.sessions,450,395);
}
window._v28SimImpact = function(){
  var zoneKeys=['head','jaw','temple','nose','solarPlexus','liver','ribs','stomach','upperArm','chest','floating','belt'];
  for(var i=0;i<zoneKeys.length;i++) v28.impactMap.zones[zoneKeys[i]]=Math.round(Math.random()*80+10);
  v28.impactMap.totalPunches+=Math.round(Math.random()*50+30);v28.impactMap.sessions++;
  saveV28(v28);drawImpactCanvas();playSFX28('impact_hit');checkAchievementsV28();
};
window._v28ResetImpact = function(){
  v28.impactMap=defV28().impactMap;saveV28(v28);drawImpactCanvas();playSFX28('impact_ko');
};

// ============================================================
// SECTION 8: Comprehensive Fighter Growth Report (Canvas 620x400)
// ============================================================
var sec8 = document.createElement('div');
sec8.id = 'v28-sec-growth';
sec8.style.cssText = 'display:none;max-width:680px;margin:20px auto;padding:0 12px;';
sec8.innerHTML = '<div class="v28-card"><div class="v28-hdr">📊 종합 파이터 성장 보고서</div><div class="v28-sub">8 KPI 반원게이지 4x2 + 가중 종합등급 S~D + 20세션 히스토리 라인차트</div><canvas id="v28-cv-growth" width="620" height="400" style="width:100%;max-width:620px;border-radius:12px;background:#111;display:block;margin:0 auto"></canvas><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;justify-content:center"><button class="v28-btn" onclick="window._v28UpdateGrowth()">&#49457;&#51109; &#44592;&#47197;</button><button class="v28-btn-sec" onclick="window._v28ResetGrowth()">&#49457;&#51109; &#47532;&#49483;</button></div></div>';
document.body.appendChild(sec8);

function drawGrowthCanvas(){
  var cv = document.getElementById('v28-cv-growth'); if(!cv) return;
  var c = cv.getContext('2d');
  c.clearRect(0,0,620,400);c.fillStyle='#0a0a1a';c.fillRect(0,0,620,400);
  c.fillStyle='#f59e0b';c.font='bold 14px sans-serif';c.fillText('📊 종합 성장 보고서',10,25);
  var kpiNames=['Power','Speed','Defense','Stamina','Ring IQ','Footwork','Chin','Heart'];
  var kpiKeys=['power','speed','defense','stamina','ringIQ','footwork','chin','heart'];
  var kpiColors=['#ef4444','#f59e0b','#3b82f6','#22c55e','#a855f7','#ec4899','#14b8a6','#6b7280'];
  var cols=4,rows=2,gw=130,gh=75,gap=15;
  var startX=30,startY=50;
  var totalScore=0;
  for(var idx=0;idx<8;idx++){
    var row=Math.floor(idx/cols),col=idx%cols;
    var x=startX+col*(gw+gap),y=startY+row*(gh+gap+15);
    var val=v28.growthReport.kpis[kpiKeys[idx]]||50;
    totalScore+=val;
    var pct=val/100;
    c.fillStyle='rgba(255,255,255,0.03)';
    c.beginPath();c.moveTo(x+gw/2-35,y+gh);c.arc(x+gw/2,y+gh,35,-Math.PI,0);c.closePath();c.fill();
    c.strokeStyle='rgba(255,255,255,0.1)';c.lineWidth=4;
    c.beginPath();c.arc(x+gw/2,y+gh,32,-Math.PI,0);c.stroke();
    c.strokeStyle=kpiColors[idx];c.lineWidth=4;
    c.beginPath();c.arc(x+gw/2,y+gh,32,-Math.PI,-Math.PI+Math.PI*pct);c.stroke();c.lineWidth=1;
    c.fillStyle='#fff';c.font='bold 13px sans-serif';c.textAlign='center';
    c.fillText(val+'%',x+gw/2,y+gh-8);
    c.fillStyle=kpiColors[idx];c.font='bold 10px sans-serif';
    c.fillText(kpiNames[idx],x+gw/2,y+gh+14);
    var g=gradeOf(val);
    c.fillStyle=kpiColors[idx];c.font='bold 9px sans-serif';
    c.fillText(g,x+gw/2,y+20);
    c.textAlign='left';
  }
  var avgScore=Math.round(totalScore/8);
  var overallGrade=gradeOf(avgScore);
  c.fillStyle='#f59e0b';c.font='bold 16px sans-serif';c.fillText('종합 등급: '+overallGrade+' ('+avgScore+'%)',30,260);
  c.fillStyle='#f59e0b';c.font='bold 12px sans-serif';c.fillText('20세션 성장 히스토리',30,285);
  var hist=v28.growthReport.history||[];
  if(hist.length>0){
    var hx=30,hy=300,hw=560,hh=80;
    c.strokeStyle='rgba(255,255,255,0.1)';c.strokeRect(hx,hy,hw,hh);
    var maxH=100;
    for(var i=0;i<hist.length;i++){
      var x=hx+i*(hw/Math.max(hist.length-1,1));
      var y2=hy+hh-(hist[i]/maxH)*hh;
      if(i>0){
        var px=hx+(i-1)*(hw/Math.max(hist.length-1,1));
        var py=hy+hh-(hist[i-1]/maxH)*hh;
        c.strokeStyle='#f59e0b';c.lineWidth=2;c.beginPath();c.moveTo(px,py);c.lineTo(x,y2);c.stroke();c.lineWidth=1;
      }
      c.fillStyle='#f59e0b';c.beginPath();c.arc(x,y2,3,0,Math.PI*2);c.fill();
    }
  }
  c.fillStyle='#888';c.font='10px sans-serif';c.fillText('세션: '+(v28.growthReport.sessions||0),500,285);
}
window._v28UpdateGrowth = function(){
  var kpiKeys=['power','speed','defense','stamina','ringIQ','footwork','chin','heart'];
  for(var i=0;i<8;i++) v28.growthReport.kpis[kpiKeys[i]]=Math.min(100,v28.growthReport.kpis[kpiKeys[i]]+Math.round(Math.random()*8));
  var total=0;for(var i=0;i<8;i++) total+=v28.growthReport.kpis[kpiKeys[i]];
  var avg=Math.round(total/8);
  v28.growthReport.history=v28.growthReport.history||[];
  v28.growthReport.history.push(avg);
  if(v28.growthReport.history.length>20) v28.growthReport.history.shift();
  v28.growthReport.overallGrade=gradeOf(avg);
  v28.growthReport.sessions++;saveV28(v28);drawGrowthCanvas();playSFX28('growth_level');checkAchievementsV28();
};
window._v28ResetGrowth = function(){
  v28.growthReport=defV28().growthReport;saveV28(v28);drawGrowthCanvas();playSFX28('growth_level');
};

// ============================================================
// QUIZ V28: 15 Questions (285->300)
// ============================================================
var quizV28Data = [
  {q:'복싱에서 심박수 ‘Peak Zone’은 어느 범위인가?',a:['<100 bpm','100-130 bpm','155-175 bpm','> 200 bpm'],c:2},
  {q:'프로 복서의 평균 잽 속도는?',a:['10-15 mph','25-32 mph','45-55 mph','70+ mph'],c:1},
  {q:'‘Rope-a-Dope’ 전술을 유명하게 사용한 복서는?',a:['마이크 타이슨','무하마드 알리','플로이드 메이웨더','매니 파키아오'],c:2},
  {q:'‘Counter Puncher’ 아키타입의 핵심 강점은?',a:['압박력','반격 타이밍','파워 펜치','풀워크'],c:1},
  {q:'복싱 트레이닝의 ‘Base Phase’에서 주로 하는 것은?',a:['최대 강도 스파링','기초 체력 건설','시합 준비','회복 휘식'],c:1},
  {q:'‘Solar Plexus’ 타격이 위험한 이유는?',a:['뼈가 부러진다','횟격막 경련','근육파열','탈수'],c:1},
  {q:'‘VO2Max Zone’에서의 운동 효과는?',a:['지방 연소','근지구력 향상','최대 산소 섭취 능력 향상','근비대 성장'],c:2},
  {q:'섹도복싱에서 ‘코레오그래피’의 목적은?',a:['근력 향상','운동 순서 구조화','체중 감량','유연성 향상'],c:1},
  {q:'‘페인트(Feint)’ 전술의 핵심 목적은?',a:['상대 KO','상대 반응 유도 후 빈틈 공격','체력 절약','파울 무효화'],c:1},
  {q:'KO 존(Knockout Zone)으로 분류되는 부위가 아닌 것은?',a:['Jaw','Temple','Liver','Upper Arm'],c:3},
  {q:'‘Pressure Fighter’의 약점은?',a:['스피드','지구력','파워','카운터'],c:1},
  {q:'‘Peak Phase’ 트레이닝의 특징은?',a:['낮은 강도 회복','최고 강도 시합 시뮬','기초 체력 구축','기술 연마'],c:1},
  {q:'‘Cut Off’ 전술은 어떤 상대에게 효과적인가?',a:['Slugger','Out-Boxer','Counter Puncher','Brawler'],c:1},
  {q:'‘복싱 모빌리티’에서 가장 중요한 관절은?',a:['손목','고관절(Hip)','팔꿈치','손가락'],c:1},
  {q:'12라운드 경기에서 ‘페이싱(Pacing)’의 핵심은?',a:['모든 라운드 최대 출력','에너지 분배 최적화','초반 KO 시도','후반 집중'],c:1}
];

var secQuiz = document.createElement('div');
secQuiz.id = 'v28-sec-quiz';
secQuiz.style.cssText = 'display:none;max-width:680px;margin:20px auto;padding:0 12px;';
var quizHtml = '<div class="v28-card"><div class="v28-hdr">🎯 복싱 퀀즈 v28 (15문)</div>';
for(var qi=0;qi<quizV28Data.length;qi++){
  var qq=quizV28Data[qi];
  quizHtml += '<div style="margin:10px 0;padding:10px;background:var(--surface);border-radius:10px"><div style="font-size:12px;font-weight:700;margin-bottom:6px">Q'+(qi+1)+'. '+qq.q+'</div>';
  for(var ai=0;ai<qq.a.length;ai++){
    quizHtml += '<button onclick="window._v28QuizAnswer('+qi+','+ai+')" style="display:block;width:100%;text-align:left;padding:6px 10px;margin:3px 0;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;color:var(--text,#f0f0f0);font-size:11px;cursor:pointer" id="v28-q'+qi+'-a'+ai+'">'+qq.a[ai]+'</button>';
  }
  quizHtml += '<div id="v28-q'+qi+'-result" style="font-size:11px;margin-top:4px;min-height:16px"></div></div>';
}
quizHtml += '</div>';
secQuiz.innerHTML = quizHtml;
document.body.appendChild(secQuiz);

window._v28QuizAnswer = function(qi, ai){
  var qq=quizV28Data[qi];
  var resEl=document.getElementById('v28-q'+qi+'-result');
  if(v28.quizV28Scores[qi] !== undefined) return;
  var correct = ai === qq.c;
  v28.quizV28Scores[qi] = correct ? 1 : 0;
  for(var j=0;j<qq.a.length;j++){
    var btn=document.getElementById('v28-q'+qi+'-a'+j);
    if(j===qq.c) btn.style.border='2px solid #22c55e';
    else if(j===ai && !correct) btn.style.border='2px solid #ef4444';
    btn.style.pointerEvents='none';
  }
  resEl.innerHTML=correct?'<span style="color:#22c55e">✅ 정답!</span>':'<span style="color:#ef4444">❌ 오답. 정답: '+qq.a[qq.c]+'</span>';
  saveV28(v28);
  if(correct) playSFX28('quiz_correct28');
  checkAchievementsV28();
};

// ============================================================
// ACHIEVEMENTS V28 (+12, 250->262)
// ============================================================
var achieveV28Defs = [
  {id:'a28_hr_sim',name:'HR 시뮬레이터',desc:'심박존 시뮬레이션 1회 완료',check:function(){return v28.hrZone.sessions>=1}},
  {id:'a28_speed_test',name:'스피드 테스터',desc:'펜치 속도 측정 1회 완료',check:function(){return (v28.punchSpeed.sessions||[]).length>=1}},
  {id:'a28_choreo_1',name:'코레오 찫걸음',desc:'코레오그래피 루틴 1회 완료',check:function(){return v28.choreography.completedRoutines>=1}},
  {id:'a28_choreo_5',name:'코레오 마스터',desc:'코레오그래피 루틴 5회 완료',check:function(){return v28.choreography.completedRoutines>=5}},
  {id:'a28_archetype',name:'아키타입 발견',desc:'파이터 아키타입 분석 1회',check:function(){return v28.archetype.sessions>=1}},
  {id:'a28_season_half',name:'시즌 중반',desc:'시즌플래너 6주차 도달',check:function(){return v28.seasonPlan.currentWeek>=6}},
  {id:'a28_season_done',name:'시즌 완주',desc:'시즌플래너 12주 완주',check:function(){return v28.seasonPlan.completedPhases>=4}},
  {id:'a28_mind_5',name:'심리전사',desc:'심리전 드릴 5회 완료',check:function(){return v28.mindGames.drillsDone>=5}},
  {id:'a28_impact_sim',name:'임팩트 분석가',desc:'임팩트 시뮬 1회 완료',check:function(){return v28.impactMap.sessions>=1}},
  {id:'a28_growth_3',name:'성장 기록가',desc:'성장 보고서 3회 기록',check:function(){return v28.growthReport.sessions>=3}},
  {id:'a28_quiz_10',name:'퀀즈 도전자 v28',desc:'v28 퀀즈 10문 정답',check:function(){var cnt=0;for(var k in v28.quizV28Scores)if(v28.quizV28Scores[k]===1)cnt++;return cnt>=10}},
  {id:'a28_all_features',name:'v28 마스터',desc:'v28 모든 기능 사용',check:function(){var keys=['hrZone','punchSpeed','choreo','archetype','season','mindGames','impactMap','growth'];for(var i=0;i<keys.length;i++)if(!v28.featureUsage28[keys[i]])return false;return true}}
];

function checkAchievementsV28(){
  var newUnlock = false;
  achieveV28Defs.forEach(function(ad){
    if(!v28.achievementsV28[ad.id] && ad.check()){
      v28.achievementsV28[ad.id] = true;
      newUnlock = true;
    }
  });
  if(newUnlock) saveV28(v28);
}

// ============================================================
// NAVIGATION: append buttons to existing bar (NO new bottom bar)
// ============================================================
function addV28Nav(){
  var features = [
    {id:'hrZone',label:'심박존',sec:sec1},
    {id:'punchSpeed',label:'속도레이더',sec:sec2},
    {id:'choreo',label:'코레오',sec:sec3},
    {id:'archetype',label:'아키타입',sec:sec4},
    {id:'season',label:'시즌',sec:sec5},
    {id:'mindGames',label:'심리전',sec:sec6},
    {id:'impactMap',label:'임팩트맵',sec:sec7},
    {id:'growth',label:'성장보고',sec:sec8},
    {id:'quizV28',label:'퀀즈v28',sec:secQuiz}
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
    btn.style.cssText = 'padding:6px 10px;background:linear-gradient(135deg,rgba(245,158,11,0.15),rgba(217,119,6,0.15));border:1px solid rgba(251,191,36,0.3);border-radius:8px;color:#fbbf24;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .2s;flex-shrink:0;';
    btn.textContent = f.label;
    btn.onclick = function(){
      document.querySelectorAll('[id^="v28-sec-"]').forEach(function(s){ s.style.display = 'none'; });
      f.sec.style.display = 'block';
      v28.featureUsage28[f.id] = true;
      saveV28(v28);
      checkAchievementsV28();
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
  var featureIds = ['hrZone','punchSpeed','choreo','archetype','season','mindGames','impactMap','growth','quizV28'];
  var idx = keys.indexOf(e.key.toUpperCase());
  if(idx === -1 && e.key === '(') idx = 8;
  if(idx >= 0 && idx < sections.length){
    e.preventDefault();
    document.querySelectorAll('[id^="v28-sec-"]').forEach(function(s){ s.style.display = 'none'; });
    sections[idx].style.display = 'block';
    v28.featureUsage28[featureIds[idx]] = true;
    saveV28(v28);
    checkAchievementsV28();
  }
});

// ============================================================
// INIT
// ============================================================
setTimeout(function(){
  addV28Nav();
  drawHRCanvas();
  drawSpeedCanvas();
  drawChoreoCanvas();
  drawArchetypeCanvas();
  drawSeasonCanvas();
  drawMindCanvas();
  drawImpactCanvas();
  drawGrowthCanvas();
  checkAchievementsV28();
}, 850);

})();
