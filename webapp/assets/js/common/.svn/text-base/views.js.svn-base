define([
    "app",
    "tpl!common/templates/loading.tpl",
    "tpl!common/templates/form.tpl",
    "tpl!common/templates/collapse-panel.tpl",
    "tpl!common/templates/loading_collapse-panel.tpl",
    "spin.jquery"
], function (CSF, loadingTpl, commonFormTpl, collapsePanelTpl, loadingCollapsePanelTpl) {

    CSF.module("Common.Views", function (Views, CSF, Backbone, Marionette, $, _) {

        var initSerializeWrapper = function (view, template, params, methods) {
            return view.extend(_.extend(methods, {
                template: template,
                serializeData: function () {
                    var opts = {},
                        self = this;

                    _.each(params, function (item) {
                        var name = item.name;

                        if (!item.skip) {
                            opts[name] = self[name];
                        }
                    });

                    return opts;
                }
            }));
        };

        Views.Loading = initSerializeWrapper(Marionette.ItemView,
            loadingTpl,
            [
                {
                    name: "title",
                    defaults: "Loading Data"
                },
                {
                    name: "message",
                    defaults: "Please wait, data is loading."
                }
            ], {
                onShow: function () {
                    $("#spinner").spin('serializeWrapper');
                }
            });

        Views.LoadingCollapsePanel = (function () {
            var useMethods = {
                onShow: function () {
                    this.$el.find(".title")
                        .html(this.options.title);

                    var node = this.$el.find(".spinner");
                    node.spin('loading').append("Loading...");
                }
            };

            return initSerializeWrapper(Marionette.LayoutView,
                loadingCollapsePanelTpl,
                [
                    {
                        name: "title",
                        defaults: "Items"
                    }
                ], useMethods);
        }());

        Views.LayoutCollapsePanel = (function () {
            var useMethods = {
                onShow: function () {
                    var addBtn = this.$el.find("h4 > .icon-link");
                    var panelTitle = this.$el.find('[data-element="collapse-panel-title"]');

                    this.hideCollapseBtn(panelTitle);
                    //if (this.collection) {
                    this.listenTo(this.collection, "all", function () {
                        this.hideCollapseBtn(panelTitle);
                    });
                    //}
                    if (this.editable) {
                        addBtn.show();
                    } else {
                        addBtn.hide();
                    }
                },
                hideCollapseBtn: function (title) {
                    //if (!this.collection || this.collection.length === 0) {
                    if (this.collection.length === 0) {
                        title.removeClass("collapse-btn").find("> .fa").hide();
                    } else {
                        title.addClass("collapse-btn").find("> .fa").show();
                    }
                }
            };

            return initSerializeWrapper(Marionette.LayoutView,
                collapsePanelTpl,
                [
                    {
                        name: "title",
                        defaults: "Items"
                    },
                    {
                        name: "buttonTitle",
                        defaults: "Add"
                    },
                    {
                        name: "editable",
                        defaults: false,
                        skip: true
                    }
                ], useMethods);
        }());
    });

    return CSF.Common.Views;
});
