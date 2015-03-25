define(['jquery', 'underscore', 'backbone', 'backbone-forms',
    "text!common/backbone.forms/templates/fieldset-2clmn.tpl",
    "text!common/backbone.forms/templates/form-2clmn.tpl"], function ($, _, Backbone, forms, fieldSet2Tpl, form2Tpl) {
    (function (Form) {
        Backbone.CustomForm = Backbone.Form.extend({
            initialize: function (options) {

                //Find the schema to use
                var schema = this.schema = (function () {
                    //Then schema on model
                    var model = options.model;
                    if (model && model.schema) return _.result(model, 'schema');
                })();


                if (schema) {
                    var fieldSets = [];
                    for (var field in schema) {
                        if (schema.hasOwnProperty(field)) {
                            if (schema[field].fieldset) {
                                var index = parseInt(schema[field].fieldset) - 1;
                                if (!fieldSets[index])fieldSets[index] = [];
                                fieldSets[index].push(field);
                            }
                        }
                    }
                    if (fieldSets.length > 0) {
                        if (fieldSets.length == 2) {

                            var fieldSetsResult = [];
                            _.each(fieldSets, function (itemFieldSets) {
                                fieldSetsResult.push(
                                    {
                                        fields: itemFieldSets,
                                        template: _.template(fieldSet2Tpl)
                                    }
                                )
                            });

                            options.template = _.template(form2Tpl);
                            options.fieldsets = fieldSetsResult;
                            return Form.prototype.initialize.call(this, options);

                        }
                    } else {
                        return Form.prototype.initialize.call(this, options);
                    }
                }


            },
            render: function () {
                var form = this;

                var fields = form.fields;
                for (var key in fields) {
                    if (fields.hasOwnProperty(key)) {
                        var eventName = key + ":change";

                        form.on(eventName, function (form, editor, dependenciesArr) {
                            var dependencies = dependenciesArr[0]; //todo why is array?
                            if (dependencies) {
                                for (var fieldKey in dependencies) {
                                    if (dependencies.hasOwnProperty(fieldKey)) {
                                        if (dependencies[fieldKey]) {
                                            var options = dependencies[fieldKey].options;
                                            if (options) {
                                                form.fields[fieldKey].editor.setOptions(options);
                                            }
                                        }
                                    }
                                }
                            }
                            form.fields[editor.key].validate();
                        });

                    }
                }

                return Form.prototype.render.call(this);
            }
        });
    })(Backbone.Form);
});