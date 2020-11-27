# TheDesk Plugin

[AiScript](https://github.com/syuilo/aiscript)で書きます。

[AiScriptの書き方](https://github.com/syuilo/aiscript/blob/master/docs/get-started.md)

## メタデータ
```
### {
    name: "マイ・ファースト・プラグイン"
    version: 1
    event: "buttonOnPostbox"
    author: "Cutls P"
    apiGet: false(例)
}
```
これを冒頭に入れます。

* dangerHtml: true|false  
`TheDesk:changeText`にアクセスするために必要です。
* apiGetl: true|false  
`TheDesk:api`にGETメソッドでアクセスするときに必要です。
* apiPost: true|false
`TheDesk:api`にPOST/PUT/DELETEメソッドでアクセスするときや、`postExec`を実行するときに必要です。

### event

eventに設定できるもの

* `buttonOnPostbox`  
投稿フォームの…(90°回転)で出てくるメニュー内に表示されます
* `buttonOnToot`  
トゥートの詳細メニューに表示されます
* `init`  
起動時(なるべく早い段階で)

追加予定…

## 変数

### buttonOnTootのとき

* DATA  
```
{
    id: "トゥートのID文字列",
    acct_id: "アカウントのTheDesk内部ID"
}
```
* TOOT

トゥートのAPIを叩いた時と同じオブジェクトが返ります。なお、プラグインが実行されてから取得します。
プラグインの実行ボタン押下から実行までの時間差はこれによるものです。

### buttonOnPostboxのとき

* POST  
投稿するときのオブジェクトがそのまま入りますが、`TheDeskAcctId`というTheDeskが内部で扱うアカウントのID(string)が入ったプロパティが追加されます。
* ACCT_ID  
TheDeskが内部で扱うアカウントのID(string)


## 関数

### TheDesk:dialog(title: string, text: string, type?: string)
typeのデフォルトは'info'で、他に'error','question','success'などがある

### TheDesk:confirm(title: string, text: string, type?: string)
typeのデフォルトは'info'で、他に'error','question','success'などがある  
返り値はboolean(true|false)

### TheDesk:css(query: string, attr: string, val: string)
jQueryの`$(query).css(attr, val)`に相当

### TheDesk:api(method: 'GET'|'POST'|'PUT'|'DELETE', endpoint: string, body: string, acct_id: string)
bodyにもstringを投げてください。  
endpointは`v1`から書いてください。(`v1/accounts...`)

返り値はjsonのオブジェクト。

### TheDesk:changeText(body: string)
`buttonOnToot`で使用可能

該当トゥート(や他タイムラインの同一トゥート)のテキストを書き換えます。  
`dangerHtml`をtrueにしてください。  
HTMLを引数にすることに留意してください。

### TheDesk:postText(text: string)
`buttonOnPostbox`で使用可能

トゥートボックスの中身を書き換えます。

### TheDesk:postCW(force: boolean, text: string)
`buttonOnPostbox`で使用可能

CWを切り替えます。forceはデフォルトでfalseで、trueにするとオンに、falseにするとトグルになります。  
textには警告文を入れます。

### TheDesk:postNSFW(force: boolean)
`buttonOnPostbox`で使用可能

NSFWを切り替えます。forceはデフォルトでfalseで、trueにするとオンに、falseにするとトグルになります。

### TheDesk:postVis(vis: 'public'|'unlisted'|'private'|'direct')
`buttonOnPostbox`で使用可能

公開範囲を変更します。

### TheDesk:postNSFW(force: postClearbox)
`buttonOnPostbox`で使用可能

投稿ボックスをクリアします。

### TheDesk:postExec()
`buttonOnPostbox`で使用可能

`apiPost`をtrueにしてください。  
トゥートボタンを押したのと同じ挙動をします。


## 実例

https://misskey.io/@syuilo/pages/bebeyo をTheDeskで使用できるようにするためには…(勝手に改造)
```
### {
      name: "ﾍﾞﾍﾞﾖ"
      version: 1
      event: "buttonOnPostbox"
      author: "syuilo"
 }

#chars = 
Str:split("ｱ,ｲ,ｳ,ｴ,ｵ,ｶ,ｷ,ｸ,ｹ,ｺ,ｻ,ｼ,ｽ,ｾ,ｿ,ﾀ,ﾁ,ﾂ,ﾃ,ﾄ,ﾅ,ﾆ,ﾇ,ﾈ,ﾉ,ﾊ,ﾋ,ﾌ,ﾍ,ﾎ,ﾏ,ﾐ,ﾑ,ﾒ,ﾓ,ﾔ,ﾕ,ﾖ,ｶﾞ,ｷﾞ,ｸﾞ,ｹﾞ,ｺﾞ,ｻﾞ,ｼﾞ,ｽﾞ,ｾﾞ,ｿﾞ,ﾀﾞ,ﾁﾞ,ﾂﾞ,ﾃﾞ,ﾄﾞ,ﾊﾞ,ﾋﾞ,ﾌﾞ,ﾍﾞ,ﾎﾞ,ﾊﾟ,ﾋﾟ,ﾌﾟ,ﾍﾟ,ﾎﾟ", ",")
#yos = ["ｵ", "ﾆｮ"]
#suffixes = ["ｵｵｵｵｵｵｵ", "ﾅｰﾗ", "ﾝﾁｰﾉ"]
$text <- _

@do() {
  #char1 = chars[Math:rnd(1, Arr:len(chars))]
  #char2 = chars[Math:rnd(1, Arr:len(chars))]
  #yo = ? (Math:rnd(0, 2) = 0) { yos[Math:rnd(1, Arr:len(yos))] } ... { "ﾖ" }
  #n = ? (Math:rnd(0, 2) = 0) { "ﾝ" } ... { "" }
  #suffix = ? (Math:rnd(0, 2) = 0) { suffixes[Math:rnd(1, Arr:len(suffixes))] } ... { "" }
  text <- `{char1}{char2}{n}{yo}{suffix}`
  TheDesk:postText(text)
}

do()
```

最初のメタデータを追加します。
また、do関数の最下部の`TheDesk:postText(text)`で、TheDeskの投稿ボックスに結果を挿入しています。