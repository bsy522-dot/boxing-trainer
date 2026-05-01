# Ready Player Me → boxing-trainer-v5 통합 가이드

이 문서는 `_rpm/` 데모를 본 게임(`boxing-trainer-v5.html`)에 합치는 단계별 패치 가이드다. 코드를 직접 수정하기 전에 데모(`_rpm/rpm_iframe_demo.html`)로 동작 확인 → localStorage에 URL 저장됨 → 본 게임에서 읽어 사용.

---

## 1. 데이터 흐름

```
[메인 메뉴 — "내 아바타 만들기" 버튼]
        │
        ▼ 클릭
[RPM iframe overlay 표시]
        │
        ▼ 사용자가 아바타 완성 후 [Next]
[v1.avatar.exported postMessage → GLB URL 수신]
        │
        ▼
[localStorage.setItem('rpm_avatar_url', glbUrl)]
        │
        ▼
[overlay 닫고 메뉴로 복귀]
        │
        ▼ 게임 시작 (커리어 / 퀵매치)
[startFight() → RPM URL 있으면 GLTFLoader, 없으면 buildBoxer()]
```

---

## 2. 메뉴 버튼 추가

`boxing-trainer-v5.html` Line 140 (resetAll 버튼) **위에** 추가:

```html
<button class="menu-btn" onclick="openRPMCreator()">
  <span class="icon">&#x1F464;</span> 내 아바타 만들기
  <span class="sub">Ready Player Me로 자기 얼굴/체형 아바타 제작</span>
</button>
<button class="menu-btn" onclick="clearRPMAvatar()" id="rpmClearBtn" style="display:none">
  <span class="icon">&#x1F5D1;&#xFE0F;</span> 기본 캐릭터로 복귀
  <span class="sub">RPM 아바타를 제거하고 기본 모델 사용</span>
</button>
```

`<body>` 끝부분(`</script>` 직전)에 RPM overlay 추가:

```html
<div class="overlay hidden" id="rpmOverlay" style="padding:0;background:#0a0a0f">
  <div style="display:flex;align-items:center;padding:10px;background:#161620;border-bottom:1px solid #2a2a3a">
    <div style="flex:1;color:#e63946;font-weight:700;letter-spacing:2px">READY PLAYER ME</div>
    <button class="back-btn" onclick="closeRPMCreator()">닫기</button>
  </div>
  <iframe id="rpmFrame" style="flex:1;width:100%;height:calc(100vh - 50px);border:0"
    allow="camera *; microphone *; clipboard-write"></iframe>
</div>
```

---

## 3. 헤드 스크립트에 RPM 로더 포함

`boxing-trainer-v5.html` Line 223 근처 (three.js script 다음 줄):

```html
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
<script src="_rpm/rpm_loader.js"></script>
```

---

## 4. JS 로직 — 메뉴 함수 추가

`<script>` 블록 안 적당한 위치 (예: Line 1500 부근, showCareer 옆):

```js
// ==================== RPM AVATAR INTEGRATION ====================
const RPM_SUBDOMAIN = 'demo'; // 파트너 등록 후 'bsy522'로 교체
const RPM_KEY = 'rpm_avatar_url';

function openRPMCreator() {
  const overlay = document.getElementById('rpmOverlay');
  const frame = document.getElementById('rpmFrame');
  frame.src = `https://${RPM_SUBDOMAIN}.readyplayer.me/avatar?frameApi&clearCache`;
  document.getElementById('mainMenu').classList.add('hidden');
  overlay.classList.remove('hidden');
}

function closeRPMCreator() {
  document.getElementById('rpmOverlay').classList.add('hidden');
  document.getElementById('mainMenu').classList.remove('hidden');
  document.getElementById('rpmFrame').src = '';
  refreshRPMButton();
}

function clearRPMAvatar() {
  localStorage.removeItem(RPM_KEY);
  refreshRPMButton();
  alert('기본 캐릭터로 복귀합니다. 다음 매치부터 적용.');
}

function refreshRPMButton() {
  const has = !!localStorage.getItem(RPM_KEY);
  document.getElementById('rpmClearBtn').style.display = has ? 'block' : 'none';
}
refreshRPMButton();

// postMessage 핸들러 — RPM iframe과 통신
window.addEventListener('message', (event) => {
  let msg;
  try { msg = typeof event.data === 'string' ? JSON.parse(event.data) : event.data; }
  catch(e) { return; }
  if (!msg || msg.source !== 'readyplayerme') return;

  const frame = document.getElementById('rpmFrame');
  if (msg.eventName === 'v1.frame.ready') {
    frame.contentWindow.postMessage(JSON.stringify({
      target:'readyplayerme', type:'subscribe', eventName:'v1.**'
    }), '*');
    return;
  }
  if (msg.eventName === 'v1.avatar.exported' || msg.eventName === 'v2.avatar.exported') {
    const url = msg.data?.url || msg.data;
    if (typeof url === 'string' && url.endsWith('.glb')) {
      localStorage.setItem(RPM_KEY, url);
      closeRPMCreator();
    }
  }
});
```

---

## 5. buildBoxer 분기 — RPM 아바타 우선 사용

Line 443 근처의 player 모델 빌드 부분을 교체:

**Before:**
```js
playerModel = buildBoxer(0xe63946, true);
```

**After:**
```js
const rpmUrl = localStorage.getItem('rpm_avatar_url');
if (rpmUrl) {
  playerModel = await buildRPMBoxer(rpmUrl, 0xe63946);
} else {
  playerModel = buildBoxer(0xe63946, true);
}
```

`init()` 함수를 `async`로 변경 필요. 그리고 새 함수:

```js
async function buildRPMBoxer(url, gloveColor) {
  const loader = new RPMLoader({ atlas: 1024, lod: 0, pose: 'A' });
  const gltf = await loader.load(url);
  const root = gltf.scene;

  // RPM 아바타는 약 175cm — 게임 좌표계에 맞춰 스케일 조정
  // 기존 buildBoxer는 scale 2.6 적용 — RPM은 1.0~1.2 (이미 실제 비율)
  // 로컬 보간 없이 group 한 번만 감싸기
  const group = new THREE.Group();
  group.add(root);

  // 본 참조 추출 — 애니메이션에서 사용
  const bones = {};
  root.traverse(o => { if (o.isBone) bones[o.name] = o; });

  // 글러브 메시 추가 (RPM은 손까지만 — 글러브 없음)
  // → 좌/우 손 본에 글러브 메시 attach
  const gloveGeo = new THREE.SphereGeometry(0.08, 16, 12);
  const gloveMat = new THREE.MeshPhysicalMaterial({
    color: gloveColor, roughness: 0.32, clearcoat: 0.85
  });
  ['LeftHand', 'RightHand'].forEach(name => {
    const bone = bones[name] || bones['mixamorig:'+name];
    if (bone) {
      const glove = new THREE.Mesh(gloveGeo, gloveMat);
      bone.add(glove);
    }
  });

  // 기존 코드와 호환되는 인터페이스 반환
  // (기존 buildBoxer는 .group, .pelvis, .spine, .leftArm 등을 노출)
  return {
    group,
    isRPM: true,
    bones,
    pelvis: bones['Hips'] || bones['mixamorig:Hips'],
    spine: bones['Spine'] || bones['mixamorig:Spine'],
    head: bones['Head'] || bones['mixamorig:Head'],
    leftShoulder: bones['LeftArm'] || bones['mixamorig:LeftArm'],
    rightShoulder: bones['RightArm'] || bones['mixamorig:RightArm'],
    leftElbow: bones['LeftForeArm'] || bones['mixamorig:LeftForeArm'],
    rightElbow: bones['RightForeArm'] || bones['mixamorig:RightForeArm'],
    leftHand: bones['LeftHand'] || bones['mixamorig:LeftHand'],
    rightHand: bones['RightHand'] || bones['mixamorig:RightHand'],
    leftHip: bones['LeftUpLeg'] || bones['mixamorig:LeftUpLeg'],
    rightHip: bones['RightUpLeg'] || bones['mixamorig:RightUpLeg'],
    leftKnee: bones['LeftLeg'] || bones['mixamorig:LeftLeg'],
    rightKnee: bones['RightLeg'] || bones['mixamorig:RightLeg'],
  };
}
```

---

## 6. 애니메이션 시스템 — 본 이름 호환성

기존 v5의 절차적 애니메이션 코드(`leftShoulder.rotation.x = ...`)는 위 매핑만 맞으면 그대로 작동. 단:

- **A-Pose vs T-Pose**: RPM은 A-Pose(팔이 약간 내려옴), 기존 buildBoxer는 T-Pose 가정 → 어깨 기본 각도 -15°쯤 보정 필요
- **본 prefix**: RPM 표준 export는 prefix 없음(`Hips`), 일부 옵션은 `mixamorig:` 붙음 → `RPMLoader.retargetMixamoClip()` 헬퍼 사용
- **스케일**: RPM은 1m=1unit, 게임 ring은 큰 좌표 → group.scale 조정 필요

---

## 7. Mixamo 애니메이션 클립 적용 (선택)

`.fbx` Mixamo 클립을 사용하려면:

```js
const fbxLoader = new THREE.FBXLoader();
fbxLoader.load('mixamo_jab.fbx', (fbx) => {
  const clip = fbx.animations[0];
  RPMLoader.retargetMixamoClip(clip); // mixamorig: prefix 제거
  const mixer = new THREE.AnimationMixer(playerModel.group);
  mixer.clipAction(clip).play();
});
```

---

## 8. 모바일 최적화

`new RPMLoader({ atlas: 512, lod: 1 })` — 512px 텍스처 + 중간 LOD = 메모리 ~70% 절감.

---

## 9. 테스트 체크리스트

- [ ] 메뉴 → "내 아바타 만들기" 클릭 → iframe 표시
- [ ] 아바타 완성 후 [Next] → overlay 자동 닫힘
- [ ] localStorage에 URL 저장 확인 (DevTools → Application → Local Storage)
- [ ] 퀵매치 시작 → player가 RPM 아바타로 표시됨
- [ ] 잽/크로스/훅/어퍼 — 팔 회전 정상
- [ ] "기본 캐릭터로 복귀" → buildBoxer로 fallback
- [ ] 페이지 새로고침 — RPM URL 유지됨 (캐시 hit)

---

## 10. 알려진 제약

- `demo.readyplayer.me`는 **상업/공개 배포 금지** — 파트너 가입 필수 (https://studio.readyplayer.me)
- 무료 티어 — 월 1000 MAU 제한
- iframe은 카메라 권한 필요 (얼굴 스캔용) — HTTPS 환경에서만 동작
- 일부 모바일 브라우저는 IndexedDB 용량 제한 (50MB)
