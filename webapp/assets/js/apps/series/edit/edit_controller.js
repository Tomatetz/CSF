define(["app", "apps/series/edit/edit_view"], function (CSF, View) {
    CSF.module("SeriesApp.Edit", function (Edit, CSF, Backbone, Marionette, $, _) {
        Edit.Controller = {
            editProject: function (id) {
                require(["common/views", "entities/project"], function (CommonViews) {
                    var loadingView = new CommonViews.Loading();
                    CSF.mainRegion.show(loadingView);

                    var fetchingSeries = CSF.request("series:entity", id);
                    $.when(fetchingSeries).done(function (series) {
                        var view;
                        if (series !== undefined) {
                            view = new View.Series({
                                model: series
                            });

                            view.on("form:submit", function (data) {
                                series.save(data, {
                                    success: function() {
                                        CSF.trigger("series:show", series.get('id'));
                                    },
                                    error: function(){

                                    }
                                });
                            });
                        }
                        else {
                            view = new CSF.SeriesApp.Show.MissingProject();
                        }

                        CSF.mainRegion.show(view);
                    });
                });
            }
        };
    });

    return CSF.SeriesApp.Edit.Controller;
});
