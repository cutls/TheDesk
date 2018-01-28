@echo off
cd %~dp0
electron-packager ./app --platform=win32 --arch=all --electron-version=1.8.2-beta.4 --icon=C:\Users\ryuki\crodeb.ico --overwrite