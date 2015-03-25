define(["app",
    "tpl!apps/series/list/templates/list.tpl",
    "tpl!apps/series/list/templates/list_item.tpl",
    "tpl!apps/series/list/templates/no_series.tpl",
    "tpl!apps/series/list/templates/panel.tpl"],
    function (CSF, listTpl, listItemTpl, noItemsTpl, panelTpl) {

        CSF.module("SeriesApp.List.View", function (View, CSF, Backbone, Marionette, $, _) {

            var NoSeriesView = Marionette.ItemView.extend({
                template: noItemsTpl,
                events: {
                    "click [data-action='createNewSeries']" : "addNewSeries"
                },
                addNewSeries: function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.trigger("series:new");
                }
            });

            View.SeriesPanel = Marionette.LayoutView.extend({
                template: panelTpl,
                initialize: function () {
                    this.listenTo(this.model, "change", this.render);
                },
                onRender: function(){
                    var titleTooltip = this.$el.find('.series-list-item-ttl > h3');
                    if(titleTooltip.width() < titleTooltip.find('> a').width()) {
                        titleTooltip.tooltip({html:true});
                    } else {
                        titleTooltip.attr('title','');
                    }
                }
            });

            View.SeriesItem = Marionette.LayoutView.extend({
                className: "panel",
                regions: {
                    structuresRegion : '[data-region="structures"]',
                    panelRegion : '[data-region="panel"]'
                },
                tagName: "div",
                template: listItemTpl,
                events: {
                    'click #source-info': "changeSource",
                    'click [data-action="addStructure"]': "addStructureClicked",
                    'click [data-action="edit"]': "editClicked",
                    'click [data-action="delete"]': "deleteClicked"
                },
                flash: function (cssClass) {
                    var $view = this.$el;
                    $view.hide().toggleClass(cssClass).fadeIn(800, function () {
                        setTimeout(function () {
                            $view.toggleClass(cssClass);
                        }, 500);
                    });
                },
                highlightName: function (e) {
                    this.$el.toggleClass("warning");
                },
                editClicked: function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.trigger("series:edit", this.model);
                },
                deleteClicked: function (e) {
                    e.stopPropagation();
                    this.trigger("series:delete", this.model);
                },
                addStructureClicked: function(e){
                    e.preventDefault();
                    this.trigger("series:structure:add", this.model);
                },
                onRender: function () {
                    var panelView = new View.SeriesPanel({
                        model : this.model
                    });
                    this.panelRegion.show(panelView);
                    this.trigger("structures:list", this);
                }
            });

            View.SeriesList = Marionette.CollectionView.extend({
                tagName: "div",
                className: "panel-list",
                emptyView: NoSeriesView,
                childView: View.SeriesItem,

                initialize: function () {
                    this.listenTo(this.collection, "reset", function () {
                        this.appendHtml = function (collectionView, childView, index) {
                            collectionView.$el.prepend(childView.el);
                        };
                    });
                },

                onRender: function () {
                    this.appendHtml = function (collectionView, childView, index) {
                        collectionView.$el.prepend(childView.el);
                    };
                },

                onShow: function(){
                    if(Marionette.getOption(this, "editable")){
                        this.$el.find('[data-action="createNewSeries"]').remove();
                    }
                    this.$el.hide().fadeIn();
                }
            });

        });

        return CSF.SeriesApp.List.View;
    });
