define(["app", "apps/structure/common/views",
        "tpl!apps/structure/show/templates/missing.tpl",
        "tpl!apps/structure/show/templates/layout.tpl",
        "tpl!apps/structure/show/templates/view_image.tpl",
        "tpl!apps/structure/show/templates/tags.tpl",
        "tpl!apps/structure/show/templates/d3.tpl",
        "tpl!apps/structure/show/templates/structure_name_form.tpl",
        "tpl!apps/structure/show/templates/edit_name.tpl",
        "tpl!apps/structure/tags/templates/tag_item.tpl",
        "components/d3graph"],
    function (CSF, CommonViews, missingTpl, layoutTpl, viewImageTpl, tagsTpl, d3Tpl, structureNameTpl, structureNameEditTpl, tagItemTpl) {
        /**
         * @module StructuresApp.Show.View
         * @namespace StructuresApp.Show.View
         */
        CSF.module("StructuresApp.Show.View", function (View, CSF, Backbone, Marionette, $, _) {
            /**
             * @class MissingStructure
             * @constructor
             * @extends Marionette.ItemView
             */
            View.MissingStructure = Marionette.ItemView.extend({
                template: missingTpl
            });
            /**
             * Detailed structure view layout
             * @class Layout
             * @constructor
             * @extends Marionette.LayoutView
             */
            View.Layout = Marionette.LayoutView.extend({
                template: layoutTpl,
                events: {
                    'click [data-action="back"]': "goBack",
                    'click [data-action="edit-structure"]': "editStructure",
                    'click [data-action="edit-source"]': "editSource",
                    'click [data-action="edit-name"]': "editName",
                    'click [data-action="save-name"]': "saveName",
                    'click [data-action="cancel-save-name"]': "cancelSaveName",
                    'click [data-action="export-structure"]': "exportStructure"
                },
                regions: {
                    structureImageRegion: "#structure-image-region",
                    sourcesRegion: "#source-assay",//"#source-region",
                    sourcesAssay: "#source-assay",
                    sourcesEln: "#source-eln",
                    sourcesLiterature: "#source-literature",
                    sourcesPatent: "#source-patent",
                    sourcesOther: "#source-other",
                    parentRegion: "#parent-region",
                    childrenRegion: "#children-region",
                    notesRegion: "#notes-region",
                    linksRegion: "#links-region",
                    criticalPath: "#critical-path",
                    accordionOther: "#accordion-other",
                    structureNameRegion: "#structure-name-region",
                    relationshipsRegion: "#relationships-region",
                    tagsRegion: "#tags-region",
                    sourcesRegionNew: "#sources-region"
                },
                onRender: function () {
                    if (!this.model.get('editable')) {
                        this.$el.find('.glyphicon-pencil').remove();
                    }
                },
                editStructure: function (e) {
                    e.preventDefault();

                    this.trigger("structure:edit", this.model);
                },
                editName: function (e) {
                    this.trigger("structure:name:edit");
                },
                exportStructure: function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.trigger("structure:export");
                }
            });
            /**
             * Rendering structure image
             * @class StructureImage
             * @constructor
             * @extends StructureApp.Common.Views.StructureItemView
             */
            View.StructureImage = CommonViews.StructureItemView.extend({
                template: viewImageTpl,
                ui: {
                    image: '[data-element="image-container"]'
                },
                initialize: function () {
                    var that = this;
                    this.listenTo(this.model, "change:structure", function () {
                        that.renderStructure({
                            imgWidth: 250,
                            imgHeight: 250,
                            cache: false
                        });
                    });
                },
                onRender: function () {
                    this.renderStructure({
                        imgWidth: 250,
                        imgHeight: 250,
                        cache: false
                    });
                    this.$el.find('.clear-structure').remove();
                }
            });

            View.StructureName = CommonViews.StructureItemView.extend({
                template: structureNameTpl,
                ui: {},
                onRender: function () {
                    if (!this.model.get('editable')) {
                        this.$el.find('.glyphicon-pencil').remove();
                    }
                }
            });
            View.StructureNameEdit = CommonViews.StructureItemView.extend({
                template: structureNameEditTpl,
                events: {
                    'click [data-action="save-name"]': "saveName",
                    'click [data-action="cancel-save-name"]': "cancelSaveName"
                },
                onShow: function () {
                    this.$el.find('input').focus();
                },
                saveName: function (e) {
                    var that = this;
                    var waitCallback = _.bind(function () {
                        this.$el.find("[data-action='save-name']")
                            .button('loading');
                    }, this);
                    var newName = this.$el.find('.structureName').val();

                    waitCallback();
                    if (newName) {
                        this.model.save('chemical_entity_name', newName, {
                            wait: true,
                            success: function (model, response) {
                                that.trigger("structure:name:save");
                            },
                            error: waitCallback
                        });
                    } else {
                        this.$el.find('.structureName').focus();
                    }
                },
                cancelSaveName: function (e) {
                    this.trigger("structure:name:save:cancel");
                }
            });
        });

        return CSF.StructuresApp.Show.View;
    });
