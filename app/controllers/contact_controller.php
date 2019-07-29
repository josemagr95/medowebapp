<?php
namespace App\Controllers;

class ContactController extends AppController {

  public function sendForm($request, $response, $args) {
    $body="<h2>Formulario de contacto enviado desde me-do.cl</h2>";
    $body.="<p><strong>Idioma:</strong> ".$args['lang']."<br/>";
    $body.="<strong>Nombre:</strong> ".$request->getParam('name')."<br/>";
    $body.="<strong>E-mail:</strong> ".$request->getParam('email')."<br/>";
    $body.="<strong>Teléfono:</strong> ".$request->getParam('phone')."<br/>";
    $body.="<strong>Desea contactar con:</strong> ".$request->getParam('area')."<br/>";
    $body.="<strong>Mensaje:</strong><br/>".str_replace("\n","<br/>",$request->getParam('message'))."</p>";

    $this->c->mailer->send("info@me-do.cl","Formulario de contacto me-do.cl",$body);
    
    return "ok";
  }
}
