// Boxing Trainer Pro v13_patch.js - NEXTERA+PRISM Auto Enhancement Module
// Jump Rope Trainer 8 Patterns Canvas, Fight Strategy Playbook 12,
// Defensive Drill Matrix 10 Canvas, Fight Night Gauntlet 5 Opponents,
// Recovery Tracker Canvas, Ring Movement Patterns 8 Canvas,
// Weekly Progress Report Radar Canvas, Boxing BGM Playlist 10 Tracks,
// Quiz +15 (60->75), +12 Achievements (70->82), SFX 12, Keyboard +8
(function(){
'use strict';

var STORAGE_KEY = 'boxingTrainerData';
var V13KEY = 'boxingV13Patch';

function loadAppData(){
  try { var r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch(e){ return null; }
}
function loadV13(){
  try {
    var r = localStorage.getItem(V13KEY);
    if(!r) return defV13();
    var p = JSON.parse(r), d = defV13();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV13(); }
}
function saveV13(d){ try { localStorage.setItem(V13KEY, JSON.stringify(d)); } catch(e){} }
function defV13(){
  return {
    ropePatterns: {},
    ropeTotal: 0,
    ropeBest: 0,
    strategyViewed: [],
    defenseDrills: {},
    fightNight: { wins: 0, best: 0, attempts: 0 },
    recovery: [],
    ringPatterns: {},
    bgmPlaying: false,
    bgmTrack: 0,
    quizV13Scores: {},
    weeklyReports: []
  };
}

var v13 = loadV13();

// ===== SFX ENGINE V13 =====
function playSFX13(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'rope_jump':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(600,t);o.frequency.exponentialRampToValueAtTime(900,t+0.04);
        g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.06);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.06);break;
      case 'rope_miss':
        var o2=ctx.createOscillator(),g2=ctx.createGain();
        o2.type='sawtooth';o2.frequency.setValueAtTime(200,t);o2.frequency.exponentialRampToValueAtTime(80,t+0.15);
        g2.gain.setValueAtTime(0.1,t);g2.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o2.connect(g2).connect(ctx.destination);o2.start(t);o2.stop(t+0.15);break;
      case 'rope_complete':
        [523,659,784,1047].forEach(function(f,j){
          var o3=ctx.createOscillator(),g3=ctx.createGain();
          o3.type='sine';o3.frequency.value=f;
          g3.gain.setValueAtTime(0.1,t+j*0.08);g3.gain.exponentialRampToValueAtTime(0.001,t+j*0.08+0.25);
          o3.connect(g3).connect(ctx.destination);o3.start(t+j*0.08);o3.stop(t+j*0.08+0.25);
        });break;
      case 'strategy':
        var o4=ctx.createOscillator(),g4=ctx.createGain();
        o4.type='triangle';o4.frequency.setValueAtTime(440,t);o4.frequency.linearRampToValueAtTime(660,t+0.2);
        g4.gain.setValueAtTime(0.08,t);g4.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o4.connect(g4).connect(ctx.destination);o4.start(t);o4.stop(t+0.25);break;
      case 'defense_block':
        var o5=ctx.createOscillator(),g5=ctx.createGain();
        o5.type='square';o5.frequency.setValueAtTime(120,t);o5.frequency.exponentialRampToValueAtTime(60,t+0.08);
        g5.gain.setValueAtTime(0.12,t);g5.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        o5.connect(g5).connect(ctx.destination);o5.start(t);o5.stop(t+0.1);break;
      case 'defense_slip':
        var o5b=ctx.createOscillator(),g5b=ctx.createGain();
        o5b.type='sine';o5b.frequency.setValueAtTime(800,t);o5b.frequency.exponentialRampToValueAtTime(400,t+0.1);
        g5b.gain.setValueAtTime(0.08,t);g5b.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o5b.connect(g5b).connect(ctx.destination);o5b.start(t);o5b.stop(t+0.12);break;
      case 'fight_bell':
        [880,1047,1319].forEach(function(f,j){
          var o6=ctx.createOscillator(),g6=ctx.createGain();
          o6.type='triangle';o6.frequency.value=f;
          g6.gain.setValueAtTime(0.12,t+j*0.06);g6.gain.exponentialRampToValueAtTime(0.001,t+j*0.06+0.3);
          o6.connect(g6).connect(ctx.destination);o6.start(t+j*0.06);o6.stop(t+j*0.06+0.3);
        });break;
      case 'fight_ko':
        [262,330,392,523,659,784].forEach(function(f,j){
          var o7=ctx.createOscillator(),g7=ctx.createGain();
          o7.type='sawtooth';o7.frequency.value=f;
          g7.gain.setValueAtTime(0.08,t+j*0.04);g7.gain.exponentialRampToValueAtTime(0.001,t+j*0.04+0.2);
          o7.connect(g7).connect(ctx.destination);o7.start(t+j*0.04);o7.stop(t+j*0.04+0.2);
        });break;
      case 'recovery':
        [392,494,587].forEach(function(f,j){
          var o8=ctx.createOscillator(),g8=ctx.createGain();
          o8.type='sine';o8.frequency.value=f;
          g8.gain.setValueAtTime(0.06,t+j*0.15);g8.gain.exponentialRampToValueAtTime(0.001,t+j*0.15+0.4);
          o8.connect(g8).connect(ctx.destination);o8.start(t+j*0.15);o8.stop(t+j*0.15+0.4);
        });break;
      case 'ring_move':
        var o9=ctx.createOscillator(),g9=ctx.createGain();
        o9.type='sine';o9.frequency.setValueAtTime(330,t);o9.frequency.linearRampToValueAtTime(550,t+0.12);
        g9.gain.setValueAtTime(0.08,t);g9.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o9.connect(g9).connect(ctx.destination);o9.start(t);o9.stop(t+0.15);break;
      case 'report_open':
        var oR=ctx.createOscillator(),gR=ctx.createGain();
        oR.type='sine';oR.frequency.setValueAtTime(523,t);oR.frequency.linearRampToValueAtTime(784,t+0.15);
        gR.gain.setValueAtTime(0.07,t);gR.gain.exponentialRampToValueAtTime(0.001,t+0.2);
        oR.connect(gR).connect(ctx.destination);oR.start(t);oR.stop(t+0.2);break;
      case 'quiz_v13':
        [659,784,988].forEach(function(f,j){
          var oq=ctx.createOscillator(),gq=ctx.createGain();
          oq.type='sine';oq.frequency.value=f;
          gq.gain.setValueAtTime(0.1,t+j*0.08);gq.gain.exponentialRampToValueAtTime(0.001,t+j*0.08+0.2);
          oq.connect(gq).connect(ctx.destination);oq.start(t+j*0.08);oq.stop(t+j*0.08+0.2);
        });break;
    }
  } catch(e){}
}

// ===== CSS V13 =====
function injectV13CSS(){
  var s = document.createElement('style');
  s.textContent = '\
.v13-section{margin:24px 0;animation:slideUp 0.5s ease-out both}\
.v13-card{background:var(--glass);border:1px solid var(--glass-border);\
border-radius:var(--radius);padding:20px;backdrop-filter:blur(12px);transition:all 0.3s}\
.v13-card:hover{border-color:rgba(255,68,68,0.3);transform:translateY(-2px)}\
.v13-title{font-size:18px;font-weight:800;margin-bottom:14px;\
display:flex;align-items:center;gap:8px;letter-spacing:0.5px}\
.v13-title .emoji{font-size:22px}\
.v13-grid-2{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}\
.v13-grid-3{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}\
.v13-grid-4{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}\
.rope-canvas{width:100%;max-width:420px;height:350px;margin:12px auto;display:block;\
border-radius:12px;background:var(--surface)}\
.rope-patterns{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:12px 0}\
.rope-btn{padding:8px 14px;border:1px solid var(--glass-border);border-radius:20px;\
background:var(--glass);font-size:11px;font-weight:700;color:var(--text-dim);cursor:pointer;\
transition:all 0.2s}\
.rope-btn.active{border-color:var(--accent);color:var(--accent);background:var(--accent-soft)}\
.rope-btn.done{border-color:var(--green);color:var(--green)}\
.rope-stats{display:flex;gap:12px;justify-content:center;margin:10px 0;flex-wrap:wrap}\
.rope-stat{text-align:center;padding:6px 14px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:10px;min-width:60px}\
.rope-stat-val{font-size:18px;font-weight:900}\
.rope-stat-lbl{font-size:9px;color:var(--text-muted);margin-top:2px}\
.rope-timer{font-size:48px;font-weight:900;font-family:monospace;color:var(--orange);text-align:center;margin:8px 0}\
.rope-count{font-size:36px;font-weight:900;color:var(--accent);text-align:center}\
.rope-ctrl{padding:12px 28px;border:none;border-radius:12px;background:var(--accent);color:#fff;\
font-size:15px;font-weight:700;cursor:pointer;transition:all 0.2s;margin:8px 4px}\
.rope-ctrl:hover{filter:brightness(1.1)}\
.rope-ctrl.stop{background:var(--orange)}\
.strat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px}\
.strat-card{padding:16px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:14px;cursor:pointer;transition:all 0.3s}\
.strat-card:hover{border-color:var(--blue);transform:translateY(-2px)}\
.strat-card.viewed{border-color:rgba(59,130,246,0.3)}\
.strat-icon{font-size:32px;margin-bottom:6px}\
.strat-name{font-size:14px;font-weight:800;margin-bottom:4px}\
.strat-type{font-size:10px;padding:2px 8px;border-radius:10px;display:inline-block;margin-bottom:6px;\
font-weight:700}\
.strat-type.offense{background:rgba(255,68,68,0.15);color:var(--accent)}\
.strat-type.defense{background:rgba(59,130,246,0.15);color:var(--blue)}\
.strat-type.counter{background:rgba(168,85,247,0.15);color:var(--purple)}\
.strat-type.movement{background:rgba(34,197,94,0.15);color:var(--green)}\
.strat-desc{font-size:12px;color:var(--text-dim);line-height:1.5}\
.strat-detail{display:none;margin-top:10px;padding-top:10px;border-top:1px solid var(--glass-border);\
font-size:11px;color:var(--text-dim);line-height:1.6}\
.strat-card.open .strat-detail{display:block}\
.def-canvas{width:100%;max-width:420px;height:420px;margin:12px auto;display:block;\
border-radius:12px;background:var(--surface)}\
.def-drills{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:12px 0}\
.def-btn{padding:8px 14px;border:1px solid var(--glass-border);border-radius:20px;\
background:var(--glass);font-size:11px;font-weight:700;color:var(--text-dim);cursor:pointer;\
transition:all 0.2s}\
.def-btn.active{border-color:var(--blue);color:var(--blue);background:rgba(59,130,246,0.1)}\
.def-btn.done{border-color:var(--green);color:var(--green)}\
.def-stats{display:flex;gap:12px;justify-content:center;margin:10px 0;flex-wrap:wrap}\
.def-stat{text-align:center;padding:6px 14px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:10px;min-width:60px}\
.def-stat-val{font-size:18px;font-weight:900}\
.def-stat-lbl{font-size:9px;color:var(--text-muted);margin-top:2px}\
.fight-arena{padding:20px;background:linear-gradient(135deg,rgba(255,68,68,0.08),rgba(0,0,0,0.1));\
border:1px solid rgba(255,68,68,0.2);border-radius:var(--radius);text-align:center}\
.fight-vs{font-size:48px;font-weight:900;color:var(--accent);margin:8px 0}\
.fight-opponent{font-size:20px;font-weight:800;margin:8px 0}\
.fight-hp{height:14px;background:var(--surface);border-radius:7px;overflow:hidden;margin:8px 0}\
.fight-hp-fill{height:100%;border-radius:7px;transition:width 0.5s ease-out}\
.fight-hp-fill.player{background:linear-gradient(90deg,var(--green),var(--blue))}\
.fight-hp-fill.enemy{background:linear-gradient(90deg,var(--accent),var(--orange))}\
.fight-hp-label{font-size:11px;color:var(--text-dim);margin-bottom:2px;text-align:left}\
.fight-actions{display:flex;gap:8px;justify-content:center;margin:12px 0;flex-wrap:wrap}\
.fight-act{padding:10px 18px;border:none;border-radius:10px;font-size:13px;font-weight:700;\
cursor:pointer;transition:all 0.2s;color:#fff}\
.fight-act.jab{background:#e74c3c}\
.fight-act.cross{background:#e67e22}\
.fight-act.hook{background:#3498db}\
.fight-act.upper{background:#9b59b6}\
.fight-act.dodge{background:#27ae60}\
.fight-act.guard{background:#7f8c8d}\
.fight-act:hover{filter:brightness(1.15);transform:scale(1.05)}\
.fight-act:disabled{opacity:0.4;cursor:not-allowed;transform:none}\
.fight-log{max-height:150px;overflow-y:auto;text-align:left;padding:10px;background:var(--surface);\
border-radius:10px;margin-top:12px;font-size:11px;color:var(--text-dim);line-height:1.8}\
.fight-result{font-size:28px;font-weight:900;margin:16px 0}\
.fight-result.win{color:var(--gold)}\
.fight-result.lose{color:var(--accent)}\
.recov-canvas{width:100%;max-width:460px;height:220px;margin:12px auto;display:block;\
border-radius:12px;background:var(--surface)}\
.recov-inputs{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin:12px 0}\
.recov-group{display:flex;flex-direction:column;align-items:center;gap:4px}\
.recov-label{font-size:10px;color:var(--text-dim);font-weight:700}\
.recov-input{width:70px;padding:6px 8px;border:1px solid var(--glass-border);border-radius:8px;\
background:var(--surface);color:var(--text);font-size:14px;font-weight:700;text-align:center}\
.recov-mood{display:flex;gap:6px;justify-content:center;margin:10px 0}\
.recov-mood-btn{width:36px;height:36px;border-radius:50%;border:2px solid var(--glass-border);\
background:var(--glass);font-size:18px;cursor:pointer;transition:all 0.2s;display:flex;\
align-items:center;justify-content:center}\
.recov-mood-btn.active{border-color:var(--accent);background:var(--accent-soft);transform:scale(1.15)}\
.recov-btn{padding:8px 20px;border:none;border-radius:8px;background:var(--green);color:#fff;\
font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s}\
.recov-btn:hover{filter:brightness(1.1)}\
.recov-summary{display:flex;gap:12px;justify-content:center;margin:12px 0;flex-wrap:wrap}\
.recov-stat{text-align:center;padding:8px 14px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:10px;min-width:70px}\
.recov-stat-val{font-size:18px;font-weight:900}\
.recov-stat-lbl{font-size:9px;color:var(--text-muted);margin-top:2px}\
.ring-canvas{width:100%;max-width:400px;height:400px;margin:12px auto;display:block;\
border-radius:12px;background:var(--surface)}\
.ring-patterns{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:12px 0}\
.ring-btn{padding:8px 14px;border:1px solid var(--glass-border);border-radius:20px;\
background:var(--glass);font-size:11px;font-weight:700;color:var(--text-dim);cursor:pointer;\
transition:all 0.2s}\
.ring-btn.active{border-color:var(--green);color:var(--green);background:rgba(34,197,94,0.1)}\
.ring-btn.done{border-color:var(--green);color:var(--green)}\
.ring-desc{font-size:12px;color:var(--text-dim);text-align:center;margin:8px 0;line-height:1.5;\
min-height:36px}\
.report-canvas{width:100%;max-width:400px;height:400px;margin:12px auto;display:block;\
border-radius:12px;background:var(--surface)}\
.report-grade{font-size:48px;font-weight:900;text-align:center;margin:8px 0}\
.report-metrics{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0}\
.report-metric{text-align:center;padding:8px 12px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:10px;min-width:70px}\
.report-metric-val{font-size:16px;font-weight:900}\
.report-metric-lbl{font-size:9px;color:var(--text-muted)}\
.bgm-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}\
.bgm-card{padding:14px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:14px;cursor:pointer;transition:all 0.3s;text-align:center}\
.bgm-card:hover{border-color:var(--accent);transform:translateY(-2px)}\
.bgm-card.playing{border-color:var(--accent);background:var(--accent-soft);\
animation:pulse 2s ease-in-out infinite}\
.bgm-icon{font-size:28px;margin-bottom:4px}\
.bgm-name{font-size:13px;font-weight:800;margin-bottom:2px}\
.bgm-bpm{font-size:10px;color:var(--text-muted)}\
.bgm-controls{display:flex;gap:8px;justify-content:center;margin:12px 0}\
.bgm-ctrl{padding:10px 20px;border:none;border-radius:10px;font-size:14px;font-weight:700;\
cursor:pointer;transition:all 0.2s}\
.bgm-ctrl.play{background:var(--accent);color:#fff}\
.bgm-ctrl.stop{background:var(--orange);color:#fff}\
.bgm-ctrl.skip{background:var(--glass);border:1px solid var(--glass-border);color:var(--text-dim)}\
.v13-quiz-panel{padding:20px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:var(--radius);backdrop-filter:blur(12px)}\
.v13-quiz-q{font-size:15px;font-weight:700;margin-bottom:16px;line-height:1.5}\
.v13-quiz-opts{display:flex;flex-direction:column;gap:8px}\
.v13-quiz-opt{padding:12px 16px;border:1px solid var(--glass-border);border-radius:10px;\
background:var(--glass);cursor:pointer;transition:all 0.2s;font-size:13px;text-align:left}\
.v13-quiz-opt:hover{border-color:var(--accent)}\
.v13-quiz-opt.correct{border-color:var(--green);background:rgba(34,197,94,0.1);color:var(--green)}\
.v13-quiz-opt.wrong{border-color:var(--accent);background:rgba(255,68,68,0.1);color:var(--accent)}\
.v13-quiz-result{text-align:center;padding:20px;font-size:18px;font-weight:700}\
.v13-fab-container{position:fixed;left:12px;top:50%;transform:translateY(-50%);z-index:90;\
display:flex;flex-direction:column;gap:8px}\
.v13-fab{width:40px;height:40px;border-radius:50%;background:var(--glass);border:1px solid var(--glass-border);\
display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;\
font-size:16px;backdrop-filter:blur(10px)}\
.v13-fab:hover{border-color:var(--accent);transform:scale(1.15)}\
@media(max-width:768px){\
.v13-grid-2{grid-template-columns:1fr}\
.v13-grid-3{grid-template-columns:1fr}\
.v13-grid-4{grid-template-columns:repeat(2,1fr)}\
.v13-fab-container{left:6px;gap:6px}\
.v13-fab{width:34px;height:34px;font-size:14px}\
.rope-canvas,.def-canvas,.ring-canvas,.report-canvas{height:280px}\
.fight-arena{padding:14px}\
}';
  document.head.appendChild(s);
}

// ===== TOAST =====
function showToast13(msg){
  var c = document.getElementById('toastContainer');
  if(!c) return;
  var t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(function(){ t.remove(); }, 3000);
}

// ===== 1. JUMP ROPE TRAINER =====
var ROPE_PATTERNS = [
  {id:'basic',name:'기본 점프',bpm:120,dur:60,desc:'기본 양발 점프. 리듬감을 익히세요.'},
  {id:'alternate',name:'번갈아 점프',bpm:130,dur:60,desc:'왼발/오른발 번갈아 가볔게.'},
  {id:'high_knee',name:'무릎 높이',bpm:110,dur:45,desc:'무릎을 높이 들어올리며 점프.'},
  {id:'double',name:'더블 언더',bpm:90,dur:30,desc:'한 번 점프에 줄이 2번 돌아가는 고급 기술.'},
  {id:'boxer',name:'복서 스텝',bpm:140,dur:60,desc:'복서 특유의 경쾌한 발놓림 점프.'},
  {id:'criss_cross',name:'크로스',bpm:100,dur:45,desc:'팔을 교차하며 점프하는 기술.'},
  {id:'side_swing',name:'사이드 스윙',bpm:120,dur:45,desc:'좌우 스윙 후 점프를 반복.'},
  {id:'speed',name:'스피드 런',bpm:180,dur:30,desc:'최고 속도로 점프! 체력 한계 도전.'}
];
var ropeInterval = null;
var ropeState = {active:false, pattern:0, count:0, time:0, best:0};

function buildRopeTrainer(){
  var container = document.querySelector('.container');
  if(!container) return;
  var sec = document.createElement('section');
  sec.className = 'v13-section';
  sec.id = 'v13-rope';
  var pats = ROPE_PATTERNS.map(function(p,i){
    var cls = 'rope-btn';
    if(v13.ropePatterns[p.id]) cls += ' done';
    return '<button class="'+cls+'" data-idx="'+i+'">'+p.name+'</button>';
  }).join('');
  sec.innerHTML = '<h2 class="v13-title"><span class="emoji">🤾</span> 줄넘기 트레이너</h2>\
<div class="v13-card">\
<div class="rope-patterns" id="v13RopePatterns">'+pats+'</div>\
<div class="rope-stats">\
<div class="rope-stat"><div class="rope-stat-val" id="v13RopeTotal">'+v13.ropeTotal+'</div><div class="rope-stat-lbl">총 점프</div></div>\
<div class="rope-stat"><div class="rope-stat-val" id="v13RopeBest">'+v13.ropeBest+'</div><div class="rope-stat-lbl">최고기록</div></div>\
<div class="rope-stat"><div class="rope-stat-val" id="v13RopeDone">'+Object.keys(v13.ropePatterns).length+'/8</div><div class="rope-stat-lbl">패턴 완료</div></div>\
</div>\
<canvas class="rope-canvas" id="v13RopeCanvas" width="420" height="350"></canvas>\
<div class="rope-count" id="v13RopeCount">0</div>\
<div class="rope-timer" id="v13RopeTimer">0:00</div>\
<div style="text-align:center">\
<button class="rope-ctrl" id="v13RopeStart">▶ 시작</button>\
<button class="rope-ctrl stop" id="v13RopeStop" style="display:none">■ 정지</button>\
</div>\
</div>';
  var achSec = document.getElementById('v13-strategies');
  if(achSec) container.insertBefore(sec, achSec);
  else container.appendChild(sec);

  document.getElementById('v13RopePatterns').addEventListener('click', function(e){
    var btn = e.target.closest('.rope-btn');
    if(!btn) return;
    var idx = parseInt(btn.dataset.idx);
    ropeState.pattern = idx;
    document.querySelectorAll('.rope-btn').forEach(function(b,i){
      b.classList.toggle('active', i===idx);
    });
    drawRopeCanvas(idx);
  });

  document.getElementById('v13RopeStart').addEventListener('click', startRope);
  document.getElementById('v13RopeStop').addEventListener('click', stopRope);
  drawRopeCanvas(0);
}

function drawRopeCanvas(idx){
  var cv = document.getElementById('v13RopeCanvas');
  if(!cv) return;
  var ctx = cv.getContext('2d');
  var w = cv.width, h = cv.height;
  var isDark = !document.documentElement.hasAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,w,h);

  ctx.fillStyle = isDark ? '#1a1a2e' : '#f0f0f0';
  ctx.fillRect(0,0,w,h);

  var p = ROPE_PATTERNS[idx];
  ctx.fillStyle = isDark ? '#f0f0f0' : '#1a1a2e';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(p.name, w/2, 30);
  ctx.font = '12px sans-serif';
  ctx.fillStyle = isDark ? '#8a8a9e' : '#666';
  ctx.fillText(p.desc, w/2, 50);
  ctx.fillText('BPM: '+p.bpm+' | 시간: '+p.dur+'초', w/2, 70);

  var cx = w/2, cy = h/2 + 20;
  ctx.strokeStyle = isDark ? 'rgba(255,68,68,0.3)' : 'rgba(255,68,68,0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for(var i=0;i<100;i++){
    var t = i/99*Math.PI;
    var rx = 80, ry = 120;
    var x = cx + rx * Math.cos(t+Math.PI/2);
    var y = cy - ry * Math.sin(t);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();

  ctx.strokeStyle = isDark ? 'rgba(255,68,68,0.3)' : 'rgba(255,68,68,0.5)';
  ctx.beginPath();
  for(var i=0;i<100;i++){
    var t = i/99*Math.PI;
    var x = cx - 80 * Math.cos(t+Math.PI/2);
    var y = cy - 120 * Math.sin(t);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();

  ctx.fillStyle = '#FF4444';
  ctx.beginPath(); ctx.arc(cx-80, cy+10, 6, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+80, cy+10, 6, 0, Math.PI*2); ctx.fill();

  ctx.fillStyle = isDark ? '#f0f0f0' : '#333';
  ctx.font = '11px sans-serif';
  ctx.fillText('클릭 또는 스페이스바로 점프!', w/2, h-20);
}

function animateRope(){
  var cv = document.getElementById('v13RopeCanvas');
  if(!cv || !ropeState.active) return;
  var ctx = cv.getContext('2d');
  var w = cv.width, h = cv.height;
  var isDark = !document.documentElement.hasAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  var p = ROPE_PATTERNS[ropeState.pattern];
  var phase = (Date.now() / (60000/p.bpm)) % 1;

  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = isDark ? '#1a1a2e' : '#f0f0f0';
  ctx.fillRect(0,0,w,h);

  ctx.fillStyle = isDark ? '#f0f0f0' : '#1a1a2e';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(p.name+' - 훈련 중!', w/2, 30);

  var cx = w/2, cy = h/2 + 20;
  var angle = phase * Math.PI * 2;

  ctx.strokeStyle = '#FF4444';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for(var i=0;i<=50;i++){
    var t = i/50;
    var x = cx + (t-0.5)*160;
    var sag = Math.sin(t*Math.PI) * 80 * Math.cos(angle);
    var y = cy + sag;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();

  var figY = cy - 60 + Math.abs(Math.cos(angle)) * 30;
  ctx.fillStyle = isDark ? '#f0f0f0' : '#333';
  ctx.beginPath(); ctx.arc(cx, figY-40, 12, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = isDark ? '#f0f0f0' : '#333';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx, figY-28); ctx.lineTo(cx, figY+10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-15, figY-15); ctx.lineTo(cx, figY-5); ctx.lineTo(cx+15, figY-15); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-10, figY+30); ctx.lineTo(cx, figY+10); ctx.lineTo(cx+10, figY+30); ctx.stroke();

  ctx.fillStyle = '#FF4444';
  ctx.beginPath(); ctx.arc(cx-80, cy, 5, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+80, cy, 5, 0, Math.PI*2); ctx.fill();

  var barW = w - 60;
  var elapsed = ropeState.time;
  var total = p.dur;
  var prog = Math.min(elapsed/total, 1);
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  ctx.fillRect(30, h-40, barW, 10);
  ctx.fillStyle = '#FF4444';
  ctx.fillRect(30, h-40, barW*prog, 10);
  ctx.fillStyle = isDark ? '#8a8a9e' : '#666';
  ctx.font = '10px sans-serif';
  ctx.fillText(Math.round(prog*100)+'%', w/2, h-14);

  if(ropeState.active) requestAnimationFrame(animateRope);
}

function startRope(){
  if(ropeState.active) return;
  ropeState.active = true;
  ropeState.count = 0;
  ropeState.time = 0;
  document.getElementById('v13RopeStart').style.display = 'none';
  document.getElementById('v13RopeStop').style.display = 'inline-block';
  document.getElementById('v13RopeCount').textContent = '0';

  var p = ROPE_PATTERNS[ropeState.pattern];
  ropeInterval = setInterval(function(){
    ropeState.time++;
    var rem = p.dur - ropeState.time;
    var m = Math.floor(rem/60), s = rem%60;
    document.getElementById('v13RopeTimer').textContent = m+':'+(s<10?'0':'')+s;
    if(ropeState.time >= p.dur){
      stopRope();
      v13.ropePatterns[p.id] = true;
      saveV13(v13);
      playSFX13('rope_complete');
      showToast13(p.name+' 완료! 총 '+ropeState.count+'회 점프');
      updateRopeUI();
    }
  }, 1000);

  document.addEventListener('keydown', ropeJumpHandler);
  document.getElementById('v13RopeCanvas').addEventListener('click', ropeJumpHandler);

  animateRope();
}

function ropeJumpHandler(e){
  if(!ropeState.active) return;
  if(e.type === 'keydown' && e.code !== 'Space') return;
  if(e.type === 'keydown') e.preventDefault();
  ropeState.count++;
  v13.ropeTotal++;
  if(ropeState.count > v13.ropeBest) v13.ropeBest = ropeState.count;
  document.getElementById('v13RopeCount').textContent = ropeState.count;
  document.getElementById('v13RopeTotal').textContent = v13.ropeTotal;
  document.getElementById('v13RopeBest').textContent = v13.ropeBest;
  playSFX13('rope_jump');
  saveV13(v13);
}

function stopRope(){
  ropeState.active = false;
  clearInterval(ropeInterval);
  document.getElementById('v13RopeStart').style.display = 'inline-block';
  document.getElementById('v13RopeStop').style.display = 'none';
  document.removeEventListener('keydown', ropeJumpHandler);
  var cv = document.getElementById('v13RopeCanvas');
  if(cv) cv.removeEventListener('click', ropeJumpHandler);
}

function updateRopeUI(){
  document.getElementById('v13RopeDone').textContent = Object.keys(v13.ropePatterns).length+'/8';
  document.querySelectorAll('.rope-btn').forEach(function(btn,i){
    var p = ROPE_PATTERNS[i];
    if(v13.ropePatterns[p.id]) btn.classList.add('done');
  });
}

// ===== 2. FIGHT STRATEGY PLAYBOOK =====
var STRATEGIES = [
  {id:'jab_cross',name:'잡-크로스',icon:'🥊',type:'offense',
   desc:'가장 기본적인 콤보. 잡으로 거리를 재고 크로스로 마무리.',
   detail:'잡은 앞손으로 빠르게 내뼉고 바로 크로스로 연결. 잡 후 0.2초 이내에 크로스 연결이 핵심. 후수발 어깨회전을 실어 체중을 실어야 파워가 나옴.'},
  {id:'pressure',name:'프레셔 파이팅',icon:'💢',type:'offense',
   desc:'상대를 로프 코너로 몰아붙이며 공격.',
   detail:'전진하며 잡을 끌임없이 내뼉고, 보디 액션으로 거리를 좋힘. 상대가 로프에 갇히면 훅/어퍼캿 연타. 체력 소모가 크므로 라운드 초반에 사용.'},
  {id:'counter',name:'카운터 펄처',icon:'⚡',type:'counter',
   desc:'상대 공격에 맞춰 반격하는 전략.',
   detail:'상대 잡에 슬립하며 크로스 반격, 또는 상대 크로스에 롤하며 훅 반격. 타이밍이 생명. 방어 자세에서 빠르게 전환하는 연습이 필요.'},
  {id:'outboxer',name:'아웃복싱',icon:'🦶',type:'movement',
   desc:'거리를 유지하며 장타 펀치로 승부.',
   detail:'발놓림을 활용해 거리를 유지. 잡과 스트레이트를 주무기로 사용. 상대가 접근하면 피벗으로 각도를 만들어 재배치. 무하마드 알리 스타일.'},
  {id:'infighter',name:'인파이팅',icon:'💥',type:'offense',
   desc:'근접 거리에서 훅/어퍼캿 연타.',
   detail:'보디 액션으로 들어가 훅/어퍼캿 콤보. 헤드 무브먼트로 회피하며 가까이 붙어서 싸움. 가드를 높이 유지하며 틈을 노림. 마이크 타이슨 스타일.'},
  {id:'philly_shell',name:'필리 셸',icon:'🛡',type:'defense',
   desc:'어깨로 방어하며 카운터 기회 포착.',
   detail:'앞어깨를 올려 방어, 뒷손은 턴 보호. 상대 잡을 어깨로 흘려보내고 크로스 반격. 메이웨더 시규처. 반응속도와 타이밍 필수.'},
  {id:'peek_a_boo',name:'피카부',icon:'👀',type:'defense',
   desc:'가드를 높이 세우고 헤드무브로 회피.',
   detail:'양권을 볼 높이로 올리고 팔꿈치를 붙임. 좌우로 고개를 움직이며 회피. 가까이 접근해 훅/어퍼캿 연타. 마이크 타이슨 스타일.'},
  {id:'bait',name:'베이트 전략',icon:'🎣',type:'counter',
   desc:'의도적으로 빈틈을 보여 상대 공격을 유도.',
   detail:'가드를 살짝 낮춰 상대가 공격하게 유도. 예상한 공격에 카운터. 위험하지만 성공시 큰 효과. 경험 많은 복서 전용.'},
  {id:'clinch',name:'클린치 전략',icon:'🤝',type:'defense',
   desc:'접근전에서 클린치로 휴식+체력 관리.',
   detail:'상대와 몸을 붙여 공격을 붉쇄. 체력 회복과 전투 리셋에 활용. 브레이크 후 즉시 공격 전환 가능. 내부 전투에서 중요.'},
  {id:'body_attack',name:'바디 공격',icon:'🎯',type:'offense',
   desc:'상체 공격으로 상대 체력 소모유도.',
   detail:'복부 훅, 간 펀치, 소라 플렉서스 공격. 상대가 가드를 낮추면 헤드샷으로 전환. 후반 라운드에서 큰 효과. 마뉴엘 파키아오 스타일.'},
  {id:'angle_play',name:'앵글 플레이',icon:'🔄',type:'movement',
   desc:'피벗/스텝으로 각도를 만들어 공격.',
   detail:'정면 대결을 피하고 측면으로 이동하여 공격. 상대 바깥쪽으로 이동하면 상대는 회전해야 함. 피벗 후 즉시 펌치 연결이 핵심.'},
  {id:'switch_stance',name:'스위치 스탠스',icon:'🤸',type:'movement',
   desc:'오소독스/사우스포 전환으로 혼란.',
   detail:'중간에 스탠스를 바꾸면 상대 타이밍 혼란. 스위치 직후 파워 펀치로 기습. 양손 모두 사용 가능한 복서의 무기. 테렌스 크로폭드 스타일.'}
];

function buildStrategyPlaybook(){
  var container = document.querySelector('.container');
  if(!container) return;
  var sec = document.createElement('section');
  sec.className = 'v13-section';
  sec.id = 'v13-strategies';
  var cards = STRATEGIES.map(function(s){
    var cls = 'strat-card';
    if(v13.strategyViewed.indexOf(s.id) !== -1) cls += ' viewed';
    return '<div class="'+cls+'" data-id="'+s.id+'">\
<div class="strat-icon">'+s.icon+'</div>\
<div class="strat-name">'+s.name+'</div>\
<div class="strat-type '+s.type+'">'+({offense:'공격',defense:'방어',counter:'카운터',movement:'무브먼트'}[s.type])+'</div>\
<div class="strat-desc">'+s.desc+'</div>\
<div class="strat-detail">'+s.detail+'</div>\
</div>';
  }).join('');
  sec.innerHTML = '<h2 class="v13-title"><span class="emoji">📖</span> 파이트 전략 플레이북</h2>\
<div class="v13-card">\
<div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">\
<button class="def-btn active" data-filter="all">전체</button>\
<button class="def-btn" data-filter="offense">공격</button>\
<button class="def-btn" data-filter="defense">방어</button>\
<button class="def-btn" data-filter="counter">카운터</button>\
<button class="def-btn" data-filter="movement">무브먼트</button>\
</div>\
<div class="strat-grid" id="v13StratGrid">'+cards+'</div>\
<div style="text-align:center;margin-top:12px;font-size:12px;color:var(--text-muted)">\
열람: '+v13.strategyViewed.length+'/12 전략\
</div>\
</div>';
  var defSec = document.getElementById('v13-defense');
  if(defSec) container.insertBefore(sec, defSec);
  else container.appendChild(sec);

  sec.addEventListener('click', function(e){
    var card = e.target.closest('.strat-card');
    var filter = e.target.closest('[data-filter]');
    if(filter){
      var f = filter.dataset.filter;
      sec.querySelectorAll('[data-filter]').forEach(function(b){ b.classList.toggle('active', b.dataset.filter===f); });
      sec.querySelectorAll('.strat-card').forEach(function(c){
        c.style.display = (f==='all' || c.querySelector('.strat-type').classList.contains(f)) ? '' : 'none';
      });
      return;
    }
    if(!card) return;
    card.classList.toggle('open');
    var sid = card.dataset.id;
    if(v13.strategyViewed.indexOf(sid) === -1){
      v13.strategyViewed.push(sid);
      card.classList.add('viewed');
      saveV13(v13);
      playSFX13('strategy');
    }
  });
}

// ===== 3. DEFENSIVE DRILL MATRIX =====
var DEF_DRILLS = [
  {id:'slip_left',name:'좌측 슬립',desc:'왼쪽으로 고개를 담그어 회피',color:'#3498db'},
  {id:'slip_right',name:'우측 슬립',desc:'오른쪽으로 고개를 담그어 회피',color:'#2980b9'},
  {id:'roll_left',name:'좌측 롤',desc:'몸을 왼쪽 아래로 구르며 회피',color:'#e74c3c'},
  {id:'roll_right',name:'우측 롤',desc:'몸을 오른쪽 아래로 구르며 회피',color:'#c0392b'},
  {id:'parry',name:'패리',desc:'손으로 상대 펌치를 흘려보내기',color:'#27ae60'},
  {id:'block_high',name:'하이 블록',desc:'양팔을 올려 머리 보호',color:'#f39c12'},
  {id:'block_body',name:'바디 블록',desc:'팔꿈치를 붙여 복부 보호',color:'#e67e22'},
  {id:'pull_back',name:'풀 백',desc:'상체를 뒤로 제쳐 거리 확보',color:'#9b59b6'},
  {id:'bob_weave',name:'밥 앤 위브',desc:'무릎을 굽혀 아래로 빠졌다가 올라옴',color:'#1abc9c'},
  {id:'shoulder_roll',name:'숄더 롤',desc:'어깨로 펀치를 흘려보내며 반격 준비',color:'#34495e'}
];

var defState = {active:false, drill:0, score:0, total:0};

function buildDefenseDrills(){
  var container = document.querySelector('.container');
  if(!container) return;
  var sec = document.createElement('section');
  sec.className = 'v13-section';
  sec.id = 'v13-defense';
  var drills = DEF_DRILLS.map(function(d,i){
    var cls = 'def-btn';
    if(v13.defenseDrills[d.id]) cls += ' done';
    return '<button class="'+cls+'" data-idx="'+i+'">'+d.name+'</button>';
  }).join('');
  sec.innerHTML = '<h2 class="v13-title"><span class="emoji">🛡</span> 방어 드릴 매트릭스</h2>\
<div class="v13-card">\
<div class="def-drills" id="v13DefDrills">'+drills+'</div>\
<div class="def-stats">\
<div class="def-stat"><div class="def-stat-val" id="v13DefScore">0</div><div class="def-stat-lbl">성공</div></div>\
<div class="def-stat"><div class="def-stat-val" id="v13DefTotal">0</div><div class="def-stat-lbl">시도</div></div>\
<div class="def-stat"><div class="def-stat-val" id="v13DefDone">'+Object.keys(v13.defenseDrills).length+'/10</div><div class="def-stat-lbl">완료</div></div>\
</div>\
<canvas class="def-canvas" id="v13DefCanvas" width="420" height="420"></canvas>\
<div style="text-align:center;font-size:12px;color:var(--text-dim);margin-top:8px" id="v13DefDesc">드릴을 선택하고 화살표 방향으로 방어하세요</div>\
</div>';
  var fightSec = document.getElementById('v13-fightnight');
  if(fightSec) container.insertBefore(sec, fightSec);
  else container.appendChild(sec);

  document.getElementById('v13DefDrills').addEventListener('click', function(e){
    var btn = e.target.closest('.def-btn');
    if(!btn) return;
    var idx = parseInt(btn.dataset.idx);
    defState.drill = idx;
    document.querySelectorAll('.def-btn').forEach(function(b,i){ b.classList.toggle('active', i===idx); });
    drawDefCanvas(idx);
    document.getElementById('v13DefDesc').textContent = DEF_DRILLS[idx].desc;
  });

  document.getElementById('v13DefCanvas').addEventListener('click', function(e){
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var cx = 210, cy = 210;
    var dx = x-cx, dy = y-cy;
    var dist = Math.sqrt(dx*dx+dy*dy);
    if(dist < 30){
      defState.total++;
      defState.score++;
      v13.defenseDrills[DEF_DRILLS[defState.drill].id] = true;
      playSFX13('defense_block');
      showToast13(DEF_DRILLS[defState.drill].name+' 성공!');
      document.getElementById('v13DefScore').textContent = defState.score;
      document.getElementById('v13DefTotal').textContent = defState.total;
      document.getElementById('v13DefDone').textContent = Object.keys(v13.defenseDrills).length+'/10';
      saveV13(v13);
      drawDefCanvas(defState.drill, true);
      document.querySelectorAll('.def-btn').forEach(function(b,i){
        if(v13.defenseDrills[DEF_DRILLS[i].id]) b.classList.add('done');
      });
    } else {
      defState.total++;
      playSFX13('defense_slip');
      document.getElementById('v13DefTotal').textContent = defState.total;
    }
  });

  drawDefCanvas(0);
}

function drawDefCanvas(idx, success){
  var cv = document.getElementById('v13DefCanvas');
  if(!cv) return;
  var ctx = cv.getContext('2d');
  var w = cv.width, h = cv.height;
  var isDark = !document.documentElement.hasAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = isDark ? '#1a1a2e' : '#f0f0f0';
  ctx.fillRect(0,0,w,h);

  var d = DEF_DRILLS[idx];
  var cx = w/2, cy = h/2;

  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 1;
  [40,80,120,160].forEach(function(r){
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();
  });

  ctx.beginPath();
  ctx.moveTo(cx-20, cy-60); ctx.lineTo(cx+20, cy-60);
  ctx.arc(cx, cy-60, 20, 0, Math.PI);
  ctx.closePath();
  ctx.fillStyle = isDark ? '#555' : '#aaa';
  ctx.fill();

  ctx.beginPath(); ctx.arc(cx, cy-85, 16, 0, Math.PI*2);
  ctx.fillStyle = isDark ? '#777' : '#999';
  ctx.fill();

  ctx.strokeStyle = isDark ? '#555' : '#aaa';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(cx, cy-44); ctx.lineTo(cx, cy+20); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-30, cy-30); ctx.lineTo(cx, cy-44); ctx.lineTo(cx+30, cy-30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-15, cy+50); ctx.lineTo(cx, cy+20); ctx.lineTo(cx+15, cy+50); ctx.stroke();

  ctx.fillStyle = d.color;
  ctx.globalAlpha = 0.3;
  var angle = {slip_left:Math.PI,slip_right:0,roll_left:Math.PI*0.75,roll_right:Math.PI*0.25,
    parry:Math.PI*1.5,block_high:Math.PI*1.5,block_body:Math.PI*0.5,pull_back:Math.PI*0.5,
    bob_weave:Math.PI*0.5,shoulder_roll:0}[d.id] || 0;
  var ax = cx + Math.cos(angle)*120;
  var ay = cy + Math.sin(angle)*120;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(ax + Math.cos(angle+0.3)*40, ay + Math.sin(angle+0.3)*40);
  ctx.lineTo(ax + Math.cos(angle-0.3)*40, ay + Math.sin(angle-0.3)*40);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.strokeStyle = d.color;
  ctx.lineWidth = 2;
  ctx.setLineDash([6,4]);
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(cx, cy);
  ctx.stroke();
  ctx.setLineDash([]);

  if(success){
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✓ 성공!', cx, cy+70);
  }

  ctx.fillStyle = isDark ? '#f0f0f0' : '#1a1a2e';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(d.name, cx, 25);
  ctx.font = '11px sans-serif';
  ctx.fillStyle = isDark ? '#8a8a9e' : '#666';
  ctx.fillText('중앙 원을 클릭하여 방어!', cx, h-15);
}

// ===== 4. FIGHT NIGHT GAUNTLET =====
var FIGHT_OPPONENTS = [
  {name:'무명의 신인',hp:80,atk:8,def:3,speed:4,style:'초보자',emoji:'🥊'},
  {name:'스트리트 파이터',hp:100,atk:12,def:5,speed:6,style:'인파이터',emoji:'💢'},
  {name:'아이언 피스트',hp:120,atk:15,def:8,speed:5,style:'프레셔',emoji:'💥'},
  {name:'플래시 스트라이커',hp:100,atk:18,def:4,speed:9,style:'카운터',emoji:'⚡'},
  {name:'챔피언 타이탄',hp:150,atk:20,def:10,speed:7,style:'챔피언',emoji:'🏆'}
];

var fightState = {active:false, round:0, playerHP:100, enemyHP:0, enemy:null, log:[], turn:0};

function buildFightNight(){
  var container = document.querySelector('.container');
  if(!container) return;
  var sec = document.createElement('section');
  sec.className = 'v13-section';
  sec.id = 'v13-fightnight';
  sec.innerHTML = '<h2 class="v13-title"><span class="emoji">🌟</span> 파이트 나이트</h2>\
<div class="fight-arena" id="v13FightArena">\
<div style="font-size:14px;color:var(--text-dim);margin-bottom:12px">\
5명의 상대를 연속으로 격파하라!\
</div>\
<div style="display:flex;gap:12px;justify-content:center;margin:12px 0;flex-wrap:wrap">\
<div class="rope-stat"><div class="rope-stat-val" id="v13FightWins">'+v13.fightNight.wins+'</div><div class="rope-stat-lbl">총 승리</div></div>\
<div class="rope-stat"><div class="rope-stat-val" id="v13FightBest">'+v13.fightNight.best+'</div><div class="rope-stat-lbl">최고 연승</div></div>\
<div class="rope-stat"><div class="rope-stat-val" id="v13FightAttempts">'+v13.fightNight.attempts+'</div><div class="rope-stat-lbl">도전</div></div>\
</div>\
<div id="v13FightContent">\
<button class="rope-ctrl" id="v13FightStart">🥊 파이트 나이트 시작</button>\
</div>\
</div>';
  var recovSec = document.getElementById('v13-recovery');
  if(recovSec) container.insertBefore(sec, recovSec);
  else container.appendChild(sec);

  document.getElementById('v13FightStart').addEventListener('click', startFightNight);
}

function startFightNight(){
  fightState.active = true;
  fightState.round = 0;
  fightState.playerHP = 100;
  fightState.log = [];
  fightState.turn = 0;
  v13.fightNight.attempts++;
  saveV13(v13);
  document.getElementById('v13FightAttempts').textContent = v13.fightNight.attempts;
  startFightRound();
}

function startFightRound(){
  var enemy = FIGHT_OPPONENTS[fightState.round];
  fightState.enemy = enemy;
  fightState.enemyHP = enemy.hp;
  fightState.log = [];
  playSFX13('fight_bell');

  var content = document.getElementById('v13FightContent');
  content.innerHTML = '<div class="fight-vs">ROUND '+(fightState.round+1)+'</div>\
<div class="fight-opponent">'+enemy.emoji+' '+enemy.name+' <span style="font-size:12px;color:var(--text-dim)">('+enemy.style+')</span></div>\
<div class="fight-hp-label">나 (HP: <span id="v13PlayerHPVal">'+fightState.playerHP+'</span>)</div>\
<div class="fight-hp"><div class="fight-hp-fill player" id="v13PlayerHP" style="width:'+fightState.playerHP+'%"></div></div>\
<div class="fight-hp-label">'+enemy.name+' (HP: <span id="v13EnemyHPVal">'+fightState.enemyHP+'</span>)</div>\
<div class="fight-hp"><div class="fight-hp-fill enemy" id="v13EnemyHP" style="width:100%"></div></div>\
<div class="fight-actions" id="v13FightActions">\
<button class="fight-act jab" data-act="jab">잡</button>\
<button class="fight-act cross" data-act="cross">크로스</button>\
<button class="fight-act hook" data-act="hook">훅</button>\
<button class="fight-act upper" data-act="upper">어퍼</button>\
<button class="fight-act dodge" data-act="dodge">회피</button>\
<button class="fight-act guard" data-act="guard">가드</button>\
</div>\
<div class="fight-log" id="v13FightLog"></div>';

  content.querySelector('#v13FightActions').addEventListener('click', function(e){
    var btn = e.target.closest('.fight-act');
    if(!btn || btn.disabled) return;
    handleFightAction(btn.dataset.act);
  });
}

function handleFightAction(act){
  if(!fightState.active) return;
  var enemy = fightState.enemy;
  var dmg = 0, msg = '';
  var hit = Math.random();

  if(act === 'jab'){
    dmg = 8 + Math.floor(Math.random()*5);
    if(hit < 0.85) { msg = '잡 히트! '+dmg+' 데미지'; fightState.enemyHP -= dmg; }
    else { msg = '잡 뺗나감!'; dmg=0; }
  } else if(act === 'cross'){
    dmg = 12 + Math.floor(Math.random()*8);
    if(hit < 0.7) { msg = '크로스 히트! '+dmg+' 데미지'; fightState.enemyHP -= dmg; }
    else { msg = '크로스 빗나감!'; dmg=0; }
  } else if(act === 'hook'){
    dmg = 15 + Math.floor(Math.random()*10);
    if(hit < 0.6) { msg = '훅 힉트! '+dmg+' 데미지!'; fightState.enemyHP -= dmg; }
    else { msg = '훅 빗나감!'; dmg=0; }
  } else if(act === 'upper'){
    dmg = 18 + Math.floor(Math.random()*12);
    if(hit < 0.5) { msg = '어퍼캿 고정! '+dmg+' 데미지!!'; fightState.enemyHP -= dmg; }
    else { msg = '어퍼캿 빗나감!'; dmg=0; }
  } else if(act === 'dodge'){
    msg = '회피 준비!';
  } else if(act === 'guard'){
    msg = '가드 자세!';
  }

  fightState.log.push('🟢 ' + msg);

  if(fightState.enemyHP <= 0) fightState.enemyHP = 0;

  var enemyAct = Math.random();
  var eDmg = enemy.atk + Math.floor(Math.random() * (enemy.atk/2));
  if(act === 'dodge' && Math.random() < 0.7){
    fightState.log.push('🔵 상대 공격 회피 성공!');
  } else if(act === 'guard'){
    eDmg = Math.floor(eDmg * 0.3);
    fightState.playerHP -= eDmg;
    fightState.log.push('🔴 상대 공격 방어! -'+eDmg);
  } else if(enemyAct < 0.75) {
    fightState.playerHP -= eDmg;
    fightState.log.push('🔴 상대 공격! -'+eDmg+' 데미지');
  } else {
    fightState.log.push('🔵 상대 공격 빗나감!');
  }

  if(fightState.playerHP <= 0) fightState.playerHP = 0;

  updateFightUI();

  if(fightState.enemyHP <= 0){
    fightState.log.push('🏆 KO! '+enemy.name+' 격파!');
    v13.fightNight.wins++;
    playSFX13('fight_ko');
    setTimeout(function(){
      if(fightState.round < 4){
        fightState.round++;
        fightState.playerHP = Math.min(fightState.playerHP + 20, 100);
        startFightRound();
      } else {
        fightState.active = false;
        var best = fightState.round + 1;
        if(best > v13.fightNight.best) v13.fightNight.best = best;
        saveV13(v13);
        document.getElementById('v13FightContent').innerHTML = '\
<div class="fight-result win">🏆 챔피언!</div>\
<div style="font-size:14px;color:var(--text-dim);margin:12px 0">5전 전승! 당신은 진정한 챔피언입니다!</div>\
<button class="rope-ctrl" id="v13FightRestart">다시 도전</button>';
        document.getElementById('v13FightRestart').addEventListener('click', startFightNight);
        updateFightStats();
      }
    }, 1500);
    disableFightActions();
    return;
  }

  if(fightState.playerHP <= 0){
    fightState.active = false;
    fightState.log.push('💢 패배...');
    var best = fightState.round;
    if(best > v13.fightNight.best) v13.fightNight.best = best;
    saveV13(v13);
    setTimeout(function(){
      document.getElementById('v13FightContent').innerHTML = '\
<div class="fight-result lose">패배...</div>\
<div style="font-size:14px;color:var(--text-dim);margin:12px 0">'+(fightState.round+1)+'라운드에서 탈락. 다시 도전하세요!</div>\
<button class="rope-ctrl" id="v13FightRestart">다시 도전</button>';
      document.getElementById('v13FightRestart').addEventListener('click', startFightNight);
      updateFightStats();
    }, 1000);
    disableFightActions();
    return;
  }
}

function disableFightActions(){
  document.querySelectorAll('.fight-act').forEach(function(b){ b.disabled = true; });
}

function updateFightUI(){
  var pHP = document.getElementById('v13PlayerHP');
  var eHP = document.getElementById('v13EnemyHP');
  var pVal = document.getElementById('v13PlayerHPVal');
  var eVal = document.getElementById('v13EnemyHPVal');
  var log = document.getElementById('v13FightLog');
  if(pHP) pHP.style.width = fightState.playerHP+'%';
  if(eHP) eHP.style.width = (fightState.enemyHP/fightState.enemy.hp*100)+'%';
  if(pVal) pVal.textContent = fightState.playerHP;
  if(eVal) eVal.textContent = fightState.enemyHP;
  if(log) log.innerHTML = fightState.log.map(function(l){ return '<div>'+l+'</div>'; }).join('');
  if(log) log.scrollTop = log.scrollHeight;
}

function updateFightStats(){
  document.getElementById('v13FightWins').textContent = v13.fightNight.wins;
  document.getElementById('v13FightBest').textContent = v13.fightNight.best;
  document.getElementById('v13FightAttempts').textContent = v13.fightNight.attempts;
}

// ===== 5. RECOVERY TRACKER =====
function buildRecoveryTracker(){
  var container = document.querySelector('.container');
  if(!container) return;
  var sec = document.createElement('section');
  sec.className = 'v13-section';
  sec.id = 'v13-recovery';
  var moods = ['😄','😊','😐','😩','🤕'];
  var moodBtns = moods.map(function(m,i){
    return '<button class="recov-mood-btn" data-mood="'+i+'">'+m+'</button>';
  }).join('');
  var lastRecov = v13.recovery.length > 0 ? v13.recovery[v13.recovery.length-1] : null;
  sec.innerHTML = '<h2 class="v13-title"><span class="emoji">💤</span> 회복 트래커</h2>\
<div class="v13-card">\
<div class="recov-inputs">\
<div class="recov-group"><div class="recov-label">수면(시간)</div><input type="number" class="recov-input" id="v13RecSleep" value="7" min="0" max="24" step="0.5"></div>\
<div class="recov-group"><div class="recov-label">수분(L)</div><input type="number" class="recov-input" id="v13RecWater" value="2" min="0" max="10" step="0.5"></div>\
<div class="recov-group"><div class="recov-label">근육통(1-10)</div><input type="number" class="recov-input" id="v13RecSore" value="3" min="1" max="10"></div>\
</div>\
<div class="recov-label" style="text-align:center;margin:8px 0">기분</div>\
<div class="recov-mood" id="v13RecMood">'+moodBtns+'</div>\
<div style="text-align:center;margin:12px 0">\
<button class="recov-btn" id="v13RecSave">💾 기록 저장</button>\
</div>\
<canvas class="recov-canvas" id="v13RecCanvas" width="460" height="220"></canvas>\
<div class="recov-summary">\
<div class="recov-stat"><div class="recov-stat-val" id="v13RecAvgSleep">'+(lastRecov?lastRecov.sleep:'-')+'</div><div class="recov-stat-lbl">평균 수면</div></div>\
<div class="recov-stat"><div class="recov-stat-val" id="v13RecAvgWater">'+(lastRecov?lastRecov.water:'-')+'</div><div class="recov-stat-lbl">평균 수분</div></div>\
<div class="recov-stat"><div class="recov-stat-val" id="v13RecCount">'+v13.recovery.length+'</div><div class="recov-stat-lbl">기록 수</div></div>\
</div>\
</div>';
  var ringSec = document.getElementById('v13-ringmove');
  if(ringSec) container.insertBefore(sec, ringSec);
  else container.appendChild(sec);

  var selectedMood = 2;
  document.getElementById('v13RecMood').addEventListener('click', function(e){
    var btn = e.target.closest('.recov-mood-btn');
    if(!btn) return;
    selectedMood = parseInt(btn.dataset.mood);
    document.querySelectorAll('.recov-mood-btn').forEach(function(b,i){
      b.classList.toggle('active', i===selectedMood);
    });
  });

  document.getElementById('v13RecSave').addEventListener('click', function(){
    var sleep = parseFloat(document.getElementById('v13RecSleep').value) || 7;
    var water = parseFloat(document.getElementById('v13RecWater').value) || 2;
    var sore = parseInt(document.getElementById('v13RecSore').value) || 3;
    v13.recovery.push({
      date: new Date().toISOString().split('T')[0],
      sleep: sleep, water: water, soreness: sore, mood: selectedMood
    });
    if(v13.recovery.length > 30) v13.recovery = v13.recovery.slice(-30);
    saveV13(v13);
    playSFX13('recovery');
    showToast13('회복 기록 저장!');
    drawRecovCanvas();
    updateRecovSummary();
  });

  drawRecovCanvas();
}

function drawRecovCanvas(){
  var cv = document.getElementById('v13RecCanvas');
  if(!cv) return;
  var ctx = cv.getContext('2d');
  var w = cv.width, h = cv.height;
  var isDark = !document.documentElement.hasAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = isDark ? '#1a1a2e' : '#f0f0f0';
  ctx.fillRect(0,0,w,h);

  var data = v13.recovery.slice(-14);
  if(data.length < 2){
    ctx.fillStyle = isDark ? '#8a8a9e' : '#666';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('기록을 2개 이상 저장하면 차트가 표시됩니다', w/2, h/2);
    return;
  }

  var pad = {t:30,r:20,b:30,l:40};
  var cw = w-pad.l-pad.r, ch = h-pad.t-pad.b;

  ctx.fillStyle = isDark ? '#f0f0f0' : '#333';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('회복 추이 (14일)', w/2, 18);

  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 1;
  for(var i=0;i<=4;i++){
    var y = pad.t + ch * i/4;
    ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(w-pad.r,y); ctx.stroke();
  }

  var colors = ['#3b82f6','#22c55e','#f97316'];
  var labels = ['수면','수분','근육통'];
  var maxVals = [12, 5, 10];

  colors.forEach(function(color, ci){
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach(function(d,j){
      var x = pad.l + j/(data.length-1)*cw;
      var val = ci===0 ? d.sleep : ci===1 ? d.water : d.soreness;
      var y = pad.t + ch * (1 - val/maxVals[ci]);
      if(j===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.stroke();

    data.forEach(function(d,j){
      var x = pad.l + j/(data.length-1)*cw;
      var val = ci===0 ? d.sleep : ci===1 ? d.water : d.soreness;
      var y = pad.t + ch * (1 - val/maxVals[ci]);
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill();
    });
  });

  ctx.font = '10px sans-serif';
  colors.forEach(function(c,i){
    var lx = pad.l + i * 80;
    ctx.fillStyle = c;
    ctx.fillRect(lx, h-12, 12, 8);
    ctx.fillStyle = isDark ? '#8a8a9e' : '#666';
    ctx.textAlign = 'left';
    ctx.fillText(labels[i], lx+16, h-4);
  });
}

function updateRecovSummary(){
  if(v13.recovery.length === 0) return;
  var last7 = v13.recovery.slice(-7);
  var avgS = last7.reduce(function(a,b){return a+b.sleep;},0)/last7.length;
  var avgW = last7.reduce(function(a,b){return a+b.water;},0)/last7.length;
  document.getElementById('v13RecAvgSleep').textContent = avgS.toFixed(1);
  document.getElementById('v13RecAvgWater').textContent = avgW.toFixed(1);
  document.getElementById('v13RecCount').textContent = v13.recovery.length;
}

// ===== 6. RING MOVEMENT PATTERNS =====
var RING_PATTERNS = [
  {id:'lateral',name:'래터럴 무브',desc:'좌우로 이동하며 거리 유지',points:[[0.3,0.5],[0.5,0.5],[0.7,0.5],[0.5,0.5]]},
  {id:'pivot_left',name:'좌측 피벗',desc:'왼발을 축으로 시계방향 회전',points:[[0.5,0.6],[0.35,0.45],[0.4,0.3],[0.55,0.35]]},
  {id:'pivot_right',name:'우측 피벗',desc:'오른발을 축으로 반시계방향 회전',points:[[0.5,0.6],[0.65,0.45],[0.6,0.3],[0.45,0.35]]},
  {id:'cut_angle',name:'앵글 컷',desc:'대각선으로 이동하여 측면 공격',points:[[0.3,0.7],[0.5,0.5],[0.7,0.3],[0.5,0.5]]},
  {id:'circle_left',name:'좌측 서클',desc:'상대 주위를 왼쪽으로 순회',points:[[0.5,0.7],[0.3,0.5],[0.5,0.3],[0.7,0.5]]},
  {id:'circle_right',name:'우측 서클',desc:'상대 주위를 오른쪽으로 순회',points:[[0.5,0.7],[0.7,0.5],[0.5,0.3],[0.3,0.5]]},
  {id:'in_out',name:'인 앤 아웃',desc:'접근했다 빠졌다 반복',points:[[0.5,0.7],[0.5,0.45],[0.5,0.7],[0.5,0.45]]},
  {id:'diamond',name:'다이아뫈드',desc:'마름모 형태로 4방향 이동',points:[[0.5,0.3],[0.7,0.5],[0.5,0.7],[0.3,0.5]]}
];

function buildRingMovement(){
  var container = document.querySelector('.container');
  if(!container) return;
  var sec = document.createElement('section');
  sec.className = 'v13-section';
  sec.id = 'v13-ringmove';
  var pats = RING_PATTERNS.map(function(p,i){
    var cls = 'ring-btn';
    if(v13.ringPatterns[p.id]) cls += ' done';
    return '<button class="'+cls+'" data-idx="'+i+'">'+p.name+'</button>';
  }).join('');
  sec.innerHTML = '<h2 class="v13-title"><span class="emoji">🥊</span> 링 무브먼트 패턴</h2>\
<div class="v13-card">\
<div class="ring-patterns" id="v13RingPatterns">'+pats+'</div>\
<div class="ring-desc" id="v13RingDesc">'+RING_PATTERNS[0].desc+'</div>\
<canvas class="ring-canvas" id="v13RingCanvas" width="400" height="400"></canvas>\
<div style="text-align:center;margin-top:8px;font-size:11px;color:var(--text-muted)">\
완료: '+Object.keys(v13.ringPatterns).length+'/8 패턴\
</div>\
</div>';
  var reportSec = document.getElementById('v13-report');
  if(reportSec) container.insertBefore(sec, reportSec);
  else container.appendChild(sec);

  document.getElementById('v13RingPatterns').addEventListener('click', function(e){
    var btn = e.target.closest('.ring-btn');
    if(!btn) return;
    var idx = parseInt(btn.dataset.idx);
    document.querySelectorAll('.ring-btn').forEach(function(b,i){ b.classList.toggle('active', i===idx); });
    document.getElementById('v13RingDesc').textContent = RING_PATTERNS[idx].desc;
    drawRingCanvas(idx);
    v13.ringPatterns[RING_PATTERNS[idx].id] = true;
    saveV13(v13);
    playSFX13('ring_move');
    btn.classList.add('done');
  });

  drawRingCanvas(0);
}

function drawRingCanvas(idx){
  var cv = document.getElementById('v13RingCanvas');
  if(!cv) return;
  var ctx = cv.getContext('2d');
  var w = cv.width, h = cv.height;
  var isDark = !document.documentElement.hasAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = isDark ? '#1a1a2e' : '#f0f0f0';
  ctx.fillRect(0,0,w,h);

  var cx = w/2, cy = h/2;
  ctx.strokeStyle = isDark ? 'rgba(255,68,68,0.2)' : 'rgba(255,68,68,0.3)';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.rect(40,40,w-80,h-80); ctx.stroke();

  ctx.strokeStyle = isDark ? 'rgba(255,68,68,0.1)' : 'rgba(255,68,68,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx,40); ctx.lineTo(cx,h-40); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(40,cy); ctx.lineTo(w-40,cy); ctx.stroke();

  ctx.fillStyle = isDark ? '#f0f0f0' : '#333';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(RING_PATTERNS[idx].name, cx, 25);

  ctx.fillStyle = isDark ? '#555' : '#bbb';
  ctx.beginPath(); ctx.arc(cx, cy-30, 10, 0, Math.PI*2); ctx.fill();
  ctx.font = '8px sans-serif';
  ctx.fillStyle = isDark ? '#8a8a9e' : '#666';
  ctx.textAlign = 'center';
  ctx.fillText('상대', cx, cy-15);

  var p = RING_PATTERNS[idx];
  var pts = p.points;
  var rw = w-80, rh = h-80;

  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 3;
  ctx.setLineDash([8,4]);
  ctx.beginPath();
  pts.forEach(function(pt,i){
    var x = 40 + pt[0]*rw;
    var y = 40 + pt[1]*rh;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  pts.forEach(function(pt,i){
    var x = 40 + pt[0]*rw;
    var y = 40 + pt[1]*rh;
    ctx.fillStyle = i===0 ? '#22c55e' : '#3b82f6';
    ctx.beginPath(); ctx.arc(x,y,8,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(''+(i+1), x, y+4);
  });

  var arrowEnd = pts.length > 1 ? pts[pts.length-1] : pts[0];
  var arrowPrev = pts.length > 1 ? pts[pts.length-2] : pts[0];
  var ax = 40 + arrowEnd[0]*rw;
  var ay = 40 + arrowEnd[1]*rh;
  var px = 40 + arrowPrev[0]*rw;
  var py = 40 + arrowPrev[1]*rh;
  var angle = Math.atan2(ay-py, ax-px);
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.moveTo(ax + Math.cos(angle)*12, ay + Math.sin(angle)*12);
  ctx.lineTo(ax + Math.cos(angle+2.5)*10, ay + Math.sin(angle+2.5)*10);
  ctx.lineTo(ax + Math.cos(angle-2.5)*10, ay + Math.sin(angle-2.5)*10);
  ctx.closePath();
  ctx.fill();
}

// ===== 7. WEEKLY PROGRESS REPORT =====
function buildWeeklyReport(){
  var container = document.querySelector('.container');
  if(!container) return;
  var sec = document.createElement('section');
  sec.className = 'v13-section';
  sec.id = 'v13-report';
  sec.innerHTML = '<h2 class="v13-title"><span class="emoji">📊</span> 주간 프로그레스 리포트</h2>\
<div class="v13-card">\
<canvas class="report-canvas" id="v13ReportCanvas" width="400" height="400"></canvas>\
<div class="report-grade" id="v13ReportGrade" style="color:var(--gold)">-</div>\
<div class="report-metrics" id="v13ReportMetrics"></div>\
<div style="text-align:center;margin-top:8px">\
<button class="recov-btn" id="v13ReportGen">📊 리포트 생성</button>\
</div>\
</div>';
  var bgmSec = document.getElementById('v13-bgm');
  if(bgmSec) container.insertBefore(sec, bgmSec);
  else container.appendChild(sec);

  document.getElementById('v13ReportGen').addEventListener('click', function(){
    generateReport();
    playSFX13('report_open');
  });

  generateReport();
}

function generateReport(){
  var appData = loadAppData() || {};
  var sessions = (appData.sessions || []).slice(0, 7);
  var totalP = sessions.reduce(function(a,s){return a+(s.punches||0);},0);
  var totalT = sessions.reduce(function(a,s){return a+(s.duration||0);},0);
  var totalC = sessions.reduce(function(a,s){return a+(s.combos||0);},0);
  var totalCal = sessions.reduce(function(a,s){return a+(s.calories||0);},0);

  var metrics = {
    power: Math.min(totalP / 500 * 100, 100),
    endurance: Math.min(totalT / 60 * 100, 100),
    technique: Math.min(totalC / 50 * 100, 100),
    recovery: v13.recovery.length > 0 ? Math.min(v13.recovery[v13.recovery.length-1].sleep / 8 * 100, 100) : 50,
    defense: Math.min(Object.keys(v13.defenseDrills).length / 10 * 100, 100),
    agility: Math.min(Object.keys(v13.ringPatterns).length / 8 * 100, 100)
  };

  var avg = Object.values(metrics).reduce(function(a,b){return a+b;},0) / 6;
  var grade = avg >= 90 ? 'S' : avg >= 75 ? 'A' : avg >= 60 ? 'B' : avg >= 40 ? 'C' : 'D';
  var gradeColors = {S:'#FFD700',A:'#22c55e',B:'#3b82f6',C:'#f97316',D:'#FF4444'};

  document.getElementById('v13ReportGrade').textContent = grade + ' 등급';
  document.getElementById('v13ReportGrade').style.color = gradeColors[grade];

  var metricHTML = [
    {k:'power',l:'파워',v:metrics.power},
    {k:'endurance',l:'지구력',v:metrics.endurance},
    {k:'technique',l:'기술',v:metrics.technique},
    {k:'recovery',l:'회복',v:metrics.recovery},
    {k:'defense',l:'방어',v:metrics.defense},
    {k:'agility',l:'민첩성',v:metrics.agility}
  ].map(function(m){
    return '<div class="report-metric"><div class="report-metric-val">'+Math.round(m.v)+'</div><div class="report-metric-lbl">'+m.l+'</div></div>';
  }).join('');
  document.getElementById('v13ReportMetrics').innerHTML = metricHTML;

  drawRadarChart(metrics);
}

function drawRadarChart(metrics){
  var cv = document.getElementById('v13ReportCanvas');
  if(!cv) return;
  var ctx = cv.getContext('2d');
  var w = cv.width, h = cv.height;
  var isDark = !document.documentElement.hasAttribute('data-theme') || document.documentElement.getAttribute('data-theme') !== 'light';
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = isDark ? '#1a1a2e' : '#f0f0f0';
  ctx.fillRect(0,0,w,h);

  var cx = w/2, cy = h/2;
  var R = 140;
  var labels = ['파워','지구력','기술','회복','방어','민첩성'];
  var values = [metrics.power, metrics.endurance, metrics.technique, metrics.recovery, metrics.defense, metrics.agility];
  var n = 6;

  for(var ring=1;ring<=5;ring++){
    var r = R * ring/5;
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(var i=0;i<n;i++){
      var a = Math.PI*2*i/n - Math.PI/2;
      var x = cx + r*Math.cos(a);
      var y = cy + r*Math.sin(a);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  for(var i=0;i<n;i++){
    var a = Math.PI*2*i/n - Math.PI/2;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+R*Math.cos(a), cy+R*Math.sin(a)); ctx.stroke();
  }

  ctx.fillStyle = 'rgba(255,68,68,0.15)';
  ctx.strokeStyle = '#FF4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for(var i=0;i<n;i++){
    var a = Math.PI*2*i/n - Math.PI/2;
    var r = R * values[i]/100;
    var x = cx + r*Math.cos(a);
    var y = cy + r*Math.sin(a);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  for(var i=0;i<n;i++){
    var a = Math.PI*2*i/n - Math.PI/2;
    var r = R * values[i]/100;
    var x = cx + r*Math.cos(a);
    var y = cy + r*Math.sin(a);
    ctx.fillStyle = '#FF4444';
    ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill();
  }

  ctx.fillStyle = isDark ? '#f0f0f0' : '#333';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  for(var i=0;i<n;i++){
    var a = Math.PI*2*i/n - Math.PI/2;
    var lx = cx + (R+22)*Math.cos(a);
    var ly = cy + (R+22)*Math.sin(a) + 4;
    ctx.fillText(labels[i], lx, ly);
  }
}

// ===== 8. BOXING BGM PLAYLIST =====
var BGM_TRACKS = [
  {name:'파이터스 마치',bpm:140,icon:'🥊',kick:1,hat:1,bass:1},
  {name:'파워 펀치',bpm:150,icon:'💥',kick:1,hat:1,bass:0},
  {name:'스피드 러시',bpm:170,icon:'⚡',kick:1,hat:1,bass:1},
  {name:'헤비웨이트',bpm:120,icon:'🏋',kick:1,hat:0,bass:1},
  {name:'서킷 트레이닝',bpm:130,icon:'🔥',kick:1,hat:1,bass:0},
  {name:'라운드 타이머',bpm:160,icon:'⏱',kick:1,hat:1,bass:1},
  {name:'빅토리 테마',bpm:100,icon:'🏆',kick:0,hat:1,bass:1},
  {name:'워마업',bpm:90,icon:'🧘',kick:1,hat:0,bass:0},
  {name:'콤보 링',bpm:145,icon:'💢',kick:1,hat:1,bass:1},
  {name:'파이널 라운드',bpm:180,icon:'🌟',kick:1,hat:1,bass:1}
];

var bgmCtx = null;
var bgmInterval = null;
var bgmPlaying = false;
var bgmTrackIdx = 0;

function buildBGMPlaylist(){
  var container = document.querySelector('.container');
  if(!container) return;
  var sec = document.createElement('section');
  sec.className = 'v13-section';
  sec.id = 'v13-bgm';
  var cards = BGM_TRACKS.map(function(t,i){
    return '<div class="bgm-card" data-idx="'+i+'">\
<div class="bgm-icon">'+t.icon+'</div>\
<div class="bgm-name">'+t.name+'</div>\
<div class="bgm-bpm">'+t.bpm+' BPM</div>\
</div>';
  }).join('');
  sec.innerHTML = '<h2 class="v13-title"><span class="emoji">🎵</span> 복싱 BGM 플레이리스트</h2>\
<div class="v13-card">\
<div class="bgm-controls">\
<button class="bgm-ctrl skip" id="v13BgmPrev">◀ 이전</button>\
<button class="bgm-ctrl play" id="v13BgmPlay">▶ 재생</button>\
<button class="bgm-ctrl skip" id="v13BgmNext">다음 ▶</button>\
</div>\
<div style="text-align:center;font-size:14px;font-weight:700;margin:8px 0" id="v13BgmNow">곡 선택</div>\
<div class="bgm-grid" id="v13BgmGrid">'+cards+'</div>\
</div>';
  var quizSec = document.getElementById('v13-quiz');
  if(quizSec) container.insertBefore(sec, quizSec);
  else container.appendChild(sec);

  document.getElementById('v13BgmGrid').addEventListener('click', function(e){
    var card = e.target.closest('.bgm-card');
    if(!card) return;
    bgmTrackIdx = parseInt(card.dataset.idx);
    startBGM(bgmTrackIdx);
  });

  document.getElementById('v13BgmPlay').addEventListener('click', function(){
    if(bgmPlaying) stopBGM();
    else startBGM(bgmTrackIdx);
  });

  document.getElementById('v13BgmPrev').addEventListener('click', function(){
    bgmTrackIdx = (bgmTrackIdx - 1 + BGM_TRACKS.length) % BGM_TRACKS.length;
    startBGM(bgmTrackIdx);
  });

  document.getElementById('v13BgmNext').addEventListener('click', function(){
    bgmTrackIdx = (bgmTrackIdx + 1) % BGM_TRACKS.length;
    startBGM(bgmTrackIdx);
  });
}

function startBGM(idx){
  stopBGM();
  var track = BGM_TRACKS[idx];
  bgmPlaying = true;
  document.getElementById('v13BgmPlay').textContent = '■ 정지';
  document.getElementById('v13BgmPlay').className = 'bgm-ctrl stop';
  document.getElementById('v13BgmNow').textContent = track.icon + ' ' + track.name + ' (' + track.bpm + ' BPM)';

  document.querySelectorAll('.bgm-card').forEach(function(c,i){
    c.classList.toggle('playing', i===idx);
  });

  try {
    bgmCtx = new (window.AudioContext || window.webkitAudioContext)();
    var beatInterval = 60 / track.bpm;
    var beat = 0;

    bgmInterval = setInterval(function(){
      if(!bgmCtx) return;
      var t = bgmCtx.currentTime;

      if(track.kick && beat % 2 === 0){
        var osc = bgmCtx.createOscillator();
        var gain = bgmCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(gain).connect(bgmCtx.destination);
        osc.start(t); osc.stop(t + 0.15);
      }

      if(track.hat){
        var bufSize = 4096;
        var buf = bgmCtx.createBuffer(1, bufSize, bgmCtx.sampleRate);
        var data = buf.getChannelData(0);
        for(var i=0;i<bufSize;i++) data[i] = Math.random()*2-1;
        var noise = bgmCtx.createBufferSource();
        noise.buffer = buf;
        var hpf = bgmCtx.createBiquadFilter();
        hpf.type = 'highpass'; hpf.frequency.value = 8000;
        var gn = bgmCtx.createGain();
        gn.gain.setValueAtTime(0.04, t);
        gn.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        noise.connect(hpf).connect(gn).connect(bgmCtx.destination);
        noise.start(t); noise.stop(t + 0.04);
      }

      if(track.bass && beat % 4 === 0){
        var bassOsc = bgmCtx.createOscillator();
        var bassGain = bgmCtx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.value = [55,65,73,82][beat/4%4|0];
        bassGain.gain.setValueAtTime(0.1, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        bassOsc.connect(bassGain).connect(bgmCtx.destination);
        bassOsc.start(t); bassOsc.stop(t + 0.2);
      }

      beat++;
    }, beatInterval * 1000);
  } catch(e){}
}

function stopBGM(){
  bgmPlaying = false;
  if(bgmInterval) clearInterval(bgmInterval);
  bgmInterval = null;
  if(bgmCtx){ try { bgmCtx.close(); } catch(e){} bgmCtx = null; }
  var playBtn = document.getElementById('v13BgmPlay');
  if(playBtn){ playBtn.textContent = '▶ 재생'; playBtn.className = 'bgm-ctrl play'; }
  document.querySelectorAll('.bgm-card').forEach(function(c){ c.classList.remove('playing'); });
}

// ===== 9. QUIZ V13 (+15 QUESTIONS, 60->75) =====
var QUIZ_V13 = [
  {q:'줄넘기 훈련에서 더블 언더란?',a:['한 번 점프에 줄이 2번 돌아가는 기술','두 번 점프하는 기술','줄을 두 개 사용하는 기술','뒤로 점프하는 기술'],c:0},
  {q:'필리 셸(Philly Shell)을 시규처로 사용한 복서는?',a:['플로이드 메이웨더 주니어','마니 파키아오','마이크 타이슨','레놅스 루이스'],c:0},
  {q:'피카부(Peek-a-Boo) 스타일을 대표하는 복서는?',a:['마이크 타이슨','플로이드 메이웨더','마니 파키아오','복싱에서 사용하지 않는 용어'],c:0},
  {q:'복싱에서 클린치(Clinch)의 주요 목적은?',a:['체력 회복과 공격 붉쇄','상대에게 반칙 주기','심판에게 항의하기','반드시 반칙 받는 행위'],c:0},
  {q:'바디 샷(Body Shot)이 효과적인 이유는?',a:['상대 체력을 빠르게 소모시킴','반칙이 없음','관중이 환호함','심판 점수가 높음'],c:0},
  {q:'밥 앤 위브(Bob and Weave)란?',a:['무릎을 굽혀 아래로 피하고 올라오는 방어','링 주위를 도는 무브먼트','펀치를 흔들며 내뼉는 기술','상대와 거리를 좋히는 기술'],c:0},
  {q:'파이트 나이트에서 가장 고랜크 상대는?',a:['챔피언 타이탄','플래시 스트라이커','아이언 피스트','무명의 신인'],c:0},
  {q:'스위치 스탠스(Switch Stance)의 장점은?',a:['상대 타이밍 혼란','체력 절약','상대 공격력 상승','방어력 상승'],c:0},
  {q:'회복 트래커에서 추적하는 항목이 아닌 것은?',a:['혈액형','수면 시간','수분 섭취량','근육통 수준'],c:0},
  {q:'링 무브먼트에서 다이아뫈드 패턴은?',a:['마름모 형태로 4방향 이동','좌우로만 이동','원형으로 도는 패턴','전후로만 이동'],c:0},
  {q:'복싱에서 앵글 플레이(Angle Play)란?',a:['측면으로 이동하여 공격 각도를 만드는 전략','상대 펄보를 보며 훈련','펀치의 각도를 바꾸는 기술','가드 자세를 바꾸는 것'],c:0},
  {q:'줄넘기에서 복서 스텝(Boxer Skip)의 특징은?',a:['경쾌한 발놓림으로 리듬감 있게 점프','최대한 높이 점프','한 발로만 점프','무릎을 높이 올리며 점프'],c:0},
  {q:'방어 드릴에서 패리(Parry)란?',a:['손으로 상대 펀치를 흘려보내는 기술','몸을 굽혀 피하는 기술','어깨로 막는 기술','뒤로 미끼는 기술'],c:0},
  {q:'스피드 런 줄넘기의 권장 BPM은?',a:['180 BPM','120 BPM','90 BPM','60 BPM'],c:0},
  {q:'프레셔 파이팅 전략의 핵심은?',a:['상대를 로프 코너로 몰아붙이며 공격','거리를 유지하며 장타 펀치','카운터를 기다리는 전략','클린치로 체력 관리'],c:0}
];

var quizV13State = {idx:0, score:0, answered:false, total:QUIZ_V13.length};

function buildQuizV13(){
  var container = document.querySelector('.container');
  if(!container) return;
  var sec = document.createElement('section');
  sec.className = 'v13-section';
  sec.id = 'v13-quiz';
  sec.innerHTML = '<h2 class="v13-title"><span class="emoji">❓</span> 복싱 퀸즈 v4 (15문항)</h2>\
<div class="v13-quiz-panel" id="v13QuizPanel"></div>';
  container.appendChild(sec);
  renderQuizV13();
}

function renderQuizV13(){
  var panel = document.getElementById('v13QuizPanel');
  if(!panel) return;
  if(quizV13State.idx >= QUIZ_V13.length){
    var pct = Math.round(quizV13State.score / QUIZ_V13.length * 100);
    panel.innerHTML = '<div class="v13-quiz-result">🏆 '+quizV13State.score+'/'+QUIZ_V13.length+' ('+pct+'%)</div>\
<div style="text-align:center;color:var(--text-dim);font-size:13px;margin:8px 0">'+(pct>=80?'훌륭합니다!':pct>=60?'좋습니다!':'더 학습해보세요!')+'</div>\
<button class="rope-ctrl" onclick="document.getElementById(\'v13QuizPanel\').__retryQuiz()">&#128260; 다시 풀기</button>';
    panel.__retryQuiz = function(){
      quizV13State = {idx:0, score:0, answered:false, total:QUIZ_V13.length};
      renderQuizV13();
    };
    v13.quizV13Scores[new Date().toISOString().split('T')[0]] = quizV13State.score;
    saveV13(v13);
    return;
  }
  var q = QUIZ_V13[quizV13State.idx];
  quizV13State.answered = false;
  panel.innerHTML = '<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">'+(quizV13State.idx+1)+'/'+QUIZ_V13.length+'</div>\
<div class="v13-quiz-q">'+q.q+'</div>\
<div class="v13-quiz-opts" id="v13QuizOpts">'+q.a.map(function(a,i){
    return '<div class="v13-quiz-opt" data-idx="'+i+'">'+a+'</div>';
  }).join('')+'</div>';

  document.getElementById('v13QuizOpts').addEventListener('click', function(e){
    var opt = e.target.closest('.v13-quiz-opt');
    if(!opt || quizV13State.answered) return;
    quizV13State.answered = true;
    var idx = parseInt(opt.dataset.idx);
    var correct = q.c;
    if(idx === correct){
      opt.classList.add('correct');
      quizV13State.score++;
      playSFX13('quiz_v13');
    } else {
      opt.classList.add('wrong');
      document.querySelectorAll('.v13-quiz-opt')[correct].classList.add('correct');
    }
    setTimeout(function(){
      quizV13State.idx++;
      renderQuizV13();
    }, 1200);
  });
}

// ===== 10. ACHIEVEMENTS V13 (+12, 70->82) =====
var ACHIEVEMENTS_V13 = [
  {id:'rope_first',name:'첫 줄넘기',icon:'🤾',desc:'줄넘기 첫 완료'},
  {id:'rope_all',name:'로프 마스터',icon:'🏅',desc:'8개 패턴 전부 완료'},
  {id:'rope_500',name:'500회 점프',icon:'💪',desc:'총 점프 500회 달성'},
  {id:'strat_reader',name:'전략가',icon:'📖',desc:'전략 6개 이상 열람'},
  {id:'strat_master',name:'전략 마스터',icon:'🎯',desc:'12개 전략 전부 열람'},
  {id:'def_5',name:'방어 경험자',icon:'🛡',desc:'방어 드릴 5개 완료'},
  {id:'def_all',name:'철벽 방어',icon:'🧱',desc:'10개 방어 드릴 전부 완료'},
  {id:'fight_win',name:'첫 승리',icon:'🥊',desc:'파이트 나이트 첫 승리'},
  {id:'fight_champ',name:'챔피언',icon:'🏆',desc:'파이트 나이트 5연승 챔피언'},
  {id:'recov_7',name:'회복 관리자',icon:'💤',desc:'회복 기록 7일 이상'},
  {id:'ring_all',name:'링 마스터',icon:'🤸',desc:'8개 링 패턴 전부 완료'},
  {id:'v13_explorer',name:'v13 탐험가',icon:'🌟',desc:'v13 전체 기능 체험'}
];

function checkV13Achievements(){
  var unlocked = [];
  var appData = loadAppData() || {};
  if(!appData.achievements) appData.achievements = {};

  ACHIEVEMENTS_V13.forEach(function(ach){
    if(appData.achievements[ach.id]) return;
    var earned = false;
    switch(ach.id){
      case 'rope_first': earned = Object.keys(v13.ropePatterns).length >= 1; break;
      case 'rope_all': earned = Object.keys(v13.ropePatterns).length >= 8; break;
      case 'rope_500': earned = v13.ropeTotal >= 500; break;
      case 'strat_reader': earned = v13.strategyViewed.length >= 6; break;
      case 'strat_master': earned = v13.strategyViewed.length >= 12; break;
      case 'def_5': earned = Object.keys(v13.defenseDrills).length >= 5; break;
      case 'def_all': earned = Object.keys(v13.defenseDrills).length >= 10; break;
      case 'fight_win': earned = v13.fightNight.wins >= 1; break;
      case 'fight_champ': earned = v13.fightNight.best >= 5; break;
      case 'recov_7': earned = v13.recovery.length >= 7; break;
      case 'ring_all': earned = Object.keys(v13.ringPatterns).length >= 8; break;
      case 'v13_explorer': earned = Object.keys(v13.ropePatterns).length >= 1 &&
        v13.strategyViewed.length >= 1 && Object.keys(v13.defenseDrills).length >= 1 &&
        v13.fightNight.attempts >= 1 && v13.recovery.length >= 1 &&
        Object.keys(v13.ringPatterns).length >= 1; break;
    }
    if(earned){
      appData.achievements[ach.id] = new Date().toISOString();
      unlocked.push(ach);
    }
  });

  if(unlocked.length > 0){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(appData)); } catch(e){}
    unlocked.forEach(function(ach){
      showToast13('🏅 업적 해제: '+ach.name);
    });
  }
}

// ===== 11. FAB BUTTONS =====
function buildFABButtons(){
  var fab = document.createElement('div');
  fab.className = 'v13-fab-container';
  fab.innerHTML = '\
<div class="v13-fab" title="줄넘기" onclick="document.getElementById(\'v13-rope\').scrollIntoView({behavior:\'smooth\'})">🤾</div>\
<div class="v13-fab" title="전략" onclick="document.getElementById(\'v13-strategies\').scrollIntoView({behavior:\'smooth\'})">📖</div>\
<div class="v13-fab" title="방어" onclick="document.getElementById(\'v13-defense\').scrollIntoView({behavior:\'smooth\'})">🛡</div>\
<div class="v13-fab" title="파이트" onclick="document.getElementById(\'v13-fightnight\').scrollIntoView({behavior:\'smooth\'})">🌟</div>\
<div class="v13-fab" title="회복" onclick="document.getElementById(\'v13-recovery\').scrollIntoView({behavior:\'smooth\'})">💤</div>\
<div class="v13-fab" title="링무브" onclick="document.getElementById(\'v13-ringmove\').scrollIntoView({behavior:\'smooth\'})">🥊</div>\
<div class="v13-fab" title="리포트" onclick="document.getElementById(\'v13-report\').scrollIntoView({behavior:\'smooth\'})">📊</div>\
<div class="v13-fab" title="BGM" onclick="document.getElementById(\'v13-bgm\').scrollIntoView({behavior:\'smooth\'})">🎵</div>';
  document.body.appendChild(fab);
}

// ===== 12. KEYBOARD SHORTCUTS =====
function setupV13Keyboard(){
  document.addEventListener('keydown', function(e){
    if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if(!e.shiftKey) return;
    var sec = null;
    switch(e.key){
      case 'J': sec = 'v13-rope'; break;
      case 'S': sec = 'v13-strategies'; break;
      case 'D': sec = 'v13-defense'; break;
      case 'G': sec = 'v13-fightnight'; break;
      case 'R': sec = 'v13-recovery'; break;
      case 'I': sec = 'v13-ringmove'; break;
      case 'P': sec = 'v13-report'; break;
      case 'B': sec = 'v13-bgm'; break;
    }
    if(sec){
      e.preventDefault();
      var el = document.getElementById(sec);
      if(el) el.scrollIntoView({behavior:'smooth'});
    }
  });
}

// ===== INIT =====
function initV13(){
  injectV13CSS();

  var container = document.querySelector('.container');
  if(!container) return;

  var footer = document.querySelector('.footer');

  buildRopeTrainer();
  buildStrategyPlaybook();
  buildDefenseDrills();
  buildFightNight();
  buildRecoveryTracker();
  buildRingMovement();
  buildWeeklyReport();
  buildBGMPlaylist();
  buildQuizV13();

  buildFABButtons();
  setupV13Keyboard();

  setInterval(checkV13Achievements, 10000);

  var badgeGrid = document.getElementById('badgeGrid');
  if(badgeGrid){
    var appData = loadAppData() || {};
    ACHIEVEMENTS_V13.forEach(function(ach){
      var unlocked = appData.achievements && appData.achievements[ach.id];
      var badge = document.createElement('div');
      badge.className = 'badge ' + (unlocked ? 'unlocked' : 'locked');
      badge.innerHTML = '<div class="badge-icon">'+ach.icon+'</div><div class="badge-name">'+ach.name+'</div>';
      badge.title = ach.desc;
      badgeGrid.appendChild(badge);
    });
  }
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initV13);
} else {
  initV13();
}

})();
