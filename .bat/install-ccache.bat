@echo off
@call git submodule deinit -f ccache
@call git submodule update --init ccache

@call cd ccache
@call git checkout master
@call git pull
@call cd ..

@call rmdir build\ccache /s /q
@call mkdir build\ccache
@call cd build\ccache
cmake ^
    -G "Visual Studio 17 2022" ^
    -D CMAKE_CONFIGURATION_TYPES:STRING=Release ^
    -D CMAKE_TRY_COMPILE_CONFIGURATION:STRING=Release ^
    -S ..\..\ccache^
    -DCMAKE_BUILD_TYPE=Release ^
    -DCMAKE_INSTALL_PREFIX=C:\\ccache ^
    -DCMAKE_CXX_STANDARD=17 ^
    -DCMAKE_EXPORT_COMPILE_COMMANDS=ON 
rem msbuild INSTALL.vcxproj -p:Configuration=Release -maxCpuCount:2 -bl:..\..\.log\ccache.binlog
pause
@call cd ..\..