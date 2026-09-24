// Boxing Trainer Pro v10_patch.js - NEXTERA+PRISM Auto Enhancement Module
// Sparring Sim, Training Calendar, Combo Encyclopedia 20, Round Timer,
// Body Stats Tracker, Technique Tutorial 12, Weekly Challenge, Endurance Test,
// Quiz +15 (15->30), +12 Achievements (34->46), SFX 6, Keyboard +5
(function(){
'use strict';

var STORAGE_KEY = 'boxingTrainerData';
var V10KEY = 'boxingV10Patch';

function loadAppData(){
  try { var r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch(e){ return null; }
}
function loadV10(){
  try {
    var r = localStorage.getItem(V10KEY);
    if(!r) return defV10();
    var p = JSON.parse(r), d = defV10();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV10(); }
}
function saveV10(d){ try { localStorage.setItem(V10KEY, JSON.stringify(d)); } catch(e){} }
function defV10(){
  return {
    bodyStats: [],
    calendarPlans: {},
    sparringSessions: [],
    timerPresets: [],
    challengeHistory: {},
    enduranceBest: 0,
    quizV10Scores: {},
    comboFavorites: [],
    techniqueRead: {}
  };
}

var v10 = loadV10();

// ===== SFX ENGINE =====
function playSFX10(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'sparring_hit':
        var o=ctx.createOscillator(),g=ctx.createGain(),n=ctx.createBufferSource();
        o.type='square';o.frequency.setValueAtTime(120,t);o.frequency.exponentialRampToValueAtTime(40,t+0.08);
        g.gain.setValueAtTime(0.25,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.12);
        var buf=ctx.createBuffer(1,ctx.sampleRate*0.06,ctx.sampleRate),ch=buf.getChannelData(0);
        for(var i=0;i<ch.length;i++)ch[i]=(Math.random()*2-1)*Math.exp(-i/(ch.length*0.15));
        n.buffer=buf;var g2=ctx.createGain();g2.gain.setValueAtTime(0.15,t);g2.gain.exponentialRampToValueAtTime(0.001,t+0.06);
        n.connect(g2).connect(ctx.destination);n.start(t);break;
      case 'timer_bell':
        [523,659,784].forEach(function(f,j){
          var o2=ctx.createOscillator(),g3=ctx.createGain();
          o2.type='sine';o2.frequency.value=f;
          g3.gain.setValueAtTime(0.2,t+j*0.05);g3.gain.exponentialRampToValueAtTime(0.001,t+j*0.05+0.5);
          o2.connect(g3).connect(ctx.destination);o2.start(t+j*0.05);o2.stop(t+j*0.05+0.5);
        });
        var o3=ctx.createOscillator(),g4=ctx.createGain();
        o3.type='sine';o3.frequency.value=1047;
        g4.gain.setValueAtTime(0.3,t+0.15);g4.gain.exponentialRampToValueAtTime(0.001,t+0.8);
        o3.connect(g4).connect(ctx.destination);o3.start(t+0.15);o3.stop(t+0.8);break;
      case 'combo_demo':
        [262,330,392,523].forEach(function(f,j){
          var o4=ctx.createOscillator(),g5=ctx.createGain();
          o4.type='triangle';o4.frequency.value=f;
          g5.gain.setValueAtTime(0.12,t+j*0.06);g5.gain.exponentialRampToValueAtTime(0.001,t+j*0.06+0.15);
          o4.connect(g5).connect(ctx.destination);o4.start(t+j*0.06);o4.stop(t+j*0.06+0.15);
        });break;
      case 'body_stat':
        var o5=ctx.createOscillator(),g6=ctx.createGain();
        o5.type='sine';o5.frequency.setValueAtTime(440,t);o5.frequency.linearRampToValueAtTime(660,t+0.2);
        g6.gain.setValueAtTime(0.15,t);g6.gain.exponentialRampToValueAtTime(0.001,t+0.3);
        o5.connect(g6).connect(ctx.destination);o5.start(t);o5.stop(t+0.3);break;
      case 'technique':
        [349,440,523].forEach(function(f,j){
          var o6=ctx.createOscillator(),g7=ctx.createGain();
          o6.type='sine';o6.frequency.value=f;
          g7.gain.setValueAtTime(0.1,t+j*0.1);g7.gain.exponentialRampToValueAtTime(0.001,t+j*0.1+0.2);
          o6.connect(g7).connect(ctx.destination);o6.start(t+j*0.1);o6.stop(t+j*0.1+0.2);
        });break;
      case 'challenge':
        [523,659,784,1047].forEach(function(f,j){
          var o7=ctx.createOscillator(),g8=ctx.createGain();
          o7.type='square';o7.frequency.value=f;
          g8.gain.setValueAtTime(0.08,t+j*0.08);g8.gain.exponentialRampToValueAtTime(0.001,t+j*0.08+0.2);
          o7.connect(g8).connect(ctx.destination);o7.start(t+j*0.08);o7.stop(t+j*0.08+0.2);
        });break;
    }
  } catch(e){}
}

// ===== CSS =====
function injectV10CSS(){
  var s = document.createElement('style');
  s.textContent = '\
.v10-section{margin:24px 0;animation:slideUp 0.5s ease-out both}\
.sparring-arena{position:relative;width:100%;max-width:500px;margin:0 auto;\
background:linear-gradient(180deg,rgba(15,10,30,0.9),rgba(30,20,50,0.9));\
border:2px solid rgba(255,68,68,0.3);border-radius:var(--radius);padding:20px;overflow:hidden}\
.sparring-arena::before{content:"";position:absolute;top:0;left:0;right:0;bottom:0;\
background:repeating-linear-gradient(90deg,transparent,transparent 49%,rgba(255,68,68,0.05) 49%,rgba(255,68,68,0.05) 51%,transparent 51%);pointer-events:none}\
.sparring-hud{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}\
.sparring-hp{width:40%;height:12px;background:var(--surface);border-radius:6px;overflow:hidden;border:1px solid var(--glass-border)}\
.sparring-hp-fill{height:100%;border-radius:6px;transition:width 0.3s}\
.sparring-hp-fill.player{background:linear-gradient(90deg,var(--green),#4ade80)}\
.sparring-hp-fill.ai{background:linear-gradient(90deg,var(--accent),#FF8866)}\
.sparring-vs{font-size:14px;font-weight:900;color:var(--gold);text-shadow:0 0 8px rgba(255,215,0,0.5)}\
.sparring-fighters{display:flex;justify-content:space-between;align-items:center;height:120px;margin:10px 0}\
.sparring-fighter{width:80px;text-align:center;transition:transform 0.2s}\
.sparring-fighter.attack-left{animation:punchRight 0.3s ease-out}\
.sparring-fighter.attack-right{animation:punchLeft 0.3s ease-out}\
.sparring-fighter.dodge{animation:dodgeAnim 0.3s ease-out}\
.sparring-fighter.hit{animation:shake 0.3s ease-out}\
.sparring-fighter-body{font-size:56px;line-height:1}\
.sparring-fighter-name{font-size:11px;color:var(--text-dim);margin-top:4px;font-weight:700}\
.sparring-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}\
.sparring-btn{padding:12px 8px;border:2px solid var(--glass-border);border-radius:12px;\
background:var(--glass);cursor:pointer;text-align:center;transition:all 0.15s;color:var(--text)}\
.sparring-btn:hover{border-color:var(--accent);transform:scale(1.03)}\
.sparring-btn:active{transform:scale(0.97);background:var(--accent-soft)}\
.sparring-btn-icon{font-size:22px;display:block}\
.sparring-btn-label{font-size:10px;color:var(--text-dim);margin-top:2px}\
.sparring-log{max-height:80px;overflow-y:auto;margin-top:10px;padding:8px;\
background:rgba(0,0,0,0.3);border-radius:8px;font-size:11px;color:var(--text-muted);line-height:1.8}\
.sparring-log-entry.player{color:var(--green)}\
.sparring-log-entry.ai{color:var(--accent)}\
.sparring-log-entry.dodge{color:var(--blue)}\
.sparring-result{text-align:center;padding:20px}\
.sparring-result-icon{font-size:64px;margin-bottom:10px}\
.sparring-result-text{font-size:24px;font-weight:900}\
@keyframes punchRight{0%{transform:translateX(0)}40%{transform:translateX(30px)}100%{transform:translateX(0)}}\
@keyframes punchLeft{0%{transform:translateX(0)}40%{transform:translateX(-30px)}100%{transform:translateX(0)}}\
@keyframes dodgeAnim{0%{transform:translateY(0)}40%{transform:translateY(-15px) rotate(-5deg)}100%{transform:translateY(0)}}\
.cal-month{margin-bottom:16px}\
.cal-month-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}\
.cal-month-title{font-size:16px;font-weight:800}\
.cal-month-nav{display:flex;gap:8px}\
.cal-month-btn{width:32px;height:32px;border-radius:50%;border:1px solid var(--glass-border);\
background:var(--glass);cursor:pointer;color:var(--text-dim);font-size:14px;\
display:flex;align-items:center;justify-content:center;transition:all 0.2s}\
.cal-month-btn:hover{border-color:var(--accent);color:var(--accent)}\
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}\
.cal-dow{text-align:center;font-size:10px;color:var(--text-muted);font-weight:700;padding:4px 0}\
.cal-cell{aspect-ratio:1;border-radius:10px;display:flex;flex-direction:column;align-items:center;\
justify-content:center;font-size:12px;color:var(--text-dim);cursor:pointer;transition:all 0.2s;\
border:1px solid transparent;background:var(--surface);position:relative}\
.cal-cell:hover{border-color:var(--accent)}\
.cal-cell.today{border-color:var(--accent);color:var(--accent);font-weight:700}\
.cal-cell.has-plan{background:rgba(59,130,246,0.1);border-color:rgba(59,130,246,0.3)}\
.cal-cell.has-plan::after{content:"";position:absolute;bottom:3px;width:5px;height:5px;\
border-radius:50%;background:var(--blue)}\
.cal-cell.trained{background:rgba(34,197,94,0.1);border-color:rgba(34,197,94,0.3)}\
.cal-cell.trained::after{content:"";position:absolute;bottom:3px;width:5px;height:5px;\
border-radius:50%;background:var(--green)}\
.cal-cell.empty{background:transparent;cursor:default;border:none}\
.cal-plan-form{margin-top:12px;padding:12px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:12px}\
.cal-plan-form-title{font-size:13px;font-weight:700;margin-bottom:8px}\
.cal-plan-input{width:100%;padding:8px 12px;border:1px solid var(--glass-border);border-radius:8px;\
background:var(--surface);color:var(--text);font-size:12px;margin-bottom:8px}\
.cal-plan-btns{display:flex;gap:8px}\
.cal-plan-btn{padding:6px 16px;border:none;border-radius:8px;font-size:12px;font-weight:700;\
cursor:pointer;transition:all 0.2s}\
.cal-plan-btn.save{background:var(--blue);color:#fff}\
.cal-plan-btn.cancel{background:var(--glass);color:var(--text-dim);border:1px solid var(--glass-border)}\
.combo-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}\
.combo-card{padding:14px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:14px;cursor:pointer;transition:all 0.3s;position:relative;overflow:hidden}\
.combo-card:hover{border-color:var(--accent);transform:translateY(-2px)}\
.combo-card.expanded{grid-column:1/-1}\
.combo-header{display:flex;justify-content:space-between;align-items:center}\
.combo-name{font-size:14px;font-weight:800}\
.combo-diff{font-size:9px;font-weight:700;padding:2px 8px;border-radius:10px;text-transform:uppercase;letter-spacing:0.5px}\
.combo-diff.easy{background:rgba(34,197,94,0.15);color:var(--green)}\
.combo-diff.medium{background:rgba(249,115,22,0.15);color:var(--orange)}\
.combo-diff.hard{background:rgba(255,68,68,0.15);color:var(--accent)}\
.combo-seq{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}\
.combo-punch{padding:6px 10px;border-radius:8px;font-size:11px;font-weight:700;\
background:var(--surface);border:1px solid var(--glass-border);color:var(--text-dim)}\
.combo-punch.jab{border-color:rgba(59,130,246,0.4);color:var(--blue)}\
.combo-punch.cross{border-color:rgba(255,68,68,0.4);color:var(--accent)}\
.combo-punch.hook{border-color:rgba(249,115,22,0.4);color:var(--orange)}\
.combo-punch.uppercut{border-color:rgba(168,85,247,0.4);color:var(--purple)}\
.combo-punch.slip{border-color:rgba(34,197,94,0.4);color:var(--green)}\
.combo-punch.roll{border-color:rgba(255,215,0,0.4);color:var(--gold)}\
.combo-detail{margin-top:12px;padding-top:12px;border-top:1px solid var(--glass-border);\
font-size:12px;color:var(--text-dim);line-height:1.7;display:none}\
.combo-card.expanded .combo-detail{display:block}\
.combo-fav{position:absolute;top:10px;right:10px;font-size:18px;cursor:pointer;opacity:0.3;transition:opacity 0.2s}\
.combo-fav.active{opacity:1}\
.timer-display{text-align:center;padding:20px}\
.timer-time{font-size:72px;font-weight:900;font-variant-numeric:tabular-nums;\
color:var(--accent);text-shadow:0 0 30px var(--accent-glow)}\
.timer-round{font-size:16px;color:var(--text-dim);margin-top:4px;font-weight:700}\
.timer-phase{font-size:14px;font-weight:700;margin-top:6px;text-transform:uppercase;letter-spacing:2px}\
.timer-phase.work{color:var(--accent)}\
.timer-phase.rest{color:var(--green)}\
.timer-config{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:16px 0}\
.timer-config-item{text-align:center}\
.timer-config-label{font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}\
.timer-config-val{display:flex;align-items:center;justify-content:center;gap:6px}\
.timer-adj{width:28px;height:28px;border-radius:50%;border:1px solid var(--glass-border);\
background:var(--glass);cursor:pointer;color:var(--text-dim);font-size:16px;\
display:flex;align-items:center;justify-content:center;transition:all 0.2s}\
.timer-adj:hover{border-color:var(--accent);color:var(--accent)}\
.timer-num{font-size:20px;font-weight:800;min-width:30px;text-align:center}\
.timer-btns{display:flex;gap:10px;justify-content:center;margin-top:16px}\
.timer-btn{padding:12px 28px;border:none;border-radius:12px;font-size:15px;\
font-weight:700;cursor:pointer;transition:all 0.2s;letter-spacing:1px}\
.timer-btn.start{background:var(--accent);color:#fff}\
.timer-btn.start:hover{filter:brightness(1.1)}\
.timer-btn.stop{background:var(--glass);color:var(--text-dim);border:1px solid var(--glass-border)}\
.timer-btn.stop:hover{border-color:var(--accent);color:var(--accent)}\
.body-stats-chart{display:flex;align-items:flex-end;height:100px;gap:2px;margin:10px 0}\
.body-stats-bar{flex:1;border-radius:3px 3px 0 0;background:linear-gradient(to top,var(--blue),rgba(59,130,246,0.4));\
min-height:2px;transition:height 0.4s}\
.body-stats-form{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}\
.body-stats-input-wrap{display:flex;flex-direction:column;gap:4px}\
.body-stats-label{font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px}\
.body-stats-input{padding:8px 12px;border:1px solid var(--glass-border);border-radius:8px;\
background:var(--surface);color:var(--text);font-size:14px;font-weight:700;width:100%}\
.body-stats-save{grid-column:1/-1;padding:10px;border:none;border-radius:10px;\
background:var(--blue);color:#fff;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s}\
.body-stats-save:hover{filter:brightness(1.1)}\
.body-stats-history{margin-top:12px;max-height:120px;overflow-y:auto}\
.body-stats-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--glass-border);\
font-size:12px;color:var(--text-dim)}\
.technique-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px}\
.technique-card{padding:16px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:14px;cursor:pointer;transition:all 0.3s}\
.technique-card:hover{border-color:var(--accent);transform:translateY(-2px)}\
.technique-card.read{opacity:0.7}\
.technique-header{display:flex;align-items:center;gap:10px}\
.technique-icon{width:40px;height:40px;border-radius:10px;\
background:linear-gradient(135deg,var(--accent),var(--orange));\
display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}\
.technique-title{font-size:14px;font-weight:800}\
.technique-cat{font-size:10px;color:var(--text-muted)}\
.technique-steps{margin-top:12px;display:none;font-size:12px;color:var(--text-dim);line-height:1.8}\
.technique-card.expanded .technique-steps{display:block}\
.technique-step{display:flex;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.03)}\
.technique-step-num{width:20px;height:20px;border-radius:50%;background:var(--accent-soft);\
display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;\
color:var(--accent);flex-shrink:0}\
.challenge-board{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}\
.challenge-item{padding:14px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:14px;position:relative;overflow:hidden}\
.challenge-item.completed{border-color:var(--gold);background:rgba(255,215,0,0.04)}\
.challenge-item.completed::before{content:"\\2713";position:absolute;top:8px;right:10px;\
font-size:16px;color:var(--gold)}\
.challenge-name{font-size:13px;font-weight:800;margin-bottom:4px}\
.challenge-desc{font-size:11px;color:var(--text-dim);line-height:1.5}\
.challenge-reward{font-size:10px;color:var(--gold);margin-top:6px;font-weight:700}\
.challenge-progress{margin-top:8px;height:6px;background:var(--surface);border-radius:3px;overflow:hidden}\
.challenge-progress-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--gold),var(--orange));transition:width 0.4s}\
.endurance-area{text-align:center;padding:20px}\
.endurance-counter{font-size:72px;font-weight:900;color:var(--accent);font-variant-numeric:tabular-nums}\
.endurance-timer{font-size:24px;color:var(--text-dim);margin-top:4px;font-variant-numeric:tabular-nums}\
.endurance-target{font-size:12px;color:var(--text-muted);margin-top:8px}\
.endurance-btn{padding:14px 32px;border:none;border-radius:12px;font-size:16px;font-weight:700;\
cursor:pointer;transition:all 0.2s;margin-top:16px}\
.endurance-btn.go{background:var(--accent);color:#fff}\
.endurance-btn.go:hover{filter:brightness(1.1)}\
.endurance-best{margin-top:12px;font-size:13px;color:var(--gold);font-weight:700}\
.endurance-click-zone{width:200px;height:200px;margin:16px auto;border-radius:50%;\
background:linear-gradient(135deg,var(--accent),#CC2222);display:flex;align-items:center;\
justify-content:center;cursor:pointer;transition:transform 0.05s;font-size:48px;color:#fff;\
box-shadow:0 0 30px var(--accent-glow);user-select:none;-webkit-user-select:none}\
.endurance-click-zone:active{transform:scale(0.95)}\
@media(max-width:768px){\
  .sparring-actions{grid-template-columns:repeat(2,1fr)}\
  .combo-grid{grid-template-columns:1fr}\
  .timer-time{font-size:56px}\
  .body-stats-form{grid-template-columns:1fr}\
  .technique-grid{grid-template-columns:1fr}\
  .challenge-board{grid-template-columns:1fr}\
  .endurance-click-zone{width:160px;height:160px;font-size:36px}\
}';
  document.head.appendChild(s);
}

// ===== SPARRING SIMULATION =====
var sparState = null;

function initSparring(){
  sparState = {
    playerHP: 100, aiHP: 100,
    round: 1, maxRounds: 3,
    playerCombo: 0, aiCombo: 0,
    log: [], active: true,
    aiPattern: Math.floor(Math.random()*3),
    aiTimer: null
  };
}

function sparAction(action){
  if(!sparState || !sparState.active) return;
  var aiAction = sparAI();
  var pDmg = 0, aDmg = 0, pMsg = '', aMsg = '';

  if(action === 'jab'){
    if(aiAction === 'dodge'){ pMsg = '잡 → AI 회피!'; }
    else { pDmg = 8 + Math.floor(Math.random()*4); pMsg = '잡 명중! -'+pDmg; }
  } else if(action === 'cross'){
    if(aiAction === 'dodge'){ pMsg = '크로스 → AI 회피!'; }
    else { pDmg = 12 + Math.floor(Math.random()*6); pMsg = '크로스 명중! -'+pDmg; }
  } else if(action === 'hook'){
    if(aiAction === 'dodge'){ pMsg = '훅 → AI 회피!'; }
    else { pDmg = 15 + Math.floor(Math.random()*5); pMsg = '훅 명중! -'+pDmg; }
  } else if(action === 'uppercut'){
    if(aiAction === 'dodge'){ pMsg = '어퍼컷 → AI 회피!'; }
    else { pDmg = 18 + Math.floor(Math.random()*7); pMsg = '어퍼컷! -'+pDmg; }
  } else if(action === 'dodge'){
    if(aiAction === 'attack'){ pMsg = '회피 성공!'; }
    else { pMsg = '회피 자세'; }
  } else if(action === 'guard'){
    if(aiAction === 'attack'){ aDmg = Math.floor(aDmg * 0.3); pMsg = '가드로 방어!'; }
    else { pMsg = '가드 자세'; }
  }

  if(aiAction === 'attack' && action !== 'dodge' && action !== 'guard'){
    var aiPunches = ['잡','크로스','훅','어퍼컷'];
    var aiPunch = aiPunches[Math.floor(Math.random()*aiPunches.length)];
    aDmg = 6 + Math.floor(Math.random()*8);
    aMsg = 'AI '+aiPunch+' 공격! -'+aDmg;
  } else if(aiAction === 'attack' && action === 'guard'){
    aDmg = 2 + Math.floor(Math.random()*3);
    aMsg = 'AI 공격 가드로 감소! -'+aDmg;
  } else if(aiAction === 'dodge'){
    aMsg = 'AI 회피 자세';
  } else if(aiAction === 'guard'){
    pDmg = Math.floor(pDmg * 0.4);
    aMsg = 'AI 가드 (-'+pDmg+'만)';
  }

  sparState.aiHP = Math.max(0, sparState.aiHP - pDmg);
  sparState.playerHP = Math.max(0, sparState.playerHP - aDmg);

  if(pMsg) sparState.log.unshift({text: pMsg, cls: pDmg > 0 ? 'player' : 'dodge'});
  if(aMsg) sparState.log.unshift({text: aMsg, cls: aDmg > 0 ? 'ai' : 'dodge'});
  if(sparState.log.length > 20) sparState.log = sparState.log.slice(0, 20);

  if(pDmg > 0) playSFX10('sparring_hit');

  if(sparState.aiHP <= 0 || sparState.playerHP <= 0){
    sparState.active = false;
    var won = sparState.aiHP <= 0;
    v10.sparringSessions.push({
      date: new Date().toISOString(),
      won: won,
      playerHP: sparState.playerHP,
      aiHP: sparState.aiHP,
      round: sparState.round
    });
    saveV10(v10);
  }

  renderSparring();
}

function sparAI(){
  var r = Math.random();
  var pattern = sparState.aiPattern;
  if(pattern === 0){ return r < 0.5 ? 'attack' : r < 0.75 ? 'dodge' : 'guard'; }
  if(pattern === 1){ return r < 0.3 ? 'attack' : r < 0.7 ? 'dodge' : 'guard'; }
  return r < 0.6 ? 'attack' : r < 0.8 ? 'dodge' : 'guard';
}

function renderSparring(){
  var el = document.getElementById('v10Sparring');
  if(!el) return;

  if(!sparState){ initSparring(); }

  if(!sparState.active){
    var won = sparState.aiHP <= 0;
    var wins = v10.sparringSessions.filter(function(s){return s.won;}).length;
    var total = v10.sparringSessions.length;
    el.innerHTML = '<div class="sparring-result"><div class="sparring-result-icon">'+(won?'🏆':'😢')+'</div><div class="sparring-result-text" style="color:'+(won?'var(--gold)':'var(--accent)')+'">'+(won?'승리!':'패배...')+'</div><div style="margin-top:8px;font-size:13px;color:var(--text-dim)">HP: '+sparState.playerHP+' vs AI: '+sparState.aiHP+'</div><div style="margin-top:4px;font-size:12px;color:var(--text-muted)">전적: '+wins+'승 '+(total-wins)+'패</div><div style="margin-top:16px"><button class="timer-btn start" id="sparRetry">다시 스파링</button></div></div>';
    var rb = document.getElementById('sparRetry');
    if(rb) rb.addEventListener('click', function(){ initSparring(); renderSparring(); });
    return;
  }

  var html = '<div class="sparring-arena">';
  html += '<div class="sparring-hud"><div style="text-align:left;flex:1"><div style="font-size:10px;color:var(--green);font-weight:700;margin-bottom:2px">PLAYER '+sparState.playerHP+'%</div><div class="sparring-hp"><div class="sparring-hp-fill player" style="width:'+sparState.playerHP+'%"></div></div></div>';
  html += '<div class="sparring-vs">VS</div>';
  html += '<div style="text-align:right;flex:1"><div style="font-size:10px;color:var(--accent);font-weight:700;margin-bottom:2px">AI '+sparState.aiHP+'%</div><div class="sparring-hp"><div class="sparring-hp-fill ai" style="width:'+sparState.aiHP+'%"></div></div></div></div>';
  html += '<div class="sparring-fighters"><div class="sparring-fighter" id="sparPlayer"><div class="sparring-fighter-body">🥊</div><div class="sparring-fighter-name">PLAYER</div></div><div style="font-size:32px;color:var(--accent-glow)">⚔️</div><div class="sparring-fighter" id="sparAI"><div class="sparring-fighter-body">🤖</div><div class="sparring-fighter-name">AI</div></div></div>';
  html += '<div class="sparring-actions">';
  html += '<div class="sparring-btn" data-action="jab"><span class="sparring-btn-icon">👊</span><span class="sparring-btn-label">잡</span></div>';
  html += '<div class="sparring-btn" data-action="cross"><span class="sparring-btn-icon">🤛</span><span class="sparring-btn-label">크로스</span></div>';
  html += '<div class="sparring-btn" data-action="hook"><span class="sparring-btn-icon">💪</span><span class="sparring-btn-label">훅</span></div>';
  html += '<div class="sparring-btn" data-action="uppercut"><span class="sparring-btn-icon">⚡</span><span class="sparring-btn-label">어퍼컷</span></div>';
  html += '<div class="sparring-btn" data-action="dodge"><span class="sparring-btn-icon">🚶</span><span class="sparring-btn-label">회피</span></div>';
  html += '<div class="sparring-btn" data-action="guard"><span class="sparring-btn-icon">🛡️</span><span class="sparring-btn-label">가드</span></div>';
  html += '</div>';

  if(sparState.log.length > 0){
    html += '<div class="sparring-log">';
    sparState.log.slice(0,6).forEach(function(l){
      html += '<div class="sparring-log-entry '+l.cls+'">'+l.text+'</div>';
    });
    html += '</div>';
  }
  html += '</div>';
  el.innerHTML = html;

  el.querySelectorAll('.sparring-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      sparAction(this.getAttribute('data-action'));
    });
  });
}

// ===== TRAINING CALENDAR =====
var calMonth = new Date().getMonth();
var calYear = new Date().getFullYear();
var calSelectedDate = null;

function renderCalendar(){
  var el = document.getElementById('v10Calendar');
  if(!el) return;
  var monthNames = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  var dows = ['일','월','화','수','목','금','토'];
  var firstDay = new Date(calYear, calMonth, 1).getDay();
  var daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  var today = new Date();
  var todayStr = today.getFullYear()+'-'+pad2(today.getMonth()+1)+'-'+pad2(today.getDate());

  var app = loadAppData();
  var sessions = (app && app.sessions) || [];
  var trainedDays = {};
  sessions.forEach(function(s){
    var d = new Date(s.date);
    var key = d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());
    trainedDays[key] = true;
  });

  var html = '<div class="cal-month"><div class="cal-month-header"><div class="cal-month-nav"><button class="cal-month-btn" id="calPrev">◀</button></div><div class="cal-month-title">'+calYear+'년 '+monthNames[calMonth]+'</div><div class="cal-month-nav"><button class="cal-month-btn" id="calNext">▶</button></div></div>';
  html += '<div class="cal-grid">';
  dows.forEach(function(d){ html += '<div class="cal-dow">'+d+'</div>'; });
  for(var e = 0; e < firstDay; e++){ html += '<div class="cal-cell empty"></div>'; }
  for(var d = 1; d <= daysInMonth; d++){
    var dateKey = calYear+'-'+pad2(calMonth+1)+'-'+pad2(d);
    var cls = 'cal-cell';
    if(dateKey === todayStr) cls += ' today';
    if(trainedDays[dateKey]) cls += ' trained';
    if(v10.calendarPlans[dateKey]) cls += ' has-plan';
    html += '<div class="'+cls+'" data-date="'+dateKey+'">'+d+'</div>';
  }
  html += '</div></div>';

  if(calSelectedDate){
    var plan = v10.calendarPlans[calSelectedDate] || '';
    html += '<div class="cal-plan-form"><div class="cal-plan-form-title">📅 '+calSelectedDate+' 훈련 계획</div><input class="cal-plan-input" id="calPlanInput" placeholder="예: 잡-크로스 콤보 10분, 섬도우 5분" value="'+escHtml(plan)+'"><div class="cal-plan-btns"><button class="cal-plan-btn save" id="calPlanSave">저장</button><button class="cal-plan-btn cancel" id="calPlanCancel">닫기</button></div></div>';
  }

  el.innerHTML = html;

  var pb = document.getElementById('calPrev');
  if(pb) pb.addEventListener('click', function(){ calMonth--; if(calMonth<0){calMonth=11;calYear--;} calSelectedDate=null; renderCalendar(); });
  var nb = document.getElementById('calNext');
  if(nb) nb.addEventListener('click', function(){ calMonth++; if(calMonth>11){calMonth=0;calYear++;} calSelectedDate=null; renderCalendar(); });

  el.querySelectorAll('.cal-cell:not(.empty)').forEach(function(cell){
    cell.addEventListener('click', function(){
      calSelectedDate = this.getAttribute('data-date');
      renderCalendar();
    });
  });

  var sb = document.getElementById('calPlanSave');
  if(sb) sb.addEventListener('click', function(){
    var inp = document.getElementById('calPlanInput');
    if(inp && calSelectedDate){
      if(inp.value.trim()) v10.calendarPlans[calSelectedDate] = inp.value.trim();
      else delete v10.calendarPlans[calSelectedDate];
      saveV10(v10);
      calSelectedDate = null;
      renderCalendar();
    }
  });
  var cb = document.getElementById('calPlanCancel');
  if(cb) cb.addEventListener('click', function(){ calSelectedDate=null; renderCalendar(); });
}

function pad2(n){ return n < 10 ? '0'+n : ''+n; }
function escHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ===== COMBO ENCYCLOPEDIA =====
var COMBOS = [
  {name:'기본 원투',seq:[{t:'잡',c:'jab'}],diff:'easy',desc:'가장 기본적인 펀치. 앞손으로 빠르게 날리고 바로 가드로 돌아옵니다.'},
  {name:'원투 투',seq:[{t:'잡',c:'jab'},{t:'크로스',c:'cross'}],diff:'easy',desc:'복싱의 기본 중 기본. 잡으로 거리를 재고 크로스로 타격.'},
  {name:'트리플 펀치',seq:[{t:'잡',c:'jab'},{t:'크로스',c:'cross'},{t:'훅',c:'hook'}],diff:'easy',desc:'1-2-3 콤보. 잡으로 시작해 크로스, 리드훅으로 마무리.'},
  {name:'포 펀치 콤보',seq:[{t:'잡',c:'jab'},{t:'크로스',c:'cross'},{t:'훅',c:'hook'},{t:'크로스',c:'cross'}],diff:'medium',desc:'1-2-3-2 리던 콤보. 훅 후 바로 크로스로 추가타.'},
  {name:'더블 잡',seq:[{t:'잡',c:'jab'},{t:'잡',c:'jab'}],diff:'easy',desc:'잡을 연속 두번 날리는 기술. 상대의 가드를 험러고 크로스로 연결.'},
  {name:'바디 샷',seq:[{t:'잡',c:'jab'},{t:'크로스',c:'cross'},{t:'바디훅',c:'hook'}],diff:'medium',desc:'1-2-바디훅. 얼굴이 아닌 몸통 와이드 훅으로 타격.'},
  {name:'슬립 카운터',seq:[{t:'슬립',c:'slip'},{t:'크로스',c:'cross'},{t:'훅',c:'hook'}],diff:'medium',desc:'상대 공격을 슬립으로 피한 후 즉시 카운터 공격.'},
  {name:'어퍼컷 미스',seq:[{t:'잡',c:'jab'},{t:'어퍼컷',c:'uppercut'},{t:'훅',c:'hook'}],diff:'medium',desc:'잡으로 거리를 재고 어퍼컷으로 턴을 올리고 훅으로 마무리.'},
  {name:'파워 체인',seq:[{t:'크로스',c:'cross'},{t:'훅',c:'hook'},{t:'어퍼컷',c:'uppercut'},{t:'크로스',c:'cross'}],diff:'hard',desc:'파워 펀치만 연속으로 연결하는 고급 콤보.'},
  {name:'콜링 스트레이트',seq:[{t:'롤',c:'roll'},{t:'훅',c:'hook'},{t:'크로스',c:'cross'},{t:'훅',c:'hook'}],diff:'hard',desc:'롤링으로 회피 후 양쪽 훅과 크로스로 연속 타격.'},
  {name:'잡 트리플',seq:[{t:'잡',c:'jab'},{t:'잡',c:'jab'},{t:'잡',c:'jab'}],diff:'easy',desc:'잡 세 번으로 상대 리듬을 깨뜨리는 기술.'},
  {name:'스위치 콤보',seq:[{t:'잡',c:'jab'},{t:'크로스',c:'cross'},{t:'슬립',c:'slip'},{t:'크로스',c:'cross'}],diff:'medium',desc:'1-2 후 슬립해서 다시 크로스. 공방 전환 콤보.'},
  {name:'레버 콤보',seq:[{t:'잡',c:'jab'},{t:'바디',c:'hook'},{t:'어퍼컷',c:'uppercut'}],diff:'medium',desc:'잡 후 바디를 닅추고 어퍼컷으로 마무리.'},
  {name:'티옴펀 카운터',seq:[{t:'슬립',c:'slip'},{t:'어퍼컷',c:'uppercut'},{t:'훅',c:'hook'},{t:'크로스',c:'cross'}],diff:'hard',desc:'슬립 후 어퍼컷으로 시작하는 세 번의 공격 콤보.'},
  {name:'푸록스 러시',seq:[{t:'잡',c:'jab'},{t:'잡',c:'jab'},{t:'크로스',c:'cross'},{t:'훅',c:'hook'},{t:'크로스',c:'cross'}],diff:'hard',desc:'5타 연속 공격. 더블 잡으로 시작해 속도를 올리며 타격.'},
  {name:'파워 샷',seq:[{t:'크로스',c:'cross'},{t:'훅',c:'hook'},{t:'어퍼컷',c:'uppercut'}],diff:'medium',desc:'파워 3타 콤보. 원근거리에서 근접전으로 전환.'},
  {name:'티옴펄 폭풍',seq:[{t:'잡',c:'jab'},{t:'크로스',c:'cross'},{t:'훅',c:'hook'},{t:'어퍼컷',c:'uppercut'},{t:'크로스',c:'cross'},{t:'훅',c:'hook'}],diff:'hard',desc:'6타 연속 공격. 모든 펀치 타입을 혼합한 최상급 콤보.'},
  {name:'가드 앤드 고',seq:[{t:'가드',c:'slip'},{t:'잡',c:'jab'},{t:'크로스',c:'cross'}],diff:'easy',desc:'방어 후 바로 공격으로 전환하는 기본 공방 전환 콤보.'},
  {name:'스탭 백',seq:[{t:'잡',c:'jab'},{t:'백스탭',c:'slip'},{t:'크로스',c:'cross'},{t:'훅',c:'hook'}],diff:'medium',desc:'잡 후 뒤로 빠지며 상대의 카운터를 피하고 다시 공격.'},
  {name:'마이크 타이슨 콤보',seq:[{t:'잡',c:'jab'},{t:'잡',c:'jab'},{t:'어퍼컷',c:'uppercut'},{t:'훅',c:'hook'},{t:'훅',c:'hook'}],diff:'hard',desc:'타이슨 스타일의 5타 콤보. 더블잡+어퍼컷+더블훅.'}
];

var comboExpanded = -1;

function renderCombos(){
  var el = document.getElementById('v10Combos');
  if(!el) return;
  var html = '<div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">';
  html += '<button class="timer-adj" id="comboAll" style="width:auto;padding:2px 10px;border-radius:8px;font-size:10px">전체</button>';
  html += '<button class="timer-adj" id="comboEasy" style="width:auto;padding:2px 10px;border-radius:8px;font-size:10px;color:var(--green)">초급</button>';
  html += '<button class="timer-adj" id="comboMed" style="width:auto;padding:2px 10px;border-radius:8px;font-size:10px;color:var(--orange)">중급</button>';
  html += '<button class="timer-adj" id="comboHard" style="width:auto;padding:2px 10px;border-radius:8px;font-size:10px;color:var(--accent)">고급</button>';
  html += '</div>';
  html += '<div class="combo-grid">';
  COMBOS.forEach(function(combo, idx){
    var expanded = comboExpanded === idx;
    var isFav = v10.comboFavorites.indexOf(idx) >= 0;
    html += '<div class="combo-card'+(expanded?' expanded':'')+'" data-idx="'+idx+'">';
    html += '<div class="combo-fav'+(isFav?' active':'')+'" data-fav="'+idx+'">'+(isFav?'★':'☆')+'</div>';
    html += '<div class="combo-header"><span class="combo-name">'+combo.name+'</span><span class="combo-diff '+combo.diff+'">'+(combo.diff==='easy'?'초급':combo.diff==='medium'?'중급':'고급')+'</span></div>';
    html += '<div class="combo-seq">';
    combo.seq.forEach(function(p){ html += '<span class="combo-punch '+p.c+'">'+p.t+'</span>'; });
    html += '</div>';
    html += '<div class="combo-detail">'+combo.desc+'</div>';
    html += '</div>';
  });
  html += '</div>';
  el.innerHTML = html;

  el.querySelectorAll('.combo-card').forEach(function(card){
    card.addEventListener('click', function(e){
      if(e.target.classList.contains('combo-fav')) return;
      var idx = parseInt(this.getAttribute('data-idx'));
      comboExpanded = comboExpanded === idx ? -1 : idx;
      if(comboExpanded >= 0) playSFX10('combo_demo');
      renderCombos();
    });
  });
  el.querySelectorAll('.combo-fav').forEach(function(fav){
    fav.addEventListener('click', function(e){
      e.stopPropagation();
      var idx = parseInt(this.getAttribute('data-fav'));
      var pos = v10.comboFavorites.indexOf(idx);
      if(pos >= 0) v10.comboFavorites.splice(pos,1);
      else v10.comboFavorites.push(idx);
      saveV10(v10);
      renderCombos();
    });
  });
}

// ===== ROUND TIMER =====
var timerRounds = 3, timerWork = 180, timerRest = 60;
var timerActive = false, timerPhase = 'work', timerCurrentRound = 1, timerTimeLeft = 180;
var timerInterval = null;

function renderTimer(){
  var el = document.getElementById('v10Timer');
  if(!el) return;

  if(!timerActive){
    var html = '<div class="timer-display">';
    html += '<div class="timer-config"><div class="timer-config-item"><div class="timer-config-label">라운드</div><div class="timer-config-val"><button class="timer-adj" id="tmRndM">-</button><span class="timer-num" id="tmRndV">'+timerRounds+'</span><button class="timer-adj" id="tmRndP">+</button></div></div>';
    html += '<div class="timer-config-item"><div class="timer-config-label">운동(초)</div><div class="timer-config-val"><button class="timer-adj" id="tmWrkM">-</button><span class="timer-num" id="tmWrkV">'+timerWork+'</span><button class="timer-adj" id="tmWrkP">+</button></div></div>';
    html += '<div class="timer-config-item"><div class="timer-config-label">휴식(초)</div><div class="timer-config-val"><button class="timer-adj" id="tmRstM">-</button><span class="timer-num" id="tmRstV">'+timerRest+'</span><button class="timer-adj" id="tmRstP">+</button></div></div></div>';
    html += '<div class="timer-time">'+fmtTimer(timerWork)+'</div>';
    html += '<div class="timer-round">'+timerRounds+' 라운드 × '+timerWork+'초</div>';
    html += '<div class="timer-btns"><button class="timer-btn start" id="tmStart">▶ 시작</button></div>';
    html += '</div>';
    el.innerHTML = html;

    document.getElementById('tmRndM').addEventListener('click',function(){timerRounds=Math.max(1,timerRounds-1);renderTimer();});
    document.getElementById('tmRndP').addEventListener('click',function(){timerRounds=Math.min(12,timerRounds+1);renderTimer();});
    document.getElementById('tmWrkM').addEventListener('click',function(){timerWork=Math.max(30,timerWork-30);renderTimer();});
    document.getElementById('tmWrkP').addEventListener('click',function(){timerWork=Math.min(300,timerWork+30);renderTimer();});
    document.getElementById('tmRstM').addEventListener('click',function(){timerRest=Math.max(10,timerRest-10);renderTimer();});
    document.getElementById('tmRstP').addEventListener('click',function(){timerRest=Math.min(120,timerRest+10);renderTimer();});
    document.getElementById('tmStart').addEventListener('click',function(){
      timerActive=true;timerPhase='work';timerCurrentRound=1;timerTimeLeft=timerWork;
      playSFX10('timer_bell');
      timerInterval=setInterval(tickTimer,1000);renderTimer();
    });
  } else {
    var html2 = '<div class="timer-display">';
    html2 += '<div class="timer-time">'+fmtTimer(timerTimeLeft)+'</div>';
    html2 += '<div class="timer-round">R'+timerCurrentRound+' / '+timerRounds+'</div>';
    html2 += '<div class="timer-phase '+timerPhase+'">'+(timerPhase==='work'?'🔥 FIGHT':'💚 REST')+'</div>';
    html2 += '<div class="timer-btns"><button class="timer-btn stop" id="tmStop">■ 중지</button></div>';
    html2 += '</div>';
    el.innerHTML = html2;
    document.getElementById('tmStop').addEventListener('click',function(){
      timerActive=false;if(timerInterval){clearInterval(timerInterval);timerInterval=null;}renderTimer();
    });
  }
}

function tickTimer(){
  timerTimeLeft--;
  if(timerTimeLeft <= 0){
    playSFX10('timer_bell');
    if(timerPhase === 'work'){
      if(timerCurrentRound >= timerRounds){
        timerActive=false;clearInterval(timerInterval);timerInterval=null;
        toastV10('🔔 타이머 완료! '+timerRounds+'R 완료!');
        renderTimer();return;
      }
      timerPhase='rest';timerTimeLeft=timerRest;
    } else {
      timerPhase='work';timerTimeLeft=timerWork;timerCurrentRound++;
    }
  }
  renderTimer();
}

function fmtTimer(sec){ var m=Math.floor(sec/60),s=sec%60; return (m<10?'0':'')+m+':'+(s<10?'0':'')+s; }

// ===== BODY STATS TRACKER =====
function renderBodyStats(){
  var el = document.getElementById('v10BodyStats');
  if(!el) return;
  var stats = v10.bodyStats || [];
  var latest = stats.length > 0 ? stats[stats.length-1] : null;

  var html = '';
  if(stats.length >= 2){
    var recent = stats.slice(-14);
    var maxW = Math.max.apply(null, recent.map(function(s){return s.weight||0;}));
    var minW = Math.min.apply(null, recent.map(function(s){return s.weight||0;}));
    var range = Math.max(maxW - minW, 1);
    html += '<div class="body-stats-chart">';
    recent.forEach(function(s){
      var h = ((s.weight - minW) / range) * 80 + 20;
      html += '<div class="body-stats-bar" style="height:'+h+'%" title="'+s.date+': '+s.weight+'kg"></div>';
    });
    html += '</div>';
    html += '<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted)"><span>'+recent[0].date+'</span><span>'+recent[recent.length-1].date+'</span></div>';
  }

  if(latest){
    html += '<div style="display:flex;gap:16px;justify-content:center;margin:12px 0;flex-wrap:wrap">';
    html += '<div style="text-align:center"><div style="font-size:24px;font-weight:900;color:var(--blue)">'+latest.weight+'</div><div style="font-size:10px;color:var(--text-muted)">kg</div></div>';
    if(latest.muscle){ html += '<div style="text-align:center"><div style="font-size:24px;font-weight:900;color:var(--green)">'+latest.muscle+'</div><div style="font-size:10px;color:var(--text-muted)">근육%</div></div>'; }
    if(latest.fat){ html += '<div style="text-align:center"><div style="font-size:24px;font-weight:900;color:var(--orange)">'+latest.fat+'</div><div style="font-size:10px;color:var(--text-muted)">체지방%</div></div>'; }
    html += '</div>';
  }

  html += '<div class="body-stats-form"><div class="body-stats-input-wrap"><label class="body-stats-label">체중 (kg)</label><input class="body-stats-input" type="number" step="0.1" id="bsWeight" placeholder="70.0"></div>';
  html += '<div class="body-stats-input-wrap"><label class="body-stats-label">근육량 (%)</label><input class="body-stats-input" type="number" step="0.1" id="bsMuscle" placeholder="35.0"></div>';
  html += '<div class="body-stats-input-wrap"><label class="body-stats-label">체지방 (%)</label><input class="body-stats-input" type="number" step="0.1" id="bsFat" placeholder="18.0"></div>';
  html += '<div class="body-stats-input-wrap"><label class="body-stats-label">메모</label><input class="body-stats-input" type="text" id="bsMemo" placeholder="오늘 컨디션"></div>';
  html += '<button class="body-stats-save" id="bsSave">💾 기록 저장</button></div>';

  if(stats.length > 0){
    html += '<div class="body-stats-history">';
    stats.slice().reverse().slice(0,10).forEach(function(s){
      html += '<div class="body-stats-row"><span>'+s.date+'</span><span>'+s.weight+'kg'+(s.muscle?' / 근육'+s.muscle+'%':'')+(s.fat?' / 체지방'+s.fat+'%':'')+'</span></div>';
    });
    html += '</div>';
  }

  el.innerHTML = html;

  document.getElementById('bsSave').addEventListener('click', function(){
    var w = parseFloat(document.getElementById('bsWeight').value);
    if(!w || w < 20 || w > 300) return;
    var entry = {
      date: new Date().toISOString().slice(0,10),
      weight: w,
      muscle: parseFloat(document.getElementById('bsMuscle').value) || null,
      fat: parseFloat(document.getElementById('bsFat').value) || null,
      memo: document.getElementById('bsMemo').value || ''
    };
    v10.bodyStats.push(entry);
    if(v10.bodyStats.length > 365) v10.bodyStats = v10.bodyStats.slice(-365);
    saveV10(v10);
    playSFX10('body_stat');
    toastV10('💾 체중 기록 저장!');
    renderBodyStats();
  });
}

// ===== TECHNIQUE TUTORIAL =====
var TECHNIQUES = [
  {name:'잡 (Jab)',cat:'기본 공격',icon:'👊',steps:['기본 스탠스에서 앞손을 빠르게 버집니다','주먹을 꼬 연 채로 손목을 곶게 유지','팔담치가 완전히 펴질 순간 타격','바로 가드 위치로 팔을 돌려보냄니다']},
  {name:'크로스 (Cross)',cat:'파워 공격',icon:'🤛',steps:['기본 스탠스에서 뒷손을 나링니다','뒤발 발넣치에서 힘을 시작','엄덩이를 회전시키며 나갑니다','완전히 펴진 순간 손목 곶게 유지','가드 위치로 빠르게 복귀']},
  {name:'훅 (Hook)',cat:'근접전 공격',icon:'💪',steps:['팔네를 90도로 구부립니다','앞발 피봇으로 몸을 회전','팔네이 바닥과 평행하게 유지','엄덩이와 어깨의 힘으로 타격','타격 후 가드로 복귀']},
  {name:'어퍼컷 (Uppercut)',cat:'근접전 공격',icon:'⚡',steps:['무릎을 살짝 구부립니다','다리에서 힘을 시작해 위로 푼어올립니다','주먹을 꼬 얤 채로 손바닥이 몸을 향하게','턴을 아래에서 위로 타격','즉시 가드 위치로 복귀']},
  {name:'슬립 (Slip)',cat:'방어 기술',icon:'🚶',steps:['상대의 펀치가 올 때 몸을 옴으로 기울이기','무릎을 살짝 구부리며 기울임','눈은 상대를 계속 주시','기울인 채로 카운터 공격 준비','빠르게 원래 위치로 복귀']},
  {name:'롤링 (Rolling)',cat:'방어 기술',icon:'🔄',steps:['상대 훅이 올 때 무릎을 구부립니다','머리를 낮추며 U자 궁적으로 이동','펀치 아래로 지나가며 반대쪽으로 올라옴','올라오며 카운터 공격 준비']},
  {name:'풀트워크 (Footwork)',cat:'이동 기술',icon:'👟',steps:['어깨 너비로 발을 벌립니다','앞발이 앞에, 뒤발이 뒤에 (스탠스)','앞으로 갈 때 앞발 먼저 움직임','뒤로 갈 때 뒤발 먼저 움직임','발이 교차되지 않도록 주의']},
  {name:'섬도우 복싱 (Shadow Boxing)',cat:'훈련 방법',icon:'🌟',steps:['거울 앞에서 폼을 체크합니다','실제 상대가 있다고 상상하며 이동','콤보를 연속으로 연습합니다','방어 동작도 함께 연습','3분 라운드 + 1분 휴식 구조로']},
  {name:'헤비백 트레이닝',cat:'훈련 방법',icon:'👕',steps:['무거운 헤비백을 준비합니다','잡-크로스 콤보를 박아가며 타격','각 펀치마다 헤비백이 흤들리는지 확인','3분 라운드 구조로 스틸미나 키우기','힘이 아닌 속도와 정확도에 집중']},
  {name:'복싱 스탠스 (Boxing Stance)',cat:'기본 자세',icon:'🥊',steps:['어깨 너비만큼 발을 벌립니다','앞발이 약간 앞으로, 45도 각도','무릎은 살짝 구부리고 체중은 중앙에','양손은 얼굴(턴/볼) 보호 위치','턴을 약간 당기고 눈은 상대를 주시']},
  {name:'파링 (Parrying)',cat:'방어 기술',icon:'🖐',steps:['상대 펀치가 올 때 앞손으로 투어냆니다','손바닥으로 상대 펀치를 옷으로 치워냆','매우 작은 동작으로 충분합니다','투어낼 직후 카운터 공격 실행']},
  {name:'카운터 펀치',cat:'고급 기술',icon:'💥',steps:['상대 공격을 피하거나 방어합니다','상대가 가드를 내린 빛 틀을 타격','가장 흠한 타이밍은 상대 크로스 직후','슬립+크로스 또는 롤링+훅 카운터','반응 속도가 매우 중요 - 반사적으로 연습']}
];

var techExpanded = -1;

function renderTechniques(){
  var el = document.getElementById('v10Techniques');
  if(!el) return;
  var readCount = Object.keys(v10.techniqueRead).length;
  var html = '<div style="margin-bottom:10px;font-size:12px;color:var(--text-dim)">'+readCount+' / '+TECHNIQUES.length+' 완독</div>';
  html += '<div class="technique-grid">';
  TECHNIQUES.forEach(function(tech, idx){
    var expanded = techExpanded === idx;
    var isRead = v10.techniqueRead[idx];
    html += '<div class="technique-card'+(expanded?' expanded':'')+(isRead?' read':'')+'" data-idx="'+idx+'">';
    html += '<div class="technique-header"><div class="technique-icon">'+tech.icon+'</div><div><div class="technique-title">'+tech.name+'</div><div class="technique-cat">'+tech.cat+'</div></div></div>';
    html += '<div class="technique-steps">';
    tech.steps.forEach(function(step, si){
      html += '<div class="technique-step"><div class="technique-step-num">'+(si+1)+'</div><div>'+step+'</div></div>';
    });
    html += '</div></div>';
  });
  html += '</div>';
  el.innerHTML = html;

  el.querySelectorAll('.technique-card').forEach(function(card){
    card.addEventListener('click', function(){
      var idx = parseInt(this.getAttribute('data-idx'));
      techExpanded = techExpanded === idx ? -1 : idx;
      if(techExpanded >= 0){
        v10.techniqueRead[idx] = true;
        saveV10(v10);
        playSFX10('technique');
      }
      renderTechniques();
    });
  });
}

// ===== WEEKLY CHALLENGE =====
var CHALLENGES = [
  {id:'c_100jab',name:'잡 100발',desc:'하루 동안 잡 100발 달성',target:100,field:'jab',reward:'+50 XP'},
  {id:'c_50cross',name:'크로스 50발',desc:'하루 동안 크로스 50발 달성',target:50,field:'cross',reward:'+40 XP'},
  {id:'c_30hook',name:'훅 30발',desc:'하루 동안 훅 30발 달성',target:30,field:'hook',reward:'+40 XP'},
  {id:'c_20upper',name:'어퍼컷 20발',desc:'하루 동안 어퍼컷 20발 달성',target:20,field:'uppercut',reward:'+40 XP'},
  {id:'c_500total',name:'총 500펀치',desc:'이번 주 총합 500펀치 달성',target:500,field:'total',reward:'+100 XP'},
  {id:'c_3sessions',name:'3회 훈련',desc:'이번 주 3회 이상 훈련',target:3,field:'sessions',reward:'+60 XP'},
  {id:'c_combo10',name:'10콤보',desc:'한 세션에서 10콤보 이상 성공',target:10,field:'combos',reward:'+80 XP'},
  {id:'c_15min',name:'15분 훈련',desc:'한 세션 15분 이상 훈련',target:15,field:'duration',reward:'+50 XP'}
];

function getChallengeWeek(){
  var d = new Date(), day = d.getDay(), diff = d.getDate() - day;
  return new Date(d.setDate(diff)).toISOString().slice(0,10);
}

function renderChallenges(){
  var el = document.getElementById('v10Challenges');
  if(!el) return;
  var weekKey = getChallengeWeek();
  var weekSeed = weekKey.split('-').reduce(function(s,n){return s+parseInt(n);},0);
  var shuffled = CHALLENGES.slice().sort(function(a,b){return ((a.id.charCodeAt(2)+weekSeed)%7) - ((b.id.charCodeAt(2)+weekSeed)%7);});
  var weeklyChallenges = shuffled.slice(0,4);

  var app = loadAppData();
  var sessions = (app && app.sessions) || [];
  var pt = app && app.punchTypes ? app.punchTypes : {jab:0,cross:0,hook:0,uppercut:0};

  var html = '<div style="margin-bottom:10px;font-size:11px;color:var(--text-muted)">주간 챌린지 ('+weekKey+' ~)</div>';
  html += '<div class="challenge-board">';
  weeklyChallenges.forEach(function(ch){
    var progress = 0;
    if(ch.field === 'total') progress = (app && app.totalPunches) || 0;
    else if(ch.field === 'sessions') progress = sessions.length;
    else if(ch.field === 'combos') progress = (app && app.totalCombos) || 0;
    else if(ch.field === 'duration'){
      var maxDur = sessions.reduce(function(m,s){return Math.max(m,s.duration||0);},0);
      progress = maxDur;
    }
    else progress = pt[ch.field] || 0;
    var pct = Math.min(100, Math.round(progress / ch.target * 100));
    var completed = pct >= 100;
    html += '<div class="challenge-item'+(completed?' completed':'')+'">';
    html += '<div class="challenge-name">'+ch.name+'</div>';
    html += '<div class="challenge-desc">'+ch.desc+'</div>';
    html += '<div class="challenge-reward">'+ch.reward+'</div>';
    html += '<div class="challenge-progress"><div class="challenge-progress-fill" style="width:'+pct+'%"></div></div>';
    html += '<div style="font-size:10px;color:var(--text-muted);margin-top:4px">'+progress+' / '+ch.target+' ('+pct+'%)</div>';
    html += '</div>';
  });
  html += '</div>';
  el.innerHTML = html;
}

// ===== ENDURANCE TEST =====
var endActive = false, endCount = 0, endTimeLeft = 60, endTimerId = null;

function renderEndurance(){
  var el = document.getElementById('v10Endurance');
  if(!el) return;

  if(!endActive){
    var html = '<div class="endurance-area">';
    html += '<div style="font-size:14px;color:var(--text-dim);margin-bottom:12px">60초 동안 최대한 많이 콜릭하세요!</div>';
    if(v10.enduranceBest > 0) html += '<div class="endurance-best">🏆 최고 기록: '+v10.enduranceBest+'회</div>';
    html += '<div style="margin-top:16px"><button class="endurance-btn go" id="endStart">🔥 시작!</button></div>';
    html += '</div>';
    el.innerHTML = html;
    document.getElementById('endStart').addEventListener('click', startEndurance);
  } else {
    var html2 = '<div class="endurance-area">';
    html2 += '<div class="endurance-timer">'+endTimeLeft+'초</div>';
    html2 += '<div class="endurance-click-zone" id="endZone">👊</div>';
    html2 += '<div class="endurance-counter">'+endCount+'</div>';
    html2 += '<div class="endurance-target">최고: '+v10.enduranceBest+'</div>';
    html2 += '</div>';
    el.innerHTML = html2;
    document.getElementById('endZone').addEventListener('click', function(){
      endCount++;
      playSFX10('sparring_hit');
      renderEndurance();
    });
    document.getElementById('endZone').addEventListener('touchstart', function(e){
      e.preventDefault();
      endCount++;
      playSFX10('sparring_hit');
      renderEndurance();
    }, {passive: false});
  }
}

function startEndurance(){
  endActive = true; endCount = 0; endTimeLeft = 60;
  playSFX10('timer_bell');
  endTimerId = setInterval(function(){
    endTimeLeft--;
    if(endTimeLeft <= 0){
      clearInterval(endTimerId); endTimerId = null;
      endActive = false;
      if(endCount > v10.enduranceBest){ v10.enduranceBest = endCount; saveV10(v10); }
      playSFX10('timer_bell');
      toastV10('🔥 지구력 테스트 완료! '+endCount+'회');
      renderEndurance();
      return;
    }
    renderEndurance();
  }, 1000);
  renderEndurance();
}

// ===== QUIZ V10 (+15 questions) =====
var QUIZ_V10 = [
  {q:'복싱에서 어깨와 팔을 아래로 열어서 거리를 벌리는 기술은?',opts:['파링','아웃파이터','보디잡','렉스텐션'],ans:3,exp:'렉스텐션(Range Extension)는 팔과 어깨를 완전히 펴쳐 최대 거리를 확보하는 기술입니다.'},
  {q:'Floyd Mayweather Jr.의 프로 전적은?',opts:['49승 1패','50승 0패','47승 0패','48승 2패'],ans:1,exp:'Mayweather는 50승 0패로 은퇴한 전설적인 복서입니다.'},
  {q:'복싱에서 「클린치」는 어떤 상황인가?',opts:['KO 승리','근접전에서 상대를 껍안는 것','주심의 경고','라운드 종료'],ans:1,exp:'클린치는 상대를 껍안아 펀치를 막는 근접전 기술입니다.'},
  {q:'복싱에서 「사우스포」(Southpaw)는?',opts:['오른손잡이 선수','왼손잡이 선수','양손잡이 선수','초보 선수'],ans:1,exp:'사우스포는 왼손잡이 선수를 말하며, 오른발이 앞에 나옵니다.'},
  {q:'복싱 훈련에서 「미트 파드」는 무엇인가?',opts:['가슷 보호 장치','펀치 타겧','헤드기어','육동 보호 장비'],ans:1,exp:'미트 파드는 파트너가 들고 있는 타겧으로 펀치 정확도를 연습합니다.'},
  {q:'복싱에서 「보브 앤드 위브」는?',opts:['발로 차는 기술','머리를 움직여 피하는 기술','팔을 감싸는 기술','롱을 잡는 기술'],ans:1,exp:'보브 앤드 위브는 머리를 좌우로 움직여 펀치를 피하는 기본 방어 기술입니다.'},
  {q:'복싱에서 카운터 펀치의 핵심은?',opts:['강한 힘','빠른 반응 속도','다양한 각도','발로 차는 것'],ans:1,exp:'카운터는 상대가 공격한 직후 가장 빠르게 반격하는 것이 핵심입니다.'},
  {q:'프로복싱에서 심판이 카운트하는 시간은?',opts:['5초','8초','10초','12초'],ans:2,exp:'프로복싱에서 다운된 선수가 10초 안에 일어나지 못하면 KO입니다.'},
  {q:'복싱 훈련 전 손 랩을 감는 이유는?',opts:['가보운 펀치를 위해','손목과 손가락 보호','글러브를 잡기 위해','법적으로 의무적이어서'],ans:1,exp:'손 랩은 손목관절과 손가락 뮈를 보호하여 부상을 방지합니다.'},
  {q:'Mike Tyson의 별명은?',opts:['The Greatest','Iron Mike','Sugar Ray','The Hitman'],ans:1,exp:'Mike Tyson은 &ldquo;Iron Mike&rdquo;라는 별명으로 유명한 헤비급 천피언입니다.'},
  {q:'복싱에서 체급 측정은 언제 하는가?',opts:['경기 직후','경기 전날 또는 당일','경기 중','훈련 중'],ans:1,exp:'복싱 공식 체급 측정은 경기 전날 또는 당일에 실시합니다.'},
  {q:'복싱에서 「오소독스」(Orthodox) 스탠스는?',opts:['왼손이 앞','오른손이 앞','왼발이 앞','오른발이 앞'],ans:2,exp:'오소독스 스탠스는 왼발이 앞, 오른손이 뒤(파워한드)에 위치합니다.'},
  {q:'복싱에서 「기브」(Give)는?',opts:['타격 기술','항복 선언','점수를 주는 것','코너 영역'],ans:1,exp:'「기브」는 선수가 더 이상 싸우지 않겠다고 항복하는 것을 말합니다.'},
  {q:'복싱 훈련에서 스킥 박자에 속도를 높이려면?',opts:['무거운 글러브 사용','가버운 글러브 사용','글러브 없이 연습','천천히 연습'],ans:0,exp:'무거운 글러브(16oz)로 연습하면 속도와 지구력이 향상됩니다.'},
  {q:'복싱에서 「미들웨이트」의 체급 범위는?',opts:['55-60kg','60-69kg','69-75kg','75-80kg'],ans:2,exp:'미들웨이트는 69~75kg(152~165lbs)으로 중간 체급 구간입니다.'}
];

var q10Idx = 0, q10Answered = false, q10Correct = 0, q10Done = false;

function renderQuizV10(){
  var el = document.getElementById('v10Quiz');
  if(!el) return;
  if(q10Done){
    var pct = Math.round(q10Correct/QUIZ_V10.length*100);
    var grade = pct>=90?'S':pct>=80?'A':pct>=70?'B':pct>=60?'C':'D';
    el.innerHTML = '<div class="quiz-result"><div class="quiz-score-big">'+q10Correct+' / '+QUIZ_V10.length+'</div><div class="quiz-score-label">정답 ('+pct+'%)</div><div class="quiz-grade" style="color:'+(pct>=80?'var(--green)':pct>=60?'var(--orange)':'var(--accent)')+'">등급: '+grade+'</div><div class="quiz-nav" style="margin-top:16px"><button class="quiz-nav-btn primary" id="q10Retry">다시 풀기</button></div></div>';
    document.getElementById('q10Retry').addEventListener('click',function(){q10Idx=0;q10Answered=false;q10Correct=0;q10Done=false;renderQuizV10();});
    return;
  }
  var qq = QUIZ_V10[q10Idx];
  var html = '<div class="quiz-container"><div class="quiz-q-num">Q'+(q10Idx+1)+' / '+QUIZ_V10.length+'</div><div class="quiz-question">'+qq.q+'</div><div class="quiz-options">';
  qq.opts.forEach(function(opt,i){
    var cls = 'quiz-option';
    if(q10Answered){
      if(i === qq.ans) cls += ' correct';
      else if(i === qq._userAns) cls += ' wrong';
      else cls += ' disabled';
    }
    html += '<div class="'+cls+'" data-idx="'+i+'">'+opt+'</div>';
  });
  html += '</div><div class="quiz-explanation'+(q10Answered?' show':'')+'">💡 '+qq.exp+'</div>';
  if(q10Answered){
    html += '<div class="quiz-nav"><button class="quiz-nav-btn primary" id="q10Next">'+(q10Idx<QUIZ_V10.length-1?'다음 문제 →':'결과 보기')+'</button></div>';
  }
  el.innerHTML = html + '</div>';
  if(!q10Answered){
    el.querySelectorAll('.quiz-option').forEach(function(opt){
      opt.addEventListener('click',function(){
        if(q10Answered) return;
        var idx = parseInt(this.getAttribute('data-idx'));
        q10Answered = true;
        qq._userAns = idx;
        if(idx === qq.ans){q10Correct++;playSFX10('timer_bell');}else{playSFX10('sparring_hit');}
        renderQuizV10();
      });
    });
  }
  if(q10Answered){
    var nb = document.getElementById('q10Next');
    if(nb) nb.addEventListener('click',function(){
      q10Idx++;q10Answered=false;
      if(q10Idx>=QUIZ_V10.length){q10Done=true;}
      renderQuizV10();
    });
  }
}

// ===== ACHIEVEMENTS V10 (+12) =====
var ACHV10 = [
  {id:'a10_spar_first',name:'첫 스파링',icon:'⚔️',desc:'스파링 시뮬레이션 1회 완료',check:function(){return v10.sparringSessions.length>=1;}},
  {id:'a10_spar_win5',name:'5승 복서',icon:'🥊',desc:'스파링 5승 달성',check:function(){return v10.sparringSessions.filter(function(s){return s.won;}).length>=5;}},
  {id:'a10_combo_fav',name:'콤보 수집가',icon:'⭐',desc:'콤보 5개 즐겨찾기',check:function(){return v10.comboFavorites.length>=5;}},
  {id:'a10_timer_use',name:'타이머 활용',icon:'⏱',desc:'라운드 타이머 사용',check:function(){return timerRounds > 0 && !timerActive;}},
  {id:'a10_body_track',name:'바디 트래커',icon:'📈',desc:'체중 기록 3회 이상',check:function(){return v10.bodyStats.length>=3;}},
  {id:'a10_tech_5',name:'기술 학습가',icon:'📚',desc:'테크닉 5개 완독',check:function(){return Object.keys(v10.techniqueRead).length>=5;}},
  {id:'a10_tech_all',name:'테크닉 마스터',icon:'🎓',desc:'모든 12개 테크닉 완독',check:function(){return Object.keys(v10.techniqueRead).length>=12;}},
  {id:'a10_endure_50',name:'지구력 50',icon:'💪',desc:'지구력 테스트 50회 달성',check:function(){return v10.enduranceBest>=50;}},
  {id:'a10_endure_100',name:'지구력 100',icon:'🔥',desc:'지구력 테스트 100회 달성',check:function(){return v10.enduranceBest>=100;}},
  {id:'a10_quiz_v10',name:'복싱 박사',icon:'🎓',desc:'v10 퀴즈 12문제 이상 정답',check:function(){return q10Correct >= 12;}},
  {id:'a10_calendar',name:'계획 수립가',icon:'📅',desc:'훈련 계획 5개 이상 등록',check:function(){return Object.keys(v10.calendarPlans).length>=5;}},
  {id:'a10_allrounder',name:'올라운더',icon:'👑',desc:'모든 v10 기능 사용 (스파링+타이머+체중+테크닉+퀴즈+지구력)',check:function(){return v10.sparringSessions.length>0 && v10.bodyStats.length>0 && Object.keys(v10.techniqueRead).length>0 && v10.enduranceBest>0;}}
];

function renderAchievementsV10(){
  var el = document.getElementById('v10Achievements');
  if(!el) return;
  var unlocked = 0;
  var html = '<div class="badge-grid">';
  ACHV10.forEach(function(a){
    var ok = a.check();
    if(ok) unlocked++;
    html += '<div class="badge'+(ok?' unlocked':'')+'" title="'+a.desc+'"><span class="badge-icon" style="font-size:28px;'+(ok?'':'filter:grayscale(1);opacity:0.4')+'">'+a.icon+'</span><span class="badge-name" style="font-size:10px;margin-top:4px;color:'+(ok?'var(--gold)':'var(--text-muted)')+'">'+a.name+'</span></div>';
  });
  html += '</div>';
  html += '<div style="text-align:center;margin-top:10px;font-size:12px;color:var(--text-dim)">v10 업적: '+unlocked+' / '+ACHV10.length+' 달성</div>';
  el.innerHTML = html;
}

// ===== KEYBOARD SHORTCUTS =====
function setupV10Keys(){
  document.addEventListener('keydown', function(e){
    if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch(e.key.toLowerCase()){
      case 's': var s = document.getElementById('v10Sparring'); if(s) s.scrollIntoView({behavior:'smooth'}); break;
      case 'r': var s2 = document.getElementById('v10Timer'); if(s2) s2.scrollIntoView({behavior:'smooth'}); break;
      case 'b': var s3 = document.getElementById('v10BodyStats'); if(s3) s3.scrollIntoView({behavior:'smooth'}); break;
      case 'e': var s4 = document.getElementById('v10Endurance'); if(s4) s4.scrollIntoView({behavior:'smooth'}); break;
      case 'k': var s5 = document.getElementById('v10Combos'); if(s5) s5.scrollIntoView({behavior:'smooth'}); break;
    }
  });
}

// ===== TOAST =====
function toastV10(msg){
  var c = document.getElementById('toastContainer');
  if(!c) return;
  var t = document.createElement('div');
  t.className = 'toast'; t.innerHTML = msg;
  c.appendChild(t);
  setTimeout(function(){ t.remove(); }, 3000);
}

// ===== HTML INJECTION =====
function injectV10Sections(){
  var container = document.querySelector('.container');
  if(!container) return;
  var allSections = container.querySelectorAll('.section');
  if(allSections.length < 2) return;

  var sparSec = document.createElement('section');
  sparSec.className = 'section v10-section';
  sparSec.innerHTML = '<h2 class="section-title"><span class="emoji">⚔️</span> 스파링 시뮬레이션</h2><div class="card"><div id="v10Sparring"></div></div>';
  allSections[0].parentNode.insertBefore(sparSec, allSections[1]);

  var timerSec = document.createElement('section');
  timerSec.className = 'section v10-section';
  timerSec.innerHTML = '<h2 class="section-title"><span class="emoji">⏱</span> 라운드 타이머</h2><div class="card"><div id="v10Timer"></div></div>';

  var comboSec = document.createElement('section');
  comboSec.className = 'section v10-section';
  comboSec.innerHTML = '<h2 class="section-title"><span class="emoji">💥</span> 콤보 백과사전 (20종)</h2><div id="v10Combos"></div>';

  var calSec = document.createElement('section');
  calSec.className = 'section v10-section';
  calSec.innerHTML = '<h2 class="section-title"><span class="emoji">📅</span> 훈련 캘린더</h2><div class="card"><div id="v10Calendar"></div></div>';

  var programSection = null;
  var allSec2 = container.querySelectorAll('.section');
  for(var j=0;j<allSec2.length;j++){
    var t2 = allSec2[j].querySelector('.section-title');
    if(t2 && (t2.textContent.indexOf('프로그램') >= 0 || t2.textContent.indexOf('템플릿') >= 0)){ programSection = allSec2[j]; break; }
  }
  if(programSection){
    programSection.parentNode.insertBefore(timerSec, programSection);
    programSection.parentNode.insertBefore(comboSec, programSection);
    programSection.parentNode.insertBefore(calSec, programSection);
  }

  var bodySec = document.createElement('section');
  bodySec.className = 'section v10-section';
  bodySec.innerHTML = '<h2 class="section-title"><span class="emoji">📈</span> 바디 스탯 트래커</h2><div class="card"><div id="v10BodyStats"></div></div>';

  var techSec = document.createElement('section');
  techSec.className = 'section v10-section';
  techSec.innerHTML = '<h2 class="section-title"><span class="emoji">📚</span> 테크닉 튜토리얼 (12종)</h2><div id="v10Techniques"></div>';

  var challengeSec = document.createElement('section');
  challengeSec.className = 'section v10-section';
  challengeSec.innerHTML = '<h2 class="section-title"><span class="emoji">🏆</span> 주간 챌린지</h2><div class="card"><div id="v10Challenges"></div></div>';

  var enduranceSec = document.createElement('section');
  enduranceSec.className = 'section v10-section';
  enduranceSec.innerHTML = '<h2 class="section-title"><span class="emoji">🔥</span> 지구력 테스트</h2><div class="card"><div id="v10Endurance"></div></div>';

  var quizSec = document.createElement('section');
  quizSec.className = 'section v10-section';
  quizSec.innerHTML = '<h2 class="section-title"><span class="emoji">🧠</span> 복싱 심화 퀴즈 (+15)</h2><div class="card"><div id="v10Quiz"></div></div>';

  var achSec = document.createElement('section');
  achSec.className = 'section v10-section';
  achSec.innerHTML = '<h2 class="section-title"><span class="emoji">🏅</span> v10 업적 (+12)</h2><div class="card"><div id="v10Achievements"></div></div>';

  var tipSection = null;
  var allSec3 = container.querySelectorAll('.section');
  for(var m=0;m<allSec3.length;m++){
    var t3 = allSec3[m].querySelector('.section-title');
    if(t3 && (t3.textContent.indexOf('팁') >= 0 || t3.textContent.indexOf('업적') >= 0)){ tipSection = allSec3[m]; break; }
  }

  var insertBefore = tipSection || container.lastElementChild;
  [bodySec, techSec, challengeSec, enduranceSec, quizSec, achSec].forEach(function(sec){
    insertBefore.parentNode.insertBefore(sec, insertBefore);
  });

  var footerVer = document.querySelector('.footer-ver');
  if(footerVer) footerVer.textContent = 'Boxing Trainer Pro v10.0 | PWA Enabled';
}

// ===== INIT =====
function initV10(){
  injectV10CSS();
  injectV10Sections();
  renderSparring();
  renderTimer();
  renderCombos();
  renderCalendar();
  renderBodyStats();
  renderTechniques();
  renderChallenges();
  renderEndurance();
  renderQuizV10();
  renderAchievementsV10();
  setupV10Keys();
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initV10);
} else {
  setTimeout(initV10, 200);
}

})();
