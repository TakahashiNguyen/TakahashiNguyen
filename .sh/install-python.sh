apt install -y git build-essential zlibc zlib1g-dev libssl-dev libncurses5-dev libsqlite3-dev libreadline-dev libtk8.6 libgdm-dev libdb4o-cil-dev libpcap-dev make
git submodule deinit -f cpython
git submodule update --remote --init cpython
cd cpython 

./configure
make -j 100
make install
update-alternatives --install /usr/bin/pip pip /usr/local/bin/pip3 1
update-alternatives --install /usr/bin/python python /usr/local/bin/python3 1