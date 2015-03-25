define(["app"],
    function (CSF) {
        CSF.module("itemTags", function (itemTags, CSF, Backbone, Marionette, $, _) {
            itemTags.showTags= function (options) {
                var tagsContext = options.item,
                    maxHeight = parseInt( tagsContext.css('min-height'), 10),
                    MAX_CHARS = 23;

                var tagsCompact = {
                    skipNext: false,
                    getTagLabelValues: function (item, useFullName) {
                        var tagData = item.tag_definition,
                            useName = useFullName ? (tagData.name.length < MAX_CHARS ? tagData.name : tagData.short_name) : tagData.short_name;

                        return {
                            name: useName,
                            longName: tagData.name === useName ? '' : tagData.long_name,
                            degree: tagData.degree_symbol,
                            color: tagData.color
                        };
                    },
                    createTag: function (item, label) {
                        var $span = $("<span class='label label-default label-bordered'></span>");
                        var name = label.name || "No name!";

                        // show a tooltip with full name if short name is different than normal name or degree is used
                        if (label.longName) {
                            $span
                                .attr("data-toggle", "tooltip")
                                .attr("data-placement", "top")
                                .attr("data-container", "body")
                                .attr("title", label.longName);
                        }
                        //  show label
                        if (label.degree) {
                            $span
                                .attr("style", "padding-right:1px")
                                .prepend('<span class="label label-sm label-default" style="background-color:' + label.color + '">' + label.degree + '</span>');
                        } else {
                            $span.attr("style", "background-color:" + label.color);
                        }

                        $span.prepend(name);
                        tagsContext.append($span);
                    },
                    initializeTagItem: function (item, useFullName) {
                        var label = this.getTagLabelValues(item, useFullName);

                        this.createTag(item, label);

                        this.checkHeight(useFullName);
                    },
                    checkHeight: function (useFullName) {
                        if ((tagsContext.height() > maxHeight)) {
                            if (useFullName) {
                                this.initializeTags();
                            } else {
                                this.skipNext = true;
                                this.removeLastTag();

                                if (tagsContext.height() > maxHeight) {
                                    tagsContext.find("> span:last-child").remove();
                                    this.removeLastTag();
                                }
                            }
                        }
                    },
                    initializeTags: function (useFullName) {
                        tagsContext.empty();

                        _.each(options.tags, _.bind(function (item) {
                            if (!this.skipNext) {
                                this.initializeTagItem(item, useFullName);
                            }
                        }, this));
                    },
                    removeLastTag: function () {
                        tagsContext.find("> span:last-child").remove();
                        tagsContext.append('<span class="expand-tags">...</span>');
                    }
                };

                tagsCompact.initializeTags(true);
            }
        });

        return CSF.itemTags;
    }
);