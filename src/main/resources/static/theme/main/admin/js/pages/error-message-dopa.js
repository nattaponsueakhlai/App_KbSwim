var dataErrorTable;

$(document).ready(function () {
    setDataTable('/apis/error-message-dopa/datatable');

    $('#add-error-message').on('click', function () {
        $('.form-control,.form-select').prop('disabled', false);
        typeSave = 'Add Error Message';
        $('.modal-title').text('Add Error Message');
        $('#save-error-message').text("Save");

        clearErrorMessageForm();
        $('#view-endpoint .modal-footer').show();
    });

    $('#error-message-table').on('click', '.view', function (e) {
        e.preventDefault();
        var rowData = dataErrorTable.row($(this).parents("tr")).data();
        $('.form-control,.form-select').prop('disabled', true);
        $('.modal-title').text('View Error Message');

        //
        $('#rowId').val(rowData.rowId);
        $('#code').val(rowData.code);
        $('#description').val(rowData.description);
        $('#descriptionTh').val(rowData.descriptionTh);
        $('#descriptionEn').val(rowData.descriptionEn);
        // $('#errorDetailTh').val(rowData.errorDetailTh);
        // $('#errorDetailEn').val(rowData.errorDetailEn);
        // $('#description').val(rowData.description);
        // $('#status').val(rowData.status);

        $('#addDetail .modal-footer').hide();
    });

    $('#error-message-table').on('click', '.edit', function (e) {
        e.preventDefault();
        var rowData = dataErrorTable.row($(this).parents("tr")).data();
        typeSave = 'Edit Error Message';
        $('.form-control,.form-select').prop('disabled', false);
        $('.modal-title').text('Edit Error Message');
        $('#save-error-message').text("Save");

        $('#rowId').val(rowData.rowId);
        $('#code').val(rowData.code);
        $('#description').val(rowData.description);
        $('#descriptionTh').val(rowData.descriptionTh);
        $('#descriptionEn').val(rowData.descriptionEn);
        // $('#errorHeaderEn').val(rowData.errorHeaderEn);
        // $('#errorDetailTh').val(rowData.errorDetailTh);
        // $('#errorDetailEn').val(rowData.errorDetailEn);
        // $('#description').val(rowData.description);
        // $('#status').val(rowData.status);

        $('#addDetail .modal-footer').show();
    });
});

// $('#search-btn').click(function () {
//     var url = '/apis/error-message/datatable?';
//
//     var type = $('#type').val();
//     var params = '';
//     if (type) {
//         params += 'errorType=' + type;
//     }
//     setDataTable(url + params);
// });

function setDataTable(url) {
    $('#overlay').fadeIn();
    dataErrorTable = $('#error-message-table').DataTable({
        dom: '<"d-flex justify-content-between align-items-center mx-0 row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"d-flex justify-content-between mx-0 row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
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
                // console.log(d)
                return JSON.stringify(d);
            }
        },
        "columns": [
            {data: 'code', "className": "text-center"},
            {data: 'description', "className": "text-left"},
            {data: 'descriptionTh', "className": "text-left"},
            {data: 'descriptionEn', "className": "text-left"},
            {
                data: 'code', "className": "text-center", render: function (data, type, row) {
                    return '<button type="button" class="btn btn-icon btn-flat-success view" data-bs-toggle="modal" data-bs-target="#addDetail"><img class="icon-view" src="theme/main/images/icons/eye.svg"></button>'+
                        '<button type="button" class="btn btn-icon btn-flat-success edit" data-bs-toggle="modal" data-bs-target="#addDetail"><img class="icon-view" src="theme/main/images/icons/edit.svg"></button>';
                }
            },
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

$('#new-error-message-from').on('submit', function (e) {
    e.preventDefault();
    var $form = $('#new-error-message-from');
    if ($form.valid()) {
        $.ajax({
            type: 'POST',
            async: false,
            dataType: 'text',
            data: $.param($form.serializeArray()),
            url: '/apis/error-message-dopa/save',
            success: function (data, textStatus) {
                data = JSON.parse(data);
                Swal.fire({
                    icon: 'success',
                    title: typeSave,
                    text: data.message,
                    showConfirmButton: false,
                    timer: 1500
                }).then((result) => {
                    location.reload();
                });
            },
            error: function (xhr, textStatus, errorThrown) {
                var response = JSON.parse(xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: typeSave,
                    text: "'" + response.errorCode + "' " + response.message,
                    showConfirmButton: true
                });
            }
        });
    }
});

function clearErrorMessageForm() {
    $('#code').val('');
    $('#description').val('');
    $('#descriptionTh').val('');
    $('#descriptionEn').val('');
}