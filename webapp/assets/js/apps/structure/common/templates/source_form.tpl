<form class="form-horizontal">
    <div class="form-group">
        <label class="control-label col-sm-4">Sources:</label>

        <div class="col-sm-8 control-text">
            <a href="Add source" class="icon-link-primary"
               data-action="showSource"><span class="glyphicon glyphicon-plus font12"></span> Add source</a>
        </div>

        <div class="col-md-8" data-element="source-form"
             style="display:none;">
            <select data-element="selectSource"
                    class="form-control input-sm">
                <option value="0">Select source type</option>
                <option value="source-Assay">Assay</option>
                <option value="source-eLN">eLN</option>
                <option value="source-Literature">Literature</option>
                <option value="source-Patent">Patent</option>
                <option value="source-Other">Other</option>
            </select>
        </div>
    </div>
</form>

<form data-element="source-Assay"
      class="source-form" style="display: none;">
    <div class="panel panel-primary">

        <input type="hidden" value="assay" name="source_type">

        <div class="form-group">
            <label class="control-label">Search assay:</label>
            <div class="row">
                <div class="col-md-10">
                    <div class="control-clear">
                        <input data-element="query" class="form-control input-sm" placeholder="assay, project" type="text" />
                        <span class="glyphicon glyphicon-btn glyphicon-remove" data-action="clearControl" style="display:none;"></span>
                    </div>
                </div>
                <div class="col-md-2">
                    <button data-element="find" type="button" class="btn btn-sm btn-default pull-right">Find</button>
                </div>
            </div>
        </div>

        <label class="form-data bold" data-element="result-amount" style="display:none;"></label>
        <div data-element="result" class="search-result"></div>

        <span class="icon-link-primary collapse-hide collapsed"
              data-toggle="collapse"
              data-target="[data-id='assay-note']"><span class="glyphicon glyphicon-file"></span>Add note</span>
        <div class="form-group collapse"
             data-id="assay-note">
            <label class="control-label">Note: </label>
            <textarea name="comment" class="form-control input-sm"></textarea>
        </div>

        <div class="text-right">
            <button data-element="addSource"
                    type="submit" class="btn btn-sm btn-primary" data-loading-text="Adding source">Add source</button>
            <button data-element="cancel"
                    type="button" class="btn btn-sm btn-default">Cancel</button>
        </div>

    </div>
</form>

<form data-element="source-eLN"
      class="source-form" style="display: none;">
    <div class="panel panel-primary">

        <input type="hidden" value="eln concept" name="source_type">

        <div class="form-group">
            <label class="control-label">Enter eLN concept statement ID:</label>
            <div class="control-clear">
                <input data-element="query" class="form-control input-sm" placeholder="ID" type="text" />
                <span class="glyphicon glyphicon-btn glyphicon-remove" data-action="clearControl" style="display:none;"></span>
            </div>
        </div>

        <label class="form-data bold" data-element="result-amount" style="display:none;"></label>
        <div data-element="result" class="search-result"></div>

        <span class="icon-link-primary collapse-hide collapsed"
              data-toggle="collapse"
              data-target="[data-id='eln-note']"><span class="glyphicon glyphicon-file"></span>Add note</span>
        <div class="form-group collapse"
             data-id="eln-note">
            <label class="control-label">Note: </label>
            <textarea name="comment" class="form-control input-sm"></textarea>
        </div>

        <div class="text-right">
            <button data-element="addSource"
                    type="button" class="btn btn-sm btn-primary">Add Source</button>
            <button data-element="cancel"
                    type="button" class="btn btn-sm btn-default">Cancel</button>
        </div>
    </div>
</form>

<form data-element="source-Literature"
      class="source-form" style="display: none;">

    <div class="panel panel-primary">

        <input type="hidden" value="literature" name="source_type">

        <div class="form-group">
            <label class="control-label">Search literature:</label>
            <div class="row">
                <div class="col-md-8">
                    <input data-element="query" class="form-control input-sm" placeholder="DOI, author, article title, journal title" type="text" />
                </div>
                <div class="col-md-2">
                    <input data-element="year" class="form-control input-sm" type="text" placeholder="YYYY" type="text" />
                </div>
                <div class="col-md-2">
                    <button data-element="find" type="button" class="btn btn-sm btn-default btn-block">Find</button>
                </div>
            </div>
        </div>

        <label class="form-data bold" data-element="result-amount" style="display:none;"></label>
        <div data-element="result" class="search-result"></div>

        <span class="icon-link-primary collapse-hide collapsed"
              data-toggle="collapse"
              data-target="[data-id='literature-note']"><span class="glyphicon glyphicon-file"></span>Add note</span>
        <div class="form-group collapse"
             data-id="literature-note">
            <label class="control-label">Note: </label>
            <textarea name="comment" class="form-control input-sm"></textarea>
        </div>

        <div class="text-right">
            <button data-element="addSource"
                    type="button" class="btn btn-sm btn-primary" data-loading-text="Add">Add Source</button>
            <button data-element="cancel"
                    type="button" class="btn btn-sm btn-default">Cancel</button>
        </div>

    </div>

</form>

<form data-element="source-Patent"
      class="source-form" style="display: none;">
    <div class="panel panel-primary">

        <input type="hidden" value="patent" name="source_type">

        <div class="form-group">
            <label class="control-label">Enter Patent Publication ID:</label>
            <div class="control-clear">
                <input data-element="query" class="form-control input-sm" placeholder="ID" type="text" />
                <span class="glyphicon glyphicon-btn glyphicon-remove" data-action="clearControl" style="display:none;"></span>
            </div>
        </div>

        <label class="form-data bold" data-element="result-amount" style="display:none;"></label>
        <div data-element="result" class="search-result"></div>

        <span class="icon-link-primary collapse-hide collapsed"
              data-toggle="collapse"
              data-target="[data-id='patent-note']"><span class="glyphicon glyphicon-file"></span>Add note</span>
        <div class="form-group collapse"
             data-id="patent-note">
            <label class="control-label">Note: </label>
            <textarea name="comment" class="form-control input-sm"></textarea>
        </div>

        <div class="text-right">
            <button data-element="addSource"
                    type="button" class="btn btn-sm btn-primary">Add Source</button>
            <button data-element="cancel"
                    type="button" class="btn btn-sm btn-default">Cancel</button>
        </div>

    </div>
</form>

<form data-element="source-Other"
      class="source-form" style="display: none;">
    <div class="panel panel-primary">

        <input type="hidden" value="other" name="source_type">

        <div class="form-group">
            <label class="control-label">Enter Other Source:</label>
            <div class="control-clear">
                <textarea data-element="query" class="form-control input-sm" placeholder="" /></textarea>
                <span class="glyphicon glyphicon-btn glyphicon-remove" data-action="clearControl" style="display:none;"></span>
            </div>
        </div>

        <span class="icon-link-primary collapse-hide collapsed"
              data-toggle="collapse"
              data-target="[data-id='other-note']"><span class="glyphicon glyphicon-file"></span>Add note</span>
        <div class="form-group collapse"
             data-id="other-note">
            <label class="control-label">Note: </label>
            <textarea name="comment" class="form-control input-sm"></textarea>
        </div>

        <div class="text-right">
            <button data-element="addSource"
                    type="button" class="btn btn-sm btn-primary">Add Source</button>
            <button data-element="cancel"
                    type="button" class="btn btn-sm btn-default">Cancel</button>
        </div>

    </div>
</form>

<form data-element="source-list" class="source-list"></form>