<span class="glyphicon glyphicon-btn glyphicon-info-sign"
      data-toggle="tooltip" data-placement="right"
      title="<h3>Series details</h3>
            Contains <%= number_of_scaffolds %> scaffolds<br />
            Contains <%= number_of_compounds %> compounds
            <dl class='dl-horizontal dl-horizontal-mdl'>
                <dt>Created:</dt><dd><%= moment(created_date).format('ll') %></dd>
                <dt>by:</dt><dd><%= created_by.name %></dd>
                <dt>Last modified:</dt><dd><%= moment(modified_date).format('ll') %></dd>
                <dt>by:</dt><dd><%= modified_by.name %></dd>

                <% if (series_description != '') { %>
                    <dt>Description:</dt><dd><%= series_description %></dd>
                <% } %>
            </dl>">
        </span>
<% if (number_of_compounds + number_of_scaffolds != 0) { %>
    <% if (editable) { %>
    <span class="glyphicon glyphicon-btn glyphicon-plus" data-toggle="tooltip" data-placement="right"
          title="Click to add structure" data-action="addStructure"></span>
    <% } %>
<% } %>
<% if(editable){ %>
<span class="glyphicon glyphicon-btn glyphicon-pencil" data-action="edit" data-toggle="tooltip" data-placement="right"
      title="Click to edit series"></span>
<span class="glyphicon glyphicon-btn glyphicon-trash" data-action="delete" data-toggle="tooltip" data-placement="right"
      title="Click to delete series"></span>
<% } %>