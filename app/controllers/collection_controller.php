<?php
namespace App\Controllers;

class CollectionController extends AppController {

  public function list($request, $response, $args) {
    $l = $args['lang'];
    $collections = \ORM::for_table("collections")->raw_query("select id,name_{$l} as name,description_{$l} as description,slug,image from collections where active='1' and id >= 6 order by `order` asc, id desc")->find_many();
    if(count($collections)) {
      foreach($collections as $i=>$collection) {
        $images = \ORM::for_table("collections_images")->raw_query("select file from collections_images where id = '{$collection->id}' order by `order` asc, id desc")->find_many();
        $collections[$i]->gallery = $images;
      }
    }

    return $this->c->view->render($response, 'website/collections.html', compact('collections'));
  }
  
  public function file($request, $response, $args) {
    $l = $args['lang'];
    $collectionSlug = $args['collectionSlug'];

    $collections = \ORM::for_table("collections")->raw_query("select id,name_{$l} as name,description_{$l} as description,slug,image from collections where active = '1' and id<=6 order by `order` asc, id desc")->find_many();
    $currentCollection = \ORM::for_table("collections")->raw_query("select id,name_{$l} as name,description_{$l} as description,slug, image, shapediver_id,shapediver_ticket, d.name from collections inner join designers d ON d.id = designer_id where slug='{$collectionSlug}'")->find_one();

    if(!$currentCollection) {
      throw new \Slim\Exception\NotFoundException($request, $response);
    }
       
    $textures = \ORM::for_table("textures")->raw_query("select shapediver_label,name_{$l} as name,image,shapediver_position from textures where active = '1' order by `shapediver_position` asc, id desc")->find_many();
    $paramDefinitions = \ORM::for_table("collections_parameters")->raw_query("select shapediver_label,name_{$l} as name from collections_parameters where collection_id = '".$currentCollection->id."'")->find_many();
    $partDefinitions = \ORM::for_table("collections_parts")->raw_query("select shapediver_label,name_{$l} as name from collections_parts where collection_id = '".$currentCollection->id."'")->find_many();

    //load configuration from design
    $params = "";
    if($request->getParam("fromDesign")) {
      $design = \Model::factory('\App\Models\Design')
        ->where('public', '1')
        ->where('id', $request->getParam("fromDesign"))
        ->find_one();

      $params = $design->shapediver_params;
    }
    
    return $this->c->view->render($response, 'website/collection.html', compact('collections','currentCollection','params','textures','paramDefinitions','partDefinitions'));
  }
}
