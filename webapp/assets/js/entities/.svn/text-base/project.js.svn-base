define(["app", "config/storage/localstorage"], function (CSF) {
    CSF.module("Entities", function (Entities, CSF, Backbone, Marionette, $, _) {

        var api_url = CSF.config.API_URL;

        Entities.Project = Backbone.Model.extend({
            urlRoot: api_url + "resources/projects",
            idAttribute: "project_id",
            defaults: {
                project_name: "",
                project_status: { name : "Active" },
                created_by: "",
                modified_by: "",
                created_date: "",
                modified_date: "",
                number_of_series: 0,
                deleted: "",
                project_editors: "",
                project_contacts:"",
                ptt_code: null,
                target: "",
                project_description: ""
            },
            schema: {
                ptt_code: {
                    title: "Project code:",
                    type: "Select2",
                    editorClass: "form-control",
                    config: {
                        placeholder: "Type project code",
                        minimumInputLength: 0,
                        allowClear: true,
                        ajax: {
                            url: function(term){
                                return api_url+"actions/ptt_codes?query="+term;
                            },
                            quietMillis: 300,
                            dataType: 'json',
                            cache: true,
                            params: {
                                xhrFields: {
                                    withCredentials: true
                                }
                            },
                            results: function (data, page) {
                                // parse the results into the format expected by Select2.
                                _.each(data, function(value, key, list){
                                    value.id = value.ptt_code;
                                    value.text = value.ptt_code + " (" + value.name + ")";
                                    value.disabled =  !value.available;
                                });

                                return {results: data};
                            }
                        },
                        formatSelection: function(object, container){
                            return object.id;
                        }
                    },
                    validators: [
                        {type: "required", message: "This field is required"}
                    ]
                },
                project_name: {
                    title: "Project name:",
                    validators: [
                        {type: "required", message: "This field is required"}
                    ]
                },
                project_contacts: {
                    title: "Project contacts:",
                    editorClass: "form-control",
                    type: "Select2People",
                    config: {
                        placeholder: "Select persons",
                        minimumInputLength: 3,
                        ajax: {
                            url: function(term){
                                return CSF.config.PEOPLE_SERVICE_API_URL + "/" + term;
                            },
                            quietMillis: 300,
                            dataType: 'json',
                            params: {
                                xhrFields: {
                                    withCredentials: true
                                }
                            },
                            results: function (data, page) {
                                _.each(data.results, function(value, key, list){
                                    value.id = value.unique_id;
                                    value.name = value.firstname + " " + value.lastname;
                                    value.text = value.firstname + " " + value.lastname + " (" + value.unique_id + ")";

                                });
                                return {results: data.results};
                            }
                        },
                        formatSelection: function(object, container){
                            return  object.name;
                        },
                        tags:[]
                    }
                },
                project_editors: {
                    title: "Project editors:",
                    type: "Select2People",
                    editorClass: "form-control",
                    config: {
                        //  to view items as tags
                        tags: [],
                        placeholder: "Select persons",
                        minimumInputLength: 3,
                        ajax: {
                            url: function(term){
                                return CSF.config.PEOPLE_SERVICE_API_URL + "/" + term;
                            },
                            quietMillis: 300,
                            dataType: 'json',
                            params: {
                                xhrFields: {
                                    withCredentials: true
                                }
                            },
                            results: function (data, page) {
                                _.each(data.results, function (value) {
                                    var name = value.firstname + " " + value.lastname,
                                        id = value.unique_id;

                                    value.id = id;
                                    value.name = name;
                                    value.text = name + " (" + id + ")";

                                });

                                return {results: data.results};
                            }
                        },
                        formatSelection: function(object) {
                            return object.name;
                        }
                    }
                },
                project_description: {
                    title: "Description:",
                    type: "TextArea"
                }
            }
        });

        Entities.ProjectCollection = Backbone.Collection.extend({
            url: api_url + "resources/projects",
            model: Entities.Project
        });

        var API = {
            getProjectEntities: function () {
                var projects = new Entities.ProjectCollection();
                var defer = $.Deferred();
                projects.fetch({
                    success: function (data) {
                        defer.resolve(data);
                    },
                    error: function (data) {
                        defer.resolve(void 0);
                    }
                });
                return defer.promise();
            },

            getProjectEntity: function (projectId) {
                var project = new Entities.Project({project_id: projectId});
                var defer = $.Deferred();
                project.fetch({
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

        CSF.reqres.setHandler("project:entities", function () {
            return API.getProjectEntities();
        });

        CSF.reqres.setHandler("project:entity", function (id) {
            return API.getProjectEntity(id);
        });

        CSF.reqres.setHandler("project:entity:new", function (id) {
            return new Entities.Project();
        });
    });

});
