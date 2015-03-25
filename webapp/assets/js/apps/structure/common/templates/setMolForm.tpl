
<form>
    <div class="form-group">
        <div class="row">
            <div class="col-md-8">
                <input class="form-control input-sm showMolecule" placeholder="Enter NVP to start your own drawing (optional)" type="text">
                <p class="help-block" id="wrongNVP" style="color:#e44c16; display:none;" data-error>NVP not found. Please check spelling.</p>
            </div>
            <div class="col-md-4">
                <button type="button" class="btn btn-sm btn-default btn-block js-getMol" data-loading-text="Getting structure...">Get</button>
            </div>
        </div>
    </div>
    <div data-form="molecule" ></div>
</form>
