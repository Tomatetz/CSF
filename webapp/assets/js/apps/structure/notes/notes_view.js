define([
        "app",
        "common/views",
        "tpl!apps/structure/notes/templates/note.tpl",
        "tpl!apps/structure/notes/templates/note_form.tpl",
        "backbone-forms-modules"
    ],
    function (CSF, CommonViews, noteTpl, noteFormTpl) {
        CSF.module("StructureApp.Notes.Views", function (Views, CSF, Backbone, Marionette, $, _) {

            Views.Note = Marionette.ItemView.extend({
                template: noteTpl,
                behaviors: {
                    UseEditableControls: {
                        triggerDelete: 'note:delete',
                        triggerEdit: 'note:edit'
                    }
                },
                onShow: function () {
                    this.$el.find('.person-preview').previewCard();
                }
            });

            Views.Notes = Marionette.CollectionView.extend({
                childView: Views.Note
            });

            Views.NotesPanelLayout = CommonViews.LayoutCollapsePanel.extend({
                regions: {
                    collectionViewContainer: '#Notes-region'
                },
                behaviors: {
                    SetCollapsePanel: {
                        title: "Notes",
                        buttonTitle: "Add note",
                        triggerToAddItem: 'note:add'
                    }
                },
                initialize: function () {
                    this.editable = Marionette.getOption(this, "editable");
                }
            });

            Views.NoteForm = Marionette.ItemView.extend({
                template: noteFormTpl,
                ui: {
                    submitButton: 'button.js-submit',
                    deleteButton: '.js-delete',
                    note: '[name="note"]'
                },
                events: {
                    'click [data-action="submit-save"]': "saveNote",
                    'keyup [name="note"]': "validateNote",
                    'click .js-delete': "deleteNote"
                },
                initialize: function (data) {
                    this.title = data.title;
                    this.buttonTitle = data.buttonTitle;
                },
                onRender: function (data) {
                    var btnDeleteNote = this.ui.deleteButton,
                        title = data && data.title;

                    (title === "Edit note") ? btnDeleteNote.show() : btnDeleteNote.hide();

                    this.ui.submitButton.html(this.buttonTitle);

                    if (Marionette.getOption(this, "dataLoadingText")) {
                        this.ui.submitButton
                            .attr('data-loading-text',Marionette.getOption(this, "dataLoadingText"));
                    }
                },
                saveNote: function (event) {
                    var note = this.ui.note.val();

                    if (note !== "") {
                        $(event.currentTarget).button('loading');

                        this.trigger("form:submit", {
                            //  TODO - only to get note text?
                            text: Backbone.Syphon.serialize(this).note
                        });
                    }
                },
                deleteNote: function () {
                    var view = this;
                    CSF.dialogRegion.closeDialog();

                    require(["vendor/bootbox.min"], function (bootbox) {
                        bootbox.dialog({
                            message: "Are you sure you want to delete this note?",
                            title: "Delete note",
                            buttons: {
                                Yes: {
                                    callback: function () {
                                        view.trigger("note:delete");
                                        return true;
                                    }
                                },
                                No: {
                                    className: "btn-default",
                                    callback: function () {
                                        return true;
                                    }
                                }
                            }
                        });
                    });
                }
            });

        });

        return CSF.StructureApp.Notes.Views;
    });
