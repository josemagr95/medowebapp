<?php
namespace App\Models;

class Design extends AppModel {
  static $_table = 'designs';

  public function collection() {
    return $this->belongs_to('App\Models\Collection','collection_id');
  }
  
  public function author() {
    return $this->belongs_to('App\Models\User','user_id')->find_one();
  }
  
  public function rating() {
    return round($this->has_many('App\Models\DesignRating','design_id')->avg('rating'));
  }
  
  public function comments() {
    return $this->has_many('App\Models\DesignComment','design_id');
  }

}
