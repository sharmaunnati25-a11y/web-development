# One-click GitHub Push Script for Unnati Sharma
$env:Path = "$env:LOCALAPPDATA\MinGit\cmd;$env:Path"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Pushing Web Development Experiments     " -ForegroundColor Cyan
Write-Host "  Repository: sharmaunnati25-a11y/web-development" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Push main branch
git push -u origin main

# Push all feature branches
git push --all origin

Write-Host ""
Write-Host "Done! Your repository is updated at:" -ForegroundColor Green
Write-Host "https://github.com/sharmaunnati25-a11y/web-development" -ForegroundColor Green
Write-Host ""
Write-Host "Next step: Enable GitHub Pages in Repository Settings > Pages > deploy from 'main' branch / (root)." -ForegroundColor Yellow
