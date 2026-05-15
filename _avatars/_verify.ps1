param([string]$BasePath)
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$base = $BasePath
if (-not $base) { $base = (Get-Location).Path }

# Verify GLB structure
function Parse-GLB {
    param([string]$path)
    try {
        $bytes = [System.IO.File]::ReadAllBytes($path)
        if ($bytes.Length -lt 12) { return @{ ok=$false; err='too small' } }
        $magic = [System.Text.Encoding]::ASCII.GetString($bytes[0..3])
        if ($magic -ne 'glTF') { return @{ ok=$false; err='bad magic' } }
        $version = [BitConverter]::ToUInt32($bytes, 4)
        $totalLen = [BitConverter]::ToUInt32($bytes, 8)
        $jsonLen = [BitConverter]::ToUInt32($bytes, 12)
        $jsonType = [System.Text.Encoding]::ASCII.GetString($bytes[16..19])
        if ($jsonType -ne 'JSON') { return @{ ok=$false; err='no JSON chunk' } }
        $jsonStr = [System.Text.Encoding]::UTF8.GetString($bytes[20..(20+$jsonLen-1)])
        $json = $jsonStr | ConvertFrom-Json
        $nodeCount = 0
        $meshCount = 0
        $animCount = 0
        $skinCount = 0
        $matCount = 0
        $jointCount = 0
        $animNames = ''
        if ($json.nodes) { $nodeCount = $json.nodes.Count }
        if ($json.meshes) { $meshCount = $json.meshes.Count }
        if ($json.animations) {
            $animCount = $json.animations.Count
            $names = @()
            foreach ($an in $json.animations) { $names += $an.name }
            $animNames = $names -join ', '
        }
        if ($json.skins) {
            $skinCount = $json.skins.Count
            if ($json.skins[0].joints) { $jointCount = $json.skins[0].joints.Count }
        }
        if ($json.materials) { $matCount = $json.materials.Count }
        return @{
            ok = $true
            version = $version
            totalLenMB = [math]::Round($totalLen/1MB,3)
            nodes = $nodeCount
            meshes = $meshCount
            animations = $animCount
            skins = $skinCount
            materials = $matCount
            joints = $jointCount
            asset_gen = $json.asset.generator
            anim_names = $animNames
        }
    } catch {
        return @{ ok=$false; err=$_.Exception.Message }
    }
}

$avatars = Get-ChildItem $base -Filter '*.glb'
$verified = @()
foreach ($a in $avatars) {
    $info = Parse-GLB $a.FullName
    Write-Host "----"
    Write-Host "FILE: $($a.Name)"
    if ($info.ok) {
        Write-Host ("  glTF v{0} | {1} MB | nodes={2} meshes={3} skins={4} joints={5} anims={6} mats={7}" -f `
            $info.version, $info.totalLenMB, $info.nodes, $info.meshes, $info.skins, $info.joints, $info.animations, $info.materials)
        Write-Host "  generator: $($info.asset_gen)"
        if ($info.anim_names) { Write-Host "  anims: $($info.anim_names)" }
    } else {
        Write-Host "  FAIL: $($info.err)"
    }
    $verified += [PSCustomObject]@{
        Name = $a.Name
        Status = if ($info.ok) { 'OK' } else { 'FAIL' }
        Version = $info.version
        Nodes = $info.nodes
        Meshes = $info.meshes
        Skins = $info.skins
        Joints = $info.joints
        Animations = $info.animations
        Materials = $info.materials
        Generator = $info.asset_gen
        AnimNames = $info.anim_names
    }
}
$out = Join-Path $base '_verify_results.json'
$verified | ConvertTo-Json -Depth 3 | Out-File -FilePath $out -Encoding utf8
Write-Host ""
Write-Host "Saved: $out"
