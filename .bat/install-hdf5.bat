@echo off
@call rmdir build\hdf5 /s /q
@call mkdir build\hdf5
@call cd build\hdf5
cmake ^
    -G "Visual Studio 17 2022" ^
    -D CMAKE_CONFIGURATION_TYPES:STRING=Release ^
    -S ..\..\hdf5^
    -DCMAKE_INSTALL_PREFIX=C:\\hdf5 
@call cd ..\..