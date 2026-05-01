// ============================================================
// rpm_loader.js — Ready Player Me GLB 로더
// Three.js r128 호환 + IndexedDB 캐싱
// 사용: const gltf = await new RPMLoader().load(url);
// ============================================================
(function (root) {
  'use strict';

  const DB_NAME = 'rpm_cache';
  const DB_VER = 1;
  const STORE = 'avatars';

  // ---- IndexedDB 헬퍼 ----
  function openDB() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) return reject(new Error('IndexedDB 미지원'));
      const req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'url' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function cacheGet(url) {
    try {
      const db = await openDB();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readonly');
        const req = tx.objectStore(STORE).get(url);
        req.onsuccess = () => resolve(req.result ? req.result.buffer : null);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('[RPM] cache get fail:', e.message);
      return null;
    }
  }

  async function cachePut(url, buffer) {
    try {
      const db = await openDB();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put({ url, buffer, ts: Date.now() });
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('[RPM] cache put fail:', e.message);
      return false;
    }
  }

  async function cacheClear() {
    try {
      const db = await openDB();
      return await new Promise((resolve) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).clear();
        tx.oncomplete = () => resolve(true);
      });
    } catch (e) { return false; }
  }

  // ---- URL 정규화 (LOD/morph target 옵션 추가) ----
  // 예: https://models.readyplayer.me/<id>.glb
  // ?morphTargets=ARKit,Oculus%20Visemes — 표정/립싱크
  // ?textureAtlas=1024 — 메모리 절감
  // ?meshLod=1 — 모바일 LOD
  function normalizeUrl(url, opts = {}) {
    if (!url || !url.includes('readyplayer.me')) return url;
    const u = new URL(url);
    // 권투 게임 — 표정 불필요, 메모리 우선
    if (opts.atlas !== false) u.searchParams.set('textureAtlas', String(opts.atlas || 1024));
    if (opts.lod) u.searchParams.set('meshLod', String(opts.lod));
    if (opts.pose) u.searchParams.set('pose', opts.pose); // 'A' or 'T'
    return u.toString();
  }

  // ---- 메인 로더 ----
  class RPMLoader {
    constructor(opts = {}) {
      this.opts = Object.assign({
        atlas: 1024,        // 텍스처 아틀라스 해상도 (모바일 권장 512)
        lod: 0,             // 0=풀 메시, 1=중간, 2=저폴리
        pose: 'A',          // RPM 기본은 A-Pose
        useCache: true
      }, opts);
      if (typeof THREE === 'undefined' || !THREE.GLTFLoader) {
        throw new Error('[RPM] THREE.GLTFLoader 필요 (r128)');
      }
      this.gltfLoader = new THREE.GLTFLoader();
    }

    async load(url) {
      const finalUrl = normalizeUrl(url, this.opts);
      let buffer = this.opts.useCache ? await cacheGet(finalUrl) : null;

      if (!buffer) {
        const res = await fetch(finalUrl, { mode: 'cors' });
        if (!res.ok) throw new Error(`[RPM] HTTP ${res.status} — ${finalUrl}`);
        buffer = await res.arrayBuffer();
        if (this.opts.useCache) cachePut(finalUrl, buffer); // fire-and-forget
      }

      return await new Promise((resolve, reject) => {
        // GLTFLoader.parse는 ArrayBuffer를 직접 받음
        this.gltfLoader.parse(buffer, '', (gltf) => {
          // 본 메타데이터 추가
          gltf.userData.rpm = analyzeAvatar(gltf.scene);
          gltf.userData.sourceUrl = finalUrl;
          resolve(gltf);
        }, reject);
      });
    }

    static clearCache() { return cacheClear(); }
  }

  // ---- 본 분석 (Mixamo 호환성 검사) ----
  function analyzeAvatar(scene) {
    const bones = {};
    let boneCount = 0;
    scene.traverse(o => {
      if (o.isBone) {
        bones[o.name] = o;
        boneCount++;
      }
    });
    return {
      boneCount,
      bones,
      hasHips: !!(bones['Hips'] || bones['mixamorig:Hips']),
      hasMixamoPrefix: Object.keys(bones).some(n => n.startsWith('mixamorig')),
      isHalfBody: !bones['LeftFoot'] && !bones['mixamorig:LeftFoot'],
    };
  }

  // ---- Mixamo 애니메이션 retarget 헬퍼 ----
  // RPM 본 이름: "Hips", "Spine", "LeftArm", "LeftUpLeg" 등 (prefix 없음)
  // Mixamo 본 이름: "mixamorig:Hips", "mixamorig:Spine" 등
  // → 클립을 RPM에 적용하려면 트랙 이름에서 prefix 제거
  function retargetMixamoClip(clip) {
    clip.tracks.forEach(track => {
      if (track.name.startsWith('mixamorig:')) {
        track.name = track.name.replace(/^mixamorig:/, '');
      }
      // 잘못 export된 경우 .bones[] 형식도 처리
      track.name = track.name.replace(/\.bones\[mixamorig:/, '.bones[');
    });
    return clip;
  }

  // ---- export ----
  root.RPMLoader = RPMLoader;
  root.RPMLoader.normalizeUrl = normalizeUrl;
  root.RPMLoader.retargetMixamoClip = retargetMixamoClip;
  root.RPMLoader.clearCache = cacheClear;

})(typeof window !== 'undefined' ? window : globalThis);
