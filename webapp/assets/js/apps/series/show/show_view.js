define(["app",
        "tpl!apps/series/list/templates/layout.tpl",
        "tpl!apps/series/show/templates/panel.tpl",
        "tpl!apps/series/show/templates/missing.tpl",
        "apps/structure/tags/init_tags_control"],
       function(SeriesManager, layoutTpl, panelTpl, missingSeriesTpl, TagSelect2Form){

    SeriesManager.module("SeriesApp.Show.View", function(View, SeriesManager, Backbone, Marionette, $, _){
        View.MissingSeries = Marionette.ItemView.extend({
            template: missingSeriesTpl,
            events: {
                "click [data-action='createNewStructure']" : "createNewStructure"
            },
            createNewStructure: function (e) {
                e.preventDefault();
                e.stopPropagation();
                this.trigger("structure:new");
            }
        });

        View.Layout = Marionette.LayoutView.extend({
            template: layoutTpl,
            regions: {
                panelRegion: "#panel-region",
                seriesRegion: "#series-region"
            }
        });

        View.Panel = Marionette.ItemView.extend({
            template: panelTpl,
            behaviors: {
                StructuresFilter: {}
            },
            triggers: {
                'click [data-action="new-structure"]': "structure:new",
                'click [data-action="show-series-info"]': "series:info",
                'click [data-action="edit-series"]': "series:edit"
            },
            changeView: function(e){
                e.preventDefault();
                var $target = $(e.currentTarget);
                var value = $target.find('[name="view"]').val();
                this.trigger("view:change", value);
            },
            onRender: function() {
                this.listenTo(this.model, 'change', this.render);
            },
            onShow: function() {
                $('.dropdown-toggle').dropdown();
            }
        });
    });

  return SeriesManager.SeriesApp.Show.View;
});
