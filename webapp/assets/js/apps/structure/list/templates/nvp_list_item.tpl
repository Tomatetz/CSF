<span class="compound">
    <span class="item-header">
        <span class="item-icon"></span>
        <span class="item-title"  data-toggle="tooltip" data-placement="top" title="<%= displayed_name %>">
            <span><%= displayed_name %></span>
        </span>
    </span>
    <% if(structure){ %>
    <span class="item-img" data-element="image-container"><img src="" alt="..."></span>
    <% } else { %>
    <span class="item-img" style="color: #FF1B1B">Error: Structure not found</span>
    <% } %>
    <span class="item-footer">
    </span>
</span>