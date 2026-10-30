Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "D:\AG-media system"
WshShell.Run "cmd /c node server/runLiveAuto.js", 0, False
