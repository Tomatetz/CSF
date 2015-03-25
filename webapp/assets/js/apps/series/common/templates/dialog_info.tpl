<div data-element="modal" data-backdrop="static" class="modal" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h2 class="modal-title">Series info - <%= series_name %></h2>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-4">
                        <label class="label-block label-secondary">Project name</label>
                        <%= project.project_name %>
                    </div>
                    <div class="col-md-4">
                        <label class="label-block label-secondary">Added on</label>
                        <% if(created_date != "") { %><%= moment(created_date).format('ll') %><% } else { %> N/A <% } %>
                    </div>
                    <div class="col-md-4">
                        <label class="label-block label-secondary">Added by</label>
                        <% if(created_by.name != "") { %>
                        <span rel="<%= created_by.id %>" class="person-preview"><%= created_by.name %></span>
                        <% } else { %> N/A <% } %>
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col-md-4">
                        <label class="label-block label-secondary">Series status</label>
                        <% if(series_status && series_status.name != "") {  %><%= series_status.name %><% } else { %> N/A <% } %>
                    </div>
                    <div class="col-md-4">
                        <label class="label-block label-secondary">Last modified</label>
                        <% if(modified_date != "") { %><%= moment(modified_date).format('ll') %><% } else { %> N/A <% } %>
                    </div>
                    <div class="col-md-4">
                        <label class="label-block label-secondary">Edited by</label>
                        <% if(modified_by.name != "") { %>
                        <span rel="<%= modified_by.id %>" class="person-preview"><%= modified_by.name %></span>
                        <% } else { %> N/A <% } %>
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col-md-4">
                        <label class="label-block label-secondary"># Compounds</label><%= number_of_compounds %>
                    </div>
                    <div class="col-md-4">
                        <label class="label-block label-secondary"># Scaffolds</label><%= number_of_scaffolds %>
                    </div>
                    <div class="col-md-4">
                    </div>
                </div>
                <br>
                <label class="label-block label-secondary">Description</label>
                <% if (series_description != "") { %>
                    <%= series_description %>
                <% } else { %> --- <% } %>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
