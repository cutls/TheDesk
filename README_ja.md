<img src="https://thedesk.top/img/top.png" width="300" align="left">
<img src="https://thedesk.top/img/desk.png" width="150" align="right">

# TheDesk
 
[![Build Status](https://travis-ci.org/cutls/TheDesk.svg?branch=master)](https://travis-ci.org/cutls/TheDesk)
[![Crowdin](https://d322cqt584bo4o.cloudfront.net/thedesk/localized.svg)](https://translate.thedesk.top/project/thedesk)
[![FOSSA Status](https://bit.ly/2N4cLd1)](https://bit.ly/31zqMmZ)
[![Version](https://flat.badgen.net/github/release/cutls/TheDesk)](https://github.com/cutls/TheDesk/releases)
![Contributors](https://flat.badgen.net/github/contributors/cutls/TheDesk)  
Mastodon/Misskey client for PC(Windows/Linux/macOS)  
オープンソースSNSマストドン/MisskeyのPC向けクライアント  
Download:[TheDesk](https://thedesk.top) [![check](https://status.cutls.com/badge/?site=thedesk.top)](https://status.cutls.com)    

[Pixiv FANBOX](https://www.pixiv.net/fanbox/creator/28105985)

`-store.*`とあるアセットはストアやパッケージマネージャ向けのもので、アップデートの確認をソフト本体で行いません。

![Screenshots1](https://thedesk.top/img/scr1.png)  

## ライセンス

[GNU General Public License v3.0](https://github.com/cutls/TheDesk/blob/master/LICENSE)  

アイコンは[クリエイティブ・コモンズ 表示-非営利-継承](https://creativecommons.org/licenses/by-nc-sa/4.0/)で提供されています。  
[プレスキット](https://d2upiril6ywqp9.cloudfront.net/press/TheDesk+PressKit.zip)  

* [PNG 512x512](https://d2upiril6ywqp9.cloudfront.net/press/thedesk.png)
* [SVG 4095x4096](https://d2upiril6ywqp9.cloudfront.net/press/thedesk-fullcolor.svg)
* [ico 256x256](https://d2upiril6ywqp9.cloudfront.net/press/thedesk.ico)
* [icns old](https://d2upiril6ywqp9.cloudfront.net/press/thedesk.icns)
* [Illustrator .ai](https://d2upiril6ywqp9.cloudfront.net/press/thedesk.ai)

標準の通知音は [Creative Commons BY](https://creativecommons.org/licenses/by/4.0/) で提供されています。

## 利用規約

* [利用規約](https://thedesk.top/tos.html)
* [プライバシーポリシー](https://thedesk.top/priv.html)

## 言語

* 日本語
* English(英語)
* ドイツ語, チェコ語, ブルガリア語(from Crowdin)

### 翻訳
  
Crowdinから翻訳に参加してみませんか？: https://translate.thedesk.top  

### デベロッパーモード

`npm run dev`を`app`フォルダ内で実行

## 主なコントリビューター

macOSビルダー  

* [とねぢ](https://minohdon.jp/@toneji)

Linuxビルダー  

* [ぽぷんじゃ](https://popon.pptdn.jp/@popn_ja)

コーダー

* [kPherox](https://pl.kpherox.dev/kPherox)

## ビルド

npmでもyarnでも好きな方を選んでください。

### npm

```sh
git clone https://github.com/cutls/TheDesk
cd TheDesk/app
npm install
npm install --only=dev
npm run construct
```

### yarn

```sh
git clone https://github.com/cutls/TheDesk
cd TheDesk/app
# Linux or macOS
yarn install --no-lockfile
# Windows
yarn install

yarn construct
```

### electron-builder(推奨)

scriptsを利用します

#### npm

```sh
# 実行している環境向けにビルド
npm run build

# ターゲットを指定してビルド
## Windows
npm run build:win

## macOS向けのビルドにはmacOSで実行する必要があるためこのコマンドではビルドされません
npm run build:all
```

#### yarn

```sh
# 実行している環境向けにビルド
yarn build

# ターゲットを指定してビルド
## Windows
yarn build:win

## macOS向けのビルドにはmacOSで実行する必要があるためこのコマンドではビルドされません
yarn build:all
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

### PWAとして実行

TheDeskはウェブ技術を使用して作られているので、ブラウザで動かすこともできます。もちろん、Electron向けに設計されているので一部機能は動きません。

`npm run build:pwa`でビルドできます。PWAに必要な`manifest.json`やサービスワーカーなども要員されています。

**`node_modules`を`dependencies`にリネームしないと動きません。(Netlifyの制限です)**

ChromeまたはFirefoxでチェック: [こちら](https://app.thedesk.top) (`master`ブランチに追従しています。不安定です。)  
[![Netlify Status](https://api.netlify.com/api/v1/badges/6916503b-2882-43f7-9681-ab814e6d28f9/deploy-status)](https://app.netlify.com/sites/thedesk/deploys)

## Pleromaのサポート

Pleromaは、Mastodon APIとの互換性を謳っていますが、実際には様々な差異があり、TheDeskで不具合が発生することがあります。  
Issuesに書いてある問題についてはなるべく対処しますので、ぜひお知らせください。

## 詳しく

[TheDesk - マストドン日本語ウィキ](https://ja.mstdn.wiki/TheDesk)

## `npm i`したら脆弱性あるって言われた

materialize-cssの脆弱性(CVE-2019-11002/3/4)については[こちら](https://github.com/Dogfalo/materialize/issues/6286)で本当に脆弱性かどうか議論しています。  
実際には害が無いものと思われます。
