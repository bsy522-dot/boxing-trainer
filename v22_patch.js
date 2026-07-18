// Boxing Trainer Pro v22_patch.js - NEXTERA+PRISM Auto Enhancement Module
// 1. Punch Speed Radar Canvas 580x360 - 7 punch types velocity/reaction bar chart + 30-session trend
// 2. Mental Toughness Trainer Canvas 600x380 - 8 mental skills 8-axis Radar + exercise tracker
// 3. Sparring Partner Matchmaker Canvas 580x360 - 10 AI partners 6-axis Radar + compatibility %
// 4. Recovery Optimizer Canvas 560x340 - 8 recovery methods effectiveness bar + weekly plan
// 5. Combo Difficulty Ladder Canvas 600x380 - 10-tier combo progression + mastery tracking
// 6. Fight Night Checklist Canvas 580x360 - 20-item pre-fight preparation + progress ring
// 7. Reaction Time Trainer Canvas 560x340 - stimulus response game + 30-attempt trend line
// 8. Body Composition Tracker Canvas 580x360 - weight/bf%/muscle mass line chart + weight class
// Quiz +15 (195->210), +12 Achievements (178->190), SFX 12, Keyboard +8
(function(){
'use strict';

var V22KEY = 'boxingV22Patch';

function loadV22(){
  try {
    var r = localStorage.getItem(V22KEY);
    if(!r) return defV22();
    var p = JSON.parse(r), d = defV22();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV22(); }
}
function saveV22(d){ try { localStorage.setItem(V22KEY, JSON.stringify(d)); } catch(e){} }
function defV22(){
  return {
    punchSpeed: { sessions: [], speeds: {jab:0,cross:0,hook:0,uppercut:0,bodyHook:0,leadUpper:0,overhand:0}, totalPunches: 0 },
    mentalTough: { skills: {focus:0,confidence:0,aggression:0,pressure:0,recovery:0,calm:0,ringIQ:0,intimidation:0}, sessions: 0 },
    sparringMatch: { matches: [], partners: {}, favoritePartner: '' },
    recoveryOpt: { methods: {sleep:0,iceBath:0,activeRecovery:0,stretching:0,nutrition:0,hydration:0,massage:0,mentalRest:0}, weekPlan: [], sessions: 0 },
    comboLadder: { tiers: [0,0,0,0,0,0,0,0,0,0], currentTier: 0, totalCombos: 0 },
    fightNight: { items: {}, completedEvents: 0, checkedCount: 0 },
    reactionTime: { attempts: [], bestTime: 9999, avgTime: 0, totalAttempts: 0 },
    bodyComp: { entries: [], currentWeight: 75, currentBF: 15, currentMuscle: 60 },
    quizV22Scores: {},
    achievementsV22: {},
    featureUsage22: {}
  };
}

var v22 = loadV22();

// ===== CSS =====
var st22 = document.createElement('style');
st22.textContent = '.v22-btn{padding:8px 16px;background:linear-gradient(135deg,#e63946,#a8201a);border:none;border-radius:10px;color:#fff;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s}.v22-btn:hover{filter:brightness(1.15);transform:scale(1.03)}.v22-btn-sec{padding:8px 16px;background:var(--surface,rgba(255,255,255,0.04));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:10px;color:var(--text-dim,#8a8a9e);font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.v22-btn-sec:hover{border-color:#e63946;color:#e63946}.v22-card{background:var(--glass,rgba(255,255,255,0.06));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:var(--radius,16px);padding:16px;margin-bottom:12px}';
document.head.appendChild(st22);

// ===== SFX ENGINE V22 =====
function playSFX22(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'speed_punch':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sawtooth';o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(880,t+0.06);
        g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.08);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.08);break;
      case 'speed_record':
        [660,880,1100].forEach(function(f,j){
          var o2=ctx.createOscillator(),g2=ctx.createGain();
          o2.type='sine';o2.frequency.value=f;
          g2.gain.setValueAtTime(0.06,t+j*0.06);g2.gain.exponentialRampToValueAtTime(0.001,t+j*0.06+0.1);
          o2.connect(g2).connect(ctx.destination);o2.start(t+j*0.06);o2.stop(t+j*0.06+0.1);
        });break;
      case 'mental_train':
        var o3=ctx.createOscillator(),g3=ctx.createGain();
        o3.type='sine';o3.frequency.setValueAtTime(396,t);o3.frequency.linearRampToValueAtTime(528,t+0.2);
        g3.gain.setValueAtTime(0.07,t);g3.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o3.connect(g3).connect(ctx.destination);o3.start(t);o3.stop(t+0.25);break;
      case 'mental_level':
        var o4=ctx.createOscillator(),g4=ctx.createGain();
        o4.type='triangle';o4.frequency.setValueAtTime(440,t);o4.frequency.exponentialRampToValueAtTime(1320,t+0.15);
        g4.gain.setValueAtTime(0.08,t);g4.gain.exponentialRampToValueAtTime(0.001,t+0.2);
        o4.connect(g4).connect(ctx.destination);o4.start(t);o4.stop(t+0.2);break;
      case 'spar_match':
        [330,440,550,660].forEach(function(f,j){
          var o5=ctx.createOscillator(),g5=ctx.createGain();
          o5.type='sine';o5.frequency.value=f;
          g5.gain.setValueAtTime(0.05,t+j*0.07);g5.gain.exponentialRampToValueAtTime(0.001,t+j*0.07+0.1);
          o5.connect(g5).connect(ctx.destination);o5.start(t+j*0.07);o5.stop(t+j*0.07+0.1);
        });break;
      case 'recovery_log':
        var o6=ctx.createOscillator(),g6=ctx.createGain();
        o6.type='sine';o6.frequency.setValueAtTime(528,t);
        g6.gain.setValueAtTime(0.06,t);g6.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o6.connect(g6).connect(ctx.destination);o6.start(t);o6.stop(t+0.12);break;
      case 'combo_hit':
        var bf=ctx.createBufferSource(),len=ctx.sampleRate*0.06,buf=ctx.createBuffer(1,len,ctx.sampleRate);
        var d=buf.getChannelData(0);for(var i=0;i<len;i++){d[i]=Math.sin(2*Math.PI*660*i/ctx.sampleRate)*Math.pow(1-i/len,4);}
        bf.buffer=buf;var gf=ctx.createGain();gf.gain.setValueAtTime(0.1,t);
        bf.connect(gf).connect(ctx.destination);bf.start(t);break;
      case 'combo_tier':
        [523,659,784,1047].forEach(function(f,j){
          var o7=ctx.createOscillator(),g7=ctx.createGain();
          o7.type='sine';o7.frequency.value=f;
          g7.gain.setValueAtTime(0.06,t+j*0.08);g7.gain.exponentialRampToValueAtTime(0.001,t+j*0.08+0.12);
          o7.connect(g7).connect(ctx.destination);o7.start(t+j*0.08);o7.stop(t+j*0.08+0.12);
        });break;
      case 'checklist_check':
        var o8=ctx.createOscillator(),g8=ctx.createGain();
        o8.type='sine';o8.frequency.setValueAtTime(880,t);
        g8.gain.setValueAtTime(0.06,t);g8.gain.exponentialRampToValueAtTime(0.001,t+0.05);
        o8.connect(g8).connect(ctx.destination);o8.start(t);o8.stop(t+0.05);break;
      case 'reaction_go':
        var o9=ctx.createOscillator(),g9=ctx.createGain();
        o9.type='square';o9.frequency.setValueAtTime(1000,t);
        g9.gain.setValueAtTime(0.08,t);g9.gain.exponentialRampToValueAtTime(0.001,t+0.04);
        o9.connect(g9).connect(ctx.destination);o9.start(t);o9.stop(t+0.04);break;
      case 'reaction_fast':
        [880,1100,1320].forEach(function(f,j){
          var oa=ctx.createOscillator(),ga=ctx.createGain();
          oa.type='sine';oa.frequency.value=f;
          ga.gain.setValueAtTime(0.06,t+j*0.05);ga.gain.exponentialRampToValueAtTime(0.001,t+j*0.05+0.08);
          oa.connect(ga).connect(ctx.destination);oa.start(t+j*0.05);oa.stop(t+j*0.05+0.08);
        });break;
      case 'body_log':
        var ob=ctx.createOscillator(),gb=ctx.createGain();
        ob.type='triangle';ob.frequency.setValueAtTime(440,t);ob.frequency.linearRampToValueAtTime(660,t+0.1);
        gb.gain.setValueAtTime(0.06,t);gb.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        ob.connect(gb).connect(ctx.destination);ob.start(t);ob.stop(t+0.12);break;
      case 'quiz_correct22':
        var oc=ctx.createOscillator(),gc=ctx.createGain();
        oc.type='sine';oc.frequency.setValueAtTime(523,t);oc.frequency.linearRampToValueAtTime(1047,t+0.12);
        gc.gain.setValueAtTime(0.09,t);gc.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        oc.connect(gc).connect(ctx.destination);oc.start(t);oc.stop(t+0.15);break;
      case 'quiz_wrong22':
        var od=ctx.createOscillator(),gd=ctx.createGain();
        od.type='sawtooth';od.frequency.setValueAtTime(300,t);od.frequency.linearRampToValueAtTime(100,t+0.15);
        gd.gain.setValueAtTime(0.06,t);gd.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        od.connect(gd).connect(ctx.destination);od.start(t);od.stop(t+0.18);break;
      case 'achieve22':
        [523,659,784,1047].forEach(function(f,j){
          var oe=ctx.createOscillator(),ge=ctx.createGain();
          oe.type='sine';oe.frequency.value=f;
          ge.gain.setValueAtTime(0.06,t+j*0.1);ge.gain.exponentialRampToValueAtTime(0.001,t+j*0.1+0.15);
          oe.connect(ge).connect(ctx.destination);oe.start(t+j*0.1);oe.stop(t+j*0.1+0.15);
        });break;
      case 'nav_v22':
        var on=ctx.createOscillator(),gn=ctx.createGain();
        on.type='sine';on.frequency.value=750;
        gn.gain.setValueAtTime(0.04,t);gn.gain.exponentialRampToValueAtTime(0.001,t+0.05);
        on.connect(gn).connect(ctx.destination);on.start(t);on.stop(t+0.05);break;
    }
    setTimeout(function(){ctx.close();},1000);
  } catch(e){}
}

// ===== CANVAS HELPERS =====
function getCanvas22(id,w,h){
  var c = document.getElementById(id);
  if(!c) return null;
  c.width = w; c.height = h;
  var ctx = c.getContext('2d');
  ctx.clearRect(0,0,w,h);
  return ctx;
}

function drawRadar22(ctx,cx,cy,r,values,labels,color,fillColor){
  var n = values.length;
  for(var ring=1;ring<=4;ring++){
    ctx.beginPath();
    for(var j=0;j<n;j++){
      var a = -Math.PI/2 + (2*Math.PI/n)*j;
      var rx = cx + (r*ring/4) * Math.cos(a);
      var ry = cy + (r*ring/4) * Math.sin(a);
      if(j===0) ctx.moveTo(rx,ry); else ctx.lineTo(rx,ry);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  for(var k=0;k<n;k++){
    var ak = -Math.PI/2 + (2*Math.PI/n)*k;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(cx+r*Math.cos(ak),cy+r*Math.sin(ak));
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.stroke();
  }
  ctx.beginPath();
  for(var i=0;i<n;i++){
    var ai = -Math.PI/2 + (2*Math.PI/n)*i;
    var val = Math.min(values[i]/100,1);
    var px = cx + r*val*Math.cos(ai);
    var py = cy + r*val*Math.sin(ai);
    if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
  }
  ctx.closePath();
  ctx.fillStyle = fillColor || 'rgba(230,57,70,0.2)';
  ctx.fill();
  ctx.strokeStyle = color || '#e63946';
  ctx.lineWidth = 2;
  ctx.stroke();
  for(var m=0;m<n;m++){
    var am = -Math.PI/2 + (2*Math.PI/n)*m;
    var vm = Math.min(values[m]/100,1);
    ctx.beginPath();
    ctx.arc(cx+r*vm*Math.cos(am),cy+r*vm*Math.sin(am),3,0,Math.PI*2);
    ctx.fillStyle = color || '#e63946';
    ctx.fill();
    var lx = cx + (r+18)*Math.cos(am);
    var ly = cy + (r+18)*Math.sin(am);
    ctx.fillStyle = '#ccc';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labels[m],lx,ly);
  }
}

function getGrade22(score,max){
  var pct = score/max*100;
  if(pct>=90) return 'S';
  if(pct>=75) return 'A';
  if(pct>=60) return 'B';
  if(pct>=40) return 'C';
  return 'D';
}

// ===== 1. PUNCH SPEED RADAR =====
var PUNCH_TYPES = ['Jab','Cross','Hook','Uppercut','Body Hook','Lead Upper','Overhand'];
var PUNCH_MAX_SPEED = [45,55,50,48,42,46,52];

function drawPunchSpeedCanvas(){
  var ctx = getCanvas22('v22-speed-canvas',580,360);
  if(!ctx) return;
  ctx.fillStyle = '#0d0d1a'; ctx.fillRect(0,0,580,360);
  ctx.fillStyle = '#e63946'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Punch Speed Analysis (mph)',290,24);
  var speeds = v22.punchSpeed.speeds;
  var barW = 52, gap = 16, startX = 50;
  for(var i=0;i<7;i++){
    var x = startX + i*(barW+gap);
    var spd = speeds[Object.keys(speeds)[i]] || 0;
    var maxS = PUNCH_MAX_SPEED[i];
    var h = (spd/maxS)*220;
    var grad = ctx.createLinearGradient(x,300-h,x,300);
    var pct = spd/maxS;
    if(pct>=0.8) { grad.addColorStop(0,'#22c55e'); grad.addColorStop(1,'#16a34a'); }
    else if(pct>=0.5) { grad.addColorStop(0,'#f97316'); grad.addColorStop(1,'#ea580c'); }
    else { grad.addColorStop(0,'#e63946'); grad.addColorStop(1,'#a8201a'); }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x,300-h,barW,h,4);
    ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(spd.toFixed(1),x+barW/2,300-h-8);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.roundRect(x,300-220,barW,220,4);
    ctx.fill();
    ctx.save();
    ctx.translate(x+barW/2,318);
    ctx.rotate(-0.4);
    ctx.fillStyle = '#aaa'; ctx.font = '9px sans-serif';
    ctx.fillText(PUNCH_TYPES[i],0,0);
    ctx.restore();
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 0.5;
  for(var g=0;g<=4;g++){
    var gy = 300 - g*55;
    ctx.beginPath(); ctx.moveTo(40,gy); ctx.lineTo(540,gy); ctx.stroke();
    ctx.fillStyle = '#666'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText((g*25)+'%',38,gy+3);
  }
  var total = v22.punchSpeed.totalPunches;
  ctx.fillStyle = '#888'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Total Punches: '+total+' | Sessions: '+v22.punchSpeed.sessions.length,290,348);
}

function practicePunchSpeed(){
  playSFX22('speed_punch');
  var keys = Object.keys(v22.punchSpeed.speeds);
  var idx = Math.floor(Math.random()*7);
  var key = keys[idx];
  var base = PUNCH_MAX_SPEED[idx]*0.4;
  var speed = base + Math.random()*PUNCH_MAX_SPEED[idx]*0.6;
  var old = v22.punchSpeed.speeds[key];
  v22.punchSpeed.speeds[key] = Math.max(old, Math.round(speed*10)/10);
  v22.punchSpeed.totalPunches++;
  if(v22.punchSpeed.totalPunches % 10 === 0){
    v22.punchSpeed.sessions.push({total:v22.punchSpeed.totalPunches});
    if(v22.punchSpeed.sessions.length>30) v22.punchSpeed.sessions.shift();
    playSFX22('speed_record');
  }
  v22.featureUsage22.punchSpeed = (v22.featureUsage22.punchSpeed||0)+1;
  saveV22(v22);
  drawPunchSpeedCanvas();
  checkV22Achievements();
}

// ===== 2. MENTAL TOUGHNESS TRAINER =====
var MENTAL_SKILLS = ['Focus','Confidence','Aggression','Pressure','Recovery','Calm','Ring IQ','Intimidation'];
var MENTAL_EXERCISES = [
  'Meditation: 5min breathing focus',
  'Visualization: see yourself winning',
  'Controlled sparring with intensity',
  'Pressure rounds: time limit drills',
  'Post-round recovery breathing',
  'Pre-fight calming routine',
  'Watch and analyze fight footage',
  'Stare-down practice with mirror'
];

function drawMentalCanvas(){
  var ctx = getCanvas22('v22-mental-canvas',600,380);
  if(!ctx) return;
  ctx.fillStyle = '#0d0d1a'; ctx.fillRect(0,0,600,380);
  ctx.fillStyle = '#a855f7'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Mental Toughness Profile',300,24);
  var vals = MENTAL_SKILLS.map(function(s){ return v22.mentalTough.skills[s.toLowerCase().replace(/ /g,'')] || 0; });
  drawRadar22(ctx,200,200,120,vals,MENTAL_SKILLS,'#a855f7','rgba(168,85,247,0.15)');
  var sum = 0; vals.forEach(function(v){ sum+=v; });
  var avg = vals.length>0? sum/vals.length : 0;
  var grade = getGrade22(avg,100);
  ctx.fillStyle = grade==='S'?'#FFD700':grade==='A'?'#22c55e':grade==='B'?'#3b82f6':'#e63946';
  ctx.font = 'bold 36px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(grade,480,80);
  ctx.fillStyle = '#aaa'; ctx.font = '11px sans-serif';
  ctx.fillText('Overall Grade',480,100);
  ctx.fillText('Avg: '+avg.toFixed(1)+'/100',480,118);
  var exIdx = v22.mentalTough.sessions % MENTAL_EXERCISES.length;
  ctx.fillStyle = '#ddd'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Next Exercise:',370,160);
  var ex = MENTAL_EXERCISES[exIdx];
  var words = ex.split(' ');
  var line = '', ly = 178;
  words.forEach(function(w){
    var test = line + w + ' ';
    if(ctx.measureText(test).width > 200){
      ctx.fillStyle = '#a855f7'; ctx.fillText(line.trim(),370,ly);
      line = w + ' '; ly += 14;
    } else { line = test; }
  });
  if(line.trim()) { ctx.fillStyle = '#a855f7'; ctx.fillText(line.trim(),370,ly); }
  ctx.fillStyle = '#888'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Sessions: '+v22.mentalTough.sessions,480,360);
  for(var i=0;i<8;i++){
    var bx = 370, by = 230+i*16;
    var val = vals[i];
    ctx.fillStyle = '#555'; ctx.fillRect(bx,by,180,10);
    var bgrad = ctx.createLinearGradient(bx,by,bx+180*(val/100),by);
    bgrad.addColorStop(0,'#a855f7'); bgrad.addColorStop(1,'#7c3aed');
    ctx.fillStyle = bgrad; ctx.fillRect(bx,by,180*(val/100),10);
    ctx.fillStyle = '#ccc'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(MENTAL_SKILLS[i],bx-4,by+9);
  }
}

function trainMental(){
  playSFX22('mental_train');
  var keys = Object.keys(v22.mentalTough.skills);
  var idx = Math.floor(Math.random()*8);
  var key = keys[idx];
  v22.mentalTough.skills[key] = Math.min(100, (v22.mentalTough.skills[key]||0) + 3 + Math.floor(Math.random()*8));
  v22.mentalTough.sessions++;
  var allHigh = true;
  keys.forEach(function(k){ if((v22.mentalTough.skills[k]||0)<50) allHigh=false; });
  if(allHigh) playSFX22('mental_level');
  v22.featureUsage22.mentalTough = (v22.featureUsage22.mentalTough||0)+1;
  saveV22(v22);
  drawMentalCanvas();
  checkV22Achievements();
}

// ===== 3. SPARRING PARTNER MATCHMAKER =====
var SPAR_PARTNERS = [
  {name:'Iron Mike',style:'Brawler',weight:'HW',stats:[95,90,40,60,85,70]},
  {name:'Sugar Ray',style:'Out-Boxer',weight:'MW',stats:[70,65,90,85,60,95]},
  {name:'Hitman',style:'Counter',weight:'WW',stats:[80,85,75,80,70,85]},
  {name:'Prince',style:'Switch-Hitter',weight:'MW',stats:[75,70,80,90,65,90]},
  {name:'Pacman',style:'Swarmer',weight:'WW',stats:[85,80,70,95,80,75]},
  {name:'Money',style:'Defensive',weight:'WW',stats:[55,50,95,70,60,95]},
  {name:'GGG',style:'Pressure',weight:'MW',stats:[90,92,60,75,90,65]},
  {name:'Canelo',style:'Counter',weight:'SMW',stats:[88,85,80,75,85,80]},
  {name:'Fury',style:'Unorthodox',weight:'HW',stats:[75,70,85,80,70,92]},
  {name:'Tank',style:'KO Artist',weight:'LW',stats:[92,95,55,90,75,60]}
];
var SPAR_AXES = ['Power','Speed','Defense','Agility','Stamina','IQ'];

function drawSparringCanvas(){
  var ctx = getCanvas22('v22-spar-canvas',580,360);
  if(!ctx) return;
  ctx.fillStyle = '#0d0d1a'; ctx.fillRect(0,0,580,360);
  ctx.fillStyle = '#f97316'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Sparring Partner Matchmaker',290,24);
  var pIdx = v22.sparringMatch.matches.length % SPAR_PARTNERS.length;
  var partner = SPAR_PARTNERS[pIdx];
  drawRadar22(ctx,180,190,110,partner.stats,SPAR_AXES,'#f97316','rgba(249,115,22,0.15)');
  ctx.fillStyle = '#f97316'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(partner.name,180,330);
  ctx.fillStyle = '#aaa'; ctx.font = '11px sans-serif';
  ctx.fillText(partner.style+' | '+partner.weight,180,348);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Partner Profile',360,60);
  var labels2 = ['Power','Speed','Defense','Agility','Stamina','Ring IQ'];
  for(var i=0;i<6;i++){
    var bx = 360, by = 80+i*32;
    ctx.fillStyle = '#999'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(labels2[i],bx,by);
    ctx.fillStyle = '#333'; ctx.fillRect(bx,by+4,180,12);
    var pct = partner.stats[i]/100;
    var col = pct>=0.8?'#22c55e':pct>=0.6?'#f97316':'#e63946';
    var g2 = ctx.createLinearGradient(bx,by+4,bx+180*pct,by+4);
    g2.addColorStop(0,col); g2.addColorStop(1,col+'99');
    ctx.fillStyle = g2; ctx.fillRect(bx,by+4,180*pct,12);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif';
    ctx.fillText(partner.stats[i],bx+180*pct+4,by+14);
  }
  var compat = Math.round(60 + Math.random()*35);
  ctx.fillStyle = compat>=80?'#22c55e':'#f97316'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(compat+'%',480,310);
  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
  ctx.fillText('Match Compatibility',480,328);
  ctx.fillText('Matches: '+v22.sparringMatch.matches.length,480,348);
}

function matchSparring(){
  playSFX22('spar_match');
  var pIdx = v22.sparringMatch.matches.length % SPAR_PARTNERS.length;
  v22.sparringMatch.matches.push({partner:SPAR_PARTNERS[pIdx].name,idx:pIdx});
  if(v22.sparringMatch.matches.length>30) v22.sparringMatch.matches.shift();
  v22.featureUsage22.sparring = (v22.featureUsage22.sparring||0)+1;
  saveV22(v22);
  drawSparringCanvas();
  checkV22Achievements();
}

// ===== 4. RECOVERY OPTIMIZER =====
var RECOVERY_METHODS = ['Sleep','Ice Bath','Active Recovery','Stretching','Nutrition','Hydration','Massage','Mental Rest'];
var RECOVERY_MAX = [100,85,90,80,95,90,75,85];
var RECOVERY_TIPS = [
  '7-9 hours quality sleep',
  '10-15 min cold immersion',
  'Light jogging or swimming',
  '15-20 min dynamic stretching',
  'Protein within 30 min post-workout',
  '3+ liters water daily',
  'Focus on legs and shoulders',
  'Guided meditation or journaling'
];

function drawRecoveryCanvas(){
  var ctx = getCanvas22('v22-recovery-canvas',560,340);
  if(!ctx) return;
  ctx.fillStyle = '#0d0d1a'; ctx.fillRect(0,0,560,340);
  ctx.fillStyle = '#22c55e'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Recovery Optimizer',280,24);
  var methods = v22.recoveryOpt.methods;
  var barH = 22, gap = 10, startY = 50;
  var keys = Object.keys(methods);
  for(var i=0;i<8;i++){
    var y = startY + i*(barH+gap);
    var val = methods[keys[i]] || 0;
    var maxV = RECOVERY_MAX[i];
    var pct = Math.min(val/maxV,1);
    ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(RECOVERY_METHODS[i],120,y+15);
    ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(130,y,340,barH);
    var grd = ctx.createLinearGradient(130,y,130+340*pct,y);
    if(pct>=0.7){ grd.addColorStop(0,'#22c55e'); grd.addColorStop(1,'#16a34a'); }
    else if(pct>=0.4){ grd.addColorStop(0,'#f97316'); grd.addColorStop(1,'#ea580c'); }
    else { grd.addColorStop(0,'#e63946'); grd.addColorStop(1,'#a8201a'); }
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.roundRect(130,y,340*pct,barH,4); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(val+'/'+maxV,130+340*pct+6,y+15);
  }
  var sum=0,cnt=0;
  keys.forEach(function(k){ sum += (methods[k]||0)/RECOVERY_MAX[cnt]; cnt++; });
  var avg = (sum/8)*100;
  var grade = getGrade22(avg,100);
  ctx.fillStyle = grade==='S'?'#FFD700':grade==='A'?'#22c55e':'#f97316';
  ctx.font = 'bold 24px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(grade,60,310);
  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
  ctx.fillText('Recovery Grade',60,328);
  var tipIdx = v22.recoveryOpt.sessions % RECOVERY_TIPS.length;
  ctx.fillStyle = '#22c55e'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Tip: '+RECOVERY_TIPS[tipIdx],340,320);
  ctx.fillStyle = '#888'; ctx.font = '10px sans-serif';
  ctx.fillText('Sessions: '+v22.recoveryOpt.sessions,340,338);
}

function logRecovery(){
  playSFX22('recovery_log');
  var keys = Object.keys(v22.recoveryOpt.methods);
  var idx = Math.floor(Math.random()*8);
  var key = keys[idx];
  v22.recoveryOpt.methods[key] = Math.min(RECOVERY_MAX[idx], (v22.recoveryOpt.methods[key]||0) + 5 + Math.floor(Math.random()*15));
  v22.recoveryOpt.sessions++;
  v22.featureUsage22.recovery = (v22.featureUsage22.recovery||0)+1;
  saveV22(v22);
  drawRecoveryCanvas();
  checkV22Achievements();
}

// ===== 5. COMBO DIFFICULTY LADDER =====
var COMBO_TIERS = [
  {tier:1,name:'Basic Jab',combo:'1',desc:'Single jab'},
  {tier:2,name:'One-Two',combo:'1-2',desc:'Jab + Cross'},
  {tier:3,name:'Triple Tap',combo:'1-1-2',desc:'Double jab + Cross'},
  {tier:4,name:'Hook Combo',combo:'1-2-3',desc:'Jab + Cross + Hook'},
  {tier:5,name:'Body Attack',combo:'1-2-B-2',desc:'Jab + Cross + Body + Cross'},
  {tier:6,name:'Upper Finish',combo:'1-2-3-6',desc:'Jab+Cross+Hook+Uppercut'},
  {tier:7,name:'Savage Seven',combo:'1-2-3-2-B-3-2',desc:'7-punch combination'},
  {tier:8,name:'Champion Run',combo:'1-1-2-3-B-6-3-2',desc:'8-punch champion combo'},
  {tier:9,name:'Destroyer',combo:'1-2-3-B-6-3-2-B-2',desc:'9-hit body destroyer'},
  {tier:10,name:'Perfect 10',combo:'1-1-2-3-6-B-3-2-B-6',desc:'10-punch perfection'}
];

function drawComboLadderCanvas(){
  var ctx = getCanvas22('v22-combo-canvas',600,380);
  if(!ctx) return;
  ctx.fillStyle = '#0d0d1a'; ctx.fillRect(0,0,600,380);
  ctx.fillStyle = '#FFD700'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Combo Difficulty Ladder',300,24);
  for(var i=9;i>=0;i--){
    var t = COMBO_TIERS[i];
    var y = 44 + (9-i)*32;
    var mastery = v22.comboLadder.tiers[i] || 0;
    var isCurrent = i === v22.comboLadder.currentTier;
    ctx.fillStyle = isCurrent ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.03)';
    ctx.beginPath(); ctx.roundRect(20,y,560,28,6); ctx.fill();
    if(isCurrent){
      ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(20,y,560,28,6); ctx.stroke();
    }
    var tierCol = mastery>=100?'#22c55e':mastery>=50?'#f97316':'#e63946';
    if(mastery>=100) tierCol = '#FFD700';
    ctx.fillStyle = tierCol; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('T'+t.tier,30,y+18);
    ctx.fillStyle = '#ddd'; ctx.font = '11px sans-serif';
    ctx.fillText(t.name,60,y+18);
    ctx.fillStyle = '#888'; ctx.font = '10px sans-serif';
    ctx.fillText(t.combo,180,y+18);
    ctx.fillStyle = '#555'; ctx.fillRect(310,y+8,200,12);
    var pct = Math.min(mastery/100,1);
    var grd = ctx.createLinearGradient(310,y+8,310+200*pct,y+8);
    grd.addColorStop(0,'#FFD700'); grd.addColorStop(1,'#f59e0b');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.roundRect(310,y+8,200*pct,12,3); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(mastery+'%',560,y+18);
  }
  ctx.fillStyle = '#888'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Total Combos: '+v22.comboLadder.totalCombos+' | Current Tier: T'+(v22.comboLadder.currentTier+1),300,372);
}

function practiceCombo(){
  playSFX22('combo_hit');
  var tier = v22.comboLadder.currentTier;
  v22.comboLadder.tiers[tier] = Math.min(100, (v22.comboLadder.tiers[tier]||0) + 5 + Math.floor(Math.random()*10));
  v22.comboLadder.totalCombos++;
  if(v22.comboLadder.tiers[tier] >= 100 && tier < 9){
    v22.comboLadder.currentTier = tier + 1;
    playSFX22('combo_tier');
  }
  v22.featureUsage22.combo = (v22.featureUsage22.combo||0)+1;
  saveV22(v22);
  drawComboLadderCanvas();
  checkV22Achievements();
}

// ===== 6. FIGHT NIGHT CHECKLIST =====
var CHECKLIST_ITEMS = [
  {cat:'Equipment',items:['Gloves inspected','Hand wraps ready','Mouthguard fitted','Groin protector','Boxing shoes cleaned']},
  {cat:'Nutrition',items:['Carb load 3hr before','Hydration 2L+','Light protein snack','Avoid dairy','Electrolytes packed']},
  {cat:'Warmup',items:['Shadow boxing 10min','Light pad work','Dynamic stretching','Jump rope 3 rounds']},
  {cat:'Mental',items:['Visualization complete','Breathing exercises','Game plan reviewed','Corner team briefed','Walk-in music ready','Adrenaline control practice']}
];

function drawChecklistCanvas(){
  var ctx = getCanvas22('v22-checklist-canvas',580,360);
  if(!ctx) return;
  ctx.fillStyle = '#0d0d1a'; ctx.fillRect(0,0,580,360);
  ctx.fillStyle = '#3b82f6'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Fight Night Checklist',290,24);
  var allItems = [];
  CHECKLIST_ITEMS.forEach(function(cat){ cat.items.forEach(function(it){ allItems.push({cat:cat.cat,item:it}); }); });
  var totalItems = allItems.length;
  var checked = v22.fightNight.checkedCount || 0;
  var cx = 480, cy = 100, cr = 50;
  var pct = checked/totalItems;
  ctx.beginPath(); ctx.arc(cx,cy,cr,0,Math.PI*2);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 8; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx,cy,cr,-Math.PI/2,-Math.PI/2+Math.PI*2*pct);
  ctx.strokeStyle = pct>=1?'#22c55e':pct>=0.5?'#3b82f6':'#e63946'; ctx.lineWidth = 8; ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(Math.round(pct*100)+'%',cx,cy+6);
  ctx.fillStyle = '#888'; ctx.font = '10px sans-serif';
  ctx.fillText(checked+'/'+totalItems,cx,cy+22);
  var y = 48;
  var catColors = {'Equipment':'#e63946','Nutrition':'#22c55e','Warmup':'#f97316','Mental':'#a855f7'};
  CHECKLIST_ITEMS.forEach(function(cat){
    ctx.fillStyle = catColors[cat.cat]||'#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(cat.cat,30,y);
    y += 4;
    cat.items.forEach(function(it){
      var key = cat.cat+'_'+it.replace(/ /g,'_');
      var done = v22.fightNight.items[key] || false;
      y += 16;
      ctx.fillStyle = done ? '#22c55e' : '#555';
      ctx.font = '10px sans-serif';
      ctx.fillText(done?'☑':'☐',30,y);
      ctx.fillStyle = done ? '#aaa' : '#ddd';
      ctx.fillText(it,48,y);
    });
    y += 10;
  });
  ctx.fillStyle = '#888'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Events Completed: '+v22.fightNight.completedEvents,290,350);
}

function toggleCheckItem(){
  playSFX22('checklist_check');
  var allItems = [];
  CHECKLIST_ITEMS.forEach(function(cat){ cat.items.forEach(function(it){ allItems.push({cat:cat.cat,item:it}); }); });
  var unchecked = [];
  allItems.forEach(function(ai){
    var key = ai.cat+'_'+ai.item.replace(/ /g,'_');
    if(!v22.fightNight.items[key]) unchecked.push(key);
  });
  if(unchecked.length === 0){
    v22.fightNight.items = {};
    v22.fightNight.checkedCount = 0;
    v22.fightNight.completedEvents++;
  } else {
    var pick = unchecked[Math.floor(Math.random()*unchecked.length)];
    v22.fightNight.items[pick] = true;
    v22.fightNight.checkedCount = (v22.fightNight.checkedCount||0)+1;
  }
  v22.featureUsage22.checklist = (v22.featureUsage22.checklist||0)+1;
  saveV22(v22);
  drawChecklistCanvas();
  checkV22Achievements();
}

// ===== 7. REACTION TIME TRAINER =====
var reactionState = { waiting: false, startTime: 0, active: false };

function drawReactionCanvas(){
  var ctx = getCanvas22('v22-reaction-canvas',560,340);
  if(!ctx) return;
  ctx.fillStyle = '#0d0d1a'; ctx.fillRect(0,0,560,340);
  ctx.fillStyle = '#e63946'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Reaction Time Trainer',280,24);
  var attempts = v22.reactionTime.attempts;
  if(attempts.length > 0){
    var maxA = Math.min(attempts.length, 30);
    var recent = attempts.slice(-maxA);
    var maxT = 500;
    var chartX = 60, chartY = 50, chartW = 440, chartH = 180;
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 0.5;
    for(var g=0;g<=4;g++){
      var gy = chartY + chartH - (g/4)*chartH;
      ctx.beginPath(); ctx.moveTo(chartX,gy); ctx.lineTo(chartX+chartW,gy); ctx.stroke();
      ctx.fillStyle = '#666'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText((g*125)+'ms',chartX-4,gy+3);
    }
    ctx.beginPath();
    ctx.strokeStyle = '#e63946'; ctx.lineWidth = 2;
    recent.forEach(function(t,i){
      var x = chartX + (i/(maxA-1||1))*chartW;
      var y = chartY + chartH - (Math.min(t,maxT)/maxT)*chartH;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.stroke();
    recent.forEach(function(t,i){
      var x = chartX + (i/(maxA-1||1))*chartW;
      var y = chartY + chartH - (Math.min(t,maxT)/maxT)*chartH;
      ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2);
      ctx.fillStyle = t<200?'#22c55e':t<300?'#f97316':'#e63946';
      ctx.fill();
    });
    ctx.setLineDash([4,4]);
    ctx.strokeStyle = '#22c55e44';
    var avgLine = chartY + chartH - (200/maxT)*chartH;
    ctx.beginPath(); ctx.moveTo(chartX,avgLine); ctx.lineTo(chartX+chartW,avgLine); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#22c55e'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('200ms (Pro)',chartX+chartW+4,avgLine+3);
  }
  var best = v22.reactionTime.bestTime < 9999 ? v22.reactionTime.bestTime+'ms' : '--';
  var avg = v22.reactionTime.avgTime > 0 ? v22.reactionTime.avgTime+'ms' : '--';
  ctx.fillStyle = '#22c55e'; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(best,140,280);
  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
  ctx.fillText('Best Time',140,298);
  ctx.fillStyle = '#3b82f6'; ctx.font = 'bold 18px sans-serif';
  ctx.fillText(avg,280,280);
  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
  ctx.fillText('Average',280,298);
  var total = v22.reactionTime.totalAttempts;
  var percentile = total>0 ? Math.min(99,Math.max(1,Math.round(100-((v22.reactionTime.avgTime||300)-150)/3))) : '--';
  ctx.fillStyle = '#FFD700'; ctx.font = 'bold 18px sans-serif';
  ctx.fillText(percentile===('--')?'--':percentile+'th',420,280);
  ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif';
  ctx.fillText('Percentile',420,298);
  ctx.fillStyle = '#888'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Total Attempts: '+total,280,330);
}

function startReaction(){
  if(reactionState.active) return;
  reactionState.active = true;
  reactionState.waiting = true;
  var c = document.getElementById('v22-reaction-canvas');
  if(!c) return;
  var ctx2 = c.getContext('2d');
  ctx2.fillStyle = '#1a0a0a';
  ctx2.fillRect(0,0,560,340);
  ctx2.fillStyle = '#e63946';
  ctx2.font = 'bold 20px sans-serif';
  ctx2.textAlign = 'center';
  ctx2.fillText('Wait for GREEN...',280,170);
  var delay = 1500 + Math.floor(Math.random()*3000);
  setTimeout(function(){
    if(!reactionState.active) return;
    reactionState.waiting = false;
    reactionState.startTime = performance.now();
    playSFX22('reaction_go');
    ctx2.fillStyle = '#0a1a0a';
    ctx2.fillRect(0,0,560,340);
    ctx2.fillStyle = '#22c55e';
    ctx2.font = 'bold 24px sans-serif';
    ctx2.textAlign = 'center';
    ctx2.fillText('CLICK NOW!',280,170);
  }, delay);
}

function clickReaction(){
  if(!reactionState.active) { startReaction(); return; }
  if(reactionState.waiting){
    reactionState.active = false;
    reactionState.waiting = false;
    var c = document.getElementById('v22-reaction-canvas');
    if(c){
      var ctx2 = c.getContext('2d');
      ctx2.fillStyle = '#1a0a0a'; ctx2.fillRect(0,0,560,340);
      ctx2.fillStyle = '#e63946'; ctx2.font = 'bold 20px sans-serif'; ctx2.textAlign = 'center';
      ctx2.fillText('Too early! Try again.',280,170);
    }
    return;
  }
  var elapsed = Math.round(performance.now() - reactionState.startTime);
  reactionState.active = false;
  v22.reactionTime.attempts.push(elapsed);
  if(v22.reactionTime.attempts.length > 30) v22.reactionTime.attempts.shift();
  v22.reactionTime.totalAttempts++;
  if(elapsed < v22.reactionTime.bestTime) v22.reactionTime.bestTime = elapsed;
  var sum = 0;
  v22.reactionTime.attempts.forEach(function(a){ sum+=a; });
  v22.reactionTime.avgTime = Math.round(sum/v22.reactionTime.attempts.length);
  if(elapsed < 200) playSFX22('reaction_fast');
  v22.featureUsage22.reaction = (v22.featureUsage22.reaction||0)+1;
  saveV22(v22);
  drawReactionCanvas();
  checkV22Achievements();
}

// ===== 8. BODY COMPOSITION TRACKER =====
var WEIGHT_CLASSES = [
  {name:'Minimumweight',max:47.6},{name:'Light Flyweight',max:48.9},{name:'Flyweight',max:50.8},
  {name:'Super Flyweight',max:52.2},{name:'Bantamweight',max:53.5},{name:'Super Bantamweight',max:55.3},
  {name:'Featherweight',max:57.2},{name:'Super Featherweight',max:59},{name:'Lightweight',max:61.2},
  {name:'Super Lightweight',max:63.5},{name:'Welterweight',max:66.7},{name:'Super Welterweight',max:69.9},
  {name:'Middleweight',max:72.6},{name:'Super Middleweight',max:76.2},{name:'Light Heavyweight',max:79.4},
  {name:'Cruiserweight',max:90.7},{name:'Heavyweight',max:999}
];

function getWeightClass(kg){
  for(var i=0;i<WEIGHT_CLASSES.length;i++){
    if(kg<=WEIGHT_CLASSES[i].max) return WEIGHT_CLASSES[i].name;
  }
  return 'Heavyweight';
}

function drawBodyCompCanvas(){
  var ctx = getCanvas22('v22-body-canvas',580,360);
  if(!ctx) return;
  ctx.fillStyle = '#0d0d1a'; ctx.fillRect(0,0,580,360);
  ctx.fillStyle = '#3b82f6'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Body Composition Tracker',290,24);
  var entries = v22.bodyComp.entries;
  if(entries.length > 1){
    var chartX = 60, chartY = 50, chartW = 460, chartH = 180;
    var maxE = Math.min(entries.length,30);
    var recent = entries.slice(-maxE);
    var minW=999,maxW=0,minBF=999,maxBF=0;
    recent.forEach(function(e){
      if(e.weight<minW) minW=e.weight; if(e.weight>maxW) maxW=e.weight;
      if(e.bf<minBF) minBF=e.bf; if(e.bf>maxBF) maxBF=e.bf;
    });
    var rangeW = maxW-minW||1;
    var rangeBF = maxBF-minBF||1;
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 0.5;
    for(var g=0;g<=4;g++){
      var gy = chartY + chartH - (g/4)*chartH;
      ctx.beginPath(); ctx.moveTo(chartX,gy); ctx.lineTo(chartX+chartW,gy); ctx.stroke();
    }
    ctx.beginPath(); ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
    recent.forEach(function(e,i){
      var x = chartX + (i/(maxE-1||1))*chartW;
      var y = chartY + chartH - ((e.weight-minW)/rangeW)*chartH;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.stroke();
    ctx.beginPath(); ctx.strokeStyle = '#e63946'; ctx.lineWidth = 2;
    ctx.setLineDash([4,4]);
    recent.forEach(function(e,i){
      var x = chartX + (i/(maxE-1||1))*chartW;
      var y = chartY + chartH - ((e.bf-minBF)/rangeBF)*chartH;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#3b82f6'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('Weight (kg)',chartX,chartY-6);
    ctx.fillStyle = '#e63946';
    ctx.fillText('Body Fat (%)',chartX+100,chartY-6);
  }
  var cw = v22.bodyComp.currentWeight;
  var cbf = v22.bodyComp.currentBF;
  var cm = v22.bodyComp.currentMuscle;
  var bmi = (cw/((1.75)*(1.75))).toFixed(1);
  var wc = getWeightClass(cw);
  var metrics = [
    {label:'Weight',val:cw+'kg',color:'#3b82f6'},
    {label:'Body Fat',val:cbf+'%',color:'#e63946'},
    {label:'Muscle',val:cm+'kg',color:'#22c55e'},
    {label:'BMI',val:bmi,color:'#f97316'},
    {label:'Class',val:wc,color:'#FFD700'}
  ];
  metrics.forEach(function(m,i){
    var mx = 40 + i*108;
    ctx.fillStyle = m.color; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(m.val,mx+40,280);
    ctx.fillStyle = '#aaa'; ctx.font = '9px sans-serif';
    ctx.fillText(m.label,mx+40,296);
  });
  ctx.fillStyle = '#888'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Entries: '+entries.length+' | Target: maintain weight class',290,348);
}

function logBodyComp(){
  playSFX22('body_log');
  var wDelta = (Math.random()-0.5)*1.2;
  var bfDelta = (Math.random()-0.5)*0.8;
  var mDelta = (Math.random()-0.3)*0.6;
  v22.bodyComp.currentWeight = Math.round((v22.bodyComp.currentWeight + wDelta)*10)/10;
  v22.bodyComp.currentBF = Math.max(5,Math.min(30,Math.round((v22.bodyComp.currentBF + bfDelta)*10)/10));
  v22.bodyComp.currentMuscle = Math.max(40,Math.round((v22.bodyComp.currentMuscle + mDelta)*10)/10);
  v22.bodyComp.entries.push({
    weight: v22.bodyComp.currentWeight,
    bf: v22.bodyComp.currentBF,
    muscle: v22.bodyComp.currentMuscle
  });
  if(v22.bodyComp.entries.length>30) v22.bodyComp.entries.shift();
  v22.featureUsage22.body = (v22.featureUsage22.body||0)+1;
  saveV22(v22);
  drawBodyCompCanvas();
  checkV22Achievements();
}

// ===== QUIZ V22 (15 Questions) =====
var QUIZ_V22 = [
  {q:'What is the ideal punch speed for a professional jab?',a:['40-45 mph','25-30 mph','55-60 mph','10-15 mph'],c:0},
  {q:'Which recovery method is most effective immediately post-fight?',a:['Ice bath','Running','Heavy bag','Sparring'],c:0},
  {q:'What does &quot;rolling with punches&quot; mean in boxing defense?',a:['Moving head to reduce impact','Falling down','Blocking with gloves','Clinching'],c:0},
  {q:'What is the average reaction time of a professional boxer?',a:['150-200ms','400-500ms','50-80ms','800-1000ms'],c:0},
  {q:'Which body fat percentage is ideal for a competitive boxer?',a:['8-12%','20-25%','3-5%','30-35%'],c:0},
  {q:'What is periodization in boxing training?',a:['Structured training phases','Resting between rounds','Counting punches','Weight cutting'],c:0},
  {q:'Which mental skill is most important during a fight?',a:['Focus under pressure','Intimidation','Aggression','Speed'],c:0},
  {q:'What is the heaviest weight class in professional boxing?',a:['Heavyweight (200+ lbs)','Cruiserweight','Super Middleweight','Light Heavyweight'],c:0},
  {q:'What does &quot;staying behind the jab&quot; mean?',a:['Using jab to control distance','Dodging jabs','Counting jabs','Training jab only'],c:0},
  {q:'Which combo is known as the &quot;bread and butter&quot; of boxing?',a:['Jab-Cross (1-2)','Hook-Uppercut','Body-Head','Overhand-Jab'],c:0},
  {q:'How many rounds are in a standard professional boxing match?',a:['12 rounds','8 rounds','15 rounds','6 rounds'],c:0},
  {q:'What is the &quot;philly shell&quot; defense?',a:['Lead shoulder up, rear hand at chin','Both hands up high','Arms crossed at chest','Hands at waist'],c:0},
  {q:'Which muscle group generates the most punching power?',a:['Legs and hips','Biceps','Shoulders only','Forearms'],c:0},
  {q:'What is a &quot;standing eight count&quot; in boxing?',a:['Ref counts 8 without knockdown','8 rounds standing','8 punches in a row','8 second rest'],c:0},
  {q:'What does BMI stand for in body composition?',a:['Body Mass Index','Boxing Movement Index','Base Metabolic Intensity','Body Muscle Indicator'],c:0}
];

var quizV22State = { current: -1, score: 0, total: 0, active: false };

function startQuizV22(){
  quizV22State = { current: 0, score: 0, total: QUIZ_V22.length, active: true };
  showQuizV22Question();
}

function showQuizV22Question(){
  var area = document.getElementById('v22-quiz-area');
  if(!area || quizV22State.current >= QUIZ_V22.length){
    if(area){
      var pct = Math.round(quizV22State.score/QUIZ_V22.length*100);
      var grade = getGrade22(quizV22State.score,QUIZ_V22.length);
      area.innerHTML = '<div style="text-align:center;padding:16px"><div style="font-size:28px;font-weight:bold;color:'+(grade==='S'?'#FFD700':grade==='A'?'#22c55e':'#e63946')+'">'+grade+'</div><div style="color:var(--text-dim);font-size:13px;margin-top:4px">'+quizV22State.score+'/'+QUIZ_V22.length+' ('+pct+'%)</div></div>';
      v22.quizV22Scores['attempt_'+(Object.keys(v22.quizV22Scores).length+1)] = quizV22State.score;
      saveV22(v22);
      checkV22Achievements();
    }
    quizV22State.active = false;
    return;
  }
  var q = QUIZ_V22[quizV22State.current];
  var html = '<div style="padding:10px"><div style="color:var(--text);font-size:13px;font-weight:600;margin-bottom:10px">Q'+(quizV22State.current+1)+'. '+q.q+'</div>';
  q.a.forEach(function(a,i){
    html += '<button onclick="window.__v22QuizAnswer('+i+')" style="display:block;width:100%;padding:8px 12px;margin:4px 0;background:var(--surface);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);font-size:12px;cursor:pointer;text-align:left">'+a+'</button>';
  });
  html += '<div style="color:var(--text-muted);font-size:10px;margin-top:6px">'+(quizV22State.current+1)+'/'+QUIZ_V22.length+'</div></div>';
  area.innerHTML = html;
}

window.__v22QuizAnswer = function(idx){
  if(!quizV22State.active) return;
  if(idx === QUIZ_V22[quizV22State.current].c){
    quizV22State.score++;
    playSFX22('quiz_correct22');
  } else {
    playSFX22('quiz_wrong22');
  }
  quizV22State.current++;
  showQuizV22Question();
};

// ===== ACHIEVEMENTS V22 =====
var ACHIEVEMENTS_V22 = [
  {id:'speed_demon',name:'Speed Demon',desc:'Record 20+ punch speeds',icon:'⚡',check:function(){ return v22.punchSpeed.totalPunches>=20; }},
  {id:'iron_mind',name:'Iron Mind',desc:'Complete 10 mental sessions',icon:'🧠',check:function(){ return v22.mentalTough.sessions>=10; }},
  {id:'spar_veteran',name:'Sparring Veteran',desc:'Match with 5 partners',icon:'🥊',check:function(){ return v22.sparringMatch.matches.length>=5; }},
  {id:'recovery_pro',name:'Recovery Pro',desc:'Log 10 recovery sessions',icon:'💤',check:function(){ return v22.recoveryOpt.sessions>=10; }},
  {id:'combo_king',name:'Combo King',desc:'Reach Tier 5 combo',icon:'🔥',check:function(){ return v22.comboLadder.currentTier>=4; }},
  {id:'fight_ready',name:'Fight Ready',desc:'Complete fight checklist',icon:'✅',check:function(){ return v22.fightNight.completedEvents>=1; }},
  {id:'fast_reflex',name:'Fast Reflex',desc:'Reaction under 250ms',icon:'⏱',check:function(){ return v22.reactionTime.bestTime<250; }},
  {id:'body_tracker',name:'Body Tracker',desc:'Log 10 body entries',icon:'📊',check:function(){ return v22.bodyComp.entries.length>=10; }},
  {id:'quiz_v22_master',name:'Quiz v22 Master',desc:'Score S rank on quiz',icon:'🏆',check:function(){ var sc=v22.quizV22Scores; for(var k in sc){if(sc[k]>=14) return true;} return false; }},
  {id:'multi_tool_v22',name:'Multi-Tool v22',desc:'Use 5+ v22 features',icon:'🛠',check:function(){ var c=0;for(var k in v22.featureUsage22){if(v22.featureUsage22[k]>0)c++;} return c>=5; }},
  {id:'lightning_hands',name:'Lightning Hands',desc:'Reaction under 180ms',icon:'⭐',check:function(){ return v22.reactionTime.bestTime<180; }},
  {id:'v22_complete',name:'v22 Complete',desc:'Unlock 8+ v22 badges',icon:'🌟',check:function(){ var c=0; ACHIEVEMENTS_V22.forEach(function(a){if(a.id!=='v22_complete'&&v22.achievementsV22[a.id])c++;}); return c>=8; }}
];

function checkV22Achievements(){
  var newUnlock = false;
  ACHIEVEMENTS_V22.forEach(function(a){
    if(!v22.achievementsV22[a.id] && a.check()){
      v22.achievementsV22[a.id] = true;
      newUnlock = true;
    }
  });
  if(newUnlock){
    playSFX22('achieve22');
    saveV22(v22);
    renderV22Achievements();
  }
}

function renderV22Achievements(){
  var grid = document.getElementById('v22-ach-grid');
  if(!grid) return;
  grid.innerHTML = '';
  ACHIEVEMENTS_V22.forEach(function(a){
    var unlocked = v22.achievementsV22[a.id];
    var badge = document.createElement('div');
    badge.style.cssText = 'width:70px;text-align:center;padding:8px 4px;background:'+(unlocked?'rgba(255,215,0,0.08)':'var(--surface)')+';border:1px solid '+(unlocked?'rgba(255,215,0,0.3)':'var(--glass-border)')+';border-radius:12px;opacity:'+(unlocked?'1':'0.4');
    badge.innerHTML = '<div style="font-size:20px">'+a.icon+'</div><div style="font-size:9px;color:'+(unlocked?'#FFD700':'var(--text-muted)')+';margin-top:2px;font-weight:600">'+a.name+'</div>';
    badge.title = a.desc;
    grid.appendChild(badge);
  });
}

// ===== KEYBOARD =====
function initV22Keyboard(){
  document.addEventListener('keydown', function(e){
    if(!e.shiftKey) return;
    var sections = {
      '1':'v22-speed','2':'v22-mental','3':'v22-spar','4':'v22-recovery',
      '5':'v22-combo','6':'v22-checklist','7':'v22-reaction','8':'v22-body'
    };
    if(e.key === '0'){
      var qz = document.getElementById('v22-quiz');
      if(qz){ qz.scrollIntoView({behavior:'smooth'}); playSFX22('nav_v22'); e.preventDefault(); }
      return;
    }
    var secId = sections[e.key];
    if(secId){
      var el = document.getElementById(secId);
      if(el){ el.scrollIntoView({behavior:'smooth'}); playSFX22('nav_v22'); e.preventDefault(); }
    }
  });
}

// ===== BUILD UI =====
function buildV22(){
  var container = document.querySelector('.container') || document.querySelector('main') || document.body;
  var footer = container.querySelector('.footer') || container.querySelector('footer');
  var html = '';

  html += '<div style="display:flex;gap:6px;overflow-x:auto;padding:8px 16px;margin:12px 0;-webkit-overflow-scrolling:touch">';
  [{id:'v22-speed',icon:'⚡',label:'Speed'},{id:'v22-mental',icon:'🧠',label:'Mental'},{id:'v22-spar',icon:'🥊',label:'Sparring'},{id:'v22-recovery',icon:'💤',label:'Recovery'},{id:'v22-combo',icon:'🔥',label:'Combos'},{id:'v22-checklist',icon:'✅',label:'Fight Night'},{id:'v22-reaction',icon:'⏱',label:'Reaction'},{id:'v22-body',icon:'📊',label:'Body'}].forEach(function(n){
    html += '<button onclick="document.getElementById(\''+n.id+'\').scrollIntoView({behavior:\'smooth\'})" style="flex-shrink:0;padding:6px 12px;background:var(--surface);border:1px solid var(--glass-border);border-radius:20px;color:var(--text-dim);font-size:11px;cursor:pointer;white-space:nowrap">'+n.icon+' '+n.label+'</button>';
  });
  html += '</div>';

  html += '<section class="section" id="v22-speed"><h2 class="section-title"><span class="emoji">⚡</span> Punch Speed Radar (7 Types)</h2><div class="card"><canvas id="v22-speed-canvas" width="580" height="360" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v22-btn" id="v22-speed-btn">🥊 Throw Punch</button></div></div></section>';

  html += '<section class="section" id="v22-mental"><h2 class="section-title"><span class="emoji">🧠</span> Mental Toughness Trainer (8 Skills)</h2><div class="card"><canvas id="v22-mental-canvas" width="600" height="380" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v22-btn" id="v22-mental-btn">🧠 Train Mental</button></div></div></section>';

  html += '<section class="section" id="v22-spar"><h2 class="section-title"><span class="emoji">🥊</span> Sparring Partner Matchmaker (10 AI)</h2><div class="card"><canvas id="v22-spar-canvas" width="580" height="360" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v22-btn" id="v22-spar-btn">🥊 Find Partner</button></div></div></section>';

  html += '<section class="section" id="v22-recovery"><h2 class="section-title"><span class="emoji">💤</span> Recovery Optimizer (8 Methods)</h2><div class="card"><canvas id="v22-recovery-canvas" width="560" height="340" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v22-btn" id="v22-recovery-btn">💤 Log Recovery</button></div></div></section>';

  html += '<section class="section" id="v22-combo"><h2 class="section-title"><span class="emoji">🔥</span> Combo Difficulty Ladder (10 Tiers)</h2><div class="card"><canvas id="v22-combo-canvas" width="600" height="380" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v22-btn" id="v22-combo-btn">🔥 Practice Combo</button></div></div></section>';

  html += '<section class="section" id="v22-checklist"><h2 class="section-title"><span class="emoji">✅</span> Fight Night Checklist (20 Items)</h2><div class="card"><canvas id="v22-checklist-canvas" width="580" height="360" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v22-btn" id="v22-checklist-btn">✅ Check Item</button></div></div></section>';

  html += '<section class="section" id="v22-reaction"><h2 class="section-title"><span class="emoji">⏱</span> Reaction Time Trainer</h2><div class="card"><canvas id="v22-reaction-canvas" width="560" height="340" style="width:100%;height:auto;border-radius:12px;cursor:pointer"></canvas><div style="text-align:center;margin-top:10px"><button class="v22-btn" id="v22-reaction-btn">⏱ Start / React</button></div></div></section>';

  html += '<section class="section" id="v22-body"><h2 class="section-title"><span class="emoji">📊</span> Body Composition Tracker</h2><div class="card"><canvas id="v22-body-canvas" width="580" height="360" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v22-btn" id="v22-body-btn">📊 Log Entry</button></div></div></section>';

  html += '<section class="section" id="v22-quiz"><h2 class="section-title"><span class="emoji">❓</span> v22 Quiz (15Q)</h2><div class="card"><div id="v22-quiz-area" style="min-height:60px"><div style="text-align:center;color:var(--text-dim);font-size:13px;padding:16px">Press Start</div></div><div style="text-align:center;margin-top:10px"><button class="v22-btn" id="v22-quiz-start">❓ Start Quiz</button></div></div></section>';

  html += '<section class="section" id="v22-ach"><h2 class="section-title"><span class="emoji">🏅</span> v22 Achievements (12)</h2><div class="card"><div class="badge-grid" id="v22-ach-grid" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center"></div></div></section>';

  var wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  while(wrapper.firstChild){
    if(footer) container.insertBefore(wrapper.firstChild, footer);
    else container.appendChild(wrapper.firstChild);
  }

  var sb = document.getElementById('v22-speed-btn');
  if(sb) sb.addEventListener('click', practicePunchSpeed);
  var mb = document.getElementById('v22-mental-btn');
  if(mb) mb.addEventListener('click', trainMental);
  var spb = document.getElementById('v22-spar-btn');
  if(spb) spb.addEventListener('click', matchSparring);
  var rb = document.getElementById('v22-recovery-btn');
  if(rb) rb.addEventListener('click', logRecovery);
  var cb = document.getElementById('v22-combo-btn');
  if(cb) cb.addEventListener('click', practiceCombo);
  var clb = document.getElementById('v22-checklist-btn');
  if(clb) clb.addEventListener('click', toggleCheckItem);
  var rtb = document.getElementById('v22-reaction-btn');
  if(rtb) rtb.addEventListener('click', clickReaction);
  var rcanvas = document.getElementById('v22-reaction-canvas');
  if(rcanvas) rcanvas.addEventListener('click', clickReaction);
  var bdb = document.getElementById('v22-body-btn');
  if(bdb) bdb.addEventListener('click', logBodyComp);
  var qsb = document.getElementById('v22-quiz-start');
  if(qsb) qsb.addEventListener('click', startQuizV22);

  setTimeout(function(){
    drawPunchSpeedCanvas();
    drawMentalCanvas();
    drawSparringCanvas();
    drawRecoveryCanvas();
    drawComboLadderCanvas();
    drawChecklistCanvas();
    drawReactionCanvas();
    drawBodyCompCanvas();
    renderV22Achievements();
  }, 100);
}

// ===== INIT =====
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', function(){ buildV22(); initV22Keyboard(); });
} else {
  buildV22(); initV22Keyboard();
}

})();
