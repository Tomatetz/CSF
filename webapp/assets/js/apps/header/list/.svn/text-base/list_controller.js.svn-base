define([
        "app",
        "apps/header/list/list_view"
    ],
    function (CSF, View) {
        /**
         * @module HeaderApp.List
         * @namespace HeaderApp.List
         */
        CSF.module("HeaderApp.List", function (List, CSF, Backbone, Marionette, $, _) {
            /**
             * @class Controller
             * @constructor
             */
            List.Controller = {
                /**
                 @method showBreadcrumbs
                 @param path{object}
                 */
                showBreadcrumbs: function (path) {
                    //  TODO - use real models not POJOs
                    var Links = path ? new Backbone.Collection([
                        {name: "Back", link: "#", active: false},
                        {name: "Home", link: "/", active: false}
                    ]) : new Backbone.Collection([
                        {name: "Home", link: "/", active: true}
                    ]);

                    if (path) {
                        var active = _.last(path);
                        active.active = true;

                        Links.add(path);
                    }

                    var breadcrumbs = new View.Breadcrumbs({
                        collection: Links
                    });

                    breadcrumbs.on("search:show", function () {
                        CSF.trigger("search:show");
                    });

                    CSF.breadcrumbsRegion.show(breadcrumbs);
                },

                setActiveHeader: function (headerUrl) {
                    var links = CSF.request("header:entities");
                    var activeHeader = links.find(function (item) {
                        return item.get("url") === headerUrl;
                    });

                    activeHeader.select();

                    links.trigger("reset");
                }
            };
        });

        return CSF.HeaderApp.List.Controller;
    });
