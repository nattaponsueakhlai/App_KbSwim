var typeSave;

$(document).ready(function () {
    if (tenantId) {
        setDataTable('/apis/error/datatable?tenantId=' + tenantId);
    } else {
        setDataTable('/apis/error/datatable?' + ($('#tenant-id').val() ? 'tenantId=' + $('#tenant-id').val() : ""))
    }
    // datandiderrorTable = $('#ndid-error-codes-datatable').DataTable();
    $('#ndid-error-codes-datatable').on('click', '.edit-ndid-error-codes', function (e) {
        e.preventDefault();
        var rowData = datandiderrorTable.row($(this).parents("tr")).data();
        typeSave = 'Edit Tenant';
        $('#errorCode').val(rowData.errorCode);
        $('#description').val(rowData.description);
        $('#errorMessageTh').val(rowData.errorMessageTh);
        $('#errorMessageEn').val(rowData.errorMessageEn);
        $('#errorType').val(rowData.errorType);
        $('#attr1').val(rowData.attr1);
        $('#attr2').val(rowData.attr2);
        $('#attr3').val(rowData.attr3);
        $('#attr4').val(rowData.attr4);
    });
});

function setDataTable(url) {
    $('#overlay').fadeIn();
    datandiderrorTable = $('#ndid-error-codes-datatable').DataTable({
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
                return JSON.stringify(d);
            }
        },
        "columns": [
            {data: 'errorCode', "className": "text-center"},
            {data: 'errorType', "className": "text-center"},
            {data: 'description', "className": "text-left"},
            {data: 'errorMessageTh', "className": "text-left"},
            {data: 'errorMessageEn', "className": "text-left"},
            // {
            //     data: 'createdAt',"className": "text-center", render: function (data) {
            //         return moment(data).format('DD/MM/YYYY HH:mm');
            //
            //     }
            // },
            {
                data: 'errorCode', "className": "text-center", render: function (data, type, row) {
                    return ' <button type="button" class="btn btn-icon btn-flat-warning edit-error" data-bs-toggle="modal" data-bs-target="#edit-ndid-error-codes"><img class="icon-edit" src="theme/main/images/icons/edit.svg"></button>';
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

$('#edit-error-form').on('submit', function (e) {
    e.preventDefault();
    var $form = $('#edit-error-form');
    if ($form.valid()) {
        $.ajax({
            type: 'POST',
            async: false,
            dataType: 'text',
            data: $.param($form.serializeArray()),
            url: '/apis/error/save',
            success: function (data, textStatus) {
                data = JSON.parse(data);
                Swal.fire({
                    icon: 'success',
                    title: typeSave,
                    text: data.message,
                    showConfirmButton: false,
                    timer: 1500
                }).then((result) => {
                    if (tenantId) {
                        setDataTable('/apis/error/datatable?tenantId=' + tenantId);
                    } else {
                        setDataTable('/apis/error/datatable?' + ($('#tenant-id').val() ? 'tenantId=' + $('#tenant-id').val() : ""))
                    }
                    $('#edit-ndid-error-codes').modal('hide');

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

//edit
$(document).on('click', '.edit-error', function () {
    var rowData = datandiderrorTable.row($(this).parents("tr")).data();
    if (tenantId) {
        $('#attr10').val(tenantId);
    } else {
        $('#attr10').val($('#tenant-id').val());
    }
    $('#errorCode').val(rowData.errorCode);
    $('#description').val(rowData.description);
    $('#errorMessageTh').val(rowData.errorMessageTh);
    $('#errorMessageEn').val(rowData.errorMessageEn);

});

$('#tenant-id').on("change", function (e) {
    setDataTable('/apis/error/datatable?' + ($('#tenant-id').val() ? 'tenantId=' + $('#tenant-id').val() : ""))
})

$('#sync').click(function () {
    $('#overlay').fadeIn();
    $.get("/apis/error/sync", function (data) {
        var isRtl = $('html').attr('data-textdirection') === 'rtl'
        if (data.status) {
            if (tenantId) {
                setDataTable('/apis/error/datatable?tenantId=' + tenantId);
            } else {
                setDataTable('/apis/error/datatable?' + ($('#tenant-id').val() ? 'tenantId=' + $('#tenant-id').val() : ""))
            }
            toastr['success']('Sync NDID IDP error codes successfully.', 'Success!', {
                closeButton: true,
                tapToDismiss: false,
                rtl: isRtl
            });
        } else {
            toastr['error'](data.errorCode + ' ' + data.message, 'Error!', {
                closeButton: true,
                tapToDismiss: false,
                rtl: isRtl
            });
        }
    });
    $('#overlay').fadeOut();
});