<?php
require_once __DIR__.'/../vendor/autoload.php';

use Silex\Application;
use Silex\Provider;
use Masakielastic\Silex\SimplePageControllerProvider;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;


$app = new class extends Application {
    use Application\TwigTrait;
};

$app->register(new Provider\TwigServiceProvider());
$app->register(new Provider\DoctrineServiceProvider());

$app['twig.path'] = [__DIR__];
$app['db.options'] = [
    'driver'   => 'pdo_sqlite',
    'path'     => __DIR__.'/app.db'
];
$app['debug'] = true;

$app->mount('/api', new SimplePageControllerProvider());

$app->get('/api/reset', function(Application $app) {

    $sqls = [
      'DROP TABLE IF EXISTS page',
      'CREATE TABLE page('.
      '  id INTEGER PRIMARY KEY AUTOINCREMENT,'.
      '  name TEXT NOT NULL,'.
      '  title TEXT,'.
      '  body TEXT,'.
      '  unique(name)'.
      ');',
      "INSERT INTO page(name, title, body) VALUES('index', 'ホームの見出し', 'ホームの本文');",
      "INSERT INTO page(name, title, body) VALUES('about', '自己紹介の見出し', '自己紹介の本文');",
      "INSERT INTO page(name, title, body) VALUES('contact', '問い合わせの見出し', '問い合わせの本文');"
    ];

    foreach ($sqls as $sql) {
        $app['db']->query($sql); 
    }

    return $app->json(['msg' => 'ok']);
});

$app->get('/', function(Application $app) {
    return $app->render('template.twig');
});

$app->get('/{name}', function(Application $app, $name) {
    $subRequest = Request::create("/#{$name}", 'GET');

    return $app->handle($subRequest, HttpKernelInterface::SUB_REQUEST);
});

$app->run();



