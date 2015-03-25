define([
    "app",
    "config/storage/localstorage"
], function (CSF) {
    CSF.module("Entities", function (Entities, CSF, Backbone, Marionette, $, _) {

        var api_url = CSF.config.API_URL;

        /**
         * Default model for source item
         * @description
         * <pre class="prettyprint"><code style="background-color:#e8e8e8">
         *     More about sources model attributes:<span class="str">{@link module:SourceAttributes}</span>
         *     </code></pre>
         * @constructor
         * @name module:Entities.SourceModel
         */
        Entities.SourceModel = Backbone.Model.extend({
            urlRoot: function () {
                return api_url + "resources/projects/" + Marionette.getOption(this, "project_id") +
                    "/series/" + Marionette.getOption(this, "series_id") + "/scaffolds/" +
                    Marionette.getOption(this, "chemical_entity_id") + "/sources/";
            },
            initialize: function (attrs, options) {
                this.options = options;

                if (this.collection) {
                    this.options = (this.collection.options);
                }

                var links = {
                    'assay': "",
                    'literature': "http://sfx.eu.novartis.net:9004/sfx_local?rft_id=info:doi/" + this.attributes.external_id,
                    'patent': "http://sfx.eu.novartis.net:9004/sfx_local?rft.genre=patent&svc.fulltext=yes&rft.number=" + this.attributes.external_id,
                    'eln concept': "http://celn.nibr.novartis.net/index.html?id=" + this.attributes.external_id,
                    'other': ""
                };
                var title = {
                    'assay': 'Assay',
                    'literature': 'Literature',
                    'patent': 'Patent',
                    'eln concept': 'eLN',
                    'other': 'Other'
                };

                this.attributes.link = links[this.attributes.source_type];
                this.attributes.title = title[this.attributes.source_type];
                this.attributes.name = (this.attributes.name) ? this.attributes.name : this.attributes.external_id;

            },
            idAttribute: "source_id",
            /**
             * Default source model properties
             * @property {object}  defaults
             * @property {Number}  defaults.chemical_entity_id
             * @property {Object}  defaults.created_by
             * @property {Number}  defaults.created_by.id
             * @property {Text}  defaults.created_by.name
             * @property {Text}  defaults.created_date
             * @property {Boolean}  defaults.deleted
             * @property {Boolean}  defaults.editable
             * @property {Text}  defaults.external_id
             * @property {Text}  defaults.name
             * @property {Object}  defaults.modified_by
             * @property {Number}  defaults.modified_by.id
             * @property {Text}  defaults.modified_by.name
             * @property {Text}  defaults.modified_date
             * @property {Number}  defaults.source_id
             * @property {Text}  defaults.source_type
             * @property {Text}  defaults.type - "source" as default
             * @name module:Entities.SourceModel.defaults
             */
            defaults: {
                chemical_entity_id: "",
                created_by: {
                    id: "",
                    name: ""
                },
                created_date: "",
                deleted: false,
                editable: false,
                external_id: "",
                modified_by: {
                    id: "",
                    name: ""
                },
                modified_date: "",
                source_type: "",

                comment: "",
                link: "",
                title: ""
            }
        });

        /**
         * Sources collection with model {@link module:Entities.SourceModel}
         * @constructor
         * @name module:Entities.SourceCollection
         */
        Entities.SourceCollection = Backbone.Collection.extend({
            url: function () {
                return api_url + "resources/projects/" + Marionette.getOption(this, "project_id") +
                    "/series/" + Marionette.getOption(this, "series_id") + "/scaffolds/" +
                    Marionette.getOption(this, "chemical_entity_id") + "/sources/";
            },
            initialize: function (model, options) {
                if (options) {
                    this.options = options;
                }
            },
            model: Entities.SourceModel,
            comparator: "name"
        });

        /**
         * Sources search result default model
         * @constructor
         * @name module:Entities.SearchSourceModel
         */
        Entities.SearchSourceModel = Backbone.Model.extend({
            initialize: function () {
                var regexp = /http:\/\/dx.doi.org\//gi;

                if (this.get('doi')) {
                    this.set('id', this.get('doi').replace(regexp, ""));
                    this.set('text', this.get('fullCitation') + " (" + this.get('id') + ")");
                } else {
                    this.set('id', this.get('Id'));
                    this.set('text', this.get('DisplayName') + " (" + this.get('id') + ")");
                }
            },
            defaults: {
                external_id: null,
                name: "",
                coins: "",
                fullCitation: "",
                id: null,
                normalizedScore: null,
                score: null,
                text: "",
                title: "",
                year: null
            }
        });

        /**
         * Sources literature search result collection with model {@link module:Entities.SearchSourceModel}
         * @constructor
         * @name module:Entities.LiteratureCollection
         */
        Entities.LiteratureCollection = Backbone.Collection.extend({
            url: function () {
                return CSF.config.SOURCE_LITERATURE_SEARCH_URL + "?q=" + Marionette.getOption(this, "query")
                    + "&page=0&rows=100" + Marionette.getOption(this, "yearQuery");
            },
            initialize: function (model, options) {
                if (options) {
                    this.options = options;
                }
            },
            sync : function(method, collection, options) {
                options.crossDomain ={
                    crossDomain: true
                };
                return Backbone.sync(method, collection, options);
            },
            model: Entities.SearchSourceModel
        });

        /**
         * Sources assay search result collection with model {@link module:Entities.SearchSourceModel}
         * @constructor
         * @name module:Entities.AssayCollection
         */
        Entities.AssayCollection = Backbone.Collection.extend({
            url: function () {
                return CSF.config.SOURCE_ASSAY_SEARCH_URL + "?text=" + Marionette.getOption(this, "query");
            },
            initialize: function (model, options) {
                if (options) {
                    this.options = options;
                }
            },
            sync : function(method, collection, options) {
                options.xhrFields = {
                    withCredentials: true
                };
                return Backbone.sync(method, collection, options);
            },
            parse: function (response) {
                return response.Results;
            },
            model: Entities.SearchSourceModel
        });

        /** @namespace API(sources)
         * @private
         */
        var API = {
            lastDeferred: {
                literature: null,
                assay: null
            },
            /**
             * Get literature collection list, by query and/or year
             * @memberof API(sources)
             * @listens literature:entities
             * @param {Text} query - DOI, author, article title, journal title
             * @param {Number} yearQuery - Year
             */
            getLiteratureCollectionEntities: function (query, yearQuery) {
                var source = new Entities.LiteratureCollection([], {
                    query: query,
                    yearQuery: yearQuery
                });
                var defer = this.lastDeferred.literature = $.Deferred();

                source.fetch({
                    success: function (data) {
                        defer.resolve(data);
                    }
                });

                return defer.promise();
            },
            /**
             * Get assay collection list, by query
             * @memberof API(sources)
             * @listens assay:entities
             * @param {Text} query - assay, project
             */
            getAssayCollectionEntities: function (query) {
                var source = new Entities.AssayCollection([], {
                    query: query
                });
                var defer = this.lastDeferred.assay = $.Deferred();

                source.fetch({
                    success: function (data) {
                        defer.resolve(data);
                    }
                });

                return defer.promise();
            },
            /**
             * Get sources collection for structure
             * @memberof API(sources)
             * @listens source:entities
             * @param {Number} projectId - Project Id
             * @param {Number} seriesId - Series Id
             * @param {Number} structureId - Structure Id
             */
            getSourceEntities: function (projectId, seriesId, structureId) {
                var source = new Entities.SourceCollection([], {
                    project_id: projectId,
                    series_id: seriesId,
                    chemical_entity_id: structureId
                });
                var defer = $.Deferred();

                source.fetch({
                    success: function (data) {
                        defer.resolve(data);
                    }
                });

                return defer.promise();
            }
        };

        /**
         * Get sources collection for structure
         *
         * @event source:entities
         * @property {Number} chemical_entity_id - Structure Id
         * @property {Number} project_id - Structure project Id
         * @property {Number} series_id - Structure series Id
         * @return <a href="module-Entities.SourceCollection.html">Source collection</a>
         */
        CSF.reqres.setHandler("source:entities", function (projectId, seriesId, structureId) {
            return API.getSourceEntities(projectId, seriesId, structureId);
        });

        CSF.reqres.setHandler("source:entity:new", function (projectId, seriesId, structureId) {
            return new Entities.SourceModel({}, {
                project_id: projectId,
                series_id: seriesId,
                chemical_entity_id: structureId
            });
        });

        /**
         * Get literature collection list, by query and/or year
         *
         * @event literature:entities
         * @param {Text} query - DOI, author, article title, journal title
         * @param {Number} yearQuery - Year
         * @return <a href="module-Entities.LiteratureCollection.html">Literature collection</a>
         */
        CSF.reqres.setHandler("literature:entities", function (query, year) {
            var yearQuery = (year && year.length === 4) ? "&year=" + year : "";

            return API.getLiteratureCollectionEntities(query, yearQuery);
        });
        /**
         * Get assay collection list, by query and/or year
         *
         * @event assay:entities
         * @param {Text} query - assay, project
         * @return <a href="module-Entities.AssayCollection.html">Assay collection</a>
         */
        CSF.reqres.setHandler("assay:entities", function (query) {
            return API.getAssayCollectionEntities(query);
        });

        CSF.reqres.setHandler("sources:reject:deferred", function (name) {
            var item = API.lastDeferred.hasOwnProperty(name) && API.lastDeferred[name];

            if (item) {
                item.reject();
            }
        });
    });

});
