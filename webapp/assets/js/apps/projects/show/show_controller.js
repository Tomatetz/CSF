define([
    "app",
    "components/cocktailsMixin",

    "apps/projects/show/show_view",

    "apps/projects/common/views",
    "apps/series/list/list_view",
    "apps/structure/list/list_view",

    "apps/structure/common/views",
    "apps/structure/tags/tags_filter",
    "tpl!apps/structure/tags/templates/structures_filtering_results.tpl"
], function (CSF, Cocktails,
             View,
             ProjectsCommonView, SeriesListView, StructureListView,
             StructureCommonView, tagsFilter, filteredLengthTpl) {

    CSF.module("ProjectsApp.Show", function (Show, CSF, Backbone, Marionette, $, _) {

        var showStructuresList = function (layout, structureList, filtered, data) {

            layout.structuresRegion.show(structureList);

            if(structureList.collection.length === 0 && filtered){
                layout.$el.hide();
            } else {
                layout.$el.show();
            }

            structureList.on("childview:structure:delete", function (childView, model) {
                var name = model.get("displayed_name"),
                    msg = {
                        title: "Delete structure",
                        body: "Are you sure you want to delete structure '" + name + "' ?"
                    };

                var view = new ProjectsCommonView.DialogConfirm({
                    model: model,
                    title: msg.title,
                    body: msg.body
                });

                CSF.dialogRegion.show(view);
            });

            structureList.on("structure:add", function () {
                Show.Controller.addStructure(data.projectId, data.seriesId, structureList.collection);
            });

            structureList.on("childview:structure:export", function (childView) {
                Show.Controller.saveStructure(childView.model);
            });
        };

        Show.Controller = {
            deleteSeriesDialogInit: function(model){
                var view = new ProjectsCommonView.DialogConfirm({
                    model: model,
                    type: 'deleteSeries'
                });

                CSF.dialogRegion.show(view);
            },
            showProject: function (projectId) {
                var controller = this;

                //  TODO - search for all "common/views" required cases - is it possible to move them into require_main
                require([
                    "common/views",
                    "entities/project",
                    "entities/series",
                    "entities/structure",
                    "entities/source"
                ], function (CommonViews) {
                    var loadingView = new CommonViews.Loading();

                    CSF.mainRegion.show(loadingView);

                    var fetch = {
                        project: CSF.request("project:entity", projectId),
                        series: CSF.request("series:entities", projectId)
                    };

                    $.when(fetch.project, fetch.series).done(function (project, series) {
                        var Layout = new View.Layout();

                        //  todo - needs Dialog component manager attached
                        if (project !== null && series !== null) {
                            var Panel = new View.Panel({
                                model: project
                            });

                            var seriesList = new SeriesListView.SeriesList({
                                collection: series,
                                editable: project.get('editable')
                            });
                            seriesList.on("childview:series:edit", function (childView, model) {
                                require([
                                    "apps/series/common/views"
                                ], function (EditView) {

                                    var view = new EditView.Form({
                                        model: model,
                                        title: "Edit " + model.get("series_name"),
                                        buttonTitle: "Update series",
                                        dataLoadingText: "Updating..."
                                    });

                                    view.on("form:submit", function (data) {
                                        model.save(data, {
                                            wait: true,
                                            success: function () {
                                                series.trigger("reset");

                                                view.trigger("dialog:close");
                                                childView.flash("success");
                                            }
                                        });
                                    });
                                    view.on("series:delete", function (model) {
                                        Show.Controller.deleteSeriesDialogInit(model);
                                    });

                                    CSF.dialogRegion.show(view);
                                });
                            });
                            seriesList.on("childview:series:delete", function (childView, model) {
                                Show.Controller.deleteSeriesDialogInit(model);
                            });

                            seriesList.on("childview:series:new", function () {
                                controller.showSeriesNewDialog(projectId, series, seriesList);
                            });
                            Panel.on("series:new", function () {
                                controller.showSeriesNewDialog(projectId, series, seriesList);
                            });

                            Panel.on("project:info", function () {
                                var view = new ProjectsCommonView.DialogInfo({
                                    model: project
                                });

                                CSF.dialogRegion.show(view);

                                view.$el.find('[data-dismiss="modal"]').focus();
                                view.$el.find('.person-preview')
                                    .previewCard()
                                    .end()
                                    .find(".target")
                                    .tooltip({
                                        html: true
                                    });
                            });

                            Panel.on("project:edit", function () {
                                var view = new ProjectsCommonView.ProjectFormLayout({
                                    model: project,
                                    title: "Edit project - " + project.get("project_name"),
                                    buttonTitle: "Update project",
                                    dataLoadingText: "Updating project..."
                                });

                                view.on("form:submit", function (data) {
                                    project.save(data, {
                                        wait: true,
                                        success: function () {
                                            view.trigger("dialog:close");
                                        }
                                    });
                                });
                                view.on("project:delete", function (model) {
                                    controller.deleteDialogInit(model, '/#projects');
                                });

                                CSF.dialogRegion.show(view);
                            });

                            //  todo - reuse code from series.. "structures:showFiltered"
                            //
                            seriesList.on("childview:structures:list", function (seriesView) {
                                var seriesModel = seriesView.model;
                                var seriesId = seriesModel.id;

                                var loadingView = new CommonViews.Loading();
                                seriesView.structuresRegion.show(loadingView);

                                var fetchingStructures = CSF.request("structure:entities", {
                                    project_id: projectId,
                                    series_id: seriesId,
                                    sort: 'modified_date desc'
                                });

                                var data = {
                                    projectId : projectId,
                                    seriesId : seriesId
                                };

                                $.when(fetchingStructures).done(function (structuresCollection) {
                                    Panel.on("structures:showFiltered", function (serializedData) {

                                        var serializedCollection = tagsFilter.applyFilters(structuresCollection, serializedData);

                                        var structureList = new StructureListView.StructureListSlider({
                                            collection: serializedCollection,
                                            editable: seriesModel.get("editable")
                                        });

                                        if (Panel.$el.find('#filter-menu .glyphicon-filter').hasClass('filtered')) {
                                            if(serializedCollection.length){
                                                Panel.$el.find('.results-container').append(filteredLengthTpl({
                                                    serializedCollection : serializedCollection.length,
                                                    seriesName: serializedCollection.models[0].get('series').series_name
                                                }));
                                            }
                                            Panel.$el.find('.series_name_anchor').on('click', function(){
                                                var name = this.dataset.name;
                                                var offset = Layout.$el.find('[data-series-name="'+ this.dataset.name+'"]').offset().top;
                                                window.scrollTo(0, offset);
                                            });
                                            structureList.emptyView = false;
                                            showStructuresList(seriesView, structureList, 'filtered', data);
                                        } else {
                                            showStructuresList(seriesView, structureList, false, data);
                                        }
                                    });

                                    //  TODO - simply the same as within "structures:showFiltered" - trigger collection
                                    var structureList = new StructureListView.StructureListSlider({
                                        collection: structuresCollection,
                                        editable: seriesModel.get("editable")
                                    });

                                    showStructuresList(seriesView, structureList, false, data);
                                    //  END - of a same

                                    seriesView.on("series:structure:add", function () {
                                        controller.addStructure(projectId, seriesId, structuresCollection, seriesView);
                                    });

                                    seriesModel.bindComputedNumbers(structuresCollection);
                                });
                            });

                        } else {
                            Panel = new Backbone.View();
                            seriesList = new View.MissingProject();
                        }

                        Layout.on("show", function () {
                            this.panelRegion.show(Panel);
                            this.projectsRegion.show(seriesList);
                        });

                        CSF.mainRegion.show(Layout);

                        controller.showBreadcrumbs('project', project.attributes);
                    });
                });
            },

            showSeriesNewDialog: function (projectId, series, seriesList) {
                require([
                    "apps/series/common/views"
                ], function (CommonViews) {
                    var newSeries = CSF.request("series:entity:new", projectId);
                    var view = new CommonViews.Form({
                        model: newSeries
                    });

                    view.on("form:submit", function (data) {
                        newSeries.save(data).done(function () {
                            series.add(newSeries);
                            view.trigger("dialog:close");

                            var newSeriesView = seriesList.children.findByModel(newSeries);
                            if (newSeriesView) {
                                newSeriesView.flash("success");
                            }
                        });
                    });

                    CSF.dialogRegion.show(view);
                });
            },
            deleteDialogInit: function (model) {
                var view = new ProjectsCommonView.DialogConfirm({
                    model: model,
                    type: 'deleteProjects',
                    redirect: true
                });

                CSF.dialogRegion.show(view);
            }
        };

        Cocktails.use.mixin(Show.Controller, Cocktails.addStructureAction, Cocktails.saveStructureAction, Cocktails.showBreadcrumbsAction);
    });

    return CSF.ProjectsApp.Show.Controller;
});
