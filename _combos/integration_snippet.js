// ===========================================================================
// boxing-trainer-v5.html에 콤보 학습 모드 'combo' 추가하는 통합 스니펫
// ---------------------------------------------------------------------------
// 적용 방법:
//   1) <head> 또는 <script> 위쪽에 combo_data.js 로드
//        <script src="_combos/combo_data.js"></script>
//   2) startTraining 함수의 분기에 'combo' 케이스 추가 (아래 PATCH 1)
//   3) trainingMenu에 콤보 학습 버튼 추가 (아래 PATCH 2)
//   4) updateTrainOverlay / trainingInput / updateTraining에 'combo' 분기
//      추가 (아래 PATCH 3, 4, 5)
//   5) save 객체에 combos 필드 초기화 (아래 PATCH 6)
//
// 이 파일 자체는 그대로 v5에 포함시켜도 동작하도록 설계됨.
// boxing-trainer-v5.html 안에 <script src="_combos/integration_snippet.js"></script>
// 한 줄만 추가하면 startTraining을 monkey-patch해서 'combo' 분기를 주입한다.
// ===========================================================================

(function () {
  'use strict';

  // ---------- 0. 전제: combo_data.js가 먼저 로드돼 있어야 한다 ---------------
  if (typeof window === 'undefined' || !window.CLASSIC_COMBOS) {
    console.warn('[combo] CLASSIC_COMBOS 미정의. _combos/combo_data.js를 먼저 로드하세요.');
    return;
  }

  const COMBOS = window.CLASSIC_COMBOS;
  const LABEL = window.COMBO_PUNCH_LABEL;
  const RUBRIC = window.COMBO_SCORE_RUBRIC;

  // 6펀치 → boxing-trainer 내부 4펀치 매핑(v5는 jab/cross/hook/uppercut만 존재)
  // 학습 모드에서는 6종 모두 1~6 키로 받지만 시각/사운드 트리거는 4종으로 폴백.
  const PUNCH_TO_V5 = {
    jab: 'jab',
    cross: 'cross',
    left_hook: 'hook',
    right_hook: 'hook',
    left_upper: 'uppercut',
    right_upper: 'uppercut'
  };
  const KEY_TO_PUNCH = {
    '1': 'jab',
    '2': 'cross',
    '3': 'left_hook',
    '4': 'right_hook',
    '5': 'left_upper',
    '6': 'right_upper'
  };

  // ---------- 1. save.combos 초기화 ----------------------------------------
  if (typeof window.save === 'object' && window.save) {
    if (!window.save.combos) window.save.combos = {};
    if (typeof window.saveSave === 'function') window.saveSave();
  }

  // ---------- 2. 메인 entry: startComboLearning(comboId) -------------------
  // 외부에서 직접 호출 가능. 메뉴 버튼 onclick으로 사용.
  window.startComboLearning = function (comboId) {
    const combo = COMBOS.find(c => c.id === comboId);
    if (!combo) { alert('콤보를 찾을 수 없습니다: ' + comboId); return; }

    // boxing-trainer v5의 화면 전환 함수들 사용
    if (typeof hideAll === 'function') hideAll();
    if (typeof $ === 'function') $('backBtn').classList.remove('hidden');

    window.currentScreen = 'train';
    window.currentTraining = {
      type: 'combo',
      active: true,
      comboId: comboId,
      combo: combo,
      phase: 'demo',          // demo → guide → metronome → test
      stepIdx: 0,             // 가이드 단계의 step index
      bpm: combo.bpm_range[0],
      timer: 60,              // 테스트 단계 60초
      score: 0,
      hits: 0,
      misses: 0,
      perfect: 0, good: 0, ok: 0, miss: 0,
      comboCount: 0,
      cycleStartTime: 0,      // 현재 반복의 시작 시각
      expectedIdx: 0,         // 시퀀스 안에서 다음 펀치 index
      inputLog: [],           // [{punch, dt_from_expected}]
      demoLoopHandle: null
    };

    if (typeof $ === 'function') $('trainOverlay').classList.remove('hidden');
    renderComboPhase();
  };

  // ---------- 3. 단계별 렌더 -----------------------------------------------
  function renderComboPhase() {
    const t = window.currentTraining;
    if (!t || !t.active || t.type !== 'combo') return;

    const c = t.combo;
    const phaseLabels = { demo: '시연', guide: '가이드', metronome: '메트로놈', test: '테스트' };
    const phaseIdx = ['demo', 'guide', 'metronome', 'test'].indexOf(t.phase) + 1;

    let inner = '';
    inner += `<div class="train-hud" style="max-width:420px">`;
    inner += `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <div style="font-size:22px;font-weight:700;color:var(--accent)">${c.number} ${c.name}</div>
      <div style="font-size:12px;color:var(--dim)">${phaseIdx}/4: ${phaseLabels[t.phase]}</div>
    </div>`;
    inner += `<div style="display:flex;gap:6px;justify-content:center;margin-bottom:12px">
      ${['demo','guide','metronome','test'].map(p =>
        `<div style="width:10px;height:10px;border-radius:50%;background:${p === t.phase ? 'var(--accent)' : 'rgba(255,255,255,.2)'}"></div>`
      ).join('')}
    </div>`;

    // ----- 시연 -----
    if (t.phase === 'demo') {
      inner += `<div style="font-size:14px;line-height:1.6;color:var(--dim);margin:12px 0">${c.description}</div>`;
      inner += `<div class="train-combo-seq">${c.sequence.map(p =>
        `<div class="train-combo-item">${LABEL[p].num} ${LABEL[p].kr}</div>`).join('')}</div>`;
      inner += `<div style="font-size:12px;color:var(--dim);margin-top:8px">BPM ${c.bpm_range[0]}로 시연 중...</div>`;
      inner += `<div style="display:flex;gap:8px;justify-content:center;margin-top:14px">
        <button class="menu-btn" style="padding:8px 16px;font-size:14px" onclick="comboPhaseNext()">다음 →</button>
      </div>`;
      startDemoLoop();

    // ----- 가이드 -----
    } else if (t.phase === 'guide') {
      const total = c.coaching_steps.length;
      const step = c.coaching_steps[t.stepIdx];
      inner += `<div style="font-size:11px;color:var(--accent);font-weight:700;margin-bottom:6px">STEP ${t.stepIdx + 1}/${total}</div>`;
      inner += `<div style="font-size:15px;line-height:1.7;margin:12px 0;min-height:80px">${step}</div>`;
      inner += `<div style="display:flex;gap:6px;justify-content:center;margin:8px 0">
        ${c.coaching_steps.map((_, i) =>
          `<div style="width:8px;height:8px;border-radius:50%;background:${i === t.stepIdx ? 'var(--accent)' : 'rgba(255,255,255,.2)'}"></div>`
        ).join('')}
      </div>`;
      inner += `<div style="display:flex;gap:8px;justify-content:center;margin-top:14px">
        <button class="menu-btn" style="padding:6px 12px;font-size:13px" onclick="comboGuideStep(-1)">← 이전</button>
        <button class="menu-btn" style="padding:6px 12px;font-size:13px" onclick="comboGuideStep(1)">${t.stepIdx === total - 1 ? '다음 단계 →' : '다음 →'}</button>
      </div>`;

    // ----- 메트로놈 -----
    } else if (t.phase === 'metronome') {
      inner += `<div style="font-size:13px;color:var(--dim);margin-bottom:8px">박자에 맞춰 1~6 키 (또는 탭)으로 입력</div>`;
      inner += `<div style="display:flex;align-items:center;gap:8px;justify-content:center;margin:8px 0">
        <button class="menu-btn" style="padding:4px 10px;font-size:14px" onclick="comboBpmDelta(-10)">-10</button>
        <div style="font-size:24px;font-weight:700;color:var(--gold);min-width:80px">BPM ${t.bpm}</div>
        <button class="menu-btn" style="padding:4px 10px;font-size:14px" onclick="comboBpmDelta(10)">+10</button>
      </div>`;
      // 타이밍 시각화
      inner += renderTimingBar(c, t.bpm);
      inner += `<div style="display:flex;gap:8px;justify-content:center;margin-top:10px">
        <div style="font-size:13px">맞음: <b style="color:var(--green)">${t.hits}</b></div>
        <div style="font-size:13px">놓침: <b style="color:var(--accent)">${t.misses}</b></div>
      </div>`;
      inner += `<div style="display:flex;gap:8px;justify-content:center;margin-top:14px">
        <button class="menu-btn" style="padding:6px 12px;font-size:13px" onclick="comboToggleMetronome()">${t.metronomeOn ? '⏸ 정지' : '▶ 재생'}</button>
        <button class="menu-btn" style="padding:6px 12px;font-size:13px" onclick="comboPhaseNext()">테스트 →</button>
      </div>`;

    // ----- 테스트 -----
    } else if (t.phase === 'test') {
      const expected = c.sequence[t.expectedIdx];
      const next = c.sequence[t.expectedIdx + 1];
      inner += `<div style="font-size:14px;color:var(--dim)">${Math.ceil(t.timer)}초 남음 · BPM ${t.bpm}</div>`;
      inner += `<div style="width:200px;height:4px;background:rgba(255,255,255,.1);border-radius:2px;margin:8px auto">
        <div style="width:${t.timer / 60 * 100}%;height:100%;background:var(--accent);border-radius:2px"></div>
      </div>`;
      inner += `<div style="margin-top:12px">
        <div style="font-size:11px;color:var(--dim)">지금</div>
        <div style="font-size:26px;font-weight:700;color:var(--accent)">${LABEL[expected].num} ${LABEL[expected].kr}</div>
        <div style="font-size:11px;color:var(--dim);margin-top:6px">다음</div>
        <div style="font-size:14px;color:var(--dim2)">${next ? `${LABEL[next].num} ${LABEL[next].kr}` : '— (콤보 마무리)'}</div>
      </div>`;
      inner += `<div style="display:flex;gap:10px;justify-content:center;margin-top:12px;font-size:12px">
        <span style="color:var(--gold)">P ${t.perfect}</span>
        <span style="color:var(--green)">G ${t.good}</span>
        <span style="color:var(--dim2)">O ${t.ok}</span>
        <span style="color:var(--accent)">M ${t.miss}</span>
      </div>`;
      inner += `<div style="font-size:13px;margin-top:8px">콤보 완성: <b style="color:var(--gold)">${t.comboCount}</b></div>`;
    }

    inner += `</div>`;
    if (typeof $ === 'function') $('trainOverlay').innerHTML = inner;
  }

  // ---------- 4. 시연 루프 -------------------------------------------------
  function startDemoLoop() {
    const t = window.currentTraining;
    if (!t || t.demoLoopHandle) return;
    const c = t.combo;
    const loopMs = c.timing_ms[c.timing_ms.length - 1] + 800;
    let punchIdx = 0;
    const tick = () => {
      const p = c.sequence[punchIdx];
      const v5p = PUNCH_TO_V5[p];
      // 시연: 펀치 사운드 + 텍스트 팝업
      if (typeof playPunch === 'function') playPunch(v5p === 'hook' || v5p === 'uppercut' ? 'heavy' : 'light');
      if (typeof showComboText === 'function') showComboText(`${LABEL[p].num} ${LABEL[p].kr}`);
      punchIdx = (punchIdx + 1) % c.sequence.length;
      if (punchIdx === 0) {
        t.demoLoopHandle = setTimeout(tick, 800);
      } else {
        const dt = c.timing_ms[punchIdx] - c.timing_ms[punchIdx - 1];
        t.demoLoopHandle = setTimeout(tick, dt);
      }
    };
    t.demoLoopHandle = setTimeout(tick, 400);
  }
  function stopDemoLoop() {
    const t = window.currentTraining;
    if (!t || !t.demoLoopHandle) return;
    clearTimeout(t.demoLoopHandle);
    t.demoLoopHandle = null;
  }

  // ---------- 5. 단계 전환 / 메트로놈 / BPM ---------------------------------
  window.comboPhaseNext = function () {
    const t = window.currentTraining;
    if (!t) return;
    stopDemoLoop();
    const order = ['demo', 'guide', 'metronome', 'test'];
    const i = order.indexOf(t.phase);
    if (i < order.length - 1) {
      t.phase = order[i + 1];
      t.stepIdx = 0;
      t.expectedIdx = 0;
      t.cycleStartTime = performance.now();
      if (t.phase === 'test') t.timer = 60;
      renderComboPhase();
    } else {
      endComboLearning();
    }
  };
  window.comboGuideStep = function (delta) {
    const t = window.currentTraining;
    if (!t) return;
    const total = t.combo.coaching_steps.length;
    const next = t.stepIdx + delta;
    if (next < 0) return;
    if (next >= total) { window.comboPhaseNext(); return; }
    t.stepIdx = next;
    renderComboPhase();
  };
  window.comboBpmDelta = function (delta) {
    const t = window.currentTraining;
    if (!t) return;
    const [lo, hi] = t.combo.bpm_range;
    t.bpm = Math.max(lo, Math.min(hi, t.bpm + delta));
    renderComboPhase();
  };
  window.comboToggleMetronome = function () {
    const t = window.currentTraining;
    if (!t) return;
    t.metronomeOn = !t.metronomeOn;
    if (t.metronomeOn) startMetronome();
    else stopMetronome();
    renderComboPhase();
  };

  function startMetronome() {
    const t = window.currentTraining;
    if (!t || t.metronomeHandle) return;
    const interval = 60000 / t.bpm;
    t.metronomeHandle = setInterval(() => {
      if (typeof playStep === 'function') playStep();
    }, interval);
  }
  function stopMetronome() {
    const t = window.currentTraining;
    if (!t || !t.metronomeHandle) return;
    clearInterval(t.metronomeHandle);
    t.metronomeHandle = null;
  }

  // ---------- 6. 타이밍 시각화 (가로 막대) ----------------------------------
  function renderTimingBar(c, bpm) {
    const beatMs = 60000 / bpm;
    const totalMs = c.timing_ms[c.timing_ms.length - 1] + beatMs * 0.6;
    const w = 280;
    let bar = `<div style="position:relative;width:${w}px;height:48px;margin:14px auto;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:6px">`;
    // 박자선
    const beats = Math.floor(totalMs / beatMs) + 1;
    for (let i = 0; i <= beats; i++) {
      const x = (i * beatMs) / totalMs * w;
      bar += `<div style="position:absolute;left:${x}px;top:0;width:1px;height:100%;background:rgba(255,255,255,.12)"></div>`;
    }
    // 펀치 점
    c.sequence.forEach((p, i) => {
      const x = c.timing_ms[i] / totalMs * w;
      const lab = LABEL[p];
      bar += `<div style="position:absolute;left:${x - 12}px;top:14px;width:24px;height:24px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff">${lab.num}</div>`;
    });
    bar += `</div>`;
    bar += `<div style="font-size:10px;color:var(--dim);text-align:center">한 박 = ${Math.round(beatMs)}ms · 콤보 길이 ${c.timing_ms[c.timing_ms.length - 1]}ms</div>`;
    return bar;
  }

  // ---------- 7. 입력 처리 -------------------------------------------------
  window.comboHandleKey = function (key) {
    const t = window.currentTraining;
    if (!t || !t.active || t.type !== 'combo') return;
    const punch = KEY_TO_PUNCH[key];
    if (!punch) return;

    if (t.phase === 'metronome' || t.phase === 'test') {
      handleComboPunch(punch);
    }
  };

  function handleComboPunch(punch) {
    const t = window.currentTraining;
    const c = t.combo;
    const expected = c.sequence[t.expectedIdx];

    if (punch !== expected) {
      // 잘못된 펀치
      t.misses++;
      t.miss++;
      t.expectedIdx = 0;
      t.cycleStartTime = performance.now();
      renderComboPhase();
      return;
    }

    // 타이밍 평가
    const now = performance.now();
    const elapsed = now - t.cycleStartTime;
    const expectedMs = c.timing_ms[t.expectedIdx];
    const dt = Math.abs(elapsed - expectedMs);

    let bucket = 'miss';
    if (dt <= RUBRIC.timing.tolerance_ms_perfect) bucket = 'perfect';
    else if (dt <= RUBRIC.timing.tolerance_ms_good) bucket = 'good';
    else if (dt <= RUBRIC.timing.tolerance_ms_ok) bucket = 'ok';

    t[bucket]++;
    t.hits++;
    const v5p = PUNCH_TO_V5[punch];
    if (typeof playPunch === 'function') playPunch(v5p === 'hook' || v5p === 'uppercut' ? 'heavy' : 'light');
    t.score += { perfect: 20, good: 14, ok: 8, miss: 2 }[bucket];

    t.expectedIdx++;
    if (t.expectedIdx >= c.sequence.length) {
      // 콤보 완성!
      t.comboCount++;
      t.score += 30;
      t.expectedIdx = 0;
      t.cycleStartTime = now + 400;  // 다음 사이클 호흡
      if (typeof showComboText === 'function') showComboText(`${c.number} 완성!`);
    }
    renderComboPhase();
  }

  // ---------- 8. 테스트 단계 timer/tick ------------------------------------
  // updateTraining에서 'combo' 분기로 호출되도록 글로벌 함수로 노출
  window.comboTick = function (dt) {
    const t = window.currentTraining;
    if (!t || !t.active || t.type !== 'combo') return;
    if (t.phase !== 'test') return;
    t.timer -= dt;
    if (t.timer <= 0) {
      endComboLearning();
      return;
    }
    if (Math.floor(t.timer * 4) !== Math.floor((t.timer + dt) * 4)) {
      renderComboPhase();
    }
  };

  // ---------- 9. 종료 / 결과 / 별점 ----------------------------------------
  function endComboLearning() {
    const t = window.currentTraining;
    if (!t) return;
    stopDemoLoop();
    stopMetronome();
    t.active = false;

    const total = t.perfect + t.good + t.ok + t.miss;
    const correct = t.perfect + t.good + t.ok;
    const accuracy = total > 0 ? correct / total : 0;
    const timing = total > 0
      ? (t.perfect * 1.0 + t.good * 0.7 + t.ok * 0.4) / total
      : 0;
    const finalScore = accuracy * 0.5 + timing * 0.5;

    let stars = 1;
    if (finalScore >= 0.92) stars = 5;
    else if (finalScore >= 0.78) stars = 4;
    else if (finalScore >= 0.62) stars = 3;
    else if (finalScore >= 0.45) stars = 2;

    const c = t.combo;
    const xp = Math.round(finalScore * 100 * c.difficulty);

    // save
    if (window.save) {
      if (!window.save.combos) window.save.combos = {};
      const prev = window.save.combos[c.id] || { stars: 0, bestScore: 0, attempts: 0 };
      window.save.combos[c.id] = {
        stars: Math.max(prev.stars, stars),
        bestScore: Math.max(prev.bestScore, finalScore),
        attempts: prev.attempts + 1,
        lastBpm: t.bpm
      };
      window.save.xp = (window.save.xp || 0) + xp;
      // 스탯 보상 (콤보별 분배)
      const statRewards = {
        jab_cross: { speed: 1 + Math.floor(stars / 3) },
        double_jab_cross: { speed: 1 + Math.floor(stars / 3) },
        jab_cross_hook: { power: 1 + Math.floor(stars / 3) },
        cross_hook_cross: { power: 1 + Math.floor(stars / 3) },
        jab_cross_hook_cross: { power: 1 + Math.floor(stars / 3) },
        jab_cross_lupper_cross: { defense: 1 + Math.floor(stars / 3) },
        jab_rupper_lhook_cross: { defense: 1 + Math.floor(stars / 3) },
        rupper_lhook_cross: { power: 2, stamina: 1 }
      }[c.id] || { speed: 1 };
      Object.entries(statRewards).forEach(([k, v]) => {
        if (window.save.stats && typeof window.save.stats[k] === 'number') {
          window.save.stats[k] = Math.min(99, window.save.stats[k] + v);
        }
      });
      if (typeof saveSave === 'function') saveSave();
    }

    // 결과 화면
    if (typeof $ === 'function') {
      $('trainOverlay').classList.add('hidden');
      $('trainResult').classList.remove('hidden');
      $('trainResult').innerHTML = `
        <h2>${c.number} ${c.name} 완료!</h2>
        <div style="font-size:32px;color:var(--gold);margin:14px 0">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</div>
        <div class="detail">정확도: <b>${Math.round(accuracy * 100)}%</b></div>
        <div class="detail">타이밍: <b>${Math.round(timing * 100)}%</b></div>
        <div class="detail">콤보 완성: <b>${t.comboCount}</b>회</div>
        <div class="detail" style="color:var(--gold);margin-top:10px">XP +${xp}</div>
        <button class="menu-btn" style="margin-top:14px" onclick="startComboLearning('${c.id}')">다시 도전</button>
        <button class="menu-btn" style="margin-top:6px" onclick="window.location.reload()">메뉴로</button>
      `;
    }
  }

  // ---------- 10. 글로벌 키 핸들러에 콤보 분기 추가 -------------------------
  // v5의 기존 keydown은 trainingInput()을 호출하지만 'combo' 모드는 다른 키맵.
  // 보조 리스너로 1~6 키를 가로채서 처리.
  window.addEventListener('keydown', (e) => {
    const t = window.currentTraining;
    if (!t || t.type !== 'combo') return;
    if (e.key >= '1' && e.key <= '6') {
      window.comboHandleKey(e.key);
      e.preventDefault();
    }
  });

  // ---------- 11. updateTraining monkey-patch ------------------------------
  // v5의 updateTraining은 type별로 분기하지만 'combo'는 모름.
  // 원본 함수를 감싸서 'combo'면 comboTick으로 위임.
  if (typeof window.updateTraining === 'function') {
    const _origUpdate = window.updateTraining;
    window.updateTraining = function (dt) {
      const t = window.currentTraining;
      if (t && t.type === 'combo') {
        window.comboTick(dt);
        return;
      }
      _origUpdate(dt);
    };
  }

  // ---------- 12. startTraining monkey-patch -------------------------------
  // 'combo' 타입을 startTraining(type, comboId)로 호출 가능하게 확장.
  if (typeof window.startTraining === 'function') {
    const _origStart = window.startTraining;
    window.startTraining = function (type, comboId) {
      if (type === 'combo') {
        const id = comboId || COMBOS[0].id;
        return window.startComboLearning(id);
      }
      return _origStart(type);
    };
  }

  // ---------- 13. 콤보 선택 메뉴 헬퍼 (옵션) -------------------------------
  // trainingMenu에 '콤보 학습' 버튼을 한 번만 추가.
  window.openComboSelectMenu = function () {
    if (typeof hideAll === 'function') hideAll();
    if (typeof $ === 'function') $('backBtn').classList.remove('hidden');

    let html = `<div style="padding:16px;max-width:480px;margin:0 auto">
      <h2 style="text-align:center;color:var(--accent)">콤보 학습</h2>
      <div style="font-size:12px;color:var(--dim);text-align:center;margin-bottom:14px">
        8가지 클래식 콤비네이션. 시연 → 가이드 → 메트로놈 → 테스트 4단계.
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">`;
    COMBOS.forEach(c => {
      const saved = (window.save && window.save.combos && window.save.combos[c.id]) || {};
      const stars = saved.stars || 0;
      html += `
        <button class="menu-btn" style="padding:10px;text-align:left;display:flex;flex-direction:column;gap:4px"
                onclick="startComboLearning('${c.id}')">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font-size:18px;font-weight:800;color:var(--accent2)">${c.number}</span>
            <span style="font-size:11px;color:var(--gold)">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</span>
          </div>
          <div style="font-size:13px;font-weight:600">${c.name}</div>
          <div style="font-size:11px;color:var(--dim)">난이도 ${'★'.repeat(c.difficulty)}${'☆'.repeat(5 - c.difficulty)} · ${c.stamina} STM</div>
        </button>`;
    });
    html += `</div></div>`;

    // trainOverlay에 임시 표시
    if (typeof $ === 'function') {
      $('trainOverlay').classList.remove('hidden');
      $('trainOverlay').innerHTML = html;
    }
  };

})();

// ===========================================================================
// PATCH 가이드 (boxing-trainer-v5.html에 직접 적용 시 참고)
// ===========================================================================
//
// PATCH 1: <head>에 스크립트 로드
// ----------------------------------------------------------------
//   <script src="_combos/combo_data.js"></script>
//   <script src="_combos/integration_snippet.js"></script>
//
// PATCH 2: trainingMenu div 안에 버튼 추가 (line 156 근처)
// ----------------------------------------------------------------
//   <button class="menu-btn" onclick="openComboSelectMenu()">
//     <span class="icon">&#x1F94A;</span> 콤보 학습
//     <span class="sub">8가지 클래식 콤보 단계별 학습</span>
//   </button>
//
// PATCH 3, 4, 5는 monkey-patch로 자동 적용됨.
// PATCH 6 (save.combos 초기화)는 IIFE 내부에서 자동.
//
// ===========================================================================
