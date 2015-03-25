define([
        "app",
        "apps/header/list/list_controller"
    ],
    function (CSF, ListController) {
            /**
             * @module HeaderApp
             */
        CSF.module("HeaderApp", function (Header, CSF, Backbone, Marionette, $, _) {

            CSF.commands.setHandler("set:active:header", function (name) {
                ListController.setActiveHeader(name);
            });

            CSF.commands.setHandler("show:breadcrumbs", function (path) {
                ListController.showBreadcrumbs(path);
            });
        });

        return CSF.HeaderApp;
});
