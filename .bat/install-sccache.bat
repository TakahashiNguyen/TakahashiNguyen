@echo off

@call git submodule deinit -f sccache
@call git submodule update --init sccache

@call cd sccache
@call git checkout main
@call git pull
@call cargo build --release --no-default-features
@call cd ..