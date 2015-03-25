define(["app", "apps/structure/common/views"], function (CSF, CommonViews) {
    CSF.module("StructureApp.Confirm.View", function (View, CSF, Backbone, Marionette, $, _) {
        View.Source = CommonViews.DialogConfirm.extend({});
    });
    return CSF.StructureApp.Confirm.View;
});
