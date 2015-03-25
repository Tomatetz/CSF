<input name="<%= id %>[name]" type="hidden" value="<%= name %>">
<input name="<%= id %>[source_type]" type="hidden" value="<%= source_type %>">
<input name="<%= id %>[external_id]" type="hidden" value="<%= external_id %>">
<% if(comment){ %>
<input name="<%= id %>[comment]" type="hidden" value="<%= comment %>">
<% } %>
<span class="label label-default pull-left"><%= title %></span>
<span class="pull-right">
    <% if(comment){ %>
    <span class="glyphicon glyphicon-btn glyphicon-file" data-toggle="tooltip" data-placement="bottom" title="<%= comment %>"></span>
    <% } %>
    <span class="glyphicon glyphicon-btn glyphicon-remove" data-action="removeSource"></span>
</span>

<% if(source_type=='other' || source_type=='assay') {%>
    <div data-toggle="title-tooltip" data-placement="bottom" title="<%= name %>" target="_blank"><span><%= name %></span></div>
<% }  else { %>
    <a href="<%= link %>" data-toggle="title-tooltip" data-placement="bottom" title="<%= name %>" target="_blank"><span><%= name %></span></a>
<% } %>