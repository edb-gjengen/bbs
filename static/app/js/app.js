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
    /* Hide alert messages */
    $("a[data-dismiss=alert]").click(function(){
        $(this).parent().parent().parent().slideUp();
    });
    setTimeout( function() {
        $("a[data-dismiss=alert]").parent().parent().parent().slideUp();
    }, 5000);

    /* Tooltips */
    $("h2").tooltip({placement: 'right'});
    $("img.customer").tooltip();
    $("a.product").tooltip();
    $("#footer .credits .love").tooltip();

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
     * View: Stats
     */
    if( $("#stats").length > 0) {
        /* TODO select data element with index 0 of each pie-chart */
        var charts = [];
        var products_url = '/stats/products/';
        var order_url = '/stats/orders/';
        var order_hourly_url = '/stats/orders/hourly';
        var products_realtime_url = '/stats/orders/products_realtime';

        /* orders */
        $.getJSON(order_url, function(data) {
            var render_to = 'order_chart';

            // define the options
            var options =  {
                credits: {
                    enabled: false
                },
                chart: {
                    renderTo: render_to,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: 'Fordeling av ordre på person'
                },
                tooltip: {
                    formatter: function() {
                        return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(this.percentage, 1) +' %';
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function() {
                                return '<b>'+ this.point.name +'</b>: '+ this.y;
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Orders',
                    data: data
                }]
            };
            charts.push(new Highcharts.Chart(options));
        });

        /* products */
        $.getJSON(products_url, function(data) {
            var products = data.response.products;
            for(var i in products) {
                var render_to = 'product_chart' + products[i].product.id;
                var series_data = products[i].counts;
                // define the options
                var options =  {
                    credits: {
                        enabled: false
                    },
                    chart: {
                        renderTo: render_to,
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        text: products[i].product.name
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(this.percentage, 1) +' %';
                        }
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                color: '#000000',
                                connectorColor: '#000000',
                                formatter: function() {
                                    return '<b>'+ this.point.name +'</b>: ' + this.y;
                                }
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Orders',
                        data: series_data
                    }]
                };
                charts.push(new Highcharts.Chart(options));
            }
        });
          /* orders hourly */
        $.getJSON(order_hourly_url, function(data) {
            var render_to = 'order_hourly_chart';

            // define the options
            var options =  {
                credits: {
                    enabled: false
                },
                chart: {
                    renderTo: render_to,
                    type: 'column'
                },
                title: {
                    text: 'Ordre - time for time'
                },
                tooltip: {
                    formatter: function() {
                        return this.y + " stk";
                    }
                },
                yAxis: {
                    title: {
                        text: 'Ordre'
                    },
                },
                xAxis: {
                    title: {
                        text: 'Tid (h)'
                    },
                    labels: {
                        formatter: function() {
                            return this.value + ":00";
                        },
                    }
                },
                plotOptions: {
                    column: {
                        minPointLength: 3,
                    },
                    series: {
                        groupPadding: 0,
                        pointPadding: 0.05,
                    },
                },
                series: [{
                    name: 'Ordre',
                    data: data.hourly
                }]
            };
            charts.push(new Highcharts.Chart(options));
        });
        
        var products_realtime_chart = new Highcharts.Chart({
            chart: {
                renderTo: 'products_realtime_chart'
            },
            title: {
                text: "Produkter solgt over tid"
            },
            xAxis: {
                type: "datetime"
            },
            yAxis: {
                title: {
                    text: "Antall solgt"
                }            
            },
            
            plotOptions: {
                series: {
                    marker: {
                        radius: 3
                    }
                }
            },
            
            series: {}
        });
        charts.push(products_realtime_chart);
        
        function parse_products_realtime_data(data) {
            var chart = products_realtime_chart;
            
            for (var product in data.products) {
                if (chart.get(product) === null) {
                    chart.addSeries({
                        data: [],
                        id: product,
                        name: product
                    });
                    
                    var series = chart.get(product);
                    _.each(data.products[product], function(point) {
                        series.addPoint({
                            id: point[0],
                            x: point[0],
                            y: point[1]
                        });
                    });
                }
                else {
                    var series = chart.get(product);
                    _.each(data.products[product], function(point) {
                        if (chart.get(point[0]) === null) {
                            series.addPoint({
                                id: point[0],
                                x: point[0],
                                y: point[1]
                            });
                        }
                    });
                }
            }
        }
        
        function get_products_realtime_data() {
            var that = this;
            $.ajax( {
                url: products_realtime_url,
                dataType: "json",
                success: function (data) {
                    parse_products_realtime_data(data);
                    
                    setTimeout(function () {
                        get_products_realtime_data();
                    }, 15000);
                },
                cache: false
            });
        }
        
        get_products_realtime_data();

    }

    /* 
     * View: Add user
     */
    var input_selector = "#id_facebook_username";
    /* Facebook username check */
    $(input_selector).on('keyup', _.debounce(function(event) {
        var user_id = event.target.value;
        if(user_id.trim().length === 0) {
            $(input_selector).parent().removeClass('has-success has-feedback has-error');
            $(input_selector).parent().find(".facebook-image img").attr('src', no_picture_url);
            return;
        }
        var picture_url = "https://graph.facebook.com/" + user_id + "/picture";
        var static_url = $("meta[name=x-django-static-url]").attr('content');
        var no_picture_url = static_url +"img/unknown_person.png";
        $.ajax({
            url: picture_url,
            statusCode: {
                200: function() {
                    $(input_selector).parent().addClass('has-success has-feedback');
                    $(input_selector).parent().removeClass('has-error');
                    $(input_selector).parent().find(".facebook-image img").attr('src', picture_url);
                    
                },
                404: function() {
                    $(input_selector).parent().addClass('has-error has-feedback');
                    $(input_selector).parent().removeClass('has-success');
                    $(input_selector).parent().find(".facebook-image img").attr('src', no_picture_url);
                }
            }
        });
    }, 300)); // Only every 300ms

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
