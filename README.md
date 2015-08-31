
Backbone.js と Silex による Single Page Application (SPA) の例
=============================================================

Backbone.js と Silex による Single Page Application (SPA) の例です。


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

データベースを初期化させるために `http://localhost:3000/api/reset` にアクセスします。