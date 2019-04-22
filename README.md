# TheDesk-Vue
Vueで[TheDesk][cutls/TheDesk]を書き直してみたもの。ライセンスは元のパッケージのライセンスを継承して[GPL v3](LICENSE)とします

## Version
現在は本家バージョン18.3.xの仕様をベースに開発しています

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


[cutls/TheDesk]: https://github.com/cutls/TheDesk
