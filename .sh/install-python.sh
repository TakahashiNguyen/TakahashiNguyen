apt install -y git build-essential zlibc zlib1g-dev libssl-dev libncurses5-dev libsqlite3-dev libreadline-dev libtk8.6 libgdm-dev libdb4o-cil-dev libpcap-dev make
git submodule deinit -f cpython
cd cpython 
git submodule update --remote cpython/

./configure
make -j 100
make install