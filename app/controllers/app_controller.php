<?php
namespace App\Controllers;

class AppController {
   protected $c;
   
   public function __construct(\Interop\Container\ContainerInterface $c) {
       $this->c = $c;
   } 
}
