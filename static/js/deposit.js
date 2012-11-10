$(document).ready(function() {
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
        $("#id_user option").removeAttr('selected');
        $("#id_user option[value="+id+"]").attr('selected','selected');
    });
    /* Hide alert messages */
    $("a[data-dismiss=alert]").click(function(){
        $(this).parent().parent().parent().slideUp();
    });
    setTimeout( function() {
        $("a[data-dismiss=alert]").parent().parent().parent().slideUp();
    }, 5000);

});
