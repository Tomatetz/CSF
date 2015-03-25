<div class="comment">
    <span class="btn-link"><% if(modified_by.name){ %>
        <span rel="<%= modified_by.id %>" class="person-preview"><%= modified_by.name %></span>
        <% } else { %><%= created_by.name %><% } %></span>
    <span class="date"><%= moment(created_date).format('ll') %></span>
    <% if(editable){ %>
        <span class="glyphicon glyphicon-btn glyphicon-pencil js-edit"></span>
    <% } %>
    <p><%= note_text %></p>
    <% if(modified_date && modified_date != created_date){ %>
        <span class="date">Last modified: <%= moment(modified_date).format('ll') %></span>
    <% } %>
</div>



