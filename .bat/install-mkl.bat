@echo on
@call vcvarsall.bat x64 %*
@call rmdir build\oneMKL /s
@call mkdir build\oneMKL
@call cd build\oneMKL
cmake ^
    -G "Visual Studio 17 2022" ^
    -D CMAKE_CONFIGURATION_TYPES:STRING=Release ^
        -S ..\..\oneMKL^
    -DCMAKE_INSTALL_PREFIX=C:\\oneMKL ^
    -DCMAKE_EXPORT_COMPILE_COMMANDS=ON ^
    -D TBB_LIBRARIES:STRING=C:\oneTBB ^
    -DCMAKE_CXX_COMPILER="C:\llvm\bin\clang++.exe" ^
    -DCMAKE_C_COMPILER="C:\llvm\bin\clang.exe" ^
    -DMKL_ROOT=C:\\oneMKL
@call cd ..\..