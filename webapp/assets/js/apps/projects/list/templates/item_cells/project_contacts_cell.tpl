<% _.each(items, function(item, index){
        var delimeter = (index === items.length-1) ? '' : ', ';
%>
    <span rel="<%= item.id %>"
          class="person-preview"><%= item.name %><%= delimeter %>
    </span>
<% }) %>
