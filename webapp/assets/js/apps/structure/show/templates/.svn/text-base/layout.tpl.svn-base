<div class="panel panel-primary">
    <div class="clearfix" id="structure-name-region">
    </div>
    <div class="row">
        <div class="col-md-3">

            <div class="panel panel-item <%= item_type_id %>">
                <div class="panel-heading">
                    <span class="item-icon"></span>
                </div>
                <div class="panel-body" style="position: relative;">
                    <div class="controlPanel" style="position: absolute; top: 10px; right: 10px; width:20px;">
                        <span style="margin-bottom: 10px;" class="glyphicon glyphicon-btn glyphicon fa fa-files-o pull-right" data-action="export-structure" data-toggle="tooltip" data-placement="top" title="Copy structure"></span>
                        <% if(!nvp) { %><span class="glyphicon glyphicon-btn glyphicon-pencil pull-right" data-action="edit-structure" data-toggle="tooltip" data-placement="bottom" title="Edit structure"></span><% } %>
                    </div>
                    <div id="structure-image-region"></div>
                </div>
            </div>

            <div id="tags-region"></div>
            <div id="sources-region"></div>
            <div id="links-region"></div>

        </div>
        <div class="col-md-9">
            <div class="panel panel-primary clearfix">
                <div class="pull-left space-2r">
                    <b>Last modified</b>
                    <span rel="<%= modified_by.id %>" class="person-preview fake-link"><%= modified_by.name %></span> <%= moment(modified_date).format('ll') %>
                </div>
                <div class="pull-left space-2r">
                    <b>Added</b>
                    <span rel="<%= created_by.id %>" class="person-preview fake-link"><%= created_by.name %></span> <%= moment(created_date).format('ll') %>
                </div>
                <div class="pull-left space-2r">
                    <b>Project</b>
                    <a href="#projects/<%= project.project_id %>"><%= project.project_name %></a>
                </div>
                <div class="pull-left">
                    <b>Series</b>
                    <a href="#projects/<%= project.project_id %>/series/<%= series.series_id %>"><%= series.series_name %></a>
                </div>
            </div>
            <div class="row">
                <div class="col-md-8">
                    <div id="relationships-region"></div>
                </div>
                <div class="col-md-4">
                    <div id="notes-region"></div>
                </div>
            </div>
        </div>
    </div>
</div>