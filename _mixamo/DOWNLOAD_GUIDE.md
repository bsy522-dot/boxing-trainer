# Mixamo 다운로드 가이드 (병석님용)

Adobe Mixamo는 무료 인간 캐릭터 + 모션캡처 애니메이션을 제공합니다.
한 번만 받으면 boxer.glb 하나로 합쳐져서 게임에 자동 연결됩니다.

---

## 0. 사전 준비 (한 번만)

1. https://www.mixamo.com 접속
2. 우측 상단 **Sign Up** 클릭 → Adobe ID 무료 가입 (이메일+비밀번호만)
3. 로그인 완료

---

## 1. 캐릭터 다운로드 (1개)

### Y Bot (권장) — 또는 X Bot

1. 상단 **Characters** 탭 클릭
2. 검색창에 **Y Bot** 입력 → 노란색 미니멀 캐릭터 선택
3. 우측 패널 **DOWNLOAD** 버튼 클릭
4. 다운로드 설정:
   ```
   Format:           FBX Binary (.fbx)
   Pose:             T-pose
   ```
5. **DOWNLOAD** → 파일명 그대로 저장
6. 저장 위치: `D:\AI\04_게임\복싱트레이너\_mixamo\fbx\character.fbx`
   (다운로드된 파일 이름을 정확히 `character.fbx`로 변경)

> X Bot도 동일 방식. 더 마초적인 비율을 원하면 X Bot 선택.

---

## 2. 애니메이션 다운로드 (10개)

각 애니메이션마다 **동일한 절차**:

1. 상단 **Animations** 탭 클릭
2. 검색창에 아래 표의 **검색어** 입력
3. 결과에서 가장 적합한 클립 클릭 (미리보기 확인)
4. 우측 패널 옵션 조정 (트리밍, 강도 등은 기본값)
5. **DOWNLOAD** 버튼 → 다운로드 설정:
   ```
   Format:                   FBX Binary (.fbx)
   Skin:                     Without Skin   ← 중요! 캐릭터 스킨은 1번에서 받았음
   Frames per Second:        30
   Keyframe Reduction:       none           ← 절대 uniform 선택 금지
   ```
6. **DOWNLOAD** → 파일명을 아래 표의 **저장 파일명** 으로 변경

### 애니메이션 목록표

| # | 검색어 | In-Place 옵션 | 저장 파일명 (`_mixamo\fbx\` 안에) | 게임 사용처 |
|---|--------|---------------|-----------------------------------|-------------|
| 1 | `Boxing Idle` (또는 `Fighting Idle Stance`) | In Place 체크 | `anim_idle.fbx` | 기본 가드 자세 |
| 2 | `Jab Cross` (또는 그냥 `Jab`) | In Place 체크 | `anim_jab.fbx` | 잽 펀치 |
| 3 | `Cross Punch` | In Place 체크 | `anim_cross.fbx` | 크로스 펀치 |
| 4 | `Right Hook` | In Place 체크 | `anim_hook_right.fbx` | 오른 훅 |
| 5 | `Left Hook` | In Place 체크 | `anim_hook_left.fbx` | 왼 훅 |
| 6 | `Uppercut` | In Place 체크 | `anim_uppercut.fbx` | 어퍼컷 |
| 7 | `Bob` (또는 `Boxing Bob and Weave`) | In Place 체크 | `anim_bob.fbx` | 덕(웅크리기) |
| 8 | `Slip` (또는 `Boxing Slip`) | In Place 체크 | `anim_slip.fbx` | 슬립(피하기) |
| 9 | `Hit Reaction` (검색 후 좌/우 각각 1개씩 받기) | In Place 체크 | `anim_hit_left.fbx`, `anim_hit_right.fbx` | 피격 |
| 10 | `Dying` (또는 `Knockout`, `Death From Front`) | In Place 체크 | `anim_ko.fbx` | KO 다운 |

> **In Place 옵션이 보이지 않는 경우**: 일부 애니메이션은 In Place가 없습니다. 그대로 받으세요. Blender 변환 시 root motion을 강제로 0으로 만듭니다.

> **Hit Reaction**은 검색 결과가 많습니다. "Hit Reaction" 검색 후 좌측에서 한 대 맞는 모션, 우측에서 한 대 맞는 모션 각각 1개씩 받으세요.

---

## 3. 다운로드 완료 체크리스트

`D:\AI\04_게임\복싱트레이너\_mixamo\fbx\` 폴더에 아래 11개 파일이 모두 있어야 합니다:

```
character.fbx
anim_idle.fbx
anim_jab.fbx
anim_cross.fbx
anim_hook_right.fbx
anim_hook_left.fbx
anim_uppercut.fbx
anim_bob.fbx
anim_slip.fbx
anim_hit_left.fbx
anim_hit_right.fbx
anim_ko.fbx
```

총 12개 (캐릭터 1 + 애니메이션 11).

---

## 4. 변환 실행

11개 파일이 모두 모이면 다음 명령 실행:

```powershell
cd D:\AI\04_게임\복싱트레이너\_mixamo
& "D:\AI\06_도구\Blender\blender-4.5.9-windows-x64\blender.exe" -b -P fbx_to_glb.py
```

성공 시 `D:\AI\04_게임\복싱트레이너\assets\boxer.glb` 파일이 생성됩니다.

---

## 5. 라이선스 확인

Mixamo 콘텐츠는 Adobe ID 보유자에게 **로열티 프리** (상업적 사용 가능, 재배포 불가).
- 게임 내 사용: OK
- GitHub에 boxer.glb 커밋: OK (변환 결과물)
- 원본 .fbx 재배포: 금지 → `.gitignore`에 `_mixamo/fbx/` 추가됨

참고: https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html
