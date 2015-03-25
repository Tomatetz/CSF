define([
    "app",
    "components/cocktailsMixin",
    "apps/series/show/show_view",
    "apps/structure/tags/tags_filter",
    "apps/structure/list/list_view",

    "common/views",
    "apps/projects/common/views",
    "apps/series/common/views",
    "apps/structure/common/views",
    "tpl!apps/series/common/templates/dialog_info.tpl",
    "tpl!apps/structure/tags/templates/structures_filtering_results.tpl",
    "entities/series",
    "entities/structure",
    "entities/project",
    "entities/tag"
], function (CSF, Cocktails,
             View, tagsFilter,
             StructureListView,
             CommonViews, ProjectsCommonViews, SeriesCommonViews, StructureCommonViews,
             dialogInfoTpl, filteredLengthTpl) {

    CSF.module("SeriesApp.Show", function (Show, CSF, Backbone, Marionette, $, _) {

        var panelSeriesEditCallback = function (series, model) {
            var view = new SeriesCommonViews.Form({
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

                        CSF.execute("show:breadcrumbs", [
                            {
                                name: series.get("project").project_name,
                                link: "#projects/" + series.get("project").project_id,
                                active: false
                            },
                            {
                                name: series.get("series_name"),
                                link: "#projects/" + series.get("project").project_id + "/series/" + series.id,
                                active: false
                            }
                        ]);

                        view.trigger("dialog:close");
                    }
                });
            });

            view.on("series:delete", function (model) {
                var view = new ProjectsCommonViews.DialogConfirm({
                    model: model,
                    redirect: true,
                    type: 'deleteSeries'
                });

                CSF.dialogRegion.show(view);
            });

            CSF.dialogRegion.show(view);
        };



        Show.Controller = {
            showSeries: function (projectId, seriesId) {
                var controller = this;
                var addStructure = function (structures) {
                    controller.addStructure(projectId, seriesId, structures);
                };

                var loadingView = new CommonViews.Loading();
                var Layout = new View.Layout();

                CSF.mainRegion.show(loadingView);

                var fetch = {
                    series: CSF.request("series:entity", projectId, seriesId),
                    structures: CSF.request("structure:entities", {
                        project_id: projectId,
                        series_id: seriesId,
                        sort: 'modified_date desc'
                    })
                };
                $.when(fetch.series, fetch.structures).done(function (series, structures) {

                    var showStructuresList = function (layout, ListView) {
                        layout.seriesRegion.show(ListView);

                        ListView.on("childview:structure:delete", function (childView, model) {
                            var view = new ProjectsCommonViews.DialogConfirm({
                                model: model,
                                title: "Delete structure",
                                body: "Are you sure you want to delete structure '" + model.get("displayed_name") + "' ?"
                            });

                            CSF.dialogRegion.show(view);
                        });

                        ListView.on("childview:structure:export", function (childView) {
                            Show.Controller.saveStructure(childView.model);
                        });

                        ListView.on("structure:add", addNewStructure);

                    };

                    var addNewStructure = function () {
                        addStructure(structures);
                    };
                    var structuresListView;

                    if (series !== void 0) {
                        var Panel = new View.Panel({
                            model: series
                        });

                        structuresListView = new StructureListView.SeriesList({
                            collection: structures
                        });

                        Panel.on("structure:new", addNewStructure);

                        Panel.on("series:info", function () {
                            series.fetch().done(function () {
                                var view = new ProjectsCommonViews.DialogInfo({
                                    model: series,
                                    template: dialogInfoTpl
                                });

                                CSF.dialogRegion.show(view);

                                view.$el.find('[data-dismiss="modal"]').focus();
                                view.$el.find('.person-preview')
                                    .previewCard();
                            });
                        });

                        Panel.on("series:edit", function (data) {
                            panelSeriesEditCallback(series, data.model);
                        });
                    } else {
                        Panel = new Backbone.View();

                        structuresListView = new View.MissingSeries();
                    }

                    //  todo - refactor
                    Panel.on("structures:showFiltered", function (serializedData) {
                        var serializedCollection = tagsFilter.applyFilters(structures, serializedData);

                        var view = new StructureListView.SeriesList({
                            collection: serializedCollection ? serializedCollection : structures
                        });

                        if (Panel.$el.find('#filter-menu .glyphicon-filter').hasClass('filtered')) {

                            Panel.$el.find('.panel__filter').parent().append(filteredLengthTpl({
                                serializedCollection : serializedCollection.length,
                                seriesName: null
                            }));
                            view.emptyView = false;
                        }

                        showStructuresList(Layout, view);
                    });

                    Layout.on("show", function () {
                        this.panelRegion.show(Panel);

                        showStructuresList(this, structuresListView);
                    });

                    CSF.mainRegion.show(Layout);

                    controller.showBreadcrumbs('series', series.get("project"), series.attributes);
                });
            }
        };

        Cocktails.use.mixin(Show.Controller, Cocktails.addStructureAction, Cocktails.saveStructureAction, Cocktails.showBreadcrumbsAction);
    });

    return CSF.SeriesApp.Show.Controller;
});
