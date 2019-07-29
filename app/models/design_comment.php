<?php
namespace App\Models;

class DesignComment extends AppModel {
  static $_table = 'design_comments';
  
  public function author() {
    return $this->belongs_to('App\Models\User','user_id')->find_one();
  }
}
