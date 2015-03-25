define(["app", "config/storage/localstorage"], function (CSF) {
    CSF.module("Entities", function (Entities, CSF, Backbone, Marionette, $, _) {

        var api_url = CSF.config.API_URL;

        /**
         * Link item for structure details page links region
         * @description
         * <pre class="prettyprint"><code style="background-color:#e8e8e8">
         *     More about link model attributes:<span class="str">{@link module:LinksAttributes}</span>
         *     </code></pre>
         * @constructor
         * @name module:Entities.LinkModel
         */
        Entities.LinkModel = Backbone.Model.extend({
            urlRoot: function(){
                return api_url + "resources/projects/" + this.options.project_id + "/series/" + this.options.series_id + "/"+this.options.item_type_id+"s/" + this.options.chemical_entity_id + "/links/"
            },
            initialize: function (attrs, options) {
                this.options = options;
                if (this.collection) {
                    this.options = (this.collection.options);
                }
            },
            idAttribute: "link_id",
            /**
             * Default link model properties
             * @property {object}  defaults
             * @property {Number}  defaults.link_id - default null
             * @property {Text}  defaults.name - default null
             * @property {Boolean}  defaults.editable - default null
             * @property {Text}  defaults.url - default ""
             * @property {Text}  defaults.validityScope - default ""
             * @property {Number}  defaults.weight - default null
             * @name module:Entities.LinkModel.defaults
             */
            defaults: {
                link_id: null,
                name: null,
                editable: true,
                url: "",
                validityScope: "",
                weight: null
            }
        });

        /**
         * Links collection with model {@link module:Entities.LinkModel} for structure details page links region
         * @constructor
         * @name module:Entities.LinkCollection
         */
        Entities.LinkCollection = Backbone.Collection.extend({
            url: function(){
                return api_url + "resources/projects/" + Marionette.getOption(this, "project_id") +
                    "/series/" + Marionette.getOption(this, "series_id") +
                    "/" + Marionette.getOption(this, "item_type_id") + "s/" +
                    Marionette.getOption(this, "chemical_entity_id") + "/links/"
            },
            initialize: function (model, options) {
                if (options) {
                    this.options = options;
                }
            },
            model: Entities.LinkModel
            //comparator: "modified_date"
        });

        /** @namespace API(links)
         * @private
         */
        var API = {
            /**
             * @memberof API(links)#
             * @description
             * Get links collection for known structure
             *
             * @param {Number} projectId - Project Id
             * @param {Number} seriesId - Series Id
             * @param {Text} structureType - compound/scaffold
             * @param {Number} structureId - Structure Id
             * @listens link:entities
             */
            getLinkEntities: function (projectId, seriesId, structureType, structureId) {
                var links = new Entities.LinkCollection([],
                    {
                        project_id: projectId,
                        series_id: seriesId,
                        chemical_entity_id: structureId,
                        item_type_id: structureType
                    });

                var defer = $.Deferred();
                links.fetch({
                    success: function (collection) {
                        defer.resolve(collection);
                    }
                });
                return defer.promise();
            },
            /**
             * @memberof API(links)#
             * @listens link:entity
             * @param {Number} projectId - Project Id
             * @param {Number} seriesId - Series Id
             * @param {Text} structureType - compound/scaffold
             * @param {Number} structureId - Structure Id
             * @param {Number} link_id - Link Id
             */
            getLinkEntity: function (projectId, seriesId, structureType, structureId, linkId) {
                var link = new Entities.LinkModel({
                        project_id: projectId,
                        series_id: seriesId,
                        chemical_entity_id: structureId,
                        item_type_id: structureType,
                        link_id: linkId
                    });
                var defer = $.Deferred();
                link.fetch({
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
         * Get entity for link with linkId
         *
         * @event link:entity
         * @property {Number} projectId - Structure project Id
         * @property {Number} seriesId - Structure series Id
         * @property {Text} structureType - Structure type(compound/scaffold)
         * @property {Number} structureId - Structure chemical_entity_id
         * @property {Number} linkId - Link Id
         * @return <a href="module-Entities.LinkModel.html">Link model</a>
         */
        CSF.reqres.setHandler("link:entity", function (projectId, seriesId, structureType, structureId, linkId) {
            return API.getLinkEntity(projectId, seriesId, structureType, structureId, linkId);
        });

        /**
         * Get all links for structure
         *
         * @event link:entities
         * @property {Number} projectId - Structure project Id
         * @property {Number} seriesId - Structure series Id
         * @property {Text} structureType - Structure type(compound/scaffold)
         * @property {Number} structureId - Structure chemical_entity_id
         * @return <a href="module-Entities.LinkCollection.html">Links collection</a>
         */
        CSF.reqres.setHandler("link:entities", function (projectId, seriesId, structureType, structureId) {
            return API.getLinkEntities(projectId, seriesId, structureType, structureId);
        });

        CSF.reqres.setHandler("link:entity:new", function (projectId, seriesId, structureType, structureId) {
            return new Entities.LinkModel({}, {
                project_id: projectId,
                series_id: seriesId,
                chemical_entity_id: structureId,
                item_type_id: structureType
            });
        });


    });
    return;
});
