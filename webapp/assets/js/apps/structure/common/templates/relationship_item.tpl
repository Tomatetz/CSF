<input name="<%= id %>[parent_id]" class="relationship_item" type="hidden" value="<%= parent_id %>">
<% if(comment){ %>
<input name="<%= id %>[comment]" type="hidden" value="<%= comment %>">
<% } %>
<span class="label label-default pull-left">Derived from</span>
<span class="pull-right">
    <% if(comment){ %>
    <span class="glyphicon glyphicon-btn glyphicon-file" data-toggle="tooltip" data-placement="top" title="<%= comment %>"></span>
    <% } %>
    <span class="glyphicon glyphicon-btn glyphicon-remove" data-action="removeRelationship"></span>
</span>
<span data-toggle="title-tooltip" data-placement="top" title="<%= name %>" target="_blank"><span><%= name %></span></span>
