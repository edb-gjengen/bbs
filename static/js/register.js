$(document).ready(function() {
    function enable_all_customers() {
        $("li.customer").each(function(i) {
            $(this).removeClass("selected");
        });
    }
    /* Customer selection */
    $("li.customer").click( function() {
        enable_all_customers();
        /* Disable the customer button just clicked */
        $(this).addClass("selected");
        /* Update the field */
        $("input[name=customer]").val($(this).children("span.name").text());
    });
    /* Product amount controls */
    $("li.product").click( function() {
        var form_field = $(this).children("input[type=text]");
        var qty = Number(form_field.val()) + 1;
        form_field.val(qty);
    });
    /* Form reset */
    $("input[type=reset]").click( function() {
        $("input[name=customer]").val("");
        enable_all_customers();
    });

});
