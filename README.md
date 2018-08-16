# TheDesk

Mastodon/Misskey client for PC(Windows/Linux/macOS)  
オープンソースSNSマストドン/MisskeyのWindows/Linuxクライアント  
Download:[TheDesk](https://thedesk.top)  
Latest Info(Markdown Toot)/最新情報(マークダウン形式のトゥート): [LATEST.md](https://github.com/cutls/TheDesk/blob/master/LATEST.md)

Contact me(bug report...):GitHub Issues, mention to [Cutls@kirishima.cloud](https://kirishima.cloud/@Cutls) or toot with #Desk  

バグレポートなど:GitHub Issuesや[Cutls@kirishima.cloud](https://kirishima.cloud/@Cutls)へのリプ,または#Deskでトゥートして下さい.  

## License

[TheDesk LICENSE v5.1](https://github.com/cutls/TheDesk/blob/master/LICENSE.md)

## Language/言語

- 日本語(Japanese)
- English(英語)

### Translation/翻訳

The Developer needs nice translation of TheDesk!  
Pull Request to `language/*.json` and `js/lang/*.js`.  
You cannot PR? You can also write Issues.  
  
翻訳を募集しております.特に英語に関しては文法語法的に間違っている箇所が多いので,  
`language/*.json` と `js/lang/*.js`にプルリクエストするか,  
該当箇所がわからない場合はIssuesに書いてください.  
他言語も大歓迎です！  

## Component/構成

app:Raw files(you can download to modify or check)  

app:そのままのファイル.ダウンロード→テスト用  

desk.icns: If you build yourself on macOS, you can use this .icns file as icon.  
desk.icns: macOS向けアイコン.セルフビルドにどうぞ.  

## Requirement/環境

- Electron 2.0.7
- electron-dl
- Jimp
- adm-zip
- itunes-nowplaying-mac(for macOS)
- node-notifier
- Ability to read unformated files!

## Contributors/コントリビューター

macOSビルダー  

- [とねぢ](https://minohdon.jp/@toneji)

## Build/ビルド

Misskey(misskey.xyz) application token is not in cutls/TheDesk  
Misskey(misskey.xyz)のトークンは含まれておりません。  
  
electron-packager is required. electron-packagerが必要です.  
Windows  
`electron-packager ./app TheDesk --executable-name="TheDesk" --app-copyright="Copyright (c) TheDesk 2018 Cutls.com 2015 All Right Reserved" --win32metadata.CompanyName="TheDesk&Cutls.com" --win32metadata.FileDescription="TheDesk" --win32metadata.OriginalFilename="TheDesk" --win32metadata.InternalName="TheDesk" --win32metadata.ProductName="TheDesk" --platform=win32 --arch=all --electron-version=2.0.7 --icon=.\app\thedesk.ico --overwrite`  
Linux  
`electron-packager ./app TheDesk --executable-name="TheDesk" --app-copyright="Copyright (c) TheDesk 2018 Cutls.com 2015 All Right Reserved" --platform=linux --arch=x64,ia32 --electron-version=2.0.7 --overwrite`  
macOS  
`electron-packager ./app TheDesk --executable-name="TheDesk" --app-copyright="Copyright (c) TheDesk 2018 Cutls.com 2015 All Right Reserved" --platform=darwin --arch=all --electron-version=2.0.7 --icon=./app/icon.icns --overwrite`  

## See also/詳しく

[TheDesk - マストドン日本語ウィキ](https://ja.mstdn.wiki/TheDesk)

## How to use Misskey on TheDesk/MisskeyをTheDeskで使う

1. Make `.tkn` on 'app' folder.(/TheDesk/app/.tkn) (If you use build-ver TheDesk, you make it on 'resources' folder./ `.tkn`というファイルを「app」フォルダ内に作成してください。(もしビルド済みのものを利用されている場合、resourcesフォルダになります。)

1. Access https://misskey.xyz/dev and make your app!! (Callback URL: https://thedesk.top/misskey.html / all permitions must be allowed.)