/* View: Profile */

$(document).ready(function() {
    var $userProfile = $('#user-profile');
    if ($userProfile.length) {
        var products_by_user_url = '/stats/products/by_user/';
        var user_id = $('#user-profile').attr('data-user-id');

        $.getJSON(products_by_user_url + user_id, function (data) {
            if (data.hasOwnProperty('error')) {
                return;
            }
            $(".profile-stats-orderline").highcharts({
                title: {
                    text: false
                },
                xAxis: {
                    type: "datetime"
                },
                yAxis: {
                    title: {
                        text: "Kjøp"
                    }
                },

                plotOptions: {
                    series: {
                        marker: {
                            radius: 3
                        }
                    }
                },
                series: data
            });
        });
    }
});