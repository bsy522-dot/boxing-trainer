// Boxing Trainer Pro v16_patch.js - NEXTERA+PRISM Auto Enhancement Module
// Speed Bag Rhythm Trainer Canvas BPM+streak, Fight IQ Scenario 12situations,
// Boxing Cardio Zone 6zones Canvas, Round Timer Pro custom intervals,
// Cornerman Strategy Sim 10scenarios, Boxing Physical Test 8categories Radar Canvas,
// Sparring Partner AI 6styles Canvas, Punch Chronicle 12eras,
// Quiz +15 (105->120), +12 Achievements (106->118), SFX 12, Keyboard +8
(function(){
'use strict';

var STORAGE_KEY = 'boxingTrainerData';
var V16KEY = 'boxingV16Patch';

function loadAppData(){
  try { var r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch(e){ return null; }
}
function loadV16(){
  try {
    var r = localStorage.getItem(V16KEY);
    if(!r) return defV16();
    var p = JSON.parse(r), d = defV16();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV16(); }
}
function saveV16(d){ try { localStorage.setItem(V16KEY, JSON.stringify(d)); } catch(e){} }
function defV16(){
  return {
    speedBag: { bestStreak: 0, totalHits: 0, sessions: 0, bestBPM: 0 },
    fightIQ: { completed: [], totalScore: 0, bestScore: 0 },
    cardioZone: { sessions: [], totalCals: 0, favoriteZone: '' },
    roundTimer: { presets: [], totalRounds: 0, totalTime: 0 },
    cornerman: { completed: [], wins: 0 },
    physicalTest: { results: [], bestGrade: '' },
    sparring: { wins: 0, losses: 0, draws: 0, favoriteStyle: '' },
    chronicle: { viewed: [], quizDone: false },
    quizV16Scores: {},
    achievementsV16: {},
    featureUsage: {}
  };
}

var v16 = loadV16();

// ===== SFX ENGINE V16 =====
function playSFX16(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'speedbag_hit':
        var buf=ctx.createBuffer(1,ctx.sampleRate*0.03,ctx.sampleRate);
        var dd=buf.getChannelData(0);
        for(var i=0;i<dd.length;i++) dd[i]=(Math.random()*2-1)*Math.exp(-i/(dd.length*0.1));
        var src=ctx.createBufferSource(),gn=ctx.createGain();
        src.buffer=buf;gn.gain.setValueAtTime(0.2,t);gn.gain.exponentialRampToValueAtTime(0.001,t+0.04);
        src.connect(gn).connect(ctx.destination);src.start(t);break;
      case 'speedbag_streak':
        [660,880,1100].forEach(function(f,j){
          var o=ctx.createOscillator(),g=ctx.createGain();
          o.type='sine';o.frequency.value=f;
          g.gain.setValueAtTime(0.08,t+j*0.06);g.gain.exponentialRampToValueAtTime(0.001,t+j*0.06+0.12);
          o.connect(g).connect(ctx.destination);o.start(t+j*0.06);o.stop(t+j*0.06+0.12);
        });break;
      case 'fightiq_correct':
        var o1=ctx.createOscillator(),g1=ctx.createGain();
        o1.type='triangle';o1.frequency.setValueAtTime(523,t);o1.frequency.exponentialRampToValueAtTime(784,t+0.15);
        g1.gain.setValueAtTime(0.1,t);g1.gain.exponentialRampToValueAtTime(0.001,t+0.2);
        o1.connect(g1).connect(ctx.destination);o1.start(t);o1.stop(t+0.2);break;
      case 'fightiq_wrong':
        var o2=ctx.createOscillator(),g2=ctx.createGain();
        o2.type='sawtooth';o2.frequency.setValueAtTime(300,t);o2.frequency.exponentialRampToValueAtTime(150,t+0.2);
        g2.gain.setValueAtTime(0.08,t);g2.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o2.connect(g2).connect(ctx.destination);o2.start(t);o2.stop(t+0.25);break;
      case 'cardio_zone':
        [392,494,587].forEach(function(f,j){
          var o3=ctx.createOscillator(),g3=ctx.createGain();
          o3.type='square';o3.frequency.value=f;
          g3.gain.setValueAtTime(0.05,t+j*0.07);g3.gain.exponentialRampToValueAtTime(0.001,t+j*0.07+0.15);
          o3.connect(g3).connect(ctx.destination);o3.start(t+j*0.07);o3.stop(t+j*0.07+0.15);
        });break;
      case 'round_bell':
        var o4=ctx.createOscillator(),g4=ctx.createGain();
        o4.type='sine';o4.frequency.setValueAtTime(800,t);
        g4.gain.setValueAtTime(0.15,t);g4.gain.exponentialRampToValueAtTime(0.001,t+0.8);
        o4.connect(g4).connect(ctx.destination);o4.start(t);o4.stop(t+0.8);break;
      case 'corner_advice':
        var o5=ctx.createOscillator(),g5=ctx.createGain();
        o5.type='sine';o5.frequency.setValueAtTime(440,t);o5.frequency.linearRampToValueAtTime(550,t+0.1);
        g5.gain.setValueAtTime(0.07,t);g5.gain.exponentialRampToValueAtTime(0.001,t+0.15);
        o5.connect(g5).connect(ctx.destination);o5.start(t);o5.stop(t+0.15);break;
      case 'physical_test':
        [262,330,392,523].forEach(function(f,j){
          var o6=ctx.createOscillator(),g6=ctx.createGain();
          o6.type='triangle';o6.frequency.value=f;
          g6.gain.setValueAtTime(0.07,t+j*0.1);g6.gain.exponentialRampToValueAtTime(0.001,t+j*0.1+0.15);
          o6.connect(g6).connect(ctx.destination);o6.start(t+j*0.1);o6.stop(t+j*0.1+0.15);
        });break;
      case 'sparring_punch':
        var buf2=ctx.createBuffer(1,ctx.sampleRate*0.06,ctx.sampleRate);
        var d2=buf2.getChannelData(0);
        for(var ii=0;ii<d2.length;ii++) d2[ii]=(Math.random()*2-1)*Math.exp(-ii/(d2.length*0.12));
        var src2=ctx.createBufferSource(),gn2=ctx.createGain();
        src2.buffer=buf2;gn2.gain.setValueAtTime(0.18,t);gn2.gain.exponentialRampToValueAtTime(0.001,t+0.08);
        src2.connect(gn2).connect(ctx.destination);src2.start(t);break;
      case 'sparring_win':
        [523,659,784,1047].forEach(function(f,j){
          var o7=ctx.createOscillator(),g7=ctx.createGain();
          o7.type='sine';o7.frequency.value=f;
          g7.gain.setValueAtTime(0.1,t+j*0.12);g7.gain.exponentialRampToValueAtTime(0.001,t+j*0.12+0.25);
          o7.connect(g7).connect(ctx.destination);o7.start(t+j*0.12);o7.stop(t+j*0.12+0.25);
        });break;
      case 'chronicle_open':
        var o8=ctx.createOscillator(),g8=ctx.createGain();
        o8.type='sine';o8.frequency.setValueAtTime(350,t);o8.frequency.linearRampToValueAtTime(700,t+0.2);
        g8.gain.setValueAtTime(0.06,t);g8.gain.exponentialRampToValueAtTime(0.001,t+0.25);
        o8.connect(g8).connect(ctx.destination);o8.start(t);o8.stop(t+0.25);break;
      case 'achieve_v16':
        [523,659,784,1047,1319].forEach(function(f,j){
          var o9=ctx.createOscillator(),g9=ctx.createGain();
          o9.type='triangle';o9.frequency.value=f;
          g9.gain.setValueAtTime(0.08,t+j*0.08);g9.gain.exponentialRampToValueAtTime(0.001,t+j*0.08+0.2);
          o9.connect(g9).connect(ctx.destination);o9.start(t+j*0.08);o9.stop(t+j*0.08+0.2);
        });break;
    }
    setTimeout(function(){ ctx.close(); }, 2000);
  } catch(e){}
}

// ===== UTILITY =====
function el(id){ return document.getElementById(id); }
function ce(tag){ return document.createElement(tag); }
function qs(sel){ return document.querySelector(sel); }

function trackFeature(name){
  if(!v16.featureUsage[name]) v16.featureUsage[name] = 0;
  v16.featureUsage[name]++;
  saveV16(v16);
}

function shuffleArray(arr){
  var a = arr.slice();
  for(var i=a.length-1;i>0;i--){
    var j=Math.floor(Math.random()*(i+1));
    var tmp=a[i];a[i]=a[j];a[j]=tmp;
  }
  return a;
}

function gradeFromScore(pct){
  if(pct>=95) return 'S';
  if(pct>=85) return 'A';
  if(pct>=70) return 'B';
  if(pct>=50) return 'C';
  return 'D';
}

var gradeColors = {S:'#FFD700',A:'#22c55e',B:'#3b82f6',C:'#f97316',D:'#ef4444'};

// ===== MODAL SYSTEM =====
function openModal16(title, contentHTML){
  var existing = el('v16-modal-overlay');
  if(existing) existing.remove();
  var overlay = ce('div');
  overlay.id = 'v16-modal-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px);animation:fadeIn 0.2s';
  var modal = ce('div');
  modal.style.cssText = 'background:var(--bg,#0f0a1e);border:1px solid rgba(255,255,255,0.1);border-radius:16px;max-width:680px;width:100%;max-height:85vh;overflow-y:auto;padding:0;animation:slideUp 0.3s ease-out;position:relative';
  var header = ce('div');
  header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.08);position:sticky;top:0;background:var(--bg,#0f0a1e);z-index:1;border-radius:16px 16px 0 0';
  header.innerHTML = '<span style="font-size:17px;font-weight:800;color:var(--accent,#FF4444)">' + title + '</span><button onclick="document.getElementById(\'v16-modal-overlay\').remove()" style="width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:var(--text,#f0f0f0);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center">&times;</button>';
  var body = ce('div');
  body.style.cssText = 'padding:20px';
  body.innerHTML = contentHTML;
  modal.appendChild(header);
  modal.appendChild(body);
  overlay.appendChild(modal);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  return body;
}

// ===== 1. SPEED BAG RHYTHM TRAINER =====
var SPEEDBAG_PATTERNS = [
  {name:'기본 리듬', bpm:120, pattern:[1,0,1,0,1,0,1,0], desc:'균일한 간격으로 치기'},
  {name:'더블 탭', bpm:140, pattern:[1,1,0,1,1,0,1,1], desc:'두 번 치고 한 번 쉬기'},
  {name:'트리플 탭', bpm:160, pattern:[1,1,1,0,1,1,1,0], desc:'세 번 치고 한 번 쉬기'},
  {name:'랠덤 버스트', bpm:180, pattern:[1,0,1,1,0,1,0,1], desc:'불규칙 타이밍 연습'},
  {name:'스피드 러쉬', bpm:200, pattern:[1,1,1,1,1,1,1,1], desc:'최고 속도로 연속 타격'},
  {name:'시넌시스', bpm:100, pattern:[1,0,0,1,0,0,1,0], desc:'느린 템포로 정확하게'}
];

function openSpeedBag(){
  trackFeature('speedBag');
  playSFX16('speedbag_hit');
  var html = '<div style="text-align:center;margin-bottom:16px"><p style="color:var(--text-dim);font-size:13px">스피드백을 리듬에 맞춰 치세요! 타이밍에 맞춰 클릭/탭하세요.</p></div>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:16px">';
  SPEEDBAG_PATTERNS.forEach(function(p,i){
    html += '<button onclick="window._startSpeedBag('+i+')" style="padding:12px 8px;background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;color:var(--text);cursor:pointer;text-align:center"><div style="font-size:15px;font-weight:700">'+p.name+'</div><div style="font-size:11px;color:var(--text-dim);margin-top:4px">'+p.bpm+' BPM</div><div style="font-size:10px;color:var(--text-muted);margin-top:2px">'+p.desc+'</div></button>';
  });
  html += '</div>';
  html += '<div id="speedbag-area" style="text-align:center"></div>';
  html += '<div style="margin-top:16px;padding:12px;background:var(--glass);border-radius:12px"><div style="font-size:13px;font-weight:700;margin-bottom:8px">기록</div><div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;font-size:12px;color:var(--text-dim)"><span>최고 연속: <b style="color:var(--gold)">'+v16.speedBag.bestStreak+'</b></span><span>총 히트: <b style="color:var(--accent)">'+v16.speedBag.totalHits+'</b></span><span>세션: <b style="color:var(--green)">'+v16.speedBag.sessions+'</b></span></div></div>';
  openModal16('🥊 스피드백 리듬 트레이너', html);
}

window._startSpeedBag = function(idx){
  var p = SPEEDBAG_PATTERNS[idx];
  var area = el('speedbag-area');
  if(!area) return;
  var streak = 0, hits = 0, beatIdx = 0, isRunning = true, missCount = 0;
  var interval = 60000 / p.bpm;
  var canHit = false, hitWindow = interval * 0.35;

  area.innerHTML = '<canvas id="speedbag-canvas" width="400" height="300" style="max-width:100%;border-radius:12px;background:#111;cursor:pointer"></canvas><div style="margin-top:12px"><span style="font-size:24px;font-weight:900;color:var(--accent)" id="sb-streak">0</span> <span style="color:var(--text-dim);font-size:12px">연속</span>&nbsp;&nbsp;<span style="font-size:18px;font-weight:700;color:var(--green)" id="sb-hits">0</span> <span style="color:var(--text-dim);font-size:12px">히트</span>&nbsp;&nbsp;<button onclick="window._stopSpeedBag()" style="padding:6px 16px;background:var(--accent);border:none;border-radius:8px;color:#fff;cursor:pointer;font-size:12px">종료</button></div>';

  var canvas = el('speedbag-canvas');
  var ctx = canvas.getContext('2d');
  var bagAngle = 0, bagVel = 0;

  function drawBag(){
    ctx.clearRect(0,0,400,300);
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0,0,400,300);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(200,0);
    ctx.lineTo(200,60);
    ctx.stroke();
    ctx.save();
    ctx.translate(200,60);
    ctx.rotate(bagAngle*Math.PI/180);
    var grd = ctx.createRadialGradient(0,40,5,0,40,35);
    grd.addColorStop(0,'#FF6644');
    grd.addColorStop(1,'#AA2222');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.ellipse(0,40,25,35,0,0,Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#FF8866';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
    var beatPct = (beatIdx % p.pattern.length) / p.pattern.length;
    ctx.fillStyle = 'rgba(255,68,68,0.1)';
    ctx.fillRect(0,260,400*beatPct,40);
    for(var bi=0;bi<p.pattern.length;bi++){
      var x = (bi/p.pattern.length)*380+10;
      ctx.fillStyle = p.pattern[bi] ? (bi===(beatIdx%p.pattern.length)?'#FF4444':'#FF444466') : '#33333366';
      ctx.fillRect(x,270,380/p.pattern.length-4,20);
      ctx.strokeStyle = '#444';
      ctx.strokeRect(x,270,380/p.pattern.length-4,20);
    }
    ctx.fillStyle = '#fff';
    ctx.font = '11px sans-serif';
    ctx.fillText(p.name+' | '+p.bpm+' BPM',10,20);
    if(canHit){
      ctx.fillStyle = 'rgba(34,197,94,0.3)';
      ctx.fillRect(0,250,400,8);
    }
    bagAngle *= 0.92;
    bagVel *= 0.92;
    bagAngle += bagVel;
  }

  function onHit(){
    if(!isRunning) return;
    if(canHit && p.pattern[beatIdx % p.pattern.length]===1){
      streak++;
      hits++;
      bagVel = (Math.random()>0.5?1:-1)*8;
      playSFX16('speedbag_hit');
      if(streak>0 && streak%10===0) playSFX16('speedbag_streak');
      missCount=0;
    } else {
      if(streak>5) playSFX16('fightiq_wrong');
      streak=0;
      missCount++;
    }
    var sEl = el('sb-streak');
    var hEl = el('sb-hits');
    if(sEl) sEl.textContent = streak;
    if(hEl) hEl.textContent = hits;
  }

  canvas.addEventListener('click', onHit);
  canvas.addEventListener('touchstart', function(e){ e.preventDefault(); onHit(); }, {passive:false});

  var beatTimer = setInterval(function(){
    if(!isRunning) return;
    canHit = true;
    setTimeout(function(){ canHit=false; }, hitWindow);
    beatIdx++;
  }, interval);

  var animFrame;
  function animate(){
    if(!isRunning) return;
    drawBag();
    animFrame = requestAnimationFrame(animate);
  }
  animate();

  window._stopSpeedBag = function(){
    isRunning = false;
    clearInterval(beatTimer);
    cancelAnimationFrame(animFrame);
    v16.speedBag.totalHits += hits;
    v16.speedBag.sessions++;
    if(streak > v16.speedBag.bestStreak) v16.speedBag.bestStreak = streak;
    saveV16(v16);
    checkAchievementsV16();
    area.innerHTML = '<div style="padding:20px;text-align:center"><div style="font-size:16px;font-weight:700;margin-bottom:8px">세션 완료!</div><div style="color:var(--text-dim);font-size:13px">히트: '+hits+' | 최고 연속: '+streak+'</div></div>';
  };
};

// ===== 2. FIGHT IQ SCENARIO =====
var FIGHTIQ_SCENARIOS = [
  {q:'상대가 왼손 가드를 낮춘 순간, 최선의 공격은?', opts:['오른손 스트레이트','왼손 훅','바디샷','후퇴'], correct:0, tip:'가드가 열린 순간 스트레이트가 가장 빠르고 정확합니다'},
  {q:'로프 위에서 압박을 받을 때 최선의 방어 전략은?', opts:['클린치로 휴식','후퇴 후 잭','피봇으로 이탈','업퍼컷으로 반격'], correct:2, tip:'피봇으로 각도를 바꾸면 압박을 풀 수 있습니다'},
  {q:'상대가 어퍼컷을 던질 때 최적의 카운터는?', opts:['백스텝으로 회피','슬립 후 오버핸드','블록 후 바디샷','풀백으로 거리 유지'], correct:1, tip:'슬립으로 피한 후 오버핸드가 효과적입니다'},
  {q:'체력이 떨어진 후반 라운드에서 최선의 전략은?', opts:['공격적으로 나가기','클린치와 홀딩으로 버티기','잭 위주로 거리 유지','방어만 하기'], correct:2, tip:'잭으로 거리를 유지하며 체력을 아끼세요'},
  {q:'사우스포 스탠스의 상대에게 효과적인 공격은?', opts:['왼손 훅 위주','오른손 스트레이트','바디샷 + 오른 업퍼컷','더블 잭'], correct:2, tip:'사우스포는 왼손 가드가 단단하므로 바디샷이 효과적입니다'},
  {q:'판정승으로 리드하는 마지막 라운드에서 해야 할 것은?', opts:['공격적 러시','휴식하며 시간 끌기','잭으로 포인트 쌓기','피봇으로 이동'], correct:2, tip:'리드 중이면 잭으로 포인트를 계속 쌓으세요'},
  {q:'상대가 빠른 잭을 많이 던질 때 대처법은?', opts:['솔더롤로 방어','해드무브로 회피','파리 후 카운터 잭','동시에 잭 던지기'], correct:2, tip:'파리로 잭을 치운 후 카운터 잭이 효과적입니다'},
  {q:'아웃박서 스타일 복서의 핵심 원칙은?', opts:['근접 전투','거리 유지 + 잭','클린치 위주','파워 펄치'], correct:1, tip:'아웃박서는 거리를 유지하며 잭으로 포인트를 딱니다'},
  {q:'피카부 스타일의 핵심 방어 기술은?', opts:['패리','슬립','피카부 가드(손 얼굴)','밥 앤드 위브'], correct:2, tip:'피카부는 손을 얼굴에 붙여 방어하는 스타일입니다'},
  {q:'스위치 히터(오솔바/정통 전환) 사용 시 가장 효과적인 타이밍은?', opts:['라운드 시작','상대 공격 직후','클린치 후','상대가 방어할 때'], correct:1, tip:'상대 공격 직후 방어 자세로 복귀하는 순간이 가장 취약합니다'},
  {q:'다운 파이터에게 효과적인 공격 방법은?', opts:['오버핸드 라이트','잭 위주 공격','업퍼컷 위주','바디샷 + 훅'], correct:2, tip:'다운 파이터는 가드가 낮으므로 업퍼컷이 효과적입니다'},
  {q:'복싱에서 어떤 펄치가 가장 긴 리치를 가지나요?', opts:['잭','크로스','오버핸드 라이트','스트레이트 라이트'], correct:3, tip:'스트레이트 라이트(후방손)\'s full extension gives the longest reach'}
];

function openFightIQ(){
  trackFeature('fightIQ');
  playSFX16('fightiq_correct');
  var qIdx = 0, score = 0, total = FIGHTIQ_SCENARIOS.length;
  var shuffled = shuffleArray(FIGHTIQ_SCENARIOS);

  function renderQ(){
    var s = shuffled[qIdx];
    var shuffledOpts = s.opts.map(function(o,i){ return {text:o, idx:i}; });
    shuffledOpts = shuffleArray(shuffledOpts);
    var html = '<div style="margin-bottom:12px;font-size:13px;color:var(--text-dim)">시나리오 '+(qIdx+1)+'/'+total+' | 점수: '+score+'</div>';
    html += '<div style="padding:16px;background:var(--glass);border-radius:12px;margin-bottom:16px"><div style="font-size:15px;font-weight:700;margin-bottom:4px">'+s.q+'</div></div>';
    html += '<div style="display:grid;gap:8px" id="fiq-opts">';
    shuffledOpts.forEach(function(o,j){
      html += '<button onclick="window._fiqAnswer('+o.idx+')" style="padding:12px 16px;background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;color:var(--text);cursor:pointer;text-align:left;font-size:13px;transition:all 0.2s">'+String.fromCharCode(65+j)+'. '+o.text+'</button>';
    });
    html += '</div><div id="fiq-feedback" style="margin-top:12px"></div>';
    return html;
  }

  window._fiqAnswer = function(chosen){
    var s = shuffled[qIdx];
    var fb = el('fiq-feedback');
    if(!fb) return;
    if(chosen === s.correct){
      score++;
      playSFX16('fightiq_correct');
      fb.innerHTML = '<div style="padding:12px;background:rgba(34,197,94,0.15);border-radius:10px;border:1px solid rgba(34,197,94,0.3)"><div style="color:#22c55e;font-weight:700">정답!</div><div style="font-size:12px;color:var(--text-dim);margin-top:4px">'+s.tip+'</div></div>';
    } else {
      playSFX16('fightiq_wrong');
      fb.innerHTML = '<div style="padding:12px;background:rgba(239,68,68,0.15);border-radius:10px;border:1px solid rgba(239,68,68,0.3)"><div style="color:#ef4444;font-weight:700">오답! 정답: '+s.opts[s.correct]+'</div><div style="font-size:12px;color:var(--text-dim);margin-top:4px">'+s.tip+'</div></div>';
    }
    var optsEl = el('fiq-opts');
    if(optsEl) optsEl.querySelectorAll('button').forEach(function(b){ b.disabled=true; b.style.opacity='0.5'; });
    setTimeout(function(){
      qIdx++;
      if(qIdx < total){
        var body = qs('#v16-modal-overlay .v16-fiq-body');
        if(body) body.innerHTML = renderQ();
      } else {
        var pct = Math.round(score/total*100);
        var grade = gradeFromScore(pct);
        v16.fightIQ.totalScore += score;
        if(score > v16.fightIQ.bestScore) v16.fightIQ.bestScore = score;
        v16.fightIQ.completed.push({score:score,total:total,date:new Date().toISOString().slice(0,10)});
        if(v16.fightIQ.completed.length > 20) v16.fightIQ.completed = v16.fightIQ.completed.slice(-20);
        saveV16(v16);
        checkAchievementsV16();
        var body2 = qs('#v16-modal-overlay .v16-fiq-body');
        if(body2) body2.innerHTML = '<div style="text-align:center;padding:20px"><div style="font-size:48px;font-weight:900;color:'+gradeColors[grade]+'">'+grade+'</div><div style="font-size:14px;color:var(--text-dim);margin-top:8px">'+score+'/'+total+' 정답 ('+pct+'%)</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px">최고 점수: '+v16.fightIQ.bestScore+'/'+total+'</div></div>';
      }
    }, 1500);
  };

  var mBody = openModal16('🧠 파이트 IQ 시나리오', '<div class="v16-fiq-body">'+renderQ()+'</div>');
  mBody.querySelector('div').className = 'v16-fiq-body';
}

// ===== 3. BOXING CARDIO ZONE =====
var CARDIO_ZONES = [
  {name:'워밍업 존', hr:'50-60%', color:'#3b82f6', desc:'가벼운 섬도우박싱', cal:4, exercises:['잭 드릴','라이트 풀워크','심호흡 운동']},
  {name:'지방연소 존', hr:'60-70%', color:'#22c55e', desc:'중간 강도 콤비네이션', cal:6, exercises:['잭-크로스 콤보','섬도우박싱','라이트 방어']},
  {name:'유산소 존', hr:'70-80%', color:'#f97316', desc:'빠른 콤보 + 풀워크', cal:8, exercises:['파워 콤보','상체 회전 펄치','방어+카운터']},
  {name:'무산소 존', hr:'80-90%', color:'#ef4444', desc:'고강도 버스트 트레이닝', cal:12, exercises:['파워펄치 버스트','스피드 콤보','밥앤위브']},
  {name:'MAX 존', hr:'90-100%', color:'#a855f7', desc:'최대 강도 스프린트', cal:15, exercises:['올아웃 스프린트','파워 1-2-3-2','타바타 콤보']},
  {name:'회복 존', hr:'40-50%', color:'#6b7280', desc:'가벼운 스트레칭 + 호흡', cal:2, exercises:['가벼운 섬도우','스트레칭','심호흡 운동']}
];

function openCardioZone(){
  trackFeature('cardioZone');
  playSFX16('cardio_zone');
  var html = '<div style="margin-bottom:16px"><p style="font-size:13px;color:var(--text-dim)">심박수 존별 복싱 카디오 프로그램. 심박수에 따라 존을 선택하세요.</p></div>';
  html += '<canvas id="cardio-canvas" width="560" height="200" style="width:100%;border-radius:12px;background:#111;margin-bottom:16px"></canvas>';
  html += '<div style="display:grid;gap:10px">';
  CARDIO_ZONES.forEach(function(z,i){
    html += '<div style="padding:14px;background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;cursor:pointer;transition:all 0.2s" onclick="window._startCardioZone('+i+')">';
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px"><div style="width:12px;height:12px;border-radius:50%;background:'+z.color+'"></div><span style="font-size:14px;font-weight:700">'+z.name+'</span><span style="font-size:11px;color:var(--text-dim);margin-left:auto">'+z.hr+' | ~'+z.cal+' kcal/min</span></div>';
    html += '<div style="font-size:12px;color:var(--text-dim)">'+z.desc+'</div>';
    html += '<div style="margin-top:6px;font-size:11px;color:var(--text-muted)">운동: '+z.exercises.join(', ')+'</div>';
    html += '</div>';
  });
  html += '</div>';
  html += '<div style="margin-top:16px;padding:12px;background:var(--glass);border-radius:12px"><div style="font-size:13px;font-weight:700;margin-bottom:6px">카디오 통계</div><div style="font-size:12px;color:var(--text-dim)">총 세션: '+v16.cardioZone.sessions.length+' | 총 칼로리: '+v16.cardioZone.totalCals+' kcal</div></div>';

  var mBody = openModal16('💪 복싱 카디오 존', html);

  setTimeout(function(){
    var canvas = el('cardio-canvas');
    if(!canvas) return;
    var cctx = canvas.getContext('2d');
    cctx.fillStyle = '#111';
    cctx.fillRect(0,0,560,200);
    var barW = 560/CARDIO_ZONES.length;
    CARDIO_ZONES.forEach(function(z,i){
      var h = (z.cal/15)*160;
      cctx.fillStyle = z.color+'44';
      cctx.fillRect(i*barW+8, 200-h-10, barW-16, h);
      cctx.fillStyle = z.color;
      cctx.fillRect(i*barW+8, 200-h-10, barW-16, 4);
      cctx.fillStyle = '#fff';
      cctx.font = '10px sans-serif';
      cctx.textAlign = 'center';
      cctx.fillText(z.name.replace(' 존',''), i*barW+barW/2, 200-h-16);
      cctx.fillStyle = z.color;
      cctx.fillText(z.cal+' kcal', i*barW+barW/2, 195-h+20);
    });
  }, 100);
}

window._startCardioZone = function(idx){
  var z = CARDIO_ZONES[idx];
  var secs = 0, totalCal = 0, running = true;
  var exerciseIdx = 0;
  var html = '<div style="text-align:center"><div style="font-size:18px;font-weight:800;color:'+z.color+';margin-bottom:8px">'+z.name+'</div>';
  html += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:16px">'+z.hr+' | '+z.desc+'</div>';
  html += '<div style="font-size:48px;font-weight:900" id="cardio-timer">00:00</div>';
  html += '<div style="font-size:14px;color:var(--text-dim);margin-top:4px" id="cardio-cal">0 kcal</div>';
  html += '<div style="margin-top:16px;padding:12px;background:var(--glass);border-radius:10px" id="cardio-exercise"><div style="font-size:13px;font-weight:700">현재 운동</div><div style="font-size:16px;margin-top:6px">'+z.exercises[0]+'</div></div>';
  html += '<div style="margin-top:16px;display:flex;gap:8px;justify-content:center"><button onclick="window._stopCardio()" style="padding:10px 24px;background:var(--accent);border:none;border-radius:10px;color:#fff;cursor:pointer;font-weight:700">종료</button></div></div>';

  var overlay = el('v16-modal-overlay');
  if(overlay){
    var body = overlay.querySelector('[style*="padding:20px"]');
    if(body) body.innerHTML = html;
  }

  var timer = setInterval(function(){
    if(!running) return;
    secs++;
    totalCal = Math.round(secs/60*z.cal);
    var mm = Math.floor(secs/60), ss = secs%60;
    var tEl = el('cardio-timer');
    var cEl = el('cardio-cal');
    if(tEl) tEl.textContent = (mm<10?'0':'')+mm+':'+(ss<10?'0':'')+ss;
    if(cEl) cEl.textContent = totalCal + ' kcal';
    if(secs % 30 === 0){
      exerciseIdx = (exerciseIdx+1) % z.exercises.length;
      var exEl = el('cardio-exercise');
      if(exEl) exEl.querySelector('div:last-child').textContent = z.exercises[exerciseIdx];
    }
  }, 1000);

  window._stopCardio = function(){
    running = false;
    clearInterval(timer);
    v16.cardioZone.sessions.push({zone:z.name, duration:secs, cal:totalCal, date:new Date().toISOString().slice(0,10)});
    if(v16.cardioZone.sessions.length > 50) v16.cardioZone.sessions = v16.cardioZone.sessions.slice(-50);
    v16.cardioZone.totalCals += totalCal;
    saveV16(v16);
    checkAchievementsV16();
    var tEl2 = el('cardio-timer');
    if(tEl2) tEl2.parentElement.innerHTML = '<div style="font-size:16px;font-weight:700;margin-bottom:8px">세션 완료!</div><div style="font-size:14px;color:var(--text-dim)">시간: '+Math.floor(secs/60)+'분 '+secs%60+'초 | '+totalCal+' kcal 소모</div>';
  };
};

// ===== 4. ROUND TIMER PRO =====
var ROUND_PRESETS = [
  {name:'아마추어', rounds:3, work:120, rest:60, warn:10},
  {name:'프로 12R', rounds:12, work:180, rest:60, warn:10},
  {name:'미니 스파링', rounds:4, work:90, rest:30, warn:5},
  {name:'타바타', rounds:8, work:20, rest:10, warn:3},
  {name:'지구력', rounds:6, work:180, rest:30, warn:10},
  {name:'커스텀', rounds:0, work:120, rest:60, warn:10}
];

function openRoundTimer(){
  trackFeature('roundTimer');
  playSFX16('round_bell');
  var html = '<div style="margin-bottom:16px"><p style="font-size:13px;color:var(--text-dim)">프로급 라운드 타이머. 프리셋 선택 또는 커스텀 설정.</p></div>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-bottom:16px">';
  ROUND_PRESETS.forEach(function(p,i){
    if(i<5){
      html += '<button onclick="window._startRoundTimer('+i+')" style="padding:12px;background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;color:var(--text);cursor:pointer"><div style="font-weight:700;font-size:14px">'+p.name+'</div><div style="font-size:11px;color:var(--text-dim);margin-top:4px">'+p.rounds+'R | '+p.work+'초/'+p.rest+'초</div></button>';
    }
  });
  html += '</div>';
  html += '<div style="padding:14px;background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;margin-bottom:16px"><div style="font-size:14px;font-weight:700;margin-bottom:10px">커스텀 설정</div>';
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
  html += '<label style="font-size:12px;color:var(--text-dim)">라운드<input id="rt-rounds" type="number" value="3" min="1" max="20" style="width:100%;padding:8px;background:var(--surface);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);margin-top:4px"></label>';
  html += '<label style="font-size:12px;color:var(--text-dim)">운동(초)<input id="rt-work" type="number" value="120" min="10" max="300" style="width:100%;padding:8px;background:var(--surface);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);margin-top:4px"></label>';
  html += '<label style="font-size:12px;color:var(--text-dim)">휴식(초)<input id="rt-rest" type="number" value="60" min="5" max="120" style="width:100%;padding:8px;background:var(--surface);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);margin-top:4px"></label>';
  html += '<label style="font-size:12px;color:var(--text-dim)">경고(초)<input id="rt-warn" type="number" value="10" min="3" max="30" style="width:100%;padding:8px;background:var(--surface);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);margin-top:4px"></label>';
  html += '</div>';
  html += '<button onclick="window._startRoundTimer(5)" style="margin-top:10px;padding:10px;width:100%;background:var(--accent);border:none;border-radius:10px;color:#fff;cursor:pointer;font-weight:700">커스텀 시작</button></div>';
  html += '<div id="rt-area"></div>';
  html += '<div style="padding:12px;background:var(--glass);border-radius:12px;margin-top:12px"><div style="font-size:13px;font-weight:700;margin-bottom:6px">통계</div><div style="font-size:12px;color:var(--text-dim)">총 라운드: '+v16.roundTimer.totalRounds+' | 총 훈련시간: '+Math.round(v16.roundTimer.totalTime/60)+'분</div></div>';
  openModal16('⏰ 라운드 타이머 프로', html);
}

window._startRoundTimer = function(presetIdx){
  var preset;
  if(presetIdx === 5){
    preset = {
      name:'커스텀',
      rounds: parseInt(el('rt-rounds').value)||3,
      work: parseInt(el('rt-work').value)||120,
      rest: parseInt(el('rt-rest').value)||60,
      warn: parseInt(el('rt-warn').value)||10
    };
  } else {
    preset = ROUND_PRESETS[presetIdx];
  }
  var area = el('rt-area');
  if(!area) return;
  var curRound = 1, phase = 'work', timeLeft = preset.work, running = true, totalTime = 0;

  function render(){
    var color = phase==='work' ? '#FF4444' : '#22c55e';
    var phaseText = phase==='work' ? '운동' : '휴식';
    var mm = Math.floor(timeLeft/60), ss = timeLeft%60;
    area.innerHTML = '<div style="text-align:center;padding:20px"><div style="font-size:12px;color:var(--text-dim)">'+preset.name+' | R'+curRound+'/'+preset.rounds+'</div><div style="font-size:16px;font-weight:700;color:'+color+';margin:8px 0">'+phaseText+'</div><div style="font-size:56px;font-weight:900;color:'+color+'">'+(mm<10?'0':'')+mm+':'+(ss<10?'0':'')+ss+'</div><div style="width:100%;height:8px;background:rgba(255,255,255,0.05);border-radius:4px;margin:16px 0;overflow:hidden"><div style="height:100%;background:'+color+';border-radius:4px;width:'+(phase==='work'?((preset.work-timeLeft)/preset.work*100):((preset.rest-timeLeft)/preset.rest*100))+'%;transition:width 0.3s"></div></div><button onclick="window._stopRoundTimer()" style="padding:8px 20px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:var(--text);cursor:pointer;font-size:12px">종료</button></div>';
  }

  render();
  var timer = setInterval(function(){
    if(!running) return;
    timeLeft--;
    totalTime++;
    if(timeLeft === preset.warn && phase==='work') playSFX16('corner_advice');
    if(timeLeft <= 0){
      playSFX16('round_bell');
      if(phase === 'work'){
        if(curRound >= preset.rounds){
          running = false;
          clearInterval(timer);
          v16.roundTimer.totalRounds += preset.rounds;
          v16.roundTimer.totalTime += totalTime;
          saveV16(v16);
          checkAchievementsV16();
          area.innerHTML = '<div style="text-align:center;padding:20px"><div style="font-size:18px;font-weight:800;color:var(--gold)">완료!</div><div style="font-size:13px;color:var(--text-dim);margin-top:8px">'+preset.rounds+' 라운드 완료 | '+Math.round(totalTime/60)+'분 훈련</div></div>';
          return;
        }
        phase = 'rest';
        timeLeft = preset.rest;
      } else {
        phase = 'work';
        timeLeft = preset.work;
        curRound++;
      }
    }
    render();
  }, 1000);

  window._stopRoundTimer = function(){
    running = false;
    clearInterval(timer);
    v16.roundTimer.totalRounds += curRound-1;
    v16.roundTimer.totalTime += totalTime;
    saveV16(v16);
    area.innerHTML = '<div style="text-align:center;padding:16px"><div style="font-size:14px;color:var(--text-dim)">중단됨 | '+(curRound-1)+' 라운드 완료</div></div>';
  };
};

// ===== 5. CORNERMAN STRATEGY SIM =====
var CORNER_SCENARIOS = [
  {round:3, situation:'선수가 잭 위주로 포인트를 쌓지만 상대가 압박 공격을 강화하고 있다', opts:['거리 유지하며 잭 위주 유지','어퍼컷으로 전환해 압박 끊기','클린치로 템포 조절'], correct:1},
  {round:5, situation:'두 눈 주변이 붓어오르고 시야가 좁아진 상황', opts:['방어 위주로 버티기','인파이트로 압박','거리 둘고 잭 위주'], correct:2},
  {round:8, situation:'체력 소모가 심하고 상대가 더 체력이 남아있다', opts:['공격적으로 나가서 KO 노리기','클린치와 홀딩으로 체력 아끼기','풀워펄치로 승부'], correct:1},
  {round:1, situation:'처음 부딱힌 상대가 예상 외로 사우스포 스탠스다', opts:['리드 손으로 빠른 콤보','바디샷으로 악력 주기','거리를 두고 관찰'], correct:2},
  {round:10, situation:'판정 타수에서 지고 있다. 마지막 3라운드가 남았다', opts:['계속 포인트 복싱','공격적 파워펄치로 KO 노리기','방어하며 카운터 기회 엿보기'], correct:1},
  {round:6, situation:'상대가 훅을 많이 사용하여 근접 전투를 한다', opts:['훅 범위 밖으로 빠져나오기','클린치로 묶어버리기','스트레이트로 빠르게 치고 빠져나오기'], correct:2},
  {round:4, situation:'상대가 밥앤위브로 회피를 잘하고 있다', opts:['페인트로 회피 유도','바디샷으로 다운 공격','해드무브메트 치고 후속타'], correct:1},
  {round:7, situation:'상대가 지쳐서 가드를 낮추기 시작했다', opts:['크로스-훅 콤보로 마무리','체력 아끼며 기다리기','올아웃 공격 개시'], correct:0},
  {round:9, situation:'상대가 크로스 카운터를 사용한다', opts:['크로스 페인팅하고 훅으로 전환','잭-빠져나오기 반복','크로스를 위장해서 업퍼컷 시전'], correct:2},
  {round:2, situation:'상대가 손 속도가 빠르지만 파워가 약하다', opts:['인파이트로 파워로 압도','거리를 둘고 아웃박싱','동시에 나가서 맞아치기'], correct:0}
];

function openCornerman(){
  trackFeature('cornerman');
  playSFX16('corner_advice');
  var scIdx = 0, wins = 0;
  var shuffled = shuffleArray(CORNER_SCENARIOS);

  function renderScenario(){
    var sc = shuffled[scIdx];
    var html = '<div style="margin-bottom:8px;font-size:13px;color:var(--text-dim)">시나리오 '+(scIdx+1)+'/'+shuffled.length+' | 정답: '+wins+'</div>';
    html += '<div style="padding:14px;background:var(--glass);border-radius:12px;margin-bottom:14px"><div style="font-size:12px;color:var(--accent);margin-bottom:6px">R'+sc.round+' 코너 조언</div><div style="font-size:14px;font-weight:600">'+sc.situation+'</div></div>';
    html += '<div style="display:grid;gap:8px" id="corner-opts">';
    sc.opts.forEach(function(o,j){
      html += '<button onclick="window._cornerAnswer('+j+')" style="padding:12px;background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;color:var(--text);cursor:pointer;font-size:13px;text-align:left">'+o+'</button>';
    });
    html += '</div><div id="corner-fb" style="margin-top:10px"></div>';
    return html;
  }

  window._cornerAnswer = function(c){
    var sc = shuffled[scIdx];
    var fb = el('corner-fb');
    if(!fb) return;
    var isCorrect = c === sc.correct;
    if(isCorrect){ wins++; playSFX16('fightiq_correct'); }
    else playSFX16('fightiq_wrong');
    fb.innerHTML = '<div style="padding:10px;background:'+(isCorrect?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)')+';border-radius:8px;border:1px solid '+(isCorrect?'rgba(34,197,94,0.3)':'rgba(239,68,68,0.3)')+'"><div style="color:'+(isCorrect?'#22c55e':'#ef4444')+';font-weight:700">'+(isCorrect?'올바른 조언!':'부적절한 조언. 정답: '+sc.opts[sc.correct])+'</div></div>';
    el('corner-opts').querySelectorAll('button').forEach(function(b){ b.disabled=true;b.style.opacity='0.5'; });
    setTimeout(function(){
      scIdx++;
      if(scIdx < shuffled.length){
        var body = qs('#v16-modal-overlay .v16-corner-body');
        if(body) body.innerHTML = renderScenario();
      } else {
        v16.cornerman.completed.push({wins:wins,total:shuffled.length,date:new Date().toISOString().slice(0,10)});
        v16.cornerman.wins += wins;
        if(v16.cornerman.completed.length>20) v16.cornerman.completed = v16.cornerman.completed.slice(-20);
        saveV16(v16);
        checkAchievementsV16();
        var body2 = qs('#v16-modal-overlay .v16-corner-body');
        if(body2) body2.innerHTML = '<div style="text-align:center;padding:20px"><div style="font-size:48px;font-weight:900;color:'+gradeColors[gradeFromScore(wins/shuffled.length*100)]+'">'+gradeFromScore(wins/shuffled.length*100)+'</div><div style="font-size:14px;color:var(--text-dim);margin-top:8px">'+wins+'/'+shuffled.length+' 정답</div></div>';
      }
    }, 1200);
  };

  var mBody = openModal16('🏆 코너맨 전략 시뮬레이터', '<div class="v16-corner-body">'+renderScenario()+'</div>');
  mBody.querySelector('div').className = 'v16-corner-body';
}

// ===== 6. BOXING PHYSICAL TEST =====
var PHYSICAL_CATEGORIES = [
  {name:'파워', icon:'💪', tests:['잭 파워(1~10)','크로스 파워(1~10)','훅 파워(1~10)'], weight:1.2},
  {name:'스피드', icon:'⚡', tests:['잭 스피드(1~10)','콤보 스피드(1~10)','반응 속도(1~10)'], weight:1.1},
  {name:'지구력', icon:'🔥', tests:['유산소 지구력(1~10)','무산소 지구력(1~10)','회복 속도(1~10)'], weight:1.0},
  {name:'방어', icon:'🛡️', tests:['가드 안정성(1~10)','헤드무브먼트(1~10)','밥앤위브(1~10)'], weight:1.0},
  {name:'풀워크', icon:'👣', tests:['래터럴 무브(1~10)','피봇(1~10)','인아웃(1~10)'], weight:0.9},
  {name:'유연성', icon:'🧘', tests:['어깨 유연성(1~10)','허리 회전(1~10)','목 무브먼트(1~10)'], weight:0.8},
  {name:'멘탈', icon:'🧠', tests:['집중력(1~10)','압박감 관리(1~10)','전술 이해도(1~10)'], weight:0.9},
  {name:'테크닉', icon:'🎯', tests:['펄치 정확도(1~10)','콤보 연결성(1~10)','타이밍(1~10)'], weight:1.1}
];

function openPhysicalTest(){
  trackFeature('physicalTest');
  playSFX16('physical_test');
  var scores = {};
  var html = '<div style="margin-bottom:12px"><p style="font-size:13px;color:var(--text-dim)">8가지 카테고리별 복싱 피지컬 테스트. 각 항목을 1~10점으로 평가하세요.</p></div>';
  html += '<div style="display:grid;gap:12px">';
  PHYSICAL_CATEGORIES.forEach(function(cat,ci){
    html += '<div style="padding:14px;background:var(--glass);border:1px solid var(--glass-border);border-radius:12px"><div style="font-size:14px;font-weight:700;margin-bottom:10px">'+cat.icon+' '+cat.name+'</div>';
    cat.tests.forEach(function(test,ti){
      var key = ci+'_'+ti;
      html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:12px;color:var(--text-dim);flex:1">'+test+'</span><input type="range" min="1" max="10" value="5" id="pt-'+key+'" style="flex:0 0 120px" oninput="document.getElementById(\'ptv-'+key+'\').textContent=this.value"><span id="ptv-'+key+'" style="font-size:13px;font-weight:700;width:20px;text-align:center">5</span></div>';
    });
    html += '</div>';
  });
  html += '</div>';
  html += '<button onclick="window._calcPhysicalTest()" style="margin-top:16px;padding:12px;width:100%;background:var(--accent);border:none;border-radius:10px;color:#fff;cursor:pointer;font-weight:700;font-size:14px">결과 분석</button>';
  html += '<div id="pt-result" style="margin-top:16px"></div>';
  openModal16('🏋️ 복싱 피지컬 테스트', html);
}

window._calcPhysicalTest = function(){
  var catScores = [];
  var totalWeighted = 0, totalWeight = 0;
  PHYSICAL_CATEGORIES.forEach(function(cat,ci){
    var sum = 0;
    cat.tests.forEach(function(test,ti){
      var val = parseInt(el('pt-'+ci+'_'+ti).value)||5;
      sum += val;
    });
    var avg = sum / cat.tests.length;
    catScores.push({name:cat.name, avg:avg, icon:cat.icon});
    totalWeighted += avg * cat.weight;
    totalWeight += cat.weight;
  });
  var overall = totalWeighted / totalWeight;
  var grade = gradeFromScore(overall*10);

  var result = el('pt-result');
  if(!result) return;

  result.innerHTML = '<canvas id="pt-canvas" width="400" height="400" style="max-width:100%;border-radius:12px;background:#111;margin:0 auto;display:block"></canvas><div style="text-align:center;margin-top:12px"><div style="font-size:36px;font-weight:900;color:'+gradeColors[grade]+'">'+grade+'</div><div style="font-size:14px;color:var(--text-dim)">종합 '+overall.toFixed(1)+'/10</div></div>';

  setTimeout(function(){
    var canvas = el('pt-canvas');
    if(!canvas) return;
    var ctx2 = canvas.getContext('2d');
    ctx2.fillStyle = '#111';
    ctx2.fillRect(0,0,400,400);
    var cx=200,cy=200,maxR=150;
    var n = catScores.length;
    for(var ring=2;ring<=10;ring+=2){
      ctx2.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx2.beginPath();
      for(var ri=0;ri<n;ri++){
        var angle = (Math.PI*2/n)*ri - Math.PI/2;
        var r = maxR*(ring/10);
        var x = cx + r*Math.cos(angle);
        var y = cy + r*Math.sin(angle);
        if(ri===0) ctx2.moveTo(x,y);
        else ctx2.lineTo(x,y);
      }
      ctx2.closePath();
      ctx2.stroke();
    }
    for(var ai=0;ai<n;ai++){
      var angle2 = (Math.PI*2/n)*ai - Math.PI/2;
      ctx2.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx2.beginPath();
      ctx2.moveTo(cx,cy);
      ctx2.lineTo(cx+maxR*Math.cos(angle2),cy+maxR*Math.sin(angle2));
      ctx2.stroke();
      ctx2.fillStyle = '#aaa';
      ctx2.font = '11px sans-serif';
      ctx2.textAlign = 'center';
      var lx = cx+(maxR+20)*Math.cos(angle2);
      var ly = cy+(maxR+20)*Math.sin(angle2);
      ctx2.fillText(catScores[ai].icon+catScores[ai].name, lx, ly+4);
    }
    ctx2.fillStyle = 'rgba(255,68,68,0.2)';
    ctx2.strokeStyle = '#FF4444';
    ctx2.lineWidth = 2;
    ctx2.beginPath();
    catScores.forEach(function(cs,si){
      var angle3 = (Math.PI*2/n)*si - Math.PI/2;
      var r2 = maxR*(cs.avg/10);
      var px = cx+r2*Math.cos(angle3);
      var py = cy+r2*Math.sin(angle3);
      if(si===0) ctx2.moveTo(px,py);
      else ctx2.lineTo(px,py);
    });
    ctx2.closePath();
    ctx2.fill();
    ctx2.stroke();
    catScores.forEach(function(cs,si){
      var angle4 = (Math.PI*2/n)*si - Math.PI/2;
      var r3 = maxR*(cs.avg/10);
      ctx2.fillStyle = '#FF4444';
      ctx2.beginPath();
      ctx2.arc(cx+r3*Math.cos(angle4),cy+r3*Math.sin(angle4),4,0,Math.PI*2);
      ctx2.fill();
    });
  }, 100);

  v16.physicalTest.results.push({scores:catScores.map(function(c){return c.avg;}),grade:grade,date:new Date().toISOString().slice(0,10)});
  if(v16.physicalTest.results.length>20) v16.physicalTest.results = v16.physicalTest.results.slice(-20);
  if(!v16.physicalTest.bestGrade || 'SABCD'.indexOf(grade) < 'SABCD'.indexOf(v16.physicalTest.bestGrade)) v16.physicalTest.bestGrade = grade;
  saveV16(v16);
  checkAchievementsV16();
  playSFX16('achieve_v16');
};

// ===== 7. SPARRING PARTNER AI =====
var SPARRING_STYLES = [
  {name:'스위머', style:'boxer', desc:'잭 위주, 거리 유지', power:4, speed:8, defense:7, hp:80},
  {name:'슬러거', style:'slugger', desc:'파워 펄치, 근접 전투', power:9, speed:5, defense:4, hp:100},
  {name:'카운터펄치어', style:'counter', desc:'카운터 위주, 정밀 타격', power:7, speed:7, defense:8, hp:85},
  {name:'스워머', style:'swarmer', desc:'압박 공격, 크림치', power:6, speed:9, defense:5, hp:90},
  {name:'박서펄치어', style:'outboxer', desc:'잭과 발놀림', power:5, speed:8, defense:9, hp:75},
  {name:'브롤러', style:'brawler', desc:'무식 난투, 높은 파워', power:10, speed:4, defense:3, hp:110}
];

function openSparring(){
  trackFeature('sparring');
  playSFX16('sparring_punch');
  var html = '<div style="margin-bottom:16px"><p style="font-size:13px;color:var(--text-dim)">AI 스파링 파트너를 선택하세요. 6가지 스타일의 상대와 가상 스파링!</p></div>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px">';
  SPARRING_STYLES.forEach(function(s,i){
    html += '<div onclick="window._startSparring('+i+')" style="padding:14px;background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;cursor:pointer;transition:all 0.2s;text-align:center">';
    html += '<div style="font-size:24px;margin-bottom:6px">🥊</div>';
    html += '<div style="font-size:14px;font-weight:700">'+s.name+'</div>';
    html += '<div style="font-size:11px;color:var(--text-dim);margin-top:4px">'+s.desc+'</div>';
    html += '<div style="margin-top:8px;font-size:10px;color:var(--text-muted)">파워:'+s.power+' 스피드:'+s.speed+' 방어:'+s.defense+'</div>';
    html += '</div>';
  });
  html += '</div>';
  html += '<div style="margin-top:16px;padding:12px;background:var(--glass);border-radius:12px"><div style="font-size:13px;font-weight:700;margin-bottom:6px">스파링 전적</div><div style="font-size:12px;color:var(--text-dim)">승: '+v16.sparring.wins+' | 패: '+v16.sparring.losses+' | 무: '+v16.sparring.draws+'</div></div>';
  openModal16('🥊 스파링 파트너 AI', html);
}

window._startSparring = function(idx){
  var opp = SPARRING_STYLES[idx];
  var myHP = 100, oppHP = opp.hp, round = 1, maxRounds = 6, log = [];
  var myActions = [
    {name:'잭', power:3, speed:9, hitRate:0.8},
    {name:'크로스', power:7, speed:6, hitRate:0.65},
    {name:'훅', power:8, speed:5, hitRate:0.6},
    {name:'업퍼컷', power:6, speed:4, hitRate:0.55},
    {name:'바디샷', power:5, speed:7, hitRate:0.5},
    {name:'방어', power:0, speed:0, hitRate:0, heal:5}
  ];

  function renderBattle(){
    var html = '<div style="text-align:center;margin-bottom:12px;font-size:12px;color:var(--text-dim)">R'+round+'/'+maxRounds+'</div>';
    html += '<div style="display:flex;gap:16px;margin-bottom:16px">';
    html += '<div style="flex:1;text-align:center"><div style="font-size:14px;font-weight:700">나</div><div style="width:100%;height:12px;background:rgba(255,255,255,0.05);border-radius:6px;margin-top:6px;overflow:hidden"><div style="height:100%;background:linear-gradient(90deg,#22c55e,#4ade80);width:'+myHP+'%;transition:width 0.3s;border-radius:6px"></div></div><div style="font-size:11px;color:var(--text-dim);margin-top:4px">HP: '+myHP+'</div></div>';
    html += '<div style="font-size:18px;font-weight:900;color:var(--accent);align-self:center">VS</div>';
    html += '<div style="flex:1;text-align:center"><div style="font-size:14px;font-weight:700">'+opp.name+'</div><div style="width:100%;height:12px;background:rgba(255,255,255,0.05);border-radius:6px;margin-top:6px;overflow:hidden"><div style="height:100%;background:linear-gradient(90deg,#ef4444,#f87171);width:'+(oppHP/opp.hp*100)+'%;transition:width 0.3s;border-radius:6px"></div></div><div style="font-size:11px;color:var(--text-dim);margin-top:4px">HP: '+oppHP+'</div></div>';
    html += '</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px" id="spar-actions">';
    myActions.forEach(function(a,ai){
      html += '<button onclick="window._sparAction('+ai+')" style="padding:10px 8px;background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;color:var(--text);cursor:pointer;font-size:13px;font-weight:600">'+a.name+(a.heal?'\n🛡️':'')+'</button>';
    });
    html += '</div>';
    html += '<div id="spar-log" style="max-height:120px;overflow-y:auto;padding:10px;background:var(--glass);border-radius:10px;font-size:11px;color:var(--text-dim)">';
    log.slice(-6).forEach(function(l){ html += '<div style="margin-bottom:4px">'+l+'</div>'; });
    html += '</div>';
    return html;
  }

  window._sparAction = function(ai){
    var action = myActions[ai];
    var myMsg = '', oppMsg = '';
    if(action.heal){
      var healed = Math.min(action.heal, 100-myHP);
      myHP += healed;
      myMsg = '🛡️ 방어! HP +'+healed+' 회복';
    } else {
      var hitChance = action.hitRate - (opp.defense*0.03);
      if(Math.random() < hitChance){
        var dmg = Math.round(action.power * (0.8 + Math.random()*0.4));
        oppHP = Math.max(0, oppHP-dmg);
        myMsg = '👊 '+action.name+' 명중! -'+dmg+' 데미지';
        playSFX16('sparring_punch');
      } else {
        myMsg = '❌ '+action.name+' 빗나감!';
      }
    }
    var oppAction = myActions[Math.floor(Math.random()*5)];
    var oppHitChance = (opp.speed*0.05+0.3);
    if(action.heal) oppHitChance += 0.1;
    if(Math.random() < oppHitChance){
      var oppDmg = Math.round(opp.power * (0.6+Math.random()*0.4));
      if(action.heal) oppDmg = Math.round(oppDmg*0.5);
      myHP = Math.max(0, myHP-oppDmg);
      oppMsg = '💥 상대 '+oppAction.name+' 명중! -'+oppDmg;
    } else {
      oppMsg = '💨 상대 '+oppAction.name+' 빗나감';
    }
    log.push('R'+round+': '+myMsg+' | '+oppMsg);
    round++;

    if(myHP <= 0 || oppHP <= 0 || round > maxRounds){
      var result;
      if(oppHP<=0){ result='win'; v16.sparring.wins++; playSFX16('sparring_win'); }
      else if(myHP<=0){ result='loss'; v16.sparring.losses++; }
      else if(myHP>oppHP){ result='win'; v16.sparring.wins++; playSFX16('sparring_win'); }
      else if(myHP<oppHP){ result='loss'; v16.sparring.losses++; }
      else { result='draw'; v16.sparring.draws++; }
      saveV16(v16);
      checkAchievementsV16();
      var body = qs('#v16-modal-overlay .v16-spar-body');
      if(body){
        var rColor = result==='win'?'#22c55e':result==='loss'?'#ef4444':'#f97316';
        var rText = result==='win'?'승리!':result==='loss'?'패배...':'무승부';
        body.innerHTML = '<div style="text-align:center;padding:20px"><div style="font-size:36px;font-weight:900;color:'+rColor+'">'+rText+'</div><div style="font-size:13px;color:var(--text-dim);margin-top:8px">나 HP:'+myHP+' vs '+opp.name+' HP:'+oppHP+'</div><div style="margin-top:12px;padding:10px;background:var(--glass);border-radius:10px;font-size:11px;color:var(--text-dim);text-align:left;max-height:120px;overflow-y:auto">'+log.map(function(l){return '<div>'+l+'</div>';}).join('')+'</div></div>';
      }
      return;
    }

    var body2 = qs('#v16-modal-overlay .v16-spar-body');
    if(body2) body2.innerHTML = renderBattle();
  };

  var mBody = openModal16('🥊 스파링: vs '+opp.name, '<div class="v16-spar-body">'+renderBattle()+'</div>');
  mBody.querySelector('div').className = 'v16-spar-body';
};

// ===== 8. PUNCH CHRONICLE =====
var PUNCH_ERAS = [
  {era:'고대 권투', period:'BC 3000~AD 393', desc:'고대 그리스 올림픽 권투. 맨손으로 싸우는 팔크레이션', techniques:['스트레이트 펄치','클린치','맨손 권투']},
  {era:'중세 권투', period:'5~15세기', desc:'유럽 각지의 비공식 권투. 규칙 없는 난투', techniques:['베어너클 파이팅','그래플링 혼합','킥박싱']},
  {era:'브로턴 규칙', period:'1743년', desc:'잭 브로턴이 최초의 공식 규칙 제정', techniques:['잭(Jab)','크로스 발명','클린치 차단']},
  {era:'퀀즈베리 규칙', period:'1867년', desc:'글러브 의무화, 3분 라운드 제도', techniques:['글러브 펄치','파리','어퍼컷']},
  {era:'초기 헤비급', period:'1882~1920', desc:'존 L. 설리번, 잭 존슨 시대', techniques:['인파이팅','크로스 카운터','클린치 전술']},
  {era:'황금기 1', period:'1920~1950', desc:'조 루이스, 록키 마르치아노 시대', techniques:['원투펄치','보디샷','풀워크 발전']},
  {era:'모던 복싱', period:'1950~1970', desc:'무함마드 알리의 혁명적 스타일', techniques:['셔플 무브','마우스피스','로프어도프']},
  {era:'파워 시대', period:'1970~1990', desc:'타이슨, 레너드, 헤글러 전성기', techniques:['피카부 스타일','파워펄치','헤드무브먼트']},
  {era:'테크니컬 시대', period:'1990~2010', desc:'레노스 루이스, 메이웨더 시대', techniques:['싼더라이트','플리커 잭','솔더롤']},
  {era:'스피드 시대', period:'2010~현재', desc:'파키아오, 코바로프, 우시크', techniques:['스위치 히팅','다각적 공격','풀워펄치 콤보']},
  {era:'한국 복싱', period:'1960~현재', desc:'홍수환, 장정구, 문성길 레전드', techniques:['서울 스타일','친북 펄치','한국식 빠른 손']},
  {era:'미래 복싱', period:'2030~', desc:'AI 코치, VR 스파링, 테크니컬 분석', techniques:['AI 펄치 분석','웨어러블 트래킹','VR 스파링']}
];

function openChronicle(){
  trackFeature('chronicle');
  playSFX16('chronicle_open');
  var html = '<div style="margin-bottom:16px"><p style="font-size:13px;color:var(--text-dim)">복싱 기술의 역사적 변천과 진화. 12개 시대별 기술 탐험.</p></div>';
  html += '<div style="position:relative;padding-left:20px">';
  PUNCH_ERAS.forEach(function(era,i){
    var viewed = v16.chronicle.viewed.indexOf(i) >= 0;
    html += '<div style="position:relative;padding:14px;background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;margin-bottom:12px;cursor:pointer" onclick="window._viewEra('+i+')">';
    html += '<div style="position:absolute;left:-20px;top:20px;width:12px;height:12px;border-radius:50%;background:'+(viewed?'var(--green)':'var(--accent)')+';border:2px solid var(--bg)"></div>';
    if(i < PUNCH_ERAS.length-1) html += '<div style="position:absolute;left:-15px;top:34px;width:2px;height:calc(100% - 10px);background:rgba(255,255,255,0.08)"></div>';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><span style="font-size:14px;font-weight:700">'+era.era+'</span><span style="font-size:11px;color:var(--text-dim)">'+era.period+'</span></div>';
    html += '<div style="font-size:12px;color:var(--text-dim)">'+era.desc+'</div>';
    html += '<div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">';
    era.techniques.forEach(function(tech){
      html += '<span style="padding:3px 8px;background:var(--accent-soft);border-radius:6px;font-size:10px;color:var(--accent)">'+tech+'</span>';
    });
    html += '</div></div>';
  });
  html += '</div>';
  html += '<div style="margin-top:12px;padding:12px;background:var(--glass);border-radius:12px"><div style="font-size:12px;color:var(--text-dim)">탐험: '+v16.chronicle.viewed.length+'/'+PUNCH_ERAS.length+' 시대</div></div>';
  openModal16('📜 펄치 연대기', html);
}

window._viewEra = function(idx){
  if(v16.chronicle.viewed.indexOf(idx)<0){
    v16.chronicle.viewed.push(idx);
    saveV16(v16);
    checkAchievementsV16();
  }
  var era = PUNCH_ERAS[idx];
  playSFX16('chronicle_open');
  openModal16(era.era, '<div style="padding:4px"><div style="font-size:12px;color:var(--accent);margin-bottom:8px">'+era.period+'</div><div style="font-size:14px;margin-bottom:16px">'+era.desc+'</div><div style="font-size:13px;font-weight:700;margin-bottom:10px">핵심 기술</div><div style="display:grid;gap:8px">'+era.techniques.map(function(t){ return '<div style="padding:10px;background:var(--glass);border-radius:10px;font-size:13px">🥊 '+t+'</div>'; }).join('')+'</div></div>');
};

// ===== QUIZ V16 =====
var QUIZ_V16 = [
  {q:'스피드백의 주요 훈련 효과는?', opts:['타이밍과 리듬감','파워 향상','유연성 향상','체중 감량'], correct:0},
  {q:'아웃박서의 핵심 무기는?', opts:['크로스','훅','잭','업퍼컷'], correct:2},
  {q:'피카부 스타일을 창시한 복서는?', opts:['마이크 타이슨','플로이드 메이웨더','무함마드 알리','슈거 레이 레너드'], correct:0},
  {q:'프로 복싱에서 한 라운드는 몇 분인가?', opts:['2분','3분','5분','4분'], correct:1},
  {q:'복싱에서 카디오 존의 의미는?', opts:['심박수 기반 훈련 강도','체중 별 분류','글러브 무게 구분','라운드 수'], correct:0},
  {q:'코너맨의 주요 역할은?', opts:['심판 대체','라운드 사이 전략 조언','상대 분석','체중 관리'], correct:1},
  {q:'슬러거 타입의 복서 특징은?', opts:['빠른 잭 위주','파워펄치 근접전','카운터 위주','발놓림 위주'], correct:1},
  {q:'복싱 피지컬 테스트에서 가장 중요한 항목은?', opts:['유연성','파워와 스피드','멘탈만','테크닉만'], correct:1},
  {q:'퀀즈베리 규칙이 도입된 해는?', opts:['1743년','1867년','1900년','1920년'], correct:1},
  {q:'타바타 운동의 운동/휴식 비율은?', opts:['30초/10초','20초/10초','60초/30초','45초/15초'], correct:1},
  {q:'브로턴 규칙을 제정한 복서는?', opts:['잭 브로턴','잭 뎀프시','조 루이스','잭 존슨'], correct:0},
  {q:'셔플 무브를 창시한 복서는?', opts:['마이크 타이슨','무함마드 알리','슈거 레이 레너드','플로이드 메이웨더'], correct:1},
  {q:'복싱 스파링에서 헤드기어 착용이 의무인 경우는?', opts:['프로 시합','아마추어 시합','소션 스파링','트레이닝 스파링'], correct:1},
  {q:'복싱에서 가장 긴 리치를 가진 펄치는?', opts:['잭','크로스','스트레이트','업퍼컷'], correct:2},
  {q:'복싱 카디오에서 무산소 존 심박수 범위는?', opts:['50-60%','70-80%','80-90%','90-100%'], correct:2}
];

function openQuizV16(){
  trackFeature('quizV16');
  var qIdx = 0, score = 0;
  var shuffled = shuffleArray(QUIZ_V16);

  function renderQuiz(){
    var q = shuffled[qIdx];
    var opts = q.opts.map(function(o,i){ return {text:o,idx:i}; });
    opts = shuffleArray(opts);
    var html = '<div style="margin-bottom:8px;font-size:12px;color:var(--text-dim)">문제 '+(qIdx+1)+'/'+QUIZ_V16.length+' | 점수: '+score+'</div>';
    html += '<div style="padding:14px;background:var(--glass);border-radius:10px;margin-bottom:12px;font-size:14px;font-weight:600">'+q.q+'</div>';
    html += '<div style="display:grid;gap:8px" id="qv16-opts">';
    opts.forEach(function(o,j){
      html += '<button onclick="window._quizV16Answer('+o.idx+')" style="padding:10px 14px;background:var(--glass);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);cursor:pointer;font-size:13px;text-align:left">'+String.fromCharCode(65+j)+'. '+o.text+'</button>';
    });
    html += '</div><div id="qv16-fb" style="margin-top:10px"></div>';
    return html;
  }

  window._quizV16Answer = function(chosen){
    var q = shuffled[qIdx];
    var fb = el('qv16-fb');
    if(!fb) return;
    if(chosen===q.correct){ score++; playSFX16('fightiq_correct'); fb.innerHTML='<div style="color:#22c55e;font-weight:700;font-size:13px">정답!</div>'; }
    else { playSFX16('fightiq_wrong'); fb.innerHTML='<div style="color:#ef4444;font-size:13px">오답. 정답: '+q.opts[q.correct]+'</div>'; }
    el('qv16-opts').querySelectorAll('button').forEach(function(b){b.disabled=true;b.style.opacity='0.5';});
    setTimeout(function(){
      qIdx++;
      if(qIdx<shuffled.length){
        var body=qs('#v16-modal-overlay .v16-quiz-body');
        if(body) body.innerHTML=renderQuiz();
      } else {
        var pct=Math.round(score/QUIZ_V16.length*100);
        v16.quizV16Scores[new Date().toISOString().slice(0,10)]=score;
        saveV16(v16);
        checkAchievementsV16();
        var body2=qs('#v16-modal-overlay .v16-quiz-body');
        if(body2) body2.innerHTML='<div style="text-align:center;padding:20px"><div style="font-size:36px;font-weight:900;color:'+gradeColors[gradeFromScore(pct)]+'">'+gradeFromScore(pct)+'</div><div style="font-size:14px;color:var(--text-dim);margin-top:8px">'+score+'/'+QUIZ_V16.length+' 정답 ('+pct+'%)</div></div>';
      }
    },1200);
  };

  var mBody=openModal16('📝 퀴즈 v6','\x3Cdiv class="v16-quiz-body">'+renderQuiz()+'</div>');
  mBody.querySelector('div').className='v16-quiz-body';
}

// ===== ACHIEVEMENTS V16 =====
var ACHIEVEMENTS_V16 = [
  {id:'speedbag_first', name:'스피드백 입문', desc:'스피드백 첫 세션 완료', check:function(){ return v16.speedBag.sessions >= 1; }},
  {id:'speedbag_streak', name:'리듬 마스터', desc:'스피드백 20연속 히트', check:function(){ return v16.speedBag.bestStreak >= 20; }},
  {id:'fightiq_first', name:'전술가 입문', desc:'파이트 IQ 첫 완료', check:function(){ return v16.fightIQ.completed.length >= 1; }},
  {id:'fightiq_master', name:'파이트 IQ 마스터', desc:'파이트 IQ 10점 만점', check:function(){ return v16.fightIQ.bestScore >= 10; }},
  {id:'cardio_first', name:'카디오 시작', desc:'카디오 존 첫 세션', check:function(){ return v16.cardioZone.sessions.length >= 1; }},
  {id:'cardio_500cal', name:'칼로리 버너', desc:'총 500 kcal 소모', check:function(){ return v16.cardioZone.totalCals >= 500; }},
  {id:'timer_first', name:'타이머 입문', desc:'라운드 타이머 첫 사용', check:function(){ return v16.roundTimer.totalRounds >= 1; }},
  {id:'timer_12r', name:'12라운드 완주', desc:'프로 12라운드 완료', check:function(){ return v16.roundTimer.totalRounds >= 12; }},
  {id:'corner_first', name:'코너맨 데뷔', desc:'코너맨 시뮬레이션 첫 완료', check:function(){ return v16.cornerman.completed.length >= 1; }},
  {id:'physical_first', name:'피지컬 테스트', desc:'피지컬 테스트 첫 완료', check:function(){ return v16.physicalTest.results.length >= 1; }},
  {id:'sparring_win', name:'첫 승리', desc:'스파링 첫 승리', check:function(){ return v16.sparring.wins >= 1; }},
  {id:'chronicle_all', name:'복싱 역사가', desc:'모든 시대 탐험 완료', check:function(){ return v16.chronicle.viewed.length >= PUNCH_ERAS.length; }}
];

function checkAchievementsV16(){
  var newCount = 0;
  ACHIEVEMENTS_V16.forEach(function(a){
    if(!v16.achievementsV16[a.id] && a.check()){
      v16.achievementsV16[a.id] = new Date().toISOString().slice(0,10);
      newCount++;
    }
  });
  if(newCount > 0){
    saveV16(v16);
    playSFX16('achieve_v16');
  }
}

// ===== SECTION INJECTION =====
function injectV16Sections(){
  var container = qs('.container');
  if(!container) return;

  var sec = ce('div');
  sec.className = 'section';
  sec.id = 'v16-features';
  sec.style.animation = 'slideUp 0.5s ease-out 0.6s both';

  var unlockedCount = Object.keys(v16.achievementsV16).length;

  sec.innerHTML = '<div class="section-title"><span class="emoji">🥊</span> v16 신규 기능</div>' +
    '<div class="grid-3" style="margin-bottom:16px">' +
    '<div class="card" style="cursor:pointer" onclick="openSpeedBag()"><div style="font-size:24px;margin-bottom:8px">🎯</div><div style="font-size:14px;font-weight:700">스피드백 리듬</div><div style="font-size:12px;color:var(--text-dim);margin-top:4px">BPM 리듬 트레이닝 Canvas</div></div>' +
    '<div class="card" style="cursor:pointer" onclick="openFightIQ()"><div style="font-size:24px;margin-bottom:8px">🧠</div><div style="font-size:14px;font-weight:700">파이트 IQ 시나리오</div><div style="font-size:12px;color:var(--text-dim);margin-top:4px">12가지 전술 상황 판단</div></div>' +
    '<div class="card" style="cursor:pointer" onclick="openCardioZone()"><div style="font-size:24px;margin-bottom:8px">💪</div><div style="font-size:14px;font-weight:700">복싱 카디오 존</div><div style="font-size:12px;color:var(--text-dim);margin-top:4px">6존 심박수 기반 카디오</div></div>' +
    '<div class="card" style="cursor:pointer" onclick="openRoundTimer()"><div style="font-size:24px;margin-bottom:8px">⏰</div><div style="font-size:14px;font-weight:700">라운드 타이머 프로</div><div style="font-size:12px;color:var(--text-dim);margin-top:4px">프로급 커스텀 타이머</div></div>' +
    '<div class="card" style="cursor:pointer" onclick="openCornerman()"><div style="font-size:24px;margin-bottom:8px">🏆</div><div style="font-size:14px;font-weight:700">코너맨 전략</div><div style="font-size:12px;color:var(--text-dim);margin-top:4px">10가지 코너 조언 시뮬레이션</div></div>' +
    '<div class="card" style="cursor:pointer" onclick="openPhysicalTest()"><div style="font-size:24px;margin-bottom:8px">🏋️</div><div style="font-size:14px;font-weight:700">피지컬 테스트</div><div style="font-size:12px;color:var(--text-dim);margin-top:4px">8카테고리 레이더 Canvas</div></div>' +
    '<div class="card" style="cursor:pointer" onclick="openSparring()"><div style="font-size:24px;margin-bottom:8px">🥊</div><div style="font-size:14px;font-weight:700">스파링 파트너 AI</div><div style="font-size:12px;color:var(--text-dim);margin-top:4px">6스타일 AI 상대 스파링</div></div>' +
    '<div class="card" style="cursor:pointer" onclick="openChronicle()"><div style="font-size:24px;margin-bottom:8px">📜</div><div style="font-size:14px;font-weight:700">펄치 연대기</div><div style="font-size:12px;color:var(--text-dim);margin-top:4px">12시대 복싱 기술 변천</div></div>' +
    '<div class="card" style="cursor:pointer" onclick="openQuizV16()"><div style="font-size:24px;margin-bottom:8px">📝</div><div style="font-size:14px;font-weight:700">퀴즈 v6</div><div style="font-size:12px;color:var(--text-dim);margin-top:4px">+15문항 (105→120)</div></div>' +
    '</div>' +
    '<div class="card"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px"><span style="font-size:14px;font-weight:700">🏅 v16 업적</span><span style="font-size:12px;color:var(--text-dim)">'+unlockedCount+'/'+ACHIEVEMENTS_V16.length+'</span></div>' +
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:6px">' +
    ACHIEVEMENTS_V16.map(function(a){
      var unlocked = !!v16.achievementsV16[a.id];
      return '<div style="padding:8px;background:'+(unlocked?'var(--accent-soft)':'var(--surface)')+';border-radius:8px;opacity:'+(unlocked?'1':'0.4')+'"><div style="font-size:12px;font-weight:700;color:'+(unlocked?'var(--accent)':'var(--text-dim)')+'">'+a.name+'</div><div style="font-size:10px;color:var(--text-muted);margin-top:2px">'+a.desc+'</div></div>';
    }).join('') +
    '</div></div>';

  container.appendChild(sec);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e){
  if(!e.shiftKey) return;
  switch(e.key.toUpperCase()){
    case 'Q': e.preventDefault(); openSpeedBag(); break;
    case 'W': e.preventDefault(); openFightIQ(); break;
    case 'E': e.preventDefault(); openCardioZone(); break;
    case 'R': e.preventDefault(); openRoundTimer(); break;
    case 'T': e.preventDefault(); openCornerman(); break;
    case 'Y': e.preventDefault(); openPhysicalTest(); break;
    case 'U': e.preventDefault(); openSparring(); break;
    case 'I': e.preventDefault(); openChronicle(); break;
  }
});

// ===== BOTTOM SCROLL NAV =====
function injectV16Nav(){
  var navItems = [
    {label:'스피드백', icon:'🎯', fn:'openSpeedBag'},
    {label:'파이트IQ', icon:'🧠', fn:'openFightIQ'},
    {label:'카디오', icon:'💪', fn:'openCardioZone'},
    {label:'타이머', icon:'⏰', fn:'openRoundTimer'},
    {label:'코너맨', icon:'🏆', fn:'openCornerman'},
    {label:'피지컬', icon:'🏋️', fn:'openPhysicalTest'},
    {label:'스파링', icon:'🥊', fn:'openSparring'},
    {label:'연대기', icon:'📜', fn:'openChronicle'}
  ];

  var nav = ce('div');
  nav.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99;background:rgba(15,10,30,0.95);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,0.08);padding:6px 8px;overflow-x:auto;white-space:nowrap;display:flex;gap:4px;-webkit-overflow-scrolling:touch';
  nav.id = 'v16-nav';

  navItems.forEach(function(item){
    var btn = ce('button');
    btn.style.cssText = 'flex:0 0 auto;padding:6px 12px;background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;color:var(--text);cursor:pointer;font-size:11px;display:flex;flex-direction:column;align-items:center;gap:2px;min-width:56px';
    btn.innerHTML = '<span style="font-size:16px">'+item.icon+'</span><span>'+item.label+'</span>';
    btn.addEventListener('click', function(){ window[item.fn](); });
    nav.appendChild(btn);
  });

  document.body.appendChild(nav);
  document.body.style.paddingBottom = '90px';
}

// ===== EXPOSE GLOBALS =====
window.openSpeedBag = openSpeedBag;
window.openFightIQ = openFightIQ;
window.openCardioZone = openCardioZone;
window.openRoundTimer = openRoundTimer;
window.openCornerman = openCornerman;
window.openPhysicalTest = openPhysicalTest;
window.openSparring = openSparring;
window.openChronicle = openChronicle;
window.openQuizV16 = openQuizV16;

// ===== INIT =====
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', function(){ injectV16Sections(); injectV16Nav(); });
} else {
  injectV16Sections();
  injectV16Nav();
}

})();
