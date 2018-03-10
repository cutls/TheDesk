# TheDesk
Mastodon client for Windows/Linux(Linux ver. is not supported by developer.)  
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

[TheDesk LICENSE v2](https://github.com/cutls/TheDesk/blob/master/LICENSE.md)

## Component/構成

app:Raw files(you can download to modify or check)  

app:そのままのファイル。ダウンロード→テスト用  

## Language/言語

Japanese  
日本語

## Requirement/環境

- Windows (to launch TheDesk/実行に必要) / Linux (x64/ia32/armv7l)
- Electron beta.1.8.2-beta4
- electron-dl
- electron-about-window
- Jimp(Node.js)
- Ability to read unformated files!

### Why do we use Electron beta version?/Beta版の利用について

Some animated emojis are not GIF but PNG, only rendered by Electron beta version(Chromium 59 and above).  
アニメ絵文字の一部がChromium 59以降のみ対応のAPNGで提供されているためBetaを利用しています。

## See also/詳しく

[TheDesk - マストドン日本語ウィキ](https://ja.mstdn.wiki/TheDesk)