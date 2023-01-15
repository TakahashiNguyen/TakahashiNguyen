@echo off
:: BatchGotAdmin
:-------------------------------------
REM  --> Check for permissions
    IF "%PROCESSOR_ARCHITECTURE%" EQU "amd64" (
>nul 2>&1 "%SYSTEMROOT%\SysWOW64\cacls.exe" "%SYSTEMROOT%\SysWOW64\config\system"
) ELSE (
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
)

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params= %*
    echo UAC.ShellExecute "cmd.exe", "/c ""%~s0"" %params:"=""%", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"
:--------------------------------------    

del /a /s /q %windir%\temp & md %windir%\temp>nul
del /a /s /q %userprofile%\recent\*.*>nul
del /a /s /q "%userprofile%\Local Settings\Temporary Internet Files\*.*">nul
del /a /s /q "%userprofile%\Local Settings\Temp\*.*">nul
del /a /s /q "%userprofile%\recent\*.*">nul
del /a /s /q %systemdrive%\*.tmp>nul
del /a /s /q %systemdrive%\*._mp>nul
del /a /s /q %systemdrive%\*.log>nul
del /a /s /q %systemdrive%\*.gid>nul
del /a /s /q %systemdrive%\*.chk>nul
del /a /s /q %systemdrive%\*.old>nul
del /a /s /q %systemdrive%\recycled\*.*>nul
del /a /s /q %windir%\*.bak>nul
del /a /s /q %windir%\prefetch\*.*>nul
del /a /s /q %windir%\temp & md %windir%\temp>nul
del /a /s /q %userprofile%\recent\*.*>nul
del /a /s /q "%userprofile%\Local Settings\Temporary Internet Files\*.*">nul
del /a /s /q "%userprofile%\Local Settings\Temp\*.*">nul
del /a /s /q "%userprofile%\recent\*.*">nul
del /a /s /q %systemdrive%\*.tmp>nul
del /a /s /q %systemdrive%\*._mp>nul
del /a /s /q %systemdrive%\*.log>nul
del /a /s /q %systemdrive%\*.gid>nul
del /a /s /q %systemdrive%\*.chk>nul
del /a /s /q %systemdrive%\*.old>nul
del /a /s /q %systemdrive%\recycled\*.*>nul
del /a /s /q %windir%\*.bak>nul
del /a /s /q %windir%\prefetch\*.*>nul

del %temp%\*.tmp /f /s /q
del %windir%\prefetch\*.* /f /s /q
del %windir%\temp\*.* /f /s /q
rmdir /s /q %windir%\temp\
del c:\*.tmp /f /s /q
del d:\*.tmp /f /s /q
del c:\temp\*.tmp /f /s /q
del d:\temp\*.tmp /f /s /q
del c:\windows\prefetch\*.* /f /s /q
del d:\windows\prefetch\*.* /f /s /q
del c:\windows\temp\*.* /f /s /q
del d:\windows\temp\*.* /f /s /q
del c:\win98\temp\*.* /f /s /q
del d:\win98\temp\*.* /f /s /q
del c:\winnt\temp\*.* /f /s /q
del d:\winnt\temp\*.* /f /s /q
del c:\winme\temp\*.* /f /s /q
del d:\winme\temp\*.* /f /s /q
del C:\*temp* /f /s /q
rmdir /s /q c:\windows\temp\
rmdir /s /q d:\windows\temp\
del C:\"Documents and Settings"\%username%\Cookies\*.* /f /s /q
del D:\"Documents and Settings"\%username%\Cookies\*.* /f /s /q
del c:\"documents and settings"\%username%\Recent\*.* /f /s /q
del D:\"documents and settings"\%username%\Recent\*.* /f /s /q
del C:\"documents and settings"\%username%\"local settings"\temp\*.* /f /s /q
del D:\"documents and settings"\%username%\"local settings"\temp\*.* /f /s /q
rmdir /s /q c:\"documents and settings"\%username%\"local settings"\temp\
rmdir /s /q d:\"documents and settings"\%username%\"local settings"\temp\
del C:\"documents and settings"\%username%\"Local Settings"\"temporary internet files"\*.* /f /s /q
del d:\"documents and settings"\%username%\"local settings"\"temporary internet files"\*.* /f /s /q
del c:\"documents and settings"\%username%\"application data"\microsoft\office\recent\*.* /f /s /q
del d:\"documents and settings"\%username%\"application data"\microsoft\office\recent\*.* /f /s /q
rmdir /s /q C:\"documents and settings"\%username%\"local settings"\"temporary internet files"\
rmdir /s /q D:\"documents and settings"\%username%\"local settings"\"temporary internet files"\
rd /s /q %windir%\SoftwareDistribution\Download
rmdir /s /q C:\ProgramData\Microsoft\Windows\WER\Reportqueue
exit