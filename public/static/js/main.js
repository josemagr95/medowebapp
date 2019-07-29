$.fn.isOnScreen = function(offset){
  if(offset == null || typeof offset == 'undefined') offset = 0;

  var viewport = {};
  viewport.top = $(window).scrollTop();
  viewport.bottom = viewport.top + $(window).height();
  var bounds = {};
  bounds.top = this.offset().top - offset;
  bounds.bottom = bounds.top + this.outerHeight();
  return ((bounds.top <= viewport.bottom) && (bounds.bottom >= viewport.top));
};

function isTouchDevice() {
  return !!('ontouchstart' in window);
}

function setupPopups() {
  $(".popup .confirmation .close").click(function() {
    closePopup(); 
  });
}

function setupImageLazyLoading() {
  [].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = function() {
     img.removeAttribute('data-src');
    };
  });
}

function setupResponsiveEmbeds() {
  $(".responsive_embed").each(function(index) {
    var vratio=$(this).height()/$(this).width();
    var vwidth=$(this).parent().width();

    $(this).width(vwidth).height(vwidth*vratio);
  });
}

function setupInnerAnchorsAnimation() {
  var offset = 44;

  if($(".shortcuts_bar").length) {
    offset = offset + $(".shortcuts_bar").height();
  }

  $('a.animate_anchor').click(function(event){
    var target = $( $.attr(this, 'href') ).offset().top - offset;
    var current =  $(window).scrollTop();

    if(current<=0 && target<=0) return false; 

    $('html, body').animate({
      scrollTop: target
    }, 400);
    event.preventDefault();
  });
}

function hideBgVideosOnTouchScreens() {
  if(isTouchDevice()) {
    $(".bg_video video").remove();
    $(".bg_video").addClass("mobile_fallback");
  } 
}

function refresh(openMenu) {
  var url = document.location.href.replace('?om=1','').replace('?om=1','');

  if(openMenu) {
    var connector = '?';
    if(url.indexOf('?')>=0) connector = '&';
    
    url = url + connector + 'om=1';
  } 

  document.location = url;
}

function openMenu() {
  switchMenuView('main'); 
  $("body").addClass("visible_menu");
  $(".login_view .close_menu").hide();
  $(".login_view .back_to_menu").show();
}

function showPopupConfirmation(popup) {
  popup.parent().find(".featherlight-close-icon").fadeOut(400);
  popup.find(".form").fadeOut(400,function() {
    popup.find(".confirmation").fadeIn();
  });
}

function closePopup() {
  var current = $.featherlight.current();
  current.close();
}

function openLogin() {
  switchMenuView('login'); 
  $("body").addClass("visible_menu");
  $(".login_view .close_menu").show();
  $(".login_view .back_to_menu").hide();
}

function setupMainMenu() {
  $(".page_header .menu_btn").click(function(e) { 
    e.preventDefault();
    openMenu();
  });
  
  $(".main_menu .close_menu, .main_menu .close_menu_btn").click(function(e) { 
    e.preventDefault();
    if($(this).hasClass("force_refresh")) {
      refresh(false);
    } else {
      $("body").removeClass("visible_menu");
    }
  });

  $(".main_menu .link_to_view").click(function() {
    switchMenuView($(this).attr("rel")); 
  });

  $(document).keyup(function(e) {
    if (e.keyCode == 27) { 
      $("body").removeClass("visible_menu");
    }
  });
}

function setupSlideshow() {
  if($(".slideshow").length) {
    $(".slideshow").cycle({
      'slides': '> ul',
      'pager': '> .slideshow_pager',
      'pager-active-class': 'active',
      'swipe': true,
      'timeout': 6000
    });    
    $(window).on('focus', function() { $(".slideshow").cycle('resume'); }).on('blur', function() { $(".slideshow").cycle('pause'); });
  }
  
  if($(".slideshow_gallery").length) {
    $(".slideshow_gallery").cycle({
      'slides': '> .slide',
      'prev': '> .slideshow_prev',
      'next': '> .slideshow_next',
      'swipe': true,
      'timeout': 5000
    });    
    
    $(window).on('focus', function() { $(".slideshow_gallery").cycle('resume'); }).on('blur', function() { $(".slideshow_gallery").cycle('pause'); });
  }
  
}

function setupStickyHeader() {
  if($(window).scrollTop()>70) $(".page_header").addClass("solid");
  else $(".page_header").removeClass("solid");
}

function setupCollectionSelection() {
  if($(".select_collection").length) {
    $(".select_collection .collection_list a").click(function(e) {
      e.preventDefault();
      var collectionSlug = $(this).attr("rel"); 

      $(".select_collection .collection_list li").removeClass("active");
      $(this).parent().addClass("active");
    
      var offset = 50;
      if($(".page_header").css("position")=="fixed") { offset = 80; } 

      $(".collection_file .collection_wrapper").hide();
      $("#collection_" + collectionSlug).show();
      $(".collection_file").fadeIn();

      $('html, body').animate({
        scrollTop: $(".collection_file").offset().top - offset
      }, 800);
    });
  }
}

function setupParallaxImages() {
  var imagePosition;
  var imageHeight;
  var startPoint;
  var imageOffset;
  var imageMargin;
  var windowHeight = $(window).height();
  var scrollPosition = $("body").scrollTop();
  
 
  $(".parallax_image").each(function() {
    imagePosition = $(this).offset().top;
    imageHeight = $(this).height();
    
    if(imagePosition>windowHeight) {
      startPoint = imagePosition - windowHeight + imageHeight / 2;
    } else {
      startPoint = 0;
    }

    if(scrollPosition>=startPoint) {
      imageOffset = (scrollPosition - startPoint) / windowHeight;
      imageMargin = imageHeight * imageOffset * -1;

      if(imageMargin>=imageHeight*-1) {
        $(this).find(".background").css("margin-top",imageMargin + "px");
      }
    }
  }); 
}

function setupLoginLinks() {
  $(".button.open_login").click(function() {
    openLogin(); 
  });
}

function setupConfirms() {
  $("a.confirm").click(function(e) {
    if($("#confirm_popup").length && $.featherlight) {
      e.preventDefault();
      var text = $(this).attr("rel");
      var target = $(this).attr("href");
      
      $.featherlight($("#confirm_popup"), { openSpeed: 400, variant:'confirmpopup' });
      $("#confirm_popup .title").html(text);
      $("#confirm_popup .accept").attr("href",target);
    } else {
      return confirm($(this).attr('rel'));
    }
  });
}

function switchMenuView(view) {
  switch(view) {
    case "refresh":
      refresh(false);
      break;
    
    case "refresh_and_open_menu":
      refresh(true);
      break;

    case "close":
      $("body").removeClass("visible_menu");
      break;
    
    default:
      $(".main_menu .wrapper").hide();
      $(".main_menu .wrapper." + view +"_view").show();
      $(".main_menu .wrapper." + view +"_view input").first().focus();
      break;
  }
}

$(function(){
  setupMainMenu();
  setupSlideshow();
  setupStickyHeader();
  setupImageLazyLoading();
  setupPopups();
  //setupCollectionSelection();
  setupParallaxImages();
  setupLoginLinks();
  setupConfirms();
  setupResponsiveEmbeds();

  $(window).scroll(function() {
    setupStickyHeader();
    setupParallaxImages();
  });

  $(window).resize(function() {
    setupResponsiveEmbeds();
  });
});
