define(['jquery', 'underscore', 'backbone', 'backbone-forms'], function ($, _, Backbone) {
    (function(Form) {

    /**
    * Select2
    *
    * Renders Select2 - jQuery based replacement for select boxes
    *
    * Simply pass a 'config' object on your schema, with any options to pass into Select2.
    * See http://ivaynberg.github.com/select2/#documentation
    */

    Form.editors.Select2People = Form.editors.Base.extend({

    /**
    * @param {Object} options.schema.config Options to pass to select2. See http://ivaynberg.github.com/select2/#documentation
    */
        tagName: 'div',
        className: '',

        initialize: function(options) {
            Backbone.Form.editors.Base.prototype.initialize.call(this, options);

            var schema = this.schema;

            this.config = schema.config || {};
        },

        render: function() {
            var self = this;
            setTimeout(function() {
                self.$el.select2(self.config);
                self.setValue(self.value);
            }, 10);

            return this;
        },

        getValue: function() {
            var data = this.$el.select2('data');

            return _.map(data, function (item) {
                return {
                    id: item.unique_id
                }
            });
        },

        setValue: function(val) {
            if(!val) return;

            var persons = _.map(val, function(item){
                return {
                    locked: item.locked,
                    unique_id: item.id,
                    id: item.id,

                    name: item.name,
                    text: item.name
                }
            });

            this.$el.select2("data", persons);
        }

    });

    })(Backbone.Form);
});