define(["app",
    "apps/structure/common/views",
    "apps/structure/tags/structures_list_item_tags",
    "tpl!apps/structure/list/templates/list_slider.tpl",
    "tpl!apps/structure/list/templates/list_item.tpl",
    "tpl!apps/structure/list/templates/addStructureButton.tpl",
    "tpl!apps/structure/list/templates/nvp_list_item.tpl",
    "tpl!apps/series/show/templates/missing.tpl",
    "tpl!apps/structure/list/templates/relationship_list_empty.tpl"
],
    function (CSF, CommonViews, tags, structureListSliderTpl, structureListItemTpl, addStructureButtonTpl, nvpList, EmptyStructureViewTpl, relationshipItemEmptyTpl) {
        /**
         * @module StructureApp.List.View
         * @namespace StructureApp.List.View
         */
        CSF.module("StructureApp.List.View", function (View, CSF, Backbone, Marionette, $, _) {
            /**
             * Setting view for structure item in slider
             * @class StructureListItem
             * @constructor
             * @extends StructureApp.Common.Views.StructureItemView
             */
            View.StructureListItem = CommonViews.StructureItemView.extend({
                className: "item-block",
                template: structureListItemTpl,
                ui: {
                    image: '[data-element="image-container"]'
                },
                events: {
                    "click .js-edit": "editClicked",
                    "click .js-delete": "deleteClicked",
                    'click [data-action="export"]': "exportStructure",
                    'click .editRelationship': "editRelationship"
                },

                initialize: function () {
                    var relation = Marionette.getOption(this, "relation");

                    if (!relation) {
                        this.model.set('structure_type', 'seriesItem');
                    }
                },
                serializeData: function () {
                    var relation = Marionette.getOption(this, "relation"),
                        data = relation ? this.model[relation + '_structure'] : this.model;
                    data = data.toJSON();

                    if (relation) {
                        data.comment = this.model.get('comment');
                        data.structure_type = 'relationshipItem';
                    }

                    return data;
                },
                editRelationship: function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    this.trigger("relationship:edit", this.model);
                },
                exportStructure: function(e){
                    e.stopPropagation();
                    e.preventDefault();

                    this.trigger("structure:export", this.model);
                },
                editClicked: function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    this.trigger("structure:edit", this.model);
                },
                deleteClicked: function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    this.trigger("structure:delete", this.model);
                },
                flash: function (cssClass) {
                    var $view = this.$el;
                    $view.hide().toggleClass(cssClass).fadeIn(800, function () {
                        setTimeout(function () {
                            $view.toggleClass(cssClass);
                        }, 500);
                    });
                },

                onRender: function () {
                    var relation = Marionette.getOption(this, "relation"),
                        //  todo - separate with different MVVM
                        relatedModel = relation && this.model[ relation + '_structure'];

                    if (relation) {
                        this.model.set({
                            'chemical_entity_id': relatedModel.get('chemical_entity_id'),
                            nvp: relatedModel.get('nvp'),
                            structure: relatedModel.get('structure')
                        });
                        if(!Marionette.getOption(this, "editable")) {
                            this.$el.find('.glyphicon-pencil').remove();
                        }
                    }

                    this.renderStructure({
                        imgWidth: 130,
                        imgHeight: 130
                    });
                },

                onShow: function () {
                    var $view = this.$el;
                    var $title = $view.find('.item-title');
                    var relation = Marionette.getOption(this, "relation");
                    var tagsRelated = relation ? this.model[relation + '_structure'].get('tags') : this.model.get('tags');
                    var chemicalName = this.model.get("chemical_entity_name");
                    var displayName = this.model.get("displayed_name") === chemicalName ? "" : 'preferred name: ' + chemicalName;


                    if ($title.find('span').width() > $title.width()) {
                        displayName = $title.attr('title') + ' ' + displayName;
                        $title
                            .attr('title', displayName)
                            .tooltip({
                                html: true
                            });
                    } else {
                        $title
                            .attr('title', displayName);
                    }

                    tags.showTags({
                        tags: tagsRelated,
                        item: $view.find('.item-tags')
                    });
                }
            });

            var NoStructureView = Marionette.ItemView.extend({
                template: addStructureButtonTpl,
                className: "item-block item-new",
                attributes: {
                    "data-element": "item-new"
                }
            });

            var EmptyStructureView = Marionette.ItemView.extend({
                template: EmptyStructureViewTpl,
                initialize: function () {
                    if (Marionette.getOption(this, "relation")) {
                        this.template = relationshipItemEmptyTpl;
                    }
                }
            });
            /**
             * Setting view for structures slider
             * @class StructureListSlider
             * @constructor
             * @extends Marionette.CompositeView
             */
            View.StructureListSlider = Marionette.CompositeView.extend({
                template: structureListSliderTpl,
                emptyView: NoStructureView,
                events: {
                    "click [data-action='addStructureSlider']": "addStructureClicked"
                },
                addStructureClicked: function (e) {
                    e.preventDefault();

                    this.trigger("structure:add", 'first');
                },
                childViewContainer: '.slide-wrap',
                childView: View.StructureListItem,

                //  TODO - dirty hacks
                initialize: function () {
                    this.listenTo(this.collection, "add remove", function () {
                        this.hideSlider(this.collection.models.length);
                    });
                },
                toggleSlider: function () {
                    var $slider = this.$el.find('.slide-inner').parent();

                    if (this.collection.length) {
                        $slider.removeClass("slide-empty");
                    } else {
                        $slider.addClass("slide-empty");

                        if (!Marionette.getOption(this, "editable")) {
                            this.$el.find('[data-element="item-new"]')
                                .html('There are no structures');
                        }
                    }
                },
                onAddChild: function (childView) {
                    this.toggleSlider();
                },
                onRemoveChild: function (childView) {
                    this.toggleSlider();
                },
                //  TODO: huge refactoring is needed
                hideSlider: function(length){
                    var sliderWidth = this.$el.find('.slide-inner').width();
                    var $item = this.$el.find('.item');
                    var itemsLength = length ? length : $item.length;

                    if (itemsLength*($item.width()+12) < sliderWidth) {
                        this.$el.find('.slide-control').hide();
                    } else {
                        this.$el.find('.slide-control').show();
                    }
                },
                onShow: function () {
                    var that = this;
                    if (!Marionette.getOption(this, "editable")) {
                        this.$el.find('[data-element="item-new"]').html('No structures in series');
                    }
                    $(window).resize(function () {
                        that.hideSlider();
                    });
                    this.hideSlider();

                    function slide_prev() {
                        var w = that.$el.find('.slide-wrap');

                        if (parseInt(w.css('left')) < 0) {
                            w.css('left', '+=192');
                        }
                    }
                    function slide_next() {
                        var w = that.$el.find('.slide-wrap');

                        w.css('left', '-=192');
                    }
                    var w = this.$el.find('.slide-wrap');
                    var wItem = this.$el.find('.item').width();

                    w.width(this.$el.find('.slide-inner .slide-wrap .item').size() * wItem);

                    this.$el.find('.prev').on('click', function () {
                        slide_prev();
                    });
                    this.$el.find('.next').on('click', function () {
                        slide_next();
                    });

                    this.$el.hide().fadeIn();
                }
            });

            View.NVPListItem = CommonViews.StructureItemView.extend({
                className: "item-block",
                template: nvpList,
                ui: {
                    image: '[data-element="image-container"]'
                },
                events: {
                    "click .js-edit": "editClicked",
                    "click .js-delete": "deleteClicked"
                },
                onRender: function () {
                    this.renderStructure();
                }
            });

            View.NVPSimpleList = Marionette.CollectionView.extend({
                className: "slide slide-scroll",
                childView: View.NVPListItem,

                initialize: function () {
                    this.listenTo(this.collection, "reset", function () {
                        this.appendHtml = function (collectionView, childView, index) {
                            collectionView.$el.after(childView.el);
                        };
                    });
                },
                onShow: function () {
                    this.$el.hide().fadeIn();
                }
            });

            /**
             * Setting views collection for structure with tags in series
             * @class SourceListDetailed
             * @constructor
             * @extends Marionette.CollectionView
             */
            View.SeriesList = Marionette.CollectionView.extend({
                className: "panel panel-default",
                childView: View.StructureListItem,
                emptyView: EmptyStructureView,
                events: {
                    'click [data-action="createNewStructure"]': 'createFirstStructure'
                },
                createFirstStructure: function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    this.trigger("structure:add", 'first');
                },
                onRender: function () {
                    this.appendHtml = function (collectionView, childView, index) {
                        collectionView.$el.prepend(childView.el);
                    };
                }
            });
        });

        return CSF.StructureApp.List.View;
    });
