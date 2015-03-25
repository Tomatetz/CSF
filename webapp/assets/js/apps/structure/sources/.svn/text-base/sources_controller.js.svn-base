define([
    "app",
    "apps/structure/sources/sources_view",
    "apps/structure/show/show_view"
], function (CSF, View, ShowView) {//   TODO - ShowView needed?

    CSF.module("StructuresApp.Relationships", function (Relationships, CSF, Backbone, Marionette, $, _) {
        Relationships.Controller = {
            showSourcesAction: function (region, structure) {
                require([
                    "common/views",
                    "entities/source"
                ], function (CommonViews) {
                    var projectId = structure.get('project').project_id,
                        structureId = structure.get('chemical_entity_id'),
                        seriesId = structure.get('series').series_id;

                    var loadingEmptyView = new CommonViews.LoadingCollapsePanel({
                        title: "Sources"
                    });

                    region.show(loadingEmptyView);

                    CSF.request("source:entities", projectId, seriesId, structureId).done(function (sources) {
                        var sourcesPanel = new View.SourcesPanel({
                            collection: sources,
                            editable: structure.get('editable')
                        });

                        region.show(sourcesPanel);

                        function setSourceTypesCollection(sources) {
                            var sourceTypes = _.groupBy(sources.models, function (model) {
                                return model.get('source_type');
                            });
                            var sourceTypesArray = _.map(sourceTypes, function (items, key) {
                                return {
                                    source_type: key,
                                    title: items[0].get('title')
                                };
                            });
                            var sourcesListView = new View.SourcesCollection({
                                collection: new Backbone.Collection(sourceTypesArray),
                                childViewOptions: {
                                    allSources: sources,
                                    editable: structure.get('editable')
                                }
                            });

                            sourcesPanel.sourcesRegion.show(sourcesListView);

                            sourcesListView.on('childview:childview:source:edit', function (ItemView, item) {
                                var editSourceDialogView = new View.editSourceDialog({
                                    model: item.model,
                                    sources: sources
                                });

                                CSF.dialogRegion.show(editSourceDialogView);

                                editSourceDialogView.on("editSource:submit", function (data) {
                                    var that = this;
                                    item.model.save('comment', data).success(function () {
                                        that.trigger("dialog:close");

                                        sources.fetch();
                                    });
                                });

                                editSourceDialogView.on("deleteSource:dialog", function () {
                                    var that = this;
                                    var dialogView = new View.DialogConfirm({
                                        title: "Delete source",
                                        body: "Are you sure you want to delete source?"
                                    });

                                    CSF.dialogRegion.closeDialog();
                                    CSF.dialogRegion.show(dialogView);

                                    dialogView.on('delete:submit', function () {
                                        item.model
                                            .destroy()
                                            .success(function () {
                                                setSourceTypesCollection(sources);

                                                that.trigger("dialog:close");
                                            });
                                    });
                                });
                            });

                        }

                        setSourceTypesCollection(sources);

                        sourcesPanel.on('sources:add', function () {
                            var emptyDialogView = new View.EmptyDialog({
                                title: 'Add sources',
                                buttonTitle: 'Add',
                                dataLoadingText: 'Adding...'
                            });

                            CSF.dialogRegion.show(emptyDialogView);

                            var $addStructureButton = emptyDialogView.$el.find('.js-submit').addClass('disabled disabledBySources');

                            require(["apps/structure/common/views"], function (StructureCommonViews) {
                                emptyDialogView.subForms.relationshipDialog = new StructureCommonViews.SourceForm({
                                    model: structure,
                                    addStructureButton: $addStructureButton
                                });

                                emptyDialogView.subForms.relationshipDialog.render();
                                emptyDialogView.subForms.relationshipDialog.$el.find('[data-element="source-form"]').show();
                                emptyDialogView.subForms.relationshipDialog.$el.find('[data-action="showSource"]').hide();
                                emptyDialogView.ui.modalBody
                                    .html(emptyDialogView.subForms.relationshipDialog.el);

                                emptyDialogView.on('form:submit', function (data) {
                                    var that = this;

                                    structure
                                        .save('source', _.union(sources.models, data))
                                        .success(function () {
                                            that.trigger("dialog:close");

                                            sources.fetch({
                                                success: function () {
                                                    setSourceTypesCollection(sources);
                                                }
                                            });
                                        });
                                });
                            });
                        });

                    });
                });
            }
        };
    });

    return CSF.StructuresApp.Relationships.Controller;
});