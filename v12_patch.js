// Boxing Trainer Pro v12_patch.js - NEXTERA+PRISM Auto Enhancement Module
// Nutrition Guide 12, Footwork Drills 6 Canvas, Shadowboxing Guide 8 Rounds,
// Boxing Hall of Fame 12 Legends, Body Composition Analyzer Canvas,
// Round-by-Round Analysis Canvas, Boxing Dictionary 40 Terms,
// Training Timer Presets 8, Motivation Board, Season Challenge 12 Months,
// Quiz +15 (45->60), +12 Achievements (58->70), SFX 14, Keyboard +8
(function(){
'use strict';

var STORAGE_KEY = 'boxingTrainerData';
var V12KEY = 'boxingV12Patch';

function loadAppData(){
  try { var r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch(e){ return null; }
}
function loadV12(){
  try {
    var r = localStorage.getItem(V12KEY);
    if(!r) return defV12();
    var p = JSON.parse(r), d = defV12();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV12(); }
}
function saveV12(d){ try { localStorage.setItem(V12KEY, JSON.stringify(d)); } catch(e){} }
function defV12(){
  return {
    nutritionLog: [],
    footworkDrills: {},
    shadowRounds: 0,
    shadowBest: 0,
    hallViewed: [],
    bodyComps: [],
    roundAnalysis: [],
    dictViewed: [],
    timerPresets: {},
    motivQuote: 0,
    seasonProgress: {},
    quizV12Scores: {}
  };
}

var v12 = loadV12();

// ===== SFX ENGINE V12 =====
function playSFX12(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'nutrition':
        [523,659,784].forEach(function(f,j){
          var o=ctx.createOscillator(),g=ctx.createGain();
          o.type='sine';o.frequency.value=f;
          g.gain.setValueAtTime(0.1,t+j*0.1);g.gain.exponentialRampToValueAtTime(0.001,t+j*0.1+0.3);
          o.connect(g).connect(ctx.destination);o.start(t+j*0.1);o.stop(t+j*0.1+0.3);
        });break;
      case 'footwork':
        var o1=ctx.createOscillator(),g1=ctx.createGain();
        o1.type='square';o1.frequency.setValueAtTime(150,t);o1.frequency.exponentialRampToValueAtTime(300,t+0.08);
        g1.gain.setValueAtTime(0.15,t);g1.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        o1.connect(g1).connect(ctx.destination);o1.start(t);o1.stop(t+0.1);break;
      case 'footwork_step':
        var o1b=ctx.createOscillator(),g1b=ctx.createGain();
        o1b.type='triangle';o1b.frequency.setValueAtTime(200,t);o1b.frequency.exponentialRampToValueAtTime(400,t+0.05);
        g1b.gain.setValueAtTime(0.12,t);g1b.gain.exponentialRampToValueAtTime(0.001,t+0.06);
        o1b.connect(g1b).connect(ctx.destination);o1b.start(t);o1b.stop(t+0.06);break;
      case 'shadow_bell':
        [880,1047,1319].forEach(function(f,j){
          var o2=ctx.createOscillator(),g2=ctx.createGain();
          o2.type='triangle';o2.frequency.value=f;
          g2.gain.setValueAtTime(0.12,t+j*0.06);g2.gain.exponentialRampToValueAtTime(0.001,t+j*0.06+0.25);
          o2.connect(g2).connect(ctx.destination);o2.start(t+j*0.06);o2.stop(t+j*0.06+0.25);
        });break;
      case 'shadow_combo':
        var o3=ctx.createOscillator(),g3=ctx.createGain();
        o3.type='sawtooth';o3.frequency.setValueAtTime(440,t);o3.frequency.exponentialRampToValueAtTime(880,t+0.1);
        g3.gain.setValueAtTime(0.1,t);g3.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o3.connect(g3).connect(ctx.destination);o3.start(t);o3.stop(t+0.12);break;
      case 'hall_view':
        var o4=ctx.createOscillator(),g4=ctx.createGain();
        o4.type='sine';o4.frequency.setValueAtTime(392,t);o4.frequency.linearRampToValueAtTime(784,t+0.3);
        g4.gain.setValueAtTime(0.1,t);g4.gain.exponentialRampToValueAtTime(0.001,t+0.35);
        o4.connect(g4).connect(ctx.destination);o4.start(t);o4.stop(t+0.35);break;
      case 'body_scan':
        [262,330,392,523].forEach(function(f,j){
          var o5=ctx.createOscillator(),g5=ctx.createGain();
          o5.type='sine';o5.frequency.value=f;
          g5.gain.setValueAtTime(0.08,t+j*0.12);g5.gain.exponentialRampToValueAtTime(0.001,t+j*0.12+0.35);
          o5.connect(g5).connect(ctx.destination);o5.start(t+j*0.12);o5.stop(t+j*0.12+0.35);
        });break;
      case 'round_analyze':
        var o6=ctx.createOscillator(),g6=ctx.createGain();
        o6.type='sine';o6.frequency.setValueAtTime(660,t);o6.frequency.linearRampToValueAtTime(990,t+0.2);
        g6.gain.setValueAtTime(0.1,t);g6.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o6.connect(g6).connect(ctx.destination);o6.start(t);o6.stop(t+0.25);break;
      case 'dict_open':
        var o7=ctx.createOscillator(),g7=ctx.createGain();
        o7.type='triangle';o7.frequency.value=880;
        g7.gain.setValueAtTime(0.08,t);g7.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o7.connect(g7).connect(ctx.destination);o7.start(t);o7.stop(t+0.15);break;
      case 'timer_tick':
        var o8=ctx.createOscillator(),g8=ctx.createGain();
        o8.type='square';o8.frequency.value=1000;
        g8.gain.setValueAtTime(0.06,t);g8.gain.exponentialRampToValueAtTime(0.001,t+0.03);
        o8.connect(g8).connect(ctx.destination);o8.start(t);o8.stop(t+0.03);break;
      case 'timer_done':
        [784,988,1175,1568].forEach(function(f,j){
          var o9=ctx.createOscillator(),g9=ctx.createGain();
          o9.type='sine';o9.frequency.value=f;
          g9.gain.setValueAtTime(0.12,t+j*0.08);g9.gain.exponentialRampToValueAtTime(0.001,t+j*0.08+0.3);
          o9.connect(g9).connect(ctx.destination);o9.start(t+j*0.08);o9.stop(t+j*0.08+0.3);
        });break;
      case 'motivate':
        var o10=ctx.createOscillator(),g10=ctx.createGain();
        o10.type='sine';o10.frequency.setValueAtTime(523,t);o10.frequency.linearRampToValueAtTime(1047,t+0.2);
        g10.gain.setValueAtTime(0.08,t);g10.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o10.connect(g10).connect(ctx.destination);o10.start(t);o10.stop(t+0.25);break;
      case 'season_clear':
        [523,659,784,1047,1319,1568].forEach(function(f,j){
          var o11=ctx.createOscillator(),g11=ctx.createGain();
          o11.type='sine';o11.frequency.value=f;
          g11.gain.setValueAtTime(0.1,t+j*0.05);g11.gain.exponentialRampToValueAtTime(0.001,t+j*0.05+0.25);
          o11.connect(g11).connect(ctx.destination);o11.start(t+j*0.05);o11.stop(t+j*0.05+0.25);
        });break;
      case 'quiz_v12':
        [659,784,988].forEach(function(f,j){
          var oq=ctx.createOscillator(),gq=ctx.createGain();
          oq.type='sine';oq.frequency.value=f;
          gq.gain.setValueAtTime(0.1,t+j*0.08);gq.gain.exponentialRampToValueAtTime(0.001,t+j*0.08+0.2);
          oq.connect(gq).connect(ctx.destination);oq.start(t+j*0.08);oq.stop(t+j*0.08+0.2);
        });break;
      case 'achieve_v12':
        [523,659,784,1047].forEach(function(f,j){
          var oa=ctx.createOscillator(),ga=ctx.createGain();
          oa.type='triangle';oa.frequency.value=f;
          ga.gain.setValueAtTime(0.12,t+j*0.1);ga.gain.exponentialRampToValueAtTime(0.001,t+j*0.1+0.35);
          oa.connect(ga).connect(ctx.destination);oa.start(t+j*0.1);oa.stop(t+j*0.1+0.35);
        });break;
    }
  } catch(e){}
}

// ===== CSS V12 =====
function injectV12CSS(){
  var s = document.createElement('style');
  s.textContent = '\
.v12-section{margin:24px 0;animation:slideUp 0.5s ease-out both}\
.v12-card{background:var(--glass);border:1px solid var(--glass-border);\
border-radius:var(--radius);padding:20px;backdrop-filter:blur(12px);transition:all 0.3s}\
.v12-card:hover{border-color:rgba(255,68,68,0.3);transform:translateY(-2px)}\
.v12-title{font-size:18px;font-weight:800;margin-bottom:14px;\
display:flex;align-items:center;gap:8px;letter-spacing:0.5px}\
.v12-title .emoji{font-size:22px}\
.v12-grid-2{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}\
.v12-grid-3{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}\
.v12-grid-4{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}\
.nutr-card{padding:14px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:14px;cursor:pointer;transition:all 0.3s;position:relative}\
.nutr-card:hover{border-color:var(--green);transform:translateY(-2px)}\
.nutr-card.checked{border-color:var(--green);background:rgba(34,197,94,0.05)}\
.nutr-card.checked::after{content:"\\2713";position:absolute;top:8px;right:10px;color:var(--green);font-size:16px;font-weight:700}\
.nutr-icon{font-size:28px;margin-bottom:6px}\
.nutr-name{font-size:13px;font-weight:800;margin-bottom:4px}\
.nutr-desc{font-size:11px;color:var(--text-dim);line-height:1.5}\
.nutr-timing{font-size:10px;padding:2px 8px;border-radius:10px;display:inline-block;margin-top:6px;\
font-weight:700}\
.nutr-timing.pre{background:rgba(59,130,246,0.15);color:var(--blue)}\
.nutr-timing.during{background:rgba(249,115,22,0.15);color:var(--orange)}\
.nutr-timing.post{background:rgba(34,197,94,0.15);color:var(--green)}\
.fw-canvas{width:100%;max-width:400px;height:400px;margin:12px auto;display:block;\
border-radius:12px;background:var(--surface)}\
.fw-drill-list{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:12px 0}\
.fw-drill-btn{padding:8px 16px;border:1px solid var(--glass-border);border-radius:20px;\
background:var(--glass);font-size:11px;font-weight:700;color:var(--text-dim);cursor:pointer;\
transition:all 0.2s}\
.fw-drill-btn.active{border-color:var(--accent);color:var(--accent);background:var(--accent-soft)}\
.fw-drill-btn.done{border-color:var(--green);color:var(--green)}\
.fw-stats{display:flex;gap:12px;justify-content:center;margin:10px 0;flex-wrap:wrap}\
.fw-stat{text-align:center;padding:6px 14px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:10px;min-width:60px}\
.fw-stat-val{font-size:18px;font-weight:900}\
.fw-stat-lbl{font-size:9px;color:var(--text-muted);margin-top:2px}\
.shadow-guide{padding:16px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:14px;text-align:center}\
.shadow-round{font-size:48px;font-weight:900;color:var(--accent);margin:8px 0}\
.shadow-combo{font-size:18px;font-weight:700;margin:12px 0;min-height:28px;\
color:var(--text);letter-spacing:1px}\
.shadow-timer{font-size:64px;font-weight:900;font-family:monospace;color:var(--orange);margin:8px 0}\
.shadow-phase{font-size:14px;font-weight:700;padding:4px 16px;border-radius:20px;\
display:inline-block;margin:8px 0}\
.shadow-phase.fight{background:rgba(255,68,68,0.15);color:var(--accent)}\
.shadow-phase.rest{background:rgba(34,197,94,0.15);color:var(--green)}\
.shadow-btn{padding:14px 32px;border:none;border-radius:12px;background:var(--accent);color:#fff;\
font-size:16px;font-weight:700;cursor:pointer;transition:all 0.2s;margin:8px 4px}\
.shadow-btn:hover{filter:brightness(1.1)}\
.shadow-btn.stop{background:var(--orange)}\
.shadow-progress{display:flex;gap:4px;justify-content:center;margin:10px 0}\
.shadow-dot{width:24px;height:24px;border-radius:50%;background:var(--surface);border:2px solid var(--glass-border);\
display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--text-muted);\
transition:all 0.3s}\
.shadow-dot.done{background:var(--accent);border-color:var(--accent);color:#fff}\
.shadow-dot.current{border-color:var(--orange);color:var(--orange);transform:scale(1.2)}\
.hall-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}\
.hall-card{padding:16px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:14px;cursor:pointer;transition:all 0.3s;text-align:center}\
.hall-card:hover{border-color:var(--gold);transform:translateY(-2px)}\
.hall-card.viewed{border-color:rgba(255,215,0,0.3)}\
.hall-emoji{font-size:42px;margin-bottom:8px}\
.hall-name{font-size:15px;font-weight:800;margin-bottom:2px}\
.hall-nickname{font-size:10px;color:var(--gold);font-weight:700;margin-bottom:6px;letter-spacing:1px}\
.hall-era{font-size:10px;color:var(--text-muted)}\
.hall-record{font-size:11px;color:var(--text-dim);margin-top:4px}\
.hall-detail{display:none;margin-top:10px;text-align:left;font-size:11px;color:var(--text-dim);\
line-height:1.6;padding-top:10px;border-top:1px solid var(--glass-border)}\
.hall-card.open .hall-detail{display:block}\
.body-canvas{width:100%;max-width:460px;height:240px;margin:12px auto;display:block;\
border-radius:12px;background:var(--surface)}\
.body-input-row{display:flex;gap:8px;align-items:center;justify-content:center;margin:10px 0;flex-wrap:wrap}\
.body-input{width:80px;padding:8px 10px;border:1px solid var(--glass-border);border-radius:8px;\
background:var(--surface);color:var(--text);font-size:14px;font-weight:700;text-align:center}\
.body-label{font-size:12px;color:var(--text-dim);min-width:50px;text-align:right}\
.body-btn{padding:8px 20px;border:none;border-radius:8px;background:var(--accent);color:#fff;\
font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s}\
.body-btn:hover{filter:brightness(1.1)}\
.body-results{display:flex;gap:12px;justify-content:center;margin:12px 0;flex-wrap:wrap}\
.body-metric{text-align:center;padding:10px 16px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:12px;min-width:80px}\
.body-metric-val{font-size:22px;font-weight:900}\
.body-metric-lbl{font-size:9px;color:var(--text-muted);margin-top:2px}\
.round-canvas{width:100%;max-width:500px;height:220px;margin:12px auto;display:block;\
border-radius:12px;background:var(--surface)}\
.round-summary{display:flex;gap:12px;justify-content:center;margin:12px 0;flex-wrap:wrap}\
.round-stat{text-align:center;min-width:70px}\
.round-stat-val{font-size:20px;font-weight:900}\
.round-stat-lbl{font-size:9px;color:var(--text-muted)}\
.dict-search{width:100%;padding:10px 16px;border:1px solid var(--glass-border);border-radius:10px;\
background:var(--surface);color:var(--text);font-size:14px;margin-bottom:12px}\
.dict-cats{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}\
.dict-cat{padding:4px 12px;border:1px solid var(--glass-border);border-radius:16px;\
background:var(--glass);font-size:10px;font-weight:700;color:var(--text-dim);cursor:pointer;\
transition:all 0.2s}\
.dict-cat.active{border-color:var(--accent);color:var(--accent);background:var(--accent-soft)}\
.dict-list{max-height:400px;overflow-y:auto}\
.dict-item{padding:12px 16px;border-bottom:1px solid var(--glass-border);cursor:pointer;\
transition:all 0.2s}\
.dict-item:hover{background:var(--surface)}\
.dict-term{font-size:14px;font-weight:700;margin-bottom:2px}\
.dict-term-en{font-size:11px;color:var(--accent);font-weight:600}\
.dict-def{font-size:12px;color:var(--text-dim);line-height:1.5;display:none;margin-top:6px}\
.dict-item.open .dict-def{display:block}\
.timer-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}\
.timer-card{padding:16px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:14px;cursor:pointer;transition:all 0.3s;text-align:center}\
.timer-card:hover{border-color:var(--accent);transform:translateY(-2px)}\
.timer-card.active{border-color:var(--accent);background:var(--accent-soft)}\
.timer-icon{font-size:28px;margin-bottom:6px}\
.timer-name{font-size:14px;font-weight:800;margin-bottom:4px}\
.timer-desc{font-size:11px;color:var(--text-dim)}\
.timer-meta{display:flex;gap:6px;justify-content:center;margin-top:8px;flex-wrap:wrap}\
.timer-tag{font-size:9px;padding:2px 8px;border-radius:10px;background:var(--surface);\
border:1px solid var(--glass-border);color:var(--text-muted)}\
.timer-display{font-size:72px;font-weight:900;font-family:monospace;text-align:center;\
color:var(--accent);margin:16px 0}\
.timer-controls{display:flex;gap:8px;justify-content:center;margin:12px 0}\
.timer-ctrl-btn{padding:10px 24px;border:none;border-radius:10px;font-size:14px;font-weight:700;\
cursor:pointer;transition:all 0.2s}\
.timer-ctrl-btn.start{background:var(--accent);color:#fff}\
.timer-ctrl-btn.pause{background:var(--orange);color:#fff}\
.timer-ctrl-btn.reset{background:var(--glass);border:1px solid var(--glass-border);color:var(--text-dim)}\
.motiv-card{padding:24px;background:linear-gradient(135deg,rgba(255,68,68,0.08),rgba(255,215,0,0.04));\
border:1px solid rgba(255,68,68,0.15);border-radius:var(--radius);text-align:center;\
cursor:pointer;transition:all 0.3s}\
.motiv-card:hover{border-color:rgba(255,68,68,0.3)}\
.motiv-quote{font-size:16px;font-weight:700;line-height:1.6;margin-bottom:12px;font-style:italic}\
.motiv-author{font-size:12px;color:var(--gold);font-weight:600}\
.motiv-goals{display:flex;gap:10px;justify-content:center;margin-top:16px;flex-wrap:wrap}\
.motiv-goal{padding:8px 16px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:10px;font-size:11px;color:var(--text-dim);transition:all 0.2s}\
.motiv-goal.done{border-color:var(--green);color:var(--green);background:rgba(34,197,94,0.05)}\
.season-card{padding:20px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:14px;text-align:center;position:relative;overflow:hidden}\
.season-badge{font-size:48px;margin-bottom:8px}\
.season-name{font-size:18px;font-weight:800;margin-bottom:4px}\
.season-desc{font-size:12px;color:var(--text-dim);margin-bottom:12px;line-height:1.5}\
.season-tasks{text-align:left}\
.season-task{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--glass-border);\
font-size:12px;color:var(--text-dim)}\
.season-task:last-child{border-bottom:none}\
.season-task.done{color:var(--green)}\
.season-task-check{width:18px;height:18px;border-radius:50%;border:2px solid var(--glass-border);\
display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0}\
.season-task.done .season-task-check{border-color:var(--green);background:var(--green);color:#fff}\
.season-progress-bar{height:8px;background:var(--surface);border-radius:4px;overflow:hidden;margin:12px 0}\
.season-progress-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--accent),var(--gold));\
transition:width 0.6s ease-out}\
.v12-quiz-panel{padding:20px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:var(--radius);backdrop-filter:blur(12px)}\
.v12-quiz-q{font-size:15px;font-weight:700;margin-bottom:16px;line-height:1.5}\
.v12-quiz-opts{display:flex;flex-direction:column;gap:8px}\
.v12-quiz-opt{padding:12px 16px;border:1px solid var(--glass-border);border-radius:10px;\
background:var(--surface);cursor:pointer;font-size:13px;transition:all 0.2s;text-align:left}\
.v12-quiz-opt:hover{border-color:var(--accent)}\
.v12-quiz-opt.correct{border-color:var(--green);background:rgba(34,197,94,0.1);color:var(--green)}\
.v12-quiz-opt.wrong{border-color:var(--accent);background:rgba(255,68,68,0.1);color:var(--accent)}\
.v12-quiz-result{text-align:center;padding:20px;font-size:14px}\
.v12-quiz-score{font-size:36px;font-weight:900;color:var(--accent);margin:8px 0}\
@media(max-width:768px){\
.v12-grid-2{grid-template-columns:1fr}\
.v12-grid-3{grid-template-columns:repeat(2,1fr)}\
.v12-grid-4{grid-template-columns:repeat(2,1fr)}\
.hall-grid{grid-template-columns:repeat(2,1fr)}\
.timer-grid{grid-template-columns:1fr}\
.fw-canvas{height:300px}\
.body-canvas{height:180px}\
.round-canvas{height:160px}\
}\
@media(max-width:400px){\
.v12-grid-3{grid-template-columns:1fr}\
.hall-grid{grid-template-columns:1fr}\
}';
  document.head.appendChild(s);
}

// ===== DATA =====
var NUTRITION_DATA = [
  {icon:'🍌',name:'바나나',desc:'빠른 에너지 보충. 운동 30분 전 섭취.',timing:'pre',cal:'105kcal'},
  {icon:'🥜',name:'땅콩버터 토스트',desc:'탄수화물+단백질 복합. 1시간 전 섭취.',timing:'pre',cal:'250kcal'},
  {icon:'🍚',name:'현미밥 + 닭가슴살',desc:'복합탄수+고단백 식사. 2시간 전.',timing:'pre',cal:'400kcal'},
  {icon:'☕',name:'커피',desc:'카페인이 지방연소+집중력 향상. 30분 전.',timing:'pre',cal:'5kcal'},
  {icon:'💧',name:'물 500ml',desc:'탈수 방지. 운동 전 충분한 수분 보충.',timing:'pre',cal:'0kcal'},
  {icon:'🍊',name:'오렌지 주스',desc:'빠른 당분+비타민 C. 운동 중 에너지.',timing:'during',cal:'45kcal'},
  {icon:'🧃',name:'전해질 음료',desc:'나트륨+칼륨 보충. 땅 많이 흐를 때.',timing:'during',cal:'20kcal'},
  {icon:'🍬',name:'에너지 젤',desc:'빠른 흡수 탄수화물. 장시간 훈련 시.',timing:'during',cal:'100kcal'},
  {icon:'🥛',name:'프로티인 쉐이크',desc:'근육 회복에 필수. 운동 직후 30분 이내.',timing:'post',cal:'150kcal'},
  {icon:'🥚',name:'삶은 계란 2개',desc:'고품질 단백질+루신. 근육 합성 촉진.',timing:'post',cal:'140kcal'},
  {icon:'🍓',name:'그릭요거트 + 베리',desc:'단백질+항산화제. 근육통+염증 완화.',timing:'post',cal:'180kcal'},
  {icon:'🥔',name:'고구마',desc:'복합탄수+비타민 A. 글리코겐 보충 최적.',timing:'post',cal:'112kcal'}
];

var FOOTWORK_DRILLS = [
  {id:'basic_step',name:'기본 스텝',desc:'전후좌우 기본 스텝 운동',steps:['F','F','B','B','L','L','R','R'],duration:30},
  {id:'pivot',name:'피봇 턴',desc:'앞발 축으로 피봇 회전',steps:['F','PL','F','PR','F','PL','F','PR'],duration:30},
  {id:'lateral',name:'래터럴 무브',desc:'좌우 횡 이동 반복',steps:['L','L','R','R','L','L','R','R'],duration:30},
  {id:'diamond',name:'다이아몬드 스텝',desc:'다이아몬드 형태로 이동',steps:['F','R','B','L','F','L','B','R'],duration:45},
  {id:'circle',name:'서클 무브',desc:'상대 주위를 원형으로 이동',steps:['FR','R','BR','B','BL','L','FL','F'],duration:45},
  {id:'in_out',name:'인아웃 스텝',desc:'전진+후퇴 반복 거리조절',steps:['F','F','F','B','B','B','F','F'],duration:30}
];

var SHADOW_COMBOS = [
  ['잡 \xD7 3'],
  ['잡 - 크로스'],
  ['잡 - 잡 - 크로스'],
  ['잡 - 크로스 - 훅'],
  ['잡 - 크로스 - 훅 - 어퍼컷'],
  ['더블잡 - 크로스 - 훅 - 크로스'],
  ['잡 - 바디훅 - 어퍼컷 - 크로스'],
  ['잡 - 크로스 - 슬립 - 크로스 - 훅']
];

var HALL_OF_FAME = [
  {name:'무하마드 알리',nickname:'THE GREATEST',era:'1960-1981',record:'56승 5패',desc:'역대 최고의 헤비급 복서. &quot;Float like a butterfly, sting like a bee&quot;로 유명. 3회 세계헤비급 챔피언.'},
  {name:'마이크 타이슨',nickname:'IRON MIKE',era:'1985-2005',record:'50승 6패',desc:'역대 최고의 파워퍼처. 사상 최연소 헤비급 챔피언(20세). KO율 75%.'},
  {name:'플로이드 메이웨더',nickname:'MONEY',era:'1996-2017',record:'50승 0패',desc:'무패 전설. 완벽한 방어 기술과 카운터 퍼칭의 달인.'},
  {name:'마니 파퀴아오',nickname:'PACMAN',era:'1995-2021',record:'62승 8패',desc:'8체급 세계챔피언. 속도와 파워의 조합. 필리핀 국민영웅.'},
  {name:'슈거 레이 레너드',nickname:'SUGAR RAY',era:'1977-1997',record:'36승 3패',desc:'화려한 스킬과 스피드. 웰터급 전설. 박찬호와의 경기로 유명.'},
  {name:'렌녹스 루이스',nickname:'THE LION',era:'1988-2017',record:'41승 13패',desc:'헤비급 3회 챔피언. 타이슨을 꺽은 전설적 경기(2002).'},
  {name:'박찬호',nickname:'KOREAN FIGHTER',era:'1967-1982',record:'65승 4패',desc:'한국 복싱의 전설. 주니어 미들급 챔피언. 근성과 투지의 아이콘.'},
  {name:'홍수환',nickname:'WILD TIGER',era:'1988-2008',record:'40승 7패',desc:'한국 복싱의 전설. WBO 주니어 미들급 챔피언.'},
  {name:'오스카 데 라 호야',nickname:'GOLDEN BOY',era:'1992-2008',record:'39승 6패',desc:'6체급 챔피언. 복싱의 상업적 성공을 이끈 선구자.'},
  {name:'카네로 알바레스',nickname:'CINNAMON',era:'2005-현재',record:'61승 2패',desc:'현역 최고의 P4P. 4체급 통합챔피언. 멕시코의 영웅.'},
  {name:'바실 우시크',nickname:'THE MATRIX',era:'1999-2023',record:'34승 1패',desc:'방어의 달인. 하이테크 방어술과 반격의 대명사.'},
  {name:'로비 듀란',nickname:'IRON FIST',era:'1939-1951',record:'83승 8패',desc:'역대 최고 KO율(83.5%). 미들급+웰터급 챔피언. 파괴력의 상징.'}
];

var BOXING_DICT = [
  {term:'잡(Jab)',cat:'기본기술',def:'앞손으로 빠르게 내는 직선 퍼치. 가장 기본적이고 빈번하게 사용되는 퍼치.'},
  {term:'크로스(Cross)',cat:'기본기술',def:'뒤손으로 내는 강력한 직선 퍼치. 허리 회전을 활용한 파워 퍼치.'},
  {term:'훅(Hook)',cat:'기본기술',def:'옆으로 휘두르는 반원형 퍼치. 상대의 측면을 공격.'},
  {term:'어퍼컷(Uppercut)',cat:'기본기술',def:'아래에서 위로 치고 올라가는 퍼치. 턴을 노릴 때 효과적.'},
  {term:'몸샷(Body Shot)',cat:'기본기술',def:'상대 몸통을 공격하는 퍼치. 체력 소모와 가드 붕괴에 효과적.'},
  {term:'콤비네이션(Combination)',cat:'기본기술',def:'여러 퍼치를 연속으로 내는 기술. 1-2, 1-2-3 등 번호로 불림.'},
  {term:'가드(Guard)',cat:'방어기술',def:'양손으로 얼굴과 몸을 보호하는 기본 방어 자세.'},
  {term:'파링(Parry)',cat:'방어기술',def:'상대 퍼치를 손으로 옆으로 흘려보내는 방어 기술.'},
  {term:'슬립(Slip)',cat:'방어기술',def:'상체를 좌우로 살짝 비틀어 퍼치를 피하는 기술.'},
  {term:'밥 앤 위브(Bob & Weave)',cat:'방어기술',def:'무릎을 굽혀 아래로 피한 후 U자로 몸을 일으켜 이동하는 방어.'},
  {term:'클린치(Clinch)',cat:'방어기술',def:'상대를 붙잡아 공격을 무력화하는 기술. 체력 회복에도 활용.'},
  {term:'퐀워크(Footwork)',cat:'이동기술',def:'발놓림 기술. 공격과 방어의 기초. 전후좌우 이동.'},
  {term:'피봇(Pivot)',cat:'이동기술',def:'앞발을 축으로 몸을 회전하는 기술. 각도 변환에 활용.'},
  {term:'컷오프(Cut Off)',cat:'이동기술',def:'상대의 이동 경로를 차단하는 퐀워크. 압박전술.'},
  {term:'스텝백(Step Back)',cat:'이동기술',def:'뒤로 빠르게 물러나며 거리를 벌리는 기술.'},
  {term:'사우스포(Southpaw)',cat:'스타일',def:'오른손이 앞에 오는 왼손잡이 스타일. 오솔독스와 반대.'},
  {term:'오솔독스(Orthodox)',cat:'스타일',def:'왼손이 앞에 오는 오른손잡이 기본 스타일.'},
  {term:'피카부(Peekaboo)',cat:'스타일',def:'커스 다마토가 개발한 스타일. 높은 가드+헤드무브먼트.'},
  {term:'아웃박서(Out-boxer)',cat:'스타일',def:'거리를 유지하며 잡과 발놓림으로 싸우는 스타일.'},
  {term:'인파이터(In-fighter)',cat:'스타일',def:'근접 거리에서 강력한 퍼치를 퍼붓는 스타일.'},
  {term:'KO(Knockout)',cat:'경기용어',def:'상대가 10카운트 안에 일어나지 못하는 것. 노크아웃.'},
  {term:'TKO',cat:'경기용어',def:'Technical Knockout. 레프리가 경기를 중단시키는 것.'},
  {term:'라운드(Round)',cat:'경기용어',def:'복싱 경기의 시간 단위. 프로 3분, 아마추어 2-3분.'},
  {term:'링(Ring)',cat:'경기용어',def:'복싱 경기가 열리는 사각형 경기장. 보통 16~20피트.'},
  {term:'코너(Corner)',cat:'경기용어',def:'링의 모서리. 선수가 휴식하고 작전을 받는 곳.'},
  {term:'카운터퍼치(Counter)',cat:'전술',def:'상대의 공격에 맞춰 반격하는 퍼치. 타이밍이 중요.'},
  {term:'페인트(Feint)',cat:'전술',def:'거짓 동작으로 상대의 반응을 유도하는 기술.'},
  {term:'프레셔(Pressure)',cat:'전술',def:'상대를 계속 압박하며 전진하는 전술.'},
  {term:'링제네럴십(Ring Generalship)',cat:'전술',def:'링 위에서 위치와 거리를 지배하는 능력.'},
  {term:'파운드 포 파운드(P4P)',cat:'복싱용어',def:'체급에 관계없이 실력을 비교하는 가상 랭킹.'},
  {term:'체급(Weight Class)',cat:'복싱용어',def:'체중으로 나누는 계급. 헤비급부터 미니플라이급까지 17개.'},
  {term:'챔피언 벨트',cat:'복싱용어',def:'챔피언 선수가 허리에 차는 벨트.'},
  {term:'무판정(Draw)',cat:'복싱용어',def:'승부가 나지 않고 무승부로 끝나는 경기 결과.'},
  {term:'엔트레이너(Trainer)',cat:'훈련용어',def:'선수를 지도하고 전술을 짜는 훈련사.'},
  {term:'미트패드(Mitt Pad)',cat:'훈련용어',def:'트레이너가 손에 끼고 선수의 퍼치를 받는 훈련 도구.'},
  {term:'샌드백(Sandbag)',cat:'훈련용어',def:'퍼치력과 지구력 훈련을 위한 대형 백.'},
  {term:'스피드볼(Speed Ball)',cat:'훈련용어',def:'반사신경과 손눈 협응력을 키우는 작은 볼.'},
  {term:'섬도복싱(Shadow Boxing)',cat:'훈련용어',def:'거울이나 허공을 보며 폼을 연습하는 훈련.'},
  {term:'줄넘기(Jump Rope)',cat:'훈련용어',def:'복서의 필수 워밍업. 체력+발놓림+리듬감 향상.'}
];

var TIMER_PRESETS = [
  {id:'tabata',icon:'⚡',name:'타바타',desc:'20초 운동 / 10초 휴식 \xD7 8세트',work:20,rest:10,rounds:8,intensity:'high'},
  {id:'classic',icon:'🥊',name:'클래식 3R',desc:'3분 운동 / 1분 휴식 \xD7 3라운드',work:180,rest:60,rounds:3,intensity:'med'},
  {id:'pro',icon:'🏆',name:'프로 12R',desc:'3분 운동 / 1분 휴식 \xD7 12라운드',work:180,rest:60,rounds:12,intensity:'high'},
  {id:'hiit',icon:'🔥',name:'HIIT',desc:'30초 운동 / 15초 휴식 \xD7 10세트',work:30,rest:15,rounds:10,intensity:'high'},
  {id:'endurance',icon:'💪',name:'지구력',desc:'5분 운동 / 1분 휴식 \xD7 5라운드',work:300,rest:60,rounds:5,intensity:'med'},
  {id:'shadow',icon:'👤',name:'섭도복싱',desc:'2분 운동 / 30초 휴식 \xD7 6라운드',work:120,rest:30,rounds:6,intensity:'low'},
  {id:'speed',icon:'🏃',name:'스피드',desc:'15초 운동 / 15초 휴식 \xD7 12세트',work:15,rest:15,rounds:12,intensity:'high'},
  {id:'custom',icon:'⚙️',name:'커스텀',desc:'직접 설정하는 타이머',work:60,rest:30,rounds:5,intensity:'med'}
];

var MOTIV_QUOTES = [
  {quote:'챔피언은 링 위에서 만들어지는 게 아니라, 아무도 보지 않는 곳에서 만들어진다.',author:'무하마드 알리'},
  {quote:'하루의 훈련을 게을리 하면, 인생이 게을러진다.',author:'마이크 타이슨'},
  {quote:'혼자 훈련하는 시간이 가장 중요한 시간이다.',author:'플로이드 메이웨더'},
  {quote:'포기하지 마라. 고통은 일시적이지만, 포기는 영원하다.',author:'마니 파퀴아오'},
  {quote:'복싱은 실수를 얼마나 빨리 수정하느냐의 싸움이다.',author:'슈거 레이 레너드'},
  {quote:'두려움을 이기는 것이 진정한 용기다.',author:'박찬호'},
  {quote:'고통 없이는 성장도 없다.',author:'카네로 알바레스'},
  {quote:'나를 무너뜨릴 수 있어도, 나를 끝낼 수는 없다.',author:'무하마드 알리'},
  {quote:'연습이 아니라 완벽한 연습이 완벽을 만든다.',author:'바실 우시크'},
  {quote:'몸이 포기하고 싶을 때, 마음이 계속하라고 말해야 한다.',author:'홍수환'}
];

var SEASON_EVENTS = [
  {month:1,name:'신년 챌린지',badge:'🎉',desc:'새해 목표를 세우고 훈련을 시작하세요!',tasks:['훈련 5회 완료','퍼치 1000회 달성','스트릭 3일','세션 평균 80점+']},
  {month:2,name:'발렌타인 파워',badge:'❤️',desc:'사랑하는 사람과 함께 훈련!',tasks:['훈련 7회 완료','콤보 200회 달성','칼로리 2000kcal 소모','업적 3개 해금']},
  {month:3,name:'봄맞이 트레이닝',badge:'🌸',desc:'봄처럼 새롭게 시작!',tasks:['훈련 10회 완료','퍼치 2000회 달성','스트릭 5일','모든 프로그램 1회씩']},
  {month:4,name:'체력 빌드업',badge:'💪',desc:'기초체력을 탄탄하게!',tasks:['훈련 8회 완료','칼로리 3000kcal 소모','퍼치 3000회 달성','세션 10분+ 3회']},
  {month:5,name:'스피드 마스터',badge:'⚡',desc:'속도와 반사신경을 극대화!',tasks:['훈련 10회 완료','퍼치 5000회 달성','콤보 500회 달성','스트릭 7일']},
  {month:6,name:'여름 파이터',badge:'🌞',desc:'무더위를 이겨내는 투지!',tasks:['훈련 12회 완료','칼로리 4000kcal 소모','퍼치 8000회 달성','업적 5개 해금']},
  {month:7,name:'콤보 킹',badge:'👑',desc:'콤비네이션의 달인이 되자!',tasks:['훈련 15회 완료','콤보 1000회 달성','세션 평균 85점+','스트릭 10일']},
  {month:8,name:'폭풍 트레이닝',badge:'🌊',desc:'폭풍처럼 강력한 훈련!',tasks:['훈련 12회 완료','퍼치 10000회 달성','칼로리 5000kcal 소모','모든 콤보 1회씩']},
  {month:9,name:'가을 전사',badge:'🍂',desc:'가을처럼 단단하게!',tasks:['훈련 10회 완료','퍼치 5000회 달성','스트릭 7일','업적 3개 해금']},
  {month:10,name:'할로윈 파이트',badge:'🎃',desc:'공포의 퍼치로 경기를 이겨라!',tasks:['훈련 12회 완료','콤보 800회 달성','칼로리 4000kcal 소모','세션 평균 90점+']},
  {month:11,name:'챔피언 로드',badge:'🏅',desc:'챔피언으로 가는 길!',tasks:['훈련 15회 완료','퍼치 15000회 달성','스트릭 14일','모든 프로그램 2회씩']},
  {month:12,name:'송년 파이널',badge:'🎄',desc:'한 해를 마무리하는 최고의 훈련!',tasks:['훈련 10회 완료','칼로리 3000kcal 소모','콤보 500회 달성','업적 3개 해금']}
];

var QUIZ_V12 = [
  {q:'복싱에서 프로 경기 한 라운드는 몇 분인가요?',opts:['2분','3분','4분','5분'],ans:1},
  {q:'믴하마드 알리의 별명은?',opts:['Iron Mike','The Greatest','Sugar Ray','Golden Boy'],ans:1},
  {q:'피카부(Peekaboo) 스타일을 개발한 트레이너는?',opts:['프레디 로치','커스 다마토','로에 듀바','에드워드 퓨치'],ans:1},
  {q:'복싱에서 왼손잡이 스타일을 뭐라고 하나요?',opts:['오솔독스','사우스포','피카부','오픈스탠스'],ans:1},
  {q:'P4P는 무엇의 약자인가요?',opts:['Pay for Play','Pound for Pound','Power for Power','Punch for Punch'],ans:1},
  {q:'타바타 훈련의 운동/휴식 비율은?',opts:['20초/10초','30초/15초','60초/30초','45초/15초'],ans:0},
  {q:'복싱 링의 일반적인 크기는?',opts:['10~14피트','16~20피트','22~26피트','28~32피트'],ans:1},
  {q:'역대 무패 전적을 가진 복서는?',opts:['믴하마드 알리','플로이드 메이웨더','마이크 타이슨','마니 파퀴아오'],ans:1},
  {q:'한국 복싱의 전설적 복서 박찬호의 체급은?',opts:['플라이급','주니어 미들급','웰터급','헤비급'],ans:1},
  {q:'복싱 글러브의 표준 무게는?',opts:['6oz','8oz','10oz','12oz'],ans:2},
  {q:'카운터퍼치의 핵심 요소는?',opts:['힘','타이밍','스피드','거리'],ans:1},
  {q:'복싱에서 체급은 총 몇 개인가요?',opts:['8개','12개','17개','20개'],ans:2},
  {q:'어퍼컷은 어떤 방향으로 치는 퍼치인가요?',opts:['좌우','위아래','아래에서 위로','앞뒤'],ans:2},
  {q:'복싱 훈련에서 줄넘기를 하는 주된 이유는?',opts:['팔힘 강화','발놓림+체력+리듬','주먹 강화','유연성 향상'],ans:1},
  {q:'사상 최연소 헤비급 챔피언은 누구인가요?',opts:['믴하마드 알리','마이크 타이슨','렌놉스 루이스','조 루이스'],ans:1}
];

var V12_ACHIEVEMENTS = [
  {id:'nutrition_guide',icon:'🍌',name:'영양사',cond:'영양 가이드 첫 확인'},
  {id:'nutrition_all',icon:'🍽️',name:'완벽식단',cond:'영양 12종 모두 체크'},
  {id:'footwork_first',icon:'👟',name:'첫발',cond:'퐀워크 드릴 첫 완료'},
  {id:'footwork_master',icon:'🩰',name:'퐀워크마스터',cond:'퐀워크 6종 모두 완료'},
  {id:'shadow_3',icon:'👤',name:'섭도복서',cond:'섭도복싱 3라운드 완료'},
  {id:'shadow_8',icon:'🥊',name:'섭도챔피언',cond:'섭도복싱 8라운드 완료'},
  {id:'hall_visit',icon:'🏅',name:'명예의전당방문객',cond:'명예의 전당 첫 방문'},
  {id:'hall_all',icon:'🏆',name:'복싱역사가',cond:'명예의 전당 12인 모두 확인'},
  {id:'body_first',icon:'📊',name:'체성분분석가',cond:'체성분 분석 첫 기록'},
  {id:'dict_reader',icon:'📖',name:'복싱사전학자',cond:'용어사전 20항목 확인'},
  {id:'quiz_v12_perfect',icon:'🌟',name:'복싱박사v3',cond:'퀴즈 v12 만점'},
  {id:'season_clear',icon:'🌟',name:'시즌챔피언',cond:'시즌 챌린지 완료'}
];

// ===== SECTION BUILDER =====
function buildV12Sections(){
  var container = document.querySelector('.container');
  if(!container) return;
  var footer = document.querySelector('.footer');

  // 1. Nutrition Guide
  var nutrHTML = '<section class="v12-section"><h2 class="v12-title"><span class="emoji">🍌</span> 영양 가이드</h2>';
  nutrHTML += '<div class="v12-grid-3" id="v12NutrGrid">';
  NUTRITION_DATA.forEach(function(n,i){
    var checked = (v12.nutritionLog.indexOf(i) !== -1) ? ' checked' : '';
    nutrHTML += '<div class="nutr-card'+checked+'" data-nutr-idx="'+i+'">';
    nutrHTML += '<div class="nutr-icon">'+n.icon+'</div>';
    nutrHTML += '<div class="nutr-name">'+n.name+'</div>';
    nutrHTML += '<div class="nutr-desc">'+n.desc+'</div>';
    nutrHTML += '<span class="nutr-timing '+n.timing+'">'+({pre:'운동 전',during:'운동 중',post:'운동 후'}[n.timing])+'</span>';
    nutrHTML += ' <span style="font-size:10px;color:var(--text-muted)">'+n.cal+'</span>';
    nutrHTML += '</div>';
  });
  nutrHTML += '</div></section>';

  // 2. Footwork Drills
  var fwHTML = '<section class="v12-section"><h2 class="v12-title"><span class="emoji">👟</span> 퐀워크 드릴</h2>';
  fwHTML += '<div class="v12-card">';
  fwHTML += '<div class="fw-drill-list" id="v12FwDrills">';
  FOOTWORK_DRILLS.forEach(function(d){
    var cls = v12.footworkDrills[d.id] ? ' done' : '';
    fwHTML += '<button class="fw-drill-btn'+cls+'" data-fw="'+d.id+'">'+d.name+'</button>';
  });
  fwHTML += '</div>';
  fwHTML += '<canvas class="fw-canvas" id="v12FwCanvas" width="400" height="400"></canvas>';
  fwHTML += '<div class="fw-stats" id="v12FwStats">';
  var doneCount = Object.keys(v12.footworkDrills).length;
  fwHTML += '<div class="fw-stat"><div class="fw-stat-val" style="color:var(--accent)">'+doneCount+'</div><div class="fw-stat-lbl">완료</div></div>';
  fwHTML += '<div class="fw-stat"><div class="fw-stat-val" style="color:var(--orange)">'+FOOTWORK_DRILLS.length+'</div><div class="fw-stat-lbl">전체</div></div>';
  fwHTML += '</div></div></section>';

  // 3. Shadowboxing Guide
  var shHTML = '<section class="v12-section"><h2 class="v12-title"><span class="emoji">👤</span> 섭도복싱 가이드</h2>';
  shHTML += '<div class="shadow-guide" id="v12ShadowGuide">';
  shHTML += '<div class="shadow-progress" id="v12ShadowProgress">';
  for(var i=1;i<=8;i++){
    shHTML += '<div class="shadow-dot" data-round="'+i+'">'+i+'</div>';
  }
  shHTML += '</div>';
  shHTML += '<div class="shadow-round" id="v12ShadowRound">R1</div>';
  shHTML += '<div class="shadow-timer" id="v12ShadowTimer">2:00</div>';
  shHTML += '<div class="shadow-phase fight" id="v12ShadowPhase">READY</div>';
  shHTML += '<div class="shadow-combo" id="v12ShadowCombo">시작을 누르세요</div>';
  shHTML += '<div>';
  shHTML += '<button class="shadow-btn" id="v12ShadowStart">▶ 시작</button>';
  shHTML += '<button class="shadow-btn stop" id="v12ShadowStop" style="display:none">■ 정지</button>';
  shHTML += '</div>';
  shHTML += '<div style="margin-top:10px;font-size:12px;color:var(--text-muted)">최고 기록: <span id="v12ShadowBest">'+v12.shadowBest+'</span> 라운드</div>';
  shHTML += '</div></section>';

  // 4. Boxing Hall of Fame
  var hallHTML = '<section class="v12-section"><h2 class="v12-title"><span class="emoji">🏅</span> 복싱 명예의 전당</h2>';
  hallHTML += '<div class="hall-grid" id="v12HallGrid">';
  HALL_OF_FAME.forEach(function(h,i){
    var viewed = (v12.hallViewed.indexOf(i) !== -1) ? ' viewed' : '';
    hallHTML += '<div class="hall-card'+viewed+'" data-hall="'+i+'">';
    hallHTML += '<div class="hall-emoji">🥊</div>';
    hallHTML += '<div class="hall-name">'+h.name+'</div>';
    hallHTML += '<div class="hall-nickname">'+h.nickname+'</div>';
    hallHTML += '<div class="hall-era">'+h.era+'</div>';
    hallHTML += '<div class="hall-record">'+h.record+'</div>';
    hallHTML += '<div class="hall-detail">'+h.desc+'</div>';
    hallHTML += '</div>';
  });
  hallHTML += '</div></section>';

  // 5. Body Composition Analyzer
  var bodyHTML = '<section class="v12-section"><h2 class="v12-title"><span class="emoji">📊</span> 체성분 분석기</h2>';
  bodyHTML += '<div class="v12-card">';
  bodyHTML += '<div class="body-input-row">';
  bodyHTML += '<span class="body-label">키(cm)</span><input type="number" class="body-input" id="v12Height" placeholder="170" min="100" max="250">';
  bodyHTML += '<span class="body-label">몸무게(kg)</span><input type="number" class="body-input" id="v12Weight" placeholder="70" min="30" max="200">';
  bodyHTML += '<span class="body-label">나이</span><input type="number" class="body-input" id="v12Age" placeholder="25" min="10" max="99">';
  bodyHTML += '<button class="body-btn" id="v12BodyCalc">분석</button>';
  bodyHTML += '</div>';
  bodyHTML += '<div class="body-results" id="v12BodyResults" style="display:none">';
  bodyHTML += '<div class="body-metric"><div class="body-metric-val" id="v12BMI" style="color:var(--accent)">-</div><div class="body-metric-lbl">BMI</div></div>';
  bodyHTML += '<div class="body-metric"><div class="body-metric-val" id="v12BMR" style="color:var(--orange)">-</div><div class="body-metric-lbl">BMR (kcal)</div></div>';
  bodyHTML += '<div class="body-metric"><div class="body-metric-val" id="v12TDEE" style="color:var(--green)">-</div><div class="body-metric-lbl">TDEE (kcal)</div></div>';
  bodyHTML += '<div class="body-metric"><div class="body-metric-val" id="v12Category" style="color:var(--blue)">-</div><div class="body-metric-lbl">분류</div></div>';
  bodyHTML += '</div>';
  bodyHTML += '<canvas class="body-canvas" id="v12BodyCanvas" width="460" height="240" style="display:none"></canvas>';
  bodyHTML += '</div></section>';

  // 6. Round Analysis
  var roundHTML = '<section class="v12-section"><h2 class="v12-title"><span class="emoji">📈</span> 라운드별 분석</h2>';
  roundHTML += '<div class="v12-card">';
  roundHTML += '<canvas class="round-canvas" id="v12RoundCanvas" width="500" height="220"></canvas>';
  roundHTML += '<div class="round-summary" id="v12RoundSummary">';
  var appD = loadAppData();
  var sessions = appD ? (appD.sessions || []) : [];
  var totalS = sessions.length;
  var avgS = totalS > 0 ? Math.round(sessions.reduce(function(a,s){return a+(s.score||0)},0)/totalS) : 0;
  var bestS = sessions.reduce(function(a,s){return Math.max(a,s.score||0)},0);
  roundHTML += '<div class="round-stat"><div class="round-stat-val" style="color:var(--accent)">'+totalS+'</div><div class="round-stat-lbl">총 세션</div></div>';
  roundHTML += '<div class="round-stat"><div class="round-stat-val" style="color:var(--orange)">'+avgS+'</div><div class="round-stat-lbl">평균 점수</div></div>';
  roundHTML += '<div class="round-stat"><div class="round-stat-val" style="color:var(--green)">'+bestS+'</div><div class="round-stat-lbl">최고 점수</div></div>';
  roundHTML += '</div></div></section>';

  // 7. Boxing Dictionary
  var dictHTML = '<section class="v12-section"><h2 class="v12-title"><span class="emoji">📖</span> 복싱 용어사전</h2>';
  dictHTML += '<div class="v12-card">';
  dictHTML += '<input type="text" class="dict-search" id="v12DictSearch" placeholder="용어 검색...">';
  var cats = {};
  BOXING_DICT.forEach(function(d){ cats[d.cat] = true; });
  dictHTML += '<div class="dict-cats" id="v12DictCats">';
  dictHTML += '<span class="dict-cat active" data-cat="all">전체</span>';
  Object.keys(cats).forEach(function(c){
    dictHTML += '<span class="dict-cat" data-cat="'+c+'">'+c+'</span>';
  });
  dictHTML += '</div>';
  dictHTML += '<div class="dict-list" id="v12DictList">';
  BOXING_DICT.forEach(function(d,i){
    dictHTML += '<div class="dict-item" data-dict="'+i+'">';
    dictHTML += '<div class="dict-term">'+d.term+'</div>';
    dictHTML += '<div class="dict-def">'+d.def+'</div>';
    dictHTML += '</div>';
  });
  dictHTML += '</div></div></section>';

  // 8. Training Timer Presets
  var timerHTML = '<section class="v12-section"><h2 class="v12-title"><span class="emoji">⏱️</span> 훈련 타이머</h2>';
  timerHTML += '<div class="timer-grid" id="v12TimerGrid">';
  TIMER_PRESETS.forEach(function(t){
    timerHTML += '<div class="timer-card" data-timer="'+t.id+'">';
    timerHTML += '<div class="timer-icon">'+t.icon+'</div>';
    timerHTML += '<div class="timer-name">'+t.name+'</div>';
    timerHTML += '<div class="timer-desc">'+t.desc+'</div>';
    timerHTML += '<div class="timer-meta">';
    timerHTML += '<span class="timer-tag">'+(t.work >= 60 ? Math.floor(t.work/60)+'분' : t.work+'초')+' 운동</span>';
    timerHTML += '<span class="timer-tag">'+(t.rest >= 60 ? Math.floor(t.rest/60)+'분' : t.rest+'초')+' 휴식</span>';
    timerHTML += '<span class="timer-tag">'+t.rounds+'R</span>';
    timerHTML += '</div></div>';
  });
  timerHTML += '</div>';
  timerHTML += '<div id="v12TimerArea" style="display:none;margin-top:16px;text-align:center">';
  timerHTML += '<div class="timer-display" id="v12TimerDisplay">0:00</div>';
  timerHTML += '<div id="v12TimerRoundInfo" style="font-size:14px;color:var(--text-dim);margin-bottom:8px">R1 / 3</div>';
  timerHTML += '<div class="timer-controls">';
  timerHTML += '<button class="timer-ctrl-btn start" id="v12TimerStart">▶ 시작</button>';
  timerHTML += '<button class="timer-ctrl-btn pause" id="v12TimerPause" style="display:none">⏸ 일시정지</button>';
  timerHTML += '<button class="timer-ctrl-btn reset" id="v12TimerReset">↺ 리셋</button>';
  timerHTML += '</div></div></section>';

  // 9. Motivation Board
  var mIdx = v12.motivQuote % MOTIV_QUOTES.length;
  var mq = MOTIV_QUOTES[mIdx];
  var motivHTML = '<section class="v12-section"><h2 class="v12-title"><span class="emoji">💪</span> 동기부여 보드</h2>';
  motivHTML += '<div class="motiv-card" id="v12MotivCard">';
  motivHTML += '<div class="motiv-quote" id="v12MotivQuote">&ldquo;'+mq.quote+'&rdquo;</div>';
  motivHTML += '<div class="motiv-author" id="v12MotivAuthor">- '+mq.author+'</div>';
  motivHTML += '<div class="motiv-goals" id="v12MotivGoals">';
  var today = new Date().toISOString().slice(0,10);
  var goals = ['오늘 훈련하기','퍼치 100회','콤보 10회','스트레칭 하기'];
  goals.forEach(function(g,i){
    var gKey = today+'_goal_'+i;
    var done = v12.seasonProgress[gKey] ? ' done' : '';
    motivHTML += '<span class="motiv-goal'+done+'" data-goal="'+gKey+'">'+g+'</span>';
  });
  motivHTML += '</div></div></section>';

  // 10. Season Challenge
  var curMonth = new Date().getMonth() + 1;
  var se = SEASON_EVENTS[curMonth - 1];
  var seasonHTML = '<section class="v12-section"><h2 class="v12-title"><span class="emoji">'+se.badge+'</span> 시즌 챌린지: '+se.name+'</h2>';
  seasonHTML += '<div class="season-card">';
  seasonHTML += '<div class="season-badge">'+se.badge+'</div>';
  seasonHTML += '<div class="season-name">'+se.name+'</div>';
  seasonHTML += '<div class="season-desc">'+se.desc+'</div>';
  var sDoneCount = 0;
  seasonHTML += '<div class="season-tasks" id="v12SeasonTasks">';
  se.tasks.forEach(function(task,i){
    var sKey = 'season_'+curMonth+'_'+i;
    var done = v12.seasonProgress[sKey] ? true : false;
    if(done) sDoneCount++;
    seasonHTML += '<div class="season-task'+(done?' done':'')+'" data-season="'+sKey+'">';
    seasonHTML += '<div class="season-task-check">'+(done?'✓':'')+'</div>';
    seasonHTML += '<span>'+task+'</span>';
    seasonHTML += '</div>';
  });
  seasonHTML += '</div>';
  var sPct = Math.round(sDoneCount/se.tasks.length*100);
  seasonHTML += '<div class="season-progress-bar"><div class="season-progress-fill" style="width:'+sPct+'%"></div></div>';
  seasonHTML += '<div style="font-size:11px;color:var(--text-muted)">진행률 '+sPct+'%</div>';
  seasonHTML += '</div></section>';

  // 11. Quiz V12
  var quizHTML = '<section class="v12-section"><h2 class="v12-title"><span class="emoji">❓</span> 복싱 퀴즈 v3</h2>';
  quizHTML += '<div class="v12-quiz-panel" id="v12QuizPanel">';
  quizHTML += '<div id="v12QuizContent">';
  quizHTML += '<div style="text-align:center"><button class="shadow-btn" id="v12QuizStartBtn">퀴즈 시작 (15문항)</button></div>';
  quizHTML += '</div></div></section>';

  // Insert all before footer
  var wrapper = document.createElement('div');
  wrapper.innerHTML = nutrHTML + fwHTML + shHTML + hallHTML + bodyHTML + roundHTML + dictHTML + timerHTML + motivHTML + seasonHTML + quizHTML;
  while(wrapper.firstChild){
    container.insertBefore(wrapper.firstChild, footer);
  }
}

// ===== EVENT HANDLERS =====
function bindV12Events(){
  // Nutrition
  document.addEventListener('click', function(e){
    var nutr = e.target.closest('[data-nutr-idx]');
    if(nutr){
      var idx = parseInt(nutr.getAttribute('data-nutr-idx'));
      var pos = v12.nutritionLog.indexOf(idx);
      if(pos === -1){
        v12.nutritionLog.push(idx);
        nutr.classList.add('checked');
      } else {
        v12.nutritionLog.splice(pos,1);
        nutr.classList.remove('checked');
      }
      playSFX12('nutrition');
      checkV12Achievements();
      saveV12(v12);
    }

    // Hall of Fame
    var hall = e.target.closest('[data-hall]');
    if(hall){
      var hi = parseInt(hall.getAttribute('data-hall'));
      hall.classList.toggle('open');
      if(v12.hallViewed.indexOf(hi) === -1){
        v12.hallViewed.push(hi);
        hall.classList.add('viewed');
        playSFX12('hall_view');
        checkV12Achievements();
        saveV12(v12);
      }
    }

    // Dictionary
    var dict = e.target.closest('[data-dict]');
    if(dict){
      dict.classList.toggle('open');
      var di = parseInt(dict.getAttribute('data-dict'));
      if(v12.dictViewed.indexOf(di) === -1){
        v12.dictViewed.push(di);
        playSFX12('dict_open');
        checkV12Achievements();
        saveV12(v12);
      }
    }

    // Dictionary categories
    var dcat = e.target.closest('[data-cat]');
    if(dcat){
      var cat = dcat.getAttribute('data-cat');
      document.querySelectorAll('.dict-cat').forEach(function(c){ c.classList.remove('active'); });
      dcat.classList.add('active');
      filterDictionary(cat, '');
    }

    // Footwork drills
    var fw = e.target.closest('[data-fw]');
    if(fw && fw.classList.contains('fw-drill-btn')){
      var fwId = fw.getAttribute('data-fw');
      document.querySelectorAll('.fw-drill-btn').forEach(function(b){ b.classList.remove('active'); });
      fw.classList.add('active');
      runFootworkDrill(fwId);
    }

    // Timer presets
    var timer = e.target.closest('[data-timer]');
    if(timer && timer.classList.contains('timer-card')){
      var tId = timer.getAttribute('data-timer');
      selectTimerPreset(tId);
    }

    // Motivation goals
    var goal = e.target.closest('[data-goal]');
    if(goal && goal.classList.contains('motiv-goal')){
      var gk = goal.getAttribute('data-goal');
      if(!v12.seasonProgress[gk]){
        v12.seasonProgress[gk] = true;
        goal.classList.add('done');
        playSFX12('motivate');
        saveV12(v12);
      }
    }

    // Season tasks
    var season = e.target.closest('[data-season]');
    if(season && season.classList.contains('season-task')){
      var sk = season.getAttribute('data-season');
      if(!v12.seasonProgress[sk]){
        v12.seasonProgress[sk] = true;
        season.classList.add('done');
        var check = season.querySelector('.season-task-check');
        if(check) check.textContent = '✓';
        playSFX12('season_clear');
        updateSeasonProgress();
        checkV12Achievements();
        saveV12(v12);
      }
    }

    // Motivation card click (next quote)
    if(e.target.closest('#v12MotivCard') && !e.target.closest('[data-goal]')){
      v12.motivQuote = (v12.motivQuote + 1) % MOTIV_QUOTES.length;
      var mq = MOTIV_QUOTES[v12.motivQuote];
      var qEl = document.getElementById('v12MotivQuote');
      var aEl = document.getElementById('v12MotivAuthor');
      if(qEl) qEl.innerHTML = '&ldquo;'+mq.quote+'&rdquo;';
      if(aEl) aEl.textContent = '- '+mq.author;
      playSFX12('motivate');
      saveV12(v12);
    }
  });

  // Dict search
  var ds = document.getElementById('v12DictSearch');
  if(ds){
    ds.addEventListener('input', function(){
      var activeCat = document.querySelector('.dict-cat.active');
      var cat = activeCat ? activeCat.getAttribute('data-cat') : 'all';
      filterDictionary(cat, this.value.toLowerCase());
    });
  }

  // Body composition calc
  var bodyBtn = document.getElementById('v12BodyCalc');
  if(bodyBtn){
    bodyBtn.addEventListener('click', calculateBodyComp);
  }

  // Shadow boxing
  var shStart = document.getElementById('v12ShadowStart');
  var shStop = document.getElementById('v12ShadowStop');
  if(shStart) shStart.addEventListener('click', startShadowBoxing);
  if(shStop) shStop.addEventListener('click', stopShadowBoxing);

  // Timer controls
  var tStart = document.getElementById('v12TimerStart');
  var tPause = document.getElementById('v12TimerPause');
  var tReset = document.getElementById('v12TimerReset');
  if(tStart) tStart.addEventListener('click', startTimer);
  if(tPause) tPause.addEventListener('click', pauseTimer);
  if(tReset) tReset.addEventListener('click', resetTimer);

  // Quiz
  var qStart = document.getElementById('v12QuizStartBtn');
  if(qStart) qStart.addEventListener('click', startQuizV12);

  // Keyboard shortcuts
  document.addEventListener('keydown', function(e){
    if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if(!e.shiftKey) return;
    switch(e.key.toUpperCase()){
      case 'N': scrollToSection('영양'); break;
      case 'F': scrollToSection('퐀워크'); break;
      case 'O': scrollToSection('섭도'); break;
      case 'J': scrollToSection('명예'); break;
      case 'Y': scrollToSection('체성분'); break;
      case 'Z': scrollToSection('용어'); break;
      case 'T': scrollToSection('타이머'); break;
      case 'V': scrollToSection('시즌'); break;
    }
  });
}

function scrollToSection(keyword){
  var sections = document.querySelectorAll('.v12-title');
  for(var i=0;i<sections.length;i++){
    if(sections[i].textContent.indexOf(keyword) !== -1){
      sections[i].scrollIntoView({behavior:'smooth',block:'start'});
      break;
    }
  }
}

// ===== DICTIONARY FILTER =====
function filterDictionary(cat, query){
  var items = document.querySelectorAll('.dict-item');
  items.forEach(function(item,i){
    var d = BOXING_DICT[i];
    var catMatch = (cat === 'all' || d.cat === cat);
    var qMatch = !query || d.term.toLowerCase().indexOf(query) !== -1 || d.def.indexOf(query) !== -1;
    item.style.display = (catMatch && qMatch) ? '' : 'none';
  });
}

// ===== FOOTWORK DRILL =====
var fwAnimId = null;
function runFootworkDrill(drillId){
  var drill = FOOTWORK_DRILLS.find(function(d){ return d.id === drillId; });
  if(!drill) return;
  playSFX12('footwork');

  var canvas = document.getElementById('v12FwCanvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  var centerX = W/2, centerY = H/2;
  var stepIdx = 0;
  var stepInterval = drill.duration * 1000 / drill.steps.length;
  var startTime = Date.now();

  if(fwAnimId) cancelAnimationFrame(fwAnimId);

  function drawFrame(){
    var elapsed = Date.now() - startTime;
    var currentStep = Math.floor(elapsed / stepInterval);
    if(currentStep >= drill.steps.length){
      v12.footworkDrills[drillId] = true;
      var btn = document.querySelector('[data-fw="'+drillId+'"]');
      if(btn) btn.classList.add('done');
      playSFX12('footwork_step');
      checkV12Achievements();
      saveV12(v12);
      drawStaticFootwork(ctx, W, H, drill.name + ' 완료!');
      return;
    }

    ctx.clearRect(0,0,W,H);

    // Ring
    ctx.strokeStyle = 'rgba(255,68,68,0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 120, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, Math.PI*2);
    ctx.stroke();

    // Cross lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.moveTo(centerX,centerY-140);ctx.lineTo(centerX,centerY+140);ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX-140,centerY);ctx.lineTo(centerX+140,centerY);ctx.stroke();

    // Direction labels
    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.textAlign = 'center';
    ctx.fillText('앞',centerX,centerY-130);
    ctx.fillText('뒤',centerX,centerY+140);
    ctx.fillText('좌',centerX-135,centerY+4);
    ctx.fillText('우',centerX+135,centerY+4);

    var step = drill.steps[currentStep];
    var dx=0, dy=0;
    switch(step){
      case 'F': dy=-50; break;
      case 'B': dy=50; break;
      case 'L': dx=-50; break;
      case 'R': dx=50; break;
      case 'FL': dx=-35;dy=-35; break;
      case 'FR': dx=35;dy=-35; break;
      case 'BL': dx=-35;dy=35; break;
      case 'BR': dx=35;dy=35; break;
      case 'PL': dx=-30;dy=-20; break;
      case 'PR': dx=30;dy=-20; break;
    }

    // Animate between steps
    var stepProgress = (elapsed % stepInterval) / stepInterval;
    var animDx = dx * stepProgress;
    var animDy = dy * stepProgress;

    // Trail
    ctx.fillStyle = 'rgba(255,68,68,0.1)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI*2);
    ctx.fill();

    // Feet
    var footX = centerX + animDx;
    var footY = centerY + animDy;

    // Left foot
    ctx.fillStyle = '#FF4444';
    ctx.beginPath();
    ctx.ellipse(footX-12, footY, 8, 14, -0.2, 0, Math.PI*2);
    ctx.fill();

    // Right foot
    ctx.fillStyle = '#FF6666';
    ctx.beginPath();
    ctx.ellipse(footX+12, footY, 8, 14, 0.2, 0, Math.PI*2);
    ctx.fill();

    // Direction arrow
    if(dx !== 0 || dy !== 0){
      var angle = Math.atan2(dy, dx);
      var arrowX = centerX + dx*1.8;
      var arrowY = centerY + dy*1.8;
      ctx.strokeStyle = 'rgba(255,215,0,0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(arrowX, arrowY);
      ctx.stroke();

      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.moveTo(arrowX + 10*Math.cos(angle), arrowY + 10*Math.sin(angle));
      ctx.lineTo(arrowX + 8*Math.cos(angle+2.5), arrowY + 8*Math.sin(angle+2.5));
      ctx.lineTo(arrowX + 8*Math.cos(angle-2.5), arrowY + 8*Math.sin(angle-2.5));
      ctx.fill();
    }

    // Step info
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(drill.name, centerX, 30);

    ctx.font = '13px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText('Step '+(currentStep+1)+'/'+drill.steps.length+' - '+step, centerX, H-20);

    // Progress bar
    var pct = (currentStep+stepProgress)/drill.steps.length;
    ctx.fillStyle = 'rgba(255,68,68,0.3)';
    ctx.fillRect(20, H-10, W-40, 4);
    ctx.fillStyle = '#FF4444';
    ctx.fillRect(20, H-10, (W-40)*pct, 4);

    fwAnimId = requestAnimationFrame(drawFrame);
  }
  drawFrame();
}

function drawStaticFootwork(ctx, W, H, text){
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle = 'rgba(255,68,68,0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(W/2,H/2,120,0,Math.PI*2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(W/2,H/2,60,0,Math.PI*2);
  ctx.stroke();

  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#FF4444';
  ctx.textAlign = 'center';
  ctx.fillText(text, W/2, H/2);
}

// ===== SHADOW BOXING =====
var shadowTimer = null;
var shadowState = {round:1,time:120,phase:'fight',running:false,comboIdx:0};

function startShadowBoxing(){
  shadowState = {round:1,time:120,phase:'fight',running:true,comboIdx:0};
  document.getElementById('v12ShadowStart').style.display = 'none';
  document.getElementById('v12ShadowStop').style.display = 'inline-block';
  playSFX12('shadow_bell');
  updateShadowDisplay();
  shadowTimer = setInterval(shadowTick, 1000);
}

function stopShadowBoxing(){
  shadowState.running = false;
  clearInterval(shadowTimer);
  document.getElementById('v12ShadowStart').style.display = 'inline-block';
  document.getElementById('v12ShadowStop').style.display = 'none';
  if(shadowState.round-1 > v12.shadowBest){
    v12.shadowBest = shadowState.round-1;
    document.getElementById('v12ShadowBest').textContent = v12.shadowBest;
  }
  v12.shadowRounds += shadowState.round - 1;
  checkV12Achievements();
  saveV12(v12);
}

function shadowTick(){
  if(!shadowState.running) return;
  shadowState.time--;
  if(shadowState.time <= 0){
    if(shadowState.phase === 'fight'){
      if(shadowState.round >= 8){
        stopShadowBoxing();
        return;
      }
      shadowState.phase = 'rest';
      shadowState.time = 30;
      playSFX12('shadow_bell');
    } else {
      shadowState.round++;
      shadowState.phase = 'fight';
      shadowState.time = 120;
      playSFX12('shadow_bell');
    }
  }
  if(shadowState.phase === 'fight' && shadowState.time % 8 === 0){
    shadowState.comboIdx = Math.floor(Math.random() * SHADOW_COMBOS.length);
    playSFX12('shadow_combo');
  }
  updateShadowDisplay();
}

function updateShadowDisplay(){
  var roundEl = document.getElementById('v12ShadowRound');
  var timerEl = document.getElementById('v12ShadowTimer');
  var phaseEl = document.getElementById('v12ShadowPhase');
  var comboEl = document.getElementById('v12ShadowCombo');
  var dots = document.querySelectorAll('.shadow-dot');

  if(roundEl) roundEl.textContent = 'R'+shadowState.round;
  if(timerEl){
    var m = Math.floor(shadowState.time/60);
    var s = shadowState.time%60;
    timerEl.textContent = m+':'+(s<10?'0':'')+s;
  }
  if(phaseEl){
    phaseEl.textContent = shadowState.phase === 'fight' ? 'FIGHT!' : 'REST';
    phaseEl.className = 'shadow-phase '+(shadowState.phase === 'fight' ? 'fight' : 'rest');
  }
  if(comboEl){
    comboEl.textContent = shadowState.phase === 'fight' ? SHADOW_COMBOS[shadowState.comboIdx][0] : '휴식 중...';
  }

  dots.forEach(function(dot){
    var r = parseInt(dot.getAttribute('data-round'));
    dot.className = 'shadow-dot';
    if(r < shadowState.round) dot.classList.add('done');
    if(r === shadowState.round) dot.classList.add('current');
  });
}

// ===== BODY COMPOSITION =====
function calculateBodyComp(){
  var h = parseFloat(document.getElementById('v12Height').value);
  var w = parseFloat(document.getElementById('v12Weight').value);
  var age = parseInt(document.getElementById('v12Age').value);
  if(!h || !w || !age || h<100 || w<30) return;

  playSFX12('body_scan');
  var bmi = w / ((h/100)*(h/100));
  var bmr = 88.362 + (13.397*w) + (4.799*h) - (5.677*age);
  var tdee = Math.round(bmr * 1.55);

  var category = '정상';
  if(bmi < 18.5) category = '저체중';
  else if(bmi < 25) category = '정상';
  else if(bmi < 30) category = '과체중';
  else category = '비만';

  document.getElementById('v12BMI').textContent = bmi.toFixed(1);
  document.getElementById('v12BMR').textContent = Math.round(bmr);
  document.getElementById('v12TDEE').textContent = tdee;
  document.getElementById('v12Category').textContent = category;
  document.getElementById('v12BodyResults').style.display = 'flex';

  v12.bodyComps.push({date:new Date().toISOString().slice(0,10),h:h,w:w,bmi:bmi.toFixed(1)});
  if(v12.bodyComps.length > 30) v12.bodyComps = v12.bodyComps.slice(-30);
  checkV12Achievements();
  saveV12(v12);

  drawBodyChart();
}

function drawBodyChart(){
  var canvas = document.getElementById('v12BodyCanvas');
  if(!canvas || v12.bodyComps.length < 1) return;
  canvas.style.display = 'block';
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);

  var data = v12.bodyComps.slice(-10);
  var maxBMI = Math.max.apply(null, data.map(function(d){return parseFloat(d.bmi);}));
  var minBMI = Math.min.apply(null, data.map(function(d){return parseFloat(d.bmi);}));
  var range = Math.max(maxBMI - minBMI, 2);

  // Background zones
  var pad = {t:30,b:40,l:50,r:20};
  var cW = W - pad.l - pad.r;
  var cH = H - pad.t - pad.b;

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for(var i=0;i<=4;i++){
    var y = pad.t + cH * (i/4);
    ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();
    ctx.font = '10px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.textAlign = 'right';
    ctx.fillText((maxBMI - range*i/4).toFixed(1), pad.l-8, y+4);
  }

  // Line chart
  ctx.strokeStyle = '#FF4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  data.forEach(function(d,i){
    var x = pad.l + (i/(data.length-1||1))*cW;
    var y = pad.t + cH * (1 - (parseFloat(d.bmi)-minBMI)/range);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();

  // Points
  data.forEach(function(d,i){
    var x = pad.l + (i/(data.length-1||1))*cW;
    var y = pad.t + cH * (1 - (parseFloat(d.bmi)-minBMI)/range);
    ctx.fillStyle = '#FF4444';
    ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();
    ctx.font = '9px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.fillText(d.date.slice(5), x, H-pad.b+14);
  });

  // Title
  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#FF4444';
  ctx.textAlign = 'center';
  ctx.fillText('BMI 추이', W/2, 18);
}

// ===== ROUND ANALYSIS CHART =====
function drawRoundChart(){
  var canvas = document.getElementById('v12RoundCanvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);

  var appD = loadAppData();
  var sessions = (appD && appD.sessions) ? appD.sessions.slice(-10) : [];
  if(sessions.length === 0){
    ctx.font = '14px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.textAlign = 'center';
    ctx.fillText('훈련 기록이 없습니다', W/2, H/2);
    return;
  }

  var pad = {t:30,b:40,l:50,r:20};
  var cW = W - pad.l - pad.r;
  var cH = H - pad.t - pad.b;

  var scores = sessions.map(function(s){return s.score || 0;});
  var maxS = Math.max.apply(null, scores) || 100;

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for(var i=0;i<=4;i++){
    var y = pad.t + cH*(i/4);
    ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();
    ctx.font = '10px sans-serif';ctx.fillStyle='rgba(255,255,255,0.3)';ctx.textAlign='right';
    ctx.fillText(Math.round(maxS*(1-i/4)), pad.l-8, y+4);
  }

  // Gradient fill
  var grad = ctx.createLinearGradient(0, pad.t, 0, pad.t+cH);
  grad.addColorStop(0, 'rgba(255,68,68,0.3)');
  grad.addColorStop(1, 'rgba(255,68,68,0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(pad.l, pad.t+cH);
  scores.forEach(function(s,i){
    var x = pad.l + (i/(scores.length-1||1))*cW;
    var y = pad.t + cH*(1-s/maxS);
    ctx.lineTo(x,y);
  });
  ctx.lineTo(pad.l + cW, pad.t+cH);
  ctx.closePath();
  ctx.fill();

  // Line
  ctx.strokeStyle = '#FF4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  scores.forEach(function(s,i){
    var x = pad.l + (i/(scores.length-1||1))*cW;
    var y = pad.t + cH*(1-s/maxS);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();

  // Points + labels
  scores.forEach(function(s,i){
    var x = pad.l + (i/(scores.length-1||1))*cW;
    var y = pad.t + cH*(1-s/maxS);
    ctx.fillStyle = '#FF4444';
    ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();
    ctx.font = '9px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.fillText('#'+(i+1), x, H-pad.b+14);
  });

  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#FF4444';
  ctx.textAlign = 'center';
  ctx.fillText('최근 10세션 점수 추이', W/2, 18);
}

// ===== TIMER =====
var timerState = {preset:null,remaining:0,round:1,phase:'work',running:false,interval:null};

function selectTimerPreset(id){
  var preset = TIMER_PRESETS.find(function(t){return t.id===id;});
  if(!preset) return;
  timerState.preset = preset;
  timerState.remaining = preset.work;
  timerState.round = 1;
  timerState.phase = 'work';
  timerState.running = false;

  document.querySelectorAll('.timer-card').forEach(function(c){c.classList.remove('active');});
  var card = document.querySelector('[data-timer="'+id+'"]');
  if(card) card.classList.add('active');

  document.getElementById('v12TimerArea').style.display = 'block';
  document.getElementById('v12TimerStart').style.display = 'inline-block';
  document.getElementById('v12TimerPause').style.display = 'none';
  updateTimerDisplay();
  playSFX12('timer_tick');
}

function startTimer(){
  if(!timerState.preset || timerState.running) return;
  timerState.running = true;
  document.getElementById('v12TimerStart').style.display = 'none';
  document.getElementById('v12TimerPause').style.display = 'inline-block';
  timerState.interval = setInterval(timerTick, 1000);
}

function pauseTimer(){
  timerState.running = false;
  clearInterval(timerState.interval);
  document.getElementById('v12TimerStart').style.display = 'inline-block';
  document.getElementById('v12TimerPause').style.display = 'none';
}

function resetTimer(){
  timerState.running = false;
  clearInterval(timerState.interval);
  if(timerState.preset){
    timerState.remaining = timerState.preset.work;
    timerState.round = 1;
    timerState.phase = 'work';
  }
  document.getElementById('v12TimerStart').style.display = 'inline-block';
  document.getElementById('v12TimerPause').style.display = 'none';
  updateTimerDisplay();
}

function timerTick(){
  timerState.remaining--;
  if(timerState.remaining <= 0){
    playSFX12('timer_done');
    if(timerState.phase === 'work'){
      if(timerState.round >= timerState.preset.rounds){
        pauseTimer();
        updateTimerDisplay();
        return;
      }
      timerState.phase = 'rest';
      timerState.remaining = timerState.preset.rest;
    } else {
      timerState.round++;
      timerState.phase = 'work';
      timerState.remaining = timerState.preset.work;
    }
  }
  updateTimerDisplay();
}

function updateTimerDisplay(){
  var disp = document.getElementById('v12TimerDisplay');
  var info = document.getElementById('v12TimerRoundInfo');
  if(disp){
    var m = Math.floor(timerState.remaining/60);
    var s = timerState.remaining%60;
    disp.textContent = m+':'+(s<10?'0':'')+s;
    disp.style.color = timerState.phase === 'work' ? 'var(--accent)' : 'var(--green)';
  }
  if(info && timerState.preset){
    info.textContent = (timerState.phase==='work'?'FIGHT':'REST')+' - R'+timerState.round+' / '+timerState.preset.rounds;
  }
}

// ===== SEASON PROGRESS UPDATE =====
function updateSeasonProgress(){
  var curMonth = new Date().getMonth() + 1;
  var se = SEASON_EVENTS[curMonth - 1];
  var done = 0;
  se.tasks.forEach(function(t,i){
    var sKey = 'season_'+curMonth+'_'+i;
    if(v12.seasonProgress[sKey]) done++;
  });
  var pct = Math.round(done/se.tasks.length*100);
  var fill = document.querySelector('.season-progress-fill');
  if(fill) fill.style.width = pct+'%';
}

// ===== QUIZ V12 =====
var quizV12State = {idx:0,score:0,answered:false};

function startQuizV12(){
  quizV12State = {idx:0,score:0,answered:false};
  playSFX12('quiz_v12');
  renderQuizV12Question();
}

function renderQuizV12Question(){
  var panel = document.getElementById('v12QuizContent');
  if(!panel) return;
  if(quizV12State.idx >= QUIZ_V12.length){
    var pct = Math.round(quizV12State.score/QUIZ_V12.length*100);
    panel.innerHTML = '<div class="v12-quiz-result"><div style="font-size:24px;margin-bottom:8px">퀴즈 완료!</div>';
    panel.innerHTML += '<div class="v12-quiz-score">'+quizV12State.score+' / '+QUIZ_V12.length+'</div>';
    panel.innerHTML += '<div style="margin:8px 0;font-size:14px;color:var(--text-dim)">정답률 '+pct+'%</div>';
    panel.innerHTML += '<button class="shadow-btn" onclick="document.getElementById(\'v12QuizStartBtn\').click()">다시 풀기</button></div>';
    v12.quizV12Scores[new Date().toISOString().slice(0,10)] = quizV12State.score;
    if(quizV12State.score === QUIZ_V12.length) checkV12Achievements();
    saveV12(v12);
    return;
  }

  var q = QUIZ_V12[quizV12State.idx];
  var html = '<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">Q'+(quizV12State.idx+1)+'/'+QUIZ_V12.length+'</div>';
  html += '<div class="v12-quiz-q">'+q.q+'</div>';
  html += '<div class="v12-quiz-opts">';
  q.opts.forEach(function(opt,i){
    html += '<div class="v12-quiz-opt" data-qopt="'+i+'">'+opt+'</div>';
  });
  html += '</div>';
  panel.innerHTML = html;
  quizV12State.answered = false;

  panel.querySelectorAll('[data-qopt]').forEach(function(btn){
    btn.addEventListener('click', function(){
      if(quizV12State.answered) return;
      quizV12State.answered = true;
      var chosen = parseInt(this.getAttribute('data-qopt'));
      var correct = QUIZ_V12[quizV12State.idx].ans;
      if(chosen === correct){
        this.classList.add('correct');
        quizV12State.score++;
      } else {
        this.classList.add('wrong');
        panel.querySelector('[data-qopt="'+correct+'"]').classList.add('correct');
      }
      setTimeout(function(){
        quizV12State.idx++;
        renderQuizV12Question();
      }, 1200);
    });
  });
}

// ===== ACHIEVEMENTS =====
function checkV12Achievements(){
  var appD = loadAppData();
  if(!appD) appD = {};
  if(!appD.achievements) appD.achievements = {};

  var checks = {
    nutrition_guide: v12.nutritionLog.length >= 1,
    nutrition_all: v12.nutritionLog.length >= 12,
    footwork_first: Object.keys(v12.footworkDrills).length >= 1,
    footwork_master: Object.keys(v12.footworkDrills).length >= 6,
    shadow_3: v12.shadowRounds >= 3,
    shadow_8: v12.shadowRounds >= 8 || v12.shadowBest >= 8,
    hall_visit: v12.hallViewed.length >= 1,
    hall_all: v12.hallViewed.length >= 12,
    body_first: v12.bodyComps.length >= 1,
    dict_reader: v12.dictViewed.length >= 20,
    quiz_v12_perfect: (function(){
      for(var k in v12.quizV12Scores){ if(v12.quizV12Scores[k]===QUIZ_V12.length) return true; }
      return false;
    })(),
    season_clear: (function(){
      var m = new Date().getMonth()+1;
      for(var i=0;i<4;i++){
        if(!v12.seasonProgress['season_'+m+'_'+i]) return false;
      }
      return true;
    })()
  };

  V12_ACHIEVEMENTS.forEach(function(a){
    if(checks[a.id] && !appD.achievements[a.id]){
      appD.achievements[a.id] = new Date().toISOString();
      showToast(a.icon+' '+a.name+' 해금!');
      playSFX12('achieve_v12');
    }
  });

  try { localStorage.setItem('boxingTrainerData', JSON.stringify(appD)); } catch(e){}
}

function showToast(msg){
  var container = document.getElementById('toastContainer');
  if(!container) return;
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(function(){ toast.remove(); }, 3000);
}

// ===== QUICK ACTION BUTTONS =====
function addV12QuickActions(){
  var container = document.querySelector('.container');
  if(!container) return;
  var existing = document.getElementById('v12QuickActions');
  if(existing) return;

  var qDiv = document.createElement('div');
  qDiv.id = 'v12QuickActions';
  qDiv.style.cssText = 'position:fixed;left:8px;top:50%;transform:translateY(-50%);z-index:99;display:flex;flex-direction:column;gap:6px;';

  var actions = [
    {icon:'🍌',label:'영양',key:'영양'},
    {icon:'👟',label:'퐀워크',key:'퐀워크'},
    {icon:'👤',label:'섭도복싱',key:'섭도'},
    {icon:'🏅',label:'명예의전당',key:'명예'},
    {icon:'📊',label:'체성분',key:'체성분'},
    {icon:'📖',label:'용어사전',key:'용어'},
    {icon:'⏱️',label:'타이머',key:'타이머'},
    {icon:'❓',label:'퀴즈',key:'퀴즈'}
  ];

  actions.forEach(function(a){
    var btn = document.createElement('button');
    btn.style.cssText = 'width:36px;height:36px;border-radius:50%;background:var(--glass);border:1px solid var(--glass-border);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;color:var(--text-dim);';
    btn.textContent = a.icon;
    btn.title = a.label;
    btn.addEventListener('click', function(){
      scrollToSection(a.key);
    });
    btn.addEventListener('mouseenter', function(){
      this.style.borderColor = 'var(--accent)';
      this.style.transform = 'scale(1.15)';
    });
    btn.addEventListener('mouseleave', function(){
      this.style.borderColor = 'var(--glass-border)';
      this.style.transform = 'scale(1)';
    });
    qDiv.appendChild(btn);
  });

  document.body.appendChild(qDiv);
}

// ===== INIT =====
function initV12(){
  injectV12CSS();
  buildV12Sections();
  bindV12Events();
  drawRoundChart();
  addV12QuickActions();

  // Initial footwork canvas
  var fwCanvas = document.getElementById('v12FwCanvas');
  if(fwCanvas){
    drawStaticFootwork(fwCanvas.getContext('2d'), fwCanvas.width, fwCanvas.height, '드릴을 선택하세요');
  }
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initV12);
} else {
  initV12();
}

})();
