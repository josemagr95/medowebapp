<?php
namespace App\Core;

class Pager {
  public $items_by_page;
  public $total;
  public $page;

  function __construct($total,$page,$items_by_page = 24) {
    $this->items_by_page = $items_by_page;
    $this->total = $total;
    
    //The first time $page is "" -> page = 1
    if($page =="") $this->page = 1;
    else $this->page = $page;
    $this->start = ($this->page-1)*$this->items_by_page;
  }

  public function getPageUrl($page) {
    $url = parse_url($_SERVER['REQUEST_URI']);

    if(isset($url['query'])) parse_str($url['query'],$params);
    else $params = [];

    $params['page'] = $page;
    
    return $url['path'] . "?" . http_build_query($params);
  }

  public function nextPageUrl() {
    if($this->total>$this->start+$this->items_by_page) {
      return $this->getPageUrl($this->page + 1);
    } else {
      return false;
    }
  }
  
  public function previousPageUrl() {
    if($this->page>1) {
      return $this->getPageUrl($this->page - 1);
    } else {
      return false;
    }
  }
}
