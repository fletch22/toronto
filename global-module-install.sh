#!/usr/bin/env bash

npm uninstall bower@1.7.7 \
browser-sync@2.11.1 gulp@3.9.1 karma@0.13.21 \
node-gyp@3.3.0 nodemon@1.9.1 pangyp@2.3.3 phantomjs-prebuilt@2.1.4 \
webpack@1.12.14 webpack-dev-server@1.14.1 -g

npm install bower@1.7.7 \
browser-sync@2.11.1 gulp@3.9.1 karma@0.13.21 \
node-gyp@3.3.0 nodemon@1.9.1 pangyp@2.3.3 phantomjs-prebuilt@2.1.4 \
webpack@1.12.14 webpack-dev-server@1.14.1 -g


#rm -rf ./node_modules/
#

npm install

npm start