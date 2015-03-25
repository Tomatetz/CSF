define([
        "app",
        "datatables"
    ],
    function (CSF) {
        CSF.module("DataTableFilter", function (DataTableFilter, CSF, Backbone, Marionette, $, _) {
            DataTableFilter.attachFilters = function (options) {
                var $table = options.table;
                var dataTable = options.dataTable;

                var filters = $table.find('thead tr').clone();

                filters.addClass('dataTables_column_filters');

                // Setup - add a text input to each footer cell
                $('th', filters).each(function () {
                    var $ctx = $(this);
                    var $th = $('thead th', $table).eq($ctx.index());

                    if (!$th.hasClass('actions')) {
                        $ctx.html('<div class="control-clear"><input type="text" placeholder="Filter..." /></div>');
                    }
                });

                $table.find('thead').append(filters);

                filters.find('input').on('input', function () {
                    applyFilters();

                    var $ctx = $(this);

                    if (!$ctx.val()) {
                        $ctx.parent().find('.glyphicon-remove').remove();
                    } else {
                        $ctx = $ctx.parent();
                        //  TODO - one or many?
                        if (!$ctx.find(".glyphicon-remove").length) {
                            $ctx.append('<span class="glyphicon glyphicon-btn glyphicon-remove" data-action="clearControl" style=""></span>');
                        }

                        $ctx.find('[data-action="clearControl"]').on('click', function () {
                            var $ctx = $(this);

                            $ctx.parent().find('input').val('');
                            $ctx.remove();

                            applyFilters();
                        });
                    }
                });

                function applyFilters() {
                    dataTable.columns().eq(0).each(function (colIdx) {
                        filters.find('input').eq(colIdx).each(function () {
                            var val = $(this).val();
                            dataTable
                                .column(colIdx)
                                .search(val, false, true)
                                .draw();
                        });
                    });
                }
            };
        });

        return CSF.DataTableFilter;
    }
);