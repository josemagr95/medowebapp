
var quantity = localStorage.getItem("quantityCart");
if(quantity !== null && quantity !=0){
  $(document).ready(function() {
    $(".quantityCart").html(localStorage.getItem("quantityCart"));
    $(".sumCart").html('$'+numberWithDots(localStorage.getItem("sumCart")));
    $(".top-cart-items").html("");
  })
}
else{
  $(document).ready(function() {
    $(".quantityCart").html("0");
    $("#top-cart-action").hide();
    $(".sumCart").html("$0");
    $(".top-cart-items").html("<div class='top-cart-item clearfix'> <p style='margin-bottom: 0px'>No hay productos en el carrito.</p> </div>");
    $("#cart").html("<strong> No hay productos en el carro </strong>")
  })
}



///UPDATE TOP CART
function updateTopCart(){
  $(document).ready(function() {
  cartList =  JSON.parse(localStorage.getItem("productList"));
  $(".top-cart-items").html("");
  function funcionForEach2(item, index){
      $(".top-cart-items").append(
        '<div class="top-cart-item clearfix">'+
          '<div class="top-cart-item-image">'+
            
          '<a href="'+ $("#edit_cart_url").val().replace('|||', item.collectionSlug).replace('@@@',(item.cartId).toString()) +  '"><img src="'+item.image+'" alt="'+item.name+'" /></a>'+
          '</div>'+
          '<div class="top-cart-item-desc">'+
            '<a href="#">'+item.name+'</a>'+
            '<span class="top-cart-item-price">$'+numberWithDots(item.price)+'</span>'+
          '<span class="top-cart-item-quantity quantity'+item.idProduct+'">x '+item.quantity+'</span>'+
          '</div>'+
        '</div>')
  } 
  cartList.forEach(funcionForEach2);
})
}

/* Visualize the product in the shopping cart */


var cartList = [];

if(localStorage.getItem("productList") !== null){

    var cartList = JSON.parse(localStorage.getItem("productList"));

    /* Add the HTML in the product found in LocalStorage */

    cartList.forEach(funcionForEach);

    function funcionForEach(item, index){
      $(document).ready(function() {
          if($("#edit_cart_url").val()){
            $(".bodyCart").append(
              '<tr class="cart_item">'+
                '<td class="cart-product-remove">'+
                  '<a href="#" class="remove removeItemCart" idProduct="'+item.idProduct+'" title="Remove this item"><i class="icon-trash2"></i></a>'+
                '</td> '+ 
                
                '<a href="/' + index.toString() +  '" class="button button-circle editCart" > Editar DISEÑO </a> ' 
                +
    
                '<td class="cart-product-thumbnail">'+
                  '<a href="'+ $("#edit_cart_url").val().replace('|||', item.collectionSlug).replace('@@@',(item.cartId).toString()) +  '"><img width="64" height="64" src="'+item.image+'" alt="'+item.name+'"/></a>'+
                '</td>'+
          
                '<td class="cart-product-name">'+
                    '<a href="#" class="itemname" itemName="'+item.name+'">'+item.name+'</a>'+
                '</td>'+
          
                '<td class="cart-product-price">'+
                    '<span class="amount itemPrice" itemPrice="'+item.price+'">$'+numberWithDots(item.price)+'</span>'+
                '</td>'+
          
                '<td class="cart-product-quantity">'+
                  '<div class="quantity clearfix">'+
                    '<input type="button" value="-" class="minus">'+
                    '<input type="text" class="qty" name="quantity" value="'+item.quantity+'" itemPrice="'+item.price+'" idProduct="'+item.cartId+'" weight="4"/>'+
                    '<input type="button" value="+" class="plus">'+
                  '</div>'+
                '</td>'+
          
                '<td class="cart-product-subtotal">'+
                  '<span class="amount subTotal'+item.cartId+' subTotals">$'+numberWithDots(item.price)+'</span>'+
                '</td>' +
              '</tr>'+
              '<input class="collectionSlug" type="hidden" value="'+ item.collectionSlug +'"> </input>'  + 
              '<input class="cartId" type="hidden" value="'+ (item.cartId).toString() +'"> </input>' )
          }     
        })
    }      

    /* Añadir el HTML de la página base con los productos que se encuentran el LocalStorage */
    updateTopCart();
    
}
else{
  $(document).ready(function() {
    $(".bodyCart").html('<div class="well" > Aún no hay elementos en el carrito de compras.')
    $(".coupon").hide()
    $(".checkout").hide()
    $(".shipping").hide()
    $(".totalCart").hide()
  })
}

$(document).ready(function() {
/**
 * ADD TO CART
 */

  $(".addCart").click(function(){

    var dictUrl;
    //calculamos un id para el producto
    var cartId;
    
    if(!localStorage.getItem("cartId")){
      cartId = "0";
    }else{
      cartId=localStorage.getItem("cartId");
    }

    if(!localStorage.getItem("dictUrl")){
      dictUrl = {};
    }else{
      dictUrl=JSON.parse(localStorage.getItem("dictUrl"));
    }

    //Get url export file:
    getUrls(customModel).then(value=>{
       dictUrl[cartId] = value;
       localStorage.setItem("dictUrl",JSON.stringify(dictUrl));
    });

    var idProduct = $(this).attr("idProduct");
    var name = $(this).attr("nameProduct");
    var image = $(this).attr("image");
    var price = $(".valuePrice").html().replace("$","");
    var collectionSlug = $(this).attr("collectionSlug");
    var params = customModel.viewer.getParameterValues(); //Params of shape diver model

    
    // Delete tag "No product in shopping cart" in case of add first element:
    if(cartList.length == 0){
      $(".top-cart-items").html("");
    }

    // save in local storage. 
    cartList.push({
      "idProduct": idProduct,
      "name": name,
      "image": image,
      "price": price,
      "quantity": "1",
      "params":params,
      "collectionSlug":collectionSlug,
      "cartId":cartId
    })

    var preN = cartId;
    var n = parseInt(cartId) + 1;
    if(n==1){
      $("#top-cart-action").show();
    }

    cartId = n.toString();

    /*================  UPDATE CART LOCALSTORAGE=========================*/
    localStorage.setItem("productList", JSON.stringify(cartList))
    localStorage.setItem("cartId", cartId)

    var quantityCart = Number($(".quantityCart").html()) + 1;
    var sumCart = Number($(".sumCart").html().replace("$","").replace(".","")) + Number(price.replace(".", ""));

    $(".quantityCart").html(quantityCart);
    $(".sumCart").html("$"+numberWithDots(sumCart));

    //Agregando el producto en el top-cart
    $(".top-cart-items").append(
      '<div class="top-cart-item clearfix">'+
        '<div class="top-cart-item-image">'+
        '<a href="'+ $("#edit_cart_url").val().replace('|||', collectionSlug).replace('@@@',(preN).toString()) +  '"><img src="'+image+'" alt="'+name+'" /></a>'+
        '</div>'+
        '<div class="top-cart-item-desc">'+
          '<a href="#">'+name+'</a>'+
          '<span class="top-cart-item-price">$'+numberWithDots(price)+'</span>'+
        '<span class="top-cart-item-quantity quantity'+idProduct+'">x 1</span>'+
        '</div>'+
      '</div>')
    

    localStorage.setItem("quantityCart", quantityCart);

    //Validate coupons
    localStorage.setItem("sumCart", sumCart);

    swal({
      title: "",
      text: "Se ha agregado un nuevo producto al carrito de compras!",
      type: "success",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      cancelButtonText: "Continuar comprando",
      confirmButtonText: "Ir a mi carrito de compras",
      closeOnConfirm: false
    },
    function(isConfirm){
      if(isConfirm){
        window.location = "../cart";
      }
    })

  })


/**
 * GUARDAR MODIFICACION CARRITO
 */

  $(".saveCart").click(function(){
    var params = customModel.viewer.getParameterValues(); //Params of shape diver model
    var temporalList = JSON.parse(localStorage.getItem("productList"));
    var price = $(".js-price").html().replace(".", "").replace("$","");

    for(i in temporalList){
      if(temporalList[i]['cartId'] == position.toString()){
        temporalList[i]['params'] = params; 
        temporalList[i]['price'] = price; //price from configurator.js
        localStorage.setItem("productList",JSON.stringify(temporalList));
        break;
      }
    }

    console.log(temporalList,$("#cart_url").val());

    window.location.replace($("#cart_url").val());

    
  })
})

/*==========================================
============================================
=====REMOVE ITEMS FROM CART ================
===========================================*/


//Function for get params for list
function getParamforList(objects,id){
  for(i in objects){
    if(objects[i]["cartId"] == id.toString()){
      return(objects[i]['params']);
    }
  }
}


/*
REMOVE ITEMS FROM CART
*/

$(document).ready(function(){
  $(".removeItemCart").click(function(){
    $(this).parent().parent().remove();

    var idProduct = $(".bodyCart .remove");
    var name = $(".bodyCart .itemname");
    var image = $(".bodyCart img")
    var price = $(".bodyCart .itemPrice");
    var quantity = $(".bodyCart .qty");
    var slugs = $(".bodyCart .collectionSlug");
    var collectionCartIds = $(".bodyCart .cartId");

    /*Si aún quedan productos, volverlos a agregar*/
    cartList = [];

    var tempDictUrl =  JSON.parse(localStorage.getItem("dictUrl"));
    var dictUrl={};

    temporalCartList = JSON.parse(localStorage.getItem("productList"));
    if(idProduct.length != 0){
      for(var i=0; i<idProduct.length; i++){
        var idProductArray = $(idProduct[i]).attr("idProduct");
        var nameArray = $(name[i]).attr("itemName");
        var imageArray = $(image[i]).attr("src");
        var priceArray = $(price[i]).attr("itemPrice");
        var quantityArray = $(quantity[i]).val();
        var slug = $(slugs[i]).val();
        var collectionCartId = $(collectionCartIds[i]).val();

        
        var params = getParamforList(temporalCartList, collectionCartId);

       
        cartList.push({
          "idProduct": idProductArray,
          "name": nameArray,
          "image": imageArray,
          "price": priceArray,
          "quantity": quantityArray,
          "params":params,
          "collectionSlug":slug,
          "cartId":collectionCartId
        });
        dictUrl[collectionCartId] = tempDictUrl[collectionCartId];
      }

      localStorage.setItem("productList", JSON.stringify(cartList));
      updateTopCart()
      localStorage.setItem("dictUrl", JSON.stringify(dictUrl));
    }
    else{
      /*No quedan más productos en el carrito*/
      localStorage.removeItem("productList");
      localStorage.setItem("quantityCart", "0");
      localStorage.setItem("sumCart", "0");
      localStorage.setItem("cartId", "0");

      $(document).ready(function() {
        $(".quantityCart").html("0")
        $(".sumCart").html("0")
        $(".bodyCart").html('<div class="well" > Aún no hay elementos en el carrito de compras.')
        $(".coupon").hide()
        $(".checkout").hide()
        $(".shipping").hide()
        $(".totalCart").hide()
        $(".couponCode").hide()
        $(".applyCoupon").hide()
        $("#total").hide()
        $(".top-cart-items").html("<div class='top-cart-item clearfix'> <p style='margin-bottom: 0px'>No hay productos en el carrito.</p> </div>")
        $("#top-cart-action").hide();
        $("#cart").html("<strong> No hay productos en el carro </strong>")

      })
    }
    sumSubTotal();
    updateQuantityCart(cartList.length);

  })
})


/*==========================================
============================================
=====Generar subtotal dinámico================
===========================================*/
function updateSubTotal(){
  $(document).ready(function() {

      var quantity = $(".qty");

      for(var i=0; i<quantity.length; i++){
        var price = $(quantity[i]).attr("itemPrice");
        var idProduct = $(quantity[i]).attr("idProduct");
        var priceFormatted = price.replace(".","")
        $(".subTotal"+idProduct).html('$'+numberWithDots(quantity[i].value*priceFormatted));
      }
    
      /* Actualizar cantidad en el LocalStorage  */
      var idProduct = $(".bodyCart .remove");
      var name = $(".bodyCart .itemname");
      var image = $(".bodyCart img")
      var price = $(".bodyCart .itemPrice");
      var quantity = $(".bodyCart .qty");
      var slugs = $(".bodyCart .collectionSlug");
      var collectionCartIds = $(".bodyCart .cartId");

      cartList = []
      temporalCartList = JSON.parse(localStorage.getItem("productList"));
      
      var tempDictUrl =  JSON.parse(localStorage.getItem("dictUrl"));
      var dictUrl={};


      for(var i=0; i<idProduct.length; i++){
        var idProductArray = $(idProduct[i]).attr("idProduct");
        var nameArray = $(name[i]).attr("itemName");
        var imageArray = $(image[i]).attr("src");
        var priceArray = $(price[i]).attr("itemPrice");
        var quantityArray = $(quantity[i]).val();
        var slug = $(slugs[i]).val();
        var collectionCartId = $(collectionCartIds[i]).val();
       
        var params = getParamforList(temporalCartList, collectionCartId);

        cartList.push({
          "idProduct": idProductArray,
          "name": nameArray,
          "image": imageArray,       
          "price": priceArray,
          "quantity": quantityArray,
          "collectionSlug":slug,
          "cartId":collectionCartId,
          "params":params
        });
        dictUrl[collectionCartId] = tempDictUrl[collectionCartId];
      }

      localStorage.setItem("productList", JSON.stringify(cartList));
      localStorage.setItem("dictUrl", JSON.stringify(dictUrl));
      sumSubTotal();
      updateQuantityCart(idProduct.length);
  
  })
}
/*==========================================
============================================
=====Actualizar SubTotal================
===========================================*/

$(document).ready(function(){

  var priceCart = $(".itemPrice");
  var quantityItem = $(".qty");
  
  for(var i=0; i<priceCart.length; i++){

    var priceCartArray = $(priceCart[i]).attr("itemPrice");
    var quantityItemArray = $(quantityItem[i]).val();
    var idProductArray = $(quantityItem[i]).attr("idProduct");

    //var priceFormatted = Math.round(priceCartArray.replace(/[^0-9.-]+/g,""))
    var priceFormatted = priceCartArray.replace(".","")
    $(".subTotal"+idProductArray).html('$'+numberWithDots(priceFormatted*quantityItemArray));

    sumSubTotal();
    updateQuantityCart(priceCart.length);
    
  }
})


/*=============================================
=====Suma de todos los SubTotales================
===========================================*/

function sumSubTotal(){
  $(document).ready(function(){
    var subTotals = $(".subTotals")
    var arraySumSubTotals = []
    
    for(var i=0; i<subTotals.length; i++){
      //var subTotalsArray = $(subTotals[i]).html().replace(/[^0-9.-]+/g,"")
      var subTotalsArray = $(subTotals[i]).html().replace(".","").replace(/[^0-9.-]+/g,"")
      arraySumSubTotals.push(Number(subTotalsArray))
    }
    
    function sumArraySubTotals(total, number){
      return total + number
    }

    if(arraySumSubTotals.length != 0){
      var sumTotal = arraySumSubTotals.reduce(sumArraySubTotals)
      $(".sumSubTotals").html('$'+numberWithDots(sumTotal));
      $(".sumCart").html('$'+numberWithDots(sumTotal));
  
      //CHECKOUT
      //Total include shipping and coupon codes
      $(".sumTotal").html('$'+numberWithDots(sumTotal));
      calculateShippingCost();
  
      localStorage.setItem("sumCart", sumTotal)

    }
   
  })
}


/*==========================================
============================================
=====Actualizar Cantidad del carrito=========
===========================================*/

function updateQuantityCart(quantity){
  $(document).ready(function(){

    /*Hay productos en el carro?*/
    if(quantity != 0){
      var quantityItem = $(".qty");
      var arraySumQuantity = []
      
      for(var i=0; i<quantityItem.length; i++){
        var idProduct = $(quantityItem[i]).attr("idProduct")
        var quantityItemArray = $(quantityItem[i]).val()
        $(".quantity"+idProduct).html('x '+ quantityItemArray);
        arraySumQuantity.push(Number(quantityItemArray))
      }
      
      function sumArrayQuantity(total, number){
        return total + number
      }
      var sumTotalQuantity = arraySumQuantity.reduce(sumArrayQuantity)
      
      $(".quantityCart").html(sumTotalQuantity);
           
      localStorage.setItem("quantityCart", sumTotalQuantity)
      
    }
    else{
      
    }
  })
}

/*==========================================
============================================
=====           CHECKOUT    ================
===========================================*/

/*Cargando los datos de los select en el carrito y en el checkout*/
$(document).ready(function(){

  var sumTotal = parseInt(localStorage.getItem("sumCart")) +  parseInt(localStorage.getItem("shippingCost"))
  $(".sumTotal").html("<strong> $"  +  numberWithDots(sumTotal) + "</strong> ")

  $.ajax({
    url: "/static/js2/plugins/regions-communes.json",
    type: "GET",
    cache: false,
    contentType: false,
    processData: false,
    dataType: "json",
    success: function(response) {

      response.forEach(selectRegion);
      response[0].LOCALIDADES.forEach(selectLocalidad);
      
      function selectRegion(item, index){
        var base = item.BASE;
        //Se añaden las regiones BASE del JSON en el select
        $("#selectRegion").append('<option value="'+item.BASE+'">'+base+'</option>') 
      }

      function selectLocalidad(item, index){
        var codeLocalidad = item.CODIGO;
        var localidad = item.LOCALIDAD;
        var zona = item.ZONA;
        //Se añaden las localidades de la región BASE inicial seleccionada -> Santiago
        $("#selectLocalidad").append('<option value="'+codeLocalidad+'" zona="'+zona+'">'+localidad+'</option>') 


      }

      //Se setea la variable zona y base seleccionada para proceder a hacer la búsqueda del precio
      var zona = $('option:selected', "#selectLocalidad").attr('zona');
      var selectedBase = $('option:selected', "#selectRegion").val();
     
    },
    error: function(e) {
        console.log('Error!', e);
    }

  })

  /* Se ejecuta cada vez que cambia la selección de región BASE*/
  $("#selectRegion").change(function(){
    console.log('change region')
    $.ajax({
      url: "/static/js2/plugins/regions-communes.json",
      type: "GET",
      cache: false,
      contentType: false,
      processData: false,
      dataType: "json",
      success: function(response) {

        $("#selectLocalidad").html("")
  
        response.forEach(selectCommune);
        
        function selectCommune(item, index){
          if(item.BASE == ($("#selectRegion").val())){
            for(var i=0; i<item.LOCALIDADES.length; i++){
              var codeLocalidad = item.LOCALIDADES[i].CODIGO;
              var localidad = item.LOCALIDADES[i].LOCALIDAD;
              var zona = item.LOCALIDADES[i].ZONA;
              $("#selectLocalidad").append('<option value="'+codeLocalidad+'" zona="'+zona+'">'+localidad+'</option>')
            }
          }
        }
      },
      error: function(e) {
          console.log('Error!', e);
      }
    })

    lastSelectedRegion = selectRegion.options[selectRegion.selectedIndex].value;
    localStorage.setItem('selectRegion', lastSelectedRegion)
  })

  /*Se selecciona cada vez que cambia el select de la localidad*/
  $("#selectLocalidad").change(function(){
    var zona = $('option:selected', this).attr('zona');
    var selectedBase = $('option:selected', "#selectRegion").val();

    //ShippingCost 
    calculateShippingCost();
  })
})

function calculateShippingCost(){
  $.ajax({
    url: "/static/js2/plugins/tarifas-express.json",
    type: "GET",
    cache: false,
    contentType: false,
    processData: false,
    dataType: "json",
    success: function(response) {

      //Seteando la zona y la base seleccionadas
      var zona = $('option:selected', "#selectLocalidad").attr('zona');
      var selectedBase = $('option:selected', "#selectRegion").val();
      
      //Arreglo con los pesos
      var weightArray = $(".quantity");

      var sumWeight = 0 

      //Lo siguiente es por si se está llamando el shipping desde cart.html
      if($(weightArray[0]).attr("weight") === undefined){

        weightArray = $(".qty")
        
        for(var i=0; i<weightArray.length; i++){
          var quantity = $(weightArray[i]).val();
          var weight = $(weightArray[i]).attr("weight");
          sumWeight += quantity*weight
        }
      }
      //Desde checkout.html
      else{
        for(var i=0; i<weightArray.length; i++){
          var quantity = $(weightArray[i]).html().split("x ").join("")
          var weight = $(weightArray[i]).attr("weight")
          sumWeight += quantity*weight
        }
      }
              
      //Buscando la zona, la base y el rango de peso al que pertenece el peso total
      for(var i=0; i<response.length; i++){
        //Check Zona
        if(response[i].ZONA == zona){
          //Check BASE
          for(var j=0; j<response[i].COSTOS.length; j++){
            if(response[i].COSTOS[j].BASE == selectedBase){
              var minimo = (response[i].COSTOS[j].MINIMO);
              minimo = Number(minimo.split(".").join(""))
         
              //Seleccionando el rango al que pertenece sumWeight
              var tarifas = response[i].COSTOS[j];
            }
          }
        }
      }   

      for (var tarifa in tarifas){
        //Chequeando solo los elementos que contienen un "arreglo"
        if(tarifa.includes(",")){
          var tarifaArray = JSON.parse("[" + tarifa + "]");
          //Chequeando a cuál intervalo pertenece
          if(sumWeight <= tarifaArray[1] && sumWeight >= tarifaArray[0]){
            var selectedTarifaString = tarifaArray[0]+','+tarifaArray[1]; //elemento al que pertenece
          } 
        }
      } 
      //Buscamos el valor en la matriz
      var tarifaFinal = tarifas[selectedTarifaString]

      //Calculamos el costo total de envío
      var totalShippingCost = tarifaFinal * sumWeight

      //Validamos que el costo del envío sea mayor que el mínimo, si no se usa el mínimo
      if(totalShippingCost < minimo){
        totalShippingCost = minimo 
      }

      //Updateando el precio en el html
      $(".totalShippingCost").html("<span>$"+numberWithDots(totalShippingCost)+"</span>")

      //Actualizando el sumTotal
      sumTotal = localStorage.getItem("sumCart").replace(".","");
      var totalWithShipping = Number(sumTotal) + Number(totalShippingCost)

      $(".sumTotal").html("<strong> $"  +  numberWithDots(totalWithShipping) + "</strong> ")
      $(".sumCart").html('$'+numberWithDots(totalWithShipping));

      //Guardando el costo en localStorage
      localStorage.setItem("shippingCost", JSON.stringify(totalShippingCost))

    }
  })
}

/*Se capturan los atributos provenientes del carrito de compras al hacer click en el botón que lleva al checkout"*/
$(document).ready(function(){
  $("#btnCheckout").click(function(){
    var userId = $(this).attr("userId");
    var weightArray = $(".qty");
    var nameArray = $(".bodyCart .itemname");
    var imageArray = $(".bodyCart img")
    var quantityArray = $(".bodyCart .qty");
    var subTotalsArray = $(".subTotals");  

    var weightArrayAux = []
    var nameArrayAux = []
    var imageArrayAux = []
    var quantityArrayAux = []
    var subTotalsArrayAux = []

    for(var i=0; i<weightArray.length; i++){
      var weight = $(weightArray[i]).attr("weight")
      var name = $(nameArray[i]).attr("itemName")
      var image = $(imageArray[i]).attr("src")
      var quantity = $(quantityArray[i]).val()
      var subTotal = $(subTotalsArray[i]).html()

      weightArrayAux.push(weight)
      nameArrayAux.push(name)
      imageArrayAux.push(image)
      quantityArrayAux.push(quantity)
      subTotalsArrayAux.push(subTotal)
    }

    localStorage.setItem("userId", JSON.stringify(userId))
    localStorage.setItem("weightArray", JSON.stringify(weightArrayAux))
    localStorage.setItem("nameArray", JSON.stringify(nameArrayAux))
    localStorage.setItem("imageArray", JSON.stringify(imageArrayAux))
    localStorage.setItem("quantityArray", JSON.stringify(quantityArrayAux))
    localStorage.setItem("subTotalsArray", JSON.stringify(subTotalsArrayAux))

  })
})

/*Se cargan los atributos guardados en localStorage para cargar en el html del checkout*/
$(document).ready(function(){
  var userId = JSON.parse(localStorage.getItem("userId"));
  var weightArray = JSON.parse(localStorage.getItem("weightArray"))
  var nameArray = JSON.parse(localStorage.getItem("nameArray"))
  var imageArray = JSON.parse(localStorage.getItem("imageArray"))
  var quantityArray =  JSON.parse(localStorage.getItem("quantityArray"))
  var subTotalsArray = JSON.parse(localStorage.getItem("subTotalsArray"))

  console.log(weightArray);
  if(weightArray !== null){
    for(var i=0; i<weightArray.length; i++){
      $(".detailProductCheckout").append(
        '<tr class="cart_item">'+
          '<td class="cart-product-thumbnail">'+
            '<a href="#"><img width="64" height="64" src="'+imageArray[i]+'"></a>'+
          '</td>'+
      
          '<td class="cart-product-name">'+
            '<a href="#">'+nameArray[i]+'</a>'+
          '</td>'+
      
          '<td class="cart-product-quantity">'+
            '<div class="quantity clearfix" weight="'+weightArray[i]+'">x '+quantityArray[i]+'</div>'+
          '</td>'+
                    
          '<td class="cart-product-subtotal">'+
            '<span class="amount">'+numberWithDots(subTotalsArray[i])+'</span>'+
          '</td>'+
        '</tr>'
      ) 
  
      //Actualizando el total antes de pagar...
      sumTotal = localStorage.getItem("sumCart");
      $(".sumSubTotals").html('$'+numberWithDots(sumTotal));
    }
  }
                                                                              
  $(".totalShippingCost").html("<span>$"+numberWithDots(localStorage.getItem("shippingCost"))+"</span>")

  //Selected values from cart.js

})

/*Se clickea el botón PAGAR */
$(document).ready(function(){
  $(".btnPay").click(function(event){
    //Validaciones antes de proceder al order-detail

    //Dirección vacía
    if($("#address").val() == ""){
      $(".addressAlert").remove();
      $(".btnPay").after('<div class="alert alert-warning addressAlert">No ha puesto su dirección.</div>')
      event.preventDefault();
    }
    else{
      $(".addressAlert").remove();
    }

    //No ha calculado el envío
    if($(".totalShippingCost").html() == ""){
      $(".shippingAlert").remove();
      $(".btnPay").after('<div class="alert alert-warning shippingAlert">Debe calcular costo de envío.</div>')
      event.preventDefault();
    }else{
      $(".shippingAlert").remove();
    }
  })
})


/*==========================================
============================================
=====           ORDER-DETAIL   =============
===========================================*/

/*Function to display a beauty date*/
function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + " " + strTime;
}

$(document).ready(function(){
  //Setear la fecha de hoy
  var date = new Date();
  $(".dateToday strong").html(formatDate(date))
})

function numberWithDots(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
