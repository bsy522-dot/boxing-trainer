// ============================================================
// Demo Avatar Loader — License-safe humanoid GLBs
// boxing-trainer-v5 통합용
// 회원가입/API 없이 즉시 게임 내 미리보기 가능한 데모 아바타
// ============================================================
//
// 사용 전제:
//  - THREE (r128) + THREE.GLTFLoader 가 이미 로드된 상태
//  - boxing-trainer-v5.html 의 scene, rpmPreviewModel 변수가 전역에 존재
//
// 통합 방법:
//  1) 이 파일을 boxing-trainer-v5.html 같은 폴더에 두고 <script> 로 include
//     <script src="_avatars/demo_avatar_loader.js"></script>
//  2) 메인 메뉴에 아래 버튼 추가:
//     <button class="menu-btn" onclick="window.DemoAvatars.cycle()">
//       <span class="icon">🤖</span> 데모 아바타 시연
//       <span class="sub">CC/MIT 라이선스 인간형 7종 순환</span>
//     </button>
//  3) 또는 개별 호출: window.DemoAvatars.load('soldier')
//
// 라이선스: 각 _avatars/LICENSE_<name>.txt 참조
// ============================================================

(function (global) {
  'use strict';

  // 다운로드된 아바타 메타데이터 (DOWNLOAD_REPORT.md 와 동기화)
  const CATALOG = [
    {
      id: 'soldier',
      file: '_avatars/soldier.glb',
      label: '솔저 (Soldier)',
      sizeMB: 2.06,
      license: 'CC-BY 4.0',
      source: 'Three.js examples',
      anims: ['Idle', 'Run', 'TPose', 'Walk'],
      joints: 49,
      humanoid: true,
      boxingFit: 5,   // 5 = 권투에 매우 적합 (스탠스 포즈 가능)
      defaultAnim: 'Idle',
      scale: 2.0,
      yOffset: 0,
    },
    {
      id: 'xbot',
      file: '_avatars/xbot.glb',
      label: 'X-Bot (Mixamo)',
      sizeMB: 2.79,
      license: 'Mixamo (Adobe) free-for-use',
      source: 'Three.js examples',
      anims: ['agree', 'headShake', 'idle', 'run', 'sad_pose', 'sneak_pose', 'walk'],
      joints: 67,
      humanoid: true,
      boxingFit: 5,   // Mixamo 표준 본 — 권투 애니 리타기팅 최적
      defaultAnim: 'idle',
      scale: 1.8,
      yOffset: 0,
    },
    {
      id: 'michelle',
      file: '_avatars/michelle.glb',
      label: '미셸 (Michelle)',
      sizeMB: 3.13,
      license: 'Mixamo (Adobe) free-for-use',
      source: 'Three.js examples',
      anims: ['SambaDance', 'TPose'],
      joints: 65,
      humanoid: true,
      boxingFit: 4,   // 여성 캐릭터 (대전 상대용)
      defaultAnim: 'TPose',
      scale: 1.8,
      yOffset: 0,
    },
    {
      id: 'cesium_man',
      file: '_avatars/cesium_man.glb',
      label: 'Cesium Man',
      sizeMB: 0.47,
      license: 'CC-BY 4.0',
      source: 'KhronosGroup glTF-Sample-Models',
      anims: ['animation_0'],
      joints: 19,
      humanoid: true,
      boxingFit: 3,   // 저폴리 — 빠른 로드 데모용
      defaultAnim: null,
      scale: 1.7,
      yOffset: 0,
    },
    {
      id: 'brain_stem',
      file: '_avatars/brain_stem.glb',
      label: 'BrainStem',
      sizeMB: 3.05,
      license: 'CC0 1.0 / Public Domain',
      source: 'KhronosGroup glTF-Sample-Assets',
      anims: ['animation_0'],
      joints: 18,
      humanoid: true,
      boxingFit: 3,   // 표준 humanoid - 양호하나 비주얼 단순
      defaultAnim: null,
      scale: 0.9,
      yOffset: 0,
    },
    {
      id: 'rigged_figure',
      file: '_avatars/rigged_figure.glb',
      label: 'Rigged Figure',
      sizeMB: 0.05,
      license: 'CC-BY 4.0',
      source: 'KhronosGroup glTF-Sample-Models',
      anims: ['animation_0'],
      joints: 19,
      humanoid: true,
      boxingFit: 2,   // 매우 단순 — 디버그용
      defaultAnim: null,
      scale: 1.7,
      yOffset: 0,
    },
    {
      id: 'rigged_simple',
      file: '_avatars/rigged_simple.glb',
      label: 'Rigged Simple',
      sizeMB: 0.01,
      license: 'CC-BY 4.0',
      source: 'KhronosGroup glTF-Sample-Models',
      anims: ['animation_0'],
      joints: 2,
      humanoid: false, // 인간형 아니지만 골격 테스트용
      boxingFit: 1,
      defaultAnim: null,
      scale: 1.5,
      yOffset: 0,
    },
  ];

  let currentModel = null;
  let currentMixer = null;
  let currentClock = null;
  let cycleIdx = 0;

  function listDemoAvatars() {
    return CATALOG.map(c => ({
      id: c.id,
      label: c.label,
      file: c.file,
      sizeMB: c.sizeMB,
      license: c.license,
      source: c.source,
      humanoid: c.humanoid,
      boxingFit: c.boxingFit,
      animations: c.anims,
    }));
  }

  function _findMeta(name) {
    return CATALOG.find(c => c.id === name) || null;
  }

  function _disposeCurrent() {
    if (!currentModel) return;
    try {
      if (typeof scene !== 'undefined' && scene && currentModel.parent === scene) {
        scene.remove(currentModel);
      } else if (currentModel.parent) {
        currentModel.parent.remove(currentModel);
      }
      currentModel.traverse(obj => {
        if (obj.isMesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach(m => { try { m.dispose(); } catch (e) {} });
          }
        }
      });
    } catch (e) { /* ignore */ }
    currentModel = null;
    currentMixer = null;
  }

  // 메인 로더: name 으로 GLB 로드 → scene 에 추가 → 미리보기 위치
  async function loadDemoAvatar(name, opts) {
    opts = opts || {};
    const meta = _findMeta(name);
    if (!meta) {
      console.warn('[DemoAvatars] unknown avatar:', name);
      return null;
    }
    if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
      console.warn('[DemoAvatars] THREE or GLTFLoader missing');
      return null;
    }
    if (typeof scene === 'undefined' || !scene) {
      console.warn('[DemoAvatars] scene global missing');
      return null;
    }

    _disposeCurrent();
    // 기존 RPM 프리뷰가 있으면 잠시 숨김
    if (typeof rpmPreviewModel !== 'undefined' && rpmPreviewModel) {
      rpmPreviewModel.visible = false;
    }

    try {
      const loader = new THREE.GLTFLoader();
      const gltf = await new Promise((resolve, reject) => {
        loader.load(meta.file, resolve, undefined, reject);
      });
      const model = gltf.scene;
      const scale = (opts.scale != null) ? opts.scale : meta.scale;
      const x = (opts.x != null) ? opts.x : -3.5;
      const y = (opts.y != null) ? opts.y : meta.yOffset;
      const z = (opts.z != null) ? opts.z : 1;
      const rotY = (opts.rotY != null) ? opts.rotY : 0.4;
      model.scale.setScalar(scale);
      model.position.set(x, y, z);
      model.rotation.y = rotY;
      model.userData.isDemoAvatar = true;
      model.userData.demoId = meta.id;
      model.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      scene.add(model);
      currentModel = model;

      // 애니메이션 재생
      if (gltf.animations && gltf.animations.length > 0) {
        currentMixer = new THREE.AnimationMixer(model);
        const animName = opts.anim || meta.defaultAnim;
        let clip = null;
        if (animName) {
          clip = THREE.AnimationClip.findByName(gltf.animations, animName);
        }
        if (!clip) clip = gltf.animations[0];
        const action = currentMixer.clipAction(clip);
        action.play();
        if (!currentClock) currentClock = new THREE.Clock();
      }

      console.log('[DemoAvatars] loaded:', meta.id, '|', meta.license);
      return { model: model, mixer: currentMixer, meta: meta };
    } catch (e) {
      console.warn('[DemoAvatars] load failed for', name, e);
      // RPM 다시 보이기
      if (typeof rpmPreviewModel !== 'undefined' && rpmPreviewModel) {
        rpmPreviewModel.visible = true;
      }
      return null;
    }
  }

  // 메인 메뉴에서 호출용 — 로드된 아바타를 순환
  async function cycleDemoAvatar() {
    const humanoids = CATALOG.filter(c => c.humanoid && c.boxingFit >= 3);
    if (humanoids.length === 0) return;
    const meta = humanoids[cycleIdx % humanoids.length];
    cycleIdx++;
    const r = await loadDemoAvatar(meta.id);
    if (r && typeof showToast === 'function') {
      showToast(`데모 아바타: ${meta.label}`);
    } else if (r) {
      console.log('데모 아바타 로드:', meta.label, `(${meta.sizeMB}MB, ${meta.license})`);
    }
    return r;
  }

  // 모든 데모 아바타 제거 → RPM 또는 기본 캐릭터로 복귀
  function clearDemoAvatar() {
    _disposeCurrent();
    if (typeof rpmPreviewModel !== 'undefined' && rpmPreviewModel) {
      rpmPreviewModel.visible = true;
    }
  }

  // 애니메이션 mixer 업데이트 — render loop 에서 호출
  function updateDemoAvatar(delta) {
    if (currentMixer) {
      const d = (delta != null) ? delta : (currentClock ? currentClock.getDelta() : 0.016);
      currentMixer.update(d);
    }
  }

  // 메뉴 UI 자동 주입 헬퍼 — showMain 후 호출
  function injectMenuButton(containerSelector) {
    const container = document.querySelector(containerSelector || '#mainMenu');
    if (!container) return false;
    if (container.querySelector('#demoAvatarBtn')) return true; // 이미 있음
    const btn = document.createElement('button');
    btn.className = 'menu-btn';
    btn.id = 'demoAvatarBtn';
    btn.style.borderColor = 'rgba(64,196,255,.3)';
    btn.onclick = function () { cycleDemoAvatar(); };
    btn.innerHTML = '<span class="icon">🤖</span> 데모 아바타 시연' +
      '<span class="sub">CC/MIT 인간형 7종 순환 (회원가입 X)</span>';
    // RPM 버튼 다음에 삽입
    const rpmBtn = container.querySelector('button[onclick*="openRPMCreator"]');
    if (rpmBtn && rpmBtn.nextSibling) {
      container.insertBefore(btn, rpmBtn.nextSibling);
    } else {
      container.appendChild(btn);
    }
    return true;
  }

  global.DemoAvatars = {
    list: listDemoAvatars,
    load: loadDemoAvatar,
    cycle: cycleDemoAvatar,
    clear: clearDemoAvatar,
    update: updateDemoAvatar,
    injectMenuButton: injectMenuButton,
    catalog: CATALOG,
  };

  // 자동 주입 시도 (DOM 준비된 후)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => injectMenuButton('#mainMenu'), 500);
    });
  } else {
    setTimeout(() => injectMenuButton('#mainMenu'), 500);
  }
})(typeof window !== 'undefined' ? window : globalThis);
