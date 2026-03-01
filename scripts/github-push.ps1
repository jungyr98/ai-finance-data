# GitHub upload script for ai-finance-data
# Run from project root: .\scripts\github-push.ps1

$ErrorActionPreference = "Stop"
$repoName = "ai-finance-data"

# Find gh.exe
$ghPath = $null
if (Get-Command gh -ErrorAction SilentlyContinue) { $ghPath = "gh" }
else {
    $paths = @(
        "$env:ProgramFiles\GitHub CLI\gh.exe",
        "${env:ProgramFiles(x86)}\GitHub CLI\gh.exe"
    )
    foreach ($p in $paths) {
        if (Test-Path $p) { $ghPath = $p; break }
    }
}

if ($ghPath) {
    Write-Host "Using GitHub CLI: $ghPath"
    & $ghPath repo create $repoName --public --source=. --remote=origin --push
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Done! Repository: https://github.com/$((& $ghPath api user -q .login))/ai-finance-data"
        exit 0
    }
}

Write-Host "GitHub CLI not found or failed. Using manual git push."
Write-Host ""
Write-Host "1. Create a new repository on GitHub: https://github.com/new"
Write-Host "   Name: ai-finance-data"
Write-Host "   Public, no README/license"
Write-Host ""
$username = Read-Host "2. Enter your GitHub username"
if (-not $username) { Write-Host "Username required."; exit 1 }
$remote = "https://github.com/$username/$repoName.git"
git remote add origin $remote 2>$null
git push -u origin main
Write-Host "Done! Repository: https://github.com/$username/$repoName"
