# TheDesk
Mastodon client for PC(Windows/Linux/macOS)  
オープンソースSNSマストドンのWindows/Linuxクライアント  
Download:[TheDesk](https://thedesk.top)  
Latest Info(Markdown Toot)/最新情報(マークダウン形式のトゥート): [LATEST.md](https://github.com/cutls/TheDesk/blob/master/LATEST.md)

## Developer/作った人

### Cutls P
<img src="https://thedesk.top/img/desk.png" width="100px">

I'm developing TheDesk on Mastodon in Nishinomiya and Kyoto, Japan.  
My works:[Cutls Portal](https://the.cutls.com)  
Contact me(bug report...):GitHub Issues, mention to [Cutls@kirishima.cloud](https://kirishima.cloud/@Cutls) or toot with #Desk  

TheDeskを関西で開発しています。[Cutls Portal](https://the.cutls.com)で他のサービスをご覧いただけます。  
バグレポートなど:GitHub Issuesや[Cutls@kirishima.cloud](https://kirishima.cloud/@Cutls)へのリプ、または#Deskでトゥートして下さい。  

## License

[TheDesk LICENSE v4](https://github.com/cutls/TheDesk/blob/master/LICENSE.md)

## Component/構成

app:Raw files(you can download to modify or check)  

app:そのままのファイル。ダウンロード→テスト用  

desk.icns: If you build yourself on macOS, you can use this .icns file as icon.  
desk.icns: macOS向けアイコン。セルフビルドにどうぞ。  

## Language/言語

Japanese  
日本語

## Requirement/環境

- Windows (to launch TheDesk/実行に必要) / Linux (x64/ia32/armv7l)
- Electron 1.8.4
- electron-dl
- Jimp(Node.js)
- itunes-nowplaying-mac(for macOS)
- node-notifier
- Ability to read unformated files!

## Build/ビルド
electron-packager is required. electron-packagerが必要です。  
Windows  
`electron-packager ./app TheDesk --executable-name="TheDesk" --app-copyright="Copyright (c) TheDesk 2018 Cutls.com 2015 All Right Reserved" --win32metadata.CompanyName="TheDesk&Cutls.com" --win32metadata.FileDescription="TheDesk" --win32metadata.OriginalFilename="TheDesk" --win32metadata.InternalName="TheDesk" --win32metadata.ProductName="TheDesk" --platform=win32 --arch=all --electron-version=1.8.7 --icon=.\app\thedesk.ico --overwrite`  
Linux  
`electron-packager ./app TheDesk --executable-name="TheDesk" --app-copyright="Copyright (c) TheDesk 2018 Cutls.com 2015 All Right Reserved" --platform=linux --arch=x64,ia32 --electron-version=1.8.7 --overwrite`  
macOS  
`electron-packager ./app TheDesk --executable-name="TheDesk" --app-copyright="Copyright (c) TheDesk 2018 Cutls.com 2015 All Right Reserved" --platform=darwin --arch=all --electron-version=2.0.0 --icon=./app/icon.icns --overwrite`  

## See also/詳しく

[TheDesk - マストドン日本語ウィキ](https://ja.mstdn.wiki/TheDesk)