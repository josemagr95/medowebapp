<?php
namespace App\Controllers;

class CollectionController2 extends AppController {

  public function list($request, $response, $args) {
    $l = $args['lang'];
    $collections = \ORM::for_table("collections")->raw_query(
    "select c.id as id, c.name_{$l} as name, c.description_{$l} as description, c.slug as slug, c.image as image, 
    c.shapediver_ticket as shapediver_ticket, d.name as designer, d.id as designer_id, d.image as designer_image
    from collections c
    join designers d on c.designer_id = d.id
    where active='1' and c.id >= 6 order by `order` asc, c.id desc")->find_many();
    if(count($collections)) {
      foreach($collections as $i=>$collection) {
        $images = \ORM::for_table("collections_images")->raw_query("select file from collections_images where id = '{$collection->id}' order by `order` asc, id desc")->find_many();
        $collections[$i]->gallery = $images;
      }
    }

    return $this->c->view->render($response, 'new/collections2.html', compact('collections'));
  }
  
  public function file($request, $response, $args) {
    $l = $args['lang'];
    $collectionSlug = $args['collectionSlug'];

    $collections = \ORM::for_table("collections")->raw_query("select id,name_{$l} as name,description_{$l} as description,slug,image from collections where active = '1' and id<=6 order by `order` asc, id desc")->find_many();
    $currentCollection = \ORM::for_table("collections")->raw_query(
      "select c.id as id, c.name_{$l} as name, c.description_{$l} as description, c.slug as slug, c.image as image,
      c.shapediver_ticket as shapediver_ticket, d.name as designer, d.image as designer_image,
      d.id as designer_id
      from collections c
      inner join designers d on c.designer_id = d.id
      where slug='{$collectionSlug}'")->find_one();

    if(!$currentCollection) {
      throw new \Slim\Exception\NotFoundException($request, $response);
    }

    //Images from collection
    $imagesCollection = \ORM::for_table("collections_images")->raw_query("select * from collections_images where collection_id = '".$currentCollection->id."'")->find_many();
    
    $name_idiom = false; //para saber el nombre que tomar en configurator.html
    
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
    
    return $this->c->view->render($response, 'new/collection2.html', compact('collections','currentCollection','params','textures','paramDefinitions','partDefinitions', 'name_idiom', 'imagesCollection'));
  }
}
