<?php
namespace App\Core;


class Mailer 
{
  private $settings;
  private $mode;

  function __construct($settings = [], $mode = "production")
  {
      $this->mode = $mode;
      $this->settings = $settings;
  }

  public function send($recipients,$subject,$body,$from="",$fromName="")
  {
    
    $mailer = new \PHPMailer();
    
    $mailer->isSMTP();
    $mailer->SMTPAuth = true;
    $mailer->SMTPAutoTLS = false;
    //$mailer->SMTPSecure = "ssl";
    $mailer->SMTPSecure = "tls";
    $mailer->isHTML(true);
    $mailer->CharSet = 'utf-8';
    $mailer->SMTPOptions = array(
      'ssl' => array(
      'verify_peer' => false,
      'verify_peer_name' => false,
      'allow_self_signed' => true
      )
    );
    
    $mailer->Host = $this->settings['host'];
    $mailer->Port = $this->settings['port'];
    $mailer->Username = $this->settings['user'];
    $mailer->Password = $this->settings['password'];
    
    $mailer->From = $this->settings['defaultFrom'];
    $mailer->FromName = $this->settings['defaultFromName'];

    
    if($from!="") $mailer->From = $from;
    if($fromName!="") $mailer->FromName = $fromName;
   
    if($this->mode != 'production') {
      $mailer->addAddress($this->settings['developmentRecipient']);
    } else {
      foreach(explode(";",$recipients) as $recipient) $mailer->addAddress($recipient);
    }

    $mailer->Subject = $subject;
    $mailer->Body = $body;
    $mailer->AltBody = strip_tags($body);

    try {
      $mailer->send(); 
    }  catch (phpmailerException $e) {
      error_log($e->errorMessage()); //Pretty error messages from PHPMailer
      } catch (Exception $e) {
        error_log($e->getMessage()); //Boring error messages from anything else!
      }
  }
}
