$(document).ready(function() {
    var charts = [];
    var products_url = '/stats/products/';
    var order_url = '/stats/orders/';

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
                            return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(this.percentage, 1) +' %';
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
        for(i in products) {
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
});
