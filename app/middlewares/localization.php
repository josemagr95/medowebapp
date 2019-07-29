<?php
namespace App\Middlewares;

class Localization
{
  protected $container;
  
  public function __construct($container) {
    $this->container = $container;
  }
  
  public function __invoke($request, $response, $next)
  {
    $route = $request->getAttribute('route'); 
   	if(!$route) {
    	throw new \Slim\Exception\NotFoundException($request, $response);
		}
  
    $routeArguments = $route->getArguments();
    $routeName = $route->getName();

    $availableLangs = $this->container->get('settings')['availableLangs'];

    //check language
    if(isset($routeArguments['lang'])) {
      if(!isset($availableLangs[$routeArguments['lang']])) {
        throw new \Slim\Exception\NotFoundException($request, $response);
      }
      
      $lang = $availableLangs[$routeArguments['lang']]; 
 
      //set lang & locale 
      $this->container->view->getEnvironment()->addGlobal('LANG',$lang['iso']);
      $this->container->view->getEnvironment()->addGlobal('LOCALE',$lang['locale']);
     
      //set translations
      $t = [];
      $translations = \ORM::for_table("texts")->raw_query("select `key`,text_{$lang['iso']} as text,html from texts")->find_many();
      foreach($translations as $translation) {
        $t[$translation['key']] = $translation['text'];
      }
      $this->container->view->getEnvironment()->addGlobal('T',$t);

      //get static images from bd
      $i = [];
      $images = \ORM::for_table("images")->raw_query("select * from images")->find_many();
      foreach($images as $image){
        $i[$image['key']] = $image['route'];
      }
      $this->container->view->getEnvironment()->addGlobal('I', $i);

      //get terms and conditions texts
      $terms = [];
      $terms_conditions = \ORM::for_table("terms_texts")->raw_query("select `key`, name_{$lang['iso']} as name, text_{$lang['iso']} as text from terms_texts")->find_many();
      foreach($terms_conditions as $term){
        $terms[$term['key']] = [$term['key'], $term['name'], $term['text']];
      }
      $this->container->view->getEnvironment()->addGlobal('Terms', $terms);

      //get terms and conditions texts
      $freq = [];
      $freq_items = \ORM::for_table("freq_items")->raw_query("select id, `key`, name_{$lang['iso']} as name from freq_items")->find_many();
      $freq_questions = [];

      foreach($freq_items as $item){
      
        $freq_questions_items = \ORM::for_table("freq_questions")->raw_query("select question_{$lang['iso']} as question, text_{$lang['iso']} as text from freq_questions WHERE `freq_item_id`=".$item->id)->find_many();
        
        $questions = [];
        foreach($freq_questions_items as $question){
          array_push($questions, [$question['question'], $question['text']]);
          //var_dump($freq_questions);
        }
        $freq_questions[$item['key']] = $questions;

        $freq[$item['key']] = [$item['key'], $item['name']];
      }
      $this->container->view->getEnvironment()->addGlobal('Freq', $freq);
      $this->container->view->getEnvironment()->addGlobal('Freq_questions', $freq_questions);

      //set current page URL for other languages
      $hreflang = [];
      foreach($availableLangs as $l) {
        $destinationArguments = $routeArguments;
        $destinationArguments['lang'] = $l['iso'];
        $hreflang[$l['iso']]['label'] = $l['name'];
        $hreflang[$l['iso']]['url'] = $this->container->router->pathFor($routeName, $destinationArguments);
      }
      $this->container->view->getEnvironment()->addGlobal('HREFLANG',$hreflang);
    }

    $response = $next($request, $response);

    return $response;
  }
}
