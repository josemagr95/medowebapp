function setupContactForm() {
  if($("#contact_form").length) {
    $("#contact_form").submit(function(e) {
      e.preventDefault();
      if(validateContactForm()) {
        sendContactForm();
      }
    });
  }
}

function validateContactForm() {
  var validated=true;
  var err_all_required=false;

  var required_fields=new Array('name','phone','email','message');
  
  //Remove al errors
  $(".contact .error").removeClass("error");
  $(".contact .form_errors").fadeOut();
  $(".contact .form_errors li").hide();
 
  //Required fields 
  for(field in required_fields) {
    if($("#"+required_fields[field]).val()=="") {
      validated=false;
      err_all_required=true;
      $("#"+required_fields[field]).addClass("error");
    }
  }

  //Show errors
  if(!validated) {
    if(err_all_required) $("#required_error").show();
    
    $(".contact .form_errors").fadeIn();
    $(".contact .error:first").focus();
  }
  return validated;
}

function sendContactForm() {
  $("#contact_form button").html(sending_label);
  $("#contact_form button").attr("disabled","disabled");

  $.ajax({
    type: "POST",
    url: $("#contact_form").attr("action"),
    data: $("#contact_form").serialize(),
    success: function(response){
      if(response=="ok") $("#contact_form").fadeOut("medium",function() {$(".form_confirmation").fadeIn();});
    }
  });
}

$(function(){
  setupContactForm();
});
