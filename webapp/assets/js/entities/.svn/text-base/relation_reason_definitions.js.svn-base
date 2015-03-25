define(["app"], function (CSF) {
    CSF.module("Entities", function (Entities, CSF, Backbone, Marionette, $, _) {

        var api_url = CSF.config.API_URL;

        /**
         * Predefined reason definitions collection for realationships
         * @class Entities.RelationshipDefinitionsCollection
         * @constructor
         * @name module:Entities.RelationshipDefinitionsCollection
         */
        Entities.RelationshipDefinitionsCollection = Backbone.Collection.extend({
            url: function(){
                return api_url + 'actions/relation_reason_definitions';
            }
        });

        /** @namespace API(relation_reason_definitions)
         * @private
         */
        var API = {
            /**
             * Get reason definitions collection
             * @memberof API(relation_reason_definitions)
             * @listens reasons_definitions:entities
             */
            getRelationshipDefinitionsEntities: function () {
                var relationshipsDefinitions = new Entities.RelationshipDefinitionsCollection([]);
                var defer = $.Deferred();

                relationshipsDefinitions.fetch({
                    success: function (collection) {
                        defer.resolve(collection);
                    },
                    error: function(){
                        defer.resolve(undefined);
                    }
                });

                return defer.promise();
            }
        };


        /**
         * Get pre-defined reason definitions collection
         *
         * @event reasons_definitions:entities
         * @return <a href="module-Entities.RelationshipDefinitionsCollection.html">Reasons collection</a>
         */
        CSF.reqres.setHandler("reasons_definitions:entities", function () {
            return API.getRelationshipDefinitionsEntities();
        });
    });

});
