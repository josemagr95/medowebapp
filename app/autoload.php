<?php
require BASE_ROOT.'vendor/autoload.php';

spl_autoload_register(function ($className) {
  $fileName = strtolower(preg_replace('/([a-z])([A-Z])/', '$1_$2', $className));
  $parts = explode('\\', $fileName);
  $parts = array_map('strtolower', $parts);
  require (BASE_ROOT . implode("/",$parts) . ".php");
});
