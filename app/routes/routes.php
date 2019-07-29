<?php
$app->add(new App\Middlewares\Localization($app->getContainer()));
$app->add(new App\Middlewares\TrailingSlash());

$app->get('/', function ($request, $response) {
  $url = $this->router->pathFor('home', ['lang'=>'en']);
  return $response->withRedirect($url, 301);
});

$app->group('/{lang}', function() use($app){
  $this->get('', \App\Controllers\HomeController::class . ':show')->setName('home');

  $app->get('/about', function ($request, $response) {
    return $this->view->render($response, 'website/about.html' );
  })->setName('about');
  
  $app->group('/collections', function () {
    $this->get('', '\App\Controllers\CollectionController:list')->setName('collections');
    $this->get('/{collectionSlug}', '\App\Controllers\CollectionController:file')->setName('collection');
  });
  
  $app->group('/designers', function (){
    $this->get('', '\App\Controllers\DesignerController:list')->setName('designers');
    $this->get('/{designerId}', '\App\Controllers\DesignerController:file')->setName('designer');
  });

  $app->get('/carrito', function($request, $response){
    return $this->view->render($response, 'website/carrito.html');
  })->setName('carrito');
  
  $app->get('/contact', function ($request, $response) {
    return $this->view->render($response, 'website/contact.html' );
  })->setName('contact');
  $app->post('/contact', '\App\Controllers\ContactController:sendForm')->setName('sendContactForm');
  
  $app->get('/legal', function ($request, $response) {
    return $this->view->render($response, 'website/legal.html' );
  })->setName('legal');

  $app->get('/profile', function ($request, $response) {
    return $this->view->render($response, 'new/myaccount.html' );
  })->setName('profile');
  
  $app->group('/user', function() use($app){
    $this->post('/login', '\App\Controllers\UserController:login')->setName('login');
    //$this->get('/logout', '\App\Controllers\UserController:logout')->setName('logout');
    $this->post('/signup', '\App\Controllers\UserController:signup')->setName('signup');
   // $this->post('/update', '\App\Controllers\UserController:update')->setName('updateProfile');
    $this->post('/change-password', '\App\Controllers\UserController:changePassword')->setName('changePassword');
    $this->post('/recover-password', '\App\Controllers\UserController:recoverPassword')->setName('recoverPassword');
    $this->get('/set-password/{hash}/{pepper}', '\App\Controllers\UserController:setPassword')->setName('resetPassword');
    $this->post('/set-password/{hash}/{pepper}', '\App\Controllers\UserController:updatePasswordFromHash')->setName('setPassword');
  });
  
  $app->group('/my-designs', function() use($app){
    $this->get('', '\App\Controllers\MyDesignsController:list')->setName('myDesigns');
    $this->get('/{designId}', '\App\Controllers\MyDesignsController:file')->setName('showMyDesign');
    $this->get('/{designId}/edit', '\App\Controllers\MyDesignsController:file')->setName('editMyDesign');
    $this->post('/{designId}/update', '\App\Controllers\MyDesignsController:update')->setName('updateMyDesign');
    $this->get('/{designId}/delete', '\App\Controllers\MyDesignsController:delete')->setName('deleteMyDesign');
    $this->post('/save-screenshot', '\App\Controllers\MyDesignsController:saveScreenshot')->setName('saveScreenshot');
    $this->post('/create', '\App\Controllers\MyDesignsController:create')->setName('createDesign');
    $this->post('/export', '\App\Controllers\MyDesignsController:export')->setName('export');
  })->add(new App\Middlewares\SessionControl($app->getContainer()));
  
  $app->group('/gallery', function() use($app){
    $this->get('', '\App\Controllers\GalleryController:list')->setName('gallery');
    $this->get('/{designId}', '\App\Controllers\GalleryController:file')->setName('showGalleryDesign');
    $this->post('/rate-design', '\App\Controllers\GalleryController:rateDesign')->setName('rateDesign');
    $this->get('/{designId}/delete-comment', '\App\Controllers\GalleryController:deleteComment')->setName('deleteComment');
    $this->post('/{designId}/leave-comment', '\App\Controllers\GalleryController:leaveComment')->setName('leaveComment');
  });
   
});

  /*-------------------------------------------------*/
  /*--------------------  NEW  --------------------- */
  /*-------------------------------------------------*/

$app->group('/{lang}/2', function() use($app){

  $this->get('', \App\Controllers\HomeController::class . ':show')->setName('home2');

  /** Login and Register **/

  $app->get('/register', function($request, $response){
    return $this->view->render($response, 'new/register.html');
  })->setName('register');

  $app->group('/user2',  function() use($app){
    $this->post('/signup', '\App\Controllers\UserController:ctrSignUp')->setName('signup2');
    $this->get('/verificar/{emailId}', '\App\Controllers\UserController:verificar')->setName('verificar');
    $this->post('/existingEmail', '\App\Controllers\UserController:existingEmail')->setName('existingEmail');
    $this->post('/login', '\App\Controllers\UserController:login')->setName('login2');
    $this->get('/logout', '\App\Controllers\UserController:logout')->setName('logout');
    $this->post('/send-password', '\App\Controllers\UserController:sendPassword')->setName('send-password');
    $this->post('/facebookRegister', '\App\Controllers\UserController:facebookRegister')->setName('facebookRegister');
    $this->post('/updateProfile', '\App\Controllers\UserController:updateProfile')->setName('updateProfile');
    $app->group('/address', function() use ($app){
      $this->get('', '\App\Controllers\UserController:address')->setName('address');
      $this->post('/update', '\App\Controllers\UserController:updateAddress')->setName('updateAddress');
    });
  });

  $app->get('/recover-password', function($request, $response){
    $this->session->delete('env-password');
    return $this->view->render($response, 'new/recover-password.html');
  })->setName('recover-password');

  $app->get('/terms', function ($request, $response) {
    return $this->view->render($response, 'new/terms.html' );
  })->setName('terms');

  $app->group('/collections2', function () {
    $this->get('', '\App\Controllers\CollectionController2:list')->setName('collections2');
    $this->get('/{collectionSlug}', '\App\Controllers\CollectionController2:file')->setName('collection2');
  });

  $app->group('/editCart', function () {
    $this->get('/{collectionSlug}/{position}', '\App\Controllers\EditCartController:editCart')->setName('editCart');
  });


  $app->get('/contact2', function ($request, $response) {
    return $this->view->render($response, 'new/contact2.html' );
  })->setName('contact2');
  //$app->post('/contact', '\App\Controllers\ContactController:sendForm')->setName('sendContactForm');

  $app->get('/about2', function ($request, $response) {
    return $this->view->render($response, 'new/about2.html' );
  })->setName('about2');

  $app->group('/gallery2', function() use($app){
    $this->get('', '\App\Controllers\GalleryController:list')->setName('gallery2');
    $this->get('/{designId}', '\App\Controllers\GalleryController:file')->setName('showGalleryDesign2');
    $this->post('/rate-design', '\App\Controllers\GalleryController:rateDesign')->setName('rateDesign2');
    $this->get('/{designId}/delete-comment', '\App\Controllers\GalleryController:deleteComment')->setName('deleteComment2');
    $this->post('/{designId}/leave-comment', '\App\Controllers\GalleryController:leaveComment')->setName('leaveComment2');
  });

  $app->group('/designers2', function (){
    $this->get('', '\App\Controllers\DesignerController:list')->setName('designers2');
    $this->get('/{designerId}', '\App\Controllers\DesignerController:file')->setName('designer2');
  });

  $app->get('/cart', function($request, $response){
    return $this->view->render($response, 'new/cart.html');
  })->setName('cart');


  $app->get('/checkout', function ($request, $response) {
    return $this->view->render($response, 'new/checkout.html' );
  })->setName('checkout');

  $app->get('/order-detail', function ($request, $response) {
    return $this->view->render($response, 'new/order-detail.html' );
  })->setName('order');

  $app->get('/myaccount', function ($request, $response) {
    return $this->view->render($response, 'new/myaccount.html' );
  })->setName('myaccount');

  $app->group('/my-designs2', function() use($app){
    $this->get('', '\App\Controllers\MyDesignsController:list')->setName('myDesigns2');
    $this->get('/{designId}', '\App\Controllers\MyDesignsController:file')->setName('showMyDesign2');
    //$this->get('/{designId}/edit', '\App\Controllers\MyDesignsController:file')->setName('editMyDesign');
    //$this->post('/{designId}/update', '\App\Controllers\MyDesignsController:update')->setName('updateMyDesign');
    //$this->get('/{designId}/delete', '\App\Controllers\MyDesignsController:delete')->setName('deleteMyDesign');
    //$this->post('/save-screenshot', '\App\Controllers\MyDesignsController:saveScreenshot')->setName('saveScreenshot');
    //$this->post('/create', '\App\Controllers\MyDesignsController:create')->setName('createDesign');
    //$this->post('/export', '\App\Controllers\MyDesignsController:export')->setName('export');
  })->add(new App\Middlewares\SessionControl($app->getContainer()));
  

  $app->get('/myorders', function ($request, $response) {
    return $this->view->render($response, 'new/myorders.html' );
  })->setName('myOrders');

  $app->get('/instructions', function ($request, $response) {
    return $this->view->render($response, 'new/instructions.html' );
  })->setName('instructions');

  $app->get('/freq', function ($request, $response) {
    return $this->view->render($response, 'new/freq.html' );
  })->setName('freq');

  $app->get('/service', function ($request, $response) {
    return $this->view->render($response, 'new/service.html' );
  })->setName('service');

  /*--------------------  ENDNEW  ---------------------- */
});
