define([
    "app",
    "components/cocktailsMixin",
    "apps/structure/search/search_view",
    "apps/structure/common/views",
    "entities/project",
    "entities/series",
    "entities/tag",
    "entities/structure"
    ], function (CSF, Cocktails, Views, StructureCommonViews) {
    CSF.module("StructuresApp.Search", function (Search, CSF, Backbone, Marionette, $, _) {
        Search.Controller = {
            showSearch: function () {
                var controller = this;
                require([
                    "common/views"
                ], function (CommonViews) {
                    var Layout = new Views.searchLayout();
                    var searchFormView = new Views.searchForm();

                    searchFormView.on("search:show-image", function (data) {
                        var structure = new CSF.Entities.StructureModel({
                            chemical_entity_id : _.uniqueId('temp_'),
                            structure : data
                        }, {
                            parse : false
                        });
                        var structureImageView = new Views.SearchImage({
                            model: structure
                        });

                        structureImageView.render();
                        this.ui.structureImagePlaceholder
                            .html(structureImageView.$el);
                    });
                    searchFormView.on("search:define-controls", function () {
                        var projects = CSF.request("project:entities"),
                            tags = CSF.request("tags:definitions:entities");
                        // tags depends on projects
                        $.when(projects, tags).done(function (projects, tags) {
                            searchFormView.triggerMethod("initProjectControls", projects);
                            searchFormView.triggerMethod("initTagControls", tags.models);
                        });
                    });
                    searchFormView.on("search:show-result", function (data) {
                        var loadingView = new CommonViews.Loading();

                        Layout.searchResultRegion.show(loadingView);

                        _.each(data, function(value, key){
                            if (value == "") {
                                data[key]=null;
                            }
                        });

                        CSF.request("structure:entities", data).done(function (structures) {
                            var searchResults,
                                hasStructures = structures && structures.length;

                            if (hasStructures) {
                                searchResults = new Views.SearchResult({
                                    collection: structures
                                });

                                searchResults.on("show:sketcher:form", function () {
                                    searchFormView.triggerMethod('show:sketcher:dialog');
                                });
                            } else {
                                searchResults = new Views.emptyResult();
                            }

                            Layout.searchResultRegion.show(searchResults);

                            if (hasStructures) {
                                Layout.searchCollapse();
                            }

                            searchResults.on('save:structure', function(data){
                                var structureData = {
                                    chemical_entity_id : data.structureId,
                                    project_id : data.projectId,
                                    series_id : data.seriesId,
                                    item_type_id : data.structureType
                                };
                                var getStructureEntity =
                                    CSF.request("structure:entity", structureData);
                                getStructureEntity.done(function(structureEntity){
                                    controller.saveStructure(structureEntity);
                                });
                            });

                            window.scrollTo(0,0);
                        });
                    });

                    Layout.on("show", function () {
                        this.searchFormRegion.show(searchFormView);
                    });

                    CSF.mainRegion.show(Layout);

                    controller.showBreadcrumbs('search');
                });
            }
        };
        
        Cocktails.use.mixin(Search.Controller, Cocktails.saveStructureAction, Cocktails.showBreadcrumbsAction);
    });

    return CSF.StructuresApp.Search.Controller;
});
