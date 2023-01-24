#!/usr/bin/bash
if [[ $1 == "-f" ]] || [[ $1 == "--docker" ]]; then yn='y'; else read -p "(Re)install repo? (Y/n) " yn; fi
case "$yn" in 
    [nN] ) ;;
    * ) 
        git submodule deinit -f tensorflow;
		git submodule update --init tensorflow;

        cd tensorflow
        git checkout origin/r2.11
        cd ..
esac

case "$1" in 
    "--docker") ;;
    "-f") 
        .sh/install-tensorRT.sh $1 ;;
    *) 
        read -p "<(Re)install tensorRT? (Y/n) >" yn
        case "$yn" in
            [nN] ) ;;
            * ) 
                .sh/install-tensorRT.sh $1
        esac
    ;;
esac

apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_19.x | bash - && \
apt-get install -y nodejs
npm install -g @bazel/bazelisk
pip install numpy

cd tensorflow
./configure
bazel build --config=cuda //tensorflow/tools/pip_package:build_pip_package
cd ..