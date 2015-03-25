<form>
    <div class="form-horizontal">
        <div class="form-group">
            <label class="control-label col-sm-4">Relationships:</label>
            <div class="col-sm-8 control-text">
                <a href="Add relationship" class="icon-link-primary"
                   data-action="showRelationship"><span class="glyphicon glyphicon-plus font12"></span> Add relationship</a>
            </div>
        </div>
    </div>
    <div class="panel panel-primary" data-element="relationship-form" style="display:none;">
        <div class="form-group">
            <input type="hidden" value="other" name="type">

            <label class="control-label">This structure derived from:</label>
            <div data-element="derives-from" class="form-control input-sm derivesFrom" disabled></div>
        </div>
        <div class="form-group">
            <label class="control-label">Add reasons:</label>
            <div data-element="relationship-reason" class="form-control input-sm"></div>
        </div>

        <div class="text-right">
            <button data-element="addRelationship"
                    type="button" class="btn btn-sm btn-default btn-primary" data-loading-text="Adding relationship">Add relationship</button>
            <button data-element="cancel"
                    type="button" class="btn btn-sm btn-default">Cancel</button>
        </div>

    </div>
</form>

<form data-element="relationship-list" class="source-list"></form>