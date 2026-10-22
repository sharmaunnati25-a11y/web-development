@echo off
set "PATH=%LOCALAPPDATA%\MinGit\cmd;%PATH%"

echo ==========================================
echo   Pushing Web Development Experiments
echo   Repository: sharmaunnati25-a11y/web-development
echo ==========================================

git push -u origin main
git push --all origin

echo.
echo ==========================================
echo Successfully pushed to https://github.com/sharmaunnati25-a11y/web-development
echo ==========================================
pause
