define(["app", "config/storage/localstorage"], function (CSF) {
    CSF.module("Entities", function (Entities, CSF, Backbone, Marionette, $, _) {

        var api_url = CSF.config.API_URL,
            urlHook = function (params) {
                return api_url + "resources/projects/" + params.project_id + "/series/" + params.series_id + "/" + params.item_type_id + "s/" + params.chemical_entity_id + "/notes/";
            };

        /**
         * Note item for structure details page notes region
         * @description
         * <pre class="prettyprint"><code style="background-color:#e8e8e8">
         *     More about notes model attributes:<span class="str">{@link module:NotesAttributes}</span>
         *     </code></pre>
         * @constructor
         * @name module:Entities.NoteModel
         */
        Entities.NoteModel = Backbone.Model.extend({
            urlRoot: function () {
                return urlHook(this.options);
            },
            initialize: function (attrs, options) {
                this.options = options;
                if (this.collection) {
                    this.options = (this.collection.options);
                }
            },
            idAttribute: "note_id",
            /**
             * Default note model properties
             * @property {object}  defaults
             * @property {Number}  defaults.chemical_entity_id - default null
             * @property {Text}  defaults.note_text - default null
             * @property {Text}  defaults.created_date - default null
             * @property {Object}  defaults.created_by
             * @property {Number}  defaults.created_by.id - default null
             * @property {Text}  defaults.created_by.name - default null
             * @property {Object}  defaults.modified_by
             * @property {Number}  defaults.modified_by.id - default null
             * @property {Text}  defaults.modified_by.name - default null
             * @property {Text}  defaults.modified_date - default null
             * @property {Boolean}  defaults.deleted - default false
             * @name module:Entities.NoteModel.defaults
             */
            defaults: {
                chemical_entity_id: null,
                note_text: null,
                created_date: null,
                created_by: {
                    id: null,
                    name: null
                },
                modified_date: null,
                modified_by: {
                    id: null,
                    name: null
                },
                deleted: false
            }
        });

        /**
         * Notes collection with model {@link module:Entities.NoteModel} for structure details page links region
         * @constructor
         * @name module:Entities.NoteCollection
         */
        Entities.NoteCollection = Backbone.Collection.extend({
            url: function () {
                return urlHook(this.options);
            },
            initialize: function (model, options) {
                if (options) {
                    this.options = options;
                }
            },
            model: Entities.NoteModel
        });

        /** @namespace API(notes)
         * @private
         */
        var API = {
            /**
             * @memberof API(notes)#
             * @listens notes:entities
             * @param {Number} projectId - Project Id
             * @param {Number} seriesId - Series Id
             * @param {Text} structureType - compound/scaffold
             * @param {Number} structureId - Structure Id
             */
            getNotesEntities: function (projectId, seriesId, structureType, structureId) {
                var notes = new Entities.NoteCollection([],{
                        project_id: projectId,
                        series_id: seriesId,
                        chemical_entity_id: structureId,
                        item_type_id: structureType
                    });

                var defer = $.Deferred();
                notes.fetch({
                    success: function (collection) {
                        defer.resolve(collection);
                    }
                });
                return defer.promise();
            },
            /**
             * @memberof API(notes)#
             * @listens note:entity
             * @param {Number} projectId - Project Id
             * @param {Number} seriesId - Series Id
             * @param {Text} structureType - compound/scaffold
             * @param {Number} structureId - Structure Id
             * @param {Number} note_id - Note Id
             */
            getNoteEntity: function (projectId, seriesId, structureType, structureId, noteId) {
                var note = new Entities.NoteModel({
                        project_id: projectId,
                        series_id: seriesId,
                        chemical_entity_id: structureId,
                        item_type_id: structureType,
                        note_id: noteId
                    });

                var defer = $.Deferred();
                note.fetch({
                    success: function (model) {
                        defer.resolve(model);
                    },
                    error: function (model) {
                        defer.resolve(void 0);
                    }
                });
                return defer.promise();
            }
        };

        /**
         * Get entity for note with noteId
         *
         * @event note:entity
         * @property {Number} projectId - Structure project Id
         * @property {Number} seriesId - Structure series Id
         * @property {Text} structureType - Structure type(compound/scaffold)
         * @property {Number} structureId - Structure chemical_entity_id
         * @property {Number} noteId - Note Id
         * @return <a href="module-Entities.NoteModel.html">Note model</a>
         */
        CSF.reqres.setHandler("note:entity", function (projectId, seriesId, structureType, structureId, noteId) {
            return API.getNoteEntity(projectId, seriesId, structureType, structureId, noteId);
        });

        /**
         * Get all notes for structure
         *
         * @event notes:entities
         * @property {Number} projectId - Structure project Id
         * @property {Number} seriesId - Structure series Id
         * @property {Text} structureType - Structure type(compound/scaffold)
         * @property {Number} structureId - Structure chemical_entity_id
         * @return <a href="module-Entities.NoteCollection.html">Notes collection</a>
         */
        CSF.reqres.setHandler("notes:entities", function (projectId, seriesId, structureType, structureId) {
            return API.getNotesEntities(projectId, seriesId, structureType, structureId);
        });

        CSF.reqres.setHandler("note:entity:new", function (projectId, seriesId, structureType, structureId) {
            return new Entities.NoteModel({}, {
                project_id: projectId,
                series_id: seriesId,
                chemical_entity_id: structureId,
                item_type_id: structureType
            });
        });
    });

});
