<div data-element="modal" data-backdrop="static" class="modal" role="dialog" xmlns="http://www.w3.org/1999/html">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h2 class="modal-title">Add link</h2>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" role="form" data-fieldsets="">
                    <fieldset data-fields="">
                        <div class="form-group">
                            <label class="col-sm-3 control-label">Url:</label>
                            <div class="col-sm-9">
                                <input class="form-control" name="urlTemplate" value="<%= urlTemplate %>">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">Text to display:</label>
                            <div class="col-sm-9">
                                <input class="form-control" name="nameTemplate" value="<%= nameTemplate %>">
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
            <div class="modal-footer">
                <span class="btn-link space-r js-delete" style="display:none;">Delete link</span>
                <button type="button" class="btn btn-default js-submit" data-action="submit-save" data-loading-text="Updating...">Add</button>
                <button type="button" class="btn btn-default" data-dismiss="modal" data-action="cancel-delete">Cancel</button>
            </div>
        </div>
    </div>
</div>