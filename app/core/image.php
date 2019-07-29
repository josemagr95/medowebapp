<?php 
namespace App\Core;

class Image extends \Eventviva\ImageResize {

	public static function saveFromBase64($imagePath,$imageName,$data) {
    $data = str_replace("data:image/png;base64,","",$data);
    $data = str_replace(' ', '+', $data);
    $img = base64_decode($data);
    file_put_contents($imagePath.$imageName, $img);
	}

  public static function resizeToHeightAndCrop($imagePath,$imageName,$width,$height) {
    $image = new self($imagePath.$imageName);
    $image->resizeToHeight($height,true);
		$image->quality_png = 2;
    $image->save($imagePath.$imageName);
  
    $image = new self($imagePath.$imageName);
		if($image->getSourceWidth()<$width) {
			$image->resizeToWidth($width,true);
			$image->quality_png = 2;
			$image->save($imagePath.$imageName);
		}
 
    $image = new self($imagePath.$imageName);
    $image->crop($width,$height);
		$image->quality_png = 2;
    $image->save($imagePath.$imageName);
  }


	public static function saveScaledVersions($imagePath,$imageName) {
		$versions = ["m"=>50,"s"=>25,"xs"=>12];
	
		foreach($versions as $prefix => $scale) {	
			$image = new self($imagePath.$imageName);
			$image->quality_png = 2;
			$image->scale($scale);
			$image->save($imagePath.$prefix."-".$imageName);
		}
	}

}
