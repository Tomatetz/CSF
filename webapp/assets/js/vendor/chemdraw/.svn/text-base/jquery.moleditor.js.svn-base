(function ($) {

    var createEditor = (function () {

        var useChemDraw = (function () {
            var use = false;
            if (cd_currentUsing == 2 || cd_currentUsing == 3) {
                use = cd_isCDPluginInstalled();
            }
            else if (cd_currentUsing == 1) {
                use = cd_isCDActiveXInstalled();
            }
            return use;
        })();

        if (useChemDraw) {

            /* Basic js wrapper of the ChemDraw ActiveX */
            ChemDrawWrapper = function (editor_id) {
                this.cd_name = 'cd_' + editor_id;
            };

            ChemDrawWrapper.prototype = {

                _isBlank: function () {
                    return cd_isBlankStructure(this.cd_name);
                },

                setSmiles: function (data) {
                    var pver = cd_getVersion(this.cd_name);
                    if (pver.indexOf(" Net ") >= 0)
                        return "Sorry, this requires the Std or Pro plugin";
                    cd_putData(this.cd_name,
                        "chemical/x-daylight-smiles",
                        data);
                },

                setMolFile: function (data) {
                    var pver = cd_getVersion(this.cd_name);
                    if (pver.indexOf(" Net ") >= 0)
                        return "Sorry, this requires the Std or Pro plugin";
                    cd_putData(this.cd_name,
                        "chemical/x-mdl-molfile",
                        data);
                },

                getMolFile: function () {
                    var pver = cd_getVersion(this.cd_name);
                    if (pver.indexOf(" Net ") >= 0)
                        return "Sorry, this requires the Std or Pro plugin";
                    return cd_getData(this.cd_name,
                        "chemical/x-mdl-molfile",
                        false /* checkMW */);
                },

                getSmiles: function () {
                    var pver = cd_getVersion(this.cd_name);
                    if (pver.indexOf(" Net ") >= 0)
                        return "Sorry, this requires the Std or Pro plugin";
                    return cd_getData(this.cd_name,
                        "chemical/x-daylight-smiles",
                        false /* checkMW */);
                },

                clear: function () {
                    cd_clear(this.cd_name);
                },

                makeHtml: function (id, options) {
                    var $html = $(cd_getSpecificObjectTag(
                        'chemical/x-cdx',
                        options['width'],
                        options['height'],
                        this.cd_name,
                        '' /* srcFile */,
                        '' /* viewOnly */,
                        '' /* shrinkToFit */,
                        '' /* dataURL */,
                        '' /* dontcache */,
                        '' /* dockingreferenceid */,
                        '' /* editoutofplace */));
                    $html.css("border", "solid 1px grey");
                    return $html[0];
                }

            };

            return function (editor_id) {
                return new ChemDrawWrapper(editor_id);
            };

        }
        else {
            window.alert("Either your browser does not support the ChemDraw plugin or ChemDraw is not installed on your computer.");
        }
    })();

    var jQueryMolEditorPlugin = (function () {

        /* default options */
        var defaults = {
            // generic
            width: 400,
            height: 300
        };

        var editorCounter = 0;

        var initMethod = function (usrOptions) {
            return this.each(function (i, item) {
                var $item = $(item);
                if ($item.data('moleditor')) {
                    // initializing an already initialized object
                    // treat as a no-op
                }
                else {
                    // initialize a new Editor object
                    var options = $.extend({}, defaults, {});
                    if (typeof usrOptions === 'object') {
                        options = $.extend(options, usrOptions || {});
                    }
                    // assign a unique id in case none is defined
                    editorCounter++;
                    var editor_id = $item.attr('id');
                    if (typeof editor_id === 'undefined') {
                        editor_id = 'moleditor' + editorCounter;
                    }
                    var moleditor = createEditor(editor_id);
                    var html = moleditor.makeHtml(editor_id, options);
                    $item.html(html);
                    $item.data('moleditor', moleditor);
                }
            });
        };

        var clearMethod = function () {
            return this.each(function () {
                var moleditor = $(this).data('moleditor');
                if (moleditor) {
                    moleditor.clear();
                }
                else {
                    $.error('MOLEDITOR "clear" called on ' +
                        'a not initialized object');
                }
            });
        };

        var getSmilesMethod = function () {
            var moleditor = this.eq(0).data('moleditor');
            if (moleditor) {
                return moleditor.getSmiles();
            }
            $.error('MOLEDITOR "getSmiles" called on a not initialized object');
        };

        var getMolFileMethod = function () {
            var moleditor = this.eq(0).data('moleditor');
            if (moleditor) {
                return moleditor.getMolFile();
            }
            $.error('MOLEDITOR "getMolFile" called on a not initialized object');
        };

        var setMolFileMethod = function (ctab) {
            var moleditor = this.eq(0).data('moleditor');
            if (moleditor) {
                moleditor.setMolFile(ctab);
            }
            else
                $.error('MOLEDITOR "setMolFile" called on a not initialized object');
        };

        var setSmilesMethod = function (smiles) {
            var moleditor = this.eq(0).data('moleditor');
            if (moleditor) {
                moleditor.setSmiles(smiles);
            }
            else
                $.error('MOLEDITOR "setSmiles" called on a not initialized object');
        };

        var methods = {
            init: initMethod,
            clear: clearMethod,
            getSmiles: getSmilesMethod,
            getMolfile: getMolFileMethod,
            setMolfile: setMolFileMethod,
            setSmiles: setSmilesMethod
        };

        var process = function (method) {

            if (methods[method]) {
                var args = Array.prototype.slice.call(arguments, 1);
                return methods[method].apply(this, args);
            }
            else if (typeof method === 'object' || !method) {
                return methods.init.apply(this, arguments);
            }
            else {
                $.error('Method "' + method +
                    '" does not exist on jQuery.moleditor');
            }

        }

        return { "process": process };
    })();

    /* Register the plugin */
    $.fn.extend({ "moleditor": jQueryMolEditorPlugin.process });

})(jQuery);
