@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

set "fileNames="
for /f "delims=" %%i in ('dir /b .\.jpg') do (
    set "fileName=%%~ni"
    set "fileNames=!fileNames!,"!fileName!""
)

set "fileNames=[%fileNames:~1%]"

echo export const imageURLs = %fileNames% > ".\.js\imgUrl.js"