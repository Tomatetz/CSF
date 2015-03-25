define([
        "app"
    ],
    function (CSF) {
        CSF.module("TagsFilter", function (TagsFilter, CSF, Backbone, Marionette, $, _) {

            //  TODO - move into a single Component
            TagsFilter.applyFilters = function (collection, serializedData) {
                var useType = serializedData.type;

                //  TODO - resembles initTagsControl
                var specific_tags = serializedData.specific_tags;
                var tag_names = serializedData.tag_names;
                var tag_categories = serializedData.tag_categories;

                var filterStructures = collection.clone();
                var skipStructures = [];
                //  TODO - think of underscore for a whole method there
                _.each(filterStructures.models, function (structure) {
                    var definitions = {
                        specific: [],
                        tag_names: [],
                        tag_categories: []
                    };
                    //  TODO - map
                    _.each(structure.get('tags'), function (tag) {
                        var itemDef = tag.tag_definition;

                        definitions.specific.push(itemDef.long_name);
                        definitions.tag_names.push(itemDef.name);
                        definitions.tag_categories.push(itemDef.category);
                    });
                    //  TODO - use context not direct name
                    if (!(TagsFilter.isContainedWithin(specific_tags, definitions.specific)
                        && TagsFilter.isContainedWithin(tag_names, definitions.tag_names)
                        && TagsFilter.isContainedWithin(tag_categories, definitions.tag_categories))) {
                        skipStructures.push(structure);
                    }
                    if (!(useType === 'All' || useType === structure.get('item_type_id') + 's')) {
                        skipStructures.push(structure);
                    }
                });

                filterStructures.remove(_.uniq(skipStructures));
                return filterStructures;
            };

            TagsFilter.isContainedWithin = function (data, targetData) {
                var hasSkipped = false;

                _.each(data, function (item) {
                    if (!hasSkipped && _.indexOf(targetData, item) === -1) {
                        hasSkipped = true;
                    }
                });

                return !hasSkipped;
            };
        });

        return CSF.TagsFilter;
    }
);