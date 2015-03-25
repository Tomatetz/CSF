<span class="glyphicon glyphicon-btn glyphicon-pencil pull-right" data-action="edit-source" title="<%= source_id %>"></span>
<% if(source_type=='other' || source_type=='assay') {%>
    <div data-toggle="title-tooltip" data-placement="top" title="<%= name %>" target="_blank"><span style="font-size:12px;"><%= name %></span></div>
<% }  else { %>
    <a href="<%= link %>" style="font-size:12px;" data-toggle="title-tooltip" data-placement="top" title="<%= name %>" target="_blank"><span><%= name %></span></a>
<% } %>
<% if (comment) {%>
    <span style="display:block"><span class="glyphicon glyphicon-file pull-left" style="margin-left:10px;"></span><div class="source-comment" style="padding-left: 28px;font-size:11px;"><%= comment %></div></span>
<% } %>