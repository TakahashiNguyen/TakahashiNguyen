@echo off
@call rmdir build\re2c /s
@call mkdir build\re2c
@call cd build\re2c
cmake ^
    -G "Visual Studio 17 2022" ^
    -D CMAKE_CONFIGURATION_TYPES:STRING=Release ^
    -D CMAKE_TRY_COMPILE_CONFIGURATION:STRING=Release ^
    -S ..\..\re2c^
    -DCMAKE_INSTALL_PREFIX=C:\\re2c ^
    -DCMAKE_CXX_STANDARD=17 ^
    -DCMAKE_EXPORT_COMPILE_COMMANDS=ON 
@call cd ..\..