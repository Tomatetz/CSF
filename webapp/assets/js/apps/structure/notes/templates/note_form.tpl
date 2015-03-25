<div data-element="modal" data-backdrop="static" class="modal" role="dialog" xmlns="http://www.w3.org/1999/html">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h2 class="modal-title">Add note</h2>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" role="form" data-fieldsets="">
                    <fieldset data-fields="">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Note:</label>
                            <div class="col-sm-10">
                                <textarea class="height150 form-control" name="note" ><%= note_text %></textarea>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
            <div class="modal-footer">
                <span class="btn-link space-r js-delete" style="display:none;">Delete note</span>
                <button type="button" class="btn btn-default js-submit" data-action="submit-save" data-loading-text="Updating...">Add</button>
                <button type="button" class="btn btn-default" data-dismiss="modal" data-action="cancel-delete">Cancel</button>
            </div>
        </div>
    </div>
</div>