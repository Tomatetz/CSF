require(["tpl!components/templates/notification.tpl", "bootstrap", "bootstrap-notify"], function (notificationTpl) {
        /*[ 'bottom-right', 'info',     'Gah this is awesome.'],
         [ 'top-right',    'success',  'I love Nijiko, he is my creator.' ],
         [ 'bottom-left',  'warning',  'Soda is bad.' ],
         [ 'top-right',  'danger',   "I'm sorry dave, I'm afraid I can't let you do that." ],
         [ 'bottom-right', 'info',     "There are only three rules." ],
         [ 'top-right',    'inverse',  'Do you hear me now?' ],*/

        Backbone.Notify = (function () {
            var notificationsDiv = $("<div class='notifications top-right'></div>");
            $("#notify-region").append(notificationsDiv);
            return function (text, type) {
                var errors = _.template(notificationTpl({message: text.message, cause: text.cause, details: text.details}));
                notificationsDiv.notify({
                    type: type || "info",
                    message: {html: errors},
                    fadeOut: { enabled: false},
                    //fadeOut: { enabled: true, delay: 15000 },
                    closable: true
                }).show();
        };
    })();

    Backbone.NotifyError = function(event, request, settings) {

        var errors = {
            message: (request.responseJSON)? request.responseJSON.message : _.escape(request.responseText),
            cause: (request.responseJSON)? request.responseJSON.cause : "",
            details: [
                {name: "Http response", text: request.status + " " + request.statusText},
                {name: "Message in json", text: _.escape(request.responseText)},
                {name: "Location", text: settings.url}
            ]
        };

        return Backbone.Notify(errors || "Some Error has occurred", "danger")
    };

    Backbone.NotifySuccess = function (text) {
        if (typeof (text) == "string")
            return Backbone.Notify(text, "success");
        else if (typeof (text) == "object") {
            if (text.status == "OK")
                return Backbone.Notify(text.payload, "success");
            return;
        }
        return Backbone.Notify(text, "success");
    };

    Backbone.NotifyWarning = function (text) {
        return Backbone.Notify(text, "warning")
    };
});

