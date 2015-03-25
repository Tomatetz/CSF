define(["app"], function (CSF) {
    /**
     * @module ProjectsApp
     */
    CSF.module("ProjectsApp", function (ProjectsApp, CSF, Backbone, Marionette, $, _) {
        ProjectsApp.startWithParent = false;
        ProjectsApp.onStart = function () {
        };
        ProjectsApp.onStop = function () {
        };
    });
    /**
     * @module Routers.ProjectsApp
     * @namespace Routers.ProjectsApp
     */
    CSF.module("Routers.ProjectsApp", function (ProjectsAppRouter, CSF, Backbone, Marionette, $, _) {
        /**
         * @class Router
         * @extends Marionette.AppRouter
         * @namespace ProjectsAppRouter
         */
        ProjectsAppRouter.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "projects(/filter/criterion::criterion)": "listProjects",
                "projects/:id": "showProject",
                "projects/:id/edit": "editProject"
            }
        });

        var executeAction = function (controller, action, params) {
            CSF.startSubApp("ProjectsApp");

            controller[ action ](params);
        };

        var API = {
            listProjects: function (criterion) {
                require(["apps/projects/list/list_controller"], function (ListController) {
                    executeAction(ListController, "listProjects", criterion);
                });
            },

            showProject: function (id) {
                require(["apps/projects/show/show_controller"], function (ShowController) {
                    executeAction(ShowController, "showProject", id);
                });
            },

            editProject: function (id) {
                require(["apps/projects/edit/edit_controller"], function (EditController) {
                    executeAction(EditController, "editProject", id);
                });
            }
        };

        CSF.on("projects:list", function () {
            CSF.navigate("projects");
            API.listProjects();
        });

        CSF.on("project:show", function (id) {
            CSF.navigate("projects/" + id);
            API.showProject(id);
        });

        CSF.on("project:edit", function (id) {
            CSF.navigate("projects/" + id + "/edit");
            API.editProject(id);
        });

        CSF.addInitializer(function () {
            new ProjectsAppRouter.Router({
                controller: API
            });
        });
    });

    return CSF.ProjectsAppRouter;
});
