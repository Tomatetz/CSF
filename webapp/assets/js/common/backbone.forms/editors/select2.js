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

    Form.editors.Select2 = Form.editors.Base.extend({

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

                var enable = self.$el.data('enable');
                self.$el.select2('enable', enable);

                self.setValue(self.value);


            }, 10);

            return this;
        },

        getValue: function() {
            return this.$el.val();
        },

        setValue: function(val) {
            if(!val) return;
            var value = {}
                value.id = val;
            this.$el.select2("data", value);
        }

    });

    })(Backbone.Form);
});