var chart;
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
            text: 'Ordre/bruker'
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
    var url = '/stats/orders';
    $.getJSON(url, function(data) {
        options.series[0].data = data;
        chart = new Highcharts.Chart(options);
    });
});
