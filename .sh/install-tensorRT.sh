#!/bin/bash

TRT_VERSION=8.5.2
CUDA_VERSION=11.8
v="${TRT_VERSION}-1+cuda${CUDA_VERSION}"
echo $v

cat >/dev/null <<LABEL_1

apt install -y wget software-properties-common cmake

if [[ $1 == "-f" ]] || [[ $1 == "--docker" ]]; then yn='y'; else read -p "(Re)install repo? (Y/n) " yn; fi
case $yn in 
	[nN] ) ;;
	* ) 
		git submodule deinit -f TensorRT;
		git submodule update --init TensorRT;

		cd TensorRT;
		git checkout ${TRT_VERSION};
		git submodule update --init;
		cd parsers/onnx;
		git submodule update --init;
		cd ../..;
		cd ..;
esac

LABEL_1

case $1 in 
	"--docker") ;;
	"-f")
		.sh/install-python.sh ;;
	* )
		read -p "(Re)install python? (Y/n) " yn
		if [[ $yn == 'y' ]]; then .sh/install-python.sh; fi
	;;
esac

if ([ $1 != "-f" ] && [ $1 != "--docker"]); then read -p "(Re)install cuda? (Y/n) " yn; else yn='y'; fi
case $yn in 
	[nN] ) ;;
	* )
		mkdir bin 
		cd bin 
		wget -O cuda.pin https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/cuda-ubuntu2004.pin
		mv -f cuda.pin /etc/apt/preferences.d/cuda-repository-pin-600
		add-apt-repository \"deb https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/ /\"
		apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/3bf863cc.pub
		wget -O cuda.deb https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/cuda-keyring_1.0-1_all.deb
		dpkg -i cuda.deb
		apt update
		apt install -y libcudnn8=8.7.0.*-1+cuda11.8 libcudnn8-dev=8.7.0.*-1+cuda11.8 \
			libnvinfer8=${v} libnvonnxparsers8=${v} libnvparsers8=${v} libnvinfer-plugin8=${v} \
        	libnvinfer-dev=${v} libnvonnxparsers-dev=${v} libnvparsers-dev=${v} libnvinfer-plugin-dev=${v} \
        	python3-libnvinfer=${v} cuda=11.8.0-1
		cd ..
esac

export TRT_LIBPATH=`pwd`/TensorRT
mkdir build
apt install -y cmake
cd build
rm tensorRT -fr
mkdir -p tensorRT && cd tensorRT
cmake ../../TensorRT \
	-DCUDA_VERSION=11.8 -DGPU_ARCHS="75" -DCMAKE_CUDA_ARCHITECTURES="75" \
	-DCMAKE_CUDA_COMPILER="/usr/local/cuda/bin/nvcc" -DCMAKE_CUDA_FLAGS="-allow-unsupported-compiler" \
	-DTRT_LIB_DIR=$TRT_LIBPATH/lib/ -DTRT_INC_DIR=$TRT_LIBPATH/include -DTRT_OUT_DIR=`pwd`/out
make -j 50 && make install
