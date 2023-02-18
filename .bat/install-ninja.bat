@echo off
@call rmdir build\ninja /s
@call mkdir build\ninja
@call cd build\ninja
cmake ^
    -G "Visual Studio 17 2022" ^
    -D CMAKE_CONFIGURATION_TYPES:STRING=Release ^
    -D CMAKE_TRY_COMPILE_CONFIGURATION:STRING=Release ^
    -S ..\..\ninja^
    -DCMAKE_INSTALL_PREFIX=C:\\ninja ^
    -DCMAKE_EXPORT_COMPILE_COMMANDS=ON 
@call cd ..\..