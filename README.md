# TheDesk

[![Build Status](https://travis-ci.org/cutls/TheDesk.svg?branch=master)](https://travis-ci.org/cutls/TheDesk)
[![Crowdin](https://d322cqt584bo4o.cloudfront.net/thedesk/localized.svg)](https://translate.thedesk.top/project/thedesk)  
Mastodon/Misskey client for PC(Windows/Linux/macOS)  
オープンソースSNSマストドン/MisskeyのWindows/Linuxクライアント  
Download:[TheDesk](https://thedesk.top)  

Contact me(bug report...):GitHub Issues, mention to [Cutls@kirishima.cloud](https://kirishima.cloud/@Cutls) or toot with #Desk  

バグレポートなど:GitHub Issuesや[Cutls@kirishima.cloud](https://kirishima.cloud/@Cutls)へのリプ,または#Deskでトゥートして下さい.  

### Contribute/コントリビュート

Please make a pull request to ***WIP(before CI)*** brunch  
***WIP(before CI)*** ブランチにプルリクエストをお願いします。

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

* 日本語(Japanese)
* English(英語)

### Translation/翻訳

Crowdin project is available! Visit: https://translate.thedesk.top  
  
Crowdinから翻訳に参加してみませんか？: https://translate.thedesk.top  

## Requirement/環境

* Electron 3.0.10(install yourself)
* electron-dl(in package.json)
* Jimp(in package.json)
* font-manager(in package.json)
  * Python 2.x(install yourself)
  * VisualC++(Windows)(install yourself)
* itunes-nowplaying-mac(for macOS)(in package.json)
* node-notifier(in package.json)
* sumchecker(in package.json)
* Ability to read unformated files!(install yourself)

## Contributors/主なコントリビューター

macOSビルダー  

* [とねぢ](https://minohdon.jp/@toneji)

Linuxビルダー  

* [ぽぷんじゃ](https://popon.pptdn.jp/@popn_ja)

iTunes NowPlayingにアルバムアートワークを付けてくれた人

* [kPherox](https://www.kr-kp.com/)

## Build/ビルド

Misskey(misskey.xyz) application token is not in cutls/TheDesk  
Misskey(misskey.xyz)のトークンは含まれておりません。

```sh
git clone https://github.com/cutls/TheDesk
cd TheDesk/app
npm install
npm install --only=dev
```

### electron-builder(推奨)
Use npm scripts.  
npm scriptsを利用します

```sh
# Build for current platform
# 実行している環境向けにビルド
npm run build

# Select build target
# ターゲットを指定してビルド
## Windows
npm run build:win

## Windows and Linux (The macOS target should run on macOS. So, this option hasn't include the build for macOS)
## macOS向けのビルドにはmacOSで実行する必要があるためこのコマンドではビルドされません
npm run build:all
```

Config is all on package.json  
ビルド設定はすべてpackage.jsonに記載しています。  

### electron-packager(非推奨)
`npm install --save-dev electron-rebuild`  
  
Linux/macOS  
`./node_modules/.bin/electron-rebuild`  
Windows  
`.\node_modules\.bin\electron-rebuild.cmd`  
  
To install Python 2.x and Visual C++ for Windows, before running `npm install --save-dev electron-rebuild`  
WindowsでPython 2.xやVisualC++を一発でインストールできるツールもあります(`npm install --save-dev electron-rebuild`の前に)  
`npm install --global windows-build-tools`  
  
日本語話者向けですが、macOSビルドにはXCodeが要るとの情報があります。([とねぢ](https://minohdon.jp/@toneji)氏談)  

Windows  
`electron-packager ./app TheDesk --executable-name="TheDesk" --app-copyright="Copyright (c) TheDesk 2018 Cutls.com 2015 All Right Reserved" --win32metadata.CompanyName="TheDesk&Cutls.com" --win32metadata.FileDescription="TheDesk" --win32metadata.OriginalFilename="TheDesk" --win32metadata.InternalName="TheDesk" --win32metadata.ProductName="TheDesk" --platform=win32 --arch=all --electron-version=4.0.5 --icon=.\app\thedesk.ico --overwrite`  
Linux  
`electron-packager ./app TheDesk --executable-name="TheDesk" --app-copyright="Copyright (c) TheDesk 2018 Cutls.com 2015 All Right Reserved" --platform=linux --arch=x64,ia32 --electron-version=4.0.5 --overwrite`  
macOS  
`electron-packager ./app TheDesk --executable-name="TheDesk" --app-copyright="Copyright (c) TheDesk 2018 Cutls.com 2015 All Right Reserved" --platform=darwin --arch=all --electron-version=4.0.5 --icon=./app/icon.icns --overwrite`  

## Pleroma support

Did you find a bug with Pleroma accounts?  
Pleroma **does not** follow Mastodon API rules completely although Pleroma developers say so.  
Please write issues to improve TheDesk affinity with Pleroma.  
Pleromaは、Mastodon APIとの互換性を謳っていますが、実際には様々な差異があり、TheDeskで不具合が発生することがあります。  
Issuesに書いてある問題についてはなるべく対処しますので、ぜひお知らせください。

## See also/詳しく

[TheDesk - マストドン日本語ウィキ](https://ja.mstdn.wiki/TheDesk)
