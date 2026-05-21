// Boxing Trainer Pro v9_patch.js - NEXTERA+PRISM Auto Enhancement Module
// AI Training Advisor, Recovery Cooldown, Intensity Chart, Punch Speed Grade,
// Hydration Tracker, Boxing Quiz 15Q, Progress Milestones, Workout Templates,
// +10 Achievements (24->34), SFX 6, Keyboard Shortcuts +5
(function(){
'use strict';

var STORAGE_KEY = 'boxingTrainerData';
var V9KEY = 'boxingV9Patch';

function loadAppData(){
  try { var r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch(e){ return null; }
}
function loadV9(){
  try {
    var r = localStorage.getItem(V9KEY);
    if(!r) return defV9();
    var p = JSON.parse(r), d = defV9();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV9(); }
}
function saveV9(d){ try { localStorage.setItem(V9KEY, JSON.stringify(d)); } catch(e){} }
function defV9(){
  return {
    hydration: {},
    quizScores: {},
    cooldownDone: {},
    advisorViewed: {},
    customTemplates: [],
    milestones: {}
  };
}

var v9 = loadV9();

// ===== SFX ENGINE =====
function playSFX(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'quiz_correct':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(523,t);o.frequency.linearRampToValueAtTime(784,t+0.15);
        g.gain.setValueAtTime(0.2,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.3);break;
      case 'quiz_wrong':
        var o2=ctx.createOscillator(),g2=ctx.createGain();
        o2.type='sawtooth';o2.frequency.setValueAtTime(200,t);o2.frequency.linearRampToValueAtTime(100,t+0.25);
        g2.gain.setValueAtTime(0.15,t);g2.gain.exponentialRampToValueAtTime(0.001,t+0.3);
        o2.connect(g2).connect(ctx.destination);o2.start(t);o2.stop(t+0.3);break;
      case 'hydration':
        [660,880,1100].forEach(function(f,i){
          var o3=ctx.createOscillator(),g3=ctx.createGain();
          o3.type='sine';o3.frequency.value=f;
          g3.gain.setValueAtTime(0.1,t+i*0.08);g3.gain.exponentialRampToValueAtTime(0.001,t+i*0.08+0.15);
          o3.connect(g3).connect(ctx.destination);o3.start(t+i*0.08);o3.stop(t+i*0.08+0.15);
        });break;
      case 'cooldown':
        var o4=ctx.createOscillator(),g4=ctx.createGain();
        o4.type='triangle';o4.frequency.setValueAtTime(440,t);o4.frequency.linearRampToValueAtTime(330,t+0.5);
        g4.gain.setValueAtTime(0.12,t);g4.gain.exponentialRampToValueAtTime(0.001,t+0.6);
        o4.connect(g4).connect(ctx.destination);o4.start(t);o4.stop(t+0.6);break;
      case 'advisor':
        [392,494,587].forEach(function(f,i){
          var o5=ctx.createOscillator(),g5=ctx.createGain();
          o5.type='sine';o5.frequency.value=f;
          g5.gain.setValueAtTime(0.12,t+i*0.12);g5.gain.exponentialRampToValueAtTime(0.001,t+i*0.12+0.2);
          o5.connect(g5).connect(ctx.destination);o5.start(t+i*0.12);o5.stop(t+i*0.12+0.2);
        });break;
      case 'milestone':
        [523,659,784,1047].forEach(function(f,i){
          var o6=ctx.createOscillator(),g6=ctx.createGain();
          o6.type='sine';o6.frequency.value=f;
          g6.gain.setValueAtTime(0.15,t+i*0.1);g6.gain.exponentialRampToValueAtTime(0.001,t+i*0.1+0.3);
          o6.connect(g6).connect(ctx.destination);o6.start(t+i*0.1);o6.stop(t+i*0.1+0.3);
        });break;
    }
  } catch(e){}
}

// ===== CSS =====
function injectV9CSS(){
  var s = document.createElement('style');
  s.textContent = '\
.v9-section{margin:24px 0;animation:slideUp 0.5s ease-out both}\
.advisor-card{background:linear-gradient(135deg,rgba(59,130,246,0.12),rgba(168,85,247,0.08));\
border:1px solid rgba(59,130,246,0.2);border-radius:var(--radius);padding:20px;position:relative}\
.advisor-header{display:flex;align-items:center;gap:10px;margin-bottom:14px}\
.advisor-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--purple));\
display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}\
.advisor-name{font-size:16px;font-weight:800}\
.advisor-role{font-size:11px;color:var(--text-muted)}\
.advisor-tips{display:flex;flex-direction:column;gap:10px}\
.advisor-tip{display:flex;align-items:flex-start;gap:10px;padding:12px;\
background:rgba(255,255,255,0.03);border:1px solid var(--glass-border);\
border-radius:12px;font-size:12px;color:var(--text-dim);line-height:1.6}\
.advisor-tip-icon{font-size:18px;flex-shrink:0;margin-top:1px}\
.advisor-tip-priority{font-size:9px;padding:2px 8px;border-radius:10px;\
font-weight:700;text-transform:uppercase;letter-spacing:0.5px;flex-shrink:0}\
.advisor-tip-priority.high{background:rgba(255,68,68,0.15);color:var(--accent)}\
.advisor-tip-priority.medium{background:rgba(249,115,22,0.15);color:var(--orange)}\
.advisor-tip-priority.low{background:rgba(34,197,94,0.15);color:var(--green)}\
.cooldown-container{display:flex;flex-direction:column;gap:10px}\
.cooldown-step{display:flex;align-items:center;gap:12px;padding:12px 14px;\
background:var(--surface);border:1px solid var(--glass-border);\
border-radius:12px;transition:all 0.3s;cursor:pointer}\
.cooldown-step:hover{border-color:var(--blue)}\
.cooldown-step.active{border-color:var(--green);background:rgba(34,197,94,0.06)}\
.cooldown-step.done{opacity:0.5}\
.cooldown-num{width:28px;height:28px;border-radius:50%;\
background:var(--glass);border:1px solid var(--glass-border);\
display:flex;align-items:center;justify-content:center;\
font-size:12px;font-weight:700;color:var(--text-dim);flex-shrink:0}\
.cooldown-step.active .cooldown-num{background:var(--green);border-color:var(--green);color:#fff}\
.cooldown-step.done .cooldown-num{background:var(--blue);border-color:var(--blue);color:#fff}\
.cooldown-info{flex:1}\
.cooldown-name{font-size:13px;font-weight:700}\
.cooldown-desc{font-size:11px;color:var(--text-dim);margin-top:2px}\
.cooldown-dur{font-size:11px;color:var(--text-muted);font-weight:600;flex-shrink:0}\
.cooldown-timer{text-align:center;padding:16px;\
background:var(--glass);border:1px solid var(--glass-border);\
border-radius:var(--radius);margin-top:10px}\
.cooldown-time-big{font-size:48px;font-weight:900;color:var(--blue);font-variant-numeric:tabular-nums}\
.cooldown-phase{font-size:13px;color:var(--text-dim);margin-top:4px}\
.cooldown-btns{display:flex;gap:8px;justify-content:center;margin-top:10px}\
.cooldown-btn{padding:10px 24px;border:none;border-radius:10px;font-size:14px;\
font-weight:700;cursor:pointer;transition:all 0.2s}\
.cooldown-btn.primary{background:var(--blue);color:#fff}\
.cooldown-btn.primary:hover{filter:brightness(1.1)}\
.cooldown-btn.secondary{background:var(--glass);color:var(--text-dim);\
border:1px solid var(--glass-border)}\
.cooldown-btn.secondary:hover{border-color:var(--blue);color:var(--blue)}\
.intensity-canvas{width:100%;height:160px;border-radius:12px}\
.speed-grade-wrap{display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap}\
.speed-ring{width:140px;height:140px;position:relative}\
.speed-ring svg{transform:rotate(-90deg)}\
.speed-ring-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}\
.speed-grade-letter{font-size:42px;font-weight:900}\
.speed-grade-label{font-size:10px;color:var(--text-dim)}\
.speed-stats{display:flex;flex-direction:column;gap:8px}\
.speed-stat{font-size:12px;color:var(--text-dim);display:flex;align-items:center;gap:6px}\
.speed-stat-val{font-size:16px;font-weight:800;color:var(--text)}\
.hydration-wrap{display:flex;align-items:center;gap:20px;flex-wrap:wrap;justify-content:center}\
.hydration-bottles{display:flex;gap:6px;flex-wrap:wrap}\
.hydration-bottle{width:36px;height:52px;border-radius:4px 4px 8px 8px;cursor:pointer;\
background:var(--surface);border:2px solid var(--glass-border);position:relative;\
transition:all 0.2s;display:flex;align-items:flex-end;justify-content:center;overflow:hidden}\
.hydration-bottle:hover{border-color:var(--blue);transform:scale(1.1)}\
.hydration-bottle.filled{border-color:var(--blue)}\
.hydration-fill{width:100%;background:linear-gradient(to top,rgba(59,130,246,0.6),rgba(59,130,246,0.3));\
border-radius:0 0 6px 6px;transition:height 0.3s}\
.hydration-info{text-align:center}\
.hydration-count{font-size:32px;font-weight:900;color:var(--blue)}\
.hydration-label{font-size:11px;color:var(--text-dim)}\
.hydration-target{font-size:10px;color:var(--text-muted);margin-top:4px}\
.quiz-container{max-width:500px;margin:0 auto}\
.quiz-question{font-size:15px;font-weight:700;margin-bottom:14px;line-height:1.6}\
.quiz-q-num{font-size:11px;color:var(--text-muted);margin-bottom:6px}\
.quiz-options{display:flex;flex-direction:column;gap:8px}\
.quiz-option{padding:12px 16px;background:var(--surface);border:1px solid var(--glass-border);\
border-radius:12px;cursor:pointer;font-size:13px;color:var(--text-dim);transition:all 0.2s}\
.quiz-option:hover{border-color:var(--accent);color:var(--text)}\
.quiz-option.correct{border-color:var(--green);background:rgba(34,197,94,0.1);color:var(--green)}\
.quiz-option.wrong{border-color:var(--accent);background:rgba(255,68,68,0.1);color:var(--accent)}\
.quiz-option.disabled{pointer-events:none;opacity:0.6}\
.quiz-explanation{margin-top:10px;padding:10px;background:rgba(255,215,0,0.05);\
border:1px solid rgba(255,215,0,0.15);border-radius:10px;\
font-size:11px;color:var(--text-dim);line-height:1.5;display:none}\
.quiz-explanation.show{display:block}\
.quiz-nav{display:flex;gap:8px;justify-content:center;margin-top:14px}\
.quiz-nav-btn{padding:8px 20px;border:none;border-radius:8px;font-size:13px;\
font-weight:700;cursor:pointer;transition:all 0.2s}\
.quiz-nav-btn.primary{background:var(--accent);color:#fff}\
.quiz-nav-btn.primary:hover{filter:brightness(1.1)}\
.quiz-result{text-align:center;padding:20px}\
.quiz-score-big{font-size:48px;font-weight:900;color:var(--accent)}\
.quiz-score-label{font-size:14px;color:var(--text-dim);margin-top:4px}\
.quiz-grade{font-size:20px;font-weight:800;margin-top:8px}\
.milestone-track{display:flex;align-items:center;gap:0;overflow-x:auto;padding:10px 0}\
.milestone-node{display:flex;flex-direction:column;align-items:center;min-width:70px;position:relative}\
.milestone-dot{width:28px;height:28px;border-radius:50%;border:2px solid var(--glass-border);\
background:var(--surface);display:flex;align-items:center;justify-content:center;\
font-size:14px;z-index:1;transition:all 0.3s}\
.milestone-node.reached .milestone-dot{border-color:var(--gold);background:rgba(255,215,0,0.15)}\
.milestone-label{font-size:8px;color:var(--text-muted);margin-top:4px;text-align:center;max-width:60px}\
.milestone-line{width:100%;height:2px;background:var(--glass-border);margin-top:-14px;position:relative}\
.milestone-line-fill{height:100%;background:var(--gold);transition:width 0.6s ease-out}\
.template-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}\
.template-card{padding:14px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:14px;text-align:center;cursor:pointer;transition:all 0.3s;text-decoration:none;color:var(--text);display:block}\
.template-card:hover{border-color:var(--accent);transform:translateY(-2px)}\
.template-icon{font-size:28px;margin-bottom:6px}\
.template-name{font-size:13px;font-weight:800;margin-bottom:2px}\
.template-meta{font-size:10px;color:var(--text-dim)}\
.template-diff{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-top:4px}\
@media(max-width:768px){\
  .speed-grade-wrap{flex-direction:column}\
  .hydration-wrap{flex-direction:column}\
  .milestone-track{padding:10px 4px}\
  .template-grid{grid-template-columns:repeat(2,1fr)}\
}';
  document.head.appendChild(s);
}

// ===== AI TRAINING ADVISOR =====
function generateAdvice(){
  var app = loadAppData();
  if(!app) return [{icon:'🎯',text:'첫 훈련을 시작해보세요! 초급 프로그램부터 시작하는 것을 추천합니다.',priority:'high'}];
  var tips = [];
  var sessions = app.sessions || [];
  var totalP = app.totalPunches || 0;
  var streak = app.streak || 0;
  var pt = app.punchTypes || {jab:0,cross:0,hook:0,uppercut:0};
  var totalPT = pt.jab+pt.cross+pt.hook+pt.uppercut;

  if(sessions.length === 0) return [{icon:'🎯',text:'첫 훈련을 시작해보세요! 초급 프로그램부터 시작하는 것을 추천합니다.',priority:'high'}];

  var todayStr = new Date().toDateString();
  var todaySessions = sessions.filter(function(s){ return new Date(s.date).toDateString() === todayStr; });
  if(todaySessions.length === 0){
    tips.push({icon:'⏰',text:'오늘 아직 훈련하지 않았습니다. ' + (streak > 0 ? streak+'일 연속 기록을 이어가세요!' : '오늘 첫 훈련을 시작해보세요!'),priority:'high'});
  }

  if(totalPT > 0){
    var jabPct = pt.jab/totalPT, crossPct = pt.cross/totalPT, hookPct = pt.hook/totalPT, upperPct = pt.uppercut/totalPT;
    if(hookPct < 0.15) tips.push({icon:'💪',text:'훅 비율이 '+(hookPct*100).toFixed(0)+'%로 낮습니다. 훅은 근거리 파워 펀치의 핵심입니다. 훅 연습을 더 해보세요.',priority:'medium'});
    if(upperPct < 0.1) tips.push({icon:'🔥',text:'어퍼컷 비율이 '+(upperPct*100).toFixed(0)+'%입니다. 어퍼컷은 근접전에서 강력한 무기입니다. 연습량을 늘려보세요.',priority:'medium'});
    if(jabPct > 0.5) tips.push({icon:'🥊',text:'잡 비율이 '+(jabPct*100).toFixed(0)+'%로 높습니다. 다양한 펀치를 섞어 콤보 능력을 키워보세요.',priority:'low'});
  }

  var recentSessions = sessions.slice(0,7);
  var avgDur = recentSessions.reduce(function(s,x){return s+(x.duration||0);},0) / recentSessions.length;
  if(avgDur < 5) tips.push({icon:'⏱️',text:'최근 평균 훈련 시간이 '+avgDur.toFixed(1)+'분입니다. 최소 10분 이상 훈련하면 효과가 높아집니다.',priority:'medium'});
  if(avgDur > 20) tips.push({icon:'🏆',text:'평균 '+avgDur.toFixed(1)+'분 훈련하고 있습니다! 훌륭합니다. 인터벌 방식으로 강도를 높여보세요.',priority:'low'});

  var avgPPM = recentSessions.length > 0 ? recentSessions.reduce(function(s,x){
    return s + ((x.punches||0) / Math.max(x.duration||1, 1));
  },0) / recentSessions.length : 0;
  if(avgPPM < 20) tips.push({icon:'⚡',text:'펀치 속도('+avgPPM.toFixed(0)+' PPM)를 높여보세요. 목표는 분당 30회 이상입니다.',priority:'medium'});

  if(streak >= 7) tips.push({icon:'🔥',text:streak+'일 연속 훈련 중! 대단합니다. 주 1~2일은 가벼운 섀도우복싱으로 회복하세요.',priority:'low'});
  if(totalP > 5000 && totalP < 10000) tips.push({icon:'🎯',text:'총 '+totalP+'펀치 달성! 10,000펀치 레전드 업적까지 '+(10000-totalP)+'펀치 남았습니다.',priority:'low'});

  if(tips.length === 0) tips.push({icon:'✅',text:'모든 훈련 지표가 양호합니다! 현재 페이스를 유지하세요.',priority:'low'});
  return tips.slice(0,4);
}

function renderAdvisor(){
  var el = document.getElementById('v9Advisor');
  if(!el) return;
  var tips = generateAdvice();
  var todayKey = new Date().toISOString().slice(0,10);
  v9.advisorViewed[todayKey] = true; saveV9(v9);
  var html = '<div class="advisor-card"><div class="advisor-header"><div class="advisor-avatar">🤖</div><div><div class="advisor-name">AI 코치</div><div class="advisor-role">개인 맞춤 훈련 분석</div></div></div><div class="advisor-tips">';
  tips.forEach(function(t){
    html += '<div class="advisor-tip"><span class="advisor-tip-icon">'+t.icon+'</span><span style="flex:1">'+t.text+'</span><span class="advisor-tip-priority '+t.priority+'">'+(t.priority==='high'?'중요':t.priority==='medium'?'권장':'참고')+'</span></div>';
  });
  el.innerHTML = html + '</div></div>';
  playSFX('advisor');
}

// ===== RECOVERY COOLDOWN =====
var COOLDOWN_STEPS = [
  {name:'심호흡',desc:'코로 4초 들이쉬고 입으로 6초 내쉬기',dur:40},
  {name:'목 스트레칭',desc:'좌우 앞뒤로 천천히 돌리기',dur:30},
  {name:'어깨 이완',desc:'양팔을 뒤로 교차해 당기기',dur:30},
  {name:'팔 스트레칭',desc:'한 팔을 가슴으로 당겨 20초씩',dur:40},
  {name:'허리 회전',desc:'양손을 허리에 놓고 천천히 회전',dur:30},
  {name:'종아리 스트레칭',desc:'벽을 짚고 종아리 늘리기',dur:30}
];

var cdTimerId = null, cdStep = 0, cdTimeLeft = 0, cdRunning = false;

function renderCooldown(){
  var el = document.getElementById('v9Cooldown');
  if(!el) return;
  var html = '<div class="cooldown-container">';
  COOLDOWN_STEPS.forEach(function(step,i){
    var cls = 'cooldown-step';
    if(i === cdStep && cdRunning) cls += ' active';
    if(i < cdStep && cdRunning) cls += ' done';
    html += '<div class="'+cls+'"><div class="cooldown-num">'+(i<cdStep&&cdRunning?'&#10003;':(i+1))+'</div><div class="cooldown-info"><div class="cooldown-name">'+step.name+'</div><div class="cooldown-desc">'+step.desc+'</div></div><div class="cooldown-dur">'+step.dur+'&#52488;</div></div>';
  });
  html += '</div><div class="cooldown-timer">';
  if(cdRunning){
    html += '<div class="cooldown-time-big">'+fmtTime(cdTimeLeft)+'</div>';
    html += '<div class="cooldown-phase">'+COOLDOWN_STEPS[cdStep].name+'</div>';
  } else {
    var totalSec = COOLDOWN_STEPS.reduce(function(s,x){return s+x.dur;},0);
    html += '<div class="cooldown-time-big" style="font-size:28px;color:var(--text-dim)">'+Math.ceil(totalSec/60)+'&#48516; &#53216;&#45796;&#50868;</div>';
    html += '<div class="cooldown-phase">&#54984;&#47144; &#54980; &#49828;&#53944;&#47112;&#52845;&#51004;&#47196; &#44540;&#50977; &#54924;&#48373;&#51012; &#46020;&#50752;&#51452;&#49464;&#50836;</div>';
  }
  html += '</div><div class="cooldown-btns">';
  if(!cdRunning){
    html += '<button class="cooldown-btn primary" id="cdStart">&#9654; &#53216;&#45796;&#50868; &#49884;&#51089;</button>';
  } else {
    html += '<button class="cooldown-btn secondary" id="cdStop">&#9632; &#51473;&#51648;</button>';
    html += '<button class="cooldown-btn secondary" id="cdSkip">&#9193; &#44148;&#45320;&#46888;&#44592;</button>';
  }
  html += '</div>';
  el.innerHTML = html;
  if(!cdRunning){
    var b = document.getElementById('cdStart'); if(b) b.addEventListener('click',startCooldown);
  } else {
    var b2 = document.getElementById('cdStop'); if(b2) b2.addEventListener('click',stopCooldown);
    var b3 = document.getElementById('cdSkip'); if(b3) b3.addEventListener('click',skipCooldownStep);
  }
}
function fmtTime(sec){ var m=Math.floor(sec/60),s=sec%60; return (m<10?'0':'')+m+':'+(s<10?'0':'')+s; }
function startCooldown(){ cdStep=0;cdTimeLeft=COOLDOWN_STEPS[0].dur;cdRunning=true;renderCooldown();cdTimerId=setInterval(tickCooldown,1000);playSFX('cooldown'); }
function tickCooldown(){ cdTimeLeft--;if(cdTimeLeft<=0){cdStep++;if(cdStep>=COOLDOWN_STEPS.length){stopCooldown();playSFX('milestone');var k=new Date().toISOString().slice(0,10);v9.cooldownDone[k]=true;saveV9(v9);toastV9('&#10024; &#53216;&#45796;&#50868; &#50756;&#47308;! &#44540;&#50977;&#51060; &#48736;&#47476;&#44172; &#54924;&#48373;&#46121;&#45768;&#45796;.');return;}cdTimeLeft=COOLDOWN_STEPS[cdStep].dur;playSFX('cooldown');}renderCooldown(); }
function stopCooldown(){ cdRunning=false;cdStep=0;if(cdTimerId){clearInterval(cdTimerId);cdTimerId=null;}renderCooldown(); }
function skipCooldownStep(){ cdStep++;if(cdStep>=COOLDOWN_STEPS.length){stopCooldown();playSFX('milestone');return;}cdTimeLeft=COOLDOWN_STEPS[cdStep].dur;playSFX('cooldown');renderCooldown(); }

// ===== TRAINING INTENSITY CHART (Canvas) =====
function renderIntensityChart(){
  var el = document.getElementById('v9IntensityCanvas');
  if(!el) return;
  var canvas = document.createElement('canvas');
  canvas.width = 600; canvas.height = 160;
  canvas.className = 'intensity-canvas';
  canvas.style.width = '100%';
  canvas.style.height = '160px';
  el.innerHTML = '';
  el.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var app = loadAppData();
  var data = [];
  for(var i=6;i>=0;i--){
    var d = new Date(); d.setDate(d.getDate()-i);
    var ds = d.toDateString();
    var ss = (app&&app.sessions||[]).filter(function(s){return new Date(s.date).toDateString()===ds;});
    var punches = ss.reduce(function(s,x){return s+(x.punches||0);},0);
    var dur = ss.reduce(function(s,x){return s+(x.duration||0);},0);
    var intensity = Math.min(Math.round(punches*0.3 + dur*5), 100);
    data.push({label:(d.getMonth()+1)+'/'+d.getDate(), value:intensity});
  }
  var maxVal = Math.max.apply(null,data.map(function(x){return x.value;}).concat([10]));
  var padL=40,padR=20,padT=20,padB=30;
  var chartW=canvas.width-padL-padR, chartH=canvas.height-padT-padB;

  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#0f0a1e';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for(var g=0;g<=4;g++){
    var gy = padT + chartH - (g/4)*chartH;
    ctx.beginPath();ctx.moveTo(padL,gy);ctx.lineTo(padL+chartW,gy);ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '9px -apple-system,sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxVal*g/4),padL-6,gy+3);
  }

  var grad = ctx.createLinearGradient(0,padT,0,padT+chartH);
  grad.addColorStop(0,'rgba(255,68,68,0.3)'); grad.addColorStop(1,'rgba(255,68,68,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(padL,padT+chartH);
  data.forEach(function(pt,idx){
    var x=padL+idx*(chartW/(data.length-1));
    var y=padT+chartH-(pt.value/maxVal)*chartH;
    if(idx===0) ctx.lineTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.lineTo(padL+(data.length-1)*(chartW/(data.length-1)),padT+chartH);
  ctx.closePath();ctx.fill();

  ctx.strokeStyle = '#FF4444'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
  ctx.beginPath();
  data.forEach(function(pt,idx){
    var x=padL+idx*(chartW/(data.length-1));
    var y=padT+chartH-(pt.value/maxVal)*chartH;
    if(idx===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();

  data.forEach(function(pt,idx){
    var x=padL+idx*(chartW/(data.length-1));
    var y=padT+chartH-(pt.value/maxVal)*chartH;
    ctx.fillStyle = '#0f0a1e'; ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#FF4444'; ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '9px -apple-system,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(pt.label,x,padT+chartH+14);
    if(pt.value > 0){ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fillText(pt.value,x,y-8);}
  });
}

// ===== PUNCH SPEED GRADE =====
function renderSpeedGrade(){
  var el = document.getElementById('v9SpeedGrade');
  if(!el) return;
  var app = loadAppData();
  var sessions = (app&&app.sessions)||[];
  var recentPPM = [];
  sessions.slice(0,10).forEach(function(s){
    if(s.duration && s.duration > 0) recentPPM.push(s.punches / s.duration);
  });
  var avgPPM = recentPPM.length > 0 ? recentPPM.reduce(function(a,b){return a+b;},0)/recentPPM.length : 0;
  var bestPPM = recentPPM.length > 0 ? Math.max.apply(null,recentPPM) : 0;
  var grade, color, pct;
  if(avgPPM >= 60){grade='S';color='#FFD700';pct=100;}
  else if(avgPPM >= 45){grade='A';color='#22c55e';pct=90;}
  else if(avgPPM >= 30){grade='B';color='#3b82f6';pct=75;}
  else if(avgPPM >= 20){grade='C';color='#f97316';pct=55;}
  else if(avgPPM >= 10){grade='D';color='#a855f7';pct=35;}
  else {grade='F';color='#FF4444';pct=10;}

  var circ = 2*Math.PI*55;
  var offset = circ*(1-pct/100);
  el.innerHTML = '<div class="speed-grade-wrap"><div class="speed-ring"><svg width="140" height="140" viewBox="0 0 140 140"><circle cx="70" cy="70" r="55" fill="none" stroke="var(--glass-border)" stroke-width="14"/><circle cx="70" cy="70" r="55" fill="none" stroke="'+color+'" stroke-width="14" stroke-dasharray="'+circ+'" stroke-dashoffset="'+offset+'" stroke-linecap="round"/></svg><div class="speed-ring-text"><div class="speed-grade-letter" style="color:'+color+'">'+grade+'</div><div class="speed-grade-label">&#46321;&#44553;</div></div></div><div class="speed-stats"><div class="speed-stat">&#128200; &#54217;&#44512; PPM <span class="speed-stat-val">'+avgPPM.toFixed(1)+'</span></div><div class="speed-stat">&#9889; &#52572;&#44256; PPM <span class="speed-stat-val">'+bestPPM.toFixed(1)+'</span></div><div class="speed-stat">&#128202; &#49464;&#49496; &#49688; <span class="speed-stat-val">'+sessions.length+'</span></div><div class="speed-stat" style="font-size:10px;color:var(--text-muted)">S:60+ A:45+ B:30+ C:20+ D:10+</div></div></div>';
}

// ===== HYDRATION TRACKER =====
function getHydrationToday(){
  var k = new Date().toISOString().slice(0,10);
  return (v9.hydration && v9.hydration[k]) || 0;
}
function setHydrationToday(n){
  var k = new Date().toISOString().slice(0,10);
  if(!v9.hydration) v9.hydration = {};
  v9.hydration[k] = n;
  saveV9(v9);
}

function renderHydration(){
  var el = document.getElementById('v9Hydration');
  if(!el) return;
  var count = getHydrationToday();
  var target = 8;
  var html = '<div class="hydration-wrap"><div class="hydration-bottles">';
  for(var i=0;i<target;i++){
    var filled = i < count;
    html += '<div class="hydration-bottle'+(filled?' filled':'')+'" data-idx="'+i+'"><div class="hydration-fill" style="height:'+(filled?'100':'0')+'%"></div></div>';
  }
  html += '</div><div class="hydration-info"><div class="hydration-count">'+count+' / '+target+'</div><div class="hydration-label">&#52981; (250ml)</div><div class="hydration-target">&#47785;&#54364;: '+(target*250)+'ml</div></div></div>';
  el.innerHTML = html;
  el.querySelectorAll('.hydration-bottle').forEach(function(bottle){
    bottle.addEventListener('click',function(){
      var idx = parseInt(this.getAttribute('data-idx'));
      var cur = getHydrationToday();
      if(idx+1 === cur) setHydrationToday(idx);
      else setHydrationToday(idx+1);
      playSFX('hydration');
      renderHydration();
    });
  });
}

// ===== BOXING KNOWLEDGE QUIZ =====
var QUIZ = [
  {q:'&#48373;&#49905;&#50640;&#49436; &#51105;(Jab)&#51012; &#45216;&#47532;&#45716; &#49552;&#51008;?',opts:['&#50526;&#49552;','&#46263;&#49552;','&#50577;&#49552; &#46041;&#49884;','&#44288;&#44228;&#50630;&#51020;'],ans:0,exp:'&#51105;&#51008; &#54637;&#49345; &#50526;&#49552;(&#47532;&#46300; &#54620;&#46300;)&#47196; &#45216;&#47549;&#45768;&#45796;. &#44032;&#51109; &#44592;&#48376;&#51201;&#51060;&#44256; &#48736;&#47480; &#54144;&#52824;&#51077;&#45768;&#45796;.'},
  {q:'&#54532;&#47196;&#48373;&#49905; &#54620; &#46972;&#50868;&#46300;&#45716; &#47751; &#48516;&#51064;&#44032;?',opts:['2&#48516;','3&#48516;','5&#48516;','4&#48516;'],ans:1,exp:'&#54532;&#47196;&#48373;&#49905;&#51032; 1&#46972;&#50868;&#46300;&#45716; 3&#48516;&#51060;&#47728;, &#46972;&#50868;&#46300; &#49324;&#51060; 1&#48516; &#55092;&#49885;&#51060; &#51080;&#49845;&#45768;&#45796;.'},
  {q:'&#53356;&#47196;&#49828;(Cross)&#51032; &#54028;&#50892;&#45716; &#50612;&#46356;&#50640;&#49436; &#45208;&#50724;&#45716;&#44032;?',opts:['&#54036;','&#50612;&#44648;','&#50628;&#45929;&#51060; &#54924;&#51204;','&#49552;&#47785;'],ans:2,exp:'&#53356;&#47196;&#49828;&#51032; &#54028;&#50892;&#45716; &#48156;&#50640;&#49436; &#49884;&#51089;&#54644; &#50628;&#45929;&#51060; &#54924;&#51204;&#51012; &#53685;&#54644; &#51204;&#45804;&#46121;&#45768;&#45796;.'},
  {q:'&#48373;&#49905; &#44544;&#47084;&#48652;&#51032; &#47924;&#44172;&#45716; &#48372;&#53685; &#47751; &#50728;&#49828;&#51064;&#44032;?',opts:['4-6oz','8-10oz','12-16oz','18-20oz'],ans:1,exp:'&#54532;&#47196; &#48373;&#49905; &#44544;&#47084;&#48652;&#45716; &#48372;&#53685; 8-10oz(227-283g)&#51060;&#47728;, &#54984;&#47144;&#50857;&#51008; 12-16oz&#47484; &#49324;&#50857;&#54633;&#45768;&#45796;.'},
  {q:'Muhammad Ali&#51032; &#48324;&#47749;&#51008;?',opts:['Iron Mike','The Greatest','Sugar Ray','The Hitman'],ans:1,exp:'Muhammad Ali&#45716; &ldquo;The Greatest&rdquo;&#46972;&#45716; &#48324;&#47749;&#51004;&#47196; &#50976;&#47749;&#54620; &#51204;&#49444;&#51201;&#51064; &#54756;&#48708;&#44553; &#48373;&#49436;&#51077;&#45768;&#45796;.'},
  {q:'&#49836;&#47549;(Slip)&#51008; &#50612;&#46500; &#44592;&#49696;&#51064;&#44032;?',opts:['&#44277;&#44201; &#44592;&#49696;','&#54924;&#54588; &#44592;&#49696;','&#48156;&#45459;&#47548; &#44592;&#49696;','&#44536;&#47549;&#52824; &#44592;&#49696;'],ans:1,exp:'&#49836;&#47549;&#51008; &#49345;&#52404;&#47484; &#51340;&#50864;&#47196; &#44592;&#50872;&#50668; &#49345;&#45824;&#51032; &#54144;&#52824;&#47484; &#54588;&#54616;&#45716; &#48169;&#50612; &#44592;&#49696;&#51077;&#45768;&#45796;.'},
  {q:'1-2 &#53092;&#48372;&#45716; &#50612;&#46500; &#54144;&#52824;&#51032; &#51312;&#54633;&#51064;&#44032;?',opts:['&#51105;-&#54985;','&#51105;-&#53356;&#47196;&#49828;','&#53356;&#47196;&#49828;-&#54985;','&#50612;&#54140;&#52983;-&#51105;'],ans:1,exp:'1-2&#45716; &#51105;(1)&#44284; &#53356;&#47196;&#49828;(2)&#51032; &#44592;&#48376; &#53092;&#48372;&#47196;, &#47784;&#46304; &#48373;&#49436;&#51032; &#54596;&#49688; &#44592;&#49696;&#51077;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#44032;&#46300;(Guard)&#51032; &#50669;&#54624;&#51008;?',opts:['&#44277;&#44201;','&#48169;&#50612;','&#51060;&#46041;','&#54168;&#51060;&#53944;'],ans:1,exp:'&#44032;&#46300;&#45716; &#50577;&#49552;&#51004;&#47196; &#50620;&#44404;&#44284; &#47800;&#53685;&#51012; &#48372;&#54840;&#54616;&#45716; &#48169;&#50612; &#51088;&#49464;&#51077;&#45768;&#45796;.'},
  {q:'&#54984;&#47144; &#51204; &#50892;&#48141;&#50629;&#51060; &#51473;&#50836;&#54620; &#51060;&#50976;&#45716;?',opts:['&#44540;&#47141; &#51613;&#44032;','&#48512;&#49345; &#50696;&#48169;','&#52404;&#51473; &#44048;&#47049;','&#49549;&#46020; &#54693;&#49345;'],ans:1,exp:'&#50892;&#48141;&#50629;&#51008; &#44540;&#50977;&#44284; &#44288;&#51208;&#51012; &#46384;&#46907;&#54616;&#44172; &#54644; &#48512;&#49345;&#51012; &#50696;&#48169;&#54616;&#45716; &#45936; &#54596;&#49688;&#51077;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#54028;&#50892; &#54144;&#52824;(Power Punch)&#50640; &#54644;&#45817;&#54616;&#45716; &#44163;&#51008;?',opts:['&#51105;','&#53356;&#47196;&#49828;','&#49836;&#47549;','&#54028;&#47553;'],ans:1,exp:'&#53356;&#47196;&#49828;&#45716; &#46263;&#49552;&#51004;&#47196; &#45216;&#47532;&#45716; &#54028;&#50892; &#54144;&#52824;&#47196;, &#50628;&#45929;&#51060; &#54924;&#51204;&#51032; &#55192;&#51012; &#51204;&#45804;&#54633;&#45768;&#45796;.'},
  {q:'Manny Pacquiao&#51032; &#44397;&#51201;&#51008;?',opts:['&#47701;&#49884;&#53076;','&#54596;&#47532;&#54592;','&#48120;&#44397;','&#54392;&#50640;&#47476;&#53664;&#47532;&#53076;'],ans:1,exp:'Manny Pacquiao&#45716; &#54596;&#47532;&#54592; &#52636;&#49888;&#51032; 8&#52404;&#44553; &#52380;&#54588;&#50616;&#51004;&#47196; &#51204;&#49444;&#51201;&#51064; &#48373;&#49436;&#51077;&#45768;&#45796;.'},
  {q:'&#48373;&#49905; &#47553;&#51032; &#44508;&#44201;&#51008;?',opts:['4.9m x 4.9m','6.1m x 6.1m','7.3m x 7.3m','8m x 8m'],ans:1,exp:'&#54532;&#47196;&#48373;&#49905; &#47553;&#51008; &#48372;&#53685; 16-20 &#54588;&#53944;(4.88m-6.1m) &#49324;&#44033;&#54805;&#51077;&#45768;&#45796;.'},
  {q:'&#50612;&#54140;&#52983;(Uppercut)&#51008; &#50612;&#46356;&#50640;&#49436; &#55192;&#51012; &#49884;&#51089;&#54616;&#45716;&#44032;?',opts:['&#50612;&#44648;','&#47924;&#47502;(&#45796;&#47532;)','&#54036;','&#49552;&#47785;'],ans:1,exp:'&#50612;&#54140;&#52983;&#51008; &#47924;&#47502;&#51012; &#44396;&#48512;&#47140; &#45796;&#47532;&#50640;&#49436; &#55192;&#51012; &#49884;&#51089;&#54644; &#50948;&#47196; &#51204;&#45804;&#54633;&#45768;&#45796;.'},
  {q:'TKO&#45716; &#47924;&#50631;&#51032; &#50557;&#51088;&#51064;&#44032;?',opts:['Total Knock Out','Technical Knock Out','Trainer Knock Out','Time Knock Out'],ans:1,exp:'TKO(Technical Knock Out)&#45716; &#49900;&#54032;&#51060;&#45208; &#47553;&#45769;&#51060; &#49440;&#49688;&#51032; &#50504;&#51204;&#51012; &#50948;&#54644; &#44221;&#44592;&#47484; &#51473;&#45800;&#54616;&#45716; &#44163;&#51077;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#44032;&#51109; &#44596; &#49324;&#44144;&#47532;&#51032; &#54144;&#52824;&#45716;?',opts:['&#51105;','&#53356;&#47196;&#49828;','&#54985;','&#50612;&#54140;&#52983;'],ans:0,exp:'&#51105;&#51008; &#50526;&#49552;&#51004;&#47196; &#48736;&#47476;&#44172; &#45216;&#47532;&#44592; &#46412;&#47928;&#50640; &#44032;&#51109; &#44596; &#49324;&#44144;&#47532;&#51032; &#54144;&#52824;&#51077;&#45768;&#45796;.'}
];

var quizIdx = 0, quizAnswered = false, quizCorrectCount = 0, quizDone = false;

function renderQuiz(){
  var el = document.getElementById('v9Quiz');
  if(!el) return;
  if(quizDone){
    var pct = Math.round(quizCorrectCount/QUIZ.length*100);
    var grade = pct>=90?'S':pct>=80?'A':pct>=70?'B':pct>=60?'C':'D';
    var k = new Date().toISOString().slice(0,10);
    if(!v9.quizScores[k]) v9.quizScores[k] = pct;
    saveV9(v9);
    el.innerHTML = '<div class="quiz-result"><div class="quiz-score-big">'+quizCorrectCount+' / '+QUIZ.length+'</div><div class="quiz-score-label">&#51221;&#45813; ('+pct+'%)</div><div class="quiz-grade" style="color:'+(pct>=80?'var(--green)':pct>=60?'var(--orange)':'var(--accent)')+'">&#46321;&#44553;: '+grade+'</div><div class="quiz-nav" style="margin-top:16px"><button class="quiz-nav-btn primary" id="quizRetry">&#45796;&#49884; &#54400;&#44592;</button></div></div>';
    document.getElementById('quizRetry').addEventListener('click',function(){quizIdx=0;quizAnswered=false;quizCorrectCount=0;quizDone=false;renderQuiz();});
    return;
  }
  var qq = QUIZ[quizIdx];
  var html = '<div class="quiz-container"><div class="quiz-q-num">Q'+(quizIdx+1)+' / '+QUIZ.length+'</div><div class="quiz-question">'+qq.q+'</div><div class="quiz-options">';
  qq.opts.forEach(function(opt,i){
    html += '<div class="quiz-option'+(quizAnswered?(i===qq.ans?' correct':(i===quizIdx._userAns?' wrong':' disabled')):'')+'" data-idx="'+i+'">'+opt+'</div>';
  });
  html += '</div><div class="quiz-explanation'+(quizAnswered?' show':'')+'">&#128161; '+qq.exp+'</div>';
  if(quizAnswered){
    html += '<div class="quiz-nav"><button class="quiz-nav-btn primary" id="quizNext">'+(quizIdx<QUIZ.length-1?'&#45796;&#51020; &#47928;&#51228; &#8594;':'&#44208;&#44284; &#48372;&#44592;')+'</button></div>';
  }
  el.innerHTML = html + '</div>';
  if(!quizAnswered){
    el.querySelectorAll('.quiz-option').forEach(function(opt){
      opt.addEventListener('click',function(){
        if(quizAnswered) return;
        var idx = parseInt(this.getAttribute('data-idx'));
        quizAnswered = true;
        quizIdx._userAns = idx;
        if(idx === qq.ans){quizCorrectCount++;playSFX('quiz_correct');}else{playSFX('quiz_wrong');}
        renderQuiz();
      });
    });
  }
  if(quizAnswered){
    var nb = document.getElementById('quizNext');
    if(nb) nb.addEventListener('click',function(){
      quizIdx++;quizAnswered=false;
      if(quizIdx>=QUIZ.length){quizDone=true;}
      renderQuiz();
    });
  }
}

// ===== PROGRESS MILESTONES =====
var MILESTONES = [
  {id:'m_first',label:'&#52395;&#54984;&#47144;',icon:'&#127937;',check:function(a){return (a.sessions||[]).length>=1;}},
  {id:'m_100p',label:'100&#54144;&#52824;',icon:'&#128074;',check:function(a){return (a.totalPunches||0)>=100;}},
  {id:'m_500p',label:'500&#54144;&#52824;',icon:'&#129354;',check:function(a){return (a.totalPunches||0)>=500;}},
  {id:'m_1k',label:'1K&#54144;&#52824;',icon:'&#128165;',check:function(a){return (a.totalPunches||0)>=1000;}},
  {id:'m_5k',label:'5K&#54144;&#52824;',icon:'&#128170;',check:function(a){return (a.totalPunches||0)>=5000;}},
  {id:'m_10k',label:'&#47112;&#51204;&#46300;',icon:'&#128081;',check:function(a){return (a.totalPunches||0)>=10000;}},
  {id:'m_3day',label:'3&#51068;&#50672;&#49549;',icon:'&#128293;',check:function(a){return (a.bestStreak||0)>=3;}},
  {id:'m_7day',label:'7&#51068;&#50672;&#49549;',icon:'&#11088;',check:function(a){return (a.bestStreak||0)>=7;}},
  {id:'m_30day',label:'30&#51068;&#50672;&#49549;',icon:'&#127942;',check:function(a){return (a.bestStreak||0)>=30;}}
];

function renderMilestones(){
  var el = document.getElementById('v9Milestones');
  if(!el) return;
  var app = loadAppData() || {};
  var reached = 0;
  MILESTONES.forEach(function(m){if(m.check(app)) reached++;});
  var pct = reached/MILESTONES.length*100;
  var html = '<div style="text-align:center;margin-bottom:10px;font-size:12px;color:var(--text-dim)">'+reached+' / '+MILESTONES.length+' &#45804;&#49457; ('+Math.round(pct)+'%)</div>';
  html += '<div class="milestone-track">';
  MILESTONES.forEach(function(m,i){
    var ok = m.check(app);
    html += '<div class="milestone-node'+(ok?' reached':'')+'"><div class="milestone-dot">'+m.icon+'</div><div class="milestone-label">'+m.label+'</div></div>';
    if(i<MILESTONES.length-1) html += '<div style="flex:1;height:2px;background:'+(ok?'var(--gold)':'var(--glass-border)')+';margin-top:-14px;min-width:20px"></div>';
  });
  el.innerHTML = html + '</div>';
}

// ===== WORKOUT TEMPLATES =====
var TEMPLATES = [
  {name:'&#48736;&#47480; &#48264;',desc:'3R&#215;1&#48516;',icon:'&#9889;',diff:'beginner',diffLabel:'&#52488;&#44553;',params:'preset=beginner'},
  {name:'&#44592;&#48376;&#44592; &#53945;&#53945;',desc:'5R&#215;2&#48516;',icon:'&#129354;',diff:'intermediate',diffLabel:'&#51473;&#44553;',params:'preset=intermediate'},
  {name:'&#54532;&#47532;&#49828;&#53440;&#51068;',desc:'8R&#215;3&#48516;',icon:'&#128293;',diff:'advanced',diffLabel:'&#44256;&#44553;',params:'preset=advanced'},
  {name:'&#49549;&#46020; &#53944;&#47112;&#51060;&#45789;',desc:'4R&#215;1&#48516; &#49549;&#44277;',icon:'&#9889;',diff:'intermediate',diffLabel:'&#51473;&#44553;',params:'preset=beginner&focus=speed'},
  {name:'&#54028;&#50892; &#54144;&#52824;',desc:'6R&#215;2&#48516; &#44053;&#53440;',icon:'&#128170;',diff:'advanced',diffLabel:'&#44256;&#44553;',params:'preset=intermediate&focus=power'},
  {name:'&#49452;&#46020;&#50864; &#48373;&#49905;',desc:'5R&#215;2&#48516; &#53092;&#48372;',icon:'&#127775;',diff:'intermediate',diffLabel:'&#51473;&#44553;',params:'preset=intermediate&mode=shadow'}
];

function renderTemplates(){
  var el = document.getElementById('v9Templates');
  if(!el) return;
  var html = '<div class="template-grid">';
  TEMPLATES.forEach(function(t){
    html += '<a href="boxing-trainer-v5.html?'+t.params+'" class="template-card"><div class="template-icon">'+t.icon+'</div><div class="template-name">'+t.name+'</div><div class="template-meta">'+t.desc+'</div><div class="template-diff" style="color:var(--'+(t.diff==='beginner'?'green':t.diff==='intermediate'?'orange':'accent')+')">'+t.diffLabel+'</div></a>';
  });
  el.innerHTML = html + '</div>';
}

// ===== TOAST =====
function toastV9(msg){
  var c = document.getElementById('toastContainer');
  if(!c) return;
  var t = document.createElement('div');
  t.className = 'toast'; t.innerHTML = msg;
  c.appendChild(t);
  setTimeout(function(){ t.remove(); }, 3000);
}

// ===== KEYBOARD SHORTCUTS =====
function setupV9Keys(){
  document.addEventListener('keydown', function(e){
    if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch(e.key.toLowerCase()){
      case 'a': var s = document.getElementById('v9Advisor'); if(s) s.scrollIntoView({behavior:'smooth'}); break;
      case 'q': var s2 = document.getElementById('v9Quiz'); if(s2) s2.scrollIntoView({behavior:'smooth'}); break;
      case 'h': var s3 = document.getElementById('v9Hydration'); if(s3) s3.scrollIntoView({behavior:'smooth'}); break;
      case 'c': var s4 = document.getElementById('v9Cooldown'); if(s4) s4.scrollIntoView({behavior:'smooth'}); break;
      case 'i': var s5 = document.getElementById('v9IntensityCanvas'); if(s5) s5.scrollIntoView({behavior:'smooth'}); break;
    }
  });
}

// ===== HTML INJECTION =====
function injectV9Sections(){
  var container = document.querySelector('.container');
  if(!container) return;
  var allSections = container.querySelectorAll('.section');
  if(allSections.length < 2) return;

  var advisorSec = document.createElement('section');
  advisorSec.className = 'section v9-section';
  advisorSec.innerHTML = '<h2 class="section-title"><span class="emoji">&#129302;</span> AI &#53944;&#47112;&#51060;&#45789; &#50612;&#46300;&#48148;&#51060;&#51200;</h2><div id="v9Advisor"></div>';
  allSections[0].parentNode.insertBefore(advisorSec, allSections[0]);

  var intensitySec = document.createElement('section');
  intensitySec.className = 'section v9-section';
  intensitySec.innerHTML = '<h2 class="section-title"><span class="emoji">&#128200;</span> &#51452;&#44036; &#54984;&#47144; &#44053;&#46020;</h2><div class="card"><div id="v9IntensityCanvas"></div></div>';

  var speedSec = document.createElement('section');
  speedSec.className = 'section v9-section';
  speedSec.innerHTML = '<h2 class="section-title"><span class="emoji">&#9889;</span> &#54144;&#52824; &#49828;&#54588;&#46300; &#46321;&#44553;</h2><div class="card"><div id="v9SpeedGrade"></div></div>';

  var calSection = null;
  for(var i=0;i<allSections.length;i++){
    var t = allSections[i].querySelector('.section-title');
    if(t && t.textContent.indexOf('칼로리') >= 0){ calSection = allSections[i]; break; }
  }
  if(calSection){
    calSection.parentNode.insertBefore(intensitySec, calSection);
    calSection.parentNode.insertBefore(speedSec, calSection);
  }

  var hydrationSec = document.createElement('section');
  hydrationSec.className = 'section v9-section';
  hydrationSec.innerHTML = '<h2 class="section-title"><span class="emoji">&#128167;</span> &#49688;&#48516; &#49453;&#52712; &#53944;&#47000;&#52964;</h2><div class="card"><div id="v9Hydration"></div></div>';

  var programSection = null;
  var allSec2 = container.querySelectorAll('.section');
  for(var j=0;j<allSec2.length;j++){
    var t2 = allSec2[j].querySelector('.section-title');
    if(t2 && t2.textContent.indexOf('프로그램') >= 0){ programSection = allSec2[j]; break; }
  }
  if(programSection){
    programSection.parentNode.insertBefore(hydrationSec, programSection);

    var templateSec = document.createElement('section');
    templateSec.className = 'section v9-section';
    templateSec.innerHTML = '<h2 class="section-title"><span class="emoji">&#128221;</span> &#50892;&#53356;&#50500;&#50883; &#53596;&#54540;&#47551;</h2><div id="v9Templates"></div>';
    programSection.parentNode.insertBefore(templateSec, programSection.nextSibling);
  }

  var cooldownSec = document.createElement('section');
  cooldownSec.className = 'section v9-section';
  cooldownSec.innerHTML = '<h2 class="section-title"><span class="emoji">&#129495;</span> &#47532;&#52964;&#48260;&#47532; &#53216;&#45796;&#50868;</h2><div class="card"><div id="v9Cooldown"></div></div>';

  var historySec = null;
  var allSec3 = container.querySelectorAll('.section');
  for(var k2=0;k2<allSec3.length;k2++){
    var t3 = allSec3[k2].querySelector('.section-title');
    if(t3 && t3.textContent.indexOf('세션') >= 0){ historySec = allSec3[k2]; break; }
  }
  if(historySec){
    historySec.parentNode.insertBefore(cooldownSec, historySec);
  }

  var quizSec = document.createElement('section');
  quizSec.className = 'section v9-section';
  quizSec.innerHTML = '<h2 class="section-title"><span class="emoji">&#128218;</span> &#48373;&#49905; &#51648;&#49885; &#53300;&#51592;</h2><div class="card"><div id="v9Quiz"></div></div>';

  var milestoneSec = document.createElement('section');
  milestoneSec.className = 'section v9-section';
  milestoneSec.innerHTML = '<h2 class="section-title"><span class="emoji">&#127937;</span> &#51652;&#54665; &#47560;&#51068;&#49828;&#53668;</h2><div class="card"><div id="v9Milestones"></div></div>';

  var tipSec = null;
  var allSec4 = container.querySelectorAll('.section');
  for(var m=0;m<allSec4.length;m++){
    var t4 = allSec4[m].querySelector('.section-title');
    if(t4 && t4.textContent.indexOf('팁') >= 0){ tipSec = allSec4[m]; break; }
  }
  if(tipSec){
    tipSec.parentNode.insertBefore(quizSec, tipSec);
    tipSec.parentNode.insertBefore(milestoneSec, tipSec);
  }

  var footerVer = document.querySelector('.footer-ver');
  if(footerVer) footerVer.textContent = 'Boxing Trainer Pro v9.0 | PWA Enabled';
}

// ===== INIT =====
function initV9(){
  injectV9CSS();
  injectV9Sections();
  renderAdvisor();
  renderIntensityChart();
  renderSpeedGrade();
  renderHydration();
  renderCooldown();
  renderQuiz();
  renderMilestones();
  renderTemplates();
  setupV9Keys();
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initV9);
} else {
  setTimeout(initV9, 100);
}

})();
