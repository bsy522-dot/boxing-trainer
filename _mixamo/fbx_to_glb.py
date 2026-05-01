# -*- coding: utf-8 -*-
"""
Mixamo FBX → 단일 boxer.glb 변환 (Blender 헤드리스).

사용:
    cd D:\\AI\\04_게임\\복싱트레이너\\_mixamo
    & "D:\\AI\\06_도구\\Blender\\blender-4.5.9-windows-x64\\blender.exe" -b -P fbx_to_glb.py

동작:
    1. character.fbx 로드 (Y Bot 또는 X Bot, T-pose, with skin)
    2. anim_*.fbx 11개 import → 각 액션을 NLA strip으로 캐릭터 armature에 부착
    3. Mixamo 본 prefix("mixamorig:") 제거 → three.js에서 다루기 편함
    4. Draco 압축 + 임베드 애니메이션 glb 단일 파일로 export
    5. 출력: D:\\AI\\04_게임\\복싱트레이너\\assets\\boxer.glb
"""

import os
import sys
import bpy
from pathlib import Path

# ==================== 경로 ====================
SCRIPT_DIR = Path(__file__).parent.resolve()
FBX_DIR = SCRIPT_DIR / "fbx"
PROJECT_ROOT = SCRIPT_DIR.parent
ASSETS_DIR = PROJECT_ROOT / "assets"
OUTPUT_GLB = ASSETS_DIR / "boxer.glb"

ASSETS_DIR.mkdir(exist_ok=True)

CHARACTER_FBX = FBX_DIR / "character.fbx"

# 애니메이션 파일명 → 액션 이름 (게임 코드에서 참조하는 키)
ANIM_FILES = {
    "anim_idle.fbx":       "Idle",
    "anim_jab.fbx":        "Jab",
    "anim_cross.fbx":      "Cross",
    "anim_hook_right.fbx": "HookRight",
    "anim_hook_left.fbx":  "HookLeft",
    "anim_uppercut.fbx":   "Uppercut",
    "anim_bob.fbx":        "Bob",
    "anim_slip.fbx":       "Slip",
    "anim_hit_left.fbx":   "HitLeft",
    "anim_hit_right.fbx":  "HitRight",
    "anim_ko.fbx":         "KO",
}


# ==================== 헬퍼 ====================
def log(msg):
    print(f"[MIXAMO→GLB] {msg}", flush=True)


def fatal(msg):
    log(f"FATAL: {msg}")
    sys.exit(1)


def clean_scene():
    """씬 완전 비움."""
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for c in (bpy.data.actions, bpy.data.armatures, bpy.data.meshes,
              bpy.data.materials, bpy.data.images, bpy.data.textures):
        for item in list(c):
            c.remove(item)


def find_armature():
    """현재 씬의 첫 armature 객체 반환."""
    for obj in bpy.context.scene.objects:
        if obj.type == "ARMATURE":
            return obj
    return None


def import_fbx(filepath, anim_only=False):
    """FBX 임포트. anim_only=True면 애니메이션만, False면 캐릭터+armature."""
    log(f"Importing {filepath.name} (anim_only={anim_only})")
    if not filepath.exists():
        fatal(f"파일이 없습니다: {filepath}")

    # Mixamo FBX는 보통 -Z forward, Y up. Blender 기본 +Y forward, Z up.
    # global_scale은 1.0 유지 (Mixamo는 cm 단위지만 Blender FBX importer가 자동 처리).
    bpy.ops.import_scene.fbx(
        filepath=str(filepath),
        ignore_leaf_bones=False,
        force_connect_children=False,
        automatic_bone_orientation=False,
    )


def rename_mixamo_bones(armature):
    """본 이름에서 'mixamorig:' prefix 제거 → three.js에서 깔끔하게."""
    if not armature or armature.type != "ARMATURE":
        return
    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.mode_set(mode="EDIT")
    for bone in armature.data.edit_bones:
        if bone.name.startswith("mixamorig:"):
            bone.name = bone.name.replace("mixamorig:", "")
    bpy.ops.object.mode_set(mode="OBJECT")


def rename_mixamo_action_fcurves(action):
    """액션 fcurve의 본 경로에서 'mixamorig:' 제거."""
    if action is None:
        return
    for fcurve in action.fcurves:
        if "mixamorig:" in fcurve.data_path:
            fcurve.data_path = fcurve.data_path.replace("mixamorig:", "")


# ==================== 메인 ====================
def main():
    log("=" * 60)
    log("Mixamo FBX → boxer.glb 변환 시작")
    log("=" * 60)

    # 입력 파일 사전 체크
    if not CHARACTER_FBX.exists():
        fatal(f"character.fbx가 없습니다: {CHARACTER_FBX}\n"
              f"DOWNLOAD_GUIDE.md를 보고 mixamo에서 받아주세요.")
    missing = [n for n in ANIM_FILES if not (FBX_DIR / n).exists()]
    if missing:
        log(f"WARNING: 다음 애니메이션 파일이 없습니다 (스킵): {missing}")

    # 1) 씬 초기화
    clean_scene()

    # 2) 캐릭터 import
    import_fbx(CHARACTER_FBX, anim_only=False)
    char_armature = find_armature()
    if not char_armature:
        fatal("캐릭터에서 armature를 찾지 못했습니다.")
    char_armature.name = "BoxerArmature"
    log(f"캐릭터 armature: {char_armature.name}, 본 수: {len(char_armature.data.bones)}")

    # 3) 본 이름 정리
    rename_mixamo_bones(char_armature)

    # 캐릭터 import 시 생긴 액션은 제거 (T-pose라 의미 없음)
    for action in list(bpy.data.actions):
        bpy.data.actions.remove(action)

    # 4) 각 애니메이션 import → 액션 추출 → 캐릭터 armature에 NLA strip으로 부착
    for fname, action_name in ANIM_FILES.items():
        anim_path = FBX_DIR / fname
        if not anim_path.exists():
            continue

        # 임포트 전 액션 목록 스냅샷
        actions_before = set(bpy.data.actions.keys())

        import_fbx(anim_path, anim_only=True)

        # 새로 추가된 액션 찾기
        new_actions = [a for n, a in bpy.data.actions.items() if n not in actions_before]
        if not new_actions:
            log(f"WARNING: {fname}에서 액션을 추출하지 못함")
            # 임포트된 새 armature 정리
            for obj in bpy.context.selected_objects:
                bpy.data.objects.remove(obj, do_unlink=True)
            continue

        # 첫 액션을 사용
        action = new_actions[0]
        action.name = action_name
        rename_mixamo_action_fcurves(action)
        log(f"  → 액션 '{action.name}' (frames: {int(action.frame_range[1] - action.frame_range[0] + 1)})")

        # 임포트로 들어온 armature/메시는 제거 (액션은 bpy.data.actions에 남음)
        for obj in list(bpy.context.selected_objects):
            if obj != char_armature:
                bpy.data.objects.remove(obj, do_unlink=True)

        # NLA track으로 부착
        if not char_armature.animation_data:
            char_armature.animation_data_create()
        track = char_armature.animation_data.nla_tracks.new()
        track.name = action_name
        track.strips.new(action_name, int(action.frame_range[0]), action)

    # 5) glTF export 직전: 활성 액션은 비워둠 (NLA track으로만 export)
    if char_armature.animation_data:
        char_armature.animation_data.action = None

    # 6) glb export (Draco 압축, 애니메이션 임베드)
    log(f"Exporting glb → {OUTPUT_GLB}")
    bpy.ops.export_scene.gltf(
        filepath=str(OUTPUT_GLB),
        export_format="GLB",
        export_animations=True,
        export_animation_mode="ACTIONS",  # 각 NLA track을 별도 클립으로
        export_nla_strips=True,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
        export_draco_position_quantization=14,
        export_draco_normal_quantization=10,
        export_draco_texcoord_quantization=12,
        export_apply=True,             # 모디파이어 적용
        export_skins=True,
        export_morph=False,
        export_yup=True,               # three.js 기본 Y-up
    )

    if OUTPUT_GLB.exists():
        size_mb = OUTPUT_GLB.stat().st_size / (1024 * 1024)
        log("=" * 60)
        log(f"DONE → {OUTPUT_GLB}")
        log(f"파일 크기: {size_mb:.2f} MB")
        log(f"임베드된 액션: {[a.name for a in bpy.data.actions]}")
        log("=" * 60)
    else:
        fatal("glb 파일이 생성되지 않음")


if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:
        import traceback
        log("EXCEPTION:")
        traceback.print_exc()
        sys.exit(1)
