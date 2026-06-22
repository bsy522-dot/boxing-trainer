// Boxing Trainer Pro v15_patch.js - NEXTERA+PRISM Auto Enhancement Module
// Punch Combination Builder Canvas 6punch+custom, Boxing Stance Analyzer 6stances,
// Virtual Sandbag Workout Canvas hitzone+combo, Injury Prevention Guide 12types,
// Judge Scoring Simulator 10R, Training Diary 5mood+50entries,
// Combat Power Dashboard Canvas 6axis Radar, Boxing Legendary Fights Review 12,
// Quiz +15 (90->105), +12 Achievements (94->106), SFX 12, Keyboard +8
(function(){
'use strict';

var STORAGE_KEY = 'boxingTrainerData';
var V15KEY = 'boxingV15Patch';

function loadAppData(){
  try { var r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch(e){ return null; }
}
function loadV15(){
  try {
    var r = localStorage.getItem(V15KEY);
    if(!r) return defV15();
    var p = JSON.parse(r), d = defV15();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV15(); }
}
function saveV15(d){ try { localStorage.setItem(V15KEY, JSON.stringify(d)); } catch(e){} }
function defV15(){
  return {
    comboBuilder: { customs: [], played: 0, bestCombo: 0 },
    stance: { viewed: [], favorite: '' },
    sandbag: { totalHits: 0, totalCombos: 0, bestScore: 0, sessions: 0 },
    injury: { viewed: [], quizDone: false },
    judging: { rounds: 0, accuracy: 0, sessions: [] },
    diary: { entries: [] },
    combatPower: { lastScan: null, history: [] },
    legendFights: { viewed: [], favorite: '' },
    quizV15Scores: {},
    achievementsV15: {},
    featureUsage: {}
  };
}

var v15 = loadV15();

// ===== SFX ENGINE V15 =====
function playSFX15(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'combo_build':
        [523,659,784].forEach(function(f,j){
          var o=ctx.createOscillator(),g=ctx.createGain();
          o.type='triangle';o.frequency.value=f;
          g.gain.setValueAtTime(0.1,t+j*0.08);g.gain.exponentialRampToValueAtTime(0.001,t+j*0.08+0.15);
          o.connect(g).connect(ctx.destination);o.start(t+j*0.08);o.stop(t+j*0.08+0.15);
        });break;
      case 'combo_play':
        var o1=ctx.createOscillator(),g1=ctx.createGain();
        o1.type='sawtooth';o1.frequency.setValueAtTime(220,t);o1.frequency.exponentialRampToValueAtTime(880,t+0.2);
        g1.gain.setValueAtTime(0.08,t);g1.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o1.connect(g1).connect(ctx.destination);o1.start(t);o1.stop(t+0.25);break;
      case 'stance_view':
        var o2=ctx.createOscillator(),g2=ctx.createGain();
        o2.type='sine';o2.frequency.setValueAtTime(440,t);o2.frequency.linearRampToValueAtTime(660,t+0.15);
        g2.gain.setValueAtTime(0.07,t);g2.gain.exponentialRampToValueAtTime(0.001,t+0.2);
        o2.connect(g2).connect(ctx.destination);o2.start(t);o2.stop(t+0.2);break;
      case 'bag_hit':
        var buf=ctx.createBuffer(1,ctx.sampleRate*0.05,ctx.sampleRate);
        var d=buf.getChannelData(0);
        for(var i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.exp(-i/(d.length*0.15));
        var src=ctx.createBufferSource(),gn=ctx.createGain();
        src.buffer=buf;gn.gain.setValueAtTime(0.15,t);gn.gain.exponentialRampToValueAtTime(0.001,t+0.06);
        src.connect(gn).connect(ctx.destination);src.start(t);break;
      case 'bag_combo':
        [392,494,587,698].forEach(function(f,j){
          var o3=ctx.createOscillator(),g3=ctx.createGain();
          o3.type='sine';o3.frequency.value=f;
          g3.gain.setValueAtTime(0.09,t+j*0.06);g3.gain.exponentialRampToValueAtTime(0.001,t+j*0.06+0.12);
          o3.connect(g3).connect(ctx.destination);o3.start(t+j*0.06);o3.stop(t+j*0.06+0.12);
        });break;
      case 'injury_open':
        var o4=ctx.createOscillator(),g4=ctx.createGain();
        o4.type='sine';o4.frequency.setValueAtTime(523,t);
        g4.gain.setValueAtTime(0.06,t);g4.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o4.connect(g4).connect(ctx.destination);o4.start(t);o4.stop(t+0.15);break;
      case 'judge_bell':
        [784,988,1175,1319].forEach(function(f,j){
          var o5=ctx.createOscillator(),g5=ctx.createGain();
          o5.type='triangle';o5.frequency.value=f;
          g5.gain.setValueAtTime(0.1,t+j*0.04);g5.gain.exponentialRampToValueAtTime(0.001,t+j*0.04+0.25);
          o5.connect(g5).connect(ctx.destination);o5.start(t+j*0.04);o5.stop(t+j*0.04+0.25);
        });break;
      case 'judge_score':
        var o6=ctx.createOscillator(),g6=ctx.createGain();
        o6.type='triangle';o6.frequency.setValueAtTime(659,t);o6.frequency.linearRampToValueAtTime(880,t+0.12);
        g6.gain.setValueAtTime(0.08,t);g6.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o6.connect(g6).connect(ctx.destination);o6.start(t);o6.stop(t+0.15);break;
      case 'diary_save':
        [523,659,784,1047].forEach(function(f,j){
          var o7=ctx.createOscillator(),g7=ctx.createGain();
          o7.type='sine';o7.frequency.value=f;
          g7.gain.setValueAtTime(0.06,t+j*0.1);g7.gain.exponentialRampToValueAtTime(0.001,t+j*0.1+0.2);
          o7.connect(g7).connect(ctx.destination);o7.start(t+j*0.1);o7.stop(t+j*0.1+0.2);
        });break;
      case 'radar_scan':
        var o8=ctx.createOscillator(),g8=ctx.createGain();
        o8.type='sine';o8.frequency.setValueAtTime(200,t);o8.frequency.exponentialRampToValueAtTime(1200,t+0.4);
        g8.gain.setValueAtTime(0.06,t);g8.gain.exponentialRampToValueAtTime(0.001,t+0.45);
        o8.connect(g8).connect(ctx.destination);o8.start(t);o8.stop(t+0.45);break;
      case 'legend_open':
        [440,554,659,880].forEach(function(f,j){
          var o9=ctx.createOscillator(),g9=ctx.createGain();
          o9.type='triangle';o9.frequency.value=f;
          g9.gain.setValueAtTime(0.07,t+j*0.08);g9.gain.exponentialRampToValueAtTime(0.001,t+j*0.08+0.18);
          o9.connect(g9).connect(ctx.destination);o9.start(t+j*0.08);o9.stop(t+j*0.08+0.18);
        });break;
      case 'achieve_v15':
        [523,659,784,1047,1319].forEach(function(f,j){
          var oA=ctx.createOscillator(),gA=ctx.createGain();
          oA.type='sine';oA.frequency.value=f;
          gA.gain.setValueAtTime(0.1,t+j*0.1);gA.gain.exponentialRampToValueAtTime(0.001,t+j*0.1+0.3);
          oA.connect(gA).connect(ctx.destination);oA.start(t+j*0.1);oA.stop(t+j*0.1+0.3);
        });break;
      case 'quiz_v15':
        var oB=ctx.createOscillator(),gB=ctx.createGain();
        oB.type='triangle';oB.frequency.setValueAtTime(880,t);oB.frequency.linearRampToValueAtTime(1175,t+0.1);
        gB.gain.setValueAtTime(0.08,t);gB.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        oB.connect(gB).connect(ctx.destination);oB.start(t);oB.stop(t+0.12);break;
    }
    setTimeout(function(){ ctx.close(); }, 2000);
  } catch(e){}
}

// ===== TOAST =====
function showToast15(msg){
  var t = document.createElement('div');
  t.className = 'v15-toast';
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#FF4444,#CC2222);color:#fff;padding:12px 28px;border-radius:30px;font-size:14px;font-weight:700;z-index:10000;pointer-events:none;opacity:0;transition:opacity 0.3s;box-shadow:0 4px 20px rgba(255,68,68,0.4);white-space:nowrap';
  document.body.appendChild(t);
  requestAnimationFrame(function(){ t.style.opacity='1'; });
  setTimeout(function(){ t.style.opacity='0'; setTimeout(function(){ t.remove(); },300); },2200);
}

// ===== STYLE INJECTION =====
function injectV15Styles(){
  if(document.getElementById('v15-styles')) return;
  var style = document.createElement('style');
  style.id = 'v15-styles';
  style.textContent = [
    '.v15-section{background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius);margin:16px;padding:20px;animation:slideUp 0.5s ease}',
    '.v15-title{font-size:20px;font-weight:800;margin-bottom:16px;display:flex;align-items:center;gap:8px}',
    '.v15-title .emoji{font-size:24px}',
    '.v15-subtitle{font-size:13px;color:var(--text-dim);margin:-10px 0 16px}',
    '.v15-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;background:linear-gradient(135deg,var(--accent),#CC2222);border:none;border-radius:10px;color:#fff;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;letter-spacing:0.5px}',
    '.v15-btn:hover{transform:scale(1.03);filter:brightness(1.1)}',
    '.v15-btn:active{transform:scale(0.97)}',
    '.v15-btn.secondary{background:var(--glass);border:1px solid var(--glass-border);color:var(--text)}',
    '.v15-btn.secondary:hover{border-color:var(--accent);color:var(--accent)}',
    '.v15-btn.sm{padding:6px 14px;font-size:12px;border-radius:8px}',
    '.v15-card{background:var(--surface);border:1px solid var(--glass-border);border-radius:12px;padding:16px;margin-bottom:12px;transition:all 0.2s}',
    '.v15-card:hover{border-color:var(--accent);transform:translateY(-2px)}',
    '.v15-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}',
    '.v15-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}',
    '.v15-flex{display:flex;flex-wrap:wrap;gap:8px}',
    '.v15-badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:var(--accent-soft);border-radius:20px;font-size:11px;font-weight:600;color:var(--accent)}',
    '.v15-meter{height:8px;background:var(--surface);border-radius:4px;overflow:hidden;margin:6px 0}',
    '.v15-meter-fill{height:100%;border-radius:4px;transition:width 0.5s ease}',
    '.v15-tag{display:inline-block;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600}',
    '.v15-canvas-wrap{position:relative;width:100%;margin:12px 0;border-radius:12px;overflow:hidden;background:rgba(0,0,0,0.3)}',
    '.v15-timeline{position:relative;padding-left:24px;border-left:2px solid var(--glass-border)}',
    '.v15-timeline-item{position:relative;padding:10px 0 10px 16px;font-size:13px}',
    '.v15-timeline-item::before{content:"";position:absolute;left:-29px;top:14px;width:10px;height:10px;border-radius:50%;background:var(--accent);border:2px solid var(--bg)}',
    '.v15-mood{cursor:pointer;font-size:28px;padding:6px;border-radius:8px;transition:all 0.2s;border:2px solid transparent}',
    '.v15-mood.selected{border-color:var(--accent);background:var(--accent-soft);transform:scale(1.15)}',
    '.v15-modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9000;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)}',
    '.v15-modal-overlay.show{display:flex}',
    '.v15-modal{background:var(--bg);border:1px solid var(--glass-border);border-radius:var(--radius);padding:24px;max-width:480px;width:90%;max-height:80vh;overflow-y:auto}',
    '.v15-modal-close{position:absolute;top:12px;right:12px;background:none;border:none;color:var(--text-dim);font-size:22px;cursor:pointer}',
    '@media(max-width:480px){.v15-grid2{grid-template-columns:1fr}.v15-grid3{grid-template-columns:1fr 1fr}}',
    '.v15-scrollnav{position:fixed;bottom:0;left:0;right:0;z-index:200;display:flex;overflow-x:auto;background:rgba(15,10,30,0.95);backdrop-filter:blur(20px);border-top:1px solid var(--glass-border);padding:8px 4px;gap:4px;-webkit-overflow-scrolling:touch}',
    '[data-theme="light"] .v15-scrollnav{background:rgba(245,245,248,0.95)}',
    '.v15-scrollnav-item{flex:0 0 auto;padding:6px 14px;border-radius:20px;font-size:11px;font-weight:600;color:var(--text-dim);white-space:nowrap;cursor:pointer;transition:all 0.2s;background:var(--glass);border:1px solid transparent}',
    '.v15-scrollnav-item:hover,.v15-scrollnav-item:active{color:var(--accent);border-color:var(--accent);background:var(--accent-soft)}'
  ].join('\n');
  document.head.appendChild(style);
}

// ===== 1. PUNCH COMBINATION BUILDER CANVAS =====
var PUNCH_TYPES = [
  {id:'jab',name:'&#51105;',short:'J',color:'#3b82f6'},
  {id:'cross',name:'&#53356;&#47196;&#49828;',short:'C',color:'#ef4444'},
  {id:'hook_l',name:'&#50812;&#54985;',short:'LH',color:'#22c55e'},
  {id:'hook_r',name:'&#50724;&#47480;&#54985;',short:'RH',color:'#f97316'},
  {id:'upper_l',name:'&#50812;&#50612;&#54140;',short:'LU',color:'#a855f7'},
  {id:'upper_r',name:'&#50724;&#47480;&#50612;&#54140;',short:'RU',color:'#ec4899'}
];

var PRESET_COMBOS = [
  {name:'&#44592;&#48376; &#50896;&#53804;',seq:['jab','cross'],desc:'&#44032;&#51109; &#44592;&#48376;&#51201;&#51064; &#53092;&#48372;'},
  {name:'&#53364;&#47000;&#49885; &#50896;&#53804;&#53804;&#47532;',seq:['jab','cross','hook_l'],desc:'1-2-3 &#50896;&#53804;&#53804;&#47532; &#53092;&#48372;'},
  {name:'&#54028;&#50892; &#54252;',seq:['jab','cross','hook_l','cross'],desc:'1-2-3-2 &#54028;&#50892;&#54400; &#47532;&#46300;&#44277;&#44201;'},
  {name:'&#48148;&#46356; &#50612;&#53469;',seq:['jab','jab','upper_l','cross'],desc:'&#51105;&#51105;&#50612;&#54140;&#53356;&#47196;&#49828; &#48148;&#46356;&#44277;&#47029;'},
  {name:'&#53076;&#45320; &#53944;&#47017;',seq:['cross','hook_l','upper_r'],desc:'&#53076;&#45320;&#50640; &#47792;&#50500;&#45347;&#44592;'},
  {name:'&#54028;&#50892; &#47084;&#49772;',seq:['jab','cross','upper_l','hook_r','cross'],desc:'5&#50672;&#53440; &#54924;&#50724;&#47532; &#44277;&#44201;'},
  {name:'&#54588;&#52852;&#48512; &#49828;&#53440;&#51068;',seq:['hook_l','hook_r','upper_l','upper_r'],desc:'&#44540;&#51217; &#54028;&#50892;&#54156;&#52824; &#47084;&#49772;'},
  {name:'&#47672;&#49888;&#44148; &#53092;&#48372;',seq:['jab','jab','cross','hook_l','upper_r','cross'],desc:'6&#50672;&#53440; &#47672;&#49888;&#44148; &#53092;&#48372;'}
];

var comboBuilderSeq = [];

function buildComboBuilder(){
  var sec = document.createElement('div');
  sec.className = 'v15-section';
  sec.id = 'v15-combo';
  sec.innerHTML = '<div class="v15-title"><span class="emoji">&#128170;</span> &#54156;&#52824; &#53092;&#48708;&#45348;&#51060;&#49496; &#48716;&#45908;</div>' +
    '<div class="v15-subtitle">6&#51333; &#54156;&#52824;&#47196; &#53092;&#48372; &#44396;&#49457; + &#54532;&#47532;&#49483; 8&#51333; + &#52964;&#49828;&#53568; &#48716;&#45908;</div>' +
    '<div class="v15-canvas-wrap"><canvas id="v15ComboCanvas" width="560" height="220" style="width:100%;display:block"></canvas></div>' +
    '<div class="v15-flex" style="margin-bottom:12px">' +
    PUNCH_TYPES.map(function(p){
      return '<button class="v15-btn sm" onclick="window._v15AddPunch(\''+p.id+'\')" style="background:'+p.color+'">' + p.short + ' ' + p.name + '</button>';
    }).join('') +
    '<button class="v15-btn sm secondary" onclick="window._v15ClearCombo()">&#52488;&#44592;&#54868;</button>' +
    '<button class="v15-btn sm" onclick="window._v15PlayCombo()">&#9654; &#49892;&#54665;</button>' +
    '</div>' +
    '<div style="font-size:13px;color:var(--text-dim);margin-bottom:10px">&#54532;&#47532;&#49483; &#53092;&#48372;:</div>' +
    '<div class="v15-grid2">' +
    PRESET_COMBOS.map(function(c,i){
      return '<div class="v15-card" style="cursor:pointer" onclick="window._v15LoadPreset('+i+')">' +
        '<div style="font-weight:700;font-size:14px;margin-bottom:4px">'+c.name+'</div>' +
        '<div style="font-size:11px;color:var(--text-dim)">'+c.desc+'</div>' +
        '<div style="margin-top:6px">' + c.seq.map(function(s){
          var p = PUNCH_TYPES.filter(function(x){return x.id===s})[0];
          return '<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:700;color:#fff;background:'+p.color+';margin-right:3px">'+p.short+'</span>';
        }).join('&#8594;') + '</div></div>';
    }).join('') +
    '</div>';
  return sec;
}

function drawComboCanvas(){
  var c = document.getElementById('v15ComboCanvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  ctx.clearRect(0,0,W,H);
  var isDark = !document.documentElement.hasAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.fillStyle = isDark ? '#0d0820' : '#eeeef2';
  ctx.fillRect(0,0,W,H);
  ctx.fillStyle = isDark ? '#aaa' : '#444';
  ctx.font = 'bold 14px -apple-system,sans-serif';
  ctx.textAlign = 'center';
  if(comboBuilderSeq.length === 0){
    ctx.fillStyle = isDark ? '#555' : '#999';
    ctx.font = '14px -apple-system,sans-serif';
    ctx.fillText('&#50948;&#51032; &#48260;&#53948;&#51012; &#45580;&#47084; &#53092;&#48372;&#47484; &#44396;&#49457;&#54616;&#49464;&#50836;',W/2,H/2);
    return;
  }
  var gap = Math.min(70, (W - 40) / comboBuilderSeq.length);
  var startX = (W - gap * (comboBuilderSeq.length - 1)) / 2;
  comboBuilderSeq.forEach(function(pid, i){
    var p = PUNCH_TYPES.filter(function(x){return x.id===pid})[0];
    var x = startX + i * gap;
    var y = H / 2;
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI*2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.strokeStyle = isDark ? '#fff' : '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px -apple-system,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.short, x, y);
    ctx.fillStyle = isDark ? '#ccc' : '#333';
    ctx.font = '11px -apple-system,sans-serif';
    ctx.fillText(p.name, x, y + 38);
    if(i < comboBuilderSeq.length - 1){
      ctx.beginPath();
      ctx.moveTo(x + 26, y);
      ctx.lineTo(x + gap - 26, y);
      ctx.strokeStyle = isDark ? '#666' : '#aaa';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + gap - 30, y - 5);
      ctx.lineTo(x + gap - 26, y);
      ctx.lineTo(x + gap - 30, y + 5);
      ctx.strokeStyle = isDark ? '#666' : '#aaa';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.font = 'bold 11px -apple-system,sans-serif';
    ctx.fillStyle = isDark ? '#888' : '#666';
    ctx.fillText(''+(i+1), x, y - 38);
  });
  ctx.fillStyle = isDark ? '#aaa' : '#555';
  ctx.font = 'bold 12px -apple-system,sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(comboBuilderSeq.length+'&#50672;&#53440; &#53092;&#48372;', 12, 20);
}

window._v15AddPunch = function(pid){
  if(comboBuilderSeq.length >= 10) { showToast15('&#52572;&#45824; 10&#50672;&#53440;&#44620;&#51648; &#44032;&#45733;&#54633;&#45768;&#45796;'); return; }
  comboBuilderSeq.push(pid);
  playSFX15('combo_build');
  drawComboCanvas();
  trackFeature('combo');
};
window._v15ClearCombo = function(){ comboBuilderSeq = []; drawComboCanvas(); };
window._v15LoadPreset = function(idx){
  comboBuilderSeq = PRESET_COMBOS[idx].seq.slice();
  playSFX15('combo_build');
  drawComboCanvas();
  showToast15(PRESET_COMBOS[idx].name + ' &#47196;&#46300;!');
  trackFeature('combo');
};
window._v15PlayCombo = function(){
  if(comboBuilderSeq.length === 0) return;
  playSFX15('combo_play');
  v15.comboBuilder.played++;
  if(comboBuilderSeq.length > v15.comboBuilder.bestCombo) v15.comboBuilder.bestCombo = comboBuilderSeq.length;
  saveV15(v15);
  showToast15(comboBuilderSeq.length+'&#50672;&#53440; &#53092;&#48372; &#49892;&#54665;!');
  checkV15Achievements();
};

// ===== 2. BOXING STANCE ANALYZER =====
var STANCES = [
  {id:'orthodox',name:'&#50724;&#49548;&#46021;&#49828;(&#51221;&#53685;)',atk:70,def:75,move:80,counter:65,speed:70,power:75,
   desc:'&#50724;&#47480;&#49552;&#51105;&#51060; &#44592;&#48376;. &#44032;&#51109; &#48372;&#54200;&#51201;&#51064; &#49828;&#53472;&#49828;. &#44512;&#54805;&#51105;&#55180; &#44277;&#48169;.',
   pros:'&#44512;&#54805;&#51105;&#55180; &#44277;&#48169;/&#48176;&#50864;&#44592; &#49772;&#50880;/&#54028;&#50892; &#54156;&#52824; &#51316;&#47749;',tips:'&#50526;&#48156; &#51105;-&#46271;&#48156; &#53356;&#47196;&#49828;&#47196; &#49884;&#51089;'},
  {id:'southpaw',name:'&#49324;&#50864;&#49828;&#54252;',atk:75,def:70,move:80,counter:70,speed:75,power:70,
   desc:'&#50812;&#49552;&#51105;&#51060; &#44592;&#48376;. &#51221;&#53685;&#54028; &#49345;&#45824;&#50640;&#44172; &#50976;&#47532;.',
   pros:'&#51221;&#53685;&#54028; &#49345;&#45824;&#47196; &#44033;&#46020; &#50976;&#47532;/&#50812;&#49552; &#54028;&#50892; &#54156;&#52824;',tips:'&#50724;&#47480;&#48156;&#51012; &#50526;&#50640; &#46160;&#44256; &#50724;&#47480;&#49552;&#51004;&#47196; &#47532;&#46300;'},
  {id:'peekaboo',name:'&#54588;&#52852;&#48512;',atk:85,def:80,move:65,counter:75,speed:80,power:90,
   desc:'&#47560;&#51060;&#53356; &#53440;&#51060;&#49832;&#51032; &#49884;&#44536;&#45768;&#52376; &#49828;&#53472;&#51068;. &#44540;&#51217; &#44277;&#44201;&#54805;.',
   pros:'&#44540;&#51217;&#51204; &#52572;&#44053;/&#54756;&#46300;&#47924;&#48652; &#48169;&#50612;/&#54028;&#50892;&#54400; &#50612;&#54140;&#52983;',tips:'&#44544;&#47084;&#48652;&#47484; &#50620;&#44404; &#45458;&#51060;&#50640;&#49436; &#46160;&#49552;&#51004;&#47196; &#53556;&#51012; &#44032;&#46300;'},
  {id:'philly',name:'&#54596;&#47532;&#49520;',atk:60,def:90,move:75,counter:90,speed:65,power:55,
   desc:'&#50612;&#44648; &#47196;&#47553; &#44592;&#48152;. &#52852;&#50868;&#53552; &#54156;&#52824; &#53945;&#54868;.',
   pros:'&#52852;&#50868;&#53552;&#54156;&#52824; &#52572;&#44053;/&#50612;&#44648; &#47196;&#47553; &#48169;&#50612;/&#50640;&#45320;&#51648; &#51208;&#50557;',tips:'&#50526;&#50612;&#44648;&#47484; &#45236;&#48128;&#44256; &#49345;&#45824; &#54156;&#52824;&#47484; &#49828;&#50948;&#54532;'},
  {id:'crossguard',name:'&#53356;&#47196;&#49828;&#44032;&#46300;',atk:65,def:85,move:70,counter:60,speed:60,power:70,
   desc:'&#54036;&#44144;&#52824;&#47484; &#44368;&#52264;&#54616;&#50668; &#44032;&#46300;. &#48148;&#46356; &#48169;&#50612; &#53945;&#54868;.',
   pros:'&#48148;&#46356; &#48169;&#50612; &#53945;&#54868;/&#51217;&#44540;&#51204; &#50504;&#51221;/&#45236;&#44396;&#49457; &#48372;&#51316;',tips:'&#50577;&#54036;&#51012; &#44368;&#52264;&#54616;&#50668; &#48148;&#46356;&#50752; &#50619;&#44404;&#51012; &#46041;&#49884; &#48169;&#50612;'},
  {id:'wide',name:'&#50752;&#51060;&#46300; &#49828;&#53472;&#49828;',atk:80,def:60,move:85,counter:70,speed:85,power:65,
   desc:'&#45331;&#51008; &#49828;&#53472;&#49828;&#47196; &#44592;&#46041;&#49457; &#44537;&#45824;&#54868;. &#50500;&#50883;&#48373;&#49905; &#49828;&#53440;&#51068;.',
   pros:'&#44592;&#46041;&#49457; &#52572;&#49345;/&#44033;&#46020; &#44277;&#44201; &#50976;&#47532;/&#44144;&#47532; &#50976;&#51648;',tips:'&#45331;&#51008; &#49828;&#53472;&#49828;&#50640;&#49436; &#48744;&#47480; &#51652;&#51077;&#44284; &#54980;&#53748;'}
];

function buildStanceAnalyzer(){
  var sec = document.createElement('div');
  sec.className = 'v15-section';
  sec.id = 'v15-stance';
  sec.innerHTML = '<div class="v15-title"><span class="emoji">&#129354;</span> &#48373;&#49905; &#49828;&#53472;&#49828; &#48516;&#49437;&#44592;</div>' +
    '<div class="v15-subtitle">6&#51333; &#49828;&#53472;&#49828; &#48708;&#44368; &#48516;&#49437; + &#51109;&#45800;&#51216; + &#54785;</div>' +
    '<div class="v15-grid2" id="v15StanceGrid"></div>' +
    '<div class="v15-canvas-wrap"><canvas id="v15StanceCanvas" width="400" height="360" style="width:100%;display:block"></canvas></div>';
  return sec;
}

function renderStances(){
  var grid = document.getElementById('v15StanceGrid');
  if(!grid) return;
  grid.innerHTML = '';
  STANCES.forEach(function(s){
    var viewed = v15.stance.viewed.indexOf(s.id) !== -1;
    var div = document.createElement('div');
    div.className = 'v15-card';
    div.style.cursor = 'pointer';
    div.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center">' +
      '<div style="font-weight:700;font-size:14px">' + s.name + '</div>' +
      (viewed ? '<span class="v15-badge">&#10003; &#54617;&#49845;</span>' : '') +
      '</div>' +
      '<div style="font-size:12px;color:var(--text-dim);margin:6px 0">'+s.desc+'</div>' +
      '<div style="font-size:11px;margin-top:4px"><b style="color:var(--green)">&#9654; &#51109;&#51216;:</b> '+s.pros+'</div>' +
      '<div style="font-size:11px;margin-top:4px"><b style="color:var(--blue)">&#128161; &#54785;:</b> '+s.tips+'</div>';
    div.onclick = function(){
      if(v15.stance.viewed.indexOf(s.id) === -1) v15.stance.viewed.push(s.id);
      saveV15(v15);
      playSFX15('stance_view');
      drawStanceRadar(s);
      renderStances();
      trackFeature('stance');
      checkV15Achievements();
    };
    grid.appendChild(div);
  });
}

function drawStanceRadar(st){
  var c = document.getElementById('v15StanceCanvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  ctx.clearRect(0,0,W,H);
  var isDark = !document.documentElement.hasAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.fillStyle = isDark ? '#0d0820' : '#eeeef2';
  ctx.fillRect(0,0,W,H);
  var cx = W/2, cy = H/2 + 10;
  var R = Math.min(W,H)*0.35;
  var labels = ['&#44277;&#44201;','&#48169;&#50612;','&#44592;&#46041;','&#52852;&#50868;&#53552;','&#49828;&#54588;&#46300;','&#54028;&#50892;'];
  var vals = [st.atk,st.def,st.move,st.counter,st.speed,st.power];
  var n = labels.length;
  for(var ring=1;ring<=5;ring++){
    ctx.beginPath();
    for(var i=0;i<n;i++){
      var a = -Math.PI/2 + (2*Math.PI/n)*i;
      var rr = R*ring/5;
      var px = cx + rr*Math.cos(a);
      var py = cy + rr*Math.sin(a);
      if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.closePath();
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  for(var i2=0;i2<n;i2++){
    var a2 = -Math.PI/2 + (2*Math.PI/n)*i2;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(cx + R*Math.cos(a2), cy + R*Math.sin(a2));
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
    ctx.stroke();
    ctx.fillStyle = isDark ? '#bbb' : '#444';
    ctx.font = 'bold 12px -apple-system,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var lx = cx + (R+22)*Math.cos(a2);
    var ly = cy + (R+22)*Math.sin(a2);
    ctx.fillText(labels[i2], lx, ly);
  }
  ctx.beginPath();
  for(var i3=0;i3<n;i3++){
    var a3 = -Math.PI/2 + (2*Math.PI/n)*i3;
    var rv = R*vals[i3]/100;
    var vx = cx + rv*Math.cos(a3);
    var vy = cy + rv*Math.sin(a3);
    if(i3===0) ctx.moveTo(vx,vy); else ctx.lineTo(vx,vy);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,68,68,0.2)';
  ctx.fill();
  ctx.strokeStyle = '#FF4444';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  for(var i4=0;i4<n;i4++){
    var a4 = -Math.PI/2 + (2*Math.PI/n)*i4;
    var rv2 = R*vals[i4]/100;
    ctx.beginPath();
    ctx.arc(cx + rv2*Math.cos(a4), cy + rv2*Math.sin(a4), 4, 0, Math.PI*2);
    ctx.fillStyle = '#FF4444';
    ctx.fill();
  }
  ctx.fillStyle = isDark ? '#fff' : '#111';
  ctx.font = 'bold 16px -apple-system,sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(st.name, W/2, 22);
  var avg = Math.round(vals.reduce(function(a,b){return a+b},0)/n);
  ctx.fillStyle = isDark ? '#aaa' : '#555';
  ctx.font = '12px -apple-system,sans-serif';
  ctx.fillText('&#54217;&#44512; &#45733;&#47141;&#52824;: '+avg+'/100', W/2, 42);
}

// ===== 3. VIRTUAL SANDBAG WORKOUT CANVAS =====
var bagState = { active: false, score: 0, combo: 0, timeLeft: 0, timer: null, zones: [], hitAnim: [] };

function buildSandbag(){
  var sec = document.createElement('div');
  sec.className = 'v15-section';
  sec.id = 'v15-sandbag';
  sec.innerHTML = '<div class="v15-title"><span class="emoji">&#129354;</span> &#44032;&#49345; &#49380;&#46300;&#48177; &#50892;&#53356;&#50500;&#50883;</div>' +
    '<div class="v15-subtitle">&#53552;&#52824;/&#53364;&#47533; &#54156;&#52824; + &#53092;&#48372; &#54532;&#47212;&#54532;&#53944; + &#51216;&#49688;/&#53440;&#51060;&#47672;</div>' +
    '<div class="v15-canvas-wrap"><canvas id="v15BagCanvas" width="400" height="450" style="width:100%;display:block;cursor:pointer"></canvas></div>' +
    '<div style="text-align:center;margin-top:8px">' +
    '<button class="v15-btn" id="v15BagStart" onclick="window._v15StartBag()">&#127942; 30&#52488; &#50892;&#53356;&#50500;&#50883; &#49884;&#51089;</button>' +
    '</div>' +
    '<div class="v15-grid3" style="margin-top:12px">' +
    '<div class="v15-card" style="text-align:center"><div style="font-size:11px;color:var(--text-dim)">&#52509; &#55176;&#53944;</div><div style="font-size:20px;font-weight:800;color:var(--accent)" id="v15BagTotalHits">'+v15.sandbag.totalHits+'</div></div>' +
    '<div class="v15-card" style="text-align:center"><div style="font-size:11px;color:var(--text-dim)">&#52572;&#44256;&#51216;&#49688;</div><div style="font-size:20px;font-weight:800;color:var(--gold)" id="v15BagBest">'+v15.sandbag.bestScore+'</div></div>' +
    '<div class="v15-card" style="text-align:center"><div style="font-size:11px;color:var(--text-dim)">&#49464;&#49496;</div><div style="font-size:20px;font-weight:800;color:var(--green)" id="v15BagSessions">'+v15.sandbag.sessions+'</div></div>' +
    '</div>';
  return sec;
}

function drawBag(){
  var c = document.getElementById('v15BagCanvas');
  if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  ctx.clearRect(0,0,W,H);
  var isDark = !document.documentElement.hasAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.fillStyle = isDark ? '#0d0820' : '#eeeef2';
  ctx.fillRect(0,0,W,H);
  ctx.strokeStyle = isDark ? '#444' : '#bbb';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(W/2,10); ctx.lineTo(W/2,60); ctx.stroke();
  var bagX = W/2, bagY = 240, bagW = 110, bagH = 280;
  var grd = ctx.createLinearGradient(bagX-bagW/2,bagY-bagH/2,bagX+bagW/2,bagY+bagH/2);
  grd.addColorStop(0,'#8B0000');grd.addColorStop(0.5,'#CC2222');grd.addColorStop(1,'#8B0000');
  ctx.beginPath();
  ctx.moveTo(bagX - bagW/2, bagY - bagH/2 + 30);
  ctx.quadraticCurveTo(bagX - bagW/2, bagY - bagH/2, bagX - bagW/2 + 20, bagY - bagH/2);
  ctx.lineTo(bagX + bagW/2 - 20, bagY - bagH/2);
  ctx.quadraticCurveTo(bagX + bagW/2, bagY - bagH/2, bagX + bagW/2, bagY - bagH/2 + 30);
  ctx.lineTo(bagX + bagW/2 + 5, bagY + bagH/2 - 30);
  ctx.quadraticCurveTo(bagX + bagW/2 + 5, bagY + bagH/2, bagX + bagW/2 - 15, bagY + bagH/2);
  ctx.lineTo(bagX - bagW/2 + 15, bagY + bagH/2);
  ctx.quadraticCurveTo(bagX - bagW/2 - 5, bagY + bagH/2, bagX - bagW/2 - 5, bagY + bagH/2 - 30);
  ctx.closePath();
  ctx.fillStyle = grd;
  ctx.fill();
  ctx.strokeStyle = '#660000';
  ctx.lineWidth = 2;
  ctx.stroke();
  var zones = [
    {name:'&#47672;&#47532;',y:bagY-100,r:28,color:'rgba(255,68,68,0.3)'},
    {name:'&#44032;&#49844;',y:bagY-30,r:35,color:'rgba(255,150,50,0.3)'},
    {name:'&#48373;&#48512;',y:bagY+50,r:32,color:'rgba(100,200,100,0.3)'},
    {name:'&#50616;&#44396;&#47532;',y:bagY+130,r:26,color:'rgba(100,150,255,0.3)'}
  ];
  bagState.zones = zones.map(function(z){ return {name:z.name, x:bagX, y:z.y, r:z.r}; });
  zones.forEach(function(z){
    ctx.beginPath();
    ctx.arc(bagX, z.y, z.r, 0, Math.PI*2);
    ctx.fillStyle = z.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = '11px -apple-system,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(z.name, bagX, z.y);
  });
  bagState.hitAnim = bagState.hitAnim.filter(function(h){ return Date.now() - h.t < 500; });
  bagState.hitAnim.forEach(function(h){
    var age = (Date.now() - h.t) / 500;
    ctx.beginPath();
    ctx.arc(h.x, h.y, 15 + age * 30, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(255,215,0,'+(1-age)+')';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,68,68,'+(1-age)+')';
    ctx.font = 'bold 18px -apple-system,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('+'+h.pts, h.x, h.y - 20 - age*30);
  });
  if(bagState.active){
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 28px -apple-system,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(bagState.timeLeft+'s', W/2, 35);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px -apple-system,sans-serif';
    ctx.fillText('&#51216;&#49688;: '+bagState.score+'  &#53092;&#48372;: '+bagState.combo, W/2, H - 20);
  } else {
    ctx.fillStyle = isDark ? '#888' : '#666';
    ctx.font = '13px -apple-system,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('&#49380;&#46300;&#48177;&#51012; &#53552;&#52824;/&#53364;&#47533;&#54616;&#50668; &#54156;&#52824;&#54616;&#49464;&#50836;', W/2, H - 20);
  }
}

window._v15StartBag = function(){
  if(bagState.active) return;
  bagState.active = true;
  bagState.score = 0;
  bagState.combo = 0;
  bagState.timeLeft = 30;
  bagState.hitAnim = [];
  playSFX15('judge_bell');
  var c = document.getElementById('v15BagCanvas');
  if(c){
    c.onclick = function(e){
      if(!bagState.active) return;
      var rect = c.getBoundingClientRect();
      var scaleX = c.width / rect.width;
      var scaleY = c.height / rect.height;
      var mx = (e.clientX - rect.left) * scaleX;
      var my = (e.clientY - rect.top) * scaleY;
      var hit = false;
      bagState.zones.forEach(function(z){
        var dx = mx - z.x, dy = my - z.y;
        if(Math.sqrt(dx*dx+dy*dy) <= z.r + 15){
          hit = true;
          bagState.combo++;
          var pts = 10 + Math.floor(bagState.combo / 3) * 5;
          if(z.name === '\u{BA38}\u{B9AC}') pts += 10;
          bagState.score += pts;
          bagState.hitAnim.push({x:mx,y:my,pts:pts,t:Date.now()});
          playSFX15('bag_hit');
        }
      });
      if(!hit) { bagState.combo = 0; }
      drawBag();
    };
  }
  bagState.timer = setInterval(function(){
    bagState.timeLeft--;
    if(bagState.timeLeft <= 0){
      clearInterval(bagState.timer);
      bagState.active = false;
      v15.sandbag.totalHits += bagState.score;
      v15.sandbag.sessions++;
      if(bagState.score > v15.sandbag.bestScore) v15.sandbag.bestScore = bagState.score;
      saveV15(v15);
      playSFX15('bag_combo');
      showToast15('&#50892;&#53356;&#50500;&#50883; &#50756;&#47308;! &#51216;&#49688;: '+bagState.score);
      var el1 = document.getElementById('v15BagTotalHits'); if(el1) el1.textContent = v15.sandbag.totalHits;
      var el2 = document.getElementById('v15BagBest'); if(el2) el2.textContent = v15.sandbag.bestScore;
      var el3 = document.getElementById('v15BagSessions'); if(el3) el3.textContent = v15.sandbag.sessions;
      checkV15Achievements();
    }
    drawBag();
  }, 1000);
  drawBag();
  trackFeature('sandbag');
};

// ===== 4. INJURY PREVENTION GUIDE =====
var INJURIES = [
  {name:'&#50612;&#44648; &#47196;&#53580;&#51060;&#53552;&#52964;&#54532; &#48512;&#49345;',area:'&#50612;&#44648;',risk:'&#45458;&#51020;',
   prevent:'&#51649;&#52840;&#44397;/&#52377;&#48373;&#44540; &#44053;&#54868;, &#54156;&#52824; &#51204; &#49828;&#53944;&#47112;&#52845;',
   treat:'&#55092;&#49885;, RICE &#50836;&#48277;, &#51216;&#51652;&#51201; &#48373;&#44480;'},
  {name:'&#49552;&#47785;/&#49552;&#44032;&#46973; &#44264;&#51208;',area:'&#49552;',risk:'&#45458;&#51020;',
   prevent:'&#50732;&#48148;&#47480; &#48533;&#45824; &#44048;&#44592;, &#47001;&#54021;&#46041;&#51089; &#51221;&#54869;&#55176; &#49688;&#54665;',
   treat:'&#44256;&#51221;, &#48337;&#50896; &#51652;&#47308;, &#50756;&#52824; &#49884;&#44620;&#51648; &#54984;&#47144; &#51473;&#45800;'},
  {name:'&#45516;&#51652;&#53461;(&#44221;&#48120;)',area:'&#47672;&#47532;',risk:'&#45458;&#51020;',
   prevent:'&#54756;&#46300;&#44032;&#46300; &#54637;&#49345; &#50976;&#51648;, &#47785; &#44540;&#47141; &#44053;&#54868;',
   treat:'&#51593;&#49884; &#55092;&#49885;, 1~2&#51452; &#50756;&#51204;&#55092;&#49885;, &#51204;&#47928;&#44032; &#49345;&#45812;'},
  {name:'&#47924;&#47502; &#51064;&#45824; &#49552;&#49345;',area:'&#47924;&#47502;',risk:'&#51473;&#44036;',
   prevent:'&#54588;&#48372;&#54021;/&#48512;&#50892;&#53356; &#49884; &#47924;&#47502; &#48169;&#54693; &#51452;&#51032;',
   treat:'&#48152;&#50900;&#44256;, &#50517;&#48149;, &#47932;&#47532;&#52824;&#47308;, &#49900;&#54616;&#47732; &#49688;&#49696;'},
  {name:'&#44040;&#48708;&#48904;(&#44264;&#48180;) &#50516;&#48149;&#50864;&#49828;',area:'&#54036;&#44636;&#52824;',risk:'&#51473;&#44036;',
   prevent:'&#49552;&#47785; &#44053;&#54868; &#50868;&#46041;, &#50644;&#46300;&#54252;&#51064;&#53944; &#48373;&#49905;&#54984;&#47144;',
   treat:'&#48533;&#45824;+&#50500;&#51060;&#49905;+&#55092;&#49885;, &#54252;&#47084;&#47204;&#47553;'},
  {name:'&#44040;&#48708;&#48904; &#44264;&#51208;(&#44396;&#49885;)',area:'&#44040;&#48708;&#48904;',risk:'&#51473;&#44036;',
   prevent:'&#47901;&#44032;&#46300; &#51109;&#52265;&#44428;&#51109;, &#54588;&#48372;&#54021; &#44592;&#49696; &#54984;&#47144;',
   treat:'&#51593;&#49884; &#55092;&#49885;, &#48337;&#50896; &#51652;&#47308;, &#53560; &#44256;&#51221;'},
  {name:'&#47785; &#44540;&#50977; &#44596;&#51109;',area:'&#47785;',risk:'&#51473;&#44036;',
   prevent:'&#47785; &#49828;&#53944;&#47112;&#52845; &#52649;&#48516;&#55176;, &#47700;&#46356;&#49888;&#48380; &#50868;&#46041;',
   treat:'&#46384;&#46907;&#54620; &#54032;, &#47560;&#49324;&#51648;, &#49828;&#53944;&#47112;&#52845;, &#48152;&#50900;&#44256;'},
  {name:'&#50500;&#53420;&#47112;&#49828;&#44148; &#53685;&#51613;',area:'&#48156;',risk:'&#45230;&#51020;',
   prevent:'&#50500;&#53420;&#47112;&#49828;&#44148; &#44053;&#54868; &#50868;&#46041;, &#51201;&#51208;&#54620; &#49888;&#48156;',
   treat:'&#55092;&#49885;, &#53580;&#51060;&#54609;, &#50684;&#51613; &#44048;&#49548; &#52376;&#52824;'},
  {name:'&#53076; &#52636;&#54792;/&#44264;&#51208;',area:'&#53076;',risk:'&#51473;&#44036;',
   prevent:'&#53076; &#48372;&#54840;&#44592;(&#44148;) &#52265;&#50857;, &#48169;&#50612; &#44592;&#49696; &#50672;&#49845;',
   treat:'&#51593;&#49884; &#55092;&#49885;, &#44148;&#51004;&#47196; &#48372;&#54840;, &#48337;&#50896; &#51652;&#47308;'},
  {name:'&#50868;&#46041;&#50976;&#48156;&#49457; &#52380;&#49885;',area:'&#54840;&#55137;&#44592;',risk:'&#45230;&#51020;',
   prevent:'&#50892;&#48141;&#50629;&#52649;&#48516;&#55176;, &#51064;&#54756;&#51068;&#47084; &#48708;&#52824;',
   treat:'&#44148;&#51312;&#54620; &#54872;&#44221;&#50640;&#49436; &#49436;&#49436;&#55176; &#54984;&#47144;, &#48337;&#50896; &#49345;&#45812;'},
  {name:'&#54728;&#47532; &#46356;&#49828;&#53356; &#48512;&#49345;',area:'&#54728;&#47532;',risk:'&#45230;&#51020;',
   prevent:'&#53076;&#50612; &#44053;&#54868;, &#48373;&#49905;&#49884; &#51201;&#51208;&#54620; &#54744;&#51020;&#44144;&#47532;&#44592;',
   treat:'&#55092;&#49885;, &#49828;&#53944;&#47112;&#52845;, &#47932;&#47532;&#52824;&#47308;'},
  {name:'&#50676;&#49324;&#48337;/&#53448;&#49688;',area:'&#51204;&#49888;',risk:'&#45230;&#51020;',
   prevent:'&#52649;&#48516;&#54620; &#49688;&#48516; &#49453;&#52712;, &#55092;&#49885; &#44036;&#44201; &#51456;&#49688;',
   treat:'&#49884;&#50896;&#54620; &#54872;&#44221;&#51004;&#47196; &#51060;&#46041;, &#49688;&#48516;/&#51204;&#54644;&#51656; &#48372;&#52649;'}
];

function buildInjuryGuide(){
  var sec = document.createElement('div');
  sec.className = 'v15-section';
  sec.id = 'v15-injury';
  sec.innerHTML = '<div class="v15-title"><span class="emoji">&#127973;</span> &#48512;&#49345; &#50696;&#48169; &#44032;&#51060;&#46300;</div>' +
    '<div class="v15-subtitle">12&#51333; &#48373;&#49905; &#48512;&#49345; &#50976;&#54805; + &#50696;&#48169;&#48277; + &#52824;&#47308;&#48277;</div>' +
    '<div id="v15InjuryList"></div>';
  return sec;
}

function renderInjuries(){
  var list = document.getElementById('v15InjuryList');
  if(!list) return;
  list.innerHTML = '';
  INJURIES.forEach(function(inj, idx){
    var viewed = v15.injury.viewed.indexOf(idx) !== -1;
    var riskColor = inj.risk === '\u{B192}\u{C74C}' ? '#ef4444' : inj.risk === '\u{C911}\u{AC04}' ? '#f97316' : '#22c55e';
    var div = document.createElement('div');
    div.className = 'v15-card';
    div.style.cursor = 'pointer';
    div.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
      '<div style="font-weight:700;font-size:14px">'+inj.name+'</div>' +
      '<span class="v15-tag" style="background:'+riskColor+';color:#fff">&#50948;&#54744;: '+inj.risk+'</span>' +
      '</div>' +
      '<div style="font-size:12px;margin-bottom:4px"><b>&#48512;&#50948;:</b> '+inj.area+'</div>' +
      '<div style="font-size:12px;margin-bottom:4px;color:var(--green)"><b>&#50696;&#48169;:</b> '+inj.prevent+'</div>' +
      '<div style="font-size:12px;color:var(--blue)"><b>&#52824;&#47308;:</b> '+inj.treat+'</div>' +
      (viewed ? '<div style="margin-top:6px"><span class="v15-badge">&#10003; &#54617;&#49845;</span></div>' : '');
    div.onclick = function(){
      if(v15.injury.viewed.indexOf(idx) === -1) v15.injury.viewed.push(idx);
      saveV15(v15);
      playSFX15('injury_open');
      renderInjuries();
      trackFeature('injury');
      checkV15Achievements();
    };
    list.appendChild(div);
  });
}

// ===== 5. JUDGE SCORING SIMULATOR =====
var JUDGE_SCENARIOS = [
  {round:1,desc:'A&#49440;&#49688;&#44032; &#51105;&#51012; &#44228;&#49549; &#44866;&#44256;, B&#49440;&#49688;&#45716; &#44032;&#46300; &#50920;&#50640;&#49436; &#47750;&#52264;&#47168; &#53356;&#47196;&#49828;&#47484; &#47532;&#53556;&#54665;&#45796;.',a_score:9,b_score:10,explain:'B&#49440;&#49688;&#51032; &#53364;&#47536; &#54028;&#50892;&#54156;&#52824;&#44032; &#45908; &#54952;&#44284;&#51201;'},
  {round:2,desc:'&#50577;&#49440;&#49688; &#54876;&#48156;&#54620; &#44277;&#48169;. A&#44032; &#47564;&#51060; &#46384;&#47160;&#51648;&#47564; B&#44032; &#53364;&#47536;&#55176;&#53944; &#48708;&#50984;&#51060; &#45458;&#45796;.',a_score:9,b_score:10,explain:'&#52572;&#51333;&#44208;&#44284; &#51088;&#52404;&#48372;&#45796; &#53364;&#47536;&#55176;&#53944; &#48708;&#50984;&#44284; &#54952;&#44284;&#51201; &#44277;&#44201;&#51060; &#51473;&#50836;'},
  {round:3,desc:'A&#49440;&#49688;&#44032; &#50612;&#54140;&#52983;&#51004;&#47196; B&#47484; &#55124;&#46308;&#47540; &#51216;&#46020;&#51032; &#44053;&#47141;&#54620; &#54156;&#52824;&#47484; &#45347;&#50632;&#45796;.',a_score:10,b_score:8,explain:'&#45796;&#50868;&#51012; &#50976;&#48156;&#54620; &#44053;&#47141;&#54620; &#54156;&#52824;&#45716; 10-8 &#52292;&#51216; &#44032;&#45733;'},
  {round:4,desc:'B&#49440;&#49688;&#44032; &#47553; &#44032;&#50868;&#45936;&#47484; &#51109;&#50501;&#54616;&#44256; &#49345;&#45824;&#47484; &#47044;&#50500;&#45347;&#44596;&#45796;.',a_score:9,b_score:10,explain:'&#47553;&#51228;&#45320;&#47084;&#49901;(&#47553; &#51109;&#50501;)&#51008; &#52292;&#51216;&#50640; &#50976;&#47532;'},
  {round:5,desc:'&#50577;&#49440;&#49688; &#54948;&#46300; &#44368;&#54872;&#51060; &#47566;&#50520;&#44256;, &#53945;&#48324;&#55176; &#50864;&#50948;&#47484; &#44032;&#47540; &#49688; &#50630;&#45716; &#51217;&#51204;.',a_score:10,b_score:10,explain:'&#48516;&#47749;&#54620; &#50864;&#50948;&#44032; &#50630;&#51004;&#47732; 10-10 &#51060;&#48516; &#46972;&#50868;&#46300;'},
  {round:6,desc:'A&#49440;&#49688;&#44032; &#51105;&#51004;&#47196; &#44144;&#47532;&#47484; &#50976;&#51648;&#54616;&#47728; &#50500;&#50883;&#48373;&#49905;&#51012; &#54178;&#52456;&#45796;.',a_score:10,b_score:9,explain:'&#54952;&#44284;&#51201; &#44144;&#47532; &#50976;&#51648;&#50752; &#44648;&#45143;&#54620; &#51105;&#51060; &#45458;&#44172; &#54217;&#44032;'},
  {round:7,desc:'B&#49440;&#49688;&#44032; &#53364;&#47536;&#52824;&#47484; &#44284;&#46020;&#54616;&#44172; &#49324;&#50857;&#54616;&#44256; &#49900;&#54032;&#51060; &#44221;&#44256;&#47484; &#48155;&#50520;&#45796;.',a_score:10,b_score:9,explain:'&#48152;&#52825; &#44221;&#44256;&#45716; &#51216;&#49688;&#50640; &#48520;&#47532;&#54616;&#44172; &#51089;&#50857;'},
  {round:8,desc:'A&#49440;&#49688;&#44032; &#48148;&#46356; &#44277;&#44201;&#51004;&#47196; B&#47484; &#44228;&#49549; &#50517;&#48149;&#54664;&#45796;. B&#45716; &#48169;&#50612;&#47564; &#54664;&#45796;.',a_score:10,b_score:9,explain:'&#44277;&#44201;&#51201; &#50864;&#50948;&#50752; &#50517;&#48149;&#51060; &#52292;&#51216;&#50640; &#48152;&#50689;'},
  {round:9,desc:'&#47560;&#51648;&#47561; &#46972;&#50868;&#46300; &#51204;. B&#49440;&#49688;&#44032; &#52509;&#44277;&#49464;&#47196; &#51204;&#54872;&#54616;&#50668; &#50668;&#47084;&#48264; &#55176;&#53944;.',a_score:9,b_score:10,explain:'&#47560;&#51648;&#47561; &#44277;&#44201; &#51032;&#51648;&#50752; &#44201;&#47148;&#54620; &#44277;&#44201;&#51060; &#45458;&#51008; &#54217;&#44032;'},
  {round:10,desc:'&#52572;&#51333; &#46972;&#50868;&#46300;. &#50577;&#49440;&#49688; &#49324;&#47141;&#51012; &#45796;&#54620; &#44277;&#48169;. A&#44032; &#44540;&#49548;&#54620; &#52264;&#51060;&#47196; &#50864;&#49464;.',a_score:10,b_score:9,explain:'&#44540;&#49548;&#54620; &#52264;&#51060;&#46972;&#46020; &#50864;&#50948;&#44032; &#51080;&#51004;&#47732; 10-9'}
];

var judgeState = { currentRound: 0, playerScoresA: [], playerScoresB: [], started: false };

function buildJudgeSim(){
  var sec = document.createElement('div');
  sec.className = 'v15-section';
  sec.id = 'v15-judge';
  sec.innerHTML = '<div class="v15-title"><span class="emoji">&#9878;&#65039;</span> &#49900;&#54032; &#52292;&#51216; &#49884;&#48044;&#47112;&#51060;&#53552;</div>' +
    '<div class="v15-subtitle">10R 10&#51216; &#48169;&#49885; &#52292;&#51216; &#54617;&#49845; + &#54032;&#51221; &#49444;&#47749;</div>' +
    '<div id="v15JudgeArea"></div>';
  return sec;
}

function renderJudge(){
  var area = document.getElementById('v15JudgeArea');
  if(!area) return;
  if(!judgeState.started){
    area.innerHTML = '<div style="text-align:center;padding:20px">' +
      '<div style="font-size:14px;color:var(--text-dim);margin-bottom:16px">10&#46972;&#50868;&#46300; &#44221;&#44592; &#49884;&#45208;&#47532;&#50724;&#47484; &#48372;&#44256; &#52292;&#51216;&#54644;&#48372;&#49464;&#50836;.<br>&#44033; &#46972;&#50868;&#46300;&#47560;&#45796; A&#49440;&#49688;&#50752; B&#49440;&#49688;&#50640;&#44172; &#51216;&#49688;&#47484; &#48512;&#50668;&#54633;&#45768;&#45796;.</div>' +
      '<button class="v15-btn" onclick="window._v15StartJudge()">&#9878;&#65039; &#52292;&#51216; &#49884;&#51089;</button></div>';
    return;
  }
  var r = judgeState.currentRound;
  if(r >= JUDGE_SCENARIOS.length){
    var totalA = judgeState.playerScoresA.reduce(function(a,b){return a+b},0);
    var totalB = judgeState.playerScoresB.reduce(function(a,b){return a+b},0);
    var correctA = JUDGE_SCENARIOS.reduce(function(a,s){return a+s.a_score},0);
    var correctB = JUDGE_SCENARIOS.reduce(function(a,s){return a+s.b_score},0);
    var diff = Math.abs(totalA - correctA) + Math.abs(totalB - correctB);
    var grade = diff <= 4 ? 'S' : diff <= 8 ? 'A' : diff <= 14 ? 'B' : diff <= 20 ? 'C' : 'D';
    var gradeColor = grade==='S'?'#FFD700':grade==='A'?'#22c55e':grade==='B'?'#3b82f6':grade==='C'?'#f97316':'#ef4444';
    area.innerHTML = '<div style="text-align:center;padding:20px">' +
      '<div style="font-size:48px;font-weight:900;color:'+gradeColor+'">'+grade+'</div>' +
      '<div style="font-size:14px;margin:8px 0">&#45236; &#52292;&#51216;: A('+totalA+') vs B('+totalB+')</div>' +
      '<div style="font-size:13px;color:var(--text-dim)">&#51221;&#45813; &#52292;&#51216;: A('+correctA+') vs B('+correctB+')</div>' +
      '<div style="font-size:13px;color:var(--text-dim);margin-top:4px">&#54200;&#52264;: '+diff+'&#51216; (&#45230;&#51012;&#49688;&#47197; &#51221;&#54869;)</div>' +
      '<button class="v15-btn" style="margin-top:16px" onclick="window._v15ResetJudge()">&#45796;&#49884; &#52292;&#51216;&#54616;&#44592;</button></div>';
    v15.judging.rounds += 10;
    v15.judging.accuracy = Math.round((1 - diff/40) * 100);
    v15.judging.sessions.push({date:new Date().toISOString().slice(0,10),grade:grade,diff:diff});
    if(v15.judging.sessions.length > 20) v15.judging.sessions = v15.judging.sessions.slice(-20);
    saveV15(v15);
    checkV15Achievements();
    return;
  }
  var sc = JUDGE_SCENARIOS[r];
  area.innerHTML = '<div class="v15-card">' +
    '<div style="display:flex;justify-content:space-between;margin-bottom:10px">' +
    '<span class="v15-badge">&#46972;&#50868;&#46300; '+(r+1)+'/10</span>' +
    '<span style="font-size:12px;color:var(--text-dim)">'+(r+1)+'R</span></div>' +
    '<div style="font-size:14px;line-height:1.6;margin-bottom:16px">'+sc.desc+'</div>' +
    '<div class="v15-grid2">' +
    '<div><div style="font-size:12px;font-weight:700;margin-bottom:8px;color:var(--blue)">A&#49440;&#49688; &#51216;&#49688;</div>' +
    [7,8,9,10].map(function(s){ return '<button class="v15-btn sm secondary" style="margin:2px" onclick="window._v15ScoreA('+s+')">'+s+'</button>'; }).join('') +
    '</div>' +
    '<div><div style="font-size:12px;font-weight:700;margin-bottom:8px;color:var(--accent)">B&#49440;&#49688; &#51216;&#49688;</div>' +
    [7,8,9,10].map(function(s){ return '<button class="v15-btn sm secondary" style="margin:2px" onclick="window._v15ScoreB('+s+')">'+s+'</button>'; }).join('') +
    '</div></div></div>';
  if(r > 0){
    var prev = JUDGE_SCENARIOS[r-1];
    area.innerHTML += '<div class="v15-card" style="border-left:3px solid var(--accent)">' +
      '<div style="font-size:12px;font-weight:700;margin-bottom:4px">&#51060;&#51204; &#46972;&#50868;&#46300; &#54644;&#49444;</div>' +
      '<div style="font-size:12px;color:var(--text-dim)">&#51221;&#45813;: A('+prev.a_score+') B('+prev.b_score+') &#8212; '+prev.explain+'</div></div>';
  }
}

window._v15StartJudge = function(){
  judgeState = { currentRound: 0, playerScoresA: [], playerScoresB: [], started: true };
  playSFX15('judge_bell');
  renderJudge();
  trackFeature('judge');
};
window._v15ScoreA = function(s){
  if(judgeState.playerScoresA.length > judgeState.playerScoresB.length) return;
  judgeState.playerScoresA.push(s);
  playSFX15('judge_score');
  if(judgeState.playerScoresA.length === judgeState.playerScoresB.length + 1){
    showToast15('B&#49440;&#49688; &#51216;&#49688;&#46020; &#49440;&#53469;&#54616;&#49464;&#50836;');
  }
};
window._v15ScoreB = function(s){
  if(judgeState.playerScoresB.length >= judgeState.playerScoresA.length) return;
  judgeState.playerScoresB.push(s);
  playSFX15('judge_score');
  judgeState.currentRound++;
  renderJudge();
};
window._v15ResetJudge = function(){
  judgeState = { currentRound: 0, playerScoresA: [], playerScoresB: [], started: false };
  renderJudge();
};

// ===== 6. TRAINING DIARY =====
var DIARY_MOODS = [
  {id:'great',emoji:'&#128293;',label:'&#52572;&#44256;'},
  {id:'good',emoji:'&#128170;',label:'&#51339;&#51020;'},
  {id:'ok',emoji:'&#128528;',label:'&#48372;&#53685;'},
  {id:'tired',emoji:'&#128548;',label:'&#54588;&#44260;'},
  {id:'bad',emoji:'&#128557;',label:'&#55192;&#46308;&#50612;'}
];

function buildDiary(){
  var sec = document.createElement('div');
  sec.className = 'v15-section';
  sec.id = 'v15-diary';
  sec.innerHTML = '<div class="v15-title"><span class="emoji">&#128221;</span> &#53944;&#47112;&#51060;&#45789; &#45796;&#51060;&#50612;&#47532;</div>' +
    '<div class="v15-subtitle">&#55092;&#47144; &#51068;&#51648; + &#44592;&#48516; 5&#51333; + 50&#44148; &#48372;&#44288; + &#53440;&#51076;&#46972;&#51064;</div>' +
    '<div style="margin-bottom:12px">' +
    '<div style="font-size:13px;font-weight:600;margin-bottom:8px">&#50724;&#45720;&#51032; &#44592;&#48516;</div>' +
    '<div class="v15-flex" id="v15MoodPicker">' +
    DIARY_MOODS.map(function(m){ return '<span class="v15-mood" data-mood="'+m.id+'" onclick="window._v15SelectMood(\''+m.id+'\')" title="'+m.label+'">'+m.emoji+'</span>'; }).join('') +
    '</div></div>' +
    '<div style="margin-bottom:12px">' +
    '<textarea id="v15DiaryText" placeholder="&#50724;&#45720;&#51032; &#55092;&#47144; &#44592;&#47197;..." style="width:100%;height:70px;background:var(--surface);border:1px solid var(--glass-border);border-radius:10px;color:var(--text);padding:12px;font-size:13px;resize:none;font-family:var(--font)"></textarea>' +
    '</div>' +
    '<button class="v15-btn" onclick="window._v15SaveDiary()">&#128190; &#51200;&#51109;</button>' +
    '<div style="margin-top:16px" id="v15DiaryTimeline"></div>';
  return sec;
}

var selectedDiaryMood = '';
window._v15SelectMood = function(mid){
  selectedDiaryMood = mid;
  document.querySelectorAll('#v15MoodPicker .v15-mood').forEach(function(el){
    el.classList.toggle('selected', el.getAttribute('data-mood') === mid);
  });
};
window._v15SaveDiary = function(){
  var text = document.getElementById('v15DiaryText');
  if(!text || !text.value.trim()) { showToast15('&#45236;&#50857;&#51012; &#51077;&#47141;&#54644;&#51452;&#49464;&#50836;'); return; }
  var entry = {
    date: new Date().toISOString().slice(0,10),
    time: new Date().toTimeString().slice(0,5),
    mood: selectedDiaryMood || 'ok',
    text: text.value.trim().substring(0,200)
  };
  v15.diary.entries.unshift(entry);
  if(v15.diary.entries.length > 50) v15.diary.entries = v15.diary.entries.slice(0,50);
  saveV15(v15);
  text.value = '';
  selectedDiaryMood = '';
  document.querySelectorAll('#v15MoodPicker .v15-mood').forEach(function(el){ el.classList.remove('selected'); });
  playSFX15('diary_save');
  showToast15('&#45796;&#51060;&#50612;&#47532; &#51200;&#51109; &#50756;&#47308;!');
  renderDiaryTimeline();
  trackFeature('diary');
  checkV15Achievements();
};

function renderDiaryTimeline(){
  var tl = document.getElementById('v15DiaryTimeline');
  if(!tl) return;
  if(v15.diary.entries.length === 0){
    tl.innerHTML = '<div style="text-align:center;color:var(--text-dim);font-size:13px;padding:16px">&#50500;&#51649; &#44592;&#47197;&#51060; &#50630;&#49845;&#45768;&#45796;</div>';
    return;
  }
  tl.innerHTML = '<div style="font-size:13px;font-weight:700;margin-bottom:10px">&#52572;&#44540; &#44592;&#47197; ('+v15.diary.entries.length+'&#44148;)</div><div class="v15-timeline">' +
    v15.diary.entries.slice(0,10).map(function(e){
      var moodEmoji = DIARY_MOODS.filter(function(m){return m.id===e.mood})[0];
      return '<div class="v15-timeline-item"><div style="font-size:11px;color:var(--text-dim)">'+e.date+' '+e.time+'</div>' +
        '<div style="margin-top:4px">'+(moodEmoji ? moodEmoji.emoji : '')+' '+e.text+'</div></div>';
    }).join('') + '</div>';
}

// ===== 7. COMBAT POWER DASHBOARD CANVAS =====
function buildCombatPower(){
  var sec = document.createElement('div');
  sec.className = 'v15-section';
  sec.id = 'v15-power-radar';
  sec.innerHTML = '<div class="v15-title"><span class="emoji">&#128200;</span> &#51204;&#53804;&#47141; &#48516;&#49437; &#45824;&#49884;&#48372;&#46300;</div>' +
    '<div class="v15-subtitle">6&#52629; &#47112;&#51060;&#45908; (&#54028;&#50892;/&#49828;&#54588;&#46300;/&#51648;&#44396;&#47141;/&#48169;&#50612;/&#44592;&#49696;/&#54413;&#50892;&#53356;)</div>' +
    '<div class="v15-canvas-wrap"><canvas id="v15PowerRadar" width="400" height="400" style="width:100%;display:block"></canvas></div>' +
    '<div style="text-align:center;margin-top:8px">' +
    '<button class="v15-btn" onclick="window._v15ScanPower()">&#128269; &#51204;&#53804;&#47141; &#49828;&#52884;</button></div>';
  return sec;
}

window._v15ScanPower = function(){
  var appData = loadAppData() || {};
  var stats = appData.stats || {};
  var power = Math.min(100, 30 + (stats.totalPunches || 0) / 50);
  var speed = Math.min(100, 30 + (stats.combos || 0) / 10);
  var endurance = Math.min(100, 30 + (stats.totalTime || 0) / 300);
  var defense = Math.min(100, 30 + (v15.sandbag.sessions || 0) * 8 + (v15.judging.rounds || 0));
  var technique = Math.min(100, 30 + (v15.comboBuilder.played || 0) * 5 + v15.stance.viewed.length * 10);
  var footwork = Math.min(100, 30 + (v15.diary.entries.length || 0) * 3 + v15.injury.viewed.length * 5);
  var vals = [power,speed,endurance,defense,technique,footwork];
  v15.combatPower.lastScan = new Date().toISOString();
  v15.combatPower.history.push({date:v15.combatPower.lastScan.slice(0,10),vals:vals});
  if(v15.combatPower.history.length > 30) v15.combatPower.history = v15.combatPower.history.slice(-30);
  saveV15(v15);
  playSFX15('radar_scan');
  drawPowerRadar(vals);
  trackFeature('radar');
  checkV15Achievements();
};

function drawPowerRadar(vals){
  var c = document.getElementById('v15PowerRadar');
  if(!c) return;
  var ctx = c.getContext('2d');
  var W = c.width, H = c.height;
  ctx.clearRect(0,0,W,H);
  var isDark = !document.documentElement.hasAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.fillStyle = isDark ? '#0d0820' : '#eeeef2';
  ctx.fillRect(0,0,W,H);
  var cx = W/2, cy = H/2 + 10;
  var R = Math.min(W,H)*0.35;
  var labels = ['&#54028;&#50892;','&#49828;&#54588;&#46300;','&#51648;&#44396;&#47141;','&#48169;&#50612;','&#44592;&#49696;','&#54413;&#50892;&#53356;'];
  var colors = ['#ef4444','#f97316','#22c55e','#3b82f6','#a855f7','#ec4899'];
  var n = labels.length;
  if(!vals) vals = [30,30,30,30,30,30];
  for(var ring=1;ring<=5;ring++){
    ctx.beginPath();
    for(var i=0;i<n;i++){
      var a = -Math.PI/2 + (2*Math.PI/n)*i;
      var rr = R*ring/5;
      var px = cx + rr*Math.cos(a), py = cy + rr*Math.sin(a);
      if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.closePath();
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    ctx.stroke();
    if(ring % 2 === 0){
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
      ctx.fill();
    }
  }
  for(var i2=0;i2<n;i2++){
    var a2 = -Math.PI/2 + (2*Math.PI/n)*i2;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(cx + R*Math.cos(a2), cy + R*Math.sin(a2));
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    ctx.stroke();
    var lx = cx + (R+28)*Math.cos(a2), ly = cy + (R+28)*Math.sin(a2);
    ctx.fillStyle = colors[i2];
    ctx.font = 'bold 12px -apple-system,sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(labels[i2]+' '+Math.round(vals[i2]), lx, ly);
  }
  ctx.beginPath();
  for(var i3=0;i3<n;i3++){
    var a3 = -Math.PI/2 + (2*Math.PI/n)*i3;
    var rv = R*vals[i3]/100;
    var vx = cx + rv*Math.cos(a3), vy = cy + rv*Math.sin(a3);
    if(i3===0) ctx.moveTo(vx,vy); else ctx.lineTo(vx,vy);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,68,68,0.15)';
  ctx.fill();
  ctx.strokeStyle = '#FF4444';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  for(var i4=0;i4<n;i4++){
    var a4 = -Math.PI/2 + (2*Math.PI/n)*i4;
    var rv2 = R*vals[i4]/100;
    ctx.beginPath();
    ctx.arc(cx + rv2*Math.cos(a4), cy + rv2*Math.sin(a4), 5, 0, Math.PI*2);
    ctx.fillStyle = colors[i4];
    ctx.fill();
  }
  var avg = Math.round(vals.reduce(function(a,b){return a+b},0)/n);
  var grade = avg>=85?'S':avg>=70?'A':avg>=55?'B':avg>=40?'C':'D';
  var gc = grade==='S'?'#FFD700':grade==='A'?'#22c55e':grade==='B'?'#3b82f6':grade==='C'?'#f97316':'#ef4444';
  ctx.fillStyle = gc;
  ctx.font = 'bold 36px -apple-system,sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(grade, W/2, 30);
  ctx.fillStyle = isDark ? '#aaa' : '#555';
  ctx.font = '13px -apple-system,sans-serif';
  ctx.fillText('&#51333;&#54633; &#51204;&#53804;&#47141;: '+avg+'/100', W/2, 52);
}

// ===== 8. LEGENDARY FIGHTS REVIEW =====
var LEGEND_FIGHTS = [
  {year:'1974',title:'&#51221;&#44544; &#51064; &#45908; &#51221;&#44544;',fighters:'&#47924;&#54616;&#47560;&#46300; &#50508;&#47532; vs &#51312;&#51648; &#54252;&#47676;',
   lesson:'&#47196;&#54532;&#50612;&#46021;(Rope-a-dope) &#51204;&#47029;. &#52404;&#47141; &#48372;&#51316;+&#52852;&#50868;&#53552; &#51204;&#47029;&#51032; &#44368;&#44284;&#49436;'},
  {year:'1975',title:'&#49892;&#46972; &#51064; &#47560;&#45776;&#46972;',fighters:'&#47924;&#54616;&#47560;&#46300; &#50508;&#47532; vs &#51312; &#54532;&#47112;&#51060;&#51648;&#50612;',
   lesson:'14R &#44537;&#54620;&#51032; &#45824;&#44208;. &#50612;&#46500; &#49345;&#54889;&#50640;&#49436;&#46020; &#54252;&#44592;&#54616;&#51648; &#50506;&#45716; &#51221;&#49888;&#47141;'},
  {year:'1990',title:'&#53440;&#51060;&#49832; vs &#45908;&#44544;&#47084;&#49828;',fighters:'&#47560;&#51060;&#53356; &#53440;&#51060;&#49832; vs &#51228;&#51076;&#49828; &#45908;&#44544;&#47084;&#49828;',
   lesson:'&#50669;&#45824; &#52572;&#44256;&#51032; &#51060;&#48320;. &#51088;&#47564;&#51012; &#48260;&#47532;&#44256; &#44540;&#48376;&#50640; &#52649;&#49892;&#54616;&#46972;'},
  {year:'1997',title:'&#47924;&#50612;&#48148;&#51060;&#53944; II',fighters:'&#50640;&#48180;&#45908; &#54848;&#47532;&#54596;&#46300; vs &#47560;&#51060;&#53356; &#53440;&#51060;&#49832;',
   lesson:'&#44284;&#46020;&#54620; &#54036;&#51012; &#48276;&#54616;&#47732; &#44208;&#44284;&#44032; &#50612;&#46500;&#44148; &#51032;&#48120;&#50630;&#50612;&#51652;&#45796;'},
  {year:'2002',title:'&#52828;&#48708;&#50864;&#49828;&#51032; &#51204;&#51137;',fighters:'&#47112;&#45185;&#49828; &#47336;&#51060;&#49828; vs &#47560;&#51060;&#53356; &#53440;&#51060;&#49832;',
   lesson:'&#52404;&#44553; &#50516;&#48149;&#50864;&#49828;&#51032; &#44053;&#51216;. &#44592;&#49696;&#44284; &#49828;&#53468;&#48120;&#45208;&#51032; &#51312;&#54633;'},
  {year:'2012',title:'&#54028;&#53300;&#50500;&#50724; vs &#47560;&#47476;&#44172;&#49828;',fighters:'&#47588;&#45768; &#54028;&#53300;&#50500;&#50724; vs &#55020; &#47560;&#47476;&#44172;&#49828;',
   lesson:'&#49828;&#54588;&#46300;&#50752; &#54413;&#50892;&#53356;&#44032; &#54028;&#50892;&#47484; &#51060;&#44596; &#49688; &#51080;&#45796;'},
  {year:'2015',title:'&#49464;&#44592;&#51032; &#45824;&#44208;',fighters:'&#47700;&#51060;&#50920;&#45908; vs &#54028;&#53300;&#50500;&#50724;',
   lesson:'&#50756;&#48317;&#54620; &#48169;&#50612; &#44592;&#49696;&#51008; &#44277;&#44201;&#47141;&#51012; &#50517;&#46020;&#54624; &#49688; &#51080;&#45796;'},
  {year:'1980',title:'&#50696;&#49696;&#44284; &#44284;&#54617;',fighters:'&#49836;&#44144; &#47112;&#51060; &#47112;&#45320;&#46300; vs &#47196;&#48288;&#47476;&#53664; &#46160;&#46976;',
   lesson:'&#51068;&#49849;&#51068;&#54056; &#45824;&#48152;&#51204;. &#54620; &#48264; &#44592;&#54924;&#47484; &#45459;&#52824;&#51648; &#47568;&#44163;'},
  {year:'2001',title:'&#48148;&#47548;&#51032; &#51204;&#49324;',fighters:'&#54861;&#49688;&#54872; vs &#45348;&#49828;&#53552; &#44032;&#47476;&#49324;',
   lesson:'&#54620;&#44397; &#48373;&#49905;&#51032; &#50669;&#49324;. &#51089;&#51008; &#52404;&#44201;&#51004;&#47196;&#46020; &#51032;&#51648;&#47196; &#49849;&#47532;&#54624; &#49688; &#51080;&#45796;'},
  {year:'2019',title:'&#47693;&#49884;&#53076;&#51032; &#48164;',fighters:'&#50532;&#46356; &#47336;&#51060;&#49828; vs &#50532;&#53804;&#45768; &#51312;&#49800;',
   lesson:'&#48373;&#49905;&#51008; &#50696;&#52769;&#48520;&#44032;&#45733;. &#54620; &#48169;&#50640; &#47784;&#46304; &#44163;&#51060; &#48148;&#45044;&#45796;'},
  {year:'2022',title:'&#50669;&#45824; &#52572;&#44053;',fighters:'&#50732;&#47116;&#49328;&#45908;&#47476; &#50864;&#49884;&#53356; vs &#50532;&#53804;&#45768; &#51312;&#49800;',
   lesson:'4&#52404;&#44553; &#53685;&#51068; &#51204;&#47029;. &#48373;&#49905;IQ&#50752; &#53580;&#53356;&#45769;&#51032; &#49849;&#47532;'},
  {year:'2017',title:'&#47672;&#45768; &#47588;&#52824;',fighters:'&#47700;&#51060;&#50920;&#45908; vs &#47589;&#44536;&#47532;&#44144;',
   lesson:'&#45796;&#47480; &#51333;&#47785;&#50640;&#49436; &#50728; &#46020;&#51204;. &#44221;&#54744;&#44284; &#44592;&#49696;&#51032; &#52264;&#51060;'}
];

function buildLegendFights(){
  var sec = document.createElement('div');
  sec.className = 'v15-section';
  sec.id = 'v15-legends';
  sec.innerHTML = '<div class="v15-title"><span class="emoji">&#127942;</span> &#48373;&#49905; &#47749;&#45824;&#44208; &#47532;&#48624; 12&#49440;</div>' +
    '<div class="v15-subtitle">&#50669;&#49324;&#51201; &#47749;&#44221;&#44592; &#48516;&#49437; + &#44368;&#54984;</div>' +
    '<div id="v15LegendList"></div>';
  return sec;
}

function renderLegends(){
  var list = document.getElementById('v15LegendList');
  if(!list) return;
  list.innerHTML = '';
  LEGEND_FIGHTS.forEach(function(f,idx){
    var viewed = v15.legendFights.viewed.indexOf(idx) !== -1;
    var div = document.createElement('div');
    div.className = 'v15-card';
    div.style.cursor = 'pointer';
    div.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center">' +
      '<div><span class="v15-tag" style="background:var(--accent);color:#fff;margin-right:6px">'+f.year+'</span>' +
      '<span style="font-weight:700;font-size:14px">'+f.title+'</span></div>' +
      (viewed ? '<span class="v15-badge">&#10003;</span>' : '') +
      '</div>' +
      '<div style="font-size:12px;color:var(--text-dim);margin:6px 0">'+f.fighters+'</div>' +
      '<div style="font-size:12px"><b style="color:var(--gold)">&#128161; &#44368;&#54984;:</b> '+f.lesson+'</div>';
    div.onclick = function(){
      if(v15.legendFights.viewed.indexOf(idx) === -1) v15.legendFights.viewed.push(idx);
      saveV15(v15);
      playSFX15('legend_open');
      renderLegends();
      trackFeature('legends');
      checkV15Achievements();
    };
    list.appendChild(div);
  });
}

// ===== QUIZ V15 (+15, 90->105) =====
var QUIZ_V15 = [
  {q:'&#48373;&#49905;&#50640;&#49436; &#8220;&#50896;&#53804;&#8221;&#45716; &#50612;&#46500; &#54156;&#52824; &#51312;&#54633;&#51012; &#51032;&#48120;&#54616;&#45208;?',a:['&#51105;-&#53356;&#47196;&#49828;','&#51105;-&#55041;','&#50612;&#54140;-&#53356;&#47196;&#49828;','&#55041;-&#55041;'],c:0},
  {q:'&#47196;&#54532;&#50612;&#46021;(Rope-a-dope) &#51204;&#47029;&#51012; &#50976;&#47749;&#54616;&#44172; &#49324;&#50857;&#54620; &#49440;&#49688;&#45716;?',a:['&#47560;&#51060;&#53356; &#53440;&#51060;&#49832;','&#47924;&#54616;&#47560;&#46300; &#50508;&#47532;','&#47700;&#51060;&#50920;&#45908;','&#47588;&#45768; &#54028;&#53300;&#50500;&#50724;'],c:1},
  {q:'10&#51216; &#48169;&#49885; &#52292;&#51216;&#50640;&#49436; &#45796;&#50868;&#51060; &#50630;&#51004;&#47732; &#44033; &#49440;&#49688;&#50640;&#44172; &#47751; &#51216;&#51012; &#48512;&#50668;&#54616;&#45208;?',a:['10-10','10-9','9-9','10-8'],c:0},
  {q:'&#54588;&#52852;&#48512; &#49828;&#53472;&#49828;&#47484; &#50976;&#47749;&#54616;&#44172; &#49324;&#50857;&#54620; &#49440;&#49688;&#45716;?',a:['&#50508;&#47532;','&#53440;&#51060;&#49832;','&#47700;&#51060;&#50920;&#45908;','&#47112;&#45185;&#49828;'],c:1},
  {q:'&#48373;&#49905;&#50640;&#49436; &#8220;&#53364;&#47536;&#52824;&#8221;&#45716; &#47924;&#50631;&#51012; &#51032;&#48120;&#54616;&#45208;?',a:['&#44053;&#47141;&#54620; &#54156;&#52824;','&#49345;&#45824;&#47484; &#44852;&#50504;&#45716; &#46041;&#51089;','&#54028;&#50872; &#54156;&#52824;','&#50612;&#54140;&#52983;'],c:1},
  {q:'&#49380;&#46300;&#48177; &#50892;&#53356;&#50500;&#50883;&#50640;&#49436; &#44032;&#51109; &#47566;&#51008; &#51216;&#49688;&#47484; &#50619;&#45716; &#48512;&#50948;&#45716;?',a:['&#48373;&#48512;','&#48156;','&#47672;&#47532;','&#44032;&#49844;'],c:2},
  {q:'&#54596;&#47532;&#49520; &#49828;&#53472;&#49828;&#51032; &#44032;&#51109; &#53360; &#51109;&#51216;&#51008;?',a:['&#54028;&#50892; &#54156;&#52824;','&#52852;&#50868;&#53552; &#54156;&#52824;','&#48744;&#47480; &#49828;&#54588;&#46300;','&#44053;&#54620; &#48169;&#50612;'],c:1},
  {q:'&#48373;&#49905;&#50640;&#49436; &#8220;&#48372;&#46356;&#49399;&#8221;&#51008; &#50612;&#46356;&#47484; &#44277;&#44201;&#54616;&#45716; &#44163;&#51012; &#47568;&#54616;&#45208;?',a:['&#50620;&#44404;','&#54036;','&#47800;&#53685;','&#45796;&#47532;'],c:2},
  {q:'&#51221;&#44544; &#51064; &#45908; &#51221;&#44544;(Rumble in the Jungle)&#51008; &#50612;&#45712; &#54644;&#50640; &#50676;&#47160;&#45208;?',a:['1972','1974','1976','1978'],c:1},
  {q:'&#48373;&#49905; &#48512;&#49345; &#51473; &#8220;RICE &#50836;&#48277;&#8221;&#50640;&#49436; R&#51008; &#47924;&#50631;&#51012; &#51032;&#48120;&#54616;&#45208;?',a:['Recovery','Rest','Rehab','Rotation'],c:1},
  {q:'&#53356;&#47196;&#49828;&#44032;&#46300; &#49828;&#53472;&#49828;&#51032; &#53945;&#54868;&#46108; &#48169;&#50612; &#50689;&#50669;&#51008;?',a:['&#47672;&#47532;','&#48148;&#46356;','&#45796;&#47532;','&#54036;'],c:1},
  {q:'10&#46972;&#50868;&#46300; &#51473; &#54620; &#49440;&#49688;&#44032; &#45796;&#50868;&#45817;&#54616;&#47732; &#52292;&#51216;&#51008;?',a:['10-10','10-8','10-7','10-9'],c:1},
  {q:'&#48373;&#49905;&#50640;&#49436; &#8220;&#50500;&#50883;&#48373;&#49905;&#8221;&#51008; &#50612;&#46500; &#49828;&#53440;&#51068;&#51012; &#51032;&#48120;&#54616;&#45208;?',a:['&#44540;&#51217;&#51204;','&#44144;&#47532;&#50976;&#51648;&#51204;','&#52852;&#50868;&#53552;&#51204;','&#48169;&#50612;&#51204;'],c:1},
  {q:'&#48373;&#49905; &#54984;&#47144; &#51473; &#47700;&#46356;&#49888;&#48380; &#50868;&#46041;&#50032; &#44053;&#54868;&#54616;&#45716; &#48512;&#50948;&#45716;?',a:['&#50612;&#44648;','&#47785;','&#54728;&#47532;','&#51204;&#49888;'],c:1},
  {q:'&#48373;&#49905;&#50640;&#49436; &#51473;&#47049;&#44553; &#44592;&#51456;&#51008;(&#54532;&#47196; &#44592;&#51456;)?',a:['72.5kg &#51060;&#54616;','75.7kg &#51060;&#54616;','69.8kg &#51060;&#54616;','76.2kg &#51060;&#54616;'],c:3}
];

function buildQuizV15(){
  var sec = document.createElement('div');
  sec.className = 'v15-section';
  sec.id = 'v15-quiz';
  sec.innerHTML = '<div class="v15-title"><span class="emoji">&#10067;</span> v15 &#53300;&#51592; (+15&#47928;, &#52509; 105)</div>' +
    '<div class="v15-subtitle">&#48373;&#49905; &#51648;&#49885; &#53580;&#49828;&#53944; - &#53092;&#48372;/&#49828;&#53472;&#49828;/&#52292;&#51216;/&#48512;&#49345;/&#50669;&#49324;</div>' +
    '<div id="v15QuizArea"></div>';
  return sec;
}

var quizV15State = { idx: 0, correct: 0, total: 0, done: false };

function renderQuizV15(){
  var area = document.getElementById('v15QuizArea');
  if(!area) return;
  if(quizV15State.done || quizV15State.idx >= QUIZ_V15.length){
    var pct = Math.round(quizV15State.correct / QUIZ_V15.length * 100);
    area.innerHTML = '<div style="text-align:center;padding:16px">' +
      '<div style="font-size:36px;font-weight:900;color:'+(pct>=80?'var(--gold)':pct>=60?'var(--green)':'var(--accent)')+'">'+pct+'%</div>' +
      '<div style="font-size:14px;margin:8px 0">'+quizV15State.correct+'/'+QUIZ_V15.length+' &#51221;&#45813;</div>' +
      '<button class="v15-btn" onclick="window._v15RetryQuiz()">&#45796;&#49884; &#54400;&#44592;</button></div>';
    v15.quizV15Scores[new Date().toISOString().slice(0,10)] = pct;
    saveV15(v15);
    checkV15Achievements();
    return;
  }
  var q = QUIZ_V15[quizV15State.idx];
  area.innerHTML = '<div class="v15-card"><div style="display:flex;justify-content:space-between;margin-bottom:10px">' +
    '<span class="v15-badge">Q'+(quizV15State.idx+1)+'/'+QUIZ_V15.length+'</span>' +
    '<span style="font-size:12px;color:var(--text-dim)">'+quizV15State.correct+'&#51221;&#45813;</span></div>' +
    '<div style="font-size:14px;font-weight:600;margin-bottom:14px;line-height:1.5">'+q.q+'</div>' +
    q.a.map(function(opt,i){
      return '<button class="v15-btn secondary" style="width:100%;margin-bottom:6px;text-align:left" onclick="window._v15AnswerQuiz('+i+')">'+opt+'</button>';
    }).join('') + '</div>';
}

window._v15AnswerQuiz = function(idx){
  var q = QUIZ_V15[quizV15State.idx];
  if(idx === q.c){ quizV15State.correct++; playSFX15('quiz_v15'); showToast15('&#51221;&#45813;!'); }
  else { showToast15('&#50724;&#45813;! &#51221;&#45813;: '+q.a[q.c]); }
  quizV15State.idx++;
  if(quizV15State.idx >= QUIZ_V15.length) quizV15State.done = true;
  renderQuizV15();
};
window._v15RetryQuiz = function(){
  quizV15State = { idx:0, correct:0, total:0, done:false };
  renderQuizV15();
};

// ===== ACHIEVEMENTS V15 =====
var ACHIEVEMENTS_V15 = [
  {id:'combo_first',name:'&#52395; &#53092;&#48372;',icon:'&#128170;',desc:'&#53092;&#48372; &#48716;&#45908;&#50640;&#49436; &#52395; &#53092;&#48372; &#49892;&#54665;'},
  {id:'combo_5',name:'&#53092;&#48372; &#47560;&#49828;&#53552;',icon:'&#9889;',desc:'5&#54924; &#51060;&#49345; &#53092;&#48372; &#49892;&#54665;'},
  {id:'combo_long',name:'&#47217;&#53092;&#48372;',icon:'&#127942;',desc:'8&#50672;&#53440; &#51060;&#49345; &#53092;&#48372; &#44396;&#49457;'},
  {id:'stance_3',name:'&#49828;&#53472;&#49828; &#53456;&#49353;&#44032;',icon:'&#129354;',desc:'3&#44060; &#51060;&#49345; &#49828;&#53472;&#49828; &#54617;&#49845;'},
  {id:'stance_all',name:'&#49828;&#53472;&#49828; &#47560;&#49828;&#53552;',icon:'&#127775;',desc:'&#47784;&#46304; 6&#51333; &#49828;&#53472;&#49828; &#54617;&#49845;'},
  {id:'bag_first',name:'&#52395; &#49380;&#46300;&#48177;',icon:'&#129354;',desc:'&#49380;&#46300;&#48177; &#50892;&#53356;&#50500;&#50883; &#52395; &#50756;&#47308;'},
  {id:'bag_high',name:'&#54156;&#52824; &#47672;&#49888;',icon:'&#128293;',desc:'&#49380;&#46300;&#48177; 200&#51216; &#51060;&#49345; &#45804;&#49457;'},
  {id:'injury_6',name:'&#50504;&#51204; &#51228;&#51068;',icon:'&#127973;',desc:'6&#44060; &#51060;&#49345; &#48512;&#49345; &#50696;&#48169; &#54617;&#49845;'},
  {id:'injury_all',name:'&#48512;&#49345; &#48149;&#49324;',icon:'&#127891;',desc:'12&#51333; &#48512;&#49345; &#51204;&#48512; &#54617;&#49845;'},
  {id:'judge_first',name:'&#52395; &#52292;&#51216;',icon:'&#9878;&#65039;',desc:'&#52292;&#51216; &#49884;&#48044;&#47112;&#51060;&#53552; &#52395; &#50756;&#47308;'},
  {id:'diary_5',name:'&#44592;&#47197;&#44305;',icon:'&#128221;',desc:'&#45796;&#51060;&#50612;&#47532; 5&#54924; &#51060;&#49345; &#51089;&#49457;'},
  {id:'v15_explorer',name:'v15 &#53456;&#54744;&#44032;',icon:'&#128640;',desc:'v15 &#47784;&#46304; &#44592;&#45733; &#49324;&#50857;'}
];

function checkV15Achievements(){
  var changed = false;
  function unlock(id){
    if(!v15.achievementsV15[id]){
      v15.achievementsV15[id] = new Date().toISOString();
      changed = true;
      var a = ACHIEVEMENTS_V15.filter(function(x){return x.id===id})[0];
      if(a) showToast15(a.icon+' &#50629;&#51201; &#54644;&#44552;: '+a.name);
      playSFX15('achieve_v15');
    }
  }
  if(v15.comboBuilder.played >= 1) unlock('combo_first');
  if(v15.comboBuilder.played >= 5) unlock('combo_5');
  if(v15.comboBuilder.bestCombo >= 8) unlock('combo_long');
  if(v15.stance.viewed.length >= 3) unlock('stance_3');
  if(v15.stance.viewed.length >= 6) unlock('stance_all');
  if(v15.sandbag.sessions >= 1) unlock('bag_first');
  if(v15.sandbag.bestScore >= 200) unlock('bag_high');
  if(v15.injury.viewed.length >= 6) unlock('injury_6');
  if(v15.injury.viewed.length >= 12) unlock('injury_all');
  if(v15.judging.sessions.length >= 1) unlock('judge_first');
  if(v15.diary.entries.length >= 5) unlock('diary_5');
  var used = v15.featureUsage || {};
  if(used.combo && used.stance && used.sandbag && used.injury && used.judge && used.diary && used.radar && used.legends) unlock('v15_explorer');
  if(changed){
    saveV15(v15);
    renderV15Ach();
  }
}

function buildAchievements(){
  var sec = document.createElement('div');
  sec.className = 'v15-section';
  sec.id = 'v15-achievements';
  sec.innerHTML = '<div class="v15-title"><span class="emoji">&#127942;</span> v15 &#50629;&#51201; ('+countV15Ach()+'/'+ACHIEVEMENTS_V15.length+')</div>' +
    '<div class="v15-grid3" id="v15AchGrid"></div>';
  return sec;
}

function countV15Ach(){ return Object.keys(v15.achievementsV15).length; }

function renderV15Ach(){
  var grid = document.getElementById('v15AchGrid');
  if(!grid) return;
  grid.innerHTML = '';
  ACHIEVEMENTS_V15.forEach(function(a){
    var unlocked = !!v15.achievementsV15[a.id];
    var div = document.createElement('div');
    div.className = 'badge ' + (unlocked ? 'unlocked' : 'locked');
    div.title = a.desc;
    div.style.cssText = 'text-align:center;padding:12px 8px;background:var(--surface);border:1px solid var(--glass-border);border-radius:10px;' + (unlocked ? 'border-color:var(--gold);background:rgba(255,215,0,0.05)' : 'opacity:0.5');
    div.innerHTML = '<div style="font-size:24px">'+a.icon+'</div><div style="font-size:11px;font-weight:600;margin-top:4px">'+a.name+'</div>';
    grid.appendChild(div);
  });
  var title = document.querySelector('#v15-achievements .v15-title');
  if(title) title.innerHTML = '<span class="emoji">&#127942;</span> v15 &#50629;&#51201; ('+countV15Ach()+'/'+ACHIEVEMENTS_V15.length+')';
}

// ===== FEATURE TRACKING =====
function trackFeature(name){
  if(!v15.featureUsage) v15.featureUsage = {};
  v15.featureUsage[name] = true;
  saveV15(v15);
}

// ===== SCROLL NAV BAR =====
function buildScrollNav(){
  var nav = document.createElement('div');
  nav.className = 'v15-scrollnav';
  nav.id = 'v15-scrollnav';
  var items = [
    {label:'&#53092;&#48372;&#48716;&#45908;',target:'v15-combo'},
    {label:'&#49828;&#53472;&#49828;',target:'v15-stance'},
    {label:'&#49380;&#46300;&#48177;',target:'v15-sandbag'},
    {label:'&#48512;&#49345;&#50696;&#48169;',target:'v15-injury'},
    {label:'&#52292;&#51216;&#49884;&#48044;',target:'v15-judge'},
    {label:'&#45796;&#51060;&#50612;&#47532;',target:'v15-diary'},
    {label:'&#51204;&#53804;&#47141;',target:'v15-power-radar'},
    {label:'&#47749;&#45824;&#44208;',target:'v15-legends'}
  ];
  nav.innerHTML = items.map(function(it){
    return '<div class="v15-scrollnav-item" onclick="document.getElementById(\''+it.target+'\').scrollIntoView({behavior:\'smooth\',block:\'start\'})">'+it.label+'</div>';
  }).join('');
  return nav;
}

// ===== KEYBOARD SHORTCUTS =====
function initV15Keyboard(){
  document.addEventListener('keydown', function(e){
    if(!e.shiftKey) return;
    var targets = {
      'Q':'v15-combo',
      'N':'v15-stance',
      'G':'v15-sandbag',
      'J':'v15-injury',
      'U':'v15-judge',
      'Y':'v15-diary',
      'R':'v15-power-radar',
      'L':'v15-legends'
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
function buildV15(){
  injectV15Styles();
  var container = document.querySelector('.hero');
  if(!container) container = document.body;
  var insertPoint = null;
  var existingV14Ach = document.getElementById('v14-achievements');
  if(existingV14Ach && existingV14Ach.nextElementSibling){
    insertPoint = existingV14Ach.nextElementSibling;
  }
  var parent = insertPoint ? insertPoint.parentNode : container.parentNode || document.body;
  var sections = [
    buildComboBuilder(),
    buildStanceAnalyzer(),
    buildSandbag(),
    buildInjuryGuide(),
    buildJudgeSim(),
    buildDiary(),
    buildCombatPower(),
    buildLegendFights(),
    buildQuizV15(),
    buildAchievements()
  ];
  sections.forEach(function(sec){
    if(insertPoint){
      parent.insertBefore(sec, insertPoint);
    } else {
      var scriptTags = document.querySelectorAll('script[src*="v14_patch"]');
      if(scriptTags.length > 0){
        scriptTags[0].parentNode.insertBefore(sec, scriptTags[0]);
      } else {
        document.body.appendChild(sec);
      }
    }
  });
  var scrollNav = buildScrollNav();
  document.body.appendChild(scrollNav);
  drawComboCanvas();
  renderStances();
  if(STANCES.length > 0) drawStanceRadar(STANCES[0]);
  drawBag();
  renderInjuries();
  renderJudge();
  renderDiaryTimeline();
  drawPowerRadar(null);
  renderLegends();
  renderQuizV15();
  renderV15Ach();
  initV15Keyboard();
  checkV15Achievements();
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', buildV15);
} else {
  buildV15();
}

})();
