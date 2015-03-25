define(["app", "apps/series/common/views"], function (CSF, CommonViews) {
    CSF.module("SeriesApp.Edit.View", function (View, CSF, Backbone, Marionette, $, _) {
        View.Series = CommonViews.Form.extend({
            initialize: function () {
                this.title = "Edit " + this.model.get("series_name");
                this.buttonTitle = "Update series";
            }
        });
    });

    return CSF.SeriesApp.Edit.View;
});
