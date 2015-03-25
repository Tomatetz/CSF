define(["app",
        "tpl!apps/projects/list/templates/item_cells/item_menu_cell.tpl",
        "tpl!apps/projects/list/templates/item_cells/project_name_cell.tpl",
        "tpl!apps/projects/list/templates/item_cells/targets_cell.tpl",
        "tpl!apps/projects/list/templates/item_cells/target_types_cell.tpl",
        "tpl!apps/projects/list/templates/item_cells/modified_by_cell.tpl",
        "tpl!apps/projects/list/templates/item_cells/project_contacts_cell.tpl"
    ],
    function (CSF,
              itemMenuTpl,
              projectNameTpl,
              targetsTpl,
              targetTypesTpl,
              modifiedByTpl,
              projectContactsTpl
              ) {

        CSF.module("ProjectsApp.List.ViewTable", function (View, CSF, Backbone, Marionette, $, _) {

            var dataTableColumns = [
                {
                    name: 'project_name',
                    title: "Project name",
                    data: 'attributes',
                    defaultContent: "",
                    render: function (data) {
                        var MAX_CHARS = 60,
                            fullName = data.project_name,
                            isFull = fullName.length < MAX_CHARS;

                        return projectNameTpl({
                            id: data.project_id,
                            name: isFull ? fullName : fullName.substr(0, MAX_CHARS),
                            fullName: fullName,
                            isFull: isFull,
                            toBlank: false
                        });
                    }
                },
                {
                    name: 'ptt_code',
                    title: "Project code",
                    data: 'attributes.ptt_code',
                    defaultContent: ""
                },
                {
                    name: 'target',
                    title: "Targets",
                    data: 'attributes',
                    defaultContent: "",
                    render: function (data) {
                        return targetsTpl(data);
                    }
                },
                {
                    name: 'target_type',
                    title: "Target types",
                    data: 'attributes',
                    defaultContent: "",
                    render: function (data) {
                        return targetTypesTpl(data);
                    }
                },
                {
                    name: 'number_of_series',
                    title: "# Series",
                    data: 'attributes.number_of_series',
                    defaultContent: ""
                },
                {
                    name: 'project_contacts',
                    title: "Project contacts",
                    data: 'attributes.project_contacts',
                    defaultContent: "",
                    render: function (data) {
                        if (data.length) {
                            return projectContactsTpl({ items: data });
                        } else {
                            return data
                        }
                    }
                },
                {
                    name: 'modified_date',
                    title: "Last modified",
                    data: 'attributes.modified_date',
                    defaultContent: "",
                    render: function (data) {
                        return moment(data).format('ll');
                    }
                },
                {
                    name: 'modified_by_name',
                    title: "Edited by",
                    data: 'attributes.modified_by',
                    defaultContent: "",
                    render: function (data) {
                        return modifiedByTpl(data);
                    }
                },
                {
                    name: 'actions',
                    bSortable: false,
                    searchable: false,
                    sClass: "actions item-menu-place",
                    sWidth: '25px',
                    data: function (data) {
                        return data;
                    },
                    render: function (data) {
                        return itemMenuTpl(data.attributes);
                    }
                }
            ];


            View.DataGrid = Backbone.View.extend({
                tagName: "table",
                className: "table table-striped row-border table-hover table-th-nowrap dataTable no-footer order-column",

                events: {
                    'click [data-action="edit"]': "editClicked",
                    'click [data-action="delete"]': "deleteClicked"
                },
                actionClicked: function (e, eventName) {
                    var $tr = $(e.currentTarget).closest('tr');
                    var data = this.dataTable.row($tr).data();

                    this.trigger(eventName, data);
                },
                editClicked: function (e) {
                    e.stopPropagation();

                    this.actionClicked(e, "project:edit");
                },
                deleteClicked: function (e) {
                    e.stopPropagation();

                    this.actionClicked(e, "project:delete");
                },
                initialize: function () {
                    var callback = _.bind(function () {
                        this.dataTable.destroy();
                        this.$el.html("");
                        this.setDataTable();
                    }, this);

                    this.listenTo(this.collection, 'change remove reset', callback);
                },
                onShow: function () {
                    this.setDataTable();
                },
                setDataTable: function () {
                    var that = this;
                    var MODIFIED_DATE_COLUMN_INDEX = 6,
                        dataTableParams = {
                            data: this.collection.models,
                            bLengthChange: false,
                            pageLength: 250,
                            order: [
                                [ MODIFIED_DATE_COLUMN_INDEX, "desc" ]
                            ],
                            columns: dataTableColumns
                        },
                        $table = this.$el;

                    require([
                        "components/dataTableFilter"
                    ], _.bind(function (DataTable) {
                        this.dataTable = $table
                            .DataTable(dataTableParams);

                        this.$el.find('.person-preview')
                            .previewCard()
                            .end()
                            .find(".target")
                            .tooltip({
                                html: true
                            });

                        DataTable.attachFilters({
                            table: $table,
                            dataTable: this.dataTable
                        });

                        $('.dataTables_filter input')
                            .attr('placeholder', "Enter keyword to search list...")
                            .parent().append('<span class="clearFilter"></span>');

                        $('.clearFilter').on('click', function(){
                            that.dataTable.destroy();
                            that.$el.html("");
                            that.setDataTable();
                        });
                    },this));
                }
            });

        });

        return CSF.ProjectsApp.List.ViewTable;
    });
