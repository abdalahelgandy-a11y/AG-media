@echo off
chcp 65001 >nul
echo [1/3] Setting Java and Android SDK environment...
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "ANDROID_HOME=C:\Users\A\AppData\Local\Android\Sdk"
set "PATH=C:\Program Files\Android\Android Studio\jbr\bin;%PATH%"

echo Java Version:
java -version

echo.
echo [2/3] Building Native Android APK with Gradle...
cd /d "D:\AG-media system\android"
call gradlew.bat assembleDebug --stacktrace

echo.
echo [3/3] Done!
