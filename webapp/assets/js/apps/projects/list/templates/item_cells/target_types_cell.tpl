<% if( target[0] !=undefined){
    _.each(target, function(targetItem){
        if(targetItem.target_type) { %>
            <span class="target" data-title="<%= targetItem.target_pref_name %>" data-placement="top"><%= targetItem.target_type.split('/').pop() %></span>
        <%}
    })
} %>
