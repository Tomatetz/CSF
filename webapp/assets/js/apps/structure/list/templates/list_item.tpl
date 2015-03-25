<% if(structure_type === 'relationshipItem') { %>
<span class="item-btns pull-right">
        <% if (editable) { %>
            <span class="glyphicon glyphicon-btn glyphicon-pencil js-edit editRelationship" data-toggle="tooltip"
                  data-placement="top" title="Edit relationship"></span>
        <% } %>
    </span>
<% } %>
<a class="item <%= item_type_id %>" href="#projects/<%= project.project_id %>/series/<%= series.series_id %>/<%= item_type_id %>s/<%= chemical_entity_id %>">
    <span class="item-header">
        <span class="item-icon"></span>
        <span class="item-title"
              data-toggle="tooltip" data-placement="bottom" title="<%= displayed_name %>">
            <span><%= displayed_name %></span>
        </span>
    </span>
    <span class="item-img" data-element="image-container"><img src="" alt="..."></span>
    <span class="item-footer" style="border-top:none;">
        <div class="item-tags"></div>

        <div class="clearfix"></div>
            <span class="footer-buttons-container">
                    <% if(editable){ %>
                    <span class="glyphicon glyphicon-btn glyphicon-trash pull-right js-delete <% if(structure_type === 'relationshipItem'){ %> hidden  <% } %>"
                          data-toggle="tooltip" data-placement="right" title="Delete structure"></span>
                    <% } %>
                    <span class="glyphicon glyphicon-btn fa fa-files-o pull-right js-export" data-action="export"
                          data-toggle="tooltip" data-placement="left" title="Copy structure"></span>
            </span>
    </span>
</a>

<% if(structure_type === 'relationshipItem'){ %>
<div class="item__reasons">
    <% if(comment){ %>
    <% var comments = comment.split(','); for(var i in comments){ %>
                <span class="label label-default label-bordered"
                      style="background-color:#F2F2F2; margin-top:8px; white-space: normal;max-width: 180px; word-wrap: break-word; text-align: left;">
                    <%= comments[i] %>
                </span>
    <% } %>
    <% } %>
</div>
<% } %>