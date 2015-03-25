define(["app",
        "tpl!apps/projects/common/templates/form_header.tpl",
        "tpl!apps/projects/common/templates/dialog_info.tpl",
        "tpl!apps/projects/common/templates/dialog_confirm.tpl",
        "tpl!apps/projects/common/templates/new_project.tpl",
        "backbone-forms-modules",
        "entities/ptt_code_details"],
    function (CSF, formHeaderTpl, dialogInfoTpl, dialogConfirmTpl, newProjectTpl) {
        CSF.module("ProjectsApp.Common.Views", function (Views, CSF, Backbone, Marionette, $, _) {

            Views.DialogInfo = Marionette.ItemView.extend({
                template: dialogInfoTpl
            });

            Views.DialogConfirm = Marionette.CompositeView.extend({
                template: dialogConfirmTpl,
                events: {
                    "click [data-action='submit-delete']": "submitDelete",
                    "click [data-action='cancel']": "cancelDelete"
                },
                initialize: function (data) {

                    var dialogType = '';

                    var deleteSeries = {
                            title: "Delete series",
                            body: "Are you sure you want to delete series '" + this.model.get("series_name") + "' ?",
                            redirect: '/#projects/' + this.model.get("project_id")
                        },
                        deleteProject = {
                            title: "Delete project",
                            body: "Are you sure you want to delete project '" + this.model.get("project_name") + "' ?",
                            redirect: '/#projects'
                        };

                    if (data.type === 'deleteSeries') {
                        dialogType = deleteSeries;

                    } else if (data.type === 'deleteProjects') {
                        dialogType = deleteProject;
                    }

                    this.title = dialogType.title;
                    this.body = dialogType.body;
                    if (!data.type) {
                        this.title = data.title;
                        this.body = data.body;
                    }
                    if (data.redirect) {
                        this.redirect = dialogType.redirect;
                    }

                    this.buttonTitle = "Delete project";
                },
                submitDelete: function (e) {
                    e.preventDefault();

                    this.killModel();
                },
                cancelDelete: function (e) {
                    e.preventDefault();

                    $(".modal-backdrop").remove();
                },
                killModel: function () {
                    var callback = _.bind(function () {
                        this.trigger('Confirmed');

                        $(".modal-backdrop").remove();
                        if (Marionette.getOption(this, "deleteFrom")) {
                            this.trigger("delete:submit:done");
                        }
                        if (this.redirect) {
                            window.location.href = this.redirect;
                        }
                    }, this);

                    this.model.destroy().done(callback);
                }
            });

            Views.ProjectFormLayout = Marionette.LayoutView.extend({
                template: newProjectTpl,
                events: {
                    "click button.js-submit": "submitClicked",
                    "click .change-view label": "changeView",
                    "click .modal__delete-item": "deleteProject"
                },
                regions: {
                    'WithoutCodeRegion': "#project_without_ptt_region",
                    'WithCodeRegion': "#project_with_ptt_region"
                },
                serializeData: function (attributes, options) {
                    return {
                        title: Marionette.getOption(this, "title"),
                        buttonTitle: Marionette.getOption(this, "buttonTitle"),
                        dataLoadingText:  Marionette.getOption(this, "dataLoadingText")
                    };
                },
                changeView: function () {
                    this.$el.find('.tab-pane').toggleClass('active');
                },
                deleteProject: function () {
                    this.trigger("project:delete", this.model);
                },
                onShow: function () {
                    this.$el.find('.js-submit').focus();
                    var $changeViewButtons = this.$el.find('.change-view');

                    if (Marionette.getOption(this, "buttonTitle") === "Update project") {
                        this.$el.find('.modal-footer')
                            .prepend('<span id="deleteProject" class="modal__delete-item"> Delete project</span>');
                    }

                    if (this.model.id) {
                        $changeViewButtons.hide();

                        if (this.model.get('ptt_code')) {
                            this.$el.find('[name="ptt_code"]').data("enable", false);
                            this.addProjectInfoTooltip();

                            var that = this;
                            CSF.request("ptt_code:entities", this.model.get('ptt_code')).done(function (ptt) {
                                var targets = '';
                                var targetsType = '';

                                _.each(ptt.get('target'), function (element) {
                                    if (element.target_detail) {
                                        targets += element.target_detail.value + ' ';
                                    }

                                    targetsType += element.target_type + ' ';
                                });

                                that.addProjectInfoTooltip(that.model.get('project_name'), targets, targetsType);
                                that.$el.find(".projectInfo").addClass("active");
                                that.$el.find(".projectInfo").show();
                            });
                        } else {
                            this.$el.find('.tab-pane').removeClass('active');
                            this.$el.find('#project_without_ptt_region').addClass('active');
                        }
                    }
                },

                onRender: function () {
                    var that = this;
                    var itemModel = this.model;

                    //Lock owner in editors list
                    if (itemModel.id) {
                        var projectEditors = itemModel.get('project_editors');
                        var owner = itemModel.get('created_by');

                        var mainEditor = _.find(projectEditors, function (item) {
                            return item.created_by.id === owner.id;
                        });
                        mainEditor.locked = true;
                    } else {
                        if (CSF.config.SKETCHER_ID !== "Marvin") {
                            this.lockProjectCurrentUser({
                                id: CSF.config.USER_ID,
                                name: CSF.config.USER_NAME
                            });
                        } else {
                            this.lockProjectCurrentUser({
                                id: 'fakeuserid',
                                name: 'Fake User'
                            });
                        }
                    }

                    this.form = new Backbone.Form({
                        model: this.model
                    }).render();

                    this.form_wo_ptt = new Backbone.Form({
                        model: this.model
                    }).render();

                    this.WithCodeRegion.show(this.form);
                    this.WithoutCodeRegion.show(this.form_wo_ptt);

                    this.form.$el.find('[name="project_name"]').attr("disabled", "disabled");
                    this.form_wo_ptt.$el.find(".field-ptt_code").remove();

                    this.form.fields
                        .ptt_code.$el.on('change', function (event) {
                            var project = event && event.added;
                            var name = project && project.name;

                            that.addProjectInfoTooltip();
                            that.form.$el.find('[name="project_name"]').val(event.val ? project.name : "");

                            if (name) {
                                CSF.request("ptt_code:entities", project.id).done(function (ptt) {
                                    var targets = '';
                                    var targetsType = '';

                                    _.each(ptt.get('target'), function (element) {
                                        if (element.target_detail) {
                                            targets += element.target_detail.value + ' ';
                                        }

                                        targetsType += element.target_type + ' ';
                                    });

                                    that.addProjectInfoTooltip(name, targets, targetsType);
                                    that.$el.find(".projectInfo").addClass("active");
                                });

                                that.$el.find(".projectInfo").show();
                            } else {
                                that.$el.find(".projectInfo").hide();
                            }
                        });
                },
                lockProjectCurrentUser: function (userParams) {
                    this.model.set('project_editors', [
                        $.extend({
                            locked: true
                        }, userParams)
                    ]);

                    this.model.set('project_contacts', [
                        $.extend({}, userParams)
                    ]);
                },
                addProjectInfoTooltip: function (name, targets, targetsType) {
                    var tooltip;

                    //  fill in
                    if (name) {
                        tooltip = '<div class="projectInfo_width">' + '<h4>NIBR project details</h4>'
                        + '<dl class="dl-horizontal dl-horizontal-xlg"><dt>Project name:</dt><dd>' + name + '</dd>'
                        + '<dt>Targets:</dt><dd>' + targets + '</dd>'
                        + '<dt>Target types:</dt><dd>' + targetsType + '</dd></dl></div>';

                        this.form.$el.find(".projectInfo .tooltip .tooltip-inner").html(tooltip);
                    } else {
                        //  waiting before
                        this.form.$el.find(".field-project_name > .col-sm-8")
                            .append('<div class="projectInfo">' +
                        '<span class="glyphicon glyphicon-btn glyphicon-info-sign" data-toggle="form-tooltip" data-placement="left" title="">' +
                        '</span></div>');

                        tooltip = '<div class="projectInfo_width"><h4>NIBR project details</h4>Loading...</div>'
                    }

                    this.form.$el.find('.projectInfo .glyphicon')
                        .attr('data-original-title', tooltip);

                    this.form.$el.find(".projectInfo [data-toggle='form-tooltip']")
                        .tooltip({html: true});
                },
                submitClicked: function (event) {
                    event.preventDefault();

                    var formToValidate = this.$el.find('.tab-pane.active').hasClass('with_ptt') ? this.form : this.form_wo_ptt;

                    var data = formToValidate.getValue(),
                        callback = function (ctx) {
                            $(event.currentTarget).button('loading');

                            ctx.trigger("form:submit", data);
                        };

                    if (data.ptt_code) {
                        if (!formToValidate.validate()) {
                            callback(this);
                        }
                    } else {
                        data.ptt_code = null;

                        if (formToValidate.validate()&&data.project_name) {
                            callback(this);
                        }
                    }
                }
            });

        });

        return CSF.ProjectsApp.Common.Views;
    });
