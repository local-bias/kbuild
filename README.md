# kintone ビルドツール

kintone のアプリ、プラグインにおけるビルド環境を統一化し、円滑な開発環境構築をサポートします。
プロジェクトから webpack.config.js を削除できます。

開発環境では速度重視の esbuild、本番環境では省ファイルサイズの webpack を使用しています。
esbuild が改善され、ファイルサイズを小さくできるようになった場合は入れ替えるかもしれません。

## インストール

```bash
# npm
npm i -D @konomi-app/kbuild

# yarn
yarn add -D @konomi-app/kbuild
```

## 実行

開発用ビルドは自動的にウォッチモードになり、リソースに変更があれば再ビルドされます

```bash
# npx 開発ビルド
npx kbuild --env dev

# npx 本番ビルド
npx kbuild --env prod

# yarn 開発ビルド
yarn -s run kbuild --env dev

# yarn 本番ビルド
yarn -s run kbuild --env prod
```

## パラメータの詳細

| 引数   | 値                  | 備考                                                                                                                                                              |
| :----- | :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| --mode | "app"または"plugin" | "app"を指定した場合は、`src/apps`直下のフォルダ単位でビルドされ、"plugin"を指定した場合は、`src/config`と`src/desktop`がそれぞれビルドされます。デフォルト: "app" |
| --env  | "prod"または"dev"   | "dev"を指定した場合は、ソースコードを監視し、変更があった場合はリビルドされます。デフォルト"prod"                                                                 |
