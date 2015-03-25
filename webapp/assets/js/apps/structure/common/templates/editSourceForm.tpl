<div data-element="modal" data-backdrop="static" class="modal" role="dialog" xmlns="http://www.w3.org/1999/html">
    <div class="modal-dialog edit-source-modal">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h2 class="modal-title">Edit source</span></h2>
            </div>
            <div class="modal-body">
                <form class="form-horizontal" role="form" data-fieldsets="">
                    <fieldset data-fields="">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Name:</label>
                            <div class="col-sm-10">
                                <input value="<%= name %>" type="text" class="form-control input-sm" id="sourceName" placeholder="Enter name" disabled/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Note:</label>
                            <div class="col-sm-10">
                                <textarea value="" type="text" class="form-control input-sm" id="sourceNote" placeholder="Enter note" ><%= comment %></textarea>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
            <div class="modal-footer">
                <span id='removeSource' class='modal__delete-item'>Delete source</span>
                <button class="btn btn-primary sourceEdit-submit" data-loading-text="Updating...">Save updates</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>