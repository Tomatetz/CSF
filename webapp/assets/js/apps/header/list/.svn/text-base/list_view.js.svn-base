define(["app",
        "tpl!apps/header/list/templates/list.tpl",
        "tpl!apps/header/list/templates/list_item.tpl",
        "tpl!apps/header/list/templates/breadcrumbs.tpl",
        "tpl!apps/header/list/templates/breadcrumbs_item.tpl"],

    function(CSF, listTpl, listItemTpl, breadcrumbsTpl, breadcrumbsItemTpl){

        /**
         * @module HeaderApp.List.View
         * @namespace HeaderApp.List.View
         */
    CSF.module("HeaderApp.List.View", function(View, CSF, Backbone, Marionette, $, _){
        /**
         * @class Header
         * @constructor
         */
        View.Header = Marionette.ItemView.extend({
            template: listItemTpl,
            tagName: "li",
            events: {
                "click a": "navigate"
            },

            navigate: function(e){
                e.preventDefault();
                this.trigger("navigate", this.model);
            },

            onShow: function(){
                if(this.model.selected){
                    this.$el.addClass("active");
                }
            }
        });
        /**
         * @class Headers
         * @constructor
         */
        View.Headers = Marionette.CompositeView.extend({
            template: listTpl,
            tagName: 'nav',
            className: 'menu navbar navbar-nibr',
            childView: View.Header,
            childViewContainer: "ul",

            events: {
                "click a.brand": "brandClicked"
            },

            brandClicked: function(e){
                e.preventDefault();
                this.trigger("brand:clicked");
            }
        });
        /**
         * @class BreadcrumbsItem
         * @constructor
         */
        View.BreadcrumbsItem = Marionette.ItemView.extend({
            template: breadcrumbsItemTpl,
            tagName: "li",
            events: {
                "click [data-action='back']": "goBack"
            },

            goBack: function(e){
                e.preventDefault();
                Backbone.history.history.back();
            },
            onShow: function () {
                var $item = this.$el.find('[data-toggle="breadcrumb-tooltip"]');

                if ($item.width() > 200) {
                    $item.tooltip({html: true});
                }
            }
        });
        /**
         * @class Breadcrumbs
         * @constructor
         */
        View.Breadcrumbs = Marionette.CompositeView.extend({
            template: breadcrumbsTpl,
            tagName: 'ol',
            className: 'breadcrumb',
            triggers: {
                'click .js-search-show': "search:show"
            },
            childView: View.BreadcrumbsItem
        });

    });

    return CSF.HeaderApp.List.View;
});
