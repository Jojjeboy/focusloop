# PowerShell script to run pre-commit checks
# This script ensures code quality before committing

Write-Host ""
Write-Host "🔍 Running Pre-Commit Checks..." -ForegroundColor Cyan
Write-Host ""

# 1. Format Check
Write-Host "📝 Checking code formatting..." -ForegroundColor Yellow
npm run format:check
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Formatting check failed!" -ForegroundColor Red
    Write-Host "Run 'npm run format' to auto-format your code" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Formatting check passed" -ForegroundColor Green
Write-Host ""

# 2. Lint
Write-Host "🔎 Running linter..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Linting failed!" -ForegroundColor Red
    Write-Host "Fix the linting errors above" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Linting passed" -ForegroundColor Green
Write-Host ""

# 3. Tests
Write-Host "🧪 Running tests..." -ForegroundColor Yellow
npm test
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Tests failed!" -ForegroundColor Red
    Write-Host "Fix the failing tests above" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Tests passed" -ForegroundColor Green
Write-Host ""

# 4. Build
Write-Host "🏗️  Building application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Write-Host "Fix the build errors above" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Success
Write-Host "✨ All pre-commit checks passed! ✨" -ForegroundColor Green
Write-Host "You can now commit your changes safely." -ForegroundColor Cyan
Write-Host ""
exit 0
