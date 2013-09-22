$(document).ready(function() {
    function enable_all_customers() {
        $("li.customer").each(function(i) {
            $(this).removeClass("marked");
            $(this).show();
        });
    }
    function enable_all_products() {
        $("li.product").each(function(i) {
            $(this).removeClass("marked");
            $(this).show();
        });
    }
    function reset_qtys() {
        $(".qty").each(function(i) {
            $(this).html('0');
        });

        $("input[name$=amount]").each(function(i) {
            $(this).val("0");
        });
    }
    function filter_customers(typed) {
        setTimeout(function() {
            $("li.customer").each(function(i) {
                var pattern = new RegExp(typed,"i");
                var name = $(this).children("span.name").text();
                if(!pattern.test(name)) {
                    $(this).hide();
                    $(this).removeClass("marked");
                } else {
                    $(this).show();
                    var full_match = name.toLowerCase() == typed.toLowerCase();
                    // FIXME: needs one more char.
                    //var single_match = $("li.customer:visible").length == 1;
                    //console.log(full_match, single_match);
                    //if(full_match || single_match) {
                    if(full_match) {
                        $(this).addClass("marked");
                    } else {
                        $(this).removeClass("marked");
                    }
                }
            });
        }, 50);
    }
    /* Customer search */
    //$('.typeahead').typeahead();
    $('#id_customer_typeahead').keyup(function(event) {
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
        /* Mark the product as selected */
        $(this).addClass("marked");
        /* Update amounts */
        var form_field = $(this).children("input[name$=amount]");
        var display = $(this).children(".qty");
        var qty = Number(form_field.val()) + 1;
        form_field.val(qty);
        display.html(qty);
        /* Update total*/
        var sale_price_int = Number($(this).children("span.sale_price_int").text());
        var cur_total = Number($("span.total_text").text());
        $("span.total_text").html(cur_total + sale_price_int);
    });
    /* Form reset */
    $("button[type=reset]").click( function() {
        $('#id_customer option').removeAttr('selected');
        $("#id_customer_typeahead").val("");
        $("span.total_text").html("");
        enable_all_customers();
        enable_all_products();
        reset_qtys();
    });
    /* Hide alert messages */
    $("a[data-dismiss=alert]").click(function(){
        $(this).parent().parent().parent().slideUp();
    });
    setTimeout( function() {
        $("a[data-dismiss=alert]").parent().parent().parent().slideUp();
    }, 5000);

    $("h2").tooltip({placement: 'right'});
    /* Toggle infrequent users */
    $(".toggle-infrequent-users").on('click', function(e) {
        e.preventDefault();
        $("li.customer.infrequent").toggleClass('hidden');
        $(".users-description .infrequent-users").toggleClass('hidden');
        if($(this).text() === "Vis alle") {
            $(this).text("Skjul gamliser");
        }
        else {
            $(this).text("Vis alle");
        }
    });
});
