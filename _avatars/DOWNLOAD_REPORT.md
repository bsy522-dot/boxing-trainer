# 데모 아바타 다운로드 리포트

> 회원가입 없이 즉시 게임에서 보여줄 수 있는 라이선스 안전 인간형 GLB 모델 일괄 수집 결과
> 생성일: 2026-05-15 / 작업: 자산팀

## 1. 다운로드 결과 요약

| # | 파일 | 용량 | 라이선스 | Joints | 애니 | 적합도 | 검증 |
|---|------|-----:|----------|-------:|-----:|-------:|------|
| 1 | `soldier.glb` | 2.06 MB | CC-BY 4.0 (T. Choonyung) | 49 | 4개 (Idle/Run/Walk/TPose) | ★★★★★ | OK |
| 2 | `xbot.glb` | 2.79 MB | Mixamo free-for-use | 67 | 7개 (idle/walk/run + 4 pose) | ★★★★★ | OK |
| 3 | `michelle.glb` | 3.13 MB | Mixamo free-for-use | 65 | 2개 (SambaDance/TPose) | ★★★★ | OK |
| 4 | `cesium_man.glb` | 0.47 MB | CC-BY 4.0 (Cesium/AGI) | 19 | 1개 | ★★★ | OK |
| 5 | `brain_stem.glb` | 3.05 MB | **CC0 1.0 / Public Domain** | 18 | 1개 | ★★★ | OK |
| 6 | `rigged_figure.glb` | 0.05 MB | CC-BY 4.0 (Khronos) | 19 | 1개 | ★★ | OK |
| 7 | `rigged_simple.glb` | 0.01 MB | CC-BY 4.0 (Khronos) | 2 | 1개 | ★ | OK |

- **총 7개 / 11.55 MB** (목표 100MB 이내 충분)
- 모든 GLB: 매직바이트 `glTF` 확인, glTF v2 형식, JSON 헤더 정상 파싱
- 라이선스 메타: 각 `LICENSE_<name>.txt` 파일에 보관

## 2. 시도했으나 받지 못한 것

| 후보 | 사유 |
|------|------|
| ReadyPlayerMe demo 아바타 4종 (`models.readyplayer.me/<id>.glb`) | DNS 해석 실패 (`models.readyplayer.me` 미응답). 사내망/방화벽 추정 — 게임은 RPM iframe(`demo.readyplayer.me`)으로 사용자 직접 생성 가능 |
| Quaternius / Kenney 직접 GLB | 페이지가 ZIP 묶음(.fbx/.blend 위주)이라 단일 GLB URL 부재 — 후속 작업으로 변환 필요 |
| Sketchfab CC0 검색 다운로드 | Sketchfab v3 API의 CC0 라이선스 UID 필터가 400 에러 — OAuth 토큰 필요한 다운로드 엔드포인트라 회원가입 없이는 불가 |

> 결론: **공개 GitHub raw + threejs.org/examples 가 회원가입 없는 라이선스 안전 GLB의 가장 빠른 경로**

## 3. 권투 게임 적합도 분석

### 권장 1순위: `xbot.glb` (Mixamo X-Bot)
- 67 joints — Mixamo 표준 본 구조
- `idle`, `walk`, `run` 클립 내장 → 권투 매치에서 즉시 사용
- 머리/손/허리 본 이름이 Mixamo 표준이라 향후 Mixamo 권투 애니(`_mixamo/` 폴더) 리타기팅 그대로 호환
- 라이선스: Adobe가 Mixamo 자산을 비상업/상업 무료 사용 허용

### 권장 2순위: `soldier.glb`
- 49 joints + Walk/Run/Idle/TPose 4개 베이크 → 즉시 사용 가능
- CC-BY 4.0 (저자 표시만 하면 OK, 매우 안전)
- xbot보다 폴리곤 적어 모바일 친화적

### 권장 3순위: `michelle.glb`
- 65 joints, Mixamo 호환
- 여성 캐릭터 → 대전 상대 다양성용
- 단, 기본 애니가 SambaDance라 권투 클립 별도 리타기팅 필요

### 보조용
- `cesium_man.glb` — 0.47MB로 가장 가벼움, 첫 데모 로딩에 적합
- `brain_stem.glb` — **유일한 CC0 (Public Domain)** — 라이선스 가장 자유로움
- `rigged_figure.glb`, `rigged_simple.glb` — 디버그/스켈레톤 표시용

## 4. boxing-trainer-v5.html 패치 가이드

### Step 1 — `<head>` 또는 GLTFLoader 직후에 스크립트 추가
파일: `boxing-trainer-v5.html` 약 261번째 줄 (GLTFLoader script 다음)

```html
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
<!-- 추가 -->
<script src="_avatars/demo_avatar_loader.js"></script>
```

### Step 2 — 메인 메뉴에 버튼 추가
파일: `boxing-trainer-v5.html` 약 140번째 줄 (RPM 버튼 직후)

```html
<button class="menu-btn" onclick="openRPMCreator()">...</button>
<!-- ↓ 아래 3개 추가 -->
<button class="menu-btn" id="demoAvatarBtn1" onclick="window.DemoAvatars.load('soldier')" style="border-color:rgba(64,196,255,.3)">
  <span class="icon">&#x1F916;</span> 데모 아바타 1: 솔저
  <span class="sub">CC-BY · 49관절 · Walk/Run/Idle 내장</span>
</button>
<button class="menu-btn" id="demoAvatarBtn2" onclick="window.DemoAvatars.load('xbot')" style="border-color:rgba(64,196,255,.3)">
  <span class="icon">&#x1F933;</span> 데모 아바타 2: X-Bot
  <span class="sub">Mixamo · 67관절 · 권투 리타기팅 최적</span>
</button>
<button class="menu-btn" id="demoAvatarBtn3" onclick="window.DemoAvatars.load('michelle')" style="border-color:rgba(64,196,255,.3)">
  <span class="icon">&#x1F485;</span> 데모 아바타 3: 미셸
  <span class="sub">Mixamo 여성 · 65관절 · 대전 상대용</span>
</button>
<button class="menu-btn" onclick="window.DemoAvatars.clear()" style="border-color:rgba(150,150,150,.3)">
  <span class="icon">&#x267B;&#xFE0F;</span> 데모 아바타 제거
  <span class="sub">기본/RPM 캐릭터로 복귀</span>
</button>
```

> **자동 주입**: `demo_avatar_loader.js`는 페이지 로드 시 `#mainMenu` 안에
> "🤖 데모 아바타 시연" 버튼을 자동 주입하여 클릭 시 7종을 순환 재생합니다.
> 위 수동 패치를 안 해도 자동으로 1개 버튼은 생깁니다.

### Step 3 — gameLoop 에서 mixer 업데이트 (애니메이션 재생용)
파일: `boxing-trainer-v5.html` 3163~3172번째 줄

```javascript
function gameLoop() {
  requestAnimationFrame(gameLoop);
  const dt = Math.min(clock.getDelta(), 0.05);
  const time = clock.getElapsedTime();

  if (currentScreen === 'fight') updateFight(dt);
  else if (currentScreen === 'train') updateTraining(dt);
  else if (currentScreen === 'combo') updateComboTraining(dt);

  update3DScene(time, dt);
  // ↓ 추가 (데모 아바타 애니 mixer 업데이트)
  if (window.DemoAvatars) window.DemoAvatars.update(dt);
  renderer.render(scene, camera);
}
```

### Step 4 — 검증 (5단계 결재라인용)
1. 브라우저로 `boxing-trainer-v5.html` 열기
2. 메인 메뉴에 "🤖 데모 아바타 시연" 버튼 자동 표시 확인
3. 클릭 → 좌측에 솔저 모델 + Idle 애니 재생 확인
4. 콘솔에 `[DemoAvatars] loaded: soldier | CC-BY 4.0 ...` 로그
5. "데모 아바타 제거" 또는 RPM 아바타 만들기로 정상 복귀

## 5. 라이선스 표기 의무

배포 시 게임 크레딧/About 화면에 다음 표기 필요:

```
3D Avatar Assets:
- Soldier (CC-BY 4.0) by T. Choonyung — via Three.js examples
- X-Bot, Michelle (Mixamo) — Adobe free-for-use license
- CesiumMan, RiggedFigure, RiggedSimple (CC-BY 4.0) — Khronos Group
- BrainStem (CC0 1.0 / Public Domain) — Keith Hunter via Khronos
```

CC0 (`brain_stem.glb`)만 표기 의무가 없지만, 관행적으로 출처는 표기 권장.

## 6. 파일 구조

```
_avatars/
├── soldier.glb              (2.06 MB)   ← 권장 1순위
├── xbot.glb                 (2.79 MB)   ← 권장 2순위
├── michelle.glb             (3.13 MB)   ← 권장 3순위
├── cesium_man.glb           (0.47 MB)
├── brain_stem.glb           (3.05 MB)
├── rigged_figure.glb        (0.05 MB)
├── rigged_simple.glb        (0.01 MB)
├── LICENSE_<name>.txt       (각 파일별 7개)
├── demo_avatar_loader.js    ← 통합 스크립트
├── _download.ps1            ← 재실행 가능한 다운로드 스크립트
├── _verify.ps1              ← GLB 헤더 검증 스크립트
├── _download_results.json   ← 다운로드 메타
├── _verify_results.json     ← 검증 메타
└── DOWNLOAD_REPORT.md       ← 본 문서
```

## 7. 결론

- **즉시 가능**: `soldier`/`xbot` 두 모델은 코드 수정 없이도 자동 주입 버튼으로 게임 내 표시 가능
- **추가 작업 권장**: 권투 펀치 애니메이션은 별도(`_mixamo/` FBX 변환) — Mixamo 본 구조가 동일한 `xbot`에 리타기팅 시 즉시 호환
- **RPM 보완**: 사용자가 회원가입 없이 즉석 시연을 원할 때 본 데모 아바타 사용, 본인 얼굴 원하면 기존 RPM iframe 흐름 유지
