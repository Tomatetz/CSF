<div class="row">
    <div class="col-md-8">
        <div class="clearfix">
            <h1 class="pull-left">
                <%= series_name %>
            </h1>
            <span class="panel__series_status label space-l pull-left <% if(series_status && series_status.name == 'Active'){ %> label-active <% } else { %> label-disable <% } %>" >&nbsp;</span>
            <div class="btn-group space-l pull-left">
                <button type="button" class="btn btn-sm btn-default"
                        data-action="show-series-info"
                        data-toggle="tooltip" data-placement="top"
                        title="<span class='nowrap'>Show series info</span>"><span class="glyphicon glyphicon-info-sign"></span></button>
                <% if (editable) { %>
                <button type="button" class="btn btn-sm btn-default"
                        data-action="edit-series"
                        data-toggle="tooltip" data-placement="top"
                        title="<span class='nowrap'>Edit series</span>"><span class="glyphicon glyphicon-pencil"></span></button>
                <button type="button" class="btn btn-sm btn-default"
                        data-action="new-structure"
                        data-toggle="tooltip" data-placement="top"
                        title="<span class='nowrap'>Add new structure</span>"><span class="glyphicon glyphicon-plus"></span></button>
                <% } %>

                <button id="filter-menu"
                        role="button"
                        data-toggle="dropdown" data-target="#"
                        class="btn btn-sm panel__filter">
                    <span class="glyphicon glyphicon-filter"
                          data-toggle="tooltip" data-placement="top"
                          title="" data-original-title="Filter structures"></span><span class="caret"></span>
                </button>
                <ul class="dropdown-menu panel__filter--dropdown"
                    role="menu">
                    <label>Filter by</label>
                    <form role="form">
                        <li>
                            <!-- TODO use separate template -->
                            <div class="form-group">
                                <label>Search within</label>
                                <div class="btn-group btn-group-justified"
                                     data-toggle="buttons" data-element="type">
                                    <label class="btn btn-sm btn-default active">
                                        <input type="radio" name="type"
                                               id="All" value="All" checked> All
                                    </label>
                                    <label class="btn btn-sm btn-default">
                                        <input type="radio" name="type"
                                               id="Compounds" value="compounds"> Compounds
                                    </label>
                                    <label class="btn btn-sm btn-default">
                                        <input type="radio" name="type"
                                               id="Scaffolds" value="scaffolds"> Scaffolds
                                    </label>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="form-group">
                                <label>Specific tags</label>
                                <div data-element="tag-specific" class="form-control input-sm"></div>
                                <input name="specific_tags" type="hidden" />
                            </div>
                        </li>
                        <li>
                            <div class="form-group">
                                <label>Tag names</label>
                                <div data-element="tag-names" class="form-control input-sm"></div>
                                <input name="tag_names" type="hidden" />
                            </div>
                        </li>
                        <li>
                            <div class="form-group">
                                <label>Tag Categories</label>
                                <div data-element="tag-categories" class="form-control input-sm"></div>
                                <input name="tag_categories" type="hidden" />
                            </div>
                        </li>
                        <li class="divider"></li>
                        <li>
                            <span class="pull-right">
                                <span class="btn-link space-r js-clear">Clear all fields</span>
                                <button type="button" class="btn btn-primary js-apply">Apply</button>
                            </span>
                        </li>
                    </form>
                </ul>
            </div>
        </div>
    </div>
</div>