function enable_all_customers() {
    $("li.customer").each(function(i) {
        $(this).removeClass("marked");
        $(this).show();
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
                var single_match = $("li.customer:visible").length == 1;
                console.log(full_match, single_match);
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
function update_total() {
    var total = 0;
    $('li.product').each(function() {
        var amount = Number($(this).find('[name$=amount]').val());

        var price_selector = '.sale_price_int';
        if($("#id_customer_typeahead").val() === "Ekstern") {
            price_selector = '.sale_price_ext';
        }
        var sale_price = Number($(this).find(price_selector).text());

        total += amount * sale_price;
    });
    if(total === 0) {
        total = "";
    }
    $("span.total_text").html(total);
}

$(document).ready(function() {
    var $alerts = $("a[data-dismiss=alert]");
    /* Hide alert messages */
    $alerts.click(function(){
        $(this).parent().parent().parent().slideUp();
    });
    setTimeout( function() {
        $alerts.parent().parent().parent().slideUp();
    }, 5000);

    /* Tooltips */
    $("h2").tooltip({placement: 'right'});
    $("img.customer").tooltip();
    $("a.product").tooltip();
    $(".love").tooltip();

    /* 
     * View: Deposit and register
     */

    /* Customer search */
    $('#id_customer_typeahead').keyup(function(event) {
        filter_customers(event.target.value);
    });
    /* Customer selection */
    $("li.customer").click( function() {
        enable_all_customers();
        /* Disable the customer button just clicked */
        $(this).addClass("marked");
        /* Update the typeahead field */
        var name = $(this).children("span.name").text();
        $("#id_customer_typeahead").val(name);
        /* Update the select field */
        var id = $(this).children("span.id").text();
        $("#id_customer option, #id_user option").removeAttr('selected');
        if(id === "") {
            // External user
            $("#id_customer option:first-child, #id_user option:first-child").attr('selected','selected');
        } else {
            $("#id_customer option[value="+id+"], #id_user option[value="+id+"]").attr('selected','selected');
        }
        update_total(this);
    });

    /* Set Global Highcharts options */

    Highcharts.setOptions({
        credits: {
            enabled: false
        }
    });

    /*
     * View: Register
     */

    /* Product amount controls */
    $("#register li.product").click( function() {
        /* Mark the product as selected */
        $(this).addClass("marked");
        /* Update amounts */
        var form_field = $(this).children("input[name$=amount]");
        var display = $(this).children(".qty");
        var qty = Number(form_field.val()) + 1;
        form_field.val(qty);
        display.html(qty);
        /* Update total*/
        update_total(this);
    });
    /* Form reset */
    $("#register button[type=reset]").click( function() {
        $('#id_customer option').removeAttr('selected');
        $("#id_customer_typeahead").val("");
        $("span.total_text").html("");
        enable_all_customers();
        enable_all_products();
        reset_qtys();
    });

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

    /*
     * View: Inventory report
     */
    var start_field = $(".inventory-report-form #id_start_time");
    start_field.datepicker({
        language: 'nb',
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        weekStart: 1,
        endDate: new Date()
    }).on('changeDate', function(e) {
        end_field.datepicker('setStartDate', e.date);
    });
    var end_field = $(".inventory-report-form #id_end_time");
    end_field.datepicker({
        language: 'nb',
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        weekStart: 1,
        endDate: new Date()
    }).on('changeDate', function(e) {
        start_field.datepicker('setEndDate', e.date);
    });
});