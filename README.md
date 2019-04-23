# TheDesk
頑張ってTheDeskをVueでリライトします。ライセンスは同様に[GPL v3](LICENSE)です。


## Development
開発時の起動
```sh
npm run electron:serve
```

アプリのビルド
```sh
npm run electron:build

# マルチプラットフォームのビルドをする時は以下
npm run electron:build -- --win --linux # 必要なものをつける。`--mac`はmacOS上でなければビルドできない
```

_アプリのアイコンは以下のコマンドを実行して生成してください_
```sh
npm run electron:generate-icons
```