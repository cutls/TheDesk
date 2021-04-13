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
Download:[TheDesk](https://thedesk.top)

[Pixiv FANBOX](https://www.pixiv.net/fanbox/creator/28105985)

`-store.*`とあるアセットはストアやパッケージマネージャ向けのもので、アップデートの確認をソフト本体で行いません。ただし、.snapに関しては-normalが通常、無印がアップデート確認なしバージョンです。

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

## プライバシーポリシー

* [プライバシーポリシー](https://thedesk.top/priv.html)

## 言語

* 日本語
* 日本語(関西)
* English(英語)
* ドイツ語, チェコ語, ブルガリア語, イタリア語, スペイン語アルゼンチン方言他 (from [Crowdin](https://translate.thedesk.top))

### 翻訳
  
Crowdinから翻訳に参加してみませんか？: https://translate.thedesk.top  

**yarnを使ってください。その他(npmなど)を使用するとエラーが出ます**

### デベロッパーモード

`yarn dev`を`app`フォルダ内で実行。

## 主なコントリビューター

macOSビルダー(現在はTravis CI)

* [とねぢ](https://minohdon.jp/@toneji)

Linuxビルダー(現在はTravis CI)

* [ぽぷんじゃ](https://popon.pptdn.jp/@popn_ja)

コーダー

* [kPherox](https://pl.kpherox.dev/kPherox)

## ビルド

**yarnを使ってください。その他(npmなど)を使用するとエラーが出ます**


```sh
git clone https://github.com/cutls/TheDesk
cd TheDesk/app
yarn install

yarn build
```

`yarn dev`でコンソールが出る開発モードで起動します。並行して監視が走る関係上、Ctrl+Cを2回押さないと終了しない場合があります。

### macOSでビルドするときの制限

完全なビルドにはXCode(XCode Command Line Tools)が必要です。無いままビルドした場合でもおそらくビルドは完了しますが、iTunesのNowPlayingが利用できません。

Notarizeが入ります。つまり、認証された(課金したとも言う)デベロッパによるキーチェーンが必要で一般環境からビルドすることができません。配布版はCutlsが行っています。
これを解除する場合`app/build/notarize.js`を参照してください。**なお、試験実装なのでちゃんとNotarizeできているかどうかを保証しません。**

フォークを世に出す場合や、Cutlsが信用できない場合、自分でMac AppStoreに出す場合など、[自分でNotarizeする必要があるとき](https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/)、[それをCI等で自動化するとき](https://qiita.com/ktmouk/items/7fc27c9ad0e3caf7899d)。


### PWAとして実行

TheDeskはウェブ技術を使用して作られているので、ブラウザで動かすこともできます。もちろん、Electron向けに設計されているので一部機能は動きません。

`yarn build:pwa`でビルドできます。PWAに必要な`manifest.json`やサービスワーカーなども用意されています。

**`node_modules`を`dependencies`にリネームしないと動きません。(Netlifyの制限ですが、Netlify以外で動かす場合にも必須です)**

ChromeまたはFirefoxでチェック: [こちら](https://app.thedesk.top) (`master`ブランチに追従しています。不安定です。)  
[![Netlify Status](https://api.netlify.com/api/v1/badges/6916503b-2882-43f7-9681-ab814e6d28f9/deploy-status)](https://app.netlify.com/sites/thedesk/deploys)

## Pleromaのサポート

Pleromaは、Mastodon APIとの互換性を謳っていますが、実際には様々な差異があり、TheDeskで不具合が発生することがあります。  
Issuesに書いてある問題についてはなるべく対処しますので、ぜひお知らせください。

## 詳しく

[TheDesk - マストドン日本語ウィキ](https://ja.mstdn.wiki/TheDesk)

## `yarn install`したら脆弱性あるって言われた

materialize-cssの脆弱性(CVE-2019-11002/3/4)については[こちら](https://github.com/Dogfalo/materialize/issues/6286)で本当に脆弱性かどうか議論しています。  
実際には害が無いものと思われます。
