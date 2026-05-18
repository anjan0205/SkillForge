$ErrorActionPreference = "Stop"

Write-Host "=========================================="
Write-Host "     SkillForge LMS Combined Server       "
Write-Host "=========================================="

$RootDir = $PSScriptRoot
$FrontendDir = Join-Path $RootDir "frontend"
$BackendDir = Join-Path $RootDir "backend"
$StaticDir = Join-Path $BackendDir "src\main\resources\static"

Write-Host "`n[1/3] Building React Frontend..." -ForegroundColor Cyan
Set-Location $FrontendDir
# Install dependencies if not present
if (-not (Test-Path "node_modules")) {
    npm install
}
npm run build

Write-Host "`n[2/3] Copying frontend build to backend static folder..." -ForegroundColor Cyan
if (Test-Path $StaticDir) {
    Remove-Item -Recurse -Force "$StaticDir\*"
} else {
    New-Item -ItemType Directory -Force -Path $StaticDir | Out-Null
}
Copy-Item -Recurse -Force "$FrontendDir\dist\*" $StaticDir

Write-Host "`n[3/3] Starting Spring Boot Backend (Combined Port)..." -ForegroundColor Green
Set-Location $BackendDir
# Use the system Java Home if not set, or you can specify it
# $env:JAVA_HOME="C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot"
.\mvnw.cmd spring-boot:run
