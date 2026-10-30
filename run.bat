@echo off
title AG-media CRM System
color 0B
echo ==============================================================
echo        نظام إدارة العملاء والإنتاج والمحاسبة - AG-media
echo ==============================================================
echo.
echo جاري تشغيل الخادم وفتح النظام في المتصفح...
echo.

start "" "http://localhost:5000"
node server/index.js

pause
