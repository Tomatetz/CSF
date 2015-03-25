define([
        "app",
        "apps/structure/tags/tags_view",
        "apps/structure/common/tags_view",
        "common/views",
        "entities/tag"
    ],
    function (CSF, View, StructureCommonTagsView, CommonViews) {
        CSF.module("StructuresApp.Tags", function (Tags, CSF, Backbone, Marionette, $, _) {

            function showTags(tagsPanel, structureTags) {
                var tagsCollectionView = new View.Tags({
                    collection: structureTags
                });

                tagsPanel.tagsRegion.show(tagsCollectionView);
            }

            Tags.Controller = {
                showTagsAction: function (region, structure) {
                    var projectId = structure.get('project').project_id,
                        seriesId = structure.get('series').series_id,
                        structureId = structure.get('chemical_entity_id');

                    var loadingEmptyView = new CommonViews.LoadingCollapsePanel({
                        title: "Tags"
                    });

                    region.show(loadingEmptyView);

                    CSF.request('tags:entities', projectId, seriesId, structureId).done(function (structureTags) {
                        var tagsPanel = new View.TagsPanel({
                            collection: structureTags,
                            editable: structure.get('editable')
                        });

                        region.show(tagsPanel);
                        showTags(tagsPanel, structureTags);

                        tagsPanel.on('tags:add', function () {
                            var emptyDialogView;

                            if (structure.get('tags').length) {
                                emptyDialogView = new View.EmptyDialog({
                                    title: 'Edit tags',
                                    buttonTitle: 'Save updates'
                                });
                            } else {
                                emptyDialogView = new View.EmptyDialog({
                                    title: 'Add tags',
                                    buttonTitle: 'Add',
                                    dataLoadingText: 'Adding...'
                                });
                            }

                            CSF.dialogRegion.show(emptyDialogView);

                            var addItemModal = emptyDialogView.subForms.tagsDialog = new StructureCommonTagsView.TagFormItem({
                                model: structure
                            }).render();

                            emptyDialogView.ui.modalBody
                                .html(addItemModal.el);

                            addItemModal.$el.find('[data-element="tag-form"]').show();
                            addItemModal.$el.find('[data-action="showTag"]').hide();

                            addItemModal.$el.find('label').remove();

                            emptyDialogView.on("addTags:submit", function (data) {
                                var that = this;

                                structure.save('tags', data).success(function () {
                                    that.trigger("dialog:close");

                                    showTags(tagsPanel, structureTags);

                                    structureTags.fetch()
                                        .done(function () {
                                            tagsPanel.$el.find('[data-action="add-Tags"]')
                                                .html(structureTags.length ?
                                                    '<span class="glyphicon glyphicon-pencil"></span> Edit tags'
                                                    : '<span class="glyphicon glyphicon-plus font12 colorBlue"></span> Add tags');
                                        });
                                });
                            });
                        });
                    });
                }
            };

        });

        return CSF.StructuresApp.Tags.Controller;
    });