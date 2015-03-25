<a href="#/projects/<%= id %>"
   <% if(toBlank) { %>target="_blank"<% } %>
   data-project-id="<%= id %>"
   style="overflow: hidden; text-overflow: ellipsis; height:100px;">
    <% if (isFull) { %>
        <span><%= name %></span>
    <% } else {%>
        <span class="target"
              data-title="<%= fullName %>" data-placement="top">
            <%= name %>...</span>
    <% }%>
</a>