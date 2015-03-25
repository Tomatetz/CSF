<% if (tag_definition.degree) { %>
    <span><%= tag_definition.name %></span>
    <span class="label label-default label-sm"
          style="background-color: <%= tag_definition.color %>;"><%= tag_definition.degree %></span>
<% } else { %>
    <span class="tag-item-wo-border"
          style="background-color: <%= tag_definition.color %>;"><%= tag_definition.long_name %></span>
<% } %>