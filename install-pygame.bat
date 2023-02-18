@echo off
@call git submodule deinit -f pygame
@call git submodule update --init pygame

@call cd pygame 
@call git checkout main
@call git pull

@call python -m pip install setuptools requests -U 
@call python setup.py install
@call cd ..