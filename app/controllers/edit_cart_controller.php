<?php
namespace App\Controllers;

class EditCartController extends AppController {

  public function editCart($request, $response, $args) {

    $l = $args['lang'];
    $collectionSlug = $args['collectionSlug'];
    $position = $args['position'];

    $collections = \ORM::for_table("collections")->raw_query("select id,name_{$l} as name,description_{$l} as description,slug,image from collections where active = '1' and id<=6 order by `order` asc, id desc")->find_many();
    $currentCollection = \ORM::for_table("collections")->raw_query(
      "select c.id as id, c.name_{$l} as name, c.description_{$l} as description, c.slug as slug, c.image as image, c.shapediver_id as shapediver_id, c.shapediver_ticket as shapediver_ticket, d.name as designer, d.image as designer_image
      from collections c
      inner join designers d on c.designer_id = d.id
      where slug='{$collectionSlug}'")->find_one();
    
    
    $textures = \ORM::for_table("textures")->raw_query("select shapediver_label,name_{$l} as name,image,shapediver_position from textures where active = '1' order by `shapediver_position` asc, id desc")->find_many();
    $paramDefinitions = \ORM::for_table("collections_parameters")->raw_query("select shapediver_label,name_{$l} as name from collections_parameters where collection_id = '".$currentCollection->id."'")->find_many();
    $partDefinitions = \ORM::for_table("collections_parts")->raw_query("select shapediver_label,name_{$l} as name from collections_parts where collection_id = '".$currentCollection->id."'")->find_many();
    
    return $this->c->view->render($response, 'new/edit_cart.html', compact('collections','currentCollection','textures','paramDefinitions','partDefinitions','position'));
      
    }
}
