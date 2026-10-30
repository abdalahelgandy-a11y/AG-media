@echo off
chcp 65001 >nul
title تثبيت Android Studio
color 0B
echo ==============================================================
echo        تثبيت بيئة التطوير الرسمية للأندرويد (Android Studio)
echo ==============================================================
echo.
if exist "android-studio-installer.exe" (
    echo [✓] تم العثور على ملف التثبيت: android-studio-installer.exe
    echo جاري فتح برنامج التثبيت الآن...
    start "" "android-studio-installer.exe"
) else (
    echo [!] ملف التثبيت ما زال قيد التحميل في الخلفية...
    echo يرجى الانتظار بضع دقائق حتى يكتمل التحميل ثم تشغيل هذا الملف مجدداً.
)
echo.
pause
