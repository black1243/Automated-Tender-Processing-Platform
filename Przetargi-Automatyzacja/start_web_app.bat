@echo off
cd /d %~dp0
start cmd /k python api.py
start cmd /k streamlit run web_app.py
pause 