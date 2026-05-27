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
    if(aiAction === 'dodge'){ pMsg = '&#51105; &#8594; AI &#54924;&#54588;!'; }
    else { pDmg = 8 + Math.floor(Math.random()*4); pMsg = '&#51105; &#47749;&#51473;! -'+pDmg; }
  } else if(action === 'cross'){
    if(aiAction === 'dodge'){ pMsg = '&#53356;&#47196;&#49828; &#8594; AI &#54924;&#54588;!'; }
    else { pDmg = 12 + Math.floor(Math.random()*6); pMsg = '&#53356;&#47196;&#49828; &#47749;&#51473;! -'+pDmg; }
  } else if(action === 'hook'){
    if(aiAction === 'dodge'){ pMsg = '&#54985; &#8594; AI &#54924;&#54588;!'; }
    else { pDmg = 15 + Math.floor(Math.random()*5); pMsg = '&#54985; &#47749;&#51473;! -'+pDmg; }
  } else if(action === 'uppercut'){
    if(aiAction === 'dodge'){ pMsg = '&#50612;&#54140;&#52983; &#8594; AI &#54924;&#54588;!'; }
    else { pDmg = 18 + Math.floor(Math.random()*7); pMsg = '&#50612;&#54140;&#52983;! -'+pDmg; }
  } else if(action === 'dodge'){
    if(aiAction === 'attack'){ pMsg = '&#54924;&#54588; &#49457;&#44277;!'; }
    else { pMsg = '&#54924;&#54588; &#51088;&#49464;'; }
  } else if(action === 'guard'){
    if(aiAction === 'attack'){ aDmg = Math.floor(aDmg * 0.3); pMsg = '&#44032;&#46300;&#47196; &#48169;&#50612;!'; }
    else { pMsg = '&#44032;&#46300; &#51088;&#49464;'; }
  }

  if(aiAction === 'attack' && action !== 'dodge' && action !== 'guard'){
    var aiPunches = ['&#51105;','&#53356;&#47196;&#49828;','&#54985;','&#50612;&#54140;&#52983;'];
    var aiPunch = aiPunches[Math.floor(Math.random()*aiPunches.length)];
    aDmg = 6 + Math.floor(Math.random()*8);
    aMsg = 'AI '+aiPunch+' &#44277;&#44201;! -'+aDmg;
  } else if(aiAction === 'attack' && action === 'guard'){
    aDmg = 2 + Math.floor(Math.random()*3);
    aMsg = 'AI &#44277;&#44201; &#44032;&#46300;&#47196; &#44048;&#49548;! -'+aDmg;
  } else if(aiAction === 'dodge'){
    aMsg = 'AI &#54924;&#54588; &#51088;&#49464;';
  } else if(aiAction === 'guard'){
    pDmg = Math.floor(pDmg * 0.4);
    aMsg = 'AI &#44032;&#46300; (-'+pDmg+'&#47564;)';
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
    el.innerHTML = '<div class="sparring-result"><div class="sparring-result-icon">'+(won?'&#127942;':'&#128546;')+'</div><div class="sparring-result-text" style="color:'+(won?'var(--gold)':'var(--accent)')+'">'+(won?'&#49849;&#47532;!':'&#54056;&#48176;...')+'</div><div style="margin-top:8px;font-size:13px;color:var(--text-dim)">HP: '+sparState.playerHP+' vs AI: '+sparState.aiHP+'</div><div style="margin-top:4px;font-size:12px;color:var(--text-muted)">&#51204;&#51201;: '+wins+'&#49849; '+(total-wins)+'&#54056;</div><div style="margin-top:16px"><button class="timer-btn start" id="sparRetry">&#45796;&#49884; &#49828;&#54028;&#47553;</button></div></div>';
    var rb = document.getElementById('sparRetry');
    if(rb) rb.addEventListener('click', function(){ initSparring(); renderSparring(); });
    return;
  }

  var html = '<div class="sparring-arena">';
  html += '<div class="sparring-hud"><div style="text-align:left;flex:1"><div style="font-size:10px;color:var(--green);font-weight:700;margin-bottom:2px">PLAYER '+sparState.playerHP+'%</div><div class="sparring-hp"><div class="sparring-hp-fill player" style="width:'+sparState.playerHP+'%"></div></div></div>';
  html += '<div class="sparring-vs">VS</div>';
  html += '<div style="text-align:right;flex:1"><div style="font-size:10px;color:var(--accent);font-weight:700;margin-bottom:2px">AI '+sparState.aiHP+'%</div><div class="sparring-hp"><div class="sparring-hp-fill ai" style="width:'+sparState.aiHP+'%"></div></div></div></div>';
  html += '<div class="sparring-fighters"><div class="sparring-fighter" id="sparPlayer"><div class="sparring-fighter-body">&#129354;</div><div class="sparring-fighter-name">PLAYER</div></div><div style="font-size:32px;color:var(--accent-glow)">&#9876;&#65039;</div><div class="sparring-fighter" id="sparAI"><div class="sparring-fighter-body">&#129302;</div><div class="sparring-fighter-name">AI</div></div></div>';
  html += '<div class="sparring-actions">';
  html += '<div class="sparring-btn" data-action="jab"><span class="sparring-btn-icon">&#128074;</span><span class="sparring-btn-label">&#51105;</span></div>';
  html += '<div class="sparring-btn" data-action="cross"><span class="sparring-btn-icon">&#129307;</span><span class="sparring-btn-label">&#53356;&#47196;&#49828;</span></div>';
  html += '<div class="sparring-btn" data-action="hook"><span class="sparring-btn-icon">&#128170;</span><span class="sparring-btn-label">&#54985;</span></div>';
  html += '<div class="sparring-btn" data-action="uppercut"><span class="sparring-btn-icon">&#9889;</span><span class="sparring-btn-label">&#50612;&#54140;&#52983;</span></div>';
  html += '<div class="sparring-btn" data-action="dodge"><span class="sparring-btn-icon">&#128694;</span><span class="sparring-btn-label">&#54924;&#54588;</span></div>';
  html += '<div class="sparring-btn" data-action="guard"><span class="sparring-btn-icon">&#128737;&#65039;</span><span class="sparring-btn-label">&#44032;&#46300;</span></div>';
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
  var monthNames = ['1&#50900;','2&#50900;','3&#50900;','4&#50900;','5&#50900;','6&#50900;','7&#50900;','8&#50900;','9&#50900;','10&#50900;','11&#50900;','12&#50900;'];
  var dows = ['&#51068;','&#50900;','&#54868;','&#49688;','&#47785;','&#44552;','&#53664;'];
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

  var html = '<div class="cal-month"><div class="cal-month-header"><div class="cal-month-nav"><button class="cal-month-btn" id="calPrev">&#9664;</button></div><div class="cal-month-title">'+calYear+'&#45380; '+monthNames[calMonth]+'</div><div class="cal-month-nav"><button class="cal-month-btn" id="calNext">&#9654;</button></div></div>';
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
    html += '<div class="cal-plan-form"><div class="cal-plan-form-title">&#128197; '+calSelectedDate+' &#54984;&#47144; &#44228;&#54925;</div><input class="cal-plan-input" id="calPlanInput" placeholder="&#50696;: &#51105;-&#53356;&#47196;&#49828; &#53092;&#48372; 10&#48516;, &#49452;&#46020;&#50864; 5&#48516;" value="'+escHtml(plan)+'"><div class="cal-plan-btns"><button class="cal-plan-btn save" id="calPlanSave">&#51200;&#51109;</button><button class="cal-plan-btn cancel" id="calPlanCancel">&#45803;&#44592;</button></div></div>';
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
  {name:'&#44592;&#48376; &#50896;&#53804;',seq:[{t:'&#51105;',c:'jab'}],diff:'easy',desc:'&#44032;&#51109; &#44592;&#48376;&#51201;&#51064; &#54144;&#52824;. &#50526;&#49552;&#51004;&#47196; &#48736;&#47476;&#44172; &#45216;&#47532;&#44256; &#48148;&#47196; &#44032;&#46300;&#47196; &#46028;&#50500;&#50741;&#45768;&#45796;.'},
  {name:'&#50896;&#53804; &#53804;',seq:[{t:'&#51105;',c:'jab'},{t:'&#53356;&#47196;&#49828;',c:'cross'}],diff:'easy',desc:'&#48373;&#49905;&#51032; &#44592;&#48376; &#51473; &#44592;&#48376;. &#51105;&#51004;&#47196; &#44144;&#47532;&#47484; &#51116;&#44256; &#53356;&#47196;&#49828;&#47196; &#53440;&#44201;.'},
  {name:'&#53944;&#47532;&#54540; &#54144;&#52824;',seq:[{t:'&#51105;',c:'jab'},{t:'&#53356;&#47196;&#49828;',c:'cross'},{t:'&#54985;',c:'hook'}],diff:'easy',desc:'1-2-3 &#53092;&#48372;. &#51105;&#51004;&#47196; &#49884;&#51089;&#54644; &#53356;&#47196;&#49828;, &#47532;&#46300;&#54985;&#51004;&#47196; &#47560;&#47924;&#47532;.'},
  {name:'&#54252; &#54144;&#52824; &#53092;&#48372;',seq:[{t:'&#51105;',c:'jab'},{t:'&#53356;&#47196;&#49828;',c:'cross'},{t:'&#54985;',c:'hook'},{t:'&#53356;&#47196;&#49828;',c:'cross'}],diff:'medium',desc:'1-2-3-2 &#47532;&#45912; &#53092;&#48372;. &#54985; &#54980; &#48148;&#47196; &#53356;&#47196;&#49828;&#47196; &#52628;&#44032;&#53440;.'},
  {name:'&#45908;&#48660; &#51105;',seq:[{t:'&#51105;',c:'jab'},{t:'&#51105;',c:'jab'}],diff:'easy',desc:'&#51105;&#51012; &#50672;&#49549; &#46160;&#48264; &#45216;&#47532;&#45716; &#44592;&#49696;. &#49345;&#45824;&#51032; &#44032;&#46300;&#47484; &#54744;&#47084;&#44256; &#53356;&#47196;&#49828;&#47196; &#50672;&#44208;.'},
  {name:'&#48148;&#46356; &#49399;',seq:[{t:'&#51105;',c:'jab'},{t:'&#53356;&#47196;&#49828;',c:'cross'},{t:'&#48148;&#46356;&#54985;',c:'hook'}],diff:'medium',desc:'1-2-&#48148;&#46356;&#54985;. &#50620;&#44404;&#51060; &#50500;&#45772; &#47800;&#53685; &#50752;&#51060;&#46300; &#54985;&#51004;&#47196; &#53440;&#44201;.'},
  {name:'&#49836;&#47549; &#52852;&#50868;&#53552;',seq:[{t:'&#49836;&#47549;',c:'slip'},{t:'&#53356;&#47196;&#49828;',c:'cross'},{t:'&#54985;',c:'hook'}],diff:'medium',desc:'&#49345;&#45824; &#44277;&#44201;&#51012; &#49836;&#47549;&#51004;&#47196; &#54588;&#54620; &#54980; &#51593;&#49884; &#52852;&#50868;&#53552; &#44277;&#44201;.'},
  {name:'&#50612;&#54140;&#52983; &#48120;&#49828;',seq:[{t:'&#51105;',c:'jab'},{t:'&#50612;&#54140;&#52983;',c:'uppercut'},{t:'&#54985;',c:'hook'}],diff:'medium',desc:'&#51105;&#51004;&#47196; &#44144;&#47532;&#47484; &#51116;&#44256; &#50612;&#54140;&#52983;&#51004;&#47196; &#53556;&#51012; &#50732;&#47532;&#44256; &#54985;&#51004;&#47196; &#47560;&#47924;&#47532;.'},
  {name:'&#54028;&#50892; &#52404;&#51064;',seq:[{t:'&#53356;&#47196;&#49828;',c:'cross'},{t:'&#54985;',c:'hook'},{t:'&#50612;&#54140;&#52983;',c:'uppercut'},{t:'&#53356;&#47196;&#49828;',c:'cross'}],diff:'hard',desc:'&#54028;&#50892; &#54144;&#52824;&#47564; &#50672;&#49549;&#51004;&#47196; &#50672;&#44208;&#54616;&#45716; &#44256;&#44553; &#53092;&#48372;.'},
  {name:'&#53084;&#47553; &#49828;&#53944;&#47112;&#51060;&#53944;',seq:[{t:'&#47204;',c:'roll'},{t:'&#54985;',c:'hook'},{t:'&#53356;&#47196;&#49828;',c:'cross'},{t:'&#54985;',c:'hook'}],diff:'hard',desc:'&#47204;&#47553;&#51004;&#47196; &#54924;&#54588; &#54980; &#50577;&#51901; &#54985;&#44284; &#53356;&#47196;&#49828;&#47196; &#50672;&#49549; &#53440;&#44201;.'},
  {name:'&#51105; &#53944;&#47532;&#54540;',seq:[{t:'&#51105;',c:'jab'},{t:'&#51105;',c:'jab'},{t:'&#51105;',c:'jab'}],diff:'easy',desc:'&#51105; &#49464; &#48264;&#51004;&#47196; &#49345;&#45824; &#47532;&#46316;&#51012; &#44648;&#46888;&#47532;&#45716; &#44592;&#49696;.'},
  {name:'&#49828;&#50948;&#52824; &#53092;&#48372;',seq:[{t:'&#51105;',c:'jab'},{t:'&#53356;&#47196;&#49828;',c:'cross'},{t:'&#49836;&#47549;',c:'slip'},{t:'&#53356;&#47196;&#49828;',c:'cross'}],diff:'medium',desc:'1-2 &#54980; &#49836;&#47549;&#54644;&#49436; &#45796;&#49884; &#53356;&#47196;&#49828;. &#44277;&#48169; &#51204;&#54872; &#53092;&#48372;.'},
  {name:'&#47112;&#48260; &#53092;&#48372;',seq:[{t:'&#51105;',c:'jab'},{t:'&#48148;&#46356;',c:'hook'},{t:'&#50612;&#54140;&#52983;',c:'uppercut'}],diff:'medium',desc:'&#51105; &#54980; &#48148;&#46356;&#47484; &#45765;&#52628;&#44256; &#50612;&#54140;&#52983;&#51004;&#47196; &#47560;&#47924;&#47532;.'},
  {name:'&#54000;&#50740;&#54144; &#52852;&#50868;&#53552;',seq:[{t:'&#49836;&#47549;',c:'slip'},{t:'&#50612;&#54140;&#52983;',c:'uppercut'},{t:'&#54985;',c:'hook'},{t:'&#53356;&#47196;&#49828;',c:'cross'}],diff:'hard',desc:'&#49836;&#47549; &#54980; &#50612;&#54140;&#52983;&#51004;&#47196; &#49884;&#51089;&#54616;&#45716; &#49464; &#48264;&#51032; &#44277;&#44201; &#53092;&#48372;.'},
  {name:'&#54392;&#47197;&#49828; &#47084;&#49884;',seq:[{t:'&#51105;',c:'jab'},{t:'&#51105;',c:'jab'},{t:'&#53356;&#47196;&#49828;',c:'cross'},{t:'&#54985;',c:'hook'},{t:'&#53356;&#47196;&#49828;',c:'cross'}],diff:'hard',desc:'5&#53440; &#50672;&#49549; &#44277;&#44201;. &#45908;&#48660; &#51105;&#51004;&#47196; &#49884;&#51089;&#54644; &#49549;&#46020;&#47484; &#50732;&#47532;&#47728; &#53440;&#44201;.'},
  {name:'&#54028;&#50892; &#49399;',seq:[{t:'&#53356;&#47196;&#49828;',c:'cross'},{t:'&#54985;',c:'hook'},{t:'&#50612;&#54140;&#52983;',c:'uppercut'}],diff:'medium',desc:'&#54028;&#50892; 3&#53440; &#53092;&#48372;. &#50896;&#44540;&#44144;&#47532;&#50640;&#49436; &#44540;&#51217;&#51204;&#51004;&#47196; &#51204;&#54872;.'},
  {name:'&#54000;&#50740;&#54148; &#54253;&#54413;',seq:[{t:'&#51105;',c:'jab'},{t:'&#53356;&#47196;&#49828;',c:'cross'},{t:'&#54985;',c:'hook'},{t:'&#50612;&#54140;&#52983;',c:'uppercut'},{t:'&#53356;&#47196;&#49828;',c:'cross'},{t:'&#54985;',c:'hook'}],diff:'hard',desc:'6&#53440; &#50672;&#49549; &#44277;&#44201;. &#47784;&#46304; &#54144;&#52824; &#53440;&#51077;&#51012; &#54844;&#54633;&#54620; &#52572;&#49345;&#44553; &#53092;&#48372;.'},
  {name:'&#44032;&#46300; &#50532;&#46300; &#44256;',seq:[{t:'&#44032;&#46300;',c:'slip'},{t:'&#51105;',c:'jab'},{t:'&#53356;&#47196;&#49828;',c:'cross'}],diff:'easy',desc:'&#48169;&#50612; &#54980; &#48148;&#47196; &#44277;&#44201;&#51004;&#47196; &#51204;&#54872;&#54616;&#45716; &#44592;&#48376; &#44277;&#48169; &#51204;&#54872; &#53092;&#48372;.'},
  {name:'&#49828;&#53485; &#48177;',seq:[{t:'&#51105;',c:'jab'},{t:'&#48177;&#49828;&#53485;',c:'slip'},{t:'&#53356;&#47196;&#49828;',c:'cross'},{t:'&#54985;',c:'hook'}],diff:'medium',desc:'&#51105; &#54980; &#46244;&#47196; &#48736;&#51648;&#47728; &#49345;&#45824;&#51032; &#52852;&#50868;&#53552;&#47484; &#54588;&#54616;&#44256; &#45796;&#49884; &#44277;&#44201;.'},
  {name:'&#47560;&#51060;&#53356; &#53440;&#51060;&#49832; &#53092;&#48372;',seq:[{t:'&#51105;',c:'jab'},{t:'&#51105;',c:'jab'},{t:'&#50612;&#54140;&#52983;',c:'uppercut'},{t:'&#54985;',c:'hook'},{t:'&#54985;',c:'hook'}],diff:'hard',desc:'&#53440;&#51060;&#49832; &#49828;&#53440;&#51068;&#51032; 5&#53440; &#53092;&#48372;. &#45908;&#48660;&#51105;+&#50612;&#54140;&#52983;+&#45908;&#48660;&#54985;.'}
];

var comboExpanded = -1;

function renderCombos(){
  var el = document.getElementById('v10Combos');
  if(!el) return;
  var html = '<div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">';
  html += '<button class="timer-adj" id="comboAll" style="width:auto;padding:2px 10px;border-radius:8px;font-size:10px">&#51204;&#52404;</button>';
  html += '<button class="timer-adj" id="comboEasy" style="width:auto;padding:2px 10px;border-radius:8px;font-size:10px;color:var(--green)">&#52488;&#44553;</button>';
  html += '<button class="timer-adj" id="comboMed" style="width:auto;padding:2px 10px;border-radius:8px;font-size:10px;color:var(--orange)">&#51473;&#44553;</button>';
  html += '<button class="timer-adj" id="comboHard" style="width:auto;padding:2px 10px;border-radius:8px;font-size:10px;color:var(--accent)">&#44256;&#44553;</button>';
  html += '</div>';
  html += '<div class="combo-grid">';
  COMBOS.forEach(function(combo, idx){
    var expanded = comboExpanded === idx;
    var isFav = v10.comboFavorites.indexOf(idx) >= 0;
    html += '<div class="combo-card'+(expanded?' expanded':'')+'" data-idx="'+idx+'">';
    html += '<div class="combo-fav'+(isFav?' active':'')+'" data-fav="'+idx+'">'+(isFav?'&#9733;':'&#9734;')+'</div>';
    html += '<div class="combo-header"><span class="combo-name">'+combo.name+'</span><span class="combo-diff '+combo.diff+'">'+(combo.diff==='easy'?'&#52488;&#44553;':combo.diff==='medium'?'&#51473;&#44553;':'&#44256;&#44553;')+'</span></div>';
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
    html += '<div class="timer-config"><div class="timer-config-item"><div class="timer-config-label">&#46972;&#50868;&#46300;</div><div class="timer-config-val"><button class="timer-adj" id="tmRndM">-</button><span class="timer-num" id="tmRndV">'+timerRounds+'</span><button class="timer-adj" id="tmRndP">+</button></div></div>';
    html += '<div class="timer-config-item"><div class="timer-config-label">&#50868;&#46041;(&#52488;)</div><div class="timer-config-val"><button class="timer-adj" id="tmWrkM">-</button><span class="timer-num" id="tmWrkV">'+timerWork+'</span><button class="timer-adj" id="tmWrkP">+</button></div></div>';
    html += '<div class="timer-config-item"><div class="timer-config-label">&#55092;&#49885;(&#52488;)</div><div class="timer-config-val"><button class="timer-adj" id="tmRstM">-</button><span class="timer-num" id="tmRstV">'+timerRest+'</span><button class="timer-adj" id="tmRstP">+</button></div></div></div>';
    html += '<div class="timer-time">'+fmtTimer(timerWork)+'</div>';
    html += '<div class="timer-round">'+timerRounds+' &#46972;&#50868;&#46300; &#215; '+timerWork+'&#52488;</div>';
    html += '<div class="timer-btns"><button class="timer-btn start" id="tmStart">&#9654; &#49884;&#51089;</button></div>';
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
    html2 += '<div class="timer-phase '+timerPhase+'">'+(timerPhase==='work'?'&#128293; FIGHT':'&#128154; REST')+'</div>';
    html2 += '<div class="timer-btns"><button class="timer-btn stop" id="tmStop">&#9632; &#51473;&#51648;</button></div>';
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
        toastV10('&#128276; &#53440;&#51060;&#47672; &#50756;&#47308;! '+timerRounds+'R &#50756;&#47308;!');
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
    if(latest.muscle){ html += '<div style="text-align:center"><div style="font-size:24px;font-weight:900;color:var(--green)">'+latest.muscle+'</div><div style="font-size:10px;color:var(--text-muted)">&#44540;&#50977;%</div></div>'; }
    if(latest.fat){ html += '<div style="text-align:center"><div style="font-size:24px;font-weight:900;color:var(--orange)">'+latest.fat+'</div><div style="font-size:10px;color:var(--text-muted)">&#52404;&#51648;&#48169;%</div></div>'; }
    html += '</div>';
  }

  html += '<div class="body-stats-form"><div class="body-stats-input-wrap"><label class="body-stats-label">&#52404;&#51473; (kg)</label><input class="body-stats-input" type="number" step="0.1" id="bsWeight" placeholder="70.0"></div>';
  html += '<div class="body-stats-input-wrap"><label class="body-stats-label">&#44540;&#50977;&#47049; (%)</label><input class="body-stats-input" type="number" step="0.1" id="bsMuscle" placeholder="35.0"></div>';
  html += '<div class="body-stats-input-wrap"><label class="body-stats-label">&#52404;&#51648;&#48169; (%)</label><input class="body-stats-input" type="number" step="0.1" id="bsFat" placeholder="18.0"></div>';
  html += '<div class="body-stats-input-wrap"><label class="body-stats-label">&#47700;&#47784;</label><input class="body-stats-input" type="text" id="bsMemo" placeholder="&#50724;&#45720; &#52968;&#46356;&#49496;"></div>';
  html += '<button class="body-stats-save" id="bsSave">&#128190; &#44592;&#47197; &#51200;&#51109;</button></div>';

  if(stats.length > 0){
    html += '<div class="body-stats-history">';
    stats.slice().reverse().slice(0,10).forEach(function(s){
      html += '<div class="body-stats-row"><span>'+s.date+'</span><span>'+s.weight+'kg'+(s.muscle?' / &#44540;&#50977;'+s.muscle+'%':'')+(s.fat?' / &#52404;&#51648;&#48169;'+s.fat+'%':'')+'</span></div>';
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
    toastV10('&#128190; &#52404;&#51473; &#44592;&#47197; &#51200;&#51109;!');
    renderBodyStats();
  });
}

// ===== TECHNIQUE TUTORIAL =====
var TECHNIQUES = [
  {name:'&#51105; (Jab)',cat:'&#44592;&#48376; &#44277;&#44201;',icon:'&#128074;',steps:['&#44592;&#48376; &#49828;&#53472;&#49828;&#50640;&#49436; &#50526;&#49552;&#51012; &#48736;&#47476;&#44172; &#48260;&#51665;&#45768;&#45796;','&#51452;&#47673;&#51012; &#44844; &#50672; &#52292;&#47196; &#49552;&#47785;&#51012; &#44278;&#44172; &#50976;&#51648;','&#54036;&#45812;&#52824;&#44032; &#50756;&#51204;&#55176; &#54196;&#51656; &#49692;&#44036; &#53440;&#44201;','&#48148;&#47196; &#44032;&#46300; &#50948;&#52824;&#47196; &#54036;&#51012; &#46028;&#47140;&#48372;&#45252;&#45768;&#45796;']},
  {name:'&#53356;&#47196;&#49828; (Cross)',cat:'&#54028;&#50892; &#44277;&#44201;',icon:'&#129307;',steps:['&#44592;&#48376; &#49828;&#53472;&#49828;&#50640;&#49436; &#46263;&#49552;&#51012; &#45208;&#47553;&#45768;&#45796;','&#46244;&#48156; &#48156;&#45347;&#52824;&#50640;&#49436; &#55192;&#51012; &#49884;&#51089;','&#50628;&#45929;&#51060;&#47484; &#54924;&#51204;&#49884;&#53412;&#47728; &#45208;&#44049;&#45768;&#45796;','&#50756;&#51204;&#55176; &#54196;&#51652; &#49692;&#44036; &#49552;&#47785; &#44278;&#44172; &#50976;&#51648;','&#44032;&#46300; &#50948;&#52824;&#47196; &#48736;&#47476;&#44172; &#48373;&#44480;']},
  {name:'&#54985; (Hook)',cat:'&#44540;&#51217;&#51204; &#44277;&#44201;',icon:'&#128170;',steps:['&#54036;&#45348;&#47484; 90&#46020;&#47196; &#44396;&#48512;&#47549;&#45768;&#45796;','&#50526;&#48156; &#54588;&#48391;&#51004;&#47196; &#47800;&#51012; &#54924;&#51204;','&#54036;&#45348;&#51060; &#48148;&#45797;&#44284; &#54217;&#54665;&#54616;&#44172; &#50976;&#51648;','&#50628;&#45929;&#51060;&#50752; &#50612;&#44648;&#51032; &#55192;&#51004;&#47196; &#53440;&#44201;','&#53440;&#44201; &#54980; &#44032;&#46300;&#47196; &#48373;&#44480;']},
  {name:'&#50612;&#54140;&#52983; (Uppercut)',cat:'&#44540;&#51217;&#51204; &#44277;&#44201;',icon:'&#9889;',steps:['&#47924;&#47502;&#51012; &#49332;&#51677; &#44396;&#48512;&#47549;&#45768;&#45796;','&#45796;&#47532;&#50640;&#49436; &#55192;&#51012; &#49884;&#51089;&#54644; &#50948;&#47196; &#54396;&#50612;&#50732;&#47549;&#45768;&#45796;','&#51452;&#47673;&#51012; &#44844; &#50596; &#52292;&#47196; &#49552;&#48148;&#45797;&#51060; &#47800;&#51012; &#54693;&#54616;&#44172;','&#53556;&#51012; &#50500;&#47000;&#50640;&#49436; &#50948;&#47196; &#53440;&#44201;','&#51593;&#49884; &#44032;&#46300; &#50948;&#52824;&#47196; &#48373;&#44480;']},
  {name:'&#49836;&#47549; (Slip)',cat:'&#48169;&#50612; &#44592;&#49696;',icon:'&#128694;',steps:['&#49345;&#45824;&#51032; &#54144;&#52824;&#44032; &#50732; &#46412; &#47800;&#51012; &#50740;&#51004;&#47196; &#44592;&#50872;&#51060;&#44592;','&#47924;&#47502;&#51012; &#49332;&#51677; &#44396;&#48512;&#47532;&#47728; &#44592;&#50872;&#51076;','&#45576;&#51008; &#49345;&#45824;&#47484; &#44228;&#49549; &#51452;&#49884;','&#44592;&#50872;&#51064; &#52292;&#47196; &#52852;&#50868;&#53552; &#44277;&#44201; &#51456;&#48708;','&#48736;&#47476;&#44172; &#50896;&#47000; &#50948;&#52824;&#47196; &#48373;&#44480;']},
  {name:'&#47204;&#47553; (Rolling)',cat:'&#48169;&#50612; &#44592;&#49696;',icon:'&#128260;',steps:['&#49345;&#45824; &#54985;&#51060; &#50732; &#46412; &#47924;&#47502;&#51012; &#44396;&#48512;&#47549;&#45768;&#45796;','&#47672;&#47532;&#47484; &#45230;&#52628;&#47728; U&#51088; &#44417;&#51201;&#51004;&#47196; &#51060;&#46041;','&#54144;&#52824; &#50500;&#47000;&#47196; &#51648;&#45208;&#44032;&#47728; &#48152;&#45824;&#51901;&#51004;&#47196; &#50732;&#46972;&#50740;','&#50732;&#46972;&#50724;&#47728; &#52852;&#50868;&#53552; &#44277;&#44201; &#51456;&#48708;']},
  {name:'&#54400;&#53944;&#50892;&#53356; (Footwork)',cat:'&#51060;&#46041; &#44592;&#49696;',icon:'&#128095;',steps:['&#50612;&#44648; &#45320;&#48708;&#47196; &#48156;&#51012; &#48268;&#47549;&#45768;&#45796;','&#50526;&#48156;&#51060; &#50526;&#50640;, &#46244;&#48156;&#51060; &#46244;&#50640; (&#49828;&#53472;&#49828;)','&#50526;&#51004;&#47196; &#44040; &#46412; &#50526;&#48156; &#47676;&#51200; &#50880;&#51649;&#51076;','&#46244;&#47196; &#44040; &#46412; &#46244;&#48156; &#47676;&#51200; &#50880;&#51649;&#51076;','&#48156;&#51060; &#44368;&#52264;&#46104;&#51648; &#50506;&#46020;&#47197; &#51452;&#51032;']},
  {name:'&#49452;&#46020;&#50864; &#48373;&#49905; (Shadow Boxing)',cat:'&#54984;&#47144; &#48169;&#48277;',icon:'&#127775;',steps:['&#44144;&#50872; &#50526;&#50640;&#49436; &#54268;&#51012; &#52404;&#53356;&#54633;&#45768;&#45796;','&#49892;&#51228; &#49345;&#45824;&#44032; &#51080;&#45796;&#44256; &#49345;&#49345;&#54616;&#47728; &#51060;&#46041;','&#53092;&#48372;&#47484; &#50672;&#49549;&#51004;&#47196; &#50672;&#49845;&#54633;&#45768;&#45796;','&#48169;&#50612; &#46041;&#51089;&#46020; &#54632;&#44760; &#50672;&#49845;','3&#48516; &#46972;&#50868;&#46300; + 1&#48516; &#55092;&#49885; &#44396;&#51312;&#47196;']},
  {name:'&#54756;&#48708;&#48177; &#53944;&#47112;&#51060;&#45789;',cat:'&#54984;&#47144; &#48169;&#48277;',icon:'&#128085;',steps:['&#47924;&#44144;&#50868; &#54756;&#48708;&#48177;&#51012; &#51456;&#48708;&#54633;&#45768;&#45796;','&#51105;-&#53356;&#47196;&#49828; &#53092;&#48372;&#47484; &#48149;&#50500;&#44032;&#47728; &#53440;&#44201;','&#44033; &#54144;&#52824;&#47560;&#45796; &#54756;&#48708;&#48177;&#51060; &#55140;&#46308;&#47532;&#45716;&#51648; &#54869;&#51064;','3&#48516; &#46972;&#50868;&#46300; &#44396;&#51312;&#47196; &#49828;&#54008;&#48120;&#45208; &#53412;&#50864;&#44592;','&#55192;&#51060; &#50500;&#45772; &#49549;&#46020;&#50752; &#51221;&#54869;&#46020;&#50640; &#51665;&#51473;']},
  {name:'&#48373;&#49905; &#49828;&#53472;&#49828; (Boxing Stance)',cat:'&#44592;&#48376; &#51088;&#49464;',icon:'&#129354;',steps:['&#50612;&#44648; &#45320;&#48708;&#47564;&#53372; &#48156;&#51012; &#48268;&#47549;&#45768;&#45796;','&#50526;&#48156;&#51060; &#50557;&#44036; &#50526;&#51004;&#47196;, 45&#46020; &#44033;&#46020;','&#47924;&#47502;&#51008; &#49332;&#51677; &#44396;&#48512;&#47532;&#44256; &#52404;&#51473;&#51008; &#51473;&#50521;&#50640;','&#50577;&#49552;&#51008; &#50620;&#44404;(&#53556;/&#48380;) &#48372;&#54840; &#50948;&#52824;','&#53556;&#51012; &#50557;&#44036; &#45817;&#44592;&#44256; &#45576;&#51008; &#49345;&#45824;&#47484; &#51452;&#49884;']},
  {name:'&#54028;&#47553; (Parrying)',cat:'&#48169;&#50612; &#44592;&#49696;',icon:'&#128400;',steps:['&#49345;&#45824; &#54144;&#52824;&#44032; &#50732; &#46412; &#50526;&#49552;&#51004;&#47196; &#53804;&#50612;&#45254;&#45768;&#45796;','&#49552;&#48148;&#45797;&#51004;&#47196; &#49345;&#45824; &#54144;&#52824;&#47484; &#50743;&#51004;&#47196; &#52824;&#50892;&#45254;','&#47588;&#50864; &#51089;&#51008; &#46041;&#51089;&#51004;&#47196; &#52649;&#48516;&#54633;&#45768;&#45796;','&#53804;&#50612;&#45244; &#51649;&#54980; &#52852;&#50868;&#53552; &#44277;&#44201; &#49892;&#54665;']},
  {name:'&#52852;&#50868;&#53552; &#54144;&#52824;',cat:'&#44256;&#44553; &#44592;&#49696;',icon:'&#128165;',steps:['&#49345;&#45824; &#44277;&#44201;&#51012; &#54588;&#54616;&#44144;&#45208; &#48169;&#50612;&#54633;&#45768;&#45796;','&#49345;&#45824;&#44032; &#44032;&#46300;&#47484; &#45236;&#47536; &#48731; &#53952;&#51012; &#53440;&#44201;','&#44032;&#51109; &#55136;&#54620; &#53440;&#51060;&#48141;&#51008; &#49345;&#45824; &#53356;&#47196;&#49828; &#51649;&#54980;','&#49836;&#47549;+&#53356;&#47196;&#49828; &#46608;&#45716; &#47204;&#47553;+&#54985; &#52852;&#50868;&#53552;','&#48152;&#51025; &#49549;&#46020;&#44032; &#47588;&#50864; &#51473;&#50836; - &#48152;&#49324;&#51201;&#51004;&#47196; &#50672;&#49845;']}
];

var techExpanded = -1;

function renderTechniques(){
  var el = document.getElementById('v10Techniques');
  if(!el) return;
  var readCount = Object.keys(v10.techniqueRead).length;
  var html = '<div style="margin-bottom:10px;font-size:12px;color:var(--text-dim)">'+readCount+' / '+TECHNIQUES.length+' &#50756;&#46021;</div>';
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
  {id:'c_100jab',name:'&#51105; 100&#48156;',desc:'&#54616;&#47336; &#46041;&#50504; &#51105; 100&#48156; &#45804;&#49457;',target:100,field:'jab',reward:'+50 XP'},
  {id:'c_50cross',name:'&#53356;&#47196;&#49828; 50&#48156;',desc:'&#54616;&#47336; &#46041;&#50504; &#53356;&#47196;&#49828; 50&#48156; &#45804;&#49457;',target:50,field:'cross',reward:'+40 XP'},
  {id:'c_30hook',name:'&#54985; 30&#48156;',desc:'&#54616;&#47336; &#46041;&#50504; &#54985; 30&#48156; &#45804;&#49457;',target:30,field:'hook',reward:'+40 XP'},
  {id:'c_20upper',name:'&#50612;&#54140;&#52983; 20&#48156;',desc:'&#54616;&#47336; &#46041;&#50504; &#50612;&#54140;&#52983; 20&#48156; &#45804;&#49457;',target:20,field:'uppercut',reward:'+40 XP'},
  {id:'c_500total',name:'&#52509; 500&#54144;&#52824;',desc:'&#51060;&#48264; &#51452; &#52509;&#54633; 500&#54144;&#52824; &#45804;&#49457;',target:500,field:'total',reward:'+100 XP'},
  {id:'c_3sessions',name:'3&#54924; &#54984;&#47144;',desc:'&#51060;&#48264; &#51452; 3&#54924; &#51060;&#49345; &#54984;&#47144;',target:3,field:'sessions',reward:'+60 XP'},
  {id:'c_combo10',name:'10&#53092;&#48372;',desc:'&#54620; &#49464;&#49496;&#50640;&#49436; 10&#53092;&#48372; &#51060;&#49345; &#49457;&#44277;',target:10,field:'combos',reward:'+80 XP'},
  {id:'c_15min',name:'15&#48516; &#54984;&#47144;',desc:'&#54620; &#49464;&#49496; 15&#48516; &#51060;&#49345; &#54984;&#47144;',target:15,field:'duration',reward:'+50 XP'}
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

  var html = '<div style="margin-bottom:10px;font-size:11px;color:var(--text-muted)">&#51452;&#44036; &#52268;&#47536;&#51648; ('+weekKey+' ~)</div>';
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
    html += '<div style="font-size:14px;color:var(--text-dim);margin-bottom:12px">60&#52488; &#46041;&#50504; &#52572;&#45824;&#54620; &#47566;&#51060; &#53084;&#47533;&#54616;&#49464;&#50836;!</div>';
    if(v10.enduranceBest > 0) html += '<div class="endurance-best">&#127942; &#52572;&#44256; &#44592;&#47197;: '+v10.enduranceBest+'&#54924;</div>';
    html += '<div style="margin-top:16px"><button class="endurance-btn go" id="endStart">&#128293; &#49884;&#51089;!</button></div>';
    html += '</div>';
    el.innerHTML = html;
    document.getElementById('endStart').addEventListener('click', startEndurance);
  } else {
    var html2 = '<div class="endurance-area">';
    html2 += '<div class="endurance-timer">'+endTimeLeft+'&#52488;</div>';
    html2 += '<div class="endurance-click-zone" id="endZone">&#128074;</div>';
    html2 += '<div class="endurance-counter">'+endCount+'</div>';
    html2 += '<div class="endurance-target">&#52572;&#44256;: '+v10.enduranceBest+'</div>';
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
      toastV10('&#128293; &#51648;&#44396;&#47141; &#53580;&#49828;&#53944; &#50756;&#47308;! '+endCount+'&#54924;');
      renderEndurance();
      return;
    }
    renderEndurance();
  }, 1000);
  renderEndurance();
}

// ===== QUIZ V10 (+15 questions) =====
var QUIZ_V10 = [
  {q:'&#48373;&#49905;&#50640;&#49436; &#50612;&#44648;&#50752; &#54036;&#51012; &#50500;&#47000;&#47196; &#50676;&#50612;&#49436; &#44144;&#47532;&#47484; &#48268;&#47532;&#45716; &#44592;&#49696;&#51008;?',opts:['&#54028;&#47553;','&#50500;&#50883;&#54028;&#51060;&#53552;','&#48372;&#46356;&#51105;','&#47113;&#49828;&#53584;&#49496;'],ans:3,exp:'&#47113;&#49828;&#53584;&#49496;(Range Extension)&#45716; &#54036;&#44284; &#50612;&#44648;&#47484; &#50756;&#51204;&#55176; &#54196;&#52432; &#52572;&#45824; &#44144;&#47532;&#47484; &#54869;&#48372;&#54616;&#45716; &#44592;&#49696;&#51077;&#45768;&#45796;.'},
  {q:'Floyd Mayweather Jr.&#51032; &#54532;&#47196; &#51204;&#51201;&#51008;?',opts:['49&#49849; 1&#54056;','50&#49849; 0&#54056;','47&#49849; 0&#54056;','48&#49849; 2&#54056;'],ans:1,exp:'Mayweather&#45716; 50&#49849; 0&#54056;&#47196; &#51008;&#53748;&#54620; &#51204;&#49444;&#51201;&#51064; &#48373;&#49436;&#51077;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#12300;&#53364;&#47536;&#52824;&#12301;&#45716; &#50612;&#46500; &#49345;&#54889;&#51064;&#44032;?',opts:['KO &#49849;&#47532;','&#44540;&#51217;&#51204;&#50640;&#49436; &#49345;&#45824;&#47484; &#44749;&#50504;&#45716; &#44163;','&#51452;&#49900;&#51032; &#44221;&#44256;','&#46972;&#50868;&#46300; &#51333;&#47308;'],ans:1,exp:'&#53364;&#47536;&#52824;&#45716; &#49345;&#45824;&#47484; &#44749;&#50504;&#50500; &#54144;&#52824;&#47484; &#47561;&#45716; &#44540;&#51217;&#51204; &#44592;&#49696;&#51077;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#12300;&#49324;&#50864;&#49828;&#54252;&#12301;(Southpaw)&#45716;?',opts:['&#50724;&#47480;&#49552;&#51105;&#51060; &#49440;&#49688;','&#50812;&#49552;&#51105;&#51060; &#49440;&#49688;','&#50577;&#49552;&#51105;&#51060; &#49440;&#49688;','&#52488;&#48372; &#49440;&#49688;'],ans:1,exp:'&#49324;&#50864;&#49828;&#54252;&#45716; &#50812;&#49552;&#51105;&#51060; &#49440;&#49688;&#47484; &#47568;&#54616;&#47728;, &#50724;&#47480;&#48156;&#51060; &#50526;&#50640; &#45208;&#50741;&#45768;&#45796;.'},
  {q:'&#48373;&#49905; &#54984;&#47144;&#50640;&#49436; &#12300;&#48120;&#53944; &#54028;&#46300;&#12301;&#45716; &#47924;&#50631;&#51064;&#44032;?',opts:['&#44032;&#49847; &#48372;&#54840; &#51109;&#52824;','&#54144;&#52824; &#53440;&#44199;','&#54756;&#46300;&#44592;&#50612;','&#50977;&#46041; &#48372;&#54840; &#51109;&#48708;'],ans:1,exp:'&#48120;&#53944; &#54028;&#46300;&#45716; &#54028;&#53944;&#45320;&#44032; &#46308;&#44256; &#51080;&#45716; &#53440;&#44199;&#51004;&#47196; &#54144;&#52824; &#51221;&#54869;&#46020;&#47484; &#50672;&#49845;&#54633;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#12300;&#48372;&#48652; &#50532;&#46300; &#50948;&#48652;&#12301;&#45716;?',opts:['&#48156;&#47196; &#52264;&#45716; &#44592;&#49696;','&#47672;&#47532;&#47484; &#50880;&#51649;&#50668; &#54588;&#54616;&#45716; &#44592;&#49696;','&#54036;&#51012; &#44048;&#49912;&#45716; &#44592;&#49696;','&#47217;&#51012; &#51105;&#45716; &#44592;&#49696;'],ans:1,exp:'&#48372;&#48652; &#50532;&#46300; &#50948;&#48652;&#45716; &#47672;&#47532;&#47484; &#51340;&#50864;&#47196; &#50880;&#51649;&#50668; &#54144;&#52824;&#47484; &#54588;&#54616;&#45716; &#44592;&#48376; &#48169;&#50612; &#44592;&#49696;&#51077;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#52852;&#50868;&#53552; &#54144;&#52824;&#51032; &#54645;&#49900;&#51008;?',opts:['&#44053;&#54620; &#55192;','&#48736;&#47480; &#48152;&#51025; &#49549;&#46020;','&#45796;&#50577;&#54620; &#44033;&#46020;','&#48156;&#47196; &#52264;&#45716; &#44163;'],ans:1,exp:'&#52852;&#50868;&#53552;&#45716; &#49345;&#45824;&#44032; &#44277;&#44201;&#54620; &#51649;&#54980; &#44032;&#51109; &#48736;&#47476;&#44172; &#48152;&#44201;&#54616;&#45716; &#44163;&#51060; &#54645;&#49900;&#51077;&#45768;&#45796;.'},
  {q:'&#54532;&#47196;&#48373;&#49905;&#50640;&#49436; &#49900;&#54032;&#51060; &#52852;&#50868;&#53944;&#54616;&#45716; &#49884;&#44036;&#51008;?',opts:['5&#52488;','8&#52488;','10&#52488;','12&#52488;'],ans:2,exp:'&#54532;&#47196;&#48373;&#49905;&#50640;&#49436; &#45796;&#50868;&#46108; &#49440;&#49688;&#44032; 10&#52488; &#50504;&#50640; &#51068;&#50612;&#45208;&#51648; &#47803;&#54616;&#47732; KO&#51077;&#45768;&#45796;.'},
  {q:'&#48373;&#49905; &#54984;&#47144; &#51204; &#49552; &#47017;&#51012; &#44048;&#45716; &#51060;&#50976;&#45716;?',opts:['&#44032;&#48372;&#50868; &#54144;&#52824;&#47484; &#50948;&#54644;','&#49552;&#47785;&#44284; &#49552;&#44032;&#46973; &#48372;&#54840;','&#44544;&#47084;&#48652;&#47484; &#51105;&#44592; &#50948;&#54644;','&#48277;&#51201;&#51004;&#47196; &#51032;&#47924;&#51201;&#51060;&#50612;&#49436;'],ans:1,exp:'&#49552; &#47017;&#51008; &#49552;&#47785;&#44288;&#51208;&#44284; &#49552;&#44032;&#46973; &#48008;&#47484; &#48372;&#54840;&#54616;&#50668; &#48512;&#49345;&#51012; &#48169;&#51648;&#54633;&#45768;&#45796;.'},
  {q:'Mike Tyson&#51032; &#48324;&#47749;&#51008;?',opts:['The Greatest','Iron Mike','Sugar Ray','The Hitman'],ans:1,exp:'Mike Tyson&#51008; &ldquo;Iron Mike&rdquo;&#46972;&#45716; &#48324;&#47749;&#51004;&#47196; &#50976;&#47749;&#54620; &#54756;&#48708;&#44553; &#52380;&#54588;&#50616;&#51077;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#52404;&#44553; &#52769;&#51221;&#51008; &#50616;&#51228; &#54616;&#45716;&#44032;?',opts:['&#44221;&#44592; &#51649;&#54980;','&#44221;&#44592; &#51204;&#45216; &#46608;&#45716; &#45817;&#51068;','&#44221;&#44592; &#51473;','&#54984;&#47144; &#51473;'],ans:1,exp:'&#48373;&#49905; &#44277;&#49885; &#52404;&#44553; &#52769;&#51221;&#51008; &#44221;&#44592; &#51204;&#45216; &#46608;&#45716; &#45817;&#51068;&#50640; &#49892;&#49884;&#54633;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#12300;&#50724;&#49548;&#46021;&#49828;&#12301;(Orthodox) &#49828;&#53472;&#49828;&#45716;?',opts:['&#50812;&#49552;&#51060; &#50526;','&#50724;&#47480;&#49552;&#51060; &#50526;','&#50812;&#48156;&#51060; &#50526;','&#50724;&#47480;&#48156;&#51060; &#50526;'],ans:2,exp:'&#50724;&#49548;&#46021;&#49828; &#49828;&#53472;&#49828;&#45716; &#50812;&#48156;&#51060; &#50526;, &#50724;&#47480;&#49552;&#51060; &#46244;(&#54028;&#50892;&#54620;&#46300;)&#50640; &#50948;&#52824;&#54633;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#12300;&#44592;&#48652;&#12301;(Give)&#45716;?',opts:['&#53440;&#44201; &#44592;&#49696;','&#54637;&#48373; &#49440;&#50616;','&#51216;&#49688;&#47484; &#51452;&#45716; &#44163;','&#53076;&#45320; &#50689;&#50669;'],ans:1,exp:'&#12300;&#44592;&#48652;&#12301;&#45716; &#49440;&#49688;&#44032; &#45908; &#51060;&#49345; &#49912;&#50864;&#51648; &#50506;&#44192;&#45796;&#44256; &#54637;&#48373;&#54616;&#45716; &#44163;&#51012; &#47568;&#54633;&#45768;&#45796;.'},
  {q:'&#48373;&#49905; &#54984;&#47144;&#50640;&#49436; &#49828;&#53413; &#48149;&#51088;&#50640; &#49549;&#46020;&#47484; &#45458;&#51060;&#47140;&#47732;?',opts:['&#47924;&#44144;&#50868; &#44544;&#47084;&#48652; &#49324;&#50857;','&#44032;&#48260;&#50868; &#44544;&#47084;&#48652; &#49324;&#50857;','&#44544;&#47084;&#48652; &#50630;&#51060; &#50672;&#49845;','&#52380;&#52380;&#55176; &#50672;&#49845;'],ans:0,exp:'&#47924;&#44144;&#50868; &#44544;&#47084;&#48652;(16oz)&#47196; &#50672;&#49845;&#54616;&#47732; &#49549;&#46020;&#50752; &#51648;&#44396;&#47141;&#51060; &#54693;&#49345;&#46121;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#12300;&#48120;&#46308;&#50920;&#51060;&#53944;&#12301;&#51032; &#52404;&#44553; &#48276;&#50948;&#45716;?',opts:['55-60kg','60-69kg','69-75kg','75-80kg'],ans:2,exp:'&#48120;&#46308;&#50920;&#51060;&#53944;&#45716; 69~75kg(152~165lbs)&#51004;&#47196; &#51473;&#44036; &#52404;&#44553; &#44396;&#44036;&#51077;&#45768;&#45796;.'}
];

var q10Idx = 0, q10Answered = false, q10Correct = 0, q10Done = false;

function renderQuizV10(){
  var el = document.getElementById('v10Quiz');
  if(!el) return;
  if(q10Done){
    var pct = Math.round(q10Correct/QUIZ_V10.length*100);
    var grade = pct>=90?'S':pct>=80?'A':pct>=70?'B':pct>=60?'C':'D';
    el.innerHTML = '<div class="quiz-result"><div class="quiz-score-big">'+q10Correct+' / '+QUIZ_V10.length+'</div><div class="quiz-score-label">&#51221;&#45813; ('+pct+'%)</div><div class="quiz-grade" style="color:'+(pct>=80?'var(--green)':pct>=60?'var(--orange)':'var(--accent)')+'">&#46321;&#44553;: '+grade+'</div><div class="quiz-nav" style="margin-top:16px"><button class="quiz-nav-btn primary" id="q10Retry">&#45796;&#49884; &#54400;&#44592;</button></div></div>';
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
  html += '</div><div class="quiz-explanation'+(q10Answered?' show':'')+'">&#128161; '+qq.exp+'</div>';
  if(q10Answered){
    html += '<div class="quiz-nav"><button class="quiz-nav-btn primary" id="q10Next">'+(q10Idx<QUIZ_V10.length-1?'&#45796;&#51020; &#47928;&#51228; &#8594;':'&#44208;&#44284; &#48372;&#44592;')+'</button></div>';
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
  {id:'a10_spar_first',name:'&#52395; &#49828;&#54028;&#47553;',icon:'&#9876;&#65039;',desc:'&#49828;&#54028;&#47553; &#49884;&#48044;&#47112;&#51060;&#49496; 1&#54924; &#50756;&#47308;',check:function(){return v10.sparringSessions.length>=1;}},
  {id:'a10_spar_win5',name:'5&#49849; &#48373;&#49436;',icon:'&#129354;',desc:'&#49828;&#54028;&#47553; 5&#49849; &#45804;&#49457;',check:function(){return v10.sparringSessions.filter(function(s){return s.won;}).length>=5;}},
  {id:'a10_combo_fav',name:'&#53092;&#48372; &#49688;&#51665;&#44032;',icon:'&#11088;',desc:'&#53092;&#48372; 5&#44060; &#51600;&#44200;&#52286;&#44592;',check:function(){return v10.comboFavorites.length>=5;}},
  {id:'a10_timer_use',name:'&#53440;&#51060;&#47672; &#54876;&#50857;',icon:'&#9201;',desc:'&#46972;&#50868;&#46300; &#53440;&#51060;&#47672; &#49324;&#50857;',check:function(){return timerRounds > 0 && !timerActive;}},
  {id:'a10_body_track',name:'&#48148;&#46356; &#53944;&#47000;&#52964;',icon:'&#128200;',desc:'&#52404;&#51473; &#44592;&#47197; 3&#54924; &#51060;&#49345;',check:function(){return v10.bodyStats.length>=3;}},
  {id:'a10_tech_5',name:'&#44592;&#49696; &#54617;&#49845;&#44032;',icon:'&#128218;',desc:'&#53580;&#53356;&#45769; 5&#44060; &#50756;&#46021;',check:function(){return Object.keys(v10.techniqueRead).length>=5;}},
  {id:'a10_tech_all',name:'&#53580;&#53356;&#45769; &#47560;&#49828;&#53552;',icon:'&#127891;',desc:'&#47784;&#46304; 12&#44060; &#53580;&#53356;&#45769; &#50756;&#46021;',check:function(){return Object.keys(v10.techniqueRead).length>=12;}},
  {id:'a10_endure_50',name:'&#51648;&#44396;&#47141; 50',icon:'&#128170;',desc:'&#51648;&#44396;&#47141; &#53580;&#49828;&#53944; 50&#54924; &#45804;&#49457;',check:function(){return v10.enduranceBest>=50;}},
  {id:'a10_endure_100',name:'&#51648;&#44396;&#47141; 100',icon:'&#128293;',desc:'&#51648;&#44396;&#47141; &#53580;&#49828;&#53944; 100&#54924; &#45804;&#49457;',check:function(){return v10.enduranceBest>=100;}},
  {id:'a10_quiz_v10',name:'&#48373;&#49905; &#48149;&#49324;',icon:'&#127891;',desc:'v10 &#53300;&#51592; 12&#47928;&#51228; &#51060;&#49345; &#51221;&#45813;',check:function(){return q10Correct >= 12;}},
  {id:'a10_calendar',name:'&#44228;&#54925; &#49688;&#47549;&#44032;',icon:'&#128197;',desc:'&#54984;&#47144; &#44228;&#54925; 5&#44060; &#51060;&#49345; &#46321;&#47197;',check:function(){return Object.keys(v10.calendarPlans).length>=5;}},
  {id:'a10_allrounder',name:'&#50732;&#46972;&#50868;&#45908;',icon:'&#128081;',desc:'&#47784;&#46304; v10 &#44592;&#45733; &#49324;&#50857; (&#49828;&#54028;&#47553;+&#53440;&#51060;&#47672;+&#52404;&#51473;+&#53580;&#53356;&#45769;+&#53300;&#51592;+&#51648;&#44396;&#47141;)',check:function(){return v10.sparringSessions.length>0 && v10.bodyStats.length>0 && Object.keys(v10.techniqueRead).length>0 && v10.enduranceBest>0;}}
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
  html += '<div style="text-align:center;margin-top:10px;font-size:12px;color:var(--text-dim)">v10 &#50629;&#51201;: '+unlocked+' / '+ACHV10.length+' &#45804;&#49457;</div>';
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
  sparSec.innerHTML = '<h2 class="section-title"><span class="emoji">&#9876;&#65039;</span> &#49828;&#54028;&#47553; &#49884;&#48044;&#47112;&#51060;&#49496;</h2><div class="card"><div id="v10Sparring"></div></div>';
  allSections[0].parentNode.insertBefore(sparSec, allSections[1]);

  var timerSec = document.createElement('section');
  timerSec.className = 'section v10-section';
  timerSec.innerHTML = '<h2 class="section-title"><span class="emoji">&#9201;</span> &#46972;&#50868;&#46300; &#53440;&#51060;&#47672;</h2><div class="card"><div id="v10Timer"></div></div>';

  var comboSec = document.createElement('section');
  comboSec.className = 'section v10-section';
  comboSec.innerHTML = '<h2 class="section-title"><span class="emoji">&#128165;</span> &#53092;&#48372; &#48177;&#44284;&#49324;&#51204; (20&#51333;)</h2><div id="v10Combos"></div>';

  var calSec = document.createElement('section');
  calSec.className = 'section v10-section';
  calSec.innerHTML = '<h2 class="section-title"><span class="emoji">&#128197;</span> &#54984;&#47144; &#52868;&#47536;&#45908;</h2><div class="card"><div id="v10Calendar"></div></div>';

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
  bodySec.innerHTML = '<h2 class="section-title"><span class="emoji">&#128200;</span> &#48148;&#46356; &#49828;&#53455; &#53944;&#47000;&#52964;</h2><div class="card"><div id="v10BodyStats"></div></div>';

  var techSec = document.createElement('section');
  techSec.className = 'section v10-section';
  techSec.innerHTML = '<h2 class="section-title"><span class="emoji">&#128218;</span> &#53580;&#53356;&#45769; &#53916;&#53664;&#47532;&#50620; (12&#51333;)</h2><div id="v10Techniques"></div>';

  var challengeSec = document.createElement('section');
  challengeSec.className = 'section v10-section';
  challengeSec.innerHTML = '<h2 class="section-title"><span class="emoji">&#127942;</span> &#51452;&#44036; &#52268;&#47536;&#51648;</h2><div class="card"><div id="v10Challenges"></div></div>';

  var enduranceSec = document.createElement('section');
  enduranceSec.className = 'section v10-section';
  enduranceSec.innerHTML = '<h2 class="section-title"><span class="emoji">&#128293;</span> &#51648;&#44396;&#47141; &#53580;&#49828;&#53944;</h2><div class="card"><div id="v10Endurance"></div></div>';

  var quizSec = document.createElement('section');
  quizSec.className = 'section v10-section';
  quizSec.innerHTML = '<h2 class="section-title"><span class="emoji">&#129504;</span> &#48373;&#49905; &#49900;&#54868; &#53300;&#51592; (+15)</h2><div class="card"><div id="v10Quiz"></div></div>';

  var achSec = document.createElement('section');
  achSec.className = 'section v10-section';
  achSec.innerHTML = '<h2 class="section-title"><span class="emoji">&#127941;</span> v10 &#50629;&#51201; (+12)</h2><div class="card"><div id="v10Achievements"></div></div>';

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
