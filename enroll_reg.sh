set -x
cd fabcar && ./startFabric.sh javascript

node enrollAdmin.js
node registerUser.js
