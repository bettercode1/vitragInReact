@echo off
echo ================================================
echo   STARTING VITRAG BACKEND SERVER
echo ================================================
echo.
cd /d "%~dp0"
echo Current directory: %CD%
echo.
echo Starting Flask on https://testinglab.vitragassollp.com...
echo.
python app.py
pause

