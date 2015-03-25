<div data-element="modal" data-backdrop="static" class="modal" role="dialog" xmlns="http://www.w3.org/1999/html">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h2 class="modal-title">Project info - <%= project_name %></h2>
            </div>
            <div class="modal-body">
                <% if(ptt_code) { %>
                <div class="row">
                    <div class="col-md-4">
                        <label class="label-block label-secondary">Project code</label>
                        <%= ptt_code %><br>
                        <a target="_blank" href="http://nimbus.nibr.novartis.intra/SitePages/StatusReportViewer.aspx?STATUSREPORT_ID=<%= ptt_code %>" class="icon-link"><span class="glyphicon glyphicon-btn glyphicon-share"></span> Nimbus</a>
                    </div>
                    <div class="col-md-4">
                        <label class="label-block label-secondary">Targets</label>
                        <% if(target.length) { _.each(target,function(item, pos) { %>
                            <% if (item.target_detail.value) {%>
                                <span data-title="<%= item.target_pref_name %>" rel="<%= item.metastore_id %>" class="target-preview">
                                <% if (pos) {%>
                                ,
                                <%}%>
                                <%= item.target_detail.value %></span>
                            <%}%>
                        <% })} %>
                    </div>
                    <div class="col-md-4">
                        <label class="label-block label-secondary target">Target types</label>
                        <% if(target.length) {
                        var lastTarget = target[0].target_type.split('/').pop(); %>
                        <span class="target" data-title="<%= target[0].target_pref_name %>" data-placement="top" ><%= lastTarget %></span>
                        <%}%>
                    </div>
                </div>
                <br>
                <% } %>
                <div class="row">
                    <div class="col-md-4">
                        <label class="label-block label-secondary">Added on</label>
                        <% if(created_date != "") { %><%= moment(created_date).format('ll') %><% } else { %> N/A <% } %>
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
                        <label class="label-block label-secondary">Project contacts</label>
                        <% if(project_contacts.length) { _.each(project_contacts, function(contact) {
                        var item = contact.name;
                        if (i < project_contacts.length - 1) item += ','; %>
                        <span rel="<%= contact.id %>" class="person-preview"><%= item %></span>
                        <% })} else { %> --- <% } %>

                    </div>
                    <div class="col-md-4">
                        <label class="label-block label-secondary">Project editors</label>
                        <% if(project_editors.length) { for(var i in project_editors) {
                        var item = project_editors[i].name;
                        if (i < project_editors.length - 1) item += ','; %>
                        <span rel="<%= project_editors[i].id %>" class="person-preview"><%= item %></span>
                        <% }} else { %> --- <% } %>
                    </div>
                    <div class="col-md-4">
                        <label class="label-block label-secondary"># Series</label>
                        <%= number_of_series %>
                    </div>
                </div>
                <br>
                <label class="label-block label-secondary">Description</label>
                <% if(project_description != "") { %><%= project_description %><% } else { %> --- <% } %>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
