$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Web

# Try without license filter first to see API works
$url = "https://api.sketchfab.com/v3/search?type=models&downloadable=true&q=boxer&count=3"
Write-Host "URL: $url"
try {
    $r = Invoke-RestMethod -Uri $url -TimeoutSec 30 -UseBasicParsing -Headers @{ 'User-Agent' = 'Mozilla/5.0' }
    Write-Host "Total results: $($r.totalResults)"
    if ($r.results) {
        foreach ($item in $r.results) {
            Write-Host "----"
            Write-Host "UID: $($item.uid)"
            Write-Host "Name: $($item.name)"
            Write-Host "License: $($item.license.label) | slug=$($item.license.slug) | uid=$($item.license.uid)"
        }
    }
} catch {
    Write-Host "ERR: $($_.Exception.Message)"
    Write-Host $_.ErrorDetails.Message
}
