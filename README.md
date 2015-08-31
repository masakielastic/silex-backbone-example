
Backbone.js と Silex による Single Page Application (SPA) の例
=============================================================

Backbone.js と Silex による Single Page Application (SPA) の例です。


スクリーンショット
---------------

![スクリーンショット](screenshot.png "スクリーンショット")

環境
----

PHP のビルトインサーバーで動作を確認しています。


インストール
-----------

```bash
git clone https://github.com/masakielastic/silex-backbone-example.git
cd silex-backbone-example
composer update
```

PHP のビルトインサーバーを起動させます。

```bash
php -S localhost:3000 -t web web/index.php
```

データベースを初期化させるために「初期化」のボタンを押して初期化を実行します。初期化が終えたらページをリロードします。

