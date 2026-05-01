# Mixamo boxer.glb → boxing-trainer-v5.html 통합 패치

**현재**: `buildBoxer()` 함수가 procedural 계층 관절 시스템으로 박서를 생성, `applyPose()`로 포즈를 직접 매핑.
**목표**: GLTFLoader로 `assets/boxer.glb`를 로드하고 AnimationMixer로 mocap 클립을 재생. **토글 버튼**으로 "리얼 모델" / "심플 모델"을 런타임 전환.

---

## 0. 사전 조건

- `D:\AI\04_게임\복싱트레이너\assets\boxer.glb` 파일 존재 (fbx_to_glb.py 변환 완료)
- 글로벌 Three.js 버전: r128 (이미 v5에서 사용 중)
- GLTFLoader/DRACOLoader: r128 호환 버전 사용 — `https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js` (cdnjs `r128/jsm/loaders/...`는 ESM이라 r128에서 import 구조가 다름. **jsdelivr의 examples/js/ 경로가 안전**)

---

## 1. 스크립트 태그 추가 (line 223 근처)

**찾기** (현재 `<script src="https://cdnjs.cloudflare.com/.../r128/three.min.js" ...>` 라인):
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
```

**바로 아래 추가**:
```html
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/DRACOLoader.js"></script>
```

> r128 ES5 빌드와 짝이 맞는 examples/js/loaders. Draco mesh를 우리 .glb가 사용하므로 DRACOLoader 필수.

---

## 2. 토글 UI 추가 (HTML, controls 영역 근처)

`#camControls` 또는 메인 화면 어딘가:
```html
<div id="modelToggle" style="position:fixed;top:60px;right:10px;z-index:50;">
  <button onclick="setBoxerStyle('simple')">심플 모델</button>
  <button onclick="setBoxerStyle('real')">리얼 모델</button>
</div>
```

---

## 3. 전역 변수 + 로드 로직 (`buildBoxer` 정의 위에 추가)

```js
// ==================== MIXAMO REAL MODEL SYSTEM ====================
let BOXER_STYLE = 'simple';        // 'simple' | 'real'
let realBoxerGLB = null;           // 한 번만 로드, clone하여 player/opp에 사용
let realBoxerLoading = false;
let realBoxerClips = null;         // AnimationClip[]

function preloadRealBoxer() {
  if (realBoxerGLB || realBoxerLoading) return Promise.resolve(realBoxerGLB);
  realBoxerLoading = true;
  return new Promise((resolve, reject) => {
    const loader = new THREE.GLTFLoader();
    const draco = new THREE.DRACOLoader();
    draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(draco);
    loader.load('assets/boxer.glb',
      (gltf) => {
        realBoxerGLB = gltf;
        realBoxerClips = gltf.animations;
        realBoxerLoading = false;
        console.log('[Mixamo] boxer.glb loaded, clips:', realBoxerClips.map(c => c.name));
        resolve(gltf);
      },
      undefined,
      (err) => {
        realBoxerLoading = false;
        console.warn('[Mixamo] boxer.glb 로드 실패. 심플 모델 유지.', err);
        // SkeletonUtils가 r128 examples에 있어야 clone 가능. 없으면 fallback.
        BOXER_STYLE = 'simple';
        reject(err);
      }
    );
  });
}

function buildRealBoxer(teamColor, isPlayer) {
  // gltf.scene을 깊이 복제 (스킨드 메시는 SkeletonUtils.clone 권장)
  // r128에 SkeletonUtils가 없을 수 있으므로 헬퍼 인라인 정의:
  const cloneSkinned = (source) => {
    const sourceLookup = new Map();
    const cloneLookup = new Map();
    const clone = source.clone();
    source.traverse((node) => sourceLookup.set(node.name, node));
    clone.traverse((node) => cloneLookup.set(sourceLookup.get(node.name), node));
    source.traverse((sourceNode) => {
      if (!sourceNode.isSkinnedMesh) return;
      const clonedNode = cloneLookup.get(sourceNode);
      const skeleton = sourceNode.skeleton;
      const orderedCloneBones = skeleton.bones.map(b => cloneLookup.get(b));
      clonedNode.bind(new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses), clonedNode.matrixWorld);
    });
    return clone;
  };

  const root = cloneSkinned(realBoxerGLB.scene);
  const group = new THREE.Group();
  group.add(root);

  // 색상 입히기 (mixamo 기본 회색에 팀 컬러 emissive 살짝)
  root.traverse(o => {
    if (o.isMesh && o.material) {
      const m = o.material.clone();
      if (isPlayer) m.emissive = new THREE.Color(0xe63946).multiplyScalar(0.05);
      else m.emissive = new THREE.Color(0x3b82f6).multiplyScalar(0.05);
      o.material = m;
      o.castShadow = true;
    }
  });

  const mixer = new THREE.AnimationMixer(root);
  const actions = {};
  realBoxerClips.forEach(clip => {
    actions[clip.name] = mixer.clipAction(clip);
  });

  // 게임 루프에서 update할 수 있도록 model 객체에 노출
  const model = {
    group,
    isReal: true,
    mixer,
    actions,
    currentAction: null,
    // 심플 모델 호환 필드 (animatePunch/animateHit 등 다른 코드가 model.lGlove 등을 참조해도 안전하게 빈 group 제공)
    lGlove: new THREE.Group(),
    rGlove: new THREE.Group(),
    idle: { phase: Math.random() * 6.28 },
  };

  // 기본 idle 재생
  playRealAction(model, 'Idle', { loop: true });

  return model;
}

function playRealAction(model, name, opts = {}) {
  if (!model || !model.isReal) return;
  const action = model.actions[name];
  if (!action) { console.warn('[Mixamo] 클립 없음:', name); return; }
  if (model.currentAction === action) return;
  if (model.currentAction) model.currentAction.fadeOut(opts.fadeOut ?? 0.15);
  action.reset()
        .setLoop(opts.loop ? THREE.LoopRepeat : THREE.LoopOnce, opts.loop ? Infinity : 1)
        .fadeIn(opts.fadeIn ?? 0.1)
        .play();
  action.clampWhenFinished = !opts.loop;
  model.currentAction = action;
}

// 심플↔리얼 전환
async function setBoxerStyle(style) {
  if (style === BOXER_STYLE) return;
  if (style === 'real') {
    try { await preloadRealBoxer(); } catch (e) { return; }
  }
  // 기존 모델 제거
  if (playerModel && playerModel.group) scene.remove(playerModel.group);
  if (oppModel && oppModel.group) scene.remove(oppModel.group);

  BOXER_STYLE = style;
  if (style === 'real') {
    playerModel = buildRealBoxer(0xe63946, true);
    oppModel    = buildRealBoxer(0x3b82f6, false);
  } else {
    playerModel = buildBoxer(0xe63946, true);
    oppModel    = buildBoxer(0x3b82f6, false);
  }
  playerModel.group.scale.setScalar(2.6);
  oppModel.group.scale.setScalar(2.6);
  playerModel.group.position.set(0, 0, 3);
  oppModel.group.position.set(0, 0, -1.5);
  playerModel.group.rotation.y = Math.PI;
  oppModel.group.rotation.y = 0;
  playerModel.group.userData.baseX = 0;
  oppModel.group.userData.baseX = 0;
  scene.add(playerModel.group);
  scene.add(oppModel.group);
}
```

---

## 4. 기존 애니메이션 함수 분기 처리 (line 1298~1346)

`animateBoxerIdle`, `animatePunch`, `animateHit`, `animateBlock`, `animateDodge`, `resetBoxerPose` 각각 **함수 첫 줄에 분기 가드** 삽입:

```js
function animatePunch(model, punchType, progress, isOpp) {
  if (model.isReal) {
    // 리얼 모델은 progress 시작 시점에 한 번만 트리거
    if (progress < 0.05 && !model._punchActive) {
      const clipName = MIXAMO_PUNCH_MAP[punchType] || 'Jab';
      playRealAction(model, clipName, { loop: false, fadeIn: 0.05, fadeOut: 0.1 });
      model._punchActive = true;
      setTimeout(() => { model._punchActive = false; playRealAction(model, 'Idle', { loop: true }); }, 350);
    }
    return;
  }
  // 기존 procedural 코드 ...
  const kfName = punchType;
  const kf = PUNCH_KF[kfName];
  if (!kf) return;
  const pose = getPoseAt(kf, progress);
  applyPose(model, pose);
}
```

같은 패턴을 `animateBoxerIdle`, `animateHit`, `animateBlock`, `animateDodge`, `resetBoxerPose`에도 적용:

| 심플 함수 | 리얼 모델일 때 호출 |
|-----------|---------------------|
| `animateBoxerIdle(model, time)` | `playRealAction(model, 'Idle', { loop: true })` (이미 재생 중이면 noop) |
| `animatePunch(model, type, progress)` | `playRealAction(model, MIXAMO_PUNCH_MAP[type], { loop: false })` (트리거 1회) |
| `animateHit(model, progress)` | `progress < 0.05` 시점에 좌/우 랜덤으로 `HitLeft` 또는 `HitRight` 1회 |
| `animateBlock(model, guardType)` | mixamo에 block 클립 없음 → idle 유지 + 본 회전 미세 보정 (선택) |
| `animateDodge(model, type, progress)` | type=duck이면 `Bob`, type=slip이면 `Slip` 트리거 1회 |
| `resetBoxerPose(model)` | `playRealAction(model, 'Idle', { loop: true })` |

---

## 5. 펀치 타입 → Mixamo 클립 매핑 표

게임의 4종 펀치는 좌/우 손 구분이 없으므로, 한 손은 같은 손 hook/jab으로, 반대 손은 cross/uppercut 계열로 매핑.

```js
const MIXAMO_PUNCH_MAP = {
  jab:      'Jab',         // 앞손 직선 — Mixamo "Jab"
  cross:    'Cross',       // 뒷손 직선 — Mixamo "Cross"
  hook:     'HookRight',   // 훅 (orthodox stance 기준 뒷손 훅이 강력함)
  uppercut: 'Uppercut',    // 어퍼컷 — Mixamo "Uppercut"
};

// (선택) 콤보가 같은 펀치 반복일 때 좌/우 번갈아: jab→HookLeft, hook→HookRight
const MIXAMO_PUNCH_MAP_ALT = {
  jab:      'Jab',
  cross:    'Cross',
  hook:     'HookLeft',
  uppercut: 'Uppercut',
};
```

| 게임 punchType | 1차 Mixamo 클립 | 보조 클립 (콤보 시 alt) | 비고 |
|----------------|------------------|-------------------------|------|
| `jab`          | `Jab`           | `Jab` (동일 반복)       | 빠른 앞손 |
| `cross`        | `Cross`         | `Cross`                 | 뒷손 직선 |
| `hook`         | `HookRight`     | `HookLeft`              | 좌우 모두 mixamo에서 받음 |
| `uppercut`     | `Uppercut`      | `Uppercut`              | 단일 클립 |

---

## 6. 게임 루프에 mixer.update 추가

`animate()` 함수 (또는 메인 루프) 안에서 `dt` 계산 후:

```js
const dt = clock.getDelta();
if (playerModel && playerModel.isReal && playerModel.mixer) playerModel.mixer.update(dt);
if (oppModel && oppModel.isReal && oppModel.mixer) oppModel.mixer.update(dt);
```

`renderer.render(scene, camera)` 직전에.

---

## 7. 초기 init 순서 변경 (line 443 근처)

```js
playerModel = buildBoxer(0xe63946, true);   // 기본은 심플
oppModel    = buildBoxer(0x3b82f6, false);
// ... (기존 scale, position, rotation, scene.add)

// 백그라운드 프리로드 — 토글 시 즉시 사용
preloadRealBoxer().catch(() => {/* 파일 없어도 게임은 정상 동작 */});
```

---

## 8. 검증 방법

1. `_mixamo\TEST_LOAD.html`을 브라우저에서 열어 `boxer.glb` 자체가 정상 로드되는지, 클립 11개가 나열되는지 확인.
2. v5 게임 실행 → 우측 상단 "리얼 모델" 클릭 → 박서 모델 교체 + Idle 호흡 모션 확인.
3. 잽/크로스/훅/어퍼컷 버튼 → 각 mixamo 클립 1회 재생 후 자연스럽게 Idle 복귀.
4. CPU에 맞으면 `Hit Reaction` 트리거.
5. "심플 모델" 클릭 → procedural buildBoxer로 즉시 복귀 (퇴보 검증용).

---

## 9. 알려진 한계 / 트레이드오프

- **본 구조 차이**: procedural model의 `model.lGlove`, `model.rGlove`를 참조하는 `updatePunchTrail`, `showKineticChainGlow`, `showHookImpactSpark` 같은 함수는 리얼 모델에서 보이지 않거나 위치가 어긋남. → 가드: `if (model.isReal) return;` 또는 본 hand에서 worldPosition 가져오는 폴백 필요. (별도 PR로 처리 권장)
- **scale 2.6**: 심플 모델 기준값. 리얼 모델은 mixamo 기본 신장 ~1.7m라 동일하게 2.6 곱하면 ~4.4m로 큼. 리얼 모델 전용 scale을 `1.5` 정도로 시작해서 링 스케일에 맞게 튜닝.
- **Block 클립 없음**: mixamo에 정통 권투 가드 자세 클립이 없음. Idle을 유지하거나 추후 별도 mixamo `Holding` 검색.
- **Draco**: GLB가 Draco 압축이라 `DRACOLoader` 필수. 디코더는 Google CDN(`gstatic.com/draco/v1/decoders/`) 사용. 오프라인 필요 시 `node_modules/three/examples/js/libs/draco/`에서 복사.
- **r128 examples**: jsdelivr CDN이 가장 안정. unpkg는 가끔 410. cdnjs r128에는 examples/js가 없음.
