$(document).ready(function() {
    var charts = [];
    var products_url = '/products';

    /* drink beer and... */
    $.getJSON(products_url, function(data) {
        var graph_mappings = [
        {
            'url' : '/stats/orders',
            'render_to' : 'order_chart'
        }];
        var products = data;
        for(i in products) {
            var mapping = {
                'url' : '/stats/product/' + products[i].id,
                'info_url' : '/products/' + products[i].id,
                'render_to' : 'product_chart' + products[i].id
            };
            graph_mappings.push(mapping);
        }
        for(i in graph_mappings) {
            // define the options
            var options =  {
                credits: {
                    enabled: false
                },
                chart: {
                    /* TODO this is not updated right.
                     * ie. how to get ajax-callback to update the right options-object?
                     * */
                    renderTo: graph_mappings[i].render_to,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: 'Antall ordre per bruker'
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
                    data: []
                }]
            };
            $.getJSON(graph_mappings[i].url, function(data) {
                options.series[0].data = data,
                charts.push(new Highcharts.Chart(options));
            });
        }
        console.log(charts);
    });
});
