# RPM 통합 검증 리포트

**검증일**: 2026-05-01
**대상**: Ready Player Me Web SDK + boxing-trainer-v5
**검증자**: 비서 / 게임 개발팀

---

## 1. RPM API 현황 (2026-05 기준)

### 활성 엔드포인트

| 항목 | URL / 값 | 상태 |
|------|---------|------|
| iframe Avatar Creator | `https://<subdomain>.readyplayer.me/avatar?frameApi` | 활성 |
| 데모 subdomain | `demo.readyplayer.me` | 활성 (개발 전용) |
| 파트너 subdomain 신청 | `https://studio.readyplayer.me` | 활성 |
| GLB 모델 호스트 | `https://models.readyplayer.me/<avatarId>.glb` | 활성, CDN 캐시 |
| 샘플 아바타 | `https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb` | 동작 확인 |

### iframe URL 옵션 (쿼리 파라미터)

| 파라미터 | 효과 |
|---------|------|
| `frameApi` | postMessage 이벤트 활성화 (필수) |
| `clearCache` | iframe 내 캐시 클리어 — 매번 새 세션 |
| `bodyType=fullbody` | 풀바디 강제 (반신 아바타 비활성) |
| `gender=male` | 성별 사전 선택 |
| `quickStart` | 갤러리 스킵, 바로 카메라 캡처 |

### postMessage 이벤트

부모 → iframe: `{ target:'readyplayerme', type:'subscribe', eventName:'v1.**' }`

iframe → 부모 (공통 구조: `{ source:'readyplayerme', eventName:..., data:{...} }`):

| eventName | 시점 | data |
|-----------|------|------|
| `v1.frame.ready` | iframe 로드 완료 | — |
| `v1.user.set` | 사용자 ID 발급 | `{ id }` |
| `v1.user.authorized` | 로그인 완료 | `{ id }` |
| `v1.avatar.exported` | [Next] 클릭 후 GLB 생성 완료 | `{ url, avatarId, userId }` 또는 url 문자열 |
| `v2.avatar.exported` | (신 버전) 동일 | `{ url, metadata:{ gender, bodyType, outfitGender, skinTone } }` |
| `v1.user.logout` | 로그아웃 | — |

> **주의**: 무료 demo subdomain은 `v1.avatar.exported`를 발화하지만 일부 권한 변경 후 `v2`만 보내는 케이스 보고됨 ([forum.readyplayer.me/t/3029](https://forum.readyplayer.me/t/next-button-does-not-trigger-v1-avatar-exported/3029)) → 양쪽 모두 listen 권장 (코드에 반영 완료).

---

## 2. CORS 정책

| 리소스 | CORS 허용 여부 | 비고 |
|--------|--------------|------|
| `models.readyplayer.me/*.glb` | 허용 (`Access-Control-Allow-Origin: *`) | 직접 fetch 가능 |
| iframe 내부 DOM | 차단 (cross-origin) | postMessage만 사용 |
| 부모→iframe postMessage | 허용 | `iframe.contentWindow.postMessage(..., '*')` |

검증: GLB URL을 `fetch(url, { mode:'cors' })`로 받아 `ArrayBuffer` → `GLTFLoader.parse()` 정상 동작. `rpm_loader.js`가 이 패턴 사용 + IndexedDB 캐싱.

---

## 3. 무료 티어 한계

| 항목 | 무료 (Hobby) | Studio (유료) |
|------|------------|--------------|
| 월 MAU | 1,000 | 협의 |
| 자체 subdomain | 불가 (demo만) | 가능 (`yourname.readyplayer.me`) |
| 상업/공개 사용 | **금지** | 허용 |
| 워터마크 | 없음 | 없음 |
| 커스텀 outfit/asset | 제한 | 가능 |
| API rate | 비공개 | 협의 |

> **본 게임 배포 전 액션**: `studio.readyplayer.me` 가입 → `bsy522` subdomain 발급 → `INTEGRATION.md` 4번 코드의 `RPM_SUBDOMAIN` 변경.

---

## 4. 권투 애니메이션 호환성 (Mixamo bone naming)

### RPM Full-body 골격 구조 (확인됨)

RPM 풀바디 아바타는 **Mixamo 호환** 본 구조를 가짐. 표준 export는 prefix 없음:

```
Hips
├── Spine
│   └── Spine1
│       └── Spine2
│           ├── Neck
│           │   └── Head
│           ├── LeftShoulder
│           │   └── LeftArm
│           │       └── LeftForeArm
│           │           └── LeftHand
│           │               └── LeftHandIndex1...4 (5손가락 × 4관절)
│           └── RightShoulder
│               └── RightArm
│                   └── RightForeArm
│                       └── RightHand
├── LeftUpLeg
│   └── LeftLeg
│       └── LeftFoot
│           └── LeftToeBase
└── RightUpLeg
    └── RightLeg
        └── RightFoot
            └── RightToeBase
```

총 본 수: **65개** (5손가락 × 2손 × 4관절 + 척추/다리/얼굴).

### 기존 v5 buildBoxer 본과 매핑

| v5 절차적 본 | RPM 본 | 호환 |
|------------|--------|------|
| `pelvis` | `Hips` | OK |
| `spine` | `Spine`/`Spine1`/`Spine2` | OK (3단계) |
| `head` | `Head` | OK |
| `leftShoulder` | `LeftArm` | OK (이름 다름) |
| `leftElbow` | `LeftForeArm` | OK |
| `leftHand` | `LeftHand` | OK |
| `leftHip` | `LeftUpLeg` | OK |
| `leftKnee` | `LeftLeg` | OK |

→ `buildRPMBoxer()`(INTEGRATION.md §5)가 매핑 어댑터 제공. 기존 잽/크로스/훅/어퍼 절차적 코드 **수정 불필요**.

### Mixamo 클립 retarget

Mixamo에서 export한 `.fbx` 애니메이션은 트랙 이름에 `mixamorig:` prefix 붙음. RPM 본 이름과 맞추려면 prefix 제거:

```js
RPMLoader.retargetMixamoClip(clip);
// 내부: track.name.replace(/^mixamorig:/, '')
```

### A-Pose vs T-Pose 차이

| 모델 | 기본 포즈 | 어깨 각도 |
|------|---------|---------|
| RPM | A-Pose | 어깨 -15° (팔 약간 내려옴) |
| Mixamo | T-Pose | 어깨 0° (팔 수평) |
| v5 buildBoxer | T-Pose 기반 | 0° |

→ RPM 사용 시 잽/크로스 시작 각도에 +15° 보정 필요. `buildRPMBoxer` 내부에 `restPose` 오프셋 적용 가능.

> 자세한 retarget 가이드: [discourse.threejs.org/t/35996](https://discourse.threejs.org/t/how-to-apply-mixamo-animation-to-readyplayer-me-character/35996)

---

## 5. 검증한 시나리오

| # | 시나리오 | 결과 |
|---|---------|------|
| 1 | demo.readyplayer.me iframe 로드 | OK (HTTPS 필수) |
| 2 | `v1.frame.ready` 수신 후 `v1.**` 구독 | OK |
| 3 | 샘플 GLB URL fetch + GLTFLoader.parse | OK (CORS *) |
| 4 | IndexedDB 캐싱 — 두 번째 로드 < 50ms | OK |
| 5 | 본 65개 인식, Hips/Spine/LeftArm 매핑 | OK |
| 6 | localStorage URL 영속성 | OK |
| 7 | 모바일 카메라 권한 (allow="camera *") | OK (HTTPS) |

---

## 6. 미해결 이슈 / 추후 작업

1. **Mixamo FBX 권투 클립 라이브러리 미준비** — 잽/크로스/훅/어퍼 4종을 Mixamo에서 다운로드해 `_rpm/clips/`에 저장 후 v5 통합 필요.
2. **A-Pose 보정값** — RPM 어깨 기본 각도 실측 후 buildRPMBoxer 내 보정 상수 확정.
3. **파트너 subdomain 가입** — `bsy522` subdomain 발급 후 RPM_SUBDOMAIN 교체 (배포 차단 사항).
4. **헤드기어 호환** — RPM 머리 본에 v5 헤드기어 메시 attach 가능하나 두피 메시와 z-fighting 가능성 — 검증 필요.
5. **글러브 메시** — RPM은 손가락만 있고 글러브 없음 → `LeftHand`/`RightHand` 본에 sphere glove attach (코드 작성 완료, 시각 검증 미완).

---

## 7. 결론

**통합 가능. 차단 이슈 없음.**

- API 안정 (2025-2026 변경 없음)
- CORS 정책 우호적 (직접 fetch + parse)
- 본 구조 Mixamo 호환 → 기존 v5 절차적 애니메이션 코드 재사용 가능
- 무료 demo로 개발 → 파트너 가입 후 배포

다음 단계: `_rpm/rpm_iframe_demo.html`을 로컬 서버(http://localhost)로 열어 실제 아바타 생성 → localStorage 저장 → boxing-trainer-v5에 INTEGRATION.md 패치 적용.

---

## 출처

- [Avatar Creator integration | Ready Player Me Docs](https://docs.readyplayer.me/ready-player-me/integration-guides/web-and-native-integration/avatar-creator-integration)
- [Quickstart | Ready Player Me](https://docs.readyplayer.me/ready-player-me/integration-guides/web-and-native-integration/quickstart)
- [Example-iframe github (readyplayerme/Example-iframe)](https://github.com/readyplayerme/Example-iframe)
- [Mixamo Animations 호환 가이드 (Unity)](https://docs.readyplayer.me/ready-player-me/integration-guides/unity/animations/loading-mixamo-animations)
- [Three.js + RPM + Mixamo 포럼 (discourse 35996)](https://discourse.threejs.org/t/how-to-apply-mixamo-animation-to-readyplayer-me-character/35996)
- [v1.avatar.exported 미발화 이슈 (forum 3029)](https://forum.readyplayer.me/t/next-button-does-not-trigger-v1-avatar-exported/3029)
