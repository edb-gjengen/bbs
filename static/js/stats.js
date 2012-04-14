var charts;
$(document).ready(function() {
    // define the options
    var options =  {
        credits: {
            enabled: false
        },
        chart: {
            renderTo: 'order_chart',
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
        data: [],
    }]
}
    var products_url = '/stats/products';
    /* drink beer and  */
    $.getJSON(products_url, function(data) {
        var graph_mappings = [
            ['/stats/orders', 'order_chart']
        ];
        var products = data;
        for(i in products) {
            var mapping = ['/stats/product/'+products[i].id, 'product_chart'+products[i].id];
            graph_mappings.push(mapping);
        }
        /* TODO merere her */
        for(i in graph_mappings) {
            $.getJSON(graph_mappings, function(data) {
                options.series[0].data = data;
                options.chart.renderTo = graph_mappings[i][1];
                charts.push(new Highcharts.Chart(options));
            });
        }
    });
});
