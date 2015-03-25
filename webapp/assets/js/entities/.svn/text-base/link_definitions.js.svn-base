define(["app", "config/storage/localstorage"], function (CSF) {
    CSF.module("Entities", function (Entities, CSF, Backbone, Marionette, $, _) {

        var api_url = CSF.config.API_URL;

        /**
         * Link definitions item for structure details page links region
         * @constructor
         * @name module:Entities.LinkDefinitionsModel
         */
        Entities.LinkDefinitionsModel = Backbone.Model.extend({
            urlRoot: function(){
                return api_url + "resources/projects/" + Marionette.getOption(this, "project_id")
                    + "/series/" + Marionette.getOption(this, "series_id")
                    + "/"+Marionette.getOption(this, "item_type_id")+"s/"
                    + Marionette.getOption(this, "chemical_entity_id") + "/link_definitions/";
            },
            initialize: function (attrs, options) {
                this.options = options;
                if (this.collection) {
                    this.options = (this.collection.options);
                }
            },
            idAttribute: "link_id",
            /**
             * Default LinkDefinitionsModel properties
             * @property {object}  defaults
             * @property {Text}  defaults.nameTemplate - Text to display, default ""
             * @property {Text}  defaults.urlTemplate - URL, default ""
             * @name module:Entities.LinkDefinitionsModel.defaults
             */
            defaults: {
                nameTemplate: "",
                urlTemplate: ""
            }
        });


        /**
         * Link definitions collection with model {@link module:Entities.LinkDefinitionsModel} for structure details page links region
         * @constructor
         * @name module:Entities.LinkDefinitionsCollection
         */
        Entities.LinkDefinitionsCollection = Backbone.Collection.extend({
            url: function(){
                return api_url + "resources/projects/" + Marionette.getOption(this, "project_id") +
                    "/series/" + Marionette.getOption(this, "series_id") +
                    "/" + Marionette.getOption(this, "item_type_id") + "s/" +
                    Marionette.getOption(this, "chemical_entity_id") + "/link_definitions/";
            },
            initialize: function (model, options) {
                if (options) {
                    this.options = options;
                }
            },
            model: Entities.LinkDefinitionsModel
            //comparator: "modified_date"
        });

        /** @namespace API(link_definitions)
         * @private
         */
        var API = {
            /**
             * @memberof API(link_definitions)
             * @description
             * Get links definitions collection for known structure
             * @param {Number} projectId - Project Id
             * @param {Number} seriesId - Series Id
             * @param {Text} structureType - compound/scaffold
             * @param {Number} structureId - Structure Id
             * @listens link_definition:entities
             */
            getLinkDefinitionsEntities: function (projectId, seriesId, structureType, structureId) {
                var linkDefinitions = new Entities.LinkDefinitionsCollection([],
                    {
                        project_id: projectId,
                        series_id: seriesId,
                        chemical_entity_id: structureId,
                        item_type_id: structureType
                    });

                var defer = $.Deferred();
                linkDefinitions.fetch({
                    success: function (collection) {
                        defer.resolve(collection);
                    }
                });
                return defer.promise();
            },
            /**
             * @memberof API(link_definitions)
             * @param {Number} projectId - Project Id
             * @param {Number} seriesId - Series Id
             * @param {Text} structureType - compound/scaffold
             * @param {Number} structureId - Structure Id
             * @param {Number} link_id - Link Id
             * @listens link_definition:entity
             */
            getLinkDefinitionsEntity: function (projectId, seriesId, structureType, structureId, linkId) {
                var linkDefinition = new Entities.LinkDefinitionsModel({
                        project_id: projectId,
                        series_id: seriesId,
                        chemical_entity_id: structureId,
                        item_type_id: structureType,
                        link_id: linkId
                    });
                var defer = $.Deferred();
                linkDefinition.fetch({
                    success: function (model) {
                        defer.resolve(model);
                    },
                    error: function (model) {
                        defer.resolve(undefined);
                    }
                });
                return defer.promise();
            }
        };

        /**
         * Get definitions for link with linkId
         * @event link_definition:entity
         * @property {Number} projectId - Structure project Id
         * @property {Number} seriesId - Structure series Id
         * @property {Text} structureType - Structure type(compound/scaffold)
         * @property {Number} structureId - Structure chemical_entity_id
         * @property {Number} linkId - Link Id
         * @return <a href="module-Entities.LinkDefinitionsModel.html">Link definitions model</a>
         */
        CSF.reqres.setHandler("link_definition:entity", function (projectId, seriesId, structureType, structureId, linkId) {
            return API.getLinkDefinitionsEntity(projectId, seriesId, structureType, structureId, linkId);
        });

        /**
         * Get all links definitions for structure
         * @event link_definition:entities
         * @property {Number} projectId - Structure project Id
         * @property {Number} seriesId - Structure series Id
         * @property {Text} structureType - Structure type(compound/scaffold)
         * @property {Number} structureId - Structure chemical_entity_id
         * @return <a href="module-Entities.LinkDefinitionsCollection.html">Links definitions collection</a>
         */
        CSF.reqres.setHandler("link_definition:entities", function (projectId, seriesId, structureType, structureId) {
            return API.getLinkDefinitionsEntities(projectId, seriesId, structureType, structureId);
        });

        CSF.reqres.setHandler("link_definition:entity:new", function (projectId, seriesId, structureType, structureId) {
            return new Entities.LinkDefinitionsModel({}, {
                project_id: projectId,
                series_id: seriesId,
                chemical_entity_id: structureId,
                item_type_id: structureType
            });
        });


    });
    return;
});
