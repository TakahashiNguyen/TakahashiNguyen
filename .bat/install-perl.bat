@call vcvarsall.bat x64 %*
@call cd perl5\win32
@call powershell -Command "(gc Makefile) -replace '#CCTYPE		= MSVC143', 'CCTYPE		= MSVC143' | Out-File -encoding ASCII Makefile"
nmake
nmake install
@call powershell -Command "(gc Makefile) -replace 'CCTYPE		= MSVC143', '#CCTYPE		= MSVC143' | Out-File -encoding ASCII Makefile"
@call cd ..\..