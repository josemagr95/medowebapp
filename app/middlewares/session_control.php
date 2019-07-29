<?php
namespace App\Middlewares;

class SessionControl
{
  protected $container;
  
  public function __construct($container) {
    $this->container = $container;
  }
  
  public function __invoke($request, $response, $next)
  {
    if(!$this->container->session->isLogged()) {
      $homeUrl = $this->container->router->pathFor("home", ["lang" => "en"]);
      return $response->withRedirect($homeUrl, 401);
    }
    
    $response = $next($request, $response);

    return $response;
  }
}
