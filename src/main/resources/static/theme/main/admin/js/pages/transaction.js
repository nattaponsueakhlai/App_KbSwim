var dataTransactionKyc;
const date = new Date;

$(document).ready(function () {
    setDataTable('/apis/transaction/datatable?startDate='+ formatDate());

    $("#startDate").flatpickr({
        defaultDate: new Date,
        maxDate: new Date(),
        onChange: function (selectedDates, dateStr, instance) {
            $("#endDate").flatpickr({
                maxDate: new Date()
            }).set('minDate', dateStr)
        }
    });
});
$("#endDate").flatpickr({
    defaultDate: new Date(),
    minDate: new Date(),
    maxDate: new Date()
});

$('#search-btn').on('click', function () {
    var url = '/apis/transaction/datatable?';

    if ($('#startDate').val()) {
        url += "startDate=" + $('#startDate').val();
    }
    if ($('#endDate').val()) {
        url += "&endDate=" + $('#endDate').val();
    }
    if ($('#dopa-status').val()) {
        url += "&dopaStatus=" + $('#dopa-status').val();
    }
    if ($('#system-flag').val()) {
        url += "&systemFlag=" + $('#system-flag').val();
    }
    if ($('#select-ndid').val()) {
        url += "&ndidStatus=" + $('#select-ndid').val();
    }
    if ($('#select-return-status').val()) {
        url += "&returnStatus=" + $('#select-return-status').val();
    }
    setDataTable(url);
});

$('#clear-btn').on('click', function () {
    $('#business-line').val('')
    $("#startDate").flatpickr({
        defaultDate: new Date,
        maxDate: new Date(),
        onChange: function (selectedDates, dateStr, instance) {
            $("#endDate").flatpickr({
                defaultDate: new Date(),
                maxDate: new Date()
            }).set('minDate', dateStr)
        }
    });
    $("#endDate").flatpickr({
        defaultDate: new Date(),
        minDate: new Date(),
        maxDate: new Date()
    });
    $('#select-product').val('')
    $('#select-ial').val('')
    $('#select-kyc').val('')
    $('#select-overriding').val('')
    $('#trans-num').val('')
    $('#channel-ref').val('')
    setDataTable('/apis/transaction/datatable?startDate=' + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay());
})

function setDataTable(url) {
    $('#overlay').fadeIn();
    dataTransactionKyc = $('#transaction-table').DataTable({
        'lengthMenu': [[10, 25, 50, 75, 100, -1], [10, 25, 50, 75, 100, "ALL"]],
        // dom: '<"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        dom: '<"card-header border-bottom p-1"<"head-label"><"dt-action-buttons text-end"B>><"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        displayLength: 7,
        buttons: [
            {
                extend: 'collection',
                className: 'btn btn-outline-secondary dropdown-toggle',
                text: feather.icons['share'].toSvg({class: 'font-small-4 me-50'}) + 'Export',
                buttons: [
                    {
                        extend: 'csv',
                        text: feather.icons['file-text'].toSvg({class: 'font-small-4 me-50'}) + 'Csv',
                        className: 'dropdown-item',
                        title:'Transaction Log'+ new Date().toDateString(),
                        exportOptions: {
                            // columns: [1, 2, 3, 4, 5],
                            modifier: {
                                search: "applied",
                                order: "applied"
                            }

                        },
                        action: function(e, dt, node, config) {
                            var dtButton= this; //we need this as param for action.call()
                            var currentPageLen = dt.page.len();
                            var currentPage = dt.page.info().page;

                            dt.one( 'draw', function () {
                                $.fn.DataTable.ext.buttons.excelHtml5.action.call(dtButton, e, dt, node, config); //trigger export

                                //setTimeout is needed here because action.call is async call
                                //without setTimeout, pageLength will show all
                                setTimeout(function() {
                                    dt.page.len(currentPageLen).draw(); //set page length
                                    dt.page(currentPage).draw('page'); //set current page
                                }), 500;
                            });

                            //draw all before export
                            dt.page.len(-1).draw();
                        }
                    },
                    {
                        extend: 'excel',
                        text: feather.icons['file'].toSvg({class: 'font-small-4 me-50'}) + 'Excel',
                        className: 'dropdown-item',
                        title:'Transaction Log'+ new Date().toDateString(),
                        exportOptions: {
                            // columns: [1, 2, 3, 4, 5],
                            modifier: {
                                search: "applied",
                                order: "applied"
                            }

                        },
                        action: function(e, dt, node, config) {
                            var dtButton= this; //we need this as param for action.call()
                            var currentPageLen = dt.page.len();
                            var currentPage = dt.page.info().page;

                            dt.one( 'draw', function () {
                                $.fn.DataTable.ext.buttons.excelHtml5.action.call(dtButton, e, dt, node, config); //trigger export

                                //setTimeout is needed here because action.call is async call
                                //without setTimeout, pageLength will show all
                                setTimeout(function() {
                                    dt.page.len(currentPageLen).draw(); //set page length
                                    dt.page(currentPage).draw('page'); //set current page
                                }), 500;
                            });

                            //draw all before export
                            dt.page.len(-1).draw();
                        }

                    }
                ],
                init: function (api, node, config) {
                    $(node).removeClass('btn-secondary');
                    $(node).parent().removeClass('btn-group');
                    setTimeout(function () {
                        $(node).closest('.dt-buttons').removeClass('btn-group').addClass('d-inline-flex');
                    }, 50);
                }
            },
        ],
        'scrollY': '500px',
        'scrollCollapse': true,
        'serverSide': true,
        'processing': true,
        'destroy': true,
        'pageLength': 10,
        'ajax': {
            'contentType': 'application/json',
            'url': url,
            'type': 'POST',
            'data': function (d) {
                return JSON.stringify(d);
            }
        },
        // colse  column
        // "columnDefs": [
        //     {
        //         "targets": [ 7, 8, 9, 10, 11, 12, 13, 14],
        //         "visible": false
        //     }
        // ],
        "columns": [
            // {
            //     data: 'createdAt',"className": "text-center", render: function (data) {
            //         return moment(data).format('DD/MM/YYYY HH:mm:ss');
            //
            //     }
            // },
            // {data: 'createdAt', "className": "text-center"},
            {data: 'referenceId', "className": "text-left"},
            {data: 'dopaCode', "className": "text-center"},
            {data: 'dopaDescription', "className": "text-center"},
            {data: 'systemFlag', "className": "text-center"},
            {data: 'ndidStatus', "className": "text-center"},
            {data: 'returnCode', "className": "text-center"},
            {data: 'returnStatus', "className": "text-center"},
            {
                data: 'createdAt', "className": "text-center", render: function (data) {
                    return moment(data).format('DD/MM/YYYY HH:mm:ss');

                }
            }
            // {
            //     data: 'uuid',"className": "text-center", render: function (data, type, row) {
            //         return '<button type="button" class="btn btn-icon btn-flat-success view" data-bs-toggle="modal" data-bs-target="#add-edit-term-condition-modal"><img class="icon-view" src="theme/main/images/icons/eye.svg"></button>'+
            //             '<a href="/addterm-condition/' + data + '"><button type="button" class="btn btn-icon btn-flat-success edit"><img class="icon-view" src="theme/main/images/icons/edit.svg"></button></a> ';
            //     }
            // },

        ],
        language: {
            paginate: {
                // remove previous & next text from pagination
                previous: '&nbsp;',
                next: '&nbsp;'
            }
        }
    });
    $('#overlay').fadeOut();
}

// Chart
// --------------------------------------------------------------------

$(function () {
    'use strict';

    var flatPicker = $('.flat-picker'),
        isRtl = $('html').attr('data-textdirection') === 'rtl',
        chartColors = {
            column: {
                series1: '#826af9',
                series2: '#d2b0ff',
                bg: '#f8d3ff'
            },
            donut: {
                Success: '#1369B0',
                Fail: '#C2101A',
            }
        };

    var TotalKycChartEl = document.querySelector('#Total-Kyc-chart'),
        TotalKycChartConfig = {
            chart: {
                height: 350,
                type: 'donut'
            },
            legend: {
                show: true,
                position: 'bottom'
            },
            labels: ['Success', 'Fail'],
            series: [85, 16,],
            colors: [
                chartColors.donut.Success,
                chartColors.donut.Fail

            ],
            dataLabels: {
                enabled: true,
                formatter: function (val, opt) {
                    return parseInt(val) + '%';
                }
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            name: {
                                fontSize: '2rem',
                                fontFamily: 'Montserrat'
                            },
                            value: {
                                fontSize: '1rem',
                                fontFamily: 'Montserrat',
                                formatter: function (val) {
                                    return parseInt(val) + '%';
                                }
                            },
                            // total: {
                            //     show: true,
                            //     fontSize: '1.5rem',
                            //     label: 'Total',
                            //     formatter: function (w) {
                            //         return '31%';
                            //     }
                            // }
                        }
                    }
                }
            },
            responsive: [
                {
                    breakpoint: 992,
                    options: {
                        chart: {
                            height: 380
                        }
                    }
                },
                {
                    breakpoint: 576,
                    options: {
                        chart: {
                            height: 320
                        },
                        plotOptions: {
                            pie: {
                                donut: {
                                    labels: {
                                        show: true,
                                        name: {
                                            fontSize: '1.5rem'
                                        },
                                        value: {
                                            fontSize: '1rem'
                                        },
                                        total: {
                                            fontSize: '1.5rem'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        };
    if (typeof TotalKycChartEl !== undefined && TotalKycChartEl !== null) {
        var TotalKycChart = new ApexCharts(TotalKycChartEl, TotalKycChartConfig);
        TotalKycChart.render();
    }
});

function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}