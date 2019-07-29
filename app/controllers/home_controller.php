<?php
namespace App\Controllers;

class HomeController extends AppController {

  public function show($request, $response, $args) {
    $l = $args['lang'];
		$query = \ORM::for_table("collections")->raw_query(
      "select c.name_{$l} as name, c.designer_id as designerId, d.name as designer, c.slug, c.description_{$l} as description, c.shapediver_ticket, c.image, c.created 
      from collections c inner join designers d on c.designer_id = d.id
      where active ='1' and home = '1'")->find_many();
    $collections = array_chunk($query,4);
    $slider_images = \ORM::for_table("slider_images")->raw_query(
      "select id, text_{$l} as text, image from slider_images"
    )->find_many();
    //return $this->c->view->render($response, 'website/home.html', compact('trendPages'));
    return $this->c->view->render($response, 'new/home2.html', compact('collections', 'slider_images'));
  }
}
