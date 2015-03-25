define([
    'app',
    'cocktail',
    'apps/structure/common/views'
], function (CSF, Cocktail, StructureCommonViews) {

    CSF.module('CocktailsMixin', function (Cocktails, Backbone, Marionette, $, _) {
        Cocktails.use = Cocktail;

        Cocktails.addStructureAction = {
            addStructure: function(projectId, seriesId, structures){
                var newStructure = CSF.request('structure:entity:new', projectId, seriesId, 'scaffold');

                if (structures.length === 0) {
                    newStructure.set('isNew', true);
                }
                //             * TODO - is that more specific view now? - put into separate file
                var view = new StructureCommonViews.Form({
                    model: newStructure,
                    project_id: projectId
                });

                view.on('form:submit', function (data) {
                    var saving = true,
                        len = data.length;

                    view.on('save:cancel', function () {
                        saving = false;
                    });

                    this.$el.find('.js-submit').button('loading');

                    var self = this,
                        callback = function (saveStructure, doneCount, saveCallback, hasError) {
                            doneCount += 1;

                            if (doneCount < len && saving) {
                                saveCallback(data[doneCount]);
                            }
                            //  TODO - undocumented dependence..
                            self.triggerMethod('set:progress:bar', saveStructure, len, doneCount, !hasError);

                            return doneCount;
                        };

                    CSF.request('save:structure:entity:sequence', projectId, seriesId, callback, data, structures);
                });

                CSF.dialogRegion.show(view);
            }
        };

        Cocktails.saveStructureAction = {
            saveStructure: function(structure){
                var exportMolecule = new StructureCommonViews.MolForm({
                    model: structure,
                    formType: 'saveStructure'
                });

                CSF.dialogRegion.show(exportMolecule);
            }
        };

        Cocktails.showBreadcrumbsAction = {
            showBreadcrumbs: function(type, project, series, structure){

                var breadcrumbs = [],
                    projectLink = project ? "#projects/" + project.project_id : "",
                    seriestLink = series ? "/series/" + series.series_id : "",
                    structureLink = structure ? "/structure/" + structure.get('chemical_entity_id') : "";

                if(type === 'search'){
                    breadcrumbs.push(
                        {name: "Search", link: "#search"}
                    );
                }
                if(project) {
                    breadcrumbs.push(
                        {
                            name: project.project_name,
                            link: projectLink,
                            active: false
                        }
                    );
                }
                if(series){
                    breadcrumbs.push(
                        {
                            name: series.series_name,
                            link: projectLink + seriestLink,
                            active: false
                        }
                    );
                }
                if(structure){
                    breadcrumbs.push(
                        {
                            name: structure.get('displayed_name'),
                            link: projectLink + seriestLink + structureLink,
                            active: false
                        }
                    );
                }

                CSF.execute("show:breadcrumbs", breadcrumbs);
            }
        };

        return Cocktails;
    });

    return CSF.CocktailsMixin;
});