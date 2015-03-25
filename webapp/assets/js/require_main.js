requirejs.config({
    baseUrl: "assets/js",
    paths: {
        "backbone.picky": "vendor/backbone.picky",
        "backbone.syphon": "vendor/backbone.syphon",
        "backbone-forms-modules": "require_backboneForm",
        moment: "vendor/moment.min",
        bootstrap: "vendor/nibr-bootstrap",
        spin: "vendor/spin",
        "spin.jquery": "vendor/spin.jquery",
        "bootstrap-notify": "vendor/bootstrap-notify",

        moleditor: "vendor/chemdraw/jquery.moleditor",
        chemdraw: "vendor/chemdraw/lib/chemdraw/chemdraw",
        cdlib_ns: "vendor/chemdraw/lib/chemdraw/cdlib_ns",
        cdlib_ie: "vendor/chemdraw/lib/chemdraw/cdlib_ie",
        "marvin.util": "vendor/marvin/js/util",

        notification: "components/notification",
        "preview-card": "components/preview-card",
        geometry: "vendor/geometry",
        colorbrewer: "components/colorbrewer",

        //Sig components
        siggethelp : "http://nebulacdn.na.novartis.net/plugins/sig-gethelp/2.0.0/jquery.sig.gethelp"
    },

    shim: {
        bootstrap: ["jquery"],
        "backbone.picky": ["backbone"],
        "backbone.syphon": ["backbone"],
        "bootstrap-notify": ["bootstrap"],
        notification: ["bootstrap-notify"],
        "backbone.forms.templates": ["backbone.forms"],
        "spin.jquery": ["spin", "jquery"],
        layout_splitter: ["jquery"],

        moleditor: ["jquery", "chemdraw"],
        chemdraw: ["jquery"],
        siggethelp: ["jquery"]
    }
});

require([
    "app",
    "components/behaviors",
    "apps/header/header_app"
], function (CSF) {
    CSF.start();
});
