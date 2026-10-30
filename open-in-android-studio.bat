@echo off
chcp 65001 >nul
title فتح مشروع AG-media في Android Studio
color 0A
echo ==============================================================
echo        فتح مشروع AG-media Native Android في Android Studio
echo ==============================================================
echo.

set STUDIO_EXE=""
if exist "C:\Program Files\Android\Android Studio\bin\studio64.exe" set STUDIO_EXE="C:\Program Files\Android\Android Studio\bin\studio64.exe"
if exist "%LOCALAPPDATA%\Programs\Android Studio\bin\studio64.exe" set STUDIO_EXE="%LOCALAPPDATA%\Programs\Android Studio\bin\studio64.exe"

if not %STUDIO_EXE%=="" (
    echo [✓] تم العثور على Android Studio!
    echo جاري فتح المشروع: D:\AG-media system\android ...
    start "" %STUDIO_EXE% "D:\AG-media system\android"
) else (
    echo [i] جاري المحاولة عبر أداة Capacitor...
    call npx cap open android
)

echo.
pause
