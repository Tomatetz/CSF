<div data-element="modal" data-backdrop="static" class="modal" role="dialog">

    <div class="add-new-structure-modal modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close"
                        data-dismiss="modal" aria-hidden="true">&times;</button>
                <h2 class="modal-title">Add new structure</h2>
            </div>
            <div class="modal-body">
               <div class="row">
                    <div class="col-md-6">
                        <div class="btn-group" data-toggle="buttons">
                            <a href="#nvptab"
                               data-toggle="tab"><label data-value="true"
                                                        class="btn btn-primary btn-sm active"><input type="radio" checked />Enter NVP(s)</label></a>
                            <a href="#drawtab"
                               data-toggle="tab"><label data-value="false"
                                                        class="btn btn-primary btn-sm"><input type="radio" />Draw structure</label></a>
                        </div>

                        <div class="tab-content">
                            <div class="tab-pane active"
                                 id="nvptab">
                                <div id="textAreaToggle">
                                    <textarea value="" type="text"
                                              class="form-control input-sm nvp-note"
                                              id="nvp-note" placeholder="Enter your NVP(s)"></textarea>

                                    <div class="nvp-adding_error alert alert-warning alert-dismissible" role="alert">
                                        <button type="button" class="close"
                                                data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                                        The listed NVPs were not added to the series. Please check the error messages on the right for further details.
                                    </div>

                                    <button class="btn btn-sm btn-default js-preview"
                                            disabled>Preview</button>
                                </div>
                                <div id="nvpPreviewToggle">
                                    <button class="btn btn-sm btn-default js-back-preview">Back</button>
                                </div>
                            </div>

                            <div class="tab-pane"
                                 id="drawtab">
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-md-8">
                                            <input class="form-control input-sm showMolecule"
                                                   placeholder="Enter NVP to start your own drawing" type="text">
                                            <p class="help-block"
                                               id="wrongNVP" data-error>NVP not found. Please check spelling.</p>
                                        </div>
                                        <div class="col-md-4">
                                            <button type="button" class="btn btn-sm btn-default btn-block js-getMol"
                                                    data-loading-text="Getting structure...">Get</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="col-md-6 rightSide">

                        <div class="panel panel-primary right-panel">
                            <div class="form-placeholder"></div>
                            <div class="source-subform-placeholder form-group"></div>
                            <div class="relationship-subform-placeholder form-group"></div>
                            <div class="tag-subform-placeholder form-group"></div>

                            <div class="form-horizontal"
                                 id="textField">
                                <div class="form-group row">
                                    <label class="control-label col-sm-4">Note: </label>
                                    <div class="col-sm-8 control-text">
                                        <textarea name="comment" class="form-control input-sm"
                                                  id="note"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="errors">
                        <ul id="errList"></ul>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary js-submit"
                        data-loading-text="Adding structure..."
                        data-element="saveButton">Add structure</button>
                <button type="button" class="btn btn-default"
                        data-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>

<div data-element="modal fade" data-backdrop="static" class="modal progress-bar-container" role="dialog" style="z-index: 1200">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title"
                    id="myModalLabel">Adding structures...</h4>
            </div>
            <div class="modal-body">
                <div class="progress">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default"
                        data-dismiss="progress-bar-container">Cancel</button>
            </div>
        </div>
    </div>
</div>