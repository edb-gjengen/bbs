
/* View: Stats */

var products = null;
var products_realtime_chart = null;
var products_url = '/api/products/';
var products_stat_url = '/api/products/group_by_user';

var order_url = '/stats/orders/';
var order_hourly_url = '/stats/orders/hourly';
var products_realtime_url = '/stats/orders/products_realtime';

function productFormatter() {
    return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(this.percentage, 1) +' %';
}
function parse_products_realtime_data(data, chart) {
    for (var product in data.products) {
        if (chart.get(product) === null) {
            chart.addSeries({
                data: [],
                id: product,
                name: product
            });
        }

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

function get_products_realtime_data() {
    var that = this;
    $.ajax( {
        url: products_realtime_url,
        dataType: "json",
        success: function (data) {
            parse_products_realtime_data(data, products_realtime_chart);

            setTimeout(function () {
                get_products_realtime_data();
            }, 15000);
        },
        cache: false
    });
}

function renderProductCharts(products) {
    for(var i in products) {
        var render_to = 'product_chart' + products[i].id;
        var series_data = products[i].counts;
        series_data = _.map(series_data, function (el) { return [el.full_name, el.amount_total]; });

        new Highcharts.Chart({
            chart: {
                renderTo: render_to,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: products[i].name
            },
            tooltip: {
                formatter: productFormatter
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
        });
    }
}
function renderOrdersChart(data) {
    var render_to = 'order_chart';

    new Highcharts.Chart({
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
            formatter: function () {
                return '<b>' + this.point.name + '</b>: ' + Highcharts.numberFormat(this.percentage, 1) + ' %';
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
                    formatter: function () {
                        return '<b>' + this.point.name + '</b>: ' + this.y;
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Orders',
            data: data
        }]
    });
}
function renderOrdersHourlyChart(data) {
    var render_to = 'order_hourly_chart';

    new Highcharts.Chart({
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
            }
        },
        xAxis: {
            title: {
                text: 'Tid (h)'
            },
            labels: {
                formatter: function() {
                    return this.value + ":00";
                }
            }
        },
        plotOptions: {
            column: {
                minPointLength: 3
            },
            series: {
                groupPadding: 0,
                pointPadding: 0.05
            }
        },
        series: [{
            name: 'Ordre',
            data: data.hourly
        }]
    });
}

$(document).ready(function() {
    if( $("#stats").length > 0) {
        /* TODO select data element with index 0 of each pie-chart */

        /* Products */
        $.getJSON(products_stat_url, function(data) {
            products = data;
            renderProductCharts(data);
        });
        /* Orders */
        $.getJSON(order_url, renderOrdersChart);

        /* Orders, hourly */
        $.getJSON(order_hourly_url, renderOrdersHourlyChart);

        /* Realtime purchases */
        products_realtime_chart = new Highcharts.Chart({
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

        get_products_realtime_data();
    }
 });