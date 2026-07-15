// Boxing Trainer Pro v21_patch.js - NEXTERA+PRISM Auto Enhancement Module
// 1. Fight Camp Periodization Canvas 600x380 - 16-week macro/meso/micro cycle planner
// 2. Punch Accuracy Heatmap Canvas 580x360 - 6-target zones hit/miss rate grid
// 3. Boxing Cardio Zones Canvas 560x340 - 5 HR zones 12-round stacked area
// 4. Corner Strategy Board Canvas 600x380 - round-by-round 8-strategy plan
// 5. Fighter Archetype Quiz Canvas 580x360 - 12-question personality to style map
// 6. Defensive Drill Sequencer Canvas 560x340 - 8 drills combo chain builder
// 7. Boxing Injury Prevention Canvas 580x360 - 10 body areas risk radar
// 8. Match Analysis Scorecard Canvas 600x380 - 12-round 10-point scoring system + PNG
// Quiz +15 (180->195), +12 Achievements (166->178), SFX 12, Keyboard +8
(function(){
'use strict';

var V21KEY = 'boxingV21Patch';

function loadV21(){
  try {
    var r = localStorage.getItem(V21KEY);
    if(!r) return defV21();
    var p = JSON.parse(r), d = defV21();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV21(); }
}
function saveV21(d){ try { localStorage.setItem(V21KEY, JSON.stringify(d)); } catch(e){} }
function defV21(){
  return {
    periodization: { weeks: [], currentPhase: 'base', completedWeeks: 0 },
    accuracy: { zones: {head:0,body:0,liver:0,jab_range:0,hook_range:0,uppercut_range:0}, total: 0, hits: 0 },
    cardio: { sessions: [], avgHR: 0, maxHR: 0 },
    corner: { plans: [], roundsPlanned: 0 },
    archetype: { results: [], currentType: '' },
    defense: { drills: [], completed: 0, bestChain: 0 },
    injury: { assessments: [], riskAreas: {} },
    matchAnalysis: { scorecards: [], judged: 0 },
    quizV21Scores: {},
    achievementsV21: {},
    featureUsage: {}
  };
}

var v21 = loadV21();

// ===== CSS =====
var st = document.createElement('style');
st.textContent = '.v21-btn{padding:8px 16px;background:linear-gradient(135deg,#FF4444,#CC2222);border:none;border-radius:10px;color:#fff;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s}.v21-btn:hover{filter:brightness(1.15);transform:scale(1.03)}.v21-btn-sec{padding:8px 16px;background:var(--surface,rgba(255,255,255,0.04));border:1px solid var(--glass-border,rgba(255,255,255,0.1));border-radius:10px;color:var(--text-dim,#8a8a9e);font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}.v21-btn-sec:hover{border-color:#FF4444;color:#FF4444}';
document.head.appendChild(st);

// ===== SFX ENGINE V21 =====
function playSFX21(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'period_plan':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(440,t);o.frequency.linearRampToValueAtTime(660,t+0.1);
        g.gain.setValueAtTime(0.08,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.15);break;
      case 'accuracy_hit':
        var bf=ctx.createBufferSource(),len=ctx.sampleRate*0.08,buf=ctx.createBuffer(1,len,ctx.sampleRate);
        var d=buf.getChannelData(0);for(var i=0;i<len;i++){d[i]=Math.sin(2*Math.PI*880*i/ctx.sampleRate)*Math.pow(1-i/len,4);}
        bf.buffer=buf;var gf=ctx.createGain();gf.gain.setValueAtTime(0.12,t);gf.gain.exponentialRampToValueAtTime(0.001,t+0.08);
        bf.connect(gf).connect(ctx.destination);bf.start(t);break;
      case 'accuracy_miss':
        var o2=ctx.createOscillator(),g2=ctx.createGain();
        o2.type='square';o2.frequency.setValueAtTime(200,t);o2.frequency.linearRampToValueAtTime(100,t+0.1);
        g2.gain.setValueAtTime(0.06,t);g2.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o2.connect(g2).connect(ctx.destination);o2.start(t);o2.stop(t+0.12);break;
      case 'cardio_beep':
        var o3=ctx.createOscillator(),g3=ctx.createGain();
        o3.type='sine';o3.frequency.setValueAtTime(660,t);
        g3.gain.setValueAtTime(0.07,t);g3.gain.exponentialRampToValueAtTime(0.001,t+0.06);
        o3.connect(g3).connect(ctx.destination);o3.start(t);o3.stop(t+0.06);break;
      case 'corner_call':
        [523,659,784].forEach(function(f,j){
          var o4=ctx.createOscillator(),g4=ctx.createGain();
          o4.type='triangle';o4.frequency.value=f;
          g4.gain.setValueAtTime(0.06,t+j*0.08);g4.gain.exponentialRampToValueAtTime(0.001,t+j*0.08+0.1);
          o4.connect(g4).connect(ctx.destination);o4.start(t+j*0.08);o4.stop(t+j*0.08+0.1);
        });break;
      case 'archetype_reveal':
        var o5=ctx.createOscillator(),g5=ctx.createGain();
        o5.type='sine';o5.frequency.setValueAtTime(330,t);o5.frequency.exponentialRampToValueAtTime(880,t+0.2);
        g5.gain.setValueAtTime(0.09,t);g5.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o5.connect(g5).connect(ctx.destination);o5.start(t);o5.stop(t+0.25);break;
      case 'defense_block':
        var bf2=ctx.createBufferSource(),len2=ctx.sampleRate*0.1,buf2=ctx.createBuffer(1,len2,ctx.sampleRate);
        var d2=buf2.getChannelData(0);for(var i2=0;i2<len2;i2++){d2[i2]=(Math.random()*2-1)*Math.pow(1-i2/len2,5)*0.5;}
        bf2.buffer=buf2;var gf2=ctx.createGain();gf2.gain.setValueAtTime(0.1,t);gf2.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        bf2.connect(gf2).connect(ctx.destination);bf2.start(t);break;
      case 'injury_scan':
        var o6=ctx.createOscillator(),g6=ctx.createGain();
        o6.type='sine';o6.frequency.setValueAtTime(880,t);o6.frequency.linearRampToValueAtTime(440,t+0.15);
        g6.gain.setValueAtTime(0.07,t);g6.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o6.connect(g6).connect(ctx.destination);o6.start(t);o6.stop(t+0.18);break;
      case 'match_score':
        [440,554,659,880].forEach(function(f,j){
          var o7=ctx.createOscillator(),g7=ctx.createGain();
          o7.type='sine';o7.frequency.value=f;
          g7.gain.setValueAtTime(0.05,t+j*0.06);g7.gain.exponentialRampToValueAtTime(0.001,t+j*0.06+0.1);
          o7.connect(g7).connect(ctx.destination);o7.start(t+j*0.06);o7.stop(t+j*0.06+0.1);
        });break;
      case 'quiz_correct21':
        var o8=ctx.createOscillator(),g8=ctx.createGain();
        o8.type='sine';o8.frequency.setValueAtTime(523,t);o8.frequency.linearRampToValueAtTime(1047,t+0.12);
        g8.gain.setValueAtTime(0.09,t);g8.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o8.connect(g8).connect(ctx.destination);o8.start(t);o8.stop(t+0.15);break;
      case 'quiz_wrong21':
        var o9=ctx.createOscillator(),g9=ctx.createGain();
        o9.type='sawtooth';o9.frequency.setValueAtTime(300,t);o9.frequency.linearRampToValueAtTime(100,t+0.15);
        g9.gain.setValueAtTime(0.06,t);g9.gain.exponentialRampToValueAtTime(0.001,t+0.18);
        o9.connect(g9).connect(ctx.destination);o9.start(t);o9.stop(t+0.18);break;
      case 'achieve21':
        [523,659,784,1047].forEach(function(f,j){
          var oa=ctx.createOscillator(),ga=ctx.createGain();
          oa.type='sine';oa.frequency.value=f;
          ga.gain.setValueAtTime(0.06,t+j*0.1);ga.gain.exponentialRampToValueAtTime(0.001,t+j*0.1+0.15);
          oa.connect(ga).connect(ctx.destination);oa.start(t+j*0.1);oa.stop(t+j*0.1+0.15);
        });break;
      case 'nav_v21':
        var on=ctx.createOscillator(),gn=ctx.createGain();
        on.type='sine';on.frequency.value=700;
        gn.gain.setValueAtTime(0.04,t);gn.gain.exponentialRampToValueAtTime(0.001,t+0.05);
        on.connect(gn).connect(ctx.destination);on.start(t);on.stop(t+0.05);break;
    }
    setTimeout(function(){ctx.close();},1000);
  } catch(e){}
}

// ===== CANVAS HELPERS =====
function getCanvas(id,w,h){
  var c = document.getElementById(id);
  if(!c) return null;
  c.width = w; c.height = h;
  var ctx = c.getContext('2d');
  ctx.clearRect(0,0,w,h);
  return ctx;
}

function drawRadar(ctx,cx,cy,r,values,labels,color,fillColor){
  var n = values.length;
  ctx.beginPath();
  for(var i=0;i<n;i++){
    var angle = -Math.PI/2 + (2*Math.PI/n)*i;
    var x = cx + r * Math.cos(angle);
    var y = cy + r * Math.sin(angle);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.closePath();
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();

  for(var ring=1;ring<=4;ring++){
    ctx.beginPath();
    for(var j=0;j<n;j++){
      var a2 = -Math.PI/2 + (2*Math.PI/n)*j;
      var rx = cx + (r*ring/4) * Math.cos(a2);
      var ry = cy + (r*ring/4) * Math.sin(a2);
      if(j===0) ctx.moveTo(rx,ry); else ctx.lineTo(rx,ry);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.stroke();
  }

  for(var k=0;k<n;k++){
    var a3 = -Math.PI/2 + (2*Math.PI/n)*k;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(cx+r*Math.cos(a3),cy+r*Math.sin(a3));
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.stroke();
  }

  ctx.beginPath();
  for(var m=0;m<n;m++){
    var a4 = -Math.PI/2 + (2*Math.PI/n)*m;
    var vr = r * (values[m]/100);
    var vx = cx + vr * Math.cos(a4);
    var vy = cy + vr * Math.sin(a4);
    if(m===0) ctx.moveTo(vx,vy); else ctx.lineTo(vx,vy);
  }
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = '10px -apple-system,sans-serif';
  ctx.fillStyle = '#aaa';
  ctx.textAlign = 'center';
  for(var p=0;p<n;p++){
    var a5 = -Math.PI/2 + (2*Math.PI/n)*p;
    var lx = cx + (r+18) * Math.cos(a5);
    var ly = cy + (r+18) * Math.sin(a5);
    ctx.fillText(labels[p],lx,ly+4);
  }
}

// ===== 1. FIGHT CAMP PERIODIZATION =====
var PHASES = [
  {name:'Base',color:'#22c55e',weeks:4,focus:'Endurance & Technique',volume:70,intensity:50},
  {name:'Build',color:'#3b82f6',weeks:4,focus:'Power & Speed',volume:85,intensity:70},
  {name:'Peak',color:'#f97316',weeks:4,focus:'Fight Simulation',volume:60,intensity:95},
  {name:'Taper',color:'#a855f7',weeks:2,focus:'Recovery & Sharpening',volume:30,intensity:40},
  {name:'Fight',color:'#FF4444',weeks:1,focus:'Competition',volume:20,intensity:100},
  {name:'Recovery',color:'#06b6d4',weeks:1,focus:'Active Recovery',volume:15,intensity:20}
];

function drawPeriodCanvas(){
  var ctx = getCanvas('v21-period-canvas',600,380);
  if(!ctx) return;

  ctx.fillStyle = '#0d0820';
  ctx.fillRect(0,0,600,380);

  ctx.font = 'bold 14px -apple-system,sans-serif';
  ctx.fillStyle = '#f0f0f0';
  ctx.textAlign = 'center';
  ctx.fillText('16-Week Fight Camp Periodization',300,25);

  var barH = 30, barY = 50, x = 40;
  var totalW = 520;
  var totalWeeks = PHASES.reduce(function(s,p){return s+p.weeks;},0);

  PHASES.forEach(function(p){
    var w = (p.weeks/totalWeeks) * totalW;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.roundRect(x,barY,w-2,barH,4);
    ctx.fill();
    ctx.font = '10px -apple-system,sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(p.name,x+w/2,barY+barH/2+4);
    x += w;
  });

  ctx.font = '9px -apple-system,sans-serif';
  ctx.fillStyle = '#888';
  ctx.textAlign = 'left';
  ctx.fillText('Week 1',40,barY+barH+14);
  ctx.textAlign = 'right';
  ctx.fillText('Week 16',560,barY+barH+14);

  var chartY = 110, chartH = 180, chartW = 500;
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();ctx.moveTo(50,chartY);ctx.lineTo(50,chartY+chartH);ctx.lineTo(50+chartW,chartY+chartH);ctx.stroke();

  var week = 0;
  var volPts = [], intPts = [];
  PHASES.forEach(function(p){
    for(var i=0;i<p.weeks;i++){
      var wx = 50 + ((week+0.5)/totalWeeks)*chartW;
      volPts.push({x:wx,y:chartY+chartH-(p.volume/100)*chartH});
      intPts.push({x:wx,y:chartY+chartH-(p.intensity/100)*chartH});
      week++;
    }
  });

  ctx.beginPath();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;
  volPts.forEach(function(pt,i){i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y);});
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = '#FF4444';
  ctx.lineWidth = 2;
  intPts.forEach(function(pt,i){i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y);});
  ctx.stroke();

  volPts.forEach(function(pt){ctx.beginPath();ctx.arc(pt.x,pt.y,3,0,Math.PI*2);ctx.fillStyle='#22c55e';ctx.fill();});
  intPts.forEach(function(pt){ctx.beginPath();ctx.arc(pt.x,pt.y,3,0,Math.PI*2);ctx.fillStyle='#FF4444';ctx.fill();});

  ctx.font = '9px -apple-system,sans-serif';
  ctx.fillStyle = '#888';
  ctx.textAlign = 'right';
  ['100%','75%','50%','25%','0%'].forEach(function(l,i){
    var ly = chartY + (chartH*i/4);
    ctx.fillText(l,46,ly+4);
    ctx.beginPath();ctx.moveTo(50,ly);ctx.lineTo(550,ly);ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=1;ctx.stroke();
  });

  var lx = 50;
  [{c:'#22c55e',l:'Volume'},{c:'#FF4444',l:'Intensity'}].forEach(function(item){
    ctx.fillStyle = item.c;
    ctx.fillRect(lx,chartY+chartH+20,10,10);
    ctx.font = '10px -apple-system,sans-serif';
    ctx.fillStyle = '#aaa';
    ctx.textAlign = 'left';
    ctx.fillText(item.l,lx+14,chartY+chartH+29);
    lx += 80;
  });

  var cw = v21.periodization.completedWeeks || 0;
  ctx.font = '11px -apple-system,sans-serif';
  ctx.fillStyle = '#FFD700';
  ctx.textAlign = 'center';
  ctx.fillText('Completed: '+cw+'/16 weeks',300,chartY+chartH+50);

  var phaseName = cw < 4 ? 'Base' : cw < 8 ? 'Build' : cw < 12 ? 'Peak' : cw < 14 ? 'Taper' : cw < 15 ? 'Fight' : 'Recovery';
  ctx.fillStyle = '#f0f0f0';
  ctx.font = 'bold 12px -apple-system,sans-serif';
  ctx.fillText('Current Phase: '+phaseName,300,chartY+chartH+66);
}

function advanceWeek(){
  v21.periodization.completedWeeks = Math.min(16, (v21.periodization.completedWeeks||0)+1);
  if(v21.periodization.completedWeeks >= 16) v21.periodization.completedWeeks = 0;
  v21.featureUsage.period = (v21.featureUsage.period||0)+1;
  saveV21(v21);
  drawPeriodCanvas();
  playSFX21('period_plan');
  checkV21Achievements();
}

// ===== 2. PUNCH ACCURACY HEATMAP =====
var ACCURACY_ZONES = [
  {name:'Head',x:240,y:60,w:120,h:80,color:'#FF4444'},
  {name:'Body',x:240,y:150,w:120,h:90,color:'#f97316'},
  {name:'Liver',x:180,y:170,w:55,h:60,color:'#a855f7'},
  {name:'Jab Range',x:370,y:100,w:60,h:100,color:'#3b82f6'},
  {name:'Hook Range',x:120,y:100,w:55,h:100,color:'#22c55e'},
  {name:'Uppercut',x:260,y:250,w:80,h:60,color:'#06b6d4'}
];

function drawAccuracyCanvas(){
  var ctx = getCanvas('v21-accuracy-canvas',580,360);
  if(!ctx) return;

  ctx.fillStyle = '#0d0820';
  ctx.fillRect(0,0,580,360);

  ctx.font = 'bold 14px -apple-system,sans-serif';
  ctx.fillStyle = '#f0f0f0';
  ctx.textAlign = 'center';
  ctx.fillText('Punch Accuracy Heatmap',290,25);

  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(290,180,70,110,0,0,Math.PI*2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(290,100,35,0,Math.PI*2);
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.stroke();

  ACCURACY_ZONES.forEach(function(z){
    var hits = v21.accuracy.zones[z.name.toLowerCase().replace(/ /g,'_')] || 0;
    var total = v21.accuracy.total || 1;
    var rate = Math.min(hits/Math.max(total/6,1),1);

    ctx.fillStyle = z.color + '40';
    ctx.strokeStyle = z.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(z.x,z.y,z.w,z.h,6);
    ctx.fill();
    ctx.stroke();

    if(rate > 0){
      ctx.fillStyle = z.color + Math.round(rate*180+40).toString(16).padStart(2,'0');
      ctx.beginPath();
      ctx.roundRect(z.x,z.y,z.w,z.h,6);
      ctx.fill();
    }

    ctx.font = '9px -apple-system,sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(z.name,z.x+z.w/2,z.y+z.h/2-4);
    ctx.fillText(hits+' hits',z.x+z.w/2,z.y+z.h/2+8);
    ctx.fillText(Math.round(rate*100)+'%',z.x+z.w/2,z.y+z.h/2+20);
  });

  var totalHits = v21.accuracy.hits || 0;
  var totalAttempts = v21.accuracy.total || 0;
  var overallRate = totalAttempts > 0 ? Math.round((totalHits/totalAttempts)*100) : 0;
  ctx.font = 'bold 12px -apple-system,sans-serif';
  ctx.fillStyle = '#FFD700';
  ctx.textAlign = 'center';
  ctx.fillText('Overall Accuracy: '+overallRate+'% ('+totalHits+'/'+totalAttempts+')',290,340);
}

function practiceAccuracy(){
  var zones = ['head','body','liver','jab_range','hook_range','uppercut'];
  var zone = zones[Math.floor(Math.random()*zones.length)];
  var hit = Math.random() > 0.35;
  v21.accuracy.total = (v21.accuracy.total||0)+1;
  if(hit){
    v21.accuracy.hits = (v21.accuracy.hits||0)+1;
    v21.accuracy.zones[zone] = (v21.accuracy.zones[zone]||0)+1;
    playSFX21('accuracy_hit');
  } else {
    playSFX21('accuracy_miss');
  }
  v21.featureUsage.accuracy = (v21.featureUsage.accuracy||0)+1;
  saveV21(v21);
  drawAccuracyCanvas();
  checkV21Achievements();
}

// ===== 3. BOXING CARDIO ZONES =====
var CARDIO_ZONES = [
  {name:'Zone 1 Recovery',range:'50-60%',color:'#06b6d4'},
  {name:'Zone 2 Endurance',range:'60-70%',color:'#22c55e'},
  {name:'Zone 3 Tempo',range:'70-80%',color:'#f97316'},
  {name:'Zone 4 Threshold',range:'80-90%',color:'#FF4444'},
  {name:'Zone 5 Max',range:'90-100%',color:'#a855f7'}
];

function drawCardioCanvas(){
  var ctx = getCanvas('v21-cardio-canvas',560,340);
  if(!ctx) return;

  ctx.fillStyle = '#0d0820';
  ctx.fillRect(0,0,560,340);

  ctx.font = 'bold 14px -apple-system,sans-serif';
  ctx.fillStyle = '#f0f0f0';
  ctx.textAlign = 'center';
  ctx.fillText('Boxing Cardio Zones (12 Rounds)',280,25);

  var chartX=50,chartY=50,chartW=470,chartH=220;
  ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(chartX,chartY);ctx.lineTo(chartX,chartY+chartH);ctx.lineTo(chartX+chartW,chartY+chartH);ctx.stroke();

  var sess = v21.cardio.sessions.length > 0 ? v21.cardio.sessions : [];
  if(sess.length === 0){
    for(var r=0;r<12;r++){
      var base = [55,62,72,78,85,88,82,90,85,92,88,70];
      var val = base[r] + Math.floor(Math.random()*8-4);
      sess.push(Math.max(50,Math.min(100,val)));
    }
  }

  var barW = chartW / 12 - 4;
  sess.forEach(function(hr,i){
    var bx = chartX + i*(chartW/12) + 2;
    var fullH = ((hr-40)/60)*chartH;
    var by = chartY+chartH-fullH;

    var segments = [];
    var ranges = [[50,60],[60,70],[70,80],[80,90],[90,100]];
    var colors = ['#06b6d4','#22c55e','#f97316','#FF4444','#a855f7'];
    ranges.forEach(function(rng,zi){
      if(hr > rng[0]){
        var lo = Math.max(rng[0],40);
        var hi = Math.min(hr,rng[1]);
        var segH = ((hi-lo)/60)*chartH;
        var segY = chartY+chartH-((hi-40)/60)*chartH;
        segments.push({y:segY,h:segH,c:colors[zi]});
      }
    });

    segments.forEach(function(seg){
      ctx.fillStyle = seg.c;
      ctx.fillRect(bx,seg.y,barW,seg.h);
    });

    ctx.font = '9px -apple-system,sans-serif';
    ctx.fillStyle = '#aaa';
    ctx.textAlign = 'center';
    ctx.fillText('R'+(i+1),bx+barW/2,chartY+chartH+14);
    ctx.fillStyle = '#fff';
    ctx.fillText(hr+'%',bx+barW/2,by-4);
  });

  ctx.font = '9px -apple-system,sans-serif';
  ctx.fillStyle = '#888';
  ctx.textAlign = 'right';
  ['100%','80%','60%','40%'].forEach(function(l,i){
    var ly = chartY + (chartH*i/3);
    ctx.fillText(l,46,ly+4);
  });

  var lx = 50;
  CARDIO_ZONES.forEach(function(z){
    ctx.fillStyle = z.color;
    ctx.fillRect(lx,chartY+chartH+28,8,8);
    ctx.font = '8px -apple-system,sans-serif';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'left';
    ctx.fillText(z.range,lx+11,chartY+chartH+36);
    lx += 85;
  });
}

function generateCardioSession(){
  var sess = [];
  for(var i=0;i<12;i++){
    var patterns = [
      [55,65,72,80,85,88,78,90,85,92,88,65],
      [60,68,75,82,88,92,80,85,90,95,82,60],
      [50,58,70,78,82,86,80,88,92,90,75,55]
    ];
    var p = patterns[Math.floor(Math.random()*patterns.length)];
    sess.push(Math.max(50,Math.min(100,p[i]+Math.floor(Math.random()*6-3))));
  }
  v21.cardio.sessions = sess;
  v21.cardio.avgHR = Math.round(sess.reduce(function(a,b){return a+b;},0)/sess.length);
  v21.cardio.maxHR = Math.max.apply(null,sess);
  v21.featureUsage.cardio = (v21.featureUsage.cardio||0)+1;
  saveV21(v21);
  drawCardioCanvas();
  playSFX21('cardio_beep');
  checkV21Achievements();
}

// ===== 4. CORNER STRATEGY BOARD =====
var STRATEGIES = [
  {name:'Pressure',icon:'⚡',desc:'Push forward, cut ring'},
  {name:'Counter',icon:'🎯',desc:'Wait and counter-punch'},
  {name:'Body Work',icon:'💪',desc:'Target midsection'},
  {name:'Movement',icon:'👣',desc:'Use angles, circle'},
  {name:'Clinch',icon:'🤝',desc:'Control inside, rest'},
  {name:'Jab Heavy',icon:'🥊',desc:'Establish the jab'},
  {name:'Power Shots',icon:'💥',desc:'Load up big punches'},
  {name:'Defensive',icon:'🛡️',desc:'Shell up, survive'}
];

var cornerPlan = [];

function drawCornerCanvas(){
  var ctx = getCanvas('v21-corner-canvas',600,380);
  if(!ctx) return;

  ctx.fillStyle = '#0d0820';
  ctx.fillRect(0,0,600,380);

  ctx.font = 'bold 14px -apple-system,sans-serif';
  ctx.fillStyle = '#f0f0f0';
  ctx.textAlign = 'center';
  ctx.fillText('Corner Strategy Board',300,25);

  if(cornerPlan.length === 0){
    for(var i=0;i<12;i++){
      cornerPlan.push(STRATEGIES[Math.floor(Math.random()*STRATEGIES.length)]);
    }
  }

  var cellW = 130, cellH = 75;
  for(var r=0;r<4;r++){
    for(var c=0;c<3;c++){
      var idx = r*3+c;
      var x = 40 + c*(cellW+10);
      var y = 45 + r*(cellH+8);

      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x,y,cellW,cellH,8);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 11px -apple-system,sans-serif';
      ctx.fillStyle = '#FF4444';
      ctx.textAlign = 'left';
      ctx.fillText('R'+(idx+1),x+8,y+18);

      ctx.font = '20px -apple-system,sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(cornerPlan[idx].icon,x+cellW/2,y+40);

      ctx.font = '10px -apple-system,sans-serif';
      ctx.fillStyle = '#ddd';
      ctx.fillText(cornerPlan[idx].name,x+cellW/2,y+58);

      ctx.font = '8px -apple-system,sans-serif';
      ctx.fillStyle = '#888';
      ctx.fillText(cornerPlan[idx].desc,x+cellW/2,y+70);
    }
  }
}

function regenerateCornerPlan(){
  cornerPlan = [];
  for(var i=0;i<12;i++){
    cornerPlan.push(STRATEGIES[Math.floor(Math.random()*STRATEGIES.length)]);
  }
  v21.corner.roundsPlanned = (v21.corner.roundsPlanned||0)+12;
  v21.featureUsage.corner = (v21.featureUsage.corner||0)+1;
  saveV21(v21);
  drawCornerCanvas();
  playSFX21('corner_call');
  checkV21Achievements();
}

// ===== 5. FIGHTER ARCHETYPE QUIZ =====
var ARCHETYPE_QS = [
  {q:'How do you start a round?',a:['Jab and move','Charge forward','Wait and observe','Clinch immediately'],types:['outboxer','brawler','counter','clincher']},
  {q:'Your opponent throws a jab. You:',a:['Slip and counter','Block and return','Parry and step','Duck under'],types:['counter','brawler','outboxer','swarmer']},
  {q:'Preferred range?',a:['Long range','Mid range','Inside','Varies'],types:['outboxer','counter','swarmer','switch']},
  {q:'Training focus?',a:['Footwork','Power','Endurance','Speed'],types:['outboxer','brawler','swarmer','counter']},
  {q:'Your best punch?',a:['Jab','Cross','Hook','Uppercut'],types:['outboxer','counter','swarmer','brawler']},
  {q:'Down by 2 rounds. You:',a:['Stay patient','Go all in','Increase pressure','Switch strategy'],types:['counter','brawler','swarmer','switch']},
  {q:'Ideal fight pace?',a:['Slow & calculated','Fast & furious','Steady pressure','Alternating'],types:['counter','brawler','swarmer','switch']},
  {q:'Defensive style?',a:['Head movement','High guard','Shoulder roll','Footwork'],types:['counter','swarmer','switch','outboxer']},
  {q:'Who inspires you?',a:['Ali','Tyson','Mayweather','Pacquiao'],types:['outboxer','swarmer','counter','brawler']},
  {q:'After landing a big shot:',a:['Reset position','Swarm opponent','Set up next shot','Clinch'],types:['outboxer','swarmer','counter','clincher']},
  {q:'Cardio vs Power?',a:['Cardio first','Power first','Balanced','Depends on opponent'],types:['swarmer','brawler','outboxer','switch']},
  {q:'Last round, tied. You:',a:['Outwork them','Knockout attempt','Smart boxing','Body attack'],types:['swarmer','brawler','counter','outboxer']}
];

var archQIdx = 0, archScores = {};

function drawArchetypeCanvas(){
  var ctx = getCanvas('v21-arch-canvas',580,360);
  if(!ctx) return;

  ctx.fillStyle = '#0d0820';
  ctx.fillRect(0,0,580,360);

  ctx.font = 'bold 14px -apple-system,sans-serif';
  ctx.fillStyle = '#f0f0f0';
  ctx.textAlign = 'center';
  ctx.fillText('Fighter Archetype Quiz',290,25);

  if(v21.archetype.currentType){
    var type = v21.archetype.currentType;
    var typeData = {
      outboxer:{name:'Out-Boxer',desc:'Long range, technical, movement-based',stats:[90,50,85,60,90,70]},
      brawler:{name:'Brawler',desc:'Aggressive, power-first, forward pressure',stats:[40,95,55,85,30,80]},
      counter:{name:'Counter-Puncher',desc:'Patient, timing-based, defensive genius',stats:[70,65,95,55,80,75]},
      swarmer:{name:'Swarmer',desc:'Non-stop pressure, high volume, relentless',stats:[50,70,60,70,40,95]},
      switch:{name:'Switch-Hitter',desc:'Adaptive, unpredictable, versatile',stats:[75,75,75,75,75,75]},
      clincher:{name:'Clinch Fighter',desc:'Inside work, control, physicality',stats:[30,80,70,90,35,65]}
    };
    var td = typeData[type] || typeData.outboxer;
    var labels = ['Range','Power','IQ','Tough','Move','Cardio'];

    ctx.font = 'bold 18px -apple-system,sans-serif';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('You are: '+td.name,290,70);
    ctx.font = '12px -apple-system,sans-serif';
    ctx.fillStyle = '#aaa';
    ctx.fillText(td.desc,290,90);

    drawRadar(ctx,290,220,100,td.stats,labels,'#FF4444','rgba(255,68,68,0.2)');
    return;
  }

  if(archQIdx < ARCHETYPE_QS.length){
    var q = ARCHETYPE_QS[archQIdx];
    ctx.font = '12px -apple-system,sans-serif';
    ctx.fillStyle = '#aaa';
    ctx.fillText('Question '+(archQIdx+1)+'/'+ARCHETYPE_QS.length,290,55);

    ctx.font = 'bold 13px -apple-system,sans-serif';
    ctx.fillStyle = '#f0f0f0';
    ctx.fillText(q.q,290,85);

    q.a.forEach(function(a,i){
      var y = 110 + i*50;
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(90,y,400,38,8);
      ctx.fill();
      ctx.stroke();

      ctx.font = '12px -apple-system,sans-serif';
      ctx.fillStyle = '#ddd';
      ctx.textAlign = 'center';
      ctx.fillText(String.fromCharCode(65+i)+'. '+a,290,y+24);
    });
  } else {
    ctx.font = '14px -apple-system,sans-serif';
    ctx.fillStyle = '#aaa';
    ctx.fillText('Press Start to begin the quiz',290,180);
  }
}

function answerArchetype(choiceIdx){
  if(archQIdx >= ARCHETYPE_QS.length) return;
  var q = ARCHETYPE_QS[archQIdx];
  var type = q.types[choiceIdx] || 'outboxer';
  archScores[type] = (archScores[type]||0)+1;
  archQIdx++;

  if(archQIdx >= ARCHETYPE_QS.length){
    var best = '', bestScore = 0;
    for(var k in archScores){
      if(archScores[k] > bestScore){ bestScore = archScores[k]; best = k; }
    }
    v21.archetype.currentType = best;
    v21.archetype.results.push(best);
    v21.featureUsage.archetype = (v21.featureUsage.archetype||0)+1;
    saveV21(v21);
    playSFX21('archetype_reveal');
    checkV21Achievements();
  }
  drawArchetypeCanvas();
}

function startArchetypeQuiz(){
  archQIdx = 0;
  archScores = {};
  v21.archetype.currentType = '';
  saveV21(v21);
  drawArchetypeCanvas();
}

// ===== 6. DEFENSIVE DRILL SEQUENCER =====
var DEF_DRILLS = [
  {name:'Slip Left',icon:'⬅️',muscle:'Obliques'},
  {name:'Slip Right',icon:'➡️',muscle:'Obliques'},
  {name:'Duck',icon:'⬇️',muscle:'Quads/Core'},
  {name:'Parry',icon:'✋',muscle:'Forearms'},
  {name:'Catch',icon:'🤲',muscle:'Shoulders'},
  {name:'Roll',icon:'🔄',muscle:'Core/Hips'},
  {name:'Step Back',icon:'👣',muscle:'Calves'},
  {name:'Pivot',icon:'🔀',muscle:'Ankles/Hips'}
];

var defChain = [];

function drawDefenseCanvas(){
  var ctx = getCanvas('v21-defense-canvas',560,340);
  if(!ctx) return;

  ctx.fillStyle = '#0d0820';
  ctx.fillRect(0,0,560,340);

  ctx.font = 'bold 14px -apple-system,sans-serif';
  ctx.fillStyle = '#f0f0f0';
  ctx.textAlign = 'center';
  ctx.fillText('Defensive Drill Sequencer',280,25);

  var gridX = 30, gridY = 50, cellW = 120, cellH = 55;
  DEF_DRILLS.forEach(function(d,i){
    var r = Math.floor(i/4), c = i%4;
    var x = gridX + c*(cellW+8), y = gridY + r*(cellH+8);
    var inChain = defChain.indexOf(d.name) >= 0;

    ctx.fillStyle = inChain ? 'rgba(255,68,68,0.15)' : 'rgba(255,255,255,0.04)';
    ctx.strokeStyle = inChain ? '#FF4444' : 'rgba(255,255,255,0.1)';
    ctx.lineWidth = inChain ? 2 : 1;
    ctx.beginPath();
    ctx.roundRect(x,y,cellW,cellH,8);
    ctx.fill();
    ctx.stroke();

    ctx.font = '18px -apple-system,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(d.icon,x+cellW/2,y+24);
    ctx.font = '10px -apple-system,sans-serif';
    ctx.fillStyle = '#ddd';
    ctx.fillText(d.name,x+cellW/2,y+38);
    ctx.font = '8px -apple-system,sans-serif';
    ctx.fillStyle = '#888';
    ctx.fillText(d.muscle,x+cellW/2,y+50);
  });

  if(defChain.length > 0){
    ctx.font = 'bold 12px -apple-system,sans-serif';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.fillText('Chain: '+defChain.join(' → '),280,190);
    ctx.font = '11px -apple-system,sans-serif';
    ctx.fillStyle = '#aaa';
    ctx.fillText('Chain Length: '+defChain.length+' | Best: '+(v21.defense.bestChain||0),280,210);
  }

  var barY = 230, barH = 80, barW = 480;
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();ctx.moveTo(40,barY);ctx.lineTo(40,barY+barH);ctx.lineTo(40+barW,barY+barH);ctx.stroke();

  DEF_DRILLS.forEach(function(d,i){
    var count = 0;
    (v21.defense.drills||[]).forEach(function(dr){if(dr===d.name)count++;});
    var bw = barW/8 - 4;
    var bh = Math.min(count*8,barH);
    var bx = 40 + i*(barW/8)+2;

    ctx.fillStyle = '#FF4444';
    ctx.fillRect(bx,barY+barH-bh,bw,bh);

    ctx.font = '8px -apple-system,sans-serif';
    ctx.fillStyle = '#aaa';
    ctx.textAlign = 'center';
    ctx.fillText(d.name.split(' ')[0],bx+bw/2,barY+barH+12);
    if(count>0){ctx.fillStyle='#fff';ctx.fillText(count+'',bx+bw/2,barY+barH-bh-4);}
  });
}

function addDefenseDrill(){
  var drill = DEF_DRILLS[Math.floor(Math.random()*DEF_DRILLS.length)];
  defChain.push(drill.name);
  if(!v21.defense.drills) v21.defense.drills = [];
  v21.defense.drills.push(drill.name);
  v21.defense.completed = (v21.defense.completed||0)+1;
  if(defChain.length > (v21.defense.bestChain||0)) v21.defense.bestChain = defChain.length;
  v21.featureUsage.defense = (v21.featureUsage.defense||0)+1;
  saveV21(v21);
  drawDefenseCanvas();
  playSFX21('defense_block');
  checkV21Achievements();
}

function resetDefenseChain(){
  defChain = [];
  drawDefenseCanvas();
}

// ===== 7. BOXING INJURY PREVENTION =====
var INJURY_AREAS = [
  {name:'Wrists',risk:65,prevention:'Proper wrapping, wrist strengthening exercises'},
  {name:'Shoulders',risk:50,prevention:'Rotator cuff exercises, stretching'},
  {name:'Knees',risk:40,prevention:'Proper footwork, quad strengthening'},
  {name:'Hands',risk:75,prevention:'Correct fist formation, hand conditioning'},
  {name:'Neck',risk:55,prevention:'Neck bridges, chin tuck exercises'},
  {name:'Back',risk:45,prevention:'Core strengthening, posture awareness'},
  {name:'Elbows',risk:35,prevention:'Proper technique, arm stretching'},
  {name:'Ribs',risk:60,prevention:'Body conditioning, breathing technique'},
  {name:'Ankles',risk:30,prevention:'Balance training, ankle mobility'},
  {name:'Hips',risk:25,prevention:'Hip mobility, dynamic stretching'}
];

function drawInjuryCanvas(){
  var ctx = getCanvas('v21-injury-canvas',580,360);
  if(!ctx) return;

  ctx.fillStyle = '#0d0820';
  ctx.fillRect(0,0,580,360);

  ctx.font = 'bold 14px -apple-system,sans-serif';
  ctx.fillStyle = '#f0f0f0';
  ctx.textAlign = 'center';
  ctx.fillText('Injury Prevention Guide (10 Areas)',290,25);

  var labels = INJURY_AREAS.map(function(a){return a.name;});
  var values = INJURY_AREAS.map(function(a){
    var userRisk = v21.injury.riskAreas[a.name] || a.risk;
    return Math.max(0,Math.min(100,userRisk));
  });

  drawRadar(ctx,200,195,130,values,labels,'#FF4444','rgba(255,68,68,0.15)');

  var infoX = 380, infoY = 60;
  ctx.font = 'bold 11px -apple-system,sans-serif';
  ctx.fillStyle = '#FFD700';
  ctx.textAlign = 'left';
  ctx.fillText('Risk Assessment',infoX,infoY);

  var sorted = INJURY_AREAS.slice().sort(function(a,b){return (v21.injury.riskAreas[b.name]||b.risk)-(v21.injury.riskAreas[a.name]||a.risk);});
  sorted.slice(0,5).forEach(function(area,i){
    var risk = v21.injury.riskAreas[area.name] || area.risk;
    var y = infoY + 18 + i*28;
    var color = risk > 60 ? '#FF4444' : risk > 40 ? '#f97316' : '#22c55e';

    ctx.font = '10px -apple-system,sans-serif';
    ctx.fillStyle = '#ddd';
    ctx.fillText(area.name,infoX,y);

    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(infoX,y+4,150,10);
    ctx.fillStyle = color;
    ctx.fillRect(infoX,y+4,risk*1.5,10);

    ctx.font = '9px -apple-system,sans-serif';
    ctx.fillStyle = '#aaa';
    ctx.fillText(risk+'%',infoX+155,y+13);
  });

  var avgRisk = Math.round(values.reduce(function(a,b){return a+b;},0)/values.length);
  var grade = avgRisk < 30 ? 'A' : avgRisk < 45 ? 'B' : avgRisk < 60 ? 'C' : 'D';
  ctx.font = 'bold 12px -apple-system,sans-serif';
  ctx.fillStyle = '#FFD700';
  ctx.textAlign = 'center';
  ctx.fillText('Safety Grade: '+grade+' (Avg Risk: '+avgRisk+'%)',290,350);
}

function scanInjuryRisk(){
  INJURY_AREAS.forEach(function(area){
    var delta = Math.floor(Math.random()*20-8);
    var current = v21.injury.riskAreas[area.name] || area.risk;
    v21.injury.riskAreas[area.name] = Math.max(5,Math.min(95,current+delta));
  });
  v21.injury.assessments.push({date:new Date().toISOString()});
  v21.featureUsage.injury = (v21.featureUsage.injury||0)+1;
  saveV21(v21);
  drawInjuryCanvas();
  playSFX21('injury_scan');
  checkV21Achievements();
}

// ===== 8. MATCH ANALYSIS SCORECARD =====
var matchScores = [];

function drawMatchCanvas(){
  var ctx = getCanvas('v21-match-canvas',600,380);
  if(!ctx) return;

  ctx.fillStyle = '#0d0820';
  ctx.fillRect(0,0,600,380);

  ctx.font = 'bold 14px -apple-system,sans-serif';
  ctx.fillStyle = '#f0f0f0';
  ctx.textAlign = 'center';
  ctx.fillText('Match Analysis Scorecard (10-Point Must)',300,25);

  if(matchScores.length === 0){
    for(var i=0;i<12;i++){
      var r1 = 7 + Math.floor(Math.random()*4);
      var r2 = 7 + Math.floor(Math.random()*4);
      matchScores.push({round:i+1,red:r1,blue:r2});
    }
  }

  var tableX=40, tableY=50, colW=44, rowH=22;

  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(tableX,tableY,colW*13+40,rowH);

  ctx.font = 'bold 9px -apple-system,sans-serif';
  ctx.fillStyle = '#aaa';
  ctx.textAlign = 'center';
  ctx.fillText('',tableX+20,tableY+15);
  for(var r=0;r<12;r++){
    ctx.fillText('R'+(r+1),tableX+40+r*colW+colW/2,tableY+15);
  }
  ctx.fillText('Total',tableX+40+12*colW+10,tableY+15);

  var redTotal = 0, blueTotal = 0;
  matchScores.forEach(function(s){redTotal+=s.red;blueTotal+=s.blue;});

  [{label:'RED',color:'#FF4444',key:'red',total:redTotal},{label:'BLUE',color:'#3b82f6',key:'blue',total:blueTotal}].forEach(function(fighter,fi){
    var y = tableY + rowH + fi*rowH;
    ctx.fillStyle = fighter.color+'20';
    ctx.fillRect(tableX,y,colW*13+40,rowH);

    ctx.font = 'bold 9px -apple-system,sans-serif';
    ctx.fillStyle = fighter.color;
    ctx.textAlign = 'center';
    ctx.fillText(fighter.label,tableX+20,y+15);

    matchScores.forEach(function(s,i){
      var val = s[fighter.key];
      var won = fighter.key === 'red' ? s.red > s.blue : s.blue > s.red;
      ctx.font = won ? 'bold 10px -apple-system,sans-serif' : '10px -apple-system,sans-serif';
      ctx.fillStyle = won ? fighter.color : '#888';
      ctx.fillText(val+'',tableX+40+i*colW+colW/2,y+15);
    });

    ctx.font = 'bold 10px -apple-system,sans-serif';
    ctx.fillStyle = fighter.color;
    ctx.fillText(fighter.total+'',tableX+40+12*colW+10,y+15);
  });

  var chartY = tableY + rowH*3 + 20;
  var chartH = 140, chartW = 500;
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();ctx.moveTo(50,chartY);ctx.lineTo(50,chartY+chartH);ctx.lineTo(50+chartW,chartY+chartH);ctx.stroke();

  var redCum = 0, blueCum = 0;
  var redPts = [], bluePts = [];
  matchScores.forEach(function(s,i){
    redCum += s.red; blueCum += s.blue;
    var x = 50 + ((i+0.5)/12)*chartW;
    redPts.push({x:x,y:chartY+chartH-(redCum/(12*10))*chartH});
    bluePts.push({x:x,y:chartY+chartH-(blueCum/(12*10))*chartH});
  });

  ctx.beginPath();ctx.strokeStyle='#FF4444';ctx.lineWidth=2;
  redPts.forEach(function(p,i){i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);});ctx.stroke();

  ctx.beginPath();ctx.strokeStyle='#3b82f6';ctx.lineWidth=2;
  bluePts.forEach(function(p,i){i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);});ctx.stroke();

  redPts.forEach(function(p){ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fillStyle='#FF4444';ctx.fill();});
  bluePts.forEach(function(p){ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fillStyle='#3b82f6';ctx.fill();});

  var winner = redTotal > blueTotal ? 'RED' : blueTotal > redTotal ? 'BLUE' : 'DRAW';
  var winColor = winner === 'RED' ? '#FF4444' : winner === 'BLUE' ? '#3b82f6' : '#FFD700';
  ctx.font = 'bold 13px -apple-system,sans-serif';
  ctx.fillStyle = winColor;
  ctx.textAlign = 'center';
  ctx.fillText('Winner: '+winner+' ('+redTotal+'-'+blueTotal+')',300,chartY+chartH+25);

  var redRW = matchScores.filter(function(s){return s.red>s.blue;}).length;
  var blueRW = matchScores.filter(function(s){return s.blue>s.red;}).length;
  ctx.font = '10px -apple-system,sans-serif';
  ctx.fillStyle = '#aaa';
  ctx.fillText('Rounds Won: RED '+redRW+' | BLUE '+blueRW+' | Even '+(12-redRW-blueRW),300,chartY+chartH+42);
}

function generateMatch(){
  matchScores = [];
  for(var i=0;i<12;i++){
    var r1 = 7 + Math.floor(Math.random()*4);
    var r2 = 7 + Math.floor(Math.random()*4);
    matchScores.push({round:i+1,red:r1,blue:r2});
  }
  v21.matchAnalysis.judged = (v21.matchAnalysis.judged||0)+1;
  v21.featureUsage.match = (v21.featureUsage.match||0)+1;
  saveV21(v21);
  drawMatchCanvas();
  playSFX21('match_score');
  checkV21Achievements();
}

function downloadScorecard(){
  var c = document.getElementById('v21-match-canvas');
  if(!c) return;
  var link = document.createElement('a');
  link.download = 'boxing-scorecard.png';
  link.href = c.toDataURL('image/png');
  link.click();
}

// ===== QUIZ V21 (15 Questions) =====
var QUIZ_V21 = [
  {q:'What is periodization in training?',a:['Random workout selection','Structured training phases','Only doing cardio','Resting all week'],c:1},
  {q:'Which HR zone is the anaerobic threshold?',a:['Zone 1 (50-60%)','Zone 2 (60-70%)','Zone 4 (80-90%)','Zone 3 (70-80%)'],c:2},
  {q:'What does the 10-point must system mean?',a:['Both get 10 points','Winner gets 10, loser 9 or less','Total is always 10','10 rounds only'],c:1},
  {q:'Best defensive move against a straight right?',a:['Jump back','Slip left','Close eyes','Drop hands'],c:1},
  {q:'What is a counter-puncher known for?',a:['Constant aggression','Waiting for opponent mistakes','Only body shots','Running away'],c:1},
  {q:'Most common boxing injury area?',a:['Ankles','Hands/Wrists','Knees','Back'],c:1},
  {q:'What is the &quot;taper&quot; phase in fight camp?',a:['Maximum intensity','Reducing volume before fight','Only sparring','No training'],c:1},
  {q:'What muscle group is most used in hooks?',a:['Biceps','Obliques/Core','Calves','Neck'],c:1},
  {q:'In corner strategy, what does &quot;body work&quot; mean?',a:['Bodybuilding','Targeting midsection punches','Massage therapy','Stretching'],c:1},
  {q:'What is a swarmer fighting style?',a:['Long range boxing','Non-stop pressure and volume','Only counter-punching','Defensive shell'],c:1},
  {q:'How many rounds in a championship boxing match?',a:['10','12','15','8'],c:1},
  {q:'What is &quot;parrying&quot; in boxing?',a:['A type of punch','Deflecting punches with hands','Running away','Clinching'],c:1},
  {q:'Why is hand wrapping important?',a:['Looks cool','Protects bones and tendons','Adds weight to punches','Required by law'],c:1},
  {q:'What is the &quot;shoulder roll&quot; defense?',a:['Rolling on the ground','Using lead shoulder to deflect','A wrestling move','Throwing shoulder punches'],c:1},
  {q:'Ideal rest between intense rounds?',a:['10 seconds','1 minute','5 minutes','No rest needed'],c:1}
];

var quizV21Idx = 0, quizV21Score = 0, quizV21Active = false;

function startQuizV21(){
  quizV21Idx = 0;
  quizV21Score = 0;
  quizV21Active = true;
  renderQuizV21();
}

function renderQuizV21(){
  var area = document.getElementById('v21-quiz-area');
  if(!area) return;

  if(quizV21Idx >= QUIZ_V21.length){
    var grade = quizV21Score >= 14 ? 'S' : quizV21Score >= 12 ? 'A' : quizV21Score >= 10 ? 'B' : quizV21Score >= 7 ? 'C' : 'D';
    area.innerHTML = '<div style="text-align:center;padding:16px"><div style="font-size:28px;margin-bottom:8px">🏆</div><div style="font-size:16px;font-weight:800;color:#FFD700">'+grade+' Grade</div><div style="font-size:13px;color:var(--text-dim);margin-top:4px">'+quizV21Score+'/'+QUIZ_V21.length+' correct</div></div>';
    v21.quizV21Scores[new Date().toISOString()] = quizV21Score;
    v21.featureUsage.quiz = (v21.featureUsage.quiz||0)+1;
    saveV21(v21);
    quizV21Active = false;
    checkV21Achievements();
    return;
  }

  var q = QUIZ_V21[quizV21Idx];
  var html = '<div style="padding:12px"><div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">Q'+(quizV21Idx+1)+'/'+QUIZ_V21.length+'</div>';
  html += '<div style="font-size:13px;font-weight:700;margin-bottom:12px">'+q.q+'</div>';
  q.a.forEach(function(a,i){
    html += '<div onclick="window.__v21QuizAnswer('+i+')" style="padding:10px 14px;margin:6px 0;background:var(--surface);border:1px solid var(--glass-border);border-radius:10px;font-size:12px;cursor:pointer;transition:all 0.2s;color:var(--text-dim)" onmouseover="this.style.borderColor=\'#FF4444\';this.style.color=\'#f0f0f0\'" onmouseout="this.style.borderColor=\'\';this.style.color=\'\'">'+String.fromCharCode(65+i)+'. '+a+'</div>';
  });
  html += '</div>';
  area.innerHTML = html;
}

window.__v21QuizAnswer = function(idx){
  if(!quizV21Active) return;
  if(idx === QUIZ_V21[quizV21Idx].c){
    quizV21Score++;
    playSFX21('quiz_correct21');
  } else {
    playSFX21('quiz_wrong21');
  }
  quizV21Idx++;
  renderQuizV21();
};

// ===== ACHIEVEMENTS V21 (12) =====
var ACH_V21 = [
  {id:'camp_planner',name:'Camp Planner',icon:'📅',desc:'Complete 1 periodization cycle',check:function(){return (v21.periodization.completedWeeks||0)>=1;}},
  {id:'sharpshooter',name:'Sharpshooter',icon:'🎯',desc:'50+ accuracy attempts',check:function(){return (v21.accuracy.total||0)>=50;}},
  {id:'cardio_king',name:'Cardio King',icon:'❤️',desc:'3+ cardio sessions',check:function(){return (v21.featureUsage.cardio||0)>=3;}},
  {id:'corner_master',name:'Corner Master',icon:'📋',desc:'Plan 5+ corner strategies',check:function(){return (v21.featureUsage.corner||0)>=5;}},
  {id:'self_aware',name:'Self-Aware',icon:'🧐',desc:'Complete archetype quiz',check:function(){return v21.archetype.currentType!=='';}},
  {id:'iron_defense',name:'Iron Defense',icon:'🛡️',desc:'10-move defense chain',check:function(){return (v21.defense.bestChain||0)>=10;}},
  {id:'safety_first',name:'Safety First',icon:'🏥',desc:'3+ injury assessments',check:function(){return (v21.injury.assessments||[]).length>=3;}},
  {id:'judge_eye',name:'Judge Eye',icon:'⚖️',desc:'5+ match scorecards',check:function(){return (v21.matchAnalysis.judged||0)>=5;}},
  {id:'quiz_v21_s',name:'Quiz v21 S',icon:'🏆',desc:'S grade on v21 quiz',check:function(){for(var k in v21.quizV21Scores){if(v21.quizV21Scores[k]>=14)return true;}return false;}},
  {id:'quiz_v21_clear',name:'Quiz Clear',icon:'✅',desc:'Complete v21 quiz',check:function(){return Object.keys(v21.quizV21Scores).length>0;}},
  {id:'multi_tool_v21',name:'Multi-Tool',icon:'🔧',desc:'Use 6+ v21 features',check:function(){var c=0;for(var k in v21.featureUsage){if(v21.featureUsage[k]>0)c++;}return c>=6;}},
  {id:'v21_complete',name:'v21 Complete',icon:'🌟',desc:'Use all 8 v21 features',check:function(){var c=0;for(var k in v21.featureUsage){if(v21.featureUsage[k]>0)c++;}return c>=8;}}
];

function checkV21Achievements(){
  var newUnlock = false;
  ACH_V21.forEach(function(a){
    if(!v21.achievementsV21[a.id] && a.check()){
      v21.achievementsV21[a.id] = new Date().toISOString();
      newUnlock = true;
    }
  });
  if(newUnlock){
    saveV21(v21);
    playSFX21('achieve21');
    renderV21Achievements();
  }
}

function renderV21Achievements(){
  var grid = document.getElementById('v21-ach-grid');
  if(!grid) return;
  var html = '';
  ACH_V21.forEach(function(a){
    var unlocked = !!v21.achievementsV21[a.id];
    html += '<div class="badge '+(unlocked?'unlocked':'locked')+'" title="'+a.desc+'" style="min-width:80px;padding:10px 6px">';
    html += '<span class="badge-icon">'+a.icon+'</span>';
    html += '<span class="badge-name">'+a.name+'</span>';
    html += '</div>';
  });
  grid.innerHTML = html;
}

// ===== KEYBOARD SHORTCUTS =====
function initV21Keyboard(){
  document.addEventListener('keydown', function(e){
    if(!e.shiftKey) return;
    var el;
    switch(e.key){
      case 'Q': el = document.getElementById('v21-period'); break;
      case 'W': el = document.getElementById('v21-accuracy'); break;
      case 'E': el = document.getElementById('v21-cardio'); break;
      case 'R': el = document.getElementById('v21-corner'); break;
      case 'T': el = document.getElementById('v21-arch'); break;
      case 'Y': el = document.getElementById('v21-defense'); break;
      case 'U': el = document.getElementById('v21-injury'); break;
      case 'I': el = document.getElementById('v21-match'); break;
      default: return;
    }
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); playSFX21('nav_v21'); }
  });
}

// ===== BUILD V21 =====
function buildV21(){
  var container = document.querySelector('.container') || document.body;
  var footer = container.querySelector('.footer') || container.querySelector('footer');
  var html = '';

  html += '<div style="display:flex;gap:6px;padding:10px 16px;overflow-x:auto;-webkit-overflow-scrolling:touch">';
  [{id:'v21-period',icon:'📅',label:'Camp'},{id:'v21-accuracy',icon:'🎯',label:'Accuracy'},{id:'v21-cardio',icon:'❤️',label:'Cardio'},{id:'v21-corner',icon:'📋',label:'Corner'},{id:'v21-arch',icon:'🧐',label:'Archetype'},{id:'v21-defense',icon:'🛡️',label:'Defense'},{id:'v21-injury',icon:'🏥',label:'Injury'},{id:'v21-match',icon:'⚖️',label:'Match'}].forEach(function(n){
    html += '<button onclick="document.getElementById(\''+n.id+'\').scrollIntoView({behavior:\'smooth\'})" style="flex-shrink:0;padding:6px 12px;background:var(--surface);border:1px solid var(--glass-border);border-radius:20px;color:var(--text-dim);font-size:11px;cursor:pointer;white-space:nowrap">'+n.icon+' '+n.label+'</button>';
  });
  html += '</div>';

  html += '<section class="section" id="v21-period"><h2 class="section-title"><span class="emoji">📅</span> Fight Camp Periodization (16W)</h2><div class="card"><canvas id="v21-period-canvas" width="600" height="380" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v21-btn" id="v21-period-advance">📅 Advance Week</button></div></div></section>';

  html += '<section class="section" id="v21-accuracy"><h2 class="section-title"><span class="emoji">🎯</span> Punch Accuracy Heatmap</h2><div class="card"><canvas id="v21-accuracy-canvas" width="580" height="360" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v21-btn" id="v21-accuracy-punch">🥊 Practice Punch</button></div></div></section>';

  html += '<section class="section" id="v21-cardio"><h2 class="section-title"><span class="emoji">❤️</span> Boxing Cardio Zones (5 HR)</h2><div class="card"><canvas id="v21-cardio-canvas" width="560" height="340" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v21-btn" id="v21-cardio-gen">❤️ Generate Session</button></div></div></section>';

  html += '<section class="section" id="v21-corner"><h2 class="section-title"><span class="emoji">📋</span> Corner Strategy Board (12R)</h2><div class="card"><canvas id="v21-corner-canvas" width="600" height="380" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v21-btn" id="v21-corner-regen">🔄 New Plan</button></div></div></section>';

  html += '<section class="section" id="v21-arch"><h2 class="section-title"><span class="emoji">🧐</span> Fighter Archetype Quiz (12Q)</h2><div class="card"><canvas id="v21-arch-canvas" width="580" height="360" style="width:100%;height:auto;border-radius:12px"></canvas><div style="display:flex;gap:6px;margin-top:10px;justify-content:center"><button class="v21-btn" id="v21-arch-start">🧐 Start Quiz</button><button class="v21-btn-sec" id="v21-arch-a">A</button><button class="v21-btn-sec" id="v21-arch-b">B</button><button class="v21-btn-sec" id="v21-arch-c">C</button><button class="v21-btn-sec" id="v21-arch-d">D</button></div></div></section>';

  html += '<section class="section" id="v21-defense"><h2 class="section-title"><span class="emoji">🛡️</span> Defense Drill Sequencer (8)</h2><div class="card"><canvas id="v21-defense-canvas" width="560" height="340" style="width:100%;height:auto;border-radius:12px"></canvas><div style="display:flex;gap:6px;margin-top:10px;justify-content:center"><button class="v21-btn" id="v21-defense-add">🛡️ Add Drill</button><button class="v21-btn-sec" id="v21-defense-reset">🔄 Reset Chain</button></div></div></section>';

  html += '<section class="section" id="v21-injury"><h2 class="section-title"><span class="emoji">🏥</span> Injury Prevention (10 Areas)</h2><div class="card"><canvas id="v21-injury-canvas" width="580" height="360" style="width:100%;height:auto;border-radius:12px"></canvas><div style="text-align:center;margin-top:10px"><button class="v21-btn" id="v21-injury-scan">🏥 Scan Risk</button></div></div></section>';

  html += '<section class="section" id="v21-match"><h2 class="section-title"><span class="emoji">⚖️</span> Match Analysis Scorecard</h2><div class="card"><canvas id="v21-match-canvas" width="600" height="380" style="width:100%;height:auto;border-radius:12px"></canvas><div style="display:flex;gap:6px;margin-top:10px;justify-content:center"><button class="v21-btn" id="v21-match-gen">🥊 New Match</button><button class="v21-btn-sec" id="v21-match-dl">📷 Save PNG</button></div></div></section>';

  html += '<section class="section" id="v21-quiz"><h2 class="section-title"><span class="emoji">❓</span> v21 Quiz (15Q)</h2><div class="card"><div id="v21-quiz-area" style="min-height:60px"><div style="text-align:center;color:var(--text-dim);font-size:13px;padding:16px">Press Start</div></div><div style="text-align:center;margin-top:10px"><button class="v21-btn" id="v21-quiz-start">❓ Start Quiz</button></div></div></section>';

  html += '<section class="section" id="v21-ach"><h2 class="section-title"><span class="emoji">🏅</span> v21 Achievements (12)</h2><div class="card"><div class="badge-grid" id="v21-ach-grid" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center"></div></div></section>';

  var wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  while(wrapper.firstChild){
    if(footer) container.insertBefore(wrapper.firstChild, footer);
    else container.appendChild(wrapper.firstChild);
  }

  // Event listeners
  var pe = document.getElementById('v21-period-advance');
  if(pe) pe.addEventListener('click', advanceWeek);
  var ap = document.getElementById('v21-accuracy-punch');
  if(ap) ap.addEventListener('click', practiceAccuracy);
  var cg = document.getElementById('v21-cardio-gen');
  if(cg) cg.addEventListener('click', generateCardioSession);
  var cr = document.getElementById('v21-corner-regen');
  if(cr) cr.addEventListener('click', regenerateCornerPlan);
  var as2 = document.getElementById('v21-arch-start');
  if(as2) as2.addEventListener('click', startArchetypeQuiz);
  ['a','b','c','d'].forEach(function(l,i){
    var btn = document.getElementById('v21-arch-'+l);
    if(btn) btn.addEventListener('click', function(){answerArchetype(i);});
  });
  var da = document.getElementById('v21-defense-add');
  if(da) da.addEventListener('click', addDefenseDrill);
  var dr = document.getElementById('v21-defense-reset');
  if(dr) dr.addEventListener('click', resetDefenseChain);
  var is = document.getElementById('v21-injury-scan');
  if(is) is.addEventListener('click', scanInjuryRisk);
  var mg = document.getElementById('v21-match-gen');
  if(mg) mg.addEventListener('click', generateMatch);
  var md = document.getElementById('v21-match-dl');
  if(md) md.addEventListener('click', downloadScorecard);
  var qs = document.getElementById('v21-quiz-start');
  if(qs) qs.addEventListener('click', startQuizV21);

  setTimeout(function(){
    drawPeriodCanvas();
    drawAccuracyCanvas();
    drawCardioCanvas();
    drawCornerCanvas();
    drawArchetypeCanvas();
    drawDefenseCanvas();
    drawInjuryCanvas();
    drawMatchCanvas();
    renderV21Achievements();
  }, 100);
}

// ===== INIT =====
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', function(){ buildV21(); initV21Keyboard(); });
} else {
  buildV21(); initV21Keyboard();
}

})();
