$(document).ready(function(){
  $(".discount").hide();
  //Capturar el elemento del input coupon, si es distinto de vacío se ejecuta el ajax
  $(".applyCoupon").click(function(){
    $(".sumTotal").html('$'+numberWithDots(Math.round(Number(sumTotal))));
    calculateShippingCost();          

    $(".discount").hide();

    checkCoupon();

  })
})


function checkCoupon(){
  if($("#couponCode").val() !== ""){

    var coupon = $("#couponCode").val(); // get coupon

    $.ajax({
      url: "/static/js2/plugins/coupons.json",
      type: "GET",
      cache: false,
      contentType: false,
      processData: false,
      dataType: "json",
      success: function(response) {

        var coupons = response["coupons"];
        var discount = null;

        for (var i=0; i<coupons.length; i++){

          if(coupons[i]["code"] == coupon){
            discount = coupons[i].discount; //get discount from coupon
            if(discount == "total"){
              $(".sumTotal").html('$'+0);
              $(".discount").show();
              $(".discount .nameDiscount").html("Discount");
              $(".discount .discountAmount").html("FREE");

              return discount;
            }
            else{
              $(".sumTotal").html('$'+numberWithDots(Math.round(Number(sumTotal)*  (1- Number(discount))   )));
              $(".discount").show();
              $(".discount .nameDiscount").html("Discount");
              $(".discount .discountAmount").html( (Number(discount)*100).toString() + "%");
              return discount;

            }
          }
        }

      },
      error: function(e) {
          console.log('Error!', e);
      }
    })


  }
  else{
    console.log("Es vacío")
  }
}