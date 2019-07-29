var customModel;

function objectSize(obj) {
  var size = 0;
  for (key in obj){
    if (obj.hasOwnProperty(key)) {
      size++;
    }
  }
  
  return size;
}

function setupConfigurator(wrapperId,messageCallbackFunction,testCallbackFunction) {
  $(".configurator__viewer__loading,.configurator__viewer__model").height($(".configurator__viewer").height());
    
  var hoverable = false
  var selectableGroup = {};

  if(!$(".configurator").hasClass("read_only")) {
    hoverable =  true;
    selectableGroup = {
      id: "group_1",
      selectable: true,
      selectionEffect: {
        passive: {
          name: 'opacityHighlight',
          options : {
            opacity: 0.3
          }
        }
      },
      hoverable: hoverable,
      hoverEffect: {
        active: {
          name: 'colorHighlight',
          options : {
            color: [43,137,127],
          }
        }
      },
      selectionMode:'single'
    };
  }   
  
  
  var viewerSettings = {
    container: document.getElementById(wrapperId),
    exposeViewer: true, 
    api: {version: 1}, 
    strictMode: false, 
  };
  
  var viewer = new SDVApp.ParametricViewer(viewerSettings);
  var api = viewer.getApiV2();
 
  var pluginSettings = {
    runtimeId: wrapperId + '_plugin',
    deferGeometryLoading: false,
    ticket : $("#"+wrapperId).attr("rel"),
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com"
  };
  
  var commPlugin = new SDVApp.plugins.CommPlugin(pluginSettings);
  viewer.registerPlugin(commPlugin);
  
  viewer.setMessagingCallback(messageCallbackFunction);
  api.scene.addEventListener(api.scene.EVENTTYPE.VISIBILITY_ON, testCallbackFunction);
 
  $(".button.add_to_my_designs,.button.update_my_design").click(function() {
    addToMyDesigns(); 
  });
  $(".popup .form .button").click(function() { saveDesign(); });
  
  return {
    parts: {},
    params: {},
    selectableGroup: selectableGroup,
    wrapperId: wrapperId,
    viewer: viewer,
    viewerInit: false,
    selectInit: false,
    selectedPart: '',
    selectedParam: '',
    api: api
  };
}

function customModelMessageCallback(msg) {
  messageCallback(msg,customModel);
}

function customModelTestCallback(msg) {
  testCallback(msg,customModel);
}

function testCallback(evt,model) {
}

function messageCallback(msg,model) {
  if (!model.viewerInit) {
    model.viewerInit=true;
    
    if(model.wrapperId=="custom-view") {
      setupParams(model);
    }
  }

  if (msg=="GeometryUpdateDone") {
    if (!model.selectInit) {
      model.viewer.setBackgroundColor("#575757");
      model.viewer.showGroundPlane(false);
      model.viewer.showGrid(false);
      model.selectInit=true;
      model.api.updateSettingAsync("scene.camera.enableZoom",false);
      model.api.updateSettingAsync("scene.camera.restrictions.zoom.maxDistance",5000);
      model.api.updateSettingAsync("scene.camera.restrictions.zoom.minDistance",500);
        
      
      if(model.wrapperId=="custom-view") {
        setupParts(model);
      }
    } else {
      getPrice(model);
      model.api.scene.camera.zoomAsync();
      $("#add-to-my-designs-btn").removeClass("disabled").removeAttr("disabled");
      $("#save-my-design-btn").removeClass("disabled").removeAttr("disabled");
    }
     
    
    if($(".configurator__controls").is(":visible") && model.selectedPart!='') {
      selectPart(model,model.selectedPart,true);
    }

    updateHistoryButtons(model);
    

    $("#"+model.wrapperId).parent().parent().find(".configurator__actions").fadeIn(1000);
    $("#"+model.wrapperId).parent().find(".configurator__viewer__loading").fadeOut(1000);
    $("#"+model.wrapperId).parent().parent().find(".configurator__controls-loading").fadeOut(1000,function() {
    	showControls();
		});
  }
}

function setupParams(model) {
  var params = model.viewer.getParameterDefinitions();
  var part;

  for (paramIndex in params) {
    param = params[paramIndex];
    if(param.name.indexOf("-")>0) {
      part = param.name.split("-")[0];
      if(!model.params[part]) {
        model.params[part] = [];
      }
      model.params[part].push(param);
    }  
  }

  setupControls(model);
}

function setupParts(model) {
  model.api.scene.updateInteractionGroups(model.selectableGroup);


  var assets = model.api.scene.get(null,model.wrapperId + "_plugin");
 
  for (let assetnum in assets.data) {
    var asset = assets.data[assetnum];
    if (asset.content.length>0) {
      if ((asset.content[0].format != 'material')&&(asset.content[0].format != 'data')) {
        asset.interactionGroup = model.selectableGroup.id;
        asset.interactionMode = 'global';
        delete asset.version;
       
        if(asset.name!="Packaging") {
          model.parts[asset.id] = asset;
        }

        let updateObject = {
          id: asset.id,
          interactionGroup: model.selectableGroup.id,
          interactionMode: 'global',
          duration: 0
        };
        model.api.scene.updatePersistentAsync([updateObject],model.wrapperId + '_plugin');
      }
    }
  }
    
  //LOAD PARAMS
  if($("#configurator__design__params").length) {
    setTimeout(function() {
      loadParameterValues(designParameters);
    }, 500);
  }

  setupControls(model);

  model.api.scene.addEventListener(model.api.scene.EVENTTYPE.SELECT_ON, function(evt) { selectOnCallback(evt,model); });
  model.api.scene.addEventListener(model.api.scene.EVENTTYPE.SELECT_OFF, function(evt) { selectOffCallback(evt,model); });
}


function setupControls(model) {
  if(objectSize(model.params)>0 && objectSize(model.parts)>0) {
		var part;
		var param;
		var jsClass;
		var layerMarkup;
    var paramGroups = ["Int","StringList","Bool"];
    var collection_name = $(".titulo_configurator").html();

    for(textureIndex in textures) {
      var texture = textures[textureIndex];
      $(".texture-list").append('<li rel="' + texture.value + '" id="' + textureIndex + '" class="js-set-texture texture-list__item"><div class="texture-list__image" style="background-image:url(\'' + texture.image + '\')"><img src="' + $("#static_path").val() + 'img/selected-texture-icon.svg" class="texture-list__item-mark"/></div><div class="texture-list__label" >' + texture.label + '</div></li>');
    }

		for(partIndex in model.parts) {
			part = model.parts[partIndex];
			if(part.name == "Global") {
				jsClass="js-global-selector";
			} else {
				jsClass="js-part-selector";
			}
			$(".part-list").append('<li rel="' + part.id + '" class="part-list__item ' + jsClass + '">' + partDefs[part.name] + '</li>');
		}
 
    for(part in model.params) {   
        
      layerMarkup='<div class="configurator__controls__layer configurator__controls__layer--params" id="' + part + '_params">';
      layerMarkup+='<div class="titulo_configurator2"><h1>' + collection_name + '</h1></div> ';
      layerMarkup+='<h3 id="test" class="configurator__controls__layer__title">' +  partDefs[part] + '</h3>';

      for (groupIndex in paramGroups) { 
        var group = paramGroups[groupIndex];
      
        for (paramIndex in model.params[part]) {
          param = model.params[part][paramIndex];
          if(param.type == group) { 
            layerMarkup+=getParamMarkup(param);
          }
        }
      }
      
      layerMarkup+='</div>';
      $(".configurator__controls").append(layerMarkup);
    }
  
    //triggers
		$(".js-set-texture").click(function() { setTexture(model,$(this).attr("id"),$(this).attr("rel")); });	
		$(".js-back-to-part").click(function() { selectPart(model,model.selectedPart,true); });	
		$(".js-part-selector").click(function() { selectPart(model,$(this).attr("rel"),true); });	
		$(".js-global-selector").click(function() { showParams('Global'); });	
    $(".js-unselect-part").click(function() { unselectParts(model,true); });
    

    //ZOOM
    $('.configurator__zoom__button').click(function(){
      model.api.scene.camera.zoomAsync(null,{duration:500});
    });
    
    $(document).on("change", ".param-wrapper--Bool input", function(){
      setParamValue(model,$(this).attr("rel"),$(this).is(":checked"));
    });
    
    $(document).on("change", ".param-wrapper--Int input,.param-wrapper--Int select", function(){
      $(this).parent().find(".range__slider,.range__select").val($(this).val());
      setParamValue(model,$(this).attr("rel"),$(this).val());
    });
    
    $(document).on("change", ".param-wrapper--StringList select", function(){
      setParamValue(model,$(this).attr("rel"),$(this).val());
    });
    
    $(document).on("click", ".js-texture-selector", function(){
      model.selectedParam = $(this).attr("rel");
      showTextures();
    });

    //history buttons
    /*
    $(".js-configurator-back").click(function() {
      if($(this).is(":enabled")) requestHistoryBack(model);  
    });
    $(".js-configurator-forward").click(function() {
      if($(this).is(":enabled")) requestHistoryForward(model);  
    });
    */
	}
}

function showPrice() {
  $(".configurator__price").addClass("active");
}

function showControls() {
	if(!$(".configurator__controls").is(":visible")) {
    showPrice();
		showPartMenu();
	}
}

function showParams(partName) {
	if($("#"+partName+"_params").length) {
		$(".configurator__controls__layer").hide();
		$("#"+partName+"_params").show();
		
		$(".configurator__controls").show();
	}	else {
		hideControls();
	}
}

function showPartMenu() {
	$(".configurator__controls__layer").hide();
	$(".configurator__controls__layer--parts").show();

	$(".configurator__controls").fadeIn(200);
}

function showTextures() {
  var selectedTexture = $("#"+customModel.selectedParam+" .texture-selector__input").val();
  $(".texture-list li").removeClass("selected");
  $(".texture-list li[rel='"+selectedTexture+"']").addClass("selected");

  $(".configurator__controls__layer").hide();
	$(".configurator__controls__layer--textures").show();

  $(".configurator__controls").scrollTop(0);
  
  
  var textureImgWidhth = $(".texture-list__item").width();
  var markTop = -1*($(".texture-list__item").width() / 2 + 12);
  var markLeft = $(".texture-list__item").width() / 2 -12;

  $(".texture-list__item-mark").css("margin-left",markLeft + "px").css("margin-top",markTop + "px")
	$(".configurator__controls").show();
}

function hideControls() {
	$(".configurator__controls").fadeOut(200);
}

function resetControls() {
	showPartMenu();
}

function getParamMarkup(param) {
	var paramMarkup;
  paramMarkup='<div class="param-wrapper param-wrapper--' + param.type + '">';
  paramMarkup+='<label class="param-wrapper__label">' + paramDefs[param.name] + '</label>';

	if(param.type=="StringList" && param.name.indexOf("Texture")>0) {
		//Texture selector
    paramMarkup+='<div id=' + param.name + '>';
    paramMarkup+='<input type="hidden" class="texture-selector__input" value="' + param.defval + '"/>';
    paramMarkup+='<div rel="' + param.name + '" class="js-texture-selector texture-selector__image" style="background-image: url(\'' + textures[param.choices[param.defval]].image + '\');"></div>';
    paramMarkup+='<span rel="' + param.name + '" class="js-texture-selector texture-selector__label">' + textures[param.choices[param.defval]].label + '</span>';
    paramMarkup+='<button rel="' + param.name + '" class="js-texture-selector texture-selector__button">' + selectLabel + '</button>';
    paramMarkup+='</div>';
	} 
	
  if(param.type=="StringList" && param.name.indexOf("Texture")<=0 && param.choices) {
		//Regular select
    paramMarkup+='<div id=' + param.name + '>';
    paramMarkup+='<select rel="' + param.name + '" class="option-list">';
    for(var i in param.choices) {
      var selected="";
      if(param.defval == i) selected=" selected";
      paramMarkup+='<option value="' + i + '"' + selected + '>' + param.choices[i] + '</option>';
    }
    paramMarkup+='</select>';
    paramMarkup+='</div>';
	} 

	if(param.type=="Int") {
		//Slider
    var tail="";
    var step=1;
    
    if(param.name.indexOf('Diameter')>=0 || param.name.indexOf('Width')>=0 || param.name.indexOf('Radius')>=0 || param.name.indexOf('Height')>=0 || param.name.indexOf('Lenght')>=0 || param.name.indexOf('Depth')>=0) {
      tail=" cm";
      step=1;
    }

    if(param.name.indexOf('Angle')>=0) {
      tail="°";
      step=1;
    }
    
    paramMarkup+='<input rel="' + param.name + '" class="range__slider" type="range" min="'+ param.min +'" max="' + param.max + '" step="' + step + '" value="' + param.defval + '" _oninput="updateRangeOutput(value);"/>';
    paramMarkup+='<select rel="' + param.name + '" class="range__select">';
    for(var i = param.min; i<=param.max; i=i+step) {
      var selected="";
      if(param.defval == i) selected=" selected";
      paramMarkup+='<option value="' + i + '"' + selected + '>' + i + tail + '</option>';
    }
    paramMarkup+='</select>';
	}	
	
	if(param.type=="Bool") {
		//Switch
    var checked="";
    if(param.defval) checked=' checked'; 
    paramMarkup+='<label class="switch_field switch_field--configurator-controls">';
    paramMarkup+='<input rel="' + param.name + '" type="checkbox"' + checked + '>';
    paramMarkup+='<span class="slider"></span>';
    paramMarkup+='</label>';
	}
  
  paramMarkup+='</div>';

	return paramMarkup;
}

function selectPart(model,partId,updateViewer) {
  model.selectedPart = partId;
  if(updateViewer) {
 		model.api.scene.updateSelected([model.wrapperId + '_plugin' + "." + partId]);
	}
	showParams(model.parts[partId].name);
}

function unselectParts(model,updateViewer) {
  model.selectedPart = '';
  if(updateViewer) {
  	var selectedPart = model.api.scene.getSelected()[0];
 		model.api.scene.updateSelected([],[selectedPart]);
	}
	resetControls();
}

function selectOnCallback(evt,model) {
  var selectedPart = model.api.scene.get({id: evt.obj.SDLocalPath}, model.wrapperId + '_plugin').data[0];
	selectPart(model,selectedPart.id,false);
}

function selectOffCallback(evt,model) {
  var selectedObjs = model.api.scene.getSelected();
  if (selectedObjs.length==0) {
  	resetControls();
	}
}

function setParamValue(model,paramId,value) {
  $(".js-custom-model-loading").fadeIn(300);
  model.viewer.setParameterValue(paramId, value);
}

function setParamControl(paramId,paramShapeDiverId,value) {
  var paramDefinitions = customModel.viewer.getParameterDefinitions();
  var param = paramDefinitions[paramShapeDiverId];
  $("input[rel='"+paramId+"'][type='range']").val(value);
  $("input[rel='"+paramId+"'][type='hidden']").val(value);
  $("input[rel='"+paramId+"'][type='checkbox']").attr("checked","checked");
  $("select[rel='"+paramId+"']").val(value);
  
  
  if(param.choices) {
    $("#"+paramId+" .texture-selector__image").css("background-image","url('"+textures[param.choices[value]].image+"')");
    $("#"+paramId+" .texture-selector__label").html(textures[param.choices[value]].label);
    $("#"+paramId+" .texture-selector__input").val(value);
  } 
    
  //paramMarkup+='<input type="hidden" class="texture-selector__input" value="' + param.defval + '"/>';
  //paramMarkup+='<div rel="' + param.name + '" class="js-texture-selector texture-selector__image" style="background-image: url(\'' + textures[param.choices[param.defval]].image + '\');"></div>';
  //paramMarkup+='<span rel="' + param.name + '" class="js-texture-selector texture-selector__label">' + textures[param.choices[param.defval]].label + '</span>';
}

function setTexture(model,textureId,textureValue) {
  $(".texture-list li").removeClass("selected");
  $(".texture-list li#"+textureId).addClass("selected");
  $("#"+model.selectedParam+" .texture-selector__image").css("background-image","url('"+textures[textureId].image+"')");
  $("#"+model.selectedParam+" .texture-selector__label").html(textures[textureId].label);
  $("#"+model.selectedParam+" .texture-selector__input").val(textureValue);
  setParamValue(model,model.selectedParam, textureValue);
}

function updateHistoryButtons(model) {
  if (model.api.parameters.canGoForwardInHistory()) {
    enableHistoryButton('forward');
  } else {
    disableHistoryButton('forward');
  }
  
  if (model.api.parameters.canGoBackInHistory()) {
    enableHistoryButton('back');
  } else {
    disableHistoryButton('back');
  }
}

function enableHistoryButton(button) {
  $(".js-configurator-"+button).removeClass("configurator__history__button--disabled");
  $(".js-configurator-"+button).removeAttr("disabled");
}

function disableHistoryButton(button) {
  $(".js-configurator-"+button).addClass("configurator__history__button--disabled");
  $(".js-configurator-"+button).attr("disabled","disabled");
}

function requestHistoryBack(model) {
  $(".js-custom-model-loading").fadeIn(300);
  model.api.parameters.goBackInHistoryAsync().catch(function(err) {
    $(".js-custom-model-loading").fadeOut(300);
    console.log("Error: Can't go back in history");
    console.log(err);
  });
}

function requestHistoryForward(model) {
  $(".js-custom-model-loading").fadeIn(300);
  model.api.parameters.goForwardInHistoryAsync().catch(function(err) {
    $(".js-custom-model-loading").fadeOut(300);
    console.log("Error: Can't go forward in history");
    console.log(err);
  });
}

function formatApiAttribute(attribute) {
  if(isNaN(attribute[0])) {
    return attribute.toLowerCase().split(" ").join("");
  }

  if(attribute.includes("mm")) {
    return parseFloat((parseFloat(attribute.replace("mm","")) / 1000).toPrecision(6));
  }
  
  if(attribute.includes("m²")) {
    return parseFloat(attribute.replace("m²",""));
  }

  return parseFloat(attribute);
}

function formatApiParams(apiParams) {
  var pl = {};
 
  if(!Array.isArray(apiParams)) {
    var partData = apiParams.split("\r\n");
    var partName = formatApiAttribute(partData[0].split(";")[1]);
    partData.shift();

    pl[partName] = {};
    for(attr in partData) {
      var attribute = partData[attr].split(";");
      pl[partName][attribute[0].toLowerCase()] = formatApiAttribute(attribute[1]);
    } 
  } else {
    for(p in apiParams) {
      var partData = apiParams[p].split("\r\n");
      var partName = formatApiAttribute(partData[0].split(";")[1]);
      partData.shift();

      pl[partName] = {};
      for(attr in partData) {
        var attribute = partData[attr].split(";");
        pl[partName][attribute[0].toLowerCase()] = formatApiAttribute(attribute[1]);
      } 
    }
  }

  
  return pl;
}

function getPrice(model) {
  var nestingToggle = model.api.parameters.get({name:"Process Nesting"}).data[0];
  nestingToggle.value = true;

  //enable nesting
  model.api.parameters.updateAsync([nestingToggle]).then(function(data) {
    //process nesting on, request packaging params
    var packagingOutput = model.api.scene.getData({name:"Packaging"}).data[0].data;
    var apiPayLoad = formatApiParams(packagingOutput);
  
    if(Object.keys(apiPayLoad)[0]!="") {
      $(".js-price").addClass("configurator__overlay-price--loading configurator__price__value--loading");

      $.ajax({
        type: 'POST',
        url: 'https://api.me-do.cl/pricing/',
        data: JSON.stringify(apiPayLoad),
        success: function(response){
          $(".js-price").html("");
          $(".js-price").removeClass("configurator__overlay-price--loading configurator__price__value--loading");
          var price = parseFloat(Math.round(response.final * 100)/100).toFixed(0);
          $(".js-price").html("$"+numberWithDots(price));
          
          //disable nesting 
         /* nestingToggle.value = false;
          model.api.parameters.updateAsync([nestingToggle]).then(function(data) {
            console.log("BLAS");
          });*/
    
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
         //console.log("error");
        }
      });
    }
  });
}

function resetCurrentDesign() {
  customModel.currentDesign = {};
  customModel.currentDesign.completedActions = 0;
  customModel.currentDesign.screenshot = '';
  customModel.currentDesign.paramenters = {};
}

function showLoadingOverlay() {
  $(".loading_overlay").addClass("active");
}

function hideLoadingOverlay() {
  $(".loading_overlay").removeClass("active");
  $('.configurator').removeClass("say_cheese");
}

function checkSaveDesignCompleted() {
  if(customModel.currentDesign.completedActions >= 2) {
    hideLoadingOverlay();
    
    if($(".mydesign.edit").length) {
      updateDesign();
    } else {  
      showSavePopup();
    }
  }
}

function saveParameterValues(data) {
  customModel.currentDesign.parameters = data;
  customModel.currentDesign.completedActions++;
  checkSaveDesignCompleted();
}

function saveScreenShot(data) {
  $.ajax({
    type: 'POST',
    url: '/en/my-designs/save-screenshot',
    data: 'img='+data,
    success: function(response){
      if(response) {
        customModel.currentDesign.screenshot = response;
        customModel.currentDesign.completedActions++;
        checkSaveDesignCompleted();
      } else {
        triggerError();
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
     triggerError();
    }
  });
}

function addToMyDesigns() {
  resetCurrentDesign();
  showLoadingOverlay();
  $('.configurator').addClass("say_cheese");
  unselectParts(customModel,true);
  
  setTimeout(function() {
    saveScreenShot(customModel.api.scene.getScreenshot());
    saveParameterValues(customModel.viewer.getParameterValues());
  },500);
}

function showSavePopup() {
  $.featherlight($("#save_popup"), { openSpeed: 0 });
  $("#save_popup .image_wrapper").html('<img src="' + $("#media_path").val() + 'images/designs/m-' + customModel.currentDesign.screenshot + '" alt="design screenshot"/>');
}

function saveDesign() {
  lockButton($(".featherlight-content #save_popup .form .button"));

  var  data = {
    collection: $(".featherlight-content #save_popup #collection_id").val(),
    gallery: $(".featherlight-content #save_popup input[type='checkbox']").is(":checked"),
    name: $(".featherlight-content #save_popup #name_design").val(),
    description: $(".featherlight-content #save_popup #description").val(),
    screenshot: customModel.currentDesign.screenshot,
    parameters: customModel.currentDesign.parameters
  }; 
  console.log(data);

  $.ajax({
    type: 'POST',
    url: '/en/my-designs/create',
    dataType : 'json',
    data: data,
    success: function(response){
      unlockButton($(".featherlight-content #save_popup .form .button"));
      showPopupConfirmation($(".featherlight-content #save_popup"));
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
     triggerError();
    }
  });
}

function updateDesign() {
  lockButton($(".mydesign .update_my_design"));
 
  var  data = {
    gallery: $(".mydesign input[type='checkbox']").is(":checked"),
    name: $(".mydesign #name_design").val(),
    description: $(".mydesign #description").val(),
    screenshot: customModel.currentDesign.screenshot,
    parameters: customModel.currentDesign.parameters
  }; 

  $.ajax({
    type: 'POST',
    url: '/en/my-designs/' + $("#design_id").val() + '/update',
    dataType : 'json',
    data: data,
    success: function(response){
      unlockButton($(".mydesign .update_my_design"));
      document.location = $(".mydesign #design_url").val();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
     triggerError();
    }
  });
}

function loadParameterValues(params) {
  var paramDefinitions = customModel.viewer.getParameterDefinitions();
  for(p in params) {
    if(!$(".configurator").hasClass("read_only")){setParamControl(paramDefinitions[p].name,p,params[p]);}
    setParamValue(customModel,paramDefinitions[p].name,params[p]);
  }
}

function triggerError() {
  alert("An error has occurred. Please, try again later.");
}

$(function(){
  customModel = setupConfigurator("custom-view",customModelMessageCallback,customModelTestCallback);
  resetCurrentDesign();

	$(window).resize(function() {
		unselectParts(customModel,true);
  });
  
  $(".export").click(function(){

    var l =  customModel.api.exports.get();

    requestExport(customModel).then(function(listPromised) {
      Promise.all(listPromised).then(listValues=>{
        var listUrl = [];

        //recover url
        for(i=0;i<listValues.length;i++) {
          listUrl.push(listValues[i]['data']['content'][0]['href']);
        }

        return(listUrl);

        /*
        //Call to export urls
        var data = {'urls':listUrl};

        
        $.ajax({
          type: 'POST',
          url: '/en/my-designs/export',
          data:data,
          success: function(response){
            console.log(response);
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("error ",errorThrown,textStatus);
           triggerError();
          }
        });

        */
      });
    }) 

  });
  

});


function getUrls(model){

  return requestExport(model).then(function(listPromised) {
    return Promise.all(listPromised).then(listValues=>{
      var listUrl = [];

      //recover url
      for(i=0;i<listValues.length;i++) {
        listUrl.push(listValues[i]['data']['content'][0]['href']);
      }
      return(listUrl);
    });
  }) 
}



// Return request with all url
function requestExport(model) {

  var numMaterials = model.api.scene.getData({name:"NumMaterials"}).data[0].data;

  // toggle the nesting ON before exporting
  var nestingToggle = model.api.parameters.get({name:"Process Nesting"}).data[0];
  nestingToggle.value = true;

  
  return model.api.parameters.updateAsync([nestingToggle]).then(function(data) {
    // toggle is ON, request export

    var result = [];
    for(i=1;i<=numMaterials;i++) {
      var exportName = "Export Material "+i;
      result.push(model.api.exports.requestAsync({name: exportName}));
    }
    result.push(model.api.exports.requestAsync({name: 'Export Info'}));
    
    //return list of promised of http export file
    return result;

  }).catch(function(err) {
    return Promise.reject(err);
  }).then(function(data) {
    return data;
  }).catch(function(err) {
    return Promise.reject(err);
  });


}
