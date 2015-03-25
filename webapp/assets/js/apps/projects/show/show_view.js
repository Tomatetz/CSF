define(["app",
    "tpl!apps/projects/list/templates/layout.tpl",
    "tpl!apps/projects/show/templates/panel.tpl",
    "tpl!apps/projects/show/templates/missing.tpl",
    "tpl!apps/structure/tags/templates/filter_panel.tpl",
    "apps/structure/tags/init_tags_control"],
    function (CSF, layoutTpl, panelTpl, missingTpl, filterPanelTpl, TagSelect2Form) {
        /**
         * @module ProjectsApp.Show.View
         * @namespace ProjectsApp.Show.View
         */
        CSF.module("ProjectsApp.Show.View", function (View, CSF, Backbone, Marionette, $, _) {
            /**
             * @class MissingProject
             * @constructor
             * @extends Marionette.ItemView
             */
            View.MissingProject = Marionette.ItemView.extend({
                template: missingTpl
            });
            /**
             * @class Layout
             * @constructor
             * @extends Marionette.LayoutView
             */
            View.Layout = Marionette.LayoutView.extend({
                template: layoutTpl,

                regions: {
                    panelRegion: "#panel-region",
                    projectsRegion: "#projects-region"
                }
            });
            /**
             * @class Panel
             * @constructor
             * @extends Marionette.ItemView
             */
            View.Panel = Marionette.ItemView.extend({
                template: panelTpl,

                behaviors: {
                    StructuresFilter: {}
                },
                triggers: {
                    'click [data-action="new-series"]': "series:new",
                    "click [data-action='show-project-info']": "project:info",
                    'click [data-action="edit-project"]': "project:edit"
                },
                events: {
                    "click .js-set-filter": "filterProjectsByActive"
                },
                ui: {
                    criterion: "input.js-filter-criterion"
                },
                onRender: function() {
                    this.listenTo(this.model, 'change', this.render);
                },
                onShow: function(){
                    this.$el.find('.btn-group.space-l')
                        .append(filterPanelTpl)
                        .tooltip({
                            html: true
                        });
                }
            });
        });

        return CSF.ProjectsApp.Show.View;
    });
