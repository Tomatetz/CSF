define([
    'app'
], function (CSF) {
    CSF.module('Entities', function (Entities, CSF, Backbone, Marionette, $, _) {

        var api_url = CSF.config.API_URL;

        /**
         * Default model for ptt code details
         * @constructor
         * @example
         * code: "LDK378X-ST1",
         * target: [{
         *   metastore_id: "NVMTARSPHSQ9UM7301",
         *   target_detail: {
         *      id_at_source: "238",
         *      source: "ENTREZGENE",
         *      value: "ALK"},
         *   target_id: 0,
         *   target_pref_name: "ALK tyrosine kinase receptor",
         *   target_type: "Molecular Target/Enzyme/Kinase"
         * @name module:Entities.Ptt_codeModel
         */
        Entities.Ptt_codeModel = Backbone.Model.extend({
            urlRoot: function () {
                return api_url + 'actions/ptt_code_details/' + Marionette.getOption(this, "code");
            },
            initialize: function (options) {
                if (options) {
                    this.options = options;
                }
            },
            idAttribute: 'tag_def_id',
            /**
             * Default ptt_code model properties. May contain 'target' array, with information about targets, target types etc.
             * @property {Object}  defaults
             * @property {Text}  defaults.code
             * @property {Array}  [defaults.target]
             * @property {Text}  defaults.target[0].metastore_id
             * @property {Object}  defaults.target[0].target_detail
             * @property {Number}  defaults.target[0].target_detail.id_at_source
             * @property {Text}  defaults.target[0].target_detail.source
             * @property {Text}  defaults.target[0].target_detail.value
             * @property {Number}  defaults.target[0].target_id
             * @property {Text}  defaults.target[0].target_pref_name
             * @property {Text}  defaults.target[0].target_type
             * @name module:Entities.Ptt_codeModel.defaults
             */
            defaults: {
                code:'',
                target: [{
                    metastore_id: '',
                    target_detail: {
                        id_at_source: '',
                        source: '',
                        value: ''
                    },
                    target_id: null,
                    target_pref_name: '',
                    target_type: ''
                }]
            }
        });

        /** @namespace API(ptt_code_details)
         * @private
         */
        var API = {
            /**
             * Get ptt code details
             * @memberof API(ptt_code_details)
             * @listens ptt_code:entities
             * @param {Text} code - Ptt code for project
             * @return Ptt code details
             */
            getPttCodeDetails: function (code) {
                var tags = new Entities.Ptt_codeModel({
                    code: code
                });
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
         * Get ptt code details
         *
         * @event ptt_code:entities
         * @param {Text} code - Ptt code for project
         * @return <a href="module-Entities.Ptt_codeModel.html">Ptt_code model</a>
         */
        CSF.reqres.setHandler('ptt_code:entities', function (code) {
            return API.getPttCodeDetails(code);
        });
    });

});
