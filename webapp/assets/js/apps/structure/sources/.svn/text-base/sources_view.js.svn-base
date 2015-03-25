define([
    "app",
    "common/views",
    "apps/structure/common/views",
    "tpl!./templates/source_type_item.tpl",
    "tpl!./templates/source_item.tpl",
    "tpl!apps/structure/common/templates/emptyDialog.tpl",
    "tpl!apps/structure/common/templates/dialog_confirm.tpl",
    "tpl!apps/structure/common/templates/editSourceForm.tpl",
    "backbone-forms-modules"
],
function (CSF, CommonViews, StructureCommonViews, sourceTypeItemTpl, sourceItemTpl, emptyDialogTpl, dialogConfirmTpl, editSourceFormTpl) {
    CSF.module("StructureApp.Sources.Views", function (Views, CSF, Backbone, Marionette, $, _) {

        Views.SourcesPanel = CommonViews.LayoutCollapsePanel.extend({
            events: {
                'click [data-action="add-Sources"]': "addSources"
            },
            regions: {
                sourcesRegion: "#Sources-region"
            },
            behaviors: {
                SetCollapsePanel: {
                    title: "Sources",
                    buttonTitle: "Add sources",
                    triggerToAddItem: 'sources:add'
                }
            },
            initialize: function () {
                this.editable = Marionette.getOption(this, "editable");
            }
        });

        Views.SourceItem = Marionette.ItemView.extend({
            template: sourceItemTpl,
            className: "source-item",
            events: {
                "click [data-action='edit-source']": "editSource"
            },
            editSource: function () {
                this.trigger("source:edit", this.model);
            }
        });

        Views.SourceCompositeView = Marionette.CompositeView.extend({
            className: "panel panel-simple accordeon__source_item",
            template: sourceTypeItemTpl,
            childView: Views.SourceItem,
            childViewContainer: ".panel-body",
            childViewOptions: function () {
                return {
                    collectionLength: this.collection.length
                };
            },
            addChild: function (item, ItemView, index) {
                if (item.get('source_type') === this.model.get('source_type')) {
                    Backbone.Marionette.CollectionView.prototype.addChild.apply(this, arguments);
                }
            },
            initialize: function () {
                this.collection = Marionette.getOption(this, "allSources");
                this.collection.on('all', this.render, this);
            },
            serializeData: function () {
                var data = this.model.toJSON();
                var that = this;

                var length = this.collection.filter(function (item) {
                    return item.get("source_type") === that.model.get('source_type');
                }).length;

                return {
                    viewId: this.cid,
                    length: length,
                    title: data.title
                };
            },
            onRender: function(){
                if(!Marionette.getOption(this, "editable")) {
                    this.$el.find('.glyphicon-pencil').remove();
                }
            }
        });

        Views.SourcesCollection = Marionette.CollectionView.extend({
            className: "accordion",
            childView: Views.SourceCompositeView,
            initialize: function () {
            },
            childViewOptions: function(){
                return {editable: Marionette.getOption(this, "editable")}
            }
        });

        Views.EmptyDialog = Marionette.ItemView.extend({
            template: emptyDialogTpl,
            events: {
                'click button.js-submit': "submitClicked"
            },
            ui: {
                modalBody: ".modal-body"
            },
            subForms: {
                sourceForm: null
            },
            onRender: function(){
                this.$el.find('.modal-title')
                    .html(Marionette.getOption(this, "title"));

                this.$el.find('button.js-submit')
                    .html(Marionette.getOption(this, "buttonTitle"));

                if (Marionette.getOption(this, "dataLoadingText")) {
                    this.$el.find('button.js-submit')
                        .attr('data-loading-text', Marionette.getOption(this, "dataLoadingText"));
                }
            },
            submitClicked: function(event){
                //  common pattern
                var $sourcesList = this.$el.find('[data-element="source-list"]');
                var sourcesData = Backbone.Syphon.serialize($sourcesList[0]);
                var data = _.map(sourcesData, function (value) {
                    return value;
                });

                $(event.currentTarget).button('loading');

                this.trigger("form:submit", data);
            }
        });

        Views.editSourceDialog = Marionette.ItemView.extend({
            template: editSourceFormTpl,
            events: {
                'click .sourceEdit-submit': "submitClicked",
                'click #removeSource': "deleteClicked"
            },
            ui: {
                sourceNote: '#sourceNote'
            },
            onRender: function () {
                this.ui.sourceNote.attr('autofocus', true);
            },
            deleteClicked: function () {
                this.trigger("deleteSource:dialog");
            },
            submitClicked: function (event) {
                var data = this.ui.sourceNote.val();

                $(event.currentTarget).button('loading');

                this.trigger("editSource:submit", data);
            }
        });

        Views.DialogConfirm = Marionette.ItemView.extend({
            template: dialogConfirmTpl,
            events: {
                "click [data-action='submit-delete']": "submitDelete",
                "click [data-action='cancel-delete']": "cancelDelete"
            },
            initialize: function (data) {
                this.title = data.title;
                this.body = data.body;
                this.buttonTitle = "Delete source";
            },
            submitDelete: function (e) {
                this.trigger("delete:submit");
            },
            cancelDelete: function (e) {
                $(".modal-backdrop").remove();
            }
        });

    });

    return CSF.StructureApp.Sources.Views;
});
