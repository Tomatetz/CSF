define([
        "app",
        "apps/structure/tags/init_tags_control",
        "tpl!./templates/tag_form.tpl",
        "tpl!./templates/tag.tpl",
        "backbone-forms-modules",
        "entities/tag",
        "marvin.util"
    ],
    function (CSF, TagSelect2Form, tagFormTpl, tag) {

        /**
         * @module StructureApp.Common.Views
         * @namespace StructureApp.Common.Views
         */
        CSF.module("StructureApp.Common.Views", function (Views, CSF, Backbone, Marionette, $, _) {
            /**
             * Setting tags view in {{#crossLink "StructureApp.Common.Views.Form"}}form{{/crossLink}}
             * @class TagFormItem
             * @constructor
             * @extends Marionette.ItemView
             */
            Views.TagFormItem = Marionette.ItemView.extend({
                template: tag,
                ui: {
                    tagList: '[data-element="tag-list"]',
                    showTagButton: '[data-action="showTag"]',
                    tagReasonSelect: '[data-element="tag-specific"]'
                },
                events: {
                    'click [data-action="showTag"]': "showTag"
                },
                showTag: function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    this.hideForm();
                    this.ui.tagReasonSelect.val('');
                },
                hideForm: function () {
                    this.$el.find('[data-element="tag-form"]').slideDown();
                    this.$el.find('[data-action="showTag"]').hide();
                },
                //  initialize tag form
                onRender: function () {
                    //  controller get model
                    CSF.request("tags:definitions:entities").done(_.bind(function (data) {
                        var tags;
                        var tagsCollection;

                        if (this.model.get('isNew')) {
                            this.hideForm();

                            _.each(data.models, function (item) {
                                if (item.get('long_name') === "Starting Point") {
                                    tagsCollection = new CSF.Entities.TagsCollection(item);
                                }
                            });
                        } else {
                            tags = _.pluck(this.model.get('tags'), 'tag_definition');
                            tagsCollection = new CSF.Entities.TagsCollection(tags);
                        }

                        //  controller action
                        TagSelect2Form.initTag(this, data.models, tagsCollection);
                    }, this));
                }
            });
        });

        return CSF.StructureApp.Common.Views;
    });
