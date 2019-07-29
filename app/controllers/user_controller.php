<?php
namespace App\Controllers;

class UserController extends AppController {
 /*
  public function signup($request, $response, $args) {
    $result = [];
    $result['success'] = true;
    $result['redirectView'] = "register_confirmation";
    $result['errors'] = [];
    $result['wrongFields'] =[];

    //Validate
    //>required
    $required_fields = ["register-form-name","register-form-email","register-form-password"];
    foreach($required_fields as $field) {
      if(trim($request->getParam($field)) == "") {
        if(!in_array("required",$result['errors'])) {
          $result['errors'][] ="required";
        }
        
        $result['wrongFields'][] = $field;
      }
    }

    //> valid email
    if(!in_array("register-form-email",$result['wrongFields']) && !\App\Core\Helpers::isEmail($request->getParam("register-form-email"))) {
      $result['errors'][] ="mail";
      
      if(!in_array("register-form-email",$result['wrongFields'])) {
        $result['wrongFields'][] = "register-form-email";
      }
    }
    
    //> user exists
    $user = \Model::factory('\App\Models\User')
            ->where_equal('email', $request->getParam("register-form-email"))
            ->find_one();

    if($user) {
      $result['errors'][] ="already";
      
      if(!in_array("register-form-email",$result['wrongFields'])) {
        $result['wrongFields'][] = "register-form-email";
      }
    }

    //> password
    if(!in_array("register-form-password",$result['wrongFields']) && strlen($request->getParam("register-form-password"))<6) {
      $result['errors'][] ="password";
      
      if(!in_array("register-form-password",$result['wrongFields'])) {
        $result['wrongFields'][] = "register-form-password";
      }
    }
    
    if(count($result['errors'])) {
      $result['success'] = false;
    } else {
      $userInfo = new class {};
      $userInfo->name = $request->getParam("register-form-name");
      $userInfo->email = $request->getParam("register-form-email");
      $userInfo->password = $request->getParam("register-form-password");

      \App\Models\User::signup($userInfo);

      $this->c->session->login(
        $userInfo->email,
        $userInfo->password
      );

    } 

    return json_encode($result);
  }

  public function update($request, $response, $args) {
    $result = [];
    $result['success'] = true;
    $result['redirectView'] = "profile_confirmation";
    $result['errors'] = [];
    $result['wrongFields'] =[];

    //Validate
    //>required
    $required_fields = ["profile_email","profile_name"];
    foreach($required_fields as $field) {
      if(trim($request->getParam($field)) == "") {
        if(!in_array("required",$result['errors'])) {
          $result['errors'][] ="required";
        }
        
        $result['wrongFields'][] = $field;
      }
    }

    //> valid email
    if(!in_array("profile_email",$result['wrongFields']) && !\App\Core\Helpers::isEmail($request->getParam("profile_email"))) {
      $result['errors'][] ="mail";
      
      if(!in_array("profile_email",$result['wrongFields'])) {
        $result['wrongFields'][] = "profile_email";
      }
    }
    
    //> user exists
    if($this->c->session->get('user_email')!=$request->getParam("profile_email")) {
      $user = \Model::factory('\App\Models\User')
        ->where_equal('email', $request->getParam("profile_email"))
        ->find_one();

      if($user) {
        $result['errors'][] ="already";
        
        if(!in_array("profile_email",$result['wrongFields'])) {
          $result['wrongFields'][] = "profile_email";
        }
      }
    }

    
    if(count($result['errors'])) {
      $result['success'] = false;
    } else {
      //update
      $user = \App\Models\User::getByEncryptedCredentials(
        $this->c->session->get('user_email'),
        $this->c->session->get('user_password')
      );

      $user->name = $request->getParam("profile_name");
      $user->email = $request->getParam("profile_email");
      $user->save(); 

      //update session 
      $this->c->session->set('user_email',$request->getParam("profile_email"));
      $this->c->session->set('user_name',$request->getParam("profile_name"));

    } 

    return json_encode($result);
  }
  
  
  public function changePassword($request, $response, $args) {
    $result = [];
    $result['success'] = true;
    $result['redirectView'] = "profile_confirmation";
    $result['errors'] = [];
    $result['wrongFields'] =[];

    //Validate
    //> password
    if(strlen($request->getParam("profile_password"))<6) {
      $result['errors'][] ="password";
      
      if(!in_array("profile_password",$result['wrongFields'])) {
        $result['wrongFields'][] = "profile_password";
      }
    }
    
    if(count($result['errors'])) {
      $result['success'] = false;
    } else {
      //update
      $user = \App\Models\User::getByEncryptedCredentials(
        $this->c->session->get('user_email'),
        $this->c->session->get('user_password')
      );

      $password = $user->setPassword($request->getParam("profile_password"));

      //update session 
      $this->c->session->set('user_password',$password);
    } 

    return json_encode($result);
  }

  
  public function recoverPassword($request, $response, $args) {
    $result = [];
    $result['success'] = true;
    $result['redirectView'] = "remember_confirmation";
    $result['errors'] = [];
    $result['wrongFields'] =[];
    
    $user = \Model::factory('\App\Models\User')
      ->where_equal('email', $request->getParam("remember_email"))
      ->find_one();

    if($user) {
      //Send form
      $recover_link = "http://".$_SERVER['HTTP_HOST']."/".$args['lang']."/user/set-password/".$user->hash."/".$user->pepper;
      $translations = \ORM::for_table("texts")->raw_query("select `key`,text_{$args['lang']} as text from texts where `key` LIKE 'r2-email-recover-password-%'")->find_many();
      print_r($translations);
      foreach($translations as $translation) {
        $t[$translation['key']] = $translation['text'];
        $t[$translation['key']] = str_replace("[user_name]",$user->name,$t[$translation['key']]);
        $t[$translation['key']] = str_replace("[recover_link]",$recover_link,$t[$translation['key']]);
      }

      $this->c->mailer->send($user->email,$t['r2-email-recover-password-subject'],$t['r2-email-recover-password-text']);
    } 
     
    return json_encode($result);
  }

  public function setPassword($request, $response, $args) {
    if($this->c->session->isLogged()) {
      return "<p>You are currently logged in.<br/><a href='http://me-do.cl'>Go to homepage</a></p>";
    }

    $user = \Model::factory('\App\Models\User')
      ->where('active', '1')
      ->where('hash', $args['hash'])
      ->where('pepper', $args['pepper'])
      ->find_one();
    
    if(!$user) {
      return "<p>User does not exists.<br/><a href='http://me-do.cl'>Go to homepage</a></p>";
    }

    return $this->c->view->render($response, 'website/reset-password.html', compact('user'));
  }
  
  
  public function updatePasswordFromHash($request, $response, $args) {
    $result = [];
    $result['success'] = true;
    $result['redirectView'] = "set_password_confirmation";
    $result['errors'] = [];
    $result['wrongFields'] =[];

    //Validate
    //> password
    if(strlen($request->getParam("profile_password"))<6) {
      $result['errors'][] ="password";
      
      if(!in_array("profile_password",$result['wrongFields'])) {
        $result['wrongFields'][] = "profile_password";
      }
    }
    
    if(count($result['errors'])) {
      $result['success'] = false;
    } else {
      //update
      $user = \Model::factory('\App\Models\User')
        ->where('active', '1')
        ->where('hash', $args['hash'])
        ->where('pepper', $args['pepper'])
        ->find_one();
      
      if($user) {
        $password = $user->setPassword($request->getParam("profile_password"));
      }
    } 

    return json_encode($result);
  }
  
  public function login($request, $response, $args) {
    $result = [];
    $result['success'] = true;
    $result['redirectView'] = "refresh_and_open_menu";
    $result['errors'] = [];
    $result['wrongFields'] =[];

    $result['success'] = $this->c->session->login(
      $request->getParam("login_email"),
      $request->getParam("login_password")
    );

    if(!$result['success']) {
      $result['errors'][] ="login";
    }

    return json_encode($result);
  }
*/

  public function ctrSignUp($request, $response, $args){
    $l = $args['lang'];
    if(isset($_POST["register-form-name"])){
      if(preg_match('/^[a-zA-ZñÑáéíóúÁÉÍÓÚ. ]+$/', $_POST["register-form-name"]) && 
        preg_match('/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/', $_POST["register-form-email"]) &&
        preg_match('/^(?=.*\d).{4,20}$/', $_POST["register-form-password"])){

          //Validate email
          $user = \Model::factory('\App\Models\User')
            ->where_equal('email', $request->getParam("register-form-email"))
            ->find_one();

          if($user){
            $this->c->session->set("user-already-exist", "1");
            return $this->c->view->render($response, 'new/register.html');
          }
          else{
            $encrypt = crypt($_POST["register-form-password"], '$2a$07$FFjB5kOyXm3FmJZliH9H$');
            $encryptEmail = md5($request->getParam("register-form-email"));
  
            $data = new class {};
            $data->name = $request->getParam("register-form-name");
            $data->email = $request->getParam("register-form-email");
            $data->password = $encrypt;

            $data->mode = "direct";
            $data->encryptedEmail = $encryptEmail;
            $data->verification = 1;
  
            $responseFromModel = \App\Models\User::signup($data);
  
            if($responseFromModel == "ok"){
          
              $this->c->session->set("register-successful", "1");

              $recover_link = "http://".$_SERVER['HTTP_HOST']."/".$args['lang']."/2/user2/verificar/";
  
              $msgBody = \ORM::for_table("texts")->raw_query("select `key`,text_{$args['lang']} as text from texts where `key` = 'confirm-email'")->find_one();
              $msgBody['text'] = str_replace("[url]", $recover_link, $msgBody['text']);
              $msgBody['text'] = str_replace("[email_code]", $encryptEmail, $msgBody['text']);
              
              //Enviando correo para verificar!
              $this->c->mailer->send($data->email, 'Confirm your Email', $msgBody['text']);
              $this->c->view->render($response, 'new/register.html');

            }
          }       
      }
      else{
        $this->c->session->set("error-register-chars", "1");
        return $this->c->view->render($response, 'new/register.html');
      }
    }
  }

  public function existingEmail($request, $response) {
    $email = $request->getParam('email');
    $user = \Model::factory('\App\Models\User')
    ->where_equal('email', $email)
    ->find_one();

    $existing = "false";

    if($user){
      $existing = "true";
      $mode = $user->mode;
      return $existing;
    }

    return $existing;
    
  }

  public function verificar($request, $response, $args){
    $emailId = $args['emailId'];

    //Encuentra un usuario
    $user = \Model::factory('\App\Models\User')
    ->where('encryptedEmail', $emailId)
    ->find_one();

    //Actualiza su verification a 0
    $verificated = false;

    if($user){
      try{
        $user->verification = 0;
        $user->save();
        $verificated = true;
      }
      catch(Exception $e){
        $verificated = false;
      }
    }
    else{
      $verificated = false;
    }

    return $this->c->view->render($response, 'new/verificar.html', compact('emailId', 'user', 'verificated'));
  }

  public function login($request, $response, $args){
    $l = $args['lang'];
    if($request->getParam("login-email")){
      if(preg_match('/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/', $request->getParam("login-email")) &&
        preg_match('/^(?=.*\d).{4,20}$/', $request->getParam("login-password"))){

          $encryptPw = crypt($request->getParam("login-password"), '$2a$07$FFjB5kOyXm3FmJZliH9H$');

          $user = \Model::factory('\App\Models\User')
          ->where_equal('email', $request->getParam("login-email"))
          ->find_one();

          if($user){

            if($user->password == $encryptPw){
              if($user->verification == 1){
                $this->c->session->set("email-invalid", "1");
                $this->c->view->render($response, 'new/register.html');
              }
              else{                
                $this->c->session->login($user);
                return $this->c->view->render($response, 'new/home2.html');
              }
            }
            else{
              $this->c->session->set("incorrect-password", "1");
              return $this->c->view->render($response, 'new/register.html');
            }
          }
          else{
            $this->c->session->set("incorrect-username", "1");
            return $this->c->view->render($response, 'new/register.html');
          }

        
      }
      else{
        $this->c->session->set("incorrect-characters", "1");
        return $this->c->view->render($response, 'new/register.html');
      }
    }
  }

  public function logout($request, $response, $args) {
    $l = $args['lang'];
    $url = $this->c->router->pathFor('home', ['lang'=>$l]);
    
    $this->c->session->logout();

    return $response->withHeader('Location', $url);
  }

  public function sendPassword($request, $response, $args){
    if($request->getParam("password-email")){
      //find user
      $user = \Model::factory('\App\Models\User')
      ->where_equal('email', $request->getParam("password-email"))
      ->find_one();

      if($user) {
        //Generate random pass
        function generatePassword($long){
          $key = "";
          $pattern = "1234567890abcdefghijklmnopqrstuvwxyz";
          $max = strlen($pattern);
          for($i=0; $i<$long; $i++){
            $key .= $pattern{mt_rand(0, $max-1)};
          }
          return $key; 
        }

        $newPassword = generatePassword(11);

        $encryptedPassword = crypt($newPassword, '$2a$07$FFjB5kOyXm3FmJZliH9H$');

        //update user
        $user->password = $encryptedPassword;
        $user->save();

        //Send form
        $recover_link = "http://".$_SERVER['HTTP_HOST']."/".$args['lang'];
        
        $msgBody = \ORM::for_table("texts")->raw_query("select `key`,text_{$args['lang']} as text from texts where `key` = 'r2-email-recover-password-text'")->find_one();
        
       
        $msgBody['text'] = str_replace("[user_name]", $user->name, $msgBody['text']);
        $msgBody['text'] = str_replace("[url]", $recover_link, $msgBody['text']);
        $msgBody['text'] = str_replace("[password]", $newPassword, $msgBody['text']);
        
        $send = $this->c->mailer->send($user->email, 'Recupera tu contraseña', $msgBody['text']);

        $this->c->session->set('env-password', '1');

        return $this->c->view->render($response, 'new/recover-password.html');
      } 

    }
    else{
      echo '<script>
            alert("¡Correo incorrecto, no use caracteres especiales!");
            window.location.href="/en/2";
            </script>';
    } 
    
  }

  public function facebookRegister($request, $response, $args){
    if($request->getParam("email")){

      //Existing user?
      $user = \Model::factory('\App\Models\User')
      ->where_equal('email', $request->getParam("email"))
      ->find_one();

      if($user){
        if($user->mode == "facebook"){
          $this->c->session->login($user);
          return "ok";
        }
        else{
          return 1;
        }
      }
      else{
        //echo "No hay user";
        $data = new class {};
        $data->name = $request->getParam("name");
        $data->email = $request->getParam("email");
        // $data->image = $request->getParam("picture");
        $data->password = "null";
        $data->encryptedEmail = "null";
        $data->mode = "facebook";
        $data->verification = 0;
          
        $responseFromModel = \App\Models\User::signup($data);

        if($responseFromModel == "ok"){
          $user = \Model::factory('\App\Models\User')
          ->where_equal('email', $data->email)
          ->find_one();
          if($user->mode == "facebook"){
            $this->c->session->login($user);
            return "ok";
            //return $this->c->view->render($response, 'new/home2.html');
          }
        }
      }   
    }
  }

  public static function googleRegister($data, $c){
    //Existing user?
    $user = \Model::factory('\App\Models\User')
    ->where_equal('email', $data->email)
    ->find_one();

    if($user){
      if($user->mode == "google"){
        $c->session->login($user);
        return "ok";
      }
      else{
        echo 1;
      }
    }
    else{
      $response = \App\Models\User::signup($data);
        if($response == "ok"){
          $user = \Model::factory('\App\Models\User')
          ->where_equal('email', $data->email)
          ->find_one();
          if($user->mode == "google"){
            $c->session->login($user);
            echo "ok";
          }
        }
    }
  }

  public function updateProfile($request, $response, $args){
    $this->c->session->set("success-update-profile", "0");

    //data?
    if($request->getParam("edit-account-form-name")){

      //Instanciate user 
      $user = \Model::factory('\App\Models\User')
          ->where_equal('email', $this->c->session->get("email"))
          ->find_one();

      if($user->mode == "direct"){
        //Edit password?
        if($request->getParam("edit-account-form-actual-pass") != "" && $request->getParam("edit-account-form-new-pass") != "" && $request->getParam("edit-account-form-repeat-pass") != ""){
          //Actual pass is correct?
          $oldPass = crypt($request->getParam("edit-account-form-actual-pass"), '$oiasdij2123ASD13QASI341ojas23Jfasd$');
          if($oldPass == $user->password){
            
            //new pass confirmation
            if($request->getParam("edit-account-form-new-pass") == $request->getParam("edit-account-form-repeat-pass")){
              if(preg_match('/^[a-zA-Z0-9]*$/', $request->getParam("edit-account-form-new-pass"))){
                $newPass = crypt($request->getParam("edit-account-form-new-pass"), '$2aiasdij2123ASD13QASI341ojas23Jfasd$');
                //update password
                $user->password = $newPass;
                $user->name = $request->getParam("edit-account-form-name");
                $user->surname = $request->getParam("edit-account-form-lname");
                $user->birthday = $request->getParam("edit-account-form-date");
                $user->gender = $request->getParam("template-contactform-radio");
                $user->phone = $request->getParam("edit-billing-form-phone");
                $user->save();
                $this->c->session->login($user);
                $this->c->session->set("success-update-profile", "1");
                return $this->c->view->render($response, 'new/myaccount.html');
              }
              else{
                $this->c->session->set("error-update-profile", "0");
                return $this->c->view->render($response, 'new/myaccount.html');
              }
            }
            else{
              $this->c->session->set("error-update-profile", "1");
              return $this->c->view->render($response, 'new/myaccount.html');
            }
            
          }
          else{
            $this->c->session->set("success-update-profile", "0");
            return $this->c->view->render($response, 'new/myaccount.html');
          }
        }
      
        //update fields
        else{
          $user->name = $request->getParam("edit-account-form-name");
          $user->surname = $request->getParam("edit-account-form-lname");
          $user->birthday = $request->getParam("edit-account-form-date");
          $user->gender = $request->getParam("template-contactform-radio");
          $user->phone = $request->getParam("edit-billing-form-phone");
          $user->save();
          $this->c->session->login($user);
          $this->c->session->set("success-update-profile", "1");
          return $this->c->view->render($response, 'new/myaccount.html');
        }
      }
      else{
        //Not edit password, case social networks
        $user->birthday = $request->getParam("edit-account-form-date");
        $user->gender = $request->getParam("template-contactform-radio");
        $user->phone = $request->getParam("edit-billing-form-phone");
        $user->save();
        $this->c->session->login($user);
        $this->c->session->set("success-update-profile", "1");
        return $this->c->view->render($response, 'new/myaccount.html');
      }    
    
    }
  }

  public function address($request, $response, $args){
    return $this->c->view->render($response, 'new/address.html');
  }

  public function updateAddress($request, $response, $args){
    if($request->getParam("billing-form-address") != $this->c->session->get("address") || 
    $request->getParam("billing-form-region") != $this->c->session->get("region") || 
    $request->getParam("billing-form-commune") != $this->c->session->get("commune") ||
    $request->getParam("billing-form-dpto") != $this->c->session->get("dpto")){
      //Update new address 
      $user = \Model::factory('\App\Models\User')
          ->where_equal('email', $this->c->session->get("email"))
          ->find_one();
      
      $user->region = $request->getParam("billing-form-region");
      $user->commune = $request->getParam("billing-form-commune");
      $user->address = $request->getParam("billing-form-address");
      $user->dpto = $request->getParam("billing-form-dpto");
      $user->save();

      $this->c->session->login($user);
      $this->c->session->set("success-update-address", "1");
      return $this->c->view->render($response, 'new/address.html');
    }
    else{
      echo "No hay cambios";
    }
  }
    
}
