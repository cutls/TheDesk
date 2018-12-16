# TheDesk

Mastodon/Misskey client for PC(Windows/Linux/macOS)  
オープンソースSNSマストドン/MisskeyのWindows/Linuxクライアント  
Download:[TheDesk](https://thedesk.top)  

Contact me(bug report...):GitHub Issues, mention to [Cutls@kirishima.cloud](https://kirishima.cloud/@Cutls) or toot with #Desk  

バグレポートなど:GitHub Issuesや[Cutls@kirishima.cloud](https://kirishima.cloud/@Cutls)へのリプ,または#Deskでトゥートして下さい.  

## License/ライセンス

[GNU General Public License v3.0](https://github.com/cutls/TheDesk/blob/master/LICENSE)  

The icon is provided under [Creative Commons BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/)/アイコンは[クリエイティブ・コモンズ 表示-非営利-継承](https://creativecommons.org/licenses/by-nc-sa/4.0/)で提供されています。  
[Press Kit](https://dl.thedesk.top/press/TheDesk+PressKit.zip)  
* [PNG](https://dl.thedesk.top/press/TheDesk.png)
* [Monotone SVG](https://dl.thedesk.top/press/TheDesk.svg)
* [ico](https://dl.thedesk.top/press/TheDesk.ico)
* [icns](https://dl.thedesk.top/press/TheDesk.icns)



## Terms of Use/利用規約

* [利用規約(Terms of Use(ja))](https://thedesk.top/tos.html)
* [プライバシーポリシー(Privacy Policy(ja))](https://thedesk.top/priv.html)

## Language/言語

- 日本語(Japanese)
- English(英語)

### Translation/翻訳

Crowdin project was started! Visit: https://crowdin.com/project/thedesk  
  
Crowdinから翻訳に参加してみませんか？: https://crowdin.com/project/thedesk  

## Component/構成

app:Raw files(you can download to modify or check)  

app:そのままのファイル.ダウンロード→テスト用  

desk.icns: If you build yourself on macOS, you can use this .icns file as icon.  
desk.icns: macOS向けアイコン.セルフビルドにどうぞ.  

## Requirement/環境

- Electron 3.0.10
- electron-dl
- Jimp
- font-manager
- itunes-nowplaying-mac(for macOS)
- node-notifier
- Ability to read unformated files!

## Contributors/コントリビューター

macOSビルダー  

- [とねぢ](https://minohdon.jp/@toneji)

## Build/ビルド

Misskey(misskey.xyz) application token is not in cutls/TheDesk  
Misskey(misskey.xyz)のトークンは含まれておりません。  
  
### electron-packager
Windows  
`electron-packager ./app TheDesk --executable-name="TheDesk" --app-copyright="Copyright (c) TheDesk 2018 Cutls.com 2015 All Right Reserved" --win32metadata.CompanyName="TheDesk&Cutls.com" --win32metadata.FileDescription="TheDesk" --win32metadata.OriginalFilename="TheDesk" --win32metadata.InternalName="TheDesk" --win32metadata.ProductName="TheDesk" --platform=win32 --arch=all --electron-version=3.0.10 --icon=.\app\thedesk.ico --overwrite`  
Linux  
`electron-packager ./app TheDesk --executable-name="TheDesk" --app-copyright="Copyright (c) TheDesk 2018 Cutls.com 2015 All Right Reserved" --platform=linux --arch=x64,ia32 --electron-version=3.0.10 --overwrite`  
macOS  
`electron-packager ./app TheDesk --executable-name="TheDesk" --app-copyright="Copyright (c) TheDesk 2018 Cutls.com 2015 All Right Reserved" --platform=darwin --arch=all --electron-version=3.0.10 --icon=./app/icon.icns --overwrite`  

### electron-builder
Windows config is all on package.json  
Windows用のビルド設定はすべてpackage.jsonに記載しています。  
  
To build TheDesk for Linux and macOS, edit package.json  
Linux,macOS版をビルドするためにはpackage.jsonを編集してください。
## See also/詳しく

[TheDesk - マストドン日本語ウィキ](https://ja.mstdn.wiki/TheDesk)
