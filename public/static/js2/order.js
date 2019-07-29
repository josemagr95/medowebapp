$(document).ready(function(){
  var weightArray = JSON.parse(localStorage.getItem("weightArray"))
  var nameArray = JSON.parse(localStorage.getItem("nameArray"))
  var quantityArray =  JSON.parse(localStorage.getItem("quantityArray"))
  var subTotalsArray = JSON.parse(localStorage.getItem("subTotalsArray"))

  sumTotal = localStorage.getItem("sumCart");
  shippingCost = localStorage.getItem("shippingCost");
  console.log(shippingCost)

  $(".productOrderDetail").html("");

  for(var i=0; i<weightArray.length; i++){
    $(".productOrderDetail").append(
      '<tr class="cart_item">'+
        '<td class="cart-product-name">'+
        nameArray[i]+
        '<span class="amount"> x '+quantityArray[i]+'</span>'+
        '</td>'+
        '<td class="cart-product-name">'+
          '<span class="amount">'+numberWithDots(subTotalsArray[i])+'</span>'+
        '</td>'+
      '</tr>')
  }
  $(".productOrderDetail").append(
    '<tr class="cart_item">'+
    '<td class="cart-product-name">'+
        'Subtotal' +
    '</td>'+
    '<td class="cart-product-name">'+
        '<span class="amount">$'+ numberWithDots(Number(sumTotal)) +'</span>'+
    '</td>'+
  '</tr>'+
  '<tr class="cart_item">'+
    '<td class="cart-product-name">'+
        'Envío'+
    '</td>'+

    '<td class="cart-product-name">'+
      '<span class="amount">$'+ numberWithDots(Number(shippingCost)) +'</span>'+
    '</td>'+
  '</tr>'+
  '<tr class="cart_item">'+
    '<td class="cart-product-name">'+
      'Método de pago'+
    '</td>'+

    '<td class="cart-product-name">'+
      '<span class="amount">Transbank Webpay</span>'+
    '</td>'+
  '</tr>'+
  '<tr class="cart_item">'+
   ' <td class="cart-product-name">'+
        '<strong>Total</strong>'+
    '</td>'+

    '<td class="cart-product-name">'+
      '<span class="amount"><strong>$'+ numberWithDots(Number(sumTotal) + Number(shippingCost)) +'</strong></span>'+
    '</td>'+
  '</tr>'
  )

})

