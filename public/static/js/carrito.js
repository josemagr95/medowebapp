/**
 *
 * AGREGAR AL CARRITO 
 *
 */
var cartList = [];

if(localStorage.getItem("productList") !== null){
  var cartList = JSON.parse(localStorage.getItem("productList"));
  
  /* Añadir el HTML con los productos que se encuentran el LocalStorage */
  cartList.forEach(funcionForEach);

  function funcionForEach(item, index){
    console.log(item.imageProduct);
    $(document).ready(function() {
      $(".cuerpoCarrito").append(
        '<div class="row itemCarrito">'+
          '<div class="col-sm-1 col-xs-12">'+
            '<br>'+
            '<center>'+
              '<button class="btn btn-default backColor">'+
                '<i class="fa fa-times"></i>'+
              '</button>'+
            '</center>'+
          '</div>'+

          '<div class="col-sm-1 col-xs-12">'+
            '<br>'+
            '<figure>'+
              '<img src="{{ MEDIA_PATH }}/images/designs'+item.imageProduct+'" class="img-thumbnail">'+
            '</figure>'+
          '</div>'+

          '<div class="col-sm-4 col-xs-12">'+
            '<br>'+
            '<p class="tituloCarritoCompra text-left">'+item.name+'</p>'+
          '</div>'+

          '<div class="col-md-2 col-sm-1 col-xs-12">'+
            '<br>'+
            '<p class="precioCarritoCompra text-left">USD $<span>'+item.price+'</span></p>'+
          '</div>'+

          '<div class="col-md-2 col-sm-3 col-xs-8">'+
            '<br>'+
            '<div class="col-xs-8">'+
              '<center>'+
                '<input type="number" class="form-control text-center" min="1" value="'+item.quantity+'" tipo="'+item.quantity+'>'+
              '</center>'+
            '</div>'+
          '</div>'+

          '<div class="col-md-2 col-sm-1 col-xs-4">'+
            '<br>'+
            '<p>'+
              '<strong>USD $<span>10</span></strong>'+
            '</p>'+
          '</div>'+
          '<div class="clearfix"></div>'+
          '<hr>'+
        '</div>')
      })
  }      
}

$(document).ready(function() {
  $(".addCart").click(function(){
    var idProduct = $(this).attr("idProduct");
    var name = $(this).attr("name");
    var imageProduct = $(this).attr("imageProduct");
    var price = $(this).attr("price");

    /* ALMACENAR EN LOCALSTORAGE LOS PRODUCTOS AGREGADOS AL CARRITO */

    cartList.push({
      "idProduct": idProduct,
      "name": name,
      "imageProduct": imageProduct,
      "price": price,
      "quantity": "1"
    })

    console.log(cartList);
    
    localStorage.setItem("productList", JSON.stringify(cartList))

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
        window.location = "../carrito";
      }
    })
  })
})
