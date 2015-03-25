define([
        "marionette",
        "bootstrap",
        "config/marionette/regions/dialog",
        "preview-card",
        "moment", "d3", "geometry", "colorbrewer", "notification"
    ],
    function (Marionette) {

        CSF = new Marionette.Application();

        CSF.config = {
            CSF_VERSION: EnvConfig.CSFVersion,
            USER_ID: window.NIBRIam && NIBRIam.NIBR521,
            USER_NAME: window.NIBRIam && NIBRIam.NIBRFull,
            API_URL: EnvConfig.ApiUrl,
            SKETCHER_ID: EnvConfig.SketcherId,
            PEOPLE_SERVICE_API_URL: EnvConfig.PeopleServiceApiUrl,
            MOLECULES_RENDER_API_URL: EnvConfig.MoleculesRenderApiUrl,
            SOURCE_ASSAY_SEARCH_URL: EnvConfig.SourceAssaySearchUrl,
            SOURCE_LITERATURE_SEARCH_URL: EnvConfig.SourceLiteratureSearchUrl,
            PREVIEW_CARD_URL: EnvConfig.PreviewCardPeopleUrl,
            NVP_GET_MOL: EnvConfig.NVPGetMolfile
        };

        CSF.cache = {
            structure: []
        };

        CSF.addRegions({
            headerRegion: "#nibr-header",
            mainRegion: "#main",
            breadcrumbsRegion: "#breadcrumbs",
            dialogRegion: Marionette.Region.Dialog.extend({
                el: "#dialog-region"
            }),
            notifyRegion: "#notify-region"
        });

        CSF.no_image_preview = function (img) {
            img.src = /*'http://nebulacdn.na.novartis.net/images/anonymous-large.png'*/ 'assets/img/no-user.jpg';
            img.onerror = '';
            return true;
        };

        CSF.navigate = function (route, options) {
            options || (options = {});
            Backbone.history.navigate(route, options);
        };

        CSF.getCurrentRoute = function () {
            return Backbone.history.fragment;
        };

        CSF.startSubApp = function (appName, args) {
            var currentApp = appName ? CSF.module(appName) : null;
            if (CSF.currentApp === currentApp) {
                return;
            }

            if (CSF.currentApp) {
                CSF.currentApp.stop();
            }

            CSF.currentApp = currentApp;
            if (currentApp) {
                currentApp.start(args);
            }
        };


        CSF._initNotification = function () {

            $(document).ajaxError(function (event, request, settings, type) {
                if (type === "abort") return false;
                $(event.currentTarget).find(".btn.disabled").button('reset');
                if (Backbone.NotifyError) {
                    Backbone.NotifyError(event, request, settings);
                }
            });

            $(document).ajaxSuccess(function (event, xhr, settings) {
                $(event.currentTarget).find(".btn.disabled").button('reset');
            });

            window.onError = function (message, filename, lineno, colno, error) {
                if (Backbone.NotifyError) {
                    Backbone.NotifyError(filename
                        + " " + lineno
                        + " " + colno
                        + " " + message
                        + " " + error
                    );
                }
            };
        };

        CSF._initTooltip = function () {
            $('body').tooltip({
                selector: '[data-toggle=tooltip]',
                html: true
            });
        };

        CSF._setTimeFormat = function () {
            moment.lang('en', {
                longDateFormat: {
                    LT: "HH:mm",
                    L: "MM/DD/YYYY",
                    l: "M/D/YYYY",
                    LL: "MMMM Do YYYY",
                    ll: "DD MMM YYYY",
                    LLL: "MMMM Do YYYY LT",
                    lll: "MMM D YYYY LT",
                    LLLL: "dddd, D MMMM YYYY LT",
                    llll: "ddd, MMM D YYYY LT"
                }
            });
        };

        CSF._displayNibrHeader = function () {
            //Display project version
            var gettingVersion = $.ajax({
                url: CSF.config.API_URL + 'actions/version',
                dataType: "json",
                type: "get",
                cache: true
            });

            $.when(gettingVersion).done(function (data) {
                $('#nibr-header').nibrheader({
                    name: data.app_name,
                    description: data.app_version_tag,
                    appNameUrl: window.location.protocol + '//' + window.location.host + '/'
                });

                // Set version information in footer based on what we retrieved
                $('#footer_version_tag').html(data.app_version_tag);
                $('#footer_version').html(data.app_version);
                $('#footer_build_time').html(" - " + data.app_build_time);

                if (data.app_environment && data.app_environment != "prod") {
                    $('#footer_environment').html(" - " + data.app_environment);
                } else {
                    $('#footer_environment').html("");
                }
            });

            return gettingVersion;
        };

        CSF._initGetHelpLink = function (app_environment) {
            // 'default' means we run app localy;
            if (app_environment !== "default") {
                require(["siggethelp"], function () {
                    // Usage is described here: http://nebulacdn.na.novartis.net/plugins/sig-gethelp/2.0.0/
                    if ($.fn.sigGetHelp) {
                        $("#feedback-form-link").sigGetHelp({
                            projectId: 'CSF',
                            appTitle: 'Compound Series & Favorites',
                            assignee: 'pellian5', // Anna Pelliccioli as ASM
                            issueType: 19, // Feedback
                            appHelpContent:
                                '<p><a href="http://share.nibr.novartis.intra/Departments/NITAS/training_comms/Training Materials Library/CSF/QRG/csf_guide.pdf" target="_blank"> CSF quick guide</a></p>',
                            feedbackNotes: [
                                {name: 'CSF Feedback', value: 'GetHelp'}
                            ],
                            fnAddJiraNotes: function () {
                                return [
                                    {name: 'Current URL', value: window.location.href}
                                ];
                            }
                        });
                    }
                });
            }
        };

        CSF.on("start", function () {
            this._initNotification();
            this._initTooltip();
            this._setTimeFormat();

            $.when(this._displayNibrHeader()).done(_.bind(function (data) {
                this._initGetHelpLink(data.app_environment)
            }, this));

            if (Backbone.history) {
                require(["apps/projects/projects_app",
                    "apps/series/series_app",
                    "apps/structure/structure_app"], function () {

                    Backbone.history.start({pushState: false});

                    if (CSF.getCurrentRoute() === "") {
                        CSF.trigger("projects:list");
                    }
                });
            }
        });

        require(["spin.jquery"], function () {
            var common = {
                lines: 10, // The number of lines to draw
                length: 5, // The length of each line
                width: 2, // The line thickness
                radius: 7, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: "#000", // #rgb or #rrggbb
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: "spinner", // The CSS class to assign to the spinner
                zIndex: 100, // The z-index (defaults to 2000000000)
                top: "17px", // Top position relative to parent in px
                left: "200px" // Left position relative to parent in px
            };

            $.fn.spin.presets.sources = common;

            $.fn.spin.presets.serializeWrapper = _.extend(_.clone(common), {
                lines: 13,
                length: 20,
                width: 10,
                radius: 30,
                top: "30px",
                left: "auto"
            });

            $.fn.spin.presets.structure = _.extend(_.clone(common), {
                top: "30px",
                left: "65px"
            });

            $.fn.spin.presets.loading = _.extend(_.clone(common), {
                radius: 4,
                length: 3,
                width: 2,
                lines: 13,
                top: "-2px",
                left: "auto"
            });

        });

        return CSF;
    });
