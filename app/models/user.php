<?php
namespace App\Models;

require_once __DIR__ . "/../config/config.php";

class User extends AppModel {
  static $_table = 'user';

  /*
  public static function hashPassword($password) {
    return hash('sha256', $password.\App\Config\Config::$config['userSalt']);
  }
  
  public static function getByCredentials($email,$password) {
    $password = self::hashPassword($password); 
    
    $user = \Model::factory(__CLASS__)
      ->where('email', $email)
      ->where('password', $password)
      ->where('active', '1')
      ->find_one();
    
    return $user;
  }
  */
  public static function getByEncryptedCredentials($email) {
    $user = \Model::factory(__CLASS__)
      ->where('email', $email)
      //->where('password', $password)
      //->where('verification', '0')
      ->find_one();
    
    return $user;
  }
/*
  public static function signup($userInfo) {
    //$pepper = rand(99999,999999);
    //$hash = hash('sha256',"_".$userInfo->email."_".rand(0,99999));
    
    $user = \Model::factory(__CLASS__)->create();
    $user->name = $userInfo->name;
    $user->email = $userInfo->email;
    //$user->hash = $hash;
    //$user->pepper = $pepper;
    $user->password = self::hashPassword($userInfo->password);
    $user->verification = 1;
    $user->save();
  }
 
  public function setPassword($password) {
    $password = self::hashPassword($password); 
    $this->password = $password;
    $this->save();

    return $password; 
  }
*/
  public function designs() {
    return $this->has_many('App\Models\Design','user_id');
  }
  
  public function comments() {
    return $this->has_many('App\Models\DesignComment','user_id');
  }

  public static function signup($data){
    try{
      $user = \Model::factory(__CLASS__)->create();
      $user->name = $data->name;
      $user->email = $data->email;
      $user->password = $data->password;
      // $user->birthday = $data->birthday;
      $user->mode = $data->mode;
      $user->encryptedEmail = $data->encryptedEmail;
      $user->verification = $data->verification;
      $user->save();
      return "ok";
    }
    catch(Exception $e){
      return "error";
    }
    

  }
}
