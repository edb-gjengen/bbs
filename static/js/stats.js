$(document).ready(function() {
    /* TODO select data element with index 0 of each pie-chart */
    var charts = [];
    var products_url = '/stats/products/';
    var order_url = '/stats/orders/';
    var order_hourly_url = '/stats/orders/hourly';

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
                series: {
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
});
