<?php
namespace App\Controllers;

class DesignerController extends AppController {

  public function list($request, $response, $args){
    $designers = \ORM::for_table("designers")->raw_query("select * FROM designers")->find_many();

    return $this->c->view->render($response, 'new/designers2.html', compact('designers'));
  }

  public function file($request, $response, $args){

    $l = $args['lang'];

    $designerId = $args['designerId'];

    $designer = \ORM::for_table("designers")->raw_query("SELECT name, alias, pais, image, video, description_{$l} as description, web from designers WHERE id=". $designerId)->find_one();
    if(!$designer) {
      throw new \Slim\Exception\NotFoundException($request, $response);
    }

    $designerCollections = \ORM::for_table("collections")->raw_query("select id, name_{$l} as name, description_{$l} as description, slug, image from collections WHERE active = '1' and designer_id=". $designerId)->find_many();

    return $this->c->view->render($response, 'new/designer2.html', compact('designer', 'designerCollections'));

  }
}