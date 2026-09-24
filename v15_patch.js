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
  {id:'jab',name:'잡',short:'J',color:'#3b82f6'},
  {id:'cross',name:'크로스',short:'C',color:'#ef4444'},
  {id:'hook_l',name:'왼훅',short:'LH',color:'#22c55e'},
  {id:'hook_r',name:'오른훅',short:'RH',color:'#f97316'},
  {id:'upper_l',name:'왼어퍼',short:'LU',color:'#a855f7'},
  {id:'upper_r',name:'오른어퍼',short:'RU',color:'#ec4899'}
];

var PRESET_COMBOS = [
  {name:'기본 원투',seq:['jab','cross'],desc:'가장 기본적인 콤보'},
  {name:'클래식 원투투리',seq:['jab','cross','hook_l'],desc:'1-2-3 원투투리 콤보'},
  {name:'파워 포',seq:['jab','cross','hook_l','cross'],desc:'1-2-3-2 파워풀 리드공격'},
  {name:'바디 어택',seq:['jab','jab','upper_l','cross'],desc:'잡잡어퍼크로스 바디공략'},
  {name:'코너 트랩',seq:['cross','hook_l','upper_r'],desc:'코너에 몰아넣기'},
  {name:'파워 러쉬',seq:['jab','cross','upper_l','hook_r','cross'],desc:'5연타 회오리 공격'},
  {name:'피카부 스타일',seq:['hook_l','hook_r','upper_l','upper_r'],desc:'근접 파워펌치 러쉬'},
  {name:'머신건 콤보',seq:['jab','jab','cross','hook_l','upper_r','cross'],desc:'6연타 머신건 콤보'}
];

var comboBuilderSeq = [];

function buildComboBuilder(){
  var sec = document.createElement('div');
  sec.className = 'v15-section';
  sec.id = 'v15-combo';
  sec.innerHTML = '<div class="v15-title"><span class="emoji">💪</span> 펌치 콤비네이션 빌더</div>' +
    '<div class="v15-subtitle">6종 펌치로 콤보 구성 + 프리셋 8종 + 커스텀 빌더</div>' +
    '<div class="v15-canvas-wrap"><canvas id="v15ComboCanvas" width="560" height="220" style="width:100%;display:block"></canvas></div>' +
    '<div class="v15-flex" style="margin-bottom:12px">' +
    PUNCH_TYPES.map(function(p){
      return '<button class="v15-btn sm" onclick="window._v15AddPunch(\''+p.id+'\')" style="background:'+p.color+'">' + p.short + ' ' + p.name + '</button>';
    }).join('') +
    '<button class="v15-btn sm secondary" onclick="window._v15ClearCombo()">초기화</button>' +
    '<button class="v15-btn sm" onclick="window._v15PlayCombo()">▶ 실행</button>' +
    '</div>' +
    '<div style="font-size:13px;color:var(--text-dim);margin-bottom:10px">프리셋 콤보:</div>' +
    '<div class="v15-grid2">' +
    PRESET_COMBOS.map(function(c,i){
      return '<div class="v15-card" style="cursor:pointer" onclick="window._v15LoadPreset('+i+')">' +
        '<div style="font-weight:700;font-size:14px;margin-bottom:4px">'+c.name+'</div>' +
        '<div style="font-size:11px;color:var(--text-dim)">'+c.desc+'</div>' +
        '<div style="margin-top:6px">' + c.seq.map(function(s){
          var p = PUNCH_TYPES.filter(function(x){return x.id===s})[0];
          return '<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:700;color:#fff;background:'+p.color+';margin-right:3px">'+p.short+'</span>';
        }).join('→') + '</div></div>';
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
    ctx.fillText('위의 버튼을 눌러 콤보를 구성하세요',W/2,H/2);
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
  ctx.fillText(comboBuilderSeq.length+'연타 콤보', 12, 20);
}

window._v15AddPunch = function(pid){
  if(comboBuilderSeq.length >= 10) { showToast15('최대 10연타까지 가능합니다'); return; }
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
  showToast15(PRESET_COMBOS[idx].name + ' 로드!');
  trackFeature('combo');
};
window._v15PlayCombo = function(){
  if(comboBuilderSeq.length === 0) return;
  playSFX15('combo_play');
  v15.comboBuilder.played++;
  if(comboBuilderSeq.length > v15.comboBuilder.bestCombo) v15.comboBuilder.bestCombo = comboBuilderSeq.length;
  saveV15(v15);
  showToast15(comboBuilderSeq.length+'연타 콤보 실행!');
  checkV15Achievements();
};

// ===== 2. BOXING STANCE ANALYZER =====
var STANCES = [
  {id:'orthodox',name:'오소독스(정통)',atk:70,def:75,move:80,counter:65,speed:70,power:75,
   desc:'오른손잡이 기본. 가장 보편적인 스탠스. 균형잡힌 공방.',
   pros:'균형잡힌 공방/배우기 쉬움/파워 펌치 존명',tips:'앞발 잡-뒿발 크로스로 시작'},
  {id:'southpaw',name:'사우스포',atk:75,def:70,move:80,counter:70,speed:75,power:70,
   desc:'왼손잡이 기본. 정통파 상대에게 유리.',
   pros:'정통파 상대로 각도 유리/왼손 파워 펌치',tips:'오른발을 앞에 두고 오른손으로 리드'},
  {id:'peekaboo',name:'피카부',atk:85,def:80,move:65,counter:75,speed:80,power:90,
   desc:'마이크 타이슨의 시그니처 스탠일. 근접 공격형.',
   pros:'근접전 최강/헤드무브 방어/파워풀 어퍼컷',tips:'글러브를 얼굴 높이에서 두손으로 턴을 가드'},
  {id:'philly',name:'필리셰',atk:60,def:90,move:75,counter:90,speed:65,power:55,
   desc:'어깨 로링 기반. 카운터 펌치 특화.',
   pros:'카운터펌치 최강/어깨 로링 방어/에너지 절약',tips:'앞어깨를 내밀고 상대 펌치를 스위프'},
  {id:'crossguard',name:'크로스가드',atk:65,def:85,move:70,counter:60,speed:60,power:70,
   desc:'팔거치를 교차하여 가드. 바디 방어 특화.',
   pros:'바디 방어 특화/접근전 안정/내구성 보존',tips:'양팔을 교차하여 바디와 얻굴을 동시 방어'},
  {id:'wide',name:'와이드 스탠스',atk:80,def:60,move:85,counter:70,speed:85,power:65,
   desc:'넓은 스탠스로 기동성 극대화. 아웃복싱 스타일.',
   pros:'기동성 최상/각도 공격 유리/거리 유지',tips:'넓은 스탠스에서 빨른 진입과 후퇴'}
];

function buildStanceAnalyzer(){
  var sec = document.createElement('div');
  sec.className = 'v15-section';
  sec.id = 'v15-stance';
  sec.innerHTML = '<div class="v15-title"><span class="emoji">🥊</span> 복싱 스탠스 분석기</div>' +
    '<div class="v15-subtitle">6종 스탠스 비교 분석 + 장단점 + 혁</div>' +
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
      (viewed ? '<span class="v15-badge">✓ 학습</span>' : '') +
      '</div>' +
      '<div style="font-size:12px;color:var(--text-dim);margin:6px 0">'+s.desc+'</div>' +
      '<div style="font-size:11px;margin-top:4px"><b style="color:var(--green)">▶ 장점:</b> '+s.pros+'</div>' +
      '<div style="font-size:11px;margin-top:4px"><b style="color:var(--blue)">💡 혁:</b> '+s.tips+'</div>';
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
  var labels = ['공격','방어','기동','카운터','스피드','파워'];
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
  ctx.fillText('평균 능력치: '+avg+'/100', W/2, 42);
}

// ===== 3. VIRTUAL SANDBAG WORKOUT CANVAS =====
var bagState = { active: false, score: 0, combo: 0, timeLeft: 0, timer: null, zones: [], hitAnim: [] };

function buildSandbag(){
  var sec = document.createElement('div');
  sec.className = 'v15-section';
  sec.id = 'v15-sandbag';
  sec.innerHTML = '<div class="v15-title"><span class="emoji">🥊</span> 가상 샤드백 워크아웃</div>' +
    '<div class="v15-subtitle">터치/클릭 펌치 + 콤보 프롬프트 + 점수/타이머</div>' +
    '<div class="v15-canvas-wrap"><canvas id="v15BagCanvas" width="400" height="450" style="width:100%;display:block;cursor:pointer"></canvas></div>' +
    '<div style="text-align:center;margin-top:8px">' +
    '<button class="v15-btn" id="v15BagStart" onclick="window._v15StartBag()">🏆 30초 워크아웃 시작</button>' +
    '</div>' +
    '<div class="v15-grid3" style="margin-top:12px">' +
    '<div class="v15-card" style="text-align:center"><div style="font-size:11px;color:var(--text-dim)">총 히트</div><div style="font-size:20px;font-weight:800;color:var(--accent)" id="v15BagTotalHits">'+v15.sandbag.totalHits+'</div></div>' +
    '<div class="v15-card" style="text-align:center"><div style="font-size:11px;color:var(--text-dim)">최고점수</div><div style="font-size:20px;font-weight:800;color:var(--gold)" id="v15BagBest">'+v15.sandbag.bestScore+'</div></div>' +
    '<div class="v15-card" style="text-align:center"><div style="font-size:11px;color:var(--text-dim)">세션</div><div style="font-size:20px;font-weight:800;color:var(--green)" id="v15BagSessions">'+v15.sandbag.sessions+'</div></div>' +
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
    {name:'머리',y:bagY-100,r:28,color:'rgba(255,68,68,0.3)'},
    {name:'가슴',y:bagY-30,r:35,color:'rgba(255,150,50,0.3)'},
    {name:'복부',y:bagY+50,r:32,color:'rgba(100,200,100,0.3)'},
    {name:'언구리',y:bagY+130,r:26,color:'rgba(100,150,255,0.3)'}
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
    ctx.fillText('점수: '+bagState.score+'  콤보: '+bagState.combo, W/2, H - 20);
  } else {
    ctx.fillStyle = isDark ? '#888' : '#666';
    ctx.font = '13px -apple-system,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('샤드백을 터치/클릭하여 펌치하세요', W/2, H - 20);
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
      showToast15('워크아웃 완료! 점수: '+bagState.score);
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
  {name:'어깨 로테이터커프 부상',area:'어깨',risk:'높음',
   prevent:'직침국/척복근 강화, 펌치 전 스트레칭',
   treat:'휴식, RICE 요법, 점진적 복귀'},
  {name:'손목/손가락 골절',area:'손',risk:'높음',
   prevent:'올바른 붕대 감기, 랙팅동작 정확히 수행',
   treat:'고정, 병원 진료, 완치 시까지 훈련 중단'},
  {name:'뇌진탕(경미)',area:'머리',risk:'높음',
   prevent:'헤드가드 항상 유지, 목 근력 강화',
   treat:'즉시 휴식, 1~2주 완전휴식, 전문가 상담'},
  {name:'무릎 인대 손상',area:'무릎',risk:'중간',
   prevent:'피보팅/부워크 시 무릎 방향 주의',
   treat:'반월고, 압박, 물리치료, 심하면 수술'},
  {name:'갈비뼈(골밴) 암박우스',area:'팔깜치',risk:'중간',
   prevent:'손목 강화 운동, 엔드포인트 복싱훈련',
   treat:'붕대+아이싱+휴식, 포러롤링'},
  {name:'갈비뼈 골절(구식)',area:'갈비뼈',risk:'중간',
   prevent:'묝가드 장착권장, 피보팅 기술 훈련',
   treat:'즉시 휴식, 병원 진료, 털 고정'},
  {name:'목 근육 긴장',area:'목',risk:'중간',
   prevent:'목 스트레칭 충분히, 메디신볼 운동',
   treat:'따뜻한 판, 마사지, 스트레칭, 반월고'},
  {name:'아킬레스건 통증',area:'발',risk:'낮음',
   prevent:'아킬레스건 강화 운동, 적절한 신발',
   treat:'휴식, 테이핑, 염증 감소 처치'},
  {name:'코 출혈/골절',area:'코',risk:'중간',
   prevent:'코 보호기(건) 착용, 방어 기술 연습',
   treat:'즉시 휴식, 건으로 보호, 병원 진료'},
  {name:'운동유발성 천식',area:'호흡기',risk:'낮음',
   prevent:'워밍업충분히, 인헤일러 비치',
   treat:'건조한 환경에서 서서히 훈련, 병원 상담'},
  {name:'허리 디스크 부상',area:'허리',risk:'낮음',
   prevent:'코어 강화, 복싱시 적절한 험음거리기',
   treat:'휴식, 스트레칭, 물리치료'},
  {name:'열사병/탈수',area:'전신',risk:'낮음',
   prevent:'충분한 수분 섭취, 휴식 간격 준수',
   treat:'시원한 환경으로 이동, 수분/전해질 보충'}
];

function buildInjuryGuide(){
  var sec = document.createElement('div');
  sec.className = 'v15-section';
  sec.id = 'v15-injury';
  sec.innerHTML = '<div class="v15-title"><span class="emoji">🏥</span> 부상 예방 가이드</div>' +
    '<div class="v15-subtitle">12종 복싱 부상 유형 + 예방법 + 치료법</div>' +
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
      '<span class="v15-tag" style="background:'+riskColor+';color:#fff">위험: '+inj.risk+'</span>' +
      '</div>' +
      '<div style="font-size:12px;margin-bottom:4px"><b>부위:</b> '+inj.area+'</div>' +
      '<div style="font-size:12px;margin-bottom:4px;color:var(--green)"><b>예방:</b> '+inj.prevent+'</div>' +
      '<div style="font-size:12px;color:var(--blue)"><b>치료:</b> '+inj.treat+'</div>' +
      (viewed ? '<div style="margin-top:6px"><span class="v15-badge">✓ 학습</span></div>' : '');
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
  {round:1,desc:'A선수가 잡을 계속 꽂고, B선수는 가드 웨에서 몆차례 크로스를 리턴행다.',a_score:9,b_score:10,explain:'B선수의 클린 파워펌치가 더 효과적'},
  {round:2,desc:'양선수 활발한 공방. A가 만이 따렸지만 B가 클린히트 비율이 높다.',a_score:9,b_score:10,explain:'최종결과 자체보다 클린히트 비율과 효과적 공격이 중요'},
  {round:3,desc:'A선수가 어퍼컷으로 B를 흔들릴 점도의 강력한 펌치를 넣었다.',a_score:10,b_score:8,explain:'다운을 유발한 강력한 펌치는 10-8 채점 가능'},
  {round:4,desc:'B선수가 링 가운데를 장악하고 상대를 럄아넣긴다.',a_score:9,b_score:10,explain:'링제너러십(링 장악)은 채점에 유리'},
  {round:5,desc:'양선수 횤드 교환이 많았고, 특별히 우위를 가릴 수 없는 접전.',a_score:10,b_score:10,explain:'분명한 우위가 없으면 10-10 이분 라운드'},
  {round:6,desc:'A선수가 잡으로 거리를 유지하며 아웃복싱을 펢쳨다.',a_score:10,b_score:9,explain:'효과적 거리 유지와 깨끗한 잡이 높게 평가'},
  {round:7,desc:'B선수가 클린치를 과도하게 사용하고 심판이 경고를 받았다.',a_score:10,b_score:9,explain:'반칙 경고는 점수에 불리하게 작용'},
  {round:8,desc:'A선수가 바디 공격으로 B를 계속 압박했다. B는 방어만 했다.',a_score:10,b_score:9,explain:'공격적 우위와 압박이 채점에 반영'},
  {round:9,desc:'마지막 라운드 전. B선수가 총공세로 전환하여 여러번 히트.',a_score:9,b_score:10,explain:'마지막 공격 의지와 격렬한 공격이 높은 평가'},
  {round:10,desc:'최종 라운드. 양선수 사력을 다한 공방. A가 근소한 차이로 우세.',a_score:10,b_score:9,explain:'근소한 차이라도 우위가 있으면 10-9'}
];

var judgeState = { currentRound: 0, playerScoresA: [], playerScoresB: [], started: false };

function buildJudgeSim(){
  var sec = document.createElement('div');
  sec.className = 'v15-section';
  sec.id = 'v15-judge';
  sec.innerHTML = '<div class="v15-title"><span class="emoji">⚖️</span> 심판 채점 시뮬레이터</div>' +
    '<div class="v15-subtitle">10R 10점 방식 채점 학습 + 판정 설명</div>' +
    '<div id="v15JudgeArea"></div>';
  return sec;
}

function renderJudge(){
  var area = document.getElementById('v15JudgeArea');
  if(!area) return;
  if(!judgeState.started){
    area.innerHTML = '<div style="text-align:center;padding:20px">' +
      '<div style="font-size:14px;color:var(--text-dim);margin-bottom:16px">10라운드 경기 시나리오를 보고 채점해보세요.<br>각 라운드마다 A선수와 B선수에게 점수를 부여합니다.</div>' +
      '<button class="v15-btn" onclick="window._v15StartJudge()">⚖️ 채점 시작</button></div>';
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
      '<div style="font-size:14px;margin:8px 0">내 채점: A('+totalA+') vs B('+totalB+')</div>' +
      '<div style="font-size:13px;color:var(--text-dim)">정답 채점: A('+correctA+') vs B('+correctB+')</div>' +
      '<div style="font-size:13px;color:var(--text-dim);margin-top:4px">편차: '+diff+'점 (낮을수록 정확)</div>' +
      '<button class="v15-btn" style="margin-top:16px" onclick="window._v15ResetJudge()">다시 채점하기</button></div>';
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
    '<span class="v15-badge">라운드 '+(r+1)+'/10</span>' +
    '<span style="font-size:12px;color:var(--text-dim)">'+(r+1)+'R</span></div>' +
    '<div style="font-size:14px;line-height:1.6;margin-bottom:16px">'+sc.desc+'</div>' +
    '<div class="v15-grid2">' +
    '<div><div style="font-size:12px;font-weight:700;margin-bottom:8px;color:var(--blue)">A선수 점수</div>' +
    [7,8,9,10].map(function(s){ return '<button class="v15-btn sm secondary" style="margin:2px" onclick="window._v15ScoreA('+s+')">'+s+'</button>'; }).join('') +
    '</div>' +
    '<div><div style="font-size:12px;font-weight:700;margin-bottom:8px;color:var(--accent)">B선수 점수</div>' +
    [7,8,9,10].map(function(s){ return '<button class="v15-btn sm secondary" style="margin:2px" onclick="window._v15ScoreB('+s+')">'+s+'</button>'; }).join('') +
    '</div></div></div>';
  if(r > 0){
    var prev = JUDGE_SCENARIOS[r-1];
    area.innerHTML += '<div class="v15-card" style="border-left:3px solid var(--accent)">' +
      '<div style="font-size:12px;font-weight:700;margin-bottom:4px">이전 라운드 해설</div>' +
      '<div style="font-size:12px;color:var(--text-dim)">정답: A('+prev.a_score+') B('+prev.b_score+') — '+prev.explain+'</div></div>';
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
    showToast15('B선수 점수도 선택하세요');
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
  {id:'great',emoji:'🔥',label:'최고'},
  {id:'good',emoji:'💪',label:'좋음'},
  {id:'ok',emoji:'😐',label:'보통'},
  {id:'tired',emoji:'😤',label:'피곤'},
  {id:'bad',emoji:'😭',label:'힘들어'}
];

function buildDiary(){
  var sec = document.createElement('div');
  sec.className = 'v15-section';
  sec.id = 'v15-diary';
  sec.innerHTML = '<div class="v15-title"><span class="emoji">📝</span> 트레이닝 다이어리</div>' +
    '<div class="v15-subtitle">휴련 일지 + 기분 5종 + 50건 보관 + 타임라인</div>' +
    '<div style="margin-bottom:12px">' +
    '<div style="font-size:13px;font-weight:600;margin-bottom:8px">오늘의 기분</div>' +
    '<div class="v15-flex" id="v15MoodPicker">' +
    DIARY_MOODS.map(function(m){ return '<span class="v15-mood" data-mood="'+m.id+'" onclick="window._v15SelectMood(\''+m.id+'\')" title="'+m.label+'">'+m.emoji+'</span>'; }).join('') +
    '</div></div>' +
    '<div style="margin-bottom:12px">' +
    '<textarea id="v15DiaryText" placeholder="오늘의 휴련 기록..." style="width:100%;height:70px;background:var(--surface);border:1px solid var(--glass-border);border-radius:10px;color:var(--text);padding:12px;font-size:13px;resize:none;font-family:var(--font)"></textarea>' +
    '</div>' +
    '<button class="v15-btn" onclick="window._v15SaveDiary()">💾 저장</button>' +
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
  if(!text || !text.value.trim()) { showToast15('내용을 입력해주세요'); return; }
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
  showToast15('다이어리 저장 완료!');
  renderDiaryTimeline();
  trackFeature('diary');
  checkV15Achievements();
};

function renderDiaryTimeline(){
  var tl = document.getElementById('v15DiaryTimeline');
  if(!tl) return;
  if(v15.diary.entries.length === 0){
    tl.innerHTML = '<div style="text-align:center;color:var(--text-dim);font-size:13px;padding:16px">아직 기록이 없습니다</div>';
    return;
  }
  tl.innerHTML = '<div style="font-size:13px;font-weight:700;margin-bottom:10px">최근 기록 ('+v15.diary.entries.length+'건)</div><div class="v15-timeline">' +
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
  sec.innerHTML = '<div class="v15-title"><span class="emoji">📈</span> 전투력 분석 대시보드</div>' +
    '<div class="v15-subtitle">6축 레이더 (파워/스피드/지구력/방어/기술/풍워크)</div>' +
    '<div class="v15-canvas-wrap"><canvas id="v15PowerRadar" width="400" height="400" style="width:100%;display:block"></canvas></div>' +
    '<div style="text-align:center;margin-top:8px">' +
    '<button class="v15-btn" onclick="window._v15ScanPower()">🔍 전투력 스캔</button></div>';
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
  var labels = ['파워','스피드','지구력','방어','기술','풍워크'];
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
  ctx.fillText('종합 전투력: '+avg+'/100', W/2, 52);
}

// ===== 8. LEGENDARY FIGHTS REVIEW =====
var LEGEND_FIGHTS = [
  {year:'1974',title:'정글 인 더 정글',fighters:'무하마드 알리 vs 조지 포먼',
   lesson:'로프어독(Rope-a-dope) 전략. 체력 보존+카운터 전략의 교과서'},
  {year:'1975',title:'실라 인 마닐라',fighters:'무하마드 알리 vs 조 프레이지어',
   lesson:'14R 극한의 대결. 어떤 상황에서도 포기하지 않는 정신력'},
  {year:'1990',title:'타이슨 vs 더글러스',fighters:'마이크 타이슨 vs 제임스 더글러스',
   lesson:'역대 최고의 이변. 자만을 버리고 근본에 충실하라'},
  {year:'1997',title:'무어바이트 II',fighters:'에밴더 홀리필드 vs 마이크 타이슨',
   lesson:'과도한 팔을 범하면 결과가 어떤건 의미없어진다'},
  {year:'2002',title:'친비우스의 전쟁',fighters:'레낁스 루이스 vs 마이크 타이슨',
   lesson:'체급 암박우스의 강점. 기술과 스태미나의 조합'},
  {year:'2012',title:'파퀴아오 vs 마르게스',fighters:'매니 파퀴아오 vs 훬 마르게스',
   lesson:'스피드와 풍워크가 파워를 이긴 수 있다'},
  {year:'2015',title:'세기의 대결',fighters:'메이웨더 vs 파퀴아오',
   lesson:'완벽한 방어 기술은 공격력을 압도할 수 있다'},
  {year:'1980',title:'예술과 과학',fighters:'슬거 레이 레너드 vs 로베르토 두란',
   lesson:'일승일패 대반전. 한 번 기회를 놓치지 말것'},
  {year:'2001',title:'바림의 전사',fighters:'홍수환 vs 네스터 가르사',
   lesson:'한국 복싱의 역사. 작은 체격으로도 의지로 승리할 수 있다'},
  {year:'2019',title:'멍시코의 밤',fighters:'앤디 루이스 vs 앤투니 조슈',
   lesson:'복싱은 예측불가능. 한 방에 모든 것이 바꿴다'},
  {year:'2022',title:'역대 최강',fighters:'올렌산더르 우시크 vs 앤투니 조슈',
   lesson:'4체급 통일 전략. 복싱IQ와 테크닉의 승리'},
  {year:'2017',title:'머니 매치',fighters:'메이웨더 vs 맥그리거',
   lesson:'다른 종목에서 온 도전. 경험과 기술의 차이'}
];

function buildLegendFights(){
  var sec = document.createElement('div');
  sec.className = 'v15-section';
  sec.id = 'v15-legends';
  sec.innerHTML = '<div class="v15-title"><span class="emoji">🏆</span> 복싱 명대결 리뷰 12선</div>' +
    '<div class="v15-subtitle">역사적 명경기 분석 + 교훈</div>' +
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
      (viewed ? '<span class="v15-badge">✓</span>' : '') +
      '</div>' +
      '<div style="font-size:12px;color:var(--text-dim);margin:6px 0">'+f.fighters+'</div>' +
      '<div style="font-size:12px"><b style="color:var(--gold)">💡 교훈:</b> '+f.lesson+'</div>';
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
  {q:'복싱에서 “원투”는 어떤 펌치 조합을 의미하나?',a:['잡-크로스','잡-휁','어퍼-크로스','휁-휁'],c:0},
  {q:'로프어독(Rope-a-dope) 전략을 유명하게 사용한 선수는?',a:['마이크 타이슨','무하마드 알리','메이웨더','매니 파퀴아오'],c:1},
  {q:'10점 방식 채점에서 다운이 없으면 각 선수에게 몇 점을 부여하나?',a:['10-10','10-9','9-9','10-8'],c:0},
  {q:'피카부 스탠스를 유명하게 사용한 선수는?',a:['알리','타이슨','메이웨더','레낁스'],c:1},
  {q:'복싱에서 “클린치”는 무엇을 의미하나?',a:['강력한 펌치','상대를 꼴안는 동작','파울 펌치','어퍼컷'],c:1},
  {q:'샤드백 워크아웃에서 가장 많은 점수를 얻는 부위는?',a:['복부','발','머리','가슴'],c:2},
  {q:'필리셰 스탠스의 가장 큰 장점은?',a:['파워 펌치','카운터 펌치','빨른 스피드','강한 방어'],c:1},
  {q:'복싱에서 “보디샷”은 어디를 공격하는 것을 말하나?',a:['얼굴','팔','몸통','다리'],c:2},
  {q:'정글 인 더 정글(Rumble in the Jungle)은 어느 해에 열렸나?',a:['1972','1974','1976','1978'],c:1},
  {q:'복싱 부상 중 “RICE 요법”에서 R은 무엇을 의미하나?',a:['Recovery','Rest','Rehab','Rotation'],c:1},
  {q:'크로스가드 스탠스의 특화된 방어 영역은?',a:['머리','바디','다리','팔'],c:1},
  {q:'10라운드 중 한 선수가 다운당하면 채점은?',a:['10-10','10-8','10-7','10-9'],c:1},
  {q:'복싱에서 “아웃복싱”은 어떤 스타일을 의미하나?',a:['근접전','거리유지전','카운터전','방어전'],c:1},
  {q:'복싱 훈련 중 메디신볼 운동썰 강화하는 부위는?',a:['어깨','목','허리','전신'],c:1},
  {q:'복싱에서 중량급 기준은(프로 기준)?',a:['72.5kg 이하','75.7kg 이하','69.8kg 이하','76.2kg 이하'],c:3}
];

function buildQuizV15(){
  var sec = document.createElement('div');
  sec.className = 'v15-section';
  sec.id = 'v15-quiz';
  sec.innerHTML = '<div class="v15-title"><span class="emoji">❓</span> v15 퀴즈 (+15문, 총 105)</div>' +
    '<div class="v15-subtitle">복싱 지식 테스트 - 콤보/스탠스/채점/부상/역사</div>' +
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
      '<div style="font-size:14px;margin:8px 0">'+quizV15State.correct+'/'+QUIZ_V15.length+' 정답</div>' +
      '<button class="v15-btn" onclick="window._v15RetryQuiz()">다시 풀기</button></div>';
    v15.quizV15Scores[new Date().toISOString().slice(0,10)] = pct;
    saveV15(v15);
    checkV15Achievements();
    return;
  }
  var q = QUIZ_V15[quizV15State.idx];
  area.innerHTML = '<div class="v15-card"><div style="display:flex;justify-content:space-between;margin-bottom:10px">' +
    '<span class="v15-badge">Q'+(quizV15State.idx+1)+'/'+QUIZ_V15.length+'</span>' +
    '<span style="font-size:12px;color:var(--text-dim)">'+quizV15State.correct+'정답</span></div>' +
    '<div style="font-size:14px;font-weight:600;margin-bottom:14px;line-height:1.5">'+q.q+'</div>' +
    q.a.map(function(opt,i){
      return '<button class="v15-btn secondary" style="width:100%;margin-bottom:6px;text-align:left" onclick="window._v15AnswerQuiz('+i+')">'+opt+'</button>';
    }).join('') + '</div>';
}

window._v15AnswerQuiz = function(idx){
  var q = QUIZ_V15[quizV15State.idx];
  if(idx === q.c){ quizV15State.correct++; playSFX15('quiz_v15'); showToast15('정답!'); }
  else { showToast15('오답! 정답: '+q.a[q.c]); }
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
  {id:'combo_first',name:'첫 콤보',icon:'💪',desc:'콤보 빌더에서 첫 콤보 실행'},
  {id:'combo_5',name:'콤보 마스터',icon:'⚡',desc:'5회 이상 콤보 실행'},
  {id:'combo_long',name:'롱콤보',icon:'🏆',desc:'8연타 이상 콤보 구성'},
  {id:'stance_3',name:'스탠스 탐색가',icon:'🥊',desc:'3개 이상 스탠스 학습'},
  {id:'stance_all',name:'스탠스 마스터',icon:'🌟',desc:'모든 6종 스탠스 학습'},
  {id:'bag_first',name:'첫 샤드백',icon:'🥊',desc:'샤드백 워크아웃 첫 완료'},
  {id:'bag_high',name:'펌치 머신',icon:'🔥',desc:'샤드백 200점 이상 달성'},
  {id:'injury_6',name:'안전 제일',icon:'🏥',desc:'6개 이상 부상 예방 학습'},
  {id:'injury_all',name:'부상 박사',icon:'🎓',desc:'12종 부상 전부 학습'},
  {id:'judge_first',name:'첫 채점',icon:'⚖️',desc:'채점 시뮬레이터 첫 완료'},
  {id:'diary_5',name:'기록광',icon:'📝',desc:'다이어리 5회 이상 작성'},
  {id:'v15_explorer',name:'v15 탐험가',icon:'🚀',desc:'v15 모든 기능 사용'}
];

function checkV15Achievements(){
  var changed = false;
  function unlock(id){
    if(!v15.achievementsV15[id]){
      v15.achievementsV15[id] = new Date().toISOString();
      changed = true;
      var a = ACHIEVEMENTS_V15.filter(function(x){return x.id===id})[0];
      if(a) showToast15(a.icon+' 업적 해금: '+a.name);
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
  sec.innerHTML = '<div class="v15-title"><span class="emoji">🏆</span> v15 업적 ('+countV15Ach()+'/'+ACHIEVEMENTS_V15.length+')</div>' +
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
  if(title) title.innerHTML = '<span class="emoji">🏆</span> v15 업적 ('+countV15Ach()+'/'+ACHIEVEMENTS_V15.length+')';
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
    {label:'콤보빌더',target:'v15-combo'},
    {label:'스탠스',target:'v15-stance'},
    {label:'샤드백',target:'v15-sandbag'},
    {label:'부상예방',target:'v15-injury'},
    {label:'채점시뮬',target:'v15-judge'},
    {label:'다이어리',target:'v15-diary'},
    {label:'전투력',target:'v15-power-radar'},
    {label:'명대결',target:'v15-legends'}
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
