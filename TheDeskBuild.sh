#!/bin/sh
sudo apt install -y curl
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt update
sudo apt install -y nodejs build-essential
sudo apt install -y git
sudo apt install -y libfontconfig1-dev
git clone https://github.com/kaias1jp/TheDesk.git
cd TheDesk/app
npm install electron@3.0.10
npm install --save-dev electron-rebuild
./node_modules/.bin/electron-rebuild
npm install electron-packager --save-dev
cd ..
app/node_modules/electron-packager/cli.js ./app TheDesk --executable-name="TheDesk" --app-copyright="Copyright (c) TheDesk 2019 Cutls.com 2015 All Right Reserved" --platform=linux --arch=x64,ia32 --electron-version=3.0.10 --overwrite

