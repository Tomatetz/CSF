define([
        "app",
        "tpl!apps/series/common/templates/form.tpl",
        "tpl!apps/series/common/templates/dialog_info.tpl",
        "backbone-forms-modules"
    ],
    function (CSF, formTpl, dialogInfoTpl) {
        CSF.module("SeriesApp.Common.Views", function (Views, CSF, Backbone, Marionette, $, _) {

            Views.Form = Marionette.ItemView.extend({
                template: formTpl,
                events: {
                    "click button.js-submit": "submitClicked",
                    "click .modal__delete-item": "deleteSeries",
                    'submit': 'submitClicked'
                },

                submitClicked: function (event) {
                    event.preventDefault();
                    var errs = this.form.validate();
                    if (!errs) {
                        $('.modal-backdrop').remove();
                        $(event.currentTarget).button('loading');
                        var data = Backbone.Syphon.serialize(this.form.el);

                        this.trigger("form:submit", data);
                    }
                },
                deleteSeries: function () {
                    this.trigger("series:delete", this.model);
                },
                onShow: function(){
                    this.$el.find('input[name="series_name"]').focus();
                },
                onRender: function () {
                    this.$(".js-submit").text(this.buttonTitle);
                    var title = Marionette.getOption(this, "title");
                    var form = new Backbone.Form({
                        model: this.model
                    }).render();

                    this.$(".modal-body").append(form.el);

                    this.$el.find('[name="series_name"]').attr('autofocus', true);
                    this.form = form;

                    if (title) {
                        this.$el.find('.modal-title')
                            .html(title);

                        this.$el.find('.js-submit')
                            .attr('data-loading-text', Marionette.getOption(this, "dataLoadingText"))
                            .html(Marionette.getOption(this, "buttonTitle")).focus();

                        this.$el.find('.modal-footer')
                            .prepend('<span id="deleteSerie" class="modal__delete-item"> Delete series</span>');
                    }
                }
            });
        });

        return CSF.SeriesApp.Common.Views;
    });
