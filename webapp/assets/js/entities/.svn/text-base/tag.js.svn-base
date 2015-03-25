define([
    'app',
    'config/storage/localstorage'
], function (CSF) {
    CSF.module('Entities', function (Entities, CSF, Backbone, Marionette, $, _) {

        var api_url = CSF.config.API_URL;

        /**
         * Tag model
         * @class Entities.TagsModel
         * @description
         * <pre class="prettyprint"><code style="background-color:#e8e8e8">
         *     More about tags model attributes:<span class="str">{@link module:TagAttributes}</span>
         *     </code></pre>
         * @constructor
         * @name module:Entities.TagsModel
         */
        Entities.TagsModel = Backbone.Model.extend({
            initialize: function (options) {
                if (options) {
                    this.options = options;
                }
            },
            idAttribute: 'tag_def_id',

            /**
             * Default tag model properties
             * @property {object}  defaults
             * @property {Text} defaults.category - default ""
             * @property {Text} defaults.color - default ""
             * @property {Text} defaults.created_date - default ""
             * @property {Boolean} defaults.deleted - default false
             * @property {Boolean} defaults.is_status_tag - default false
             * @property {Text} defaults.long_name - default ""
             * @property {Text} defaults.modified_date - default ""
             * @property {Text} defaults.name - default ""
             * @property {Text} defaults.short_name - default ""
             * @property {Number} defaults.tag_def_id - default null
             * @property {Number} defaults.weight - default null
             * @name module:Entities.TagsModel.defaults
             */
            defaults: {
                category: '',
                color: '',
                created_date: '',
                deleted: false,
                is_status_tag: false,
                long_name: '',
                modified_date: '',
                name: '',
                short_name: '',
                tag_def_id: null,
                weight: null
            }
        });

        /**
         * Tags collection with model {@link module:Entities.TagsModel}
         * @class Entities.TagsCollection
         * @constructor
         * @name module:Entities.TagsCollection
         */
        Entities.TagsCollection = Backbone.Collection.extend({
            url: function () {
                Marionette.getOption(this, "projectId")
                return api_url + 'resources/projects/' + Marionette.getOption(this, "projectId")
                    + '/series/' + Marionette.getOption(this, "seriesId") + '/scaffolds/'
                    + Marionette.getOption(this, "chemical_entity_id") + '/tags';
            },
            initialize: function (model, options) {
                if (options) {
                    this.options = options;
                }
            },
            model: Entities.TagsModel
        });

        /**
         * Tags definitions collection with model {@link module:Entities.TagsModel}
         * @constructor
         * @name module:Entities.TagsDefinitionsCollection
         */
        Entities.TagsDefinitionsCollection = Backbone.Collection.extend({
            url: function () {
                return api_url + 'actions/tag_definitions';
            },
            initialize: function (model, options) {
                if (options) {
                    this.options = options;
                }
            },
            model: Entities.TagsModel
        });

        /** @namespace API(tags)
         */
        var API = {
            /**
             * Get tags collection for structure
             * @memberof API(tags)#
             * @listens tags:entities
             * @param {Number} projectId - Project Id
             * @param {Number} seriesId - Series Id
             * @param {Number} structureId - Structure Id
             */
            getTagsEntities: function (projectId, seriesId, structureId) {
                var source = new Entities.TagsCollection([], {
                    projectId: projectId,
                    seriesId: seriesId,
                    chemical_entity_id: structureId
                });

                var defer = $.Deferred();
                source.fetch({
                    success: function (data) {
                        defer.resolve(data);
                    }
                });
                return defer.promise();
            },
            /**
             * Get tags definitions
             * @memberof API(tags)#
             * @listens tags:definitions:entities
             */
            getTagsDefinitions: function () {
                var tags = new Entities.TagsDefinitionsCollection();

                var defer = $.Deferred();
                tags.fetch({
                    success: function (data) {
                        defer.resolve(data);
                    }
                });
                return defer.promise();
            }
        };

        /**
         * Get tags collection for structure with known chemical_entity_id
         *
         * @event tags:entities
         * @property {Number} projectId - Structure project Id
         * @property {Number} seriesId - Structure series Id
         * @property {Number} structureId - Structure chemical_entity_id
         * @return <a href="module-Entities.TagsCollection.html">Tags collection</a>
         */
        CSF.reqres.setHandler('tags:entities', function (projectId, seriesId, structureId) {
            return API.getTagsEntities(projectId, seriesId, structureId);
        });

        /**
         * Get pre-defined tags definitions
         *
         * @event tags:definitions:entities
         * @return <a href="module-Entities.TagsDefinitionsCollection.html">Tags definitions collection</a>
         */
        CSF.reqres.setHandler('tags:definitions:entities', function () {
            return API.getTagsDefinitions();
        });

    });

});
