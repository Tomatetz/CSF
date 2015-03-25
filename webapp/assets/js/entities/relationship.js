define([
    "app"
], function (CSF) {
    CSF.module("Entities", function (Entities, CSF, Backbone, Marionette, $, _) {

        var api_url = CSF.config.API_URL;
        /**
         * Relationship model
         * @constructor
         * @name module:Entities.RelationshipModel
         */
        Entities.RelationshipModel = Backbone.Model.extend({
            urlRoot: api_url + "actions/search/relationship",
            parse: function (response, options) {
                //  TODO - side-effect
                if (options.collection) {
                    this.child_structure = options.collection.structures.get(response.child_id);
                    this.parent_structure = options.collection.structures.get(response.parent_id);
                } else {
                    this.child_structure = options.child_structure;
                    this.parent_structure = options.parent_structure;
                }

                return response;
            },
            defaults: {
                comment: ""
            }
        });

        /**
         * Relationships collection with model {@link module:Entities.RelationshipModel}
         * @constructor
         * @name module:Entities.RelationshipsCollection
         */
        Entities.RelationshipsCollection = Backbone.Collection.extend({
            url: api_url + "actions/search/relationship",
            model: Entities.RelationshipModel,
            parse: function (response) {
                this.structures = new CSF.Entities.StructureCollection(response.chemical_entity_list, {
                    parse: true
                });

                return response.items || response;
            },
            fetch: function (options) {
                var opts = _.extend({}, options);
                var defaults = {
                    sort: "modified_date",
                    rows: 1000,
                    depth: 1
                };
                var data = opts.data ? (this.data = opts.data) : (this.data || {});
                opts.url = this.url + "?" + $.param(_.extend(defaults, data));

                Backbone.Collection.prototype.fetch.call(this, opts);
            }
        });

        /** @namespace API(relationships)
         * @private
         */
        var API = {
            /**
             * Get relationships collection for structure
             * @memberof API(relationships)
             * @listens relationships:entities
             * @param {Object} data
             * @param {Object} data.chemical_entity_field - chemical_entity_field
             * @param {Object} data.parent_id(or child_id) - id of parent or child for current structure
             * @param {Object} [data.depth] - depth of parent/child structures search
             */
            getRelationshipsEntities: function (data) {
                var relationships = new Entities.RelationshipsCollection([]);
                var defer = $.Deferred();
                relationships.fetch({
                    data: data,
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
         * Get relationships collection for structure
         *
         * @event relationships:entities
         * @param {Object} data
         * @param {Object} data.chemical_entity_field - chemical_entity_field
         * @param {Number} [data.parent_id] - id of parent structure for current
         * @param {Number} [data.child_id] - id of child structure for current
         * @param {Number} [data.depth] - depth of parent/child structures search
         * @example //Get all children structures for structure with chemical_entity_id 20508
         * {parent_id: 20508, chemical_entity_fields: "nvp,origin,structure,type,project,project.target,s…odified_date,modified_by,project.target,sort,tags"}
         * @example //Get all relationships for structure with chemical_entity_id 20508 and with search depth = 1
         * {child_id: 20508, parent_id: 20508, depth: "1", chemical_entity_fields: "chemical_entity"}
         * @return <a href="module-Entities.RelationshipsCollection.html">Relationships collection</a>
         */
        CSF.reqres.setHandler("relationships:entities", function (data) {
            return API.getRelationshipsEntities(data);
        });

    });

});
