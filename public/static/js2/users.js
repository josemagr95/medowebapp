
/************************************
       Capturar ruta actual
/************************************/
var actualRoute = location.href;
$(document).ready(function(){
  $(".btnLogin, #btnFacebookRegister").click(function(){
    localStorage.setItem("actualRoute", actualRoute);
  })
})


/************************************
        Sacar las alertas
/************************************/
$(document).ready(function(){
  $("input").focus(function(){
    $(".alert").remove();
  })
})


/************************************
        Validar email existente
/************************************/
var validateExistingEmail = false;

$(document).ready(function(){
  
  $("#register-form-email").change(function(){

    var email = $("#register-form-email").val();
    var data = new FormData();
    data.append("email", email);
    console.log('data', data.get("email"));

    $.ajax({
      url: "/en/2/user2/existingEmail",
      method: "POST",
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      success: function(respuesta){
        
        if(respuesta == "true"){
          $("#register-form-email").parent().before('<div class="alert alert-warning"><strong>ERROR:</strong> El correo ya está registrado en el sistema.</div>')
          validateExistingEmail = true;
        }
        else{
          $(".alert").remove();
          validateExistingEmail = false;
        }

      },
      error: function(xhr, status, error){
        var errorMessage = xhr.status + ': ' + xhr.statusText
        alert('Error - ' + errorMessage);
      }
    })
  })
})

/************************************
********************************** 
        User Register
/************************************
********************************** */

function userRegister(){

  /** Validar Nombre **/
  var name = $("#register-form-name").val()

  if(name != ""){
    var expresion = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ. ]*$/

    if(!expresion.test(name)){
      $("#register-form-name").parent().before('<div class="alert alert-warning"><strong>No se permiten números ni caracteres especiales</strong></div>')
      return false
    }

    if(validateExistingEmail){
      $("#register-form-email").parent().before('<div class="alert alert-danger"><strong>ERROR:</strong> El correo ya está registrado en el sistema.</div>')
      return false
    }
  }
  //Con el required el siguiente else está demás... SACAR
  else{
    $("#register-form-name").parent().before('<div class="alert alert-warning"><strong>Campo Obligatorio</strong></div>')
    return false
  }

  /** Validar Email **/
  var email = $("#register-form-email").val()

  if(email != ""){
    var expresion = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/

    if(!expresion.test(email)){
      $("#register-form-email").parent().before('<div class="alert alert-warning"><strong>Escriba un correo electrónico válido</strong></div>')
      return false
    }
  }
  //Con el required el siguiente else está demás... SACAR
  else{
    $("#register-form-email").parent().before('<div class="alert alert-warning"><strong>Campo Obligatorio</strong></div>')
    return false
  }

  /** Validar Contraseña **/
  var password = $("#register-form-password").val()

  if(password != ""){
    var expresion = /^(?=.*\d).{4,20}$/

    if(!expresion.test(password)){
      $("#register-form-password").parent().after('<div class="alert alert-warning"><strong>La contraseña debe contener entre 4 y 20 dígitos y debe incluir al menos un número.</strong></div>')
      return false
    }
  }
  //Con el required el siguiente else está demás... SACAR
  else{
    $("#register-form-password").parent().after('<div class="alert alert-warning"><strong>Campo Obligatorio</strong></div>')
    return false
  }

  //Verificar que el value del pass y el re-pass sean iguales
  var repassword = $("#register-form-repassword").val()
  if(password == repassword){
    return true
  }
  else{
    $("#register-form-password").after('<div class="alert alert-warning"><strong>Las contraseñas deben coincidir.</strong></div>')
    return false
  }
}