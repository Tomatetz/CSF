define([
        "app",
        "common/views",
        "tpl!apps/structure/tags/templates/tag_item.tpl",
        "tpl!apps/structure/common/templates/emptyDialog.tpl"
    ],
    function (CSF, CommonViews, tagItemTpl, emptyDialogTpl) {
        CSF.module("StructureApp.Tags.Views", function (Views, CSF, Backbone, Marionette, $, _) {

            Views.TagsPanel = CommonViews.LayoutCollapsePanel.extend({
                regions: {
                    tagsRegion: "#Tags-region"
                },
                behaviors: {
                    SetCollapsePanel: {
                        title: "Tags",
                        buttonTitle: "Add tags",
                        triggerToAddItem: 'tags:add'
                    }
                },
                initialize: function () {
                    this.editable = Marionette.getOption(this, "editable");
                }
            });

            Views.Tag = Marionette.ItemView.extend({
                tagName: "span",
                template: tagItemTpl
            });

            Views.Tags = Marionette.CollectionView.extend({
                childView: Views.Tag,
                initialize: function () {
                    var $addTag = $('[data-action="add-Tags"]');

                    //  todo - move into template
                    if (this.collection.length) {
                        $addTag.html('<span class="glyphicon glyphicon-pencil"></span> Edit tags');
                    } else {
                        $addTag.html('<span class="glyphicon glyphicon-plus font12 colorBlue"></span> Add tags');
                    }
                },
                onRender: function () {
                    this.appendHtml = function (collectionView, childView) {
                        collectionView.$el.prepend(childView.el);
                    };
                }
            });

            Views.EmptyDialog = Marionette.ItemView.extend({
                template: emptyDialogTpl,
                className: "tags-modal",
                events: {
                    'click button.js-submit': "submitClicked"
                },
                ui: {
                    modalBody: ".modal-body"
                },
                subForms: {
                    tagsForm: null
                },
                onRender: function () {
                    this.$el.find('.modal-title')
                        .html(Marionette.getOption(this, "title"));
                    this.$el.find('button.js-submit')
                        .html(Marionette.getOption(this, "buttonTitle"));

                    if (Marionette.getOption(this, "dataLoadingText")) {
                        this.$el.find('button.js-submit')
                            .attr('data-loading-text', Marionette.getOption(this, "dataLoadingText"));
                    }
                },
                submitClicked: function () {
                    var data = this.$el.find('[data-element="tag-specific"]').select2('data');

                    this.$el.find('button.js-submit')
                        .button('loading');

                    this.trigger("addTags:submit", data);
                }
            });

        });

        return CSF.StructureApp.Tags.Views;
    });
