define([
    "app",
    "components/cocktailsMixin",
    "common/views",
    
    "apps/structure/relationships/relationships_view",
    "apps/structure/list/list_view",
    "apps/structure/common/views",
    "entities/relationship",
    "entities/relation_reason_definitions"
], function (CSF, Cocktails,
             CommonViews, View, ShowView) {

    CSF.module("StructuresApp.Relationships", function (Relationships, CSF, Backbone, Marionette, $, _) {

        Relationships.Controller = {
            showRelationshipsAction: function (region, structure) {
                var projectId = structure.get('project').project_id,
                    structureId = structure.get('chemical_entity_id');

                var fields = [
                    "nvp",
                    "origin",
                    "structure",
                    "type",
                    "project",
                    "project.target",
                    "series",
                    "created_date",
                    "created_by",
                    "modified_date",
                    "modified_by",
                    "project.target",
                    "sort",
                    "tags"
                ];
                var fetchingChildren = CSF.request("relationships:entities", {
                    parent_id: structureId,
                    chemical_entity_fields: fields.join()
                });
                var fetchingParents = CSF.request("relationships:entities", {
                    child_id: structureId,
                    chemical_entity_fields: fields.join()
                });

                var loadingEmptyView = new CommonViews.LoadingCollapsePanel({
                    title: "Relationships"
                });

                region.show(loadingEmptyView);

                var controller = this;
                $.when(fetchingChildren, fetchingParents).done(function (children, parents) {
                    var relationshipsPanel = new View.RelationshipsPanel({
                        collection: children,
                        editable: structure.get('editable')
                    });

                    region.show(relationshipsPanel);

                    var relationsLayout = new View.RelationshipsLayout();
                    relationshipsPanel.relationshipsRegion.show(relationsLayout);

                    relationsLayout.triggerMethod('set:parent_badge', parents.length);
                    relationsLayout.triggerMethod('set:children_badge', children.length);

                    var childrenListView = new ShowView.SeriesList({
                        collection: children,
                        childViewOptions: {
                            relation: "child",
                            editable: structure.get('editable')
                        }
                    });

                    var parentsListView = new ShowView.SeriesList({
                        collection: parents,
                        viewType: 'relationships',
                        childViewOptions: {
                            relation: "parent",
                            editable: structure.get('editable')
                        }
                    });

                    relationsLayout.childrenRegion.show(childrenListView);
                    relationsLayout.parentsRegion.show(parentsListView);

                    relationsLayout.on("show:ancestors:tab", function () {
                        //  TODO - use model handler
                        CSF.request("relationships:entities", {
                            child_id: structureId,
                            chemical_entity_fields: 'chemical_entity',
                            depth: '1000'
                        }).done(function (ancestors) {
                            var graphView = new View.StructureD3({
                                ancestors: ancestors,
                                structure: structure
                            });

                            relationsLayout.ancestorsRegion.show(graphView);
                        });
                    });

                    relationsLayout.on("show:children:tab", function () {
                        children.fetch();
                    });

                    var fetchingProjectStructures = CSF.request("structure:entities", {
                        project_id: projectId
                    });
                    var fetchingReasonsDefinitions = CSF.request("reasons_definitions:entities");
                    var fetchingRelationships = CSF.request("relationships:entities", {
                        child_id: structureId,
                        parent_id: structureId,
                        depth: '1',
                        chemical_entity_fields: 'chemical_entity'
                    });

                    $.when(fetchingReasonsDefinitions, fetchingRelationships, fetchingProjectStructures).done(
                        function (reasons_definitions, existing_relationships, project_structures) {
                            relationshipsPanel.on("relationship:add", function (ItemView, item) {
                                var emptyDialogView = new View.EmptyDialog({
                                    title: 'Add relationship',
                                    buttonTitle: 'Add',
                                    model: structure,
                                    parents: parents,
                                    children: children,
                                    dataLoadingText: 'Adding...'
                                });
                                CSF.dialogRegion.show(emptyDialogView);

                                emptyDialogView.subForms.relationshipDialog = new View.RelationshipDialog({
                                    project_structures: project_structures,
                                    existing_relationships: existing_relationships,
                                    reasons_definitions: reasons_definitions,
                                    structureId: structureId
                                });
                                emptyDialogView.subForms.relationshipDialog.render();
                                emptyDialogView.ui.modalBody.html(emptyDialogView.subForms.relationshipDialog.el);

                                emptyDialogView.on("form:submit", function (data, item) {
                                    var newData = data.pop();
                                    var newRelationship = new CSF.Entities.RelationshipModel(newData, {
                                        parent_structure: project_structures.get(newData.parent_id),
                                        child_structure: project_structures.get(newData.child_id),
                                        parse: true
                                    });

                                    data.push(newRelationship.toJSON());
                                    structure.save({
                                        relationships: data
                                    }).done(function () {
                                        relationsLayout.trigger("show:ancestors:tab");

                                        parents.fetch({
                                            success: function (data) {
                                                relationsLayout
                                                    .triggerMethod('set:parent_badge', data.length);
                                            }
                                        });

                                        existing_relationships.fetch();
                                        reasons_definitions.fetch();

                                        emptyDialogView.trigger("dialog:close");
                                    }).error(function () {
                                    });
                                });
                            });
                            _.each([parentsListView, childrenListView], function (view) {
                                controller.bindItemControls({
                                    structure: structure,
                                    relatedItems: {
                                        parents: parents,
                                        children: children
                                    },
                                    layout: relationsLayout,
                                    existing_relationships: existing_relationships,
                                    reasons_definitions: reasons_definitions,
                                    view: view
                                });
                            });
                        });
                });

            },
            bindItemControls: function (data) {
                var structure = data.structure,
                    parents = data.relatedItems.parents,
                    children = data.relatedItems.children,
                    relationsLayout = data.layout,
                    existing_relationships = data.existing_relationships,
                    view = data.view;

                view.on("childview:structure:export", _.bind(function (childView) {

                    var useType = Marionette.getOption(childView, "relation");
                    //  todo - black magic
                    var structure = childView.model[ (useType === 'parent') ? 'parent_structure' : 'child_structure' ];

                    this.saveStructure(structure);
                }, this));

                view.on("childview:relationship:edit", function (childView, item) {
                    var useType = Marionette.getOption(childView, "relation");

                    var emptyDialogView = new View.EmptyDialog({
                        title: 'Edit relationship',
                        buttonTitle: 'Save updates',
                        model: structure,
                        parents: parents,
                        children: children,
                        editType: useType,
                        parent_id: item.get('parent_id'),
                        child_id: item.get('child_id'),
                        dataLoadingText: 'Updating...'
                    });

                    CSF.dialogRegion.show(emptyDialogView);

                    emptyDialogView.subForms.relationshipDialog = new View.RelationshipDialog({
                        reasons_definitions: data.reasons_definitions,
                        editType: useType,
                        model: item,
                        structureModel: structure
                    });

                    emptyDialogView.subForms.relationshipDialog.render();
                    emptyDialogView.ui.modalBody.html(emptyDialogView.subForms.relationshipDialog.el);

                    emptyDialogView.on("form:submit", function (data, mode) {
                        var callback = _.bind(function (data) {
                            this.trigger("dialog:close");
                        }, this);

                        if (mode === 'delete') {
                            var dialogView = new View.DialogConfirm({
                                title: "Delete relationship",
                                body: "Are you sure you want to delete relationship?"
                            });

                            CSF.dialogRegion.closeDialog();
                            CSF.dialogRegion.show(dialogView);

                            dialogView.on('delete:submit', function () {
                                structure.save({
                                    relationships: data
                                }).done(function () {
                                    parents.fetch({
                                        success: function(data){
                                            relationsLayout.triggerMethod('set:parent_badge', data.length);
                                        }
                                    });
                                    children.fetch({
                                        success: function(data){
                                            relationsLayout.triggerMethod('set:children_badge', data.length);
                                        }
                                    });
                                    existing_relationships.fetch();
                                    relationsLayout.trigger("show:ancestors:tab");
                                });
                            });

                        } else {
                            structure.save({
                                relationships: data
                            }).done(function () {
                                callback();
                                relationsLayout.trigger("show:ancestors:tab");

                                parents.fetch();
                                children.fetch();
                            });
                        }
                    });
                });
            }
        };

        Cocktails.use.mixin(Relationships.Controller, Cocktails.saveStructureAction);
    });

    return CSF.StructuresApp.Relationships.Controller;
});