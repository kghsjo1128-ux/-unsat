# Git에 커밋·푸시한 뒤 Firebase에 재배포합니다 (한 번에 실행).
#
# 사용 예:
#   powershell -ExecutionPolicy Bypass -File .\scripts\sync-and-deploy.ps1
#   powershell -ExecutionPolicy Bypass -File .\scripts\sync-and-deploy.ps1 -Message "fix: 로그인 버튼"
#
# 옵션:
#   -GitOnly      Firebase 배포 없이 Git만 (커밋·푸시)
#   -DeployOnly   Git 없이 firebase deploy 만 (이미 커밋된 경우)
#   -HostingOnly  호스팅만 배포 (규칙·스토리지 제외)

[CmdletBinding()]
param(
    [string]$Message = "",
    [switch]$GitOnly,
    [switch]$DeployOnly,
    [switch]$HostingOnly
)

$ErrorActionPreference = "Stop"
$git = "C:\Program Files\Git\bin\git.exe"
if (-not (Test-Path $git)) { $git = "git" }

$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $ProjectRoot

if (-not (Test-Path ".git")) {
    Write-Error "이 폴더에 .git 이 없습니다: $ProjectRoot"
}

if (-not $DeployOnly) {
    & $git add -A
    $st = & $git status --porcelain
    if ($st) {
        if (-not $Message) {
            $Message = "chore: sync $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        }
        & $git commit -m $Message
        Write-Host "Committed: $Message"
    } else {
        Write-Host "커밋할 변경이 없습니다. 원격과 동기화만 시도합니다."
    }

    $branch = (& $git rev-parse --abbrev-ref HEAD).Trim()
    Write-Host "Pushing branch: $branch"
    & $git push -u origin $branch
}

if (-not $GitOnly) {
    if ($HostingOnly) {
        Write-Host "Running: firebase deploy --only hosting"
        firebase deploy --only hosting
    } else {
        Write-Host "Running: firebase deploy"
        firebase deploy
    }
    if (-not $?) {
        Write-Error "Firebase 배포에 실패했습니다. `firebase login --reauth` 후 다시 시도하세요."
        exit 1
    }
}

Write-Host "Done."
