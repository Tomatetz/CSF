define([
        "marionette","app",
        "apps/structure/tags/init_tags_control"
    ],
    function (Marionette, CSF, TagSelect2Form) {

        Marionette.Behaviors.behaviorsLookup = function () {
            return window.Behaviors;
        };

        var Behaviors = window.Behaviors = window.Behaviors || {};

        //  TODO - add hasEditableControls option
        Behaviors.UseEditableControls = Backbone.Marionette.Behavior.extend({
            defaults: {
                triggerDelete: 'item:delete',
                triggerEdit: 'item:edit'
            },
            ui: {
                editButton: '.js-edit',
                deleteButton: '.js-delete'
            },
            events: {
                "click @ui.editButton": "editItem",
                "click @ui.deleteButton": "deleteItem"
            },
            onRender:function(){
                if (!this.view.options.model.get('editable')) {
                    this.view.$el.find('.glyphicon-pencil').remove();
                }
            },
            editItem: function () {
                this.view.trigger(this.options.triggerEdit, this.view.model);
            },
            deleteItem: function () {
                this.view.trigger(this.options.triggerDelete, this.view.model);
            }
        });

        Behaviors.SetCollapsePanel = Backbone.Marionette.Behavior.extend({
            defaults: {
                title: "",
                buttonTitle: "",
                triggerToAddItem: ''
            },
            ui: {
                addButton: '.details-add-button'
            },
            events: {
                "click @ui.addButton": "addItem"
            },

            initialize: function (options) {
                this.view.title = options.title;
                this.view.buttonTitle = options.buttonTitle;
            },
            onRender: function () {
                if (this.view.options.editable) {
                    this.view.$el.find('.glyphicon-pencil').remove();
                }
            },
            addItem: function (e) {
                e.stopPropagation();
                e.preventDefault();

                this.view.trigger(this.options.triggerToAddItem, this.view.collection);
            }
        });

        //  TODO - for today impl. bound to structures and external dependencies
        Behaviors.StructuresFilter = Backbone.Marionette.Behavior.extend({
            ui: {
                filterMenu: '#filter-menu',
                clearForm: '.js-clear',
                applyFilters: '.js-apply',
                setType: 'label.btn-sm'
            },
            /*triggers: {},*/
            events: {
                "click @ui.filterMenu": "addFiltersForm",
                "click @ui.clearForm": "clearForm",
                "click @ui.applyFilters": "applyFilters",
                "click @ui.setType": "setType"
            },
            clearForm: function(e){
                e.stopPropagation();
                e.preventDefault();

                var form = $(e.currentTarget).closest("form");

                TagSelect2Form.clearForm(form);

                this.view.$el.find(".glyphicon-filter").removeClass('filtered');
                this.view.$el.find('[data-element="type"] label').removeClass('active');
                this.view.$el.find('[data-element="type"] input[value="All"]').parent().addClass('active');

                this.view.trigger("structures:showFiltered", {
                    type:'All', specific_tags:[], tag_names:[], tag_categories:[]
                });
                this.view.$el.find('.filtered-structures-length').remove();
                this.view.$el.find('.dropdown-menu').hide();
            },
            applyFilters: function(e){
                e.stopPropagation();
                e.preventDefault();
                this.view.$el.find('.dropdown-menu').hide();
                TagSelect2Form.applyData(this.view);
            },
            setType: function(e){
                e.stopPropagation();
                e.preventDefault();
                this.view.$el.find('[data-element="type"] label').removeClass('active');
                $(e.target).addClass('active');
            },
            addFiltersForm: function (e) {
                e.preventDefault();
                this.view.$el.find('.dropdown-menu').toggle();
                CSF.request("tags:definitions:entities").done(_.bind(function (tags) {
                    TagSelect2Form.initTags(this.view, tags.models);
                }, this));
            }
        });

        return Behaviors;
    });