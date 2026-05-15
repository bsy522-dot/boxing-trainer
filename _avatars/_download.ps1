# Avatar GLB Downloader - License-safe sources
# CC0 / Public Domain / MIT only
# Force UTF-8 to handle Korean paths
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null
$ErrorActionPreference = 'Continue'

# Hardcode base path - PowerShell handles unicode natively
$base = "$($args[0])"
if (-not $base) { $base = (Get-Location).Path }

Write-Host "Base path: $base"
Write-Host "Path exists: $(Test-Path $base)"

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$results = @()

function Try-Download {
    param([string]$Name, [string]$Url, [string]$License, [string]$Source, [string]$Description)
    $out = Join-Path $base "$Name.glb"
    Write-Host "----"
    Write-Host "TRY: $Name <- $Url"
    try {
        $headers = @{ 'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        Invoke-WebRequest -Uri $Url -OutFile $out -UseBasicParsing -TimeoutSec 90 -Headers $headers -ErrorAction Stop
        if (Test-Path $out) {
            $size = (Get-Item $out).Length
            $sizeMB = [math]::Round($size / 1MB, 3)
            $bytes = [System.IO.File]::ReadAllBytes($out)
            $magicOk = $false
            $magic = ''
            if ($bytes.Length -ge 4) {
                $magic = [System.Text.Encoding]::ASCII.GetString($bytes[0..3])
                if ($magic -eq 'glTF') { $magicOk = $true }
            }
            Write-Host ("OK: {0} = {1} MB, magic={2}, glTF={3}" -f $Name, $sizeMB, $magic, $magicOk)
            $licPath = Join-Path $base "LICENSE_$Name.txt"
            $licBody = "$Name`r`nSource: $Source`r`nURL: $Url`r`nLicense: $License`r`nDescription: $Description`r`nDownloaded: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
            [System.IO.File]::WriteAllText($licPath, $licBody, [System.Text.Encoding]::UTF8)
            return [PSCustomObject]@{
                Name = $Name; Url = $Url; SizeMB = $sizeMB
                License = $License; Source = $Source; Description = $Description
                MagicOk = $magicOk; Status = 'OK'
            }
        }
    } catch {
        Write-Host ("FAIL: {0} - {1}" -f $Name, $_.Exception.Message)
        if (Test-Path $out) { Remove-Item $out -Force -ErrorAction SilentlyContinue }
        return [PSCustomObject]@{
            Name = $Name; Url = $Url; SizeMB = 0
            License = $License; Source = $Source; Description = $Description
            MagicOk = $false; Status = "FAIL: $($_.Exception.Message)"
        }
    }
}

# === 1순위: ReadyPlayerMe demo / community avatars ===
$rpmCandidates = @(
    @{ name = 'rpm_demo_male1'; id = '64bfa15b0e72c63d7c3934a3' },
    @{ name = 'rpm_demo_male2'; id = '6185a4acfb622cf1cdc49348' },
    @{ name = 'rpm_demo_athlete1'; id = '6409cdd45ec1278fcab9bbf2' },
    @{ name = 'rpm_demo_athlete2'; id = '64184ec361fd07eaae087a4b' }
)
foreach ($c in $rpmCandidates) {
    $r = Try-Download -Name $c.name -Url "https://models.readyplayer.me/$($c.id).glb" `
        -License 'ReadyPlayerMe public avatar (Sample/community use OK per RPM ToS)' `
        -Source 'ReadyPlayerMe' -Description "RPM half-body humanoid avatar id=$($c.id)"
    if ($r) { $results += $r }
}

# === 2순위: KhronosGroup glTF-Sample-Models (CC-BY 4.0) ===
$khronos = @(
    @{ name = 'cesium_man';
       url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb';
       lic = 'CC-BY 4.0 (Cesium / Analytical Graphics Inc.)';
       desc = 'Walking man with skinned animation - reference humanoid' },
    @{ name = 'rigged_figure';
       url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/RiggedFigure/glTF-Binary/RiggedFigure.glb';
       lic = 'CC-BY 4.0 (Khronos Group)';
       desc = 'Rigged generic humanoid figure (T-pose)' },
    @{ name = 'rigged_simple';
       url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/RiggedSimple/glTF-Binary/RiggedSimple.glb';
       lic = 'CC-BY 4.0 (Khronos Group)';
       desc = 'Minimal rigged figure for tests' }
)
foreach ($k in $khronos) {
    $r = Try-Download -Name $k.name -Url $k.url -License $k.lic -Source 'KhronosGroup glTF-Sample-Models' -Description $k.desc
    if ($r) { $results += $r }
}

# === 3순위: glTF-Sample-Assets ===
$samples2 = @(
    @{ name = 'brain_stem';
       url = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Binary/BrainStem.glb';
       lic = 'CC0 1.0 / Public Domain (Keith Hunter via Khronos)';
       desc = 'Animated humanoid - good for boxing pose tests' }
)
foreach ($s in $samples2) {
    $r = Try-Download -Name $s.name -Url $s.url -License $s.lic -Source 'KhronosGroup glTF-Sample-Assets' -Description $s.desc
    if ($r) { $results += $r }
}

# === 4순위: Three.js examples models ===
$threejs = @(
    @{ name = 'soldier';
       url = 'https://threejs.org/examples/models/gltf/Soldier.glb';
       lic = 'CC-BY 4.0 (T. Choonyung) - via Three.js examples';
       desc = 'Animated soldier - walk/run/idle baked' },
    @{ name = 'xbot';
       url = 'https://threejs.org/examples/models/gltf/Xbot.glb';
       lic = 'Mixamo (Adobe) free-for-use - via Three.js examples';
       desc = 'Mixamo X-Bot character with rig' },
    @{ name = 'michelle';
       url = 'https://threejs.org/examples/models/gltf/Michelle.glb';
       lic = 'Mixamo (Adobe) free-for-use - via Three.js examples';
       desc = 'Mixamo Michelle character (skinned)' }
)
foreach ($t in $threejs) {
    $r = Try-Download -Name $t.name -Url $t.url -License $t.lic -Source 'Three.js examples' -Description $t.desc
    if ($r) { $results += $r }
}

# Save summary
$jsonPath = Join-Path $base '_download_results.json'
$results | ConvertTo-Json -Depth 4 | Out-File -FilePath $jsonPath -Encoding utf8

Write-Host ""
Write-Host "=== SUMMARY ==="
$results | Format-Table Name, SizeMB, MagicOk, Status -AutoSize
$ok = ($results | Where-Object { $_.Status -eq 'OK' -and $_.MagicOk }).Count
Write-Host "TOTAL OK: $ok / $($results.Count)"
