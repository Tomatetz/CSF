<% if (tag_definition.degree) { %>
    <span class="label label-default label-bordered"
          style="padding-right: 1px;"><%= tag_definition.name %>
        <span class="label label-sm label-default"
              style="background-color: <%= tag_definition.color %>;"><%= tag_definition.degree %></span>
    </span>
<% } else { %>
    <span class="label label-default label-bordered"
          style="background-color: <%= tag_definition.color %>;"><%= tag_definition.name %></span>
<% } %>