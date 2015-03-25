define([
    "app",
    "apps/structure/notes/notes_view",
    "common/views",
    "entities/note"
], function (CSF, View, CommonViews) {

    CSF.module("StructuresApp.Notes", function (Notes, CSF, Backbone, Marionette, $, _) {

        Notes.Controller = {
            showNotesAction: function (region, structure) {
                var controller = this;

                var projectId = structure.get('project').project_id,
                    seriesId = structure.get('series').series_id,
                    structureTypeId = structure.get('item_type_id'),
                    structureId = structure.get('chemical_entity_id');

                var loadingEmptyView = new CommonViews.LoadingCollapsePanel({
                    title: "Notes"
                });

                region.show(loadingEmptyView);

                CSF.request("notes:entities", projectId, seriesId, structureTypeId, structureId).done(function (notes) {
                    var structureNotesView = new View.NotesPanelLayout({
                        collection: notes,
                        editable: structure.get('editable')
                    });

                    region.show(structureNotesView);

                    structureNotesView
                        .on("note:add", function () {
                            controller.addNoteAction(notes, structure);
                        });

                    var NotesCollectionView = new View.Notes({
                        collection: notes
                    }).on("childview:note:edit", function (view, note) {
                            controller.editNoteAction(notes, note, structure);
                        });

                    structureNotesView.collectionViewContainer.show(NotesCollectionView);
                });
            },

            addNoteAction: function (notes, structure) {
                var projectId = structure.get('project').project_id,
                    seriesId = structure.get('series').series_id,
                    structureTypeId = structure.get('item_type_id'),
                    structureId = structure.get('chemical_entity_id');

                var newNote = CSF.request("note:entity:new", projectId, seriesId, structureTypeId, structureId);

                var newNoteView = new View.NoteForm({
                    model: newNote,
                    dataLoadingText: 'Adding...'
                })
                    .on("form:submit", function (data) {
                        newNote.set("note_text", data.text);
                        newNote.save()
                            .done(function () {
                                //todo: upgrade marionette JS lib, and all others
                                notes.add(newNote, {at: 0});
                                newNoteView.trigger("dialog:close");
                            })
                            .fail(function () {
                                notes.trigger("reset");
                            });
                    });

                CSF.dialogRegion.show(newNoteView);
            },

            editNoteAction: function (notes, note, structure) {
                var editNoteView = new View.NoteForm({
                    model: note,
                    title: "Edit note",
                    buttonTitle: "Save updates"
                });

                editNoteView
                    .on("note:delete", function () {
                        notes.remove(note);
                        note.destroy();

                        this.trigger("dialog:close");
                    })
                    .on("form:submit", function (data) {
                        note.set("note_text", data.text);
                        note.save()
                            .done(function () {
                                editNoteView.trigger("dialog:close");

                                notes.fetch()
                                    .done(function () {
                                        notes.trigger("reset");
                                    });
                            })
                            .fail(function () {
                                notes.trigger("reset");
                            });
                    });

                CSF.dialogRegion.show(editNoteView);
            }
        };
    });

    return CSF.StructuresApp.Notes.Controller;
});