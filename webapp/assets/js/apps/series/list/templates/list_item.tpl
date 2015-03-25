<div class="series-list-item-ttl">
    <span class="label <% if(series_status && series_status.name == 'Active'){ %> label-active <% } else { %> label-disable <% } %>">&nbsp;</span>
    <h3 data-toggle="title-tooltip" data-placement="top" title="<%= series_name %>" data-series-name="<%= series_name %>">
        <a href="#projects/<%= project.project_id %>/series/<%= series_id %>"><%= series_name %></a>
    </h3>
</div>

<div class="series-list-item-inner">
    <div data-region="panel" class="series-list-btns"></div>
    <div data-region="structures" class="series-list-item-inner-c structuresRegion"></div>
</div>