define([
        "app",
        "apps/structure/common/views",
        "apps/structure/tags/tags_view",
        "apps/structure/tags/init_tags_control",
        "tpl!apps/structure/search/templates/search_layout.tpl",
        "tpl!apps/structure/search/templates/search_form.tpl",
        "tpl!apps/structure/search/templates/empty_result.tpl",
        "tpl!apps/structure/show/templates/view_image.tpl",
        "tpl!apps/structure/search/templates/search_results.tpl",
        "tpl!apps/projects/list/templates/item_cells/project_name_cell.tpl",
        "tpl!apps/structure/search/templates/item_cells/project_ptt_cell.tpl",
        "tpl!apps/structure/search/templates/item_cells/series_name_cell.tpl",
        "tpl!apps/structure/search/templates/item_cells/structure_name_cell.tpl",
        "tpl!apps/projects/list/templates/item_cells/target_types_cell.tpl",
        "tpl!apps/projects/list/templates/item_cells/targets_cell.tpl",
        "tpl!apps/structure/search/templates/item_cells/image_cell.tpl",
        "tpl!apps/structure/search/templates/item_cells/structure_type_cell.tpl",
        "entities/structure",
        "backbone-forms-modules",
        "components/dataTableFilter"
    ],
    function (CSF,
              CommonViews, tagsView, TagSelect2Form,
              searchLayoutTpl, searchFormTpl,
              emptyResultTpl,
              viewImageTpl, searchResultsTpl,
              projectNameCellTpl, projectPttCellTpl, seriesNameCellTpl,
              structureNameCellTpl, targetsCellTpl,
              targetTypesCellTpl, imageCellTpl, structureTypeCellTpl) {

        CSF.module("StructureApp.Search.View", function (View, CSF, Backbone, Marionette, $, _) {
            var dataTableColumns = [
                {
                    name: 'Structure',
                    title: 'Structure',
                    data: function (data) {
                        return data;
                    },
                    defaultContent: '',
                    render: function (data) {
                        var id = data.get('chemical_entity_id') + data.get('nvp') + 180;

                        return imageCellTpl({
                            source: CSF.cache.structure[id],
                            chemical_entity_id: data.get('chemical_entity_id'),
                            project_id: data.get('project').project_id,
                            series_id: data.get('series').series_id,
                            item_type_id: data.get('item_type_id')
                        });
                    }
                },
                {
                    name: 'Structure name',
                    title: 'Structure name',
                    data: 'attributes',
                    defaultContent: '',
                    render: function (data) {
                        return structureNameCellTpl(data);
                    }
                },
                {
                    name: 'Type',
                    title: 'Type',
                    data: 'attributes',
                    defaultContent: '',
                    render: function (data) {
                        return structureTypeCellTpl(data);
                    }
                },
                {
                    name: 'Tags',
                    title: 'Tags',
                    data: 'attributes',
                    defaultContent: '',
                    render: function (data) {
                        var tagsCollectionView = new tagsView.Tags({
                            collection: new Backbone.Collection(data.tags, {})
                        }).render();

                        return tagsCollectionView.el.innerHTML;
                    }
                },
                {
                    name: 'Series',
                    title: 'Series',
                    data: 'attributes',
                    defaultContent: '',
                    render: function (data) {
                        return seriesNameCellTpl(data);
                    }
                },
                {
                    name: 'Project name',
                    title: 'Project name',
                    data: 'attributes.project',
                    defaultContent: '',
                    render: function (data) {
                        var MAX_CHARS = 60,
                            fullName = data.project_name,
                            isFull = fullName.length < MAX_CHARS;

                        return projectNameCellTpl({
                            id: data.project_id,
                            name: isFull ? fullName : fullName.substr(0, MAX_CHARS),
                            fullName: fullName,
                            isFull: isFull,
                            toBlank: true
                        });
                    }
                },
                {
                    name: 'Project code',
                    title: "Project code",
                    data: 'attributes.project',
                    defaultContent: "",
                    render: function (data) {
                        return projectPttCellTpl(data);
                    }
                },
                {
                    name: 'Targets',
                    title: "Targets",
                    data: 'attributes.project',
                    defaultContent: "",
                    render: function (data) {
                        return targetTypesCellTpl(data);
                    }
                },
                {
                    name: 'Target types',
                    title: "Target types",
                    data: 'attributes.project',
                    defaultContent: "",
                    render: function (data) {
                        return targetsCellTpl(data);
                    }
                },
                {
                    name: 'Last modified',
                    title: "Last modified",
                    data: 'attributes.modified_date',
                    defaultContent: "",
                    render: function (data) {
                        return moment(data).format('ll');
                    }
                }

            ];

            View.emptyResult = Marionette.ItemView.extend({
                template: emptyResultTpl
            });

            //  todo - compare with projects/list_table_view later - make dataTable wrapper
            View.SearchResult = Marionette.ItemView.extend({
                template: searchResultsTpl,
                events: {
                    'click .js-search-collapse': "searchCollapse",
                    'click .js-clear': "clearSearchForm",
                    'click .js-export': "copyStructure"
                },
                initialize: function () {
                },
                onShow: function () {
                    this.setDataTable();
                    this.$el.find(".js-search-collapse .glyphicon")
                        .tooltip({
                            html: true
                        });
                },
                copyStructure: function (e) {
                    var $target = $(e.target).data();
                    this.trigger('save:structure', $target);
                },
                setDataTable: function () {
                    var MODIFIED_DATE_COLUMN_INDEX = 9,
                        STRUCTURE_IMAGE_COLUMN_INDEX = 0,
                        dataTableParams = {
                            //  todo - use plain object
                            data: this.collection.models,
                            "oLanguage": {
                                "sInfo": "_TOTAL_",
                                "sInfoFiltered": " of _MAX_",
                                "sInfoPostFix": " results"
                            },
                            lengthChange: false,
                            pageLength: 250,
                            dom: '<"top"fl>rt<"bottom"ip>',
                            order: [
                                [MODIFIED_DATE_COLUMN_INDEX, "desc"]
                            ],
                            aoColumnDefs: [
                                {
                                    'bSortable': false,
                                    'aTargets': [STRUCTURE_IMAGE_COLUMN_INDEX]
                                }
                            ],
                            columns: dataTableColumns
                        };

                    var that = this;
                    var $table = this.$el.find('.table');

                    var options = {
                            imgWidth: 100,
                            imgHeight: 80,
                            cache: true
                        },
                        callback = _.bind(function (DataTable) {
                            this.dataTable = $table.DataTable(dataTableParams);

                            DataTable.attachFilters({
                                table: $table,
                                dataTable: this.dataTable
                            });

                            this.$el.find(".target")
                                .tooltip({
                                    html: true
                                });

                            this.$el.find('.dataTables_filter')
                                .hide();
                            this.$el.find('.dataTables_info')
                                .addClass('search_view');

                            $table.find('.dataTables_column_filters')
                                .children(':first-child')
                                .addClass('showSketcher');
                            //  infers - todo - use chain
                            this.$el.find('.showSketcher').on('click', function (e) {
                                that.trigger("show:sketcher:form");
                            });
                        }, this);

                    var count = this.collection.models.length;
                    //
                    //  todo - count is for skipping last image callback?
                    //
                    _.each(this.collection.models, function (model) {
                        var id = model.get('chemical_entity_id') + model.get('nvp') + 180;

                        var image = new CSF.Entities.StructureModel({
                            structure: model.get('structure')
                        });
                        $.when(image.getStructureImage(options)).done(function (data) {
                            CSF.cache.structure[id] = data;
                            count -= 1;

                            if (!count) {
                                //  TODO - bad habit
                                require([
                                    "components/dataTableFilter"
                                ], callback);
                            }
                        });
                    });
                }
            });

            View.searchLayout = Marionette.LayoutView.extend({
                template: searchLayoutTpl,
                events: {
                    'click .js-search-collapse': "searchCollapse"
                },
                regions: {
                    searchFormRegion: "#search-form-region",
                    searchResultRegion: "#search-result-region"
                },
                searchCollapse: function () {
                    var row = this.$el.find('.row-collapsible'),
                        colSearchForm = row.find("> div:first-child"),
                        colSearchResult = row.find("> div + div"),
                        chevronToggle = row.find(".chevronToggle"),
                        chevronClasses = 'fa-angle-double-left fa-angle-double-right',
                        btnIcon = this.$el.find(".js-search-collapse")
                            .attr('data-original-title', 'Expand search panel'),
                        hasCollapsed = btnIcon.hasClass("collapsed");

                    colSearchForm.toggleClass('search-form-col search-form-col-hide');
                    colSearchResult.toggleClass('search-result-col search-result-col-full');
                    chevronToggle.toggleClass(chevronClasses);

                    btnIcon.toggleClass("collapsed");

                    if (hasCollapsed) {
                        btnIcon.attr('data-original-title', 'Hide search panel');
                    }
                }
            });

            View.SearchImage = CommonViews.StructureItemView.extend({
                template: viewImageTpl,
                ui: {
                    image: '[data-element="image-container"]'
                },
                onRender: function () {
                    this.renderStructure({
                        imgWidth: 250,
                        imgHeight: 150
                    });
                }
            });

            View.searchForm = Marionette.ItemView.extend({
                template: searchFormTpl,
                ui: {
                    structureImagePlaceholder: ".js-structure-draw"
                },
                events: {
                    'click .js-search': "searchResult",
                    'click .js-structure-draw': "onShowSketcherDialog",
                    'click .js-clear': "clearSearchForm",
                    'click .clear-structure': "clearSketcher"
                },

                clearSketcher: function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    this.clearSketcherAction();
                },
                clearSearchForm: function (e) {
                    var form = $(e.currentTarget).closest("form");

                    form.find(':input')
                        .not(':button, :submit, :reset, .unclearable-control, [type="radio"]')
                        .val('')
                        .removeAttr('checked')
                        .removeAttr('selected');

                    form.find('[type="radio"]').parent()
                        .removeClass('active');
                    form.find('[ value="structures"]').parent()
                        .addClass('active');
                    form.find('.select2-container')
                        .select2('val', '');

                    // set substructure search as default
                    form.find('.unclearable-control :nth-child(1)')
                        .prop('selected', true);

                    this.clearSketcherAction();
                },
                placeHolder: '<p>Click to draw structure</p>',
                clearSketcherAction: function () {
                    this.structure = null;

                    this.ui.structureImagePlaceholder
                        .html(this.placeHolder);
                },
                initSelect2Wrapper: function (type, target, placeholder, parameter, results) {
                    var isProject = type === 'project';

                    target.select2({
                        id: function (data) {
                            return isProject ?
                                data.attributes.ptt_code : data;
                        },
                        placeholder: placeholder,
                        allowClear: true,
                        data: {
                            results: isProject ? results : $.unique(results),
                            text: function (data) {
                                return data.attributes[parameter];
                            }
                        },
                        formatResult: function (data) {
                            return isProject ? data.attributes[parameter] : data.split('/').pop();
                        },
                        formatSelection: function (data) {
                            return isProject ? data.attributes[parameter] : data.split('/').pop();
                        }
                    }).on("change", function (e) {
                        if (e.added) {
                            $(e.currentTarget).closest(".form-group").find("[name ^= " + parameter + "]").val(isProject ? e.added.attributes[parameter] : e.val);
                        } else {
                            $(e.currentTarget).closest(".form-group").find("[name ^= " + parameter + "]").val('');
                        }
                    });
                },
                onInitProjectControls: function (projects) {
                    var projectCodeInput = this.$el.find('[data-element="project-code"]'),
                        projectNameInput = this.$el.find('[data-element="project_name"]'),
                        projectTargetTypeInput = this.$el.find('[data-element="target-type"]'),
                        projectTargetInput = this.$el.find('[data-element="target"]');

                    var codes = projects.filter(function (elem) {
                        return elem.get('ptt_code');
                    });
                    var names = projects.filter(function (elem) {
                        return elem.get('project_name');
                    });

                    this.initSelect2Wrapper("project", projectCodeInput, "Please type project code", "ptt_code", codes);
                    this.initSelect2Wrapper("project", projectNameInput, "Please type project name", "project_name", names);

                    //  TODO split into two separate methods

                    var targets = projects.filter(function (item) {
                        return item.get('target').length;
                    });
                    var allTarg = [];
                    var allTargTypes = _.map(targets, function (item) {
                        var itemTarget = item.get('target');

                        //  todo - so implies each-on-each complexity
                        _.each(itemTarget, function (target) {
                            var value = target.target_detail.value;

                            if (value) {
                                allTarg.push(value);
                            }
                        });

                        return itemTarget[0].target_type;
                    });

                    this.initSelect2Wrapper("target", projectTargetTypeInput, "Please type target type", "target_type", allTargTypes);
                    this.initSelect2Wrapper("target", projectTargetInput, "Please type target value", "target", allTarg);
                },

                onInitTagControls: function (tags) {
                    TagSelect2Form.initTags(this, tags);
                },
                onShow: function () {
                    this.defineFormControls();

                    this.clearSketcherAction();

                    this.$el.find(".glyphicon-info-sign")
                        .tooltip({
                            html: true
                        });
                },
                defineFormControls: function () {
                    this.trigger("search:define-controls");
                },
                parseStringToArray: function (str) {
                    return str.trim().split(/\s*[,|\n]\s*/);
                },
                searchResult: function (e, mol) {
                    e.stopPropagation();
                    e.preventDefault();

                    var form = $(e.currentTarget).closest("form"),
                        data = Backbone.Syphon.serialize(form[0]);

                    //  TODO - trace model data magik block
                    if (this.structure) {
                        data.structure_molfile = this.structure;
                    } else {
                        data.search_type = null;
                    }

                    data.names = this.parseStringToArray(data.names);
                    data.specific_tags = data.specific_tags.split(',');
                    data.tag_names = data.tag_names.split(',');
                    data.tag_categories = data.tag_categories.split(',');
                    data.type = this.$el.find('[data-element="type"] label.active input').val();

                    this.trigger("search:show-result", data);
                },
                onShowSketcherDialog: function (e) {
                    var that = this;
                    var Molecule = new CommonViews.MolForm();

                    CSF.dialogRegion.show(Molecule);

                    Molecule.$el.find('.modal-title').html('Draw structure');
                    Molecule.$el.find('.js-submit').html('Ok');

                    if (that.structure) {
                        setTimeout(function () {
                            Molecule.sketcher.importStructure(that.structure);
                        }, 2000);
                    }
                    Molecule.$el.find('.js-submit')
                        .on("click", function (e) {
                            e.stopPropagation();
                            e.preventDefault();

                            var structure = Molecule.sketcher.exportStructure();
                            that.structure = structure;

                            if (structure.length > 50) {
                                Molecule.trigger("dialog:close");

                                that.trigger("search:show-image", structure);
                            }
                        });
                }
            });
        });

        return CSF.StructureApp.Search.View;
    });
