$(document).ready(function() {
    function enable_all_customers() {
        $("li.customer").each(function(i) {
            $(this).removeClass("marked");
            $(this).show();
        });
    }
    function filter_customers(typed) {
        /* FIXME: Does not work well. */
        setTimeout(function() {
            $("li.customer").each(function(i) {
                if($(this).children("span.name").text().indexOf(typed) == -1) {
                    $(this).hide();
                    $(this).removeClass("marked");
                } else {
                    $(this).show();
                }
                /* Full match */
                if($(this).children("span.name").text() == typed) {
                    $(this).addClass("marked");
                }
            });
        }, 50);
    }
    /* Customer search */
    $('.typeahead').typeahead();
    $('#id_customer_name').keydown(function(event) {
        filter_customers(event.srcElement.value);
    });
    /* Customer selection */
    $("li.customer").click( function() {
        enable_all_customers();
        /* Disable the customer button just clicked */
        $(this).addClass("marked");
        /* Update the typeahead field */
        var name = $(this).children("span.name").text()
        $("#id_customer_typeahead").val(name);
        /* Update the select field */
        var id = $(this).children("span.id").text()
        $("#id_customer option").removeAttr('selected');
        $("#id_customer option[value="+id+"]").attr('selected','selected');
    });
    /* Product amount controls */
    $("li.product").click( function() {
        var form_field = $(this).children("input[type=text]");
        var qty = Number(form_field.val()) + 1;
        form_field.val(qty);
        /* Update total*/
        var sale_price_int = Number($(this).children("span.sale_price_int").text());
        var cur_total = Number($("span.total_text").text())
        $("span.total_text").html(cur_total + sale_price_int);
    });
    /* Form reset */
    $("button[type=reset]").click( function() {
        $('#id_customer option').removeAttr('selected');
        $("#id_customer_typeahead").val("");
        $("span.total_text").html("");
        enable_all_customers();
    });
    /* Hide alert messages */
    $("a[data-dismiss=alert]").click(function(){
        $(this).parent().parent().parent().slideUp();
    });
    setTimeout( function() {
        $("a[data-dismiss=alert]").parent().parent().parent().slideUp();
    }, 5000);

});
