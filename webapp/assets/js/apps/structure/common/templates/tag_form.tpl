
<div data-element="modal" data-backdrop="static" class="modal" role="dialog" xmlns="http://www.w3.org/1999/html">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Edit tags</h2>
            </div>
            <div class="modal-body">
                <form class="form-horizontal">
                    <div class="form-group">
                                <label class="control-label col-sm-1">Tags:</label>
                                <div class="col-sm-10 control-text">
                                <div id="select"></div>
                                </div>
                    </div>
                </form>

                <form data-element="tag-list" class="source-list">
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal" data-action="submit-updateTag">Update tags</button>
                <button type="button" class="btn btn-default" data-dismiss="modal" data-action="cancel-delete">Cancel</button>
            </div>
        </div>
    </div>
</div>