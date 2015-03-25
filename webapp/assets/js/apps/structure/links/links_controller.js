define([
    "app",
    "common/views",
    "apps/structure/links/links_view",
    "entities/link",
    "entities/link_definitions"
], function (CSF, CommonViews, View) {

    CSF.module("StructuresApp.Links", function (Links, CSF, Backbone, Marionette, $, _) {

        Links.Controller = {
            showLinksAction: function (region, structure) {
                var controller = this;

                var projectId = structure.get('project').project_id,
                    seriesId = structure.get('series').series_id,
                    structureType = structure.get('item_type_id'),
                    structureId = structure.get('chemical_entity_id');

                var loadingEmptyView = new CommonViews.LoadingCollapsePanel({
                    title: "Links"
                });

                region.show(loadingEmptyView);

                var fetch = {
                    links: CSF.request("link:entities", projectId, seriesId, structureType, structureId),
                    definitions: CSF.request("link_definition:entities", projectId, seriesId, structureType, structureId)
                };

                $.when(fetch.links, fetch.definitions).done(function (links, definitions) {
                    var structureLinksView = new View.LinksPanelLayout({
                        collection: links,
                        editable: structure.get('editable')
                    });

                    region.show(structureLinksView);

                    structureLinksView
                        .on("link:add", function () {
                            controller.addLinkAction(links, definitions, structure);
                        });

                    var LinksCollectionView = new View.Links({
                        collection: links
                    }).on("childview:link:edit", function (view, link) {
                            controller.editLinkAction(links, definitions, link);
                        });

                    structureLinksView.collectionViewContainer.show(LinksCollectionView);
                });
            },

            addLinkAction: function (links, definitions, structure) {
                var projectId = structure.get('project').project_id,
                    seriesId = structure.get('series').series_id,
                    structureTypeId = structure.get('item_type_id'),
                    structureId = structure.get('chemical_entity_id');

                var newDefLink = CSF.request("link_definition:entity:new", projectId, seriesId, structureTypeId, structureId);
                var addLinkView = new View.LinkForm({
                    model: newDefLink,
                    dataLoadingText: 'Adding...'
                });

                addLinkView
                    .on("form:submit", function (data) {
                        newDefLink
                            .save(data)
                            .done(function () {
                                definitions.add(newDefLink);
                                addLinkView.trigger("dialog:close");

                                links.fetch();
                            })
                            .fail(function () {
                                links.fetch();
                            });
                    });

                CSF.dialogRegion.show(addLinkView);
            },

            editLinkAction: function (links, definitions, link) {
                var defLink = definitions.findWhere({
                    link_id: link.id
                });
                var editLinkView = new View.LinkForm({
                    model: defLink,
                    title: "Edit link",
                    buttonTitle: "Save updates"
                });

                editLinkView
                    .on("link:delete", function () {
                        links.remove(link);
                        definitions.remove(defLink);
                        defLink.destroy();

                        this.trigger("dialog:close");
                    })
                    .on("form:submit", function (data) {
                        defLink
                            .save(data)
                            .done(function () {
                                links.reset();
                                links.fetch();

                                CSF.dialogRegion.closeDialog();
                            })
                            .fail(function () {
                                links.fetch();
                            });
                    });

                CSF.dialogRegion.show(editLinkView);
            }
        };
    });

    return CSF.StructuresApp.Links.Controller;
});