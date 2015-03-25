define(["app"], function (CSF) {
    /**
     * @module Entities
     */
    CSF.module("Entities", function (Entities, CSF) {
        var api_url = CSF.config.API_URL;
        var urlRootHelpers = {
            structure: function (isCompound, ids) {
                var scaffoldSuffix = isCompound ? "compounds" : "scaffolds";

                return api_url + "resources/projects/" + ids.project + "/series/" + ids.series + "/" + scaffoldSuffix +"/";
            },
            searchRelatedStructures: function (id) {
                return api_url + "actions/search/structures/?project_id=" + id + "&rows=1000";
            },
            searchStructures: function () {
                return api_url + "actions/search/structures/" + "?rows=1000";
            },
            structureByNvp: function(nvp){
                return api_url + 'actions/lookup/nvp_structures?values=' + nvp;
            }
        };

        /**
         * Default model for structure
         * @constructor
         * @name module:Entities.StructureModel
         */
        Entities.StructureModel = Backbone.Model.extend({
             /**
             * Returns correct url for compounds or scaffolds
             * @method urlRoot
             * @return url {String}
              * @name module:Entities.StructureModel.urlRoot
             */
            urlRoot: function () {
                var opts = this.options;
                var isCompound = opts.item_type_id === 'compound';

                return urlRootHelpers.structure(isCompound, {
                    project: opts.project_id || opts.project && opts.project.project_id,
                    series: opts.series_id || opts.series && opts.series.series_id
                });
            },
            initialize: function (options) {
                if (options) {
                    this.options = options;
                }
            },
            /**
             * Augements model data with custom attribute 'displayed_name' inferred from nvp and chemical entity name
             * @method parse
             * @param {String} data - Structure model
             * @return {String} data
             * @name module:Entities.StructureModel.parse
             */
            parse: function (data) {
                data.displayed_name = data.nvp || data.chemical_entity_name;

                return data;
            },
            /**
             * Returns base64 structure image
             * @method getStructureImage
             * @param {Object} options - Structure model
             * @return {String} data
             * @name module:Entities.StructureModel.getStructureImage
             */
            getStructureImage: function (options) {
                var params = {
                    imgWidth: options && options.imgWidth || 178,
                    imgHeight: options && options.imgHeight || 130
                };
                var id = this.get('chemical_entity_id') + this.get('nvp') + params.imgWidth + params.imgHeight;

                var defer = $.Deferred();
                var callback = _.bind(function () {
                    this.image = CSF.cache.structure[id];

                    defer.resolve(this.image);
                }, this);

                //  TODO - use cache consistently - remove un-maintainable code duplication - TRACE method calls
                //if (!CSF.cache.structure[id]) {
                    $.ajax({
                        type: "post",
                        url: CSF.config.MOLECULES_RENDER_API_URL,
                        data: {
                            molfile: this.get('structure'),
                            t: true,
                            w: params.imgWidth,
                            h: params.imgHeight
                        }
                    }).done(function (data) {
                        CSF.cache.structure[id] = "data:image/png;base64," + data;
                        callback();
                    });
                /*} else {
                    callback();
                }*/

                return defer.promise();
            },
            idAttribute: "chemical_entity_id",
            /**
             * Default structure model properties
             * @private
             * @description
             * <pre class="prettyprint"><code style="background-color:#e8e8e8">
             *     More about structure model attributes:<span class="str">{@link module:StructureAttributes}</span>
             *     </code></pre>
             * @property {Object}  defaults
             * @property {Number}  defaults.project_id - default ""
             * @property {Number}  defaults.series_id - default ""
             * @property {Boolean}  defaults.editable - default false
             * @property {Number}  defaults.nvp - default null
             * @property {Text}  defaults.item_type_id - default ""
             * @property {Text}  defaults.chemical_entity_name - default ""
             * @property {Text}  defaults.structure - default ""
             * @property {Object}  defaults.project
             * @property {Number}  defaults.project.project_id - default ""
             * @property {Text}  defaults.project.project_name - default ""
             * @property {Text}  defaults.created_date - default ""
             * @property {Object}  defaults.created_by
             * @property {Text}  defaults.created_by.id - default ""
             * @property {Text}  defaults.created_by.name - default ""
             * @property {Text} defaults.modified_by - default ""
             * @property {Boolean}  defaults.deleted - default false
             * @property {Text}  defaults.note - default ""
             * @property {Text}  defaults.displayed_name - default ""
             * @property {Array}  defaults.tags - default ""
             * @name module:Entities.StructureModel.defaults
             */
            defaults: {
                project_id : "",
                series_id : "",
                editable : false,
                nvp : null,
                item_type_id : "",
                chemical_entity_name: "",
                structure: "",
                project: {project_id : ""},
                created_date: "",
                created_by: "",

                modified_date: "",
                modified_by: "",
                deleted: false,

                note: "",
                displayed_name: "",
                tags: ""
            },
            /**
             * Default schema object for backbone-forms
             * @property {Object}  schema
             * @property {Object}  schema.item_type_id - Scaffold/Compound radio buttons field
             * @property {Text}  schema.item_type_id.title - Title. Default - "Structure type:"
             * @property {Text}  schema.item_type_id.editorClass - Field class. Default - "form-control-radio-list"
             * @property {Text}  schema.item_type_id.title - Field type. Default - "Radio"
             * @property {Array}  schema.item_type_id.options - Options (value, label "Scaffolds" checked by default)
             * @property {Array}  schema.item_type_id.validators - Validators. Default - {type: "required", message: "This field is required" by default}
             * @property {Object}  schema.chemical_entity_name - Chemical entity name field
             * @property {Object}  schema.chemical_entity_name.title - Title. Default - "Name:"
             * @property {Object}  schema.chemical_entity_name.fieldClass - Field class. Default - "form-group-sm"
             * @property {Object}  schema.chemical_entity_name.editorClass - Field input class. Default - "input-sm"
             * @property {Array}  schema.chemical_entity_name.validators - Validators. Default - {type: "required", message: "This field is required" by default}
             * @name module:Entities.StructureModel.schema
             */
            schema: {
                item_type_id: {
                    title: "Structure type:",
                    editorClass: 'form-control-radio-list',
                    type: 'Radio',
                    options: [
                        {
                            val: 'scaffold', checked: 'checked', label: 'Scaffold'
                        },
                        {
                            val: 'compound', checked: false, label: 'Compound'
                        }
                    ],
                    validators: [
                        {type: "required", message: "This field is required"}
                    ]
                },
                chemical_entity_name: {
                    title: "Name:",
                    fieldClass: 'form-group-sm',
                    editorClass: 'input-sm',
                    validators: [
                        {type: "required", message: "This field is required"}
                    ]
                }
            }
        });


        /**
         * Structure with nvp code
         * @extends module:Entities.StructureModel
         * @constructor
         * @name module:Entities.NvpStructureModel
         */
        Entities.NvpStructureModel = Entities.StructureModel.extend({
            url: function () {
                return urlRootHelpers.structureByNvp(Marionette.getOption(this, "nvp"));
            },
            initialize: function (options) {
                if(options){
                    this.options = options;
                }
            },
            parse: function (data) {
                return data[0];
            }
        });

        /**
         * Structures with nvp code collection
         * @constructor
         * @extends Backbone.Collection
         * @name module:Entities.NvpStructureCollection
         */
        Entities.NvpStructureCollection = Backbone.Collection.extend({
            url: function () {
                return urlRootHelpers.structureByNvp(Marionette.getOption(this, "nvp"));
            },
            initialize: function (options) {
                if(options){
                    this.options = options;
                }
            },
            model: Entities.StructureModel
        });

        /**
         * Collection of structures with model {@link module:Entities.StructureModel}
         * @constructor
         * @extends Backbone.Collection
         * @name module:Entities.StructureCollection
         */
        Entities.StructureCollection = Backbone.Collection.extend({
            url: urlRootHelpers.searchStructures(),
            initialize: function (model, options) {
                if (options) {
                    this.options = options;
                }
            },
            parse: function (data) {
                return data.items || data;
            },
            model: Entities.StructureModel
        });

        /** @namespace API(structure)
         * @private
         */
        var API = {
            /**
             * Get structures collection with specified parameters
             * @memberof API(structure)#
             * @listens structure:entities
             * @param {Object} params - Parameters to search
             */
            getStructureEntities: function (params) {
                var structures = new Entities.StructureCollection([]);
                var defaults = {
                   fields: [
                       "nvp",
                       "origin",
                       "structure",
                       "type",
                       "project",
                       "project.target",
                       "series",
                       "created_date",
                       "created_by",
                       "modified_date",
                       "modified_by",
                       "sort",
                       "tags"
                   ]
                };

                var defer = $.Deferred();
                structures.fetch({
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(_.extend(defaults, params)),
                    success: function (data) {
                        defer.resolve(data);
                    },
                    error: function () {
                        defer.resolve(void 0);
                    }
                });

                return defer.promise();
            },
            /**
             * Get structure model by defined attributes
             * @memberof API(structure)#
             * @listens structure:entity
             * @param {Object} data - Structure attributes
             */
            getStructureEntity: function (data) {
                var structure = new Entities.StructureModel({
                    project_id: data.project_id,
                    series_id: data.series_id,
                    item_type_id: data.item_type_id,
                    chemical_entity_id: data.chemical_entity_id
                });

                var defer = $.Deferred();
                structure.fetch({
                    success: function (data) {
                        defer.resolve(data);
                    },
                    error: function () {
                        defer.resolve(void 0);
                    }
                });

                return defer.promise();
            },
            /**
             * Get structure model by nvp
             * @memberof API(structure)#
             * @listens nvp:structure:entity
             * @param {Text} nvp - Structure nvp code
             */
            getNvpStructureModel: function (nvp) {
                var item = new Entities.NvpStructureModel({
                    nvp: nvp
                });

                var defer = $.Deferred();
                item.fetch({
                    success: function (data) {
                        defer.resolve(data);
                    },
                    error: function(data){
                        defer.resolve(data);
                    }
                });

                return defer.promise();
            },
            /**
             * Get structures collection by nvp codes
             * @memberof API(structure)#
             * @listens nvp:structures:entities
             * @param {Text} nvp - List of nvp codes
             */
            getNvpStructureCollection: function (nvp) {
                var source = new Entities.NvpStructureCollection({
                    nvp: nvp
                });

                var defer = $.Deferred();
                source.fetch({
                    success: function (collection) {
                        defer.resolve(collection);
                    },
                    error: function(){
                        defer.resolve(false);
                    }
                });

                return defer.promise();
            }
        };


        /**
         * Get collection of structures, according attributes in <b>data</b> parameter
         *
         * @event structure:entities
         * @property {Object} data - structure attributes, to search
         * @example
         * //Get all structures
         * names: null,
         * project_name: null,
         * ptt_code: null,
         * search_type: null,
         * specific_tags: null,
         * tag_categories: null,
         * tag_names: null,
         * target: null,
         * target_type: null,
         * type: "structures"
         * @example
         * //Get all structures for series 20496, in project 19493 with descending sorting by modified_date
         * project_id: "13493",
         * series_id: "20496",
         * sort: "modified_date desc"
         * @return <a href="module-Entities.StructureCollection.html">Structure collection</a>
         */
        CSF.reqres.setHandler("structure:entities", function (data) {
            return API.getStructureEntities(data);
        });

        /**
         * Get structure model
         *
         * @event structure:entity
         * @property {Object} data
         * @property {Number} data.chemical_entity_id - Structure Id
         * @property {Number} data.project_id - Structure project Id
         * @property {Number} data.series_id - Structure series Id
         * @property {Text} data.item_type_id - Structure type(compound/scaffold)
         * @example
         * {chemical_entity_id: "21616", project_id: "13493", series_id: "20496", item_type_id: "scaffold"}
         * @return <a href="module-Entities.StructureModel.html">Structure model</a>
         */
        CSF.reqres.setHandler("structure:entity", function (data) {
            return API.getStructureEntity(data);
        });

        CSF.reqres.setHandler("structure:entity:new", function (projectId, seriesId, structureType) {
            return new Entities.StructureModel({
                project: {
                    project_id: projectId
                },
                series: {
                    series_id: seriesId
                },
                item_type_id: structureType
            });
        });

        CSF.reqres.setHandler("save:structure:entity:sequence", function (projectId, seriesId, callback, data, structures) {
            var doneCount = 0,
                //structureType = 'compound',
                saveNumber = function (value) {
                    //  todo - verbose alwz compound
                    var typeId = value.item_type_id;
                    var newStructure = CSF.request("structure:entity:new", projectId, seriesId, typeId);

                    newStructure.save(value, {
                        wait: true,
                        success: function () {
                            structures.add(newStructure);

                            doneCount = callback(newStructure, doneCount, saveNumber);
                        },
                        error: function () {
                            doneCount = callback(newStructure, doneCount, saveNumber, true);
                        }
                    });
                };

            saveNumber(data[doneCount]);
        });

        /**
         * Get collection of structures by NVP code
         *
         * @event nvp:structures:entities
         * @property {Text} nvp - List of NVP codes comma-separated
         * @example
         * CGA320051,NVP-BXI920
         * @return <a href="module-Entities.StructureCollection.html">Structure collection</a>
         */
        CSF.reqres.setHandler("nvp:structures:entities", function (nvp) {
            return API.getNvpStructureCollection(nvp);
        });

        /**
         * Get structure model by NVP code
         *
         * @event nvp:structure:entity
         * @property {Text} nvp - NVP code
         * @return <a href="module-Entities.StructureModel.html">Structure model</a>
         */
        CSF.reqres.setHandler("nvp:structure:entity", function (nvp) {
            return API.getNvpStructureModel(nvp);
        });

    });
});
