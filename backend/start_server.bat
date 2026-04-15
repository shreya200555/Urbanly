@echo off
cd /d d:\URBANLY\backend
python -m uvicorn main:app --port 8000 --host 127.0.0.1
pause
