#!/usr/bin/env bash

cd `dirname $0`
for ((i=0; i<64; ++i))
do
    `pwd`/node_modules/phantomjs-prebuilt/bin/phantomjs index.js $i
    sleep 5s
done