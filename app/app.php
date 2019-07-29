<?php
require BASE_ROOT.'app/autoload.php';

$app = new \Slim\App(["settings" => App\Config\Config::$config]);

$app->add(new \Slim\Middleware\Session([
  'name' => 'medo_session',
  'autorefresh' => true,
  'lifetime' => '30 days'
]));

$container = $app->getContainer();

//Configuration of views
$container['view'] = function ($container) {
  $view = new \Slim\Views\Twig(BASE_ROOT.'app/views', [
    'auto_reload' => ($container['settings']['mode']=="development" ? true : false)
  ]);

  $basePath = rtrim(str_ireplace('index.php', '', $container['request']->getUri()->getBasePath()), '/');
  $view->addExtension(new Slim\Views\TwigExtension($container['router'], $basePath));
  $view->getEnvironment()->addGlobal('MODE',$container->get('settings')['mode']);
  $view->getEnvironment()->addGlobal('MEDIA_PATH',$container->get('settings')['media_path']);
  $view->getEnvironment()->addGlobal('STATIC_PATH',$container->get('settings')['static_path']);
  
  if(isset($_GET['om'])) $view->getEnvironment()->addGlobal('OPEN_MENU',$_GET['om']=='1');
  
  return $view;
};

$container['mailer'] = function ($container) {
  $settings = $container->get('settings');
  $mailer = new App\Core\Mailer($settings['mailer'],$settings['mode']);
  
  return $mailer;
};

$container['session'] = function ($container) {
  $session = new App\Models\UserSession;

  return $session;
};
$container->view->getEnvironment()->addGlobal('SESSION',$container->session);
/*
//Google API
$container['google'] = function($container){
  $client = new \Google_Client();
  return $client;
};
//Set Google Route
$container->google->setAuthConfig(BASE_ROOT.'app/config/client_secret.json');
$container->google->setAccessType("offline");
$container->google->setScopes(['profile', 'email']);
$googleRoute = $container->google->createAuthUrl();
$container->view->getEnvironment()->addGlobal('googleRoute', $googleRoute);

//Recibimos el code de google
if(isset($_GET["code"])){
  $token = $container->google->authenticate($_GET["code"]);
  $container->google->setAccessToken($token);
}

//Recibimos lso datos cifrados de google en un array
if($container->google->getAccessToken()){
  $item = $container->google->verifyIdToken();

  $data = new class {};
  $data->name = $item["name"];
  $data->email = $item["email"];
  $data->image = $item["picture"];
  $data->password = "null";
  $data->encryptedEmail = "null";
  $data->mode = "google";
  $data->verification = 0;

  $response = \App\Controllers\UserController::googleRegister($data, $container);
  //echo $container->session->get("image");
}
*/
require BASE_ROOT.'app/routes/routes.php';
