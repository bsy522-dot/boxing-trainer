// Boxing Trainer Pro v14_patch.js - NEXTERA+PRISM Auto Enhancement Module
// Punch Accuracy Trainer Canvas 10zones, Weight Class Guide 17classes,
// HIIT Interval Timer 8presets, Fight Technique Lab 12techniques,
// Punch Power Trend Canvas, Reflex Training Game Canvas,
// Coach AI Analysis Radar Canvas, Body Shot Zone Map Canvas 12zones,
// Quiz +15 (75->90), +12 Achievements (82->94), SFX 12, Keyboard +8
(function(){
'use strict';

var STORAGE_KEY = 'boxingTrainerData';
var V14KEY = 'boxingV14Patch';

function loadAppData(){
  try { var r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch(e){ return null; }
}
function loadV14(){
  try {
    var r = localStorage.getItem(V14KEY);
    if(!r) return defV14();
    var p = JSON.parse(r), d = defV14();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV14(); }
}
function saveV14(d){ try { localStorage.setItem(V14KEY, JSON.stringify(d)); } catch(e){} }
function defV14(){
  return {
    accuracy: { totalHits: 0, totalMisses: 0, bestStreak: 0, zoneHits: {} },
    weightClass: { viewed: [], selected: '' },
    hiit: { completed: 0, totalTime: 0, favorite: '' },
    techniques: { viewed: [], mastered: [] },
    powerLog: [],
    reflex: { bestTime: 9999, avgTime: 0, totalTests: 0, scores: [] },
    coachTips: [],
    bodyShot: { zoneHits: {}, totalShots: 0 },
    quizV14Scores: {},
    achievementsV14: {}
  };
}

var v14 = loadV14();

// ===== SFX ENGINE V14 =====
function playSFX14(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'accuracy_hit':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(1200,t+0.05);
        g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.08);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.08);break;
      case 'accuracy_miss':
        var o2=ctx.createOscillator(),g2=ctx.createGain();
        o2.type='sawtooth';o2.frequency.setValueAtTime(150,t);o2.frequency.exponentialRampToValueAtTime(60,t+0.12);
        g2.gain.setValueAtTime(0.08,t);g2.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o2.connect(g2).connect(ctx.destination);o2.start(t);o2.stop(t+0.12);break;
      case 'hiit_bell':
        [784,988,1175].forEach(function(f,j){
          var o3=ctx.createOscillator(),g3=ctx.createGain();
          o3.type='triangle';o3.frequency.value=f;
          g3.gain.setValueAtTime(0.12,t+j*0.05);g3.gain.exponentialRampToValueAtTime(0.001,t+j*0.05+0.3);
          o3.connect(g3).connect(ctx.destination);o3.start(t+j*0.05);o3.stop(t+j*0.05+0.3);
        });break;
      case 'hiit_rest':
        var o4=ctx.createOscillator(),g4=ctx.createGain();
        o4.type='sine';o4.frequency.setValueAtTime(392,t);o4.frequency.linearRampToValueAtTime(330,t+0.3);
        g4.gain.setValueAtTime(0.06,t);g4.gain.exponentialRampToValueAtTime(0.001,t+0.35);
        o4.connect(g4).connect(ctx.destination);o4.start(t);o4.stop(t+0.35);break;
      case 'technique':
        var o5=ctx.createOscillator(),g5=ctx.createGain();
        o5.type='triangle';o5.frequency.setValueAtTime(523,t);o5.frequency.linearRampToValueAtTime(784,t+0.15);
        g5.gain.setValueAtTime(0.08,t);g5.gain.exponentialRampToValueAtTime(0.001,t+0.2);
        o5.connect(g5).connect(ctx.destination);o5.start(t);o5.stop(t+0.2);break;
      case 'power_log':
        var o6=ctx.createOscillator(),g6=ctx.createGain();
        o6.type='square';o6.frequency.setValueAtTime(220,t);o6.frequency.exponentialRampToValueAtTime(440,t+0.1);
        g6.gain.setValueAtTime(0.06,t);g6.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o6.connect(g6).connect(ctx.destination);o6.start(t);o6.stop(t+0.12);break;
      case 'reflex_go':
        var o7=ctx.createOscillator(),g7=ctx.createGain();
        o7.type='sine';o7.frequency.setValueAtTime(1047,t);
        g7.gain.setValueAtTime(0.15,t);g7.gain.exponentialRampToValueAtTime(0.001,t+0.08);
        o7.connect(g7).connect(ctx.destination);o7.start(t);o7.stop(t+0.08);break;
      case 'reflex_hit':
        [659,784,988,1175].forEach(function(f,j){
          var o8=ctx.createOscillator(),g8=ctx.createGain();
          o8.type='sine';o8.frequency.value=f;
          g8.gain.setValueAtTime(0.08,t+j*0.06);g8.gain.exponentialRampToValueAtTime(0.001,t+j*0.06+0.15);
          o8.connect(g8).connect(ctx.destination);o8.start(t+j*0.06);o8.stop(t+j*0.06+0.15);
        });break;
      case 'coach':
        [440,554,659].forEach(function(f,j){
          var o9=ctx.createOscillator(),g9=ctx.createGain();
          o9.type='triangle';o9.frequency.value=f;
          g9.gain.setValueAtTime(0.07,t+j*0.12);g9.gain.exponentialRampToValueAtTime(0.001,t+j*0.12+0.25);
          o9.connect(g9).connect(ctx.destination);o9.start(t+j*0.12);o9.stop(t+j*0.12+0.25);
        });break;
      case 'bodyshot':
        var oB=ctx.createOscillator(),gB=ctx.createGain();
        oB.type='sine';oB.frequency.setValueAtTime(200,t);oB.frequency.exponentialRampToValueAtTime(100,t+0.1);
        gB.gain.setValueAtTime(0.14,t);gB.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        oB.connect(gB).connect(ctx.destination);oB.start(t);oB.stop(t+0.12);break;
      case 'weight_view':
        var oW=ctx.createOscillator(),gW=ctx.createGain();
        oW.type='triangle';oW.frequency.setValueAtTime(330,t);oW.frequency.linearRampToValueAtTime(494,t+0.1);
        gW.gain.setValueAtTime(0.06,t);gW.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        oW.connect(gW).connect(ctx.destination);oW.start(t);oW.stop(t+0.15);break;
      case 'achieve_v14':
        [523,659,784,1047,1319].forEach(function(f,j){
          var oA=ctx.createOscillator(),gA=ctx.createGain();
          oA.type='sine';oA.frequency.value=f;
          gA.gain.setValueAtTime(0.1,t+j*0.07);gA.gain.exponentialRampToValueAtTime(0.001,t+j*0.07+0.3);
          oA.connect(gA).connect(ctx.destination);oA.start(t+j*0.07);oA.stop(t+j*0.07+0.3);
        });break;
    }
  } catch(e){}
}

// ===== CSS V14 =====
function injectV14CSS(){
  var s = document.createElement('style');
  s.textContent = '\
.v14-section{margin:24px 0;animation:slideUp 0.5s ease-out both}\
.v14-card{background:var(--glass);border:1px solid var(--glass-border);\
border-radius:var(--radius);padding:20px;backdrop-filter:blur(12px);transition:all 0.3s}\
.v14-card:hover{border-color:rgba(255,68,68,0.3);transform:translateY(-2px)}\
.v14-title{font-size:18px;font-weight:800;margin-bottom:14px;\
display:flex;align-items:center;gap:8px;letter-spacing:0.5px}\
.v14-title .emoji{font-size:22px}\
.v14-grid-2{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}\
.v14-grid-3{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}\
.v14-canvas{width:100%;max-width:480px;height:400px;margin:12px auto;display:block;\
border-radius:12px;background:var(--surface);cursor:crosshair}\
.v14-btn{padding:10px 20px;border:1px solid var(--glass-border);border-radius:12px;\
background:var(--glass);font-size:13px;font-weight:700;color:var(--text-dim);cursor:pointer;\
transition:all 0.2s}\
.v14-btn:hover{border-color:var(--accent);color:var(--accent)}\
.v14-btn.active{border-color:var(--accent);color:var(--accent);background:var(--accent-soft)}\
.v14-btn.primary{background:var(--accent);color:#fff;border-color:var(--accent)}\
.v14-btn.primary:hover{filter:brightness(1.1)}\
.v14-stat-row{display:flex;gap:12px;justify-content:center;margin:10px 0;flex-wrap:wrap}\
.v14-stat{text-align:center;padding:8px 16px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:10px;min-width:70px}\
.v14-stat-val{font-size:20px;font-weight:900}\
.v14-stat-lbl{font-size:9px;color:var(--text-muted);margin-top:2px}\
.wc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px}\
.wc-card{padding:14px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:14px;cursor:pointer;transition:all 0.3s;text-align:center}\
.wc-card:hover{border-color:var(--blue);transform:translateY(-2px)}\
.wc-card.selected{border-color:var(--gold);background:rgba(255,215,0,0.05)}\
.wc-name{font-size:14px;font-weight:800;margin:4px 0}\
.wc-range{font-size:11px;color:var(--text-dim)}\
.wc-icon{font-size:28px}\
.hiit-display{text-align:center;padding:20px}\
.hiit-timer{font-size:64px;font-weight:900;font-family:monospace;color:var(--accent);margin:10px 0}\
.hiit-phase{font-size:18px;font-weight:700;margin:6px 0;text-transform:uppercase;letter-spacing:3px}\
.hiit-phase.work{color:var(--accent)}\
.hiit-phase.rest{color:var(--green)}\
.hiit-presets{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:12px 0}\
.hiit-preset{padding:10px 16px;border:1px solid var(--glass-border);border-radius:12px;\
background:var(--glass);font-size:12px;font-weight:700;color:var(--text-dim);cursor:pointer;\
transition:all 0.2s;text-align:center}\
.hiit-preset:hover{border-color:var(--accent);color:var(--accent)}\
.hiit-preset.active{border-color:var(--accent);color:var(--accent);background:var(--accent-soft)}\
.hiit-progress{height:8px;background:var(--surface);border-radius:4px;overflow:hidden;margin:10px 0}\
.hiit-progress-fill{height:100%;border-radius:4px;transition:width 0.3s}\
.tech-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}\
.tech-card{padding:16px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:14px;cursor:pointer;transition:all 0.3s}\
.tech-card:hover{border-color:var(--purple);transform:translateY(-2px)}\
.tech-card.mastered{border-color:var(--gold);background:rgba(255,215,0,0.05)}\
.tech-card.viewed{border-color:rgba(168,85,247,0.3)}\
.tech-icon{font-size:32px;margin-bottom:6px}\
.tech-name{font-size:14px;font-weight:800;margin-bottom:4px}\
.tech-cat{font-size:10px;padding:2px 8px;border-radius:10px;display:inline-block;margin-bottom:6px;font-weight:700}\
.tech-cat.punch{background:rgba(255,68,68,0.15);color:var(--accent)}\
.tech-cat.defense{background:rgba(59,130,246,0.15);color:var(--blue)}\
.tech-cat.footwork{background:rgba(34,197,94,0.15);color:var(--green)}\
.tech-cat.combo{background:rgba(168,85,247,0.15);color:var(--purple)}\
.tech-desc{font-size:12px;color:var(--text-dim);line-height:1.5}\
.tech-detail{display:none;margin-top:10px;padding-top:10px;border-top:1px solid var(--glass-border);\
font-size:11px;color:var(--text-dim);line-height:1.6}\
.tech-card.open .tech-detail{display:block}\
.tech-master-btn{margin-top:8px;padding:6px 14px;border:1px solid var(--gold);border-radius:8px;\
background:transparent;color:var(--gold);font-size:11px;font-weight:700;cursor:pointer}\
.reflex-canvas{width:100%;max-width:480px;height:400px;margin:12px auto;display:block;\
border-radius:12px;background:var(--surface)}\
.reflex-result{text-align:center;margin:10px 0}\
.reflex-time{font-size:42px;font-weight:900;color:var(--green)}\
.reflex-grade{font-size:24px;font-weight:900;margin:4px 0}\
.bodyshot-canvas{width:100%;max-width:380px;height:500px;margin:12px auto;display:block;\
border-radius:12px;background:var(--surface)}\
.coach-canvas{width:100%;max-width:420px;height:420px;margin:12px auto;display:block;\
border-radius:12px;background:var(--surface)}\
.coach-tips{margin-top:12px}\
.coach-tip{padding:12px 16px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:12px;margin:8px 0;font-size:12px;color:var(--text-dim);line-height:1.6}\
.coach-tip-icon{font-size:18px;margin-right:6px}\
.v14-quiz-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);\
backdrop-filter:blur(5px);z-index:1000;display:none;align-items:center;justify-content:center}\
.v14-quiz-modal.open{display:flex}\
.v14-quiz-panel{background:var(--bg);border:1px solid var(--glass-border);border-radius:20px;\
padding:30px;width:90%;max-width:500px;max-height:80vh;overflow-y:auto}\
.v14-quiz-q{font-size:16px;font-weight:700;margin:12px 0;line-height:1.5}\
.v14-quiz-opt{display:block;width:100%;padding:14px 18px;margin:8px 0;border:1px solid var(--glass-border);\
border-radius:12px;background:var(--glass);color:var(--text);font-size:14px;cursor:pointer;\
text-align:left;transition:all 0.2s}\
.v14-quiz-opt:hover{border-color:var(--accent)}\
.v14-quiz-opt.correct{border-color:var(--green);background:rgba(34,197,94,0.15);color:var(--green)}\
.v14-quiz-opt.wrong{border-color:var(--accent);background:rgba(255,68,68,0.15);color:var(--accent)}\
.v14-fab-bar{position:fixed;bottom:12px;left:0;right:0;z-index:90;\
display:flex;gap:8px;padding:10px 16px;overflow-x:auto;\
-webkit-overflow-scrolling:touch;scrollbar-width:none}\
.v14-fab-bar::-webkit-scrollbar{display:none}\
.v14-fab{flex-shrink:0;padding:10px 16px;border-radius:24px;\
background:var(--glass);border:1px solid var(--glass-border);\
backdrop-filter:blur(12px);color:var(--text-dim);font-size:12px;font-weight:700;\
cursor:pointer;transition:all 0.2s;white-space:nowrap;display:flex;align-items:center;gap:6px}\
.v14-fab:hover{border-color:var(--accent);color:var(--accent)}\
.v14-fab .fab-icon{font-size:16px}\
@media(max-width:768px){\
.v14-grid-2{grid-template-columns:1fr}\
.v14-grid-3{grid-template-columns:1fr}\
.v14-canvas,.reflex-canvas,.bodyshot-canvas,.coach-canvas{height:320px;max-width:100%}\
.wc-grid{grid-template-columns:repeat(2,1fr)}\
.tech-grid{grid-template-columns:1fr}\
.hiit-timer{font-size:48px}\
}';
  document.head.appendChild(s);
}

// ===== WEIGHT CLASSES =====
var WEIGHT_CLASSES = [
  {name:'민니마우웨이트',range:'46.3kg 이하',icon:'🥊',tip:'스피드와 발놓림으로 승부'},
  {name:'라이트플라이웨이트',range:'48.99kg',icon:'🥊',tip:'빠른 콤보와 방어 중심'},
  {name:'플라이웨이트',range:'50.8kg',icon:'🥊',tip:'카운터 펀치와 클린치 능력 필수'},
  {name:'슈퍼플라이',range:'52.16kg',icon:'🥊',tip:'전후 스텝과 보디샷 조합'},
  {name:'밴탐웨이트',range:'53.5kg',icon:'🥊',tip:'리치와 다양한 콤비네이션'},
  {name:'슈퍼밴탐',range:'55.34kg',icon:'🥊',tip:'인사이드 파이팅과 바디 공격'},
  {name:'페더웨이트',range:'57.15kg',icon:'🥊',tip:'테크닉과 파워의 밸런스'},
  {name:'슈퍼페더',range:'58.97kg',icon:'🥊',tip:'아웃복싱과 카운터 펀치'},
  {name:'라이트웨이트',range:'61.24kg',icon:'🥊',tip:'스피드와 파워의 조화'},
  {name:'슈퍼라이트',range:'63.5kg',icon:'🥊',tip:'프레셔 파이팅과 전진 압박'},
  {name:'웰터웨이트',range:'66.68kg',icon:'🥊',tip:'전반적인 기술 승부 가능'},
  {name:'슈퍼웰터',range:'69.85kg',icon:'🥊',tip:'파워와 스피드 모두 필요'},
  {name:'미들웨이트',range:'72.57kg',icon:'🥊',tip:'강력한 펀치력과 방어 기술'},
  {name:'슈퍼미들',range:'76.2kg',icon:'🥊',tip:'압도적인 체격과 방어력'},
  {name:'라이트헤비',range:'79.38kg',icon:'🥊',tip:'파워 펀치와 장거리 활용'},
  {name:'크루저웨이트',range:'90.72kg',icon:'🥊',tip:'조거한 파워와 내구력'},
  {name:'헤비웨임트',range:'90.72kg+',icon:'🥊',tip:'압도적인 파워와 클린치 방어'}
];

// ===== HIIT PRESETS =====
var HIIT_PRESETS = [
  {name:'타바타',work:20,rest:10,rounds:8,sets:1,desc:'20초 운동 / 10초 휴식 × 8'},
  {name:'클래식',work:60,rest:30,rounds:5,sets:1,desc:'1분 운동 / 30초 휴식 × 5'},
  {name:'복싱 라운드',work:180,rest:60,rounds:3,sets:1,desc:'3분 운동 / 1분 휴식 × 3'},
  {name:'스피드',work:15,rest:15,rounds:10,sets:1,desc:'15초 운동 / 15초 휴식 × 10'},
  {name:'파워',work:45,rest:15,rounds:6,sets:1,desc:'45초 운동 / 15초 휴식 × 6'},
  {name:'지구력',work:120,rest:30,rounds:4,sets:1,desc:'2분 운동 / 30초 휴식 × 4'},
  {name:'프로 12R',work:180,rest:60,rounds:12,sets:1,desc:'3분 라운드 / 1분 휴식 × 12'},
  {name:'번아웃',work:30,rest:10,rounds:8,sets:2,desc:'30초 운동 / 10초 휴식 × 8 × 2세트'}
];

// ===== TECHNIQUES =====
var TECHNIQUES = [
  {name:'직선 잡',cat:'punch',icon:'🥊',desc:'앞손으로 빠르게 내뿿는 기본기',detail:'어깨를 고정하고 팔꿈치를 완전히 펴서 내뿿습니다. 손목을 고정하고 타격 순간 주먹을 쥐세요. 빠른 복귀가 핵심입니다.'},
  {name:'파워 크로스',cat:'punch',icon:'💥',desc:'뒷손 파워펀치, 엉덩이 회전',detail:'뒷발에서 시작해 엉덩이를 회전시키며 뒷손을 직선으로 내뿿습니다. 몸 전체의 회전력을 실으세요.'},
  {name:'리드 훅',cat:'punch',icon:'💪',desc:'앞손 훅, 90도 팔 각도',detail:'팔을 90도로 굽히고 몸통의 회전으로 펀치합니다. 타격 순간 손목을 고정하고 팔꿈치를 단단히 유지하세요.'},
  {name:'리어 어퍼캿',cat:'punch',icon:'⚡',desc:'무릅 타격용 어퍼캿',detail:'무릅을 굽히고 아래에서 위로 치고 올라갑니다. 다리 힘을 이용해 파워를 높이세요. 특히 근거리에서 효과적입니다.'},
  {name:'슬립',cat:'defense',icon:'🛡️',desc:'머리를 옆으로 빼서 회피',detail:'무릇을 약간 굽히고 머리를 옆으로 살짝 움직여 펀치를 피합니다. 피한 직후 바로 카운터를 날리세요.'},
  {name:'롤',cat:'defense',icon:'🔄',desc:'몸통을 굽혀 회피 후 반격',detail:'무릇을 굽히고 몸통을 옆으로 회전시켜 펀치를 피합니다. U자 모양으로 아래로 빠져 반대쪽으로 올라오세요.'},
  {name:'피카부 스타일',cat:'defense',icon:'🙌',desc:'양손을 모아 얼굴을 방어',detail:'양손을 얼굴 옆에 모아고 머리를 약간 숙입니다. 틈 사이로 보면서 아래에서 어퍼캿과 훅을 날리세요. 타이슨 스타일.'},
  {name:'피봇',cat:'footwork',icon:'👟',desc:'발을 축으로 회전하는 발놓림',detail:'앞발을 축으로 하고 45도씩 회전하여 각도를 바꿔 공격합니다. 상대의 야한 부분을 노출시키는 핵심 발놓림입니다.'},
  {name:'레터럴 무브',cat:'footwork',icon:'⇆',desc:'좌우 볁걸음으로 거리 조절',detail:'앞발을 먼저 옮기고 뒤발이 따라갑니다. 상대의 공격 범위에서 벗어나거나 각도를 바꿔 공격할 때 사용하세요.'},
  {name:'1-2 콤보',cat:'combo',icon:'🔥',desc:'잡-크로스 기본 콤보',detail:'잡으로 상대의 가드를 열고 빠르게 크로스를 연결합니다. 복싱의 가장 기본적이고 효과적인 콤비네이션입니다.'},
  {name:'1-2-3 콤보',cat:'combo',icon:'💥',desc:'잡-크로스-훅 3타 콤보',detail:'잡과 크로스 후 리드 훅을 연결합니다. 훅은 몸통 회전으로 파워를 싣고, 상대의 측면을 노리세요.'},
  {name:'바디 콤보',cat:'combo',icon:'💪',desc:'두번잡-바디훅-어퍼',detail:'잡으로 가드를 올리고 바디훅으로 갈비뼈를 공격, 이어 어퍼캿으로 마무리합니다. 근접전에 효과적입니다.'}
];

// ===== BODY SHOT ZONES =====
var BODY_ZONES = [
  {name:'머리',x:0.5,y:0.08,r:0.06,points:5,color:'#e74c3c'},
  {name:'왼쪽 관자놀이',x:0.35,y:0.08,r:0.035,points:8,color:'#f39c12'},
  {name:'오른쪽 관자놀이',x:0.65,y:0.08,r:0.035,points:8,color:'#f39c12'},
  {name:'턴',x:0.5,y:0.14,r:0.03,points:10,color:'#e74c3c'},
  {name:'왼쪽 갈비뼈',x:0.3,y:0.35,r:0.05,points:7,color:'#3498db'},
  {name:'오른쪽 갈비뼈',x:0.7,y:0.35,r:0.05,points:7,color:'#3498db'},
  {name:'명치',x:0.5,y:0.32,r:0.04,points:9,color:'#e74c3c'},
  {name:'간',x:0.35,y:0.42,r:0.05,points:8,color:'#9b59b6'},
  {name:'위장',x:0.5,y:0.42,r:0.04,points:6,color:'#2ecc71'},
  {name:'왼쪽 팔',x:0.18,y:0.3,r:0.04,points:3,color:'#1abc9c'},
  {name:'오른쪽 팔',x:0.82,y:0.3,r:0.04,points:3,color:'#1abc9c'},
  {name:'복부',x:0.5,y:0.52,r:0.06,points:5,color:'#2ecc71'}
];

// ===== QUIZ V14 =====
var QUIZ_V14 = [
  {q:'펀치의 정확도를 높이는 가장 중요한 요소는?',a:['속도','파워','폼(자세)','미끼'],c:2},
  {q:'타바타 운동 프로토콜의 운동/휴식 비율은?',a:['30/15초','20/10초','45/15초','60/20초'],c:1},
  {q:'피카부 스타일을 처음 유명하게 만든 복서는?',a:['모하메드 알리','마이크 타이슨','플로이드 메이웨더','매니 파키아오'],c:1},
  {q:'복싱에서 펀치의 파워가 주로 나오는 부위는?',a:['팔근육','어깨','엉덩이/복부','손목'],c:2},
  {q:'슬립 방어 기술의 핵심은?',a:['무릇을 굽히고 머리를 옆으로','뿔리 물러나기','가드 올리기','팀 맞춤'],c:0},
  {q:'프로 복싱 한 라운드의 기본 시간은?',a:['2분','3분','5분','1분'],c:1},
  {q:'체급 중 가장 무거운 체급은?',a:['크루저웨이트','헤비웨임트','슈퍼미들','라이트헤비'],c:1},
  {q:'바디샷에서 가장 위험한 타격 부위는?',a:['복부','간','명치','갈비뼈'],c:2},
  {q:'반사신경 테스트에서 S등급 기준 반응시간은?',a:['300ms 이하','200ms 이하','500ms 이하','150ms 이하'],c:1},
  {q:'펀치 파워를 높이는 가장 효과적인 방법은?',a:['팔 근육 강화','무거운 글러브 사용','엉덩이 회전력 활용','속도 증가'],c:2},
  {q:'코치 AI 분석에서 측정하는 6축이 아닌 것은?',a:['파워','스피드','정확도','나이'],c:3},
  {q:'복싱에서 피봇의 주요 목적은?',a:['각도 변경으로 공격 위치 확보','방어 자세 강화','체력 절약','상대 교란'],c:0},
  {q:'HIIT 훈련의 핵심 효과는?',a:['근력 증가','유산소+무산소 동시 훈련','유연성 향상','근지구력만 향상'],c:1},
  {q:'복싱 기술 연구실에서 기술을 마스터하는 기준은?',a:['이론 이해','학습+연습+이해 모두','실전 적용','무제한 반복'],c:1},
  {q:'바디샷 존 맵에서 가장 높은 포인트를 주는 부위는?',a:['머리','턴','명치','간'],c:2}
];

// ===== V14 ACHIEVEMENTS =====
var ACHIEVEMENTS_V14 = [
  {id:'accuracy_first',name:'첫 명중',icon:'🎯',desc:'정확도 트레이닝 첫 히트',check:function(){return v14.accuracy.totalHits>=1}},
  {id:'accuracy_50',name:'실버 명사',icon:'🎯',desc:'50회 명중 달성',check:function(){return v14.accuracy.totalHits>=50}},
  {id:'accuracy_streak',name:'연속 명중',icon:'⭐',desc:'10회 연속 명중',check:function(){return v14.accuracy.bestStreak>=10}},
  {id:'hiit_first',name:'HIIT 입문',icon:'⏱️',desc:'첫 HIIT 워크아웃 완료',check:function(){return v14.hiit.completed>=1}},
  {id:'hiit_10',name:'HIIT 전사',icon:'🔥',desc:'HIIT 10회 완료',check:function(){return v14.hiit.completed>=10}},
  {id:'tech_student',name:'기술 학생',icon:'📖',desc:'기술 6개 이상 학습',check:function(){return v14.techniques.viewed.length>=6}},
  {id:'tech_master',name:'기술 마스터',icon:'🌟',desc:'모든 기술 마스터',check:function(){return v14.techniques.mastered.length>=12}},
  {id:'reflex_fast',name:'번개 반사',icon:'⚡',desc:'반응시간 200ms 이하',check:function(){return v14.reflex.bestTime<=200}},
  {id:'reflex_10',name:'반사신경 프로',icon:'🧠',desc:'반사신경 테스트 10회',check:function(){return v14.reflex.totalTests>=10}},
  {id:'bodyshot_pro',name:'보디샷 프로',icon:'🥊',desc:'보디샷 100회 적중',check:function(){return v14.bodyShot.totalShots>=100}},
  {id:'weight_explorer',name:'체급 탐험가',icon:'🏅',desc:'체급 가이드 8개 이상 조회',check:function(){return v14.weightClass.viewed.length>=8}},
  {id:'v14_explorer',name:'v14 탐험가',icon:'🚀',desc:'v14 신기능 전체 체험',check:function(){return v14.accuracy.totalHits>0&&v14.hiit.completed>0&&v14.reflex.totalTests>0&&v14.bodyShot.totalShots>0}}
];

// ===== BUILD ALL SECTIONS =====
function buildV14(){
  injectV14CSS();
  var container = document.querySelector('.container');
  if(!container) return;
  var footer = document.querySelector('.footer');

  // 1. Punch Accuracy Trainer
  var accSec = el('section','v14-section','v14-accuracy');
  accSec.innerHTML = '<h2 class="v14-title"><span class="emoji">🎯</span> 펀치 정확도 트레이너</h2>\
<div class="v14-card">\
<div class="v14-stat-row">\
<div class="v14-stat"><div class="v14-stat-val" id="v14AccHits">'+v14.accuracy.totalHits+'</div><div class="v14-stat-lbl">명중</div></div>\
<div class="v14-stat"><div class="v14-stat-val" id="v14AccRate">0%</div><div class="v14-stat-lbl">명중률</div></div>\
<div class="v14-stat"><div class="v14-stat-val" id="v14AccStreak">'+v14.accuracy.bestStreak+'</div><div class="v14-stat-lbl">최고연속</div></div>\
</div>\
<canvas id="v14AccCanvas" class="v14-canvas" width="480" height="400"></canvas>\
<div style="text-align:center;margin:8px 0">\
<button class="v14-btn primary" id="v14AccStart">🎯 트레이닝 시작</button>\
<button class="v14-btn" id="v14AccReset">초기화</button>\
</div>\
</div>';
  container.insertBefore(accSec, footer);

  // 2. Body Shot Zone Map
  var bodySec = el('section','v14-section','v14-bodyshot');
  bodySec.innerHTML = '<h2 class="v14-title"><span class="emoji">🥊</span> 보디샷 존 맵</h2>\
<div class="v14-card">\
<div class="v14-stat-row">\
<div class="v14-stat"><div class="v14-stat-val" id="v14BodyTotal">'+v14.bodyShot.totalShots+'</div><div class="v14-stat-lbl">총샷</div></div>\
<div class="v14-stat"><div class="v14-stat-val" id="v14BodyBest">0</div><div class="v14-stat-lbl">최고점</div></div>\
</div>\
<canvas id="v14BodyCanvas" class="bodyshot-canvas" width="380" height="500"></canvas>\
<div style="text-align:center;font-size:11px;color:var(--text-muted);margin-top:6px">타격 부위를 클릭/터치하세요</div>\
</div>';
  container.insertBefore(bodySec, footer);

  // 3. Weight Class Guide
  var wcSec = el('section','v14-section','v14-weight');
  var wcHTML = '<h2 class="v14-title"><span class="emoji">🏅</span> 체급 가이드</h2><div class="v14-card"><div class="wc-grid">';
  WEIGHT_CLASSES.forEach(function(wc,i){
    var sel = v14.weightClass.selected === wc.name ? ' selected' : '';
    wcHTML += '<div class="wc-card'+sel+'" data-wc="'+i+'"><div class="wc-icon">'+wc.icon+'</div>\
<div class="wc-name">'+wc.name+'</div><div class="wc-range">'+wc.range+'</div></div>';
  });
  wcHTML += '</div><div id="v14WcDetail" style="margin-top:12px;padding:12px;background:var(--surface);border-radius:12px;display:none"></div></div>';
  wcSec.innerHTML = wcHTML;
  wcSec.className = 'v14-section';
  wcSec.id = 'v14-weight';
  container.insertBefore(wcSec, footer);

  // 4. HIIT Interval Timer
  var hiitSec = el('section','v14-section','v14-hiit');
  var presHTML = '';
  HIIT_PRESETS.forEach(function(p,i){
    presHTML += '<div class="hiit-preset" data-hiit="'+i+'"><div style="font-size:14px;font-weight:800">'+p.name+'</div><div style="font-size:10px;color:var(--text-muted);margin-top:2px">'+p.desc+'</div></div>';
  });
  hiitSec.innerHTML = '<h2 class="v14-title"><span class="emoji">⏱️</span> HIIT 인터벌 타이머</h2>\
<div class="v14-card">\
<div class="hiit-presets">'+presHTML+'</div>\
<div class="hiit-display" id="v14HiitDisplay" style="display:none">\
<div class="hiit-phase" id="v14HiitPhase">준비</div>\
<div class="hiit-timer" id="v14HiitTimer">00:00</div>\
<div style="font-size:12px;color:var(--text-dim);margin:4px 0">라운드 <span id="v14HiitRound">0</span>/<span id="v14HiitTotalR">0</span></div>\
<div class="hiit-progress"><div class="hiit-progress-fill" id="v14HiitProgress" style="width:0%;background:var(--accent)"></div></div>\
<div style="margin:10px 0">\
<button class="v14-btn primary" id="v14HiitStart">▶ 시작</button>\
<button class="v14-btn" id="v14HiitStop" style="display:none">■ 정지</button>\
</div>\
</div>\
<div class="v14-stat-row">\
<div class="v14-stat"><div class="v14-stat-val" id="v14HiitDone">'+v14.hiit.completed+'</div><div class="v14-stat-lbl">완료</div></div>\
<div class="v14-stat"><div class="v14-stat-val" id="v14HiitTime">'+Math.round(v14.hiit.totalTime/60)+'</div><div class="v14-stat-lbl">총시간(분)</div></div>\
</div>\
</div>';
  container.insertBefore(hiitSec, footer);

  // 5. Fight Technique Lab
  var techSec = el('section','v14-section','v14-tech');
  var techHTML = '<h2 class="v14-title"><span class="emoji">📖</span> 복싱 기술 연구실</h2><div class="v14-card">\
<div style="text-align:center;font-size:12px;color:var(--text-dim);margin-bottom:12px">\
학습: <span id="v14TechViewed">'+v14.techniques.viewed.length+'</span>/12 | 마스터: <span id="v14TechMastered">'+v14.techniques.mastered.length+'</span>/12</div>\
<div class="tech-grid">';
  TECHNIQUES.forEach(function(tech,i){
    var viewed = v14.techniques.viewed.indexOf(tech.name) !== -1;
    var mastered = v14.techniques.mastered.indexOf(tech.name) !== -1;
    var cls = mastered ? 'mastered' : (viewed ? 'viewed' : '');
    techHTML += '<div class="tech-card '+cls+'" data-tech="'+i+'"><div class="tech-icon">'+tech.icon+'</div>\
<div class="tech-name">'+(mastered?'⭐ ':'')+tech.name+'</div>\
<div class="tech-cat '+tech.cat+'">'+({punch:'펀치',defense:'방어',footwork:'발놓림',combo:'콤보'}[tech.cat])+'</div>\
<div class="tech-desc">'+tech.desc+'</div>\
<div class="tech-detail"><p>'+tech.detail+'</p>'+(mastered?'<div style="color:var(--gold);font-size:11px;font-weight:700;margin-top:6px">⭐ 마스터 완료!</div>':'<button class="tech-master-btn" data-mtech="'+i+'">⭐ 마스터 완료</button>')+'</div></div>';
  });
  techHTML += '</div></div>';
  techSec.innerHTML = techHTML;
  container.insertBefore(techSec, footer);

  // 6. Reflex Training
  var reflexSec = el('section','v14-section','v14-reflex');
  reflexSec.innerHTML = '<h2 class="v14-title"><span class="emoji">⚡</span> 반사신경 트레이닝</h2>\
<div class="v14-card">\
<div class="v14-stat-row">\
<div class="v14-stat"><div class="v14-stat-val" id="v14ReflexBest">'+(v14.reflex.bestTime<9999?v14.reflex.bestTime+'ms':'-')+'</div><div class="v14-stat-lbl">최고기록</div></div>\
<div class="v14-stat"><div class="v14-stat-val" id="v14ReflexAvg">'+(v14.reflex.totalTests>0?Math.round(v14.reflex.avgTime)+'ms':'-')+'</div><div class="v14-stat-lbl">평균</div></div>\
<div class="v14-stat"><div class="v14-stat-val" id="v14ReflexCount">'+v14.reflex.totalTests+'</div><div class="v14-stat-lbl">테스트</div></div>\
</div>\
<canvas id="v14ReflexCanvas" class="reflex-canvas" width="480" height="400"></canvas>\
<div style="text-align:center;margin:8px 0">\
<button class="v14-btn primary" id="v14ReflexStart">⚡ 테스트 시작</button>\
</div>\
</div>';
  container.insertBefore(reflexSec, footer);

  // 7. Punch Power Trend
  var powerSec = el('section','v14-section','v14-power');
  powerSec.innerHTML = '<h2 class="v14-title"><span class="emoji">💪</span> 펀치 파워 추이</h2>\
<div class="v14-card">\
<canvas id="v14PowerCanvas" class="v14-canvas" width="480" height="300" style="height:300px"></canvas>\
<div style="text-align:center;margin:10px 0">\
<button class="v14-btn" id="v14PowerLog">💪 파워 기록하기</button>\
</div>\
<div style="font-size:11px;color:var(--text-muted);text-align:center">최근 20회 파워 점수 추이</div>\
</div>';
  container.insertBefore(powerSec, footer);

  // 8. Coach AI Analysis
  var coachSec = el('section','v14-section','v14-coach');
  coachSec.innerHTML = '<h2 class="v14-title"><span class="emoji">🧑‍🏫</span> 코치 AI 분석</h2>\
<div class="v14-card">\
<canvas id="v14CoachCanvas" class="coach-canvas" width="420" height="420"></canvas>\
<div class="coach-tips" id="v14CoachTips"></div>\
<div style="text-align:center;margin:8px 0">\
<button class="v14-btn primary" id="v14CoachRefresh">🔄 분석 갱신</button>\
</div>\
</div>';
  container.insertBefore(coachSec, footer);

  // Quiz V14 Button
  var quizSec = el('section','v14-section','v14-quiz-sec');
  quizSec.innerHTML = '<h2 class="v14-title"><span class="emoji">❓</span> 복싱 펀치 퀴즈 v4</h2>\
<div class="v14-card" style="text-align:center">\
<p style="font-size:13px;color:var(--text-dim);margin-bottom:12px">15문항 · 정확도/체급/HIIT/기술/반사신경/보디샷</p>\
<button class="v14-btn primary" id="v14QuizStart">❓ 퀴즈 시작 (15문)</button>\
</div>';
  container.insertBefore(quizSec, footer);

  // Quiz Modal
  var qm = el('div','v14-quiz-modal','v14QuizModal');
  qm.innerHTML = '<div class="v14-quiz-panel" id="v14QuizPanel"></div>';
  document.body.appendChild(qm);

  // V14 Achievements
  var achSec = el('section','v14-section','v14-achievements');
  achSec.innerHTML = '<h2 class="v14-title"><span class="emoji">🏆</span> v14 업적 ('+countV14Ach()+'/'+ACHIEVEMENTS_V14.length+')</h2>\
<div class="badge-grid" id="v14AchGrid"></div>';
  container.insertBefore(achSec, footer);
  renderV14Ach();

  // FAB Bar
  var fab = el('div','v14-fab-bar','v14FabBar');
  fab.innerHTML = '\
<div class="v14-fab" data-goto="v14-accuracy"><span class="fab-icon">🎯</span>정확도</div>\
<div class="v14-fab" data-goto="v14-bodyshot"><span class="fab-icon">🥊</span>보디샷</div>\
<div class="v14-fab" data-goto="v14-weight"><span class="fab-icon">🏅</span>체급</div>\
<div class="v14-fab" data-goto="v14-hiit"><span class="fab-icon">⏱</span>HIIT</div>\
<div class="v14-fab" data-goto="v14-tech"><span class="fab-icon">📖</span>기술</div>\
<div class="v14-fab" data-goto="v14-reflex"><span class="fab-icon">⚡</span>반사신경</div>\
<div class="v14-fab" data-goto="v14-power"><span class="fab-icon">💪</span>파워</div>\
<div class="v14-fab" data-goto="v14-coach"><span class="fab-icon">🧑‍🏫</span>코치</div>';
  document.body.appendChild(fab);

  // Init all
  initAccuracy();
  initBodyShot();
  initWeightClass();
  initHIIT();
  initTechniques();
  initReflex();
  initPowerTrend();
  initCoachAI();
  initQuizV14();
  initFAB();
  initKeyboard();
  updateAccStats();
}

function el(tag, cls, id){
  var e = document.createElement(tag);
  if(cls) e.className = cls;
  if(id) e.id = id;
  return e;
}

// ===== 1. PUNCH ACCURACY TRAINER =====
var accActive = false, accTargets = [], accHitStreak = 0, accTimer = null, accTimeLeft = 30;
var accSessionHits = 0, accSessionMisses = 0;

function initAccuracy(){
  var canvas = document.getElementById('v14AccCanvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  drawAccuracyIdle(ctx, canvas);

  canvas.addEventListener('click', function(e){
    if(!accActive) return;
    var rect = canvas.getBoundingClientRect();
    var x = (e.clientX - rect.left) * (canvas.width / rect.width);
    var y = (e.clientY - rect.top) * (canvas.height / rect.height);
    checkAccuracyHit(ctx, canvas, x, y);
  });
  canvas.addEventListener('touchstart', function(e){
    if(!accActive) return;
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var touch = e.touches[0];
    var x = (touch.clientX - rect.left) * (canvas.width / rect.width);
    var y = (touch.clientY - rect.top) * (canvas.height / rect.height);
    checkAccuracyHit(ctx, canvas, x, y);
  },{passive:false});

  document.getElementById('v14AccStart').addEventListener('click', function(){
    startAccuracy(ctx, canvas);
  });
  document.getElementById('v14AccReset').addEventListener('click', function(){
    v14.accuracy = {totalHits:0,totalMisses:0,bestStreak:0,zoneHits:{}};
    saveV14(v14); updateAccStats(); drawAccuracyIdle(ctx, canvas);
  });
}

function drawAccuracyIdle(ctx, c){
  ctx.clearRect(0,0,c.width,c.height);
  var isDark = !document.body.getAttribute('data-theme') || document.body.getAttribute('data-theme') === 'dark';
  ctx.fillStyle = isDark ? '#1a1a2e' : '#e8e8ec';
  ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle = isDark ? '#8a8a9e' : '#555';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎯 시작 버튼을 누르고 타겟을 맞추세요',c.width/2,c.height/2);
}

function startAccuracy(ctx, c){
  accActive = true; accTargets = []; accHitStreak = 0; accTimeLeft = 30;
  accSessionHits = 0; accSessionMisses = 0;
  spawnTarget(c);
  accTimer = setInterval(function(){
    accTimeLeft--;
    if(accTimeLeft <= 0){
      endAccuracy(ctx, c);
      return;
    }
    drawAccuracy(ctx, c);
  }, 1000);
  drawAccuracy(ctx, c);
}

function spawnTarget(c){
  accTargets = [{
    x: 40 + Math.random() * (c.width - 80),
    y: 40 + Math.random() * (c.height - 80),
    r: 20 + Math.random() * 15,
    born: Date.now()
  }];
}

function drawAccuracy(ctx, c){
  var isDark = !document.body.getAttribute('data-theme') || document.body.getAttribute('data-theme') === 'dark';
  ctx.clearRect(0,0,c.width,c.height);
  ctx.fillStyle = isDark ? '#1a1a2e' : '#e8e8ec';
  ctx.fillRect(0,0,c.width,c.height);

  accTargets.forEach(function(t){
    var age = (Date.now() - t.born) / 1000;
    var alpha = Math.max(0.3, 1 - age / 3);
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.r, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,68,68,' + alpha + ')';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.r * 0.5, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,215,0,' + alpha + ')';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.r * 0.2, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
    ctx.fill();
  });

  ctx.fillStyle = isDark ? '#f0f0f0' : '#1a1a2e';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('⏱ ' + accTimeLeft + 's', 15, 30);
  ctx.textAlign = 'right';
  ctx.fillText('🎯 ' + accSessionHits + ' | ❌ ' + accSessionMisses, c.width - 15, 30);
  ctx.textAlign = 'center';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#FFD700';
  ctx.fillText('🔥 x' + accHitStreak, c.width/2, 30);
}

function checkAccuracyHit(ctx, c, x, y){
  var hit = false;
  accTargets.forEach(function(t){
    var dist = Math.sqrt((x-t.x)*(x-t.x)+(y-t.y)*(y-t.y));
    if(dist <= t.r){
      hit = true;
      accSessionHits++;
      accHitStreak++;
      v14.accuracy.totalHits++;
      if(accHitStreak > v14.accuracy.bestStreak) v14.accuracy.bestStreak = accHitStreak;
      playSFX14('accuracy_hit');
    }
  });
  if(!hit){
    accSessionMisses++;
    accHitStreak = 0;
    v14.accuracy.totalMisses++;
    playSFX14('accuracy_miss');
  }
  spawnTarget(c);
  drawAccuracy(ctx, c);
  updateAccStats();
  saveV14(v14);
}

function endAccuracy(ctx, c){
  accActive = false;
  clearInterval(accTimer);
  var isDark = !document.body.getAttribute('data-theme') || document.body.getAttribute('data-theme') === 'dark';
  ctx.clearRect(0,0,c.width,c.height);
  ctx.fillStyle = isDark ? '#1a1a2e' : '#e8e8ec';
  ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle = isDark ? '#f0f0f0' : '#1a1a2e';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎯 결과', c.width/2, 80);
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('명중: ' + accSessionHits + ' | 실패: ' + accSessionMisses, c.width/2, 130);
  var rate = accSessionHits + accSessionMisses > 0 ? Math.round(accSessionHits/(accSessionHits+accSessionMisses)*100) : 0;
  ctx.fillText('명중률: ' + rate + '%', c.width/2, 170);
  ctx.fillStyle = '#FFD700';
  ctx.fillText('최고 연속: ' + v14.accuracy.bestStreak, c.width/2, 210);
  checkV14Ach();
  updateAccStats();
}

function updateAccStats(){
  var h = document.getElementById('v14AccHits');
  var r = document.getElementById('v14AccRate');
  var s = document.getElementById('v14AccStreak');
  if(h) h.textContent = v14.accuracy.totalHits;
  if(s) s.textContent = v14.accuracy.bestStreak;
  var total = v14.accuracy.totalHits + v14.accuracy.totalMisses;
  if(r) r.textContent = total > 0 ? Math.round(v14.accuracy.totalHits/total*100)+'%' : '0%';
}

// ===== 2. BODY SHOT ZONE MAP =====
function initBodyShot(){
  var canvas = document.getElementById('v14BodyCanvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  drawBodyMap(ctx, canvas);

  canvas.addEventListener('click', function(e){
    var rect = canvas.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width;
    var y = (e.clientY - rect.top) / rect.height;
    hitBodyZone(ctx, canvas, x, y);
  });
  canvas.addEventListener('touchstart', function(e){
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var touch = e.touches[0];
    var x = (touch.clientX - rect.left) / rect.width;
    var y = (touch.clientY - rect.top) / rect.height;
    hitBodyZone(ctx, canvas, x, y);
  },{passive:false});
}

function drawBodyMap(ctx, c){
  var isDark = !document.body.getAttribute('data-theme') || document.body.getAttribute('data-theme') === 'dark';
  ctx.clearRect(0,0,c.width,c.height);
  ctx.fillStyle = isDark ? '#1a1a2e' : '#e8e8ec';
  ctx.fillRect(0,0,c.width,c.height);

  // Body silhouette
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  ctx.beginPath();
  ctx.ellipse(c.width*0.5, c.height*0.08, c.width*0.08, c.height*0.06, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.fillRect(c.width*0.38, c.height*0.14, c.width*0.24, c.height*0.35);
  ctx.fillRect(c.width*0.15, c.height*0.16, c.width*0.23, c.height*0.12);
  ctx.fillRect(c.width*0.62, c.height*0.16, c.width*0.23, c.height*0.12);
  ctx.fillRect(c.width*0.4, c.height*0.49, c.width*0.08, c.height*0.35);
  ctx.fillRect(c.width*0.52, c.height*0.49, c.width*0.08, c.height*0.35);

  // Zones
  BODY_ZONES.forEach(function(zone){
    var cx = zone.x * c.width;
    var cy = zone.y * c.height;
    var r = zone.r * c.width;
    var hits = v14.bodyShot.zoneHits[zone.name] || 0;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.fillStyle = zone.color + '44';
    ctx.fill();
    ctx.strokeStyle = zone.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    if(hits > 0){
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.6, 0, Math.PI*2);
      ctx.fillStyle = zone.color + '88';
      ctx.fill();
    }

    ctx.fillStyle = isDark ? '#f0f0f0' : '#1a1a2e';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(zone.name, cx, cy - r - 4);
    if(hits > 0){
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(hits + '', cx, cy + 4);
    }
    ctx.font = '8px sans-serif';
    ctx.fillStyle = zone.color;
    ctx.fillText(zone.points + 'pt', cx, cy + r + 10);
  });
}

function hitBodyZone(ctx, c, nx, ny){
  var hitZone = null;
  BODY_ZONES.forEach(function(zone){
    var dist = Math.sqrt((nx-zone.x)*(nx-zone.x)+(ny-zone.y)*(ny-zone.y));
    if(dist <= zone.r * 1.2){
      hitZone = zone;
    }
  });
  if(hitZone){
    if(!v14.bodyShot.zoneHits[hitZone.name]) v14.bodyShot.zoneHits[hitZone.name] = 0;
    v14.bodyShot.zoneHits[hitZone.name]++;
    v14.bodyShot.totalShots++;
    playSFX14('bodyshot');
    saveV14(v14);
    drawBodyMap(ctx, c);
    document.getElementById('v14BodyTotal').textContent = v14.bodyShot.totalShots;
    var maxHits = 0;
    for(var k in v14.bodyShot.zoneHits){ if(v14.bodyShot.zoneHits[k]>maxHits) maxHits=v14.bodyShot.zoneHits[k]; }
    document.getElementById('v14BodyBest').textContent = maxHits;
    checkV14Ach();
  }
}

// ===== 3. WEIGHT CLASS GUIDE =====
function initWeightClass(){
  var cards = document.querySelectorAll('.wc-card');
  cards.forEach(function(card){
    card.addEventListener('click', function(){
      var idx = parseInt(this.getAttribute('data-wc'));
      var wc = WEIGHT_CLASSES[idx];
      playSFX14('weight_view');
      if(v14.weightClass.viewed.indexOf(wc.name)===-1){
        v14.weightClass.viewed.push(wc.name);
      }
      v14.weightClass.selected = wc.name;
      saveV14(v14);

      cards.forEach(function(c){ c.classList.remove('selected'); });
      this.classList.add('selected');

      var detail = document.getElementById('v14WcDetail');
      detail.style.display = 'block';
      detail.innerHTML = '<div style="font-size:16px;font-weight:800;margin-bottom:8px">'+wc.icon+' '+wc.name+'</div>\
<div style="font-size:13px;color:var(--text-dim);margin-bottom:6px">몬무게 범위: '+wc.range+'</div>\
<div style="font-size:12px;color:var(--text);line-height:1.6">💡 트레이닝 팁: '+wc.tip+'</div>';
      checkV14Ach();
    });
  });
}

// ===== 4. HIIT INTERVAL TIMER =====
var hiitInterval = null, hiitPreset = null, hiitState = null;

function initHIIT(){
  var presets = document.querySelectorAll('.hiit-preset');
  presets.forEach(function(p){
    p.addEventListener('click', function(){
      var idx = parseInt(this.getAttribute('data-hiit'));
      hiitPreset = HIIT_PRESETS[idx];
      presets.forEach(function(pp){ pp.classList.remove('active'); });
      this.classList.add('active');
      document.getElementById('v14HiitDisplay').style.display = 'block';
      document.getElementById('v14HiitTotalR').textContent = hiitPreset.rounds * hiitPreset.sets;
      resetHIIT();
    });
  });

  document.getElementById('v14HiitStart').addEventListener('click', startHIIT);
  document.getElementById('v14HiitStop').addEventListener('click', stopHIIT);
}

function resetHIIT(){
  if(hiitInterval) clearInterval(hiitInterval);
  hiitState = {round:0,set:1,phase:'ready',timeLeft:0,totalElapsed:0};
  document.getElementById('v14HiitPhase').textContent = '준비';
  document.getElementById('v14HiitPhase').className = 'hiit-phase';
  document.getElementById('v14HiitTimer').textContent = '00:00';
  document.getElementById('v14HiitRound').textContent = '0';
  document.getElementById('v14HiitProgress').style.width = '0%';
  document.getElementById('v14HiitStart').style.display = '';
  document.getElementById('v14HiitStop').style.display = 'none';
}

function startHIIT(){
  if(!hiitPreset) return;
  hiitState = {round:1,set:1,phase:'work',timeLeft:hiitPreset.work,totalElapsed:0};
  document.getElementById('v14HiitStart').style.display = 'none';
  document.getElementById('v14HiitStop').style.display = '';
  playSFX14('hiit_bell');

  hiitInterval = setInterval(function(){
    hiitState.timeLeft--;
    hiitState.totalElapsed++;

    if(hiitState.timeLeft <= 0){
      if(hiitState.phase === 'work'){
        if(hiitState.round >= hiitPreset.rounds){
          if(hiitState.set >= hiitPreset.sets){
            completeHIIT();
            return;
          }
          hiitState.set++;
          hiitState.round = 1;
        } else {
          hiitState.round++;
        }
        hiitState.phase = 'rest';
        hiitState.timeLeft = hiitPreset.rest;
        playSFX14('hiit_rest');
      } else {
        hiitState.phase = 'work';
        hiitState.timeLeft = hiitPreset.work;
        playSFX14('hiit_bell');
      }
    }

    var phaseEl = document.getElementById('v14HiitPhase');
    phaseEl.textContent = hiitState.phase === 'work' ? '운동!' : '휴식';
    phaseEl.className = 'hiit-phase ' + hiitState.phase;

    var m = Math.floor(hiitState.timeLeft/60);
    var s = hiitState.timeLeft%60;
    document.getElementById('v14HiitTimer').textContent = padZ(m)+':'+padZ(s);
    document.getElementById('v14HiitRound').textContent = ((hiitState.set-1)*hiitPreset.rounds + hiitState.round);

    var totalR = hiitPreset.rounds * hiitPreset.sets;
    var currentR = (hiitState.set-1)*hiitPreset.rounds + hiitState.round;
    var pct = Math.round(currentR/totalR*100);
    var fill = document.getElementById('v14HiitProgress');
    fill.style.width = pct+'%';
    fill.style.background = hiitState.phase==='work' ? 'var(--accent)' : 'var(--green)';
  }, 1000);
}

function stopHIIT(){
  resetHIIT();
}

function completeHIIT(){
  clearInterval(hiitInterval);
  v14.hiit.completed++;
  v14.hiit.totalTime += hiitState.totalElapsed;
  if(!v14.hiit.favorite || hiitPreset.name) v14.hiit.favorite = hiitPreset.name;
  saveV14(v14);
  playSFX14('hiit_bell');

  document.getElementById('v14HiitPhase').textContent = '완료!';
  document.getElementById('v14HiitPhase').className = 'hiit-phase';
  document.getElementById('v14HiitTimer').textContent = '🎉';
  document.getElementById('v14HiitStart').style.display = '';
  document.getElementById('v14HiitStop').style.display = 'none';
  document.getElementById('v14HiitDone').textContent = v14.hiit.completed;
  document.getElementById('v14HiitTime').textContent = Math.round(v14.hiit.totalTime/60);
  document.getElementById('v14HiitProgress').style.width = '100%';
  checkV14Ach();
}

// ===== 5. TECHNIQUES =====
function initTechniques(){
  var cards = document.querySelectorAll('.tech-card');
  cards.forEach(function(card){
    card.addEventListener('click', function(e){
      if(e.target.classList.contains('tech-master-btn')) return;
      var idx = parseInt(this.getAttribute('data-tech'));
      var tech = TECHNIQUES[idx];
      this.classList.toggle('open');
      playSFX14('technique');
      if(v14.techniques.viewed.indexOf(tech.name)===-1){
        v14.techniques.viewed.push(tech.name);
        this.classList.add('viewed');
        document.getElementById('v14TechViewed').textContent = v14.techniques.viewed.length;
        saveV14(v14);
      }
      checkV14Ach();
    });
  });

  document.querySelectorAll('.tech-master-btn').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var idx = parseInt(this.getAttribute('data-mtech'));
      var tech = TECHNIQUES[idx];
      if(v14.techniques.mastered.indexOf(tech.name)===-1){
        v14.techniques.mastered.push(tech.name);
        saveV14(v14);
        playSFX14('achieve_v14');
        var card = this.closest('.tech-card');
        card.classList.add('mastered');
        this.outerHTML = '<div style="color:var(--gold);font-size:11px;font-weight:700;margin-top:6px">⭐ 마스터 완료!</div>';
        document.getElementById('v14TechMastered').textContent = v14.techniques.mastered.length;
        var nameEl = card.querySelector('.tech-name');
        if(nameEl && nameEl.textContent.indexOf('⭐') === -1) nameEl.textContent = '⭐ ' + nameEl.textContent;
      }
      checkV14Ach();
    });
  });
}

// ===== 6. REFLEX TRAINING =====
var reflexState = 'idle', reflexStartTime = 0, reflexTimeout = null;

function initReflex(){
  var canvas = document.getElementById('v14ReflexCanvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  drawReflexIdle(ctx, canvas);

  canvas.addEventListener('click', function(){
    if(reflexState === 'waiting'){
      reflexState = 'early';
      clearTimeout(reflexTimeout);
      drawReflexEarly(ctx, canvas);
    } else if(reflexState === 'go'){
      var elapsed = Date.now() - reflexStartTime;
      reflexState = 'done';
      recordReflex(elapsed);
      drawReflexResult(ctx, canvas, elapsed);
    }
  });
  canvas.addEventListener('touchstart', function(e){
    e.preventDefault();
    canvas.click();
  },{passive:false});

  document.getElementById('v14ReflexStart').addEventListener('click', function(){
    startReflex(ctx, canvas);
  });
}

function drawReflexIdle(ctx, c){
  var isDark = !document.body.getAttribute('data-theme') || document.body.getAttribute('data-theme') === 'dark';
  ctx.clearRect(0,0,c.width,c.height);
  ctx.fillStyle = isDark ? '#1a1a2e' : '#e8e8ec';
  ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle = isDark ? '#8a8a9e' : '#555';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ 버튼을 눌러 테스트를 시작하세요', c.width/2, c.height/2);
}

function startReflex(ctx, c){
  reflexState = 'waiting';
  var isDark = !document.body.getAttribute('data-theme') || document.body.getAttribute('data-theme') === 'dark';
  ctx.clearRect(0,0,c.width,c.height);
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('기다리세요...', c.width/2, c.height/2);

  var delay = 1500 + Math.random() * 3000;
  reflexTimeout = setTimeout(function(){
    if(reflexState !== 'waiting') return;
    reflexState = 'go';
    reflexStartTime = Date.now();
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('클릭!', c.width/2, c.height/2);
    playSFX14('reflex_go');
  }, delay);
}

function drawReflexEarly(ctx, c){
  ctx.clearRect(0,0,c.width,c.height);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('너무 빨리 눌렀습니다!', c.width/2, c.height/2 - 15);
  ctx.font = '14px sans-serif';
  ctx.fillText('초록색이 될 때까지 기다리세요', c.width/2, c.height/2 + 20);
  reflexState = 'idle';
}

function drawReflexResult(ctx, c, ms){
  var grade = ms < 150 ? 'SS' : ms < 200 ? 'S' : ms < 300 ? 'A' : ms < 400 ? 'B' : ms < 500 ? 'C' : 'D';
  var gradeColor = {SS:'#FFD700',S:'#22c55e',A:'#3b82f6',B:'#a855f7',C:'#f97316',D:'#e74c3c'}[grade];
  var isDark = !document.body.getAttribute('data-theme') || document.body.getAttribute('data-theme') === 'dark';
  ctx.clearRect(0,0,c.width,c.height);
  ctx.fillStyle = isDark ? '#1a1a2e' : '#e8e8ec';
  ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle = gradeColor;
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(grade, c.width/2, c.height/2 - 40);
  ctx.fillStyle = isDark ? '#f0f0f0' : '#1a1a2e';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText(ms + 'ms', c.width/2, c.height/2 + 20);
  ctx.font = '14px sans-serif';
  ctx.fillStyle = isDark ? '#8a8a9e' : '#555';
  ctx.fillText('최고기록: ' + (v14.reflex.bestTime < 9999 ? v14.reflex.bestTime+'ms' : '-'), c.width/2, c.height/2 + 60);
  playSFX14('reflex_hit');
}

function recordReflex(ms){
  v14.reflex.totalTests++;
  if(ms < v14.reflex.bestTime) v14.reflex.bestTime = ms;
  v14.reflex.scores.push(ms);
  if(v14.reflex.scores.length > 50) v14.reflex.scores = v14.reflex.scores.slice(-50);
  var sum = v14.reflex.scores.reduce(function(a,b){return a+b},0);
  v14.reflex.avgTime = sum / v14.reflex.scores.length;
  saveV14(v14);

  document.getElementById('v14ReflexBest').textContent = v14.reflex.bestTime + 'ms';
  document.getElementById('v14ReflexAvg').textContent = Math.round(v14.reflex.avgTime) + 'ms';
  document.getElementById('v14ReflexCount').textContent = v14.reflex.totalTests;
  checkV14Ach();
}

// ===== 7. PUNCH POWER TREND =====
function initPowerTrend(){
  drawPowerCanvas();
  document.getElementById('v14PowerLog').addEventListener('click', function(){
    var power = 50 + Math.round(Math.random() * 50);
    v14.powerLog.push({date: new Date().toISOString(), power: power});
    if(v14.powerLog.length > 30) v14.powerLog = v14.powerLog.slice(-30);
    saveV14(v14);
    playSFX14('power_log');
    drawPowerCanvas();
  });
}

function drawPowerCanvas(){
  var canvas = document.getElementById('v14PowerCanvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var isDark = !document.body.getAttribute('data-theme') || document.body.getAttribute('data-theme') === 'dark';
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = isDark ? '#1a1a2e' : '#e8e8ec';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  var data = v14.powerLog.slice(-20);
  if(data.length < 2){
    ctx.fillStyle = isDark ? '#8a8a9e' : '#555';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('파워 기록이 2개 이상 필요합니다', canvas.width/2, canvas.height/2);
    return;
  }

  var maxP = Math.max.apply(null, data.map(function(d){return d.power}));
  var minP = Math.min.apply(null, data.map(function(d){return d.power}));
  var range = Math.max(maxP - minP, 10);
  var padT = 40, padB = 40, padL = 50, padR = 20;
  var cw = canvas.width - padL - padR;
  var ch = canvas.height - padT - padB;

  // Grid
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 1;
  for(var i = 0; i <= 4; i++){
    var gy = padT + (ch / 4) * i;
    ctx.beginPath();ctx.moveTo(padL,gy);ctx.lineTo(canvas.width-padR,gy);ctx.stroke();
    ctx.fillStyle = isDark ? '#5a5a6e' : '#888';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxP - (range/4)*i), padL-5, gy+4);
  }

  // Line
  ctx.beginPath();
  data.forEach(function(d, j){
    var x = padL + (cw / (data.length - 1)) * j;
    var y = padT + ch - ((d.power - minP) / range) * ch;
    if(j === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#FF4444';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Fill
  var lastX = padL + cw;
  var lastY = padT + ch - ((data[data.length-1].power - minP) / range) * ch;
  ctx.lineTo(lastX, padT + ch);
  ctx.lineTo(padL, padT + ch);
  ctx.closePath();
  var grad = ctx.createLinearGradient(0, padT, 0, padT + ch);
  grad.addColorStop(0, 'rgba(255,68,68,0.3)');
  grad.addColorStop(1, 'rgba(255,68,68,0.02)');
  ctx.fillStyle = grad;
  ctx.fill();

  // Dots
  data.forEach(function(d, j){
    var x = padL + (cw / (data.length - 1)) * j;
    var y = padT + ch - ((d.power - minP) / range) * ch;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI*2);
    ctx.fillStyle = '#FF4444';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI*2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  });

  // Average line
  var avg = data.reduce(function(s,d){return s+d.power},0) / data.length;
  var avgY = padT + ch - ((avg - minP) / range) * ch;
  ctx.setLineDash([4,4]);
  ctx.beginPath();
  ctx.moveTo(padL, avgY);
  ctx.lineTo(canvas.width-padR, avgY);
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#FFD700';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('평균: ' + Math.round(avg), canvas.width-padR-60, avgY-5);

  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = isDark ? '#f0f0f0' : '#1a1a2e';
  ctx.textAlign = 'center';
  ctx.fillText('펀치 파워 추이 (최근 '+data.length+'회)', canvas.width/2, 25);
}

// ===== 8. COACH AI ANALYSIS =====
function initCoachAI(){
  drawCoachRadar();
  generateCoachTips();
  document.getElementById('v14CoachRefresh').addEventListener('click', function(){
    playSFX14('coach');
    drawCoachRadar();
    generateCoachTips();
  });
}

function getCoachMetrics(){
  var appD = loadAppData() || {};
  var sessions = appD.sessions || [];
  var totalP = appD.totalPunches || 0;
  var totalT = appD.totalTime || 0;
  var totalCombos = appD.totalCombos || 0;
  var streak = appD.bestStreak || 0;

  var power = Math.min(100, Math.round((totalP / 5000) * 100));
  var speed = Math.min(100, totalP > 0 && totalT > 0 ? Math.round((totalP / totalT / 50) * 100) : 0);
  var accuracy = Math.min(100, v14.accuracy.totalHits + v14.accuracy.totalMisses > 0 ?
    Math.round(v14.accuracy.totalHits / (v14.accuracy.totalHits + v14.accuracy.totalMisses) * 100) : 30);
  var defense = Math.min(100, Math.round((v14.reflex.totalTests * 5) + (v14.reflex.bestTime < 300 ? 30 : 0)));
  var stamina = Math.min(100, Math.round((totalT / 300) * 100));
  var technique = Math.min(100, Math.round((v14.techniques.mastered.length / 12) * 100));

  return {power:power,speed:speed,accuracy:accuracy,defense:defense,stamina:stamina,technique:technique};
}

function drawCoachRadar(){
  var canvas = document.getElementById('v14CoachCanvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var isDark = !document.body.getAttribute('data-theme') || document.body.getAttribute('data-theme') === 'dark';
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = isDark ? '#1a1a2e' : '#e8e8ec';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  var metrics = getCoachMetrics();
  var labels = ['파워','스피드','정확도','방어','지구력','기술'];
  var values = [metrics.power,metrics.speed,metrics.accuracy,metrics.defense,metrics.stamina,metrics.technique];
  var cx = canvas.width / 2, cy = canvas.height / 2;
  var maxR = Math.min(cx, cy) - 60;
  var n = 6;

  // Grid
  for(var lvl = 1; lvl <= 5; lvl++){
    var r = maxR * (lvl / 5);
    ctx.beginPath();
    for(var i = 0; i <= n; i++){
      var angle = (Math.PI * 2 / n) * i - Math.PI / 2;
      var px = cx + Math.cos(angle) * r;
      var py = cy + Math.sin(angle) * r;
      if(i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Axes
  for(var i = 0; i < n; i++){
    var angle = (Math.PI * 2 / n) * i - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
    ctx.stroke();

    var lx = cx + Math.cos(angle) * (maxR + 25);
    var ly = cy + Math.sin(angle) * (maxR + 25);
    ctx.fillStyle = isDark ? '#f0f0f0' : '#1a1a2e';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labels[i], lx, ly);
    ctx.fillStyle = isDark ? '#8a8a9e' : '#555';
    ctx.font = '10px sans-serif';
    ctx.fillText(values[i]+'%', lx, ly + 14);
  }

  // Data polygon
  ctx.beginPath();
  for(var i = 0; i < n; i++){
    var angle = (Math.PI * 2 / n) * i - Math.PI / 2;
    var r2 = maxR * (values[i] / 100);
    var px = cx + Math.cos(angle) * r2;
    var py = cy + Math.sin(angle) * r2;
    if(i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,68,68,0.2)';
  ctx.fill();
  ctx.strokeStyle = '#FF4444';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dots
  for(var i = 0; i < n; i++){
    var angle = (Math.PI * 2 / n) * i - Math.PI / 2;
    var r2 = maxR * (values[i] / 100);
    var px = cx + Math.cos(angle) * r2;
    var py = cy + Math.sin(angle) * r2;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI*2);
    ctx.fillStyle = '#FF4444';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI*2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }

  // Overall grade
  var avg = values.reduce(function(s,v){return s+v},0) / n;
  var grade = avg >= 90 ? 'S' : avg >= 70 ? 'A' : avg >= 50 ? 'B' : avg >= 30 ? 'C' : 'D';
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('종합 등급: ' + grade + ' (' + Math.round(avg) + '%)', cx, canvas.height - 15);
}

function generateCoachTips(){
  var metrics = getCoachMetrics();
  var tips = [];
  if(metrics.power < 50) tips.push({icon:'💪',text:'파워가 부족합니다. 엉덩이 회전을 활용한 펀치 연습과 헤비백 훈련을 늘려보세요.'});
  if(metrics.speed < 50) tips.push({icon:'⚡',text:'스피드를 높여보세요. 스피드백 훈련과 빠른 잡-크로스 반복 연습이 효과적입니다.'});
  if(metrics.accuracy < 50) tips.push({icon:'🎯',text:'정확도를 더 단련하세요. 정확도 트레이너를 매일 연습하면 큰 향상을 볼 수 있습니다.'});
  if(metrics.defense < 50) tips.push({icon:'🛡️',text:'방어 능력을 강화하세요. 반사신경 테스트와 슬립/롤 연습을 병행하세요.'});
  if(metrics.stamina < 50) tips.push({icon:'🔥',text:'지구력을 키우세요. HIIT 훈련을 주 3회 이상 실시하면 빠르게 향상됩니다.'});
  if(metrics.technique < 50) tips.push({icon:'📖',text:'기술 연구실에서 더 많은 기술을 학습하고 마스터하세요.'});
  if(tips.length === 0){
    tips.push({icon:'🏆',text:'훌륭합니다! 모든 영역에서 균형 잡힌 실력을 보여주고 있습니다. 계속 유지하세요!'});
  }

  var container = document.getElementById('v14CoachTips');
  container.innerHTML = '';
  tips.forEach(function(tip){
    var div = document.createElement('div');
    div.className = 'coach-tip';
    div.innerHTML = '<span class="coach-tip-icon">'+tip.icon+'</span> '+tip.text;
    container.appendChild(div);
  });
}

// ===== QUIZ V14 =====
var quizV14Idx = 0, quizV14Score = 0, quizV14Answered = false;

function initQuizV14(){
  document.getElementById('v14QuizStart').addEventListener('click', function(){
    quizV14Idx = 0; quizV14Score = 0;
    document.getElementById('v14QuizModal').classList.add('open');
    renderQuizV14();
  });
}

function renderQuizV14(){
  var panel = document.getElementById('v14QuizPanel');
  if(quizV14Idx >= QUIZ_V14.length){
    panel.innerHTML = '<div style="text-align:center"><h3>🎉 결과</h3>\
<div style="font-size:36px;font-weight:900;color:var(--accent);margin:16px 0">'+quizV14Score+' / '+QUIZ_V14.length+'</div>\
<div style="font-size:14px;color:var(--text-dim);margin-bottom:16px">'+(quizV14Score>=12?'🏆 복싱 마스터!':quizV14Score>=9?'🥇 훌륭합니다!':quizV14Score>=6?'👍 잘했습니다!':'💪 더 학습하세요!')+'</div>\
<button class="v14-btn primary" onclick="document.getElementById(\'v14QuizModal\').classList.remove(\'open\')">닫기</button></div>';
    return;
  }
  var q = QUIZ_V14[quizV14Idx];
  quizV14Answered = false;
  panel.innerHTML = '<div style="text-align:right;font-size:12px;color:var(--text-muted)">'+(quizV14Idx+1)+'/'+QUIZ_V14.length+'</div>\
<div class="v14-quiz-q">'+q.q+'</div>';
  q.a.forEach(function(a, i){
    var btn = document.createElement('button');
    btn.className = 'v14-quiz-opt';
    btn.textContent = a;
    btn.addEventListener('click', function(){
      if(quizV14Answered) return;
      quizV14Answered = true;
      if(i === q.c){
        quizV14Score++;
        this.classList.add('correct');
      } else {
        this.classList.add('wrong');
        panel.querySelectorAll('.v14-quiz-opt')[q.c].classList.add('correct');
      }
      setTimeout(function(){
        quizV14Idx++;
        renderQuizV14();
      }, 1000);
    });
    panel.appendChild(btn);
  });
}

// ===== V14 ACHIEVEMENTS =====
function checkV14Ach(){
  var changed = false;
  ACHIEVEMENTS_V14.forEach(function(a){
    if(!v14.achievementsV14[a.id] && a.check()){
      v14.achievementsV14[a.id] = new Date().toISOString();
      changed = true;
      playSFX14('achieve_v14');
    }
  });
  if(changed){
    saveV14(v14);
    renderV14Ach();
    var title = document.querySelector('#v14-achievements .v14-title');
    if(title) title.innerHTML = '<span class="emoji">🏆</span> v14 업적 ('+countV14Ach()+'/'+ACHIEVEMENTS_V14.length+')';
  }
}

function countV14Ach(){
  return Object.keys(v14.achievementsV14).length;
}

function renderV14Ach(){
  var grid = document.getElementById('v14AchGrid');
  if(!grid) return;
  grid.innerHTML = '';
  ACHIEVEMENTS_V14.forEach(function(a){
    var unlocked = !!v14.achievementsV14[a.id];
    var div = document.createElement('div');
    div.className = 'badge ' + (unlocked ? 'unlocked' : 'locked');
    div.title = a.desc;
    div.innerHTML = '<span class="badge-icon">'+a.icon+'</span><span class="badge-name">'+a.name+'</span>';
    grid.appendChild(div);
  });
}

// ===== FAB BAR =====
function initFAB(){
  document.querySelectorAll('.v14-fab').forEach(function(fab){
    fab.addEventListener('click', function(){
      var target = this.getAttribute('data-goto');
      var el = document.getElementById(target);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
}

// ===== KEYBOARD SHORTCUTS =====
function initKeyboard(){
  document.addEventListener('keydown', function(e){
    if(!e.shiftKey) return;
    var targets = {
      'A':'v14-accuracy',
      'B':'v14-bodyshot',
      'W':'v14-weight',
      'I':'v14-hiit',
      'T':'v14-tech',
      'X':'v14-reflex',
      'P':'v14-power',
      'C':'v14-coach'
    };
    var key = e.key.toUpperCase();
    if(key in targets){
      e.preventDefault();
      var el = document.getElementById(targets[key]);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
}

// ===== HELPERS =====
function padZ(n){ return n < 10 ? '0'+n : ''+n; }

// ===== INIT =====
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', buildV14);
} else {
  buildV14();
}

})();
