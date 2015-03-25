define(["marionette", "bootstrap"], function(Marionette){
    $.fn.modal.Constructor.prototype.enforceFocus = function(){}

    Marionette.Region.Dialog = Marionette.Region.extend({
        onShow: function(view){
            this.listenTo(view, "dialog:close", this.closeDialog);
            this.$el.find('[data-element="modal"]').modal();
            this.$el.find('[data-element="modal"]').find('.modal-title').text(view.title);
            this.$el.find('[data-element="modal"]').find('.modal-body').text(view.body);
            if(view.buttonTitle){
                this.$el.find('[data-element="modal"]').find('.js-submit').html(view.buttonTitle);
            }
            this.$el.find('[data-element="modal"]').addClass(view.globalclass);
        },

        closeDialog: function(){
            this.stopListening();
            this.$el.find('[data-element="modal"]').modal('hide');
            return this.$el.find('[data-element="modal"]');
        }
    });

    return Marionette.Region.Dialog;
});