<div class="clearfix">
        <h1 class="pull-left">
            <%= project_name %>
        </h1>
        <div class="btn-group space-l pull-left">
            <button type="button" class="btn btn-sm btn-default" data-action="show-project-info" data-toggle="tooltip" data-placement="top" title="<span class='nowrap'>Show project info</span>"><span class="glyphicon glyphicon-info-sign"></span></button>
            <% if(editable){ %>
            <button type="button" class="btn btn-sm btn-default" data-action="edit-project" data-toggle="tooltip" data-placement="top" title="<span class='nowrap'>Edit project</span>"><span class="glyphicon glyphicon-pencil"></span></button>
            <button type="button" class="btn btn-sm btn-default" data-action="new-series" data-toggle="tooltip" data-placement="top" title="<span class='nowrap'>Add series</span>"><span class="glyphicon glyphicon-plus"></span></button>
            <% } %>
        </div>

            <div class="results-container"></div>
</div>