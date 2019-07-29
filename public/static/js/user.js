function setupForms() {
  $(".main_menu form").submit(function(e) {
    e.preventDefault();
    sendForm($(this)); 
  });
}

function resetForm(form,cleanFieldValues) {
  if(cleanFieldValues) {
    form.find("input").val("");
    form.find("input:first").focus();
  }

  form.find("input").removeClass("error");
  form.parent().find(".form_errors li").hide();
  form.parent().find(".errors").hide();
  unlockButton(form.find(".button"));
}

function sendForm(form) {
  resetForm(form,false);
  lockButton(form.find(".button"));
  
  $.ajax({
    type: "POST",
    url: form.attr("action"),
    data: form.serialize(),
    success: function(response){
      response = JSON.parse(response);
      
      if(response.success) {
        switchMenuView(response.redirectView);
        setTimeout(function() { resetForm(form,true); },1000);
      } else {
        if(response.errors.length) {
          for (e in response.errors) {
            form.parent().find("." + response.errors[e] + "_error").show();
          }
          form.parent().find(".form_errors").show();
        }
        
        if(response.wrongFields.length) {
          for (f in response.wrongFields) {
            form.find("#" + response.wrongFields[f]).addClass("error");
          }
          form.find(".error:first").focus();
        }

        unlockButton(form.find(".button"));
      }
    }
  });
}

function lockButton(button) {
  button.addClass("loading");
  button.attr("disabled","disabled");
}

function unlockButton(button) {
  button.removeClass("loading");
  button.removeAttr("disabled");
}


$(function() {
  setupForms();
});
