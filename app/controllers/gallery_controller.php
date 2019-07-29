<?php
namespace App\Controllers;

class GalleryController extends AppController {
  
  public function unauthorized() {
    header("HTTP/1.1 401 Unauthorized");
    header("Location: /");
    die();
  }
  
  public function list($request, $response, $args) {
    $filters = new \Stdclass();
    $filters->search = $request->getParam('search');
    $filters->collection = $request->getParam('collection');
    $filters->order_by = $request->getParam('order_by');
    
    $collections = \Model::factory('\App\Models\Collection')
      ->where('active', '1')
      ->where_raw('id>=6')
      ->order_by_asc('order')
      ->find_many();

    //Designs
    $order_by="d.created desc"; //default order_by date
    if($filters->order_by == 'rating') $order_by = "rating desc,d.created desc"; //order by rating

    $where=""; 
    if($filters->collection != "" && $filters->collection!="all") {
      $where.=" and c.slug = '".$filters->collection."'";
    }
    if($filters->search != "") {
      $where.=" and concat(u.name,' ',c.name_{$args['lang']},' ',d.description) like '%".$filters->search."%'";
    }
    
    //design atributes
    $sql_attributes = "
        d.id as id,
        d.description as description,
        d.screenshot as screenshot,
        d.created as created,
        u.name as author,
        (select round(avg(rating)) from design_ratings r where r.design_id = d.id) as rating
    ";
    
    $sql_from = "
      FROM designs d
      INNER JOIN user u ON u.id = d.user_id
      INNER JOIN collections c ON c.id = d.collection_id

      WHERE 
        d.public = '1' 
        and d.collection_id >= 6 
        {$where}";
      
    
    $pager = new \App\Core\Pager(
      \ORM::for_table('designs')
      ->raw_query("select count(*) as total ".$sql_from)
      ->find_one()->total, 
      $request->getParam('page')
    );

    $designs = \ORM::for_table('designs')
      ->raw_query("SELECT ".$sql_attributes." ".$sql_from."ORDER BY {$order_by} LIMIT ".$pager->start.",".$pager->items_by_page)
      ->find_many();
    
    return $this->c->view->render($response, 'new/gallery2.html', compact('designs','collections','filters','pager'));
  }
  
  public function file($request, $response, $args) {
    $design = \Model::factory('\App\Models\Design')
      ->where('public', '1')
      ->where('id', $args['designId'])
      ->find_one();
    
    if(!$design) {
      throw new \Slim\Exception\NotFoundException($request, $response);
    }

    $collection = $design->collection()->find_one(); //find on collection where id is id_collection comming from the $design object
    $comments = $design->comments()->order_by_desc("created")->find_many(); //find on design_comments where design_id is the id of the $design 
    $name_idiom = true;

    $user = \App\Models\User::getByEncryptedCredentials(
      $this->c->session->get('email')
    );
   
    if($user) {
      $userRating = \Model::factory('\App\Models\DesignRating')
        ->where('design_id',$design->id)
        ->where('user_id',$user->id)->find_one();
    }

    $backUrl = "/";
    if(isset($_SERVER['HTTP_REFERER'])) print_r($_SERVER['HTTP_REFERER']); $backUrl = $_SERVER['HTTP_REFERER'];
    
    if(!strpos($backUrl,"/gallery?")) {
      $backUrl = "/".$args['lang']."/gallery";
    }
    
    $params =  $design->shapediver_params;

    return $this->c->view->render($response, 'new/gallery-design2.html', compact('design','params','collection','comments','user','userRating','backUrl','name_idiom'));
  }

  public function rateDesign($request, $response, $args) {
    $user = \App\Models\User::getByEncryptedCredentials(
      $this->c->session->get('user_email'),
      $this->c->session->get('user_password')
    );

    if($user) {
      $rating = $request->getParam("rating");
      $design_id = $request->getParam("design_id");

      $designRating = \Model::factory('\App\Models\DesignRating')
        ->where('design_id',$design_id)
        ->where('user_id',$user->id)->find_one();

      if(!$designRating) $designRating = \Model::factory('\App\Models\DesignRating')->create();

      $designRating->user_id = $user->id;
      $designRating->design_id = $design_id;
      $designRating->rating = $rating;
      $designRating->save();
    }

    $design = \Model::factory('\App\Models\Design')
      ->where('public', '1')
      ->where('id', $design_id)
      ->find_one();
    
    return (string)$design->rating();
  }
  
  public function leaveComment($request, $response, $args) {
    $user = \App\Models\User::getByEncryptedCredentials(
      $this->c->session->get('email')
    );
    if(!$user) $this->unauthorized();

    if(strlen(trim($request->getParam('comment')))>0) {
      $comment = \Model::factory('\App\Models\DesignComment')->create();
      $comment->design_id = $args['designId'];
      $comment->user_id = $user->id;
      $comment->comment = $request->getParam('comment');
      $comment->save();
    }

    $url = $this->c->router->pathFor("showGalleryDesign", ["lang" => $args['lang'],"designId" => $args['designId']])."#comments";

    return $response->withRedirect($url);
  }
  
  public function deleteComment($request, $response, $args) {
    $user = \App\Models\User::getByEncryptedCredentials(
      $this->c->session->get('email')
    );
    if(!$user) $this->unauthorized();

    $comment = $user->comments()->find_one($request->getParam('comment_id'));
    if(!$comment) $this->unauthorized();
    $comment->delete();

    $url = $this->c->router->pathFor("showGalleryDesign", ["lang" => $args['lang'],"designId" => $args['designId']])."#comments";

    return $response->withRedirect($url);
  }
}
