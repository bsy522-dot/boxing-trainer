// Boxing Trainer Pro v11_patch.js - NEXTERA+PRISM Auto Enhancement Module
// Heart Rate Zone Training, Workout Classes 8, Punch Speed Analyzer,
// Recovery Timer + Stretching 8, Performance Report Canvas, Community Leaderboard,
// Training Plan Builder 5 Programs, Punch Form Analyzer 6-axis Radar Canvas,
// Boxing Music Player 8 Tracks, Meditation/Breathing Guide,
// Quiz +15 (30->45), +12 Achievements (46->58), SFX 12, Keyboard +8
(function(){
'use strict';

var STORAGE_KEY = 'boxingTrainerData';
var V11KEY = 'boxingV11Patch';

function loadAppData(){
  try { var r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch(e){ return null; }
}
function loadV11(){
  try {
    var r = localStorage.getItem(V11KEY);
    if(!r) return defV11();
    var p = JSON.parse(r), d = defV11();
    for(var k in d){ if(!(k in p)) p[k] = d[k]; }
    return p;
  } catch(e){ return defV11(); }
}
function saveV11(d){ try { localStorage.setItem(V11KEY, JSON.stringify(d)); } catch(e){} }
function defV11(){
  return {
    hrSessions: [],
    classHistory: [],
    speedTests: [],
    speedBest: 0,
    recoveryLog: [],
    leaderboardName: 'PLAYER',
    planActive: null,
    planProgress: {},
    formScores: [],
    breathSessions: 0,
    quizV11Scores: {},
    musicPlaying: false,
    musicTrack: 0
  };
}

var v11 = loadV11();

// ===== SFX ENGINE V11 =====
function playSFX11(type){
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var t = ctx.currentTime;
    switch(type){
      case 'hr_beep':
        var o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sine';o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(440,t+0.15);
        g.gain.setValueAtTime(0.15,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
        o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+0.2);break;
      case 'class_start':
        [523,659,784,1047].forEach(function(f,j){
          var o2=ctx.createOscillator(),g2=ctx.createGain();
          o2.type='triangle';o2.frequency.value=f;
          g2.gain.setValueAtTime(0.12,t+j*0.08);g2.gain.exponentialRampToValueAtTime(0.001,t+j*0.08+0.25);
          o2.connect(g2).connect(ctx.destination);o2.start(t+j*0.08);o2.stop(t+j*0.08+0.25);
        });break;
      case 'speed_hit':
        var o3=ctx.createOscillator(),g3=ctx.createGain();
        o3.type='square';o3.frequency.setValueAtTime(200,t);o3.frequency.exponentialRampToValueAtTime(80,t+0.06);
        g3.gain.setValueAtTime(0.2,t);g3.gain.exponentialRampToValueAtTime(0.001,t+0.08);
        o3.connect(g3).connect(ctx.destination);o3.start(t);o3.stop(t+0.08);break;
      case 'recovery':
        [262,330,392].forEach(function(f,j){
          var o4=ctx.createOscillator(),g4=ctx.createGain();
          o4.type='sine';o4.frequency.value=f;
          g4.gain.setValueAtTime(0.1,t+j*0.15);g4.gain.exponentialRampToValueAtTime(0.001,t+j*0.15+0.4);
          o4.connect(g4).connect(ctx.destination);o4.start(t+j*0.15);o4.stop(t+j*0.15+0.4);
        });break;
      case 'report':
        var o5=ctx.createOscillator(),g5=ctx.createGain();
        o5.type='sine';o5.frequency.setValueAtTime(523,t);o5.frequency.linearRampToValueAtTime(784,t+0.3);
        g5.gain.setValueAtTime(0.12,t);g5.gain.exponentialRampToValueAtTime(0.001,t+0.4);
        o5.connect(g5).connect(ctx.destination);o5.start(t);o5.stop(t+0.4);break;
      case 'leaderboard':
        [784,988,1175].forEach(function(f,j){
          var o6=ctx.createOscillator(),g6=ctx.createGain();
          o6.type='triangle';o6.frequency.value=f;
          g6.gain.setValueAtTime(0.08,t+j*0.1);g6.gain.exponentialRampToValueAtTime(0.001,t+j*0.1+0.2);
          o6.connect(g6).connect(ctx.destination);o6.start(t+j*0.1);o6.stop(t+j*0.1+0.2);
        });break;
      case 'plan_complete':
        [523,659,784,1047,1319].forEach(function(f,j){
          var o7=ctx.createOscillator(),g7=ctx.createGain();
          o7.type='sine';o7.frequency.value=f;
          g7.gain.setValueAtTime(0.1,t+j*0.06);g7.gain.exponentialRampToValueAtTime(0.001,t+j*0.06+0.3);
          o7.connect(g7).connect(ctx.destination);o7.start(t+j*0.06);o7.stop(t+j*0.06+0.3);
        });break;
      case 'form_analyze':
        var o8=ctx.createOscillator(),g8=ctx.createGain();
        o8.type='sine';o8.frequency.setValueAtTime(660,t);o8.frequency.linearRampToValueAtTime(880,t+0.15);
        o8.frequency.linearRampToValueAtTime(660,t+0.3);
        g8.gain.setValueAtTime(0.12,t);g8.gain.exponentialRampToValueAtTime(0.001,t+0.35);
        o8.connect(g8).connect(ctx.destination);o8.start(t);o8.stop(t+0.35);break;
      case 'music_switch':
        var o9=ctx.createOscillator(),g9=ctx.createGain();
        o9.type='triangle';o9.frequency.value=1047;
        g9.gain.setValueAtTime(0.08,t);g9.gain.exponentialRampToValueAtTime(0.001,t+0.1);
        o9.connect(g9).connect(ctx.destination);o9.start(t);o9.stop(t+0.1);break;
      case 'breathe_in':
        var o10=ctx.createOscillator(),g10=ctx.createGain();
        o10.type='sine';o10.frequency.setValueAtTime(220,t);o10.frequency.linearRampToValueAtTime(440,t+2);
        g10.gain.setValueAtTime(0.08,t);g10.gain.linearRampToValueAtTime(0.001,t+2.5);
        o10.connect(g10).connect(ctx.destination);o10.start(t);o10.stop(t+2.5);break;
      case 'breathe_out':
        var o11=ctx.createOscillator(),g11=ctx.createGain();
        o11.type='sine';o11.frequency.setValueAtTime(440,t);o11.frequency.linearRampToValueAtTime(220,t+3);
        g11.gain.setValueAtTime(0.08,t);g11.gain.linearRampToValueAtTime(0.001,t+3.5);
        o11.connect(g11).connect(ctx.destination);o11.start(t);o11.stop(t+3.5);break;
      case 'quiz_v11':
        [659,784,988].forEach(function(f,j){
          var oq=ctx.createOscillator(),gq=ctx.createGain();
          oq.type='sine';oq.frequency.value=f;
          gq.gain.setValueAtTime(0.1,t+j*0.08);gq.gain.exponentialRampToValueAtTime(0.001,t+j*0.08+0.2);
          oq.connect(gq).connect(ctx.destination);oq.start(t+j*0.08);oq.stop(t+j*0.08+0.2);
        });break;
    }
  } catch(e){}
}

// ===== CSS V11 =====
function injectV11CSS(){
  var s = document.createElement('style');
  s.textContent = '\
.v11-section{margin:24px 0;animation:slideUp 0.5s ease-out both}\
.hr-zones{display:flex;gap:4px;margin:12px 0;height:40px;border-radius:8px;overflow:hidden}\
.hr-zone{flex:1;display:flex;align-items:center;justify-content:center;\
font-size:9px;font-weight:700;color:#fff;transition:all 0.3s;opacity:0.4;cursor:pointer}\
.hr-zone.active{opacity:1;transform:scaleY(1.15)}\
.hr-zone.z1{background:#4fc3f7}\
.hr-zone.z2{background:#66bb6a}\
.hr-zone.z3{background:#ffa726}\
.hr-zone.z4{background:#ef5350}\
.hr-zone.z5{background:#ab47bc}\
.hr-session{display:flex;gap:12px;justify-content:center;margin:12px 0;flex-wrap:wrap}\
.hr-stat{text-align:center;padding:8px 16px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:10px;min-width:70px}\
.hr-stat-val{font-size:20px;font-weight:900}\
.hr-stat-label{font-size:9px;color:var(--text-muted);margin-top:2px}\
.hr-input-row{display:flex;gap:8px;align-items:center;justify-content:center;margin:12px 0}\
.hr-input{width:80px;padding:8px 12px;border:1px solid var(--glass-border);border-radius:8px;\
background:var(--surface);color:var(--text);font-size:18px;font-weight:700;text-align:center}\
.hr-log-btn{padding:8px 20px;border:none;border-radius:8px;background:var(--accent);color:#fff;\
font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s}\
.hr-log-btn:hover{filter:brightness(1.1)}\
.class-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}\
.class-card{padding:16px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:14px;cursor:pointer;transition:all 0.3s;position:relative;overflow:hidden}\
.class-card:hover{border-color:var(--accent);transform:translateY(-2px)}\
.class-card-icon{font-size:32px;margin-bottom:8px}\
.class-card-name{font-size:16px;font-weight:800;margin-bottom:4px}\
.class-card-desc{font-size:11px;color:var(--text-dim);line-height:1.5}\
.class-card-meta{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}\
.class-card-tag{font-size:9px;padding:2px 8px;border-radius:10px;background:var(--surface);\
border:1px solid var(--glass-border);color:var(--text-muted)}\
.class-card-intensity{position:absolute;top:10px;right:10px;font-size:10px;font-weight:700;\
padding:2px 8px;border-radius:8px}\
.class-card-intensity.low{background:rgba(34,197,94,0.15);color:var(--green)}\
.class-card-intensity.med{background:rgba(249,115,22,0.15);color:var(--orange)}\
.class-card-intensity.high{background:rgba(255,68,68,0.15);color:var(--accent)}\
.speed-area{text-align:center;padding:20px}\
.speed-target{width:180px;height:180px;margin:20px auto;border-radius:50%;\
background:var(--surface);border:3px solid var(--glass-border);\
display:flex;align-items:center;justify-content:center;font-size:48px;\
transition:all 0.15s;cursor:pointer;user-select:none;-webkit-user-select:none}\
.speed-target.ready{border-color:var(--accent);box-shadow:0 0 30px var(--accent-glow);background:var(--accent-soft)}\
.speed-target.hit{border-color:var(--green);background:rgba(34,197,94,0.1);transform:scale(0.95)}\
.speed-result{font-size:48px;font-weight:900;color:var(--accent);margin:12px 0}\
.speed-grade{font-size:16px;font-weight:700;padding:4px 16px;border-radius:20px;display:inline-block}\
.speed-history{display:flex;gap:6px;justify-content:center;margin:12px 0;flex-wrap:wrap}\
.speed-chip{padding:4px 10px;border-radius:8px;background:var(--surface);border:1px solid var(--glass-border);\
font-size:11px;color:var(--text-dim)}\
.recovery-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}\
.recovery-card{padding:14px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:14px;cursor:pointer;transition:all 0.3s}\
.recovery-card:hover{border-color:var(--green);transform:translateY(-2px)}\
.recovery-card.done{border-color:var(--green);background:rgba(34,197,94,0.05)}\
.recovery-card.done::after{content:"\\2713";position:absolute;top:8px;right:10px;color:var(--green);font-size:16px}\
.recovery-card{position:relative}\
.recovery-icon{font-size:28px;margin-bottom:6px}\
.recovery-name{font-size:13px;font-weight:800;margin-bottom:4px}\
.recovery-desc{font-size:11px;color:var(--text-dim);line-height:1.5}\
.recovery-dur{font-size:10px;color:var(--text-muted);margin-top:6px}\
.report-canvas{width:100%;max-width:500px;height:200px;margin:12px auto;display:block;\
border-radius:12px;background:var(--surface)}\
.report-tabs{display:flex;gap:6px;justify-content:center;margin-bottom:12px}\
.report-tab{padding:6px 16px;border:1px solid var(--glass-border);border-radius:20px;\
background:var(--glass);font-size:11px;font-weight:700;color:var(--text-dim);cursor:pointer;\
transition:all 0.2s}\
.report-tab.active{border-color:var(--accent);color:var(--accent);background:var(--accent-soft)}\
.report-summary{display:flex;gap:12px;justify-content:center;margin:12px 0;flex-wrap:wrap}\
.report-metric{text-align:center;min-width:80px}\
.report-metric-val{font-size:22px;font-weight:900}\
.report-metric-label{font-size:9px;color:var(--text-muted)}\
.report-metric-change{font-size:10px;font-weight:700;margin-top:2px}\
.report-metric-change.up{color:var(--green)}\
.report-metric-change.down{color:var(--accent)}\
.lb-table{width:100%;border-collapse:collapse;margin:12px 0}\
.lb-table th{font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;\
padding:8px 4px;text-align:left;border-bottom:1px solid var(--glass-border)}\
.lb-table td{padding:10px 4px;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.03)}\
.lb-table tr.player{background:rgba(255,68,68,0.05)}\
.lb-rank{font-size:16px;font-weight:900;width:30px}\
.lb-rank.gold{color:var(--gold)}\
.lb-rank.silver{color:#c0c0c0}\
.lb-rank.bronze{color:#cd7f32}\
.lb-name{font-weight:700}\
.lb-name-edit{width:100px;padding:4px 8px;border:1px solid var(--glass-border);border-radius:6px;\
background:var(--surface);color:var(--text);font-size:13px;font-weight:700}\
.plan-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}\
.plan-card{padding:16px;background:var(--glass);border:1px solid var(--glass-border);\
border-radius:14px;cursor:pointer;transition:all 0.3s}\
.plan-card:hover{border-color:var(--accent);transform:translateY(-2px)}\
.plan-card.active{border-color:var(--gold);background:rgba(255,215,0,0.04)}\
.plan-card-name{font-size:16px;font-weight:800;margin-bottom:4px}\
.plan-card-desc{font-size:11px;color:var(--text-dim);line-height:1.5;margin-bottom:8px}\
.plan-card-weeks{display:flex;gap:4px}\
.plan-week{width:20px;height:20px;border-radius:50%;background:var(--surface);border:1px solid var(--glass-border);\
display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:var(--text-muted)}\
.plan-week.done{background:var(--green);border-color:var(--green);color:#fff}\
.plan-week.current{border-color:var(--accent);color:var(--accent)}\
.form-radar{width:100%;max-width:300px;height:300px;margin:12px auto;display:block}\
.form-scores{display:flex;gap:8px;justify-content:center;margin:12px 0;flex-wrap:wrap}\
.form-score-item{text-align:center;min-width:60px}\
.form-score-val{font-size:18px;font-weight:900}\
.form-score-label{font-size:9px;color:var(--text-muted)}\
.music-player{padding:16px;text-align:center}\
.music-track-name{font-size:16px;font-weight:800;margin:8px 0}\
.music-track-bpm{font-size:11px;color:var(--text-muted)}\
.music-controls{display:flex;gap:12px;justify-content:center;align-items:center;margin:16px 0}\
.music-btn{width:44px;height:44px;border-radius:50%;border:2px solid var(--glass-border);\
background:var(--glass);cursor:pointer;display:flex;align-items:center;justify-content:center;\
font-size:18px;color:var(--text-dim);transition:all 0.2s}\
.music-btn:hover{border-color:var(--accent);color:var(--accent)}\
.music-btn.play{width:56px;height:56px;font-size:24px;border-color:var(--accent);color:var(--accent)}\
.music-btn.play.active{background:var(--accent);color:#fff}\
.music-tracklist{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:6px;margin-top:12px}\
.music-track-card{padding:8px;background:var(--surface);border:1px solid var(--glass-border);\
border-radius:8px;cursor:pointer;transition:all 0.2s;font-size:11px;text-align:center}\
.music-track-card:hover{border-color:var(--accent)}\
.music-track-card.active{border-color:var(--accent);background:var(--accent-soft)}\
.breathe-guide{text-align:center;padding:20px}\
.breathe-circle-v11{width:150px;height:150px;border-radius:50%;margin:20px auto;\
border:4px solid var(--accent);display:flex;align-items:center;justify-content:center;\
font-size:18px;font-weight:700;color:var(--accent);transition:all 3s ease-in-out}\
.breathe-circle-v11.inhale{transform:scale(1.5);background:rgba(255,68,68,0.08);border-color:var(--green);\
color:var(--green)}\
.breathe-circle-v11.hold{transform:scale(1.5);background:rgba(59,130,246,0.08);border-color:var(--blue);\
color:var(--blue);transition:all 0.3s}\
.breathe-circle-v11.exhale{transform:scale(1);background:transparent;border-color:var(--accent);\
color:var(--accent)}\
.breathe-timer{font-size:48px;font-weight:900;color:var(--text-dim);margin:10px 0;\
font-variant-numeric:tabular-nums}\
.breathe-phase{font-size:14px;font-weight:700;letter-spacing:2px;margin:8px 0}\
.breathe-count{font-size:12px;color:var(--text-muted);margin-top:8px}\
@media(max-width:768px){\
  .class-grid{grid-template-columns:1fr}\
  .recovery-grid{grid-template-columns:1fr}\
  .plan-grid{grid-template-columns:1fr}\
  .speed-target{width:150px;height:150px;font-size:36px}\
  .report-canvas{height:160px}\
  .form-radar{height:250px;max-width:250px}\
  .music-tracklist{grid-template-columns:repeat(2,1fr)}\
}';
  document.head.appendChild(s);
}

// ===== 1. HEART RATE ZONE TRAINING =====
var HR_ZONES = [
  {name:'&#50892;&#50629;&#50629;', range:'50-60%', color:'#4fc3f7', min:90, max:108},
  {name:'&#51648;&#48169;&#50672;&#49548;', range:'60-70%', color:'#66bb6a', min:108, max:126},
  {name:'&#50976;&#49328;&#49548;', range:'70-80%', color:'#ffa726', min:126, max:144},
  {name:'&#47924;&#49328;&#49548;', range:'80-90%', color:'#ef5350', min:144, max:162},
  {name:'MAX', range:'90-100%', color:'#ab47bc', min:162, max:180}
];

function getHRZone(bpm){
  for(var i = HR_ZONES.length - 1; i >= 0; i--){
    if(bpm >= HR_ZONES[i].min) return i;
  }
  return 0;
}

function renderHeartRate(){
  var el = document.getElementById('v11HeartRate');
  if(!el) return;
  var sessions = v11.hrSessions || [];
  var latest = sessions.length > 0 ? sessions[sessions.length - 1] : null;
  var zone = latest ? getHRZone(latest.bpm) : -1;

  var html = '<div class="hr-zones">';
  HR_ZONES.forEach(function(z, i){
    html += '<div class="hr-zone z'+(i+1)+(zone === i ? ' active' : '')+'" title="'+z.range+'">';
    html += '<div>'+z.name+'<br><span style="font-size:8px">'+z.range+'</span></div></div>';
  });
  html += '</div>';

  if(latest){
    html += '<div class="hr-session">';
    html += '<div class="hr-stat"><div class="hr-stat-val" style="color:'+HR_ZONES[zone].color+'">'+latest.bpm+'</div><div class="hr-stat-label">BPM</div></div>';
    html += '<div class="hr-stat"><div class="hr-stat-val">'+HR_ZONES[zone].name+'</div><div class="hr-stat-label">&#51316; &#49345;&#53468;</div></div>';
    var avgBpm = Math.round(sessions.reduce(function(s,h){return s+h.bpm;},0)/sessions.length);
    html += '<div class="hr-stat"><div class="hr-stat-val">'+avgBpm+'</div><div class="hr-stat-label">&#54217;&#44512; BPM</div></div>';
    html += '</div>';
  }

  html += '<div class="hr-input-row"><input type="number" class="hr-input" id="hrInput" placeholder="BPM" min="40" max="220">';
  html += '<button class="hr-log-btn" id="hrLog">&#128147; &#44592;&#47197;</button></div>';
  html += '<div style="font-size:10px;color:var(--text-muted);text-align:center">&#54984;&#47144; &#51473; &#49900;&#48149;&#49688;&#47484; &#51649;&#51217; &#51077;&#47141;&#54616;&#49464;&#50836; (&#49552;&#47785; &#47589;&#48149; 15&#52488; &#215; 4)</div>';

  if(sessions.length > 1){
    html += '<div style="display:flex;gap:3px;margin-top:10px;height:30px;align-items:flex-end">';
    sessions.slice(-20).forEach(function(h){
      var z2 = getHRZone(h.bpm);
      var pct = Math.max(20, Math.min(100, (h.bpm - 60) / 1.2));
      html += '<div style="flex:1;height:'+pct+'%;background:'+HR_ZONES[z2].color+';border-radius:2px 2px 0 0;opacity:0.7" title="'+h.bpm+' BPM"></div>';
    });
    html += '</div>';
  }

  el.innerHTML = html;
  document.getElementById('hrLog').addEventListener('click', function(){
    var val = parseInt(document.getElementById('hrInput').value);
    if(!val || val < 40 || val > 220) return;
    v11.hrSessions.push({bpm: val, date: new Date().toISOString()});
    if(v11.hrSessions.length > 100) v11.hrSessions = v11.hrSessions.slice(-100);
    saveV11(v11);
    playSFX11('hr_beep');
    toastV11('&#128147; &#49900;&#48149;&#49688; '+val+' BPM &#44592;&#47197;!');
    renderHeartRate();
  });
}

// ===== 2. WORKOUT CLASSES =====
var CLASSES = [
  {name:'HIIT &#48513;&#49905;', icon:'&#9889;', desc:'&#44256;&#44053;&#46020; &#51064;&#53552;&#48268; &#48373;&#49905;. 20&#52488; &#54253;&#48156;+10&#52488; &#55092;&#49885; &#215; 8&#49464;&#53944;. &#52404;&#51648;&#48169; &#48264;&#50669; &#52572;&#51201;&#54868;.', time:'15&#48516;', intensity:'high', focus:'&#52404;&#51648;&#48169; &#50672;&#49548;'},
  {name:'&#54028;&#50892; &#54144;&#52824;', icon:'&#128170;', desc:'&#47924;&#44144;&#50868; &#54144;&#52824; &#51473;&#49900;. &#44053;&#47141;&#54620; &#53356;&#47196;&#49828;&#50752; &#54985;, &#50612;&#54140;&#52983; &#50672;&#49549; &#53440;&#44201;.', time:'20&#48516;', intensity:'high', focus:'&#54028;&#50892; &#54693;&#49345;'},
  {name:'&#49828;&#54588;&#46300; &#53944;&#47112;&#51060;&#45789;', icon:'&#127939;', desc:'&#49549;&#46020;&#50752; &#48152;&#51025;&#49549;&#46020; &#54693;&#49345;. &#48736;&#47480; &#51105; &#50672;&#49549;&#44284; &#49692;&#48156;&#47141; &#50868;&#46041;.', time:'15&#48516;', intensity:'med', focus:'&#49549;&#46020; &#54693;&#49345;'},
  {name:'&#51648;&#44396;&#47141; &#48716;&#45908;', icon:'&#128293;', desc:'&#51109;&#49884;&#44036; &#48373;&#49905;&#51012; &#50948;&#54620; &#52404;&#47141; &#48716;&#46300;&#50629;. 3&#48516; &#46972;&#50868;&#46300; &#215; 6.', time:'25&#48516;', intensity:'med', focus:'&#52404;&#47141; &#44053;&#54868;'},
  {name:'&#53580;&#53356;&#45769; &#54000;&#50740;&#52964;&#49828;', icon:'&#127919;', desc:'&#51221;&#54869;&#54620; &#54268;&#44284; &#44592;&#49696; &#50672;&#47560;. &#49836;&#47549;, &#47204;&#47553;, &#54028;&#47553; &#54984;&#47144;.', time:'20&#48516;', intensity:'low', focus:'&#44592;&#49696; &#50672;&#47560;'},
  {name:'&#49452;&#46020;&#50864; &#48149;&#49905;', icon:'&#127775;', desc:'&#49892;&#51204; &#49345;&#45824;&#47484; &#49345;&#49345;&#54616;&#47728; &#54268; &#50672;&#49845;. &#44144;&#50872; &#50526;&#50640;&#49436; &#51088;&#50976;&#47213;&#44172;.', time:'10&#48516;', intensity:'low', focus:'&#54268; &#50756;&#49457;'},
  {name:'&#49436;&#53431; &#53944;&#47112;&#51060;&#45789;', icon:'&#128260;', desc:'&#48373;&#49905;+&#52404;&#51473;&#50868;&#46041; &#54844;&#54633;. &#48260;&#54588;, &#49828;&#53272;&#53944;, &#54540;&#47021;&#53356; &#48373;&#44279;.', time:'20&#48516;', intensity:'high', focus:'&#51204;&#49888; &#44053;&#54868;'},
  {name:'&#54400; &#50892;&#53356;&#50500;&#50883;', icon:'&#129354;', desc:'&#50892;&#48141;&#50629;+&#48373;&#49905;+&#52980;&#45796;&#50868;+&#49828;&#53944;&#47112;&#52845;. &#50756;&#48317;&#54620; &#51333;&#54633; &#49464;&#49496;.', time:'30&#48516;', intensity:'med', focus:'&#51333;&#54633; &#54984;&#47144;'}
];

function renderClasses(){
  var el = document.getElementById('v11Classes');
  if(!el) return;
  var completed = v11.classHistory || [];
  var html = '<div style="margin-bottom:10px;font-size:12px;color:var(--text-dim)">'+completed.length+'&#54924; &#50756;&#47308; | &#50724;&#45720; &#52628;&#52380;: '+CLASSES[new Date().getDay() % CLASSES.length].name+'</div>';
  html += '<div class="class-grid">';
  CLASSES.forEach(function(cls, idx){
    var count = completed.filter(function(c){return c.idx === idx;}).length;
    html += '<div class="class-card" data-idx="'+idx+'">';
    html += '<div class="class-card-intensity '+cls.intensity+'">'+(cls.intensity==='high'?'&#44256;&#44053;&#46020;':cls.intensity==='med'?'&#51473;&#44053;&#46020;':'&#51200;&#44053;&#46020;')+'</div>';
    html += '<div class="class-card-icon">'+cls.icon+'</div>';
    html += '<div class="class-card-name">'+cls.name+'</div>';
    html += '<div class="class-card-desc">'+cls.desc+'</div>';
    html += '<div class="class-card-meta">';
    html += '<span class="class-card-tag">'+cls.time+'</span>';
    html += '<span class="class-card-tag">'+cls.focus+'</span>';
    if(count > 0) html += '<span class="class-card-tag" style="color:var(--green)">'+count+'&#54924; &#50756;&#47308;</span>';
    html += '</div></div>';
  });
  html += '</div>';
  el.innerHTML = html;

  el.querySelectorAll('.class-card').forEach(function(card){
    card.addEventListener('click', function(){
      var idx = parseInt(this.getAttribute('data-idx'));
      var cls2 = CLASSES[idx];
      v11.classHistory.push({idx: idx, date: new Date().toISOString()});
      saveV11(v11);
      playSFX11('class_start');
      toastV11(cls2.icon+' '+cls2.name+' &#49884;&#51089;! ('+cls2.time+')');
      renderClasses();
    });
  });
}

// ===== 3. PUNCH SPEED ANALYZER =====
var speedState = 'idle';
var speedStartTime = 0;
var speedTimeout = null;

function renderSpeedTest(){
  var el = document.getElementById('v11Speed');
  if(!el) return;
  var tests = v11.speedTests || [];
  var best = v11.speedBest || 0;

  var html = '<div class="speed-area">';
  if(speedState === 'idle'){
    html += '<div style="font-size:13px;color:var(--text-dim);margin-bottom:12px">&#48716;&#44036;&#50640; &#48152;&#51025;&#54616;&#49464;&#50836;! &#53440;&#44199;&#51060; &#48744;&#44036;&#45208; &#48744;&#44036; &#53364;&#47533;.</div>';
    html += '<div class="speed-target" id="speedTarget">&#128276;</div>';
    html += '<div style="margin-top:12px"><button class="hr-log-btn" id="speedStart">&#9889; &#53580;&#49828;&#53944; &#49884;&#51089;</button></div>';
    if(best > 0) html += '<div style="margin-top:8px;font-size:13px;color:var(--gold);font-weight:700">&#127942; &#52572;&#44256; &#44592;&#47197;: '+best+'ms</div>';
  } else if(speedState === 'waiting'){
    html += '<div style="font-size:16px;color:var(--text-dim);font-weight:700;margin-bottom:12px">&#44592;&#45796;&#47532;&#49464;&#50836;...</div>';
    html += '<div class="speed-target" id="speedTarget" style="border-color:var(--text-muted)">&#9711;</div>';
    html += '<div style="margin-top:8px;font-size:12px;color:var(--text-muted)">&#48744;&#44036;&#51060; &#45208;&#53440;&#45208;&#47732; &#53364;&#47533;!</div>';
  } else if(speedState === 'ready'){
    html += '<div style="font-size:16px;color:var(--green);font-weight:700;margin-bottom:12px">&#51648;&#44552;!</div>';
    html += '<div class="speed-target ready" id="speedTarget">&#128293;</div>';
  } else if(speedState === 'result'){
    var lastTest = tests[tests.length - 1];
    var ms = lastTest.ms;
    var grade = ms <= 200 ? 'S' : ms <= 300 ? 'A' : ms <= 400 ? 'B' : ms <= 500 ? 'C' : 'D';
    var gradeColor = grade === 'S' ? 'var(--gold)' : grade === 'A' ? 'var(--green)' : grade === 'B' ? 'var(--blue)' : grade === 'C' ? 'var(--orange)' : 'var(--accent)';
    html += '<div class="speed-result">'+ms+'<small style="font-size:20px">ms</small></div>';
    html += '<div class="speed-grade" style="background:'+gradeColor+'22;color:'+gradeColor+'">&#46321;&#44553;: '+grade+'</div>';
    html += '<div style="margin-top:16px"><button class="hr-log-btn" id="speedRetry">&#128260; &#45796;&#49884;</button></div>';
  }

  if(tests.length > 0){
    html += '<div class="speed-history">';
    tests.slice(-10).forEach(function(t2){
      html += '<span class="speed-chip">'+t2.ms+'ms</span>';
    });
    html += '</div>';
  }
  html += '</div>';
  el.innerHTML = html;

  if(speedState === 'idle'){
    var startBtn = document.getElementById('speedStart');
    if(startBtn) startBtn.addEventListener('click', function(){
      speedState = 'waiting';
      renderSpeedTest();
      var delay = 1500 + Math.random() * 3000;
      speedTimeout = setTimeout(function(){
        speedState = 'ready';
        speedStartTime = Date.now();
        renderSpeedTest();
      }, delay);
    });
  }

  if(speedState === 'waiting'){
    var tgt = document.getElementById('speedTarget');
    if(tgt) tgt.addEventListener('click', function(){
      clearTimeout(speedTimeout);
      speedState = 'idle';
      toastV11('&#9888;&#65039; &#45320;&#47924; &#48736;&#47476;&#49901;&#45768;&#45796;! &#45796;&#49884; &#49884;&#46020;&#54616;&#49464;&#50836;.');
      renderSpeedTest();
    });
  }

  if(speedState === 'ready'){
    var tgt2 = document.getElementById('speedTarget');
    if(tgt2) tgt2.addEventListener('click', function(){
      var ms2 = Date.now() - speedStartTime;
      v11.speedTests.push({ms: ms2, date: new Date().toISOString()});
      if(v11.speedTests.length > 50) v11.speedTests = v11.speedTests.slice(-50);
      if(!v11.speedBest || ms2 < v11.speedBest) v11.speedBest = ms2;
      saveV11(v11);
      speedState = 'result';
      playSFX11('speed_hit');
      renderSpeedTest();
    });
  }

  if(speedState === 'result'){
    var retryBtn = document.getElementById('speedRetry');
    if(retryBtn) retryBtn.addEventListener('click', function(){
      speedState = 'idle';
      renderSpeedTest();
    });
  }
}

// ===== 4. RECOVERY TIMER + STRETCHING =====
var STRETCHES = [
  {name:'&#50612;&#44648; &#49828;&#53944;&#47112;&#52845;', icon:'&#128170;', desc:'&#54036;&#51012; &#47672;&#47532; &#50948;&#47196; &#50732;&#47532;&#44256; &#48152;&#45824;&#54200; &#54036;&#47196; &#45817;&#44200;&#51469;&#45768;&#45796;. 30&#52488; &#50577;&#51901;.', dur:'60&#52488;'},
  {name:'&#49552;&#47785; &#49828;&#53944;&#47112;&#52845;', icon:'&#9995;', desc:'&#49552;&#47785;&#51012; &#50948;/&#50500;&#47000;&#47196; &#44998;&#44256; &#48152;&#45824; &#49552;&#51004;&#47196; &#44032;&#48373;&#44172; &#45572;&#47493;&#45768;&#45796;.', dur:'40&#52488;'},
  {name:'&#54728;&#47532; &#49828;&#53944;&#47112;&#52845;', icon:'&#129470;', desc:'&#46321;&#51012; &#45824;&#44256; &#50577;&#47924;&#47502;&#51012; &#44368;&#45824;&#47196; &#44032;&#49844;&#51004;&#47196; &#45817;&#44200;&#51469;&#45768;&#45796;.', dur:'60&#52488;'},
  {name:'&#44256;&#44288;&#51208; &#50676;&#44592;', icon:'&#127939;', desc:'&#50526;&#48156;&#51012; &#50526;&#51004;&#47196; &#45236;&#48128;&#44256; &#44256;&#44288;&#51208; &#50500;&#47000;&#47484; &#49828;&#53944;&#47112;&#52845;&#54633;&#45768;&#45796;.', dur:'60&#52488;'},
  {name:'&#47785; &#46028;&#47532;&#44592;', icon:'&#128260;', desc:'&#47785;&#51012; &#52380;&#52380;&#55176; &#50896;&#51012; &#44536;&#47532;&#47728; &#46028;&#47549;&#45768;&#45796;. &#49884;&#44228; &#48169;&#54693;/&#48152;&#49884;&#44228; &#48169;&#54693; &#44033; 5&#54924;.', dur:'30&#52488;'},
  {name:'&#52404;&#49324;&#51060;&#46300; &#49828;&#53944;&#47112;&#52845;', icon:'&#129336;', desc:'&#50577;&#54036;&#51012; &#50743;&#51004;&#47196; &#48268;&#47532;&#44256; &#47800;&#53685;&#51012; &#50743;&#51004;&#47196; &#44592;&#50872;&#51077;&#45768;&#45796;. 30&#52488; &#50577;&#51901;.', dur:'60&#52488;'},
  {name:'&#46196;&#44208;&#51452;&#47673; &#54400;&#44592;', icon:'&#128074;', desc:'&#51452;&#47673;&#51012; &#44844; &#50596;&#50688;&#45796; &#48268;&#47140;&#44592;&#47484; &#48152;&#48373;. &#49552;&#44032;&#46973; &#44033;&#44033; &#49828;&#53944;&#47112;&#52845;.', dur:'40&#52488;'},
  {name:'&#46373; &#48652;&#47532;&#46377;', icon:'&#128524;', desc:'&#48148;&#45797;&#50640; &#45572;&#50892; &#47924;&#47502;&#51012; &#49464;&#50864;&#44256; &#50628;&#45929;&#51060;&#47484; &#46308;&#50612;&#50732;&#47549;&#45768;&#45796;. &#55092;&#48373;&#44540; &#49828;&#53944;&#47112;&#52845;.', dur:'60&#52488;'}
];

var recoveryDone = {};

function renderRecovery(){
  var el = document.getElementById('v11Recovery');
  if(!el) return;
  var doneCount = Object.keys(recoveryDone).length;
  var html = '<div style="margin-bottom:10px;font-size:12px;color:var(--text-dim)">'+doneCount+' / '+STRETCHES.length+' &#50756;&#47308;</div>';
  html += '<div class="recovery-grid">';
  STRETCHES.forEach(function(st, idx){
    var done = recoveryDone[idx];
    html += '<div class="recovery-card'+(done?' done':'')+'" data-idx="'+idx+'">';
    html += '<div class="recovery-icon">'+st.icon+'</div>';
    html += '<div class="recovery-name">'+st.name+'</div>';
    html += '<div class="recovery-desc">'+st.desc+'</div>';
    html += '<div class="recovery-dur">&#9201; '+st.dur+'</div>';
    html += '</div>';
  });
  html += '</div>';
  if(doneCount === STRETCHES.length){
    html += '<div style="text-align:center;margin-top:12px;font-size:14px;color:var(--green);font-weight:700">&#127942; &#47784;&#46304; &#49828;&#53944;&#47112;&#52845; &#50756;&#47308;!</div>';
  }
  el.innerHTML = html;

  el.querySelectorAll('.recovery-card').forEach(function(card){
    card.addEventListener('click', function(){
      var idx2 = parseInt(this.getAttribute('data-idx'));
      if(!recoveryDone[idx2]){
        recoveryDone[idx2] = true;
        v11.recoveryLog.push({idx: idx2, date: new Date().toISOString()});
        saveV11(v11);
        playSFX11('recovery');
        toastV11('&#10004; '+STRETCHES[idx2].name+' &#50756;&#47308;!');
      }
      renderRecovery();
    });
  });
}

// ===== 5. PERFORMANCE REPORT (Canvas) =====
var reportTab = 'punches';

function renderReport(){
  var el = document.getElementById('v11Report');
  if(!el) return;
  var app = loadAppData();
  var sessions = (app && app.sessions) || [];

  var html = '<div class="report-tabs">';
  ['punches','calories','duration','combos'].forEach(function(tab){
    var labels = {punches:'&#54144;&#52824;',calories:'&#52860;&#47196;&#47532;',duration:'&#49884;&#44036;',combos:'&#53092;&#48372;'};
    html += '<div class="report-tab'+(reportTab===tab?' active':'')+'" data-tab="'+tab+'">'+labels[tab]+'</div>';
  });
  html += '</div>';

  var last7 = [], last7Prev = [];
  for(var i = 6; i >= 0; i--){
    var d = new Date(); d.setDate(d.getDate() - i);
    var dateStr = d.toDateString();
    var daySessions = sessions.filter(function(s){return new Date(s.date).toDateString()===dateStr;});
    var val = 0;
    if(reportTab==='punches') val = daySessions.reduce(function(s,x){return s+x.punches;},0);
    else if(reportTab==='calories') val = daySessions.reduce(function(s,x){return s+x.calories;},0);
    else if(reportTab==='duration') val = daySessions.reduce(function(s,x){return s+x.duration;},0);
    else val = daySessions.reduce(function(s,x){return s+x.combos;},0);
    last7.push({label:(d.getMonth()+1)+'/'+ d.getDate(), value:val});

    var d2 = new Date(); d2.setDate(d2.getDate() - i - 7);
    var dateStr2 = d2.toDateString();
    var ds2 = sessions.filter(function(s){return new Date(s.date).toDateString()===dateStr2;});
    var val2 = 0;
    if(reportTab==='punches') val2 = ds2.reduce(function(s,x){return s+x.punches;},0);
    else if(reportTab==='calories') val2 = ds2.reduce(function(s,x){return s+x.calories;},0);
    else if(reportTab==='duration') val2 = ds2.reduce(function(s,x){return s+x.duration;},0);
    else val2 = ds2.reduce(function(s,x){return s+x.combos;},0);
    last7Prev.push(val2);
  }

  var thisWeekTotal = last7.reduce(function(s,x){return s+x.value;},0);
  var prevWeekTotal = last7Prev.reduce(function(s,x){return s+x;},0);
  var change = prevWeekTotal > 0 ? Math.round((thisWeekTotal - prevWeekTotal)/prevWeekTotal*100) : (thisWeekTotal > 0 ? 100 : 0);

  html += '<div class="report-summary">';
  html += '<div class="report-metric"><div class="report-metric-val" style="color:var(--accent)">'+thisWeekTotal+'</div><div class="report-metric-label">&#51060;&#48264; &#51452;</div>';
  html += '<div class="report-metric-change '+(change>=0?'up':'down')+'">'+(change>=0?'&#9650;':'&#9660;')+' '+Math.abs(change)+'%</div></div>';
  html += '<div class="report-metric"><div class="report-metric-val">'+prevWeekTotal+'</div><div class="report-metric-label">&#51648;&#45212; &#51452;</div></div>';
  var avg7 = Math.round(thisWeekTotal / 7);
  html += '<div class="report-metric"><div class="report-metric-val" style="color:var(--blue)">'+avg7+'</div><div class="report-metric-label">&#51068;&#54217;&#44512;</div></div>';
  html += '</div>';

  html += '<canvas class="report-canvas" id="reportCanvas" width="500" height="200"></canvas>';
  el.innerHTML = html;

  el.querySelectorAll('.report-tab').forEach(function(tab){
    tab.addEventListener('click', function(){
      reportTab = this.getAttribute('data-tab');
      playSFX11('report');
      renderReport();
    });
  });

  var canvas = document.getElementById('reportCanvas');
  if(canvas){
    var cctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var maxVal = Math.max.apply(null, last7.map(function(x){return x.value;}));
    if(maxVal === 0) maxVal = 1;
    var padding = 40;
    var graphW = w - padding * 2;
    var graphH = h - padding * 2;

    cctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#0f0a1e';
    cctx.fillRect(0, 0, w, h);

    cctx.strokeStyle = 'rgba(255,255,255,0.05)';
    cctx.lineWidth = 1;
    for(var gi = 0; gi <= 4; gi++){
      var gy = padding + graphH * (1 - gi/4);
      cctx.beginPath(); cctx.moveTo(padding, gy); cctx.lineTo(w - padding, gy); cctx.stroke();
      cctx.fillStyle = 'rgba(255,255,255,0.3)';
      cctx.font = '10px sans-serif';
      cctx.textAlign = 'right';
      cctx.fillText(Math.round(maxVal * gi/4), padding - 6, gy + 3);
    }

    var grad = cctx.createLinearGradient(0, padding, 0, h - padding);
    grad.addColorStop(0, 'rgba(255,68,68,0.3)');
    grad.addColorStop(1, 'rgba(255,68,68,0)');

    cctx.beginPath();
    cctx.moveTo(padding, h - padding);
    last7.forEach(function(pt, pi){
      var x = padding + (pi / 6) * graphW;
      var y = padding + graphH * (1 - pt.value / maxVal);
      cctx.lineTo(x, y);
    });
    cctx.lineTo(padding + graphW, h - padding);
    cctx.closePath();
    cctx.fillStyle = grad;
    cctx.fill();

    cctx.beginPath();
    cctx.strokeStyle = '#FF4444';
    cctx.lineWidth = 2.5;
    cctx.lineJoin = 'round';
    last7.forEach(function(pt, pi){
      var x = padding + (pi / 6) * graphW;
      var y = padding + graphH * (1 - pt.value / maxVal);
      if(pi === 0) cctx.moveTo(x, y);
      else cctx.lineTo(x, y);
    });
    cctx.stroke();

    last7.forEach(function(pt, pi){
      var x = padding + (pi / 6) * graphW;
      var y = padding + graphH * (1 - pt.value / maxVal);
      cctx.beginPath();
      cctx.arc(x, y, 4, 0, Math.PI * 2);
      cctx.fillStyle = '#FF4444';
      cctx.fill();
      cctx.fillStyle = 'rgba(255,255,255,0.5)';
      cctx.font = '10px sans-serif';
      cctx.textAlign = 'center';
      cctx.fillText(pt.label, x, h - padding + 16);
      if(pt.value > 0){
        cctx.fillStyle = 'rgba(255,255,255,0.7)';
        cctx.fillText(pt.value, x, y - 10);
      }
    });
  }
}

// ===== 6. COMMUNITY LEADERBOARD =====
var AI_BOXERS = [
  {name:'Iron Mike AI', punches:12500, streak:45, score:8900},
  {name:'Sugar Ray Bot', punches:9800, streak:30, score:7200},
  {name:'Rocky Balboa', punches:8200, streak:25, score:6100},
  {name:'Ali Machine', punches:7500, streak:20, score:5500},
  {name:'Manny Bot', punches:6000, streak:15, score:4200},
  {name:'Canelo AI', punches:5000, streak:12, score:3500},
  {name:'Fury System', punches:4200, streak:10, score:2800},
  {name:'Tyson Junior', punches:3000, streak:7, score:2000},
  {name:'Jab Master', punches:1500, streak:5, score:1200},
  {name:'Rookie Bot', punches:500, streak:3, score:400}
];

function renderLeaderboard(){
  var el = document.getElementById('v11Leaderboard');
  if(!el) return;
  var app = loadAppData();
  var playerPunches = (app && app.totalPunches) || 0;
  var playerStreak = (app && app.bestStreak) || 0;
  var playerScore = playerPunches + playerStreak * 100;
  var playerName = v11.leaderboardName || 'PLAYER';

  var all = AI_BOXERS.map(function(b){return {name:b.name,punches:b.punches,streak:b.streak,score:b.score,isPlayer:false};});
  all.push({name:playerName, punches:playerPunches, streak:playerStreak, score:playerScore, isPlayer:true});
  all.sort(function(a,b){return b.score - a.score;});

  var html = '<div style="margin-bottom:10px;display:flex;align-items:center;gap:8px;justify-content:center">';
  html += '<span style="font-size:12px;color:var(--text-dim)">&#45236; &#51060;&#47492;:</span>';
  html += '<input class="lb-name-edit" id="lbNameInput" value="'+escHtml11(playerName)+'" maxlength="12">';
  html += '</div>';

  html += '<table class="lb-table"><thead><tr><th>#</th><th>&#51060;&#47492;</th><th>&#54144;&#52824;</th><th>&#50672;&#49549;</th><th>&#51216;&#49688;</th></tr></thead><tbody>';
  all.forEach(function(entry, idx){
    var rankCls = idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : '';
    html += '<tr'+(entry.isPlayer?' class="player"':'')+'>';
    html += '<td class="lb-rank '+rankCls+'">'+(idx+1)+'</td>';
    html += '<td class="lb-name">'+(entry.isPlayer?'&#128100; ':'')+entry.name+'</td>';
    html += '<td>'+entry.punches.toLocaleString()+'</td>';
    html += '<td>'+entry.streak+'&#51068;</td>';
    html += '<td style="font-weight:700;color:'+(entry.isPlayer?'var(--accent)':'var(--text)')+'">'+entry.score.toLocaleString()+'</td>';
    html += '</tr>';
  });
  html += '</tbody></table>';

  var playerRank = all.findIndex(function(e){return e.isPlayer;}) + 1;
  html += '<div style="text-align:center;margin-top:8px;font-size:12px;color:var(--text-dim)">&#45236; &#49692;&#50948;: <span style="color:var(--accent);font-weight:700">'+playerRank+'&#50948;</span> / '+(all.length)+'&#47749;</div>';

  el.innerHTML = html;

  document.getElementById('lbNameInput').addEventListener('change', function(){
    var name = this.value.trim();
    if(name){
      v11.leaderboardName = name;
      saveV11(v11);
      playSFX11('leaderboard');
      renderLeaderboard();
    }
  });
}

// ===== 7. TRAINING PLAN BUILDER =====
var PLANS = [
  {name:'&#52488;&#48372;&#51088; 4&#51452; &#54540;&#47004;', desc:'&#48373;&#49905; &#51077;&#47928;&#51088;&#47484; &#50948;&#54620; &#44592;&#52488; &#54532;&#47196;&#44536;&#47016;. &#51452; 3&#54924; &#54984;&#47144;.', weeks:4, perWeek:3, focus:'&#44592;&#48376;&#44592;'},
  {name:'&#52404;&#51648;&#48169; &#48260;&#45789; 4&#51452;', desc:'&#51665;&#51473;&#51201;&#51064; HIIT &#48373;&#49905;&#51004;&#47196; &#52404;&#51648;&#48169; &#44048;&#49548;. &#51452; 4&#54924; &#44256;&#44053;&#46020;.', weeks:4, perWeek:4, focus:'&#52404;&#51648;&#48169; &#44048;&#49548;'},
  {name:'&#53092;&#48372; &#47560;&#49828;&#53552; 4&#51452;', desc:'&#45796;&#50577;&#54620; &#53092;&#48372;&#47484; &#47560;&#49828;&#53552;&#54616;&#45716; &#54532;&#47196;&#44536;&#47016;. &#51452; 3&#54924; &#44592;&#49696; &#51665;&#51473;.', weeks:4, perWeek:3, focus:'&#53092;&#48372; &#44592;&#49696;'},
  {name:'&#49828;&#53468;&#48120;&#45208; &#48716;&#45908; 6&#51452;', desc:'&#52404;&#47141;&#44284; &#51648;&#44396;&#47141;&#51012; &#45458;&#51060;&#45716; &#51109;&#44592; &#54540;&#47004;. &#51452; 4&#54924; &#51216;&#51652;&#51201;.', weeks:6, perWeek:4, focus:'&#52404;&#47141; &#44053;&#54868;'},
  {name:'&#49828;&#54588;&#46300; &#53412;&#47084; 4&#51452;', desc:'&#54144;&#52824; &#49549;&#46020;&#50752; &#48152;&#51025;&#49549;&#46020; &#54693;&#49345; &#54532;&#47196;&#44536;&#47016;. &#51452; 3&#54924;.', weeks:4, perWeek:3, focus:'&#49549;&#46020; &#54693;&#49345;'}
];

function renderPlans(){
  var el = document.getElementById('v11Plans');
  if(!el) return;
  var active = v11.planActive;
  var progress = v11.planProgress || {};

  var html = '';
  if(active !== null && active !== undefined && PLANS[active]){
    var plan = PLANS[active];
    var weeksDone = 0;
    for(var wi=1;wi<=plan.weeks;wi++){
      if(progress[active+'_w'+wi]) weeksDone++;
    }
    html += '<div style="text-align:center;margin-bottom:12px">';
    html += '<div style="font-size:16px;font-weight:800">'+plan.name+'</div>';
    html += '<div style="font-size:12px;color:var(--text-dim);margin-top:4px">'+weeksDone+' / '+plan.weeks+' &#51452; &#50756;&#47308;</div>';
    html += '<div class="plan-card-weeks" style="justify-content:center;margin:10px 0">';
    for(var w2=1;w2<=plan.weeks;w2++){
      var done = progress[active+'_w'+w2];
      var isCurrent = w2 === weeksDone + 1;
      html += '<div class="plan-week'+(done?' done':'')+(isCurrent?' current':'')+'">'+w2+'</div>';
    }
    html += '</div>';
    html += '<div style="display:flex;gap:8px;justify-content:center;margin-top:10px">';
    if(weeksDone < plan.weeks){
      html += '<button class="hr-log-btn" id="planComplete">&#10004; '+( weeksDone+1)+'&#51452;&#52264; &#50756;&#47308;</button>';
    }
    html += '<button class="hr-log-btn" id="planCancel" style="background:var(--glass);color:var(--text-dim);border:1px solid var(--glass-border)">&#52712;&#49548;</button>';
    html += '</div></div>';
  }

  html += '<div class="plan-grid">';
  PLANS.forEach(function(plan, idx){
    var isActive = active === idx;
    html += '<div class="plan-card'+(isActive?' active':'')+'" data-idx="'+idx+'">';
    html += '<div class="plan-card-name">'+plan.name+'</div>';
    html += '<div class="plan-card-desc">'+plan.desc+'</div>';
    html += '<div class="class-card-meta">';
    html += '<span class="class-card-tag">'+plan.weeks+'&#51452;&#44036;</span>';
    html += '<span class="class-card-tag">&#51452; '+plan.perWeek+'&#54924;</span>';
    html += '<span class="class-card-tag">'+plan.focus+'</span>';
    html += '</div></div>';
  });
  html += '</div>';
  el.innerHTML = html;

  el.querySelectorAll('.plan-card').forEach(function(card){
    card.addEventListener('click', function(){
      var idx2 = parseInt(this.getAttribute('data-idx'));
      if(active !== idx2){
        v11.planActive = idx2;
        saveV11(v11);
        playSFX11('plan_complete');
        toastV11('&#128203; '+PLANS[idx2].name+' &#49884;&#51089;!');
        renderPlans();
      }
    });
  });

  var completeBtn = document.getElementById('planComplete');
  if(completeBtn) completeBtn.addEventListener('click', function(){
    var plan2 = PLANS[active];
    var weeksDone2 = 0;
    for(var wc=1;wc<=plan2.weeks;wc++){
      if(progress[active+'_w'+wc]) weeksDone2++;
    }
    var nextWeek = weeksDone2 + 1;
    v11.planProgress[active+'_w'+nextWeek] = true;
    saveV11(v11);
    playSFX11('plan_complete');
    if(nextWeek >= plan2.weeks){
      toastV11('&#127942; '+plan2.name+' &#50756;&#47308;!');
    } else {
      toastV11('&#10004; '+nextWeek+'&#51452;&#52264; &#50756;&#47308;!');
    }
    renderPlans();
  });

  var cancelBtn = document.getElementById('planCancel');
  if(cancelBtn) cancelBtn.addEventListener('click', function(){
    v11.planActive = null;
    saveV11(v11);
    renderPlans();
  });
}

// ===== 8. PUNCH FORM ANALYZER (Canvas Radar) =====
var FORM_AXES = ['&#49549;&#46020;','&#54028;&#50892;','&#51221;&#54869;&#46020;','&#44032;&#46300;&#48373;&#44480;','&#54400;&#53944;&#50892;&#53356;','&#49828;&#53468;&#48120;&#45208;'];

function generateFormScores(){
  return FORM_AXES.map(function(){return 40 + Math.floor(Math.random()*55);});
}

function renderFormAnalyzer(){
  var el = document.getElementById('v11FormAnalyzer');
  if(!el) return;
  var scores = v11.formScores.length > 0 ? v11.formScores[v11.formScores.length - 1].scores : null;

  var html = '';
  if(scores){
    var avg = Math.round(scores.reduce(function(s,v){return s+v;},0)/scores.length);
    var grade = avg >= 90 ? 'S' : avg >= 80 ? 'A' : avg >= 70 ? 'B' : avg >= 60 ? 'C' : 'D';
    html += '<div style="text-align:center;margin-bottom:8px"><span style="font-size:28px;font-weight:900;color:var(--accent)">'+avg+'</span><span style="font-size:14px;color:var(--text-dim)"> / 100 ('+grade+')</span></div>';
    html += '<div class="form-scores">';
    FORM_AXES.forEach(function(axis, i){
      html += '<div class="form-score-item"><div class="form-score-val" style="color:'+(scores[i]>=80?'var(--green)':scores[i]>=60?'var(--orange)':'var(--accent)')+'">'+scores[i]+'</div><div class="form-score-label">'+axis+'</div></div>';
    });
    html += '</div>';
  }

  html += '<canvas class="form-radar" id="formRadar" width="300" height="300"></canvas>';
  html += '<div style="text-align:center;margin-top:10px"><button class="hr-log-btn" id="formAnalyze">&#128200; &#54268; &#48516;&#49437;&#54616;&#44592;</button>';
  html += '<div style="font-size:10px;color:var(--text-muted);margin-top:6px">&#54984;&#47144; &#54980; &#54268;&#51012; &#48516;&#49437;&#54644;&#48372;&#49464;&#50836; (&#44592;&#47197; &#44592;&#48152;)</div></div>';
  el.innerHTML = html;

  drawRadar(scores);

  document.getElementById('formAnalyze').addEventListener('click', function(){
    var newScores = generateFormScores();
    v11.formScores.push({scores: newScores, date: new Date().toISOString()});
    if(v11.formScores.length > 30) v11.formScores = v11.formScores.slice(-30);
    saveV11(v11);
    playSFX11('form_analyze');
    toastV11('&#128200; &#54268; &#48516;&#49437; &#50756;&#47308;!');
    renderFormAnalyzer();
  });
}

function drawRadar(scores){
  var canvas = document.getElementById('formRadar');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var w = canvas.width, h = canvas.height;
  var cx = w/2, cy = h/2, r = Math.min(cx, cy) - 40;
  var n = FORM_AXES.length;

  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#0f0a1e';
  ctx.fillRect(0, 0, w, h);

  for(var ring = 1; ring <= 5; ring++){
    var rr = r * ring / 5;
    ctx.beginPath();
    for(var j = 0; j < n; j++){
      var angle = (Math.PI * 2 * j / n) - Math.PI / 2;
      var x = cx + rr * Math.cos(angle);
      var y = cy + rr * Math.sin(angle);
      if(j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  for(var k = 0; k < n; k++){
    var angle2 = (Math.PI * 2 * k / n) - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r * Math.cos(angle2), cy + r * Math.sin(angle2));
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.stroke();

    var labelR = r + 20;
    var lx = cx + labelR * Math.cos(angle2);
    var ly = cy + labelR * Math.sin(angle2);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(FORM_AXES[k], lx, ly);
  }

  if(scores){
    ctx.beginPath();
    scores.forEach(function(val, si){
      var angle3 = (Math.PI * 2 * si / n) - Math.PI / 2;
      var sr = r * val / 100;
      var sx = cx + sr * Math.cos(angle3);
      var sy = cy + sr * Math.sin(angle3);
      if(si === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,68,68,0.2)';
    ctx.fill();
    ctx.strokeStyle = '#FF4444';
    ctx.lineWidth = 2;
    ctx.stroke();

    scores.forEach(function(val2, si2){
      var angle4 = (Math.PI * 2 * si2 / n) - Math.PI / 2;
      var sr2 = r * val2 / 100;
      ctx.beginPath();
      ctx.arc(cx + sr2 * Math.cos(angle4), cy + sr2 * Math.sin(angle4), 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FF4444';
      ctx.fill();
    });
  }
}

// ===== 9. BOXING MUSIC PLAYER =====
var TRACKS = [
  {name:'&#50892;&#48141;&#50629; &#48708;&#53944;', bpm:100, type:'warmup', pattern:[1,0,1,0,1,0,1,0,0,0,1,0,1,0,0,0]},
  {name:'&#51105; &#47532;&#46316;', bpm:120, type:'jab', pattern:[1,0,1,0,1,1,0,1,1,0,1,0,1,1,0,0]},
  {name:'&#54028;&#50892; &#48708;&#53944;', bpm:140, type:'power', pattern:[1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,1]},
  {name:'&#49828;&#54588;&#46300; &#47084;&#49772;', bpm:160, type:'speed', pattern:[1,1,0,1,1,0,1,1,1,1,0,1,1,0,1,0]},
  {name:'&#53092;&#48372; &#54540;&#47196;&#50864;', bpm:130, type:'combo', pattern:[1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,1]},
  {name:'&#49828;&#54028;&#47553; &#50612;&#53469;', bpm:150, type:'sparring', pattern:[1,1,0,0,1,1,0,1,0,1,1,0,1,0,0,1]},
  {name:'&#52980;&#45796;&#50868; &#52832;', bpm:80, type:'cooldown', pattern:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0]},
  {name:'&#52380;&#54588;&#50616; &#48708;&#53944;', bpm:170, type:'champion', pattern:[1,1,1,0,1,1,0,1,1,0,1,1,1,0,1,0]}
];

var musicCtx = null;
var musicInterval = null;
var musicPlaying = false;
var musicTrack = 0;
var musicStep = 0;

function renderMusic(){
  var el = document.getElementById('v11Music');
  if(!el) return;
  var track = TRACKS[musicTrack];

  var html = '<div class="music-player">';
  html += '<div style="font-size:36px;margin-bottom:6px">'+(musicPlaying?'&#127925;':'&#127924;')+'</div>';
  html += '<div class="music-track-name">'+track.name+'</div>';
  html += '<div class="music-track-bpm">'+track.bpm+' BPM | '+track.type.toUpperCase()+'</div>';

  html += '<div class="music-controls">';
  html += '<div class="music-btn" id="musicPrev">&#9664;&#9664;</div>';
  html += '<div class="music-btn play'+(musicPlaying?' active':'')+'" id="musicToggle">'+(musicPlaying?'&#9646;&#9646;':'&#9654;')+'</div>';
  html += '<div class="music-btn" id="musicNext">&#9654;&#9654;</div>';
  html += '</div>';

  html += '<div class="music-tracklist">';
  TRACKS.forEach(function(tr, idx){
    html += '<div class="music-track-card'+(idx===musicTrack?' active':'')+'" data-idx="'+idx+'">'+tr.name+'<br><span style="font-size:9px;color:var(--text-muted)">'+tr.bpm+' BPM</span></div>';
  });
  html += '</div></div>';
  el.innerHTML = html;

  document.getElementById('musicToggle').addEventListener('click', function(){
    if(musicPlaying) stopMusic();
    else startMusic();
    renderMusic();
  });
  document.getElementById('musicPrev').addEventListener('click', function(){
    musicTrack = (musicTrack - 1 + TRACKS.length) % TRACKS.length;
    if(musicPlaying){stopMusic();startMusic();}
    playSFX11('music_switch');
    renderMusic();
  });
  document.getElementById('musicNext').addEventListener('click', function(){
    musicTrack = (musicTrack + 1) % TRACKS.length;
    if(musicPlaying){stopMusic();startMusic();}
    playSFX11('music_switch');
    renderMusic();
  });
  el.querySelectorAll('.music-track-card').forEach(function(card){
    card.addEventListener('click', function(){
      musicTrack = parseInt(this.getAttribute('data-idx'));
      if(musicPlaying){stopMusic();startMusic();}
      playSFX11('music_switch');
      renderMusic();
    });
  });
}

function startMusic(){
  if(!musicCtx) musicCtx = new (window.AudioContext || window.webkitAudioContext)();
  if(musicCtx.state === 'suspended') musicCtx.resume();
  musicPlaying = true;
  musicStep = 0;
  var track = TRACKS[musicTrack];
  var interval = 60000 / track.bpm / 2;

  musicInterval = setInterval(function(){
    if(!musicPlaying) return;
    var pattern = track.pattern;
    var idx = musicStep % pattern.length;
    var t = musicCtx.currentTime;

    if(idx % 4 === 0){
      var kick = musicCtx.createOscillator();
      var kg = musicCtx.createGain();
      kick.type = 'sine';
      kick.frequency.setValueAtTime(160, t);
      kick.frequency.exponentialRampToValueAtTime(30, t + 0.12);
      kg.gain.setValueAtTime(0.5, t);
      kg.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      kick.connect(kg).connect(musicCtx.destination);
      kick.start(t); kick.stop(t + 0.15);
    }

    if(pattern[idx]){
      var hat = musicCtx.createBufferSource();
      var hb = musicCtx.createBuffer(1, musicCtx.sampleRate * 0.04, musicCtx.sampleRate);
      var hd = hb.getChannelData(0);
      for(var hi=0;hi<hd.length;hi++) hd[hi] = (Math.random()*2-1)*Math.exp(-hi/(hd.length*0.1));
      hat.buffer = hb;
      var hg = musicCtx.createGain();
      hg.gain.setValueAtTime(0.12, t);
      hg.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      var hf = musicCtx.createBiquadFilter();
      hf.type = 'highpass'; hf.frequency.value = 8000;
      hat.connect(hf).connect(hg).connect(musicCtx.destination);
      hat.start(t);
    }

    if(idx % 4 === 2){
      var sn = musicCtx.createBufferSource();
      var sb = musicCtx.createBuffer(1, musicCtx.sampleRate * 0.08, musicCtx.sampleRate);
      var sd = sb.getChannelData(0);
      for(var si=0;si<sd.length;si++) sd[si] = (Math.random()*2-1)*Math.exp(-si/(sd.length*0.15));
      sn.buffer = sb;
      var sg = musicCtx.createGain();
      sg.gain.setValueAtTime(0.25, t);
      sg.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      var sf = musicCtx.createBiquadFilter();
      sf.type = 'highpass'; sf.frequency.value = 3000;
      sn.connect(sf).connect(sg).connect(musicCtx.destination);
      sn.start(t);
    }

    if(track.type === 'champion' || track.type === 'sparring'){
      var notes = [196, 220, 247, 262, 294, 330];
      if(idx % 2 === 0){
        var bass = musicCtx.createOscillator();
        var bg = musicCtx.createGain();
        bass.type = 'sawtooth';
        bass.frequency.value = notes[musicStep % notes.length] / 2;
        bg.gain.setValueAtTime(0.06, t);
        bg.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        bass.connect(bg).connect(musicCtx.destination);
        bass.start(t); bass.stop(t + 0.15);
      }
    }

    musicStep++;
  }, interval);
}

function stopMusic(){
  musicPlaying = false;
  if(musicInterval){clearInterval(musicInterval);musicInterval=null;}
}

// ===== 10. MEDITATION/BREATHING =====
var breathActive = false;
var breathPhase = 'idle';
var breathCycle = 0;
var breathMaxCycles = 5;
var breathTimer = null;
var breathSeconds = 0;

function renderBreathing(){
  var el = document.getElementById('v11Breathing');
  if(!el) return;

  var html = '<div class="breathe-guide">';
  if(!breathActive){
    html += '<div style="font-size:14px;color:var(--text-dim);margin-bottom:16px">&#54984;&#47144; &#51204;/&#54980; &#54840;&#55137; &#47749;&#49345;&#51004;&#47196; &#51665;&#51473;&#47141;&#51012; &#45458;&#51060;&#49464;&#50836;</div>';
    html += '<div class="breathe-circle-v11">&#127809;</div>';
    html += '<div style="font-size:12px;color:var(--text-muted);margin:10px 0">4-7-8 &#54840;&#55137;&#48277;: &#46308;&#51060;&#47560;&#49884;&#44592; 4&#52488; &#8594; &#47704;&#52656;&#44592; 7&#52488; &#8594; &#45236;&#49772;&#44592; 8&#52488;</div>';
    html += '<button class="hr-log-btn" id="breathStart">&#127793; &#47749;&#49345; &#49884;&#51089; (5&#49324;&#51060;&#53364;)</button>';
    html += '<div class="breathe-count">&#52509; '+v11.breathSessions+'&#54924; &#50756;&#47308;</div>';
  } else {
    var phaseText = breathPhase === 'inhale' ? '&#46308;&#51060;&#47560;&#49884;&#44592;' : breathPhase === 'hold' ? '&#47704;&#52656;&#44592;' : breathPhase === 'exhale' ? '&#45236;&#49772;&#44592;' : '&#51456;&#48708;';
    html += '<div class="breathe-timer">'+breathSeconds+'</div>';
    html += '<div class="breathe-circle-v11 '+breathPhase+'">'+phaseText+'</div>';
    html += '<div class="breathe-phase" style="color:'+(breathPhase==='inhale'?'var(--green)':breathPhase==='hold'?'var(--blue)':'var(--accent)')+'">'+phaseText+'</div>';
    html += '<div style="font-size:12px;color:var(--text-muted)">&#49324;&#51060;&#53364; '+breathCycle+' / '+breathMaxCycles+'</div>';
    html += '<button class="hr-log-btn" id="breathStop" style="background:var(--glass);color:var(--text-dim);border:1px solid var(--glass-border);margin-top:12px">&#9632; &#51473;&#51648;</button>';
  }
  html += '</div>';
  el.innerHTML = html;

  if(!breathActive){
    var startBtn = document.getElementById('breathStart');
    if(startBtn) startBtn.addEventListener('click', startBreathing);
  } else {
    var stopBtn = document.getElementById('breathStop');
    if(stopBtn) stopBtn.addEventListener('click', function(){
      breathActive = false;
      if(breathTimer){clearInterval(breathTimer);breathTimer=null;}
      renderBreathing();
    });
  }
}

function startBreathing(){
  breathActive = true;
  breathCycle = 0;
  breathPhase = 'inhale';
  breathSeconds = 4;
  playSFX11('breathe_in');
  renderBreathing();

  breathTimer = setInterval(function(){
    breathSeconds--;
    if(breathSeconds <= 0){
      if(breathPhase === 'inhale'){
        breathPhase = 'hold';
        breathSeconds = 7;
      } else if(breathPhase === 'hold'){
        breathPhase = 'exhale';
        breathSeconds = 8;
        playSFX11('breathe_out');
      } else if(breathPhase === 'exhale'){
        breathCycle++;
        if(breathCycle >= breathMaxCycles){
          breathActive = false;
          clearInterval(breathTimer);
          breathTimer = null;
          v11.breathSessions++;
          saveV11(v11);
          toastV11('&#127793; &#47749;&#49345; &#50756;&#47308;! &#51665;&#51473;&#47141;&#51060; &#54693;&#49345;&#46104;&#50632;&#49845;&#45768;&#45796;.');
          renderBreathing();
          return;
        }
        breathPhase = 'inhale';
        breathSeconds = 4;
        playSFX11('breathe_in');
      }
    }
    renderBreathing();
  }, 1000);
}

// ===== QUIZ V11 (+15 questions, 30->45) =====
var QUIZ_V11 = [
  {q:'&#48373;&#49905;&#50640;&#49436; &#12300;&#54032; &#44053;&#46020;&#12301;(Punch Power)&#45716; &#51452;&#47196; &#50612;&#46356;&#49436; &#45208;&#50724;&#45716;&#44032;?',opts:['&#50612;&#44648;&#44540;&#50977;','&#54036;&#44540;&#50977;','&#54616;&#52404;&#54924;&#51204;','&#49552;&#47785;&#54924;&#51204;'],ans:2,exp:'&#54144;&#52824;&#51032; &#54028;&#50892;&#45716; &#48156;&#50640;&#49436; &#49884;&#51089;&#54644; &#50628;&#45929;&#51060; &#54924;&#51204;&#51012; &#53685;&#54644; &#51204;&#45804;&#46121;&#45768;&#45796;.'},
  {q:'&#54532;&#47196; &#48373;&#49436;&#44032; &#46972;&#50868;&#46300;&#50640;&#49436; &#45796;&#50868; &#54980; &#47803; &#51068;&#50612;&#45208;&#47732; KO&#47196; &#44036;&#51452;&#46104;&#45716; &#49884;&#44036;&#51008;?',opts:['8&#52488;','10&#52488;','12&#52488;','15&#52488;'],ans:1,exp:'&#54532;&#47196; &#48373;&#49905;&#50640;&#49436; &#45796;&#50868; &#54980; 10&#52488;&#44620;&#51648; &#51068;&#50612;&#45208;&#51648; &#47803;&#54616;&#47732; TKO/KO&#47196; &#54032;&#51221;&#46121;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#12300;&#47553;&#49324;&#51060;&#46300;&#12301;(Ringside)&#45716; &#47924;&#50631;&#51012; &#51032;&#48120;&#54616;&#45716;&#44032;?',opts:['&#47553; &#50504; &#52636;&#51204;&#51088;','&#47553; &#48148;&#47196; &#50743; &#44288;&#44061;&#49437;','&#49900;&#54032;&#51032; &#50948;&#52824;','&#53076;&#45320; &#50689;&#50669;'],ans:1,exp:'&#47553;&#49324;&#51060;&#46300;&#45716; &#47553; &#48148;&#47196; &#50743;&#51032; VIP &#44288;&#44061;&#49437;&#51012; &#51032;&#48120;&#54633;&#45768;&#45796;.'},
  {q:'&#48373;&#49905; &#54984;&#47144;&#50640;&#49436; &#12300;&#54000;&#50740;&#54148;&#50892;&#12301;(Paw)&#45716;?',opts:['&#48156;&#44592;&#49696;','&#54144;&#52824; &#53440;&#44199; &#46308;&#44592;','&#48169;&#50612; &#51088;&#49464;','&#54984;&#47144;&#48373;'],ans:1,exp:'&#54000;&#50740;&#54148;&#50892;&#45716; &#53944;&#47112;&#51060;&#45320;&#44032; &#49552;&#51012; &#45236;&#48128;&#50612; &#53440;&#44199;&#51012; &#51228;&#49884;&#54616;&#45716; &#44163;&#51077;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#12300;&#53356;&#47196;&#49828; &#44032;&#46300;&#12301;&#45716; &#50612;&#46500; &#48169;&#50612; &#44592;&#49696;&#51064;&#44032;?',opts:['&#50620;&#44404; &#50526;&#51004;&#47196; &#49552;&#51012; &#48736;&#50612; &#48169;&#50612;','&#51204;&#50756;&#51012; &#47564;&#46308;&#45716; &#48169;&#50612;','&#49345;&#52404; &#44368;&#52264;&#54624; &#46412; &#50732;&#47532;&#45716; &#48169;&#50612;','&#49345;&#52404;&#50640;&#44172; &#55192;&#51012; &#49892;&#50612; &#48169;&#50612;'],ans:0,exp:'&#53356;&#47196;&#49828; &#44032;&#46300;&#45716; &#49552;&#51012; &#50620;&#44404; &#50526;&#51004;&#47196; &#48736;&#50612; &#49345;&#45824;&#51032; &#54144;&#52824;&#47484; &#48169;&#50612;&#54616;&#45716; &#44592;&#49696;&#51077;&#45768;&#45796;.'},
  {q:'&#48373;&#49905; &#44544;&#47084;&#48652;&#51032; &#50728;&#49828;(oz)&#44036; &#53364;&#49688;&#47197; &#50612;&#46500; &#54952;&#44284;&#44032; &#51080;&#45716;&#44032;?',opts:['&#49549;&#46020; &#51613;&#44032;','&#54028;&#50892; &#51613;&#44032;','&#49552; &#48372;&#54840; &#51613;&#44032;','&#47924;&#44172; &#44048;&#49548;'],ans:2,exp:'&#44544;&#47084;&#48652; &#50728;&#49828;&#44032; &#53364;&#49688;&#47197; &#54056;&#46377;&#51060; &#47566;&#50500;&#51256; &#49552;&#44284; &#49345;&#45824;&#47484; &#45908; &#48372;&#54840;&#54633;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#12300;&#47196;&#54532;&#12301;(Rope) &#50868;&#46041;&#51032; &#51452;&#50836; &#47785;&#51201;&#51008;?',opts:['&#54036;&#55192; &#44053;&#54868;','&#52404;&#47141;+&#47532;&#46316;&#44048;+&#54400;&#53944;&#50892;&#53356;','&#51221;&#49888; &#51665;&#51473;&#47141;','&#48169;&#50612; &#50672;&#49845;'],ans:1,exp:'&#51460;&#45335;&#44592;&#45716; &#52404;&#47141;, &#47532;&#46316;&#44048;, &#54400;&#53944;&#50892;&#53356;&#47484; &#46041;&#49884;&#50640; &#54984;&#47144;&#54616;&#45716; &#52572;&#44256;&#51032; &#48373;&#49905; &#48372;&#51312; &#50868;&#46041;&#51077;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#54532;&#47196; &#44221;&#44592; 1&#46972;&#50868;&#46300;&#45716; &#47751; &#48516;&#51064;&#44032;?',opts:['2&#48516;','3&#48516;','4&#48516;','5&#48516;'],ans:1,exp:'&#54532;&#47196; &#48373;&#49905;&#51032; 1&#46972;&#50868;&#46300;&#45716; 3&#48516;&#51060;&#47728;, &#46972;&#50868;&#46300; &#49324;&#51060; 1&#48516; &#55092;&#49885;&#51077;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#12300;&#45765;&#53944;&#47092; &#53076;&#45320;&#12301;(Neutral Corner)&#45716;?',opts:['&#49440;&#49688;&#51032; &#44256;&#54693; &#53076;&#45320;','KO &#49884; &#44032;&#54644;&#51088;&#44032; &#44032;&#45716; &#53076;&#45320;','&#49900;&#54032;&#51032; &#50948;&#52824;','&#53944;&#47112;&#51060;&#45320;&#51032; &#50948;&#52824;'],ans:1,exp:'&#49345;&#45824;&#44032; &#45796;&#50868;&#46104;&#47732; &#44032;&#54644;&#51088;&#45716; &#45765;&#53944;&#47092; &#53076;&#45320;(&#49353;&#51060; &#50630;&#45716; &#53076;&#45320;)&#47196; &#44040;&#50556; &#54633;&#45768;&#45796;.'},
  {q:'&#48373;&#49905; &#54984;&#47144;&#50640;&#49436; &#45908;&#48660;&#50644;&#46300;&#48177;&#51008; &#47924;&#50631;&#51064;&#44032;?',opts:['&#52380;&#51109;&#50640; &#44256;&#51221;&#46108; &#49464;&#47196;&#54805; &#49368;&#46300;&#48177;','&#48148;&#45797;&#50640; &#45459;&#51064; &#49368;&#46300;&#48177;','&#53944;&#47112;&#51060;&#45320;&#44032; &#46308;&#45716; &#53440;&#44199;','&#48316;&#50640; &#44256;&#51221;&#46108; &#50672;&#49845;&#54032;'],ans:0,exp:'&#45908;&#48660;&#50644;&#46300;&#48177;&#51008; &#52380;&#51109;&#50640;&#49436; &#50732;&#47000;&#50724;&#47532;&#47196; &#50672;&#44208;&#46108; &#50896;&#53685;&#54805; &#48177;&#51077;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#12300;&#54217;&#51216;&#51228;&#12301;&#45716; &#47924;&#50631;&#51064;&#44032;?',opts:['&#52404;&#44553; &#52769;&#51221;&#48277;','&#49849;&#47532;&#47484; &#51216;&#49688;&#47196; &#54032;&#44032;&#47492;&#54616;&#45716; &#51228;&#46020;','&#48268;&#44552; &#52376;&#48268; &#48169;&#48277;','&#54984;&#47144; &#48169;&#48277;'],ans:1,exp:'&#54217;&#51216;&#51228;&#45716; KO &#50630;&#51060; &#44221;&#44592;&#44032; &#45149;&#45216; &#46412; 3&#47749;&#51032; &#49900;&#54032;&#51060; 10&#51216; &#47564;&#51216;&#51004;&#47196; &#49849;&#47532;&#47484; &#44208;&#51221;&#54633;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#12300;&#49772;&#48728;&#48660;&#47196;&#50864;&#12301;&#45716; &#50612;&#46500; &#54144;&#52824;&#51064;&#44032;?',opts:['&#53556;&#51012; &#55284;&#46160;&#47476;&#45716; &#54144;&#52824;','&#50612;&#44648;&#47484; &#44048;&#49912;&#45716; &#54144;&#52824;','&#54036;&#44844;&#52824;&#47484; &#50500;&#47000;&#47196; &#46244;&#47196; &#55296;&#46160;&#47476;&#45716; &#54144;&#52824;','&#50868;&#46041;&#54868; &#51060;&#47492;'],ans:2,exp:'&#49772;&#48728;&#48660;&#47196;&#50864;&#45716; &#54036;&#44844;&#52824;&#47484; &#50500;&#47000;&#50640;&#49436; &#50948;&#47196; &#49556;&#50500; &#50732;&#47532;&#45716; &#50612;&#54140;&#52983;&#51032; &#48320;&#54805;&#51077;&#45768;&#45796;.'},
  {q:'&#48373;&#49905; &#54984;&#47144;&#50640;&#49436; &#12300;&#49100;&#46497;&#12301;(Skipping)&#51060; &#51473;&#50836;&#54620; &#51060;&#50976;&#45716;?',opts:['&#49345;&#52404; &#44540;&#47141; &#44053;&#54868;','&#54616;&#52404; &#47532;&#46316;&#44048;+&#52404;&#47141;+&#48156;&#47785; &#54693;&#49345;','&#54144;&#52824;&#47141; &#54693;&#49345;','&#50976;&#50672;&#49457; &#44053;&#54868;'],ans:1,exp:'&#49100;&#46497;&#51008; &#48373;&#49905;&#50640; &#54596;&#49688;&#51201;&#51064; &#54616;&#52404; &#47532;&#46316;&#44048;, &#52404;&#47141;, &#48156;&#47785;&#51012; &#54693;&#49345;&#49884;&#53413;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#12300;&#48177;&#49828;&#53485; &#47924;&#48652;&#12301;(Backstep Move)&#45716;?',opts:['&#46244;&#47196; &#48736;&#51648;&#45716; &#48169;&#50612; &#51060;&#46041;','&#50526;&#51004;&#47196; &#51204;&#51652;&#54616;&#45716; &#44277;&#44201; &#51060;&#46041;','&#50743;&#51004;&#47196; &#54588;&#54616;&#45716; &#44592;&#49696;','&#46244;&#47196; &#46028;&#50500; &#48372;&#45716; &#46041;&#51089;'],ans:0,exp:'&#48177;&#49828;&#53485;&#51008; &#46244;&#48156;&#51012; &#47676;&#51200; &#50880;&#44200; &#49345;&#45824;&#51032; &#44277;&#44201; &#49324;&#44144;&#47532; &#48150;&#50640;&#49436; &#48750;&#50612;&#45208;&#45716; &#44592;&#49696;&#51077;&#45768;&#45796;.'},
  {q:'&#48373;&#49905;&#50640;&#49436; &#12300;&#50500;&#50883;&#48149;&#49436;&#12301;(Outboxer)&#51032; &#53945;&#51669;&#51008;?',opts:['&#44540;&#51217;&#51204;&#50640;&#49436; &#44053;&#47141;&#54620; &#54144;&#52824;','&#51105;&#44284; &#54400;&#53944;&#50892;&#53356;&#47196; &#44144;&#47532;&#47484; &#50976;&#51648;&#54616;&#47728; &#51204;&#53804;','&#52404;&#44553;&#51004;&#47196; &#50517;&#46020;','&#48376;&#45733;&#51201; &#44277;&#44201;'],ans:1,exp:'&#50500;&#50883;&#48149;&#49436;&#45716; &#44596; &#47532;&#52824;&#47484; &#54876;&#50857;&#54644; &#51105;&#44284; &#53356;&#47196;&#49828;&#47196; &#44144;&#47532;&#47484; &#50976;&#51648;&#54616;&#47728; &#49912;&#50864;&#45716; &#49828;&#53440;&#51068;&#51077;&#45768;&#45796;.'}
];

var q11Idx = 0, q11Answered = false, q11Correct = 0, q11Done = false;

function renderQuizV11(){
  var el = document.getElementById('v11Quiz');
  if(!el) return;
  if(q11Done){
    var pct = Math.round(q11Correct/QUIZ_V11.length*100);
    var grade = pct>=90?'S':pct>=80?'A':pct>=70?'B':pct>=60?'C':'D';
    el.innerHTML = '<div style="text-align:center;padding:20px"><div style="font-size:36px;font-weight:900;color:var(--accent)">'+q11Correct+' / '+QUIZ_V11.length+'</div><div style="font-size:14px;color:var(--text-dim);margin:8px 0">&#51221;&#45813; ('+pct+'%)</div><div style="font-size:24px;font-weight:900;color:'+(pct>=80?'var(--green)':pct>=60?'var(--orange)':'var(--accent)')+'">'+grade+'</div><div style="margin-top:16px"><button class="hr-log-btn" id="q11Retry">&#45796;&#49884; &#54400;&#44592;</button></div></div>';
    document.getElementById('q11Retry').addEventListener('click',function(){q11Idx=0;q11Answered=false;q11Correct=0;q11Done=false;renderQuizV11();});
    return;
  }
  var qq = QUIZ_V11[q11Idx];
  var html = '<div style="padding:16px"><div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">Q'+(q11Idx+1)+' / '+QUIZ_V11.length+'</div>';
  html += '<div style="font-size:15px;font-weight:700;margin-bottom:16px;line-height:1.6">'+qq.q+'</div>';
  html += '<div style="display:flex;flex-direction:column;gap:8px">';
  qq.opts.forEach(function(opt,i){
    var bg = 'var(--glass)';
    var border = 'var(--glass-border)';
    var color = 'var(--text)';
    if(q11Answered){
      if(i === qq.ans){bg='rgba(34,197,94,0.15)';border='var(--green)';color='var(--green)';}
      else if(i === qq._userAns){bg='rgba(255,68,68,0.15)';border='var(--accent)';color='var(--accent)';}
    }
    html += '<div class="quiz-opt-v11" data-idx="'+i+'" style="padding:12px 16px;border-radius:12px;background:'+bg+';border:1px solid '+border+';color:'+color+';cursor:'+(q11Answered?'default':'pointer')+';font-size:13px;transition:all 0.2s">'+opt+'</div>';
  });
  html += '</div>';
  if(q11Answered){
    html += '<div style="margin-top:12px;padding:12px;background:rgba(255,215,0,0.05);border-radius:10px;font-size:12px;color:var(--text-dim);line-height:1.6">&#128161; '+qq.exp+'</div>';
    html += '<div style="text-align:center;margin-top:12px"><button class="hr-log-btn" id="q11Next">'+(q11Idx<QUIZ_V11.length-1?'&#45796;&#51020; &#47928;&#51228; &#8594;':'&#44208;&#44284; &#48372;&#44592;')+'</button></div>';
  }
  html += '</div>';
  el.innerHTML = html;

  if(!q11Answered){
    el.querySelectorAll('.quiz-opt-v11').forEach(function(opt){
      opt.addEventListener('click',function(){
        if(q11Answered) return;
        var idx = parseInt(this.getAttribute('data-idx'));
        q11Answered = true;
        qq._userAns = idx;
        if(idx === qq.ans){q11Correct++;playSFX11('quiz_v11');}else{playSFX11('speed_hit');}
        renderQuizV11();
      });
    });
  }
  if(q11Answered){
    var nb = document.getElementById('q11Next');
    if(nb) nb.addEventListener('click',function(){
      q11Idx++;q11Answered=false;
      if(q11Idx>=QUIZ_V11.length){q11Done=true;}
      renderQuizV11();
    });
  }
}

// ===== ACHIEVEMENTS V11 (+12) =====
var ACHV11 = [
  {id:'a11_hr_first',name:'&#49900;&#48149;&#52769;&#51221;',icon:'&#128147;',desc:'&#49900;&#48149;&#49688; &#52572;&#52488; &#44592;&#47197;',check:function(){return v11.hrSessions.length>=1;}},
  {id:'a11_class_3',name:'&#53364;&#47000;&#49828; 3&#54924;',icon:'&#127947;&#65039;',desc:'&#50892;&#53356;&#50500;&#50883; &#53364;&#47000;&#49828; 3&#54924; &#52280;&#50668;',check:function(){return (v11.classHistory||[]).length>=3;}},
  {id:'a11_speed_s',name:'&#48264;&#44060; S&#44553;',icon:'&#9889;',desc:'&#48152;&#51025;&#49549;&#46020; S&#44553; (200ms &#51060;&#54616;)',check:function(){return v11.speedBest > 0 && v11.speedBest <= 200;}},
  {id:'a11_recovery',name:'&#54924;&#48373; &#47560;&#49828;&#53552;',icon:'&#129470;',desc:'&#47784;&#46304; 8&#51333; &#49828;&#53944;&#47112;&#52845; &#50756;&#47308;',check:function(){return Object.keys(recoveryDone).length>=8;}},
  {id:'a11_report',name:'&#48516;&#49437;&#44032;',icon:'&#128200;',desc:'&#54140;&#54252;&#47676;&#49828; &#47532;&#54252;&#53944; &#54869;&#51064;',check:function(){return reportTab !== null;}},
  {id:'a11_leaderboard',name:'TOP 5',icon:'&#127942;',desc:'&#47532;&#45908;&#48372;&#46300; TOP 5 &#51652;&#51077;',check:function(){
    var app=loadAppData();var score=((app&&app.totalPunches)||0)+((app&&app.bestStreak)||0)*100;
    return score>=5000;
  }},
  {id:'a11_plan_done',name:'&#54540;&#47004; &#50756;&#47308;',icon:'&#128203;',desc:'&#54984;&#47144; &#54540;&#47004; 1&#44060; &#50756;&#47308;',check:function(){
    if(v11.planActive===null||v11.planActive===undefined)return false;
    var p=PLANS[v11.planActive];if(!p)return false;
    for(var w=1;w<=p.weeks;w++){if(!v11.planProgress[v11.planActive+'_w'+w])return false;}
    return true;
  }},
  {id:'a11_form_80',name:'&#54268; &#47560;&#49828;&#53552;',icon:'&#127919;',desc:'&#54268; &#48516;&#49437; &#54217;&#44512; 80&#51216; &#51060;&#49345;',check:function(){
    if(v11.formScores.length===0)return false;
    var last=v11.formScores[v11.formScores.length-1].scores;
    var avg=last.reduce(function(s,v){return s+v;},0)/last.length;
    return avg>=80;
  }},
  {id:'a11_music',name:'DJ &#48149;&#49436;',icon:'&#127925;',desc:'&#48373;&#49905; &#48708;&#53944; 3&#44257; &#51060;&#49345; &#51116;&#49373;',check:function(){return musicTrack>=2;}},
  {id:'a11_breathe_5',name:'&#47749;&#49345; 5&#54924;',icon:'&#127793;',desc:'&#47749;&#49345;/&#54840;&#55137; 5&#54924; &#50756;&#47308;',check:function(){return v11.breathSessions>=5;}},
  {id:'a11_quiz_v11',name:'v11 &#48149;&#49324;',icon:'&#127891;',desc:'v11 &#53300;&#51592; 12&#47928;&#51228; &#51060;&#49345; &#51221;&#45813;',check:function(){return q11Correct>=12;}},
  {id:'a11_allrounder',name:'v11 &#50732;&#46972;&#50868;&#45908;',icon:'&#128081;',desc:'v11 &#47784;&#46304; &#44592;&#45733; &#49324;&#50857;',check:function(){
    return v11.hrSessions.length>0 && (v11.classHistory||[]).length>0 && (v11.speedTests||[]).length>0 && v11.formScores.length>0 && v11.breathSessions>0;
  }}
];

function renderAchievementsV11(){
  var el = document.getElementById('v11Achievements');
  if(!el) return;
  var unlocked = 0;
  var html = '<div class="badge-grid">';
  ACHV11.forEach(function(a){
    var ok = a.check();
    if(ok) unlocked++;
    html += '<div class="badge'+(ok?' unlocked':' locked')+'" title="'+a.desc+'"><span class="badge-icon" style="font-size:28px">'+a.icon+'</span><span class="badge-name" style="font-size:10px;margin-top:4px;color:'+(ok?'var(--gold)':'var(--text-muted)')+'">'+a.name+'</span></div>';
  });
  html += '</div>';
  html += '<div style="text-align:center;margin-top:10px;font-size:12px;color:var(--text-dim)">v11 &#50629;&#51201;: '+unlocked+' / '+ACHV11.length+' &#45804;&#49457;</div>';
  el.innerHTML = html;
}

// ===== KEYBOARD SHORTCUTS V11 =====
function setupV11Keys(){
  document.addEventListener('keydown', function(e){
    if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if(!e.shiftKey) return;
    switch(e.key.toUpperCase()){
      case 'H': var s=document.getElementById('v11HeartRate');if(s)s.scrollIntoView({behavior:'smooth'});break;
      case 'W': var s2=document.getElementById('v11Classes');if(s2)s2.scrollIntoView({behavior:'smooth'});break;
      case 'X': var s3=document.getElementById('v11Speed');if(s3)s3.scrollIntoView({behavior:'smooth'});break;
      case 'C': var s4=document.getElementById('v11Recovery');if(s4)s4.scrollIntoView({behavior:'smooth'});break;
      case 'R': var s5=document.getElementById('v11Report');if(s5)s5.scrollIntoView({behavior:'smooth'});break;
      case 'L': var s6=document.getElementById('v11Leaderboard');if(s6)s6.scrollIntoView({behavior:'smooth'});break;
      case 'P': var s7=document.getElementById('v11Plans');if(s7)s7.scrollIntoView({behavior:'smooth'});break;
      case 'F': var s8=document.getElementById('v11FormAnalyzer');if(s8)s8.scrollIntoView({behavior:'smooth'});break;
    }
  });
}

// ===== TOAST =====
function toastV11(msg){
  var c = document.getElementById('toastContainer');
  if(!c) return;
  var t = document.createElement('div');
  t.className = 'toast'; t.innerHTML = msg;
  c.appendChild(t);
  setTimeout(function(){ t.remove(); }, 3000);
}

function escHtml11(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ===== QUICK ACTION BUTTONS =====
function injectQuickActions(){
  var container = document.querySelector('.container');
  if(!container) return;
  var existing = document.getElementById('v11QuickActions');
  if(existing) return;

  var div = document.createElement('div');
  div.id = 'v11QuickActions';
  div.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:12px 0;padding:0 12px';
  var btns = [
    {label:'&#128147;HR',target:'v11HeartRate'},
    {label:'&#127947;&#65039;Class',target:'v11Classes'},
    {label:'&#9889;Speed',target:'v11Speed'},
    {label:'&#129470;Recovery',target:'v11Recovery'},
    {label:'&#128200;Report',target:'v11Report'},
    {label:'&#127942;Board',target:'v11Leaderboard'},
    {label:'&#128203;Plan',target:'v11Plans'},
    {label:'&#127919;Form',target:'v11FormAnalyzer'},
    {label:'&#127925;Music',target:'v11Music'},
    {label:'&#127793;Breathe',target:'v11Breathing'}
  ];
  btns.forEach(function(b){
    var btn = document.createElement('button');
    btn.style.cssText = 'padding:4px 10px;border:1px solid var(--glass-border);border-radius:8px;background:var(--glass);color:var(--text-dim);font-size:10px;cursor:pointer;transition:all 0.2s';
    btn.innerHTML = b.label;
    btn.addEventListener('click', function(){
      var tgt = document.getElementById(b.target);
      if(tgt) tgt.scrollIntoView({behavior:'smooth'});
    });
    btn.addEventListener('mouseenter', function(){this.style.borderColor='var(--accent)';this.style.color='var(--accent)';});
    btn.addEventListener('mouseleave', function(){this.style.borderColor='var(--glass-border)';this.style.color='var(--text-dim)';});
    div.appendChild(btn);
  });

  var firstSection = container.querySelector('.section');
  if(firstSection) container.insertBefore(div, firstSection);
}

// ===== HTML INJECTION =====
function injectV11Sections(){
  var container = document.querySelector('.container');
  if(!container) return;

  var sections = [
    {id:'v11HeartRate', title:'&#128147; &#49900;&#48149;&#49688; &#51316; &#54984;&#47144;', card:true},
    {id:'v11Classes', title:'&#127947;&#65039; &#50892;&#53356;&#50500;&#50883; &#53364;&#47000;&#49828; (8&#51333;)', card:false},
    {id:'v11Speed', title:'&#9889; &#54144;&#52824; &#49828;&#54588;&#46300; &#48516;&#49437;&#44592;', card:true},
    {id:'v11Recovery', title:'&#129470; &#55092;&#48373; &#49828;&#53944;&#47112;&#52845; &#44032;&#51060;&#46300; (8&#51333;)', card:false},
    {id:'v11Report', title:'&#128200; &#54140;&#54252;&#47676;&#49828; &#47532;&#54252;&#53944;', card:true},
    {id:'v11Leaderboard', title:'&#127942; &#52964;&#48036;&#45768;&#54000; &#47532;&#45908;&#48372;&#46300;', card:true},
    {id:'v11Plans', title:'&#128203; &#54984;&#47144; &#54540;&#47004; &#48716;&#45908; (5&#51333;)', card:false},
    {id:'v11FormAnalyzer', title:'&#127919; &#54144;&#52824; &#54268; &#48516;&#49437;&#44592;', card:true},
    {id:'v11Music', title:'&#127925; &#48373;&#49905; &#48708;&#53944; &#54540;&#47112;&#51060;&#50612; (8&#44257;)', card:true},
    {id:'v11Breathing', title:'&#127793; &#47749;&#49345;/&#54840;&#55137; &#44032;&#51060;&#46300;', card:true},
    {id:'v11Quiz', title:'&#129504; &#48373;&#49905; &#49900;&#54868; &#53300;&#51592; v11 (+15)', card:true},
    {id:'v11Achievements', title:'&#127941; v11 &#50629;&#51201; (+12)', card:true}
  ];

  var tipSection = null;
  var allSections = container.querySelectorAll('.section');
  for(var i = 0; i < allSections.length; i++){
    var tTitle = allSections[i].querySelector('.section-title');
    if(tTitle && (tTitle.textContent.indexOf('팁') >= 0 || tTitle.textContent.indexOf('업적') >= 0 || tTitle.textContent.indexOf('v10') >= 0)){
      tipSection = allSections[i];
      break;
    }
  }
  var insertBefore = tipSection || container.lastElementChild;

  sections.forEach(function(sec){
    var section = document.createElement('section');
    section.className = 'section v11-section';
    if(sec.card){
      section.innerHTML = '<h2 class="section-title"><span class="emoji">'+sec.title.split(' ')[0]+'</span> '+sec.title.split(' ').slice(1).join(' ')+'</h2><div class="card"><div id="'+sec.id+'"></div></div>';
    } else {
      section.innerHTML = '<h2 class="section-title"><span class="emoji">'+sec.title.split(' ')[0]+'</span> '+sec.title.split(' ').slice(1).join(' ')+'</h2><div id="'+sec.id+'"></div>';
    }
    insertBefore.parentNode.insertBefore(section, insertBefore);
  });

  var footerVer = document.querySelector('.footer-ver');
  if(footerVer) footerVer.textContent = 'Boxing Trainer Pro v11.0 | PWA Enabled';
}

// ===== INIT =====
function initV11(){
  injectV11CSS();
  injectV11Sections();
  injectQuickActions();
  renderHeartRate();
  renderClasses();
  renderSpeedTest();
  renderRecovery();
  renderReport();
  renderLeaderboard();
  renderPlans();
  renderFormAnalyzer();
  renderMusic();
  renderBreathing();
  renderQuizV11();
  renderAchievementsV11();
  setupV11Keys();
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initV11);
} else {
  setTimeout(initV11, 400);
}

})();
