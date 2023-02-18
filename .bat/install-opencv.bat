@echo off
@call .bat/install-ccache.bat
@call git submodule deinit -f opencv
@call git submodule deinit -f opencv_contrib
@call git submodule update --init opencv
@call git submodule update --init opencv_contrib

@call cd opencv
@call git checkout 5.x
@call git pull
@call cd ..

@call cd opencv_contrib
@call git checkout 5.x
@call git pull
@call cd ..

@call rmdir build\opencv /s /q
@call mkdir build\opencv
@call cd build\opencv
cmake ^
    -G "Visual Studio 17 2022" ^
    -D CMAKE_CONFIGURATION_TYPES:STRING=Release ^
    -S ..\..\opencv ^
    -DCMAKE_BUILD_TYPE=Release ^
    -DCMAKE_INSTALL_PREFIX=C:\\opencv ^
    -DCMAKE_EXPORT_COMPILE_COMMANDS=ON ^
    -DCUDA_ARCH_BIN=7.5^
    -DCUDA_FAST_MATH=ON^
    -DOPENCV_EXTRA_MODULES_PATH=a:\nvietuk\opencv_contrib\modules^
    -DENABLE_FAST_MATH=ON^
    -DOPENCV_DNN_CUDA=ON^
    -DWITH_CUDA=ON^
    -DENABLE_CCACHE=ON^
    -D CCACHE_PROGRAM:FILEPATH="C:\ccache\bin\ccache.exe"
cmake -S ..\..\opencv
rem msbuild INSTALL.vcxproj -p:Configuration=Release
@call copy ..\..\opencv_fix\tiffconf.h 3rdparty\libtiff\tiffconf.h /y
@call copy ..\..\opencv_fix\tif_config.h 3rdparty\libtiff\tif_config.h /y
@call copy ..\..\opencv_fix\jconfigint.h 3rdparty\libjpeg-turbo\jconfigint.h /y
@call cd ..\..