<?php
namespace App\Controllers;

class TransbankController extends AppController {

  public function testTransaction(){
    $amount = 1000;
    // Identificador que será retornado en el callback de resultado:
    $sessionId = "mi-id-de-sesion";
    // Identificador único de orden de compra:
    $buyOrder = strval(rand(100000, 999999999));
    $returnUrl = "https://me-do.cl/en/2/order-detail";
    $finalUrl = "https://me-do.cl/en/2/order-detail";

    $initResult = $this->c->transbank->initTransaction($amount, $buyOrder, $sessionId, $returnUrl, $finalUrl);

    $formAction = $initResult->url;
    $tokenWs = $initResult->token;
  }
}