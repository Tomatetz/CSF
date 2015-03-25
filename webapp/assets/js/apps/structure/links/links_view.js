define([
    "app",
    "common/views",
    "tpl!./templates/link.tpl",
    "tpl!./templates/link_form.tpl",
    "backbone-forms-modules"
],
function (CSF, CommonViews, linkTpl, linkFormTpl) {
    CSF.module("StructureApp.Links.Views", function (Views, CSF, Backbone, Marionette, $, _) {

        Views.Link = Marionette.ItemView.extend({
            template: linkTpl,
            className: "link-item",
            behaviors: {
                UseEditableControls: {
                    triggerDelete: 'link:delete',
                    triggerEdit: 'link:edit'
                }
            }
        });

        Views.Links = Marionette.CollectionView.extend({
            /** @class Links
             * @augments Marionette.CollectionView
             * @contructs Links object */

             childView: Views.Link
        });

        Views.LinksPanelLayout = CommonViews.LayoutCollapsePanel.extend({
            regions:{
                collectionViewContainer: '#Links-region'
            },
            behaviors: {
                SetCollapsePanel: {
                    title: "Links",
                    buttonTitle: "Add link",
                    triggerToAddItem: 'link:add'
                }
            },
            initialize: function () {
                this.editable = Marionette.getOption(this, "editable")
            }
        });

        Views.LinkForm = Marionette.ItemView.extend({
            template: linkFormTpl,
            //  todo - delegate to..
            events: {
                'click [data-action="submit-save"]': "saveItem",
                'click .js-delete': "deleteItem"
            },

            initialize: function (data) {
                this.title = data.title;
                this.buttonTitle = data.buttonTitle;
            },
            onRender: function (data) {
                var btnDeleteLink = this.$el.find('.js-delete'),
                    title = data && data.title;

                (title === "Edit link") ? btnDeleteLink.show() : btnDeleteLink.hide();

                this.$el.find('button.js-submit')
                    .html(this.buttonTitle);

                if (Marionette.getOption(this, "dataLoadingText")) {
                    this.$el.find('button.js-submit')
                        .attr('data-loading-text', Marionette.getOption(this, "dataLoadingText"));
                }
            },
            saveItem: function () {
                var url = this.$el.find('[name="urlTemplate"]').val(),
                    name = this.$el.find('[name="nameTemplate"]').val();

                //  todo - ask for - add tooltip and watcher to disable button if save is invalid..
                if (url !== "" && name !== "") {
                    //  first form only?
                    var data = Backbone.Syphon.serialize(this.$el.find('form')[0]);

                    this.$el.find('button.js-submit').button('loading');
                    this.trigger("form:submit", data);
                }
            },
            deleteItem: function () {
                var view = this;

                CSF.dialogRegion.closeDialog();

                require([
                    "vendor/bootbox.min"
                ], function (bootbox) {
                    bootbox.dialog({
                        message: "Are you sure you want to delete this link?",
                        title: "Delete link",
                        buttons: {
                            Yes: {
                                callback: function() {
                                    view.trigger("link:delete");
                                    return true;
                                }
                            },
                            No: {
                                className: "btn-default",
                                callback: function() {
                                    return true;
                                }
                            }
                        }
                    });
                });

            }
        });

    });

    return CSF.StructureApp.Links.Views;
});
