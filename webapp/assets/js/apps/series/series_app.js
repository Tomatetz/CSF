define(["app"], function (CSF) {
    CSF.module("SeriesApp", function (SeriesApp, CSF, Backbone, Marionette, $, _) {
        SeriesApp.startWithParent = false;

        SeriesApp.onStart = function () {

        };

        SeriesApp.onStop = function () {

        };
    });

    CSF.module("Routers.SeriesApp", function (SeriesAppRouter, CSF, Backbone, Marionette, $, _) {
        SeriesAppRouter.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "projects/:project_id/series/:series_id": "showSeries"
            }
        });

        var API = {
            showSeries: function (project_id, series_id) {
                require(["apps/series/show/show_controller"], function (ShowController) {
                    CSF.startSubApp("SeriesApp");
                    ShowController.showSeries(project_id, series_id);
                });
            }
        };

        CSF.on("series:show", function (model) {
            CSF.navigate("projects/"+model.get("project").project_id+"/series/"+model.get("series").series_id);
            API.showSeries(model.get("project").project_id, model.id);
        });

        CSF.addInitializer(function () {
            new SeriesAppRouter.Router({
                controller: API
            });
        });
    });

    return CSF.SeriesAppRouter;
});
