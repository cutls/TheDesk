# TheDesk Plugin

[AiScript](https://github.com/syuilo/aiscript)で書きます。

[AiScript の書き方](https://github.com/syuilo/aiscript/blob/master/docs/get-started.md)

## メタデータ

```
### {
    manifest: 1
    name: "マイ・ファースト・プラグイン"
    version: 1
    event: "buttonOnPostbox"
    author: "Cutls P"
    apiGet: no
}
```

これを冒頭に入れます。

**AiScriptのbooleanはyesかnoです**

- manifest  
  1 を指定してください。無ければ 1 とみなします。
- version  
  数字でも文字列でも好きに使ってください。TheDesk 側では全く参照しません。
- dangerHtml: boolean  
  `TheDesk:changeText`にアクセスするために必要です。
- apiGet: boolean  
  `TheDesk:api`または`TheDesk:getRequest`に GET メソッドでアクセスするときに必要です。
- apiPost: boolean  
  `TheDesk:api`に POST/PUT/DELETE メソッドでアクセスするときや、`postExec`を実行するときに必要です。
- shortcut: number  
  Alt+{number の keycode}で発火できるようにします。[キーコード一覧](https://shanabrian.com/web/javascript/keycode.php)  
  `event`が`init`, `buttonOnBottom`, `buttonOnPostbox`, `none`のときにのみ有効です。
- interval: number  
  `event`が`tips`のとき、更新間隔をミリ秒で指定します。

### event

event に設定できるもの

- `buttonOnPostbox`  
  投稿フォームの…(90° 回転)で出てくるメニュー内に表示されます
- `buttonOnToot`  
  トゥートの詳細メニューに表示されます
- `init`  
  起動時(なるべく早い段階で)
- `buttonOnBottom`  
  メニューボタン(画面下部)の右に追加されます。
- `tips`  
  TheDesk Tipsに追加します。
- `none`  
  明示しません。ショートカットでのみ発火します。

追加予定…

## 変数

### buttonOnToot のとき

- DATA

```
{
    id: "トゥートのID文字列",
    acct_id: "アカウントのTheDesk内部ID"
}
```

- TOOT

トゥートの API を叩いた時と同じオブジェクトが返ります。なお、プラグインが実行されてから取得します。
プラグインの実行ボタン押下から実行までの時間差はこれによるものです。

### buttonOnPostbox のとき

- POST  
  投稿するときのオブジェクトがそのまま入りますが、`TheDeskAcctId`という TheDesk が内部で扱うアカウントの ID(string)が入ったプロパティが追加されます。
- ACCT_ID  
  TheDesk が内部で扱うアカウントの ID(string)

## 関数

### TheDesk:dialog(title: string, text: string, type?: string)

type のデフォルトは'info'で、他に'error','question','success'などがある

### TheDesk:confirm(title: string, text: string, type?: string)

type のデフォルトは'info'で、他に'error','question','success'などがある  
返り値は boolean(true|false)

### TheDesk:css(query: string, attr: string, val: string)

jQuery の`$(query).css(attr, val)`に相当

### TheDesk:openLink(url: string)

リンクを無確認で開きます。

### TheDesk:api(method: 'GET'|'POST'|'PUT'|'DELETE', endpoint: string, body: string | null, acct_id: string)

endpoint は`v1`から書いてください。(`v1/accounts...`)

返り値は json のオブジェクト。

### TheDesk:getRequest(endpoint: string, json: boolean)

endpoint は`https://` を省いて書いてください。(HTTPSにリクエストを限定するため)
返り値は`json`がtrueなら json のオブジェクト。falseならstring(テキストとして処理)

### TheDesk:changeText(body: string)

`buttonOnToot`で使用可能

該当トゥート(や他タイムラインの同一トゥート)のテキストを書き換えます。  
`dangerHtml`を true にしてください。  
HTML を引数にすることに留意してください。

p, span, br, a タグを利用できます。また、a タグには'href', 'class', 'rel', 'target'属性以外を入れることはできず、
href の最初が javascript:で始まるものも利用できません。

### TheDesk:postText(text: string)

`buttonOnPostbox`で使用可能

トゥートボックスの中身を書き換えます。

### TheDesk:postCW(force: boolean, text: string)

`buttonOnPostbox`で使用可能

CW を切り替えます。force はデフォルトで false で、true にするとオンに、false にするとトグルになります。  
text には警告文を入れます。

### TheDesk:postNSFW(force: boolean)

`buttonOnPostbox`で使用可能

NSFW を切り替えます。force はデフォルトで false で、true にするとオンに、false にするとトグルになります。

### TheDesk:postVis(vis: 'public'|'unlisted'|'private'|'direct')

`buttonOnPostbox`で使用可能

公開範囲を変更します。

### TheDesk:postClearbox(force: boolean)

`buttonOnPostbox`で使用可能

投稿ボックスをクリアします。

### TheDesk:postExec()

`buttonOnPostbox`で使用可能

`apiPost`を true にしてください。  
トゥートボタンを押したのと同じ挙動をします。

## 実例

### 1

https://misskey.io/@syuilo/pages/bebeyo を TheDesk で使用できるようにするためには…(勝手に改造)

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
また、do 関数の最下部の`TheDesk:postText(text)`で、TheDesk の投稿ボックスに結果を挿入しています。

### 2

Cat にするやつ(ユーザーがいちいち押さないと変換されないし、タグごと変わってしまうのであまりよくない)

```
### {
    name: "nyaize"
    version: 1
    event: "buttonOnToot"
    author: "Cutls P"
    dangerHtml: yes
}

#toot = TOOT.content
#nyaized = Str:replace(toot, "な", "にゃ")

TheDesk:changeText(nyaized)
```
