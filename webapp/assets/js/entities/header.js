define(["app",
    "backbone.picky"],
    function (LogosManager) {
        LogosManager.module("Entities", function(Entities, LogosManager, Backbone, Marionette, $, _){
            Entities.Header = Backbone.Model.extend({
                initialize: function(){
                    var selectable = new Backbone.Picky.Selectable(this);
                    _.extend(this, selectable);
                }
            });

            Entities.HeaderCollection = Backbone.Collection.extend({
                model: Entities.Header,

                initialize: function(){
                    var singleSelect = new Backbone.Picky.SingleSelect(this);
                    _.extend(this, singleSelect);
                }
            });

            var initializeHeaders = function(){
                Entities.headers = new Entities.HeaderCollection([
                    {name: "Home", url: "projects", navigationTrigger: "projects:list"}
                ]);
            };

            var API = {
                getHeaders: function(){
                    if(Entities.headers === undefined){
                        initializeHeaders();
                    }
                    return Entities.headers;
                }
            };

            LogosManager.reqres.setHandler("header:entities", function(){
                return API.getHeaders();
            });
        });

        return ;
    });
