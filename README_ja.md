<img src="https://thedesk.top/img/top.png" width="300" align="left">
<img src="https://thedesk.top/img/desk.png" width="150" align="right">

# TheDesk
 
[![Build Status](https://travis-ci.org/cutls/TheDesk.svg?branch=master)](https://travis-ci.org/cutls/TheDesk)
[![Crowdin](https://d322cqt584bo4o.cloudfront.net/thedesk/localized.svg)](https://translate.thedesk.top/project/thedesk)
[![Version](https://flat.badgen.net/github/release/cutls/TheDesk)](https://github.com/cutls/TheDesk/releases)
[![Download](https://flat.badgen.net/github/assets-dl/cutls/TheDesk)](https://github.com/cutls/TheDesk/releases)
![Contributors](https://flat.badgen.net/github/contributors/cutls/TheDesk)  
Mastodon/Misskey client for PC(Windows/Linux/macOS)  
オープンソースSNSマストドン/MisskeyのPC向けクライアント  
Download:[TheDesk](https://thedesk.top) [![check](https://status.cutls.com/badge/?site=thedesk.top)](https://status.cutls.com)    

[Pixiv FANBOX](https://www.pixiv.net/fanbox/creator/28105985)

![Screenshots1](https://thedesk.top/img/scr1.png)  

## ライセンス

[GNU General Public License v3.0](https://github.com/cutls/TheDesk/blob/master/LICENSE)  

アイコンは[クリエイティブ・コモンズ 表示-非営利-継承](https://creativecommons.org/licenses/by-nc-sa/4.0/)で提供されています。  
[プレスキット](https://dl.thedesk.top/press/TheDesk+PressKit.zip)  

* [PNG](https://dl.thedesk.top/press/TheDesk.png)
* [Monotone SVG](https://dl.thedesk.top/press/TheDesk.svg)
* [ico](https://dl.thedesk.top/press/TheDesk.ico)
* [icns](https://dl.thedesk.top/press/TheDesk.icns)

標準の通知音は [Creative Commons BY](https://creativecommons.org/licenses/by/4.0/) で提供されています。

## 利用規約

* [利用規約](https://thedesk.top/tos.html)
* [プライバシーポリシー](https://thedesk.top/priv.html)

## 言語

* 日本語
* English(英語)

### 翻訳
  
Crowdinから翻訳に参加してみませんか？: https://translate.thedesk.top  

## 環境

* Electron 4.2以上(自分で入れて)
* electron-dl(in package.json)
* Jimp(in package.json)
* font-manager(in package.json)
  * Python 2.x(自分で入れて)
  * VisualC++(Windows)(自分で入れて)
* itunes-nowplaying-mac(macOS向け)(in package.json)
* node-notifier(in package.json)
* sumchecker(in package.json)
* Ability to read unformated files!(自分で入れて)

### デベロッパーモード

`npm run dev`を`app`フォルダ内で実行

## 主なコントリビューター

macOSビルダー  

* [とねぢ](https://minohdon.jp/@toneji)

Linuxビルダー  

* [ぽぷんじゃ](https://popon.pptdn.jp/@popn_ja)

iTunes NowPlayingにアルバムアートワークを付けてくれた人

* [kPherox](https://www.kr-kp.com/)

## ビルド


```sh
git clone https://github.com/cutls/TheDesk
cd TheDesk/app
npm install
npm install --only=dev
```

### electron-builder(推奨)
npm scriptsを利用します

```sh
# 実行している環境向けにビルド
npm run build

# ターゲットを指定してビルド
## Windows
npm run build:win

## macOS向けのビルドにはmacOSで実行する必要があるためこのコマンドではビルドされません
npm run build:all
```

ビルド設定はすべてpackage.jsonに記載しています。  

### electron-packager(非推奨)
`npm install --save-dev electron-rebuild`  
  
Linux/macOS  
`./node_modules/.bin/electron-rebuild`  
Windows  
`.\node_modules\.bin\electron-rebuild.cmd`  
  
WindowsでPython 2.xやVisualC++を一発でインストールできるツールもあります(`npm install --save-dev electron-rebuild`の前に)  
`npm install --global windows-build-tools`  
  
日本語話者向けですが、macOSビルドにはXCodeが要るとの情報があります。([とねぢ](https://minohdon.jp/@toneji)氏談)  

Windows  
`electron-packager ./app TheDesk --executable-name="TheDesk" --app-copyright="Copyright (c) TheDesk 2018 Cutls.com 2015 All Right Reserved" --win32metadata.CompanyName="TheDesk&Cutls.com" --win32metadata.FileDescription="TheDesk" --win32metadata.OriginalFilename="TheDesk" --win32metadata.InternalName="TheDesk" --win32metadata.ProductName="TheDesk" --platform=win32 --arch=all --electron-version=4.0.5 --icon=.\app\thedesk.ico --overwrite`  
Linux  
`electron-packager ./app TheDesk --executable-name="TheDesk" --app-copyright="Copyright (c) TheDesk 2018 Cutls.com 2015 All Right Reserved" --platform=linux --arch=x64,ia32 --electron-version=4.0.5 --overwrite`  
macOS  
`electron-packager ./app TheDesk --executable-name="TheDesk" --app-copyright="Copyright (c) TheDesk 2018 Cutls.com 2015 All Right Reserved" --platform=darwin --arch=all --electron-version=4.0.5 --icon=./app/icon.icns --overwrite`  

## Pleromaのサポート

Pleromaは、Mastodon APIとの互換性を謳っていますが、実際には様々な差異があり、TheDeskで不具合が発生することがあります。  
Issuesに書いてある問題についてはなるべく対処しますので、ぜひお知らせください。

## 詳しく

[TheDesk - マストドン日本語ウィキ](https://ja.mstdn.wiki/TheDesk)
