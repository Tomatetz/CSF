<% if (name === "Back") {%>
<span class="icon-link pull-right goBack"
      data-action="back"><span class="glyphicon glyphicon-chevron-left"></span> <%= name %></span>
<% } else {%>
        <% if (active) { %>
            <% if (name === "Home") { %>
                <span class="home-button-inactive">
                    <span class="glyphicon glyphicon-home"></span> <%= name %></span>
            <% } else {%>
                <span data-toggle="breadcrumb-tooltip" data-placement="bottom"
                      data-title="<%= name %>"><%= name %></span>
            <% } %>
        <% } else { %>
            <% if (name === "Home") { %>
                <a href="<%= link %>#projects" class="home-button-active"><span class="glyphicon glyphicon-home"></span></a>
                <% } else {%>
                    <a href="<%= link %>"
                       data-toggle="breadcrumb-tooltip" data-placement="bottom" data-title="<%= name %>"><%= name %></a>
                <% } %>
            <% } %>
<% } %>
