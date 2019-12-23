#!/bin/sh

# Polyfill node apis introduce by web3
rn-nodeify --install assert,stream,events,crypto,url,http,https,vm,os,fs,path,process,net,zlib,_stream_transform,tls --hack

# Polyfill TextEncoder from joi
cat node_modules/@ripzery/omg-js-rootchain/node_modules/@hapi/joi/dist/joi-browser.min.js | pbcopy && echo "require('fast-text-encoding');" > node_modules/@ripzery/omg-js-rootchain/node_modules/@hapi/joi/dist/joi-browser.min.js && pbpaste >> node_modules/@ripzery/omg-js-rootchain/node_modules/@hapi/joi/dist/joi-browser.min.js

# Jetify Android support libraries to AndroidX
npx jetify
