define(['jquery', 'underscore', 'backbone', 'backbone-forms'], function ($, _, Backbone) {
    (function (Form) {
        /**
         * BOOTSTRAP BUTTON CHECKBOXES
         * Renders a <div> with given options represented as <li> buttons containing checkboxes
         *
         * Requires an 'options' value on the schema.
         * Can be an array of options, a function that calls back with the array of options, a string of HTML
         * or a Backbone collection. If a collection, the models must implement a toString() method
         */
        Backbone.Form.editors.Buttons = Backbone.Form.editors.Select.extend({

            tagName: 'div',
            className: 'btn-group',
            attributes: {'data-toggle': 'buttons'},

            initialize: function (options) {
                var dependencies = options.schema.dependencies;
                this.dependencies = dependencies || {};
                Form.editors.Select.prototype.initialize.call(this, options);
            },
            events: {
                'click .btn:not(.active):not(.disabled)': function (event) {
                    var editor = this;
                    setTimeout(function () {
                        var value = editor.getValue();
                        editor.trigger('change', editor, editor.dependencies[value]);
                    }, 10);
                }
            },

            getValue: function () {
                var value = this.$('label.active input').val();
                return value;
            },

            setValue: function (values) {
                if (values) {
                    for (var i = 0; i < values.length; i++) {
                        this.$('input[id="' + values[i] + '"]').parent().addClass('active');
                    }
                }
            },

            /**
             * Create group of bootstrap checkbox buttons HTML
             * @param {Array} Options as a simple array e.g. ['option1', 'option2']
             * or as an array of objects e.g. [{val: 'option1', class: 'btn-danger'}]
             * @return {String} HTML
             */
            _arrayToHtml: function (array) {
                var html = [];
                var self = this;
                _.each(array, function (option, index) {
                    var itemHtml = '';
                    var classAttr = '';
                    if (option.disabled)
                        classAttr += ' disabled"';
                    if (_.isObject(option)) {
                        itemHtml += ('<label class="btn' + classAttr + '"><input type="radio" name="' + self.key + '" id="' + option.val + '" value="' + option.val + '">' + option.label + '</label>');
                    }
                    else {
                        itemHtml += ('<label class="btn' + classAttr + '"><input type="radio" name="' + self.key + '" id="' + option + '" value="' + option.val + '">' + option + '</label>');
                    }
                    itemHtml += '</li>';
                    html.push(itemHtml);
                });

                return html.join('');
            }

        });
    })(Backbone.Form);

});