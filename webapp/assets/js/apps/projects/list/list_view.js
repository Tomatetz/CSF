define(["app",
    "tpl!apps/projects/list/templates/layout.tpl",
    "tpl!apps/projects/list/templates/panel.tpl"],
    function (CSF,
              layoutTpl,
              panelTpl) {

        CSF.module("ProjectsApp.List.View", function (View, CSF, Backbone, Marionette, $, _) {

            View.Layout = Marionette.LayoutView.extend({
                template: layoutTpl,

                regions: {
                    panelRegion: "#panel-region",
                    projectsRegion: "#projects-region"
                }
            });

            View.Panel = Marionette.ItemView.extend({
                template: panelTpl,
                triggers: {
                    'click [data-action="new-project"]': "project:new"
                },
                events: {
                    "click .js-filter-user": "filterProjectsByUser"
                },
                ui: {
                    criterion: "input.js-filter-criterion"
                },

                filterProjectsByUser: function (e) {
                    e.preventDefault();
                    var $target = $(e.currentTarget);
                    var user = $target.attr("data-value");
                    this.trigger("projects:filter:user", user);
                }
            });
        });

        return CSF.ProjectsApp.List.View;
    });
