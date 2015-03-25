define(["app"], function (CSF) {

    CSF.module("StructureApp", function (StructureApp, CSF, Backbone, Marionette, $, _) {
        StructureApp.startWithParent = false;

        StructureApp.onStart = function () {

        };

        StructureApp.onStop = function () {

        };
    });

    CSF.module("Routers.StructureApp", function (StructureAppRouter, CSF, Backbone, Marionette, $, _) {
        StructureAppRouter.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "projects/:project_id/series/:series_id/:structure_type/:structure_id": "showStructure",
                "search": "showSearch"
            }
        });

        var executeAction = function (controller, action, arg) {
            action.call(controller, arg);
        };

        var API = {
            showStructure: function (project_id, series_id, structure_type, structure_id) {
                require(["apps/structure/show/show_controller"], function (ShowController) {
                    structure_type = structure_type.slice(0,-1);

                    CSF.startSubApp("StructureApp");
                    ShowController.showStructure(project_id, series_id, structure_type, structure_id );
                });
            },
            showSearch: function () {
                require(["apps/structure/search/search_controller"], function (ShowController) {
                    CSF.startSubApp("StructureApp");
                    ShowController.showSearch();
                    CSF.execute("show:breadcrumbs");
                });
            }
        };

        CSF.on("structure:show", function (model) {
            CSF.navigate("projects/"+model.get("project_id")+"/series/"+model.get("series_id")+"/"+model.get("item_type_id")+"s/"+model.get("id"));
            API.showStructure(model.get("project_id"), model.get("series_id"), model.get("item_type_id"), model.get("id"));
        });

        CSF.on("search:show", function () {
            CSF.navigate("search");
            API.showSearch();
        });

        CSF.commands.setHandler("show:notes", function (region, structure) {
            require(["apps/structure/notes/notes_controller"], function (NotesController) {
                 NotesController.showNotesAction(region, structure);
            });
        });

        CSF.commands.setHandler("show:links", function (region, structure) {
            require(["apps/structure/links/links_controller"], function (LinksController) {
                LinksController.showLinksAction(region, structure);
            });
        });

        CSF.commands.setHandler("show:relationships", function (region, structure) {
            require(["apps/structure/relationships/relationships_controller"], function (RelationshipsController) {
                RelationshipsController.showRelationshipsAction(region, structure);
            });
        });

        CSF.commands.setHandler("show:sources", function (region, structure) {
            require(["apps/structure/sources/sources_controller"], function (SourcesController) {
                SourcesController.showSourcesAction(region, structure);
            });
        });

        CSF.commands.setHandler("show:tags", function (region, structure) {
            require(["apps/structure/tags/tags_controller"], function (TagsController) {
                TagsController.showTagsAction(region, structure);
            });
        });

        CSF.addInitializer(function () {
            new StructureAppRouter.Router({
                controller: API
            });
        });
    });

    return CSF.StructureAppRouter;
});
