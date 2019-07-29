function setupFilters() {
  $(".filters_trigger").click(function() {
    if($(".filters").is(":visible")) {
      $(".filters").slideUp();
      $(".filters_trigger").removeClass("active");
    } else {
      $(".filters").slideDown();
      $(".filters_trigger").addClass("active");
    } 
  });

  $(".filters select").change(function() {
    $(".filters form").submit(); 
  });
  
  $(".filters .order_by span").click(function() {
    var order = $(this).attr("rel");
    $(".filters .order_by span").removeClass("active");
    $(this).addClass("active");
    $(".filters #order_by").val(order);
    $(".filters form").submit(); 
  });
}

function setupRating() {
  if($(".rate_wrapper").length) {
    $(".rate_wrapper .rating div").each(function() {
      $(this).mouseover(function() {
        for(var i=1;i<=5;i++)  { $(this).parent().removeClass("r"+i); }
        
        var val = $(this).attr("rel");
        $(this).parent().addClass("r" + val); 
      });
      
      $(this).mouseout(function() {
        for(var i=1;i<=5;i++)  { $(this).parent().removeClass("r"+i); }
        
        var val = $(this).parent().attr("rel");
        $(this).parent().addClass("r" + val); 
      });

      $(this).click(function() {
        for(var i=1;i<=5;i++)  { $(this).parent().removeClass("r"+i); }
        
        var val = $(this).attr("rel");
        $(this).parent().addClass("r" + val); 
        $(this).parent().attr("rel",val); 
        
        $.ajax({
          type: 'POST',
          url: '/en/gallery/rate-design',
          data: 'design_id='+$("#design_id").val()+"&rating="+val,
          success: function(response){
            for(var i=1;i<=5;i++)  { $(".rating_wrapper .rating").removeClass("r"+i); }
            $(".rating_wrapper .rating").addClass("r"+response);
          }
          });
      });
    });
  }
}

function setupComments() {
  $(".comments_trigger").click(function() {
    $(".comments").slideToggle(300);
    $("html, body").animate({scrollTop:$("#comments").offset().top-100},400);  
  });
}

$(function(){
  setupFilters();
  setupRating();
  setupComments();

  $(window).resize(function() {
  });
});
