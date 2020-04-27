#!/usr/bin/env bash

# remove old package
rm -rf package.tar.gz

# build spa app
cd spa/
npm run build
cd ../

# gather things
mkdir package
cp -r spa/public package/spa
rsync -a --exclude=*.pyc --exclude=__pycache__ --exclude=.env api/* package/api

tar -czf package.tar.gz -C package .
rm -rf package
