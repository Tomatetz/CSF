<h4 style="margin-top:0"><%= message %></h4>
<%  function causeItemShow(causeEl, depth) { %>
    <% _.each(causeEl, function(element, index, list) { %>
        <% if(depth <= 2) { %>
            <% if(element.message && element.message.indexOf("SQLException") == -1 && element.message.indexOf("ORA-") == -1 ) { %>
                <p <% if(depth == 1) { %>
                        class='space-l'
                    <% } else if(depth == 2) { %>
                        class='space-2l'
                    <% } %> >
                    <%= element.message %>
                    <% if(element.suggestions) { %>
                        <% var suggestions = _.values(element.suggestions).join(" "); %>
                        <%= suggestions %>
                    <% } %>
                </p>
                <% if(element.cause) { %>
                     <% causeItemShow(element.cause, depth + 1); %>
                <% } %>
            <% } %>
        <% } %>
    <% }); %>
<%} %>
<% if(cause) { %>
    <% causeItemShow(cause, 0); %>
<% } %>
<% if(details) { %>
<% var elID = _.uniqueId('details-'); %>
<p class="collapse-btn bold collapsed" data-toggle="collapse" data-target="[data-id='<%= elID %>']">Details <span class="glyphicon glyphicon-chevron-down"></span></p>
<div class="collapse" data-id="<%= elID %>">
    <p>You may copy and paste the following information when requesting help:</p>
    <div class="panel panel-default">
        <p><b><%= details[0].text %></b></p>
        <p class="word-break">Url: <%= details[2].text %></p>
        <p class="word-break"><%= details[1].text %></p>
    </div>
</div>
<% } %>
