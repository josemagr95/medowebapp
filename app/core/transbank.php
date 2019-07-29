<?php
namespace App\Core;

use Transbank\Webpay\Configuration;
use Transbank\Webpay\Webpay;


class Transbank{
  public $transaction;

  function __construct()
  {
      $this->$transaction = (new Webpay(Configuration::forTestingWebpayPlusNormal()))->getNormalTransaction();
  }

}



