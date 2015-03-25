define([
        "app",
        "tpl!apps/structure/tags/templates/tag_item_wo_border.tpl"
    ],
    function (CSF, tagItemTpl) {
        CSF.module("TagSelect2Form", function (TagSelect2Form, CSF, Backbone, Marionette, $, _) {

            var usePlaceholder = "Please select tags or start typing";

            //  helpers namespace
            var specificTags = "[name ^= 'specific_tags']",
                tagNames = "[name ^= 'tag_names']",
                tagCategories = "[name ^= 'tag_categories']";

            function makeTagCases($ctx, tags) {
                var tagsList = mapTagList(tags);

                return [
                    {
                        name: 'specific',
                        data: {
                            placeholder: $ctx.find('[data-element="tag-specific"]'),
                            tagValues: _.uniq(tagsList),
                            hiddenInput: specificTags,
                            useSpecific: true
                        }
                    },
                    {
                        name: 'tagNames',
                        data: {
                            placeholder: $ctx.find('[data-element="tag-names"]'),
                            //  TODO - un-pluck
                            tagValues: _.uniq(_.pluck(_.pluck(tags, "attributes"), 'name')),
                            hiddenInput: tagNames
                        }
                    },
                    {
                        name: 'tagCategories',
                        data: {
                            placeholder: $ctx.find('[data-element="tag-categories"]'),
                            //  TODO - un-pluck
                            tagValues: _.uniq(_.pluck(_.pluck(tags, "attributes"), 'category')),
                            hiddenInput: tagCategories
                        }
                    }
                ];
            }

            function mapTagList(items) {
                return _.map(items, function (item) {
                    return mapTagListItem(item);
                });
            }

            function mapTagListItem(item, weightParams) {
                var name = item.hasOwnProperty('name') ? item.name : item.get('name');
                var tagBase = {
                    name: name,
                    degree: item.hasOwnProperty('degree') ? item.degree : (item.attributes ? item.get('degree') : null),
                    color: item.hasOwnProperty('color') ? item.color : item.get('color'),
                    long_name: item.hasOwnProperty('long_name') ? item.long_name : item.get('long_name'),
                    tag_def_id: item.hasOwnProperty('tag_def_id') ? item.tag_def_id : item.get('tag_def_id')
                };

                if (weightParams) {
                    return _.extend(tagBase, {
                        weight: item.weight,
                        disabled: $.inArray(name, weightParams.existTags) !== -1
                    });
                } else {
                    return _.extend(tagBase, {
                        category: item.get('category')
                    });
                }
            }

            function getValue($ctx, hiddenInputQuery) {
                var value = $ctx.find(hiddenInputQuery).val();

                return value ? value.split(",") : [];
            }


            TagSelect2Form.Component = {
                initTag: function (view, tags, existedTags) {
                    var tagsList = mapTagList(tags);

                    this.setSelectExisted(view, {
                        name: 'specific',
                        data: {
                            placeholder: view.$el.find('[data-element="tag-specific"]'),
                            tagValues: _.uniq(tagsList),
                            hiddenInput: specificTags,
                            useSpecific: true
                        }
                    }, existedTags);
                },
                initTags: function (view, tags) {
                    var callback = _.bind(function (item) {
                        if (item.data.useSpecific) {
                            this.setSelectExisted(view, item);
                        } else {
                            this.setSelect(view, item);
                        }
                    }, this);

                    _.each(makeTagCases(view.$el, tags), callback);
                },
                setSelectExisted: function (view, item, existedTags) {
                    var data = item.data;
                    var useTagsData = (function () {
                        var tags = [],
                            useData;

                        if (!existedTags) {
                            useData = data.placeholder.select2('data');
                            if (useData[0] && useData[0].name) {
                                tags = data.placeholder.select2('data');
                            }
                        } else {
                            _.each(existedTags.models, function (tag) {
                                //  TODO - no good to be used like this
                                tags.push(tag.attributes);
                            });
                        }

                        return tags;
                    }());

                    var callback = _.bind(function (e) {
                        $(e.currentTarget).closest(".form-group")
                            .find(data.hiddenInput).val(e.val);

                        //  TODO - use a second param@initTags::each-callback - do not serialize thrice?
                        var form = this.serializeSelect2Data(view, item);

                    }, this);

                    if (!existedTags) {
                        data.placeholder.on("change", callback);
                    }

                    data.placeholder.select2({
                        placeholder: usePlaceholder,
                        id: existedTags ? "tag_def_id" : "long_name",
                        multiple: true,
                        query: function (query) {
                            var term = query.term && query.term.toLowerCase();
                            var data = {
                                results: []
                            };
                            var category = [];
                            $.each(item.data.tagValues, function () {
                                if ($.inArray(this.category, category) === -1) {
                                    category.push(this.category);
                                }
                            });
                            //  todo - think of possible amount and use another impl..
                            category.sort();

                            var mapTagParams = {
                                existTags: _.map(item.data.placeholder.select2('data'), function (item) {
                                    return item.name;
                                })
                            };
                            var weightSort = function (obj1, obj2) {
                                if (obj1.weight > obj2.weight) {
                                    return -1;
                                } else if (obj1.weight < obj2.weight) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            };
                            //  todo - remove mix of underscore/plain methods
                            _.each(category, function (itemCat) {
                                var cat = [];
                                _.each(item.data.tagValues, function (itemTag) {
                                    if (itemTag.category === itemCat) {
                                        if (term && term.length === 0 || itemTag.name.toLowerCase().indexOf(term) >= 0) {
                                            cat.push(mapTagListItem(itemTag, mapTagParams));
                                        }
                                    }
                                });

                                if (cat.length) {
                                    data.results.push({
                                        category: itemCat,
                                        children: cat.sort(weightSort)
                                    });
                                }
                            });

                            query.callback(data);
                        },
                        formatSelection: function (object) {
                            return tagItemTpl({
                                tag_definition: object
                            });
                        },
                        formatSelectionCssClass: function (object, container) {
                            if (!object.degree) {
                                container.parent().css({
                                    backgroundColor: object.color,
                                    paddingRight: '.6em'
                                });
                            }
                        },
                        formatResult: function (object) {
                            if (!object.disabled && object.category) {
                                return '<span class="bold">' + object.category + '</span>';
                            } else {
                                return tagItemTpl({
                                    tag_definition: object
                                });
                            }
                        }
                    });

                    //  applies data
                    data.placeholder.select2('data', useTagsData);
                },
                setSelect: function (view, item) {
                    var data = item.data;
                    var callback = _.bind(function (e) {
                        $(e.currentTarget).closest(".form-group")
                            .find(data.hiddenInput).val(e.val);

                        //  TODO - use a second param@initTags::each-callback - do not serialize thrice?
                        var form = this.serializeSelect2Data(view, item);

                    }, this);
                    var callbackData = function (data) {
                        return data;
                    };

                    data.placeholder.select2({
                        placeholder: usePlaceholder,
                        id: callbackData,
                        multiple: true,
                        data: {
                            results: data.tagValues,
                            text: callbackData
                        },
                        formatResult: callbackData,
                        formatSelection: callbackData
                    }).on("change", callback);
                },

                serializeSelect2Data: function (view) {
                    var $ctx = view.$el;
                    var useType = $ctx.find('[data-element="type"] label.active input')
                        .val();

                    var tags = {
                        specific: getValue($ctx, specificTags),
                        names: getValue($ctx, tagNames),
                        categories: getValue($ctx, tagCategories)
                    };

                    return {
                        type: useType,
                        specific_tags: tags.specific,
                        tag_names: tags.names,
                        tag_categories: tags.categories
                    };
                },
                clearForm: function (form) {
                    form.find('[data-element="tag-specific"], [data-element="tag-names"], [data-element="tag-categories"]')
                        .select2('val', '');

                    form.find(specificTags, tagNames, tagCategories)
                        .val('');
                },
                applyData: function (view) {
                    var form = this.serializeSelect2Data(view);

                    var $ctx = view.$el;
                    var $filterIcon = $ctx.find(".glyphicon-filter");
                    var useType = $ctx.find('[data-element="type"] label.active input')
                        .val();

                    var tags = {
                        specific: getValue($ctx, specificTags),
                        names: getValue($ctx, tagNames),
                        categories: getValue($ctx, tagCategories)
                    };
                    var useIconColor = useType !== 'All' || tags.specific.length || tags.names.length || tags.categories.length;

                    if (useIconColor) {
                        $filterIcon.addClass('filtered');
                    } else {
                        $filterIcon.removeClass('filtered');
                    }

                    //  TODO - bound to structures
                    $('.filtered-structures-length').remove();
                    view.trigger("structures:showFiltered", form);
                }
            };
        });

        return CSF.TagSelect2Form.Component;
    }
);