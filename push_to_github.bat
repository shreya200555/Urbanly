@echo off
cd /d d:\URBANLY
echo Checking git status...
git status
echo.
echo Adding all files...
git add -A
echo.
echo Committing changes...
git commit -m "Urbanly v1.0 - Full stack with Gemini AI integration"
echo.
echo Setting branch to main...
git branch -M main
echo.
echo Pushing to GitHub...
git push -u origin main
echo.
echo Done!
pause
