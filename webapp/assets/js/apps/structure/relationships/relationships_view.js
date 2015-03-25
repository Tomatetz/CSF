define([
    "app",
    "common/views",
    "apps/structure/common/views",
    "tpl!./templates/relationshipsLayout.tpl",
    "tpl!./templates/relationship_form.tpl",
    "tpl!apps/structure/common/templates/emptyDialog.tpl",
    "tpl!apps/structure/show/templates/d3.tpl",
    "tpl!apps/structure/common/templates/dialog_confirm.tpl",
    "backbone-forms-modules",
    "components/d3graph"
],
function (CSF, CommonViews, StructureCommonViews, relationshipsLayoutTpl, setRelationshipTpl, emptyDialogTpl, d3Tpl, dialogConfirmTpl) {
    CSF.module("StructureApp.Relationships.Views", function (Views, CSF, Backbone, Marionette, $, _) {

        Views.RelationshipsPanel = CommonViews.LayoutCollapsePanel.extend({
            events: {
                'click [data-action="add-Relationships"]': "addRelation"
            },
            regions: {
                relationshipsRegion: "#Relationships-region"
            },
            behaviors: {
                SetCollapsePanel: {
                    title: "Relationships",
                    buttonTitle: "Add relationship",
                    triggerToAddItem: 'relationship:add'
                }
            },
            initialize: function (options) {
                this.editable = Marionette.getOption(this, "editable");
            }
        });

        Views.RelationshipsLayout = Marionette.LayoutView.extend({
            template: relationshipsLayoutTpl,
            events: {
                'click [data-target="[data-id=\'ancestors\']"]' : "onAncestorsTabClick",
                'click [data-target="[data-id=\'children\']"]' : "onChildrenTabClick"
            },
            regions: {
                parentsRegion: "#parent-region",
                childrenRegion: "#children-region",
                ancestorsRegion: "#ancestors-region"
            },
            onShow: function(){
            },
            serializeData: function(){
                return {
                    children_quantity: Marionette.getOption(this, "children_quantity"),
                    parents_quantity: Marionette.getOption(this, "parents_quantity")
                }
            },
            onSetParent_badge: function(parentsLength){
                //console.log(parentsLength);
                this.$el.find('.parent_badge').html(parentsLength);
            },
            onSetChildren_badge: function(childrenLength){
                this.$el.find('.children_badge').html(childrenLength);
            },
            onAncestorsTabClick: function(){
                this.trigger("show:ancestors:tab");
            },
            onChildrenTabClick: function(){
                this.trigger("show:children:tab");
            }
        });

        Views.EmptyDialog = Marionette.ItemView.extend({
            template: emptyDialogTpl,
            events: {
                'click button.js-submit': "submitClicked",
                'click #removeRelation': "deleteClicked"
            },
            ui: {
                modalBody: ".modal-body"
            },
            subForms: {
                sourceForm: null
            },
            onRender: function(){
                this.$el.find('.modal-title').html(Marionette.getOption(this, "title"));
                this.$el.find('button.js-submit').html(Marionette.getOption(this, "buttonTitle"));
                this.$el.find('button.js-submit').attr('data-loading-text', Marionette.getOption(this, "dataLoadingText"));
                if(Marionette.getOption(this, "editType"))
                {
                    this.$el.find(".modal-footer")
                        .prepend('<span id="removeRelation" class="modal__delete-item"> Delete relationship</span>');
                }
            },
            submitClicked: function(event){

                $(event.currentTarget).button('loading');
                var that = this;

                var data = [];
                _.each(Marionette.getOption(this, "children").models, function(child){
                    data.push(child);
                });
                _.each(Marionette.getOption(this, "parents").models, function(parent){
                    data.push(parent);
                });
                var $reasonInput = this.$el.find('[data-element="relationship-reason"]');
                var $structureInput = this.$el.find('[data-element="derives-from"]');

                var reason = $reasonInput.select2('data');
                var reasonText = _.pluck(reason, 'text').join(",")
                if(!Marionette.getOption(this, "editType")) {

                    var structure = $structureInput.select2('data');
                    data.push({
                        parent_id: structure.id,
                        child_id: this.model.get('chemical_entity_id'),
                        comment: reasonText
                    });

                }else{
                    if(Marionette.getOption(this, "editType") === 'parent'){
                        var parent_id = Marionette.getOption(this, "parent_id");
                        var child_id = this.model.get('chemical_entity_id');
                    } else if(Marionette.getOption(this, "editType") === 'child'){
                        var parent_id = this.model.get('chemical_entity_id');
                        var child_id = Marionette.getOption(this, "child_id");
                    }
                    _.each(data, function(relation){
                        if(relation.get('child_id') == child_id && relation.get('parent_id') == parent_id){
                            relation.set('comment', reasonText);
                        }
                    });
                }
                this.trigger("form:submit", data);


            },
            deleteClicked: function(){
                var data = [];
                _.each(Marionette.getOption(this, "children").models, function(child){
                    data.push(child);
                });
                _.each(Marionette.getOption(this, "parents").models, function(parent){
                    data.push(parent);
                });
                if(Marionette.getOption(this, "editType") === 'parent'){
                    var parent_id = Marionette.getOption(this, "parent_id");
                    var child_id = this.model.get('chemical_entity_id')
                }else if(Marionette.getOption(this, "editType") === 'child'){
                    var parent_id = this.model.get('chemical_entity_id')
                    var child_id = Marionette.getOption(this, "child_id");
                }
                _.each(data, function(relation, pos){
                    if(relation.get('child_id')==child_id&&relation.get('parent_id')==parent_id){
                        data.splice(pos, 1);
                    }
                });

                this.trigger("form:submit", data, "delete");
            }
        });

        Views.RelationshipDialog = Marionette.ItemView.extend({
            template: setRelationshipTpl,
            ui: {
                derivesFrom: '[data-element="derives-from"]',
                reasons: '[data-element="relationship-reason"]'
            },

            initAddingMode: function(){
                var that = this;
                var reasons = [];
                _.each(Marionette.getOption(this, "reasons_definitions").models, function(reason_model){
                    reasons.push(reason_model.attributes.reason);
                });

                this.ui.reasons.select2({
                    placeholder: "",
                    minimumInputLength: 0,
                    allowClear: true,
                    tags: reasons
                });

                var existingRelatedStructures = Marionette.getOption(this, "existing_relationships").structures;
                var allStructures = Marionette.getOption(this, "project_structures");
                var availableStructures = allStructures.reject(function(structure){
                    return existingRelatedStructures.get(structure) || structure.id == Marionette.getOption(that, "structureId");
                });

                var items = _.invoke(availableStructures, "toJSON");

                var data = [],
                    series = [];

                _.each(items, function(item){
                    data.push(item.series.series_name);
                });
                _.each(_.uniq(data), function(serie){
                    series.push({category: serie, children: []});
                });

                _.each(items, function(item){

                    _.each(series, function(serie){
                        if(item.series.series_name == serie.category){
                            serie.children.push({
                                    id : item.chemical_entity_id,
                                    text : item.displayed_name,
                                    item_type_id: item.item_type_id
                            });
                        }
                    });
                });
                this.ui.derivesFrom.select2({
                    query: function (query) {
                        var term = query.term,
                            seriesClone = term ? [] : _.clone(series);

                        if (term) {
                            var lowerTerm = term.toLowerCase(),
                                categories = [];

                            _.each(series, function (item) {
                                var itemCat = item.category;
                                var children = [];
                                
                                _.each(item.children, function(child){
                                    var token = child.text.toLowerCase();

                                    if (token.indexOf(lowerTerm) !== -1) {
                                        children.push(child);

                                        if (_.indexOf(categories, itemCat) === -1) {
                                            categories.push(itemCat);
                                        }
                                    }
                                });
                                
                                if (children.length) {
                                    seriesClone.push({
                                        category: itemCat,
                                        children: children
                                    });
                                }
                            });
                        }

                        query.callback({
                            results: seriesClone
                        });
                    },
                    //  TODO - resembles structure/common/view
                    formatResult: function (object, container) {
                        if (object.category) {
                            return '<span class="bold">' + object.category + '</span>';
                        } else {
                            return '<span>' + object.text + '</span>' +
                            '<span class="target structure-type structure-type-' + object.item_type_id + ' pull-right">' + object.item_type_id.substr(0, 1).toLocaleUpperCase() + '</span>';
                        }
                    }
                });

            },

            initUpdatingMode: function(){
                var reasons = [];
                _.each(Marionette.getOption(this, "reasons_definitions").models, function(reason_model){
                    reasons.push(reason_model.attributes.reason);
                });

                var existing_reasons = this.model.get('comment').split(',');
                this.ui.reasons.select2({
                    placeholder: "",
                    minimumInputLength: 0,
                    allowClear: true,
                    tags: reasons
                }).select2("val", existing_reasons);

                if (Marionette.getOption(this, "editType") === 'parent') {
                    this.ui.derivesFrom.html(this.model.parent_structure.get('displayed_name'));
                } else {
                    this.ui.derivesFrom.html(this.model.child_structure.get('displayed_name'));
                }
            },

            onRender: function(){
                if(Marionette.getOption(this, "editType") !== 'parent' && Marionette.getOption(this, "editType") !== 'child') {
                    this.initAddingMode();
                } else {
                    this.initUpdatingMode();
                }
            },
            initRelationshipsSelect: function () {
            }
        });

        Views.StructureD3 = Marionette.ItemView.extend({
            template: d3Tpl,
            onShow: function () {
                var ancestors = Marionette.getOption(this, "ancestors");
                var structures = ancestors.structures;
                var structure = Marionette.getOption(this, "structure");
                var structureId = structure.get('chemical_entity_id');
                var structureName = structure.get('chemical_entity_name');

                //  getting images for structures - todo use MAP
                var images = [];
                structures.each(function(structure){
                    images.push(structure.getStructureImage({
                        imgWidth: 100,
                        imgHeight: 80
                    }));
                });

                $.when.apply($, images).then(function(){
                    var data = _.indexBy(structures.toJSON(), 'chemical_entity_id');

                    _.each(data , function( structure ){
                        var id = structure['chemical_entity_id'];
                        //structure =
                        $.extend(structure, {
                            id: id,
                            type: structure['item_type_id'],
                            name: structure['displayed_name'],
                            group: (id == structureId)? 'Children' : 'Parents',
                            structureImage: structures.get(id).image,
                            depends : [],
                            toChildcomment: [],
                            dependedOnBy: [],
                            active: structure['displayed_name'] == structureName
                        });
                    });

                    _.each(ancestors.models, function(parent){
                        var parentID = parent.get('parent_id');
                        var childID = parent.get('child_id');
                        var commentArray =  parent.get('comment').split(',');

                        data[parentID].dependedOnBy.push(childID);
                        data[childID].depends.push(parentID);
                        data[parentID].toChildcomment.push({childID: childID, comment: commentArray});
                    });

                    $.fn.graphModule(data, structureId);
                });
            }
        });

        Views.DialogConfirm = Marionette.ItemView.extend({
            template: dialogConfirmTpl,
            events: {
                "click [data-action='submit-delete']": "submitDelete",
                "click [data-action='cancel-delete']": "cancelDelete"
            },
            initialize: function (data) {
                this.title = data.title;
                this.body = data.body;
                this.buttonTitle = "Delete source";
            },
            submitDelete: function (e) {
                this.trigger("delete:submit");
            },
            cancelDelete: function (e) {
                $(".modal-backdrop").remove();
            }
        });
    });

    return CSF.StructureApp.Relationships.Views;
});
