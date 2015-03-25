define(["app", "localstorage"], function (CSF) {
    CSF.module("Entities", function (Entities, CSF, Backbone, Marionette, $, _) {

        var api_url = CSF.config.API_URL;

        /**
         * Default model for series
         * @constructor
         * @name module:Entities.SeriesModel
         */
        Entities.SeriesModel = Backbone.Model.extend({
            urlRoot: function () {

                var project_id = Marionette.getOption(this, "project_id")
                    || Marionette.getOption(this, "project") && Marionette.getOption(this, "project").project_id;

                return api_url + "resources/projects/" + project_id + "/series/";
            },
            initialize: function (options) {
                if (options) {
                    this.options = options;
                }
            },
            idAttribute: "series_id",
            /**
             * Default series model properties
             * @private
             * @description
             * <pre class="prettyprint"><code style="background-color:#e8e8e8">
             *     More about series model attributes:<span class="str">{@link module:SeriesAttributes}</span>
             *     </code></pre>
             * @property {Object}  defaults
             * @property {Number}  defaults.created_date - default ""
             * @property {Number}  defaults.modified_date - default ""
             * @property {Text}  defaults.created_by - default ""
             * @property {Text}  defaults.modified_by - default ""
             * @property {Text}  defaults.series_name - default ""
             * @property {Object}  defaults.series_status
             * @property {Text}  defaults.series_status.name - default ""
             * @property {Text}  defaults.series_description
             * @property {Text}  defaults.number_of_frontrunners - default "!no number_of_frontrunners!"
             * @property {Number}  defaults.number_of_compounds - default 0
             * @property {Number}  defaults.number_of_scaffolds - default 0
             * @name module:Entities.SeriesModel.defaults
             */
            defaults: {
                created_date: "",
                modified_date: "",
                created_by: "",
                modified_by: "",
                series_name: "",
                series_status: {name: "Active"},
                series_description: "",

                number_of_frontrunners: "!no number_of_frontrunners!",
                number_of_compounds: 0,
                number_of_scaffolds: 0
            },
            /**
             * Default schema object for backbone-forms
             * @property {Object}  schema
             * @property {Object}  schema.series_name - Series name input field
             * @property {Text}  schema.series_name.title - Title. Default - "Series name:"
             * @property {Array}  schema.series_name.validators - Validators. Default - {type: "required", message: "This field is required" by default}
             * @property {Object}  schema.series_description - Series description field
             * @property {Object}  schema.series_description.title - Title. Default - "Description"
             * @property {Object}  schema.series_description.type - Input type. Default - "TextArea"
             * @property {Array}  schema.series_description.validators - Validators. Default - {type: "required", message: "This field is required" by default}
             * @name module:Entities.SeriesModel.schema
             */
            schema: {
                series_name: {
                    title: "Series name:",
                    validators: [
                        {type: "required", message: "This field is required"}
                    ]
                },
                series_description: {
                    title: "Description:",
                    type: "TextArea"
                }
            },

            //  computed properties
            bindComputedNumbers: function (structures) {
                var callback = function (model, structure, shiftNumber) {
                    var typeId = structure.get('item_type_id');
                    var numberOf = {
                        compounds: model.get('number_of_compounds'),
                        scaffolds: model.get('number_of_scaffolds')
                    };

                    if (typeId === 'compound') {
                        model.set('number_of_compounds', numberOf.compounds + shiftNumber);
                    } else if (typeId === 'scaffold') {
                        model.set('number_of_scaffolds', numberOf.scaffolds + shiftNumber);
                    }
                };

                this.listenTo(structures, 'add', function (structure, structures, events) {
                    callback(this, structure, +1);
                });
                this.listenTo(structures, 'remove', function (structure, structures, events) {
                    callback(this, structure, -1);
                });
            }
        });

        /**
         * Series collection with model {@link module:Entities.SeriesModel}
         * @constructor
         * @extends Backbone.Collection
         * @name module:Entities.SeriesCollection
         */
        Entities.SeriesCollection = Backbone.Collection.extend({
            url: function () {
                return api_url + "resources/projects/" + Marionette.getOption(this, "project_id") + "/series/";
            },
            initialize: function (model, options) {
                if (options) {
                    this.options = options;
                }
            },
            model: Entities.SeriesModel

        });

        /** @namespace API(series)
         * @private
         */
        var API = {
            /**
             * Get series collection for project
             * @memberof API(series)#
             * @listens series:entities
             * @param {Number} projectId - Project Id
             */
            getSeriesEntities: function (projectId) {
                var series = new Entities.SeriesCollection([], {
                    project_id: projectId
                });

                var defer = $.Deferred();
                series.fetch({
                    success: function (data) {
                        defer.resolve(data);
                    },
                    error: function (data) {
                        defer.resolve(void 0);
                    }
                });

                return defer.promise();
            },

            /**
             * Get entities for series with known seriesId
             * @memberof API(series)#
             * @listens series:entity
             * @param {Number} projectId - Project Id
             * @param {Number} seriesId - Series Id
             */
            getSeriesEntity: function (projectId, seriesId) {
                var series = new Entities.SeriesModel({
                    project_id: projectId,
                    series_id: seriesId
                });

                var defer = $.Deferred();
                series.fetch({
                    success: function (data) {
                        defer.resolve(data);
                    },
                    error: function (data) {
                        defer.resolve(void 0);
                    }
                });

                return defer.promise();
            }
        };

        /**
         * Get series collection for project
         * @event series:entities
         * @param {Number} projectId - Project Id
         * @return <a href="module-Entities.SeriesCollection.html">Series collection</a>
         */
        CSF.reqres.setHandler("series:entities", function (projectId) {
            return API.getSeriesEntities(projectId);
        });

        /**
         * Get entities for series with known seriesId
         * @event series:entity
         * @param {Number} projectId - Project Id
         * @param {Number} seriesId - Series Id
         * @return <a href="module-Entities.SeriesModel.html">Series model</a>
         */
        CSF.reqres.setHandler("series:entity", function (projectId, seriesId) {
            return API.getSeriesEntity(projectId, seriesId);
        });

        CSF.reqres.setHandler("series:entity:new", function (projectId) {
            return new Entities.SeriesModel({
                project_id: projectId
            });
        });
    });

});
