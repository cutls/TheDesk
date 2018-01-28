@echo off
cd %~dp0
aws s3 cp TheDesk-win32-x64.zip s3://thedesk/