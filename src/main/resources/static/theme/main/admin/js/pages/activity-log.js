$(document).ready(function () {

    setDataTable('/apis/activity/datatable?startDate='+ formatDate());

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

function setDataTable(url) {
    $('#overlay').fadeIn();
    datalogdetailTable = $('#activity-log').DataTable({

        'order':[[3,"desc"]],
        'lengthMenu': [[10, 25, 50, 75, 100, -1],[10, 25, 50, 75, 100, "ALL"]],
        // dom: '<"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        dom: '<"card-header border-bottom p-1"<"head-label"><"dt-action-buttons text-end"B>><"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        displayLength: 7,
        buttons: [
            {
                extend: 'collection',
                className: 'btn btn-outline-secondary dropdown-toggle',
                text: feather.icons['share'].toSvg({ class: 'font-small-4 me-50' }) + 'Export',
                buttons: [
                    {
                        extend: 'csv',
                        text: feather.icons['file-text'].toSvg({ class: 'font-small-4 me-50' }) + 'Csv',
                        title:'Activity Log'+ new Date().toDateString(),
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4,],
                            modifier:{
                                search:"applied",
                                order:"applied"
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
                        text: feather.icons['file'].toSvg({ class: 'font-small-4 me-50' }) + 'Excel',
                        title:'Activity Log'+ new Date().toDateString(),
                        className: 'dropdown-item',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4],
                            modifier:{
                                search:"applied",
                                order:"applied"
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
        'scrollX': true,
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
        "columns": [
            {data: 'referenceId',"className": "text-center"},
            {data: 'systemFlag',"className": "text-center"},
            {data: 'status',"className": "text-center"},
            {
                data: 'createdAt',"className": "text-center", render: function (data) {
                    return moment(data).format('DD/MM/YYYY HH:mm:ss');

                }
            },
            // {data: 'createdAt',"className": "text-left"},
            // {data: 'createdBy',"className": "text-center"},
            {
                data: 'transactionId',"className": "text-center", render: function (data, type, row) {
                    return '<button type="button" class="btn btn-icon btn-flat-success view" data-bs-toggle="modal" data-bs-target="#view-detail" ><img class="icon-view" src="theme/main/images/icons/eye.svg"></button> ';
                }
            }
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

$('#clear-btn').on('click', function () {
    $('#status').val('');
    $('#startDate').val('');
    $('#endDate').val('');

    setDataTable('/apis/activity/datatable');
})

$('#search-btn').click(function () {
    var url = '/apis/activity/datatable?';

    var status = $('#status').val();
    var startDate = $('#startDate').val();
    var endDate = $('#endDate').val();

    var params = '';
    if (status) {
        params += 'status=' + status;
    }
    if (startDate) {
        params ? params += '&startDate=' + startDate : params += 'startDate=' + startDate;
    }
    if (endDate) {
        params ? params += '&endDate=' + endDate : params += 'endDate=' + endDate;
    }

    setDataTable(url + params);
});


$(document).on('click', '.view', function () {
    var rowData = datalogdetailTable.row($(this).parents("tr")).data();
    $('#activity-detail').DataTable({
        'order':[[3,"desc"]],
        'lengthMenu': [[10, 25, 50, 75, 100, -1],[10, 25, 50, 75, 100, "ALL"]],
        // dom: '<"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        dom: '<"card-header border-bottom p-1"<"head-label"><"dt-action-buttons text-end"B>><"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        displayLength: 7,
        buttons: [
            {
                extend: 'collection',
                className: 'btn btn-outline-secondary dropdown-toggle',
                text: feather.icons['share'].toSvg({ class: 'font-small-4 me-50' }) + 'Export',
                buttons: [
                    {
                        extend: 'csv',
                        text: feather.icons['file-text'].toSvg({ class: 'font-small-4 me-50' }) + 'Csv',
                        title:'Activity Log Detail'+ new Date().toDateString(),
                        className: 'dropdown-item',
                        exportOptions: {
                            // columns: [1, 2, 3, 4, 5],
                            modifier:{
                                search:"applied",
                                order:"applied"
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
                        text: feather.icons['file'].toSvg({ class: 'font-small-4 me-50' }) + 'Excel',
                        title:'Activity Log Detail'+ new Date().toDateString(),
                        className: 'dropdown-item',
                        exportOptions: {
                            // columns: [1, 2, 3, 4, 5],
                            modifier:{
                                search:"applied",
                                order:"applied"
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
            'url': "/apis/activity/detail/datatable/?transactionId=" + rowData.transactionId,
            'type': 'POST',
            'data': function (d) {
                return JSON.stringify(d);
            }
        },
        "columns": [
            {data: 'referenceId',"className": "text-left"},
            {data: 'pageName',"className": "text-left"},
            {data: 'event',"className": "text-center"},
            // {data: 'createdAt',"className": "text-left"}
            {
                data: 'createdAt',"className": "text-center", render: function (data) {
                    return moment(data).format('DD/MM/YYYY HH:mm:ss');

                }
            }
        ],
        language: {
            paginate: {
                // remove previous & next text from pagination
                previous: '&nbsp;',
                next: '&nbsp;'
            }
        }
    });
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