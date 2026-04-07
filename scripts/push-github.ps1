# GitHub에 main 브랜치 푸시 (저장소는 웹에서 먼저 만들어 두세요)
# 사용법:
#   1) https://github.com/new → Repository name: 운사트 → Create (README 추가 안 함)
#   2) 저장소 페이지 초록 Code 버튼 → HTTPS 주소 복사
#   3) 아래에서 $RepoUrl 을 그 주소로 바꾸고 실행:
#        powershell -ExecutionPolicy Bypass -File .\scripts\push-github.ps1

$ErrorActionPreference = "Stop"
$git = "C:\Program Files\Git\bin\git.exe"
if (-not (Test-Path $git)) { $git = "git" }

# ★ 아래를 GitHub 저장소 페이지 → Code → HTTPS 에서 복사한 주소로 바꾸세요.
#    (한글 이름은 손으로 치지 말고 복사 권장)
$RepoUrl = "https://github.com/kghsjo1128-ux/%EC%9A%B4%EC%82%AC%ED%8A%B8.git"

$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $ProjectRoot
if (-not (Test-Path ".git")) {
  Write-Host "오류: .git 이 없습니다. 경로: $ProjectRoot"
  exit 1
}

& $git add -A
$st = & $git status --porcelain
if ($st) { & $git commit -m "chore: sync before push" }

$null = & $git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    & $git remote set-url origin $RepoUrl
} else {
    & $git remote add origin $RepoUrl
}
& $git branch -M main
Write-Host "Pushing to: $RepoUrl"
& $git push -u origin main
Write-Host "Done."
