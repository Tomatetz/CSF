define([
        "app",
        "components/cocktailsMixin",
        "apps/structure/show/show_view",
        "apps/structure/list/list_view"
    ],
    function (CSF, Cocktails, View) {
        /**
         * @module StructuresApp.Show
         * @namespace StructuresApp.Show
         */
        CSF.module("StructuresApp.Show", function (Show, CSF, Backbone, Marionette, $, _) {
            Show.Controller = {
                showStructure: function (projectId, seriesId, structureType, structureId) {
                    var controller = this;
                    require([
                        "common/views",
                        "apps/structure/common/views",
                        "entities/project",
                        "entities/series",
                        "entities/structure",
                        "entities/source",
                        "entities/tag"
                    ], function (CommonViews, StructureCommonViews) {
                        var loadingView = new CommonViews.Loading();

                        CSF.mainRegion.show(loadingView);

                        var structureData = {
                            chemical_entity_id : structureId,
                            project_id : projectId,
                            series_id : seriesId,
                            item_type_id : structureType
                        };

                        var fetch = {
                            //structure: CSF.request("structure:entity", projectId, seriesId, structureType, structureId),
                            structure: CSF.request("structure:entity", structureData),
                            sources: CSF.request("source:entities", projectId, seriesId, structureId),
                            tags: CSF.request("tags:entities", projectId, seriesId, structureId, "relationships")
                        };

                        $.when(fetch.structure, fetch.sources, fetch.tags).done(function (structure, sources, tags) {
                            var Layout = new View.Layout({
                                model: structure
                            });

                            if (structure !== void 0) {
                                Layout.on("structure:export", function () {
                                    controller.saveStructure(structure);
                                });

                                //  TODO - do we need a check for - structure.get('editable')?
                                Layout.on("structure:edit", function (structure) {
                                    var editStructureDialog = new StructureCommonViews.MolForm({
                                        model: structure
                                    });

                                    CSF.dialogRegion.show(editStructureDialog);
                                });

                                Layout.on("structure:delete", function (structure) {
                                    CSF.trigger("structure:delete", structure.id);
                                });

                                Layout.on("link:edit", function (structure) {
                                    var view = new StructureCommonView.DialogLink({
                                        model: structure
                                    });

                                    CSF.dialogRegion.show(view);
                                });

                                //  TODO - listen for a model?
                                structure.on('change', function(){
                                    controller.showImage(Layout, structure);
                                });

                                Layout.on("structure:name:edit", function () {
                                    var StructureEditName = new View.StructureNameEdit({
                                        model: structure
                                    });

                                    this.structureNameRegion.show(StructureEditName);

                                    StructureEditName.on("structure:name:save", function () {
                                        structure.fetch();

                                        controller.showName(Layout, structure);
                                        controller.showBreadcrumbs('structure', structure.get('project'), structure.get('series'), structure);
                                    });
                                    StructureEditName.on("structure:name:save:cancel", function () {
                                        controller.showName(Layout, structure);
                                    });
                                });

                                Layout.on("show", function () {
                                    this.$el.find('.person-preview')
                                        .previewCard();

                                    controller.showImage(Layout, structure);
                                    controller.showName(Layout, structure);

                                    CSF.execute("show:notes", this.notesRegion, structure);
                                    CSF.execute("show:links", this.linksRegion, structure);
                                    CSF.execute("show:relationships", this.relationshipsRegion, structure);
                                    CSF.execute("show:tags", this.tagsRegion, structure);
                                    CSF.execute("show:sources", this.sourcesRegionNew, structure);
                                });

                                CSF.mainRegion.show(Layout);
                            } else {
                                var missingStructureView = new View.MissingStructure();

                                CSF.mainRegion.show(missingStructureView);
                            }

                            controller.showBreadcrumbs('structure', structure.get('project'), structure.get('series'), structure);
                        });
                    });
                },
                showName: function(Layout, structure){
                    var structureName = new View.StructureName({
                        model: structure
                    });

                    Layout.structureNameRegion.show(structureName);
                },
                showImage: function(Layout, structure){
                    var structureImage = new View.StructureImage({
                        model: structure
                    });

                    Layout.structureImageRegion.show(structureImage);
                }
            };
            
            Cocktails.use.mixin(Show.Controller, Cocktails.saveStructureAction, Cocktails.showBreadcrumbsAction);
        });

        return CSF.StructuresApp.Show.Controller;
    });