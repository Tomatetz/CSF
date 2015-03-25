<div data-element="modal" data-backdrop="static" class="modal" role="dialog" xmlns="http://www.w3.org/1999/html">
    <div class="modal-dialog" style="width:560px">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h2 class="modal-title">Draw structure</h2>
            </div>
            <div class="modal-body">
                <div class="row">
                    <form>
                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-8">
                                    <input class="form-control input-sm showMolecule" placeholder="Enter NVP to start your own drawing (optional)" type="text" style="margin-left: 10px;">
                                    <p class="help-block" id="wrongNVP" style="color:#e44c16; display:none;" data-error>NVP not found. Please check spelling.</p>
                                </div>
                                <div class="col-md-4" style="width:175px">
                                    <button type="button" class="btn btn-sm btn-default btn-block js-getMol" data-loading-text="Getting...">Get</button>
                                </div>
                            </div>
                        </div>
                        <div data-form="molecule" style="margin: 0 10px;"></div>
                    </form>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary js-submit" data-loading-text="Updating...">Save updates</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>