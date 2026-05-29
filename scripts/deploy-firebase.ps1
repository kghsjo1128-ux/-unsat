# Firebase 배포 (호스팅 + Firestore 규칙 + Storage 규칙 + Functions)
#
# 사용:
#   powershell -ExecutionPolicy Bypass -File .\scripts\deploy-firebase.ps1
#   powershell -ExecutionPolicy Bypass -File .\scripts\deploy-firebase.ps1 -HostingOnly
#   powershell -ExecutionPolicy Bypass -File .\scripts\deploy-firebase.ps1 -SkipFunctions

[CmdletBinding()]
param(
    [switch]$HostingOnly,
    [switch]$SkipFunctions,
    [switch]$Reauth
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $ProjectRoot

try {
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    $OutputEncoding = [System.Text.Encoding]::UTF8
} catch { }

$projectId = "transport-community-c5fc1"

# firebase.ps1는 stderr를 PowerShell 오류로 처리함 → .cmd 사용
$firebaseCmd = Join-Path $env:APPDATA "npm\firebase.cmd"
if (-not (Test-Path -LiteralPath $firebaseCmd)) {
    $firebaseCmd = "firebase.cmd"
}

function Invoke-Firebase {
    param([Parameter(Mandatory = $true)][string[]]$FirebaseArgs)

    & $firebaseCmd @FirebaseArgs
    if ($LASTEXITCODE -ne 0) {
        throw "firebase $($FirebaseArgs -join ' ') failed (exit $LASTEXITCODE)"
    }
}

Write-Host "Project: $projectId"
Write-Host "Path: $ProjectRoot"

if ($Reauth) {
    Write-Host "Complete Google login in the browser..."
    Invoke-Firebase @("login", "--reauth")
}

if ($HostingOnly) {
    Write-Host "Deploy: hosting only"
    Invoke-Firebase @("deploy", "--only", "hosting", "--project", $projectId)
} elseif ($SkipFunctions) {
    Write-Host "Deploy: hosting, firestore, storage (no functions)"
    Invoke-Firebase @("deploy", "--only", "hosting,firestore,storage", "--project", $projectId)
} else {
    Write-Host "Deploy: hosting, firestore, storage, functions"
    Invoke-Firebase @("deploy", "--project", $projectId)
}

Write-Host ""
Write-Host "Done: https://transport-community-c5fc1.web.app" -ForegroundColor Green
