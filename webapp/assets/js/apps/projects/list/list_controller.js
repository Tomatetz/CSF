define([
    "app",
    "apps/projects/list/list_view",
    "apps/projects/list/list_view_table",
    "apps/structure/list/list_view"
], function (CSF, View, ViewTable) {
    CSF.module("ProjectsApp.List", function (List, CSF, Backbone, Marionette, $, _) {
        List.Controller = {
            listProjects: function () {
                require([
                    "common/views",
                    "apps/structure/search/search_view",
                    "entities/common",
                    "entities/project",
                    "entities/structure"
                ], function (CommonViews) {
                    var loadingView = new CommonViews.Loading();

                    var listLayout = new View.Layout();
                    var listPanel = new View.Panel();

                    CSF.mainRegion.show(loadingView);

                    CSF.request("project:entities").done(function (projects) {
                        if (projects == null) return;

                        var clonedProjects = projects.clone(),
                            ACTIONS_COLUMN_INDEX = 8;

                        var originCollectionProjects = projects.clone();
                        listPanel.on("projects:filter:user", function (user) {
                            switch(user){
                                case 'my':
                                    var items = originCollectionProjects.filter(function(project){
                                        return project.get('editable');
                                    });
                                     projects.reset(items);
                                    break;
                                case 'all':
                                    projects.reset(originCollectionProjects.models);
                                    break;
                            }
                        });

                            listPanel.on("project:new", function () {
                                require(["apps/projects/common/views"], function (Views) {
                                    var newProject = CSF.request("project:entity:new"),
                                        newProjectText = 'Create new project',
                                        newProjectButtonLoadingText = 'Creating new project...';

                                    var view = new Views.ProjectFormLayout({
                                        model: newProject,
                                        title: newProjectText,
                                        buttonTitle: newProjectText,
                                        dataLoadingText: newProjectButtonLoadingText
                                    });

                                    view.on("form:submit", function (data) {
                                        newProject.save(data)
                                            .done(function() {
                                                projects.add(newProject);
                                                clonedProjects = projects.clone();
                                                view.trigger("dialog:close");

                                                CSF.trigger("project:show", newProject.id);
                                            });
                                    });
                                    
                                    CSF.dialogRegion.show(view);
                                });
                            });

                            var gridView = new ViewTable.DataGrid({
                                collection: projects
                            });

                            gridView.on("project:edit", function (model) {
                                var editedProjectName = "Edit project - " + model.get("project_name");
                                var editProjectButtonTitle = "Update project",
                                    editProjectButtonLoadingText = "Updating project...";

                                require(["apps/projects/common/views"], function (Views) {
                                    var view = new Views.ProjectFormLayout({
                                        model: model,
                                        title: editedProjectName,
                                        buttonTitle: editProjectButtonTitle,
                                        dataLoadingText: editProjectButtonLoadingText
                                    });

                                    view.on("project:delete", function (model) {
                                        deleteDialogInit(model)
                                    });
                                    view.on("form:submit", function (data) {
                                        model.save(data, {
                                            wait: true,
                                            success: function() {
                                                view.trigger("dialog:close");
                                                projects.fetch();
                                            }
                                        })
                                    });

                                    CSF.dialogRegion.show(view);
                                });
                            });

                            gridView.on("project:delete", function (model) {
                                deleteDialogInit(model)
                            });
                            function deleteDialogInit(model){
                                require([
                                    "apps/projects/common/views"
                                ], function (DialogConfirm) {
                                    var projectToDeleteName = model.get("project_name"),
                                        projectToDeleteFormTitle = "Delete project",
                                        projectToDeleteFormBody = "Are you sure you want to delete project '"+ projectToDeleteName + "' ?";

                                    var view = new DialogConfirm.DialogConfirm({
                                        model: model,
                                        title: projectToDeleteFormTitle,
                                        body: projectToDeleteFormBody
                                    });

                                    CSF.dialogRegion.show(view);
                                });
                            }

                            listLayout.on("show", function () {
                                this.panelRegion.show(listPanel);
                                this.projectsRegion.show(gridView);
                            });

                        CSF.mainRegion.show(listLayout);

                        CSF.execute("show:breadcrumbs");
                    });
                });
            }
        };
    });

    return CSF.ProjectsApp.List.Controller;
});
