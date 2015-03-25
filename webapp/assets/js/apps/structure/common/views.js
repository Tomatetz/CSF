define(["app",
        "apps/structure/common/tags_view",
        "tpl!./templates/form.tpl",
        "tpl!./templates/source_form.tpl",//    TODO - refactor from a big bunch of forms
        "tpl!./templates/relationship_form.tpl",
        "tpl!./templates/source_item.tpl",
        "tpl!./templates/search_item.tpl",
        "tpl!./templates/relationship_item.tpl",
        "tpl!./templates/editSourceForm.tpl",
        "tpl!./templates/editMolForm.tpl",
        "tpl!./templates/setMolForm.tpl",
        "tpl!./templates/tag_form.tpl",
        "tpl!./templates/tag.tpl",
        "tpl!./templates/dialog_confirm.tpl",
        "tpl!./templates/sources_search_item.tpl",
        "entities/relation_reason_definitions",
        "backbone-forms-modules",
        "entities/source",
        "entities/structure"
    ],
    function (CSF, tagsView,
              formTpl, sourceFormTpl, relationshipFormTpl, sourceItemTpl, searchItemTpl, relationshipItemTpl,
              editSourceForm, editMolForm, setMolForm, tagFormTpl,
              tag, dialogConfirmTpl, sourcesSearchItemTpl) {
        /**
         * @module StructureApp.Common.Views
         * @namespace StructureApp.Common.Views
         */
        CSF.module("StructureApp.Common.Views", function (Views, CSF, Backbone, Marionette, $, _) {
            /**
             * Setting form for creating/editing structure
             * @class Form
             * @constructor
             * @extends Marionette.ItemView
             *
             * TODO - is that more specific view now? - put into separate file
             */
            Views.Form = Marionette.ItemView.extend({
                template: formTpl,
                ui: {
                    form: "form",
                    sourceSubForm: ".source-subform-placeholder",
                    relationshipSubForm: ".relationship-subform-placeholder",
                    nvpNote: '#nvp-note',
                    progress: '.progress-bar',
                    footer: '.modal-footer',
                    tagSubForm: ".tag-subform-placeholder"
                },
                events: {
                    "click button.js-submit": "submitClicked",
                    "click button.js-preview": "previewClicked",
                    "click .js-back-preview": "backToNVP",
                    "click [data-dismiss='modal']": "close",
                    "click [data-dismiss='progress-bar-container']": "cancelProgress"
                },

                sketcher: null,
                subForms: {
                    sourceForm: null
                },

                onShow: function () {
                    var that = this;
                    this.$el.find('.nvp-note').on('keyup', function () {
                        var isDisabled = this.value === '';

                        that.$el.find('.js-preview')
                            .attr('disabled', isDisabled);
                    });
                },
                cancelProgress: function () {
                    this.$el.find(".progress-bar-container").modal();
                    this.$el.find(".progress-bar-container").modal("hide");

                    this.trigger("save:cancel");
                },

                onRender: function () {
                    var relationshipForm;
                    var $addStructureButton = this.$el.find('[data-element="saveButton"]');
                    $addStructureButton.text(this.buttonTitle);

                    this.subForms.sourceForm = new Views.SourceForm({
                        addStructureButton: $addStructureButton
                    }).render();

                    this.ui.sourceSubForm
                        .html(this.subForms.sourceForm.$el);

                    this.subForms.Molecule = new Views.MolForm({
                        model: this.model,
                        editType: 'creation'
                    }).render();

                    this.$el.find('#drawtab')
                        .html(this.subForms.Molecule.$el);

                    if (Marionette.getOption(this, "project_id")) {
                        relationshipForm = new Views.RelationshipForm({
                            project_id: Marionette.getOption(this, "project_id"),
                            structure_name: this.model.get('displayed_name'),
                            addStructureButton: $addStructureButton
                        });
                    } else {
                        relationshipForm = new Views.RelationshipForm({
                            project_id: this.model.get('project_id'),
                            structure_name: this.model.get('displayed_name'),
                            //  extra
                            relationships: Marionette.getOption(this, "relationships"),
                            model: this.model,
                            addStructureButton: $addStructureButton
                        });
                    }
                    relationshipForm.render();
                    this.ui.relationshipSubForm
                        .html(relationshipForm.$el);

                    this.subForms.tagForm = new tagsView.TagFormItem({
                        model: this.model
                    }).render();

                    this.ui.tagSubForm
                        .html(this.subForms.tagForm.$el);

                    this.form = new Backbone.Form({
                        model: this.model
                    }).render();

                    this.$el.find(".form-placeholder")
                        .html(this.form.$el);

                    this.$el.find('#nvp-note')
                        .attr('autofocus', true);

                    this.$el.find('a[data-toggle="tab"]')
                        .on('shown.bs.tab', _.bind(function (e) {
                            var isNVP = $(e.target).attr("href") === '#nvptab';

                            if (isNVP) {
                                this.$el.find(".form-placeholder").hide();
                            } else {
                                this.$el.find(".form-placeholder").show();
                                this.$el.find(".progress").hide();
                            }

                            this.isDraw = !isNVP;
                        }, this));

                    this.isDraw = !!Marionette.getOption(this, "sources");
                },

                onSetProgressBar: function (structure, count, allCount, success) {
                    if (this.isDraw) {
                        this.cancelProgress();
                        if (success) {
                            this.trigger("dialog:close");
                        } else {
                            $("button.js-submit").button('reset');
                        }
                    } else {
                        var cents = Math.round(100 * allCount / count);
                        this.$el.find(".progress")
                            .html('<div class="progress-bar progress-bar-warning" style="width:' + cents + '%">' + cents + '%' + '</div>');

                        if (success) {
                            var splitter = this.splitArr();
                            var index = _.indexOf(splitter, structure.attributes.nvp.toUpperCase());
                            splitter.splice(index, 1);

                            this.$el.find(".nvp-note").val(splitter.join('\n'));
                        } else {
                            this.$el.find(".nvp-adding_error").show();
                        }

                        this.$el.find(".progress").show();

                        if (allCount === count) {
                            this.cancelProgress();
                            if (this.$el.find(".nvp-adding_error").is(":hidden")) {
                                this.trigger("dialog:close");
                            }
                        }
                    }
                },

                submitClicked: function (e) {
                    e.preventDefault();

                    var $target = $(e.currentTarget);

                    this.backToNVP();
                    this.$el.find(".nvp-adding_error").hide();

                    //  TODO - move into fake model or whatever to get by controller through form:submit handler

                    var data = this.form.getValue();
                    var notes = $('#note').val();

                    data.notes = notes === "" ? [] : [{
                        note_text: notes
                    }];

                    var $sourcesList = this.$el.find('[data-element="source-list"]')[0];
                    data.source = _.map(Backbone.Syphon.serialize($sourcesList), function (item) {
                        return item;
                    });
                    var $relationshipsList = this.$el.find('[data-element="relationship-list"]')[0];
                    data.relationships = _.map(Backbone.Syphon.serialize($relationshipsList), function (item) {
                        return item;
                    });

                    data.tags = _.map(this.$el.find('[data-element="tag-specific"]').select2('val'), function (item) {
                        return {
                            tag_def_id: item
                        };
                    });

                    if (!this.isDraw) {
                        data.structure = null;
                        //  Added NVPs are always compounds, never scaffolds
                        data.item_type_id = "compound";

                        if (this.ui.nvpNote.val() !== "") {
                            $target.button('loading');

                            this.$el.find('.progress-bar-container')
                                .show();
                            this.$el.find(".progress")
                                .html('<div class="progress-bar progress-bar-warning progress-bar-empty">0%</div>');

                            this.trigger("form:submit", _.map(this.splitArr(), function (item) {
                                data.nvp = item;

                                return _.clone(data);
                            }));
                        }
                    } else {
                        var errs = this.form.validate();
                        var molecule = this.subForms.Molecule;

                        if (!errs) {
                            if (molecule.sketcher !== null) {
                                data.structure = molecule.sketcher.exportStructure();
                            }

                            $target.button('loading');
                            this.trigger("form:submit", [data]);
                        } else {
                            $target.button('reset');
                        }
                    }
                },

                splitArr: function () {
                    return this.ui.nvpNote.val().toUpperCase().trim().split(/\s*[ |,|\n]\s*/);
                },
                previewClicked: function (event) {
                    var that = this;

                    if (this.ui.nvpNote.val() !== "") {
                        this.$el.find('.js-preview')
                            .text('Loading...')
                            .attr('disabled', 'disabled');

                        //  TODO - verbose - empty join
                        CSF.request("nvp:structures:entities", this.splitArr().join()).done(function (structures) {
                            that.$el.find('#nvpPreviewToggle').show();
                            that.$el.find('.js-preview').text('Preview').removeAttr('disabled');

                            that.showStructure(structures);
                        });
                    }
                },

                backToNVP: function () {
                    this.$el.find('#nvpPreviewToggle .slide').remove();
                    this.$el.find('#nvpPreviewToggle').hide();
                    this.$el.find('#textAreaToggle').show();
                    this.$el.find('.js-preview')
                        .text('Preview').removeAttr('disabled');
                },

                close: function () {
                    $(".modal-backdrop").remove();
                },
                showStructure: function (structures) {
                    var structuresListView = new CSF.StructureApp.List.View.NVPSimpleList({
                        collection: structures
                    });
                    structuresListView.render();

                    this.$el.find('#textAreaToggle').hide();
                    this.$el.find('#nvpPreviewToggle').prepend(structuresListView.$el);
                }
            });

            /**
             * Setting view for sources item
             * @class SourceItem
             * @constructor
             * @extends Marionette.ItemView
             */
            Views.SourceItem = Marionette.ItemView.extend({
                template: sourceItemTpl,
                className: "panel panel-sm panel-default",
                events: {
                    "click [data-action='removeSource']": "removeSourceClicked"
                },
                removeSourceClicked: function (event) {
                    var $el = $(event.currentTarget);
                    $el.closest('.panel').remove();
                }
            });
            /**
             * Setting sources view in {{#crossLink "StructureApp.Common.Views.Form"}}form{{/crossLink}}
             * @class SourceForm
             * @constructor
             * @extends Marionette.ItemView
             */
            Views.SourceForm = Marionette.ItemView.extend({
                template: sourceFormTpl,
                ui: {
                    sourceTypeSelect: '[data-element="selectSource"]',
                    sourceList: '[data-element="source-list"]'
                },
                events: {
                    "change [data-element='selectSource']": "selectSourceChanged",
                    "click [data-action='showSource']": "showSourceForm"
                },
                //  TODO - no good to store states in DOM
                toggleAddButtonDisabled: function (disable) {
                    var $addButton = Marionette.getOption(this, "addStructureButton");

                    if ($addButton) {
                        if (disable) {
                            $addButton.addClass('disabled disabledBySources');
                        } else if (!$addButton.hasClass('disabledByRelationships')) {
                            $addButton.removeClass('disabled disabledBySources');
                        } else {
                            $addButton.removeClass('disabledBySources');
                        }
                    }
                },
                addSelectedSource: function (data) {
                    var sourceItem = new Views.SourceItem({
                        model: new CSF.Entities.SourceModel(data)
                    }).render();

                    this.ui.sourceList.append(sourceItem.$el);

                    var titleTooltip = sourceItem.$el.find('[data-toggle="title-tooltip"]');
                    if (titleTooltip.find('span').width() < titleTooltip.width()) {
                        titleTooltip.attr('title', '');
                    } else {
                        titleTooltip.tooltip({html: true});
                    }

                    this.$el.find("[data-element='source-form']").slideUp();
                    this.$el.find("[data-action='showSource']").show();
                },
                showSourceForm: function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    this.$el.find("[data-element='source-form']")
                        .slideDown();

                    this.$el.find("[data-action='showSource']")
                        .hide();
                },
                selectSourceChanged: function (event) {
                    var $el = $(event.currentTarget);
                    var value = $el.val();

                    this.$el.find(".source-form").hide();

                    if (value) {
                        this.toggleAddButtonDisabled(true);

                        this.$el.find("[data-element='" + value + "']")
                            .slideDown();
                    }
                },
                // show clear icon when type and hide submit btn when clear
                changeSourceInput: function ($form) {
                    var $addSourceButton = $form.find('[data-element="addSource"]');
                    var $queryInput = $form.find('[data-element="query"]');
                    var $queryClear = $form.find('[data-action="clearControl"]');
                    var $resultList = $form.find('[data-element="result"]');
                    var $resultAmount = $form.find('[data-element="result-amount"]');

                    $queryInput.on('input', function () {
                        var hasText = this.value !== '';

                        if (hasText) {
                            $addSourceButton.button('reset');
                            $queryClear.show();
                        } else {
                            $queryClear.hide();
                        }
                    });
                    $queryClear.on('click', function () {
                        $queryClear.siblings(".form-control")
                            .val('').focus();

                        $resultList.hide();
                        $resultAmount.hide();
                        $queryClear.hide();
                    });
                },
                sourceModelDefaults: function ($form, val, query) {
                    var form_data = Backbone.Syphon.serialize($form[0]);
                    return {
                        id: _.uniqueId(form_data.source_type),
                        source_type: form_data.source_type,
                        title: form_data.title,
                        external_id: query ? val : val.id,
                        name: query ? val : val.text,
                        comment: form_data.comment
                    };
                },
                sourceFormCallback: function ($form) {
                    $form.slideUp();
                    this.$el.find('[data-element="result"]').html('').hide();
                    this.$el.find('[data-element="result-amount"]').hide();

                    this.toggleAddButtonDisabled(false);
                    if(!this.model || !this.model.get('chemical_entity_id')){
                        this.$el.find("[data-element='source-form']").slideUp();
                        this.$el.find("[data-action='showSource']").show();
                    }
                    this.ui.sourceTypeSelect.val(0);
                },
                sourceResultsListItemSelect: function ($ctx, context, $addSourceButton, result) {
                    context.$el.find('[data-element="source"]').removeClass('active');

                    $ctx.addClass('active');
                    $addSourceButton.button('reset');

                    return result.models[$ctx.attr('val')].attributes;
                },
                initAssayForm: function () {
                    var that = this;
                    //  TODO - refactor common parts
                    var callback = _.bind(function () {
                        this.sourceFormCallback($form);
                    }, this);
                    var result,
                        selectedSource = false;

                    var $form = this.$el.find('[data-element="source-Assay"]');
                    var $searchButton = $form.find('[data-element="find"]');
                    var $addSourceButton = $form.find('[data-element="addSource"]');
                    var $queryInput = $form.find('[data-element="query"]');
                    var $resultList = $form.find('[data-element="result"]');
                    var $resultAmount = $form.find('[data-element="result-amount"]');

                    var cancelHandler = _.bind(function () {
                        callback();
                        $queryInput.val('');
                        CSF.request("sources:reject:deferred", 'assay');
                    }, this);
                    var findSource = function () {
                        var query = $queryInput.val();

                        selectedSource = false;
                        result = [];

                        $addSourceButton.button('loading');
                        $resultList.html('').hide();

                        if (query) {
                            $resultAmount
                                .html('Results (' + 'searching...)').show();
                            $resultList
                                .html('<p class="text-center">This will take a while. Please hold on.</p>')
                                .show().addClass('loading').spin('sources');

                            CSF.request("assay:entities", query).done(function (assayCollection) {
                                var assayView = new Views.SourceSearchList({
                                    collection: assayCollection,
                                    type: 'assay'
                                });

                                result = assayCollection;
                                if (!assayCollection) {
                                    $resultList.hide();
                                    $form.find(".collapse-hide").hide();
                                }
                                $resultList.html('');

                                assayView.render();
                                $resultList.append(assayView.$el);
                                $resultAmount
                                    .html('Results (' + assayCollection.length + ' records found)');

                                if (assayCollection.length === 1) {
                                    $form.find(".collapse-hide").show();
                                }
                                
                                setTimeout(function () {
                                    that.toggleAddButtonDisabled(true);
                                }, 10);
                            });
                        } else {
                            $resultList.hide();
                            $resultAmount.hide();
                        }
                    };

                    $searchButton.on('click', findSource);
                    $queryInput.on('keyup', function () {
                        if (event.keyCode === 13) {
                            findSource();
                        }
                    });

                    this.changeSourceInput($form);

                    $resultList.on('click', '[data-element="source"]', function () {
                        selectedSource = that.sourceResultsListItemSelect($(this), that, $addSourceButton, result);
                    });

                    $addSourceButton.on('click', function (e) {
                        e.preventDefault();

                        if (!selectedSource) {
                            return;
                        }

                        var data = that.sourceModelDefaults($form, selectedSource);

                        that.addSelectedSource(data);
                        callback();
                    });

                    $form.on('click', '[data-element="cancel"]', cancelHandler);
                },
                initELNForm: function () {
                    var that = this;
                    //  TODO - refactor common parts
                    var callback = _.bind(function () {
                        this.sourceFormCallback($form);
                    }, this);
                    var $form = this.$el.find('[data-element="source-eLN"]');
                    var $queryInput = $form.find('[data-element="query"]');

                    $form.on('click', '[data-element="addSource"]', function () {
                        var query = $queryInput.val();
                        if (!query) {
                            return;
                        }

                        var data = that.sourceModelDefaults($form, query, 'query');

                        that.addSelectedSource(data);
                        callback();
                    });

                    this.changeSourceInput($form);

                    $form.on('click', '[data-element="cancel"]', callback);
                },
                initLiteratureForm: function () {
                    var that = this;
                    //  TODO - refactor common parts
                    var callback = _.bind(function () {
                        this.sourceFormCallback($form);
                    }, this);

                    var result,
                        selectedSource;

                    var $form = this.$el.find('[data-element="source-Literature"]');
                    var $searchButton = $form.find('[data-element="find"]');
                    var $addSourceButton = $form.find('[data-element="addSource"]');
                    var $queryInput = $form.find('[data-element="query"]');
                    var $yearInput = $form.find('[data-element="year"]');
                    var $resultList = $form.find('[data-element="result"]');
                    var $resultAmount = $form.find('[data-element="result-amount"]');

                    var cancelHandler = _.bind(function () {
                        callback();
                        $queryInput.val('');
                        CSF.request("sources:reject:deferred", 'literature');
                    }, this);
                    //  TODO - awful code - refactor!
                    var chooseSource = function () {
                        if (!selectedSource) {
                            return;
                        }

                        var data = that.sourceModelDefaults($form, selectedSource);

                        that.addSelectedSource(data);
                        callback();
                    };

                    var findSource = function () {
                        var query = $queryInput.val();

                        selectedSource = false;
                        result = [];
                        $addSourceButton.button('loading');
                        $resultList.html('').hide();

                        if (query) {
                            $resultAmount
                                .html('Results (' + 'searching...)').show();
                            $resultList
                                .html('<p class="text-center">This will take a while. Please hold on.</p>').show()
                                .addClass('loading').spin('sources');

                            CSF.request("literature:entities", query, $yearInput.val()).done(function (literatureCollection) {
                                var literatureView = new Views.SourceSearchList({
                                    collection: literatureCollection,
                                    type: 'literature'
                                });

                                result = literatureCollection;

                                $resultList.html('');
                                literatureView.render();
                                $resultList.append(literatureView.$el);
                                $resultAmount
                                    .html('Results (' + literatureCollection.length + ' records found)');

                                if (literatureCollection.length === 1) {
                                    chooseSource();
                                }

                                setTimeout(function () {
                                    that.toggleAddButtonDisabled(true);
                                }, 10);
                            });
                        } else {
                            $resultList.hide();
                            $resultAmount.hide();
                            $form.find(".collapse-hide").hide();
                        }
                    };

                    $searchButton.on('click', findSource);
                    $queryInput.on('keyup', function () {
                        if (event.keyCode === 13) {
                            findSource();
                        }
                    });
                    $yearInput.on('keyup', function () {
                        if (event.keyCode === 13) {
                            findSource();
                        }
                    });

                    $resultList.on('click', '[data-element=source]', function () {
                        selectedSource = that.sourceResultsListItemSelect($(this), that, $addSourceButton, result);
                    });

                    $addSourceButton.on('click', chooseSource);

                    $form.on('click', '[data-element="cancel"]', cancelHandler);
                },
                initPatentForm: function () {
                    var that = this;
                    var $form = this.$el.find('[data-element="source-Patent"]');
                    var $queryInput = $form.find('[data-element="query"]');
                    var callback = _.bind(function () {
                        this.sourceFormCallback($form);
                    }, this);

                    $form.on('click', '[data-element="addSource"]', function () {
                        var query = $queryInput.val();
                        if (!query) {
                            return;
                        }

                        var data = that.sourceModelDefaults($form, query, 'query');

                        that.addSelectedSource(data);
                        callback();
                    });

                    this.changeSourceInput($form);

                    $form.on('click', '[data-element="cancel"]', callback);
                },
                initOtherForm: function () {
                    var that = this;
                    var $form = this.$el.find('[data-element="source-Other"]');
                    var $queryInput = $form.find('[data-element="query"]');
                    var callback = _.bind(function () {
                        this.sourceFormCallback($form);
                    }, this);
                    $form.on('click', '[data-element="addSource"]', function () {
                        var query = $queryInput.val();

                        if (!query) {
                            return;
                        }

                        var data = that.sourceModelDefaults($form, query, 'query');

                        that.addSelectedSource(data);
                        callback();
                    });

                    this.changeSourceInput($form);

                    $form.on('click', '[data-element="cancel"]', callback);
                },
                onRender: function () {
                    this.initAssayForm();
                    this.initLiteratureForm();
                    this.initELNForm();
                    this.initPatentForm();
                    this.initOtherForm();
                }
            });
            /**
             * Setting view for relationship item
             * @class RelationshipItem
             * @constructor
             * @extends Marionette.ItemView
             */
            Views.RelationshipItem = Marionette.ItemView.extend({
                template: relationshipItemTpl,
                className: "panel panel-sm panel-default",
                events: {
                    "click [data-action='removeRelationship']": "removeRelationshipClicked"
                },
                removeRelationshipClicked: function (event) {
                    var $el = $(event.currentTarget);

                    $el.closest('.panel').remove();
                }
            });
            /**
             * Setting relationships view in {{#crossLink "StructureApp.Common.Views.Form"}}form{{/crossLink}}
             * @class RelationshipForm
             * @constructor
             * @extends Marionette.ItemView
             */
            Views.RelationshipForm = Marionette.ItemView.extend({
                template: relationshipFormTpl,
                ui: {
                    relationshipList: '[data-element="relationship-list"]'
                },
                events: {
                    'click [data-action="showRelationship"]': "showRelationship"
                },
                //  TODO - no good to store states in DOM
                toggleAddButtonDisabled: function (disable) {
                    var $addButton = Marionette.getOption(this, "addStructureButton");

                    if (disable) {
                        $addButton.addClass('disabled disabledByRelationships');
                    } else if (!$addButton.hasClass('disabledBySources')) {
                        $addButton.removeClass('disabled disabledByRelationships');
                    } else {
                        $addButton.removeClass('disabledByRelationships');
                    }
                },
                showRelationship: function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    this.toggleAddButtonDisabled(true);

                    this.$el.find('[data-element="relationship-form"]').slideDown();
                    this.$el.find('[data-element="relationship-reason"]').val('');
                    this.$el.find('[data-action="showRelationship"]').hide();
                },
                initRelationshipForm: function () {
                    var that = this;
                    var $form = that.$el.find('[data-element="relationship-form"]');
                    var $structureInput = $form.find('[data-element="derives-from"]');
                    var $reasonInput = $form.find('[data-element="relationship-reason"]');

                    $form.on('click', '[data-element="addRelationship"]', function () {
                        var structure = $structureInput.select2('data');
                        var reason = $reasonInput.select2('data');
                        var reasonText = _.pluck(reason, 'text').join(", ");

                        var data = {
                            id: _.uniqueId("relationship"),
                            parent_id: structure.model.get('chemical_entity_id'),
                            name: structure.model.get('nvp') ? structure.model.get('nvp') : structure.model.get('chemical_entity_name'),
                            comment: reasonText
                        };

                        $form.slideUp();
                        that.toggleAddButtonDisabled(false);

                        that.addRelationship(data);
                        $structureInput.select2("val", "");
                        $reasonInput.select2("val", "");

                        that.$el.find('[data-action="showRelationship"]').show();
                    });
                    $form.on('click', '[data-element="cancel"]', function () {
                        $form.slideUp();
                        that.toggleAddButtonDisabled(false);

                        that.$el.find('[data-action="showRelationship"]').show();
                    });
                },
                onRender: function () {
                    var that = this;
                    that.initRelationshipForm();

                    var reasons = [],
                        fetch = {
                            projectStructures: CSF.request("structure:entities", {
                                project_id: Marionette.getOption(that, "project_id")
                            }),
                            reasonsDefs: CSF.request("reasons_definitions:entities")
                        };

                    $.when(fetch.reasonsDefs, fetch.projectStructures).done(function (reasonsDefs, projectStructures) {
                        //  TODO - strange augmentation
                        _.each(projectStructures.models, function (item) {
                            item.id = item.get('chemical_entity_id');
                            item.text = item.get('nvp') ? item.get('nvp') : item.get('chemical_entity_id');
                        });
                        var relationships = projectStructures.models.slice();

                        that.$el.find('[data-element="derives-from"]')
                            .select2({
                                query: function (query) {
                                    var series = [],
                                        data = {},
                                        existed = _.map(that.$el.find('.relationship_item'), function (item) {
                                            return item.value;
                                        });

                                    //  TODO EACHES
                                    //  fill data
                                    _.each(relationships, function (relationship) {
                                        var relationshipSeries = relationship.get('series');

                                        data[relationshipSeries.series_id] = {
                                            id: relationshipSeries.series_id,
                                            name: relationshipSeries.series_name
                                        };
                                    });
                                    //  make series
                                    _.each(_.uniq(data), function (item) {
                                        series.push({
                                            category: {
                                                id: item.id,
                                                name: item.name
                                            },
                                            children: []
                                        });
                                    });
                                    //  fill series children
                                    _.each(relationships, function (relationship) {
                                        var seriesId = relationship.get('series').series_id;
                                        var chemical = {
                                            id: relationship.get('chemical_entity_id'),
                                            name: relationship.get('chemical_entity_name')
                                        };
                                        var chemicalId = chemical.id.toString();

                                        _.each(series, function (item) {
                                            if (seriesId === item.category.id) {
                                                item.children.push({
                                                    id: chemical.id,
                                                    text: chemical.name,
                                                    model: relationship,
                                                    disabled: _.indexOf(existed, chemicalId) !== -1
                                                });
                                            }
                                        });
                                    });
                                    var term = query.term,
                                        seriesClone = term ? [] : _.clone(series);

                                    if (term) {
                                        var lowerTerm = term.toLowerCase(),
                                            categories = [];

                                        _.each(series, function (item) {
                                            var itemCat = item.category;
                                            var children = [];

                                            _.each(item.children, function (child) {
                                                var token = child.text.toLowerCase();

                                                if (token.indexOf(lowerTerm) !== -1) {
                                                    children.push(child);

                                                    if (_.indexOf(categories, itemCat) === -1) {
                                                        categories.push(itemCat);
                                                    }
                                                }
                                            });

                                            if (children.length) {
                                                seriesClone.push({
                                                    category: itemCat,
                                                    children: children
                                                });
                                            }
                                        });
                                    }
                                    query.callback({
                                        results: seriesClone
                                    });
                                },
                                //  TODO - resembles structure/relationships/relationships-view
                                formatResult: function (object) {
                                    if (object.category) {
                                        return '<span class="bold">' + object.category.name + '</span>';
                                    } else {
                                        return '<span>' + object.text + '</span>' +
                                            '<span class="target structure-type structure-type-' + object.model.get('item_type_id') + ' pull-right">'
                                            + object.model.get('item_type_id').substr(0, 1).toLocaleUpperCase() + '</span>';
                                    }
                                }
                            });

                        //  TODO - do we pass reasons filled before? - and could it be a separate promise?
                        _.each(reasonsDefs.models, function (reason) {
                            reasons.push(reason.get('reason'));
                        });
                        that.$el.find('[data-element="relationship-reason"]')
                            .select2({
                                placeholder: '',
                                minimumInputLength: 0,
                                allowClear: true,
                                tags: reasons
                            });
                    });
                },
                addRelationship: function (data) {
                    var RelationshipItem = new Views.RelationshipItem({
                        model: new Backbone.Model(data)
                    });
                    RelationshipItem.render();

                    this.ui.relationshipList
                        .append(RelationshipItem.$el);
                }
            });

            /**
             * Setting view for structure
             * @class StructureItemView
             * @constructor
             * @extends Marionette.ItemView
             */
            Views.StructureItemView = Marionette.ItemView.extend({
                showStructure: function (data, options) {
                    var params = {
                        imgWidth: options.imgWidth || 178,
                        imgHeight: options.imgHeight || 130
                    };
                    var $img = $('<img>').attr({
                        src: data
                    }).css({
                        height: params.imgHeight + 'px',
                        width: params.imgWidth + 'px'
                        });

                    this.ui.image.html($img);
                },
                renderStructure: function (options) {
                    var params = {
                        imgWidth: options && options.imgWidth || 178,
                        imgHeight: options && options.imgHeight || 130,
                        cache: true
                    };
                    var id = this.model.get('chemical_entity_id') + this.model.get('nvp') + params.imgWidth + params.imgHeight;

                    var cachedStructures = CSF.cache.structure;
                    var callback = _.bind(function (data) {
                        if (data) {
                            cachedStructures[id] = data;
                        }

                        this.showStructure(cachedStructures[id], params);
                    }, this);

                    if (cachedStructures[id] && params.cache) {
                        callback();
                    } else {
                        this.ui.image.css({
                            height: params.imgHeight + 'px'
                        }).html('')
                            .spin('structure');

                        var image = new CSF.Entities.StructureModel({
                            structure: this.model.get('structure')
                        });

                        $.when(image.getStructureImage(params)).done(callback);
                    }
                }
            });

            /**
             * Setting view for confirmation dialogue
             * @class DialogConfirm
             * @constructor
             * @extends Marionette.ItemView
             */
            Views.DialogConfirm = Marionette.ItemView.extend({
                template: dialogConfirmTpl,
                events: {
                    "click [data-action='submit-delete']": "submitDelete",
                    "click [data-action='cancel-delete']": "cancelDelete"
                },
                initialize: function (data) {
                    this.title = data.title;
                    this.body = data.body;
                    this.buttonTitle = "Delete source";
                },
                submitDelete: function (e) {
                    e.preventDefault();

                    var that = this;
                    this.model.destroy()
                        .done(function () {
                            that.trigger('Confirmed');
                            //  todo - same as with cancelDelete
                            $(".modal-backdrop").remove();
                            location.reload();
                        });
                },
                cancelDelete: function (e) {
                    $(".modal-backdrop").remove();
                }
            });

            Views.MolForm = Marionette.ItemView.extend({
                getTemplate: function () {
                    var useEdit = Marionette.getOption(this, "editType") !== 'creation';
                    return useEdit ? editMolForm : setMolForm;
                },
                ui: {
                    showMol: '.showMolecule'
                },
                events: {
                    'click button.js-submit': 'submitClicked',
                    'click .js-getMol': 'setMol'
                },
                setSketcher: function (mol) {
                    var that = this;
                    //  TODO - move out from view of a FORM
                    if (CSF.config.SKETCHER_ID === "Marvin") {
                        require([
                            "marvin.util"
                        ], function () {
                            that.$el.find('[data-form="molecule"]')
                                .append('<iframe src="assets/js/vendor/marvin/editorws.html" id="sketch" class="sketcher-frame" style="height:465px;"></iframe>');

                            getMarvinPromise("#sketch").done(function (sketcherInstance) {
                                that.sketcher = sketcherInstance;
                                that.sketcher.importStructure = that.sketcher.importAsMol;
                                that.sketcher.exportStructure = that.sketcher.exportAsMol;
                                if (mol) {
                                    that.sketcher.importStructure(mol);
                                }
                            }).fail(function () {
                                alert("Cannot retrieve sketcher instance from iframe");
                            });
                        });
                    } else if (CSF.config.SKETCHER_ID === "ChemDraw") {
                        that.$el.find('[data-form="molecule"]')
                            .append('<div id="sketch" class="sketcher-frame" style="height:465px;"></div>');

                        require([
                            "chemdraw"
                        ], function () {
                            var deps = ["moleditor"];

                            if (cd_currentUsing === 2 || cd_currentUsing === 3) {
                                deps.push("cdlib_ns");
                            } else if (cd_currentUsing === 1) {
                                deps.push("cdlib_ie");
                            }

                            require(deps, function () {
                                var node = $("#sketch");

                                node.moleditor({
                                    width: 523,
                                    height: 465
                                });
                                that.sketcher = node;

                                node.importStructure = function (mol) {
                                    that.sketcher.moleditor('setMolfile', mol);
                                };
                                node.exportStructure = function () {
                                    return that.sketcher.moleditor('getMolfile');
                                };

                                if (mol) {
                                    setTimeout(function () {
                                        that.sketcher.importStructure(mol);
                                    }, 2000);
                                }
                            });
                        });
                    }
                },
                onRender: function () {
                    var structureMolecule = this.model ? this.model.get('structure') : '';
                    this.setSketcher(structureMolecule);
                    if (Marionette.getOption(this, "formType") === 'saveStructure') {
                        this.$el.find('.modal-title').html('Export molecule');
                        this.$el.find('.form-group').remove();
                        this.$el.find('.js-submit').remove();
                        this.$el.find('.btn[data-dismiss="modal"]').html('Ok');

                        this.$el.find('.modal-header h2')
                            .html('Copy structure');
                        this.$el.find('.modal-body')
                            .prepend('<p style="font-size:10px;">Please use the copy functionality from ChemDraw to copy the structure</p>');
                    }
                },
                submitClicked: function (e) {
                    e.preventDefault();

                    $(e.currentTarget).button('loading');

                    if (this.model) {
                        this.model.save({
                            structure: this.sketcher.exportStructure()
                        }, {
                            success: _.bind(function () {
                                this.trigger('dialog:close');
                            }, this)
                        });
                    }
                },

                setMol: function (e) {
                    var callback = _.bind(function (structure) {
                        this.sketcher.importStructure(structure);
                    }, this);
                    var NVP = this.ui.showMol.val();
                    var $btn = $(e.currentTarget);

                    if (NVP !== '') {
                        $btn.button('loading');

                        CSF.request('nvp:structure:entity', NVP).done(function (data) {
                            $btn.button('reset');

                            if (data.get('errorMessage') === 'Unknown in SMF') {
                                $(".showMolecule").css("border-color", "#e44c16");
                                $("#wrongNVP").show();
                            } else {
                                $(".showMolecule").css("border-color", "#ccc");
                                $("#wrongNVP").hide();

                                callback(data.get('structure'));
                            }
                        });
                    }
                }
            });

            Views.SourceSearchItemView = Marionette.ItemView.extend({
                template: sourcesSearchItemTpl,
                initialize: function () {
                },
                serializeData: function () {
                    var regexp = /http:\/\/dx.doi.org\//gi;
                    var text,
                        id;
                    if (Marionette.getOption(this, "type") === 'literature') {
                        id = this.model.get('doi').replace(regexp, "");
                        text = this.model.get('fullCitation');
                    } else {
                        id = this.model.get('Id');
                        text = this.model.get('DisplayName');
                    }

                    return {
                        text: text + ' (' + id + ')',
                        modelIndex: Marionette.getOption(this, "indexInCollection")
                    };
                }
            });

            Views.SourceSearchList = Marionette.CollectionView.extend({
                childView: Views.SourceSearchItemView,
                initialize: function () {
                },
                onRender: function () {
                    this.appendHtml = function (collectionView, childView) {
                        collectionView.$el
                            .prepend(childView.el);
                    };
                },
                childViewOptions: function (model) {
                    return {
                        type: Marionette.getOption(this, "type"),
                        indexInCollection: this.collection.indexOf(model)
                    };
                }
            });

        });

        return CSF.StructureApp.Common.Views;
    });
