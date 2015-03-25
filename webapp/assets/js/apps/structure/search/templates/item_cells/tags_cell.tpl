<% if(tags.length!== 0){ %><% _.each(tags , function(el, i){ %>
<% if(el.tag_definition.degree){ %>
<span class="label label-default label-bordered" style="padding-right:1px"><%= el.tag_definition.name %> <span class="label label-sm label-default" style="background-color:<%= el.tag_definition.color %>"><%= el.tag_definition.degree %> </span></span>
<%} else { %> <span class="label label-default label-bordered" style="background-color:<%= el.tag_definition.color %>;"><%= el.tag_definition.name %></span> <% }%>
<% }) %>
<%} else { %> &nbsp; <% }%>