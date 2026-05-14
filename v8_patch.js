// Boxing Trainer Pro v8_patch.js - NEXTERA+PRISM Auto Enhancement Module
// Daily Challenge, Personal Records, Body Zone Heatmap, Warm-up Guide,
// Share Card, Technique Library, Motivational Quotes, Accessibility, Keyboard Shortcuts
(function(){
'use strict';

var STORAGE_KEY = 'boxingTrainerData';
var PATCH_KEY = 'boxingV8Patch';

function loadAppData(){
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(e){ return null; }
}

function loadPatchData(){
  try {
    var raw = localStorage.getItem(PATCH_KEY);
    if(!raw) return getDefaultPatch();
    var parsed = JSON.parse(raw);
    var def = getDefaultPatch();
    for(var k in def){ if(!(k in parsed)) parsed[k] = def[k]; }
    return parsed;
  } catch(e){ return getDefaultPatch(); }
}

function savePatchData(d){
  try { localStorage.setItem(PATCH_KEY, JSON.stringify(d)); } catch(e){}
}

function getDefaultPatch(){
  return {
    challengeCompleted: {},
    personalRecords: { bestPunches: 0, bestCombos: 0, bestDuration: 0, bestCalories: 0, bestScore: 0 },
    warmupDone: {},
    quoteIndex: 0
  };
}

var patchData = loadPatchData();

// ===== CSS INJECTION =====
function injectCSS(){
  var s = document.createElement('style');
  s.textContent = '\
.skip-link{position:absolute;top:-40px;left:0;background:var(--accent);color:#fff;\
padding:8px 16px;z-index:9999;transition:top 0.3s;font-size:14px;font-weight:700;\
border-radius:0 0 8px 0;text-decoration:none}\
.skip-link:focus{top:0}\
.v8-section{margin:24px 0;animation:slideUp 0.5s ease-out both}\
.challenge-card{\
  background:linear-gradient(135deg,rgba(255,68,68,0.12),rgba(255,136,102,0.06));\
  border:1px solid rgba(255,68,68,0.2);border-radius:var(--radius);\
  padding:20px;position:relative;overflow:hidden}\
.challenge-card::after{content:\"\";position:absolute;top:-30px;right:-30px;\
width:100px;height:100px;background:radial-gradient(circle,rgba(255,68,68,0.15),transparent 70%);\
pointer-events:none}\
.challenge-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}\
.challenge-title{font-size:18px;font-weight:800;display:flex;align-items:center;gap:8px}\
.challenge-timer{font-size:11px;color:var(--text-muted);display:flex;align-items:center;gap:4px}\
.challenge-desc{font-size:13px;color:var(--text-dim);margin-bottom:14px;line-height:1.5}\
.challenge-progress-bar{height:8px;background:var(--surface);border-radius:4px;overflow:hidden}\
.challenge-progress-fill{height:100%;border-radius:4px;\
background:linear-gradient(90deg,var(--accent),var(--orange));\
transition:width 0.8s ease-out}\
.challenge-meta{display:flex;align-items:center;justify-content:space-between;margin-top:8px}\
.challenge-pct{font-size:12px;font-weight:700;color:var(--accent)}\
.challenge-reward{font-size:11px;color:var(--gold);display:flex;align-items:center;gap:4px}\
.challenge-done{text-align:center;padding:10px;color:var(--green);font-weight:700;font-size:14px}\
.pr-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}\
.pr-card{text-align:center;padding:14px 10px;\
background:var(--glass);border:1px solid var(--glass-border);\
border-radius:14px;backdrop-filter:blur(12px);transition:all 0.3s}\
.pr-card:hover{border-color:var(--gold);transform:translateY(-2px)}\
.pr-icon{font-size:24px;margin-bottom:4px}\
.pr-value{font-size:22px;font-weight:900;color:var(--gold)}\
.pr-label{font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;margin-top:2px}\
.pr-date{font-size:9px;color:var(--text-muted);margin-top:2px}\
.body-zone-wrap{display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap}\
.body-svg-container{width:160px;height:280px;position:relative}\
.body-svg-container svg{width:100%;height:100%}\
.zone-legend{display:flex;flex-direction:column;gap:8px}\
.zone-item{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text-dim)}\
.zone-bar{width:80px;height:6px;background:var(--surface);border-radius:3px;overflow:hidden}\
.zone-bar-fill{height:100%;border-radius:3px;transition:width 0.6s ease-out}\
.zone-pct{font-size:11px;font-weight:700;color:var(--text);min-width:30px;text-align:right}\
.warmup-container{display:flex;flex-direction:column;gap:10px}\
.warmup-step{display:flex;align-items:center;gap:12px;padding:12px 14px;\
background:var(--surface);border:1px solid var(--glass-border);\
border-radius:12px;transition:all 0.3s;cursor:pointer}\
.warmup-step:hover{border-color:var(--accent)}\
.warmup-step.active{border-color:var(--green);background:rgba(34,197,94,0.06)}\
.warmup-step.done{opacity:0.5}\
.warmup-num{width:28px;height:28px;border-radius:50%;\
background:var(--glass);border:1px solid var(--glass-border);\
display:flex;align-items:center;justify-content:center;\
font-size:12px;font-weight:700;color:var(--text-dim);flex-shrink:0}\
.warmup-step.active .warmup-num{background:var(--green);border-color:var(--green);color:#fff}\
.warmup-step.done .warmup-num{background:var(--accent-soft);border-color:var(--accent);color:var(--accent)}\
.warmup-info{flex:1}\
.warmup-name{font-size:13px;font-weight:700}\
.warmup-desc{font-size:11px;color:var(--text-dim);margin-top:2px}\
.warmup-dur{font-size:11px;color:var(--text-muted);font-weight:600;flex-shrink:0}\
.warmup-timer-display{text-align:center;padding:16px;\
background:var(--glass);border:1px solid var(--glass-border);\
border-radius:var(--radius);margin-top:10px}\
.warmup-time-big{font-size:48px;font-weight:900;color:var(--accent);font-variant-numeric:tabular-nums}\
.warmup-phase-label{font-size:13px;color:var(--text-dim);margin-top:4px}\
.warmup-controls{display:flex;gap:8px;justify-content:center;margin-top:10px}\
.warmup-btn{padding:10px 24px;border:none;border-radius:10px;font-size:14px;\
font-weight:700;cursor:pointer;transition:all 0.2s}\
.warmup-btn.primary{background:var(--accent);color:#fff}\
.warmup-btn.primary:hover{filter:brightness(1.1)}\
.warmup-btn.secondary{background:var(--glass);color:var(--text-dim);\
border:1px solid var(--glass-border)}\
.warmup-btn.secondary:hover{border-color:var(--accent);color:var(--accent)}\
.tech-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px}\
.tech-card{padding:16px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:14px;cursor:pointer;transition:all 0.3s;text-align:center}\
.tech-card:hover{border-color:var(--accent);transform:translateY(-3px)}\
.tech-card.selected{border-color:var(--accent);background:var(--accent-soft)}\
.tech-icon{font-size:32px;margin-bottom:6px}\
.tech-name{font-size:13px;font-weight:800;margin-bottom:2px}\
.tech-diff{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px}\
.tech-diff.beginner{color:var(--green)}\
.tech-diff.intermediate{color:var(--orange)}\
.tech-diff.advanced{color:var(--accent)}\
.tech-detail{margin-top:14px;padding:16px;background:var(--surface);\
border:1px solid var(--glass-border);border-radius:var(--radius);\
animation:slideUp 0.3s ease-out;display:none}\
.tech-detail.open{display:block}\
.tech-detail-title{font-size:16px;font-weight:800;margin-bottom:8px}\
.tech-detail-steps{list-style:none;padding:0;margin:0}\
.tech-detail-steps li{padding:6px 0;font-size:12px;color:var(--text-dim);\
border-bottom:1px solid var(--glass-border);display:flex;align-items:center;gap:8px}\
.tech-detail-steps li:last-child{border-bottom:none}\
.tech-step-num{width:20px;height:20px;border-radius:50%;background:var(--accent-soft);\
color:var(--accent);font-size:10px;font-weight:700;\
display:flex;align-items:center;justify-content:center;flex-shrink:0}\
.tech-tips{margin-top:10px;padding:10px;background:rgba(255,215,0,0.05);\
border:1px solid rgba(255,215,0,0.15);border-radius:10px;\
font-size:11px;color:var(--text-dim);line-height:1.5}\
.tech-tips strong{color:var(--gold)}\
.quote-card{text-align:center;padding:20px;\
background:linear-gradient(135deg,rgba(168,85,247,0.08),rgba(59,130,246,0.06));\
border:1px solid rgba(168,85,247,0.15);border-radius:var(--radius)}\
.quote-text{font-size:15px;font-weight:600;line-height:1.7;\
font-style:italic;color:var(--text);margin-bottom:10px}\
.quote-author{font-size:12px;color:var(--text-muted);font-weight:700}\
.share-btn{display:inline-flex;align-items:center;gap:6px;\
padding:10px 20px;margin:8px 4px;\
background:linear-gradient(135deg,var(--accent),var(--orange));\
border:none;border-radius:10px;color:#fff;\
font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s}\
.share-btn:hover{filter:brightness(1.1);transform:scale(1.02)}\
.share-overlay{position:fixed;top:0;left:0;width:100%;height:100%;\
background:rgba(0,0,0,0.7);backdrop-filter:blur(5px);\
z-index:1001;display:none;align-items:center;justify-content:center;\
animation:fadeIn 0.2s}\
.share-overlay.open{display:flex}\
.share-panel{background:var(--bg);border:1px solid var(--glass-border);\
border-radius:20px;padding:24px;width:90%;max-width:420px;text-align:center}\
.share-panel canvas{border-radius:12px;max-width:100%;margin:10px 0}\
.share-actions{display:flex;gap:8px;justify-content:center;margin-top:10px}\
.kbd-help{position:fixed;bottom:80px;right:16px;z-index:90;\
padding:8px 14px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:10px;font-size:11px;color:var(--text-muted);\
backdrop-filter:blur(10px);cursor:pointer;transition:all 0.2s}\
.kbd-help:hover{border-color:var(--accent);color:var(--accent)}\
.kbd-overlay{position:fixed;top:0;left:0;width:100%;height:100%;\
background:rgba(0,0,0,0.6);backdrop-filter:blur(5px);\
z-index:1002;display:none;align-items:center;justify-content:center}\
.kbd-overlay.open{display:flex}\
.kbd-panel{background:var(--bg);border:1px solid var(--glass-border);\
border-radius:20px;padding:24px;width:90%;max-width:360px}\
.kbd-title{font-size:18px;font-weight:800;text-align:center;margin-bottom:16px}\
.kbd-row{display:flex;align-items:center;justify-content:space-between;\
padding:8px 0;border-bottom:1px solid var(--glass-border)}\
.kbd-row:last-child{border-bottom:none}\
.kbd-key{padding:4px 10px;background:var(--surface);border:1px solid var(--glass-border);\
border-radius:6px;font-size:12px;font-weight:700;font-family:monospace;color:var(--text)}\
.kbd-desc{font-size:12px;color:var(--text-dim)}\
@media(max-width:768px){\
  .pr-grid{grid-template-columns:repeat(2,1fr)}\
  .tech-grid{grid-template-columns:repeat(2,1fr)}\
  .body-zone-wrap{flex-direction:column}\
  .kbd-help{display:none}\
}';
  document.head.appendChild(s);
}

// ===== DAILY CHALLENGE =====
var CHALLENGES = [
  {title:'스피드 러너', desc:'3분 안에 150 펀치 달성', goal:150, type:'punches', icon:'⚡', reward:50},
  {title:'콤보 마스터', desc:'한 세션에 20 콤보 달성', goal:20, type:'combos', icon:'💥', reward:40},
  {title:'내구력 테스트', desc:'10분 이상 훈련하기', goal:10, type:'duration', icon:'🏋️', reward:60},
  {title:'칼로리 버너', desc:'오늘 200kcal 소모', goal:200, type:'calories', icon:'🔥', reward:45},
  {title:'잡 전문가', desc:'한 세션에 100 펀치 이상', goal:100, type:'punches', icon:'🥊', reward:35},
  {title:'파워 펀처', desc:'5분 내에 80 펀치 달성', goal:80, type:'punches', icon:'💪', reward:55},
  {title:'마라톤 복서', desc:'15분 이상 연속 훈련', goal:15, type:'duration', icon:'🏃', reward:70},
  {title:'300펀치 도전', desc:'오늘 총 300 펀치 달성', goal:300, type:'punches', icon:'🎯', reward:65},
  {title:'콤보 킹', desc:'콤보 30회 달성하기', goal:30, type:'combos', icon:'💫', reward:50},
  {title:'체력 단련', desc:'8분 이상 훈련 + 100펀치', goal:100, type:'punches', icon:'🏆', reward:55},
  {title:'집중력 도전', desc:'5분 내에 120 펀치', goal:120, type:'punches', icon:'👀', reward:45},
  {title:'그린 트레이닝', desc:'오늘 150kcal 소모하기', goal:150, type:'calories', icon:'🌱', reward:40},
  {title:'아이언 피스트', desc:'오늘 총 500 펀치', goal:500, type:'punches', icon:'⚡', reward:80},
  {title:'끈기 없는 전사', desc:'연속 12분 훈련', goal:12, type:'duration', icon:'🔥', reward:60}
];

function getDailyChallenge(){
  var today = new Date();
  var seed = today.getFullYear() * 10000 + (today.getMonth()+1) * 100 + today.getDate();
  return CHALLENGES[seed % CHALLENGES.length];
}

function getDailyChallengeProgress(){
  var appData = loadAppData();
  if(!appData) return 0;
  var challenge = getDailyChallenge();
  var todayStr = new Date().toDateString();
  var todaySessions = (appData.sessions || []).filter(function(s){
    return new Date(s.date).toDateString() === todayStr;
  });
  switch(challenge.type){
    case 'punches':
      return todaySessions.reduce(function(sum,s){ return sum + (s.punches||0); }, 0);
    case 'combos':
      return todaySessions.reduce(function(sum,s){ return sum + (s.combos||0); }, 0);
    case 'duration':
      return todaySessions.reduce(function(sum,s){ return sum + (s.duration||0); }, 0);
    case 'calories':
      return todaySessions.reduce(function(sum,s){ return sum + (s.calories||0); }, 0);
    default: return 0;
  }
}

function renderDailyChallenge(){
  var el = document.getElementById('v8DailyChallenge');
  if(!el) return;
  var ch = getDailyChallenge();
  var progress = getDailyChallengeProgress();
  var pct = Math.min(progress / ch.goal * 100, 100);
  var todayKey = new Date().toISOString().slice(0,10);
  var completed = pct >= 100;
  if(completed && !patchData.challengeCompleted[todayKey]){
    patchData.challengeCompleted[todayKey] = true;
    savePatchData(patchData);
  }
  var hoursLeft = 23 - new Date().getHours();
  var minsLeft = 59 - new Date().getMinutes();
  el.innerHTML = '<div class="challenge-card">' +
    '<div class="challenge-header">' +
      '<div class="challenge-title">' + ch.icon + ' ' + ch.title + '</div>' +
      '<div class="challenge-timer">⏲ ' + hoursLeft + '시간 ' + minsLeft + '분 남음</div>' +
    '</div>' +
    (completed ?
      '<div class="challenge-done">✓ 챌린지 완료! +' + ch.reward + 'XP</div>' :
      '<div class="challenge-desc">' + ch.desc + '</div>' +
      '<div class="challenge-progress-bar"><div class="challenge-progress-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="challenge-meta">' +
        '<span class="challenge-pct">' + Math.round(pct) + '% (' + progress + '/' + ch.goal + ')</span>' +
        '<span class="challenge-reward">⭐ ' + ch.reward + ' XP</span>' +
      '</div>'
    ) +
  '</div>';
}

// ===== PERSONAL RECORDS =====
function computePersonalRecords(){
  var appData = loadAppData();
  if(!appData || !appData.sessions || appData.sessions.length === 0){
    return {bestPunches:0,bestCombos:0,bestDuration:0,bestCalories:0,bestScore:0,
      bestPunchesDate:'',bestCombosDate:'',bestDurationDate:'',bestCaloriesDate:'',bestScoreDate:''};
  }
  var pr = {bestPunches:0,bestCombos:0,bestDuration:0,bestCalories:0,bestScore:0,
    bestPunchesDate:'',bestCombosDate:'',bestDurationDate:'',bestCaloriesDate:'',bestScoreDate:''};
  appData.sessions.forEach(function(s){
    if((s.punches||0)>pr.bestPunches){pr.bestPunches=s.punches;pr.bestPunchesDate=s.date;}
    if((s.combos||0)>pr.bestCombos){pr.bestCombos=s.combos;pr.bestCombosDate=s.date;}
    if((s.duration||0)>pr.bestDuration){pr.bestDuration=s.duration;pr.bestDurationDate=s.date;}
    if((s.calories||0)>pr.bestCalories){pr.bestCalories=s.calories;pr.bestCaloriesDate=s.date;}
    if((s.score||0)>pr.bestScore){pr.bestScore=s.score;pr.bestScoreDate=s.date;}
  });
  return pr;
}

function fmtDate(iso){
  if(!iso) return '-';
  var d = new Date(iso);
  return (d.getMonth()+1) + '/' + d.getDate();
}

function renderPersonalRecords(){
  var el = document.getElementById('v8PersonalRecords');
  if(!el) return;
  var pr = computePersonalRecords();
  var items = [
    {icon:'🥊',label:'최다 펀치',value:pr.bestPunches,date:pr.bestPunchesDate},
    {icon:'💥',label:'최다 콤보',value:pr.bestCombos,date:pr.bestCombosDate},
    {icon:'⏱️',label:'최장 훈련',value:pr.bestDuration+'분',date:pr.bestDurationDate},
    {icon:'🔥',label:'최다 칼로리',value:pr.bestCalories+'kcal',date:pr.bestCaloriesDate},
    {icon:'🏆',label:'최고 점수',value:pr.bestScore,date:pr.bestScoreDate}
  ];
  var html = '<div class="pr-grid">';
  items.forEach(function(it){
    html += '<div class="pr-card"><div class="pr-icon">'+it.icon+'</div><div class="pr-value">'+it.value+'</div><div class="pr-label">'+it.label+'</div><div class="pr-date">'+fmtDate(it.date)+'</div></div>';
  });
  el.innerHTML = html + '</div>';
}

// ===== BODY ZONE HEATMAP =====
function renderBodyZone(){
  var el = document.getElementById('v8BodyZone');
  if(!el) return;
  var appData = loadAppData();
  var pt = (appData && appData.punchTypes) ? appData.punchTypes : {jab:0,cross:0,hook:0,uppercut:0};
  var total = pt.jab + pt.cross + pt.hook + pt.uppercut;
  if(total === 0) total = 1;
  var headPct = Math.round((pt.jab * 0.6 + pt.cross * 0.5) / total * 100);
  var bodyPct = Math.round((pt.hook * 0.4 + pt.cross * 0.3 + pt.uppercut * 0.3) / total * 100);
  var leftPct = Math.round((pt.jab * 0.2 + pt.hook * 0.4) / total * 100);
  var rightPct = Math.round((pt.cross * 0.2 + pt.hook * 0.2 + pt.uppercut * 0.4) / total * 100);
  var normMax = Math.max(headPct, bodyPct, leftPct, rightPct, 1);
  function opacity(p){ return Math.max(0.15, p / normMax * 0.85); }

  el.innerHTML = '<div class="body-zone-wrap">' +
    '<div class="body-svg-container">' +
      '<svg viewBox="0 0 120 220" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="60" cy="30" r="22" fill="rgba(255,68,68,' + opacity(headPct) + ')" stroke="var(--glass-border)" stroke-width="1"/>' +
        '<text x="60" y="34" text-anchor="middle" fill="var(--text)" font-size="10" font-weight="700">' + headPct + '%</text>' +
        '<rect x="40" y="55" width="40" height="55" rx="8" fill="rgba(255,68,68,' + opacity(bodyPct) + ')" stroke="var(--glass-border)" stroke-width="1"/>' +
        '<text x="60" y="86" text-anchor="middle" fill="var(--text)" font-size="10" font-weight="700">' + bodyPct + '%</text>' +
        '<rect x="12" y="58" width="24" height="50" rx="6" fill="rgba(59,130,246,' + opacity(leftPct) + ')" stroke="var(--glass-border)" stroke-width="1"/>' +
        '<text x="24" y="87" text-anchor="middle" fill="var(--text)" font-size="9" font-weight="700">' + leftPct + '%</text>' +
        '<rect x="84" y="58" width="24" height="50" rx="6" fill="rgba(168,85,247,' + opacity(rightPct) + ')" stroke="var(--glass-border)" stroke-width="1"/>' +
        '<text x="96" y="87" text-anchor="middle" fill="var(--text)" font-size="9" font-weight="700">' + rightPct + '%</text>' +
        '<rect x="35" y="115" width="20" height="60" rx="6" fill="rgba(255,68,68,0.08)" stroke="var(--glass-border)" stroke-width="1"/>' +
        '<rect x="65" y="115" width="20" height="60" rx="6" fill="rgba(255,68,68,0.08)" stroke="var(--glass-border)" stroke-width="1"/>' +
        '<rect x="38" y="178" width="14" height="35" rx="5" fill="rgba(255,68,68,0.06)" stroke="var(--glass-border)" stroke-width="1"/>' +
        '<rect x="68" y="178" width="14" height="35" rx="5" fill="rgba(255,68,68,0.06)" stroke="var(--glass-border)" stroke-width="1"/>' +
      '</svg>' +
    '</div>' +
    '<div class="zone-legend">' +
      '<div class="zone-item"><span style="color:var(--accent)">⚫</span> 머리(잡/크로스) <div class="zone-bar"><div class="zone-bar-fill" style="width:'+Math.round(headPct/normMax*100)+'%;background:var(--accent)"></div></div> <span class="zone-pct">'+headPct+'%</span></div>' +
      '<div class="zone-item"><span style="color:var(--orange)">⚫</span> 바디(훅/어퍼) <div class="zone-bar"><div class="zone-bar-fill" style="width:'+Math.round(bodyPct/normMax*100)+'%;background:var(--orange)"></div></div> <span class="zone-pct">'+bodyPct+'%</span></div>' +
      '<div class="zone-item"><span style="color:var(--blue)">⚫</span> 왼쪽(잡/훅) <div class="zone-bar"><div class="zone-bar-fill" style="width:'+Math.round(leftPct/normMax*100)+'%;background:var(--blue)"></div></div> <span class="zone-pct">'+leftPct+'%</span></div>' +
      '<div class="zone-item"><span style="color:var(--purple)">⚫</span> 오른쪽(크로스/어퍼) <div class="zone-bar"><div class="zone-bar-fill" style="width:'+Math.round(rightPct/normMax*100)+'%;background:var(--purple)"></div></div> <span class="zone-pct">'+rightPct+'%</span></div>' +
    '</div></div>';
}

// ===== WARM-UP / COOL-DOWN =====
var WARMUP_STEPS = [
  {name:'목 스트레칭',desc:'좌우로 천천히 돌리기',dur:30},
  {name:'어깨 회전',desc:'앞뒤로 크게 돌리기',dur:30},
  {name:'팔 스윉',desc:'좌우 번갈아 롰조기',dur:30},
  {name:'몸통 회전',desc:'어깨+온듡이+무릎',dur:30},
  {name:'가벼운 줄넛기',desc:'제자리에서 가볍게',dur:45},
  {name:'섀도우복싱',desc:'가벼운 잡-크로스 연습',dur:45}
];

var warmupTimerId = null, warmupCurrentStep = 0, warmupTimeLeft = 0, warmupRunning = false;

function renderWarmup(){
  var el = document.getElementById('v8Warmup');
  if(!el) return;
  var html = '<div class="warmup-container">';
  WARMUP_STEPS.forEach(function(step, i){
    var cls = 'warmup-step';
    if(i === warmupCurrentStep && warmupRunning) cls += ' active';
    if(i < warmupCurrentStep && warmupRunning) cls += ' done';
    html += '<div class="'+cls+'"><div class="warmup-num">'+(i < warmupCurrentStep && warmupRunning ? '✓' : (i+1))+'</div><div class="warmup-info"><div class="warmup-name">'+step.name+'</div><div class="warmup-desc">'+step.desc+'</div></div><div class="warmup-dur">'+step.dur+'초</div></div>';
  });
  html += '</div><div class="warmup-timer-display">';
  if(warmupRunning){
    html += '<div class="warmup-time-big">' + formatTime(warmupTimeLeft) + '</div>';
    html += '<div class="warmup-phase-label">' + WARMUP_STEPS[warmupCurrentStep].name + '</div>';
  } else {
    var totalSec = WARMUP_STEPS.reduce(function(s,step){return s+step.dur;},0);
    html += '<div class="warmup-time-big" style="font-size:28px;color:var(--text-dim)">'+Math.ceil(totalSec/60)+'분 워밍업</div>';
    html += '<div class="warmup-phase-label">훈련 전 워밍업으로 부상을 예방하세요</div>';
  }
  html += '</div><div class="warmup-controls">';
  if(!warmupRunning){
    html += '<button class="warmup-btn primary" id="warmupStart">▶ 워밍업 시작</button>';
  } else {
    html += '<button class="warmup-btn secondary" id="warmupStop">■ 중지</button>';
    html += '<button class="warmup-btn secondary" id="warmupSkip">⏩ 건너뛰기</button>';
  }
  html += '</div>';
  el.innerHTML = html;
  if(!warmupRunning){
    var btn = document.getElementById('warmupStart');
    if(btn) btn.addEventListener('click', startWarmup);
  } else {
    var stopBtn = document.getElementById('warmupStop');
    if(stopBtn) stopBtn.addEventListener('click', stopWarmup);
    var skipBtn = document.getElementById('warmupSkip');
    if(skipBtn) skipBtn.addEventListener('click', skipWarmupStep);
  }
}

function formatTime(sec){
  var m = Math.floor(sec/60), s = sec % 60;
  return (m<10?'0':'')+m+':'+(s<10?'0':'')+s;
}

function startWarmup(){
  warmupCurrentStep = 0;
  warmupTimeLeft = WARMUP_STEPS[0].dur;
  warmupRunning = true;
  renderWarmup();
  warmupTimerId = setInterval(tickWarmup, 1000);
  playWarmupBeep();
}

function tickWarmup(){
  warmupTimeLeft--;
  if(warmupTimeLeft <= 0){
    warmupCurrentStep++;
    if(warmupCurrentStep >= WARMUP_STEPS.length){ stopWarmup(); playWarmupDone(); return; }
    warmupTimeLeft = WARMUP_STEPS[warmupCurrentStep].dur;
    playWarmupBeep();
  }
  renderWarmup();
}

function stopWarmup(){
  warmupRunning = false; warmupCurrentStep = 0;
  if(warmupTimerId){ clearInterval(warmupTimerId); warmupTimerId = null; }
  renderWarmup();
}

function skipWarmupStep(){
  warmupCurrentStep++;
  if(warmupCurrentStep >= WARMUP_STEPS.length){ stopWarmup(); playWarmupDone(); return; }
  warmupTimeLeft = WARMUP_STEPS[warmupCurrentStep].dur;
  playWarmupBeep();
  renderWarmup();
}

function playWarmupBeep(){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.2);
  } catch(e){}
}

function playWarmupDone(){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523,659,784].forEach(function(freq,i){
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i*0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i*0.15 + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i*0.15);
      osc.stop(ctx.currentTime + i*0.15 + 0.3);
    });
  } catch(e){}
}

// ===== TECHNIQUE LIBRARY =====
var TECHNIQUES = [
  {id:'jab',name:'잡 (Jab)',icon:'🥊',diff:'beginner',diffLabel:'초급',
    steps:['오소독스 자세에서 앞발을 살짝 앞으로','앞손을 직선으로 빠르게 뼉어','주먹을 살짝 뒤틜는 느낌으로 회전','즉시 원래 위치로 당겨 복귀'],
    tip:'잡은 속도와 거리 유지에 사용합니다. 어깨를 낮게 유지하고 턴을 보호하세요.'},
  {id:'cross',name:'크로스 (Cross)',icon:'👊',diff:'beginner',diffLabel:'초급',
    steps:['뒣발의 뒷꽈치를 들어 회전 시작','온듡이를 완전히 회전시키며 펀치','뒣손을 직선으로 내지르기','체중을 앞발로 이동시키며 파워 전달'],
    tip:'크로스는 가장 강력한 펀치입니다. 온듡이 회전이 파워의 핵심입니다.'},
  {id:'hook',name:'훅 (Hook)',icon:'💪',diff:'intermediate',diffLabel:'중급',
    steps:['팔꽘치를 90도로 구부리고 어깨 높이로','앞발을 피뱗으로 온듡이를 회전','팔이 바닥과 평행을 유지하며 옆으로 가격','즉시 가드로 돌아와 방어 자세 유지'],
    tip:'훅은 근거리에서 강력합니다. 팔꽘치가 아닌 몸통 전체로 힘을 전달하세요.'},
  {id:'uppercut',name:'어퍼컷 (Uppercut)',icon:'🔥',diff:'intermediate',diffLabel:'중급',
    steps:['무릎을 살짝 구부리며 몸을 낮추고','다리에서 힘을 시작해 위로 폼프','주먹을 아래에서 위로 수직 가격','몸 전체를 사용해 파워 극대화'],
    tip:'어퍼컷은 근접에서 가장 강력한 펀치입니다. 무릎에서 힘을 시작하세요.'},
  {id:'slip',name:'슬립 (Slip)',icon:'🛡️',diff:'beginner',diffLabel:'초급',
    steps:['무릎을 살짝 구부리고 체중 이동','상체를 좌 또는 오른쪽으로 기울임','상대의 펀치가 어깨 앞으로 지나가도록','즉시 반격 위치로 복귀'],
    tip:'슬립은 가장 기본적인 회피 기술입니다. 머리만 움직이는 게 아니라 몸통 전체를 사용하세요.'},
  {id:'roll',name:'롤 (Roll)',icon:'🔄',diff:'intermediate',diffLabel:'중급',
    steps:['무릎을 구부리고 몸을 낮추기','U자 모양으로 몸통을 구부려서 이동','상대의 훅을 아래로 피하며 통과','구부려진 위치에서 바로 반격'],
    tip:'롤은 훅을 피하는 매우 효과적인 방어 기술입니다. 올바른 타이밍이 핵심입니다.'},
  {id:'combo12',name:'1-2 콤보',icon:'💥',diff:'beginner',diffLabel:'초급',
    steps:['잡(1)을 빠르게 날리고 당김','즉시 크로스(2)를 연결','온듡이 회전을 충분히 활용','두 펀치 사이 시간간격 최소화'],
    tip:'1-2는 가장 기본적이고 효과적인 콤보입니다. 모든 복서의 기본이 됩니다.'},
  {id:'combo123',name:'1-2-3 콤보',icon:'⚡',diff:'intermediate',diffLabel:'중급',
    steps:['잡(1)으로 시작','크로스(2)로 연결','리드 훅(3)으로 마무리','세 펀치가 마치 하나처럼 흐르도록'],
    tip:'1-2-3은 클래식 콤보입니다. 훅의 타이밍이 핵심이며, 체중 이동에 집중하세요.'},
  {id:'combo1236',name:'1-2-3-6',icon:'💫',diff:'advanced',diffLabel:'고급',
    steps:['잡(1) → 크로스(2) 빠르게','리드 훅(3)으로 상체 회전','라이트 어퍼컷(6)으로 마무리','4연타 콤보를 리듬감하게 연결'],
    tip:'고급 콤보로 원투펀치가 중요합니다. 천천히 연습 후 속도를 높이세요.'}
];

var selectedTech = null;

function renderTechLibrary(){
  var el = document.getElementById('v8TechLibrary');
  if(!el) return;
  var html = '<div class="tech-grid">';
  TECHNIQUES.forEach(function(t){
    html += '<div class="tech-card'+(selectedTech===t.id?' selected':'')+'" data-tech="'+t.id+'"><div class="tech-icon">'+t.icon+'</div><div class="tech-name">'+t.name+'</div><div class="tech-diff '+t.diff+'">'+t.diffLabel+'</div></div>';
  });
  html += '</div>';
  if(selectedTech){
    var tech = TECHNIQUES.filter(function(t){return t.id===selectedTech;})[0];
    if(tech){
      html += '<div class="tech-detail open"><div class="tech-detail-title">'+tech.icon+' '+tech.name+'</div><ol class="tech-detail-steps">';
      tech.steps.forEach(function(step,i){
        html += '<li><span class="tech-step-num">'+(i+1)+'</span>'+step+'</li>';
      });
      html += '</ol><div class="tech-tips"><strong>💡 팁:</strong> '+tech.tip+'</div></div>';
    }
  }
  el.innerHTML = html;
  el.querySelectorAll('.tech-card').forEach(function(card){
    card.addEventListener('click', function(){
      var techId = this.getAttribute('data-tech');
      selectedTech = (selectedTech === techId) ? null : techId;
      renderTechLibrary();
    });
  });
}

// ===== MOTIVATIONAL QUOTES =====
var QUOTES = [
  {text:'챔피언은 아침에 일어나 훈련하는 사람이 아니다. 포기하지 않는 사람이다.', author:'Floyd Mayweather'},
  {text:'나는 훈련을 싫어한다. 하지만 나는 이렇게 말했다: 지금 고통받고 나머지 인생을 챔피언으로 살자.', author:'Muhammad Ali'},
  {text:'두려움은 자연스럽다. 하지만 두려움을 이겨내는 것이 용기다.', author:'Mike Tyson'},
  {text:'한 발짝 더 가는 것이 챔피언을 만든다.', author:'Rocky Balboa'},
  {text:'승리는 준비된 자에게 찾아온다.', author:'Manny Pacquiao'},
  {text:'그링에서 가장 어려운 것은 일어서는 것이다. 하지만 일어나면 이미 이긴 것이다.', author:'Canelo Alvarez'},
  {text:'노력은 배신하지 않는다. 계속하라.', author:'Lennox Lewis'},
  {text:'매일 조금씩 나아지면 된다. 어제보다 더 강해지는 것, 그것이 훈련이다.', author:'Oscar De La Hoya'}
];

function renderQuote(){
  var el = document.getElementById('v8Quote');
  if(!el) return;
  var today = new Date();
  var idx = (today.getFullYear()*366 + today.getMonth()*31 + today.getDate()) % QUOTES.length;
  var q = QUOTES[idx];
  el.innerHTML = '<div class="quote-card"><div class="quote-text">&ldquo;'+q.text+'&rdquo;</div><div class="quote-author">&mdash; '+q.author+'</div></div>';
}

// ===== SHARE CARD (Canvas) =====
function generateShareCard(){
  var appData = loadAppData();
  if(!appData) return;
  var canvas = document.createElement('canvas');
  canvas.width = 600; canvas.height = 380;
  var ctx = canvas.getContext('2d');

  var grad = ctx.createLinearGradient(0,0,600,380);
  grad.addColorStop(0,'#0f0a1e'); grad.addColorStop(1,'#1a0a2e');
  ctx.fillStyle = grad; ctx.fillRect(0,0,600,380);

  ctx.fillStyle = 'rgba(255,68,68,0.08)';
  ctx.beginPath(); ctx.arc(500,80,120,0,Math.PI*2); ctx.fill();

  ctx.fillStyle = '#FF4444';
  ctx.font = 'bold 28px -apple-system,sans-serif';
  ctx.fillText('Boxing Trainer Pro',30,45);
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '13px -apple-system,sans-serif';
  ctx.fillText('3D AI Training Report',30,65);

  ctx.fillStyle = 'rgba(255,68,68,0.3)';
  ctx.fillRect(30,80,540,1);

  var stats = [
    {label:'Total Punches',value:(appData.totalPunches||0).toLocaleString()},
    {label:'Training Time',value:(appData.totalTime||0)+'min'},
    {label:'Calories Burned',value:(appData.totalCalories||0)+'kcal'},
    {label:'Best Streak',value:(appData.bestStreak||0)+' days'},
    {label:'Sessions',value:(appData.sessions||[]).length.toString()},
    {label:'Achievements',value:Object.keys(appData.achievements||{}).length+'/24'}
  ];

  stats.forEach(function(s,i){
    var col = i % 3, row = Math.floor(i / 3);
    var x = 30+col*185, y = 110+row*100;
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    if(ctx.roundRect) ctx.roundRect(x,y,170,80,12);
    else { ctx.moveTo(x+12,y); ctx.lineTo(x+158,y); ctx.quadraticCurveTo(x+170,y,x+170,y+12); ctx.lineTo(x+170,y+68); ctx.quadraticCurveTo(x+170,y+80,x+158,y+80); ctx.lineTo(x+12,y+80); ctx.quadraticCurveTo(x,y+80,x,y+68); ctx.lineTo(x,y+12); ctx.quadraticCurveTo(x,y,x+12,y); }
    ctx.fill();
    ctx.fillStyle = '#FF4444';
    ctx.font = 'bold 26px -apple-system,sans-serif';
    ctx.fillText(s.value,x+15,y+40);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px -apple-system,sans-serif';
    ctx.fillText(s.label.toUpperCase(),x+15,y+60);
  });

  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = '10px -apple-system,sans-serif';
  ctx.fillText('PRIME Holdings | NEXTERA+PRISM | '+new Date().toLocaleDateString('ko-KR'),30,360);

  showShareOverlay(canvas);
}

function showShareOverlay(canvas){
  var overlay = document.getElementById('v8ShareOverlay');
  if(!overlay) return;
  var panel = overlay.querySelector('.share-panel');
  var existing = panel.querySelector('canvas');
  if(existing) existing.remove();
  panel.querySelector('.share-actions').insertAdjacentElement('beforebegin', canvas);
  overlay.classList.add('open');
}

function downloadShareCard(){
  var overlay = document.getElementById('v8ShareOverlay');
  var canvas = overlay ? overlay.querySelector('canvas') : null;
  if(!canvas) return;
  var link = document.createElement('a');
  link.download = 'boxing-trainer-stats.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function copyShareCard(){
  var overlay = document.getElementById('v8ShareOverlay');
  var canvas = overlay ? overlay.querySelector('canvas') : null;
  if(!canvas) return;
  canvas.toBlob(function(blob){
    if(navigator.clipboard && navigator.clipboard.write){
      navigator.clipboard.write([new ClipboardItem({'image/png':blob})]).then(function(){
        showToastV8('📋 이미지가 클립보드에 복사되었습니다!');
      });
    }
  });
}

function showToastV8(msg){
  var c = document.getElementById('toastContainer');
  if(!c) return;
  var t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  c.appendChild(t);
  setTimeout(function(){ t.remove(); }, 3000);
}

// ===== KEYBOARD SHORTCUTS =====
var SHORTCUTS = [
  {key:'T',desc:'훈련 시작'},
  {key:'D',desc:'다크/라이트 모드'},
  {key:'S',desc:'설정 열기'},
  {key:'M',desc:'BGM 토글'},
  {key:'W',desc:'워밍업 시작'},
  {key:'?',desc:'단축키 도움말'}
];

function setupKeyboardShortcuts(){
  document.addEventListener('keydown', function(e){
    if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch(e.key.toLowerCase()){
      case 't': var b = document.getElementById('startBtn'); if(b) b.click(); break;
      case 'd': var b2 = document.getElementById('themeToggle'); if(b2) b2.click(); break;
      case 's': var b3 = document.getElementById('settingsBtn'); if(b3) b3.click(); break;
      case 'm': var b4 = document.getElementById('bgmToggle'); if(b4) b4.click(); break;
      case 'w': var b5 = document.getElementById('warmupStart'); if(b5) b5.click(); break;
      case '?': toggleKbdOverlay(); break;
    }
  });
}

function toggleKbdOverlay(){
  var o = document.getElementById('v8KbdOverlay');
  if(o) o.classList.toggle('open');
}

// ===== SEO META INJECTION =====
function injectSEO(){
  var head = document.head;
  var metas = [
    {property:'og:title',content:'Boxing Trainer Pro - 3D AI 복싱 트레이너'},
    {property:'og:description',content:'Three.js 기반 3D 복싱 트레이닝. 라운드 타이머, 섀도우복싱, 파티클 효과, 24업적, 라이벌시스템. PWA 오프라인 지원.'},
    {property:'og:type',content:'website'},
    {name:'twitter:card',content:'summary_large_image'},
    {name:'twitter:title',content:'Boxing Trainer Pro'},
    {name:'twitter:description',content:'3D AI 복싱 트레이닝 앱 - PWA 오프라인 지원'}
  ];
  metas.forEach(function(m){
    var tag = document.createElement('meta');
    if(m.property) tag.setAttribute('property',m.property);
    if(m.name) tag.setAttribute('name',m.name);
    tag.setAttribute('content',m.content);
    head.appendChild(tag);
  });
  var ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    "@context":"https://schema.org","@type":"WebApplication",
    "name":"Boxing Trainer Pro",
    "description":"3D AI 복싱 트레이닝 앱. Three.js 3D 복서, 라운드 타이머, 섀도우복싱, 24업적, 랭크시스템.",
    "applicationCategory":"HealthApplication","operatingSystem":"Web Browser",
    "offers":{"@type":"Offer","price":"0","priceCurrency":"KRW"},
    "author":{"@type":"Organization","name":"PRIME Holdings"}
  });
  head.appendChild(ld);
}

// ===== ACCESSIBILITY =====
function injectAccessibility(){
  var skipLink = document.createElement('a');
  skipLink.className = 'skip-link';
  skipLink.href = '#main-content';
  skipLink.textContent = '본문으로 건너뛰기';
  document.body.insertBefore(skipLink, document.body.firstChild);
  var container = document.querySelector('.container');
  if(container){
    container.id = 'main-content';
    container.setAttribute('role','main');
    container.setAttribute('tabindex','-1');
  }
  document.querySelectorAll('.section-title').forEach(function(el){
    el.setAttribute('role','heading');
    el.setAttribute('aria-level','2');
  });
  document.querySelectorAll('.icon-btn').forEach(function(el){
    if(!el.getAttribute('aria-label')){
      el.setAttribute('aria-label',el.getAttribute('title')||'button');
      el.setAttribute('role','button');
      el.setAttribute('tabindex','0');
    }
  });
}

// ===== HTML INJECTION =====
function injectSections(){
  var container = document.querySelector('.container');
  if(!container) return;
  var sections = container.querySelectorAll('.section');
  if(sections.length < 2) return;

  var challengeSection = document.createElement('section');
  challengeSection.className = 'section v8-section';
  challengeSection.innerHTML = '<h2 class="section-title"><span class="emoji">🎯</span> 오늘의 챌린지</h2><div id="v8DailyChallenge"></div>';
  sections[0].parentNode.insertBefore(challengeSection, sections[0].nextSibling);

  var quoteSection = document.createElement('section');
  quoteSection.className = 'section v8-section';
  quoteSection.innerHTML = '<h2 class="section-title"><span class="emoji">💬</span> 오늘의 명언</h2><div id="v8Quote"></div>';
  challengeSection.parentNode.insertBefore(quoteSection, challengeSection.nextSibling);

  var prSection = document.createElement('section');
  prSection.className = 'section v8-section';
  prSection.innerHTML = '<h2 class="section-title"><span class="emoji">🏆</span> 개인 기록 (PR)</h2><div id="v8PersonalRecords"></div>';
  var calorieSec = container.querySelectorAll('.section')[2];
  if(calorieSec) calorieSec.parentNode.insertBefore(prSection, calorieSec.nextSibling);

  var bodySection = document.createElement('section');
  bodySection.className = 'section v8-section';
  bodySection.innerHTML = '<h2 class="section-title"><span class="emoji">🥊</span> 펀치 존 분석</h2><div class="card"><div id="v8BodyZone"></div></div>';
  prSection.parentNode.insertBefore(bodySection, prSection.nextSibling);

  var programSection = null;
  var allSections = container.querySelectorAll('.section');
  for(var i=0;i<allSections.length;i++){
    var t = allSections[i].querySelector('.section-title');
    if(t && t.textContent.indexOf('프로그램') >= 0){ programSection = allSections[i]; break; }
  }
  if(programSection){
    var warmupSection = document.createElement('section');
    warmupSection.className = 'section v8-section';
    warmupSection.innerHTML = '<h2 class="section-title"><span class="emoji">🏃</span> 워밍업 가이드</h2><div class="card"><div id="v8Warmup"></div></div>';
    programSection.parentNode.insertBefore(warmupSection, programSection);
  }

  var achieveSection = null;
  for(var j=0;j<allSections.length;j++){
    var t2 = allSections[j].querySelector('.section-title');
    if(t2 && t2.textContent.indexOf('업적') >= 0){ achieveSection = allSections[j]; break; }
  }
  if(achieveSection){
    var techSection = document.createElement('section');
    techSection.className = 'section v8-section';
    techSection.innerHTML = '<h2 class="section-title"><span class="emoji">📚</span> 테크닉 도감</h2><div id="v8TechLibrary"></div>';
    achieveSection.parentNode.insertBefore(techSection, achieveSection.nextSibling);
  }

  var footerBtns = document.querySelector('.footer > div:last-child');
  if(footerBtns){
    var shareBtn = document.createElement('button');
    shareBtn.className = 'share-btn';
    shareBtn.id = 'v8ShareBtn';
    shareBtn.innerHTML = '📷 공유 카드 생성';
    footerBtns.insertBefore(shareBtn, footerBtns.firstChild);
    shareBtn.addEventListener('click', generateShareCard);
  }

  var shareOverlay = document.createElement('div');
  shareOverlay.className = 'share-overlay';
  shareOverlay.id = 'v8ShareOverlay';
  shareOverlay.innerHTML = '<div class="share-panel"><div style="font-size:18px;font-weight:800;margin-bottom:10px">📷 훈련 성적 카드</div><div class="share-actions"><button class="warmup-btn primary" id="v8DownloadCard">📥 다운로드</button><button class="warmup-btn secondary" id="v8CopyCard">📋 복사</button><button class="warmup-btn secondary" id="v8CloseShare">✕ 닫기</button></div></div>';
  document.body.appendChild(shareOverlay);
  document.getElementById('v8DownloadCard').addEventListener('click', downloadShareCard);
  document.getElementById('v8CopyCard').addEventListener('click', copyShareCard);
  document.getElementById('v8CloseShare').addEventListener('click', function(){ document.getElementById('v8ShareOverlay').classList.remove('open'); });
  shareOverlay.addEventListener('click', function(e){ if(e.target===this) this.classList.remove('open'); });

  var kbdHelp = document.createElement('div');
  kbdHelp.className = 'kbd-help';
  kbdHelp.innerHTML = '⌨ 단축키';
  kbdHelp.addEventListener('click', toggleKbdOverlay);
  document.body.appendChild(kbdHelp);

  var kbdOverlay = document.createElement('div');
  kbdOverlay.className = 'kbd-overlay';
  kbdOverlay.id = 'v8KbdOverlay';
  var kbdRows = '';
  SHORTCUTS.forEach(function(s){ kbdRows += '<div class="kbd-row"><span class="kbd-key">'+s.key+'</span><span class="kbd-desc">'+s.desc+'</span></div>'; });
  kbdOverlay.innerHTML = '<div class="kbd-panel"><div class="kbd-title">⌨ 키보드 단축키</div>'+kbdRows+'<button class="warmup-btn primary" style="width:100%;margin-top:14px" id="v8KbdClose">닫기</button></div>';
  kbdOverlay.addEventListener('click', function(e){ if(e.target===this) this.classList.remove('open'); });
  document.body.appendChild(kbdOverlay);
  document.getElementById('v8KbdClose').addEventListener('click', function(){ document.getElementById('v8KbdOverlay').classList.remove('open'); });

  var footerVer = document.querySelector('.footer-ver');
  if(footerVer) footerVer.textContent = 'Boxing Trainer Pro v8.0 | PWA Enabled';
}

// ===== INIT =====
function init(){
  injectCSS();
  injectSEO();
  injectAccessibility();
  injectSections();
  renderDailyChallenge();
  renderQuote();
  renderPersonalRecords();
  renderBodyZone();
  renderWarmup();
  renderTechLibrary();
  setupKeyboardShortcuts();
  setInterval(renderDailyChallenge, 60000);
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
