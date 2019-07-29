/*****************************
 * FACEBOOK BUTTON
 */

$(document).ready(function(){
  $(".facebookRegister").click(function(){
    FB.login(function(response){
      console.log('dentro de login')
      validateUser();
    }, {scope: 'public_profile, email'})
  })
})


/*****************************
 * Validar ingreso */

function validateUser(){
  FB.getLoginStatus(function(response){
    statusChangeCallback(response);
  })
}

/*****************************
 * Validamos el cambio de estado en facebook */

function statusChangeCallback(response){
   if(response.status === 'connected'){
     testApi();
   }
   else{
     swal({
       title: "¡Error!",
       text: "Ocurrió un error al ingresar con Facebook, vuelva a intentarlo",
       type: "error",
       confirmButtonText: "Cerrar",
       closeOnConfirm: false
     },
     function(isConfirm){
       if(isConfirm){
         window.location = localStorage.getItem("actualRoute");
       }
     });
   }
}

/*****************************
 * Ingresamos a la API de facebook */
function testApi(){
  FB.api('/me?fields=id,name,email,picture', function(response){
    if(response.email == null){
      swal({
        title: "¡Error!",
        text: "¡Para poder ingresar al sistema debe proporcionar la información del correo electrónico.",
        type: "error",
        confirmButtonText: "Cerrar",
        closeOnConfirm: false
      },
      function(isConfirm){
        if(isConfirm){
          window.location = localStorage.getItem("actualRoute");
        }
      });
    }
    else{
      var email = response.email;
      var name = response.name;
      var picture = "http://graph.facebook.com/"+response.id+"/picture?type=large";

      var data = new FormData();
      data.append("email", email)
      data.append("name", name)
      data.append("picture", picture)

      $.ajax({
        url: '/en/2/user2/facebookRegister',
        method: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        success: function(response){
          if(response == 1){
            swal({
              title: "¡Error!",
              text: "¡El correo ya se ha registrado con otro método!",
              type: "error",
              confirmButtonText: "Cerrar",
              closeOnConfirm: false
            },
            function(isConfirm){
              if(isConfirm){
                FB.getLoginStatus(function(response){
                  if(response.status === 'connected'){
                    FB.logout(function(response){
                      deleteCookie("fblo_2258683101051805");
                      setTimeout(function(){
                        window.location = "logout";
                      }, 500);
                    })
                    function deleteCookie(name){
                      document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                    }
                  }
                })
              }
            });
          }
          if(response == "ok"){
            window.location = "/en";
          }
        },
        error: function(xhr){
          alert('Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText + ' ' + xhr.responseText);
      }
      })
    }
  })
}

/*****************************
 * Salir de FB */

$(document).ready(function(){
  $(".logout").click(function(e){

    FB.getLoginStatus(function(response){
      if(response.status === 'connected'){
        console.log("Conectado");
        FB.logout(function(response){
          deleteCookie("fblo_2258683101051805");
          setTimeout(function(){
            window.location = "/";
          });
        })
        function deleteCookie(name){
          document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
      }
    })
  })
})