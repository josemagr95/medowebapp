<?php
namespace App\Models;

class UserSession extends \SlimSession\Helper {
  
  public function isLogged() {
    if($this->get('email')!='') {
      $user = \Model::factory('App\Models\User')
        ->where('email', $this->get('email'))
        ->where('password', $this->get('password'))
        ->where('verification', '0')
        ->find_one();

      if($user) return true;
    }

    return false;
  }
  
  public function login($user) {
    
    if($user) {
      $this->set('id', $user->id);
      $this->set('name',$user->name);
      $this->set('surname', $user->surname);
      $this->set('email',$user->email);
      $this->set('password',$user->password);
      $this->set('birthday', $user->birthday);
      $this->set('gender', $user->gender);
      $this->set('phone', $user->phone);
      $this->set('image',$user->image);
      $this->set('region',$user->region);
      $this->set('commune',$user->commune);
      $this->set('address',$user->address);
      $this->set('dpto',$user->dpto);
      $this->set('mode',$user->mode);

      $user->last_login = date("Y-m-d H:i:s");
      $user->save();

      //echo $this->get("name");
      return true;
    } else {
      $this::destroy();
      return false;
    }
  }

  public function logout() {
    $this::destroy();
  }

  public function getId(){
    $user = \Model::factory('App\Models\User')
    ->where('email', $this->get('user_email'))
    ->find_one();
    var_dump($user);
    return $user;
  }
}
