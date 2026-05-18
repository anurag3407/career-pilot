Write-Host "Starting staging deployment..." -ForegroundColor Cyan

if (-Not (Test-Path "deploy/staging.env.example")) {
  Write-Error "Missing deploy/staging.env.example"
  exit 1
}

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install

Write-Host "Skipping backend lint because no backend ESLint configuration exists." -ForegroundColor Yellow

Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ../frontend
npm install

Write-Host "Building frontend for staging..." -ForegroundColor Yellow
npm run build

Set-Location ..

Write-Host "Staging deployment preparation completed successfully." -ForegroundColor Green
Write-Host "Configure real staging secrets before deploying to a live staging server." -ForegroundColor Green