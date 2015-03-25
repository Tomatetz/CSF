require.config({
  shim: {
    jquery: {
      exports: "$"
    },
    underscore: {
      exports: "_"
    },
    backbone: {
      exports: "Backbone"
    },
    json2: [
      "jquery"
    ],
    "backbone.forms": [
      "backbone"
    ],
    localStorage: [
      "backbone"
    ],
    marionette: {
      deps: [
        "backbone"
      ],
      exports: "Marionette"
    }
  },
  paths: {
    backbone: "../../bower_components/backbone/backbone",
    jquery: "../../bower_components/jquery/dist/jquery",
    underscore: "../../bower_components/underscore/underscore",
    datatables: "../../bower_components/datatables/media/js/jquery.dataTables",
    json2: "../../bower_components/json2/json2",
    "backbone-forms": "../../bower_components/backbone-forms/distribution.amd/backbone-forms",
    localstorage: "../../bower_components/backbone.localStorage/backbone.localStorage",
    "backbone.localStorage": "../../bower_components/backbone.localStorage/backbone.localStorage",
    "backbone.wreqr": "../../bower_components/backbone.wreqr/lib/backbone.wreqr",
    "backbone.babysitter": "../../bower_components/backbone.babysitter/lib/backbone.babysitter",
    tpl: "../../bower_components/requirejs-tpl/tpl",
    "requirejs-tpl": "../../bower_components/requirejs-tpl/tpl",
    select2: "../../bower_components/select2/select2",
    marionette: "../../bower_components/marionette/lib/core/backbone.marionette",
    cocktail: "../../bower_components/cocktail/Cocktail",
    d3: "../../bower_components/d3/d3",
    text: "../../bower_components/text/text"
  },
  wrapShims: true,
  packages: [

  ]
});
