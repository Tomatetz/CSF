define(['jquery', 'underscore', 'backbone', 'backbone-forms'], function ($, _, Backbone) {
    (function (Form) {

        Form.editors.DatePicker = Backbone.Form.editors.Text.extend({
            render: function () {
                // Call the parent's render method
                Form.editors.Text.prototype.render.call(this);
                // Then make the editor's element a datepicker.
                this.$el.datepicker({
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    weekStart: 1
                });

                return this;
            },

            // The set value must correctl
            setValue: function (value) {
                this.$el.val(moment(value).format('YYYY-MM-DD'));
            }
        });

    })(Backbone.Form);
});
