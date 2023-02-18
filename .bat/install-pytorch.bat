@echo off

@call .bat/install-magma.bat
@call .bat/install-libuv.bat
@call .bat/install-sccache.bat

@call git submodule deinit -f pytorch
@call git submodule update --init pytorch

@call cd pytorch
@call git checkout master
@call git pull
@call git submodule sync
@call git submodule update --init --recursive
@call cd ..

@call sccache\target\release\sccache.exe --stop-server
@call sccache\target\release\sccache.exe --start-server

@call vcvarsall.bat x64
@call cd pytorch
@call set BUILD_SHARED_LIBS=False
rem @call python -m venv install-pytorch
@call python setup.py build
@call cd ..