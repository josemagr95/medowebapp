<?php
namespace App\Controllers;

class MyDesignsController extends AppController {

  public function unauthorized() {
    header("HTTP/1.1 401 Unauthorized");
    header("Location: /");
    die();
  }

  public function getUser() {
    $user = \App\Models\User::getByEncryptedCredentials(
      $this->c->session->get('email'),
      $this->c->session->get('password')
    );
    if(!$user) $this->unauthorized();
    
    return $user;
  }

  public function getDesign($user,$designId) {
    $design =  $user->designs()->where('id',$designId)->find_one();
    if(!$design) $this->unauthorized();
    
    return $design;
  }

  public function saveScreenshot($request, $response, $args) {
    $user = $this->getUser();

    $imageName = $user->id."_".time().md5(rand(0,9999)).".png";
    $imagePath = BASE_ROOT.'public/media/images/designs/';

		//save original images
		\App\Core\Image::saveFromBase64($imagePath,$imageName,$request->getParam('img'));

		//resize and save versions		
		\App\Core\Image::resizeToHeightAndCrop($imagePath,$imageName,900,645);
		\App\Core\Image::saveScaledVersions($imagePath,$imageName);

    return $imageName;
  }

  public function list($request, $response, $args) {
    $user = $this->getUser();
    $designs =  $user->designs()->where_raw('collection_id>=6')->order_by_desc('created')->find_many();
    
    return $this->c->view->render($response, 'new/my-designs2.html', compact('user','designs'));
  }
  
  public function file($request, $response, $args) {
    $l = $args['lang'];
    $user = $this->getUser();
    $design = $this->getDesign($user,$args['designId']);
    $collection =  $design->collection()->find_one();
    $name_idiom = true;

    $params =  $design->shapediver_params;
    
    $textures = \ORM::for_table("textures")->raw_query("select shapediver_label,name_{$l} as name,image,shapediver_position from textures where active = '1' order by `shapediver_position` asc, id desc")->find_many();
    $paramDefinitions = \ORM::for_table("collections_parameters")->raw_query("select shapediver_label,name_{$l} as name from collections_parameters where collection_id = '".$collection->id."'")->find_many();
    $partDefinitions = \ORM::for_table("collections_parts")->raw_query("select shapediver_label,name_{$l} as name from collections_parts where collection_id = '".$collection->id."'")->find_many();

    if($request->getAttribute('route')->getName() == 'editMyDesign') {
      return $this->c->view->render($response, 'new/edit-my-design2.html', compact('user','design','collection','params','textures','paramDefinitions','partDefinitions','name_idiom'));
    } else {
      return $this->c->view->render($response, 'new/my-design2.html', compact('user','design','collection','params','paramDefinitions','partDefinitions', 'name_idiom'));
    }
  }
  
  public function create($request, $response, $args) {
    $user = $this->getUser();
    
    if($request->getParam('screenshot')=='') return false;

    $public = 0;
    if($request->getParam('gallery') == 'true') $public = 1;

    $design = \Model::factory('\App\Models\Design')->create();
    $design->collection_id = $request->getParam('collection');
    $design->user_id = $user->id;
    $design->screenshot = $request->getParam('screenshot');
    $design->name = $request->getParam('name');
    $design->description = $request->getParam('description');
    $design->shapediver_params = json_encode($request->getParam('parameters'));
    $design->public = $public;
    $design->save();
    
    return "{}";
  }
  
  public function update($request, $response, $args) {
    $user = $this->getUser();
    $design = $this->getDesign($user,$args['designId']);
    
    if($design) {
      $public = 0;
      if($request->getParam('gallery') == 'true') $public = 1;
      
      $design->screenshot = $request->getParam('screenshot');
      $design->name = $request->getParam('name');
      $design->description = $request->getParam('description');
      $design->shapediver_params = json_encode($request->getParam('parameters'));
      $design->public = $public;
      $design->save();
    }
    
    return "{}";
  }

  public function delete($request, $response, $args) {
    $user = $this->getUser();
    $design = $this->getDesign($user,$args['designId']);
    
    if($design) { 
      $design->delete();
    }

    $url = $this->c->router->pathFor("myDesigns", ["lang" => $args['lang']]);
    return $response->withRedirect($url);
  }
  
  public function export($request, $response, $args) {
    
    $allPostPutVars = $request->getParsedBody();
    $listUrl = $allPostPutVars['urls'];


    // Copy file form url
    copy($listUrl[0], 'dwg/Tmpfile.dwg.gz');

    // Open files in binary mode
    $file = gzopen('dwg/Tmpfile.dwg.gz', 'rb');
    $out_file = fopen('dwg/asdasd.dwg', 'wb'); 

    // Keep repeating until the end of the input file
    while (!gzeof($file)) {
        // Read buffer-size bytes
        fwrite($out_file, gzread($file, 4096));
    }

    //close files
    fclose($out_file);
    gzclose($file);

    echo("pasando2");


    /*
    // Email 
    $htmlEmail = '<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Document</title>
    </head>
    <body>
    <div style="width:100%; background:#eee; position:relative; font-family:sans-serif; padding-bottom:40px">
      <center>
        <img style="padding:20px; width:10%" src="https://i.ibb.co/p4WXmF4/logo.png">
      </center>
      <div style="position:relative; margin:auto; width:600px; background:white; padding:20px">
      <center>		
        <img style="padding:20px; width:15%" src="https://i.ibb.co/s1brQTs/Elementos-16.png">
        <h3 style="font-weight:100; color:#999">Links de descarga de materiales</h3>
        <hr style="border:1px solid #ccc; width:80%">';
    
    $links = '';
    for($i = 0; $i < count($listUrl)-1; $i++){
      $links .= '<h4 style="font-weight:100; color:#999; padding:0 20px"><strong>Material '.($i+1).' </stron></h4>
                  <a href="'.$listUrl[$i].'" target="_blank" style="text-decoration:none">
                  <div style="line-height:60px; background:	#8B4513; width:60%; color:white">Descargar Material '.($i+1).'</div>
                  </a>
                  <br>';
    }
    $links .= '<h4 style="font-weight:100; color:#999; padding:0 20px"><strong>Export Info</stron></h4>
                  <a href="'.end($listUrl).'" target="_blank" style="text-decoration:none">
                  <div style="line-height:60px; background:	#8B4513; width:60%; color:white">Descargar Info.txt</div>
                  </a>
                  <br>';
        
    $htmlEmail .= $links;
    $htmlEmail .= '<hr style="border:1px solid #ccc; width:80%">
                  <h5 style="font-weight:100; color:#999">Si no se inscribió en esta cuenta, puede ignorar este correo electrónico y la cuenta se eliminará.</h5>
                  </center>
                  </div>
                  </div>
                  </body>
                  </html>';

    echo $htmlEmail;
    */
    //$this->c->mailer->send('cristobalkarich@gmail.com','Materiales Orden de compra #1', $htmlEmail);

  }

}



