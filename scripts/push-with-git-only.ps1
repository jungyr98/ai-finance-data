# GitHub push without gh CLI - use only git
# Run from project root: .\scripts\push-with-git-only.ps1

$repoName = "ai-finance-data"
Write-Host "=== GitHub upload (git only) ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open: https://github.com/new" -ForegroundColor Yellow
Write-Host "2. Repository name: $repoName" -ForegroundColor Yellow
Write-Host "3. Public, do NOT add README or .gitignore" -ForegroundColor Yellow
Write-Host "4. Click Create repository" -ForegroundColor Yellow
Write-Host ""

$username = Read-Host "Enter your GitHub username"
if (-not $username) {
    Write-Host "Username required. Exit." -ForegroundColor Red
    exit 1
}

$url = "https://github.com/$username/$repoName.git"
Write-Host "Remote: $url" -ForegroundColor Gray

# Remove origin if already exists (e.g. from failed gh attempt)
git remote remove origin 2>$null

git remote add origin $url
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to add remote." -ForegroundColor Red
    exit 1
}

git push -u origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Done! Repository: https://github.com/$username/$repoName" -ForegroundColor Green
} else {
    Write-Host "Push failed. Check username and repo name." -ForegroundColor Red
}
