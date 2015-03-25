<button id="filter-menu" role="button"
        data-toggle="dropdown"
        data-target="#" class="btn btn-sm panel__filter">
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